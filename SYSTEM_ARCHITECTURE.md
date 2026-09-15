# System Architecture - Hospital Appointment Scheduling System

## 📋 Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [Component Architecture](#component-architecture)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Technology Stack](#technology-stack)
5. [Database Schema](#database-schema)
6. [API Architecture](#api-architecture)
7. [Security Architecture](#security-architecture)

---

## 🏗️ High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│         Browser (Chrome, Firefox, Safari, Mobile)            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                   HTTP/HTTPS REST API
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                   PRESENTATION LAYER                         │
│              React Frontend (Vite + Tailwind)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Services │  │  Store   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    CORS + JSON/REST
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                   APPLICATION LAYER                          │
│                FastAPI Backend (Python)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │   Auth   │  │Predictor │  │Scheduler │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                   MongoDB Driver (Motor)
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                      DATA LAYER                              │
│                   MongoDB Database                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Appoint-  │  │ Doctors  │  │ Patients │  │ History  │   │
│  │ments     │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │Gemini AI │  │  Email   │  │   SMS    │                  │
│  │  (Chat)  │  │ Service  │  │ Service  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Architecture

### Frontend Architecture

```
Frontend/
├── Pages Layer
│   ├── Landing.jsx         - Home page with features
│   ├── Chat.jsx            - AI symptom chat interface
│   ├── BookingNew.jsx      - Appointment booking form
│   ├── Confirmation.jsx    - Booking confirmation
│   ├── MyAppointments.jsx  - View user appointments
│   ├── AdminLogin.jsx      - Admin authentication
│   ├── Doctors.jsx         - Doctor listing
│   └── Contact.jsx         - Contact information
│
├── Components Layer
│   ├── UI Components (Radix UI)
│   │   ├── Button, Card, Input
│   │   ├── Select, Dialog, Alert
│   │   └── Dropdown, Tabs, Toast
│   └── Custom Components
│       ├── Header, Footer
│       └── Loading, Error States
│
├── Services Layer
│   └── api.js
│       ├── predictDisease()
│       ├── chatWithAI()
│       ├── bookAppointment()
│       ├── getAppointments()
│       ├── getBookedSlots()
│       └── adminLogin()
│
├── State Management
│   ├── Zustand Store
│   └── localStorage Utils
│
└── Utilities
    ├── localStorage.js
    ├── validators.js
    └── helpers.js
```

### Backend Architecture

```
Backend/
├── API Layer (main.py)
│   ├── FastAPI Application
│   ├── CORS Middleware
│   ├── Logging Configuration
│   └── Error Handling
│
├── Endpoints
│   ├── /auth/login          - Admin authentication
│   ├── /chat                - AI symptom chat
│   ├── /predict             - Disease prediction
│   ├── /book                - Book appointment
│   ├── /appointments        - Get/Update/Delete
│   ├── /booked-slots        - Check availability
│   ├── /departments         - List departments
│   ├── /diseases            - List diseases
│   └── /health              - Health check
│
├── Business Logic
│   ├── predictor.py
│   │   ├── DiseasePredictor Class
│   │   ├── ML Model Loading
│   │   ├── Symptom Normalization
│   │   ├── Disease Prediction
│   │   ├── Department Mapping (385 diseases)
│   │   └── Severity Assessment
│   │
│   ├── scheduler.py
│   │   ├── AppointmentScheduler Class
│   │   ├── Doctor Management (12 departments)
│   │   ├── Booking Logic
│   │   ├── Slot Availability
│   │   └── Conflict Detection
│   │
│   └── auth.py
│       ├── JWT Token Generation
│       ├── Admin Verification
│       └── Password Hashing
│
├── Data Access Layer
│   ├── database.py
│   │   ├── MongoDB Connection
│   │   └── Connection Pool
│   │
│   └── models.py
│       ├── AppointmentDB
│       ├── DoctorDB
│       └── PredictionHistoryDB
│
└── ML/AI Layer
    ├── ML Model (.joblib)
    ├── Training Data (.csv)
    └── Gemini AI Integration
```

---

## 🔄 Data Flow Diagrams

### 1. AI-Powered Appointment Booking

```
Patient → Chat Interface
    ↓
    Enters symptoms: "headache, fever, nausea"
    ↓
Frontend: POST /chat → Backend
    ↓
Backend: Gemini AI API
    ↓
    Parses symptoms from conversation
    ↓
Frontend: Receives SYMPTOMS: [...]
    ↓
    User clicks "Get AI Recommendation"
    ↓
Frontend: POST /predict → Backend
    ↓
Backend: DiseasePredictor
    ├── Normalize symptoms
    ├── Create feature vector (385 features)
    ├── Run ML model
    ├── Map disease → department
    ├── Determine doctor level
    └── Calculate severity
    ↓
Backend: Save to MongoDB (prediction_history)
    ↓
Frontend: Display AI recommendation
    ├── Department: Neurology
    ├── Doctor Level: Senior
    ├── Severity: Moderate
    └── Confidence: 85%
    ↓
Frontend: BookingNew Page
    ├── Pre-fill department & level
    ├── Show available doctors
    ├── Select date & time
    └── Fill patient details
    ↓
Frontend: GET /booked-slots
    ↓
Backend: Query MongoDB for booked slots
    ↓
Frontend: Display available time slots
    ↓
    User submits booking
    ↓
Frontend: POST /book → Backend
    ↓
Backend: AppointmentScheduler
    ├── Validate data
    ├── Check duplicates
    ├── Select doctor
    ├── Save to MongoDB
    └── Send email notifications
    ↓
Frontend: Confirmation Page
    └── Display booking details
```

### 2. Manual Booking Flow

```
Patient → BookingNew Page (Manual Mode)
    ↓
    Select department, doctor, date, time
    ↓
Frontend: POST /book (mode: "manual")
    ↓
Backend: book_appointment_with_doctor()
    ↓
    Save with specified doctor
    ↓
Confirmation Page
```

### 3. Admin Dashboard Flow

```
Admin → Login Page
    ↓
Frontend: POST /auth/login
    ↓
Backend: Verify credentials → JWT token
    ↓
Frontend: Store token
    ↓
Admin Dashboard
    ├── GET /appointments (with JWT)
    ├── PATCH /appointments/:id (update status)
    └── DELETE /appointments/:id (cancel)
```

---

## 🛠️ Technology Stack

### Frontend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.x |
| Vite | Build Tool | 5.x |
| Tailwind CSS | Styling | 3.x |
| Radix UI | Component Library | Latest |
| Zustand | State Management | 4.x |
| React Router | Routing | 6.x |
| Lucide React | Icons | Latest |

### Backend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| FastAPI | Web Framework | 0.100+ |
| Python | Language | 3.10+ |
| Uvicorn | ASGI Server | Latest |
| Pydantic | Data Validation | 2.x |
| Motor | MongoDB Driver | Latest |
| Scikit-learn | ML Library | 1.3+ |
| Pandas | Data Processing | 2.x |
| Joblib | Model Serialization | Latest |
| FastAPI-Mail | Email Service | Latest |
| PyJWT | JWT Authentication | Latest |

### Database & Storage
| Technology | Purpose |
|------------|---------|
| MongoDB | Primary Database |
| localStorage | Client-side Storage |

### External Services
| Service | Purpose |
|---------|---------|
| Google Gemini AI | Symptom Chat |
| SMTP Email | Notifications |

---

## 💾 Database Schema

### MongoDB Collections

#### 1. appointments
```json
{
  "_id": "ObjectId",
  "appointment_id": "string (UUID)",
  "patient_name": "string",
  "patient_email": "string",
  "patient_phone": "string",
  "doctor_name": "string",
  "doctor_level": "string (senior/junior)",
  "department": "string",
  "appointment_date": "string (YYYY-MM-DD)",
  "appointment_time": "string (HH:MM)",
  "symptoms": "string",
  "mode": "string (ai/manual)",
  "status": "string (scheduled/completed/cancelled)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### 2. doctors
```json
{
  "_id": "ObjectId",
  "name": "string",
  "department": "string",
  "level": "string (senior/junior)",
  "email": "string",
  "phone": "string",
  "specialization": "string",
  "available_days": ["array of strings"],
  "available_hours": {
    "start": "string",
    "end": "string"
  }
}
```

#### 3. prediction_history
```json
{
  "_id": "ObjectId",
  "patient_id": "string",
  "symptoms": ["array of strings"],
  "predicted_disease": "string",
  "department": "string",
  "doctor_level": "string",
  "severity": "string",
  "confidence": "float",
  "timestamp": "datetime"
}
```

### localStorage Schema (Frontend)

#### appointments
```json
{
  "appointments": [
    {
      "id": "string",
      "patientName": "string",
      "doctorName": "string",
      "date": "string",
      "time": "string",
      "status": "string"
    }
  ]
}
```

#### conversation_history
```json
{
  "conversation_id": "string",
  "messages": [
    {
      "role": "string (user/model)",
      "content": "string",
      "timestamp": "number"
    }
  ],
  "lastUpdated": "number",
  "symptoms": ["array of strings"]
}
```

---

## 🔌 API Architecture

### REST API Endpoints

#### Authentication
```
POST   /auth/login          - Admin login (returns JWT)
GET    /auth/me             - Get current admin info
```

#### Chat & Prediction
```
POST   /chat                - AI symptom chat
POST   /predict             - Disease prediction from symptoms
```

#### Appointments
```
POST   /book                - Book new appointment
GET    /appointments        - Get all appointments (admin)
GET    /appointments/:id    - Get specific appointment
PATCH  /appointments/:id    - Update appointment status (admin)
DELETE /appointments/:id    - Delete appointment (admin)
GET    /booked-slots        - Get booked slots for doctor/date
```

#### Utility
```
GET    /departments         - List all departments
GET    /diseases            - List all diseases
GET    /health              - Health check
```

### Request/Response Examples

#### POST /predict
```json
// Request
{
  "symptoms": ["headache", "fever", "nausea"],
  "patient_id": "optional-id"
}

// Response
{
  "disease": "Migraine",
  "department": "Neurology",
  "doctor_level": "senior",
  "severity": "moderate",
  "confidence": 0.85,
  "symptoms_used": ["headache", "fever", "nausea"]
}
```

#### POST /book
```json
// Request
{
  "patient_name": "John Doe",
  "patient_email": "john@example.com",
  "patient_phone": "+1234567890",
  "doctor_name": "Dr. Priya Sharma",
  "doctor_level": "senior",
  "department": "Neurology",
  "appointment_date": "2024-12-01",
  "appointment_time": "10:00",
  "symptoms": "headache, fever",
  "mode": "ai"
}

// Response
{
  "status": "booked",
  "appointment": {
    "booking_id": "uuid",
    "doctor_name": "Dr. Priya Sharma",
    "appointment_date": "2024-12-01",
    "appointment_time": "10:00"
  }
}
```

---

## 🔒 Security Architecture

### Authentication & Authorization
- **Admin Authentication**: JWT-based tokens
- **Token Expiration**: Configurable (default: 30 minutes)
- **Password Hashing**: Secure hashing algorithm
- **Protected Routes**: Admin-only endpoints require JWT

### Data Security
- **Input Validation**: Pydantic models on backend
- **SQL Injection Prevention**: MongoDB (NoSQL)
- **XSS Prevention**: Input sanitization
- **CORS**: Configured for specific origins only

### API Security
- **Rate Limiting**: 2-second cooldown between chat messages
- **Request Size Limits**: Max 20 symptoms, 100 chars each
- **Error Handling**: No sensitive data in error messages

### Data Privacy
- **Patient Data**: Stored securely in MongoDB
- **Email Encryption**: TLS/STARTTLS for email
- **No Hardcoded Secrets**: Environment variables

---

## 📊 System Metrics

### Performance Characteristics
- **ML Prediction**: < 100ms
- **API Response Time**: < 200ms (avg)
- **Database Queries**: < 50ms (avg)
- **Concurrent Users**: 100+ supported

### Scalability
- **Horizontal Scaling**: FastAPI supports multiple workers
- **Database**: MongoDB Atlas for cloud scaling
- **Caching**: Potential for Redis integration
- **Load Balancing**: Nginx/HAProxy compatible

---

## 🚀 Deployment Architecture

### Development Environment
```
localhost:5173 (Frontend - Vite Dev Server)
localhost:8000 (Backend - Uvicorn)
localhost:27017 (MongoDB)
```

### Production Environment (Recommended)
```
Frontend: Vercel/Netlify (Static hosting)
Backend: AWS EC2/DigitalOcean (Docker container)
Database: MongoDB Atlas (Cloud)
CDN: Cloudflare
SSL: Let's Encrypt
```

---

## 📝 Key Features Summary

### AI-Powered Features
✅ Conversational symptom gathering (Gemini AI)
✅ Disease prediction (Random Forest ML model)
✅ Automatic department routing (385 diseases)
✅ Doctor level recommendation (senior/junior)
✅ Severity assessment

### Booking Features
✅ AI-recommended appointments
✅ Manual doctor selection
✅ Real-time slot availability
✅ Duplicate booking prevention
✅ Email notifications

### Admin Features
✅ JWT authentication
✅ View all appointments
✅ Update appointment status
✅ Delete appointments
✅ Analytics dashboard

### Data Management
✅ MongoDB persistence
✅ Prediction history tracking
✅ localStorage for offline data
✅ Conversation persistence

---

**System Version**: 1.0.0  
**Last Updated**: November 2024  
**Architecture Type**: Microservices-ready Monolith
