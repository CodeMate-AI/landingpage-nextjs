import dns from "dns";
import { MongoClient } from "mongodb";

// Configure reliable DNS resolution for Atlas SRV lookups across local, Windows, and container environments
function configureDns() {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    if (typeof (dns as any).promises?.setServers === "function") {
      (dns as any).promises.setServers(["8.8.8.8", "1.1.1.1"]);
    }
    if (typeof dns.setDefaultResultOrder === "function") {
      dns.setDefaultResultOrder("ipv4first");
    }
  } catch {
    // Gracefully falls back to system DNS if the host environment restricts overrides
  }
}

// Initial DNS configuration
configureDns();

// Declare global variable to cache the MongoDB connection promise across serverless invocations and Next.js HMR
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return Promise.reject(
      new Error("MONGODB_URI environment variable is missing or not configured.")
    );
  }

  // Ensure DNS resolvers are applied in active worker runtime before connecting
  configureDns();

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 20,
      maxIdleTimeMS: 60000,
    });
    global._mongoClientPromise = client.connect().catch((err) => {
      // Reset cached promise on connection failure so subsequent requests can retry
      global._mongoClientPromise = undefined;
      throw err;
    });
  }

  return global._mongoClientPromise;
}

// Lazy client promise proxy that only evaluates on-demand when awaited by caller functions
const clientPromise = {
  then: <TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ) => getClientPromise().then(onfulfilled, onrejected),
  catch: <TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ) => getClientPromise().catch(onrejected),
  finally: (onfinally?: (() => void) | null) => getClientPromise().finally(onfinally),
} as unknown as Promise<MongoClient>;

export default clientPromise;
