from sqlalchemy import create_engine, Column, Integer, Float, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./baadh_suraksha.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class EventLog(Base):
    __tablename__ = "event_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String)
    message = Column(String)

class SystemState(Base):
    __tablename__ = "system_state"

    id = Column(Integer, primary_key=True, index=True)
    rainfall_intensity = Column(Float, default=0.0)
    zone1_water_level = Column(Float, default=0.0)
    zone2_water_level = Column(Float, default=0.0)
    zone3_water_level = Column(Float, default=0.0)
    zone1_flow = Column(Float, default=0.0)
    zone2_flow = Column(Float, default=0.0)
    zone3_flow = Column(Float, default=0.0)
    
    storage_level = Column(Float, default=0.0)
    safe_to_release = Column(Boolean, default=True)
    electrical_hazard = Column(Boolean, default=False)
    manhole_displacement = Column(Boolean, default=False)
    debris_blockage = Column(Boolean, default=False)
    emergency_status = Column(Boolean, default=False)
    network_status = Column(Boolean, default=True)
    main_power_status = Column(Boolean, default=True)
    solar_active = Column(Boolean, default=True)
    blockage_suspected = Column(Boolean, default=False)
    
    # Outputs
    system_status = Column(String, default="NORMAL") # NORMAL, WARNING, CRITICAL, RECOVERY
    gate_status = Column(Boolean, default=False)
    pump_status = Column(Boolean, default=False)
    battery_status = Column(Float, default=100.0)

Base.metadata.create_all(bind=engine)
