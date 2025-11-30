# Server Files - Copy These to Your `game-day-api` Repo

## 📁 File Structure

Copy these files to your server repository:

```
game-day-api/
├── .env                    (create this - see below)
├── .gitignore             (make sure .env is in here!)
├── package.json
├── server.js              (replace your existing file)
├── db.js                   (copy this)
├── models/
│   └── Game.js            (copy this)
└── routes/
    └── games.js           (copy this)
```

---

## 🔑 Environment Variable

### For Render:
- Go to Render dashboard → Your service → Environment tab
- Add: `MONGODB_URI` = `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/gameday?appName=Gameday`
  - ⚠️ Replace with your actual MongoDB Atlas credentials!

### For Local (.env file):
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/gameday?appName=Gameday
PORT=3000
```

---

## 📦 Install Dependencies

```bash
npm install mongoose dotenv
```

---

## ✅ Files Included

1. **`db.js`** - MongoDB connection handler
2. **`models/Game.js`** - Mongoose schema with imageUrl field
3. **`routes/games.js`** - API routes (GET, POST, PUT, DELETE) with Joi validation
4. **`server.js`** - Main Express server file

---

## 🚀 Deploy

```bash
git add .
git commit -m "Add MongoDB integration"
git push
```

Render will automatically deploy and connect to MongoDB!

---

## 🧪 Test

Visit: `https://game-day-api-1.onrender.com/api/games`

Should return: `[]` (empty array initially)

