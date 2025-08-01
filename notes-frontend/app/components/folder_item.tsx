import Link from "next/link";

export default function FolderItem({folder, isCurrentFolder} : {
    folder: {id: number, name: string},
    isCurrentFolder: boolean
}) {

    return (
        <li key={folder.id} className="my-4">
            <div className="flex flex-row space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
                { isCurrentFolder ? (
                    <p className="underline underline-offset-2">{folder.name}</p>
                ) : (
                    <Link href={`/folders/${folder.name}`} className="hover:font-semibold">
                        {folder.name}
                    </Link>
                ) }
            </div>
        </li>
    )
}