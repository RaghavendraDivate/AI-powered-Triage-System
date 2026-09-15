from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB database"""
        try:
            mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
            cls.client = AsyncIOMotorClient(mongodb_url, server_api=ServerApi('1'))
            
            # Test the connection
            await cls.client.admin.command('ping')
            logger.info(f"Successfully connected to MongoDB at {mongodb_url}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed")
    
    @classmethod
    def get_database(cls):
        """Get the database instance"""
        db_name = os.getenv("MONGODB_DATABASE", "hospital_system")
        return cls.client[db_name]

# Database getter function
def get_db():
    return MongoDB.get_database()
