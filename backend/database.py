import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path, override=True)

mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)

db = client["studygenie"]

users_collection = db["users"]