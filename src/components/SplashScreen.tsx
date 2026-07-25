import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Activity, ShieldCheck, ArrowRight, Sun, Layers } from "lucide-react";

const imgBackground = "/src/assets/images/roof_rehabilitation_comparison_1784574516217.jpg";

interface SplashScreenProps {
  onDismiss: () => void;
}

export default function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initialisation de l'environnement 3D...");

  // Simulate premium asset load
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  // Set progressive loading texts for premium feel
  useEffect(() => {
    if (loadingProgress < 25) {
      setLoadingText("Initialisation du modèle de rendu PBR...");
    } else if (loadingProgress < 50) {
      setLoadingText("Chargement des textures d'étanchéité 8K...");
    } else if (loadingProgress < 75) {
      setLoadingText("Génération de l'éclairage global (V-Ray)...");
    } else if (loadingProgress < 95) {
      setLoadingText("Simulation de l'algorithme de réhabilitation...");
    } else {
      setLoadingText("Prêt pour l'exploration.");
    }
  }, [loadingProgress]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950 flex flex-col items-center justify-center font-sans">
      
      {/* 1. CINEMATIC 3D BACKGROUND LAYER WITH DRONE HOVER EFFECT */}
      <motion.div 
        className="absolute inset-0 w-full h-full select-none pointer-events-none origin-center"
        initial={{ scale: 1.08, rotate: -0.2, x: -5, y: -5 }}
        animate={{
          scale: [1.08, 1.04, 1.08],
          rotate: [-0.2, 0.2, -0.2],
          x: [-5, 5, -5],
          y: [-5, 5, -5]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* The high-quality rendered image */}
        <img 
          src={imgBackground} 
          alt="Cinematic Flat Roof Rehabilitation 3D" 
          className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* 2. DYNAMIC SHIFTING NATURAL SUNLIGHT OVERLAY (Golden Hour / sunset shift) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-color-burn"
        animate={{
          background: [
            "radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.15) 0%, rgba(3, 7, 18, 0) 70%)",
            "radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.25) 0%, rgba(3, 7, 18, 0) 70%)",
            "radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.15) 0%, rgba(3, 7, 18, 0) 70%)"
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 3. SLOW CLOUD SHADOWS PASSING */}
      <motion.div 
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none"
        animate={{
          x: ["-20%", "20%"],
          y: ["-10%", "10%"]
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute top-[20%] left-[30%] w-96 h-64 bg-black/15 blur-[120px] rounded-full transform rotate-12" />
        <div className="absolute top-[50%] left-[60%] w-110 h-80 bg-black/12 blur-[140px] rounded-full transform -rotate-45" />
      </motion.div>

      {/* 4. SEAMLESS VERTICAL AI SCANNING LASER EFFECT */}
      <motion.div 
        className="absolute top-0 bottom-0 w-1 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(14, 165, 233, 1), rgba(20, 184, 166, 1), transparent)",
          boxShadow: "0 0 15px rgba(14, 165, 233, 0.8), 0 0 30px rgba(20, 184, 166, 0.5)",
          left: "50%"
        }}
        animate={{
          opacity: [0.7, 1, 0.7],
          scaleY: [0.95, 1.05, 0.95]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 5. GENTLE WIND PARTICLES (Subtle falling dust/leaves) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full blur-xs"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
            animate={{
              x: [0, 150, 300],
              y: [0, -40, -80],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* 6. COGNITIVE HUD OVERLAY IN THE CENTER */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-lg w-full">
        
        {/* Holographic Radar Target around the center logo */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-10 select-none">
          
          {/* Inner pulsating target ring */}
          <motion.div 
            className="absolute w-28 h-28 border border-sky-500/20 rounded-full"
            animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Outer compass ticking ring */}
          <motion.div 
            className="absolute w-40 h-40 border-2 border-dashed border-teal-500/15 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />

          {/* Glowing telemetry corner brackets */}
          <div className="absolute w-44 h-44 border-t border-l border-sky-400/30 top-0 left-0 rounded-tl-2xl" />
          <div className="absolute w-44 h-44 border-t border-r border-sky-400/30 top-0 right-0 rounded-tr-2xl" />
          <div className="absolute w-44 h-44 border-b border-l border-sky-400/30 bottom-0 left-0 rounded-bl-2xl" />
          <div className="absolute w-44 h-44 border-b border-r border-sky-400/30 bottom-0 right-0 rounded-br-2xl" />

          {/* Central Glassmorphic Logo Shield */}
          <motion.div 
            className="w-24 h-24 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-500/10 to-teal-500/10 opacity-60" />
            
            {/* Animated Logo core icon */}
            <motion.div
              animate={{ 
                y: [0, -4, 0],
                filter: ["drop-shadow(0 0 4px rgba(56,189,248,0.2))", "drop-shadow(0 0 12px rgba(56,189,248,0.6))", "drop-shadow(0 0 4px rgba(56,189,248,0.2))"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-sky-400 flex flex-col items-center justify-center gap-1"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-sky-500/30">
                B
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Brand Typography Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-3"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-white uppercase font-display">
            BatiSmart <span className="bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent font-black">Roof IA</span>
          </h1>
        </motion.div>

        {/* Loading progress / Action bar */}
        <div className="mt-12 w-full max-w-xs space-y-4">
          <AnimatePresence mode="wait">
            {loadingProgress < 100 ? (
              <motion.div 
                key="loading-bar"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2.5"
              >
                {/* Micro Progress Bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-sky-500 to-teal-400"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                  {loadingText} ({loadingProgress}%)
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="action-btn"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Premium CTA to dismiss Splash and launch Application */}
                <button
                  onClick={onDismiss}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-sky-500/20 transition-all duration-300 hover:shadow-sky-500/30 flex items-center justify-center gap-2 group cursor-pointer hover:-translate-y-0.5"
                >
                  <span>Entrer dans l'expérience</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                <p className="text-[9px] font-mono text-slate-400 tracking-wider uppercase mt-3">
                  © 2026 Ministère de l'Économie de la Connaissance et des Startups
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 7. REVOLUTION BRANDING ACCENT (Bottom footer watermark) */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[9px] font-mono tracking-widest text-slate-500 uppercase pointer-events-none select-none z-20">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-teal-500" />
          <span>8K Render: V-Ray Global Illumination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
          <span>Transformation AI-Powered</span>
        </div>
      </div>

    </div>
  );
}
