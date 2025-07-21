// Server Component

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RegistrationFormComponent from "@/app/components/registration_form";

export default async function RegisterPage() {
    const cookieStore = cookies();
    const csrfToken = (await cookieStore).get("csrf_token")?.value

    if (csrfToken) {
        // User is logged in → redirect them away!
        redirect('/folders')
    }

    // Render your form if not logged in
    return <RegistrationFormComponent />;
};
