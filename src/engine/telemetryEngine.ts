/**
 * KILN-SYNC: Cement Plant Industrial SCADA Simulation Engine
 * High-Fidelity Physics, Electrical Telemetry & Interlock State Machine
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 */

import { PlantTelemetry, SimulatedFault, IsoZone } from '../types/scada';
import { scadaAudio } from './audioAlarm';

export class TelemetryEngine {
  private telemetry: PlantTelemetry;
  private intervalId: number | null = null;
  private listeners: ((data: PlantTelemetry) => void)[] = [];
  private overloadTimerSec: number = 0;
  private tripCooldownSec: number = 0;

  constructor() {
    this.telemetry = this.getInitialTelemetry();
  }

  private getInitialTelemetry(): PlantTelemetry {
    return {
      timestamp: new Date().toLocaleTimeString(),
      kilnSpeedRpm: 3.82,
      rawMillSpeedRpm: 14.8,
      calcinerTempC: 885,
      burningZoneTempC: 1445,
      hoodPressureMbar: -0.42,

      motorState: 'RUNNING',
      voltageL1L2: 6608,
      voltageL2L3: 6598,
      voltageL3L1: 6604,
      busFrequencyHz: 50.01,
      motorCurrentA: 242.4,
      activePowerMW: 2.51,
      reactivePowerMVAR: 1.15,
      powerFactor: 0.91,

      windings: {
        u1: 94.2,
        v1: 95.8,
        w1: 93.6,
        u2: 95.1,
        v2: 96.4,
        w2: 94.7,
      },
      bearings: {
        deTemp: 68.2,
        ndeTemp: 62.5,
        deVibeRms: 1.62,
        ndeVibeRms: 1.38,
      },

      vcbState: 'CLOSED',
      springCharged: true,
      tripBusEnergized: false,

      relay51Overcurrent: {
        code: '51',
        ansiName: 'Phase Time Overcurrent (IDMT)',
        status: 'NORMAL',
        description: 'IEC Standard Inverse Curve (TMS = 0.25, Is = 280A)',
        measuredVal: '242.4 A (0.87 In)',
        threshold: 'Pickup: 280.0 A',
        tripCounter: 0,
      },
      relay49Thermal: {
        code: '49',
        ansiName: 'Machine Thermal Overload',
        status: 'NORMAL',
        description: 'Bimetallic/I²t Stator Heating Model',
        measuredVal: '58.4 %',
        threshold: 'Alarm 85% / Trip 100%',
        tripCounter: 0,
      },
      relay50NEarthFault: {
        code: '50N',
        ansiName: 'Instantaneous Earth Fault',
        status: 'NORMAL',
        description: 'Core Balance CT (50/1A), Definite Time 40ms',
        measuredVal: '1.2 A',
        threshold: 'Pickup: 15.0 A',
        tripCounter: 0,
      },
      thermalCapacityPct: 58.4,

      conveyors: {
        cv101: {
          id: 'CV-101',
          name: 'Primary Crusher Discharge Conveyor',
          role: 'Extracts crushed limestone (0-80mm) from primary jaw crusher',
          status: 'RUNNING',
          beltSwayFault: false,
          zeroSpeedHealthy: true,
          pullCordTripped: false,
          motorCurrentA: 38.6,
          ratedCurrentA: 55.0,
          beltSpeedMps: 2.2,
          ratedSpeedMps: 2.2,
          interlockPermissive: true,
        },
        cv102: {
          id: 'CV-102',
          name: 'Intermediate Overland Transfer Conveyor',
          role: 'Transports raw feed across 280m overland gallery',
          status: 'RUNNING',
          beltSwayFault: false,
          zeroSpeedHealthy: true,
          pullCordTripped: false,
          motorCurrentA: 64.2,
          ratedCurrentA: 85.0,
          beltSpeedMps: 2.4,
          ratedSpeedMps: 2.4,
          interlockPermissive: true,
        },
        cv103: {
          id: 'CV-103',
          name: 'Raw Mill Feed & Clinker Surge Conveyor',
          role: 'Feeds raw proportioning silo & ball mill inlet chute',
          status: 'RUNNING',
          beltSwayFault: false,
          zeroSpeedHealthy: true,
          pullCordTripped: false,
          motorCurrentA: 78.5,
          ratedCurrentA: 110.0,
          beltSpeedMps: 2.5,
          ratedSpeedMps: 2.5,
          interlockPermissive: true,
        },
      },
      sequentialCascadeLocked: false,

      predictive: {
        isoZone: 'A/B (Good: <2.8 mm/s)',
        bpfoConfidence: 7.2,
        rulHours: 8420,
        kurtosis: 3.08,
        crestFactor: 2.85,
        fftPeaks: [
          { freq: 16.5, amp: 0.85, label: '1X Running Speed' },
          { freq: 33.0, amp: 0.32, label: '2X Harmonic' },
          { freq: 104.2, amp: 0.12, label: 'BPFO Outer Race' },
          { freq: 148.6, amp: 0.08, label: 'BPFI Inner Race' },
        ],
        diagnosis: 'Optimum hydrodynamic lubrication film. Mechanical balance within ISO G2.5 standard.',
        recommendation: 'Nominal condition. Routine vibration spectral sweep in 30 days.',
      },

      activeFault: 'NONE',
      faultMessage: 'SYSTEM HEALTHY - ALL PROCESS LOOPS BALANCED',
      alarmActive: false,
      isMuted: false,
    };
  }

  public start() {
    if (this.intervalId !== null) return;
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public subscribe(fn: (data: PlantTelemetry) => void) {
    this.listeners.push(fn);
    fn(this.telemetry);
  }

  public unsubscribe(fn: (data: PlantTelemetry) => void) {
    this.listeners = this.listeners.filter(l => l !== fn);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.telemetry);
    }
  }

  public getTelemetry(): PlantTelemetry {
    return this.telemetry;
  }

  private gaussianNoise(mean: number, stdev: number): number {
    const u1 = Math.max(1e-6, Math.random());
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdev;
  }

  /**
   * Main 1-second simulation clock cycle
   */
  private tick() {
    this.telemetry.timestamp = new Date().toLocaleTimeString();
    this.telemetry.isMuted = scadaAudio.getMuted();

    // 1. Grid Voltage & Frequency slight natural breathing
    this.telemetry.voltageL1L2 = Math.round(this.gaussianNoise(6600, 10));
    this.telemetry.voltageL2L3 = Math.round(this.gaussianNoise(6602, 10));
    this.telemetry.voltageL3L1 = Math.round(this.gaussianNoise(6598, 10));
    this.telemetry.busFrequencyHz = parseFloat(this.gaussianNoise(50.00, 0.02).toFixed(2));

    // Handle Active Fault Physics
    switch (this.telemetry.activeFault) {
      case 'MOTOR_OVERLOAD':
        this.processMotorOverload();
        break;
      case 'BELT_SWAY_CV103':
        this.processBeltSway();
        break;
      case 'EARTH_FAULT_50N':
        this.processEarthFault();
        break;
      case 'PULL_CORD_CV102':
        this.processPullCord();
        break;
      case 'NONE':
      default:
        this.processHealthyState();
        break;
    }

    this.notify();
  }

  private processHealthyState() {
    if (this.telemetry.vcbState === 'CLOSED' && this.telemetry.motorState === 'RUNNING') {
      // Nominal Kiln Motor
      this.telemetry.motorCurrentA = parseFloat(this.gaussianNoise(242.0, 2.5).toFixed(1));
      this.telemetry.powerFactor = parseFloat(this.gaussianNoise(0.91, 0.005).toFixed(2));
      
      // Calculate Active & Reactive Power: P = sqrt(3) * V * I * PF / 1000 (MW)
      const avgV = (this.telemetry.voltageL1L2 + this.telemetry.voltageL2L3 + this.telemetry.voltageL3L1) / 3;
      const pMW = (Math.sqrt(3) * avgV * this.telemetry.motorCurrentA * this.telemetry.powerFactor) / 1000000;
      this.telemetry.activePowerMW = parseFloat(pMW.toFixed(2));
      const qMVAR = pMW * Math.tan(Math.acos(this.telemetry.powerFactor));
      this.telemetry.reactivePowerMVAR = parseFloat(qMVAR.toFixed(2));

      // Kiln mechanical dynamics
      this.telemetry.kilnSpeedRpm = parseFloat(this.gaussianNoise(3.82, 0.03).toFixed(2));
      this.telemetry.calcinerTempC = Math.round(this.gaussianNoise(885, 3));
      this.telemetry.burningZoneTempC = Math.round(this.gaussianNoise(1445, 6));
      this.telemetry.hoodPressureMbar = parseFloat(this.gaussianNoise(-0.42, 0.04).toFixed(2));

      // Windings thermal equilibrium ~94-96°C
      this.telemetry.windings.u1 = parseFloat(this.gaussianNoise(94.2, 0.4).toFixed(1));
      this.telemetry.windings.v1 = parseFloat(this.gaussianNoise(95.8, 0.4).toFixed(1));
      this.telemetry.windings.w1 = parseFloat(this.gaussianNoise(93.6, 0.4).toFixed(1));
      this.telemetry.windings.u2 = parseFloat(this.gaussianNoise(95.1, 0.4).toFixed(1));
      this.telemetry.windings.v2 = parseFloat(this.gaussianNoise(96.4, 0.4).toFixed(1));
      this.telemetry.windings.w2 = parseFloat(this.gaussianNoise(94.7, 0.4).toFixed(1));

      // Bearings vibration & temp
      this.telemetry.bearings.deTemp = parseFloat(this.gaussianNoise(68.2, 0.3).toFixed(1));
      this.telemetry.bearings.ndeTemp = parseFloat(this.gaussianNoise(62.5, 0.3).toFixed(1));
      this.telemetry.bearings.deVibeRms = parseFloat(this.gaussianNoise(1.65, 0.08).toFixed(2));
      this.telemetry.bearings.ndeVibeRms = parseFloat(this.gaussianNoise(1.38, 0.06).toFixed(2));

      // Thermal capacity equilibrium
      this.telemetry.thermalCapacityPct = parseFloat(this.gaussianNoise(58.4, 0.5).toFixed(1));
      this.telemetry.relay49Thermal.measuredVal = `${this.telemetry.thermalCapacityPct} %`;

      // Relays Normal
      this.telemetry.relay51Overcurrent.status = 'NORMAL';
      this.telemetry.relay51Overcurrent.measuredVal = `${this.telemetry.motorCurrentA} A (0.86 In)`;
      this.telemetry.relay50NEarthFault.status = 'NORMAL';
      this.telemetry.relay50NEarthFault.measuredVal = '1.2 A';

      // Predictive healthy
      this.telemetry.predictive.isoZone = 'A/B (Good: <2.8 mm/s)';
      this.telemetry.predictive.bpfoConfidence = parseFloat(this.gaussianNoise(6.8, 0.5).toFixed(1));
      this.telemetry.predictive.kurtosis = parseFloat(this.gaussianNoise(3.08, 0.05).toFixed(2));
      this.telemetry.predictive.crestFactor = parseFloat(this.gaussianNoise(2.85, 0.05).toFixed(2));
      this.telemetry.predictive.rulHours = 8420;
      this.telemetry.predictive.diagnosis = 'Optimum hydrodynamic lubrication film. ISO G2.5 mechanical balance compliant.';
      this.telemetry.predictive.recommendation = 'Continuous operation approved. Spectral baseline stable.';
    } else {
      // Stopped / Tripped state decay
      this.telemetry.motorCurrentA = 0;
      this.telemetry.activePowerMW = 0;
      this.telemetry.reactivePowerMVAR = 0;
      this.telemetry.kilnSpeedRpm = Math.max(0, parseFloat((this.telemetry.kilnSpeedRpm * 0.75).toFixed(2)));
      this.telemetry.bearings.deVibeRms = 0.12;
      this.telemetry.bearings.ndeVibeRms = 0.09;
    }
  }

  private processMotorOverload() {
    this.overloadTimerSec++;

    // High current draw: 386 A (1.38 x Rated Current)
    this.telemetry.motorCurrentA = parseFloat(this.gaussianNoise(386.0, 3.0).toFixed(1));
    this.telemetry.activePowerMW = 3.82;
    this.telemetry.powerFactor = 0.86;

    // ANSI 51 Time Overcurrent in PICKUP
    this.telemetry.relay51Overcurrent.status = 'PICKUP';
    this.telemetry.relay51Overcurrent.measuredVal = `${this.telemetry.motorCurrentA} A (1.38 In - TIMING)`;

    // ANSI 49 Thermal Capacity Fast Accumulation (I²t)
    this.telemetry.thermalCapacityPct = Math.min(100, parseFloat((this.telemetry.thermalCapacityPct + 8.5).toFixed(1)));
    this.telemetry.relay49Thermal.measuredVal = `${this.telemetry.thermalCapacityPct} %`;

    if (this.telemetry.thermalCapacityPct > 85 && this.telemetry.relay49Thermal.status !== 'TRIPPED') {
      this.telemetry.relay49Thermal.status = 'PICKUP';
    }

    // Winding temperatures soaring
    this.telemetry.windings.u1 += 4.5;
    this.telemetry.windings.v1 += 4.8;
    this.telemetry.windings.w1 += 4.6;
    this.telemetry.windings.u2 += 4.4;
    this.telemetry.windings.v2 += 4.9;
    this.telemetry.windings.w2 += 4.5;

    // Bearing Vibration starts rising due to thermal distortion
    this.telemetry.bearings.deVibeRms = 3.65;
    this.telemetry.bearings.ndeVibeRms = 3.12;
    this.telemetry.predictive.isoZone = 'C (Alert: 2.8-4.5 mm/s)';

    // IDMT Curve Trip Trigger after 4 seconds
    if (this.overloadTimerSec >= 4 || this.telemetry.thermalCapacityPct >= 100) {
      this.telemetry.relay51Overcurrent.status = 'TRIPPED';
      this.telemetry.relay51Overcurrent.tripCounter++;
      this.telemetry.relay49Thermal.status = 'TRIPPED';
      this.telemetry.relay49Thermal.tripCounter++;

      this.executeBreakerTrip('ANSI 51/49 OVERLOAD TRIP: Stator Current 386A (1.38x In) exceeded IDMT curve');
    }
  }

  private processBeltSway() {
    // CV-103 Belt Sway limit switch operated
    this.telemetry.conveyors.cv103.beltSwayFault = true;
    this.telemetry.conveyors.cv103.status = 'TRIPPED';
    this.telemetry.conveyors.cv103.motorCurrentA = 0;
    this.telemetry.conveyors.cv103.beltSpeedMps = 0;

    // Sequential Interlock Logic Execution:
    // If CV-103 is down, CV-102 CANNOT discharge into it!
    this.telemetry.conveyors.cv102.status = 'TRIPPED';
    this.telemetry.conveyors.cv102.interlockPermissive = false;
    this.telemetry.conveyors.cv102.motorCurrentA = 0;
    this.telemetry.conveyors.cv102.beltSpeedMps = 0;

    // In cascade, CV-101 CANNOT discharge into CV-102!
    this.telemetry.conveyors.cv101.status = 'TRIPPED';
    this.telemetry.conveyors.cv101.interlockPermissive = false;
    this.telemetry.conveyors.cv101.motorCurrentA = 0;
    this.telemetry.conveyors.cv101.beltSpeedMps = 0;

    this.telemetry.sequentialCascadeLocked = true;
    this.telemetry.alarmActive = true;
    this.telemetry.faultMessage = 'CASCADE INTERLOCK TRIP: CV-103 Belt Sway Fault -> Cascaded Emergency Stop of CV-102 & CV-101 (Spill Prevention Active)';
    scadaAudio.startTripAlarm();
  }

  private processEarthFault() {
    // Instantaneous Ground fault I0 = 42 A (Pickup 15 A)
    this.telemetry.relay50NEarthFault.status = 'TRIPPED';
    this.telemetry.relay50NEarthFault.measuredVal = '42.8 A (Zero Sequence Core CT)';
    this.telemetry.relay50NEarthFault.tripCounter++;

    this.executeBreakerTrip('ANSI 50N INSTANTANEOUS EARTH FAULT TRIP: Residual current 42.8A cleared in 40ms');
  }

  private processPullCord() {
    // CV-102 Pull-Cord safety trip wire pulled
    this.telemetry.conveyors.cv102.pullCordTripped = true;
    this.telemetry.conveyors.cv102.status = 'TRIPPED';
    this.telemetry.conveyors.cv102.motorCurrentA = 0;
    this.telemetry.conveyors.cv102.beltSpeedMps = 0;

    // Upstream feeder CV-101 must immediately halt to avoid chute blockage
    this.telemetry.conveyors.cv101.status = 'TRIPPED';
    this.telemetry.conveyors.cv101.interlockPermissive = false;
    this.telemetry.conveyors.cv101.motorCurrentA = 0;
    this.telemetry.conveyors.cv101.beltSpeedMps = 0;

    this.telemetry.sequentialCascadeLocked = true;
    this.telemetry.alarmActive = true;
    this.telemetry.faultMessage = 'SAFETY INTERLOCK TRIP: CV-102 Emergency Pull-Cord Activated -> Immediate Halt of Feeder CV-101';
    scadaAudio.startTripAlarm();
  }

  private executeBreakerTrip(reason: string) {
    this.telemetry.vcbState = 'TRIPPED';
    this.telemetry.motorState = 'TRIPPED';
    this.telemetry.tripBusEnergized = true;
    this.telemetry.motorCurrentA = 0;
    this.telemetry.activePowerMW = 0;
    this.telemetry.reactivePowerMVAR = 0;
    this.telemetry.alarmActive = true;
    this.telemetry.faultMessage = reason;

    // Predictive impact
    this.telemetry.predictive.isoZone = 'D (Trip: >4.5 mm/s)';
    this.telemetry.predictive.rulHours = Math.max(120, this.telemetry.predictive.rulHours - 180);
    this.telemetry.predictive.bpfoConfidence = 89.4;
    this.telemetry.predictive.diagnosis = 'CRITICAL TRIP EXECUTED. Excessive electrical/mechanical shock logged in event SOE recorder.';
    this.telemetry.predictive.recommendation = 'Perform insulation resistance (Megger 5kV) and inspect stator end-windings before reclosing.';

    scadaAudio.playBreakerOperation(false);
    scadaAudio.startTripAlarm();
  }

  // --- Public API for Interview Fault Panel ---

  public injectFault(fault: SimulatedFault) {
    this.telemetry.activeFault = fault;
    this.overloadTimerSec = 0;
    scadaAudio.playClick();

    switch (fault) {
      case 'MOTOR_OVERLOAD':
        this.telemetry.faultMessage = 'FAULT INJECTED: 3-Phase Mechanical Stator Overload (Simulating ball mill charge jamming)';
        scadaAudio.playWarningChime();
        break;
      case 'BELT_SWAY_CV103':
        this.processBeltSway();
        break;
      case 'EARTH_FAULT_50N':
        this.processEarthFault();
        break;
      case 'PULL_CORD_CV102':
        this.processPullCord();
        break;
      case 'NONE':
        this.resetSystem();
        break;
    }
    this.notify();
  }

  public resetSystem() {
    scadaAudio.playClick();
    scadaAudio.stopAlarm();

    this.telemetry.activeFault = 'NONE';
    this.telemetry.alarmActive = false;
    this.telemetry.faultMessage = 'SYSTEM RE-INITIALIZING: Sequential Start Permissive Sequence Engaged';
    this.overloadTimerSec = 0;

    // Reset Relays
    this.telemetry.relay51Overcurrent.status = 'NORMAL';
    this.telemetry.relay49Thermal.status = 'NORMAL';
    this.telemetry.relay50NEarthFault.status = 'NORMAL';
    this.telemetry.tripBusEnergized = false;
    this.telemetry.thermalCapacityPct = 52.0;

    // Reset Conveyor Safeties
    this.telemetry.conveyors.cv103.beltSwayFault = false;
    this.telemetry.conveyors.cv102.pullCordTripped = false;
    this.telemetry.conveyors.cv101.beltSwayFault = false;
    this.telemetry.sequentialCascadeLocked = false;

    // Re-sequence startup in proper reverse order:
    // 1. CV-103 starts first (destination silo)
    this.telemetry.conveyors.cv103.status = 'RUNNING';
    this.telemetry.conveyors.cv103.interlockPermissive = true;
    this.telemetry.conveyors.cv103.motorCurrentA = 78.5;
    this.telemetry.conveyors.cv103.beltSpeedMps = 2.5;

    // 2. CV-102 starts next
    this.telemetry.conveyors.cv102.status = 'RUNNING';
    this.telemetry.conveyors.cv102.interlockPermissive = true;
    this.telemetry.conveyors.cv102.motorCurrentA = 64.2;
    this.telemetry.conveyors.cv102.beltSpeedMps = 2.4;

    // 3. CV-101 starts last (quarry crusher discharge)
    this.telemetry.conveyors.cv101.status = 'RUNNING';
    this.telemetry.conveyors.cv101.interlockPermissive = true;
    this.telemetry.conveyors.cv101.motorCurrentA = 38.6;
    this.telemetry.conveyors.cv101.beltSpeedMps = 2.2;

    // Reclose VCB Breaker
    scadaAudio.playBreakerOperation(true);
    this.telemetry.vcbState = 'CLOSED';
    this.telemetry.motorState = 'RUNNING';
    this.telemetry.kilnSpeedRpm = 3.82;

    this.telemetry.faultMessage = 'SYSTEM HEALTHY - ALL PROCESS LOOPS BALANCED & INTERLOCKS CLEAR';
    this.processHealthyState();
    this.notify();
  }

  public toggleMute(): boolean {
    const isMuted = scadaAudio.toggleMute();
    this.telemetry.isMuted = isMuted;
    this.notify();
    return isMuted;
  }
}

export const telemetryEngine = new TelemetryEngine();
