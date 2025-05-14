'use client';

import { useState } from "react"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const body = {email, password};
        try {
            const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
                }
            )

            const data = await response.json();

            if (!response.ok) {
                // print data.message
                throw new Error("Something went wrong!")
            }
            // handle successful login here
            console.log("Login Successful!", data);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div id="login-card" className="mx-auto mt-60 w-1/4 shadow-2xl shadow-gray-400 h-fit">
            <div className="flex flex-col">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            placeholder="john.doe@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Log In</button>
                </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <p>Don't have account? Register Now</p>
            </div>
        </div>
    );
};