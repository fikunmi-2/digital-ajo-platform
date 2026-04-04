# Digital Ajo Platform

A multi-tenant savings (ajo) management system for thrift collectors.

## Tech Stack

- Backend: Django + DRF
- Frontend: React (Vite) + Tailwind
- Database: PostgreSQL

## Structure

- `/backend` → API + business logic
- `/frontend` → React UI

## Setup

### Backend
cd backend
python -m venv venv
pip install -r requirements.txt
python manage.py runserver

### Frontend
cd frontend
npm install
npm run dev