"use client"

import { useRouter, useParams } from "next/navigation"
import React, { useState, useEffect } from "react"

interface Note {
    id: number,
    title: string,
    content: string,
    author: string,
    created_at: string,
    updated_at: string,
}

export default function SingleNote() {
    const router =useRouter();
    const {id} = useParams();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);

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
                setNote(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    const handleRemoveNote = async (e: React.MouseEvent) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/note/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Could not delete!');
            router.push("/notes");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!note) return <p>Note not found.</p>;

  return (
    <div className="">
        <div>
            <h1 className="text-3xl font-semibold">{note.title}</h1>
            <p>{new Date(note.created_at).toLocaleString()}</p>
            <article>{note.content}</article>
        </div>
        <div className="flex flex-row space-x-2 float-right mt-4">
            <button
                onClick={(e: React.MouseEvent) => router.push(`/notes/${id}/edit`)}
                className="text-white font-semibold px-3 py-1 rounded-sm bg-blue-400
                hover:bg-blue-500 cursor-pointer"
            >
                Edit
            </button>
            <button
                onClick={(e: React.MouseEvent) => handleRemoveNote(e)}
                className="text-white font-semibold px-3 py-1 rounded-sm bg-red-400
                hover:bg-red-500 cursor-pointer"
            >
                Delete
            </button>
        </div>
    </div>
  );
}