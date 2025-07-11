"use client"

import { useState, useEffect } from "react"

import { apiGet } from "@/app/lib/apiFetchHandler"
import Link from "next/link"

interface Folder {
    id: number,
    name: string
}

export default function AllUserCreatedFoldersPage() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
        return <p>Loading...</p>;
    }

    return (
        <div className="mt-4">
            {error && <p className="text-red-500">{error}</p>}
            {/* New Folder Button */}
            <div
                onClick={() => {alert("Modal to Create New Folder")}}
                title="New Folder"
                className="hover:bg-gray-200 my-3 p-3 rounded-md cursor-pointer w-fit"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
            </div>
            {folders.length === 0 ? (
                <p className="font-semibold text-lg">No folders available.</p>
            ):(
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {folders.map(folder => (
                        <li key={folder.id}>
                            <Link
                                href={`/folders/${folder.name}`}
                                className="block cursor-pointer px-2 py-4 shadow hover:bg-gray-200"
                            >
                                <div className="flex flex-col items-center w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="size-24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                    </svg>
                                    <p
                                        title={folder.name}
                                        className="text-center truncate w-full"
                                    >
                                        {folder.name}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}