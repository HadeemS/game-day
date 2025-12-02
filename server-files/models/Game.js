/**
 * Mongoose Model for Game
 * 
 * This schema defines the structure of game documents in MongoDB.
 * Fields match the Joi validation schema exactly.
 */

const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  league: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  date: {
    type: String,
    required: true,
    // Removed strict format match - accept any date string
  },
  time: {
    type: String,
    required: true,
    // Removed strict format match - accept any time string
  },
  venue: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
    // Removed integer validation - allow decimals
  },
  imageUrl: {
    type: String,
    required: false, // Made optional
    trim: true,
    maxlength: 500,
    // Removed strict URL pattern match
  },
  summary: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
})

// Create and export the model
const Game = mongoose.model('Game', gameSchema)

module.exports = Game

