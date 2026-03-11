# FaceFind – Backend Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

---

## 1. Install dependencies

```bash
cd facefind-backend
npm install
```

---

## 2. Configure environment

Edit `.env` (already created):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/facefind
FRONTEND_URL=http://localhost:3000
ML_SERVICE_URL=http://localhost:8000
JWT_SECRET=facefind_super_secret_jwt_key_change_in_production
JWT_EXPIRES=7d
NODE_ENV=development
```

> ⚠️ Change `JWT_SECRET` to a long random string before deploying.

---

## 3. Start the backend

```bash
npm run dev        # development (nodemon, auto-restart)
# or
npm start          # production
```

Server runs on **http://localhost:5000**

---

## 4. Open the frontend

Open `facefind-photographer.html` in your browser.
It connects to `http://localhost:5000/api` automatically.

---

## API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create photographer account |
| POST | /api/auth/login | Login, returns JWT |
| GET  | /api/auth/me | Get current user (requires token) |

### Events (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/events | Get all events for logged-in photographer |
| GET    | /api/events/:id | Get single event |
| GET    | /api/events/code/:code | Get event by code (public, for guests) |
| POST   | /api/events | Create new event |
| DELETE | /api/events/:id | Delete event |
| PATCH  | /api/events/:id/toggle | Toggle active status |

### Photos (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/photos/event/:eventId | Get photos for an event |
| POST   | /api/photos/upload/:eventId | Upload photos (multipart) |

### Face Match (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/match/:eventCode | Upload selfie, get matching photos |

---

## JWT Authentication

After login/register, the token is stored in `localStorage` as `ff_token`.

All protected requests send:
```
Authorization: Bearer <token>
```

Token expires after **7 days** by default.

---

## Notes

- Events are scoped per photographer — each user only sees their own events.
- The ML service (face recognition) runs separately on port 8000. See `ml-service/` for setup.
- For production, use MongoDB Atlas and set `MONGODB_URI` to your Atlas connection string.
