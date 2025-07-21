// Server Component

import HeaderLoginButtons from "./header_login_buttons";

export default async function Header({email}: {email: string | null}) {
    return (
        <header className="bg-gray-800 text-white p-4 text-center">
            <div className="mx-auto w-5/6 flex flex-row justify-between">
                <p className="text-xl font-semibold">My Notes App</p>
                <HeaderLoginButtons email={email} />
            </div>
        </header>
    );
}
