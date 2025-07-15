"use client"

import { useEffect} from "react"

export default function NoteRemoveModal(
    {
        onClose, handleRemoveNote
    }: {
        onClose: () => void,
        handleRemoveNote: (e: React.MouseEvent) => Promise<void>
    }) {
 
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-8 rounded shadow text-center">
                <h2 className="text-2xl font-semibold">Delete this note?</h2>
                <div className="flex flex-row justify-center items-center space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer text-white bg-slate-500 rounded-md hover:bg-slate-600 px-2 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleRemoveNote}
                        className="bg-blue-400 text-white hover:bg-blue-600 cursor-pointer rounded-md px-4 py-2"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}