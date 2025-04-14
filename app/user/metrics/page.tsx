import { auth } from "@/auth";
import { retrieveUserData } from "@/lib/mongodb";
import { retrieveFocusTime } from "@/lib/postgresql";
import { SessionUserId } from "@/lib/sessionInterface";

export default async function Page() {
  const session = (await auth()) as SessionUserId;
  const userId = session.userId;

  const mongoData = await retrieveUserData(userId);
  const postgreDataFocusTime = await retrieveFocusTime(userId);

  console.log(mongoData);
  console.log(postgreDataFocusTime);

  return (
    <main>
      <h1>Metrics</h1>
      <div>
        <table>
          <tbody>
            <tr>
              {mongoData &&
                mongoData.map((metric, key) => (
                  <th key={key}>{metric._id.toString()}</th>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
