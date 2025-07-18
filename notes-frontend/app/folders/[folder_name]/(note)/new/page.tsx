"use client"

import { useRouter, useParams } from "next/navigation"
import React, { useState } from "react"

import Tiptap from "@/app/components/Tiptap";
import { apiPost } from "@/app/lib/apiFetchHandler";
import { getErrorMessage } from "@/app/lib/errors";

interface Note {
    id: number,
    title: string,
    content: string,
    author: string,
    created_at: string,
    updated_at: string,
}

export default function NewNote() {

    const {folder_name} = useParams<{folder_name: string}>()

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleNewNoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const modified_title = JSON.stringify(title)
        const formData = {
            title: modified_title.slice(1, -1),
            content: JSON.stringify(content)
        }

        console.log("FORMDATA:: ", formData)

        e.preventDefault();
        try {
            const response = await apiPost<Note>(
                `${process.env.NEXT_PUBLIC_API_URL}/note`,
                formData
            )
            // if (!response.ok) throw new Error("Failed to save!");
            // const {id} = await response.id
            const note_id = response.id
            router.push(`folders/${folder_name}/${note_id}`) // need folder name
        } catch (err: unknown) {
            console.error(err);
            setError(getErrorMessage(err))
        }
    }

    const handleContentChange = (content: string) => {
        setContent(content)
        console.log(content)
    }

    // periodically save as draft or to localStorage
    if (error) return <p>{error}</p>

    return (
        <div className="mx-auto min-w-[60vw] max-w-[60vw]">
            <form onSubmit={handleNewNoteSubmit}>
                <div className="flex flex-row items-baseline">
                    <label htmlFor="title" className="font-semibold text-xl w-fit">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full ml-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    />
                </div>
                {/* Tiptap */}
                <Tiptap onchange={handleContentChange} content={content} />
                <div className="float-right">
                    <button
                        type="button"
                        onClick={() => {
                            const confirmed = window.confirm('Are you sure you want to cancel your changes?');
                            if (confirmed) {
                                setTitle('')
                                setContent('')
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
