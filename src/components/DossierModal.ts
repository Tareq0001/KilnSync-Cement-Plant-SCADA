/**
 * KILN-SYNC: Cement Plant Industrial SCADA
 * Engineering Dossier & Interview Defense Modal
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 */

export class DossierModal {
  private modalEl: HTMLElement | null = null;

  constructor() {
    this.createModal();
  }

  private createModal() {
    const modal = document.createElement('div');
    modal.id = 'engineering-dossier-modal';
    modal.className = 'modal-backdrop hidden';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="badge-tag tag-cyan">ENGINEERING DOSSIER</span>
            <h3 class="modal-title">KILN-SYNC: Technical Architecture & Interview Defense Dossier</h3>
          </div>
          <button class="modal-close-btn" id="close-dossier-btn">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Author Banner -->
          <div class="author-dossier-card">
            <div class="author-icon"><i class="fa-solid fa-user-astronaut"></i></div>
            <div class="author-meta">
              <h4 class="author-name">أ. طارق ابوعشي</h4>
              <p class="author-title">Lead Electrical & Automation Systems Engineer | SCADA & Industrial Twin Architect</p>
              <span class="author-badge">Industrial Plant Automation • 6.6 kV MV Switchgear • ANSI Relays • ISO 10816 Analytics</span>
            </div>
          </div>

          <!-- Tabs or Sections -->
          <div class="dossier-sections">
            <!-- Section 1: Electrical Calculations -->
            <div class="dossier-card">
              <h5 class="section-title"><i class="fa-solid fa-bolt text-cyan"></i> 1. Medium Voltage Motor & Power System Calculations</h5>
              <div class="section-content">
                <p>The Rotary Kiln drive is powered by a <strong>6.6 kV, 2,500 kW (3,350 HP) 3-phase wound-rotor induction motor</strong> coupled via a heavy helical gear reducer to a girth gear.</p>
                <div class="formula-box font-mono">
                  <div class="formula-row">Active Power: P = √3 × V_L × I_L × cos φ × η</div>
                  <div class="formula-row">Rated Full Load Current: I_n = P / (√3 × V_L × cos φ × η) = 2500 kW / (1.732 × 6.6 kV × 0.91 × 0.96) ≈ <strong>250.7 A</strong></div>
                  <div class="formula-row">Nominal Steady Operation: Current = 242.4 A (96.7% Full Load) | Cos φ = 0.91 | Active Power = 2.51 MW</div>
                  <div class="formula-row">Direct-On-Line Inrush: I_st ≈ 5.5 × I_n ≈ 1,380 A (Mitigated via Liquid Resistance Starter LRS / MV VFD)</div>
                </div>
              </div>
            </div>

            <!-- Section 2: ANSI Protection Relays -->
            <div class="dossier-card">
              <h5 class="section-title"><i class="fa-solid fa-shield-halved text-amber"></i> 2. ANSI / IEEE Standard Protection Scheme (SIPROTEC 7UM62)</h5>
              <div class="section-content">
                <table class="dossier-table font-mono">
                  <thead>
                    <tr>
                      <th>ANSI Code</th>
                      <th>Relay Function</th>
                      <th>Standard Setting / Formula</th>
                      <th>Operational Logic</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-cyan font-bold">51</td>
                      <td>Phase Time Overcurrent (IDMT)</td>
                      <td>IEC 60255 Standard Inverse: t = (0.14 × TMS) / ((I/Is)^0.02 - 1)<br>Is = 280 A, TMS = 0.25</td>
                      <td>Guards stator against sustained mechanical overloads and ball charge jamming. Tripped if current sustains >280A for ~4 seconds.</td>
                    </tr>
                    <tr>
                      <td class="text-amber font-bold">49</td>
                      <td>Machine Thermal Overload</td>
                      <td>Stator heating model: θ = (I / I_rated)² × (1 - e^(-t/τ))<br>Alarm: 85% | Trip: 100%</td>
                      <td>Tracks internal copper heating. Incorporates PT100 RTD feedback (U1..W2) to prevent insulation breakdown (Class F/B rise).</td>
                    </tr>
                    <tr>
                      <td class="text-red font-bold">50N</td>
                      <td>Instantaneous Earth Fault</td>
                      <td>Core Balance CT (CBCT 50/1A)<br>Pickup Is0 = 15 A | Time Delay: 40 ms</td>
                      <td>Defends against stator ground faults. Instantaneous trip clears before zero-sequence current damages core iron laminations.</td>
                    </tr>
                    <tr>
                      <td class="text-purple font-bold">27 / 59</td>
                      <td>Under / Over Voltage</td>
                      <td>PT 6.6kV / 110V | 27: 0.85 Un (5.61 kV) | 59: 1.15 Un (7.59 kV)</td>
                      <td>Protects magnetic core flux saturation and prevents excessive motor heating during grid voltage depressions.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Section 3: Sequential Conveyor Interlock -->
            <div class="dossier-card">
              <h5 class="section-title"><i class="fa-solid fa-diagram-project text-green"></i> 3. Cascaded Conveyor Sequential Interlock Philosophy (CEMAT Standard)</h5>
              <div class="section-content">
                <p>In heavy cement clinker and raw stone transport, conveyors must adhere to strict interlocking logic to prevent catastrophic material spillage and motor burnouts:</p>
                <div class="logic-flow">
                  <div class="logic-node">
                    <span class="node-id">CV-103</span>
                    <span class="node-name">Raw Mill Feed (Surge)</span>
                    <span class="node-rule">Must Start FIRST</span>
                  </div>
                  <div class="logic-arrow">◀ Permissive Start (Reverse Order)</div>
                  <div class="logic-node">
                    <span class="node-id">CV-102</span>
                    <span class="node-name">Overland Gallery (280m)</span>
                    <span class="node-rule">Starts 2nd</span>
                  </div>
                  <div class="logic-arrow">◀ Permissive Start</div>
                  <div class="logic-node">
                    <span class="node-id">CV-101</span>
                    <span class="node-name">Quarry Crusher Discharge</span>
                    <span class="node-rule">Starts LAST</span>
                  </div>
                </div>
                <div class="cascade-note">
                  <strong class="text-red">Cascade Trip Logic:</strong> If <code>CV-103</code> trips due to Belt Sway or Zero-Speed slip, <code>CV-102</code> and <code>CV-101</code> MUST trip immediately. Halts feed instantly to prevent 150+ tons of rock from piling onto stationary belts!
                </div>
              </div>
            </div>

            <!-- Section 4: AI Predictive Maintenance & ISO 10816 -->
            <div class="dossier-card">
              <h5 class="section-title"><i class="fa-solid fa-brain text-purple"></i> 4. AI Vibration Analytics & Bearing Defect Frequencies (ISO 10816-3)</h5>
              <div class="section-content">
                <p>Dual-channel high-frequency piezoresistive accelerometers sample Drive-End (DE) and Non-Drive End (NDE) spherical roller bearings. Telemetry calculates real-time RMS velocity (10 Hz – 1,000 Hz) and Fast Fourier Transform (FFT) spectral peaks:</p>
                <div class="formula-box font-mono">
                  <div class="formula-row">ISO 10816-3 Class IV (>300 kW Rigid Foundation):</div>
                  <div class="formula-row text-green">  • Zone A/B (Good / Permissible): RMS &lt; 2.80 mm/s</div>
                  <div class="formula-row text-amber">  • Zone C (Alert / Restricted Operation): 2.80 – 4.50 mm/s</div>
                  <div class="formula-row text-red">  • Zone D (Dangerous / Unacceptable Trip): RMS &gt; 4.50 mm/s</div>
                  <div class="formula-row">BPFO Defect Frequency: BPFO = (n / 2) × f_r × [1 - (d / D) × cos α] = <strong>104.2 Hz</strong></div>
                  <div class="formula-row">Kurtosis: β_2 = E[(X - μ)⁴] / σ⁴ → Values > 4.5 indicate high-energy impact shocks from outer raceway spalls.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <span class="footer-note">Designed and engineered by أ. طارق ابوعشي for mission-critical industrial applications.</span>
          <button class="btn btn-primary" id="dossier-close-footer-btn">Close Dossier</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // Attach close events
    const closeBtn = modal.querySelector('#close-dossier-btn');
    const footerBtn = modal.querySelector('#dossier-close-footer-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
    if (footerBtn) footerBtn.addEventListener('click', () => this.hide());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.hide();
    });
  }

  public show() {
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
  }

  public hide() {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }
}
