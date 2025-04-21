import { auth } from "@/auth";
import Link from "next/link";

// TODO: add stats of hours in focus
export default async function Page() {
  const session = await auth();

  if (!session?.user)
    return (
      <div>
        <p>not logged in.</p>
        <Link href="/user/signin">sign in</Link>
      </div>
    );

  const user = session.user;

  // console.log(user);

  return (
    <main>
      <h1>{user.name}</h1>
    </main>
  );
}
