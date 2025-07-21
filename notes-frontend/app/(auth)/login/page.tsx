// Server Component

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginFormComponent from "@/app/components/login_form";

export default async function LoginPage() {
    const cookieStore = await cookies();
    // console.log("COOKIE string at login/", (await cookieStore).toString())
    const csrfToken = cookieStore.get("csrf_token")?.value
    // console.log("CSRF cookie string at login/", csrfToken)

    if (csrfToken) {
        // User is logged in → redirect them away!
        redirect('/folders')
    }

    return <LoginFormComponent />
};