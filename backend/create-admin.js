const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user-apis');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@example.com');
      console.log('Password: Admin123');
      return;
    }

    // Create admin user
    const adminUser = new Admin({
      email: 'admin@example.com',
      password: 'Admin123',
      isActive: true
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: Admin123');
    console.log('\nYou can now use these credentials to login to the admin panel.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Creating admin user...\n');
  
  await connectDB();
  await createAdminUser();
  
  console.log('\n✨ Setup complete!');
  process.exit(0);
};

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 