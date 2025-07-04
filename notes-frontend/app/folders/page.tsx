"use client"

import { useState, useEffect } from "react"

import { apiGet } from "@/app/lib/apiFetchHandler"

interface Folder {
    id: number,
    name: string
}

export default function FoldersPage() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [error, setError] = useState<string | null>(null);

    // fetch all folders for this user
    useEffect(() => {
        const fetchFoldersForCurrentUser = async () => {
            try {
                const foldersData = await apiGet<Folder[]>('http://127.0.0.1:8000/api/folder')
                console.log("FOLDERS__DATA ",foldersData);
                setFolders(foldersData)
            } catch(err: any) {
                console.error(err)
                setError(err.message)
            }
        };
        fetchFoldersForCurrentUser();
    }, [])

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Folders</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {folders.map(folder => (
                    <li key={folder.id} className="mb-1">{folder.name}</li>
                ))}
            </ul>
        </div>
    )
}