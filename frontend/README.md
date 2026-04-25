# Garden Smart Backend

Next.js API backend for ingesting IoT sensor data from Ecowitt devices.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your PostgreSQL connection string to `.env`:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

4. Run development server:
```bash
npm run dev
```

Visit http://localhost:3000 to see the API status page.

## API Endpoints

- `GET /` - API status page
- `GET /api/health` - Health check endpoint
- `POST /api/ingest` - Ingest sensor data from Ecowitt

## Railway Deployment

1. Push your code to a Git repository
2. Connect your repository to Railway
3. Set environment variable in Railway:
   - `DATABASE_URL` - Your PostgreSQL connection string
4. Railway will automatically:
   - Detect Node.js project
   - Install dependencies with `npm ci`
   - Build with `npm run build`
   - Start with `npm start`

The app will automatically use Railway's `PORT` environment variable.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── health/
│   │   │   └── route.ts      # Health check endpoint
│   │   └── ingest/
│   │       └── route.ts      # Sensor data ingestion
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── .env.example              # Environment variables template
├── .npmrc                    # NPM configuration
├── next.config.js            # Next.js configuration
├── nixpacks.toml             # Railway build configuration
├── package.json              # Dependencies and scripts
├── railway.json              # Railway deployment config
└── tsconfig.json             # TypeScript configuration
```
