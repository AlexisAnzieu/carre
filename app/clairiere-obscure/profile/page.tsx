"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserExpedition {
  id: string;
  name: string;
  createdAt: string;
  _count: {
    expeditioners: number;
  };
}

interface UserProfile {
  id: string;
  name: string;
  birthday: string;
  expeditions: UserExpedition[];
  totalExpeditions: number;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/clairiere-obscure/api/user");

        if (response.status === 401) {
          // User not authenticated, redirect to home or login
          router.push("/clairiere-obscure");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user profile");
        }

        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error: {error}</div>
          <button
            onClick={() => router.push("/clairiere-obscure")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-xl">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* User Info */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">Name:</span>
              <div className="text-xl">{profile.name}</div>
            </div>
            <div>
              <span className="text-gray-400">Birthday:</span>
              <div className="text-xl">{formatDate(profile.birthday)}</div>
            </div>
            <div>
              <span className="text-gray-400">Total Expeditions:</span>
              <div className="text-xl">{profile.totalExpeditions}</div>
            </div>
          </div>
        </div>

        {/* Expedition History */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Expedition History</h2>

          {profile.expeditions.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No expeditions joined yet.
            </div>
          ) : (
            <div className="space-y-4">
              {profile.expeditions.map((expedition) => (
                <div
                  key={expedition.id}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-400">
                        {expedition.name}
                      </h3>
                      <p className="text-gray-400 mt-1">
                        Joined on {formatDate(expedition.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Expeditioners</div>
                      <div className="text-lg font-semibold">
                        {expedition._count.expeditioners}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
