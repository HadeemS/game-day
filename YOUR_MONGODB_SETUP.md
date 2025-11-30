# Your MongoDB Setup - Ready to Use! 🚀

## ✅ Your MongoDB Connection String

```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/gameday?appName=Gameday
```

**⚠️ SECURITY WARNING**: Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual MongoDB Atlas credentials. Never commit this connection string to GitHub!

Your connection string should have:
- ✅ Username: Your MongoDB Atlas username
- ✅ Password: Your MongoDB Atlas password
- ✅ Database: `gameday`
- ✅ Cluster: `gameday.nf4nnn9.mongodb.net`

---

## 🚀 Quick Setup Steps

### Step 1: Set Environment Variable on Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your service: `game-day-api` (or whatever you named it)
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/gameday?appName=Gameday`
   - ⚠️ Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual credentials!
6. Click **"Save Changes"**
7. Render will automatically redeploy your service

### Step 2: Local Development (.env file)

Create a `.env` file in your `game-day-api` repo root:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/gameday?appName=Gameday
PORT=3000
```

**Important**: 
- Add `.env` to your `.gitignore` file (if not already there)
- Never commit `.env` to git!

### Step 3: Test Connection

After setting the environment variable on Render:

1. Wait for deployment to complete (~2 minutes)
2. Check Render logs - you should see: `✅ Connected to MongoDB successfully`
3. Test the API: `https://game-day-api-1.onrender.com/api/games`
4. Should return: `[]` (empty array initially)

---

## 📋 MongoDB Atlas Security Checklist

Make sure your MongoDB Atlas cluster allows connections:

1. Go to: https://cloud.mongodb.com/
2. Click on your cluster → **"Network Access"**
3. Make sure you have an IP whitelist entry:
   - **Option 1**: `0.0.0.0/0` (allows all IPs - good for Render)
   - **Option 2**: Add Render's IP addresses (if you know them)

4. Go to **"Database Access"**
5. Make sure user `hadeemsecka_db_user` exists and has read/write permissions

---

## 🧪 Test Your Setup

### Test 1: Server Connection
```bash
# Visit in browser or use curl:
curl https://game-day-api-1.onrender.com/api/games

# Should return: []
```

### Test 2: Create a Game (POST)
```bash
curl -X POST https://game-day-api-1.onrender.com/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lakers vs Celtics",
    "league": "NBA",
    "date": "2024-12-25",
    "time": "20:00",
    "venue": "Crypto.com Arena",
    "city": "Los Angeles, CA",
    "price": 150,
    "imageUrl": "https://example.com/image.jpg",
    "summary": "A classic rivalry matchup between two historic franchises."
  }'
```

### Test 3: Get All Games (GET)
```bash
curl https://game-day-api-1.onrender.com/api/games

# Should return the game you just created
```

---

## ✅ Verification Checklist

- [ ] `MONGODB_URI` set in Render environment variables
- [ ] Render deployment completed successfully
- [ ] Render logs show: "✅ Connected to MongoDB successfully"
- [ ] API endpoint returns: `[]` or game data
- [ ] `.env` file created locally (not committed to git)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Database user has proper permissions

---

## 🐛 Troubleshooting

### "MongoDB connection error"
- ✅ Check `MONGODB_URI` is set correctly in Render
- ✅ Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- ✅ Check user password is correct
- ✅ Verify database name is `gameday`

### "Authentication failed"
- ✅ Check username: `hadeemsecka_db_user`
- ✅ Check password: `aSCEaoJu7cbL9Re2`
- ✅ Verify user exists in MongoDB Atlas

### "Network timeout"
- ✅ Check MongoDB Atlas cluster is running
- ✅ Verify IP whitelist allows your IP/Render IPs
- ✅ Check connection string format is correct

---

## 📝 Next Steps

1. ✅ Set `MONGODB_URI` in Render (Step 1 above)
2. ✅ Copy server files to your repo
3. ✅ Deploy to Render
4. ✅ Test API endpoints
5. ✅ Test client-side form
6. ✅ Verify images display correctly

---

## 🎉 You're Ready!

Once `MONGODB_URI` is set in Render, your server will automatically connect to MongoDB when it starts. The connection happens in `db.js` which is imported by `server.js`.

Good luck! 🚀

