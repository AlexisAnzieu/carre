"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function JoinPage({
  params,
}: {
  params: Promise<{ expeditionId: string }>;
}) {
  const router = useRouter();
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [autoJoined, setAutoJoined] = useState(false);

  // Rediriger vers la page de profil quand l'utilisateur a rejoint ou déjà rejoint
  useEffect(() => {
    if (success || alreadyJoined) {
      const timer = setTimeout(
        () => {
          router.push("/clairiere-obscure/profile");
        },
        success ? 2000 : autoJoined ? 1500 : 500
      ); // Different timing based on action

      return () => clearTimeout(timer);
    }
  }, [success, alreadyJoined, autoJoined, router]);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await fetch("/clairiere-obscure/api/user");
        if (response.ok) {
          const userData = await response.json();

          // Check if user is already in this expedition
          const { expeditionId } = await params;
          const isInExpedition = userData.expeditions.some(
            (exp: UserExpedition) => exp.id === expeditionId
          );

          if (isInExpedition) {
            setAlreadyJoined(true);
          } else {
            // User is authenticated but not in this expedition
            // Automatically connect them to this expedition
            try {
              // Format birthday as YYYY-MM-DD string for API
              const birthdayDate = new Date(userData.birthday);
              const formattedBirthday = birthdayDate
                .toISOString()
                .split("T")[0];

              const joinResponse = await fetch(
                `/clairiere-obscure/api/expeditions/${expeditionId}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: userData.name,
                    birthday: formattedBirthday,
                  }),
                }
              );

              if (joinResponse.ok) {
                setAutoJoined(true);
                setAlreadyJoined(true);
              } else {
                console.log("Failed to auto-join expedition");
              }
            } catch (autoJoinError) {
              console.log("Error auto-joining expedition:", autoJoinError);
            }
          }
        }
      } catch {
        console.log("Aucune session utilisateur trouvée");
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
          throw new Error(
            data.error || "Échec de la récupération de l'expédition"
          );
        }

        setExpedition(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur s'est produite"
        );
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
      setError("Veuillez remplir tous les champs");
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
        throw new Error(data.error || "Échec de rejoindre l'expédition");
      }

      // L'utilisateur est maintenant connecté via cookie défini par l'API
      // Actualiser le profil utilisateur pour montrer qu'il a rejoint
      const userResponse = await fetch("/clairiere-obscure/api/user");
      if (userResponse.ok) {
        setAlreadyJoined(true);
      }

      setSuccess(true);
      setName("");
      setBirthday("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur s'est produite"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(39deg, #2a2028 0%, #3a2f3a 25%, #4a3849 50%, #3a2f3a 75%, #2a2028 80%)",
      }}
    >
      {/* Éléments atmosphériques de fond inspirés de Clair Obscur */}
      <div className="absolute inset-0">
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
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="relative w-full max-w-sm sm:max-w-md">
          {/* Conteneur de contenu principal */}
          <div className="relative bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 border-2 border-amber-900/40 rounded-xl shadow-2xl overflow-hidden">
            {/* Bordure décorative supérieure */}
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            <div className="p-4 sm:p-6 md:p-8 pt-6 sm:pt-8">
              {loading ? (
                <div className="text-center py-6">
                  <div
                    className="inline-block w-8 h-8 sm:w-10 sm:h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"
                    style={{ boxShadow: "0 0 15px rgba(212, 175, 55, 0.3)" }}
                  />
                  <p className="text-amber-100 font-serif text-sm sm:text-base tracking-wide">
                    Chargement de l&apos;expédition...
                  </p>
                  <div className="mt-2 w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <div className="bg-red-900/40 border-2 border-red-700/60 rounded-xl p-4 mb-4 backdrop-blur-sm">
                    <div className="text-red-300 font-serif text-xs sm:text-sm tracking-wide">
                      {error}
                    </div>
                  </div>
                </div>
              ) : expedition ? (
                <>
                  {/* En-tête avec style orné Belle Époque */}
                  <div className="text-center mb-8 sm:mb-10">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 rounded-full mb-4 sm:mb-6 shadow-xl relative"
                      style={{
                        boxShadow:
                          "0 0 30px rgba(212, 175, 55, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <svg
                        className="w-8 h-8 sm:w-10 sm:h-10 text-amber-50"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" />
                      </svg>
                      {/* Effet de brillance */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                    </div>
                    <h1
                      className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 text-amber-50 tracking-wider px-2"
                      style={{ textShadow: "0 0 20px rgba(212, 175, 55, 0.5)" }}
                    >
                      {expedition.name}
                    </h1>
                    <div className="w-32 sm:w-40 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-3" />
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                      <div className="w-1 h-1 bg-amber-500 rounded-full" />
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    </div>
                    <p className="text-amber-200/90 font-serif text-sm sm:text-base tracking-widest">
                      {expedition._count.expeditioners} Explorateur
                      {expedition._count.expeditioners !== 1 ? "s" : ""} Inscrit
                      {expedition._count.expeditioners !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {alreadyJoined || success ? (
                    <div className="text-center py-6">
                      <div
                        className="inline-block w-8 h-8 sm:w-10 sm:h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"
                        style={{
                          boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)",
                        }}
                      />
                      <p className="text-amber-100 font-serif text-sm sm:text-base tracking-wide">
                        {autoJoined
                          ? "Vous avez rejoint l'expédition ! Redirection..."
                          : "Redirection vers votre profil..."}
                      </p>
                      <div className="mt-3 w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6 sm:space-y-8"
                    >
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm sm:text-base font-serif font-medium text-amber-200 mb-3 tracking-widest uppercase"
                          style={{
                            textShadow: "0 0 10px rgba(212, 175, 55, 0.3)",
                          }}
                        >
                          Nom de l&apos;Expéditionnaire
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-800/60 border-2 border-amber-900/40 rounded-xl text-amber-50 placeholder-amber-300/60 font-serif focus:outline-none focus:border-amber-500/70 focus:bg-gray-800/80 transition-all duration-500 backdrop-blur-md text-sm sm:text-base"
                            style={{
                              boxShadow:
                                "inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(212, 175, 55, 0.1)",
                            }}
                            placeholder="Inscrivez votre nom dans les chroniques..."
                            required
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />
                          {/* Effet de brillance au focus */}
                          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="w-1/3 min-w-[90px] max-w-[140px]">
                          <label
                            htmlFor="birthday"
                            className="block text-sm sm:text-base font-serif font-medium text-amber-200 mb-3 tracking-widest uppercase text-center"
                            style={{
                              textShadow: "0 0 10px rgba(212, 175, 55, 0.3)",
                            }}
                          >
                            Date de Naissance
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              id="birthday"
                              value={birthday}
                              onChange={(e) => setBirthday(e.target.value)}
                              className="w-full px-2 py-1 sm:px-2 sm:py-1 bg-gray-800/60 border-2 border-amber-900/40 rounded-xl text-amber-50 font-serif focus:outline-none focus:border-amber-500/70 focus:bg-gray-800/80 transition-all duration-500 backdrop-blur-md text-sm sm:text-base mx-auto"
                              style={{
                                boxShadow:
                                  "inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(212, 175, 55, 0.1)",
                              }}
                              required
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 disabled:from-gray-700 disabled:via-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-serif font-bold py-4 px-6 sm:py-5 sm:px-8 rounded-xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl group text-sm sm:text-base border-2 border-amber-500/30"
                        style={{
                          boxShadow:
                            "0 0 30px rgba(212, 175, 55, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
                          textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="relative tracking-widest uppercase">
                          {submitting
                            ? "Inscription en cours..."
                            : "Rejoindre l'Expédition"}
                        </span>
                        {/* Effet de brillance permanente */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
                      </button>
                    </form>
                  )}
                </>
              ) : null}
            </div>

            {/* Bordure décorative inférieure */}
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            {/* Coins décoratifs Belle Époque */}
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
