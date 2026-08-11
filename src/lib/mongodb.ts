import { MongoClient } from "mongodb";

// MongoDB connection URI loaded from environment configuration
const uri = process.env.MONGODB_URI;
// Connection options passed to the MongoClient instance
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Declare global variable to cache the MongoDB connection promise across Next.js HMR (hot module replacement) reloads
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  // Reject connection early if MONGODB_URI environment variable is missing
  clientPromise = Promise.reject(new Error("Please add your MONGODB_URI to .env.local"));
} else if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the client connection across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, instantiate a direct scoped connection promise
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export shared client connection promise for use across database operations
export default clientPromise;
