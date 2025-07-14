"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet } from "@/app/lib/apiFetchHandler";
import Tiptap from "@/app/components/Tiptap";

interface Note {
    id: number,
    title: string,
    content: string,
    author: string,
    created_at: string,
    updated_at: string,
}

export default function EditNote() {
    const [note, setNote] = useState<Note | null>(null); // Initial state is null to allow conditional rendering
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    // const { note_id, folder_name } = router.query; // Use router.query to access dynamic params
    const {note_id} = useParams<{note_id: string}>();
    const {folder_name} = useParams<{folder_name: string}>();

    useEffect(() => {
        if (!note_id) return; // Don't fetch until we have a note_id (for SSR or initial render)
        const fetchNoteById = async () => {
            // console.log("folder, note: ", folder_name, note_id)
            try {
                const res = await apiGet<Note>(`${process.env.NEXT_PUBLIC_API_URL}/note/${note_id}`)
                console.log(res)
                // if (!res.ok) throw new Error('Not found');   //no status code returned from backend
                setNote(res);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNoteById();
    }, [note_id]);
    
    const handleUpdatedNoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!note) return;
        setLoading(true);
        setError(null);

        const updatedNote = {
            title: note.title,
            content: note.content,
            // Include other fields as necessary, e.g., author, updated_at, etc.
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/note/${note_id}/`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedNote),
            });
            if (!response.ok) throw new Error('Update failed');
            router.push(`/folders/${folder_name}/${note_id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote((prevNote) => {
            if (!prevNote) return prevNote;  // Ensure we have a previous note to update
            return { ...prevNote, title: e.target.value }; //update the title
        });
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote((prevNote) => {
            if (!prevNote) return prevNote; // Ensure we have a previous note to update
            return { ...prevNote, content: e.target.value }; // Update the content
        });
    };

    if (!note) {
        return <div>Loading...</div>; // Display loading until the note is fetched
    }

    return (
        <div className="mx-auto w-2/4">
            <form onSubmit={handleUpdatedNoteSubmit}>
                <div className="">
                    <label htmlFor="title" className="">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={note.title}
                        onChange={handleTitleChange}
                    />
                </div>
                <Tiptap content={note.content} onchange={handleContentChange} />
                <div className="">
                    <button
                        type="button"
                        onClick={() => {
                            const confirmed = window.confirm('Are you sure you want to cancel your changes?');
                            if (confirmed) {
                                router.push(`/folders/${folder_name}/${note_id}`)
                            }
                        }}
                        className="text-white px-3 py-1 rounded-sm bg-gray-400
                        hover:bg-gray-500 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="text-white px-3 py-1 rounded-sm bg-blue-400
                        hover:bg-blue-500 cursor-pointer"
                    >
                        Save Note
                    </button>
                </div>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}