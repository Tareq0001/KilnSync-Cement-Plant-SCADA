/**
 * KILN-SYNC: Cement Plant Industrial SCADA & Electrical Telemetry Suite
 * Architectural Types & Data Contracts
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 */

export type EquipmentState = 'STOPPED' | 'STARTING' | 'RUNNING' | 'TRIPPED';

export type BreakerState = 'OPEN' | 'CLOSED' | 'TRIPPED';

export type IsoZone = 'A/B (Good: <2.8 mm/s)' | 'C (Alert: 2.8-4.5 mm/s)' | 'D (Trip: >4.5 mm/s)';

export interface WindingTemperatures {
  u1: number;
  v1: number;
  w1: number;
  u2: number;
  v2: number;
  w2: number;
}

export interface BearingTelemetry {
  deTemp: number; // Drive End °C
  ndeTemp: number; // Non-Drive End °C
  deVibeRms: number; // Drive End Vibration RMS mm/s
  ndeVibeRms: number; // Non-Drive End Vibration RMS mm/s
}

export interface ConveyorUnit {
  id: 'CV-101' | 'CV-102' | 'CV-103';
  name: string;
  role: string;
  status: EquipmentState;
  beltSwayFault: boolean; // true = tripped
  zeroSpeedHealthy: boolean; // false = slip / broken belt
  pullCordTripped: boolean; // true = emergency pull cord activated
  motorCurrentA: number;
  ratedCurrentA: number;
  beltSpeedMps: number;
  ratedSpeedMps: number;
  interlockPermissive: boolean;
}

export interface AnsiRelayStatus {
  code: string;
  ansiName: string;
  status: 'NORMAL' | 'PICKUP' | 'TRIPPED';
  description: string;
  measuredVal: string;
  threshold: string;
  tripCounter: number;
}

export interface PredictiveHealth {
  isoZone: IsoZone;
  bpfoConfidence: number; // Ball Pass Frequency Outer Race defect %
  rulHours: number; // Remaining Useful Life
  kurtosis: number;
  crestFactor: number;
  fftPeaks: { freq: number; amp: number; label: string }[];
  diagnosis: string;
  recommendation: string;
}

export type SimulatedFault = 
  | 'NONE'
  | 'MOTOR_OVERLOAD'
  | 'BELT_SWAY_CV103'
  | 'EARTH_FAULT_50N'
  | 'PULL_CORD_CV102';

export interface PlantTelemetry {
  timestamp: string;
  kilnSpeedRpm: number;
  rawMillSpeedRpm: number;
  calcinerTempC: number;
  burningZoneTempC: number;
  hoodPressureMbar: number;

  // 6.6 kV Medium Voltage Motor (2500 kW)
  motorState: EquipmentState;
  voltageL1L2: number;
  voltageL2L3: number;
  voltageL3L1: number;
  busFrequencyHz: number;
  motorCurrentA: number;
  activePowerMW: number;
  reactivePowerMVAR: number;
  powerFactor: number;
  windings: WindingTemperatures;
  bearings: BearingTelemetry;

  // Medium Voltage Switchgear (VCB)
  vcbState: BreakerState;
  springCharged: boolean;
  tripBusEnergized: boolean;

  // ANSI Relays
  relay51Overcurrent: AnsiRelayStatus;
  relay49Thermal: AnsiRelayStatus;
  relay50NEarthFault: AnsiRelayStatus;
  thermalCapacityPct: number; // 0 to 100%

  // Cascaded Material Conveyors
  conveyors: {
    cv101: ConveyorUnit;
    cv102: ConveyorUnit;
    cv103: ConveyorUnit;
  };
  sequentialCascadeLocked: boolean;

  // AI Predictive Maintenance
  predictive: PredictiveHealth;

  // Simulation Status
  activeFault: SimulatedFault;
  faultMessage: string;
  alarmActive: boolean;
  isMuted: boolean;
}
