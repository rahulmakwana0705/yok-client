import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_MONGODB_URI;

console.log("log at monngo url ***", process.env.NEXT_MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connect;
