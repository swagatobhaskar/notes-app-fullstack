import Footer from "@/app/components/footer";
import Header from "@/app/components/header";

export default async function IntoTheFolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
}
