/**
 * Main Express Server File
 * 
 * This is your main server file that ties everything together.
 * Replace your existing server.js/index.js with this code.
 */

require('dotenv').config() // Load environment variables from .env file
const express = require('express')
const cors = require('cors')
const db = require('./db') // MongoDB connection
const gamesRoutes = require('./routes/games')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/games', gamesRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Game Day API - MongoDB Version',
    endpoints: {
      'GET /api/games': 'Get all games',
      'GET /api/games/:id': 'Get a single game',
      'POST /api/games': 'Create a new game',
      'PUT /api/games/:id': 'Update a game',
      'DELETE /api/games/:id': 'Delete a game',
    },
    database: 'MongoDB (Mongoose)',
    validation: 'Joi + Mongoose',
  })
})

// Health check route (useful for Render)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: db.readyState === 1 ? 'connected' : 'disconnected' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 MongoDB connection status: ${db.readyState === 1 ? 'Connected' : 'Connecting...'}`)
})

module.exports = app

