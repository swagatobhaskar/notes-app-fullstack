import Image from "next/image";
import img from '../public/hugo-rocha-unsplash.jpg';

export default async function Home() {

  const imageStyle = {
    borderRadius: '5%',
    border: '1px solid #fff',
    width: '1000px',
    height: 'auto',
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4 text-center">

      </header>
      <main className="flex-1">
        <div className="mx-auto w-2/3 shadow shadow-gray-400 p-5">
          <Image 
            src={img}
            alt="brainstorm-notes"
            placeholder="blur"
            quality={100}
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>Made with FastAPI and Next.js</p>
      </footer>
    </div>
  );
}
