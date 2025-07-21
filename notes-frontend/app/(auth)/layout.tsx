
export default async function AuthLayout(
    {children,}: {children: React.ReactNode;}
){
    return (
        <div className="flex flex-col min-h-screen"> {/*relative*/}
            <main className="flex flex-1 items-center justify-center bg-gray-100">
                {children}
            </main>
        </div>        
    )
}
