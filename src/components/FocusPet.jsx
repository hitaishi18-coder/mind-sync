import React from "react";
import { motion } from "framer-motion";

export function FocusPet({ score }) {
  // Determine pet state based on score
  let petState = "🌱"; // Seedling (Low focus)
  let mood = "sleeping";
  
  if (score > 30) { petState = "🌿"; mood = "waking"; }
  if (score > 60) { petState = "🌳"; mood = "happy"; }
  if (score > 85) { petState = "🍎"; mood = "super"; }
  if (score < 20) { petState = "🥀"; mood = "dying"; }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-green-50/50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 transition-all">
      <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Focus Companion</div>
      <motion.div 
        key={petState}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="text-6xl filter drop-shadow-md cursor-pointer hover:scale-110 transition-transform"
      >
        {petState}
      </motion.div>
      <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-mono">
        {score > 80 ? "Thriving!" : score > 40 ? "Growing..." : "Needs focus!"}
      </p>
    </div>
  );
}