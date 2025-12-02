/**
 * Express Routes for Games API
 * 
 * GET    /api/games      - Get all games
 * GET    /api/games/:id   - Get a single game
 * POST   /api/games      - Create a new game (with Joi validation)
 * PUT    /api/games/:id   - Update a game (with Joi validation)
 * DELETE /api/games/:id   - Delete a game
 */

const express = require('express')
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')
const Game = require('../models/Game')

// Middleware to check MongoDB connection before processing requests
const checkConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database connection not ready. Please try again in a moment.',
      error: 'Database unavailable'
    })
  }
  next()
}

// Apply connection check to all routes
router.use(checkConnection)

// Joi validation schema - Relaxed rules for smoother processing
const gameSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      'string.empty': 'Matchup title is required.',
      'string.max': 'Title must be 200 characters or less.',
      'any.required': 'Matchup title is required.',
    }),

  league: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'League is required.',
      'string.max': 'League must be 100 characters or less.',
      'any.required': 'League is required.',
    }),

  date: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Date is required.',
      'any.required': 'Date is required.',
    }),

  time: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Time is required.',
      'any.required': 'Time is required.',
    }),

  venue: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      'string.empty': 'Venue is required.',
      'string.max': 'Venue must be 200 characters or less.',
      'any.required': 'Venue is required.',
    }),

  city: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      'string.empty': 'City is required.',
      'string.max': 'City must be 200 characters or less.',
      'any.required': 'City is required.',
    }),

  price: Joi.number()
    .min(0)
    .max(10000)
    .required()
    .messages({
      'number.base': 'Price must be a number.',
      'number.min': 'Price cannot be negative.',
      'number.max': 'Price must be $10,000 or less.',
      'any.required': 'Price estimate is required.',
    }),

  imageUrl: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Image URL must be 500 characters or less.',
    }),

  summary: Joi.string()
    .trim()
    .max(500)
    .required()
    .messages({
      'string.empty': 'Summary is required.',
      'string.max': 'Summary must be 500 characters or less.',
      'any.required': 'Summary is required.',
    }),
})

// Helper function to format Joi errors
function formatJoiErrors(error) {
  if (!error) return []
  return error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message,
  }))
}

// GET /api/games - Get all games from MongoDB
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({}).sort({ createdAt: -1 }) // Newest first
    res.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    res.status(500).json({ message: 'Error fetching games from database' })
  }
})

// GET /api/games/:id - Get a single game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' })
    }
    
    res.json({ game })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Game not found' })
    }
    console.error('Error fetching game:', error)
    res.status(500).json({ message: 'Error fetching game from database' })
  }
})

// POST /api/games - Create a new game (with Joi validation)
router.post('/', async (req, res) => {
  try {
    // Validate with Joi first
    const { error, value } = gameSchema.validate(req.body, { abortEarly: false })
    
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatJoiErrors(error),
      })
    }
    
    // Create new game in MongoDB
    const newGame = new Game(value)
    const savedGame = await newGame.save()
    
    // Return success response
    res.status(201).json({
      message: 'Game created successfully',
      game: savedGame,
    })
  } catch (error) {
    // Handle Mongoose validation errors (shouldn't happen if Joi passes, but just in case)
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }))
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      })
    }
    
    console.error('Error creating game:', error)
    res.status(500).json({ message: 'Error creating game in database' })
  }
})

// PUT /api/games/:id - Update an existing game (with Joi validation)
router.put('/:id', async (req, res) => {
  try {
    // Validate with Joi first
    const { error, value } = gameSchema.validate(req.body, { abortEarly: false })
    
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatJoiErrors(error),
      })
    }
    
    // Find and update game in MongoDB
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true } // Return updated document, run validators
    )
    
    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' })
    }
    
    // Return success response
    res.status(200).json({
      message: 'Game updated successfully',
      game: updatedGame,
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Game not found' })
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }))
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      })
    }
    
    console.error('Error updating game:', error)
    res.status(500).json({ message: 'Error updating game in database' })
  }
})

// DELETE /api/games/:id - Delete a game
router.delete('/:id', async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id)
    
    if (!deletedGame) {
      return res.status(404).json({ message: 'Game not found' })
    }
    
    // Return success response
    res.status(200).json({
      message: 'Game deleted successfully',
      game: deletedGame,
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Game not found' })
    }
    console.error('Error deleting game:', error)
    res.status(500).json({ message: 'Error deleting game from database' })
  }
})

module.exports = router

