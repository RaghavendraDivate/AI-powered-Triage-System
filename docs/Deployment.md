## Deployment

### Production Checklist
- Set all secrets via environment variables (never commit)
- Use production SMTP and verified sender domain
- Configure `VITE_API_BASE_URL` to production API URL
- Serve frontend as static assets (Vercel/Netlify) or Nginx
- Run FastAPI behind a production ASGI server (e.g., Uvicorn + Nginx or Gunicorn + Uvicorn workers)
- Use MongoDB Atlas or managed MongoDB
- Enable HTTPS/SSL (Let’s Encrypt/ACM)

### Docker (example outline)
```
# Backend Dockerfile (outline)
FROM python:3.10-slim
WORKDIR /app
COPY Backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY Backend/app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Promotion
- Dev → Staging → Prod pipeline
- Add health checks to `/health`
- Use canary deploys for ML model updates if possible


