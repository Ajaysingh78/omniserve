import { configDotenv } from 'dotenv';
configDotenv({ path: '.env' });

import mongoose from 'mongoose';
import connectToMongoDB from '../config/db.js';
import User from '../models/user.model.js';
import { UserRole, UserStatus } from '../models/enums.js';
import { AuthService } from '../modules/auth/auth.service.js';

const email = process.env.SYSTEM_ADMIN_EMAIL || 'admin@platform.com';
const password = process.env.SYSTEM_ADMIN_PASSWORD || 'PlatformAdmin@123';
const firstName = 'Platform';
const lastName = 'Admin';

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToMongoDB();

    const existingAdmin = await User.findOne({
      email: email.toLowerCase().trim(),
      role: UserRole.SYSTEM_ADMIN,
    });

    if (existingAdmin) {
      console.log(`System Admin with email "${email}" already exists.`);
      process.exit(0);
    }

    const passwordHash = await AuthService.hashPassword(password);

    const systemAdmin = new User({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: UserRole.SYSTEM_ADMIN,
      tenantId: null,
      status: UserStatus.ACTIVE,
      invitationAccepted: true,
    });

    await systemAdmin.save();
    console.log('==================================================');
    console.log('SYSTEM ADMINISTRATOR SEEDED SUCCESSFULLY!');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error('Failed to seed system administrator:', error);
    process.exit(1);
  }
}

seed();
