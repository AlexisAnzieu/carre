"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Expedition = {
  id: string;
  name: string;
  createdAt: string;
};

export default function AdminPage() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [newExpeditionName, setNewExpeditionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchExpeditions();
  }, []);

  const fetchExpeditions = async () => {
    try {
      const response = await fetch("/clairiere-obscure/api/expeditions");
      if (response.ok) {
        const data = await response.json();
        setExpeditions(data);
      }
    } catch (error) {
      console.error("Failed to fetch expeditions:", error);
    }
  };

  const handleCreateExpedition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpeditionName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/clairiere-obscure/api/expeditions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newExpeditionName }),
      });

      if (response.ok) {
        setNewExpeditionName("");
        fetchExpeditions();
      }
    } catch (error) {
      console.error("Failed to create expedition:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteExpedition = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const response = await fetch("/clairiere-obscure/api/expeditions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchExpeditions();
      }
    } catch (error) {
      console.error("Failed to delete expedition:", error);
    }
    setDeletingId(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/clairiere-obscure/api/auth/logout", {
        method: "POST",
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

      <div className="space-y-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-white text-xl mb-4">Create New Expedition</h2>
          <form onSubmit={handleCreateExpedition} className="space-y-4">
            <div>
              <input
                type="text"
                value={newExpeditionName}
                onChange={(e) => setNewExpeditionName(e.target.value)}
                placeholder="Expedition name"
                className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isLoading ? "Creating..." : "Create Expedition"}
            </button>
          </form>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-white text-xl mb-4">Expeditions</h2>
          <div className="space-y-4">
            {expeditions.map((expedition) => (
              <div
                key={expedition.id}
                className="p-4 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() =>
                  router.push(`/clairiere-obscure/join/${expedition.id}`)
                }
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(`/clairiere-obscure/join/${expedition.id}`);
                  }
                }}
              >
                <div>
                  <h3 className="text-white font-medium">{expedition.name}</h3>
                  <p className="text-gray-400 text-sm">
                    Created:{" "}
                    {new Date(expedition.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteExpedition(expedition.id, expedition.name);
                  }}
                  disabled={deletingId === expedition.id}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:bg-red-300 text-sm"
                >
                  {deletingId === expedition.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
            {expeditions.length === 0 && (
              <p className="text-gray-400">No expeditions yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
