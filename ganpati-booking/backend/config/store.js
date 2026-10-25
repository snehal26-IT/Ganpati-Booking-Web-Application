const fs = require('fs');
const path = require('path');
const { getIsMongoConnected } = require('./db');
const User = require('../models/User');
const Product = require('../models/Product');
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');

const dbFilePath = path.join(__dirname, '..', 'data', 'db.json');

// Ensure data folder exists
const dataDir = path.dirname(dbFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial DB structure
const defaultData = {
  users: [],
  products: [
    {
      id: 'p1',
      name: 'Clay Ganesha Idol',
      category: 'clay',
      price: 1500,
      size: 'Medium',
      description: 'Shaped from 100% natural river clay (Shadu Mati) and finished with non-toxic turmeric & kumkum. Dissolves fully in water.',
      imageUrl: 'https://myecoganesh.com/wp-content/uploads/2022/02/61cdw0ka0kS-1.png',
      stockQuantity: 50,
      isAvailable: true
    },
    {
      id: 'p2',
      name: 'Plant Ganesha Idol',
      category: 'plant',
      price: 2200,
      size: 'Medium',
      description: 'Made from lal mati (red soil) embedded with organic ladyfinger & tulsi seeds. Plant after visarjan.',
      imageUrl: 'https://myecoganesh.com/wp-content/uploads/2022/02/New-Project-3.png',
      stockQuantity: 30,
      isAvailable: true
    },
    {
      id: 'p3',
      name: 'Eco Festive Decor Kit',
      category: 'decorated',
      price: 999,
      size: 'Standard',
      description: 'Natural-fibre eco decor, flower garlands, hars, and bio-degradable puja accessories.',
      imageUrl: 'https://myecoganesh.com/wp-content/uploads/2025/06/Multani-Mitti-Haldi-Kum-Kum-Ganesha-Idols-16.webp',
      stockQuantity: 100,
      isAvailable: true
    },
    {
      id: 'p4',
      name: 'Lal Mati Tree Ganesha (14 Inch)',
      category: 'clay',
      price: 1800,
      size: 'Large',
      description: 'Beautiful hand-sculpted red clay idol suitable for apartment balcony visarjan.',
      imageUrl: 'https://myecoganesh.com/wp-content/uploads/2025/06/Lal-Mati-Ganpati-Plat-Ganesha-Tree-5.webp',
      stockQuantity: 25,
      isAvailable: true
    },
    {
      id: 'p5',
      name: 'Leaf-Based Eco Ganesha',
      category: 'eco',
      price: 1600,
      size: 'Small',
      description: 'Leaf-infused organic mud idol engineered for gentle dissolution.',
      imageUrl: 'https://myecoganesh.com/wp-content/uploads/2025/06/Lal-Mati-Ganpati-Plat-Ganesha-Tree-18.webp',
      stockQuantity: 40,
      isAvailable: true
    }
  ],
  bookings: [],
  inquiries: []
};

// Read local JSON database
const readJSON = () => {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return defaultData;
  }
};

// Write local JSON database
const writeJSON = (data) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

module.exports = {
  // Products
  async getProducts(category) {
    if (getIsMongoConnected()) {
      const query = category && category !== 'all' ? { category } : {};
      return await Product.find(query);
    }
    const data = readJSON();
    if (category && category !== 'all') {
      return data.products.filter(p => p.category === category);
    }
    return data.products;
  },

  async getProductById(id) {
    if (getIsMongoConnected()) {
      return await Product.findById(id);
    }
    const data = readJSON();
    return data.products.find(p => p.id === id || p._id === id);
  },

  async seedProducts(productsList) {
    if (getIsMongoConnected()) {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(productsList);
        console.log('[Seed] Seeded products into MongoDB.');
      }
    } else {
      const data = readJSON();
      if (!data.products || data.products.length === 0) {
        data.products = productsList;
        writeJSON(data);
        console.log('[Seed] Seeded products into local db.json.');
      }
    }
  },

  // Users
  async findUserByEmail(email) {
    if (getIsMongoConnected()) {
      return await User.findOne({ email });
    }
    const data = readJSON();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async createUser(userObj) {
    if (getIsMongoConnected()) {
      const user = new User(userObj);
      return await user.save();
    }
    const data = readJSON();
    const newUser = {
      id: 'usr_' + Date.now(),
      _id: 'usr_' + Date.now(),
      username: userObj.username,
      email: userObj.email,
      password: userObj.password,
      role: userObj.role || 'customer',
      createdAt: new Date().toISOString()
    };
    data.users.push(newUser);
    writeJSON(data);
    return newUser;
  },

  // Bookings
  async createBooking(bookingObj) {
    if (getIsMongoConnected()) {
      const booking = new Booking(bookingObj);
      return await booking.save();
    }
    const data = readJSON();
    const bookingNumber = 'ECO-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: 'bk_' + Date.now(),
      _id: 'bk_' + Date.now(),
      bookingNumber,
      ...bookingObj,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    data.bookings.push(newBooking);
    writeJSON(data);
    return newBooking;
  },

  async getBookings() {
    if (getIsMongoConnected()) {
      return await Booking.find().sort({ createdAt: -1 });
    }
    const data = readJSON();
    return data.bookings;
  },

  async getBookingByNumber(bookingNumber) {
    if (getIsMongoConnected()) {
      return await Booking.findOne({ bookingNumber });
    }
    const data = readJSON();
    return data.bookings.find(b => b.bookingNumber === bookingNumber);
  },

  // Inquiries / Contact
  async createInquiry(inquiryObj) {
    if (getIsMongoConnected()) {
      const inquiry = new Inquiry(inquiryObj);
      return await inquiry.save();
    }
    const data = readJSON();
    const newInquiry = {
      id: 'inq_' + Date.now(),
      _id: 'inq_' + Date.now(),
      ...inquiryObj,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    data.inquiries.push(newInquiry);
    writeJSON(data);
    return newInquiry;
  },

  async getInquiries() {
    if (getIsMongoConnected()) {
      return await Inquiry.find().sort({ createdAt: -1 });
    }
    const data = readJSON();
    return data.inquiries;
  }
};
