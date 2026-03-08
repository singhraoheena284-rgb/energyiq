from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Energy Data
class EnergyDataBase(BaseModel):
    consumption_kwh: float
    solar_generation_kwh: float
    predicted_demand_kwh: float
    carbon_emissions_kg: float

class EnergyDataCreate(EnergyDataBase):
    pass

class EnergyDataResponse(EnergyDataBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

# Occupancy
class OccupancyLogBase(BaseModel):
    zone_name: str
    people_count: int
    is_active: Optional[bool] = True

class OccupancyLogCreate(OccupancyLogBase):
    pass

class OccupancyLogResponse(OccupancyLogBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

# System Event
class SystemEventBase(BaseModel):
    service: str
    status: str
    message: str

class SystemEventCreate(SystemEventBase):
    pass

class SystemEventResponse(SystemEventBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True
