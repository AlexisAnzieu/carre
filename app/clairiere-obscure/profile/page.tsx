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
    const date = new Date(dateString);
    // Add 6 hours to account for server timezone difference
    date.setHours(date.getHours() + 6);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background:
            "linear-gradient(39deg, #2a2028 0%, #3a2f3a 25%, #4a3849 50%, #3a2f3a 75%, #2a2028 80%)",
        }}
      >
        {/* Flying petals background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(175)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-90 animate-pulse"
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 8 + "s",
                animationDuration: Math.random() * 12 + 8 + "s",
              }}
            >
              <div
                className="transform rotate-45 rounded-full"
                style={{
                  width: Math.random() * 6 + 3 + "px",
                  height: Math.random() * 10 + 5 + "px",
                  background: `linear-gradient(135deg, 
                    rgba(236, 72, 153, ${Math.random() * 0.6 + 0.4}) 0%, 
                    rgba(190, 18, 60, ${Math.random() * 0.7 + 0.3}) 50%, 
                    rgba(244, 63, 94, ${Math.random() * 0.5 + 0.3}) 100%)`,
                  boxShadow: `0 0 ${
                    Math.random() * 12 + 6
                  }px rgba(236, 72, 153, 0.7)`,
                  animation: `floatUp ${
                    Math.random() * 18 + 12
                  }s infinite linear`,
                  transform: `rotate(${Math.random() * 360}deg) scale(${
                    Math.random() * 0.7 + 0.5
                  })`,
                }}
              />
            </div>
          ))}
        </div>

        {/* CSS animations for petals */}
        <style jsx>{`
          @keyframes floatUp {
            0% {
              transform: translateY(100vh) translateX(0px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-15vh)
                translateX(${Math.random() * 150 - 75}px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div className="text-center py-6">
            <div
              className="inline-block w-8 h-8 sm:w-10 sm:h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"
              style={{ boxShadow: "0 0 15px rgba(212, 175, 55, 0.3)" }}
            />
            <p className="text-amber-100 font-serif text-sm sm:text-base tracking-wide">
              Chargement du profil...
            </p>
            <div className="mt-2 w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background:
            "linear-gradient(39deg, #2a2028 0%, #3a2f3a 25%, #4a3849 50%, #3a2f3a 75%, #2a2028 80%)",
        }}
      >
        {/* Flying petals background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(175)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-90 animate-pulse"
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 8 + "s",
                animationDuration: Math.random() * 12 + 8 + "s",
              }}
            >
              <div
                className="transform rotate-45 rounded-full"
                style={{
                  width: Math.random() * 6 + 3 + "px",
                  height: Math.random() * 10 + 5 + "px",
                  background: `linear-gradient(135deg, 
                    rgba(236, 72, 153, ${Math.random() * 0.6 + 0.4}) 0%, 
                    rgba(190, 18, 60, ${Math.random() * 0.7 + 0.3}) 50%, 
                    rgba(244, 63, 94, ${Math.random() * 0.5 + 0.3}) 100%)`,
                  boxShadow: `0 0 ${
                    Math.random() * 12 + 6
                  }px rgba(236, 72, 153, 0.7)`,
                  animation: `floatUp ${
                    Math.random() * 18 + 12
                  }s infinite linear`,
                  transform: `rotate(${Math.random() * 360}deg) scale(${
                    Math.random() * 0.7 + 0.5
                  })`,
                }}
              />
            </div>
          ))}
        </div>

        {/* CSS animations for petals */}
        <style jsx>{`
          @keyframes floatUp {
            0% {
              transform: translateY(100vh) translateX(0px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-15vh)
                translateX(${Math.random() * 150 - 75}px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div className="text-center py-6">
            <div className="bg-red-900/40 border-2 border-red-700/60 rounded-xl p-4 mb-4 backdrop-blur-sm">
              <div className="text-red-300 font-serif text-xs sm:text-sm tracking-wide">
                Erreur: {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background:
            "linear-gradient(39deg, #2a2028 0%, #3a2f3a 25%, #4a3849 50%, #3a2f3a 75%, #2a2028 80%)",
        }}
      >
        {/* Flying petals background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(175)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-90 animate-pulse"
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 8 + "s",
                animationDuration: Math.random() * 12 + 8 + "s",
              }}
            >
              <div
                className="transform rotate-45 rounded-full"
                style={{
                  width: Math.random() * 6 + 3 + "px",
                  height: Math.random() * 10 + 5 + "px",
                  background: `linear-gradient(135deg, 
                    rgba(236, 72, 153, ${Math.random() * 0.6 + 0.4}) 0%, 
                    rgba(190, 18, 60, ${Math.random() * 0.7 + 0.3}) 50%, 
                    rgba(244, 63, 94, ${Math.random() * 0.5 + 0.3}) 100%)`,
                  boxShadow: `0 0 ${
                    Math.random() * 12 + 6
                  }px rgba(236, 72, 153, 0.7)`,
                  animation: `floatUp ${
                    Math.random() * 18 + 12
                  }s infinite linear`,
                  transform: `rotate(${Math.random() * 360}deg) scale(${
                    Math.random() * 0.7 + 0.5
                  })`,
                }}
              />
            </div>
          ))}
        </div>

        {/* CSS animations for petals */}
        <style jsx>{`
          @keyframes floatUp {
            0% {
              transform: translateY(100vh) translateX(0px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-15vh)
                translateX(${Math.random() * 150 - 75}px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div className="text-amber-100 font-serif text-xl">
            Profil introuvable
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(39deg, #2a2028 0%, #3a2f3a 25%, #4a3849 50%, #3a2f3a 75%, #2a2028 80%)",
      }}
    >
      {/* Flying petals background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(175)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-90 animate-pulse"
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 8 + "s",
              animationDuration: Math.random() * 12 + 8 + "s",
            }}
          >
            <div
              className="transform rotate-45 rounded-full"
              style={{
                width: Math.random() * 6 + 3 + "px",
                height: Math.random() * 10 + 5 + "px",
                background: `linear-gradient(135deg, 
                  rgba(236, 72, 153, ${Math.random() * 0.6 + 0.4}) 0%, 
                  rgba(190, 18, 60, ${Math.random() * 0.7 + 0.3}) 50%, 
                  rgba(244, 63, 94, ${Math.random() * 0.5 + 0.3}) 100%)`,
                boxShadow: `0 0 ${
                  Math.random() * 12 + 6
                }px rgba(236, 72, 153, 0.7)`,
                animation: `floatUp ${
                  Math.random() * 18 + 12
                }s infinite linear`,
                transform: `rotate(${Math.random() * 360}deg) scale(${
                  Math.random() * 0.7 + 0.5
                })`,
              }}
            />
          </div>
        ))}
      </div>

      {/* CSS animations for petals */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-15vh)
              translateX(${Math.random() * 150 - 75}px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="relative z-10 min-h-screen p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with ornate Belle Époque styling */}
          <div className="text-center mb-8 sm:mb-12">
            <div
              className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 rounded-full mb-6 sm:mb-8 shadow-xl relative mx-auto"
              style={{
                boxShadow:
                  "0 0 40px rgba(212, 175, 55, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
              }}
            >
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-amber-50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              {/* Light effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 text-amber-50 tracking-wider px-2"
              style={{ textShadow: "0 0 30px rgba(212, 175, 55, 0.6)" }}
            >
              Profil d&apos;Expéditionnaire
            </h1>
            <div className="w-40 sm:w-48 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4" />
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <div className="w-1 h-1 bg-amber-500 rounded-full" />
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
            </div>
            <p className="text-amber-200/90 font-serif text-lg sm:text-xl tracking-widest">
              {profile.name}
            </p>
          </div>

          {/* User Information Card */}
          <div className="relative bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 border-2 border-amber-900/40 rounded-xl shadow-2xl overflow-hidden mb-8">
            {/* Decorative top border */}
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            <div className="p-6 sm:p-8">
              <h2
                className="text-2xl sm:text-3xl font-serif font-bold mb-6 text-amber-50 tracking-wider text-center"
                style={{ textShadow: "0 0 20px rgba(212, 175, 55, 0.5)" }}
              >
                Informations Personnelles
              </h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="text-amber-200/80 font-serif text-sm sm:text-base tracking-widest uppercase mb-2">
                    Nom de l&apos;Expéditionnaire
                  </div>
                  <div
                    className="text-xl sm:text-2xl font-serif font-bold text-amber-50 tracking-wide"
                    style={{ textShadow: "0 0 15px rgba(212, 175, 55, 0.4)" }}
                  >
                    {profile.name}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-amber-200/80 font-serif text-sm sm:text-base tracking-widest uppercase mb-2">
                    Date de Naissance
                  </div>
                  <div
                    className="text-xl sm:text-2xl font-serif font-bold text-amber-50 tracking-wide"
                    style={{ textShadow: "0 0 15px rgba(212, 175, 55, 0.4)" }}
                  >
                    {formatDate(profile.birthday)}
                  </div>
                </div>
                <div className="text-center md:col-span-2">
                  <div className="text-amber-200/80 font-serif text-sm sm:text-base tracking-widest uppercase mb-2">
                    Expéditions Accomplies
                  </div>
                  <div
                    className="text-3xl sm:text-4xl font-serif font-bold text-amber-400 tracking-wide"
                    style={{ textShadow: "0 0 20px rgba(212, 175, 55, 0.6)" }}
                  >
                    {profile.totalExpeditions}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative bottom border */}
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            {/* Decorative corners */}
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-amber-500/50 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-amber-500/50 rounded-br-lg" />
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-amber-500/50 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-amber-500/50 rounded-tr-lg" />
          </div>

          {/* Expedition History Card */}
          <div className="relative bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 border-2 border-amber-900/40 rounded-xl shadow-2xl overflow-hidden">
            {/* Decorative top border */}
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            <div className="p-6 sm:p-8">
              <h2
                className="text-2xl sm:text-3xl font-serif font-bold mb-6 text-amber-50 tracking-wider text-center"
                style={{ textShadow: "0 0 20px rgba(212, 175, 55, 0.5)" }}
              >
                Chroniques d&apos;Expédition
              </h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8" />

              {profile.expeditions.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600/30 via-amber-700/30 to-amber-800/30 rounded-full mb-6"
                    style={{
                      boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)",
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-amber-300/70"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <p className="text-amber-200/70 font-serif text-lg tracking-wide">
                    Aucune expédition accomplie pour le moment.
                  </p>
                  <p className="text-amber-300/60 font-serif text-sm tracking-wider mt-2">
                    L&apos;aventure vous attend...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {profile.expeditions.map((expedition, index) => (
                    <div
                      key={expedition.id}
                      className="relative bg-gradient-to-br from-gray-800/80 via-gray-700/80 to-gray-800/80 border border-amber-800/30 rounded-xl p-6 hover:bg-gradient-to-br hover:from-gray-700/90 hover:via-gray-600/90 hover:to-gray-700/90 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl group"
                      style={{
                        boxShadow:
                          "0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {/* Expedition number badge */}
                      <div
                        className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-amber-50 font-serif font-bold text-sm"
                        style={{
                          boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)",
                        }}
                      >
                        {index + 1}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <h3
                            className="text-xl sm:text-2xl font-serif font-bold text-amber-300 mb-2 tracking-wide group-hover:text-amber-200 transition-colors duration-300"
                            style={{
                              textShadow: "0 0 15px rgba(212, 175, 55, 0.4)",
                            }}
                          >
                            {expedition.name}
                          </h3>
                          <p className="text-amber-200/70 font-serif text-sm sm:text-base tracking-wide">
                            Rejoint le {formatDate(expedition.createdAt)}
                          </p>
                        </div>
                        <div className="text-center sm:text-right">
                          <div className="text-amber-200/80 font-serif text-xs sm:text-sm tracking-widest uppercase mb-1">
                            Expéditionnaires
                          </div>
                          <div
                            className="text-2xl sm:text-3xl font-serif font-bold text-amber-400"
                            style={{
                              textShadow: "0 0 15px rgba(212, 175, 55, 0.5)",
                            }}
                          >
                            {expedition._count.expeditioners}
                          </div>
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute bottom-2 right-2 w-6 h-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                        <svg
                          className="w-full h-full text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Decorative bottom border */}
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            {/* Decorative corners */}
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-amber-500/50 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-amber-500/50 rounded-br-lg" />
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-amber-500/50 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-amber-500/50 rounded-tr-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
