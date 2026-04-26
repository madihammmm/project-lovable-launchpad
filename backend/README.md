# DreamScents Backend

Express + MongoDB Atlas API for the DreamScents perfume website.

## Local setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` to your MongoDB Atlas connection string. If it is missing or MongoDB is unavailable, the API uses in-memory arrays.

## Routes

- `GET /api/perfumes`
- `GET /api/perfumes/:id`
- `POST /api/perfumes`
- `PUT /api/perfumes/:id`
- `DELETE /api/perfumes/:id`
- `POST /api/contact`

## Deployment

- Deploy this `backend` folder on Render or Railway.
- Add environment variables: `MONGO_URI` and `PORT`.
- Deploy the frontend separately on Vercel.
