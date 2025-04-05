"use server"

import { auth } from "@/auth"

export default async function clientUserFetch() {
    return await auth()
}