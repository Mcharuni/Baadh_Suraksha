# 🌊 BAADH SURAKSHA (BAADH PROTECT)
> **AI-Driven Edge Flood & Urban Drainage Defense System**

BAADH SURAKSHA is a comprehensive hardware-in-the-loop flood management and urban safety platform. It integrates embedded sensor fusion, localized edge control logic, dynamic 3D isometric simulation, remote cloud telemetry, power resilience, and multi-stage hazard responses.

---

## 🏗️ System Architecture

```text
       SURGE / RAINFALL SENSOR & FAULT INPUTS
                        │
                        ▼
      ESP32 EDGE CONTROLLER (LOCAL PIPELINE)
    ├── Local Decision Engine (Hysteresis-based)
    ├── Actuators: Motorized Gate, Water Pump, Sirens
    └── Power System: Solar MPPT + LiFePO4 Battery Backup
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
  Wi-Fi / LoRa TELEMETRY       3D HARDWARE SIMULATION
         │                       (Isometric Canvas)
         ▼
 FLOODSHIELD CLOUD DASHBOARD
```

---

## ⚡ Key Features

- **Decentralized Local Control**: Safety actuators (Diversion Gate, Pump, Sirens, Manhole Grates) operate strictly on the ESP32 local edge layer without relying on cloud availability.
- **Power Resilience Subsystem**: Visualized MPPT solar charging, main AC power failure fallback, and battery drain/charge dynamics.
- **Water Management Loop**: 3-zone flow monitoring, dynamic storage tank level tracking, automated diversion gate control, and secondary drain safe-release validation.
- **Hardware Hazard Protection**: Multi-sensor fusion for Electrical Hazard Isolation, Manhole Displacement, and Debris Blockage detection.
- **Dual View Interface**: Switch between **3D Hardware Simulation View** and **FloodShield Cloud Telemetry View**.

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI & SQLite)

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (React, TypeScript & Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open **http://localhost:3001** (or port indicated by Vite) to view the system dashboard.

---

## 📁 Repository Structure

```text
Baadh_Suraksha/
├── backend/
│   ├── database.py         # SQLAlchemy ORM models & database setup
│   ├── main.py             # FastAPI REST endpoints & embedded logic pipeline
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # UI & Simulation components
│   │   │   ├── CloudDashboard.tsx
│   │   │   ├── CommunicationPanel.tsx
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── EventLogPanel.tsx
│   │   │   ├── PowerSubsystem.tsx
│   │   │   ├── SensorDashboard.tsx
│   │   │   ├── SimulationView.tsx
│   │   │   ├── StateFlow.tsx
│   │   │   └── StatusPanel.tsx
│   │   ├── App.tsx          # Main layout & state polling
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── .gitignore
```
