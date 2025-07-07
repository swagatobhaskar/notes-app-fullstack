"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { apiGet } from "@/app/lib/apiFetchHandler"

interface Folder {
    id: number,
    name: string
}

export default function AllUserCreatedFoldersPage() {
    const router = useRouter();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // fetch all folders for this user
    useEffect(() => {
        const fetchFoldersForCurrentUser = async () => {
            try {
                const foldersData = await apiGet<Folder[]>('http://127.0.0.1:8000/api/folder')
                setFolders(foldersData)
            } catch(err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false);
            }
        };
        fetchFoldersForCurrentUser();
    }, [])

    if (loading) {
        return <p>Loading...</p>; // Optionally, a loading spinner or message while data is being fetched
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Folders</h2>
            {error && <p className="text-red-500">{error}</p>}
            {folders.length === 0 ? (
                <p>No folders available.</p>
            ):(
                <ul>
                    {folders.map(folder => (
                        <li
                            key={folder.id}
                            className="mb-1"
                            onClick={() => {router.push(`/folders/${folder.name}`)}}
                        >
                            <span>
                                <FontAwesomeIcon icon={faFolderOpen} />
                                <p>{folder.name}</p>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}