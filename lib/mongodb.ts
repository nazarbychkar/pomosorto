import { MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.MONGODB_ATLAS_URL;
const DB_NAME = "pomodoro";
const COLLECTION_NAME = "users";

if (!uri) throw Error("where is mongodb uri?");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// TODO: but i also have different funcs, that does need and does doesn't need to provide different arguments, how?
export async function connectionWraper(callback: Function) {
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);

    await callback(collection);
  } catch (e) {
    throw Error("mongodb error: " + e);
  } finally {
    await client.close();
  }
}

export async function connectMongo() {
  await client.connect();
  const database = client.db(DB_NAME);
  const collection = database.collection(COLLECTION_NAME);

  return collection;
}

export async function keepYourHoesInCHECK() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function insertUser(userId: number) {
  try {
    const collection = await connectMongo();

    const insertOneResult = await collection.insertOne({ userId: userId });

    return insertOneResult;
  } catch (e) {
    throw Error("something is wrong with documnets, insertion of documents.");
  } finally {
    await client.close();
  }
}

export async function insertUserMetric(
  userId: number,
  metricsName: string,
  metricsType: string
) {
  try {
    const collection = await connectMongo();

    let typeValue: boolean | number;
    if (metricsType == "Bool") typeValue = false;
    else if (metricsType == "Number") typeValue = 0;
    else throw Error("how? there is no such type");

    const timestamp = new Date();
    const date =
      timestamp.getDate() +
      "/" +
      timestamp.getMonth() +
      1 +
      "/" +
      timestamp.getFullYear();

    const insertOneResult = await collection.updateOne(
      { userId: userId },
      { $set: { [metricsName]: { [date]: typeValue } } }
    );

    return insertOneResult;
  } catch (e) {
    throw Error("something is wrong with documnets, updation of documents.");
  } finally {
    await client.close();
  }
}

export async function retrieveUserMetrics(userId: number) {
  try {
    const collection = await connectMongo();

    const userData = await collection.find().toArray();

    return userData;
  } finally {
    await client.close();
  }
}
