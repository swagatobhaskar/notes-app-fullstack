"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { apiGet } from "@/app/lib/apiFetchHandler";
import FolderListSidebar from "@/app/components/folder_list_sidebar";

interface Note {
  id: number,
  author: string,
  title: string,
  content: string,
  created_at: string,
  updated_at: string
}

export default function AllNotesInSelectedFolder() {

  const { folder_name } = useParams<{folder_name: string}>()

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    apiGet<Note[]>(`${process.env.NEXT_PUBLIC_API_URL}/note/folder/${folder_name}`)
    .then(setNotes)
    .catch(err => {
      console.error(err)
      setError(err.message)
    })
    .finally(() => {
      setLoading(false);
    })
    
  }, [])

  if (loading) return <p>Loading...</p>;
  if (notes.length === 0) return <p>No notes found.</p>;

  return (
    <div className="flex flex-row">
      {/* side bar component*/}
      <div className="flex-1/5 border-r border-slate-600">
        <FolderListSidebar current_folder_name={folder_name} />
      </div>
      {/* note cards */}
      <div className="flex-4/5 flex flex-col">
        <div id="new-button" className=" my-4">
          <Link
            href={`/folders/${folder_name}/new`}
            className="px-5 py-2 rounded-md bg-blue-400 hover:bg-blue-500 float-right"
          >
            {/* SVG icon for new note */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM11 11V8H13V11H16V13H13V16H11V13H8V11H11Z">
              </path>
            </svg>
          </Link>
        </div>
        <ul className="mx-5 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
          {notes.map((note: Note) => (
            <li key={note.id}>
              <Link
                href={`/folders/${folder_name}/${note.id}`}
                className="flex flex-col justify-between space-y-4 border border-gray-200 rounded-md shadow-md
                  shadow-gray-300 bg-white p-5 overflow-hidden cursor-pointer hover:shadow-lg transition
                  w-full h-30 md:h-40 lg:h-50"
              >
                <p className="font-sans text-2xl flex-2/3 font-semibold truncate">{note.title}</p>
                <p className="text-sm flex-1/3">{truncateText(note.content)}</p>
                <div className="text-xs text-gray-500 flex-1/3">
                  <p>Created at: {new Date(note.created_at).toLocaleString()}</p>
                  {/* <p>Updated at: {new Date(note.updated_at).toLocaleString()}</p> */}
                  {showUpdatedAt(note.created_at, note.updated_at)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}