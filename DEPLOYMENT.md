# Deployment Instructions

## Prerequisites
1. A Render account (https://render.com)
2. Your Supabase project URL and API key

## Backend Deployment

1. Push your backend code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the following environment variables in Render:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_KEY` - Your Supabase API key
5. Set the build command to: `npm install`
6. Set the start command to: `node server.js`
7. Deploy the service

## Frontend Deployment

1. Push your frontend code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the following environment variables in Render:
   - `BACKEND_URL` - The URL of your deployed backend service
5. Set the build command to: `npm install`
6. Set the start command to: `npm start`
7. Deploy the service

## Post-Deployment

1. Update the `BACKEND_URL` environment variable in your frontend service with the actual URL of your deployed backend
2. Test the application by accessing the frontend URL

## Local Development

To run locally:

1. Start the backend:
   ```
   cd backend
   npm start
   ```

2. Start the frontend:
   ```
   cd frontend
   npm start
   ```

3. Access the application at http://localhost:3000