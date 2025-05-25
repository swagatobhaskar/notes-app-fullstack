// Part of Server Component

import Link from "next/link";

export default function AuthButtons() {
    return (
        <div className="flex flex-row gap-x-2">
            <Link
                className="text-white bg-blue-700 px-2 py-1.5 rounded-md border-2 border-blue-900 hover:bg-blue-800"
                href={'/user/login'}
                >
                    Login
            </Link>
            <Link
                className="text-white bg-blue-700 px-2 py-1.5 rounded-md border-2 border-blue-900 hover:bg-blue-800"
                href={'/user/register'}
                >
                    Sign up
            </Link>
        </div>
    );
}