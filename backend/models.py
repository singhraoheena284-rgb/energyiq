from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class EnergyData(Base):
    __tablename__ = "energy_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    consumption_kwh = Column(Float)
    solar_generation_kwh = Column(Float)
    predicted_demand_kwh = Column(Float)
    carbon_emissions_kg = Column(Float)

class OccupancyLog(Base):
    __tablename__ = "occupancy_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    zone_name = Column(String, index=True)
    people_count = Column(Integer)
    is_active = Column(Boolean, default=True)

class SystemEvent(Base):
    __tablename__ = "system_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    service = Column(String, index=True)
    status = Column(String)
    message = Column(String)
