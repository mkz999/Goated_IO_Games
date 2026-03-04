# Goated IO Games

Webová aplikace pro procházení her s Django API a React frontend.

## Lokální spuštění

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Server: http://127.0.0.1:8000/

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikace: http://localhost:3000/

## Deployment

### Backend
1. Nastav `DEBUG = False` v `config/settings.py`
2. Přidej doménu do `ALLOWED_HOSTS`
3. Spusť migraci: `python manage.py migrate`
4. Sberi soubory: `python manage.py collectstatic`
5. Spusť Gunicorn: `gunicorn config.wsgi:application --bind 0.0.0.0:8000`
6. Nastav nginx jako reverse proxy

### Frontend
```bash
npm run build
```
Hosť `dist/` složku na Vercel, Netlify nebo vlastním serveru

## API
- `GET /api/games/` - Hry
- `GET /api/categories/` - Kategorie
- `GET /admin/` - Admin panel
