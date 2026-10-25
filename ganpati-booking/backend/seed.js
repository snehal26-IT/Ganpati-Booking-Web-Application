const dotenv = require('dotenv');
dotenv.config();
const { connectDB } = require('./config/db');
const store = require('./config/store');

const seedData = async () => {
  await connectDB();
  const initialProducts = [
    {
      name: 'Clay Ganesha Idol (Shadu Mati)',
      category: 'clay',
      price: 1500,
      size: 'Medium',
      description: 'Shaped from 100% natural river clay and finished with non-toxic colors. Dissolves fully in water.',
      imageUrl: 'https://myecoganesh.com/wp-content/uploads/2022/02/61cdw0ka0kS-1.png',
      stockQuantity: 50,
      isAvailable: true
    },
    {
      name: 'Plant Ganesha Idol (Seed Embedded)',
      category: 'plant',
      price: 2200,
      size: 'Medium',
      description: 'Made from red soil (lal mati) embedded with seeds. Grow a tree after visarjan.',
      imageUrl: 'https://myecoganesh.com/wp-content/uploads/2022/02/New-Project-3.png',
      stockQuantity: 30,
      isAvailable: true
    },
    {
      name: 'Eco Festive Decor Kit',
      category: 'decorated',
      price: 999,
      size: 'Standard',
      description: 'Natural-fibre eco decor, flower garlands, and bio-degradable accessories.',
      imageUrl: 'https://myecoganesh.com/wp-content/uploads/2025/06/Multani-Mitti-Haldi-Kum-Kum-Ganesha-Idols-16.webp',
      stockQuantity: 100,
      isAvailable: true
    }
  ];

  await store.seedProducts(initialProducts);
  console.log('[Seed] Seeding completed.');
  process.exit(0);
};

seedData();
