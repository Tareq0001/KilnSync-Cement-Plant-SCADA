/**
 * KILN-SYNC: Cement Plant Industrial SCADA & Electrical Telemetry Suite
 * Application Entrypoint & System Orchestrator
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 */

import './style.css';
import { telemetryEngine } from './engine/telemetryEngine';
import { PlantTelemetry } from './types/scada';
import { KilnGraphic } from './components/KilnGraphic';
import { SldDiagram } from './components/SldDiagram';
import { VibrationChart } from './components/VibrationChart';
import { DossierModal } from './components/DossierModal';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Subcomponents
  const kilnGraphicContainer = document.getElementById('kiln-graphic-container');
  const sldContainer = document.getElementById('sld-container');
  const vibeChartContainer = document.getElementById('vibe-chart-container');

  if (!kilnGraphicContainer || !sldContainer || !vibeChartContainer) {
    console.error('Critical SCADA containers missing from DOM');
    return;
  }

  const kilnGraphic = new KilnGraphic(kilnGraphicContainer);
  const sldDiagram = new SldDiagram(sldContainer);
  const vibrationChart = new VibrationChart(vibeChartContainer);
  const dossierModal = new DossierModal();

  // 2. SOE Event Logger
  const soeLogBox = document.getElementById('soe-log-box');
  const soeCountEl = document.getElementById('soe-event-count');
  let eventCount = 3;

  function appendSoeLog(msg: string, isAlert: boolean = false) {
    if (!soeLogBox) return;
    eventCount++;
    if (soeCountEl) soeCountEl.textContent = `${eventCount} EVENTS LOGGED`;

    const timeStr = new Date().toLocaleTimeString();
    const row = document.createElement('div');
    if (isAlert) {
      row.className = 'text-red font-bold';
      row.innerHTML = `[${timeStr}] ⚠️ ${msg}`;
    } else {
      row.innerHTML = `[${timeStr}] ℹ️ ${msg}`;
    }
    soeLogBox.appendChild(row);
    soeLogBox.scrollTop = soeLogBox.scrollHeight;
  }

  // 3. UI Controls Event Listeners
  const btnDossier = document.getElementById('btn-open-dossier');
  if (btnDossier) {
    btnDossier.addEventListener('click', () => dossierModal.show());
  }

  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const audioText = document.getElementById('audio-text');
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      const isMuted = telemetryEngine.toggleMute();
      if (audioIcon && audioText) {
        if (isMuted) {
          audioIcon.className = 'fa-solid fa-volume-xmark';
          audioText.textContent = 'Audio: Muted';
        } else {
          audioIcon.className = 'fa-solid fa-volume-high';
          audioText.textContent = 'Audio: Active';
        }
      }
    });
  }

  // Fault Injection Buttons
  const btnOverload = document.getElementById('btn-fault-overload');
  if (btnOverload) {
    btnOverload.addEventListener('click', () => {
      telemetryEngine.injectFault('MOTOR_OVERLOAD');
      appendSoeLog('FAULT INJECTION: 3-Phase Stator Overload current injected (386A). ANSI 51 timing started.', true);
    });
  }

  const btnSway = document.getElementById('btn-fault-sway');
  if (btnSway) {
    btnSway.addEventListener('click', () => {
      telemetryEngine.injectFault('BELT_SWAY_CV103');
      appendSoeLog('INTERLOCK FAULT: CV-103 Belt Sway limit switch triggered. Cascaded emergency trip of CV-102 & CV-101.', true);
    });
  }

  const btnEarth = document.getElementById('btn-fault-earth');
  if (btnEarth) {
    btnEarth.addEventListener('click', () => {
      telemetryEngine.injectFault('EARTH_FAULT_50N');
      appendSoeLog('ANSI 50N FAULT: Stator residual current I₀ = 42.8A. Instantaneous VCB trip executed in 40ms.', true);
    });
  }

  const btnPullcord = document.getElementById('btn-fault-pullcord');
  if (btnPullcord) {
    btnPullcord.addEventListener('click', () => {
      telemetryEngine.injectFault('PULL_CORD_CV102');
      appendSoeLog('SAFETY TRIP: CV-102 emergency pull-cord switch tripped. Immediate halt of feeder CV-101.', true);
    });
  }

  const btnReset = document.getElementById('btn-fault-reset');
  const btnQuickReset = document.getElementById('btn-quick-reset');
  const handleReset = () => {
    telemetryEngine.resetSystem();
    appendSoeLog('SYSTEM RESTART: Permissive interlock sequence verified (CV-103 -> CV-102 -> CV-101). VCB closed.');
  };
  if (btnReset) btnReset.addEventListener('click', handleReset);
  if (btnQuickReset) btnQuickReset.addEventListener('click', handleReset);

  // 4. Main Telemetry Subscription Loop
  telemetryEngine.subscribe((data: PlantTelemetry) => {
    // A. Header Telemetry
    const gridFreq = document.getElementById('header-grid-freq');
    if (gridFreq) gridFreq.textContent = `${data.busFrequencyHz.toFixed(2)} Hz`;

    const busVolts = document.getElementById('header-bus-volts');
    if (busVolts) busVolts.textContent = `${data.voltageL1L2.toLocaleString()} V`;

    const clockEl = document.getElementById('header-clock');
    if (clockEl) clockEl.textContent = data.timestamp;

    // B. Master Alarm Banner
    const alarmBanner = document.getElementById('master-alarm-banner');
    const alarmBadge = document.getElementById('alarm-badge-status');
    const alarmMsg = document.getElementById('alarm-banner-message');
    const soeTimestamp = document.getElementById('soe-timestamp');

    if (alarmBanner && alarmBadge && alarmMsg && soeTimestamp) {
      soeTimestamp.textContent = `${data.timestamp}.${Math.floor(Math.random() * 900 + 100)}`;
      alarmMsg.textContent = data.faultMessage;

      if (data.alarmActive) {
        alarmBanner.className = 'alarm-banner active-alarm';
        alarmBadge.className = 'alarm-badge fault';
        alarmBadge.textContent = 'TRIP / ALARM';
      } else {
        alarmBanner.className = 'alarm-banner';
        alarmBadge.className = 'alarm-badge healthy';
        alarmBadge.textContent = 'NORMAL';
      }
    }

    // C. Motor 2500 kW Telemetry
    const motorStatusPill = document.getElementById('motor-dash-status');
    if (motorStatusPill) {
      if (data.motorState === 'RUNNING') {
        motorStatusPill.className = 'status-pill status-running';
        motorStatusPill.textContent = 'RUNNING';
      } else if (data.motorState === 'TRIPPED') {
        motorStatusPill.className = 'status-pill status-tripped';
        motorStatusPill.textContent = 'TRIPPED';
      } else {
        motorStatusPill.className = 'status-pill status-stopped';
        motorStatusPill.textContent = 'STOPPED';
      }
    }

    const currentVal = document.getElementById('motor-current-val');
    const currentBar = document.getElementById('motor-current-bar');
    if (currentVal && currentBar) {
      currentVal.innerHTML = `${data.motorCurrentA.toFixed(1)} <span class="readout-unit">A</span>`;
      const pct = Math.min(100, (data.motorCurrentA / 350) * 100);
      currentBar.style.width = `${pct}%`;
      if (data.motorCurrentA > 280) {
        currentBar.style.backgroundColor = 'var(--red-tripped)';
      } else {
        currentBar.style.backgroundColor = 'var(--cyan-primary)';
      }
    }

    const pfVal = document.getElementById('motor-pf-val');
    if (pfVal) pfVal.textContent = `Cos φ: ${data.powerFactor.toFixed(2)}`;

    const powerVal = document.getElementById('motor-power-val');
    const qVal = document.getElementById('motor-q-val');
    if (powerVal && qVal) {
      powerVal.innerHTML = `${data.activePowerMW.toFixed(2)} <span class="readout-unit">MW</span>`;
      qVal.textContent = `${data.reactivePowerMVAR.toFixed(2)} MVAR`;
    }

    // RTDs U1..W2
    const updateTile = (id: string, temp: number) => {
      const el = document.getElementById(id);
      const tile = el?.parentElement;
      if (el && tile) {
        el.textContent = `${temp.toFixed(1)} °C`;
        if (temp > 135) {
          tile.className = 'rtd-tile rtd-trip';
        } else if (temp > 120) {
          tile.className = 'rtd-tile rtd-warn';
        } else {
          tile.className = 'rtd-tile';
        }
      }
    };
    updateTile('temp-u1', data.windings.u1);
    updateTile('temp-v1', data.windings.v1);
    updateTile('temp-w1', data.windings.w1);
    updateTile('temp-u2', data.windings.u2);
    updateTile('temp-v2', data.windings.v2);
    updateTile('temp-w2', data.windings.w2);

    const tempDe = document.getElementById('temp-de-bearing');
    if (tempDe) tempDe.textContent = `${data.bearings.deTemp.toFixed(1)} °C`;
    const tempNde = document.getElementById('temp-nde-bearing');
    if (tempNde) tempNde.textContent = `${data.bearings.ndeTemp.toFixed(1)} °C`;

    // D. Conveyor Cascade Section
    const updateConveyorBox = (
      id: 'cv101' | 'cv102' | 'cv103', 
      boxId: string, 
      pillId: string, 
      currentId: string, 
      speedId: string, 
      swayLedId: string, 
      zeroSpeedLedId: string, 
      pullCordLedId: string
    ) => {
      const conv = data.conveyors[id];
      const box = document.getElementById(boxId);
      const pill = document.getElementById(pillId);
      const current = document.getElementById(currentId);
      const speed = document.getElementById(speedId);
      const sway = document.getElementById(swayLedId);
      const zero = document.getElementById(zeroSpeedLedId);
      const pull = document.getElementById(pullCordLedId);

      if (box && pill && current && speed && sway && zero && pull) {
        current.textContent = `${conv.motorCurrentA.toFixed(1)} A`;
        speed.textContent = `${conv.beltSpeedMps.toFixed(1)} m/s`;

        if (conv.status === 'RUNNING') {
          box.className = 'conveyor-box box-running';
          pill.className = 'status-pill status-running';
          pill.textContent = 'RUNNING';
        } else {
          box.className = 'conveyor-box box-tripped';
          pill.className = 'status-pill status-tripped';
          pill.textContent = 'TRIPPED';
        }

        // Sway LED
        sway.className = conv.beltSwayFault ? 'led-dot led-red' : 'led-dot led-green';
        // Zero Speed LED
        zero.className = conv.zeroSpeedHealthy ? 'led-dot led-green' : 'led-dot led-red';
        // Pull Cord LED
        pull.className = conv.pullCordTripped ? 'led-dot led-red' : 'led-dot led-green';
      }
    };

    updateConveyorBox('cv101', 'box-cv101', 'pill-cv101', 'cv101-current', 'cv101-speed', 'led-sway-cv101', 'led-zerospeed-cv101', 'led-pullcord-cv101');
    updateConveyorBox('cv102', 'box-cv102', 'pill-cv102', 'cv102-current', 'cv102-speed', 'led-sway-cv102', 'led-zerospeed-cv102', 'led-pullcord-cv102');
    updateConveyorBox('cv103', 'box-cv103', 'pill-cv103', 'cv103-current', 'cv103-speed', 'led-sway-cv103', 'led-zerospeed-cv103', 'led-pullcord-cv103');

    // Cascade status pill & chain nodes
    const cascadePill = document.getElementById('cascade-status-pill');
    const node103 = document.getElementById('chain-node-103');
    const node102 = document.getElementById('chain-node-102');
    const node101 = document.getElementById('chain-node-101');

    if (cascadePill && node103 && node102 && node101) {
      if (data.sequentialCascadeLocked) {
        cascadePill.className = 'status-pill status-tripped';
        cascadePill.textContent = 'CASCADE INTERLOCK TRIP';
      } else {
        cascadePill.className = 'status-pill status-running';
        cascadePill.textContent = 'CASCADE HEALTHY';
      }

      node103.className = data.conveyors.cv103.status === 'RUNNING' ? 'chain-node active' : 'chain-node tripped';
      node102.className = data.conveyors.cv102.status === 'RUNNING' ? 'chain-node active' : 'chain-node tripped';
      node101.className = data.conveyors.cv101.status === 'RUNNING' ? 'chain-node active' : 'chain-node tripped';
    }

    // E. Subcomponents Dynamic Render
    kilnGraphic.update(data);
    sldDiagram.update(data);
    vibrationChart.update(data);
  });

  // 5. Start Telemetry Simulation Engine
  telemetryEngine.start();
});
