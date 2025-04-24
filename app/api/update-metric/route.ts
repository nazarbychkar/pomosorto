import { updateUserMetrics } from "@/lib/mongodb";
// TODO: MongoPoolClosedError the maybe here?
export async function POST(req: Request) {
  const jsonBody = await req.json()

  const { userId, date, data } = jsonBody;

  if (!userId || !date || !data) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    await updateUserMetrics(userId, date, data);
    return new Response("Metric updated successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to add metric", { status: 500 });
  }
}
