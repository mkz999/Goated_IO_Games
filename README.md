# Goated IO Games

Webová aplikace pro procházení her s Django API a React frontend.

# Goated IO Games

Webová aplikace pro procházení her s Django API a React frontend.

## Lokální spuštění (Single Server)

### Setup
```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt
python manage.py migrate

# Install frontend dependencies
cd ../frontend
npm install
```

### Run (Option 1 - Development)
Run both in separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Backend: http://127.0.0.1:8000/
Frontend (dev): http://localhost:3000/

### Run (Option 2 - Production-like Single Server)
```bash
# Build frontend
cd frontend
npm run build

# Run Django server
cd ../backend
python manage.py runserver
```

Access app at: http://127.0.0.1:8000/
(No separate frontend server needed - Django serves everything)

## Deployment

### Backend
1. Nastav `DEBUG = False` v `config/settings.py`
2. Přidej doménu do `ALLOWED_HOSTS`
3. Build frontend: `npm run build` in frontend folder
4. Sberi soubory: `python manage.py collectstatic`
5. Spusť Gunicorn: `gunicorn config.wsgi:application --bind 0.0.0.0:8000`
6. Nastav nginx jako reverse proxy

## API
- `GET /api/games/` - Hry
- `GET /api/categories/` - Kategorie
- `GET /admin/` - Admin panel
