/**
 * KILN-SYNC: Cement Plant Industrial SCADA
 * AI Predictive Maintenance & ISO 10816 Vibration Engine
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 */

import { PlantTelemetry } from '../types/scada';

export class VibrationChart {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private deHistory: number[] = [];
  private ndeHistory: number[] = [];
  private maxPoints: number = 40;

  constructor(container: HTMLElement) {
    this.container = container;
    // Pre-populate history
    for (let i = 0; i < this.maxPoints; i++) {
      this.deHistory.push(1.65 + (Math.random() * 0.15 - 0.075));
      this.ndeHistory.push(1.38 + (Math.random() * 0.12 - 0.06));
    }
    this.render();
  }

  public render() {
    this.container.innerHTML = `
      <div class="vibe-card">
        <div class="vibe-header">
          <div class="vibe-title-group">
            <span class="badge-tag tag-purple">AI PREDICTIVE MAINTENANCE</span>
            <h4 class="vibe-title">ISO 10816 Vibration RMS & Bearing Defect Spectral Analyzer</h4>
          </div>
          <div class="vibe-legend">
            <span class="legend-item"><span class="legend-box box-de"></span>DE Bearing (Drive End)</span>
            <span class="legend-item"><span class="legend-box box-nde"></span>NDE Bearing (Non-Drive End)</span>
            <span class="legend-item"><span class="legend-line line-iso"></span>ISO Limit (2.8 mm/s)</span>
          </div>
        </div>

        <div class="vibe-content-grid">
          <!-- Canvas Waveform Stream -->
          <div class="canvas-wrap">
            <canvas id="vibe-canvas" width="540" height="200"></canvas>
            <div class="canvas-zones">
              <span class="zone-tag zone-good">ZONE A/B: GOOD (&lt;2.8 mm/s)</span>
              <span class="zone-tag zone-warn">ZONE C: ALERT (2.8-4.5)</span>
              <span class="zone-tag zone-trip">ZONE D: TRIP (&gt;4.5)</span>
            </div>
          </div>

          <!-- AI Diagnostic Telemetry Panel -->
          <div class="ai-telemetry-panel">
            <div class="ai-metric-row">
              <div class="ai-metric-box">
                <span class="ai-lbl">REMAINING USEFUL LIFE</span>
                <span class="ai-val text-cyan font-mono" id="rul-hours-val">8,420 hrs</span>
                <div class="ai-progress-bar">
                  <div class="ai-progress-fill" id="rul-progress-fill" style="width: 84%;"></div>
                </div>
              </div>
              <div class="ai-metric-box">
                <span class="ai-lbl">BPFO DEFECT PROBABILITY</span>
                <span class="ai-val text-green font-mono" id="bpfo-score-val">7.2 %</span>
                <div class="ai-progress-bar">
                  <div class="ai-progress-fill bg-green" id="bpfo-progress-fill" style="width: 7%;"></div>
                </div>
              </div>
            </div>

            <div class="ai-metric-row">
              <div class="ai-metric-box">
                <span class="ai-lbl">KURTOSIS (ISO 13373)</span>
                <span class="ai-val font-mono" id="kurtosis-val">3.08 (Gaussian)</span>
              </div>
              <div class="ai-metric-box">
                <span class="ai-lbl">CREST FACTOR</span>
                <span class="ai-val font-mono" id="crest-val">2.85 (Nominal)</span>
              </div>
            </div>

            <!-- Spectral Peak Breakdown -->
            <div class="fft-peaks-box">
              <span class="fft-title">SPECTRAL PEAK HARMONICS (FFT):</span>
              <div class="fft-tags" id="fft-tags-container">
                <span class="fft-tag">1X RPM: 16.5 Hz (0.85 mm/s)</span>
                <span class="fft-tag">2X Harmonic: 33.0 Hz (0.32 mm/s)</span>
                <span class="fft-tag">BPFO: 104.2 Hz (0.12 mm/s)</span>
              </div>
            </div>

            <!-- AI Real-time Diagnosis Banner -->
            <div class="ai-diagnosis-banner" id="ai-diagnosis-box">
              <div class="diagnosis-icon"><i class="fa-solid fa-microchip"></i></div>
              <div class="diagnosis-body">
                <span class="diag-title" id="ai-diag-title">AI HEALTH STATUS: OPTIMAL</span>
                <p class="diag-text" id="ai-diag-text">Optimum hydrodynamic lubrication film. ISO G2.5 mechanical balance compliant.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#vibe-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.drawChart();
    }
  }

  public update(data: PlantTelemetry) {
    this.deHistory.push(data.bearings.deVibeRms);
    this.ndeHistory.push(data.bearings.ndeVibeRms);
    if (this.deHistory.length > this.maxPoints) this.deHistory.shift();
    if (this.ndeHistory.length > this.maxPoints) this.ndeHistory.shift();

    this.drawChart();

    // Update text elements
    const rulEl = this.container.querySelector('#rul-hours-val');
    const rulFill = this.container.querySelector('#rul-progress-fill') as HTMLElement | null;
    if (rulEl && rulFill) {
      rulEl.textContent = `${data.predictive.rulHours.toLocaleString()} hrs`;
      const pct = Math.min(100, Math.max(5, (data.predictive.rulHours / 10000) * 100));
      rulFill.style.width = `${pct}%`;
      if (data.predictive.rulHours < 1000) {
        rulFill.className = 'ai-progress-fill bg-red';
      } else {
        rulFill.className = 'ai-progress-fill bg-cyan';
      }
    }

    const bpfoEl = this.container.querySelector('#bpfo-score-val');
    const bpfoFill = this.container.querySelector('#bpfo-progress-fill') as HTMLElement | null;
    if (bpfoEl && bpfoFill) {
      bpfoEl.textContent = `${data.predictive.bpfoConfidence.toFixed(1)} %`;
      bpfoFill.style.width = `${Math.min(100, data.predictive.bpfoConfidence)}%`;
      if (data.predictive.bpfoConfidence > 50) {
        bpfoEl.className = 'ai-val text-red font-mono';
        bpfoFill.className = 'ai-progress-fill bg-red';
      } else if (data.predictive.bpfoConfidence > 25) {
        bpfoEl.className = 'ai-val text-amber font-mono';
        bpfoFill.className = 'ai-progress-fill bg-amber';
      } else {
        bpfoEl.className = 'ai-val text-green font-mono';
        bpfoFill.className = 'ai-progress-fill bg-green';
      }
    }

    const kurtEl = this.container.querySelector('#kurtosis-val');
    if (kurtEl) {
      const k = data.predictive.kurtosis.toFixed(2);
      kurtEl.textContent = `${k} (${data.predictive.kurtosis > 4 ? 'High Shock Impact' : 'Gaussian'})`;
      if (data.predictive.kurtosis > 4) kurtEl.className = 'ai-val text-red font-mono';
      else kurtEl.className = 'ai-val font-mono';
    }

    const crestEl = this.container.querySelector('#crest-val');
    if (crestEl) crestEl.textContent = `${data.predictive.crestFactor.toFixed(2)} (${data.predictive.crestFactor > 3.5 ? 'Alert' : 'Nominal'})`;

    const diagTitle = this.container.querySelector('#ai-diag-title');
    const diagText = this.container.querySelector('#ai-diag-text');
    const diagBox = this.container.querySelector('#ai-diagnosis-box');
    if (diagTitle && diagText && diagBox) {
      diagText.textContent = data.predictive.diagnosis;
      if (data.activeFault !== 'NONE') {
        diagTitle.textContent = 'AI HEALTH STATUS: CRITICAL FAULT ACTIVE';
        diagBox.className = 'ai-diagnosis-banner banner-alert';
      } else {
        diagTitle.textContent = 'AI HEALTH STATUS: OPTIMAL';
        diagBox.className = 'ai-diagnosis-banner';
      }
    }
  }

  private drawChart() {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // Dark grid background
    ctx.fillStyle = '#070c17';
    ctx.fillRect(0, 0, w, h);

    // ISO Threshold Zones Background
    const maxScale = 6.0; // mm/s
    const yGood = h - (2.8 / maxScale) * h;
    const yTrip = h - (4.5 / maxScale) * h;

    // Green zone (0 - 2.8)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
    ctx.fillRect(0, yGood, w, h - yGood);

    // Amber zone (2.8 - 4.5)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.fillRect(0, yTrip, w, yGood - yTrip);

    // Red zone (>4.5)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.fillRect(0, 0, w, yTrip);

    // Horizontal Grid Lines & Labels
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let v = 1; v <= 5; v++) {
      const y = h - (v / maxScale) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.fillText(`${v}.0 mm/s`, 8, y - 3);
    }

    // ISO Alert Line (2.8 mm/s)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, yGood);
    ctx.lineTo(w, yGood);
    ctx.stroke();

    // ISO Trip Line (4.5 mm/s)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, yTrip);
    ctx.lineTo(w, yTrip);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw NDE Bearing line (Cyan)
    this.drawLine(this.ndeHistory, '#06b6d4', 2, maxScale);

    // Draw DE Bearing line (Emerald / Orange / Red)
    const latestDE = this.deHistory[this.deHistory.length - 1] || 1.6;
    let deColor = '#10b981';
    if (latestDE >= 4.5) deColor = '#ef4444';
    else if (latestDE >= 2.8) deColor = '#f59e0b';
    this.drawLine(this.deHistory, deColor, 2.5, maxScale);
  }

  private drawLine(data: number[], color: string, lineWidth: number, maxScale: number) {
    if (!this.canvas || !this.ctx || data.length < 2) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    const step = w / (this.maxPoints - 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x = i * step;
      const val = Math.min(maxScale, Math.max(0, data[i]));
      const y = h - (val / maxScale) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Glowing tip at the latest data point
    const lastX = (data.length - 1) * step;
    const lastVal = Math.min(maxScale, Math.max(0, data[data.length - 1]));
    const lastY = h - (lastVal / maxScale) * h;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
