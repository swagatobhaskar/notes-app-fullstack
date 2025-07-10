"use client"

import { useEffect, useState } from "react";

import { apiGet } from "../lib/apiFetchHandler";
import FolderItem from "./folder_item";

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
                const notes = await apiGet<Folder[]>(`${process.env.NEXT_PUBLIC_API_URL}/folder`)
                setFolders(notes)
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        };
        fetchAllFoldersFromAPI()
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex flex-col">
            <ul className="m-8 ">
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