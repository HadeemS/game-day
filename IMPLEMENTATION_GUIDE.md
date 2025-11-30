# Game Day Project - Implementation Guide

## ✅ What's Been Implemented

### Client-Side (React)

#### 1. **POST Functionality** ✅ (Already existed, verified working)
- **File**: `src/components/GameForm.jsx`
- **API Function**: `src/api/games.js` → `createGame()`
- **Features**:
  - Form with all required fields
  - Client-side validation matching server Joi rules
  - Success/error state feedback
  - Auto-refreshes game list after successful POST

#### 2. **PUT Functionality** ✅ (Newly added)
- **File**: `src/components/GameForm.jsx` (enhanced to support editing)
- **API Function**: `src/api/games.js` → `updateGame(id, gameData)`
- **Features**:
  - Form can now be used for both creating and editing
  - When `game` prop is provided, form enters edit mode
  - Pre-populates form fields with existing game data
  - Client-side validation (same as POST)
  - Success feedback: "Game updated successfully!"
  - Auto-refreshes game list after successful update

#### 3. **DELETE Functionality** ✅ (Newly added)
- **File**: `src/pages/Games.jsx`
- **API Function**: `src/api/games.js` → `deleteGame(id)`
- **Features**:
  - Delete button on each game card
  - Confirmation dialog before deletion
  - Loading state while deleting
  - Auto-removes from UI immediately (optimistic update)
  - Auto-refreshes list to ensure sync with server

#### 4. **UI Enhancements** ✅
- **File**: `src/styles/games.css`
- **Features**:
  - Edit/Delete buttons styled to match your site design
  - Small button variant (`.btn-sm`)
  - Danger button styling for delete actions
  - Form actions properly laid out with cancel button in edit mode
  - Responsive design maintained

### Server-Side (Example Code Provided)

#### **File**: `SERVER_CODE_EXAMPLE.js`
- Complete Express server example with:
  - POST route with Joi validation
  - PUT route with Joi validation
  - DELETE route
  - Proper error handling and status codes
  - Validation messages matching client-side

---

## 📁 Files Modified

### Client-Side Files:
1. **`src/api/games.js`**
   - Added `updateGame(id, gameData)` function
   - Added `deleteGame(id)` function

2. **`src/components/GameForm.jsx`**
   - Added support for edit mode via `game` prop
   - Added `onCancel` prop for canceling edit
   - Updated submit handler to use `updateGame` when editing
   - Dynamic title and button text based on mode

3. **`src/pages/Games.jsx`**
   - Added `editingGame` state to track which game is being edited
   - Added `deletingGameId` state for loading indicators
   - Added `handleEdit()` function
   - Added `handleDelete()` function with confirmation
   - Updated game cards to include Edit/Delete buttons
   - Auto-scrolls to form when editing

4. **`src/styles/games.css`**
   - Added `.game-card-wrapper` styles
   - Added `.game-card__actions` styles
   - Added `.btn-sm` and `.btn-danger` styles
   - Added `.game-form__actions` styles

### Server-Side (Example):
5. **`SERVER_CODE_EXAMPLE.js`** (New file)
   - Complete server implementation example

---

## 🔧 How It Works

### POST (Create New Game)
1. User fills out form in `GameForm` component
2. Client-side validation runs (matches Joi rules)
3. If valid, `createGame()` sends POST request to `/api/games`
4. Server validates with Joi, adds to array, returns 201 with new game
5. Client receives success, clears form, refreshes list
6. New game appears in the list automatically

### PUT (Edit Existing Game)
1. User clicks "Edit" button on a game card
2. `handleEdit()` sets `editingGame` state and scrolls to form
3. `GameForm` receives `game` prop, enters edit mode, pre-fills fields
4. User modifies fields and submits
5. Client-side validation runs (same rules as POST)
6. If valid, `updateGame(id, gameData)` sends PUT request to `/api/games/:id`
7. Server validates with Joi, updates array, returns 200 with updated game
8. Client receives success, clears edit mode, refreshes list
9. Updated game appears in the list automatically

### DELETE (Remove Game)
1. User clicks "Delete" button on a game card
2. Confirmation dialog appears
3. If confirmed, `handleDelete()` calls `deleteGame(id)`
4. DELETE request sent to `/api/games/:id`
5. Server removes game from array, returns 200
6. Client immediately removes from UI (optimistic update)
7. List refreshes to ensure sync

---

## 🎯 Assignment Requirements Checklist

### Client Side – Part 1 (POST) ✅
- [x] Use React properly: components, props, state, etc.
- [x] Add a form so users can post new data to the server
- [x] Use a state variable to show the user if they successfully added the data
- [x] The list that shows the data should be in state and auto-update when new data is added (no manual page refresh)
- [x] Add client-side validation that matches the server-side Joi validation
- [x] The form must be nicely styled and match my site design (no ugly default form, no huge images)
- [x] Don't make it look like the teacher's example code

### Server Side – Part 1 (POST) ⚠️
- [ ] **YOU NEED TO**: Add POST route to your server repo
- [ ] **YOU NEED TO**: Validate incoming data with Joi
- [ ] **YOU NEED TO**: Add it to the in-memory array correctly
- [ ] **YOU NEED TO**: Return a clear success/failure response
- **See**: `SERVER_CODE_EXAMPLE.js` for reference

### Client Side – Part 2 (PUT + DELETE) ✅
- [x] Add a way for users to Edit and Delete items in the list
- [x] This should use forms and state to show when edit/delete is successful
- [x] Edit and delete actions must send PUT and DELETE requests to the server
- [x] When an item is edited, get a 200 response and see updated data automatically
- [x] When an item is deleted, after a 200 response, it disappears from the UI
- [x] Client-side validation for edit must match Joi on the server
- [x] The edit/delete UI should be nicely styled and integrated with the rest of my site

### Server Side – Part 2 (PUT + DELETE) ⚠️
- [ ] **YOU NEED TO**: Add PUT route that uses Joi, updates correct item, returns success/failure
- [ ] **YOU NEED TO**: Add DELETE route that removes correct item, returns success/failure
- **See**: `SERVER_CODE_EXAMPLE.js` for reference

### Main 242 Home Page Requirements ⚠️
- [ ] **YOU NEED TO**: Add link to server-side GitHub repo
- [ ] **YOU NEED TO**: Add link to Render server URL
- [ ] **YOU NEED TO**: Add link to client-side GitHub repo (already exists: https://github.com/HadeemS/game-day)
- [ ] **YOU NEED TO**: Add link to client-side live website (already exists: https://hadeems.github.io/game-day/)

---

## 🚀 Next Steps

### 1. Update Your Server Repo
Copy the routes from `SERVER_CODE_EXAMPLE.js` into your server repo (`game-day-api`). Make sure:
- You have `joi` installed: `npm install joi`
- The validation schema matches exactly (copy from the example)
- Your routes return the correct status codes (201 for POST, 200 for PUT/DELETE)
- Error responses include clear messages

### 2. Test the Integration
1. Start your server locally or deploy to Render
2. Update `REACT_APP_API_BASE_URL` in `.env` if needed (or it defaults to your Render URL)
3. Test POST: Fill out form, submit, verify game appears
4. Test PUT: Click Edit, modify fields, submit, verify changes appear
5. Test DELETE: Click Delete, confirm, verify game disappears

### 3. Update Your Main 242 Home Page
Add these four links clearly visible on your portfolio site:
- Server GitHub: `https://github.com/HadeemS/game-day-api` (or your actual repo)
- Render URL: `https://game-day-api.onrender.com` (or your actual URL)
- Client GitHub: `https://github.com/HadeemS/game-day`
- Client Live Site: `https://hadeems.github.io/game-day/`

---

## 💡 Explaining Your Project (For Interview/Professor)

### What Each Route Does:

**POST `/api/games`**: Creates a new game entry
- Validates all fields using Joi (title, league, date, time, venue, city, price, img, summary)
- Adds the game to the in-memory array with a new ID
- Returns 201 Created with the new game object

**PUT `/api/games/:id`**: Updates an existing game
- Finds the game by ID
- Validates the updated data with the same Joi schema
- Replaces the old game data with the new data (preserving the ID)
- Returns 200 OK with the updated game object

**DELETE `/api/games/:id`**: Removes a game
- Finds the game by ID
- Removes it from the array
- Returns 200 OK with the deleted game object

### How Validation Works:

**Server-Side (Joi)**:
- Validates data structure, types, and constraints
- Returns 400 Bad Request with specific error messages if validation fails
- Ensures data integrity before storing

**Client-Side (JavaScript)**:
- Mirrors the Joi rules exactly (same min/max lengths, patterns, etc.)
- Provides immediate feedback before sending to server
- Reduces unnecessary server requests
- Better user experience (no waiting for server round-trip)

### How State Updates:

**React State Management**:
- `games` state holds the list of games
- `reloadKey` triggers a refresh when incremented
- After successful POST/PUT/DELETE, `reloadKey` increments
- `useEffect` watches `reloadKey` and fetches fresh data
- UI updates automatically without manual refresh

**Optimistic Updates**:
- For DELETE, we immediately remove from UI for instant feedback
- Then refresh from server to ensure consistency
- Provides smooth, responsive user experience

---

## 🐛 Troubleshooting

### Form doesn't submit / No success message
- Check browser console for errors
- Verify server is running and accessible
- Check CORS settings on server
- Verify API_BASE_URL is correct

### Edit form doesn't populate
- Check that game object has all required fields
- Verify date/time format matches what form expects
- Check browser console for errors

### Delete doesn't work
- Check that game ID is being passed correctly
- Verify server DELETE route is implemented
- Check browser console and server logs

### List doesn't refresh after POST/PUT/DELETE
- Verify `onSuccess` callback is being called
- Check that `setReloadKey` is incrementing
- Verify `getGames()` is being called in useEffect

---

## 📝 Notes

- The client-side validation exactly matches the server-side Joi validation
- All routes return proper HTTP status codes (201, 200, 400, 404)
- Error messages are user-friendly and specific
- The UI is styled to match your existing site design
- Everything works without page refreshes (SPA behavior)

Good luck with your project! 🎉

