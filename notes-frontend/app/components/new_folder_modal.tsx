"use client"

import { useState, useEffect, useRef } from "react"
import { apiPost } from "../lib/apiFetchHandler"

interface Folder {
    id: number,
    name: string
}

export default function NewFolderModal(
    {
        onClose,
        onCreated
    }: {
        onClose: () => void,
        onCreated: (newFolder: Folder) => void;
    }) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [ newFolderName, setNewFolderName ] = useState<string>()
    const [ error, setError ] = useState<string|null>()

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        const handleEscKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKeyPress);
        return () => {
            document.removeEventListener('keydown', handleEscKeyPress);
        };
    }, [onClose])

    const handleNewFolderSubmit = async() => {
        if (newFolderName === "") {
            setError("Folder name can't be empty!")
            return
        }
        try {
            const createdFolder = await apiPost(
                `${process.env.NEXT_PUBLIC_API_URL}/folder`,
                {name: newFolderName}
            )
            // console.log("NEW FOLDER CREATED.")
            // if (response.ok) {
            onCreated(createdFolder); // ✅ update parent state
            onClose()
            // } else {
            //     const text = await response.text();
            //     console.error(text)
            //     throw new Error('Failed to create folder!')
            // }
        } catch (err: any) {
            setError(err?.message ?? 'Something went wrong')
            console.error(err)
            throw new Error('Failed to create folder!')
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-8 rounded shadow text-center">
                <h2 className="text-2xl font-semibold">Add New Folder</h2>
                <div className="flex flex-row align-baseline my-4">
                    <label
                        htmlFor="folder name"
                        className="p-2"
                    >
                        Folder name:
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        name="name"
                        id="name"
                        required
                        onChange={e=>setNewFolderName(e.target.value)}
                        className="outline outline-slate-600 p-2 rounded-md focus:shadow-md text-lg"
                    />
                </div>
                {/* { error && (<p className="text-sm text-red-500">{error}</p>) } */}
                <div className="flex flex-row justify-center items-center space-x-4">
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-white bg-slate-500 rounded-md hover:bg-slate-600 px-2 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        name="submit"
                        onClick={handleNewFolderSubmit}
                        className="bg-blue-400 text-white hover:bg-blue-600 cursor-pointer rounded-md px-4 py-2"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}