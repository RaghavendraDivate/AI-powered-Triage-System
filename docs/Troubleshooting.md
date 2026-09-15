## Troubleshooting

### Common Issues

#### Backend won’t start: Missing GOOGLE_API_KEY
- Set `GOOGLE_API_KEY` in `Backend/.env`

#### MongoDB connection failed
- Verify `MONGODB_URL` and that MongoDB is running
- Check network/firewall rules

#### CORS errors in browser
- Ensure backend allows `http://localhost:5173`
- Confirm `VITE_API_BASE_URL` points to backend

#### Emails not sending
- Verify SMTP credentials
- Check `MAIL_STARTTLS`/`MAIL_SSL_TLS` combination
- Inspect backend logs (`Backend/hospital.log`)

#### 401 Unauthorized on admin endpoints
- Acquire token via `POST /auth/login`
- Ensure client sends `Authorization: Bearer <token>`

#### MODEL features mismatch
- Ensure the joblib model contains `feature_names_in_`
- If not, ensure CSV has training columns and filenames match `predictor.py`


