# 🎯 Quick Setup Card - Your MongoDB Connection

## Your Connection String (Copy This!)

```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/gameday?appName=Gameday
```

**⚠️ SECURITY**: Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual MongoDB Atlas credentials. Never commit this to GitHub!

---

## ✅ Render Setup (2 minutes)

1. Go to: https://dashboard.render.com
2. Click your service: `game-day-api`
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Paste:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/gameday?appName=Gameday`
   - ⚠️ Replace with your actual credentials!
6. Click **"Save Changes"**
7. ✅ Done! Render will auto-deploy

---

## 💻 Local Development (.env file)

Create `.env` in your `game-day-api` folder:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/gameday?appName=Gameday
PORT=3000
```

**⚠️ Important**: Add `.env` to `.gitignore`!

---

## 🧪 Quick Test

After setting up Render:

```bash
# Test your API
curl https://game-day-api-1.onrender.com/api/games

# Should return: []
```

---

## ✅ Checklist

- [ ] `MONGODB_URI` added to Render environment
- [ ] Render deployment successful
- [ ] Logs show: "✅ Connected to MongoDB successfully"
- [ ] API returns `[]` or game data
- [ ] `.env` file created locally (not in git)

---

## 🎉 That's It!

Your server will automatically connect to MongoDB when it starts. No code changes needed - just set the environment variable!

