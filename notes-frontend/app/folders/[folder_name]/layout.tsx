import Footer from "@/app/components/footer";
import Header from "@/app/components/header";

export default function IntoTheFolderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col min-h-screen w-full m-2">
      {children}
    </div>
  );
}
