const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB Atlas Connection
async function testAtlasConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection...\n');
  
  try {
    // Test connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection String: ${process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // Test basic operations
    console.log('\n🧪 Testing Basic Operations...');
    
    // Test collection creation
    const testCollection = mongoose.connection.collection('test_connection');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Atlas connection test successful'
    });
    console.log('✅ Write operation successful');
    
    // Test read operation
    const result = await testCollection.findOne({ test: true });
    console.log('✅ Read operation successful');
    
    // Clean up test data
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete operation successful');
    
    console.log('\n🎉 All Atlas connection tests passed!');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas Connection Failed:');
    console.error('Error:', error.message);
    
    // Provide helpful debugging information
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if MONGODB_URI is set in your .env file');
    console.log('2. Verify your Atlas cluster is running');
    console.log('3. Ensure your IP is whitelisted in Atlas');
    console.log('4. Check username and password in connection string');
    console.log('5. Verify network connectivity');
    
    if (error.message.includes('authentication')) {
      console.log('\n🔐 Authentication Error: Check your username and password');
    } else if (error.message.includes('network')) {
      console.log('\n🌐 Network Error: Check your IP whitelist in Atlas');
    } else if (error.message.includes('timeout')) {
      console.log('\n⏰ Timeout Error: Check your internet connection');
    }
    
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

// Run the test
testAtlasConnection(); 