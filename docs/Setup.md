## Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or MongoDB Atlas)

### Backend Setup
```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in `Backend/` (same level as `app/`) with:
```
ENV=development
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# MongoDB
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=hospital_system

# JWT/Auth
SECRET_KEY=change_this_in_prod

# Email (FastAPI-Mail)
MAIL_USERNAME=your_smtp_username
MAIL_PASSWORD=your_smtp_password
MAIL_FROM=from@example.com
MAIL_FROM_NAME=Hospital System
MAIL_PORT=587
MAIL_SERVER=smtp.example.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False

# Optional
TEST_DOCTOR_EMAIL=doctor@example.com
```

For frontend, create `Frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

See `docs/Environment.md` for details.


