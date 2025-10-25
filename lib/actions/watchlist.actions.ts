'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        return items.map((i) => String(i.symbol));
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

export async function addToWatchlist(symbol: string, company: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;
        if (!userId) return { success: false, error: 'Unauthorized' };

        const mongoose = await connectToDatabase();
        if (!mongoose.connection.db) throw new Error('MongoDB connection not found');

        const doc = { userId, symbol: symbol.toUpperCase().trim(), company: company.trim() } as const;
        try {
            await Watchlist.create(doc);
        } catch (e: any) {
            if (e && e.code === 11000) {
                // duplicate key, already exists → treat as success (idempotent)
                return { success: true };
            }
            throw e;
        }
        return { success: true };
    } catch (err) {
        console.error('addToWatchlist error:', err);
        return { success: false, error: 'Failed to add to watchlist' };
    }
}

export async function removeFromWatchlist(symbol: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;
        if (!userId) return { success: false, error: 'Unauthorized' };

        const mongoose = await connectToDatabase();
        if (!mongoose.connection.db) throw new Error('MongoDB connection not found');

        await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase().trim() });
        return { success: true };
    } catch (err) {
        console.error('removeFromWatchlist error:', err);
        return { success: false, error: 'Failed to remove from watchlist' };
    }
}