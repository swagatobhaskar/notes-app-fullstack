import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  return (
    <div className="relative flex flex-col min-h-screen">
      <Image 
        src='/hugo-rocha-unsplash.jpg'
        alt="brainstorm-notes"
        placeholder="empty"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
          zIndex: -1
        }}
        className="opacity-60 blur-xs hue-rotate-30"
      />
      <header className="bg-gray-800 text-white p-4 text-center">
        <p>Example App</p>
      </header>
      <main className="flex-1 z-10 p-6 text-black">
        <div className="mx-auto max-w-3xl bg-blue-300/45 shadow-md rounded-md h-96 flex flex-col items-center justify-center gap-y-4">
          {/* Your main content here */}
          <h1 className="text-4xl font-extrabold">Your Online Notes Archive</h1>
          <p className="text-xl">Single place for all your notes.</p>
          <div className="flex flex-row gap-x-2">
            <Link
                className="text-white bg-blue-700 px-2.5 py-1.5 rounded-md font-semibold hover:bg-blue-800"
                href={'/user/login'}>Login
            </Link>
            <Link
                className="text-white bg-blue-700 px-2.5 py-1.5 rounded-md font-semibold hover:bg-blue-800"
                href={'/user/register'}>Sign up
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>Made with FastAPI and Next.js</p>
      </footer>
    </div>
  );
}
