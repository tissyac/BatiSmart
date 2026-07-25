import React from "react";
import { ArrowRight, Sparkles, Shield, Clock, FileText, Bot, Sun, Moon, CheckCircle, TrendingUp, AlertTriangle, Eye } from "lucide-react";
import { UserProfile } from "../types";

interface WelcomeScreenProps {
  onStartInspection: () => void;
  onNavigateToTab: (tab: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  user: UserProfile;
}

export default function WelcomeScreen({ onStartInspection, onNavigateToTab, theme, setTheme, user }: WelcomeScreenProps) {
  const isDark = theme === "dark";

  return (
    <div className={`h-screen w-full overflow-y-auto font-sans transition-colors duration-300 ${
      isDark ? "bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* 1. TOP HEADER NAVIGATION */}
      <header className={`px-8 py-5 border-b flex items-center justify-between sticky top-0 z-30 backdrop-blur-md transition-colors duration-300 ${
        isDark ? "border-slate-900 bg-[#030712]/80" : "border-slate-200/80 bg-white/80"
      }`}>
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/10">
            B
          </div>
          <span className={`text-lg font-extrabold tracking-tight font-display ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            BatiSmart <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent font-black">Roof IA</span>
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => {
              const el = document.getElementById("features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={`text-xs font-semibold tracking-wide uppercase hover:text-sky-500 transition duration-200 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Fonctionnalités
          </button>
          <button 
            onClick={() => onNavigateToTab("how_it_works")}
            className={`text-xs font-semibold tracking-wide uppercase hover:text-sky-500 transition duration-200 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Comment ça marche
          </button>
          <button 
            onClick={() => onNavigateToTab("map")}
            className={`text-xs font-semibold tracking-wide uppercase hover:text-sky-500 transition duration-200 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Outils SIG
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Dark / Light Toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-2 rounded-xl border transition-all duration-300 ${
              isDark 
                ? "bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300" 
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-sky-600 shadow-sm"
            }`}
            title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
          >
            {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Quick Action Button */}
          <button
            onClick={onStartInspection}
            className="px-4 py-2 bg-[#0ea5e9] hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all duration-300"
          >
            Commencer
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (Content & Copy) */}
        <div className="lg:col-span-7 space-y-8">
          
           {/* Accent Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Bilan d'étanchéité IA algérien
            </div>

            {user && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Session : {user.displayName} ({user.role})
              </div>
            )}
          </div>

          {/* 3D Model Viewer Card (Promoted & Enlarged above main title) */}
          <div className={`w-full max-w-xl lg:max-w-full rounded-2xl p-2.5 border shadow-2xl relative z-10 transition-colors duration-300 ${
            isDark 
              ? "bg-[#0b1129] border-slate-800" 
              : "bg-white border-slate-200/80"
          }`}>
            <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 relative group/model aspect-[16/10] sm:aspect-[16/9]">
              <img 
                src="/src/assets/images/roof_rehabilitation_comparison_1784574516217.jpg" 
                alt="Maquette 3D de réhabilitation" 
                className="w-full h-full object-cover filter brightness-[0.80] contrast-[1.10] group-hover/model:scale-105 transition-transform duration-700"
              />
              {/* Tech Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
              
              {/* Laser scanning beam effect */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-sky-400/80 shadow-[0_0_8px_rgba(56,189,248,0.8)] pointer-events-none animate-scanX" />

              {/* Glowing Tech Corner Brackets */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-sky-400/70" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-sky-400/70" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-sky-400/70" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-sky-400/70" />

              {/* 3D Holographic Indicator Badges */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[9px] font-mono tracking-widest text-sky-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Modèle 3D Actif</span>
              </div>
              
              <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[8px] font-mono text-slate-300 uppercase">
                <span>Bâtiment Public</span>
              </div>
            </div>
          </div>

          {/* Main Display Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            Votre étanchéité, <br />
            <span className="font-serif italic text-teal-600 dark:text-teal-400 font-normal">
              enfin maîtrisée.
            </span>
          </h1>

          {/* Descriptive Copy */}
          <p className={`text-base md:text-lg font-light leading-relaxed max-w-xl ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            Un pré-diagnostic d'étanchéité guidé par l'intelligence artificielle pour vos terrasses et bâtiments publics. Analyse d'images en 5 minutes, sans aucun jargon technique.
          </p>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onStartInspection}
              className="px-6 py-3.5 bg-[#0ea5e9] hover:bg-sky-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition duration-300 flex items-center justify-center gap-2"
            >
              Faire mon bilan gratuit
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("features");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-5 py-3.5 border font-semibold text-sm rounded-xl transition duration-300 flex items-center justify-center gap-1.5 ${
                isDark 
                  ? "border-slate-800 hover:bg-slate-900 text-slate-300" 
                  : "border-slate-200 hover:bg-slate-100 text-slate-600 bg-white shadow-sm"
              }`}
            >
              En savoir plus
              <span className="text-xs">▼</span>
            </button>
          </div>

          {/* Core Stats Bar */}
          <div className={`pt-8 border-t grid grid-cols-3 gap-6 md:gap-12 ${
            isDark ? "border-slate-900" : "border-slate-200"
          }`}>
            <div>
              <span className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white block">
                640+
              </span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-1 block">
                Bilans réalisés
              </span>
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-extrabold font-display text-teal-600 dark:text-teal-400 block">
                87%+
              </span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-1 block">
                Précision IA
              </span>
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white block">
                5 min
              </span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-1 block">
                Rapport généré
              </span>
            </div>
          </div>

        </div>

        {/* Right Column (Interactive mockup & 3D Model Viewer) */}
        <div className="lg:col-span-5 relative flex flex-col gap-8 items-center justify-center">
          
          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Report Card Mockup Frame */}
          <div className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl relative z-10 transition-colors duration-300 ${
            isDark 
              ? "bg-[#0b1129] border-slate-800 text-slate-200" 
              : "bg-white border-slate-200/80 text-slate-800"
          }`}>
            
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-100 dark:bg-teal-500/10 text-teal-600 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white">Mon pré-diagnostic</h4>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block">généré par IA • 2 min</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400 rounded-full text-[9px] font-bold">
                BatiSmart Roof IA
              </span>
            </div>

            {/* Score Radial Circle Section */}
            <div className="flex items-center gap-6 mb-6">
              
              {/* Visual circle score indicator */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className="stroke-teal-500"
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray="213"
                    strokeDashoffset="60" // 72% filled
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black font-display text-slate-900 dark:text-white leading-none">
                    72
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 font-light">/100</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">État Global</span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Alerte Modérée</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-1">
                  Infiltrations locales constatées au niveau des relevés d'angles d'acrotères.
                </p>
              </div>

            </div>

            {/* Simulated bar sliders */}
            <div className="space-y-3 border-t pt-4 border-slate-100 dark:border-slate-900">
              
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Absence de Fissures</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Bien</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "80%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Contrôle de l'Humidité</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">Moyen</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "55%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Étanchéité Générale</span>
                  <span className="font-mono text-red-600 dark:text-red-400 font-bold">Critique</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: "35%" }} />
                </div>
              </div>

            </div>

            {/* Chatbot Popover overlay card */}
            <div className="absolute -bottom-6 -left-10 w-52 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg flex items-start gap-2 animate-bounce">
              <div className="p-1.5 bg-sky-100 dark:bg-sky-500/10 text-sky-600 rounded-lg shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[8px] font-bold text-sky-500 tracking-wider uppercase block">Conseil IA</span>
                <p className="text-[9px] text-slate-600 dark:text-slate-300 leading-normal mt-0.5">
                  Avez-vous pensé à planifier un survol thermique par drone infrarouge ?
                </p>
              </div>
            </div>

            {/* Float Stat Badge overlay card */}
            <div className="absolute -top-5 -right-6 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-lg shadow-md flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block leading-none">+12%</span>
                <span className="text-[7px] text-slate-400 uppercase tracking-widest block mt-0.5">Résilience</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* 3. FEATURES GRID (Tout ce qu'il faut, rien de superflu) */}
      <section id="features" className={`py-16 border-t transition-colors duration-300 ${
        isDark ? "border-slate-900 bg-slate-950/20" : "border-slate-200/80 bg-slate-50/50"
      }`}>
        <div className="max-w-7xl mx-auto px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 tracking-widest uppercase block">
              FONCTIONNALITÉS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
              Tout ce qu'il faut, rien de superflu.
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Feature 01 */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between relative group overflow-hidden shadow-sm transition-all duration-300 ${
              isDark ? "bg-[#0b1129] border-slate-800 hover:border-sky-500/40" : "bg-white border-slate-200/80 hover:border-sky-500/40"
            }`}>
              {/* Number overlay */}
              <span className="absolute top-4 right-6 text-4xl font-black font-display opacity-10 text-teal-500 select-none">
                01
              </span>
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                  Pré-diagnostic en 5 minutes
                </h3>
                <p className={`text-xs md:text-sm font-light leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  Un parcours fluide, question par question. Prenez en photo l'acrotère ou le revêtement et laissez l'IA générer des analyses d'étanchéité adaptées en temps réel.
                </p>
              </div>
            </div>

            {/* Feature 02 */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between relative group overflow-hidden shadow-sm transition-all duration-300 ${
              isDark ? "bg-[#0b1129] border-slate-800 hover:border-sky-500/40" : "bg-white border-slate-200/80 hover:border-sky-500/40"
            }`}>
              {/* Number overlay */}
              <span className="absolute top-4 right-6 text-4xl font-black font-display opacity-10 text-teal-500 select-none">
                02
              </span>
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/10 text-sky-600 flex items-center justify-center mb-6">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                  Analyse IA Personnalisée
                </h3>
                <p className={`text-xs md:text-sm font-light leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  Notre modèle d'intelligence artificielle de pointe identifie instantanément les fissures structurelles, l'humidité résiduelle, et calcule un score de risque précis de 0 à 10.
                </p>
              </div>
            </div>

            {/* Feature 03 */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between relative group overflow-hidden shadow-sm transition-all duration-300 ${
              isDark ? "bg-[#0b1129] border-slate-800 hover:border-sky-500/40" : "bg-white border-slate-200/80 hover:border-sky-500/40"
            }`}>
              {/* Number overlay */}
              <span className="absolute top-4 right-6 text-4xl font-black font-display opacity-10 text-teal-500 select-none">
                03
              </span>
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                  Zéro Données Sensibles
                </h3>
                <p className={`text-xs md:text-sm font-light leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  Aucune information confidentielle n'est partagée publiquement. Vous gardez le contrôle total sur vos coordonnées d'infrastructure et l'historique d'inspection.
                </p>
              </div>
            </div>

            {/* Feature 04 */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between relative group overflow-hidden shadow-sm transition-all duration-300 ${
              isDark ? "bg-[#0b1129] border-slate-800 hover:border-sky-500/40" : "bg-white border-slate-200/80 hover:border-sky-500/40"
            }`}>
              {/* Number overlay */}
              <span className="absolute top-4 right-6 text-4xl font-black font-display opacity-10 text-teal-500 select-none">
                04
              </span>
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/10 text-sky-600 flex items-center justify-center mb-6">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                  Export PDF & SIG
                </h3>
                <p className={`text-xs md:text-sm font-light leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  Générez des rapports d'inspection clairs et officiels en format PDF d'un simple clic pour appuyer vos plans de rénovation de toiture auprès de votre administration.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className={`py-12 border-t text-center text-xs transition-colors duration-300 ${
        isDark ? "border-slate-900 bg-slate-950 text-slate-500" : "border-slate-200 bg-white text-slate-400 shadow-inner"
      }`}>
        <p>© 2026 BatiSmart Roof IA. Labellisé Startup par le Ministère de l'Économie de la Connaissance et des Startups.</p>
        <p className="mt-2 font-light">Développé en partenariat scientifique avec l'Université de Béjaïa.</p>
      </footer>

    </div>
  );
}
