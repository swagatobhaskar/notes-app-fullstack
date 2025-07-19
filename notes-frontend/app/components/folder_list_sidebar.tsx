"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiGet } from "../lib/apiFetchHandler";
import FolderItem from "./folder_item";
import { getErrorMessage } from "../lib/errors";

interface Folder {
    id: number,
    name: string,
}

export default function FolderListSidebar({current_folder_name}: {current_folder_name: string}) {

    const [ folders, setFolders ] = useState<Folder[]>([])
    const [ error, setError ] = useState<string | null>(null)
    const [ loading, setLoading ] = useState<boolean>(true)

    useEffect(() => {
        const fetchAllFoldersFromAPI = async () => {
            try {
                setError(null)
                const notes = await apiGet<Folder[]>(`${process.env.NEXT_PUBLIC_API_URL}/folder`)
                setFolders(notes)
            } catch (err: unknown) {
                console.error(err)
                setError(getErrorMessage(err))
            } finally {
                setLoading(false)
            }
        };
        fetchAllFoldersFromAPI()
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className="flex flex-col items-center">
            <Link href={'/folders'} className="flex flex-row space-x-1 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p>Back to folders</p>
            </Link>
            <ul className="mt-4">
                {folders.map(folder => (
                    <FolderItem
                        key={folder.id}
                        folder={folder}
                        isCurrentFolder={current_folder_name === folder.name}
                    />
                ))}
            </ul>
        </div>
    )
}