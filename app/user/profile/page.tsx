import { auth } from "@/auth"

export default async function Page() {
    const session = await auth()

    if (!session?.user) return <p>not logged in.</p>

    const user = session.user

    console.log(user)

    return <div><h1>{user.name}</h1></div>
}