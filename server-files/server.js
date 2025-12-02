/**
 * Main Express Server File
 * 
 * This is your main server file that ties everything together.
 * Replace your existing server.js/index.js with this code.
 */

require('dotenv').config() // Load environment variables from .env file
const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./db') // MongoDB connection
const connectDB = db.connectDB // Get connectDB function
const gamesRoutes = require('./routes/games')

const app = express()
const PORT = process.env.PORT || 3000
const CLIENT_BUILD_PATH = path.join(__dirname, '..', 'build')

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/games', gamesRoutes)

// Health check route (useful for Render)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: db.readyState === 1 ? 'connected' : 'disconnected' })
})

// Serve React build (static assets) in production
app.use(express.static(CLIENT_BUILD_PATH))

// SPA fallback: send index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next()
  }
  res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'), (err) => {
    if (err) {
      next(err)
    }
  })
})

// Start server only after MongoDB connection is established
async function startServer() {
  try {
    // Wait for MongoDB connection before starting server
    await connectDB()
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 MongoDB connection status: Connected`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

module.exports = app
