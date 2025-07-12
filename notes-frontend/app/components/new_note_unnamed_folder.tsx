'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewNoteUnnamedFolder(
    {
        unnamedFolderExists,
        createUnnamedFolder
    } : {
        unnamedFolderExists: boolean,
        createUnnamedFolder: () => Promise<void>
    })
{
    const [creating, setCreating] = useState<boolean>(false)
    const router = useRouter()

    const handleClick = async() => {
        if (unnamedFolderExists) {
            router.push('/folders/unnamed/new')
        } else {
            setCreating(true)
            await createUnnamedFolder()
            setCreating(false)
        }
    }

    return (
        <button
            disabled={creating}
            onClick={handleClick}
            title="Create new note"
            className="mx-4 px-3 py-0 rounded-md hover:bg-gray-200 cursor-pointer"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
        </button>
    )
}