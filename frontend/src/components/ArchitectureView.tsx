import type { SystemState } from '../App';
import './ArchitectureView.css';
import { Cpu, Activity, Droplets, Radio, ShieldCheck, Zap, Sun, Battery, AlertOctagon, Volume2, Cloud, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  state: SystemState;
}

export default function ArchitectureView({ state }: Props) {
  const hardwareList = [
    { name: "ESP32 Microcontroller", spec: "32-bit Dual-Core LX6 @ 240MHz, Wi-Fi & LoRa Interface", icon: Cpu, type: "Core Edge MCU" },
    { name: "Tipping Bucket Rain Gauge", spec: "0.2mm per tip resolution, digital pulse counter", icon: Activity, type: "Sensor" },
    { name: "Ultrasonic Water-Level Sensors", spec: "JSN-SR04T Waterproof Transducers x3 (Zones 1-3)", icon: Droplets, type: "Sensor" },
    { name: "Hall-Effect Flow Sensors", spec: "YF-S201 High-Precision Turbine Flow Meters x3", icon: Droplets, type: "Sensor" },
    { name: "Electrical Hazard Detection", spec: "ZMPT101B AC Voltage Sensing & Isolation Module", icon: Zap, type: "Safety Sensor" },
    { name: "Manhole Displacement Sensor", spec: "MPU-6050 6-DOF Gyro & Tilt Proximity Module", icon: AlertOctagon, type: "Safety Sensor" },
    { name: "Servo Diversion Gates", spec: "MG996R Metal Gear High-Torque Servo Motors", icon: ShieldCheck, type: "Actuator" },
    { name: "Submersible Water Pump", spec: "12V DC 800L/H High-Flow Transfer Pump", icon: Droplets, type: "Actuator" },
    { name: "Industrial Warning Siren", spec: "110dB High-Decibel Acoustic Warning Horn", icon: Volume2, type: "Actuator" },
    { name: "Monocrystalline Solar Panel", spec: "18.5V 45W Photovoltaic Array with MPPT", icon: Sun, type: "Power Subsystem" },
    { name: "LiFePO4 Deep-Cycle Battery", spec: "12.8V 20Ah Lithium Iron Phosphate Battery Pack", icon: Battery, type: "Power Subsystem" }
  ];

  return (
    <div className="architecture-container">
      
      {/* 1. Architecture Legend */}
      <div className="legend-panel">
        <div className="legend-title">ARCHITECTURE LEGEND</div>
        <div className="legend-items">
          <div className="legend-item"><span className="dot dot-sensor"></span> SENSOR DATA</div>
          <div className="legend-item"><span className="dot dot-control"></span> CONTROL SIGNAL</div>
          <div className="legend-item"><span className="dot dot-water"></span> WATER FLOW</div>
          <div className="legend-item"><span className="dot dot-comm"></span> COMMUNICATION</div>
        </div>
      </div>

      {/* 2. System Architecture Diagrams */}
      <div className="architecture-diagrams">
        
        {/* Pipeline 1: Local Edge Control Flow */}
        <div className="diagram-card">
          <div className="diagram-header">
            <Cpu size={18} className="icon-cyan" />
            <h3>LOCAL EDGE CONTROL PIPELINE (DECENTRALIZED SAFETY)</h3>
          </div>

          <div className="pipeline-flow">
            <div className="flow-box box-sensor">
              <Activity size={16} />
              <span>SENSORS</span>
              <div className="sub-label">Rain, Level, Flow, Hazard</div>
            </div>

            <div className="flow-arrow">➔</div>

            <div className="flow-box box-mcu">
              <Cpu size={16} />
              <span>ESP32 MCU</span>
              <div className="sub-label">Local Sampling</div>
            </div>

            <div className="flow-arrow">➔</div>

            <div className="flow-box box-fusion">
              <Activity size={16} />
              <span>SENSOR FUSION</span>
              <div className="sub-label">Blockage & Surge Check</div>
            </div>

            <div className="flow-arrow">➔</div>

            <div className="flow-box box-engine">
              <ShieldCheck size={16} />
              <span>DECISION ENGINE</span>
              <div className="sub-label">Hysteresis State Machine</div>
            </div>

            <div className="flow-arrow">➔</div>

            <div className="flow-box box-actuator">
              <Zap size={16} />
              <span>ACTUATORS</span>
              <div className="sub-label">Gates, Pumps, Sirens</div>
            </div>
          </div>
        </div>

        {/* Pipeline 2: Cloud Telemetry Flow */}
        <div className="diagram-card">
          <div className="diagram-header">
            <Cloud size={18} className="icon-blue" />
            <h3>CLOUD TELEMETRY & MONITORING PIPELINE</h3>
          </div>

          <div className="pipeline-flow">
            <div className="flow-box box-mcu">
              <Cpu size={16} />
              <span>ESP32</span>
              <div className="sub-label">Telemetry Output</div>
            </div>

            <div className="flow-arrow">➔</div>

            <div className="flow-box box-comm">
              <Radio size={16} />
              <span>Wi-Fi / LoRa</span>
              <div className="sub-label">Wireless Transport</div>
            </div>

            <div className="flow-arrow">➔</div>

            <div className="flow-box box-cloud">
              <Cloud size={16} />
              <span>CLOUD SERVER</span>
              <div className="sub-label">FastAPI Backend</div>
            </div>

            <div className="flow-arrow">➔</div>

            <div className="flow-box box-dashboard">
              <CheckCircle2 size={16} />
              <span>FLOODSHIELD</span>
              <div className="sub-label">Web Portal View</div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Hardware Components Panel */}
      <div className="hardware-panel">
        <div className="hardware-header">
          <Cpu size={18} className="icon-purple" />
          <h3>HARDWARE COMPONENTS SPECIFICATION (BILL OF MATERIALS)</h3>
        </div>

        <div className="hardware-grid">
          {hardwareList.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="hw-card">
                <div className="hw-card-top">
                  <IconComp size={18} className="hw-icon" />
                  <span className="hw-name">{item.name}</span>
                </div>
                <div className="hw-spec">{item.spec}</div>
                <div className="hw-type-tag">{item.type}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
