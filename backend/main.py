from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine, SystemState, EventLog
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="Baadh Suraksha API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class StateUpdate(BaseModel):
    rainfall_intensity: float | None = None
    zone1_water_level: float | None = None
    zone2_water_level: float | None = None
    zone3_water_level: float | None = None
    zone1_flow: float | None = None
    zone2_flow: float | None = None
    zone3_flow: float | None = None
    electrical_hazard: bool | None = None
    manhole_displacement: bool | None = None
    debris_blockage: bool | None = None
    emergency_status: bool | None = None
    network_status: bool | None = None
    main_power_status: bool | None = None
    solar_active: bool | None = None
    safe_to_release: bool | None = None

@app.get("/api/state")
def get_state(db: Session = Depends(get_db)):
    state = db.query(SystemState).first()
    if not state:
        state = SystemState()
        db.add(state)
        db.commit()
        db.refresh(state)
        
    logs = db.query(EventLog).order_by(EventLog.id.desc()).limit(10).all()
    
    response_data = {col.name: getattr(state, col.name) for col in state.__table__.columns}
    response_data['logs'] = [{"time": log.timestamp, "msg": log.message} for log in logs]
    
    return response_data

@app.post("/api/state")
def update_state(update: StateUpdate, db: Session = Depends(get_db)):
    state = db.query(SystemState).first()
    if not state:
        state = SystemState()
        db.add(state)
    
    # Update fields
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(state, key, value)
        
    # ==========================================
    # ESP32 EMBEDDED PIPELINE SIMULATION
    # ==========================================
    
    # 1. DATA VALIDATION
    state.rainfall_intensity = max(0.0, state.rainfall_intensity)
    state.zone1_water_level = max(0.0, state.zone1_water_level)
    state.zone2_water_level = max(0.0, state.zone2_water_level)
    state.zone3_water_level = max(0.0, state.zone3_water_level)
    
    # 2. SENSOR FUSION
    max_water = max(state.zone1_water_level, state.zone2_water_level, state.zone3_water_level)
    avg_flow = (state.zone1_flow + state.zone2_flow + state.zone3_flow) / 3.0
    
    # Blockage Suspected: High upstream water level + abnormal/low flow
    state.blockage_suspected = (max_water > 50 and avg_flow < 20) or state.debris_blockage
    
    # 3. LOCAL DECISION ENGINE & STATE MACHINE (With Hysteresis)
    current_state = state.system_status
    new_state = current_state
    log_message = None
    
    is_critical_condition = (
        max_water >= 80 or 
        state.rainfall_intensity >= 80 or 
        state.electrical_hazard or 
        state.manhole_displacement or 
        state.emergency_status
    )
    
    is_warning_condition = (
        max_water >= 50 or 
        state.rainfall_intensity >= 50 or 
        state.blockage_suspected
    )

    is_recovery_safe = (max_water < 60 and not is_critical_condition and not state.emergency_status)
    is_normal_safe = (max_water < 20 and not is_warning_condition and not is_critical_condition and not state.emergency_status)

    if current_state == "NORMAL":
        if is_critical_condition:
            new_state = "CRITICAL"
        elif is_warning_condition:
            new_state = "WARNING"
            
    elif current_state == "WARNING":
        if is_critical_condition:
            new_state = "CRITICAL"
        elif is_normal_safe:
            new_state = "NORMAL"
            
    elif current_state == "CRITICAL":
        if is_recovery_safe:
            new_state = "RECOVERY"
            
    elif current_state == "RECOVERY":
        if is_critical_condition:
            new_state = "CRITICAL"
        elif is_normal_safe:
            new_state = "NORMAL"

    if new_state != current_state:
        log_message = f"State transitioned from {current_state} to {new_state}"
        state.system_status = new_state
        event = EventLog(timestamp=datetime.now().strftime("%H:%M:%S"), message=log_message)
        db.add(event)

    # Tank Dynamics
    if state.gate_status:
        state.storage_level = min(100.0, state.storage_level + (avg_flow * 0.1))
        
    if state.pump_status:
        state.storage_level = max(0.0, state.storage_level - 15.0)

    # Actuator Control based on confirmed state
    if state.system_status == "CRITICAL":
        state.gate_status = True
        state.pump_status = state.safe_to_release and state.storage_level > 10.0
    elif state.system_status == "WARNING":
        state.gate_status = True
        state.pump_status = False # Save power unless critical
    elif state.system_status == "RECOVERY":
        state.gate_status = False
        state.pump_status = state.safe_to_release and state.storage_level > 0.0
    else: # NORMAL
        state.gate_status = False
        state.pump_status = False
        
    # Overflow Protection
    if state.storage_level >= 95.0 and not state.safe_to_release and current_state != "CRITICAL":
        log_message = "STORAGE CRITICAL: Tank full and release is unsafe!"
        event = EventLog(timestamp=datetime.now().strftime("%H:%M:%S"), message=log_message)
        db.add(event)
        
    # Power System Dynamics
    if not state.main_power_status:
        # Drain battery
        drain_rate = 3.0 if state.pump_status else 1.0
        state.battery_status = max(0.0, state.battery_status - drain_rate)
    elif state.main_power_status and state.battery_status < 100.0:
        # Charge from main power
        state.battery_status = min(100.0, state.battery_status + 5.0)

    if state.solar_active and state.battery_status < 100.0:
        # Solar trickle charge
        state.battery_status = min(100.0, state.battery_status + 0.5)

    # ESP32 Shutdown Logic
    if state.battery_status <= 0.0 and not state.main_power_status:
        state.system_status = "NORMAL" # Dead system
        state.gate_status = False
        state.pump_status = False
        # Log failure
        log_message = "CRITICAL FAILURE: ESP32 SHUTDOWN DUE TO POWER LOSS"
        db.add(EventLog(timestamp=datetime.now().strftime("%H:%M:%S"), message=log_message))
        
    db.commit()
    db.refresh(state)
    
    # Fetch latest 10 logs
    logs = db.query(EventLog).order_by(EventLog.id.desc()).limit(10).all()
    
    response_data = {col.name: getattr(state, col.name) for col in state.__table__.columns}
    response_data['logs'] = [{"time": log.timestamp, "msg": log.message} for log in logs]
    
    return response_data
