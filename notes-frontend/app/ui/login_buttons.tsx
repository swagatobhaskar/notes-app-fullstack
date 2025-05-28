"use client"

import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function LoginButtons() {
    const pathname = usePathname();
    const isLoggedIn: boolean = true;

    if (pathname === '/') {
        return null;
    }

    if (isLoggedIn) {
        return (
            <Link
                href={"#"}
                className="bg-gray-300 hover:bg-white hover:cursor-pointer text-black px-2 py-1 rounded-sm"
                >
                    Log Out
            </Link>
        );
    } 

    return (
        <div className="flex flex-row space-x-1.5">
            <Link
                href={"/user/login"}
                className="bg-gray-300 hover:bg-white hover:cursor-pointer text-black px-2 py-1 rounded-sm"
                >
                    Login
            </Link>
            <Link href={"/user/register"}
                className="bg-gray-300 hover:bg-white hover:cursor-pointer text-black px-2 py-1 rounded-sm"
                >
                    Sign Up
            </Link>
        </div>        
    );
}