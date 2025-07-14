"use client"

import { apiDelete, apiGet } from "@/app/lib/apiFetchHandler";
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

export default function SelectedNotePage() {
    const router = useRouter();
    const {note_id} = useParams<{note_id: string}>();
    const {folder_name} = useParams<{folder_name: string}>();
    const [note, setNote] = useState< Note | null >(null);
    const [ error, setError ] = useState< string|null >(null)
    const [loading, setLoading] = useState(true);
    const [ deleteSuccess, setDeleteSuccess ] = useState<boolean>(false)

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await apiGet<Note>(`${process.env.NEXT_PUBLIC_API_URL}/note/${Number(note_id)}`)
                setNote(res)
            } catch(err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [note_id]);

    const handleRemoveNote = async (e: React.MouseEvent) => {
        try {
            await apiDelete(`${process.env.NEXT_PUBLIC_API_URL}/note/${note_id}`)
            setDeleteSuccess(true)
            router.back()
        } catch(err: any) {
            console.error(err)
            setError(err.message)
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!note) return <p>Note not found.</p>;

  return (
    <div className="m-auto lg:w-3/6 flex flex-col h-full">
        <div className="flex flex-col space-y-2 mt-10">
            <h1 className="text-3xl font-semibold text-center">{note.title}</h1>
            <p className="text-sm">{new Date(note.created_at).toLocaleString()}</p>
            <div
                className="h-60"
                dangerouslySetInnerHTML={{__html: note.content}}
            >
            </div>
        </div>
        <div className="flex flex-row space-x-2 float-right mt-4">
            <button
                onClick={(e: React.MouseEvent) => router.push(`/folders/${folder_name}/${note_id}/edit`)}
                className="text-white font-semibold px-3 py-1 rounded-sm bg-blue-400
                hover:bg-blue-500 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                    <path d="M5 18.89H6.41421L15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89ZM21 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L9.24264 18.89H21V20.89ZM15.7279 6.74785L17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785Z">
                    </path>
                </svg>
                {/* Edit */}
            </button>
            <button
                onClick={(e: React.MouseEvent) => handleRemoveNote(e)}
                className="text-white font-semibold px-3 py-1 rounded-sm bg-red-400
                hover:bg-red-500 cursor-pointer"
            >
                {/* Delete */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z">
                    </path>
                </svg>
            </button>
        </div>
    </div>
  );
}