// Server Component

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RegistrationFormComponent from "@/app/components/registration_form";

export default async function RegisterPage() {
    const cookieStore = cookies();
    const csrfToken = (await cookieStore).get("csrf_token")?.value

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
            Cookie: (await cookieStore).toString(),
            ...( csrfToken ? {'X-CSRF-Token': csrfToken} : {})
        },
        // This disables Next's cache so the request always goes to the backend
        cache: 'no-store',
        credentials: 'include'
    });
    // console.log("SERVER RES", res)

    if (res.ok) {
        // User is logged in → redirect them away!
        redirect('/folders')
    }

    // Render your form if not logged in
    return <RegistrationFormComponent />;
};
