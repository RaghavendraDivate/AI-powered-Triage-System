from datetime import datetime, timedelta
import random
import logging
from app.database import get_db
from app.models import AppointmentDB, DoctorDB

logger = logging.getLogger(__name__)

class AppointmentScheduler:
    def __init__(self, db=None):
        self.db = db
        self.appointments = {}
        self.doctors = {
            "General Medicine": [
                {"name": "Dr. Priya Sharma", "level": "senior"},
                {"name": "Dr. Rajesh Kumar", "level": "senior"},
                {"name": "Dr. Kavya Menon", "level": "senior"},
                {"name": "Dr. Arjun Patel", "level": "junior"}
            ],
            "Cardiology": [
                {"name": "Dr. Vikram Reddy", "level": "senior"},
                {"name": "Dr. Anita Gupta", "level": "senior"},
                {"name": "Dr. Suresh Nair", "level": "senior"},
                {"name": "Dr. Sneha Jain", "level": "junior"}
            ],
            "Neurology": [
                {"name": "Dr. Ramesh Iyer", "level": "senior"},
                {"name": "Dr. Meera Krishnan", "level": "senior"},
                {"name": "Dr. Anil Agarwal", "level": "senior"},
                {"name": "Dr. Pooja Verma", "level": "junior"}
            ],
            "Pulmonology": [
                {"name": "Dr. Deepak Singh", "level": "senior"},
                {"name": "Dr. Sunita Rao", "level": "senior"},
                {"name": "Dr. Manoj Chopra", "level": "senior"},
                {"name": "Dr. Ritika Bansal", "level": "junior"}
            ],
            "Gastroenterology": [
                {"name": "Dr. Sanjay Mehta", "level": "senior"},
                {"name": "Dr. Ritu Malhotra", "level": "senior"},
                {"name": "Dr. Ashok Pandey", "level": "senior"},
                {"name": "Dr. Rohit Saxena", "level": "junior"}
            ],
            "Dermatology": [
                {"name": "Dr. Neha Kapoor", "level": "senior"},
                {"name": "Dr. Vivek Tiwari", "level": "senior"},
                {"name": "Dr. Smita Desai", "level": "senior"},
                {"name": "Dr. Karan Bhatia", "level": "junior"}
            ],
            "Infectious Diseases": [
                {"name": "Dr. Abhishek Joshi", "level": "senior"},
                {"name": "Dr. Shweta Sinha", "level": "senior"},
                {"name": "Dr. Manish Goyal", "level": "senior"},
                {"name": "Dr. Priyanka Mishra", "level": "junior"}
            ],
            "Orthopedics": [
                {"name": "Dr. Raghavan Pillai", "level": "senior"},
                {"name": "Dr. Lakshmi Venkat", "level": "senior"},
                {"name": "Dr. Harish Bhargava", "level": "senior"},
                {"name": "Dr. Tanvi Shah", "level": "junior"}
            ]
        }
        logger.info("Scheduler initialized")

    async def initialize_doctors(self):
        """Initialize doctors in MongoDB if not already present"""
        if self.db is None:
            logger.warning("No database connection, skipping doctor initialization")
            return
        
        doctors_collection = self.db["doctors"]
        
        # Check if doctors already exist
        count = await doctors_collection.count_documents({})
        if count > 0:
            logger.info(f"Doctors already initialized ({count} doctors found)")
            return
        
        # Insert doctors into MongoDB
        all_doctors = []
        for department, doctor_list in self.doctors.items():
            for doctor in doctor_list:
                doc = DoctorDB(
                    name=doctor["name"],
                    level=doctor["level"],
                    department=department
                )
                all_doctors.append(doc.dict(by_alias=True))
        
        if all_doctors:
            await doctors_collection.insert_many(all_doctors)
            logger.info(f"Initialized {len(all_doctors)} doctors in database")

    async def book_appointment(self, department: str, doctor_level: str, appointment_data: dict = None) -> dict:
        """Book appointment with proper doctor level handling and save to MongoDB"""
        try:
            # Get available doctors in the department
            department_doctors = self.doctors.get(department, [])
            
            # Filter by required level
            suitable_doctors = [
                doc for doc in department_doctors 
                if self._matches_level(doc["level"], doctor_level)
            ]
            
            if not suitable_doctors:
                # Fallback to general medicine if no specialist available
                suitable_doctors = self.doctors.get("General Medicine", [])
                department = "General Medicine"
            
            # Select random doctor
            doctor = random.choice(suitable_doctors) if suitable_doctors else None
            
            if not doctor:
                logger.error(f"No suitable doctor found for department '{department}' and level '{doctor_level}'")
                return {"error": "No available doctors found"}

            # Generate appointment time; seniors get earlier days
            days = 1 if "senior" in doctor_level.lower() or "general" in doctor_level.lower() else 3
            appointment_time = datetime.now() + timedelta(days=days)
            
            # Create appointment ID
            appt_id = f"APP{random.randint(1000,9999)}"
            
            # Store appointment in memory
            self.appointments[appt_id] = {
                "doctor": doctor["name"],
                "level": doctor["level"],
                "department": department,
                "time": appointment_time.isoformat()
            }
            
            # Save to MongoDB if appointment_data is provided and db is available
            if self.db is not None and appointment_data:
                appointments_collection = self.db["appointments"]
                appointment_doc = AppointmentDB(
                    appointment_id=appt_id,
                    patient_name=appointment_data.get("patient_name", ""),
                    patient_phone=appointment_data.get("patient_phone", ""),
                    patient_email=appointment_data.get("patient_email", ""),
                    doctor_name=doctor["name"],
                    doctor_level=doctor["level"],
                    department=department,
                    appointment_date=appointment_data.get("appointment_date", ""),
                    appointment_time=appointment_data.get("appointment_time", ""),
                    symptoms=appointment_data.get("symptoms", ""),
                    mode=appointment_data.get("mode", "ai")
                )
                await appointments_collection.insert_one(appointment_doc.dict(by_alias=True))
                logger.info(f"Appointment {appt_id} saved to database")
            
            return {
                "appointment_id": appt_id,
                "doctor": doctor["name"],
                "level": doctor["level"],
                "department": department,
                "time": appointment_time.strftime("%Y-%m-%d %H:%M")
            }
        
        except Exception as e:
            logger.error(f"Booking failed: {str(e)}")
            return {"error": f"Appointment booking failed: {str(e)}"}

    async def book_appointment_with_doctor(self, doctor_name: str, doctor_level: str, department: str, appointment_data: dict = None) -> dict:
        """Book appointment with a specific doctor (manual selection)"""
        try:
            # Find the specific doctor in the department
            department_doctors = self.doctors.get(department, [])
            doctor = None
            
            for doc in department_doctors:
                if doc["name"] == doctor_name:
                    doctor = doc
                    break
            
            if not doctor:
                logger.error(f"Doctor '{doctor_name}' not found in department '{department}'")
                return {"error": f"Doctor {doctor_name} not found"}
            
            # Validate doctor level matches (optional check)
            if doctor["level"] != doctor_level.lower():
                logger.warning(f"Doctor level mismatch: expected {doctor_level}, got {doctor['level']}")
            
            # Create appointment ID
            appt_id = f"APP{random.randint(1000,9999)}"
            
            # Store appointment in memory
            self.appointments[appt_id] = {
                "doctor": doctor["name"],
                "level": doctor["level"],
                "department": department,
                "time": appointment_data.get("appointment_time", "")
            }
            
            # Save to MongoDB if appointment_data is provided and db is available
            if self.db is not None and appointment_data:
                appointments_collection = self.db["appointments"]
                appointment_doc = AppointmentDB(
                    appointment_id=appt_id,
                    patient_name=appointment_data.get("patient_name", ""),
                    patient_phone=appointment_data.get("patient_phone", ""),
                    patient_email=appointment_data.get("patient_email", ""),
                    doctor_name=doctor["name"],
                    doctor_level=doctor["level"],
                    department=department,
                    appointment_date=appointment_data.get("appointment_date", ""),
                    appointment_time=appointment_data.get("appointment_time", ""),
                    symptoms=appointment_data.get("symptoms", ""),
                    mode=appointment_data.get("mode", "manual")
                )
                await appointments_collection.insert_one(appointment_doc.dict(by_alias=True))
                logger.info(f"Appointment {appt_id} saved to database with doctor {doctor_name}")
            
            return {
                "appointment_id": appt_id,
                "doctor": doctor["name"],
                "level": doctor["level"],
                "department": department,
                "time": appointment_data.get("appointment_time", "")
            }
        
        except Exception as e:
            logger.error(f"Booking with specific doctor failed: {str(e)}")
            return {"error": f"Appointment booking failed: {str(e)}"}

    def _matches_level(self, doctor_level: str, required_level: str) -> bool:
        """Check if doctor level matches requirements"""
        doctor_level_l = doctor_level.lower()
        required_level_l = required_level.lower()
        if "general" in required_level_l:
            return "general" in doctor_level_l
        if "junior" in required_level_l:
            return "junior" in doctor_level_l
        if "senior" in required_level_l:
            return "senior" in doctor_level_l
        return False
