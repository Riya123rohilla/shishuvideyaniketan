# Production Deployment Guide

## Prerequisites
- Node.js (v18+)
- PM2 (Process Manager): `npm install -g pm2`

## Backend Setup

1. **Install Dependencies**:
   Navigate to the `backend` directory and run:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**:
   Ensure your `.env` file in `backend/` has the following (at minimum):
   ```env
   NODE_ENV=production
   PORT=5000
   GOOGLE_SHEET_ID=your_sheet_id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_email
   GOOGLE_PRIVATE_KEY="your_private_key"
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

3. **Start with PM2**:
   Use the provided `ecosystem.config.js` to start the backend in production mode:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```
   
   To save the process list so it restarts on reboot:
   ```bash
   pm2 save
   pm2 startup
   ```

## Frontend Setup

1. **Install Dependencies**:
   Navigate to the `frontend` directory and run:
   ```bash
   cd frontend
   npm install
   ```

2. **Build for Production**:
   Create an optimized production build:
   ```bash
   npm run build
   ```
   This will create a `build` folder.

3. **Serving Frontend**:
   - **Option A (Integrated)**: The backend is configured to serve the `frontend/build` folder if it exists. 
   - **Option B (Separate)**: Deploy the `frontend/build` folder to a static host like Vercel, Netlify, or serve it with Nginx.

## Security & Performance Features Added
- **Helmet**: Adds secure HTTP headers.
- **Compression**: Gzips responses for faster load times.
- **Morgan**: Logs HTTP requests for monitoring.
- **Rate Limiting**: Limits repeated requests to prevent abuse (150 requests/15min).
- **PM2 Config**: Ensures the app restarts if it crashes.

## Verifying Production Mode
Check the logs:
```bash
pm2 logs shishu-backend
```
You should see: `Running in production mode` (or similar environment output).
