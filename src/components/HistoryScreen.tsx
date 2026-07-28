import React, { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Calendar, FileText, Printer, Share2, ArrowUpRight, CheckCircle, ShieldAlert, AlertTriangle, Building, Eye, ChevronRight, X, Plus, Trash, Save, Lock, Camera, Check, Loader2, Info, Wrench, Sparkles, ShieldCheck, Upload, Image as ImageIcon } from "lucide-react";
import { Inspection, UserProfile, UserRole, Intervention } from "../types";
import { generateInspectionPDF } from "../utils/pdfGenerator";
import { PdfDownloadModal } from "./PdfDownloadModal";

const GALLERY_IMAGES = {
  before: [
    {
      title: "Fissures Majeures d'Étanchéité",
      url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
      desc: "Fissures thermiques structurelles sur joints d'étanchéité"
    },
    {
      title: "Eau stagnante massive",
      url: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=600&q=80",
      desc: "Humidité stagnante due à un défaut de pente de dalle"
    },
    {
      title: "Infiltration de dalle active",
      url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
      desc: "Traces de pénétration d'eau sous forme d'auréoles"
    },
    {
      title: "Bitume craquelé ou pelé",
      url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80",
      desc: "Membrane d'étanchéité d'origine brûlée et boursouflée"
    },
    {
      title: "Mousse & Végétation",
      url: "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=600&q=80",
      desc: "Prolifération organique obstruant l'écoulement des acrotères"
    }
  ],
  after: [
    {
      title: "Membrane bitumineuse neuve",
      url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
      desc: "Soudage à chaud d'une membrane asphalte élastomère armée"
    },
    {
      title: "Cool Roof (Peinture blanche)",
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      desc: "Peinture hautement réfléchissante réduisant la chaleur de toiture"
    },
    {
      title: "Résine d'étanchéité liquide (SEL)",
      url: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=600&q=80",
      desc: "Protection polyuréthane continue sans aucun raccord vulnérable"
    },
    {
      title: "Joints d'acrotères pontés",
      url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
      desc: "Coulis d'étanchéité et traitement élastomère des fissures"
    },
    {
      title: "Dalle béton imperméabilisée",
      url: "https://images.unsplash.com/photo-1503387762-572dae8da117?auto=format&fit=crop&w=600&q=80",
      desc: "Ragréage et hydrofugation complète de la dalle supérieure"
    }
  ]
};

interface HistoryScreenProps {
  inspections: Inspection[];
  selectedInspectionId: string | null;
  setSelectedInspectionId: (id: string | null) => void;
  onNavigateToMap: () => void;
  onViewOnMap?: (inspection: Inspection) => void;
  user: UserProfile;
  onUpdateInspection?: (updated: Inspection) => void;
  filterSeverity?: string;
  setFilterSeverity?: (severity: string) => void;
  interventions?: Intervention[];
  onAddIntervention?: (newIntervention: Intervention) => void;
}

export default function HistoryScreen({ 
  inspections, 
  selectedInspectionId, 
  setSelectedInspectionId, 
  onNavigateToMap,
  onViewOnMap,
  user,
  onUpdateInspection,
  filterSeverity: propFilterSeverity,
  setFilterSeverity: propSetFilterSeverity,
  interventions = [],
  onAddIntervention
}: HistoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [localFilterSeverity, setLocalFilterSeverity] = useState<string>("all");

  const filterSeverity = propFilterSeverity !== undefined ? propFilterSeverity : localFilterSeverity;
  const setFilterSeverity = propSetFilterSeverity !== undefined ? propSetFilterSeverity : setLocalFilterSeverity;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- EXPERT & ADMIN DIAGNOSTIC EDIT STATES ---
  const [isEditingDefects, setIsEditingDefects] = useState(false);
  const [editedRiskScore, setEditedRiskScore] = useState<number>(0);
  const [editedCracks, setEditedCracks] = useState({ detected: false, severity: "Aucune" as any, description: "" });
  const [editedHumidity, setEditedHumidity] = useState({ detected: false, severity: "Aucune" as any, description: "" });
  const [editedInfiltration, setEditedInfiltration] = useState({ detected: false, severity: "Aucune" as any, description: "" });
  const [editedDegradation, setEditedDegradation] = useState({ detected: false, severity: "Aucune" as any, description: "" });

  // --- BUREAU D'ETUDES EDIT STATES ---
  const [isEditingRecs, setIsEditingRecs] = useState(false);
  const [editedRecommendations, setEditedRecommendations] = useState<string[]>([]);
  const [newRecommendation, setNewRecommendation] = useState("");

  // --- ENTREPRISE DE MAINTENANCE EDIT STATES ---
  const [isEditingMaintenance, setIsEditingMaintenance] = useState(false);
  const [editedMaintStatus, setEditedMaintStatus] = useState<any>("Non planifiée");
  const [editedMaintTasks, setEditedMaintTasks] = useState<any[]>([]);
  const [editedMaintPhotos, setEditedMaintPhotos] = useState<any[]>([]);

  const [activeDetailImageUrl, setActiveDetailImageUrl] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // --- SUB-TAB & INTERVENTION STATES ---
  const [activeSubTab, setActiveSubTab] = useState<"inspections" | "interventions">("inspections");
  
  const buildingNames = Array.from(new Set(inspections.map((ins) => ins.buildingName))).filter(Boolean);
  const [selectedBuildingInterv, setSelectedBuildingInterv] = useState<string>(() => {
    return buildingNames[0] || "";
  });

  const [intervType, setIntervType] = useState<string>("Rénovation complète étanchéité");
  const [intervDate, setIntervDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [intervDescription, setIntervDescription] = useState<string>("");
  const [intervCompany, setIntervCompany] = useState<string>("");
  const [intervResponsible, setIntervResponsible] = useState<string>("");
  const [intervDuration, setIntervDuration] = useState<string>("");
  const [intervCost, setIntervCost] = useState<string>("");
  const [intervPhotoBefore, setIntervPhotoBefore] = useState<string>("");
  const [intervPhotoAfter, setIntervPhotoAfter] = useState<string>("");
  const [intervSuccess, setIntervSuccess] = useState<boolean>(false);

  const [galleryPickerTarget, setGalleryPickerTarget] = useState<"before" | "after" | null>(null);

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (type === "before") {
          setIntervPhotoBefore(reader.result);
        } else {
          setIntervPhotoAfter(reader.result);
        }
        setToastMessage(
          type === "before"
            ? "Photo avant chargée depuis la galerie !"
            : "Photo après chargée depuis la galerie !"
        );
      }
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    if (inspections.length > 0) {
      const exists = inspections.some((ins) => ins.id === selectedInspectionId);
      if (!selectedInspectionId || !exists) {
        setSelectedInspectionId(inspections[0].id);
      }
    }
  }, [inspections, selectedInspectionId, setSelectedInspectionId]);

  React.useEffect(() => {
    const selectedIns = inspections.find((ins) => ins.id === selectedInspectionId);
    if (selectedIns?.buildingName) {
      setSelectedBuildingInterv(selectedIns.buildingName);
    }
  }, [selectedInspectionId, inspections]);

  const handleSaveInterventionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuildingInterv) return;

    const lastInspection = inspections
      .filter((ins) => ins.buildingName === selectedBuildingInterv)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const linkedInspectionId = lastInspection ? lastInspection.id : "none";

    const newInterv: Intervention = {
      id: "interv_" + Date.now(),
      buildingName: selectedBuildingInterv,
      linkedInspectionId,
      type: intervType,
      date: intervDate,
      description: intervDescription,
      company: intervCompany || "Non spécifié",
      responsible: intervResponsible || "Non spécifié",
      duration: intervDuration || "Non spécifié",
      estimatedCost: intervCost || "0 DA",
      photoBefore: intervPhotoBefore || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      photoAfter: intervPhotoAfter || "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
    };

    if (selectedInspection) {
      const updatedInspection = {
        ...selectedInspection,
        maintenanceDescription: intervDescription || selectedInspection.maintenanceDescription || "",
        maintenanceInterventionType: intervType || selectedInspection.maintenanceInterventionType || "",
        maintenanceInterventionDate: intervDate || selectedInspection.maintenanceInterventionDate || "",
        maintenanceCompany: intervCompany || selectedInspection.maintenanceCompany || "",
        maintenanceResponsible: intervResponsible || selectedInspection.maintenanceResponsible || "",
        maintenanceDuration: intervDuration || selectedInspection.maintenanceDuration || "",
        maintenanceCost: intervCost || selectedInspection.maintenanceCost || "",
        maintenancePhotos: [
          ...(selectedInspection.maintenancePhotos || []),
          ...(intervPhotoBefore ? [{ id: `before-${Date.now()}`, label: "Avant - intervention", url: intervPhotoBefore, date: new Date().toISOString() }] : []),
          ...(intervPhotoAfter ? [{ id: `after-${Date.now()}`, label: "Après - intervention", url: intervPhotoAfter, date: new Date().toISOString() }] : [])
        ].filter((photo: any) => photo?.url),
      };
      if (onUpdateInspection) {
        onUpdateInspection(updatedInspection as any);
      }
    }

    if (onAddIntervention) {
      onAddIntervention(newInterv);
    }

    setIntervSuccess(true);
    setIntervDescription("");
    setIntervCompany("");
    setIntervResponsible("");
    setIntervDuration("");
    setIntervCost("");
    setIntervPhotoBefore("");
    setIntervPhotoAfter("");

    setTimeout(() => {
      setIntervSuccess(false);
    }, 4000);
  };

  // Find currently active inspection
  const selectedInspection = inspections.find((ins) => ins.id === selectedInspectionId);

  const currentDetailImage = selectedInspection
    ? (activeDetailImageUrl && selectedInspection.imageUrls?.includes(activeDetailImageUrl)
      ? activeDetailImageUrl
      : selectedInspection.imageUrl)
    : null;

  // Helper to handle PDF download with server-side Base64 proxying of remote image URLs
  const handleDownloadPDF = (triggerPrint: boolean = false) => {
    if (!selectedInspection) return;
    setIsPdfModalOpen(true);
  };

  // --- EXPERT HANDLERS ---
  const startEditingDefects = () => {
    if (!selectedInspection) return;
    setEditedRiskScore(selectedInspection.riskScore);
    setEditedCracks(selectedInspection.cracks || { detected: false, severity: "Aucune", description: "" });
    setEditedHumidity(selectedInspection.humidity || { detected: false, severity: "Aucune", description: "" });
    setEditedInfiltration(selectedInspection.infiltration || { detected: false, severity: "Aucune", description: "" });
    setEditedDegradation(selectedInspection.degradation || { detected: false, severity: "Aucune", description: "" });
    setIsEditingDefects(true);
  };

  const saveEditedDefects = () => {
    if (!selectedInspection) return;
    if (onUpdateInspection) {
      onUpdateInspection({
        ...selectedInspection,
        riskScore: Number(editedRiskScore),
        cracks: editedCracks,
        humidity: editedHumidity,
        infiltration: editedInfiltration,
        degradation: editedDegradation
      });
    }
    setIsEditingDefects(false);
    setToastMessage("Prédiagnostic d'expertise mis à jour avec succès !");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- BUREAU D'ETUDES HANDLERS ---
  const startEditingRecs = () => {
    if (!selectedInspection) return;
    setEditedRecommendations([...(selectedInspection.recommendations || [])]);
    setIsEditingRecs(true);
  };

  const addRecommendation = () => {
    if (!newRecommendation.trim()) return;
    setEditedRecommendations([...editedRecommendations, newRecommendation.trim()]);
    setNewRecommendation("");
  };

  const removeRecommendation = (idx: number) => {
    setEditedRecommendations(editedRecommendations.filter((_, i) => i !== idx));
  };

  const saveEditedRecs = () => {
    if (!selectedInspection) return;
    if (onUpdateInspection) {
      onUpdateInspection({
        ...selectedInspection,
        recommendations: editedRecommendations
      });
    }
    setIsEditingRecs(false);
    setToastMessage("Recommandations techniques validées !");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- ENTREPRISE DE MAINTENANCE HANDLERS ---
  const startEditingMaintenance = () => {
    if (!selectedInspection) return;
    setEditedMaintStatus(selectedInspection.maintenanceStatus || "Non planifiée");
    setEditedMaintTasks(selectedInspection.maintenanceTasks || [
      { id: "1", label: "Colmatage des fissures d'étanchéité", completed: false },
      { id: "2", label: "Séchage de l'humidité accumulée", completed: false },
      { id: "3", label: "Nettoyage des évacuations pluviales", completed: false },
      { id: "4", label: "Pose de nouvelle membrane étanche", completed: false }
    ]);
    setEditedMaintPhotos(selectedInspection.maintenancePhotos || []);
    setIsEditingMaintenance(true);
  };

  const toggleMaintTask = (taskId: string) => {
    setEditedMaintTasks(editedMaintTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const addMaintPhotoSimulate = () => {
    const imageUrls = [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
    ];
    const randImg = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    const newPhoto = {
      id: "photo_" + Math.random().toString(36).substr(2, 9),
      label: `Intervention #${editedMaintPhotos.length + 1}`,
      url: randImg,
      date: new Date().toLocaleDateString("fr-FR")
    };
    setEditedMaintPhotos([...editedMaintPhotos, newPhoto]);
  };

  const saveEditedMaintenance = () => {
    if (!selectedInspection) return;
    if (onUpdateInspection) {
      onUpdateInspection({
        ...selectedInspection,
        maintenanceStatus: editedMaintStatus,
        maintenanceTasks: editedMaintTasks,
        maintenancePhotos: editedMaintPhotos
      });
    }
    setIsEditingMaintenance(false);
    setToastMessage("Suivi d'intervention enregistré !");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = inspections.filter((ins) => {
    const matchesSearch =
      ins.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || ins.buildingType === filterType;
    
    let matchesSeverity = true;
    if (filterSeverity === "critical") matchesSeverity = ins.riskScore >= 7.0;
    else if (filterSeverity === "medium") matchesSeverity = ins.riskScore >= 4.0 && ins.riskScore < 7.0;
    else if (filterSeverity === "secure") matchesSeverity = ins.riskScore < 4.0;

    return matchesSearch && matchesType && matchesSeverity;
  });

  // Helper for color-coding risk scores
  const getRiskColor = (score: number) => {
    if (score >= 7.0) return { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-900/40", progressBg: "bg-red-500" };
    if (score >= 4.0) return { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-900/40", progressBg: "bg-amber-500" };
    return { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900/40", progressBg: "bg-emerald-500" };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans relative text-slate-700 dark:text-slate-300">
      
      {activeSubTab === "inspections" ? (
        <>
          {/* List Registry pane */}
          <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#030712]/10">
        {/* Search header filters */}
        <div className="p-4 sm:p-8 border-b border-slate-200 dark:border-slate-800/80 shrink-0 bg-white dark:bg-[#070b19]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-7 h-7 text-sky-500" />
                Registre des Inspections
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-normal mt-1">
                Historique des pré-diagnostics IA certifiés de l'étanchéité et de l'intégrité structurelle des bâtiments algériens.
              </p>
            </div>

            {/* Beautiful Sub-tab Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-900/85 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 shadow-inner self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveSubTab("inspections")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === "inspections"
                    ? "bg-[#0ea5e9] text-white shadow-md shadow-sky-500/10"
                    : "text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Inspections ({filtered.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab("interventions")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === "interventions"
                    ? "bg-[#0ea5e9] text-white shadow-md shadow-sky-500/10"
                    : "text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                <span>Interventions ({interventions.length})</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search query */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par édifice, wilaya, adresse..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all duration-300"
              />
            </div>

            {/* Structure Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition duration-300 cursor-pointer min-w-44"
            >
              <option value="all">Tous les types d'édifice</option>
              <option value="Administratif">Administratif</option>
              <option value="Scolaire/Universitaire">Scolaire / Universitaire</option>
              <option value="Judiciaire">Judiciaire</option>
              <option value="Santé">Santé</option>
            </select>

            {/* Severity level */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition duration-300 cursor-pointer min-w-44"
            >
              <option value="all">Toutes les severités</option>
              <option value="critical">Danger Critique (≥ 7.0)</option>
              <option value="medium">Alerte Modérée (4.0 - 6.9)</option>
              <option value="secure">Toiture Saine (&lt; 4.0)</option>
            </select>
          </div>
        </div>

        {/* Inspections list rows */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            Enregistrements trouvés ({filtered.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((ins) => {
              const risk = getRiskColor(ins.riskScore);
              const isSelected = ins.id === selectedInspectionId;

              return (
                <div
                  key={ins.id}
                  onClick={() => setSelectedInspectionId(ins.id)}
                  className={`p-4 rounded-2xl border text-left flex gap-4 transition duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-sky-500/10 border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.1)] text-slate-900 dark:text-white"
                      : "bento-card hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Photo thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800 relative">
                    <img src={ins.imageUrl} alt={ins.buildingName} className="w-full h-full object-cover" />
                  </div>

                  {/* Info block */}
                  <div className="overflow-hidden flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-semibold truncate leading-snug group-hover:text-sky-600 transition ${
                          isSelected ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-slate-100"
                        }`}>{ins.buildingName}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 border ${risk.bg} ${risk.text} ${risk.border}`}>
                          {ins.riskScore}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                        {ins.city}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-250 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-normal">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(ins.date).toLocaleDateString("fr-FR")}
                      </span>
                      <span className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5 font-bold">
                        Détails <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#070b19] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 my-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center shadow-inner">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Aucun pré-diagnostic enregistré
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    Votre compte ne possède aucun bilan d'inspection pour l'instant. Réalisez votre premier pré-diagnostic IA pour l'ajouter automatiquement à votre registre et mettre à jour le tableau de bord.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out Diagnostic board on right side */}
      {selectedInspection && (
        <>
          {/* Mobile backdrop for detail modal */}
          <div
            onClick={() => setSelectedInspectionId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden transition-all duration-300 cursor-pointer"
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md md:relative md:w-110 bg-white dark:bg-[#070b19] border-l border-slate-200 dark:border-slate-800/80 h-full flex flex-col justify-between shrink-0 animate-in slide-in-from-right duration-300 z-40 shadow-2xl">
          
          {/* Diagnostic Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <div className="overflow-hidden">
              <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-0.5">Prédiagnostic & Critères de Diagnostic IA n°{selectedInspection.id.substring(5, 10)}</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{selectedInspection.buildingName}</h3>
            </div>
            <button
              onClick={() => setSelectedInspectionId(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Diagnostic Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Aspect Photo */}
            <div className="space-y-2">
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 h-44 relative bg-slate-100 dark:bg-slate-950">
                <img src={currentDetailImage || ""} alt={selectedInspection.buildingName} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-mono text-slate-700 dark:text-slate-300 shadow-sm">
                  GPS: {selectedInspection.latitude.toFixed(4)}, {selectedInspection.longitude.toFixed(4)}
                </div>
              </div>
              
              {/* Secondary/Multi images thumbnail selector */}
              {selectedInspection.imageUrls && selectedInspection.imageUrls.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {selectedInspection.imageUrls.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveDetailImageUrl(url)}
                      className={`relative w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition cursor-pointer ${
                        currentDetailImage === url 
                          ? "border-sky-500 ring-2 ring-sky-500/20" 
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <img src={url} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* --- 1. EXPERT & ADMIN DIAGNOSTIC SECTION --- */}
            <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-850 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  🛡️ Rapport d'Expertise Diagnostique
                </h4>
                {(user.role === "Administrateur" || user.role === "Expert / Diagnostiqueur") && !isEditingDefects && (
                  <button
                    onClick={startEditingDefects}
                    className="px-2 py-1 text-[10px] font-bold uppercase bg-sky-500/10 hover:bg-sky-500 hover:text-white text-sky-600 dark:text-sky-400 rounded transition cursor-pointer"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {isEditingDefects ? (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-sky-500/20 rounded-xl space-y-4">
                  {/* Risk Score */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-slate-500 uppercase">Coefficient de risque</span>
                      <span className="font-bold text-sky-500">{editedRiskScore} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={editedRiskScore}
                      onChange={(e) => setEditedRiskScore(parseFloat(e.target.value))}
                      className="w-full cursor-pointer accent-sky-500"
                    />
                  </div>

                  {/* Defect Checklists */}
                  {[
                    { label: "Fissures sur Dalle", state: editedCracks, setState: setEditedCracks },
                    { label: "Humidité stagnante", state: editedHumidity, setState: setEditedHumidity },
                    { label: "Infiltration d'eau", state: editedInfiltration, setState: setEditedInfiltration },
                    { label: "Dégradation d'étanchéité", state: editedDegradation, setState: setEditedDegradation }
                  ].map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={item.state.detected}
                          onChange={(e) => item.setState({ ...item.state, detected: e.target.checked })}
                          className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500 cursor-pointer"
                        />
                      </div>
                      {item.state.detected && (
                        <div className="grid grid-cols-1 gap-2 pt-1 border-t border-slate-100 dark:border-slate-850">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase font-bold text-slate-500">Gravité:</span>
                            <select
                              value={item.state.severity}
                              onChange={(e) => item.setState({ ...item.state, severity: e.target.value as any })}
                              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded py-0.5 px-1.5 text-[10px] font-semibold cursor-pointer"
                            >
                              <option value="Faible">Faible</option>
                              <option value="Moyenne">Moyenne</option>
                              <option value="Élevée">Élevée</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            value={item.state.description}
                            onChange={(e) => item.setState({ ...item.state, description: e.target.value })}
                            placeholder="Description du défaut..."
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded px-2 py-1 text-[11px]"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsEditingDefects(false)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 rounded cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveEditedDefects}
                      className="px-3 py-1 text-[10px] font-bold uppercase text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3 h-3" /> Enregistrer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Risk Bar */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-800 dark:text-slate-300 font-bold">Coefficient de risque calculé :</span>
                      <span className={`text-sm font-extrabold ${getRiskColor(selectedInspection.riskScore).text}`}>
                        {selectedInspection.riskScore} / 10
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-800/80">
                      <div
                        className={`h-full rounded-full ${getRiskColor(selectedInspection.riskScore).progressBg}`}
                        style={{ width: `${selectedInspection.riskScore * 10}%` }}
                      />
                    </div>
                  </div>

                  {/* Defect Cards */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { label: "Fissures sur Dalle", field: selectedInspection.cracks },
                      { label: "Humidité stagnante", field: selectedInspection.humidity },
                      { label: "Infiltration d'eau", field: selectedInspection.infiltration },
                      { label: "Dégradation d'étanchéité", field: selectedInspection.degradation },
                    ].map((item, idx) => {
                      const detected = item.field?.detected || false;
                      const severity = item.field?.severity || "Aucune";
                      const description = item.field?.description || "Aucune anomalie détectée.";
                      const state = getRiskColor(detected ? (severity === "Élevée" ? 8 : severity === "Moyenne" ? 5 : 2) : 0);
                      return (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-start gap-3">
                          <div className="mt-0.5">
                            {detected ? (
                              <ShieldAlert className={`w-4 h-4 ${severity === "Élevée" ? "text-red-600" : "text-amber-600"}`} />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            )}
                          </div>
                          <div className="overflow-hidden flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 rounded ${state.bg} ${state.text}`}>
                                {detected ? `OUI - ${severity}` : "NON"}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-700 dark:text-slate-350 mt-1 font-normal leading-relaxed">
                              {description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* AI Summary Statement */}
            <div className="p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/30 rounded-xl space-y-1.5">
              <span className="text-[10.5px] font-extrabold text-sky-800 dark:text-sky-400 uppercase tracking-widest block">Note de synthèse IA :</span>
              <p className="text-[11.5px] text-sky-950 dark:text-sky-100 leading-relaxed font-normal">
                {selectedInspection.summary}
              </p>
            </div>

            {/* --- 2. BUREAU D'ETUDES SECTION (RECOMMENDATIONS) --- */}
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-300 uppercase tracking-widest">
                  🏢 Bureau d'études / Recommandations
                </h4>
                {(user.role === "Administrateur" || user.role === "Expert / Diagnostiqueur" || user.role === "Bureau d'études") && !isEditingRecs && (
                  <button
                    onClick={startEditingRecs}
                    className="px-2 py-1 text-[10px] font-bold uppercase bg-sky-500/10 hover:bg-sky-500 hover:text-white text-sky-600 dark:text-sky-400 rounded transition cursor-pointer"
                  >
                    Gérer
                  </button>
                )}
              </div>

              {isEditingRecs ? (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-sky-500/20 rounded-xl space-y-3">
                  <div className="space-y-1.5">
                    {editedRecommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded text-[11px]">
                        <span className="flex-1 leading-normal text-slate-800 dark:text-slate-200">{rec}</span>
                        <button
                          onClick={() => removeRecommendation(idx)}
                          className="text-rose-500 hover:text-rose-700 p-0.5"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRecommendation}
                      onChange={(e) => setNewRecommendation(e.target.value)}
                      placeholder="Ajouter une directive..."
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addRecommendation}
                      className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-1.5 border-t border-slate-200/40">
                    <button
                      onClick={() => setIsEditingRecs(false)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 rounded cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveEditedRecs}
                      className="px-3 py-1 text-[10px] font-bold uppercase text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3 h-3" /> Valider
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-1.5 bg-slate-50/50 dark:bg-slate-900/20 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  {(selectedInspection.recommendations || []).map((rec, idx) => (
                    <li key={idx} className="text-[11.5px] text-slate-800 dark:text-slate-200 flex items-start gap-2 leading-relaxed font-normal">
                      <span className="text-sky-600 dark:text-sky-400 font-extrabold shrink-0 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                  {(selectedInspection.recommendations || []).length === 0 && (
                    <span className="text-[11px] text-slate-450 italic">Aucune recommandation formulée pour le moment.</span>
                  )}
                </ul>
              )}
            </div>

            {/* --- 3. MAINTENANCE INTERVENTION SECTION --- */}
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-4 pb-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  🔧 Suivi de Chantier & Maintenance
                </h4>
                {(user.role === "Administrateur" || user.role === "Entreprise de maintenance") && !isEditingMaintenance && (
                  <button
                    onClick={startEditingMaintenance}
                    className="px-2 py-1 text-[10px] font-bold uppercase bg-sky-500/10 hover:bg-sky-500 hover:text-white text-sky-600 dark:text-sky-400 rounded transition cursor-pointer"
                  >
                    Mettre à jour
                  </button>
                )}
              </div>

              {isEditingMaintenance ? (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-sky-500/20 rounded-xl space-y-4">
                  {/* Progress Status Selection */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Statut d'Intervention :</span>
                    <select
                      value={editedMaintStatus}
                      onChange={(e) => setEditedMaintStatus(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded py-1 px-2.5 text-xs font-semibold cursor-pointer"
                    >
                      <option value="Non planifiée">Non planifiée</option>
                      <option value="Planifiée">Planifiée</option>
                      <option value="En cours">En cours de traitement</option>
                      <option value="Clôturée">Intervention Clôturée</option>
                    </select>
                  </div>

                  {/* Task checklist */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Actions à mener (Chantier) :</span>
                    {editedMaintTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => toggleMaintTask(t.id)}
                        className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded text-[11px] cursor-pointer hover:bg-slate-50/60"
                      >
                        <input
                          type="checkbox"
                          checked={t.completed}
                          readOnly
                          className="w-3.5 h-3.5 text-sky-500 rounded cursor-pointer"
                        />
                        <span className={`flex-1 ${t.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>{t.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Photo Logs simulator */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Photos de Chantier (Avant / Après) :</span>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {editedMaintPhotos.map((p) => (
                        <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/70 text-[8px] text-white p-1 text-center truncate">{p.label}</div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addMaintPhotoSimulate}
                        className="aspect-square rounded-lg border border-dashed border-slate-300 dark:border-slate-750 flex flex-col items-center justify-center gap-1 hover:border-sky-500 hover:text-sky-500 transition-all text-slate-400 text-[9px]"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Prendre photo</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1 border-t border-slate-200/40">
                    <button
                      onClick={() => setIsEditingMaintenance(false)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 rounded cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveEditedMaintenance}
                      className="px-3 py-1 text-[10px] font-bold uppercase text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3 h-3" /> Valider
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50/50 dark:bg-slate-900/20 p-3 rounded-xl border border-slate-100 dark:border-slate-850 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Statut d'intervention :</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${
                      selectedInspection.maintenanceStatus === "Clôturée"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : selectedInspection.maintenanceStatus === "En cours"
                          ? "bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400"
                          : selectedInspection.maintenanceStatus === "Planifiée"
                            ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400"
                    }`}>
                      {selectedInspection.maintenanceStatus || "Non planifiée"}
                    </span>
                  </div>

                  {/* Task completions list */}
                  {selectedInspection.maintenanceTasks && selectedInspection.maintenanceTasks.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/40">
                      <span className="text-[9.5px] uppercase font-bold text-slate-400">Suivi des tâches :</span>
                      {selectedInspection.maintenanceTasks.map((t) => (
                        <div key={t.id} className="flex items-center gap-2 text-[10.5px]">
                          <Check className={`w-3.5 h-3.5 ${t.completed ? "text-emerald-500 font-bold" : "text-slate-300"}`} />
                          <span className={t.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-350"}>{t.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Photos list */}
                  {selectedInspection.maintenancePhotos && selectedInspection.maintenancePhotos.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/40">
                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Galerie de chantier ({selectedInspection.maintenancePhotos.length}) :</span>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedInspection.maintenancePhotos.map((p) => (
                          <div key={p.id} className="aspect-square rounded border border-slate-200/60 dark:border-slate-800 overflow-hidden relative" title={p.label}>
                            <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 space-y-2 shrink-0">
            {/* Main Primary Row: PDF & Map */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDownloadPDF(false)}
                className="bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-sky-500 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Télécharger PDF
              </button>
              <button
                onClick={() => {
                  if (onViewOnMap && selectedInspection) {
                    onViewOnMap(selectedInspection);
                  } else {
                    onNavigateToMap();
                  }
                }}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-sky-500" />
                Localiser sur la Carte SIG
              </button>
            </div>

            {/* Secondary Row: Share & Print */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/report/${selectedInspection.id}`;
                  navigator.clipboard.writeText(shareUrl);
                  setToastMessage("Lien de pré-diagnostic copié avec succès !");
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/50 dark:border-slate-800/80"
              >
                <Share2 className="w-4 h-4 text-emerald-500" />
                Partager
              </button>
              <button
                onClick={() => handleDownloadPDF(true)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/50 dark:border-slate-800/80"
              >
                <Printer className="w-4 h-4 text-amber-500" />
                Imprimer
              </button>
            </div>
          </div>

        </div>
      </>)}
    </>
  ) : (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#030712]/10 overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-8 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-[#070b19]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="w-7 h-7 text-[#0ea5e9] animate-pulse" />
                  Historique des Interventions
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-normal mt-1">
                  Suivi complet et traçabilité des opérations de maintenance et rénovations d'étanchéité de BatiSmart Roof IA.
                </p>
              </div>

              {/* Beautiful Sub-tab Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-900/85 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 shadow-inner self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("inspections")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeSubTab === "inspections"
                      ? "bg-[#0ea5e9] text-white shadow-md shadow-sky-500/10"
                      : "text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspections ({filtered.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("interventions")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeSubTab === "interventions"
                      ? "bg-[#0ea5e9] text-white shadow-md shadow-sky-500/10"
                      : "text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-500" />
                  <span>Interventions ({interventions.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interventions Content Split Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side: Register Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bento-card p-6 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-[#070b19]/40 rounded-2xl shadow-sm">
                <div className="mb-5 pb-3 border-b border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                    🛠️ Formulaire d'enregistrement
                  </span>
                  <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                    Enregistrer une nouvelle intervention
                  </h3>
                </div>

                <form onSubmit={handleSaveInterventionSubmit} className="space-y-4">
                  {/* Select Building */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Sélectionner le bâtiment</label>
                    <select
                      value={selectedBuildingInterv}
                      onChange={(e) => setSelectedBuildingInterv(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                      required
                    >
                      <option value="" disabled>-- Choisir un édifice --</option>
                      {buildingNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Intervention Type & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Type d'opération</label>
                      <select
                        value={intervType}
                        onChange={(e) => setIntervType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                        required
                      >
                        <option value="Rénovation complète étanchéité">Rénovation complète étanchéité</option>
                        <option value="Colmatage des fissures">Colmatage des fissures</option>
                        <option value="Séchage & Nettoyage d'humidité">Séchage & Nettoyage d'humidité</option>
                        <option value="Changement de membrane d'étanchéité">Changement de membrane d'étanchéité</option>
                        <option value="Réfection pluviale (Évacuations)">Réfection pluviale (Évacuations)</option>
                        <option value="Maintenance préventive / Nettoyage">Maintenance préventive / Nettoyage</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Date des travaux</label>
                      <input
                        type="date"
                        value={intervDate}
                        onChange={(e) => setIntervDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Contractor & Supervisor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Entreprise partenaire</label>
                      <input
                        type="text"
                        value={intervCompany}
                        onChange={(e) => setIntervCompany(e.target.value)}
                        placeholder="Ex: SARL Algérie Étanchéité"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Responsable / Ingénieur</label>
                      <input
                        type="text"
                        value={intervResponsible}
                        onChange={(e) => setIntervResponsible(e.target.value)}
                        placeholder="Ex: M. Benahmed Yacine"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Duration & Cost */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Durée des travaux</label>
                      <input
                        type="text"
                        value={intervDuration}
                        onChange={(e) => setIntervDuration(e.target.value)}
                        placeholder="Ex: 5 jours, 2 semaines"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Coût estimatif (DA)</label>
                      <input
                        type="text"
                        value={intervCost}
                        onChange={(e) => setIntervCost(e.target.value)}
                        placeholder="Ex: 450 000 DA"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Before & After Photos with Gallery & Upload options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Photo Avant */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block flex items-center justify-between">
                        <span>Photo Avant (Dégradations)</span>
                        {intervPhotoBefore && (
                          <button
                            type="button"
                            onClick={() => setIntervPhotoBefore("")}
                            className="text-[10px] text-rose-500 hover:text-rose-600 font-bold"
                          >
                            Effacer
                          </button>
                        )}
                      </label>
                      
                      {/* Image Preview */}
                      <div className="aspect-video w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden flex flex-col items-center justify-center text-center p-3 group">
                        {intervPhotoBefore ? (
                          <>
                            <img src={intervPhotoBefore} alt="Aperçu Avant" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setGalleryPickerTarget("before")}
                                className="bg-white/95 dark:bg-slate-950/95 text-slate-800 dark:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold shadow transition"
                              >
                                Changer de photo
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-1 text-slate-400 dark:text-slate-500">
                            <ImageIcon className="w-6 h-6 mx-auto opacity-60" />
                            <span className="text-[10px] block font-light">Aucune photo sélectionnée</span>
                          </div>
                        )}
                      </div>

                      {/* Photo actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setGalleryPickerTarget("before")}
                          className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
                          <span>Galerie</span>
                        </button>

                        <label className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLocalImageUpload(e, "before")}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        value={intervPhotoBefore}
                        onChange={(e) => setIntervPhotoBefore(e.target.value)}
                        placeholder="Ou coller l'URL d'une image"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-[10px] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* Photo Après */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block flex items-center justify-between">
                        <span>Photo Après (Réparations)</span>
                        {intervPhotoAfter && (
                          <button
                            type="button"
                            onClick={() => setIntervPhotoAfter("")}
                            className="text-[10px] text-rose-500 hover:text-rose-600 font-bold"
                          >
                            Effacer
                          </button>
                        )}
                      </label>
                      
                      {/* Image Preview */}
                      <div className="aspect-video w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden flex flex-col items-center justify-center text-center p-3 group">
                        {intervPhotoAfter ? (
                          <>
                            <img src={intervPhotoAfter} alt="Aperçu Après" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setGalleryPickerTarget("after")}
                                className="bg-white/95 dark:bg-slate-950/95 text-slate-800 dark:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold shadow transition"
                              >
                                Changer de photo
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-1 text-slate-400 dark:text-slate-500">
                            <ImageIcon className="w-6 h-6 mx-auto opacity-60" />
                            <span className="text-[10px] block font-light">Aucune photo sélectionnée</span>
                          </div>
                        )}
                      </div>

                      {/* Photo actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setGalleryPickerTarget("after")}
                          className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
                          <span>Galerie</span>
                        </button>

                        <label className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLocalImageUpload(e, "after")}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        value={intervPhotoAfter}
                        onChange={(e) => setIntervPhotoAfter(e.target.value)}
                        placeholder="Ou coller l'URL d'une image"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-[10px] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  {/* Description of work */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Description détaillée des travaux *</label>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Exemples rapides :</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-1">
                      <button
                        type="button"
                        onClick={() => setIntervDescription("Décapage de l'ancienne membrane, nettoyage haute pression, application du primaire d'accrochage et pose de 2 couches de résine SEL avec pontage armé des fissures et acrotères.")}
                        className="text-[10px] bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-lg transition"
                      >
                        ⚡ SEL & Résine
                      </button>
                      <button
                        type="button"
                        onClick={() => setIntervDescription("Ouverture des fissures en V, injection de mastic polyuréthane élastomère, entoilage des relevés d'étanchéité et réfection des solins de finition.")}
                        className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-lg transition"
                      >
                        ⚡ Traitement Fissures
                      </button>
                      <button
                        type="button"
                        onClick={() => setIntervDescription("Nettoyage complet de la toiture-terrasse, débouchage des crapaudines et descentes d'eaux pluviales (EP), élimination des eaux stagnantes et vérification des noues.")}
                        className="text-[10px] bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-lg transition"
                      >
                        ⚡ Curage EP & Evacuation
                      </button>
                    </div>

                    <textarea
                      value={intervDescription}
                      onChange={(e) => setIntervDescription(e.target.value)}
                      placeholder="Exemple : Décapage de la membrane altérée, ponçage de la dalle, application d'un primaire polyuréthane et traitement des relevés d'acrotères..."
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500 resize-none"
                      required
                    />
                  </div>

                  {/* Buttons & Alerts */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-xs py-3 rounded-xl transition shadow-md duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-300 animate-pulse" />
                      Enregistrer l'Intervention
                    </button>

                    {intervSuccess && (
                      <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 border border-emerald-500/20 rounded-xl text-center animate-fade-in">
                        ✅ Intervention enregistrée avec succès dans l'historique !
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right side: Interventions Timeline list */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bento-card p-6 flex flex-col h-full bg-white dark:bg-[#070b19]/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                      Chronologie des opérations
                    </span>
                    <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mt-0.5">
                      Historique de maintenance de : <span className="text-sky-500 font-extrabold">{selectedBuildingInterv || "Aucun bâtiment sélectionné"}</span>
                    </h3>
                  </div>
                  <span className="text-xs bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full text-sky-600 dark:text-sky-400 font-extrabold shrink-0">
                    {interventions.filter((i) => i.buildingName === selectedBuildingInterv).length} opérations
                  </span>
                </div>

                {/* Timeline Items */}
                <div className="space-y-6 flex-1 pr-1 overflow-y-auto max-h-[60vh]">
                  {interventions.filter((i) => i.buildingName === selectedBuildingInterv).length > 0 ? (
                    interventions
                      .filter((i) => i.buildingName === selectedBuildingInterv)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((interv) => (
                        <div key={interv.id} className="relative flex gap-4 pl-4 border-l-2 border-sky-500/25 dark:border-sky-800/40 pb-4 last:pb-0">
                          {/* Circle indicator */}
                          <div className="absolute -left-[7px] top-1.5 w-3 h-3 bg-white dark:bg-slate-950 border-2 border-sky-500 rounded-full shadow-sm" />
                          
                          <div className="flex-1 space-y-3 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 hover:border-sky-500/25 transition duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
                              <div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{interv.type}</span>
                                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-sky-500" />
                                  <span>Rapporté le {new Date(interv.date).toLocaleDateString("fr-FR")}</span>
                                </div>
                              </div>
                              <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-600 dark:text-emerald-400 font-bold font-mono self-start sm:self-auto">
                                {interv.estimatedCost}
                              </span>
                            </div>

                            {/* Details meta grid */}
                            <div className="grid grid-cols-2 gap-4 text-[11px] bg-white dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-150/50 dark:border-slate-850/50">
                              <div>
                                <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-bold">Entreprise</span>
                                <span className="font-semibold text-slate-850 dark:text-slate-200">{interv.company}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-bold">Responsable</span>
                                <span className="font-semibold text-slate-850 dark:text-slate-200">{interv.responsible}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-bold">Durée de chantier</span>
                                <span className="font-semibold text-slate-850 dark:text-slate-200">{interv.duration}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-bold">Statut travaux</span>
                                <span className="text-emerald-550 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                  Clôturé avec succès
                                </span>
                              </div>
                            </div>

                            {/* Description block */}
                            <div className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/30 p-3 rounded-xl border border-slate-150/40 dark:border-slate-850/40">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Description des travaux</span>
                              {interv.description}
                            </div>

                            {/* Before / After Photos side-by-side */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block text-center bg-rose-500/10 text-rose-600 dark:text-rose-400 py-0.5 rounded">Avant intervention</span>
                                <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-850 relative">
                                  <img src={interv.photoBefore} alt="Avant travaux" className="w-full h-full object-cover" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block text-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-0.5 rounded">Après intervention</span>
                                <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-850 relative">
                                  <img src={interv.photoAfter} alt="Après travaux" className="w-full h-full object-cover" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/10 h-64">
                      <div className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-450 rounded-2xl mb-3">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Aucune intervention enregistrée</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs leading-normal">
                        Utilisez le formulaire à gauche pour enregistrer les premiers travaux réalisés sur la toiture de cet édifice.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (() => {
        const msg = toastMessage.toLowerCase();
        const isSuccess = msg.includes("succès") || msg.includes("copié") || msg.includes("optimisée") || msg.includes("enregistré") || msg.includes("lancé");
        const isLoading = msg.includes("génération") || msg.includes("optimisation") || msg.includes("préparation") || msg.includes("cours");
        const isError = msg.includes("échec") || msg.includes("erreur") || msg.includes("impossible") || msg.includes("échoué");

        let bgClass = "bg-slate-50/90 dark:bg-slate-900/90";
        let textClass = "text-slate-800 dark:text-slate-200";
        let borderClass = "border-slate-200 dark:border-slate-800/80";
        let IconComponent = <Info className="w-4.5 h-4.5 text-sky-500 shrink-0" />;

        if (isSuccess) {
          bgClass = "bg-emerald-50/90 dark:bg-emerald-950/90";
          textClass = "text-emerald-800 dark:text-emerald-200";
          borderClass = "border-emerald-200 dark:border-emerald-800/80";
          IconComponent = <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />;
        } else if (isLoading) {
          bgClass = "bg-sky-50/90 dark:bg-sky-950/90";
          textClass = "text-sky-800 dark:text-sky-200";
          borderClass = "border-sky-200 dark:border-sky-800/80";
          IconComponent = <Loader2 className="w-4.5 h-4.5 text-sky-500 animate-spin shrink-0" />;
        } else if (isError) {
          bgClass = "bg-rose-50/90 dark:bg-rose-950/90";
          textClass = "text-rose-800 dark:text-rose-200";
          borderClass = "border-rose-200 dark:border-rose-800/80";
          IconComponent = <ShieldAlert className="w-4.5 h-4.5 text-rose-500 shrink-0" />;
        }

        return (
          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${bgClass} ${textClass} px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-3 border ${borderClass} backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-[90vw] md:max-w-md`}>
            {IconComponent}
            <span className="text-xs font-bold leading-tight">{toastMessage}</span>
          </div>
        );
      })()}

      {/* PDF Download and Share Assistant Modal */}
      {selectedInspection && (
        <PdfDownloadModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          inspection={selectedInspection}
          showToast={setToastMessage}
        />
      )}

      {/* Dynamic Reference Gallery Modal */}
      {galleryPickerTarget && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#070b19] border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-extrabold text-sky-500 uppercase tracking-widest block">Médiathèque technique BatiSmart</span>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mt-0.5">
                  Galerie de photos de chantier • {galleryPickerTarget === "before" ? "Avant Travaux" : "Après Rénovation"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGalleryPickerTarget(null)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Selector Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                Sélectionnez un cliché d'étanchéité réel issu de la base de référence de l'Université de Béjaïa pour illustrer l'intervention :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(galleryPickerTarget === "before" ? GALLERY_IMAGES.before : GALLERY_IMAGES.after).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (galleryPickerTarget === "before") {
                        setIntervPhotoBefore(img.url);
                      } else {
                        setIntervPhotoAfter(img.url);
                      }
                      setGalleryPickerTarget(null);
                      setToastMessage(`Image "${img.title}" sélectionnée avec succès !`);
                    }}
                    className="group border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 hover:border-sky-500 dark:hover:border-sky-500/80 cursor-pointer shadow-sm hover:shadow transition duration-300 flex flex-col"
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-200 shrink-0">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow">Choisir cette photo</span>
                      </div>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-sky-500 transition">{img.title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-light mt-1">{img.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-400">Cliquez sur un cliché pour l'appliquer.</span>
              <button
                type="button"
                onClick={() => setGalleryPickerTarget(null)}
                className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

}
