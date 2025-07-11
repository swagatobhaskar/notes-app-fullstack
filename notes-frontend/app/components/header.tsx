// Server Component

import { cookies } from "next/headers";
import LoginButtons from "./login_buttons";

export default async function Header() {

    const serverCookies = cookies();

    // If email is going to change over time
    // (e.g., from null to an actual email string), let is correct
    let email : string | null = null;

    // Only fetch data if cookies are available on the server side
    // i.e., user is logged in
    if (serverCookies) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            headers: {
                Cookie: (await serverCookies).toString(),
            },
            cache: 'no-store',
        })        

        if (res.ok) {
            const data = await res.json();
            email = data.email;
        }
    }
    
    return (
        <header className="bg-gray-800 text-white p-4 text-center">
            <div className="mx-auto w-5/6 flex flex-row justify-between">
                <p className="text-xl font-semibold">My Notes App</p>
                <LoginButtons email={email} />                    
            </div>
        </header>
    );
}
