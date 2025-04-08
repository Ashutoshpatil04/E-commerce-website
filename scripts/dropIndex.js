const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://ashu:NRDBF4WJ6tLn2gk3@p5ecommerce.qliudjd.mongodb.net/ecommerce?retryWrites=true&w=majority';

async function dropIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Get the users collection
    const usersCollection = mongoose.connection.collection('users');
    
    // List all indexes
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes);

    // Drop the rollNo index if it exists
    const rollNoIndex = indexes.find(index => index.name === 'rollNo_1');
    if (rollNoIndex) {
      await usersCollection.dropIndex('rollNo_1');
      console.log('Successfully dropped rollNo_1 index');
    } else {
      console.log('rollNo_1 index not found');
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

dropIndex(); 