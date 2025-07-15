
export default async function IntoTheFolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {children}
    </div>
  );
}
