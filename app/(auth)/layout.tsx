export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-8">
      {children}
    </div>
  );
}
