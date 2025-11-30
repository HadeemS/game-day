# ✅ Quick Verification - Is Everything Working?

## 🧪 5-Minute Test

### Test 1: Server API (1 minute)
```bash
# Visit in browser:
https://game-day-api-1.onrender.com/api/games

# Should return: [] (empty array) or array of games
```

### Test 2: Create a Game (2 minutes)
1. Visit: `https://hadeems.github.io/game-day/games`
2. Fill out the form:
   - Title: "Test Game"
   - League: "NBA"
   - Date: Pick any date
   - Time: Pick any time
   - Venue: "Test Arena"
   - City: "Test City"
   - Price: 100
   - Image URL: `https://via.placeholder.com/400x300` (or any image URL)
   - Summary: "This is a test game for verification"
3. Click "Share this game"
4. ✅ Should see success message
5. ✅ Game should appear in list immediately (no refresh)

### Test 3: Edit a Game (1 minute)
1. Click "Edit" button on the game you just created
2. ✅ Form should pre-populate with all fields (including imageUrl)
3. Change the title to "Updated Test Game"
4. Click "Update game"
5. ✅ Should see success message
6. ✅ Updated title should appear in list immediately

### Test 4: Delete a Game (30 seconds)
1. Click "Delete" button on a game
2. Confirm deletion
3. ✅ Game should disappear immediately
4. ✅ No errors in browser console

### Test 5: Images Display (30 seconds)
1. ✅ Images should show in game cards
2. ✅ Images should show when editing
3. ✅ Fallback image shows if URL is invalid

---

## ✅ If All Tests Pass

**You're done!** Just need to:
1. Update your main 242 portfolio page with project links
2. Copy Blackboard comment for submission

---

## 🐛 If Something Fails

### Images Not Showing:
- Check browser console for errors
- Verify `imageUrl` field name (should be `imageUrl`, not `img`)
- Test image URL in browser directly

### List Not Updating:
- Check browser console for errors
- Verify API is returning data: `https://game-day-api-1.onrender.com/api/games`
- Check Render logs for errors

### Form Not Submitting:
- Check browser console for errors
- Verify all required fields are filled
- Check validation error messages

---

## 🎉 Success Criteria

✅ Form creates games with imageUrl
✅ Games appear in list immediately
✅ Edit form pre-populates correctly
✅ Delete removes games immediately
✅ Images display correctly
✅ No errors in console
✅ No errors in Render logs

**If all checked, you're ready to submit!** 🚀

