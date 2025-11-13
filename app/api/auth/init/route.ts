import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// This endpoint creates the initial admin user
// Should be called once to setup the admin account
export async function POST() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kayinbooks.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      email: admin.email,
    });
  } catch (error) {
    console.error('Admin init error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

