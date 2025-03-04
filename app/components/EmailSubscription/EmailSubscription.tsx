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
    className="absolute w-24 h-24 rounded-full bg-gradient-to-r  blur-xl"
  />
);

const EmailSubscription = ({ isOpen, onClose }: EmailSubscriptionProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission logic here
    onClose();
  };

  return (
    <motion.div
      initial={{ scale: 0.8, y: 50 }}
      animate={{
        scale: isOpen ? 1 : 0.8,
        y: isOpen ? 0 : 50,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`absolute inset-0 flex items-center justify-center ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <motion.div
        className="relative backdrop-blur-md border border-white/30 p-12 rounded-2xl w-[450px] overflow-hidden"
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
            className="text-white text-2xl font-bold mb-6 text-center"
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
                placeholder="Entre ton e-mail"
                className="w-full p-4 bg-white/5 border-2 border-white/30 rounded-xl 
                         text-white placeholder-white/50 focus:outline-none focus:border-white/60
                         transition-all duration-300 backdrop-blur-sm"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-white/20 to-white/10 border-2 
                       border-white/30 text-white py-4 rounded-xl hover:from-white/30 
                       hover:to-white/20 transition-all duration-300 font-medium tracking-wide"
            >
              {"Rejoindre"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailSubscription;
