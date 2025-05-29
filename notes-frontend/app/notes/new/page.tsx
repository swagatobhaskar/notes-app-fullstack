"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function NewNote() {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleNewNoteSubmit= async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/note", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error("Failed to save!");
            const {id} = await response.json()
            router.push(`/notes/${id}`)
        } catch (err) {
            console.log(err);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    // periodically save as draft or to localStorage

    return (
        <div className="">
            <form onSubmit={handleNewNoteSubmit}>
                <div className="">
                    <label htmlFor="title" className="">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <textarea id="content" name="content" required value={formData.content} onChange={handleChange} />
                <button
                    type="submit"
                    className="text-white px-3 py-1 rounded-sm bg-blue-400
                    hover:bg-blue-500 cursor-pointer"
                >
                    Save Note
                </button>
            </form>
        </div>
    );
}
