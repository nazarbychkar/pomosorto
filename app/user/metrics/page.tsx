import { auth } from "@/auth";
import { retrieveUserMetrics } from "@/lib/mongodb";
import { retrieveUserFocus } from "@/lib/postgresql";
import { SessionUserId } from "@/lib/sessionInterface";

export default async function Page() {
  const session = (await auth()) as SessionUserId;
  const userId = session.userId;

  const mongoData = await retrieveUserMetrics(userId);
  const postgreData = await retrieveUserFocus(userId);

  const dataByDate: Record<string, object> = {};
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
    }

    if (record.workRest) {
      dataByDate[date].focusTime += record.elapsedTime;
    }
  }

  return (
    <main>
      <h1>Metrics</h1>
      <div>
        <table>
          <tbody>
            <tr>
              <th>Date</th>
              <th>FocusTime</th>
              {mongoData &&
                Object.keys(mongoData[0]).map((metricsKey, key) => (
                  <th key={key} className="p-3">
                    {metricsKey}
                  </th>
                ))}
            </tr>
            {Object.keys(dataByDate).map((currentDate, key) => (
              <tr>
                <td key={key} className="p-3">
                  {currentDate}
                </td>
                <td key={key} className="p-3">
                  {dataByDate[currentDate].focusTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
