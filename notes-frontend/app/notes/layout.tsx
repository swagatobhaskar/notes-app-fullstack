
export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="relative flex flex-col min-h-screen"
    >
      <header className="bg-gray-800 text-white p-4 text-center">
        <p>Example App</p>
      </header>
      <main className="flex flex-1 items-center justify-center bg-gray-100">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>Made with FastAPI and Next.js</p>
      </footer>
    </div>
  );
}
