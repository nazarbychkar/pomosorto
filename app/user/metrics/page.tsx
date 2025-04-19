import { auth } from "@/auth";
import Table from "@/components/Table";
import { retrieveUserMetrics } from "@/lib/mongodb";
import { retrieveUserFocus } from "@/lib/postgresql";
import { SessionUserId } from "@/lib/sessionInterface";

// TODO: table should be in client component, cause it is interactive and constantly changing
// TODO: fix tr, td, th keys, now it is a temporary solution
export default async function Page() {
  const session = (await auth()) as SessionUserId;
  const userId = session.userId;

  const mongoData = await retrieveUserMetrics(userId);
  const postgreData = await retrieveUserFocus(userId);

  interface DataByDate {
    focusTime: number;
  }

  // data aggregation
  const dataByDate: Record<string, DataByDate> = {};
  for (let record of postgreData) {
    const date =
      record.sessionTimestamp.getDate() +
      "/" +
      record.sessionTimestamp.getMonth() +
      1 +
      "/" +
      record.sessionTimestamp.getFullYear();

    if (!dataByDate[date]) {
      dataByDate[date] = { focusTime: 0 };
      // TODO: add mongo metrics by date
      // for (document of mongoData):
    }

    if (record.workRest) {
      dataByDate[date].focusTime += record.elapsedTime;
    }
  }

  return (
    <main>
      <h1>Metrics</h1>
      <Table userId={userId} mongoData={mongoData} dataByDate={dataByDate} />
    </main>
  );
}
