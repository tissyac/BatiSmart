import React from "react";
import { ArrowRight, Sparkles, Shield, Clock, FileText, Bot, Sun, Moon, CheckCircle, TrendingUp, AlertTriangle, Eye, Droplet, Home, Zap, Waves, Building, Brain, Gauge, MapPin, Search, ShieldCheck, Database, PieChart, Cloud } from "lucide-react";
import { UserProfile } from "../types";
import welcomeBgImage from "../assets/images/roof_rehabilitation_comparison_1784574516217.jpg";
import infiltrationImg from "../assets/images/problem-infiltration.png";
import toitureDegradeeImg from "../assets/images/problem-toiture-degradee.png";
import fissureImg from "../assets/images/problem-fissure.png";
import humiditeImg from "../assets/images/problem-humidite.png";

interface WelcomeScreenProps {
  onStartInspection: () => void;
  onNavigateToTab: (tab: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  user: UserProfile;
}

export default function WelcomeScreen({ onStartInspection, onNavigateToTab, theme, setTheme, user }: WelcomeScreenProps) {
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = React.useState<"home" | "problem" | "solution" | "features" | "benefits">("home");

  React.useEffect(() => {
    if (activeSection === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const section = document.getElementById(activeSection);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [activeSection]);

  return (
    <div className={`h-screen w-full overflow-y-auto scrollbar-thin font-sans transition-colors duration-300 ${
      isDark ? "bg-[#030712] text-slate-100 bento-bg-dark" : "bg-slate-50 text-slate-800 bento-bg"
    }`}>
      
      {/* 1. TOP HEADER NAVIGATION */}
      <header className={`px-8 py-4 border-b sticky top-0 z-30 backdrop-blur-md transition-colors duration-300 ${
        isDark ? "border-slate-900 bg-[#030712]/90" : "border-slate-200/80 bg-white/90"
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-3xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
              B
            </div>
            <div>
              <div className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                BatiSmart Roof IA
              </div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Diagnostic dédié
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartInspection}
              className="px-5 py-2 rounded-full bg-sky-600 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 hover:bg-sky-500 transition duration-300"
            >
              Commencer
            </button>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-2xl border transition-all duration-300 ${
                isDark ? "bg-slate-900 border-slate-800 text-amber-400" : "bg-white border-slate-200 text-slate-600"
              }`}
              title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        <nav className="mx-auto flex flex-wrap items-center justify-center gap-3 pt-4 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setActiveSection("problem")}
            className={
              `px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                activeSection === "problem"
                  ? "bg-sky-500 text-white hover:bg-sky-500 dark:bg-sky-500 dark:text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`
            }
          >
            Le problème
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("solution")}
            className={
              `px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                activeSection === "solution"
                  ? "bg-sky-500 text-white hover:bg-sky-500 dark:bg-sky-500 dark:text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`
            }
          >
            La solution
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("features")}
            className={
              `px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                activeSection === "features"
                  ? "bg-sky-500 text-white hover:bg-sky-500 dark:bg-sky-500 dark:text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`
            }
          >
            Fonctionnalité
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("benefits")}
            className={
              `px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                activeSection === "benefits"
                  ? "bg-sky-500 text-white hover:bg-sky-500 dark:bg-sky-500 dark:text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`
            }
          >
            Bénéfices
          </button>
        </nav>
      </header>

      {activeSection === "home" && (
      <>
      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-sky-500/15 to-transparent" />
        <div className="pointer-events-none absolute -left-16 top-16 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

        {/* Left Column (Content & Copy) */}
        <div className="lg:col-span-7 space-y-8 wow-fade-up">
          
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
          <div className="card-3d">
            <div className={`w-full max-w-xl lg:max-w-full rounded-3xl bento-card bento-card-accent card-3d-inner relative z-10 transition-colors duration-300 ${
              isDark 
                ? "bg-[#0b1129] border-slate-800" 
                : "bg-white border-slate-200/80"
            }`}>
              <div className="w-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 relative group/model aspect-[16/10] sm:aspect-[16/9] shadow-2xl shadow-sky-500/10">
                <img 
                  src={welcomeBgImage} 
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
        </div>

          {/* Main Display Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.05] text-slate-900 dark:text-white wow-fade-up">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 wow-fade-up">
            <button
              onClick={onStartInspection}
              className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold text-sm rounded-2xl shadow-2xl shadow-sky-500/20 hover:-translate-y-0.5 transition duration-300 flex items-center justify-center gap-2"
            >
              Faire mon bilan gratuit
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSection("features")}
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
          } wow-fade-up`}>
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
                    strokeDashoffset="60"
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
      </>
      )}

      {activeSection === "problem" && (
      <section id="problem" className={`relative overflow-hidden py-16 transition-colors duration-300 section-3d ${
        isDark ? "bg-slate-950 text-slate-200" : "bg-white text-slate-800"
      }`}>
        <div className="absolute inset-x-0 top-6 h-52 opacity-50 blur-3xl section-3d-glow" />
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 tracking-widest uppercase block">
              PROBLÈME
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight title-3d">
              Pourquoi BatiSmart Roof IA ?
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400">
              Aujourd'hui, de nombreux bâtiments publics algériens présentent des infiltrations, des problèmes d'humidité et des dégradations d'étanchéité souvent détectés trop tard. Les inspections traditionnelles sont longues, coûteuses et nécessitent des interventions sur site parfois dangereuses. Cette situation entraîne des dépenses importantes de maintenance corrective et une dégradation progressive du patrimoine bâti.
            </p>
          </div>

          <div className="problem-platform mx-auto mb-12">
            <div className="problem-platform-grid" />
            <div className="relative z-10 px-6 py-8 md:px-12 md:py-10">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-slate-900/10 dark:bg-slate-200/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-800 dark:text-slate-200 font-semibold">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500 animate-pulse" />
                Vision 3D du diagnostic
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
                Un plateau de données 3D pour vos pathologies de toiture.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                Un modèle visuel de votre bâtiment avec couches superposées d’images, d’analyses IA et de cartographie SIG, présenté comme une plateforme immersive et futuriste.
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-16 md:h-20">
              <div className="platform-halo" />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            <div className="card-3d">
              <div className="card-3d-inner rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={infiltrationImg} alt="Infiltration" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <div className="absolute left-5 bottom-5 rounded-3xl bg-sky-500/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-sky-500/20">
                    INFILTRATION
                  </div>
                </div>
                <div className="p-7 pt-5">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Les infiltrations d'eau sont la principale cause de détérioration des structures et des finitions intérieures.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-3d">
              <div className="card-3d-inner rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={toitureDegradeeImg} alt="Toiture dégradée" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <div className="absolute left-5 bottom-5 rounded-3xl bg-amber-500/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-amber-500/20">
                    TOITURE DÉGRADÉE
                  </div>
                </div>
                <div className="p-7 pt-5">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Les membranes d'étanchéité se détériorent avec le temps sous l'effet des intempéries et des UV.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-3d">
              <div className="card-3d-inner rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={fissureImg} alt="Fissure" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <div className="absolute left-5 bottom-5 rounded-3xl bg-fuchsia-500/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-fuchsia-500/20">
                    FISSURE
                  </div>
                </div>
                <div className="p-7 pt-5">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Les fissures fragilisent l'étanchéité et facilitent la pénétration de l'eau dans les éléments constructifs.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-3d">
              <div className="card-3d-inner rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={humiditeImg} alt="Humidité" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <div className="absolute left-5 bottom-5 rounded-3xl bg-emerald-500/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-emerald-500/20">
                    HUMIDITÉ
                  </div>
                </div>
                <div className="p-7 pt-5">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    L'humidité affecte la qualité d'air intérieur et peut provoquer des problèmes de santé pour les occupants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 4. SOLUTION SECTION */}
      {activeSection === "solution" && (
      <section id="solution" className={`relative overflow-hidden py-16 transition-colors duration-300 section-3d ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}>
        <div className="absolute inset-x-0 top-6 h-44 opacity-30 blur-3xl section-3d-glow" />
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 tracking-widest uppercase block">
              NOTRE SOLUTION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight title-3d">
              Une plateforme <span className="text-sky-600 dark:text-sky-300">intelligente</span> d'aide au prédiagnostic
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400">
              BatiSmart Roof IA combine l'Intelligence Artificielle, les Systèmes d'Information Géographique (SIG) et les technologies Smart City afin de réaliser un prédiagnostic automatisé à partir d'images, d'évaluer le niveau de risque, de cartographier les bâtiments et d'accompagner les décideurs dans la planification des opérations de maintenance.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-900 px-6 py-5 text-sm uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400 font-semibold">
                Pipeline de prédiagnostic
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-900">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">1. Photo / Image</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Acquisition d'images par drone, satellite ou smartphone.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-900">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-300">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">2. Analyse par IA</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Détection automatique des anomalies et des dégradations.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-900">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
                    <Gauge className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">3. Score de risque</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Évaluation du niveau de risque et priorisation des interventions.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-900">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">4. Cartographie SIG</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Géolocalisation et visualisation des bâtiments à risque.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-900">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">5. Rapport PDF</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Génération automatique d'un rapport détaillé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 5. FONCTIONNALITÉS — Remplacé par layout dashboard dark glass */}
      {activeSection === "features" && (
      <section id="features" className={`relative overflow-hidden py-16 border-t transition-colors duration-300 section-3d ${
        isDark ? "border-slate-900 bg-[#050812]" : "border-slate-200/80 bg-slate-50/50"
      }`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 order-1">
              <span className="text-xs font-extrabold text-sky-400 uppercase tracking-widest block mb-4">LES FONCTIONNALITÉS</span>
              <h2 className="text-3xl font-bold font-serif text-white mb-4">FONCTIONNALITÉS</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                BatiSmart Roof IA offre un ensemble complet de fonctionnalités intelligentes pour assurer un <span className="text-sky-400 font-semibold">prédiagnostic précis</span>, une meilleure <span className="text-sky-400 font-semibold">planification</span> et un <span className="text-sky-400 font-semibold">pilotage efficace</span> de la maintenance.
              </p>
              <div className="mt-6 rounded-3xl overflow-hidden glass-card p-4 flex items-center justify-center">
                <img src={welcomeBgImage} alt="Ville connectée" className="w-full h-40 object-cover rounded-xl opacity-90" />
              </div>
            </div>

            <div className="lg:col-span-8 order-2">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-4">
                  <div className="glass-card p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-white">DÉTECTION AUTOMATIQUE</h4>
                      <div className="text-sky-400"><Search className="w-5 h-5" /></div>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">Détection automatique des fissures, infiltrations, humidité, corrosion et défauts d'étanchéité.</p>
                    <div className="flex-1 rounded-lg overflow-hidden bg-slate-800/40 border border-slate-700">
                      <img src={infiltrationImg} alt="toiture" className="w-full h-40 object-cover" />
                    </div>
                    <div className="mt-3 text-[12px] text-slate-300">Légende: <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-2 mr-1"></span>FISSURE <span className="inline-block w-3 h-3 bg-amber-400 rounded-full ml-3 mr-1"></span>INFILTRATION <span className="inline-block w-3 h-3 bg-blue-400 rounded-full ml-3 mr-1"></span>HUMIDITÉ</div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <div className="glass-card p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-white">CARTOGRAPHIE SIG</h4>
                      <div className="text-sky-400"><MapPin className="w-5 h-5" /></div>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">Localisation des bâtiments sur les 69 wilayas.</p>
                    <div className="flex-1 rounded-lg overflow-hidden bg-slate-800/40 border border-slate-700 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-extrabold text-white">69</div>
                        <div className="text-xs text-slate-300">WILAYAS</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 md:row-span-2">
                  <div className="glass-card p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-white">TABLEAU DE BORD</h4>
                      <div className="text-sky-400"><Sparkles className="w-5 h-5" /></div>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">Suivi des indicateurs, alertes, évolution des pathologies, ROI et aide à la décision.</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-3 bg-slate-900/30 rounded-md">
                        <div className="text-xs text-slate-300">Bâtiments inspectés</div>
                        <div className="text-2xl font-bold text-white">1,248</div>
                      </div>
                      <div className="p-3 bg-slate-900/30 rounded-md">
                        <div className="text-xs text-slate-300">Alertes actives</div>
                        <div className="text-2xl font-bold text-red-400">18</div>
                      </div>
                    </div>
                    <div className="flex gap-3 mb-3">
                      <div className="flex-1 rounded-md bg-slate-900/20 p-3">
                        <svg className="w-full h-24" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <polyline fill="none" stroke="#06b6d4" strokeWidth="2" points="0,30 10,25 20,20 30,18 40,12 50,14 60,10 70,8 80,6 90,8 100,5" />
                        </svg>
                      </div>
                      <div className="w-28 rounded-md bg-slate-900/20 p-3 flex items-center justify-center">
                        <svg viewBox="0 0 36 36" className="w-16 h-16">
                          <circle cx="18" cy="18" r="15" fill="#0ea5e9" opacity="0.15" />
                          <text x="18" y="22" textAnchor="middle" className="text-white" fontSize="10">38%</text>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-auto grid grid-cols-3 gap-2 text-xs text-slate-300">
                      <div className="text-center">Coût évité<br/><span className="font-bold text-amber-400">-28%</span></div>
                      <div className="text-center">ROI<br/><span className="font-bold text-white">1.42 M DZD</span></div>
                      <div className="text-center">Interventions<br/><span className="font-bold text-sky-400">24</span></div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <div className="glass-card p-4 h-full flex flex-col items-start">
                    <div className="flex items-center justify-between w-full mb-3">
                      <h4 className="text-sm font-bold text-white">RAPPORT PDF</h4>
                      <div className="text-red-400"><FileText className="w-5 h-5" /></div>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">Rapport professionnel généré automatiquement.</p>
                    <div className="w-full rounded-lg bg-slate-800/30 border border-slate-700 p-4 flex items-center gap-4">
                      <div className="w-20 h-20 bg-red-600 rounded-md flex items-center justify-center text-white font-bold">PDF</div>
                      <div className="text-xs text-slate-300">Aperçu du rapport d'inspection avec graphiques et statistiques clés.</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <div className="glass-card p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-white">ASSISTANT IA</h4>
                      <div className="text-sky-400"><Bot className="w-5 h-5" /></div>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">Assistant conversationnel technique.</p>
                    <div className="flex-1 rounded-md bg-slate-900/20 p-3 overflow-auto">
                      <div className="text-xs text-slate-300 mb-2">Utilisateur: Quels sont les bâtiments avec un risque élevé d'infiltration ?</div>
                      <div className="text-xs text-white font-semibold">Assistant: Lycée Mohamed Boudiaf - Alger<br/>CEM Frères Mentouri - Oran<br/>Collège El Amen - Constantine</div>
                    </div>
                    <div className="mt-3 w-full flex gap-2">
                      <input className="flex-1 bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200" placeholder="Posez une question..." />
                      <button className="px-4 py-2 bg-sky-500 text-white rounded-md">Envoyer</button>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <div className="glass-card p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-white">HISTORIQUE</h4>
                      <div className="text-sky-400"><Clock className="w-5 h-5" /></div>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">Historique des inspections et interventions.</p>
                    <div className="overflow-auto text-xs">
                      <table className="w-full text-left table-auto">
                        <thead>
                          <tr className="text-slate-400">
                            <th className="py-2">DATE</th>
                            <th>BÂTIMENT</th>
                            <th>TYPE</th>
                            <th>RÉSULTAT</th>
                            <th>INTERVENTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-slate-800">
                            <td className="py-2">12/06/2024</td>
                            <td>Lycée Mohamed Boudiaf</td>
                            <td>Inspection complète</td>
                            <td className="text-red-400">Risque élevé</td>
                            <td className="text-sky-400">Planifiée</td>
                          </tr>
                          <tr className="border-t border-slate-800">
                            <td className="py-2">03/05/2024</td>
                            <td>CEM Frères Mentouri</td>
                            <td>Inspection rapide</td>
                            <td className="text-amber-400">Risque moyen</td>
                            <td className="text-sky-400">Réalisée</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 glass-card p-4 flex items-center gap-3 border-sky-400/20">
                <div className="p-2 bg-sky-500/20 rounded-md">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 4v6c0 5-3.6 9.7-7 11-3.4-1.3-7-6-7-11V6l7-4z"/><path d="M8 12l2 2 4-4"/></svg>
                </div>
                <div className="text-sm text-slate-300">Des <span className="text-sky-400 font-semibold">fonctionnalités avancées</span> pour un <span className="text-sky-400 font-semibold">prédiagnostic intelligent, rapide et fiable</span>.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 6. BENEFITS SECTION */}
      {activeSection === "benefits" && (
      <section id="benefits" className={`relative overflow-hidden py-16 transition-colors duration-300 section-3d ${
        isDark ? "bg-slate-950 text-slate-200" : "bg-white text-slate-800"
      }`}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 tracking-widest uppercase block">
              LES BÉNÉFICES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight title-3d">
              Pourquoi utiliser <span className="text-sky-600 dark:text-sky-300">BatiSmart Roof IA</span> ?
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400">
              BatiSmart Roof IA vous permet d'anticiper les problèmes, d'optimiser vos ressources et de protéger durablement vos bâtiments tout en réduisant les coûts.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="card-3d">
                <div className="card-3d-inner group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
                  <div className="absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">1. Détection précoce des pathologies</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Identifiez rapidement les fissures, infiltrations, humidité et autres anomalies avant qu'elles ne s'aggravent.
                  </p>
                </div>
              </div>

              <div className="card-3d">
                <div className="card-3d-inner group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
                  <div className="absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">2. Maintenance préventive</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Planifiez les interventions au bon moment et évitez les réparations d'urgence coûteuses.
                  </p>
                </div>
              </div>

              <div className="card-3d">
                <div className="card-3d-inner group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
                  <div className="absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">3. Réduction des coûts</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Moins de pannes, moins d'interventions lourdes, réduction significative des coûts de maintenance.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <div className="card-3d">
                <div className="card-3d-inner group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
                  <div className="absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">4. Optimisation des budgets</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Priorisez les actions selon le niveau de risque réel et allouez vos budgets plus efficacement.
                  </p>
                </div>
              </div>

              <div className="card-3d">
                <div className="card-3d-inner group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
                  <div className="absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-300">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">5. Protection du patrimoine</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Prolongez la durée de vie de vos bâtiments et préservez la valeur de votre patrimoine immobilier.
                  </p>
                </div>
              </div>

              <div className="card-3d">
                <div className="card-3d-inner group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
                  <div className="absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">6. Décisions plus rapides</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Accédez à une information fiable et à jour pour prendre des décisions éclairées rapidement.
                  </p>
                </div>
              </div>

              <div className="card-3d">
                <div className="card-3d-inner group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
                  <div className="absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">7. Centralisation des données</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Toutes vos données, inspections et historiques centralisées au même endroit, accessibles à tout moment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 7. FOOTER */}
      <footer className={`py-12 border-t text-center text-xs transition-colors duration-300 ${
        isDark ? "border-slate-900 bg-slate-950 text-slate-500" : "border-slate-200 bg-white text-slate-400 shadow-inner"
      }`}>
        <p>© 2026 BatiSmart Roof IA. Labellisé Startup par le Ministère de l'Économie de la Connaissance et des Startups.</p>
        <p className="mt-2 font-light">Développé en partenariat scientifique avec l'Université de Béjaïa.</p>
      </footer>

    </div>
  );
}
