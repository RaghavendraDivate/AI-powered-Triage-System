# Architecture Diagrams - Hospital Appointment System

## 🎨 Visual System Diagrams

### 1. Department & Doctor Structure

```
Hospital System
│
├── General Medicine (4 doctors)
│   ├── Dr. Priya Sharma (Senior)
│   ├── Dr. Rajesh Kumar (Senior)
│   ├── Dr. Kavya Menon (Senior)
│   └── Dr. Arjun Patel (Junior)
│
├── Cardiology (4 doctors)
│   ├── Dr. Vikram Reddy (Senior)
│   ├── Dr. Anita Gupta (Senior)
│   ├── Dr. Suresh Nair (Senior)
│   └── Dr. Sneha Jain (Junior)
│
├── Neurology (4 doctors)
│   ├── Dr. Ramesh Iyer (Senior)
│   ├── Dr. Meera Krishnan (Senior)
│   ├── Dr. Anil Agarwal (Senior)
│   └── Dr. Pooja Verma (Junior)
│
├── Pulmonology (4 doctors)
├── Gastroenterology (4 doctors)
├── Dermatology (4 doctors)
├── Infectious Diseases (4 doctors)
├── Orthopedics (4 doctors)
├── Endocrinology (4 doctors)
├── Nephrology (4 doctors)
├── Hematology (4 doctors)
└── Rheumatology (4 doctors)

Total: 12 Departments, 48 Doctors
```

### 2. ML Model Structure

```
Disease Prediction Model
│
├── Input Layer
│   └── 385 Symptom Features (Binary: 0 or 1)
│
├── Random Forest Classifier
│   ├── 100 Decision Trees
│   ├── Max Depth: Auto
│   └── Training Data: Training_updated_1.csv
│
├── Output Layer
│   ├── Disease Prediction (1 of 385 diseases)
│   └── Confidence Score (0.0 - 1.0)
│
└── Post-Processing
    ├── Department Mapping
    ├── Doctor Level Recommendation
    └── Severity Assessment
```

### 3. Data Flow: Chat to Booking

```
User Input → Chat Interface
    ↓
Gemini AI Processing
    ↓
Symptom Extraction
    ↓
ML Model Prediction
    ↓
AI Recommendation
    ↓
Booking Form
    ↓
Slot Availability Check
    ↓
Appointment Creation
    ↓
Email Notifications
    ↓
Confirmation Page
```

### 4. Security Flow

```
Admin Login Request
    ↓
Verify Credentials
    ↓
Generate JWT Token
    ↓
Store Token (Frontend)
    ↓
Protected API Requests
    ↓
Validate JWT Token
    ↓
Allow/Deny Access
```

---

## 📊 Technology Integration Map

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Stack                            │
│  React 18 + Vite + Tailwind CSS + Radix UI + Zustand       │
└────────────────────────┬────────────────────────────────────┘
                         │
                    REST API (JSON)
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    Backend Stack                             │
│  FastAPI + Python 3.10+ + Uvicorn + Pydantic               │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │  Gemini AI   │  │  FastMail    │
│   (Motor)    │  │  (GenAI)     │  │  (SMTP)      │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🔄 Complete User Journey

```
1. Landing Page
   ↓
2. Click "Chat with AI"
   ↓
3. Describe Symptoms
   ↓
4. AI Extracts Symptoms
   ↓
5. Get AI Recommendation
   ↓
6. View Prediction Results
   ↓
7. Proceed to Booking
   ↓
8. Select Date & Time
   ↓
9. Fill Patient Details
   ↓
10. Submit Booking
    ↓
11. Receive Confirmation
    ↓
12. Email Notification
    ↓
13. View in "My Appointments"
```

---

## 📱 Responsive Design Flow

```
Desktop (>1024px)
├── Full Navigation Bar
├── Side-by-side Layouts
└── Large Cards & Forms

Tablet (768px - 1024px)
├── Collapsible Navigation
├── Stacked Layouts
└── Medium Cards & Forms

Mobile (<768px)
├── Hamburger Menu
├── Single Column Layout
└── Compact Cards & Forms
```

---

**Document Version**: 1.0  
**Last Updated**: November 2024
