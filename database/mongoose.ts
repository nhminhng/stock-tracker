import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;
declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = {conn: null, promise: null};
}

export const connectToDatabase = async () => {
    if (!MONGODB_URI) throw new Error('MongoDB URI must be set within .env');

    if (cached.conn) return cached.conn;

    if (!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands: false});
    }
    
    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    // Avoid logging full connection string to prevent leaking credentials
    const host = mongoose.connection.host;
    const name = mongoose.connection.name;
    console.log(`Connected to MongoDB (${process.env.NODE_ENV}) host=${host} db=${name}`);

    return cached.conn;
}