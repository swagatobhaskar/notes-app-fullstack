'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginFormComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    
    const router = useRouter()

    // It's handled in the parent Server component
    // Check if user is already logged in
    // forward to some place else

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                }
            )

            const data = await response.json();
            // console.log(data);

            if (!response.ok) {
                // print data.message
                throw new Error("Something went wrong!")
            }
            // handle successful login here
            console.log("Login Successful!", data);
            router.push("/folders");
            
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
            <h2 className="pb-2 text-2xl font-bold text-center text-gray-800 border-b border-blue-500">Log In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-md font-semibold text-gray-700">Email</label>
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
                    <label htmlFor="password" className="block text-md font-semibold text-gray-700">Password</label>
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
                <button
                    type="submit"
                    className="mt-2 w-full px-4 py-2 font-semibold text-white rounded-md bg-blue-600
                    hover:bg-blue-700 hover:cursor-pointer transition-colors
                    ">
                        Log In
                </button>
            </form>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <p className="text-sm text-center text-gray-600">Don&apos;t have account?
                    <Link href="/register" className="text-blue-500 hover:text-blue-600 ml-1 font-bold">Register Now</Link>
                </p>
        </div>
    );
}