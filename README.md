# FairHire AI

Full-stack "Bias Detection & Fairness" application for AI hiring models.
Topic: Bias Detection and Fairness in AI Models
Stack: Flask (Backend), React + Vite (Frontend), Bootstrap 5 (UI).

## Prerequisites
- Python 3.8+
- Node.js 16+ (Required for Frontend)

## Quick Start (Local)

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Deployment (Render.com)

### 1. Backend Service
- Create a new **Web Service** on Render.
- Repo: Connect your fork.
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app`
- Environment Variables:
    - `PYTHON_VERSION`: `3.9.13`

### 2. Frontend Static Site
- Create a new **Static Site** on Render.
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Rewrite Rules:
    - Source: `/*`
    - Destination: `/index.html`
    - Action: `Rewrite`
- **Important**: In `frontend/vite.config.js`, update the proxy target or use an Environment Variable `VITE_API_URL` to point to your live Backend URL instead of localhost.

## Usage Guide
1. **Login**: Register a new user (any username/password).
2. **Data Studio**: Click "Generate Synthetic Data" to create 1,000 biased applicant profiles.
3. **Bias Audit**: Train a baseline model and observe Disparate Impact (DI) < 0.8 (Fail).
4. **Mitigation**: Apply "Reweighing" and retrain. Observe DI > 0.8 (Pass).
5. **Report**: Export the audit log.
