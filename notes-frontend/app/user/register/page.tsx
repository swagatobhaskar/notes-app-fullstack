'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [isMatch, setIsMatch] = useState(false);
    const [error, setError] = useState('');
    
    const router = useRouter()

    useEffect(() => {
        if (password && retypePassword) {
            if (password === retypePassword) {
                setError('');
                setIsMatch(true);
            } else {
                setError('Passwords do not match!');
                setIsMatch(false);
            }
        } else {
            setError('');
            setIsMatch(false);
        }
    }, [password, retypePassword])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isMatch) return;
        setError('');
        const body = {email, password};

        try {
            const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(body),
                }
            )

            const data = await response.json();
            // console.log("DATA:", data);

            if (!response.ok) {
                // print data.message
                throw new Error("Something went wrong!")
            }
            // handle successful login here
            console.log("Successfully Registered!");
            router.push("/");
            
        } catch (err) {
            if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
        }
    }

    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-8 space-y-6">
            <h2 className="pb-2 text-2xl font-bold text-center text-gray-800 border-b border-blue-500">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-md font-semibold text-gray-700">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        placeholder="john.doe@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-md font-semibold text-gray-700">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        placeholder="********"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-md font-semibold text-gray-700">Re-enter Password:</label>
                    <input
                        type="password"
                        id="confirm-password"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        placeholder="********"
                        required
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                    />
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button
                    type="submit"
                    disabled={!isMatch}
                    className="mt-2 w-full px-4 py-2 font-semibold text-white rounded-md bg-blue-600
                    hover:bg-blue-700 hover:cursor-pointer transition-colors
                    ">
                        Sign Up
                </button>
            </form>
                <p className="text-sm text-center text-gray-600">Already registered?
                    <Link href="/user/login" className="text-blue-500 hover:text-blue-600 ml-1 font-bold">Log In instead</Link>
                </p>
        </div>
    );
};
