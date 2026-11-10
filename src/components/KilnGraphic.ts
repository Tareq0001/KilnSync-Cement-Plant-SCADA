/**
 * KILN-SYNC: Cement Plant Industrial SCADA
 * Rotary Kiln & Raw Mill SVG Mimic Component
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 */

import { PlantTelemetry } from '../types/scada';

export class KilnGraphic {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  public render() {
    this.container.innerHTML = `
      <div class="mimic-wrapper">
        <div class="mimic-header">
          <div class="mimic-title-group">
            <span class="badge-tag">PROCESS MIMIC</span>
            <h4 class="mimic-title">Pyroprocessing Rotary Kiln & Ball Mill Drive System</h4>
          </div>
          <div class="mimic-status-bar">
            <span class="status-pill status-running" id="kiln-status-pill">
              <span class="led-dot led-green"></span>
              <span id="kiln-status-text">KILN DRIVE: RUNNING</span>
            </span>
            <span class="telemetry-chip">
              <span class="chip-label">SPEED:</span>
              <span class="chip-val font-mono" id="kiln-speed-display">3.82 RPM</span>
            </span>
            <span class="telemetry-chip">
              <span class="chip-label">BURNING ZONE:</span>
              <span class="chip-val font-mono text-amber" id="kiln-temp-display">1445 °C</span>
            </span>
          </div>
        </div>

        <div class="svg-viewport">
          <svg viewBox="0 0 1000 420" class="kiln-svg" id="kiln-svg-element" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Metallic Gradients -->
              <linearGradient id="kilnShellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#334155" />
                <stop offset="30%" stop-color="#64748b" />
                <stop offset="60%" stop-color="#475569" />
                <stop offset="100%" stop-color="#1e293b" />
              </linearGradient>

              <linearGradient id="tyreRingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#94a3b8" />
                <stop offset="50%" stop-color="#cbd5e1" />
                <stop offset="100%" stop-color="#475569" />
              </linearGradient>

              <linearGradient id="flameGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
                <stop offset="25%" stop-color="#fef08a" stop-opacity="0.95" />
                <stop offset="55%" stop-color="#f97316" stop-opacity="0.9" />
                <stop offset="85%" stop-color="#dc2626" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0" />
              </linearGradient>

              <linearGradient id="calcinerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#1e293b" />
                <stop offset="50%" stop-color="#334155" />
                <stop offset="100%" stop-color="#0f172a" />
              </linearGradient>

              <linearGradient id="motorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#0284c7" />
                <stop offset="50%" stop-color="#0369a1" />
                <stop offset="100%" stop-color="#075985" />
              </linearGradient>

              <filter id="flameGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background Grid Lines -->
            <g class="grid-lines" opacity="0.15">
              <line x1="0" y1="70" x2="1000" y2="70" stroke="#38bdf8" stroke-dasharray="4,4" />
              <line x1="0" y1="140" x2="1000" y2="140" stroke="#38bdf8" stroke-dasharray="4,4" />
              <line x1="0" y1="210" x2="1000" y2="210" stroke="#38bdf8" stroke-dasharray="4,4" />
              <line x1="0" y1="280" x2="1000" y2="280" stroke="#38bdf8" stroke-dasharray="4,4" />
              <line x1="0" y1="350" x2="1000" y2="350" stroke="#38bdf8" stroke-dasharray="4,4" />
              <line x1="200" y1="0" x2="200" y2="420" stroke="#38bdf8" stroke-dasharray="4,4" />
              <line x1="400" y1="0" x2="400" y2="420" stroke="#38bdf8" stroke-dasharray="4,4" />
              <line x1="600" y1="0" x2="600" y2="420" stroke="#38bdf8" stroke-dasharray="4,4" />
              <line x1="800" y1="0" x2="800" y2="420" stroke="#38bdf8" stroke-dasharray="4,4" />
            </g>

            <!-- Preheater Tower & Cyclones (Left Side) -->
            <g id="preheater-tower" transform="translate(40, 20)">
              <!-- Tower Steel Structure -->
              <rect x="0" y="0" width="110" height="290" fill="#0f172a" stroke="#334155" stroke-width="2" rx="4" />
              <line x1="0" y1="60" x2="110" y2="60" stroke="#475569" stroke-width="1.5" />
              <line x1="0" y1="120" x2="110" y2="120" stroke="#475569" stroke-width="1.5" />
              <line x1="0" y1="180" x2="110" y2="180" stroke="#475569" stroke-width="1.5" />
              <line x1="0" y1="240" x2="110" y2="240" stroke="#475569" stroke-width="1.5" />
              
              <!-- Cross bracings -->
              <line x1="0" y1="0" x2="110" y2="60" stroke="#334155" stroke-width="1" />
              <line x1="110" y1="0" x2="0" y2="60" stroke="#334155" stroke-width="1" />
              <line x1="0" y1="60" x2="110" y2="120" stroke="#334155" stroke-width="1" />
              <line x1="110" y1="60" x2="0" y2="120" stroke="#334155" stroke-width="1" />

              <!-- Cyclone Stage 1 -->
              <polygon points="25,25 85,25 70,55 40,55" fill="url(#calcinerGrad)" stroke="#38bdf8" stroke-width="1.5" />
              <text x="55" y="42" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="monospace">CYC-01</text>

              <!-- Cyclone Stage 2 & 3 -->
              <polygon points="25,85 85,85 70,115 40,115" fill="url(#calcinerGrad)" stroke="#38bdf8" stroke-width="1.5" />
              <polygon points="25,145 85,145 70,175 40,175" fill="url(#calcinerGrad)" stroke="#38bdf8" stroke-width="1.5" />

              <!-- Calciner Chamber -->
              <rect x="20" y="200" width="70" height="75" fill="#1e293b" stroke="#f97316" stroke-width="1.5" rx="3" />
              <text x="55" y="235" fill="#f97316" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">CALCINER</text>
              <text x="55" y="250" fill="#fdba74" font-size="9" text-anchor="middle" font-family="monospace" id="calciner-temp-text">885 °C</text>

              <!-- Gas Duct into Kiln Inlet -->
              <path d="M 90 260 Q 150 265 170 230" fill="none" stroke="#64748b" stroke-width="12" stroke-linecap="round" />
            </g>

            <!-- Rotary Kiln Support Piers (Civil Concrete Bases) -->
            <g id="kiln-piers">
              <!-- Pier 1 (Inlet) -->
              <polygon points="250,290 280,290 290,370 240,370" fill="#1e293b" stroke="#334155" stroke-width="2" />
              <circle cx="258" cy="285" r="12" fill="#475569" stroke="#94a3b8" stroke-width="2" />
              <circle cx="272" cy="285" r="12" fill="#475569" stroke="#94a3b8" stroke-width="2" />

              <!-- Pier 2 (Drive Station Center) -->
              <polygon points="460,280 500,280 515,370 445,370" fill="#1e293b" stroke="#334155" stroke-width="2" />
              <circle cx="470" cy="272" r="14" fill="#475569" stroke="#94a3b8" stroke-width="2" />
              <circle cx="490" cy="272" r="14" fill="#475569" stroke="#94a3b8" stroke-width="2" />

              <!-- Pier 3 (Outlet / Hood) -->
              <polygon points="680,270 710,270 720,370 670,370" fill="#1e293b" stroke="#334155" stroke-width="2" />
              <circle cx="688" cy="260" r="12" fill="#475569" stroke="#94a3b8" stroke-width="2" />
              <circle cx="702" cy="260" r="12" fill="#475569" stroke="#94a3b8" stroke-width="2" />
            </g>

            <!-- MAIN ROTARY KILN SHELL (Inclined 3.5 degrees) -->
            <!-- Axis from (165, 230) to (740, 200) -->
            <g id="kiln-shell-group" transform="rotate(-3.2, 450, 220)">
              <!-- Outer Kiln Shell Cylinder -->
              <rect x="160" y="185" width="570" height="70" rx="6" fill="url(#kilnShellGrad)" stroke="#475569" stroke-width="2.5" />
              
              <!-- Refractory Lining Heat Zone Indicator (Gradient along shell) -->
              <rect x="520" y="187" width="208" height="66" fill="#dc2626" opacity="0.18" />
              <rect x="620" y="187" width="108" height="66" fill="#f97316" opacity="0.25" />

              <!-- Shell Weld Seams & Bands -->
              <line x1="240" y1="185" x2="240" y2="255" stroke="#1e293b" stroke-width="3" />
              <line x1="330" y1="185" x2="330" y2="255" stroke="#1e293b" stroke-width="3" />
              <line x1="420" y1="185" x2="420" y2="255" stroke="#1e293b" stroke-width="3" />
              <line x1="510" y1="185" x2="510" y2="255" stroke="#1e293b" stroke-width="3" />
              <line x1="600" y1="185" x2="600" y2="255" stroke="#1e293b" stroke-width="3" />

              <!-- Riding Rings (Tyres) -->
              <!-- Tyre 1 -->
              <rect x="252" y="180" width="24" height="80" rx="3" fill="url(#tyreRingGrad)" stroke="#0f172a" stroke-width="2" />
              <!-- Tyre 2 (Center) -->
              <rect x="468" y="180" width="26" height="80" rx="3" fill="url(#tyreRingGrad)" stroke="#0f172a" stroke-width="2" />
              <!-- Tyre 3 (Outlet) -->
              <rect x="682" y="180" width="24" height="80" rx="3" fill="url(#tyreRingGrad)" stroke="#0f172a" stroke-width="2" />

              <!-- Girth Gear (Driven by MV Pinion) -->
              <g id="girth-gear">
                <rect x="435" y="176" width="20" height="88" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />
                <!-- Gear Teeth simulation -->
                <line x1="435" y1="178" x2="455" y2="178" stroke="#e0f2fe" stroke-width="1.5" />
                <line x1="435" y1="184" x2="455" y2="184" stroke="#e0f2fe" stroke-width="1.5" />
                <line x1="435" y1="256" x2="455" y2="256" stroke="#e0f2fe" stroke-width="1.5" />
                <line x1="435" y1="262" x2="455" y2="262" stroke="#e0f2fe" stroke-width="1.5" />
              </g>

              <!-- Rotation Arrow overlay -->
              <g id="rotation-indicator" class="rotation-spin" transform="translate(340, 220)">
                <circle cx="0" cy="0" r="18" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8,4" />
                <polygon points="12,-10 20,-2 10,-2" fill="#38bdf8" />
              </g>
              <text x="340" y="248" fill="#38bdf8" font-size="9" text-anchor="middle" font-family="monospace">CW ROTATION</text>
            </g>

            <!-- 2500 kW MV DRIVE MOTOR & GEARBOX UNIT -->
            <g id="drive-motor-group" transform="translate(390, 310)">
              <!-- Gearbox casing -->
              <rect x="0" y="15" width="45" height="42" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.5" rx="3" />
              <text x="22" y="40" fill="#7dd3fc" font-size="8" text-anchor="middle" font-family="monospace">REDUCER</text>
              <line x1="45" y1="36" x2="60" y2="36" stroke="#94a3b8" stroke-width="6" />

              <!-- Main Motor (6.6 kV - 2500 kW) -->
              <rect x="60" y="5" width="65" height="58" fill="url(#motorGrad)" stroke="#38bdf8" stroke-width="2" rx="4" />
              <!-- Cooling Fins -->
              <line x1="68" y1="5" x2="68" y2="63" stroke="#0369a1" stroke-width="1.5" />
              <line x1="78" y1="5" x2="78" y2="63" stroke="#0369a1" stroke-width="1.5" />
              <line x1="88" y1="5" x2="88" y2="63" stroke="#0369a1" stroke-width="1.5" />
              <line x1="98" y1="5" x2="98" y2="63" stroke="#0369a1" stroke-width="1.5" />
              <line x1="108" y1="5" x2="108" y2="63" stroke="#0369a1" stroke-width="1.5" />

              <text x="92" y="30" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">M1-KILN</text>
              <text x="92" y="44" fill="#bae6fd" font-size="8" text-anchor="middle" font-family="monospace">6.6kV 2.5MW</text>

              <!-- Shaft to Pinion -->
              <line x1="22" y1="15" x2="45" y2="-40" stroke="#0284c7" stroke-width="5" stroke-dasharray="3,2" />
            </g>

            <!-- Kiln Hood & Main Burner Flame (Right Side) -->
            <g id="kiln-hood" transform="translate(720, 140)">
              <!-- Kiln Firing Hood Structure -->
              <polygon points="0,55 35,35 65,35 65,180 0,180" fill="#0f172a" stroke="#475569" stroke-width="2" />
              
              <!-- Burner Lance Pipe -->
              <rect x="5" y="105" width="55" height="10" fill="#64748b" stroke="#334155" stroke-width="1.5" />
              <circle cx="5" cy="110" r="5" fill="#f97316" />

              <!-- ROARING FLAME (Animated Flame Gradient) -->
              <path id="kiln-flame-path" class="animated-flame" d="M 5,110 C -40,95 -120,80 -180,105 C -120,135 -40,125 5,110 Z" 
                    fill="url(#flameGrad)" filter="url(#flameGlow)" opacity="0.95" />

              <text x="35" y="70" fill="#f97316" font-size="9" font-weight="bold" text-anchor="middle">BURNER</text>
              <text x="35" y="85" fill="#fbbf24" font-size="8" text-anchor="middle" font-family="monospace">1450°C</text>

              <!-- Clinker Discharge Chute into Grate Cooler -->
              <path d="M 20 180 L 45 180 L 35 240 L 10 240 Z" fill="#334155" stroke="#1e293b" />
            </g>

            <!-- Clinker Grate Cooler (Bottom Right) -->
            <g id="grate-cooler" transform="translate(710, 290)">
              <rect x="0" y="20" width="160" height="60" fill="#1e293b" stroke="#475569" stroke-width="2" rx="3" />
              <text x="80" y="42" fill="#94a3b8" font-size="10" font-weight="bold" text-anchor="middle">CLINKER GRATE COOLER</text>
              <text x="80" y="58" fill="#38bdf8" font-size="9" text-anchor="middle" font-family="monospace">COOLING FANS: 6x ON</text>
              <!-- Moving grate plates simulation -->
              <line x1="15" y1="65" x2="145" y2="65" stroke="#f97316" stroke-width="4" stroke-dasharray="10,5" class="grate-motion" />
            </g>

            <!-- Ball Mill (Raw Grinding Mill - Far Left Bottom) -->
            <g id="raw-ball-mill" transform="translate(180, 20)">
              <!-- Feed Chute -->
              <polygon points="10,0 30,0 25,60 15,60" fill="#334155" stroke="#475569" stroke-width="1" />
              <text x="20" y="-8" fill="#94a3b8" font-size="8" text-anchor="middle">MEAL FEED</text>
            </g>

            <!-- Live Sensor Overlays on Graphic -->
            <!-- RTD U1/V1/W1 on Motor -->
            <g id="motor-telemetry-badge" transform="translate(530, 315)">
              <rect x="0" y="0" width="125" height="52" fill="#0b1329" stroke="#0284c7" stroke-width="1.5" rx="4" />
              <text x="8" y="15" fill="#38bdf8" font-size="8" font-weight="bold">RTD WINDINGS (PT100)</text>
              <text x="8" y="30" fill="#e2e8f0" font-size="9" font-family="monospace" id="rtd-u-text">U1: 94.2°C | V1: 95.8°C</text>
              <text x="8" y="44" fill="#e2e8f0" font-size="9" font-family="monospace" id="rtd-w-text">W1: 93.6°C | W2: 94.7°C</text>
            </g>

            <!-- Bearing DE/NDE Vibration Badge -->
            <g id="bearing-telemetry-badge" transform="translate(530, 245)">
              <rect x="0" y="0" width="125" height="42" fill="#0b1329" stroke="#10b981" stroke-width="1.5" rx="4" />
              <text x="8" y="14" fill="#34d399" font-size="8" font-weight="bold">BEARING VIBRATION RMS</text>
              <text x="8" y="30" fill="#ffffff" font-size="9" font-family="monospace" id="vibe-badge-text">DE: 1.65 | NDE: 1.38 mm/s</text>
            </g>
          </svg>
        </div>
      </div>
    `;
  }

  public update(data: PlantTelemetry) {
    const speedEl = this.container.querySelector('#kiln-speed-display');
    if (speedEl) speedEl.textContent = `${data.kilnSpeedRpm.toFixed(2)} RPM`;

    const tempEl = this.container.querySelector('#kiln-temp-display');
    if (tempEl) tempEl.textContent = `${data.burningZoneTempC} °C`;

    const calcinerEl = this.container.querySelector('#calciner-temp-text');
    if (calcinerEl) calcinerEl.textContent = `${data.calcinerTempC} °C`;

    const rtdU = this.container.querySelector('#rtd-u-text');
    if (rtdU) rtdU.textContent = `U1: ${data.windings.u1.toFixed(1)}°C | V1: ${data.windings.v1.toFixed(1)}°C`;

    const rtdW = this.container.querySelector('#rtd-w-text');
    if (rtdW) rtdW.textContent = `W1: ${data.windings.w1.toFixed(1)}°C | W2: ${data.windings.w2.toFixed(1)}°C`;

    const vibeBadge = this.container.querySelector('#vibe-badge-text');
    if (vibeBadge) vibeBadge.textContent = `DE: ${data.bearings.deVibeRms.toFixed(2)} | NDE: ${data.bearings.ndeVibeRms.toFixed(2)} mm/s`;

    // Status Pill
    const pill = this.container.querySelector('#kiln-status-pill');
    const pillText = this.container.querySelector('#kiln-status-text');
    const flamePath = this.container.querySelector('#kiln-flame-path') as SVGPathElement | null;
    const rotIndicator = this.container.querySelector('#rotation-indicator');

    if (pill && pillText) {
      if (data.motorState === 'RUNNING') {
        pill.className = 'status-pill status-running';
        pill.innerHTML = `<span class="led-dot led-green"></span><span>KILN DRIVE: RUNNING</span>`;
        if (flamePath) flamePath.style.display = 'block';
        if (rotIndicator) rotIndicator.classList.add('rotation-spin');
      } else if (data.motorState === 'TRIPPED') {
        pill.className = 'status-pill status-tripped';
        pill.innerHTML = `<span class="led-dot led-red"></span><span>KILN DRIVE: TRIPPED</span>`;
        if (flamePath) flamePath.style.display = 'none';
        if (rotIndicator) rotIndicator.classList.remove('rotation-spin');
      } else {
        pill.className = 'status-pill status-stopped';
        pill.innerHTML = `<span class="led-dot led-amber"></span><span>KILN DRIVE: STOPPED</span>`;
        if (flamePath) flamePath.style.display = 'none';
        if (rotIndicator) rotIndicator.classList.remove('rotation-spin');
      }
    }
  }
}
