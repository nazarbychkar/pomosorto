import { auth } from "@/auth";
import Table from "@/components/Table";
import { retrieveUserMetrics } from "@/lib/mongodb";
import { retrieveUserFocus } from "@/lib/postgresql";
import { SessionUserId } from "@/lib/sessionInterface";

export default async function Page() {
  const session = (await auth()) as SessionUserId;
  const userId = session.userId;

  const [mongoData, postgreData] = await Promise.all([
    retrieveUserMetrics(userId),
    retrieveUserFocus(userId),
  ]);

  interface DataByDate {
    focusTime: number;
    [key: string]: any;
  }
// TODO: somewhere there is a problem with dates.
  const formatDate = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  };
  

  const dataByDate: Record<string, DataByDate> = {};
  const keySet = new Set<string>();

  // Preprocess Mongo data once
  const mongoEntry = mongoData[0] ?? {};
  for (const [key, value] of Object.entries(mongoEntry)) {
    if (key === "_id" || key === "userId") continue;
    keySet.add(key);

    for (const [dateStr, val] of Object.entries(value)) {
      const normalizedDate = formatDate(new Date(dateStr)); // ensure consistent format
      if (!dataByDate[normalizedDate]) {
        dataByDate[normalizedDate] = { focusTime: 0 };
      }
      dataByDate[normalizedDate][key] = val;
    }
  }

  // Process PostgreSQL data
  for (const record of postgreData) {
    const date = formatDate(record.sessionTimestamp);

    if (!dataByDate[date]) {
      dataByDate[date] = { focusTime: 0 };
    }

    if (record.workRest) {
      dataByDate[date].focusTime += record.elapsedTime;
    }
  }

  // Fill in missing keys
  for (const entry of Object.values(dataByDate)) {
    for (const key of keySet) {
      if (!(key in entry)) {
        entry[key] = " ";
      }
    }
  }

  // Optional: sort data by date (dd/mm/yyyy)
  const sortedDataByDate = Object.fromEntries(
    Object.entries(dataByDate).sort(([a], [b]) => {
      const [da, ma, ya] = a.split("/").map(Number);
      const [db, mb, yb] = b.split("/").map(Number);
      return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
    })
  );


  return (
    <main>
      <h1>Metrics</h1>
      <Table userId={userId} dataByDate={sortedDataByDate} />
    </main>
  );
}
