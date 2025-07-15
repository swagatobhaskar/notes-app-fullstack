// Server Component

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginFormComponent from "@/app/components/login_form";

export default async function LoginPage() {
    const cookieStore = cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
            Cookie: (await cookieStore).toString(),
        },
        cache: "no-store",
        credentials: "include",
    })
    // console.log("SERVER RES", res)

    if (res.ok) {
        // User is logged in → redirect them away!
        // console.log("SERVER REDIRECT FROM /register")
        redirect('/folders')
    }

    return <LoginFormComponent />
};