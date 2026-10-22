/**
 * Web Bluetooth Wearable Heart Rate Monitor
 * Suporta Amazfit (Zepp OS), Garmin, Polar, Apple Watch, Whoop e cintas cardíacas BLE (0x180D).
 */

export class BluetoothHeartRateMonitor {
  constructor(options = {}) {
    this.device = null;
    this.server = null;
    this.characteristic = null;
    this.isConnected = false;
    this.deviceName = '';
    
    // Configurações do usuário para cálculo de calorias e zonas
    this.userProfile = {
      gender: options.gender || 'male', // 'male' | 'female'
      age: options.age || 28,
      weightKg: options.weightKg || 75,
      restingHeartRate: options.restingHeartRate || 65,
      maxHeartRate: options.maxHeartRate || Math.round(208 - (0.7 * (options.age || 28)))
    };

    // Telemetria em tempo real
    this.currentBpm = 0;
    this.currentZone = 1;
    this.totalCaloriesExpended = 0;
    this.peakBpm = 0;
    this.averageBpm = 0;
    this.samples = []; // { timestamp, bpm, zone }
    this.sessionStartTime = null;

    // Callbacks de eventos
    this.onHeartRate = options.onHeartRate || (() => {});
    this.onStatusChange = options.onStatusChange || (() => {});
    this.onError = options.onError || (() => {});
    this.onZoneAlert = options.onZoneAlert || (() => {});
  }

  /**
   * Verifica se o navegador/webview suporta Web Bluetooth
   */
  static isSupported() {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  /**
   * Atualiza os dados biométricos do usuário para os cálculos matemáticos
   */
  updateProfile(profile) {
    this.userProfile = { ...this.userProfile, ...profile };
    if (this.userProfile.age && !profile.maxHeartRate) {
      this.userProfile.maxHeartRate = Math.round(208 - (0.7 * this.userProfile.age));
    }
  }

  /**
   * Conecta ao relógio ou cinta cardíaca via Bluetooth LE
   */
  async connect() {
    if (!BluetoothHeartRateMonitor.isSupported()) {
      const err = new Error('Web Bluetooth não é suportado neste navegador. Utilize o Chrome, Edge ou o APK Android.');
      this.onError(err);
      throw err;
    }

    try {
      this.onStatusChange({ status: 'scanning', message: 'Buscando relógios e sensores BLE...' });

      // Solicita pareamento com qualquer dispositivo que anuncie o serviço padrão de Frequência Cardíaca (0x180D)
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] }
        ],
        optionalServices: ['battery_service', 'device_information']
      });

      this.deviceName = this.device.name || 'Monitor Cardíaco Bluetooth';

      this.device.addEventListener('gattserverdisconnected', () => {
        this.isConnected = false;
        this.onStatusChange({ status: 'disconnected', message: `${this.deviceName} desconectado.` });
      });

      this.onStatusChange({ status: 'connecting', message: `Conectando a ${this.deviceName}...` });

      this.server = await this.device.gatt.connect();
      const service = await this.server.getPrimaryService('heart_rate');
      this.characteristic = await service.getCharacteristic('heart_rate_measurement');

      // Assina notificações em tempo real
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', (event) => {
        this.handleHeartRateMeasurement(event.target.value);
      });

      this.isConnected = true;
      this.sessionStartTime = Date.now();
      this.onStatusChange({
        status: 'connected',
        deviceName: this.deviceName,
        message: `${this.deviceName} conectado com sucesso!`
      });

      return { success: true, deviceName: this.deviceName };
    } catch (err) {
      this.isConnected = false;
      this.onError(err);
      this.onStatusChange({ status: 'error', message: err.message });
      throw err;
    }
  }

  /**
   * Desconecta o dispositivo
   */
  disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.isConnected = false;
    this.currentBpm = 0;
    this.onStatusChange({ status: 'disconnected', message: 'Desconectado.' });
  }

  /**
   * Decodifica a especificação Bluetooth SIG (GATT Heart Rate Measurement 0x2A37)
   */
  handleHeartRateMeasurement(dataView) {
    const flags = dataView.getUint8(0);
    const is16Bit = (flags & 0x01) !== 0;
    const contactDetected = (flags & 0x06) === 0x06;

    let bpm = 0;
    let offset = 1;

    if (is16Bit) {
      bpm = dataView.getUint16(offset, true); // Little-endian
      offset += 2;
    } else {
      bpm = dataView.getUint8(offset);
      offset += 1;
    }

    if (bpm <= 0 || bpm > 240) return; // Filtro de ruído espúrio

    this.currentBpm = bpm;
    if (bpm > this.peakBpm) this.peakBpm = bpm;

    // Registra amostra
    const now = Date.now();
    this.samples.push({ timestamp: now, bpm });

    // Atualiza média
    const sum = this.samples.reduce((acc, s) => acc + s.bpm, 0);
    this.averageBpm = Math.round(sum / this.samples.length);

    // Calcula Zona Cardíaca Atual
    const zone = this.calculateZone(bpm);
    const prevZone = this.currentZone;
    this.currentZone = zone;

    // Calcula calorias gastas nesta janela usando a fórmula científica de Keytel
    this.updateCalories(bpm);

    if (prevZone !== zone) {
      this.onZoneAlert({ zone, bpm, deviceName: this.deviceName });
    }

    // Emite payload consolidado
    this.onHeartRate({
      bpm,
      zone,
      zoneName: this.getZoneName(zone),
      averageBpm: this.averageBpm,
      peakBpm: this.peakBpm,
      caloriesExpended: Math.round(this.totalCaloriesExpended),
      timestamp: now,
      contactDetected
    });
  }

  /**
   * Determina a zona cardiovascular de 1 a 5
   */
  calculateZone(bpm) {
    const { maxHeartRate, restingHeartRate } = this.userProfile;
    const hrr = maxHeartRate - restingHeartRate;
    const intensity = (bpm - restingHeartRate) / hrr;

    if (intensity < 0.60) return 1;      // < 60%
    if (intensity < 0.70) return 2;      // 60-70% (Queima de gordura / Base aeróbia)
    if (intensity < 0.80) return 3;      // 70-80% (Ritmo / Aeróbio)
    if (intensity < 0.90) return 4;      // 80-90% (Limiar Anaeróbio)
    return 5;                           // 90-100% (VO2 Max / Máximo)
  }

  getZoneName(zone) {
    const names = {
      1: 'Zona 1 (Recuperação)',
      2: 'Zona 2 (Oxidação de Gordura)',
      3: 'Zona 3 (Aeróbio / Ritmo)',
      4: 'Zona 4 (Limiar Anaeróbio)',
      5: 'Zona 5 (VO2 Máx / Sprint)'
    };
    return names[zone] || 'Zona 1';
  }

  /**
   * Fórmula de Keytel et al. (2005) para gasto calórico baseado em FC contínua
   * Journal of Sports Sciences, 23(3): 289-297
   */
  updateCalories(bpm) {
    const { gender, age, weightKg } = this.userProfile;
    
    // Calorias por minuto
    let calPerMin = 0;
    if (gender === 'female') {
      calPerMin = (-20.4022 + (0.4472 * bpm) - (0.1263 * weightKg) + (0.074 * age)) / 4.184;
    } else {
      calPerMin = (-55.0969 + (0.6309 * bpm) + (0.1988 * weightKg) + (0.2017 * age)) / 4.184;
    }

    if (calPerMin > 0) {
      // Como a amostra chega aproximadamente a cada 1 segundo (1/60 de minuto)
      this.totalCaloriesExpended += (calPerMin / 60);
    }
  }

  /**
   * Retorna sumário da sessão para anexar ao histórico do treino
   */
  getSessionSummary() {
    return {
      deviceName: this.deviceName,
      durationSeconds: this.sessionStartTime ? Math.round((Date.now() - this.sessionStartTime) / 1000) : 0,
      peakBpm: this.peakBpm,
      averageBpm: this.averageBpm,
      totalCaloriesExpended: Math.round(this.totalCaloriesExpended),
      zoneBreakdown: this.calculateZoneBreakdown()
    };
  }

  calculateZoneBreakdown() {
    const total = this.samples.length || 1;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const s of this.samples) {
      const z = this.calculateZone(s.bpm);
      counts[z] = (counts[z] || 0) + 1;
    }

    return {
      zone1Pct: Math.round((counts[1] / total) * 100),
      zone2Pct: Math.round((counts[2] / total) * 100),
      zone3Pct: Math.round((counts[3] / total) * 100),
      zone4Pct: Math.round((counts[4] / total) * 100),
      zone5Pct: Math.round((counts[5] / total) * 100)
    };
  }
}

export default BluetoothHeartRateMonitor;
