import { cookies } from 'next/headers';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin-auth')?.value === 'true';

  if (!isAuthenticated) {
    return children; // Show login form
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-white">Admin Dashboard</h1>
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
