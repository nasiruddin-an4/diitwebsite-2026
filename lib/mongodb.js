import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://diitdb:4y9AgAazdY2WfrFb@diitdb.96eb9tv.mongodb.net/?appName=diitdb";

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 1,
  // Timeouts
  connectTimeoutMS: 10000, // 10 seconds to connect
  socketTimeoutMS: 45000, // 45 seconds for operations
  serverSelectionTimeoutMS: 10000, // 10 seconds to select server
  // Retry settings
  retryWrites: true,
  retryReads: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("MongoDB connection failed:", err.message);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  });
}

export default clientPromise;

