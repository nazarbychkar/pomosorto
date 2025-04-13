import { connectMongo } from "@/lib/mongodb";
import dbConnect from "@/lib/postgresql";

export async function insertUserData(userId: number) {
  const collection = connectMongo();
  const sql = dbConnect();


  
}
