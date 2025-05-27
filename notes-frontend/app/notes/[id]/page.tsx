"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"

interface Note {
    id: number,
    title: string,
    content: string,
    author: string,
    created_at: string,
    updated_at: string,
}

export default function SingleNote() {
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

    if (loading) return <p>Loading...</p>;
    if (!note) return <p>Note not found.</p>;

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{new Date(note.created_at).toLocaleString()}</p>
      <article>{note.content}</article>
    </div>
  );
}