import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";

export default function IntoTheFolderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 bg-white items-center justify-center"> 
        {children}
      </main>
      <Footer />
    </div>
  );
}
