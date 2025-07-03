// Server Component

import { cookies } from "next/headers";
import LoginButtons from "./login_buttons";

export default async function Header() {

    const serverCookies = cookies();

    const res = await fetch('http://127.0.0.1:8000/api/user', {
        headers: {
            Cookie: (await serverCookies).toString(),
        },
        cache: 'no-store',
    })

    let data = null;

    if (res.ok) {
        data = await res.json();
    }
    
    return (
        <header className="bg-gray-800 text-white p-4 text-center">
            <div className="mx-auto w-5/6 flex flex-row justify-between">
                <p className="text-xl font-semibold">My Notes App</p>
                <LoginButtons email={data.email} />                    
            </div>
        </header>
    );
}
