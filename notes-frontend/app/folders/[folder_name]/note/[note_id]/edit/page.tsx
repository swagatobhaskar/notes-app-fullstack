"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditNote() {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const router =useRouter();
    const {id} = useParams();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/note/${id}`, {
                    method: "GET",
                    credentials: 'include', // send JWT cookies
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) throw new Error('Not found');
                const data = await res.json();
                setFormData({ title: data.title, content: data.content });
            } catch (err) {
                console.error(err);
            }
        };

        fetchNote();
    }, [id]);
    
    const handleUpdatedNoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/note/${id}/`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Update failed');
            router.push(`/notes/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    return (
        <div className="">
            <form onSubmit={handleUpdatedNoteSubmit}>
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
                <div className="">
                    <button
                        type="button"
                        onClick={() => {
                            const confirmed = window.confirm('Are you sure you want to cancel your changes?');
                            if (confirmed) {
                                router.push(`/notes/${id}`)
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