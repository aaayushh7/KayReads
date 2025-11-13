import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    // Check if environment variables are set
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
      HUGGINGFACE_API_TOKEN: !!process.env.HUGGINGFACE_API_TOKEN,
    };

    // Try to connect to MongoDB
    let dbStatus = 'disconnected';
    let dbError = null;

    try {
      await connectDB();
      dbStatus = 'connected';
    } catch (error: any) {
      dbError = error.message;
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        status: dbStatus,
        error: dbError,
      },
      environmentVariables: envCheck,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 }
    );
  }
}

