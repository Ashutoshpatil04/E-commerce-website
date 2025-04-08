require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'iPhone 14 Pro',
    description: 'Latest iPhone with amazing camera features and A16 Bionic chip',
    price: 129999,
    category: 'Smartphones',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'MacBook Pro M2',
    description: 'Powerful laptop with M2 chip for professionals',
    price: 199999,
    category: 'Laptops',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Sony WH-1000XM4',
    description: 'Premium noise-cancelling headphones with exceptional sound quality',
    price: 24999,
    category: 'Audio',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Samsung QLED 4K TV',
    description: '65-inch QLED TV with stunning picture quality and smart features',
    price: 159999,
    category: 'TVs',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'iPad Air',
    description: 'Versatile tablet perfect for work and entertainment',
    price: 54999,
    category: 'Tablets',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Apple Watch Series 8',
    description: 'Advanced smartwatch with health monitoring features',
    price: 44999,
    category: 'Wearables',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'DJI Mini 3 Pro',
    description: 'Compact drone with 4K camera and intelligent features',
    price: 89999,
    category: 'Drones',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'PlayStation 5',
    description: 'Next-gen gaming console with stunning graphics',
    price: 49999,
    category: 'Gaming',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB Atlas');

    // Delete existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Added ${insertedProducts.length} products`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedProducts(); 