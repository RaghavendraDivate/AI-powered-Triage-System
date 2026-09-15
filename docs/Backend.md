## Backend (FastAPI)

### Modules
- `app.main`: FastAPI app, routes, CORS, lifecycle events, logging, email
- `app.predictor`: `DiseasePredictor` (loads joblib model, predicts disease, maps department/level, severity)
- `app.scheduler`: `AppointmentScheduler` (doctor registry, booking, Mongo persistence)
- `app.database`: Motor client for MongoDB, `get_db()` helper
- `app.models`: Pydantic models for MongoDB documents
- `app.auth`: JWT auth utilities and admin guard

### Startup Lifecycle
- Loads model and CSV; computes symptom list
- Builds Gemini system prompt
- Initializes email configuration
- On startup: connects Mongo, sets scheduler DB, initializes doctors collection

### Key Endpoints
- `POST /auth/login` → returns JWT token
- `GET /auth/me` → current admin (JWT)
- `POST /chat` → Gemini chat for symptoms
- `POST /predict` → ML disease prediction from symptoms
- `POST /book` → book appointment; sends emails
- `GET /appointments` (JWT) → list appointments; filter by patient_email
- `GET /appointments/{id}` → appointment by id
- `PATCH /appointments/{id}?status=` (JWT) → update status
- `DELETE /appointments/{id}` (JWT) → delete
- `GET /booked-slots?doctor_name&appointment_date` → busy times
- `GET /departments` → unique department names from predictor
- `GET /diseases` → model classes
- `GET /health` → component readiness

### Data Models (MongoDB)
- `appointments`: see `app.models.AppointmentDB`
- `doctors`: see `app.models.DoctorDB`
- `prediction_history`: see `app.models.PredictionHistoryDB`

### Email Templates
- `Backend/templates/appointment_confirmation_patient.html`
- `Backend/templates/appointment_notification_doctor.html`

### Logging
- Writes to stdout and `Backend/hospital.log`


