import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, createAuthCookie } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 POST /api/auth/login - Starting login process...');
    
    const { email, password } = await request.json();

    if (!email || !password) {
      console.log('❌ Login failed: Missing credentials');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected, checking user...');

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('❌ Login failed: User not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('👤 User found, verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      console.log('❌ Login failed: Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ Password valid, generating token...');
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

    response.headers.set('Set-Cookie', createAuthCookie(token));

    console.log('✅ Login successful');
    return response;
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

