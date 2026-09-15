## API Reference

Base URL: `http://localhost:8000`

Swagger UI: `/docs`  Redoc: `/redoc`

### Auth
#### POST /auth/login
Request:
```json
{ "username": "admin", "password": "medicare@ai" }
```
Response:
```json
{ "access_token": "<jwt>", "token_type": "bearer", "username": "admin" }
```

#### GET /auth/me (JWT)
Response:
```json
{ "username": "admin", "role": "admin" }
```

### Chat
#### POST /chat
Request:
```json
{ "messages": [ { "role": "user", "content": "I have fever and cough" } ] }
```
Response:
```json
{ "response": "...ends with SYMPTOMS: [\"fever\", \"cough\"]" }
```

### Prediction
#### POST /predict
Request:
```json
{ "symptoms": ["headache", "nausea"], "patient_id": "optional" }
```
Response (simplified):
```json
{
  "disease": "Migraine",
  "confidence": 0.85,
  "department": "Neurology",
  "doctor_level": "senior",
  "matched_symptoms": ["headache"],
  "unmatched_symptoms": ["nausea"]
}
```

### Booking
#### POST /book
Request:
```json
{
  "patient_name": "John Doe",
  "patient_phone": "+1234567890",
  "patient_email": "john@example.com",
  "doctor_name": "optional",
  "doctor_level": "senior",
  "department": "Neurology",
  "appointment_date": "2025-01-15",
  "appointment_time": "10:00",
  "symptoms": "fever, cough",
  "mode": "ai"
}
```
Response:
```json
{
  "status": "booked",
  "appointment": {
    "booking_id": "APP1234",
    "doctor_name": "Dr. ...",
    "department": "Neurology",
    "doctor_level": "senior",
    "appointment_date": "2025-01-15",
    "appointment_time": "10:00"
  }
}
```

### Appointments (JWT)
#### GET /appointments
Query: `?patient_email=` optional

#### GET /appointments/{appointment_id}

#### PATCH /appointments/{appointment_id}?status=scheduled|upcoming|completed|cancelled|rescheduled

#### DELETE /appointments/{appointment_id}

### Utility
#### GET /booked-slots?doctor_name=...&appointment_date=YYYY-MM-DD
Response:
```json
{ "booked_slots": ["10:00", "11:00"], "doctor_name": "Dr. ...", "date": "YYYY-MM-DD" }
```

#### GET /departments
#### GET /diseases
#### GET /health


