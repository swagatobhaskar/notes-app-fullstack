"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { apiGet, apiPost } from "@/app/lib/apiFetchHandler"
import NewNoteUnnamedFolder from "../components/new_note_unnamed_folder"
import { useRouter } from "next/navigation"
import NewFolderModal from "../components/new_folder_modal"
import { getErrorMessage } from "../lib/errors"

interface Folder {
    id: number,
    name: string
}

export default function AllUserCreatedFoldersPage() {
    const router = useRouter()
    const [ showModal, setShowModal ] = useState<boolean>(false);
    const [ folders, setFolders ] = useState<Folder[]>([]);
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const fetchFoldersForCurrentUser = async () => {
        try {
            const foldersData = await apiGet<Folder[]>(`${process.env.NEXT_PUBLIC_API_URL}/folder`)
            setFolders(foldersData)
        } catch(err: unknown) {
            console.error(err)
            setError(getErrorMessage(err))
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                await apiGet(`${process.env.NEXT_PUBLIC_API_URL}/user`);
                setIsAuthenticated(true);
                await fetchFoldersForCurrentUser();
            } catch (err: unknown) {
                setError(getErrorMessage(err))
                setIsAuthenticated(false);
                setLoading(false);   // Prevent infinite loading
            }
        };
        initialize();
    }, [])

    if (loading) {
        return <p>Loading...</p>;
    }

    const handleNewFolderCreated = (newFolder: Folder) => {
        setFolders((prev) => [ ...prev, newFolder ])
    }

    const createUnnamedFolder = async() => {
        try {
            const response = await apiPost<Folder>(`${process.env.NEXT_PUBLIC_API_URL}/folder`, { name: "unnamed" })
            
            if (response) {       // no status code upon success is returned from backend, but the full body
                // Option 1: re-fetch everything
                await fetchFoldersForCurrentUser()

                // Option 2: or optimistically add it
                // setFolders(prev => [...prev, { id: response.id, name: "unnamed" }])

                // Then redirect
                router.push('/folders/unnamed/new')
            } else {
                // Try to log response body to see the error
                console.error('Backend did not return ok:', response);
                throw new Error('Failed to create folder')
            }
        } catch (err: unknown) {
            console.error(err)
            setError(getErrorMessage(err))
        }
    }

    return (
        <div className="mt-4">
            {error && <p className="text-red-500">{error}</p>}
            {/* New Folder Button */}
            { isAuthenticated ? (
                <div className="flex flex-row w-fit align-baseline p-2">
                    <div
                        // onClick={() => {alert("Modal to Create New Folder")}}
                        onClick={()=>setShowModal(true)}
                        title="New Folder"
                        className="hover:bg-gray-200 my-3 p-3 rounded-md cursor-pointer w-fit"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                        </svg>
                    </div>
                    <NewNoteUnnamedFolder
                        unnamedFolderExists={folders.some(folder => folder.name === 'unnamed')}
                        createUnnamedFolder={createUnnamedFolder} //pass callback
                    />
                </div>
            ) : (<p>Please Log in or sign up</p>)}
            
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
            {/* New folder modal */}
            {showModal && (
                <NewFolderModal
                    onClose={()=>setShowModal(false)}
                    onCreated={handleNewFolderCreated}    
                />
            )}
        </div>
    )
}