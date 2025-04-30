import { auth } from "@/auth";
import Table from "@/components/Table";
import { retrieveUserMetrics } from "@/lib/mongodb";
import { retrieveUserFocus } from "@/lib/postgresql";
import { SessionUserId } from "@/lib/sessionInterface";

export default async function Page() {
  const session = (await auth()) as SessionUserId;
  const userId = session.userId;

  const mongoData = await retrieveUserMetrics(userId);
  const postgreData = await retrieveUserFocus(userId);

  interface DataByDate {
    focusTime: number;
    [key: string]: number | boolean | string; // Allow dynamic keys with number values
  }

  // data aggregation
  const dataByDate: Record<string, DataByDate> = {};
  for (let record of postgreData) {
    const monthHasASpecialTreatment = record.sessionTimestamp.getMonth() + 1;
    const date =
      record.sessionTimestamp.getDate() +
      "/" +
      monthHasASpecialTreatment +
      "/" +
      record.sessionTimestamp.getFullYear();

    if (!dataByDate[date]) {
      dataByDate[date] = { focusTime: 0 };
    }

    if (record.workRest) {
      dataByDate[date].focusTime += record.elapsedTime;
    }
    // TODO: this is monstrosity, rework this
    for (const [docKey, docValue] of Object.entries(mongoData[0])) {
      for (const [dateKey, dateValue] of Object.entries(docValue)) {
        if (
          docKey !== "_id" &&
          docKey !== "userId" &&
          dateKey == date &&
          (typeof dateValue === "string" ||
            typeof dateValue === "number" ||
            typeof dateValue === "boolean")
        ) {
          dataByDate[date][docKey] = dateValue;
        }
      }
    }
  }
  console.log(dataByDate);

  return (
    <main>
      <h1>Metrics</h1>
      <Table userId={userId} dataByDate={dataByDate} />
    </main>
  );
}
