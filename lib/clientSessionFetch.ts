"use server"

import { auth } from "@/auth"

export default async function clientSessionFetch() {
    return await auth()
}