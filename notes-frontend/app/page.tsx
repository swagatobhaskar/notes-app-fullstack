import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Header from "./components/header";
import Footer from "./components/footer";

export default async function Home() {

  const cookieStore = cookies()
  const csrfToken = (await cookieStore).get('csrf_token')?.value
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      Cookie: (await cookieStore).toString(),
      ...( csrfToken ? {'X-CSRF-Token': csrfToken} : {})
    },
    credentials: 'include',
    cache: 'no-store'
  })

  if (res.ok) {
    redirect('/folders')
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <Image 
        src='/hugo-rocha-unsplash.jpg'
        alt="brainstorm-notes"
        placeholder="empty"
        quality={75}
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
          zIndex: -1
        }}
        className="opacity-60 blur-xs hue-rotate-30"
      />

      <Header />
      
      <main className="flex-1 z-10 p-6 text-black">
        <div className="mx-auto max-w-3xl bg-slate-300/45 shadow-md rounded-md h-96 flex flex-col items-center justify-center gap-y-4">
          {/* Your main content here */}
          <h1 className="text-4xl font-extrabold">Your Online Notes Archive</h1>
          <p className="text-xl">Single place for all your notes.</p>
          <div className="flex flex-row gap-x-2">
            <Link
                className="text-white bg-blue-700 px-2.5 py-1.5 rounded-md font-semibold hover:bg-blue-800"
                href={'/login'}>Login
            </Link>
            <Link
                className="text-white bg-blue-700 px-2.5 py-1.5 rounded-md font-semibold hover:bg-blue-800"
                href={'/register'}>Sign up
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    
    </div>
  );
}
