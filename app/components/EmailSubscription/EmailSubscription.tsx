import { motion } from "framer-motion";
import { useState } from "react";

interface EmailSubscriptionProps {
  isOpen: boolean;
  onClose: () => void;
}

const FloatingCircle = ({ delay = 0 }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r  blur-xl"
  />
);

const EmailSubscription = ({ isOpen, onClose }: EmailSubscriptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to subscribe"
      );
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, y: 50 }}
      animate={{
        scale: isOpen ? 1 : 0.8,
        y: isOpen ? 0 : 50,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`absolute inset-0 flex items-center justify-center px-2 sm:px-4 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <motion.div
        className="relative backdrop-blur-md border border-white/30 p-4 sm:p-6 md:p-12 rounded-2xl w-full max-w-[90vw] sm:max-w-[500px] overflow-hidden"
        animate={{
          backgroundColor: isHovered
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.05)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Floating background elements */}
        <FloatingCircle delay={0} />
        <FloatingCircle delay={1} />
        <FloatingCircle delay={2} />

        <div className="relative z-10">
          <motion.h2
            className="text-white text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {"Rejoins l'expérience"}
          </motion.h2>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 space-y-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entre ton e-mail"
                className="w-full p-3 md:p-4 bg-white/5 border-2 border-white/30 rounded-xl 
                         text-white placeholder-white/50 focus:outline-none focus:border-white/60
                         transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
                required
                disabled={status === "submitting"}
              />
            </motion.div>

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {errorMessage}
              </motion.p>
            )}

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 text-sm text-center"
              >
                Merci de ton inscription !
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={status === "submitting"}
              className="w-full bg-gradient-to-r from-white/20 to-white/10 border-2 
                       border-white/30 text-white py-3 md:py-4 rounded-xl hover:from-white/30 
                       hover:to-white/20 transition-all duration-300 font-medium tracking-wide
                       disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {status === "submitting" ? "En cours..." : "Rejoindre"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailSubscription;
