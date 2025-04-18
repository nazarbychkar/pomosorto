import { insertUserMetric } from "@/lib/mongodb";

export async function POST(req: Request) {
  console.log(req.method);
  const jsonBody = await req.json()
  console.log("jsonBody", jsonBody)

  const { userId, metricsName, metricsType } = jsonBody;

  if (!userId || !metricsName || !metricsType) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    await insertUserMetric(userId, metricsName, metricsType);
    return new Response("Metric added successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to add metric", { status: 500 });
  }
}
