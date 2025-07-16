// Server Component

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginFormComponent from "@/app/components/login_form";

export default async function LoginPage() {
    const cookieStore = cookies();
    // console.log("COOKIE string at login/", (await cookieStore).toString())
    const csrfToken = (await cookieStore).get("csrf_token")?.value
    // console.log("CSRF cookie string at login/", csrfToken)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
            Cookie: (await cookieStore).toString(),
            ...( csrfToken ? {'X-CSRF-Token': csrfToken} : {})
        },
        cache: "no-store",
        credentials: "include",
    })
    console.log("SERVER RES", res)

    if (res.ok) {
        // User is logged in → redirect them away!
        redirect('/folders')
    }

    return <LoginFormComponent />
};