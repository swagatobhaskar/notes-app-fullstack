import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Header from "./components/header";
import Footer from "./components/footer";

export default async function Home() {

  let isAuthenticated = false;

  const cookieStore = cookies()
  const csrfToken = (await cookieStore).get('csrf_token')?.value

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "GET",
      headers: {
        Cookie: (await cookieStore).toString(),
        ...( csrfToken ? {'X-CSRF-Token': csrfToken} : {})
      },
      credentials: 'include',
      cache: 'no-store'
    })
    if (res.ok) {
      isAuthenticated = true;
    }
  } catch (err: unknown) {
    console.error("Fetch error:", err);
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="flex flex-col items-center text-center text-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-14">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <h2>Items Unavailable</h2>
          <p className="text-base">Sorry, we could not load the items at this time.</p>
        </div>
      </div>
    )
  }
  
  if (isAuthenticated) {
    console.info("Redirecting to /folders from /")
    redirect('/folders')
  }
 
  return (
    <div id="home" className="relative flex flex-col min-h-screen">
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
