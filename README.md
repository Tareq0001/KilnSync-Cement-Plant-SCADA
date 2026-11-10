# KILN-SYNC: Cement Plant Industrial SCADA & Electrical Telemetry Suite

<div align="center">

![SCADA Banner](https://img.shields.io/badge/System-KILN--SYNC%20v4.8-0284c7?style=for-the-badge&logo=shield&logoColor=white)
![Voltage](https://img.shields.io/badge/Medium%20Voltage-6.6%20kV-06b6d4?style=for-the-badge)
![Power](https://img.shields.io/badge/Motor%20Rating-2500%20kW-10b981?style=for-the-badge)
![Protection](https://img.shields.io/badge/ANSI%20Relays-51%20%7C%2049%20%7C%2050N-ef4444?style=for-the-badge)
![Vibration](https://img.shields.io/badge/Standard-ISO%2010816--3-a855f7?style=for-the-badge)

### **Industrial Digital Twin, Switchgear Telemetry & AI Predictive Maintenance Platform**
**Designed and Architected by:**  
### **أ. طارق ابوعشي | Lead Electrical & Automation Systems Engineer**

[⚡ Live Interactive Demo](https://tareq0001.github.io/KilnSync-Cement-Plant-SCADA/) &bull; [📂 GitHub Repository](https://github.com/Tareq0001/KilnSync-Cement-Plant-SCADA) &bull; [📄 Engineering Dossier Modal](#engineering-dossier)

</div>

---

## 📌 Executive Overview

**KILN-SYNC** is a mission-critical industrial Human-Machine Interface (HMI) and Supervisory Control and Data Acquisition (SCADA) digital twin suite designed specifically for heavy cement manufacturing plants. Modeled after world-class distributed control systems (ABB 800xA, Siemens CEMAT, and Schneider Foxboro), the suite bridges mechanical pyroprocessing dynamics with high-voltage electrical substation telemetry, numerical protective relaying, and predictive AI vibration analytics.

Operating at **6.6 kV Medium Voltage (MV)**, the system manages a massive **2,500 kW wound-rotor induction motor** driving the pyroprocessing rotary kiln and ball mill, alongside a 3-stage cascaded overland conveyor feed network.

---

## 🏗️ Architectural Core: 5 Integrated Modules

```
+-----------------------------------------------------------------------------------+
|                           KILN-SYNC CENTRAL SCADA FRAME                          |
+-----------------------------------------------------------------------------------+
|  [Module 1: Kiln & Mill Mimic]       |  [Module 2: Conveyor Cascade & Interlock]  |
|  - Preheater & 5-Stage Cyclones      |  - CV-101 (Primary Crusher Feeder 45 kW)   |
|  - Calciner Fuel Firing (885°C)      |  - CV-102 (Overland Gallery 280m 75 kW)    |
|  - 3.5° Inclined Rotary Kiln Shell   |  - CV-103 (Raw Mill Surge Feed 90 kW)      |
|  - 1450°C Glowing Burner Flame       |  - Belt Sway / Zero-Speed / Pull-Cord      |
|  - 6x PT100 Winding RTDs (U1-W2)     |  - CEMAT Reverse Start / Forward Trip Lock |
+--------------------------------------+--------------------------------------------+
|  [Module 3: Substation SLD & Relays] |  [Module 4: AI Predictive Vibration Suite] |
|  - 6.6 kV 31.5kA Busbar A            |  - Dual DE/NDE Bearing RMS Canvas Waveform |
|  - Vacuum Circuit Breaker (VCB-04)   |  - ISO 10816-3 Severity Zones (A/B, C, D)  |
|  - ANSI 51 (Time Overcurrent IDMT)   |  - FFT Spectral Peak Analyzer              |
|  - ANSI 49 (Thermal Stator I²t)      |  - BPFO Outer Race Defect Probability      |
|  - ANSI 50N (Earth Fault 40ms)       |  - Dynamic Remaining Useful Life (RUL)     |
+--------------------------------------+--------------------------------------------+
|  [Module 5: Interview Defense & Fault Injection Testbed (SOE Chronology Recorder)]|
+-----------------------------------------------------------------------------------+
```

### 1. Rotary Kiln & Raw Mill Drive (Module 1)
- **High-Fidelity Process Mimic:** Animated scalable vector graphics (SVG) featuring a multi-stage preheater tower, calciner vessel, rotating kiln shell on 3 tyre piers, roaring 1450°C pulverized fuel flame, and clinker grate cooler with reciprocation plates.
- **Medium Voltage Motor Dynamics:** Real-time electrical telemetry including RMS Current ($0 - 320\text{ A}$), Active Power ($P \approx 2.51\text{ MW}$), Reactive Power ($1.15\text{ MVAR}$), and Power Factor ($\cos\varphi \approx 0.91$).
- **Stator Temperature Monitoring:** 6 embedded PT100 Resistance Temperature Detectors (U1, V1, W1, U2, V2, W2) mapped with warning ($>120^\circ\text{C}$) and trip ($>135^\circ\text{C}$) thresholds.

### 2. Cascaded Material Conveyor & Interlock Logic (Module 2)
- **3-Stage Overland Transfer Line:** CV-101 (Crusher discharge), CV-102 (Overland gallery), and CV-103 (Mill feed).
- **Comprehensive Field Protection:** Monitored by Belt Sway limit switches, Zero-Speed slip encoders, and Emergency Pull-Cord mechanical wires.
- **Safety PLC Interlocking (CEMAT Standard):**
  - **Sequential Start Permissive:** Enforces reverse order starting ($CV-103 \rightarrow CV-102 \rightarrow CV-101$) to guarantee clear destination paths.
  - **Cascade Trip Action:** An emergency stop or fault on $CV-103$ immediately drops $CV-102$ and $CV-101$, halting stone flow and preventing hundreds of tons of rock pileup.

### 3. MCC & Substation Single Line Diagram (Module 3)
- **Interactive SLD Display:** Dynamic 6.6 kV busbar telemetry, disconnector switch $DS-04$, Vacuum Circuit Breaker ($VCB-04$), and instrument transformer topologies.
- **Numerical Protection Relays (SIPROTEC Standard):**
  - **ANSI 51 (Phase Time Overcurrent):** IEC 60255 IDMT standard inverse curve:
    $$t = \frac{0.14 \times \text{TMS}}{(I / I_s)^{0.02} - 1}$$
  - **ANSI 49 (Machine Thermal Overload):** Stator heating model ($\theta = (I/I_n)^2$) with real-time thermal accumulator.
  - **ANSI 50N (Instantaneous Earth Fault):** Zero-sequence core balance CT ($50/1\text{A}$) with instantaneous $40\text{ ms}$ trip response at $I_0 > 15\text{ A}$.

### 4. AI Predictive Maintenance & Vibration Telemetry (Module 4)
- **Live Dual-Channel Waveform:** 60 FPS HTML5 Canvas graph tracking Drive End (DE) and Non-Drive End (NDE) vibration velocity RMS.
- **ISO 10816-3 Mechanical Severity Zones:**
  - *Zone A/B ($< 2.80\text{ mm/s}$):* Good / Permissible.
  - *Zone C ($2.80 - 4.50\text{ mm/s}$):* Warning / Restricted operation.
  - *Zone D ($> 4.50\text{ mm/s}$):* Critical / Immediate trip.
- **Spectral Anomaly Detection:** Calculates Ball Pass Frequency Outer Race defect confidence:
  $$\text{BPFO} = \frac{n}{2} f_r \left(1 - \frac{d}{D}\cos\alpha\right) = 104.2\text{ Hz}$$
- **RUL Engine:** Real-time Remaining Useful Life estimator with kurtosis and crest factor evaluation.

### 5. Fault Injection & Interview Defense Panel (Module 5)
- **Interactive Demonstration Scenarios:**
  1. `[Simulate Motor Overload]`: Spikes current to 386 A, triggers ANSI 51 timing countdown and ANSI 49 thermal trip.
  2. `[Simulate Belt Sway (CV-103)]`: Injects sway limit switch trip and observes immediate cascaded shutdown of CV-102 & CV-101.
  3. `[Simulate Earth Fault (50N)]`: Injects $42.8\text{ A}$ ground fault, triggering $40\text{ ms}$ high-speed VCB trip.
  4. `[Emergency Pull-Cord Trip]`: Simulates physical pull-cord rope trigger on CV-102 with upstream stoppage.
  5. `[System Reset & Breaker Close]`: Re-sequences startup permissives and recloses breaker with realistic mechanical audio.
- **Sequence of Events (SOE) Recorder:** High-resolution event chronometer logging timestamped millisecond telemetry transitions.

---

## 🔊 Web Audio API Industrial Sound Synthesizer

Includes an integrated sound generator reproducing authentic control room audio:
- **Master Trip Siren:** Descending dual-frequency sweep ($1050\text{ Hz} \rightarrow 550\text{ Hz}$) with lowpass filtering.
- **Mechanical Breaker Clack:** Heavy spring-discharge thump with high-energy contact impact noise burst.
- **Warning Annunciator:** Dual-tone sine beeper ($880\text{ Hz} / 1174\text{ Hz}$) for sub-critical interlock alerts.
- **Mute / Unmute Control:** Fully controllable via top navigation bar.

---

## 💻 Tech Stack & Engineering Standards

- **Core Framework:** TypeScript 5.8+, Vite 6, Modern ESM Modules.
- **Styling Architecture:** Custom Dark Slate Industrial SCADA CSS (`#070b14`, `#0b1120`, `#0f172a`), glowing borders, CRT scanlines, tabular monospace digital meters.
- **Rendering Engines:** Scalable Vector Graphics (SVG) with hardware accelerated CSS keyframes, HTML5 Canvas 2D.
- **Audio:** Web Audio API (OscillatorNode, BiquadFilterNode, GainNode).
- **Standards Complied:** IEEE C37.2 (ANSI Device Numbers), IEC 60255 (Protection Relays), ISO 10816-3 (Machine Vibration Severity), CEMAT Automation Philosophy.

---

## 🚀 Local Development & Build

```bash
# Clone the repository
git clone https://github.com/Tareq0001/KilnSync-Cement-Plant-SCADA.git
cd KilnSync-Cement-Plant-SCADA

# Install dependencies
npm install

# Start development server
npm run dev

# Compile TypeScript and build production bundle
npm run build
```

---

## 👨‍💻 Lead Systems Architect

**أ. طارق ابوعشي**  
*Lead Electrical & Automation Systems Engineer*  
*Specialist in Industrial SCADA, Digital Twins, Power Distribution & Machine Learning Telemetry*  
[Portfolio](https://tareq0001.github.io/) &bull; [GitHub](https://github.com/Tareq0001)

---
*© 2026 KILN-SYNC. Engineered for mission-critical industrial automation.*
