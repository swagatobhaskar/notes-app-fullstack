"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Note {
  id: number,
  author: string,
  title: string,
  content: string,
  created_at: string,
  updated_at: string
}

export default function Notes() {

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotes() {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/note', {
              method: "GET",
              credentials: "include",
              headers: {
                'Content-Type': 'application/json'
              }
            });
            const result = await res.json();
            setNotes(result);
            console.log(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    fetchNotes();
  }, [])

  if (loading) return <p>Loading...</p>;
  if (notes.length === 0) return <p>No notes found.</p>;

  return (
    <div className="">
      {/* {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes...</p>
      ) : ( */}
      <ul className="">
        {notes.map((note: Note) => (
          <div key={note.id}>
            <p>{note.id}</p>
            <p>{note.author}</p>
            <p>{note.title}</p>
            <p>{note.content}</p>
            <p>Created at: {new Date(note.created_at).toLocaleString()}</p>
            <p>Updated at: {new Date(note.updated_at).toLocaleString()}</p>
          </div>
        ))}
      </ul>
      {/* )} */}
    </div>
  );
}