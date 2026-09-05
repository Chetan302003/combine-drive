# Free Hosting Deployment Guide

This guide will walk you through setting up 9Drive entirely on free hosting platforms:
- **Aiven**: MySQL Database (Free Tier)
- **Render**: Backend API (Free Web Service)
- **Vercel**: Frontend React App (Free Hobby Plan)

---

## 1. Setup Aiven (MySQL Database)
1. Go to [Aiven](https://aiven.io/) and sign up.
2. Create a new **MySQL** service and select the **Free plan**.
3. Wait for the service to be created.
4. Copy your **Service URI** from the Aiven dashboard.
   - It usually looks like `mysql://avnadmin:password@hostname:port/defaultdb?ssl-mode=REQUIRED`.
5. Save this URI; you will need it for the backend in Render.

---

## 2. Setup Render (Backend)
1. Sign up on [Render](https://render.com/).
2. Go to your Dashboard and click **New+** > **Web Service**. *(Do not use Blueprint, as it asks for a credit card)*
3. Select **"Build and deploy from a Git repository"** and connect your GitHub repository.
4. Fill in the following details for your web service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
5. Click **Advanced** to open the Environment Variables section and add the following:
   - `DATABASE_URL`: Paste the MySQL Service URI from Aiven here.
   - `APP_PORT`: `4000`
   - `FRONTEND_URL`: You can put a temporary value for now (e.g. `https://9drive.vercel.app`) or leave it blank until the Vercel step is complete, then update it later.
   - `JWT_ACCESS_SECRET`: Generate any random string of characters (at least 32 chars).
   - `TOKEN_ENCRYPTION_KEY`: Generate any random string (at least 32 chars).
   - `MAX_UPLOAD_BYTES`: `5368709120`
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID (from Google Cloud Console).
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret.
   - `GOOGLE_REDIRECT_URI`: Set this to `https://your-backend-url.onrender.com/connected-accounts/google/callback`.
   - `SELF_URL`: Set this to your Render backend URL (e.g. `https://9drive-backend.onrender.com`). This enables the built-in keepalive — the backend will self-ping its own `/health` endpoint and run a lightweight DB query every 14 minutes to prevent Render from spinning down and Aiven MySQL from going idle.
6. Click **Create Web Service** to deploy the backend. Wait for it to build and start.
7. Once successfully deployed, copy the **Render URL** for your backend service (e.g. `https://9drive-backend.onrender.com`).

---

## 3. Setup Vercel (Frontend)
1. Sign up on [Vercel](https://vercel.com/).
2. Click **Add New** > **Project** and import your GitHub repository.
3. Before clicking deploy, configure the **Root Directory**:
   - Click **Edit** next to Root Directory and select the `frontend` folder.
4. Open the **Environment Variables** section and add:
   - `VITE_API_URL`: Paste the **Render URL** you copied in Step 2.
5. Vercel will automatically detect Vite and run `npm run build`. 
6. Click **Deploy**. Vercel will build your frontend and handle routing seamlessly thanks to the `vercel.json` file.
7. Copy your new Vercel production domain.

---

## 4. Finalize Configuration
1. Go back to your **Render Dashboard** > **9drive-backend** > **Environment**.
2. Update the `FRONTEND_URL` variable to your new Vercel production domain (e.g., `https://combine-drive.vercel.app`).
3. Save changes (Render will automatically redeploy the backend with the new variables).
4. **Google Cloud Console**: Remember to add both your Vercel URL and Render redirect URL to your Authorized Origins in Google Cloud Console!
