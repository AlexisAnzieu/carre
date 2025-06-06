'use client';

import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/clairiere-obscure/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <p className="text-white text-lg">Welcome to the admin area!</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="text-white">
        <p>This is the protected admin area. Add your admin content here.</p>
      </div>
    </>
  );
}
