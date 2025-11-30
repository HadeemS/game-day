# Quick Reference - MongoDB Migration

## 🔑 Key Changes Summary

### Field Name Change:
- **Old**: `img`
- **New**: `imageUrl`
- **Reason**: More descriptive, matches MongoDB schema

### Server Structure:
```
server.js (main entry)
├── db.js (MongoDB connection)
├── models/Game.js (Mongoose schema)
└── routes/games.js (API routes)
```

### Environment Variables:
- **MONGODB_URI**: MongoDB Atlas connection string
- **PORT**: Server port (default: 3000)

---

## 📝 Copy-Paste Code Snippets

### MongoDB Connection String Format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gameday?retryWrites=true&w=majority
```

### Render Environment Variable:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gameday?retryWrites=true&w=majority
```

### Test API Endpoints:
- GET: `https://game-day-api-1.onrender.com/api/games`
- POST: `https://game-day-api-1.onrender.com/api/games` (with JSON body)
- PUT: `https://game-day-api-1.onrender.com/api/games/:id` (with JSON body)
- DELETE: `https://game-day-api-1.onrender.com/api/games/:id`

---

## 🎯 Field Mapping

### Form Fields → MongoDB Fields:
| Form Field | MongoDB Field | Type | Required |
|------------|---------------|------|----------|
| title | title | String | ✅ |
| league | league | String | ✅ |
| date | date | String | ✅ |
| time | time | String | ✅ |
| venue | venue | String | ✅ |
| city | city | String | ✅ |
| price | price | Number | ✅ |
| imageUrl | imageUrl | String | ✅ |
| summary | summary | String | ✅ |

---

## ✅ Validation Rules (Joi + Mongoose)

| Field | Min | Max | Pattern/Format |
|-------|-----|-----|---------------|
| title | 3 | 100 | - |
| league | 2 | 60 | - |
| date | - | - | YYYY-MM-DD |
| time | - | - | HH:mm (24-hour) |
| venue | 3 | 120 | - |
| city | 3 | 120 | - |
| price | 0 | 5000 | Integer |
| imageUrl | - | - | http(s):// or / |
| summary | 10 | 280 | - |

---

## 🚀 Deployment Checklist

### Server:
1. ✅ Install: `npm install mongoose dotenv`
2. ✅ Create MongoDB Atlas cluster
3. ✅ Set `MONGODB_URI` in Render
4. ✅ Copy server files to repo
5. ✅ Deploy to Render

### Client:
1. ✅ Form uses `imageUrl` field
2. ✅ Validation updated
3. ✅ Test locally
4. ✅ Deploy to GitHub Pages

---

## 📞 Support

If something doesn't work:
1. Check Render logs
2. Check MongoDB Atlas connection
3. Verify environment variables
4. Test API endpoints directly
5. Check browser console for client errors

