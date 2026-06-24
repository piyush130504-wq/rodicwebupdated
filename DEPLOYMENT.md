# RODIC × NASSCOM Site Deployment Guide

This is a full-stack React application with a Node.js (Express) backend connecting to MongoDB. The project has been perfectly restructured so it can be deployed on platforms like **Vercel** with zero configuration.

## Pre-requisites
1. You must have a MongoDB database running (e.g. MongoDB Atlas).
2. You need three environment variables:
   - `MONGO_URL`: Your MongoDB connection string.
   - `DB_NAME`: The name of the database (e.g. `nasscom`).
   - `CORS_ORIGINS`: Allowed origins (e.g. `*`).

---

## Method 1: Deploying to Vercel (Recommended)

Vercel will automatically detect the React frontend at the root, and seamlessly deploy the backend inside the `api/` folder as Serverless Functions.

**Option A: Using GitHub (Easiest)**
1. Create a new repository on GitHub and push this entire folder to it.
2. Go to your [Vercel Dashboard](https://vercel.com/new).
3. Click **"Add New Project"** and import your newly created GitHub repository.
4. In the "Environment Variables" section, add `MONGO_URL`, `DB_NAME`, and `CORS_ORIGINS`.
5. Click **Deploy**. Vercel will build the frontend and set up the backend APIs automatically!

**Option B: Using Vercel CLI (Fastest)**
1. Open a terminal in this folder.
2. Run `npm install -g vercel` (if you don't have it).
3. Run `npx vercel`. Follow the prompts.
4. Run `npx vercel env add` to add your environment variables to your Vercel project.
5. Run `npx vercel --prod` to deploy to production.

---

## Method 2: Running Locally

If you just want to run the site on your local machine for development:

1. Open a terminal in this folder.
2. Run `npm install` to install all React and Node.js dependencies.
3. Make sure you have a `.env` file at the root containing your database credentials.
4. Run `npm start`.
5. The local React server will start on `http://localhost:3000`, and the Express backend will simultaneously start on `http://localhost:8000`.

*(Note: The React `.env` contains `REACT_APP_BACKEND_URL=http://localhost:8000` to ensure local routing works).*

---

## Important Note About "Drag-and-Drop"
Because this project contains a Node.js backend (in the `/api` folder) to handle database registrations, **you cannot use the drag-and-drop deployment method** on Vercel or Netlify. Drag-and-drop only works for simple static HTML sites. You must use the CLI or GitHub integrations so Vercel knows to spin up the serverless backend.
