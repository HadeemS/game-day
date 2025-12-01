/**
 * Quick test script to verify MongoDB connection
 * Run with: node test-connection.js
 * 
 * This helps verify your connection string works before deploying
 */

require('dotenv').config()
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gameday'

console.log('🔄 Testing MongoDB connection...')
console.log('Connection string:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')) // Hide password

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('✅ Connection successful!')
    console.log('📊 Database:', mongoose.connection.db.databaseName)
    console.log('🔗 Ready state:', mongoose.connection.readyState)
    
    // Test a simple query
    const Game = require('./models/Game')
    const count = await Game.countDocuments()
    console.log(`📝 Games in database: ${count}`)
    
    await mongoose.connection.close()
    console.log('✅ Test completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication error - check:')
      console.error('   - Username is correct')
      console.error('   - Password is correct')
      console.error('   - Password might need URL encoding if it has special characters')
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Network error - check:')
      console.error('   - Internet connection')
      console.error('   - MongoDB Atlas cluster is running')
    }
    
    process.exit(1)
  }
}

testConnection()

