import { auth } from "@/auth";
import { retrieveUserData } from "@/lib/mongodb";
import { retrieveFocusTime } from "@/lib/postgresql";
import { SessionUserId } from "@/lib/sessionInterface";

export default async function Page() {
  const session = (await auth()) as SessionUserId;
  const userId = session.userId;

  const mongoData = await retrieveUserData(userId);
  const postgreData = await retrieveFocusTime(userId);

  for (let record of postgreData) {
    const todate = record.sessionTimestamp.getDate();
    const tomonth = record.sessionTimestamp.getMonth() + 1;
    const toyear = record.sessionTimestamp.getFullYear();
    const original_date = todate + "/" + tomonth + "/" + toyear;
    record.sessionTimestamp = original_date;
    console.log(record);
  }
  // TODO: now, for each date, you should count the focus time. and then map it to <td>

  let focusTime = 0;
  for (let record of postgreData) {
    if (record.workRest) {
      focusTime += parseInt(record.elapsedTime, 10);
    }
  }

  // console.log(mongoData[0]);
  // console.log(postgreDataFocusTime);

  return (
    <main>
      <h1>Metrics</h1>
      <div>
        <table>
          <tbody>
            <tr>
              {/* {postgreDataFocusTime &&
                Object.keys(postgreDataFocusTime[0]).map((metricsKey, key) => (
                  <th key={key} className="p-3">
                    {metricsKey}
                  </th>
                ))} */}
              <th>Date</th>
              <th>FocusTime</th>
              {mongoData &&
                Object.keys(mongoData[0]).map((metricsKey, key) => (
                  <th key={key} className="p-3">
                    {metricsKey}
                  </th>
                ))}
            </tr>
            {postgreData.map((record, key) => (
              <tr>record.</tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
