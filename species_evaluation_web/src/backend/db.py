import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

DB_HOST = os.getenv("MYSQLHOST")
DB_PORT = os.getenv("MYSQLPORT") or "3306"
DB_USER = os.getenv("MYSQLUSER")
DB_PASS = os.getenv("MYSQLPASSWORD")
DB_NAME = os.getenv("MYSQLDATABASE")

if not all([DB_HOST, DB_USER, DB_PASS, DB_NAME]):
    raise RuntimeError(
        f"Missing env vars. MYSQLHOST={DB_HOST}, MYSQLUSER={DB_USER}, MYSQLDATABASE={DB_NAME}"
    )

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()




