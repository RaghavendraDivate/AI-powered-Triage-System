## Environment & Configuration

### Backend (.env in Backend/)
- ENV: development|production (controls log level)
- GOOGLE_API_KEY: Google Gemini API key (required)
- GEMINI_MODEL: Default `gemini-1.5-flash`
- MONGODB_URL: e.g., `mongodb://localhost:27017`
- MONGODB_DATABASE: e.g., `hospital_system`
- SECRET_KEY: JWT signing key (change in production)
- MAIL_USERNAME: SMTP username
- MAIL_PASSWORD: SMTP password
- MAIL_FROM: Sender email address
- MAIL_FROM_NAME: Sender display name
- MAIL_PORT: SMTP port, typically 587
- MAIL_SERVER: SMTP host
- MAIL_STARTTLS: True|False
- MAIL_SSL_TLS: True|False
- TEST_DOCTOR_EMAIL: Fallback email for doctor notifications

The backend will fail to start if `GOOGLE_API_KEY` is missing.

### Frontend (.env in Frontend/)
- VITE_API_BASE_URL: Backend base URL (default `http://localhost:8000`)

### Ports
- Frontend dev: 5173 (Vite)
- Backend dev: 8000 (Uvicorn)
- MongoDB default: 27017


