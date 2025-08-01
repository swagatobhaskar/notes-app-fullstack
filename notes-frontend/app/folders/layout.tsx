
export default function FolderSLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen"> {/*relative */}
            <main className="flex flex-1 justify-center bg-gray-100"> {/*items-center*/}
                {children}
            </main>
        </div>
    )
}