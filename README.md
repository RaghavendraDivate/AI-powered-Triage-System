# AI-Powered Hospital Appointment Scheduling & Triage System 🏥

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Machine Learning](https://img.shields.io/badge/Machine%20Learning-FF6F00?style=for-the-badge&logo=scikitlearn&logoColor=white)](#)
[![Full Stack](https://img.shields.io/badge/Full%20Stack-00D084?style=for-the-badge&logo=fullstack&logoColor=white)](#)

---

## 📌 Project Overview

A **full-stack AI-powered hospital appointment scheduling system** with intelligent disease prediction, automatic doctor recommendations, and clinical decision support.

Combines **machine learning disease classification** with an interactive **React frontend** and **FastAPI backend** to streamline patient intake, triage, and appointment booking workflows.

---

## 🎯 Key Features

### 🧠 AI & Machine Learning
- **Disease Prediction:** ML model classifies symptoms to predicted disease
- **Department Routing:** Automatically routes patients to appropriate medical departments
- **Doctor Level Assessment:** Determines required doctor expertise (junior/senior)
- **Risk Stratification:** Identifies severe cases for priority handling
- **Treatment Recommendations:** Suggests appropriate care pathways

### 💻 Frontend (React + Vite)
- **Interactive Symptom Chat:** AI-powered conversational symptom collection
- **Smart Doctor Recommendations:** AI suggests doctors based on symptoms
- **Dual Booking Modes:**
  - AI Mode: Pre-filled with ML recommendations
  - Manual Mode: User-selected doctors
- **Real-time Validation:** Form validation and error handling
- **Responsive Design:** Mobile-friendly interface
- **Appointment Management:** Complete booking flow with confirmation

### 🔧 Backend (FastAPI + Python)
- **RESTful API:** Complete API with OpenAPI documentation
- **Disease Prediction Engine:** Scikit-learn ML models
- **Department Mapping:** Rule-based department routing
- **Appointment Scheduling:** Database-backed scheduling logic
- **CORS Support:** Frontend integration ready
- **Error Handling:** Comprehensive error responses and logging

### 📊 Analytics & Monitoring
- **Admin Dashboard:** Looker Studio analytics dashboard
- **KPIs Tracked:**
  - Total appointments & trends
  - Severe case rate
  - AI booking adoption rate
  - Cancellation rate
  - Department/doctor workload

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              USER INTERACTION LAYER                     │
│  Frontend (React + Vite) - http://localhost:5173        │
│  ├── Symptom Chat Interface                             │
│  ├── AI Recommendations Display                         │
│  ├── Doctor Selection                                   │
│  └── Booking Confirmation                               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│              API LAYER                                  │
│  FastAPI Backend - http://localhost:8000                │
│  ├── /predict - Disease Prediction                      │
│  ├── /departments - Get departments                     │
│  ├── /doctors - Get available doctors                   │
│  └── /book - Book appointment                           │
└────────────────────┬────────────────────────────────────┘
                     │ Model Inference
┌────────────────────▼────────────────────────────────────┐
│              ML/LOGIC LAYER                             │
│  ├── Disease Prediction Model (Scikit-learn)            │
│  ├── Department Mapper                                  │
│  ├── Doctor Level Classifier                            │
│  └── Appointment Scheduler                              │
└────────────────────┬────────────────────────────────────┘
                     │ CRUD Operations
┌────────────────────▼────────────────────────────────────┐
│              DATA LAYER                                 │
│  ├── Database (PostgreSQL/SQLite)                       │
│  ├── Doctor Registry                                    │
│  ├── Appointment Records                                │
│  └── Patient History                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
hospital_system/
├── Frontend/                          # React Application
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   └── BookingForm.jsx
│   │   ├── pages/                     # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   └── ConfirmationPage.jsx
│   │   ├── services/                  # API Integration
│   │   │   └── api.js                 # API client
│   │   ├── store/                     # State Management (Zustand)
│   │   │   └── appointmentStore.js
│   │   └── App.jsx
│   ├── public/                        # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── Backend/                           # FastAPI Application
│   ├── app/
│   │   ├── main.py                    # FastAPI app & routes
│   │   ├── predictor.py               # ML disease prediction
│   │   ├── scheduler.py               # Appointment scheduling
│   │   ├── models.py                  # Pydantic data models
│   │   └── data/
│   │       ├── rf_disease_model.joblib # Trained ML model
│   │       ├── Training_updated.csv    # Training data reference
│   │       └── doctor_registry.json    # Doctor data
│   ├── requirements.txt
│   └── venv/                          # Python virtual environment
│
├── docs/                              # Documentation
│   ├── Overview.md
│   ├── Setup.md
│   ├── API.md
│   ├── Architecture.md
│   └── Deployment.md
│
├── start.sh                           # Setup automation
├── run_system.sh                      # Run automation
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
| ---------- | ------- |
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Radix UI** | Component library |
| **Zustand** | State management |
| **React Router** | Navigation |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
| ---------- | ------- |
| **FastAPI** | Web framework |
| **Python 3.8+** | Programming language |
| **Scikit-learn** | ML models |
| **Pandas** | Data processing |
| **NumPy** | Numerical computing |
| **Uvicorn** | ASGI server |
| **Pydantic** | Data validation |

### DevOps & Deployment
| Technology | Purpose |
| ---------- | ------- |
| **Docker** | Containerization |
| **PostgreSQL** | Database (optional) |
| **Nginx** | Reverse proxy |
| **GitHub** | Version control |

---

## 📦 Installation & Setup

### Quick Start (Automated)

```bash
# Clone repository
git clone https://github.com/RaghavendraDivate/AI-powered-Triage-System.git
cd hospital_system

# Run automated setup
./start.sh
```

### Manual Setup

#### Backend Setup

```bash
cd Backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# (Optional) Build for production
npm run build
```

---

## 🚀 Running the System

### Option 1: Automated Startup

```bash
./run_system.sh
```

Starts both frontend and backend servers automatically.

### Option 2: Manual Startup

#### Start Backend

```bash
cd Backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --port 8000
```

#### Start Frontend (in new terminal)

```bash
cd Frontend
npm run dev
```

---

## 🌐 Access URLs

| Service | URL |
| ------- | --- |
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |
| **ReDoc** | http://localhost:8000/redoc |

---

## 🔄 API Integration

### Core Endpoints

#### 1. Disease Prediction

```http
POST /predict
Content-Type: application/json

{
  "symptoms": ["headache", "fever", "nausea"],
  "patient_id": "optional-id"
}

Response:
{
  "predicted_disease": "Common Cold",
  "confidence": 0.87,
  "recommended_department": "General Medicine",
  "doctor_level": "junior",
  "severity": "mild"
}
```

#### 2. Get Departments

```http
GET /departments

Response:
[
  {"id": 1, "name": "General Medicine", "doctors": 5},
  {"id": 2, "name": "Neurology", "doctors": 3},
  ...
]
```

#### 3. Book Appointment

```http
POST /book
Content-Type: application/json

{
  "department": "neurology",
  "doctor_id": 1,
  "date": "2024-12-25",
  "time": "10:30",
  "patient_name": "John Doe",
  "patient_email": "john@example.com"
}

Response:
{
  "booking_id": "APT-12345",
  "status": "confirmed",
  "appointment_date": "2024-12-25",
  "appointment_time": "10:30",
  "doctor_name": "Dr. Smith",
  "confirmation_sent": true
}
```

---

## 🧠 AI Workflow

```
1. Symptom Input
   └─ User describes symptoms in chat

2. Symptom Parsing
   └─ Frontend extracts and normalizes symptoms

3. API Request
   └─ Symptoms sent to backend /predict endpoint

4. ML Analysis
   └─ Scikit-learn model processes symptoms

5. Disease Prediction
   └─ Model outputs disease class + confidence

6. Department Routing
   └─ Disease mapped to appropriate department

7. Doctor Level Assessment
   └─ Severity determines doctor expertise level needed

8. Results Display
   └─ Recommendations shown to user

9. Booking
   └─ User confirms and books appointment
```

---

## 🎯 Features Walkthrough

### 📝 Symptom Collection
1. User enters symptoms conversationally
2. AI extracts symptom keywords
3. Sends to backend for analysis

### 🤖 AI Recommendation
1. ML model predicts likely disease
2. Returns confidence score
3. Recommends department & doctor level
4. Assesses severity (mild/moderate/severe)

### 📋 Appointment Booking
1. User selects booking mode (AI or Manual)
2. Chooses doctor from recommendations or list
3. Selects date and time
4. Enters contact information
5. Confirms and books appointment

### ✅ Confirmation
1. Booking confirmed in database
2. Email confirmation sent
3. Booking ID provided
4. Calendar updated

---

## 📊 Analytics Dashboard

Looker Studio dashboard tracks:
- **Total Appointments** — Monthly trends
- **Severe Case Rate** — Critical cases requiring immediate attention
- **AI Booking Adoption** — % of bookings made through AI recommendations
- **Cancellation Rate** — No-show and cancellation metrics
- **Department Workload** — Appointments by department
- **Doctor Utilization** — Appointments per doctor

---

## 🎓 Skills Demonstrated

✅ **Full-Stack Development**
- Frontend: React, Vite, Tailwind CSS, component architecture
- Backend: FastAPI, REST API design, Python async programming
- Integration: HTTP clients, API communication, state management

✅ **Machine Learning**
- Scikit-learn model training and inference
- Disease classification and prediction
- Symptom processing and feature extraction

✅ **System Design**
- Microservices architecture
- API design principles
- Error handling and validation
- Scalable application structure

✅ **DevOps & Deployment**
- Containerization (Docker)
- Environment setup and automation
- Production-ready code structure

---

## 🐛 Troubleshooting

### CORS Errors
```
✓ Ensure backend CORS is configured for frontend URL
✓ Check both servers running on correct ports
```

### API Connection Failed
```
✓ Verify backend running: curl http://localhost:8000/docs
✓ Check firewall and network settings
```

### Module Not Found (Backend)
```bash
cd Backend && source venv/bin/activate && pip install -r requirements.txt
```

### Dependencies Missing (Frontend)
```bash
cd Frontend && rm -rf node_modules && npm install
```

---

## 📝 License

Educational project. Ensure compliance with healthcare regulations for production use.

---

**Made with ❤️ for better healthcare accessibility through AI 🏥💙**
