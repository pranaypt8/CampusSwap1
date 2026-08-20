const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const LostFound = require('../models/LostFound');
const Review = require('../models/Review');
const Report = require('../models/Report');
const Wishlist = require('../models/Wishlist');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Offer = require('../models/Offer');

const seedDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
      } catch (atlasErr) {
        console.log('[Seed Fallback] Could not connect to Atlas. Trying in-memory Mongo instance...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        await mongoose.connect(mongod.getUri());
      }
    }

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await LostFound.deleteMany({});
    await Review.deleteMany({});
    await Report.deleteMany({});
    await Wishlist.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    await Offer.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Campus Admin',
      email: 'admin@campus.edu',
      rollNumber: 'ADM-001',
      hostel: 'Admin Block',
      phone: '+91 9876543210',
      password: commonPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    const user1 = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan.s@campus.edu',
      rollNumber: '21BCE045',
      hostel: 'Hostel A',
      phone: '+91 9123456789',
      password: commonPassword,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      ratingAverage: 4.8,
      ratingCount: 12,
      itemsSold: 5,
    });

    const user2 = await User.create({
      name: 'Ananya Verma',
      email: 'ananya.v@campus.edu',
      rollNumber: '22BIT012',
      hostel: 'Hostel C',
      phone: '+91 9876501234',
      password: commonPassword,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      ratingAverage: 4.9,
      ratingCount: 18,
      itemsSold: 9,
    });

    const user3 = await User.create({
      name: 'Kabir Mehta',
      email: 'kabir.m@campus.edu',
      rollNumber: '20ME088',
      hostel: 'Hostel B',
      phone: '+91 9456789012',
      password: commonPassword,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      ratingAverage: 4.6,
      ratingCount: 8,
      itemsSold: 3,
    });

    console.log('[Seed] Inserting demo products across all 9 categories...');

    const demoProducts = [
      // Books
      {
        title: 'Introduction to Algorithms (CLRS 3rd Edition)',
        description: 'Standard computer science textbook in mint condition. Minimal highlights, binding completely intact. Essential for DSA coursework.',
        category: 'Books',
        price: 850,
        condition: 'Like New',
        seller: user1._id,
        sellerHostel: user1.hostel,
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop'],
        isNegotiable: true,
        isBoosted: true,
      },
      {
        title: 'Engineering Mathematics by B.S. Grewal',
        description: 'Complete syllabus solution book with clear step-by-step solved examples. Super useful for 1st & 2nd year semester exams.',
        category: 'Books',
        price: 450,
        condition: 'Good',
        seller: user2._id,
        sellerHostel: user2.hostel,
        images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },
      {
        title: 'GATE Computer Science & IT Previous Years Solved Papers',
        description: 'Latest 15 years solved papers with explanations. High relevance for GATE preparation.',
        category: 'Books',
        price: 500,
        condition: 'New',
        seller: user3._id,
        sellerHostel: user3.hostel,
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop'],
        isNegotiable: false,
      },

      // Electronics
      {
        title: 'Dell Wireless Keyboard & Mouse Combo (KM117)',
        description: 'Smooth low-profile keys, 2.4GHz wireless dongle included. Works flawlessly with laptops & desktop setups.',
        category: 'Electronics',
        price: 900,
        condition: 'Like New',
        seller: user2._id,
        sellerHostel: user2.hostel,
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop'],
        isNegotiable: true,
        isBoosted: true,
      },
      {
        title: 'Sony WH-CH510 Wireless Headphones',
        description: '35 hours battery life, Type-C quick charge, crisp bass sound. Selling because upgrading to noise cancellation models.',
        category: 'Electronics',
        price: 1800,
        condition: 'Good',
        seller: user1._id,
        sellerHostel: user1.hostel,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },
      {
        title: 'Mi Power Bank 3i 20000mAh (18W Fast Charging)',
        description: 'Dual output ports, trickle charging mode for smartwatches. Easily charges phone up to 4 times.',
        category: 'Electronics',
        price: 1100,
        condition: 'Like New',
        seller: user3._id,
        sellerHostel: user3.hostel,
        images: ['https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop'],
        isNegotiable: false,
      },

      // Hostel Essentials
      {
        title: 'Electric Kettle 1.8 Liter Stainless Steel',
        description: 'Auto shut-off feature, ideal for late-night Maggi, tea, and coffee in hostel room.',
        category: 'Hostel Essentials',
        price: 400,
        condition: 'Good',
        seller: user1._id,
        sellerHostel: user1.hostel,
        images: ['https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },
      {
        title: 'Foldable Bed Study Table with Cup Holder',
        description: 'Sturdy wooden top with metal legs, tablet slot and cup holder. Very comfortable for studying on bed.',
        category: 'Hostel Essentials',
        price: 350,
        condition: 'Like New',
        seller: user2._id,
        sellerHostel: user2.hostel,
        images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },
      {
        title: 'Hostel Room Extension Cord 4-Way Socket (3 Meters)',
        description: 'Heavy duty surge protector with master switch and LED indicator.',
        category: 'Hostel Essentials',
        price: 250,
        condition: 'New',
        seller: user3._id,
        sellerHostel: user3.hostel,
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop'],
        isNegotiable: false,
      },

      // Cycles
      {
        title: 'Hero Sprint Next 26T 21-Speed Gear Cycle',
        description: 'Front suspension disc brakes, smooth gear shifting. Perfect for commuting between hostels and academic blocks.',
        category: 'Cycles',
        price: 4800,
        condition: 'Good',
        seller: user3._id,
        sellerHostel: user3.hostel,
        images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop'],
        isNegotiable: true,
        isBoosted: true,
      },
      {
        title: 'Decathlon BTwin Single Speed Bicycle',
        description: 'Lightweight frame, low maintenance, front basket and rear reflector installed. Smooth riding condition.',
        category: 'Cycles',
        price: 3200,
        condition: 'Like New',
        seller: user2._id,
        sellerHostel: user2.hostel,
        images: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },

      // Clothing
      {
        title: 'College Fest Limited Edition Hoodie (Size L)',
        description: 'Super warm fleece lining, deep blue color with embroidered crest logo.',
        category: 'Clothing',
        price: 600,
        condition: 'Like New',
        seller: user1._id,
        sellerHostel: user1.hostel,
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },
      {
        title: 'Decathlon Quechua Waterproof Winter Jacket (XL)',
        description: 'Windproof, rain resistant, highly insulated jacket for cold campus mornings.',
        category: 'Clothing',
        price: 1200,
        condition: 'Good',
        seller: user3._id,
        sellerHostel: user3.hostel,
        images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },

      // Sports
      {
        title: 'Yonex Muscle Power 29 Badminton Racket + Cover',
        description: 'Strung with BG65 gutting at 24 lbs tension. Excellent balance and smash control for SAC games.',
        category: 'Sports',
        price: 1100,
        condition: 'Good',
        seller: user2._id,
        sellerHostel: user2.hostel,
        images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },
      {
        title: 'Spalding NBA Street Basketball (Size 7)',
        description: 'Durable rubber cover for outdoor cement court play. Great grip and bounce.',
        category: 'Sports',
        price: 750,
        condition: 'Like New',
        seller: user1._id,
        sellerHostel: user1.hostel,
        images: ['https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&auto=format&fit=crop'],
        isNegotiable: false,
      },

      // Musical Instruments
      {
        title: 'Yamaha F310 Acoustic Guitar + Padded Gig Bag',
        description: 'Spruce top, warm resonant tone, low action strings set up. Comes with picks, strap, and tuner app recommendation.',
        category: 'Musical Instruments',
        price: 6500,
        condition: 'Like New',
        seller: user3._id,
        sellerHostel: user3.hostel,
        images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop'],
        isNegotiable: true,
        isBoosted: true,
      },
      {
        title: 'Casio SA-47 32-Key Portable Mini Keyboard',
        description: 'Ideal for beginners and hostel jam sessions. Battery and DC adapter included.',
        category: 'Musical Instruments',
        price: 1900,
        condition: 'Good',
        seller: user1._id,
        sellerHostel: user1.hostel,
        images: ['https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },

      // Furniture
      {
        title: 'Ergonomic Mesh Revolving Study Chair',
        description: 'Breathable mesh back, pneumatic height adjustment, smooth 360-degree wheels. Perfect for long coding sprints.',
        category: 'Furniture',
        price: 2200,
        condition: 'Good',
        seller: user2._id,
        sellerHostel: user2.hostel,
        images: ['https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },
      {
        title: 'Wooden Bookshelf Unit 3-Tier',
        description: 'Compact wooden rack for organizing textbooks, notebooks, and hostel decor.',
        category: 'Furniture',
        price: 700,
        condition: 'Like New',
        seller: user1._id,
        sellerHostel: user1.hostel,
        images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&auto=format&fit=crop'],
        isNegotiable: true,
      },

      // Others
      {
        title: 'Solimo Lab Coat White (100% Cotton, Size M)',
        description: 'Mandatory for Chemistry & Physics lab practicals. Clean, washed, and stain-free.',
        category: 'Others',
        price: 300,
        condition: 'Like New',
        seller: user2._id,
        sellerHostel: user2.hostel,
        images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'],
        isNegotiable: false,
      },
    ];

    await Product.insertMany(demoProducts);

    console.log('[Seed] Inserting Lost & Found items...');
    await LostFound.create([
      {
        type: 'lost',
        category: 'Electronics',
        title: 'Lost Airpods Pro 2 (White Case with Blue Lanyard)',
        description: 'Misplaced around Library 2nd floor silent reading zone on Tuesday evening. Please return if found!',
        location: 'Central Library Floor 2',
        date: '2026-07-21',
        contactInfo: 'Phone: 9876501234 / Hostel C-204',
        user: user2._id,
      },
      {
        type: 'found',
        category: 'Documents',
        title: 'Found Student ID Card - CSE Department',
        description: 'Found a student ID card near SAC basketball court benches.',
        location: 'SAC Sports Complex',
        date: '2026-07-22',
        contactInfo: 'Contact Rohan (Hostel A-102)',
        user: user1._id,
      },
    ]);

    console.log('[Seed] Database seeding completed successfully!');
  } catch (error) {
    console.error('[Seed Error]', error.message);
  }
};

module.exports = seedDB;
