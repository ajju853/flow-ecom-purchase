
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    
    await Product.deleteMany({});
    
    const products = [
      {
        id: 'prod-001',
        name: 'Converse Chuck Taylor All Star II Hi',
        description: 'The iconic Chuck Taylor All Star gets a modern upgrade with premium materials and enhanced comfort. Featuring a padded tongue and collar, plus improved cushioning for all-day wear.',
        price: 75.00,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center',
        variants: {
          color: ['Black', 'White', 'Red', 'Navy'],
          size: ['7', '8', '9', '10', '11', '12']
        },
        inventory: 50
      }
    ];
    
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
