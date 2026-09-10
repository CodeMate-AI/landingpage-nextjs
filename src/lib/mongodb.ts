import dns from "dns";
import { MongoClient } from "mongodb";

// Configure reliable DNS servers for Atlas SRV resolution in local/Windows environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Graceful fallback if environment does not allow modifying DNS servers
}

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

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {});
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
