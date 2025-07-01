"use client"

import Tiptap from "@/app/components/Tiptap";
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
        <div className="min-w-[70vw] max-w-[70vw] self-start">
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
                {/* <textarea id="content" name="content" required value={formData.content} onChange={handleChange} /> */}
                {/* <Tiptap value={formData.content} /> */}
                <div className="">
                    <button
                        type="button"
                        onClick={() => {
                            const confirmed = window.confirm('Are you sure you want to cancel your changes?');
                            if (confirmed) {
                                setFormData({title:'', content:''})
                                router.push(`/notes/`)
                            }
                        }}
                        className="text-white px-3 py-1 rounded-sm bg-gray-400
                        hover:bg-gray-500 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="text-white px-3 py-1 rounded-sm bg-blue-400
                        hover:bg-blue-500 cursor-pointer"
                    >
                        Save Note
                    </button>
                </div>
            </form>
        </div>
    );
}
