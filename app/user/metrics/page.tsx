import { auth } from "@/auth";
import Table from "@/components/Table";
import { retrieveUserMetrics } from "@/lib/mongodb";
import { retrieveUserFocus } from "@/lib/postgresql";
import { SessionUserId } from "@/lib/sessionInterface";
import { isObject } from "util";

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
    for (const userKey of Object.keys(mongoData) as Array<
      keyof typeof mongoData
    >) {
      if (mongoData[userKey].userId == userId) {
        for (const document of Object.keys(mongoData[userKey])) {
          for (const dateMongo of Object.keys(mongoData[userKey][document])) {
            if (dateMongo == date) {
              dataByDate[date][document] =
                mongoData[userKey][document][dateMongo];
            }
          }
        }
      }
    }
  }
  return (
    <main>
      <h1>Metrics</h1>
      <Table userId={userId} dataByDate={dataByDate} />
    </main>
  );
}
