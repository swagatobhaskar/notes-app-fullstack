import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";

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
