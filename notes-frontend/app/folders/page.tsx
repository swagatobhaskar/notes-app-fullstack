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
                const foldersData = await apiGet<Folder[]>(`${process.env.NEXT_PUBLIC_API_URL}/folder`)
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
                            <div className="">
                                {/* <FontAwesomeIcon icon={faFolderOpen} /> */}
                                <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6.47214C3 6.16165 3.07229 5.85542 3.21115 5.57771L4 4H9L10 6H20C20.5523 6 21 6.44772 21 7V9V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V9V6.47214Z" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M4 20H20C20.5523 20 21 19.5523 21 19V11C21 9.89543 20.1046 9 19 9H5C3.89543 9 3 9.89543 3 11V19C3 19.5523 3.44772 20 4 20Z" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <p>{folder.name}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}