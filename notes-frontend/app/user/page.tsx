"use client"

import { useState, useEffect } from "react";

interface UserProfile {
  id: number;
  email: string;
  fname: string;
  lname: string;
}

export default function ProfilePage() {

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/user', {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            setProfile(result);
            // console.log(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    fetchData();
    }, [])
    
    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>No data found.</p>;

    return (
        <div className="">
            <p>User id: {profile.id}</p>
            <p>Email: {profile.email}</p>
            <p>Name:{profile.fname} {profile.lname}</p>
        </div>
    );
}