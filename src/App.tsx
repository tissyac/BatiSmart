import React, { useState, useEffect, useMemo } from "react";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import SplashScreen from "./components/SplashScreen";
import DashboardScreen from "./components/DashboardScreen";
import MapScreen from "./components/MapScreen";
import ScanScreen from "./components/ScanScreen";
import HistoryScreen from "./components/HistoryScreen";
import ChatScreen from "./components/ChatScreen";
import HowBatiSmartWorksScreen from "./components/HowBatiSmartWorksScreen";
import HowItWorksScreen from "./components/HowItWorksScreen";
import SettingsScreen from "./components/SettingsScreen";
import SupportScreen from "./components/SupportScreen";
import ContactFooterBar from "./components/ContactFooterBar";
import { SEED_INSPECTIONS } from "./data";
import { Inspection, UserProfile, Intervention } from "./types";
import { Menu, Lock, ArrowLeft } from "lucide-react";
import Logo from "./components/Logo";
import { safeStorage, safeSessionStorage } from "./utils/storage";
import { isTabAuthorized, getRequiredRoles, getRestrictionMessage } from "./utils/rbac";

export function getFilteredInspectionsForUser(inspections: Inspection[], user: UserProfile | null): Inspection[] {
  if (!user) return [];

  const userEmail = (user.email || "").trim().toLowerCase();
  const userUid = (user.uid || "").trim().toLowerCase();

  // Pour tout compte utilisateur personnel (nouveau ou existant) :
  // Afficher uniquement et automatiquement toutes les inspections créées par et associées à cet utilisateur
  return inspections.filter((ins) => {
    if (!ins) return false;
    const insEmail = (ins.inspectorEmail || "").trim().toLowerCase();
    const insUid = (ins.inspectorUid || "").trim().toLowerCase();
    
    if (insEmail && insEmail === userEmail) return true;
    if (userUid && insUid && insUid === userUid) return true;

    return false;
  });
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>(() => {
    const stored = safeStorage.getItem("batismart_interventions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => {
            const updated = { ...item };
            if (updated.photoBefore === "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80" || 
                updated.photoBefore === "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80") {
              updated.photoBefore = "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=400&q=80";
            }
            if (updated.photoAfter === "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80" ||
                updated.photoAfter === "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80") {
              updated.photoAfter = "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=400&q=80";
            }
            if (updated.photoBefore === "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=400&q=80" ||
                updated.photoBefore === "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80") {
              updated.photoBefore = "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80";
            }
            if (updated.photoAfter === "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80" ||
                updated.photoAfter === "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80") {
              updated.photoAfter = "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80";
            }
            return updated;
          });
        }
        return [];
      } catch (err) {
        return [];
      }
    }
    // Seed standard interventions linked to seed inspections to show beautiful pre-populated data!
    return [
      {
        id: "inter_chu",
        buildingName: "CHU Khelil Amrane",
        linkedInspectionId: "insp_chu_2",
        date: "2026-06-25",
        type: "Rénovation complète étanchéité",
        description: "Pose complète d'un complexe d'étanchéité asphalte élastomère armé SBS bicouche soudé à chaud. Intégration d'une couche d'isolation thermique performante locale en liège expansé de 100mm et application d'une finition Cool Roof blanche.",
        company: "Béjaïa Étanchéité Services",
        responsible: "Karim Haddad (Conducteur de Travaux)",
        duration: "10 jours",
        estimatedCost: "2 450 000 DA",
        photoBefore: "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=400&q=80",
        photoAfter: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "inter_apc",
        buildingName: "APC de Béjaïa",
        linkedInspectionId: "insp_apc_2",
        date: "2026-06-30",
        type: "Traitement des fissures & Pose de bâche",
        description: "Colmatage structurel des fissures de dilatation d'acrotères avec résine souple polyuréthane fibrée. Pose de bandes d'étanchéité autocollantes à froid pour parer aux infiltrations imminentes et curage complet des descentes pluviales.",
        company: "EcoBat Soummam",
        responsible: "Yanis Meziane",
        duration: "3 jours",
        estimatedCost: "320 000 DA",
        photoBefore: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80",
        photoAfter: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80"
      }
    ];
  });
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);
  const [historyFilterSeverity, setHistoryFilterSeverity] = useState<string>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (safeStorage.getItem("batismart_theme") as "light" | "dark") || "light";
  });
  const [language, setLanguage] = useState<"fr" | "ar" | "en">(() => {
    return (safeStorage.getItem("batismart_lang") as "fr" | "ar" | "en") || "fr";
  });

  // State to handle RBAC access restriction notice popup
  const [restrictionNotice, setRestrictionNotice] = useState<{
    isOpen: boolean;
    tabId: string;
    message: string;
    requiredRoles: string;
  } | null>(null);

  // Memoize filtered arrays to avoid reference changes on every render
  const filteredInspections = useMemo(() => {
    return getFilteredInspectionsForUser(inspections, user);
  }, [inspections, user]);

  const filteredInterventions = useMemo(() => {
    return interventions.filter(interv =>
      filteredInspections.some(ins => ins.buildingName.trim().toLowerCase() === interv.buildingName.trim().toLowerCase())
    );
  }, [interventions, filteredInspections]);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    safeStorage.setItem("batismart_theme", newTheme);
  };

  const handleLanguageChange = (newLang: "fr" | "ar" | "en") => {
    setLanguage(newLang);
    safeStorage.setItem("batismart_lang", newLang);
  };

  // Safe wrapper for tab switches with RBAC verification
  const handleTabChange = (tabId: string) => {
    if (!user) return;
    if (!isTabAuthorized(tabId, user.role)) {
      setRestrictionNotice({
        isOpen: true,
        tabId: tabId,
        message: getRestrictionMessage(tabId, user.role),
        requiredRoles: getRequiredRoles(tabId),
      });
      return;
    }
    setActiveTab(tabId);
  };

  // Safe update callback for when a Bureau d'études or Admin edits comments/recomm
  const handleUpdateInspection = (updatedIns: Inspection) => {
    setInspections((prev) => {
      const updated = prev.map((ins) => ins.id === updatedIns.id ? updatedIns : ins);
      safeStorage.setItem("batismart_inspections", JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddIntervention = (newIntervention: Intervention) => {
    setInterventions((prev) => {
      const updated = [...prev, newIntervention];
      safeStorage.setItem("batismart_interventions", JSON.stringify(updated));
      return updated;
    });
  };

  // Sync theme with document class for Tailwind dark variant support
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // 1. Initial configuration load
  useEffect(() => {
    // Check session storage for authenticated user profile
    const storedUser = safeSessionStorage.getItem("batismart_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        safeSessionStorage.removeItem("batismart_user");
      }
    }

    // Load inspections from localStorage if existing, otherwise populate with SEED_INSPECTIONS
    const storedInspections = safeStorage.getItem("batismart_inspections");
    if (storedInspections) {
      try {
        const parsed = JSON.parse(storedInspections);
        if (Array.isArray(parsed)) {
          const allowedNames = [
            "chu khelil amrane",
            "apc de béjaïa",
            "université abderrahmane mira de béjaïa",
            "lycée ibn sina",
            "école el hammadia",
            "maison de la culture de béjaïa"
          ];
          const filteredParsed = parsed.filter(
            (ins: any) => ins && ins.buildingName
          );
          const validated: Inspection[] = filteredParsed.map((ins: any): Inspection => {
            const seed = SEED_INSPECTIONS.find(s => s.id === ins.id);
            
            // ALWAYS override image fields with seed values if it's a seed inspection to ensure professional photos are applied
            const finalImageUrl = seed ? seed.imageUrl : (ins.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80");
            const finalImageUrls = seed ? seed.imageUrls : (ins.imageUrls || [finalImageUrl]);
            
            return {
              id: ins.id || "insp_" + Math.random().toString(36).substr(2, 9),
              buildingName: ins.buildingName || "Structure Publique",
              buildingType: ins.buildingType || "Administratif",
              city: ins.city || "Béjaïa (06)",
              address: ins.address || "Béjaïa, Algérie",
              latitude: typeof ins.latitude === "number" ? ins.latitude : 36.7512,
              longitude: typeof ins.longitude === "number" ? ins.longitude : 5.0561,
              imageUrl: finalImageUrl,
              imageUrls: finalImageUrls,
              notes: ins.notes || "Aucune note.",
              inspectorName: ins.inspectorName || "Inspecteur",
              inspectorEmail: ins.inspectorEmail || (seed ? seed.inspectorEmail : "inspecteur@batismart.dz"),
              inspectorUid: ins.inspectorUid || (seed ? seed.inspectorUid : undefined),
              date: ins.date || new Date().toISOString(),
              cracks: ins.cracks && typeof ins.cracks.detected === "boolean" ? ins.cracks : { detected: false, severity: "Aucune", description: "Aucune fissure constatée." },
              humidity: ins.humidity && typeof ins.humidity.detected === "boolean" ? ins.humidity : { detected: false, severity: "Aucune", description: "Aucune trace d'humidité active." },
              infiltration: ins.infiltration && typeof ins.infiltration.detected === "boolean" ? ins.infiltration : { detected: false, severity: "Aucune", description: "Aucune trace d'infiltration active." },
              degradation: ins.degradation && typeof ins.degradation.detected === "boolean" ? ins.degradation : { detected: false, severity: "Aucun signe d'altération." },
              riskScore: typeof ins.riskScore === "number" ? ins.riskScore : 0.0,
              summary: ins.summary || "Pré-diagnostic vierge.",
              recommendations: Array.isArray(ins.recommendations) ? ins.recommendations : ["Aucune recommandation requise pour le moment."],
              maintenanceStatus: ins.maintenanceStatus || (seed ? seed.maintenanceStatus : undefined),
              maintenanceTasks: ins.maintenanceTasks || (seed ? seed.maintenanceTasks : undefined),
              maintenancePhotos: ins.maintenancePhotos || (seed ? seed.maintenancePhotos : undefined),
              selectedTechnicalOptions: Array.isArray(ins.selectedTechnicalOptions) ? ins.selectedTechnicalOptions : [],
              selectedMaintenanceOptions: Array.isArray(ins.selectedMaintenanceOptions) ? ins.selectedMaintenanceOptions : [],
              maintenanceDescription: ins.maintenanceDescription || "",
              maintenanceInterventionType: ins.maintenanceInterventionType || "",
              maintenanceInterventionDate: ins.maintenanceInterventionDate || "",
              maintenanceCompany: ins.maintenanceCompany || "",
              maintenanceResponsible: ins.maintenanceResponsible || "",
              maintenanceDuration: ins.maintenanceDuration || "",
              maintenanceCost: ins.maintenanceCost || "",
              isUserCreated: ins.isUserCreated || false
            };
          });

          // Ensure any missing SEED_INSPECTIONS are always present even with local storage cache
          const merged: Inspection[] = [...validated];
          SEED_INSPECTIONS.forEach((seed) => {
            const exists = merged.some(
              (ins) => ins.id === seed.id
            );
            if (!exists) {
              merged.push(seed);
            }
          });

          setInspections(merged);
          safeStorage.setItem("batismart_inspections", JSON.stringify(merged));
        } else {
          setInspections(SEED_INSPECTIONS);
          safeStorage.setItem("batismart_inspections", JSON.stringify(SEED_INSPECTIONS));
        }
      } catch (err) {
        setInspections(SEED_INSPECTIONS);
        safeStorage.setItem("batismart_inspections", JSON.stringify(SEED_INSPECTIONS));
      }
    } else {
      setInspections(SEED_INSPECTIONS);
      safeStorage.setItem("batismart_inspections", JSON.stringify(SEED_INSPECTIONS));
    }
  }, []);

  // Listen for external updates to inspections (e.g., PDF generated) and reload from storage
  useEffect(() => {
    const handler = () => {
      try {
        const raw = safeStorage.getItem("batismart_inspections");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setInspections(parsed);
          }
        }
      } catch (e) {
        console.warn("Failed to reload inspections after external update:", e);
      }
    };
    window.addEventListener("batismart:inspections-updated", handler as EventListener);
    return () => window.removeEventListener("batismart:inspections-updated", handler as EventListener);
  }, []);

  // 2. Add a new AI-analyzed building to registry
  const handleNewInspection = (newIns: Inspection, autoSwitch: boolean = true) => {
    setInspections((prev) => {
      const exists = prev.some((ins) => ins.id === newIns.id);
      let updated;
      if (exists) {
        updated = prev.map((ins) => ins.id === newIns.id ? newIns : ins);
      } else {
        updated = [newIns, ...prev];
      }
      safeStorage.setItem("batismart_inspections", JSON.stringify(updated));
      return updated;
    });
    
    // Automatically select the new inspection and optionally switch tab to view details immediately
    setSelectedInspectionId(newIns.id);
    if (autoSwitch) {
      setActiveTab("history");
    }
  };

  // 3. Select existing inspection and jump to registry page
  const handleViewInspection = (inspection: Inspection) => {
    setSelectedInspectionId(inspection.id);
    setActiveTab("history");
  };

  // 4. Select inspection and jump directly to SIG map with auto-popup
  const handleViewOnMap = (inspection: Inspection) => {
    setSelectedInspectionId(inspection.id);
    setActiveTab("map");
  };

  const handleFilterNavigate = (severity: string) => {
    setHistoryFilterSeverity(severity);
    setActiveTab("history");
  };

  const handleLogout = () => {
    safeSessionStorage.removeItem("batismart_user");
    setUser(null);
    setActiveTab("home");
  };

  // Switch tabs/view rendering helper
  const renderContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case "home":
        return (
          <WelcomeScreen
            onStartInspection={() => handleTabChange("scan")}
            onNavigateToTab={(tab) => handleTabChange(tab)}
            theme={theme}
            setTheme={handleThemeChange}
            user={user}
            inspections={inspections}
            interventions={interventions}
          />
        );
      case "dashboard":
        return (
          <DashboardScreen
            inspections={filteredInspections}
            onViewInspection={handleViewInspection}
            onViewOnMap={handleViewOnMap}
            onNavigateToScan={() => handleTabChange("scan")}
            user={user}
            onFilterNavigate={handleFilterNavigate}
            interventions={filteredInterventions}
            onAddIntervention={handleAddIntervention}
            onUpdateInspection={handleUpdateInspection}
          />
        );
      case "map":
        return (
          <MapScreen
            inspections={filteredInspections}
            onViewInspection={handleViewInspection}
            selectedInspectionId={selectedInspectionId}
            theme={theme}
          />
        );
      case "scan":
        return (
          <ScanScreen
            onNewInspection={handleNewInspection}
            inspectorName={user.displayName}
            inspectorEmail={user.email}
            language={language}
            user={user}
            onNavigateToTab={(tab) => handleTabChange(tab)}
            onViewOnMap={handleViewOnMap}
          />
        );
      case "chat":
        return <ChatScreen language={language} />;
      case "how_batismart_works":
        return <HowBatiSmartWorksScreen theme={theme} />;
      case "how_it_works":
        return <HowItWorksScreen theme={theme} />;
      case "settings":
        return (
          <SettingsScreen 
            theme={theme} 
            setTheme={handleThemeChange} 
            language={language} 
            setLanguage={handleLanguageChange}
            user={user}
          />
        );
      case "history":
        return (
          <HistoryScreen
            inspections={filteredInspections}
            selectedInspectionId={selectedInspectionId}
            setSelectedInspectionId={setSelectedInspectionId}
            onNavigateToMap={() => handleTabChange("map")}
            onViewOnMap={handleViewOnMap}
            user={user}
            onUpdateInspection={handleUpdateInspection}
            filterSeverity={historyFilterSeverity}
            setFilterSeverity={setHistoryFilterSeverity}
            interventions={filteredInterventions}
            onAddIntervention={handleAddIntervention}
          />
        );
      case "support":
        return <SupportScreen />;
      default:
        return (
          <WelcomeScreen
            onStartInspection={() => handleTabChange("scan")}
            onNavigateToTab={(tab) => handleTabChange(tab)}
            theme={theme}
            setTheme={handleThemeChange}
            user={user}
            inspections={inspections}
            interventions={interventions}
          />
        );
    }
  };

  // Display cinematic animated 3D splash screen on app start
  if (showSplash) {
    return <SplashScreen onDismiss={() => setShowSplash(false)} />;
  }

  // If unauthorized, redirect to Auth Screen
  if (!user) {
    return <AuthScreen onAuthSuccess={setUser} />;
  }

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans antialiased transition-colors duration-300 ${
      theme === "dark" ? "bento-bg-dark text-slate-100" : "bento-bg text-slate-800"
    }`}>
      
      {/* Header Bar */}
      <header className={`flex items-center justify-between px-5 py-3 border-b shrink-0 z-30 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#070c1e] border-slate-900 text-white" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="flex items-center gap-2">
          {activeTab !== "home" && (
            <button
              onClick={() => handleTabChange("home")}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-slate-700 dark:text-slate-300 cursor-pointer"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-display font-bold text-sm tracking-wider uppercase">
          <span className="text-sky-500">BatiSmart</span>
          <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent font-black">Roof IA</span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-semibold text-xs uppercase" title={user.displayName}>
          {user.displayName ? user.displayName.substring(0, 2) : "AI"}
        </div>
      </header>
      
      {/* Content wrapper with side-by-side layout for Sidebar and Main content */}
      <div className="flex flex-row flex-1 h-full overflow-hidden relative">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          user={user}
          onLogout={handleLogout}
          theme={theme}
          setTheme={handleThemeChange}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          language={language}
        />

        {/* Main Content Pane */}
        <main className="flex-1 h-full bg-transparent relative overflow-hidden flex flex-col">
          {renderContent()}
        </main>
      </div>

      {/* Dynamic RBAC Restriction Notice Modal */}
      {restrictionNotice && restrictionNotice.isOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#0b1129] border border-amber-500/30 text-slate-100 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                  Accès Restreint / Verrouillé
                  <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-500 uppercase font-black">Sécurité</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {restrictionNotice.message}
                </p>
                
                <div className="pt-3 border-t border-slate-900 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Profils d'accès requis :</span>
                  <p className="text-[10.5px] font-semibold text-sky-400 font-mono leading-relaxed bg-sky-500/5 p-2 rounded border border-sky-500/10">
                    {restrictionNotice.requiredRoles}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setRestrictionNotice(null)}
                className="px-4.5 py-2 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold text-xs rounded-xl shadow-md transition-all duration-300 cursor-pointer"
              >
                Compris, Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Footer Bar - Always visible across all pages */}
      <ContactFooterBar theme={theme} />

    </div>
  );
}
