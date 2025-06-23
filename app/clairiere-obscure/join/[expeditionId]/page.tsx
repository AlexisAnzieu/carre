"use client";

import { useEffect, useState } from "react";

interface Expedition {
  id: string;
  name: string;
  _count: {
    expeditioners: number;
  };
}

interface UserExpedition {
  id: string;
  name: string;
}

interface UserProfile {
  id: string;
  name: string;
  expeditions: UserExpedition[];
}

export default function JoinPage({
  params,
}: {
  params: Promise<{ expeditionId: string }>;
}) {
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [joinedMemberName, setJoinedMemberName] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await fetch("/clairiere-obscure/api/user");
        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);

          // Check if user is already in this expedition
          const { expeditionId } = await params;
          const isInExpedition = userData.expeditions.some(
            (exp: UserExpedition) => exp.id === expeditionId
          );

          if (isInExpedition) {
            setAlreadyJoined(true);
            setJoinedMemberName(userData.name);
          }
        }
      } catch {
        console.log("No user session found");
      }
    };

    const fetchExpedition = async () => {
      try {
        const { expeditionId } = await params;
        const response = await fetch(
          `/clairiere-obscure/api/expeditions/${expeditionId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch expedition");
        }

        setExpedition(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
    fetchExpedition();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !birthday) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { expeditionId } = await params;
      const response = await fetch(
        `/clairiere-obscure/api/expeditions/${expeditionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name.trim(), birthday }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join expedition");
      }

      // User is now logged in via cookie set by the API
      // Refresh user profile to show they've joined
      const userResponse = await fetch("/clairiere-obscure/api/user");
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserProfile(userData);
        setAlreadyJoined(true);
        setJoinedMemberName(userData.name);
      }

      setSuccess(true);
      setName("");
      setBirthday("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a0f1a 25%, #0f1419 50%, #1a0f1a 75%, #0a0a0a 100%)",
      }}
    >
      {/* Atmospheric background elements */}
      <div className="absolute inset-0">
        {/* Ornate pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-7.364-5.636-13.333-12.667-13.333S-5.333 12.636-5.333 20s5.636 13.333 12.667 13.333S20 27.364 20 20zm-12.667-10c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating particles - fewer on mobile */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20 animate-pulse"
              style={{
                background:
                  "radial-gradient(circle, #d4af37 0%, transparent 70%)",
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 4 + "s",
                animationDuration: Math.random() * 3 + 2 + "s",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="relative w-full max-w-sm sm:max-w-md">
          {/* Ornate border frame - subtle on mobile */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-amber-900/10 sm:from-amber-900/20 sm:to-amber-900/20 rounded-lg transform rotate-1" />
          <div className="absolute inset-0 bg-gradient-to-tl from-amber-800/5 via-transparent to-amber-800/5 sm:from-amber-800/10 sm:to-amber-800/10 rounded-lg transform -rotate-1" />

          {/* Main content container */}
          <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-amber-900/20 sm:border-2 sm:border-amber-900/30 rounded-lg shadow-2xl overflow-hidden">
            {/* Top decorative border */}
            <div className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />

            <div className="p-4 sm:p-6 md:p-8">
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4" />
                  <p className="text-amber-100 font-serif text-sm sm:text-base">
                    Chargement de l&apos;expédition...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 sm:p-4 mb-4">
                    <div className="text-red-400 font-serif text-xs sm:text-sm">
                      {error}
                    </div>
                  </div>
                </div>
              ) : expedition ? (
                <>
                  {/* Header with ornate styling */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full mb-3 sm:mb-4 shadow-lg">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-amber-100"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-2 text-amber-100 tracking-wide px-2">
                      {expedition.name}
                    </h1>
                    <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-2 sm:mb-3" />
                    <p className="text-amber-200/80 font-serif text-xs sm:text-sm tracking-wider">
                      {expedition._count.expeditioners} explorateur
                      {expedition._count.expeditioners !== 1 ? "s" : ""} inscrit
                      {expedition._count.expeditioners !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {alreadyJoined && !success ? (
                    <div className="bg-amber-900/20 border border-amber-700/40 rounded-lg p-4 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                      <p className="text-amber-200 font-serif leading-relaxed text-sm sm:text-base px-2">
                        Vous faites déjà partie de cette expédition en tant que{" "}
                        <span className="font-bold text-amber-100">
                          {joinedMemberName}
                        </span>
                        .
                      </p>
                      {userProfile && (
                        <div className="mt-4">
                          <a
                            href="/clairiere-obscure/profile"
                            className="inline-flex items-center px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-lg transition-colors text-sm font-serif"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            Voir mon profil
                          </a>
                        </div>
                      )}
                    </div>
                  ) : success ? (
                    <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-lg p-4 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" />
                        </svg>
                      </div>
                      <p className="text-emerald-200 font-serif text-base sm:text-lg leading-relaxed px-2">
                        Félicitations ! Vous avez rejoint l&apos;expédition avec
                        succès.
                      </p>
                      <p className="text-emerald-300/80 font-serif text-xs sm:text-sm mt-2">
                        Votre aventure commence maintenant...
                      </p>
                      <div className="mt-4">
                        <a
                          href="/clairiere-obscure/profile"
                          className="inline-flex items-center px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-emerald-100 rounded-lg transition-colors text-sm font-serif"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                          Voir mon profil
                        </a>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5 sm:space-y-6"
                    >
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs sm:text-sm font-serif font-medium text-amber-200 mb-2 sm:mb-3 tracking-wide"
                        >
                          Nom de l&apos;Explorateur
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-amber-900/20 sm:border-2 sm:border-amber-900/30 rounded-lg text-amber-100 placeholder-amber-300/50 font-serif focus:outline-none focus:border-amber-600/50 focus:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                            placeholder="Inscrivez votre nom dans les annales..."
                            required
                          />
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-600/5 to-transparent pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="birthday"
                          className="block text-xs sm:text-sm font-serif font-medium text-amber-200 mb-2 sm:mb-3 tracking-wide"
                        >
                          Date de Naissance
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            id="birthday"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-amber-900/20 sm:border-2 sm:border-amber-900/30 rounded-lg text-amber-100 font-serif focus:outline-none focus:border-amber-600/50 focus:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                            required
                          />
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-600/5 to-transparent pointer-events-none" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 disabled:from-gray-700 disabled:via-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-serif font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/20 group text-sm sm:text-base"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative tracking-wide">
                          {submitting
                            ? "Inscription en cours..."
                            : "Rejoindre l'Expédition"}
                        </span>
                      </button>
                    </form>
                  )}
                </>
              ) : null}
            </div>

            {/* Bottom decorative border */}
            <div className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
