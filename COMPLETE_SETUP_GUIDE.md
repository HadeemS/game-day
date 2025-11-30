# Complete MongoDB Setup Guide - Game Day Project

## 📋 Overview

This guide will help you migrate your Game Day API from in-memory storage to MongoDB using Mongoose, while keeping Joi validation integrated.

---

## 🚀 Step-by-Step Setup

### Part 1: Server-Side Setup

#### Step 1.1: Install Dependencies

In your server repo (`game-day-api`), run:

```bash
npm install mongoose dotenv
```

#### Step 1.2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/login (free tier available)
3. Create a new cluster (choose M0 Free)
4. Wait for cluster to deploy (~3-5 minutes)
5. Click "Connect" → "Connect your application"
6. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual database password
8. Add database name: Change `?retryWrites=true&w=majority` to `/gameday?retryWrites=true&w=majority`
9. Final connection string should look like:
   ```
   mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/gameday?retryWrites=true&w=majority
   ```

#### Step 1.3: Configure Environment Variables

**On Render (Production):**
1. Go to Render dashboard → Your service (`game-day-api`)
2. Click "Environment" tab
3. Add new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your full MongoDB connection string (from Step 1.2)
4. Click "Save Changes"
5. Render will automatically redeploy

**For Local Development:**
1. Create `.env` file in your server repo root:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gameday?retryWrites=true&w=majority
   PORT=3000
   ```
2. Add `.env` to `.gitignore` (if not already there)

#### Step 1.4: Update Server File Structure

Your server should have this structure:

```
game-day-api/
├── .env (not committed to git)
├── .gitignore
├── package.json
├── server.js (or index.js - main entry point)
├── db.js (MongoDB connection)
├── models/
│   └── Game.js (Mongoose model)
└── routes/
    └── games.js (API routes)
```

#### Step 1.5: Copy Server Files

Copy these files from the `server-files/` directory into your server repo:

1. **`db.js`** → Root of server repo
2. **`models/Game.js`** → Create `models/` folder, put `Game.js` inside
3. **`routes/games.js`** → Create `routes/` folder, put `games.js` inside
4. **`server.js`** → Replace your existing `server.js` or `index.js`

**Important**: Make sure your `package.json` has `"main": "server.js"` (or whatever your entry point is).

#### Step 1.6: Update package.json Scripts

Make sure your `package.json` has:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### Step 1.7: Test Server Locally

1. Run: `npm start`
2. You should see: `✅ Connected to MongoDB successfully`
3. Visit: `http://localhost:3000/api/games`
4. Should return: `[]` (empty array)

#### Step 1.8: Deploy to Render

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add MongoDB/Mongoose integration"
   git push
   ```
2. Render will automatically deploy
3. Check Render logs to confirm MongoDB connection
4. Test: `https://game-day-api-1.onrender.com/api/games`

---

### Part 2: Client-Side Updates

#### Step 2.1: Update Form Field Name

The form has already been updated to use `imageUrl` instead of `img`. The changes are in:
- `src/components/GameForm.jsx` - Form state and validation
- `src/pages/Games.jsx` - Display logic (backward compatible)

#### Step 2.2: Verify Client Code

The client code is already updated! Just make sure:
- Form uses `imageUrl` field
- Validation matches server Joi rules
- Images display correctly in the list

#### Step 2.3: Test Client Locally

1. Make sure `REACT_APP_API_BASE_URL` in `.env` points to your Render URL:
   ```env
   REACT_APP_API_BASE_URL=https://game-day-api-1.onrender.com
   ```
2. Run: `npm start`
3. Test:
   - Create a new game with imageUrl
   - Edit a game
   - Delete a game
   - Verify list updates automatically

#### Step 2.4: Deploy Client

1. Build: `npm run build`
2. Deploy: `npm run deploy` (if using gh-pages)
3. Test live site: `https://hadeems.github.io/game-day/games`

---

## 🧪 Testing Checklist

### Server Tests:
- [ ] GET `/api/games` returns empty array `[]` initially
- [ ] POST `/api/games` creates a game and returns 201
- [ ] GET `/api/games` returns the new game
- [ ] PUT `/api/games/:id` updates a game and returns 200
- [ ] DELETE `/api/games/:id` deletes a game and returns 200
- [ ] Invalid data returns 400 with error messages

### Client Tests:
- [ ] Form submits with imageUrl field
- [ ] Images display in game cards
- [ ] Edit form pre-populates with imageUrl
- [ ] Delete removes game from list immediately
- [ ] List refreshes after POST/PUT/DELETE

---

## 📝 How Images Work

### Image Storage Strategy:
- **Field**: `imageUrl` (string)
- **Format**: Full URL (`https://example.com/image.jpg`) or relative path (`/images/game.jpg`)
- **Storage**: URLs stored in MongoDB, images hosted elsewhere
- **Persistence**: URLs persist in MongoDB even if Render restarts
- **Session Requirement**: Images work for the whole session because:
  1. URLs are stored in MongoDB (persistent)
  2. Images are hosted externally (not on Render)
  3. Even if Render restarts, MongoDB data persists
  4. Images continue to work as long as the URL is valid

### Example Image URLs:
- External: `https://images.unsplash.com/photo-1234567890`
- Relative: `/images/lakers-vs-celtics.jpg`
- CDN: `https://cdn.example.com/sports/game.jpg`

---

## 🎓 Explaining to Your Professor

### How Data Persists:
- **Before**: Data stored in memory array → lost on server restart
- **Now**: Data stored in MongoDB Atlas → persists across restarts
- **MongoDB Atlas**: Cloud database (free tier) that keeps data even when Render restarts

### How Validation Works:
- **Joi**: Validates data structure, types, and rules BEFORE saving to MongoDB
- **Mongoose**: Also validates data structure (double-check)
- **Client**: Validates BEFORE sending to server (better UX, fewer requests)
- **Result**: Invalid data never reaches the database

### How Images Work:
- Images stored as URLs (not files) in MongoDB
- URLs point to external hosting or relative paths
- Images persist because URLs persist in MongoDB
- Works for entire session because MongoDB data persists

### How State Updates:
- React state (`games` array) holds current list
- After POST/PUT/DELETE, `reloadKey` increments
- `useEffect` watches `reloadKey` and fetches fresh data
- UI updates automatically without page refresh

---

## 🐛 Troubleshooting

### MongoDB Connection Issues:
- **Error**: "MongoDB connection error"
- **Fix**: Check `MONGODB_URI` in Render environment variables
- **Fix**: Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)

### Validation Errors:
- **Error**: "Validation failed"
- **Fix**: Check that client validation matches server Joi schema exactly
- **Fix**: Check field names match (`imageUrl` not `img`)

### Images Not Displaying:
- **Fix**: Check imageUrl format (must start with `http://`, `https://`, or `/`)
- **Fix**: Verify image URL is accessible (test in browser)
- **Fix**: Check CORS if using external images

### Render Deployment Issues:
- **Fix**: Check Render logs for errors
- **Fix**: Verify `MONGODB_URI` is set in Render environment
- **Fix**: Make sure `package.json` has correct `main` entry point

---

## ✅ Final Checklist

### Server:
- [ ] MongoDB Atlas cluster created
- [ ] `MONGODB_URI` set in Render environment
- [ ] All server files copied to repo
- [ ] Server deploys successfully
- [ ] MongoDB connection works

### Client:
- [ ] Form uses `imageUrl` field
- [ ] Validation matches server rules
- [ ] Images display correctly
- [ ] CRUD operations work
- [ ] List updates automatically

### Documentation:
- [ ] Main 242 page updated with project links
- [ ] Blackboard comment ready
- [ ] Can explain project to professor

---

## 📚 Files Created

### Server Files:
- `server-files/db.js` - MongoDB connection
- `server-files/models/Game.js` - Mongoose schema
- `server-files/routes/games.js` - API routes with Joi
- `server-files/server.js` - Main server file

### Client Files (Updated):
- `src/components/GameForm.jsx` - Updated to use `imageUrl`
- `src/pages/Games.jsx` - Updated to display `imageUrl`

### Documentation:
- `SERVER_MONGODB_SETUP.md` - Setup instructions
- `COMPLETE_SETUP_GUIDE.md` - This file
- `MAIN_PAGE_HTML_SNIPPET.html` - HTML for portfolio page
- `BLACKBOARD_COMMENT.txt` - Submission comment

---

## 🎉 You're Done!

Your Game Day project now has:
- ✅ MongoDB persistence
- ✅ Joi validation integrated
- ✅ Image URL support
- ✅ Full CRUD operations
- ✅ Real-time UI updates

Good luck with your project! 🚀

