import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = 'droppurity-db';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function createIndexes(db: Db) {
  await Promise.all([
    db.collection('contacts').createIndex({ createdAt: -1 }),
    db.collection('free_trials').createIndex({ createdAt: -1 }),
    db.collection('referrals').createIndex({ createdAt: -1 }),
    db.collection('subscriptions').createIndex({ createdAt: -1 }),
    db.collection('interactions').createIndex({ createdAt: -1 }),
    db.collection('interactions').createIndex({ leadId: 1 }),
  ]);
}

export async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await connectToDatabase();
  const db = client.db(MONGODB_DB);
  
  // Create indexes
  await createIndexes(db);

  cachedDb = db;
  return db;
}

async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(MONGODB_URI as string);
  
  cachedClient = client;
  return client;
}