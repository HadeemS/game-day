# MongoDB Setup Guide for Game Day API

## Step 1: Install Dependencies

In your server repo (`game-day-api`), run:

```bash
npm install mongoose dotenv
```

## Step 2: Set Up MongoDB Atlas (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
6. Replace `<password>` with your actual password
7. Add your database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gameday?retryWrites=true&w=majority`

## Step 3: Set Environment Variable on Render

1. Go to your Render dashboard
2. Select your service (`game-day-api`)
3. Go to "Environment" tab
4. Add new environment variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your full MongoDB connection string (from Step 2)
5. Save changes

## Step 4: Local Development (.env file)

Create a `.env` file in your server repo root:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gameday?retryWrites=true&w=majority
PORT=3000
```

**Important**: Add `.env` to your `.gitignore` file to keep your password secret!

## Step 5: File Structure

Your server should have this structure:

```
game-day-api/
├── .env (not in git)
├── .gitignore
├── package.json
├── server.js (or index.js)
├── db.js (MongoDB connection)
└── models/
    └── Game.js (Mongoose model)
```

## Step 6: Testing

After deploying, test your connection:
- Visit: `https://game-day-api-1.onrender.com/api/games`
- Should return empty array `[]` if no games, or existing games if any

