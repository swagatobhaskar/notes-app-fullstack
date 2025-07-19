"use client"

import { apiPost } from "@/app/lib/apiFetchHandler";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from "react";

export default function HeaderLoginButtons({email}: {email: string | null }) {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isLoggedIn: boolean = !!email;
    const dropdownRef = useRef<HTMLDivElement>(null)
  
    // Toggle the dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            await apiPost(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {})  // /logout don't need body.
        } catch(err: unknown) {
            console.error("LOGOUT Error: ", err)
        }
        
        // Delete client-side cookie (non-HttpOnly)
        document.cookie = "csrf_token=; Max-Age=0; path=/;"
        setIsDropdownOpen(false);
        router.push('/')
    }

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (isLoggedIn) {
        return (
            <div className="relative" ref={dropdownRef}>
                <div className="" onClick={toggleDropdown}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
                {isDropdownOpen && (
                    <div
                        id="logout-dropdown"
                        className="absolute right-1 h-auto w-fit bg-white border border-gray-200 rounded-sm mt-2
                            flex flex-col py-5 px-5"
                    >
                        <p
                            onClick={handleLogout}
                            className="hover:font-semibold hover:cursor-pointer text-black border-b-2 border-gray-300 pb-2"
                        >
                            Log Out
                        </p>
                        <Link href={'/user'} className="text-black/70 text-sm py-2">{email}</Link>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-row space-x-1.5">
            <Link
                href={"/login"}
                className="bg-gray-300 hover:bg-white hover:cursor-pointer text-black px-2 py-1 rounded-sm"
                >
                    Login
            </Link>
            <Link href={"/register"}
                className="bg-gray-300 hover:bg-white hover:cursor-pointer text-black px-2 py-1 rounded-sm"
                >
                    Sign Up
            </Link>
        </div>        
    );
}