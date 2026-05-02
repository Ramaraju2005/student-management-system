const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Chapter = require('./models/Chapter');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Chapter.deleteMany();

    console.log('Cleared existing data...');

    const defaultPassword = 'password123';

    // 1. Create Super Admin
    const superAdmin = await User.create({
      fullName: 'System Administrator',
      email: 'admin@nsf.org',
      password: defaultPassword,
      role: 'Super Admin',
      phone: '9999999999'
    });

    // 2. Create Head Office Admin
    const headOffice = await User.create({
      fullName: 'National Director',
      email: 'headoffice@nsf.org',
      password: defaultPassword,
      role: 'Head Office Admin',
      phone: '8888888888'
    });

    // 3. Create Coordinator
    const coordinator = await User.create({
      fullName: 'Delhi Coordinator',
      email: 'delhi@nsf.org',
      password: defaultPassword,
      role: 'Chapter Coordinator',
      phone: '7777777777'
    });

    // 4. Create Chapter
    const chapter = await Chapter.create({
      name: 'Delhi NCR Chapter',
      location: 'New Delhi',
      description: 'Main chapter for Delhi region',
      coordinatorId: coordinator._id
    });

    // Update coordinator with chapter ID
    coordinator.chapterId = chapter._id;
    await coordinator.save();

    // 5. Create a Student
    const student = await User.create({
      fullName: 'John Student',
      email: 'student@example.com',
      password: defaultPassword,
      role: 'Student',
      phone: '6666666666',
      aadhaar: '123456789012'
    });

    console.log('Seed data imported successfully!');
    console.log('--- Demo Credentials ---');
    console.log('Password for all users: password123');
    console.log('Super Admin: admin@nsf.org');
    console.log('Head Office: headoffice@nsf.org');
    console.log('Coordinator: delhi@nsf.org');
    console.log('Student: student@example.com');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
