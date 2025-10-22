import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/database/mongoose';

export async function GET() {
  const startedAt = new Date();
  try {
    await connectToDatabase();

    if (!mongoose.connection.db) {
      throw new Error('Database not connected');
    }

    // Perform a lightweight ping to verify DB is reachable
    const admin = mongoose.connection.db.admin();
    const pingResult = await admin.ping();

    const info = {
      ok: true,
      message: 'Database connection successful',
      ping: pingResult,
      connection: {
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        readyState: mongoose.connection.readyState, // 1 means connected
      },
      timestamps: {
        startedAt: startedAt.toISOString(),
        completedAt: new Date().toISOString(),
      },
      environment: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json(info, { status: 200 });
  } catch (error: any) {
    const errInfo = {
      ok: false,
      message: 'Database connection failed',
      error: {
        name: error?.name,
        message: error?.message,
      },
      timestamps: {
        startedAt: startedAt.toISOString(),
        failedAt: new Date().toISOString(),
      },
      environment: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json(errInfo, { status: 500 });
  }
}
