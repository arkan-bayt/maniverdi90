const mongoose = require('mongoose');
const User = require('./models/User');

const setupDefaultUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maniverdi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('📋 Users already exist, skipping setup');
      process.exit(0);
    }

    // Create default admin user
    const adminUser = new User({
      username: 'admin',
      password: 'admin',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Admin user created (admin/admin)');

    // Create superuser
    const superUser = new User({
      username: 'iraq',
      password: 'iraq',
      role: 'superuser'
    });
    await superUser.save();
    console.log('✅ Superuser created (iraq/iraq)');

    // Create normal user
    const normalUser = new User({
      username: 'mani',
      password: 'mani',
      role: 'user'
    });
    await normalUser.save();
    console.log('✅ Normal user created (mani/mani)');

    console.log('🎉 Default users setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up default users:', error);
    process.exit(1);
  }
};

setupDefaultUsers();