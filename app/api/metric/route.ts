import { NextApiRequest, NextApiResponse } from "next";
import { insertUserMetric } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, metricsName, metricsType } = req.body;

    if (!userId || !metricsName || !metricsType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await insertUserMetric(userId, metricsName, metricsType);
      return res.status(200).json({ message: "Metric added successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to add metric" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
