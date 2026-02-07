from sqlalchemy import Column, Integer, Float, DateTime
from datetime import datetime
from db import Base

class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    S1 = Column(Float);  S2 = Column(Float);  S3 = Column(Float);  S4 = Column(Float);  S5 = Column(Float)
    S6 = Column(Float);  S7 = Column(Float);  S8 = Column(Float);  S9 = Column(Float);  S10 = Column(Float)
    S11 = Column(Float); S12 = Column(Float); S13 = Column(Float); S14 = Column(Float); S15 = Column(Float)
    S16 = Column(Float); S17 = Column(Float); S18 = Column(Float); S19 = Column(Float); S20 = Column(Float)

    prediction = Column(Float)
