## Hospital System – Overview

This project is an AI-powered hospital appointment scheduling system that combines conversational symptom gathering, ML-based disease prediction, automatic department routing, and doctor selection with a modern React frontend and a FastAPI backend.

### Key Capabilities
- Conversational symptom intake powered by Gemini AI
- Disease prediction via a trained scikit-learn model
- Automatic mapping of diseases to departments and required doctor level
- Appointment booking in AI mode or manual doctor selection
- Admin authentication to manage appointments
- Email notifications for patients and doctors

### Architecture at a Glance
- Frontend: React + Vite, Tailwind/Radix UI, React Router, Zustand, React Query
- Backend: FastAPI, Motor (MongoDB), Pydantic, scikit-learn, Pandas, FastAPI-Mail
- Data: MongoDB for persistence; Joblib model and CSV training data
- External Services: Google Gemini for chat; SMTP for emails

### High-Level Flow
1. User chats with AI to refine symptoms
2. Frontend sends symptoms to backend `/predict`
3. ML model predicts disease, maps department and doctor level
4. User books via `/book` (AI or manual mode)
5. Backend saves to MongoDB and sends email notifications
6. Admin can view/update/delete appointments via JWT-protected endpoints

See `SYSTEM_ARCHITECTURE.md` for detailed diagrams and data flows.


