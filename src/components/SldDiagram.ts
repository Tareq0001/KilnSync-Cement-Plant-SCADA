/**
 * KILN-SYNC: Cement Plant Industrial SCADA
 * 6.6 kV Substation & Switchgear Single Line Diagram (SLD)
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 */

import { PlantTelemetry } from '../types/scada';

export class SldDiagram {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  public render() {
    this.container.innerHTML = `
      <div class="sld-card">
        <div class="sld-header">
          <div class="sld-title-group">
            <span class="badge-tag tag-cyan">ELECTRICAL SLD</span>
            <h4 class="sld-title">6.6 kV Substation Feeder & ANSI Protection Topology</h4>
          </div>
          <div class="vcb-badge-group">
            <span class="vcb-status-indicator" id="vcb-status-badge">
              <span class="led-dot led-green"></span>
              <span id="vcb-badge-text">VCB: CLOSED (IN SERVICE)</span>
            </span>
          </div>
        </div>

        <div class="sld-svg-container">
          <svg viewBox="0 0 680 400" class="sld-svg" id="sld-svg-element" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="busGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Grid backdrop -->
            <g class="sld-grid" opacity="0.12">
              <line x1="40" y1="0" x2="40" y2="400" stroke="#0ea5e9" stroke-dasharray="3,3" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="#0ea5e9" stroke-dasharray="3,3" />
              <line x1="360" y1="0" x2="360" y2="400" stroke="#0ea5e9" stroke-dasharray="3,3" />
              <line x1="520" y1="0" x2="520" y2="400" stroke="#0ea5e9" stroke-dasharray="3,3" />
            </g>

            <!-- 6.6 kV MAIN BUSBAR A -->
            <g id="main-busbar">
              <line x1="60" y1="45" x2="620" y2="45" stroke="#06b6d4" stroke-width="7" filter="url(#busGlow)" id="busbar-line" />
              <text x="70" y="32" fill="#22d3ee" font-size="11" font-weight="bold" font-family="monospace">MAIN BUSBAR 6.6 kV - 50 Hz (31.5 kA 3s)</text>
              <text x="560" y="32" fill="#38bdf8" font-size="10" font-family="monospace" id="bus-freq-disp">50.01 Hz</text>
            </g>

            <!-- Upstream Incomer Link from 25 MVA Power Transformer -->
            <line x1="160" y1="0" x2="160" y2="45" stroke="#06b6d4" stroke-width="4" />
            <text x="170" y="16" fill="#94a3b8" font-size="9" font-family="sans-serif">TR-01 (132/6.6kV)</text>

            <!-- FEEDER CELL 04: KILN MOTOR 2500 kW -->
            <g id="feeder-cell-04" transform="translate(0, 0)">
              <!-- Feeder Drop from Busbar -->
              <line x1="340" y1="45" x2="340" y2="90" stroke="#06b6d4" stroke-width="4" id="feeder-upper-line" />

              <!-- Disconnector Switch DS-04 -->
              <g id="disconnector-switch" transform="translate(340, 95)">
                <circle cx="0" cy="0" r="4" fill="#06b6d4" />
                <line x1="0" y1="0" x2="0" y2="25" stroke="#06b6d4" stroke-width="3" />
                <circle cx="0" cy="25" r="4" fill="#06b6d4" />
                <text x="12" y="16" fill="#94a3b8" font-size="9" font-family="monospace">DS-04 (CLOSED)</text>
              </g>

              <!-- Line from DS to VCB -->
              <line x1="340" y1="120" x2="340" y2="150" stroke="#06b6d4" stroke-width="4" id="line-ds-to-vcb" />

              <!-- VACUUM CIRCUIT BREAKER (VCB-04) CUBICLE -->
              <rect x="260" y="150" width="160" height="90" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" rx="4" />
              <text x="270" y="168" fill="#38bdf8" font-size="10" font-weight="bold" font-family="sans-serif">VCB-04 CUBICLE</text>
              <text x="270" y="180" fill="#64748b" font-size="8" font-family="monospace">1250A / 31.5kA</text>

              <!-- Mechanical Breaker Contact -->
              <g id="vcb-breaker-contact" transform="translate(340, 195)">
                <circle cx="0" cy="-22" r="5" fill="#e2e8f0" />
                <circle cx="0" cy="22" r="5" fill="#e2e8f0" />
                <!-- Contact Bar (Dynamic) -->
                <line id="vcb-contact-bar" x1="0" y1="-22" x2="0" y2="22" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
              </g>

              <!-- Line from VCB to CTs -->
              <line x1="340" y1="240" x2="340" y2="280" stroke="#06b6d4" stroke-width="4" id="feeder-lower-line" />

              <!-- Current Transformer (CT 400/5A) & Zero-Sequence CT -->
              <g id="ct-instrumentation" transform="translate(340, 275)">
                <!-- 3-Phase CT Circles -->
                <circle cx="-10" cy="0" r="12" fill="none" stroke="#f59e0b" stroke-width="2" />
                <circle cx="10" cy="0" r="12" fill="none" stroke="#f59e0b" stroke-width="2" />
                <text x="28" y="4" fill="#fbbf24" font-size="9" font-family="monospace">CT: 400/5A Cl 5P20</text>

                <!-- Core Balance CT (50N) Ring -->
                <ellipse cx="0" cy="28" rx="20" ry="8" fill="none" stroke="#ef4444" stroke-width="2" />
                <text x="28" y="32" fill="#f87171" font-size="9" font-family="monospace">CBCT (50N): 50/1A</text>
              </g>

              <!-- Potential Transformer (PT) tap -->
              <g id="pt-instrumentation" transform="translate(340, 68)">
                <line x1="0" y1="0" x2="-80" y2="0" stroke="#06b6d4" stroke-width="2" />
                <circle cx="-85" cy="0" r="10" fill="none" stroke="#38bdf8" stroke-width="1.5" />
                <circle cx="-95" cy="0" r="10" fill="none" stroke="#38bdf8" stroke-width="1.5" />
                <line x1="-95" y1="10" x2="-95" y2="22" stroke="#94a3b8" stroke-width="1.5" />
                <line x1="-102" y1="22" x2="-88" y2="22" stroke="#94a3b8" stroke-width="1.5" />
                <text x="-145" y="4" fill="#38bdf8" font-size="8" font-family="monospace">PT 6.6kV/110V</text>
              </g>

              <!-- Outgoing Feeder Cable to Motor -->
              <line x1="340" y1="315" x2="340" y2="345" stroke="#06b6d4" stroke-width="4" id="motor-cable-line" />

              <!-- 2500 kW Motor Circle Symbol -->
              <g id="motor-symbol" transform="translate(340, 370)">
                <circle cx="0" cy="0" r="22" fill="#0369a1" stroke="#38bdf8" stroke-width="2.5" id="motor-symbol-circle" />
                <text x="0" y="4" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">M</text>
                <text x="0" y="14" fill="#bae6fd" font-size="7" font-weight="bold" text-anchor="middle">3 ~</text>
                <text x="32" y="4" fill="#ffffff" font-size="10" font-weight="bold" font-family="monospace">KILN DRIVE (2500 kW)</text>
              </g>
            </g>

            <!-- ANSI PROTECTION RELAYS DISPATCH BLOCK (Right Side) -->
            <g id="ansi-relays-group" transform="translate(480, 85)">
              <rect x="0" y="0" width="180" height="260" fill="#090f1d" stroke="#1e293b" stroke-width="1.5" rx="5" />
              <text x="12" y="22" fill="#38bdf8" font-size="10" font-weight="bold">NUMERICAL RELAY (SIPROTEC)</text>
              <line x1="10" y1="32" x2="170" y2="32" stroke="#1e293b" stroke-width="1" />

              <!-- ANSI 51 -->
              <g id="relay-51-card" transform="translate(10, 42)">
                <rect x="0" y="0" width="160" height="60" fill="#0f172a" stroke="#334155" stroke-width="1" rx="3" id="r51-bg" />
                <text x="8" y="18" fill="#38bdf8" font-size="10" font-weight="bold">ANSI 51: OVERCURRENT</text>
                <text x="8" y="34" fill="#94a3b8" font-size="8" font-family="monospace">IEC Standard Inverse</text>
                <text x="8" y="48" fill="#e2e8f0" font-size="9" font-family="monospace" id="r51-val">242.4 A (NORMAL)</text>
                <circle cx="145" cy="18" r="6" fill="#10b981" id="r51-led" />
              </g>

              <!-- ANSI 49 -->
              <g id="relay-49-card" transform="translate(10, 112)">
                <rect x="0" y="0" width="160" height="60" fill="#0f172a" stroke="#334155" stroke-width="1" rx="3" id="r49-bg" />
                <text x="8" y="18" fill="#f59e0b" font-size="10" font-weight="bold">ANSI 49: THERMAL OVERLOAD</text>
                <text x="8" y="34" fill="#94a3b8" font-size="8" font-family="monospace">Stator Heating I²t</text>
                <text x="8" y="48" fill="#e2e8f0" font-size="9" font-family="monospace" id="r49-val">58.4 % (NORMAL)</text>
                <circle cx="145" cy="18" r="6" fill="#10b981" id="r49-led" />
              </g>

              <!-- ANSI 50N -->
              <g id="relay-50n-card" transform="translate(10, 182)">
                <rect x="0" y="0" width="160" height="60" fill="#0f172a" stroke="#334155" stroke-width="1" rx="3" id="r50n-bg" />
                <text x="8" y="18" fill="#ef4444" font-size="10" font-weight="bold">ANSI 50N: EARTH FAULT</text>
                <text x="8" y="34" fill="#94a3b8" font-size="8" font-family="monospace">Inst. Residual (40ms)</text>
                <text x="8" y="48" fill="#e2e8f0" font-size="9" font-family="monospace" id="r50n-val">1.2 A (NORMAL)</text>
                <circle cx="145" cy="18" r="6" fill="#10b981" id="r50n-led" />
              </g>

              <!-- TRIP BUS LINK LINE -->
              <path d="M 0 160 L -60 160 L -60 195" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,3" id="trip-bus-line" />
            </g>
          </svg>
        </div>
      </div>
    `;
  }

  public update(data: PlantTelemetry) {
    const badge = this.container.querySelector('#vcb-status-badge');
    const badgeText = this.container.querySelector('#vcb-badge-text');
    const contactBar = this.container.querySelector('#vcb-contact-bar') as SVGLineElement | null;
    const lowerLine = this.container.querySelector('#feeder-lower-line') as SVGLineElement | null;
    const cableLine = this.container.querySelector('#motor-cable-line') as SVGLineElement | null;
    const motorCircle = this.container.querySelector('#motor-symbol-circle') as SVGCircleElement | null;
    const tripBusLine = this.container.querySelector('#trip-bus-line') as SVGPathElement | null;

    if (badge && badgeText && contactBar) {
      if (data.vcbState === 'CLOSED') {
        badge.className = 'vcb-status-indicator vcb-closed';
        badge.innerHTML = `<span class="led-dot led-green"></span><span>VCB: CLOSED (IN SERVICE)</span>`;
        // Closed: straight line
        contactBar.setAttribute('x1', '0');
        contactBar.setAttribute('y1', '-22');
        contactBar.setAttribute('x2', '0');
        contactBar.setAttribute('y2', '22');
        contactBar.setAttribute('stroke', '#10b981');

        if (lowerLine) lowerLine.setAttribute('stroke', '#06b6d4');
        if (cableLine) cableLine.setAttribute('stroke', '#06b6d4');
        if (motorCircle) motorCircle.setAttribute('fill', '#0369a1');
        if (tripBusLine) tripBusLine.setAttribute('stroke', '#475569');
      } else if (data.vcbState === 'TRIPPED') {
        badge.className = 'vcb-status-indicator vcb-tripped';
        badge.innerHTML = `<span class="led-dot led-red"></span><span>VCB: TRIPPED (FAULT)</span>`;
        // Open/Tripped angle 45 deg
        contactBar.setAttribute('x1', '0');
        contactBar.setAttribute('y1', '-22');
        contactBar.setAttribute('x2', '25');
        contactBar.setAttribute('y2', '5');
        contactBar.setAttribute('stroke', '#ef4444');

        if (lowerLine) lowerLine.setAttribute('stroke', '#334155');
        if (cableLine) cableLine.setAttribute('stroke', '#334155');
        if (motorCircle) motorCircle.setAttribute('fill', '#1e293b');
        if (tripBusLine) tripBusLine.setAttribute('stroke', '#ef4444');
      } else {
        badge.className = 'vcb-status-indicator vcb-open';
        badge.innerHTML = `<span class="led-dot led-amber"></span><span>VCB: OPEN</span>`;
        contactBar.setAttribute('x1', '0');
        contactBar.setAttribute('y1', '-22');
        contactBar.setAttribute('x2', '22');
        contactBar.setAttribute('y2', '5');
        contactBar.setAttribute('stroke', '#f59e0b');

        if (lowerLine) lowerLine.setAttribute('stroke', '#334155');
        if (cableLine) cableLine.setAttribute('stroke', '#334155');
        if (motorCircle) motorCircle.setAttribute('fill', '#1e293b');
      }
    }

    // ANSI 51 Update
    const r51Val = this.container.querySelector('#r51-val');
    const r51Led = this.container.querySelector('#r51-led');
    const r51Bg = this.container.querySelector('#r51-bg');
    if (r51Val && r51Led && r51Bg) {
      r51Val.textContent = data.relay51Overcurrent.measuredVal;
      if (data.relay51Overcurrent.status === 'TRIPPED') {
        r51Led.setAttribute('fill', '#ef4444');
        r51Bg.setAttribute('stroke', '#ef4444');
      } else if (data.relay51Overcurrent.status === 'PICKUP') {
        r51Led.setAttribute('fill', '#f59e0b');
        r51Bg.setAttribute('stroke', '#f59e0b');
      } else {
        r51Led.setAttribute('fill', '#10b981');
        r51Bg.setAttribute('stroke', '#334155');
      }
    }

    // ANSI 49 Update
    const r49Val = this.container.querySelector('#r49-val');
    const r49Led = this.container.querySelector('#r49-led');
    const r49Bg = this.container.querySelector('#r49-bg');
    if (r49Val && r49Led && r49Bg) {
      r49Val.textContent = `${data.thermalCapacityPct.toFixed(1)} %`;
      if (data.relay49Thermal.status === 'TRIPPED') {
        r49Led.setAttribute('fill', '#ef4444');
        r49Bg.setAttribute('stroke', '#ef4444');
      } else if (data.relay49Thermal.status === 'PICKUP' || data.thermalCapacityPct > 80) {
        r49Led.setAttribute('fill', '#f59e0b');
        r49Bg.setAttribute('stroke', '#f59e0b');
      } else {
        r49Led.setAttribute('fill', '#10b981');
        r49Bg.setAttribute('stroke', '#334155');
      }
    }

    // ANSI 50N Update
    const r50nVal = this.container.querySelector('#r50n-val');
    const r50nLed = this.container.querySelector('#r50n-led');
    const r50nBg = this.container.querySelector('#r50n-bg');
    if (r50nVal && r50nLed && r50nBg) {
      r50nVal.textContent = data.relay50NEarthFault.measuredVal;
      if (data.relay50NEarthFault.status === 'TRIPPED') {
        r50nLed.setAttribute('fill', '#ef4444');
        r50nBg.setAttribute('stroke', '#ef4444');
      } else {
        r50nLed.setAttribute('fill', '#10b981');
        r50nBg.setAttribute('stroke', '#334155');
      }
    }

    // Bus frequency
    const busFreq = this.container.querySelector('#bus-freq-disp');
    if (busFreq) busFreq.textContent = `${data.busFrequencyHz.toFixed(2)} Hz`;
  }
}
