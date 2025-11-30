/**
 * MongoDB Connection File
 * 
 * This file handles connecting to MongoDB using Mongoose.
 * Uses MONGODB_URI environment variable (set in Render dashboard).
 */

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gameday'

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Connection event handlers
const db = mongoose.connection

db.on('error', (error) => {
  console.error('MongoDB connection error:', error)
})

db.once('open', () => {
  console.log('✅ Connected to MongoDB successfully')
})

db.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

// Handle app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed due to app termination')
  process.exit(0)
})

module.exports = db

