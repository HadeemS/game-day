/**
 * SERVER-SIDE CODE EXAMPLE
 * 
 * This file shows what your Express server should look like to support
 * POST, PUT, and DELETE routes with Joi validation.
 * 
 * Add this to your existing server repo (game-day-api).
 * 
 * Make sure you have these dependencies installed:
 * npm install express joi cors
 */

const express = require('express')
const Joi = require('joi')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// In-memory storage (replace with database in production)
let games = [
  {
    _id: 1,
    title: 'Lakers vs Celtics',
    league: 'NBA',
    date: '2024-12-15',
    time: '20:00',
    venue: 'Crypto.com Arena',
    city: 'Los Angeles, CA',
    price: 150,
    img: '/images/lakers-celtics.jpg',
    summary: 'A classic rivalry matchup between two historic franchises.'
  },
  {
    _id: 2,
    title: 'Falcons vs Saints',
    league: 'NFL',
    date: '2024-12-20',
    time: '13:00',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta, GA',
    price: 120,
    img: '/images/falcons-saints.jpg',
    summary: 'Divisional rivalry game with playoff implications.'
  }
]

// Counter for generating new IDs
let nextId = 3

// Joi validation schema - MUST match client-side validation
const gameSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Matchup title is required.',
      'string.min': 'Title should be at least 3 characters.',
      'string.max': 'Title must be 100 characters or less.',
      'any.required': 'Matchup title is required.'
    }),
  
  league: Joi.string()
    .trim()
    .min(2)
    .max(60)
    .required()
    .messages({
      'string.empty': 'League is required.',
      'string.min': 'League must be at least 2 characters.',
      'string.max': 'League must be 60 characters or less.',
      'any.required': 'League is required.'
    }),
  
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.empty': 'Date is required.',
      'string.pattern.base': 'Use YYYY-MM-DD format.',
      'any.required': 'Date is required.'
    }),
  
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required()
    .messages({
      'string.empty': 'Kick/tip time is required.',
      'string.pattern.base': 'Use 24-hour HH:mm format.',
      'any.required': 'Kick/tip time is required.'
    }),
  
  venue: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .required()
    .messages({
      'string.empty': 'Venue is required.',
      'string.min': 'Venue must be at least 3 characters.',
      'string.max': 'Venue must be 120 characters or less.',
      'any.required': 'Venue is required.'
    }),
  
  city: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .required()
    .messages({
      'string.empty': 'City is required.',
      'string.min': 'City must be at least 3 characters.',
      'string.max': 'City must be 120 characters or less.',
      'any.required': 'City is required.'
    }),
  
  price: Joi.number()
    .integer()
    .min(0)
    .max(5000)
    .required()
    .messages({
      'number.base': 'Price must be a number.',
      'number.integer': 'Price must be a whole number.',
      'number.min': 'Price cannot be negative.',
      'number.max': 'Price must be $5000 or less.',
      'any.required': 'Price estimate is required.'
    }),
  
  img: Joi.string()
    .trim()
    .pattern(/^(https?:\/\/|\/)/i)
    .required()
    .messages({
      'string.empty': 'Image path or URL is required.',
      'string.pattern.base': 'Image should start with http(s):// or /',
      'any.required': 'Image path or URL is required.'
    }),
  
  summary: Joi.string()
    .trim()
    .min(10)
    .max(280)
    .required()
    .messages({
      'string.empty': 'Summary is required.',
      'string.min': 'Summary should be at least 10 characters.',
      'string.max': 'Keep the summary under 280 characters.',
      'any.required': 'Summary is required.'
    })
})

// GET /api/games - Get all games
app.get('/api/games', (req, res) => {
  res.json(games)
})

// GET /api/games/:id - Get a single game
app.get('/api/games/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const game = games.find(g => g._id === id)
  
  if (!game) {
    return res.status(404).json({ message: 'Game not found' })
  }
  
  res.json({ game })
})

// POST /api/games - Create a new game
app.post('/api/games', (req, res) => {
  // Validate the request body
  const { error, value } = gameSchema.validate(req.body, { abortEarly: false })
  
  if (error) {
    // Return validation errors
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }))
    return res.status(400).json({ 
      message: 'Validation failed',
      errors 
    })
  }
  
  // Create new game
  const newGame = {
    _id: nextId++,
    ...value
  }
  
  games.push(newGame)
  
  // Return success response
  res.status(201).json({ 
    message: 'Game created successfully',
    game: newGame 
  })
})

// PUT /api/games/:id - Update an existing game
app.put('/api/games/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const gameIndex = games.findIndex(g => g._id === id)
  
  if (gameIndex === -1) {
    return res.status(404).json({ message: 'Game not found' })
  }
  
  // Validate the request body
  const { error, value } = gameSchema.validate(req.body, { abortEarly: false })
  
  if (error) {
    // Return validation errors
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }))
    return res.status(400).json({ 
      message: 'Validation failed',
      errors 
    })
  }
  
  // Update the game (preserve the _id)
  const updatedGame = {
    _id: id,
    ...value
  }
  
  games[gameIndex] = updatedGame
  
  // Return success response
  res.status(200).json({ 
    message: 'Game updated successfully',
    game: updatedGame 
  })
})

// DELETE /api/games/:id - Delete a game
app.delete('/api/games/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const gameIndex = games.findIndex(g => g._id === id)
  
  if (gameIndex === -1) {
    return res.status(404).json({ message: 'Game not found' })
  }
  
  // Remove the game from the array
  const deletedGame = games.splice(gameIndex, 1)[0]
  
  // Return success response
  res.status(200).json({ 
    message: 'Game deleted successfully',
    game: deletedGame 
  })
})

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Game Day API',
    endpoints: {
      'GET /api/games': 'Get all games',
      'GET /api/games/:id': 'Get a single game',
      'POST /api/games': 'Create a new game',
      'PUT /api/games/:id': 'Update a game',
      'DELETE /api/games/:id': 'Delete a game'
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app

