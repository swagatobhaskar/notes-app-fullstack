"use client"

import { apiGet } from "@/app/lib/apiFetchHandler";
import { useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  fname: string;
  lname: string;
}

export default function ProfilePage() {

    const [ profile, setProfile ] = useState<User | null>(null);
    const [ error, setError ] = useState<Error|null>(null)
    const [ loading, setLoading ] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await apiGet<User>(`${process.env.NEXT_PUBLIC_API_URL}/user`)
                // console.log(result)
                setProfile(result);
            } catch (error: unknown) {
                // Type the error as an Error or handle it if it's something else
                if (error instanceof Error) {
                    setError(error);
                } else {
                    setError(new Error('An unknown error occurred'));
                }
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [])
    
    // how to handle page/data load errors in a server component?
    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>No data found.</p>;
    if (error) return <p>{error.message}</p>;
    
    return (
        <div className="flex flex-col justify-center text-xl">
            <p>User id: {profile.id}</p>
            <p>Email: {profile.email}</p>
            <p>Name:{profile.fname} {profile.lname}</p>
        </div>
    );
}