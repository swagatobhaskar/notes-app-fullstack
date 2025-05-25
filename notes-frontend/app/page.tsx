import Image from "next/image";

export default async function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4 text-center">
        <p>Example App</p>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-2/3">
          <Image 
            src='/hugo-rocha-unsplash.jpg'
            alt="brainstorm-notes"
            placeholder="empty"
            quality={100}
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
            className="opacity-60 blur-xs"
          />
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>Made with FastAPI and Next.js</p>
      </footer>
    </div>
  );
}
