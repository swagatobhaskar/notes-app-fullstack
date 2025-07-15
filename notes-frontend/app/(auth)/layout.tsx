import Footer from "@/app/components/footer";
import Header from "@/app/components/header";

export default async function AuthLayout(
    {children,}: Readonly<{children: React.ReactNode;}>
){
    return (
        <div className="relative flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-1 items-center justify-center bg-gray-100">
                {children}
            </main>
            <Footer />
        </div>        
    )
}
