from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr # Added EmailStr for validation
from app.predictor import DiseasePredictor
from app.scheduler import AppointmentScheduler # Assuming you have this module
from app.database import MongoDB, get_db
from app.models import PredictionHistoryDB
from app.auth import create_access_token, verify_admin, get_current_admin
import logging
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv
from google import genai
import httpx

# --- Email Imports ---
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pathlib import Path
# ---------------------

load_dotenv()


logger = logging.getLogger(__name__)
# Set logging level (INFO for production, DEBUG for development)
log_level = logging.DEBUG if os.getenv("ENV", "production") == "development" else logging.INFO
logging.basicConfig(
    level=log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("hospital.log")]
)

# --- Initialize Global Components ---
predictor: DiseasePredictor = None
scheduler: AppointmentScheduler = None
SYSTEM_PROMPT: str = ""
conf: ConnectionConfig = None # For email

try:
    # Construct absolute paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Ensure these filenames match your actual files
    model_path = os.path.join(base_dir, "data", "rf1_disease_model.joblib")
    csv_path = os.path.join(base_dir, "data", "Training_updated_1.csv")

    # 1. Initialize Predictor and Scheduler (MongoDB will be connected on startup)
    predictor = DiseasePredictor(model_path, csv_path)
    scheduler = AppointmentScheduler()  # DB will be set after MongoDB connection
    logger.info("Predictor and Scheduler initialized")

    # 2. Generate the allowed symptom list as a string
    ALLOWED_SYMPTOMS_LIST_STRING = str(predictor.symptoms_list)
    logger.info(f"Loaded {len(predictor.symptoms_list)} symptoms into prompt.")

    # 3. Define the SYSTEM_PROMPT (Final Version)
    SYSTEM_PROMPT = f"""
You are a friendly and professional AI health assistant for a hospital.
Your primary role is to chat with the patient in natural language to understand their symptoms.

**CRITICAL RULE:** You must ONLY use symptoms from the following official list.
The list uses spaces, not underscores. Do not invent symptoms. Do not use synonyms unless they map exactly to a term below.

**SYNONYM INSTRUCTION (To fix common user input):**
- If the patient mentions "muscle pain," "body aches," or "muscle cramps," you MUST use the exact symptom name: "muscle cramps, contractures, or spasms".
- If the patient mentions "arm swelling" or "swollen arm," use the symptom name "arm swelling".
- If the patient mentions "stomach pain" or "belly ache," ask for clarification using specific abdominal pain types from the list (e.g., 'sharp abdominal pain').

**ALLOWED SYMPTOM LIST:**
{ALLOWED_SYMPTOMS_LIST_STRING}

**Your Goals:**
1.  Ask clarifying follow-up questions to get a clear picture.
2.  Map the patient's descriptions to symptoms *exclusively* from the list above, maintaining spaces.
3.  Once you have gathered at least 2-3 *valid* symptoms, provide a summary.
4.  You MUST end your final response with the symptom list in this exact format (using spaces):
    SYMPTOMS: ["symptom one", "symptom two"]
5.  chat should be atleast 3-4 exchanges long to ensure clarity.
"""
    logger.info("SYSTEM_PROMPT successfully generated.")

    # 4. --- Configure Email Settings ---
    conf = ConnectionConfig(
        MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
        MAIL_FROM=os.getenv("MAIL_FROM"),
        MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
        MAIL_SERVER=os.getenv("MAIL_SERVER"),
        MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True").lower() == "true",
        MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
        MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME"),
        TEMPLATE_FOLDER=Path(__file__).parent.parent / 'templates', # Points to Backend/templates/
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True
    )
    logger.info("Email configuration loaded.")
    # --- Placeholder Emails ---
    TEST_DOCTOR_EMAIL = os.getenv("TEST_DOCTOR_EMAIL", "raghu.18divate@gmail.com")
    # ---------------------------

except Exception as e:
    logger.critical(f"Initialization failed: {e}", exc_info=True) # Added exc_info for detailed traceback
    raise RuntimeError("System initialization failed")


app = FastAPI(title="Hospital Appointment API", version="1.0.0")

# --- MongoDB Lifecycle Events ---
@app.on_event("startup")
async def startup_db():
    """Connect to MongoDB on application startup"""
    try:
        await MongoDB.connect_db()
        # Set database for scheduler
        scheduler.db = get_db()
        # Initialize doctors in database
        if scheduler.db is not None:
            await scheduler.initialize_doctors()
            logger.info("MongoDB connected and initialized successfully")
        else:
            logger.warning("MongoDB database not available")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        # Application can still run without MongoDB (using in-memory storage)

@app.on_event("shutdown")
async def shutdown_db():
    """Close MongoDB connection on application shutdown"""
    await MongoDB.close_db()
# ----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ # Adjust origins for your production frontend
        "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class SymptomsRequest(BaseModel):
    symptoms: list[str]
    patient_id: str = "default"
    conversation_id: str | None = None

class AppointmentRequest(BaseModel):
    patient_name: str
    patient_phone: str # Consider adding validation (e.g., regex, E.164 format)
    patient_email: EmailStr
    doctor_name: str | None = None  # Optional: specific doctor selected by user
    doctor_level: str
    department: str
    appointment_date: str # Consider using date type
    appointment_time: str # Consider using time type
    symptoms: str # Symptoms summary string for the booking record
    mode: str = "ai"

class ChatMessage(BaseModel):
    role: str # 'user' or 'model'
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

class ChatResponse(BaseModel):
    response: str

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    username: str

# --- Gemini API Configuration ---
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    logger.error("Missing required GOOGLE_API_KEY")
    raise RuntimeError("Missing GOOGLE_API_KEY")

try:
    gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
    logger.info("Gemini Client initialized successfully.")
except Exception as e:
    logger.critical(f"Gemini Client initialization failed: {e}", exc_info=True)
    raise RuntimeError("Failed to initialize Gemini Client.")
# ---------------------------------

# --- API Endpoints ---

# --- Authentication Endpoints ---
@app.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Admin login endpoint"""
    if not verify_admin(request.username, request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": request.username})
    logger.info(f"Admin logged in: {request.username}")
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        username=request.username
    )

@app.get("/auth/me")
async def get_current_user(current_admin: dict = Depends(get_current_admin)):
    """Get current authenticated admin info"""
    return current_admin
# ----------------------------------

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_req: ChatRequest):
    """Handles conversational symptom gathering using Gemini."""
    sdk_messages = []
    history_limit = 10 # Limit context window for performance/cost
    relevant_messages = chat_req.messages[-history_limit:]

    for m in relevant_messages:
        role = 'user' if m.role == 'user' else 'model'
        sdk_messages.append({"role": role, "parts": [{"text": m.content}]})

    final_contents = [
        {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
        {"role": "model", "parts": [{"text": "Understood. I will help gather symptoms using only the provided list."}]},
        *sdk_messages
    ]

    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=final_contents
        )
        reply_content = response.text
        if not reply_content:
            logger.warning("Gemini API response missing content.")
            raise HTTPException(status_code=502, detail="AI response missing content")
        return ChatResponse(response=reply_content)
    except genai.errors.APIError as e:
        logger.error(f"Gemini API Error: {e}")
        raise HTTPException(status_code=502, detail=f"AI service error: {e}")
    except Exception as e:
        logger.error(f"Internal error in chat endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during chat processing")

@app.post("/predict")
async def predict_disease(request: SymptomsRequest):
    """Receives a list of symptoms and returns a disease prediction."""
    if not request.symptoms:
        raise HTTPException(status_code=400, detail="No symptoms provided")
    if len(request.symptoms) > 20:
        logger.warning(f"Received {len(request.symptoms)} symptoms, exceeding limit of 20.")
        raise HTTPException(status_code=400, detail="Too many symptoms provided")

    try:
        result = predictor.predict(request.symptoms) # Predictor handles normalization
    except Exception as e:
        logger.error(f"Prediction failed internally: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error during disease prediction process.")

    if "error" in result:
        logger.error(f"Prediction error: {result['error']}. Input: {request.symptoms}")
        detail_msg = result.get("error", "Prediction failed due to invalid symptoms.")
        raise HTTPException(status_code=400, detail=detail_msg)

    # Save prediction history to MongoDB if available
    try:
        db = get_db()
        if db is not None:
            history_collection = db["prediction_history"]
            prediction_history = PredictionHistoryDB(
                patient_id=request.patient_id,
                symptoms=request.symptoms,
                predicted_disease=result.get("disease", ""),
                department=result.get("department", ""),
                doctor_level=result.get("doctor_level", ""),
                severity=result.get("severity", ""),
                confidence=result.get("confidence")
            )
            await history_collection.insert_one(prediction_history.dict(by_alias=True))
            logger.info(f"Prediction history saved for patient {request.patient_id}")
        else:
            logger.warning("Database not available, skipping prediction history save")
    except Exception as e:
        logger.warning(f"Failed to save prediction history: {e}")
        # Don't fail the request if history saving fails - prediction is more important

    # Simplified response
    return result


@app.post("/book")
async def book_appointment(req: AppointmentRequest):
    """Books an appointment and sends email notifications."""
    required_fields = ["patient_name", "patient_phone", "patient_email", "department",
                       "appointment_date", "appointment_time", "symptoms"]
    missing = [f for f in required_fields if not getattr(req, f)]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required booking fields: {', '.join(missing)}")
    
    # Check for slot conflicts before booking
    try:
        db = get_db()
        if db is not None:
            appointments_collection = db["appointments"]
            # Check if exact same patient (email + name) + date + time combination exists
            # This allows:
            # 1. Same email to book for different people (family members)
            # 2. Same person to book multiple appointments on same date at different times
            # 3. Different patients to book same time slot with different doctors
            exact_duplicate = await appointments_collection.find_one({
                "patient_email": req.patient_email,
                "patient_name": req.patient_name,
                "appointment_date": req.appointment_date,
                "appointment_time": req.appointment_time,
                "status": {"$ne": "cancelled"}
            })
            if exact_duplicate:
                existing_doctor = exact_duplicate.get("doctor_name", "unknown doctor")
                raise HTTPException(
                    status_code=409, 
                    detail=f"An appointment for {req.patient_name} already exists on {req.appointment_date} at {req.appointment_time} with {existing_doctor}. Please select a different time slot."
                )
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Could not check slot conflicts, proceeding with booking: {e}")

    # --- Booking Logic ---
    try:
        # Prepare appointment data for MongoDB
        appointment_data = {
            "patient_name": req.patient_name,
            "patient_phone": req.patient_phone,
            "patient_email": req.patient_email,
            "appointment_date": req.appointment_date,
            "appointment_time": req.appointment_time,
            "symptoms": req.symptoms,
            "mode": req.mode
        }
        
        # If doctor_name is provided (manual booking), use it directly
        if req.doctor_name:
            doctor_booking = await scheduler.book_appointment_with_doctor(
                doctor_name=req.doctor_name,
                doctor_level=req.doctor_level,
                department=req.department,
                appointment_data=appointment_data
            )
        else:
            # AI mode: let scheduler pick a suitable doctor
            doctor_booking = await scheduler.book_appointment(
                department=req.department,
                doctor_level=req.doctor_level,
                appointment_data=appointment_data
            )
        
        if "error" in doctor_booking:
            raise HTTPException(status_code=500, detail=f"Scheduler error: {doctor_booking['error']}")
    except HTTPException:
        raise
    except Exception as e:
         logger.error(f"Scheduler error: {e}", exc_info=True)
         raise HTTPException(status_code=500, detail="Failed to book appointment due to scheduler error.")

    appointment_details = {
        "patient_name": req.patient_name, "patient_phone": req.patient_phone,
        "patient_email": req.patient_email, "appointment_date": req.appointment_date,
        "appointment_time": req.appointment_time, "symptoms": req.symptoms,
        "doctor_name": doctor_booking.get("doctor", "N/A"),
        "doctor_level": doctor_booking.get("level", "N/A"),
        "department": doctor_booking.get("department", "N/A"),
        "booking_id": doctor_booking.get("appointment_id", "N/A"),
        "mode": req.mode,
    }

    # --- Send Notifications ---
    if not conf:
        logger.error("Email configuration (conf) is None. Skipping notifications.")
        return {"status": "booked_no_notification", "appointment": appointment_details}

    fm = FastMail(conf)
    logger.debug("FastMail object created.")

    # 1. Email to Patient
    patient_message = MessageSchema(
        subject="Your Appointment Confirmation",
        recipients=[req.patient_email], # Use validated patient email
        template_body=appointment_details,
        subtype=MessageType.html
    )
    try:
        logger.info(f"Attempting to send email to patient: {req.patient_email}")
        await fm.send_message(patient_message, template_name="appointment_confirmation_patient.html")
        logger.info(f"SUCCESS: Confirmation email sent to patient: {req.patient_email}")
    except Exception as e:
        logger.critical(f"CRITICAL ERROR sending email to patient {req.patient_email}: {e}", exc_info=True)
        # Log failure, but booking is still successful

    # 2. Email to Doctor (Using Placeholder)
    # TODO: Replace TEST_DOCTOR_EMAIL with DB lookup based on doctor_booking["doctor"]
    doctor_email_recipient = TEST_DOCTOR_EMAIL
    if doctor_email_recipient and doctor_email_recipient != "default_doctor@example.com": # Basic check
        doctor_message = MessageSchema(
            subject="New Appointment Booked",
            recipients=[doctor_email_recipient],
            template_body=appointment_details,
            subtype=MessageType.html
        )
        try:
            logger.info(f"Attempting to send email to doctor: {doctor_email_recipient}")
            await fm.send_message(doctor_message, template_name="appointment_notification_doctor.html")
            logger.info(f"SUCCESS: Notification email sent to doctor: {doctor_email_recipient}")
        except Exception as e:
            logger.critical(f"CRITICAL ERROR sending email to doctor {doctor_email_recipient}: {e}", exc_info=True)
            # Log failure

    logger.info("Email notification attempts finished.")
    return {"status": "booked", "appointment": appointment_details}


# --- Appointment Management Endpoints (Admin Only) ---
@app.get("/appointments")
async def get_appointments(
    patient_email: str = None,
    current_admin: dict = Depends(get_current_admin)
):
    """Fetch all appointments from MongoDB (Admin only)."""
    try:
        db = get_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        appointments_collection = db["appointments"]
        
        # Build query
        query = {}
        if patient_email:
            query["patient_email"] = patient_email
        
        # Fetch appointments sorted by date (newest first)
        appointments = await appointments_collection.find(query).sort("created_at", -1).to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for apt in appointments:
            if "_id" in apt:
                apt["_id"] = str(apt["_id"])
        
        logger.info(f"Retrieved {len(appointments)} appointments" + (f" for {patient_email}" if patient_email else ""))
        return {"appointments": appointments, "count": len(appointments)}
    
    except Exception as e:
        logger.error(f"Error fetching appointments: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch appointments: {str(e)}")

@app.get("/appointments/{appointment_id}")
async def get_appointment_by_id(appointment_id: str):
    """Fetch a specific appointment by its ID."""
    try:
        db = get_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        appointments_collection = db["appointments"]
        appointment = await appointments_collection.find_one({"appointment_id": appointment_id})
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        # Convert ObjectId to string
        if "_id" in appointment:
            appointment["_id"] = str(appointment["_id"])
        
        return appointment
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching appointment {appointment_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch appointment: {str(e)}")

@app.patch("/appointments/{appointment_id}")
async def update_appointment_status(
    appointment_id: str,
    status: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Update appointment status - Admin only."""
    valid_statuses = ["scheduled", "upcoming", "completed", "cancelled", "rescheduled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    try:
        db = get_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        appointments_collection = db["appointments"]
        
        result = await appointments_collection.update_one(
            {"appointment_id": appointment_id},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        logger.info(f"Updated appointment {appointment_id} status to {status}")
        return {"message": "Appointment updated successfully", "appointment_id": appointment_id, "status": status}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating appointment {appointment_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to update appointment: {str(e)}")

@app.delete("/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete an appointment - Admin only."""
    try:
        db = get_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        appointments_collection = db["appointments"]
        
        result = await appointments_collection.delete_one({"appointment_id": appointment_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        logger.info(f"Deleted appointment {appointment_id}")
        return {"message": "Appointment deleted successfully", "appointment_id": appointment_id}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting appointment {appointment_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to delete appointment: {str(e)}")

@app.get("/booked-slots")
async def get_booked_slots(doctor_name: str, appointment_date: str):
    """Get booked slots for a specific doctor on a specific date."""
    try:
        db = get_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        appointments_collection = db["appointments"]
        
        # Find appointments for the doctor on the specific date that are not cancelled
        query = {
            "doctor_name": doctor_name,
            "appointment_date": appointment_date,
            "status": {"$ne": "cancelled"}
        }
        
        appointments = await appointments_collection.find(query).to_list(length=None)
        booked_slots = [apt["appointment_time"] for apt in appointments if "appointment_time" in apt]
        
        logger.info(f"Found {len(booked_slots)} booked slots for {doctor_name} on {appointment_date}")
        return {"booked_slots": booked_slots, "doctor_name": doctor_name, "date": appointment_date}
    
    except Exception as e:
        logger.error(f"Error fetching booked slots: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch booked slots: {str(e)}")

# --- Utility Endpoints ---
@app.get("/departments")
async def get_departments():
    """Returns a list of unique department names."""
    if hasattr(predictor, 'department_map') and predictor.department_map:
        departments = sorted(list(set(predictor.department_map.values())))
        return {"departments": departments}
    logger.warning("Predictor not fully initialized or department map empty.")
    return {"departments": []}

@app.get("/diseases")
async def get_diseases():
    """Returns a list of all diseases the model can predict."""
    if hasattr(predictor, 'department_map') and predictor.department_map:
         diseases = sorted(predictor.department_map.keys())
         return {"diseases": diseases, "count": len(diseases)}
    logger.warning("Predictor not fully initialized or department map empty.")
    return {"diseases": [], "count": 0}

@app.get("/health")
async def health_check():
    """Checks the operational status of the API and its components."""
    predictor_status = {"status": "error", "error": "Predictor not initialized"}
    scheduler_status = "inactive"

    try:
        if predictor:
            predictor_status = predictor.validate_setup()
        if scheduler:
             scheduler_status = "active" # Simple check, assumes scheduler is always active if initialized

        is_ready = predictor_status.get("status") == "healthy" and scheduler_status == "active"

        return {"status": "ok" if is_ready else "partial_error",
                "version": "1.0.0",
                "components": {"predictor": predictor_status, "scheduler": scheduler_status},
                "ready": is_ready}
    except Exception as e:
        logger.error(f"Health check failed critically: {e}", exc_info=True)
        return {"status": "error", "error": "Critical health check failure", "ready": False}