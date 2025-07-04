"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { apiGet } from "@/app/lib/apiFetchHandler";

interface Note {
  id: number,
  author: string,
  title: string,
  content: string,
  created_at: string,
  updated_at: string
}

export default function Notes() {

  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const truncateText = (text: string, maxLength: number = 20): string => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  const showUpdatedAt = (created_at: string, updated_at: string) => {
    if (updated_at !== created_at) {
      return <p>Updated at: {new Date(updated_at).toLocaleString()}</p>
    }
  } 

  useEffect(() => {
    // Always await or .then() because they return a Promise.
    apiGet<Note[]>('http://127.0.0.1:8000/api/note')
    .then(setNotes)
    .catch(err => {
      console.error(err)
      setError(err.message)
    })
    
    // async function fetchNotes() {
    //     try {
    //         const res = await fetch('http://127.0.0.1:8000/api/note', {
    //           method: "GET",
    //           credentials: "include",
    //           headers: {
    //             'Content-Type': 'application/json'
    //           }
    //         });
    //         const result = await res.json();
    //         setNotes(result);
    //         console.log(result);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // fetchNotes();
  }, [])

  if (loading) return <p>Loading...</p>;
  if (notes.length === 0) return <p>No notes found.</p>;

  return (
    <div className="flex flex-col">
      <div id="new-button" className=" my-4">
        <Link
          href={"/notes/new"}
          className="text-white font-semibold text-xl px-5 py-2.5 rounded-md bg-blue-400 hover:bg-blue-500 float-right"
        >
          New
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:grid-rows-3 gap-4 bg-gray-50 p-10">
        {notes.map((note: Note) => (
          <div
            key={note.id}
            className="flex flex-col space-y-4 w-60 h-52 border-gray-200 rounded-md shadow-md
              shadow-gray-400 bg-white p-5 overflow-hidden cursor-pointer"
            onClick={(e:React.MouseEvent) => router.push(`/notes/${note.id}`)}
          >
            <p className="font-sans text-2xl flex-2/3 font-semibold">{note.title}</p>
            <p className="text-sm flex-1/3">{truncateText(note.content)}</p>
            <div className="text-xs text-gray-500 flex-1/3">
              <p>Created at: {new Date(note.created_at).toLocaleString()}</p>
              {/* <p>Updated at: {new Date(note.updated_at).toLocaleString()}</p> */}
              {showUpdatedAt(note.created_at, note.updated_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}