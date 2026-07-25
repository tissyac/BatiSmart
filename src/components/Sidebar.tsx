import React from "react";
import { LayoutDashboard, Map, ScanEye, History, LogOut, User, MessageSquare, BookOpen, Home, Sun, Moon, X, Compass, Layers, Cpu, Wifi, Activity, TrendingUp, Settings, Lock, ChevronDown, ChevronUp, Wrench, Sparkles, Bot } from "lucide-react";
import { UserProfile } from "../types";
import { isTabAuthorized } from "../utils/rbac";
import Logo from "./Logo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  language?: "fr" | "ar" | "en";
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, theme, setTheme, isSidebarOpen, setIsSidebarOpen, language = "fr" }: SidebarProps) {
  const [showFuture, setShowFuture] = React.useState(false);
  const sidebarTranslations: Record<string, Record<string, { label: string, desc: string }>> = {
    fr: {
      home: { label: "Accueil", desc: "Page d'accueil de la plateforme" },
      dashboard: { label: "Tableau de Bord", desc: "Aperçu, stats & risques" },
      map: { label: "Carte SIG Algérie", desc: "Géo-localisation des bâtis" },
      scan: { label: "Scanner Toiture (IA)", desc: "Prédiagnostic assisté par IA multi-angles" },
      chat: { label: "Assistant IA", desc: "Conseils de réhabilitation" },
      how_batismart_works: { label: "Comment fonctionne BatiSmart Roof IA ?", desc: "Guide de découverte interactif du parcours" },
      history: { label: "Historique & PDF", desc: "Inspections & Rapports PDF" },
      settings: { label: "Paramètres", desc: "Thème, langue, alertes & sécurité" },
      support: { label: "Support & Updates", desc: "Assistance, tickets & mises à jour" }
    },
    ar: {
      home: { label: "الرئيسية", desc: "الصفحة الرئيسية للمنصة" },
      dashboard: { label: "لوحة التحكم", desc: "الملخص، الإحصاءات والمخاطر" },
      map: { label: "خريطة SIG الجزائر", desc: "تحديد المواقع الجغرافية للمباني" },
      scan: { label: "فحص الأسقف (IA)", desc: "تشخيص متعدد الزوايا" },
      chat: { label: "مساعد الذkاء", desc: "نصائح وإرشادات الترميم" },
      how_batismart_works: { label: "كيف يعمل باتي سمارت؟", desc: "دليل استكشاف تفاعلي للمسار" },
      history: { label: "الأرشيف وملفات PDF", desc: "عمليات الفحص والتقارير" },
      settings: { label: "الإعدادات", desc: "المظهر، اللغة، التنبيهات والأمان" },
      support: { label: "الدعم والتحديثات", desc: "المساعدة، التذاكر والتحديثات" }
    },
    en: {
      home: { label: "Home", desc: "Platform home landing page" },
      dashboard: { label: "Dashboard", desc: "Overview, stats & risk levels" },
      map: { label: "GIS Algeria Map", desc: "Geospatial mapping of structures" },
      scan: { label: "Roof Scanner (AI)", desc: "Multi-angle AI pre-diagnostic tool" },
      chat: { label: "AI Assistant Chat", desc: "Rehabilitation engineering advice" },
      how_batismart_works: { label: "How BatiSmart Works", desc: "Interactive discovery walkthrough guide" },
      history: { label: "Records & PDF Reports", desc: "Inspections database & exports" },
      settings: { label: "Settings", desc: "Theme, lang, alerts & safety" },
      support: { label: "Support & Updates", desc: "Help desk, tickets & version updates" }
    }
  };

  const t = sidebarTranslations[language] || sidebarTranslations["fr"];

  // All menu items remain visible for all roles (restricted ones will be locked)
  const menuItems = [
    { id: "home", label: t.home.label, icon: Home, desc: t.home.desc },
    { id: "dashboard", label: t.dashboard.label, icon: LayoutDashboard, desc: t.dashboard.desc },
    { id: "map", label: t.map.label, icon: Map, desc: t.map.desc },
    { 
      id: "scan", 
      label: user.role === "Opérateur drone / Agent de terrain" ? "Acquisition Drone" : t.scan.label, 
      icon: ScanEye, 
      desc: user.role === "Opérateur drone / Agent de terrain" ? "Prises de vues terrain & drone" : t.scan.desc 
    },
    { id: "chat", label: t.chat.label, icon: MessageSquare, desc: t.chat.desc },
    { id: "how_batismart_works", label: t.how_batismart_works.label, icon: Compass, desc: t.how_batismart_works.desc },
    { id: "how_it_works", label: "Comment fonctionne l'IA ?", icon: Sparkles, desc: "Pipeline, spécifications & limites" },
    { id: "history", label: t.history.label, icon: History, desc: t.history.desc },
    { id: "settings", label: t.settings.label, icon: Settings, desc: t.settings.desc },
    { id: "support", label: language === "ar" ? "الدعم والتحديثات" : "Support & Updates", icon: Wrench, desc: language === "ar" ? "الدعم والتذاكر والمطور" : "Technical help desk, bug reports, suggestion box & release notes" }
  ];

  return (
    <>
      {/* Backdrop overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-all duration-300 cursor-pointer"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] md:relative md:translate-x-0 flex flex-col justify-between shrink-0 h-[100dvh] md:h-full overflow-hidden font-sans transition-all duration-300 border-r
        ${isSidebarOpen ? "translate-x-0 shadow-2xl md:w-80 md:opacity-100 md:border-r" : "-translate-x-full md:w-0 md:-translate-x-full md:opacity-0 md:border-r-0 md:pointer-events-none"}
        ${
          theme === "dark"
            ? "bg-[#070c1e] border-slate-900 text-slate-100"
            : "bg-white border-slate-200 text-slate-800"
        }
      `}>

        {/* Brand Header with New Visual Logo */}
        <div className={`p-4 border-b flex flex-col items-center relative shrink-0 ${
          theme === "dark" ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/40"
        }`}>
          {/* Close button */}
          {setIsSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer z-25"
              aria-label="Fermer le menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <Logo size="sm" variant={theme === "dark" ? "light" : "dark"} show3dBadge={true} />
        </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin">
        <div className={`px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest ${
          theme === "dark" ? "text-slate-500" : "text-slate-400"
        }`}>
          Console d'inspection
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAuthorized = isTabAuthorized(item.id, user.role);

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setIsSidebarOpen) {
                  setIsSidebarOpen(false);
                }
              }}
              className={`w-full flex items-start justify-between p-3 rounded-xl text-left transition-all duration-300 group cursor-pointer ${
                isActive
                  ? "bg-sky-500/10 text-[#0ea5e9] border-l-4 border-sky-500 shadow-md"
                  : !isAuthorized
                    ? "opacity-55 hover:opacity-80 saturate-50 hover:saturate-100"
                    : theme === "dark"
                      ? "text-slate-400 hover:text-white hover:bg-slate-900/40"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <Icon className={`w-4.5 h-4.5 mt-0.5 shrink-0 transition-colors duration-300 ${
                  isActive ? "text-sky-500" : !isAuthorized ? "text-slate-500" : "text-slate-400 group-hover:text-sky-500"
                }`} />
                <div className="overflow-hidden">
                  <span className={`font-semibold text-xs md:text-sm block leading-none flex items-center gap-1.5 ${
                    isActive
                      ? "text-sky-600 dark:text-sky-400"
                      : !isAuthorized
                        ? "text-slate-500 dark:text-slate-400"
                        : theme === "dark"
                          ? "text-slate-300 group-hover:text-white"
                          : "text-slate-700 group-hover:text-slate-900"
                  }`}>
                    {item.label}
                  </span>
                  <span className={`text-[10px] block mt-1 font-light leading-none ${
                    isActive 
                      ? "text-sky-500/80 dark:text-sky-400/80" 
                      : "text-slate-500"
                  }`}>{item.desc}</span>
                </div>
              </div>

              {!isAuthorized && (
                <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0 self-center" title="Accès restreint">
                  <Lock className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}

        {/* Future Features Section */}
        <button
          type="button"
          onClick={() => setShowFuture(!showFuture)}
          className={`w-full flex items-center justify-between px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest border-t mt-4 text-left cursor-pointer transition ${
            theme === "dark" ? "text-slate-500 border-slate-800/80 hover:text-slate-300" : "text-slate-400 border-slate-100 hover:text-slate-600"
          }`}
        >
          <span>Fonctionnalités futures</span>
          {showFuture ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFuture && (
          <div className="space-y-1 mt-2 animate-fade-in">
            {[
              { label: "Drone autonome", desc: "Inspection par vol thermique", icon: Compass },
              { label: "Jumeau numérique", desc: "Réplique 3D interactive", icon: Layers },
              { label: "BIM", desc: "Modélisation des données du bâtiment", icon: Layers },
              { label: "IoT", desc: "Objets connectés de structure", icon: Cpu },
              { label: "Capteurs", desc: "Mesures hygrométriques", icon: Wifi },
              { label: "Surveillance temps réel", desc: "Alerte de mouvements", icon: Activity },
              { label: "Maintenance prédictive", desc: "Planification par IA", icon: TrendingUp }
            ].map((future, fidx) => {
              const FutureIcon = future.icon;
              return (
                <div
                  key={fidx}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border border-dashed transition-all duration-300 bg-slate-50/5 dark:bg-slate-950/10 ${
                    theme === "dark" 
                      ? "border-slate-800/40 text-slate-500" 
                      : "border-slate-150 text-slate-450"
                  }`}
                >
                  <FutureIcon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400 dark:text-slate-600" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-semibold text-xs block leading-none text-slate-500 dark:text-slate-400 truncate">
                        {future.label}
                      </span>
                      <span className="text-[7px] font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400 bg-sky-500/10 px-1 py-0.5 rounded leading-none">
                        Bientôt
                      </span>
                    </div>
                    <span className="text-[8.5px] block mt-1 font-light leading-none text-slate-450 dark:text-slate-600">
                      {future.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </nav>

      {/* User Profile Panel & Actions */}
      <div className={`p-4 border-t shrink-0 ${
        theme === "dark" ? "border-slate-900 bg-slate-950/20" : "border-slate-100 bg-slate-50/50"
      }`}>
        {/* User Badge */}
        <div className={`border rounded-lg p-2 mb-1.5 ${
          theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xs"
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center border shrink-0 ${
              theme === "dark" ? "bg-sky-500/10 border-sky-500/20 text-sky-400" : "bg-sky-50 border-sky-200 text-sky-600"
            }`}>
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h4 className={`text-[11.5px] font-bold leading-none truncate ${
                theme === "dark" ? "text-white" : "text-slate-800"
              }`}>{user.displayName}</h4>
              <span className={`text-[9.5px] block truncate font-medium mt-0.5 ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}>{user.role}</span>
            </div>
          </div>
          
          <div className={`mt-2 pt-1.5 border-t flex items-center justify-end text-[9.5px] font-medium ${
            theme === "dark" ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
          }`}>
            <span className="px-1 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8.5px] text-emerald-600 dark:text-emerald-400 font-semibold capitalize shrink-0">
              En ligne
            </span>
          </div>
        </div>

        {/* Dual Actions Row: Theme Switch & Logout */}
        <div className="flex gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`flex-1 py-2.5 px-3 rounded-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer font-semibold text-xs border ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300"
                : "bg-white border-slate-200 text-slate-700 hover:text-sky-600 shadow-sm"
            }`}
            title={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 shrink-0" />
                Clair
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 shrink-0" />
                Sombre
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={`flex-1 py-2.5 px-3 rounded-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer font-semibold text-xs border ${
              theme === "dark"
                ? "bg-slate-900 hover:bg-red-500/10 border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400"
                : "bg-white hover:bg-red-50 border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-500 shadow-sm"
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Quitter
          </button>
        </div>
      </div>

    </aside>
  </>
  );
}
