// Server Component

import LoginButtons from "./login_buttons";

export default function Header() {
    
    return (
        <header className="bg-gray-800 text-white p-4 text-center">
            <div className="mx-auto w-5/6 flex flex-row justify-between">
                <p className="text-xl font-semibold">My Notes App</p>
                <LoginButtons />                    
            </div>
        </header>
    );
}
