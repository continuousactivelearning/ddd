import { MongoClient, Db } from "mongodb";

class MongoConnection {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    const connectionString = process.env.MONGODB_URL || "mongodb://localhost:27017/vibe-education";
    this.client = new MongoClient(connectionString);
  }

  async connect(): Promise<Db> {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db("vibe-education");
      console.log("Connected to MongoDB");
    }
    return this.db;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.db = null;
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }
}

export const mongoConnection = new MongoConnection();
export const connectMongoDB = () => mongoConnection.connect();
export const getDB = () => mongoConnection.getDb();