"use client"

import { faSignOut, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState } from "react";

export default function LoginButtons({email}: {email: string | null }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
    const isLoggedIn: boolean = !!email;
    
    if (pathname === '/') {
        return null;
    }

    // Toggle the dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    if (isLoggedIn) {
        return (
            <div className="relative">
                <div className="flex flex-row gap-1.5" onClick={toggleDropdown}>
                    <p>{email}</p>
                    <FontAwesomeIcon icon={faArrowDown} />
                </div>
                {isDropdownOpen && (
                    <div
                        id="logout-dropdown"
                        className="absolute right-0 bg-gray-300 hover:bg-white text-black px-2 py-1 rounded-sm mt-2" 
                    >
                    <Link
                        href={"#"}
                        className="bg-gray-300 hover:bg-white hover:cursor-pointer text-black px-2 py-1 rounded-sm m-3"
                    >
                        <FontAwesomeIcon icon={faSignOut} />
                    </Link>
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