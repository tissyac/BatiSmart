import React, { useState, useEffect, useMemo } from "react";
import { Shield, ShieldAlert, ShieldCheck, Activity, BarChart3, AlertTriangle, Building, HelpCircle, MapPin, ArrowRight, Lock, TrendingUp, TrendingDown, Minus, Calendar, AlertCircle, Sparkles, Wrench, Upload, Image as ImageIcon, X, FileText, Users } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { getBuildingHistory, comparePathologies, generateEvolutionSummary, BuildingHistoryPoint } from "../utils/historyHelper";
import { Inspection, UserProfile, Intervention } from "../types";
import { getEconomicAnalysis, formatDA, BUILDING_STATES, INTERVENTION_TYPES, BuildingState, InterventionType, getDefaultBuildingState, getDefaultInterventionType } from "../utils/budgetHelper";
import { PdfDownloadModal } from "./PdfDownloadModal";

const GALLERY_IMAGES = {
  before: [
    {
      title: "Fissures Majeures d'Étanchéité",
      url: "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=600&q=80",
      desc: "Fissures thermiques structurelles sur joints d'étanchéité"
    },
    {
      title: "Eau stagnante massive",
      url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
      desc: "Humidité stagnante due à un défaut de pente de dalle"
    },
    {
      title: "Infiltration de dalle active",
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      desc: "Traces de pénétration d'eau sous forme d'auréoles"
    },
    {
      title: "Bitume craquelé ou pelé",
      url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=600&q=80",
      desc: "Membrane d'étanchéité d'origine brûlée et boursouflée"
    },
    {
      title: "Mousse & Végétation",
      url: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=600&q=80",
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
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
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
      url: "https://images.unsplash.com/photo-1628533602410-b9df701fb61a?auto=format&fit=crop&w=600&q=80",
      desc: "Ragréage et hydrofugation complète de la dalle supérieure"
    }
  ]
};

interface DashboardScreenProps {
  inspections: Inspection[];
  onViewInspection: (inspection: Inspection) => void;
  onViewOnMap?: (inspection: Inspection) => void;
  onNavigateToScan: () => void;
  user: UserProfile;
  onFilterNavigate?: (severity: string) => void;
  interventions?: Intervention[];
  onAddIntervention?: (newIntervention: Intervention) => void;
  onUpdateInspection?: (updatedIns: Inspection) => void;
}

export default function DashboardScreen({
  inspections,
  onViewInspection,
  onViewOnMap,
  onNavigateToScan,
  user,
  onFilterNavigate,
  interventions = [],
  onAddIntervention,
  onUpdateInspection,
}: DashboardScreenProps) {
  const handleCardClick = (severity: string) => {
    if (onFilterNavigate) {
      onFilterNavigate(severity);
    }
  };

  // State & Data Setup for Risk Evolution
  const buildingNames = useMemo(() => {
    return Array.from(new Set(inspections.map((ins) => ins.buildingName))).filter(Boolean);
  }, [inspections]);

  const [selectedBuilding, setSelectedBuilding] = useState<string>(() => {
    return buildingNames[0] || (inspections[0]?.buildingName) || "";
  });

  const [selectedInspectionId, setSelectedInspectionId] = useState<string>("");

  const allInspectionsSorted = useMemo(() => {
    return [...inspections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [inspections]);

  const buildingInspections = useMemo(() => {
    return inspections
      .filter((ins) => ins.buildingName === selectedBuilding)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [inspections, selectedBuilding]);

  const historyPoints = useMemo(() => {
    return getBuildingHistory(selectedBuilding, inspections);
  }, [selectedBuilding, inspections]);

  const [clickedPoint, setClickedPoint] = useState<BuildingHistoryPoint | null>(null);
  const [customSurfaces, setCustomSurfaces] = useState<Record<string, number>>({});
  const [customBuildingStates, setCustomBuildingStates] = useState<Record<string, BuildingState>>({});
  const [customInterventionTypes, setCustomInterventionTypes] = useState<Record<string, InterventionType>>({});

  const [activeLines, setActiveLines] = useState<Record<string, boolean>>({
    riskScore: true,
    cracks: false,
    humidity: false,
    infiltration: false,
    degradation: false,
    corrosion: false,
    deformation: false,
    aging: false,
  });

  const toggleLine = (key: string) => {
    setActiveLines((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (!Object.values(updated).includes(true)) {
        return prev;
      }
      return updated;
    });
  };

  const severityMap: Record<string, number> = {
    "Aucune": 0,
    "Faible": 3,
    "Moyenne": 6,
    "Élevée": 9,
  };

  const chartData = useMemo(() => {
    return historyPoints.map((pt) => ({
      ...pt,
      cracksVal: severityMap[pt.cracks?.severity || "Aucune"] ?? 0,
      humidityVal: severityMap[pt.humidity?.severity || "Aucune"] ?? 0,
      infiltrationVal: severityMap[pt.infiltration?.severity || "Aucune"] ?? 0,
      degradationVal: severityMap[pt.degradation?.severity || "Aucune"] ?? 0,
      corrosionVal: severityMap[pt.corrosion?.severity || "Aucune"] ?? 0,
      deformationVal: severityMap[pt.deformation?.severity || "Aucune"] ?? 0,
      agingVal: severityMap[pt.aging?.severity || "Aucune"] ?? 0,
    }));
  }, [historyPoints]);

  // Sync selectedInspectionId with the latest diagnostic of the selected building
  useEffect(() => {
    if (buildingInspections.length > 0) {
      setSelectedInspectionId((prev) => {
        // If previous selected ID is still valid for this building, keep it, otherwise default to latest
        const isValid = buildingInspections.some(ins => ins.id === prev);
        return isValid ? prev : buildingInspections[0].id;
      });
    } else {
      setSelectedInspectionId("");
    }
  }, [selectedBuilding, buildingInspections]);

  // Sync clickedPoint with the selected diagnostic
  useEffect(() => {
    if (selectedInspectionId) {
      const match = historyPoints.find((pt) => pt.id === selectedInspectionId);
      if (match) {
        setClickedPoint(match);
      }
    }
  }, [selectedInspectionId, historyPoints]);

  useEffect(() => {
    if (buildingNames.length > 0 && !buildingNames.includes(selectedBuilding)) {
      setSelectedBuilding(buildingNames[0]);
    }
  }, [buildingNames, selectedBuilding]);

  const latestPointOriginal = historyPoints[historyPoints.length - 1];
  const latestPoint = historyPoints.find((pt) => pt.id === selectedInspectionId) || latestPointOriginal;
  const latestPointIndex = latestPoint ? historyPoints.findIndex((pt) => pt.id === latestPoint.id) : -1;
  const previousPoint = latestPointIndex > 0 ? historyPoints[latestPointIndex - 1] : null;

  const latestScore = latestPoint ? latestPoint.riskScore : 0;
  const previousScore = previousPoint ? previousPoint.riskScore : 0;

  const scoreDiff = previousPoint ? Number((latestScore - previousScore).toFixed(1)) : 0;

  let trendIcon = <Sparkles className="w-4 h-4 text-sky-500" />;
  let trendText = previousPoint ? "Stable" : "1er prédiagnostic";
  let trendColor = previousPoint ? "text-slate-500 bg-slate-100 dark:bg-slate-900" : "text-sky-600 bg-sky-50 dark:bg-sky-950/30";

  if (previousPoint) {
    if (scoreDiff > 0) {
      trendIcon = <TrendingUp className="w-4 h-4 text-red-500" />;
      trendText = "Dégradation";
      trendColor = "text-red-500 bg-red-50 dark:bg-red-950/30";
    } else if (scoreDiff < 0) {
      trendIcon = <TrendingDown className="w-4 h-4 text-emerald-500" />;
      trendText = "Amélioration";
      trendColor = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
    } else {
      trendIcon = <Minus className="w-4 h-4 text-slate-500" />;
    }
  }

  const pathologiesDiff = latestPoint ? comparePathologies(previousPoint, latestPoint) : [];
  const aiEvolutionSummary = latestPoint ? generateEvolutionSummary(previousPoint, latestPoint, pathologiesDiff) : "";

  const latestInspection = inspections.find((ins) => ins.id === (latestPoint?.id || selectedInspectionId)) || inspections.find((ins) => ins.id === latestPointOriginal?.id);
  const activeInspection = latestInspection;

  const getAiProposedDecision = (score: number, diff: number) => {
    if (score >= 9.0) {
      return {
        decision: "🚨 Inspection urgente par un expert",
        justification: `Le score de risque est extrêmement critique (${score.toFixed(1)}/10). Une inspection urgente par un bureau d'études spécialisé ou un expert qualifié est requise immédiatement afin de parer à tout risque d'effondrement ou d'infiltration généralisée.`
      };
    } else if (score >= 6.0) {
      return {
        decision: "🔴 Intervention corrective recommandée",
        justification: `Le score de risque de ${score.toFixed(1)}/10 est élevé avec présence de pathologies sévères. Une intervention corrective (réfection complète ou partielle du complexe d'étanchéité, traitement structurel des fissures) est fortement recommandée dans les plus brefs délais.`
      };
    } else if (score >= 3.0) {
      if (diff > 0) {
        return {
          decision: "🟠 Maintenance préventive recommandée",
          justification: `Le niveau de risque est modéré (${score.toFixed(1)}/10) mais affiche une tendance à la hausse (+${diff.toFixed(1)}). Une maintenance préventive (Cool Roof, pontage local de fissures d'acrotères, nettoyage des évacuations) est recommandée pour stopper la dégradation.`
        };
      } else {
        return {
          decision: "🟡 Surveillance recommandée",
          justification: `Le niveau de risque est modéré (${score.toFixed(1)}/10) et montre une tendance stable ou en amélioration. Une surveillance régulière à l'approche de la saison des pluies est préconisée.`
        };
      }
    } else {
      return {
        decision: "🟢 Aucune intervention nécessaire",
        justification: `L'état de la toiture-terrasse est excellent (score de ${score.toFixed(1)}/10). Aucune anomalie active n'est à signaler. Poursuivre le programme d'entretien annuel régulier.`
      };
    }
  };

  // Expert validation state
  const [expertStatus, setExpertStatus] = useState<"Validé" | "À vérifier" | "Refusé">("À vérifier");
  const [expertNameInput, setExpertNameInput] = useState<string>("");
  const [expertOrgInput, setExpertOrgInput] = useState<string>("");
  const [expertDateInput, setExpertDateInput] = useState<string>("");
  const [expertCommentsInput, setExpertCommentsInput] = useState<string>("");
  const [expertSignatureData, setExpertSignatureData] = useState<string>("");
  const [validationSuccess, setValidationSuccess] = useState<boolean>(false);

  // PDF Modal state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfModalTarget, setPdfModalTarget] = useState<Inspection | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamically compute all interventions for the current building/inspection from props + localStorage
  const matchingInterventions = useMemo(() => {
    const allIntervMap = new Map<string, Intervention>();
    (interventions || []).forEach(inv => {
      if (inv && inv.id) allIntervMap.set(inv.id, inv);
    });

    try {
      const stored = localStorage.getItem("batismart_interventions");
      if (stored) {
        const parsed: Intervention[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach(inv => {
            if (inv && inv.id) allIntervMap.set(inv.id, inv);
          });
        }
      }
    } catch (e) {}

    const list = Array.from(allIntervMap.values());
    const normSel = (selectedBuilding || "").trim().toLowerCase();
    const normInspB = (latestInspection?.buildingName || "").trim().toLowerCase();

    return list.filter((i) => {
      if (!i) return false;
      const normIntervB = (i.buildingName || "").trim().toLowerCase();
      const matchName = normSel && normIntervB && (
        normIntervB === normSel ||
        normIntervB.includes(normSel) ||
        normSel.includes(normIntervB) ||
        (normInspB && normIntervB === normInspB)
      );
      const matchInspection = latestInspection && i.linkedInspectionId === latestInspection.id;
      return matchName || matchInspection;
    });
  }, [interventions, selectedBuilding, latestInspection]);

  // Drawing Canvas Signature Pad states
  const signatureCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Sync state when selected building or inspections change
  useEffect(() => {
    if (latestInspection) {
      setExpertStatus(latestInspection.expertDecisionStatus || "À vérifier");
      setExpertNameInput(latestInspection.expertName || user.displayName || "");
      setExpertOrgInput(latestInspection.expertOrganization || "Contrôle Technique de Construction (CTC)");
      setExpertDateInput(latestInspection.expertValidationDate ? latestInspection.expertValidationDate.split("T")[0] : new Date().toISOString().split("T")[0]);
      setExpertCommentsInput(latestInspection.expertComments || "");
      setExpertSignatureData(latestInspection.expertSignature || "");
    }
  }, [selectedBuilding, inspections, latestInspection, user.displayName]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1e3a8a"; // Royal Blue ink color
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();

    if ('touches' in e) {
      e.preventDefault();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      setExpertSignatureData(canvas.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setExpertSignatureData("");
  };

  const handleSaveExpertValidation = () => {
    if (!latestInspection) return;

    const { decision, justification } = getAiProposedDecision(latestScore, scoreDiff);
    const defaultEcon = getEconomicAnalysis(latestInspection);
    const userSurface = customSurfaces[selectedBuilding] !== undefined 
      ? customSurfaces[selectedBuilding] 
      : (latestInspection.customSurface || defaultEcon.roofSurface);

    const updatedInspection: Inspection = {
      ...latestInspection,
      expertDecisionStatus: expertStatus,
      expertName: expertNameInput,
      expertOrganization: expertOrgInput,
      expertValidationDate: expertDateInput + "T12:00:00Z",
      expertComments: expertCommentsInput,
      expertSignature: expertSignatureData,
      aiProposedDecision: decision,
      aiProposedJustification: justification,
      customSurface: userSurface,
    };

    if (onUpdateInspection) {
      onUpdateInspection(updatedInspection);
    }

    // Direct localStorage backup sync for inspections
    try {
      const rawIns = localStorage.getItem("batismart_inspections");
      if (rawIns) {
        const parsed: Inspection[] = JSON.parse(rawIns);
        const idx = parsed.findIndex(i => i.id === updatedInspection.id);
        if (idx >= 0) {
          parsed[idx] = updatedInspection;
          localStorage.setItem("batismart_inspections", JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.error("Error updating inspection in storage:", e);
    }

    setValidationSuccess(true);
    setTimeout(() => setValidationSuccess(false), 5000);
  };

  // Intervention form states
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
      }
    };
    reader.readAsDataURL(file);
  };

  // Form auto-fill helper for quick intervention recording
  const handleQuickFillIntervention = () => {
    setIntervType("Rénovation complète étanchéité");
    setIntervDate(new Date().toISOString().split("T")[0]);
    setIntervDescription("Décapage de la membrane dégradée, pose d'un complexe bi-couche élastomère armé SBS avec étanchéification renforcée des acrotères.");
    setIntervCompany("Béjaïa Étanchéité Services (CTC)");
    setIntervResponsible(user?.displayName || "Ingénieur Suivi");
    setIntervDuration("3 jours");
    setIntervCost("450 000 DA");
    setIntervPhotoBefore("https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=400&q=80");
    setIntervPhotoAfter("https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=400&q=80");
  };

  const handleSaveInterventionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetInsp = activeInspection || latestInspection;

    const newInterv: Intervention = {
      id: "inter_" + Math.random().toString(36).substr(2, 9),
      buildingName: selectedBuilding || targetInsp?.buildingName || "Bâtiment Public",
      linkedInspectionId: targetInsp?.id || "",
      date: intervDate || new Date().toISOString().split("T")[0],
      type: intervType || "Travaux de réhabilitation d'étanchéité",
      description: intervDescription || "Travaux de maintenance et de réhabilitation d'urgence exécutés sur la toiture.",
      company: intervCompany || "Entreprise Spécialisée",
      responsible: intervResponsible || user?.displayName || "Responsable Suivi",
      duration: intervDuration || "2 jours",
      estimatedCost: intervCost || "350 000 DA",
      photoBefore: intervPhotoBefore || "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=400&q=80",
      photoAfter: intervPhotoAfter || "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=400&q=80"
    };

    if (onAddIntervention) {
      onAddIntervention(newInterv);
    }

    // Direct localStorage backup sync so interventions are persisted instantly
    try {
      const stored = localStorage.getItem("batismart_interventions");
      const existing: Intervention[] = stored ? JSON.parse(stored) : [];
      existing.push(newInterv);
      localStorage.setItem("batismart_interventions", JSON.stringify(existing));
    } catch (err) {
      console.error("Error saving intervention to storage:", err);
    }

    setIntervSuccess(true);
    setIntervDescription("");
    setIntervCompany("");
    setIntervResponsible("");
    setIntervDuration("");
    setIntervCost("");
    setIntervPhotoBefore("");
    setIntervPhotoAfter("");
    setTimeout(() => setIntervSuccess(false), 4000);
  };

  const getScoreBadgeInfo = (score: number) => {
    if (score >= 9.0) return { label: "Risque critique", color: "text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/40", hex: "#ef4444" };
    if (score >= 6.0) return { label: "Risque élevé", color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/40", hex: "#f97316" };
    if (score >= 3.0) return { label: "Risque modéré", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40", hex: "#f59e0b" };
    return { label: "Risque faible", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40", hex: "#10b981" };
  };

  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined) return null;
    const score = payload.riskScore;
    let color = "#10b981";
    if (score >= 9.0) color = "#ef4444";
    else if (score >= 6.0) color = "#f97316";
    else if (score >= 3.0) color = "#f59e0b";
    
    return (
      <circle
        key={payload.id + "_dot"}
        cx={cx}
        cy={cy}
        r={6}
        fill={color}
        stroke="#ffffff"
        strokeWidth={2}
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }}
      />
    );
  };

  const handlePointClick = (state: any) => {
    if (state && state.activePayload && state.activePayload[0]) {
      const point = state.activePayload[0].payload as BuildingHistoryPoint;
      setClickedPoint(point);
    }
  };

  // Stats calculations
  const totalInspected = inspections.length;
  const uniqueBuildingNames = Array.from(new Set(inspections.map((ins) => ins.buildingName.trim().toLowerCase())));
  const criticalAlerts = inspections.filter((ins) => ins.riskScore >= 7.0).length;
  const mediumAlerts = inspections.filter((ins) => ins.riskScore >= 4.0 && ins.riskScore < 7.0).length;
  const secureRoofs = inspections.filter((ins) => ins.riskScore < 4.0).length;

  const averageRiskScore =
    totalInspected > 0
      ? Number((inspections.reduce((acc, curr) => acc + curr.riskScore, 0) / totalInspected).toFixed(1))
      : 0.0;

  // Most critical inspections first
  const criticalInspections = [...inspections]
    .filter((ins) => ins.riskScore >= 6.0)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  // Helper for color-coding risk scores
  const getRiskColor = (score: number) => {
    if (score >= 7.0) return { 
      bg: "bg-red-50 dark:bg-red-950/40", 
      text: "text-red-700 dark:text-red-400", 
      border: "border-red-200 dark:border-red-900/40" 
    };
    if (score >= 4.0) return { 
      bg: "bg-amber-50 dark:bg-amber-950/40", 
      text: "text-amber-700 dark:text-amber-400", 
      border: "border-amber-200 dark:border-amber-900/40" 
    };
    return { 
      bg: "bg-emerald-50 dark:bg-emerald-950/40", 
      text: "text-emerald-700 dark:text-emerald-400", 
      border: "border-emerald-200 dark:border-emerald-900/40" 
    };
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto h-screen w-full font-sans text-slate-700 dark:text-slate-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">Tableau de Bord National</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-light">
            Analyse prédictive et suivi en temps réel de l'étanchéité du patrimoine bâti public algérien.
          </p>
          <div className="flex items-center gap-2.5 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-450 border border-sky-500/20 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              Prototype en Phase de Validation & Expérimentation
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 shadow-xs">
              <Users className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Utilisateurs actifs : 3
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-xs">
              <Activity className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              69 Wilayas d'Algérie
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto w-full md:w-auto">
          {/* Quick Launch Inspection Button */}
          <button
            onClick={onNavigateToScan}
            className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold text-xs py-3 px-5 rounded-xl transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 border border-sky-400/20 cursor-pointer hover:-translate-y-0.5 duration-300 w-full sm:w-auto"
          >
            <Activity className="w-4 h-4 animate-pulse text-sky-200" />
            Lancer un Prédiagnostic IA
          </button>

          {/* Quick Access to Interventions History */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("maintenance-history-card");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="bg-slate-800 hover:bg-slate-950 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-100 font-semibold text-xs py-3 px-5 rounded-xl transition border border-slate-700 dark:border-slate-800 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 duration-300 w-full sm:w-auto shadow-md"
          >
            <Wrench className="w-4 h-4 text-amber-500 animate-pulse" />
            Historique des Interventions 🛠️
          </button>
        </div>
      </div>

      {/* 2-Day Return / Follow-Up Workflow Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-500/30 text-white shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-sky-500 text-slate-950 shadow-xs">
                Workflow Suivi J+2
              </span>
              <h3 className="text-sm font-bold font-display text-sky-200">
                ⏱️ Re-visite & Complétion du Prédiagnostic (Après 2 Jours)
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-light max-w-3xl leading-relaxed">
              Après avoir réalisé le premier prédiagnostic, revenez sur le tableau de bord pour valider l'avis de l'expert, mettre à jour le statut de la maintenance, enregistrer les travaux effectués et consigner vos observations à J+2. 
              <strong className="text-sky-300 font-semibold"> Toutes ces modifications seront automatiquement intégrées dans le rapport PDF officiel téléchargeable.</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("decision-dashboard-card");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="w-full md:w-auto bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              ⚡ Compléter le Suivi à J+2
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Indicator Cards Grid (Bento Style Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Inspected / Realized Diagnostics */}
        <button
          type="button"
          onClick={() => handleCardClick("all")}
          className="bento-card p-6 relative overflow-hidden group text-left cursor-pointer transition-all duration-300 hover:border-sky-500/30 hover:shadow-lg hover:-translate-y-0.5 w-full block"
          title="Consulter tous les prédiagnostics réalisés"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/10 transition-all duration-300" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-600 group-hover:scale-110 transition-transform duration-300">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">Pré-diagnostics Réalisés</span>
              <span className="text-3xl font-bold font-display text-slate-900 dark:text-white block mt-1">{totalInspected}</span>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span className="group-hover:text-sky-600 dark:group-hover:text-sky-400 font-medium transition duration-200">Consulter l'historique →</span>
            <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[9px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              {uniqueBuildingNames.length} Bâtiments uniques
            </span>
          </div>
        </button>

        {/* Card 2: Active Alerts */}
        <button
          type="button"
          onClick={() => handleCardClick("critical")}
          className="bento-card p-6 relative overflow-hidden group text-left cursor-pointer transition-all duration-300 hover:border-red-500/30 hover:shadow-lg hover:-translate-y-0.5 w-full block"
          title="Consulter les alertes de risques"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/10 transition-all duration-300" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 group-hover:scale-110 transition-transform duration-300">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">Alertes Actives</span>
              <span className="text-3xl font-bold font-display text-red-600 block mt-1">{criticalAlerts + mediumAlerts}</span>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span className="group-hover:text-red-600 dark:group-hover:text-red-400 font-medium transition duration-200">Consulter les urgences →</span>
            <span className="text-red-600 font-semibold text-[9px] flex items-center gap-1.5">
              <span>{criticalAlerts} critiques</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <span>{mediumAlerts} modérées</span>
            </span>
          </div>
        </button>

        {/* Card 3: Registered Interventions */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("maintenance-history-card");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="bento-card p-6 relative overflow-hidden group text-left cursor-pointer transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:-translate-y-0.5 w-full block"
          title="Consulter les interventions enregistrées"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-300" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 group-hover:scale-110 transition-transform duration-300">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">Interventions</span>
              <span className="text-3xl font-bold font-display text-amber-600 block mt-1">{interventions.length}</span>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400 font-medium transition duration-200">Voir les travaux →</span>
            <span className="text-amber-600 font-medium uppercase tracking-wider text-[9px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
              {interventions.filter(i => i.photoAfter).length} clôturées
            </span>
          </div>
        </button>

        {/* Card 4: Generated PDF Reports */}
        <button
          type="button"
          onClick={() => {
            const target = activeInspection || latestInspection;
            if (target) {
              setPdfModalTarget(target);
              setIsPdfModalOpen(true);
            } else {
              handleCardClick("secure");
            }
          }}
          className="bento-card p-6 relative overflow-hidden group text-left cursor-pointer transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:-translate-y-0.5 w-full block"
          title="Générer & Télécharger le rapport PDF officiel"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">Rapports PDF Officiels</span>
              <span className="text-3xl font-bold font-display text-emerald-600 block mt-1">{totalInspected}</span>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span className="group-hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition duration-200">Télécharger PDF J+2 📥</span>
            <span className="text-emerald-600 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold">
              Score moyen : {averageRiskScore}/10
            </span>
          </div>
        </button>

      </div>

      {/* Main Dashboard Bento Layout Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Risk Overview & Algerian building statistics */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          
          {/* Risk Level Distribution & Dynamic AI recommendations */}
          <div className="bento-card p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-200 mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <BarChart3 className="w-5 h-5 text-sky-500" />
                Répartition Statistique des Risques
              </h3>
              
              <div className="space-y-2">
                
                {/* Progress 1: Critical */}
                <button
                  type="button"
                  onClick={() => handleCardClick("critical")}
                  className="w-full text-left cursor-pointer group/item p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/80 transition duration-300 block"
                  title="Consulter les structures à danger critique (Score ≥ 7.0)"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-red-600 font-medium flex items-center gap-1.5 group-hover/item:text-red-500 transition duration-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                      Danger Structurel Critique (Score ≥ 7.0)
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-300 transition duration-200">
                      {criticalAlerts} bâtiment(s) ({totalInspected > 0 ? Math.round((criticalAlerts / totalInspected) * 100) : 0}%)
                      <ArrowRight className="w-3 h-3 text-red-500 transition duration-200 group-hover/item:translate-x-0.5" />
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/80">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${totalInspected > 0 ? (criticalAlerts / totalInspected) * 100 : 0}%` }}
                    />
                  </div>
                </button>

                {/* Progress 2: Moderate */}
                <button
                  type="button"
                  onClick={() => handleCardClick("medium")}
                  className="w-full text-left cursor-pointer group/item p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/80 transition duration-300 block"
                  title="Consulter les structures à dégradation modérée (Score 4.0 - 6.9)"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-amber-600 font-medium flex items-center gap-1.5 group-hover/item:text-amber-500 transition duration-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      Dégradation Modérée / Infiltrations Locales (Score 4.0 - 6.9)
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-300 transition duration-200">
                      {mediumAlerts} bâtiment(s) ({totalInspected > 0 ? Math.round((mediumAlerts / totalInspected) * 100) : 0}%)
                      <ArrowRight className="w-3 h-3 text-amber-500 transition duration-200 group-hover/item:translate-x-0.5" />
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/80">
                    <div
                      className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${totalInspected > 0 ? (mediumAlerts / totalInspected) * 100 : 0}%` }}
                    />
                  </div>
                </button>

                {/* Progress 3: Secure */}
                <button
                  type="button"
                  onClick={() => handleCardClick("secure")}
                  className="w-full text-left cursor-pointer group/item p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/80 transition duration-300 block"
                  title="Consulter les structures saines (Score < 4.0)"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-emerald-600 font-medium flex items-center gap-1.5 group-hover/item:text-emerald-500 transition duration-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      Toitures Saines & Imperméables / Info (Score &lt; 4.0)
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-300 transition duration-200">
                      {secureRoofs} bâtiment(s) ({totalInspected > 0 ? Math.round((secureRoofs / totalInspected) * 100) : 0}%)
                      <ArrowRight className="w-3 h-3 text-emerald-500 transition duration-200 group-hover/item:translate-x-0.5" />
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/80">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${totalInspected > 0 ? (secureRoofs / totalInspected) * 100 : 0}%` }}
                    />
                  </div>
                </button>

              </div>
            </div>

            {/* Quick Informational Box on Algerian Building Code */}
            <div className="mt-6 p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 text-xs text-sky-700 dark:text-sky-300 leading-relaxed font-light">
              <strong className="font-semibold block text-sky-950 dark:text-sky-200 mb-1">💡 Méthodologie d'étanchéité algérienne :</strong>
              Les calculs de risque BatiSmart intègrent les spécificités du climat semi-aride algérien (Sirocco chaud qui dessèche les membranes d'étanchéité, alterné par des pluies torrentielles hivernales concentrentes). L'IA évalue les fissurations thermiques d'acrotères et l'étanchéité asphalte sablée d'origine.
            </div>


          </div>

          {/* Interactive Risk Evolution Component */}
          <div className="bento-card p-6 mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-500">
                  <BarChart3 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-200">
                    📈 Évolution du niveau de risque
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-[11px] font-light">
                    Visualisation chronologique et suivi intelligent de l'état structurel
                  </p>
                </div>
              </div>

              {/* Building and Diagnostic selector dropdowns */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-sky-500/50 cursor-pointer max-w-xs truncate font-medium shadow-xs"
                  >
                    {buildingNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={selectedInspectionId}
                    onChange={(e) => setSelectedInspectionId(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sky-600 dark:text-sky-400 text-xs rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-sky-500/50 cursor-pointer max-w-xs truncate font-bold shadow-xs"
                  >
                    {buildingInspections.map((ins) => {
                      const dateStr = new Date(ins.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' });
                      return (
                        <option key={ins.id} value={ins.id}>
                          Diag. du {dateStr} (Score: {ins.riskScore.toFixed(1)}/10)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {activeInspection && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onViewOnMap) onViewOnMap(activeInspection);
                      else onViewInspection(activeInspection);
                    }}
                    className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Afficher automatiquement le pré-diagnostic sur la Carte SIG"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Afficher sur la Carte SIG</span>
                  </button>
                )}
              </div>
            </div>

            {/* Above Graph Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dernier score obtenu */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dernier score obtenu</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className={`text-2xl font-black font-display ${getScoreBadgeInfo(latestScore).color.split(" ")[0]}`}>
                    {latestScore.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">/10</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2 self-start border ${getScoreBadgeInfo(latestScore).color}`}>
                  {getScoreBadgeInfo(latestScore).label}
                </span>
              </div>

              {/* Evolution par rapport à l'inspection précédente */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Évolution</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-2xl font-black font-display ${scoreDiff > 0 ? 'text-red-500' : scoreDiff < 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff === 0 ? "0.0" : scoreDiff}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal mt-2">
                  {previousPoint 
                    ? `Comparé à l'inspection du ${new Date(previousPoint.date).toLocaleDateString('fr-FR')}`
                    : "Première inspection enregistrée"}
                </p>
              </div>

              {/* Tendance */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tendance globale</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`p-1.5 rounded-lg ${trendColor}`}>
                    {trendIcon}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {trendText}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal mt-2 block">
                  {scoreDiff > 0 ? "Désordres croissants" : scoreDiff < 0 ? "Travaux efficaces" : "Situation stable"}
                </span>
              </div>
            </div>

            {/* Toggles bar for chart lines selection with latest point info */}
            <div className="bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                <span>📊 SÉLECTION DES PRÉ-DIAGNOSTICS À AFFICHER SUR LA COURBE (MULTILINES CHRONOLOGIQUES) :</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {/* Score global */}
                <button
                  type="button"
                  onClick={() => toggleLine("riskScore")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 text-xs cursor-pointer ${
                    activeLines.riskScore
                      ? "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 font-bold shadow-xs"
                      : "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 animate-pulse" />
                  <span>Niveau de risque global</span>
                  <span className="text-[10px] opacity-75">({latestScore.toFixed(1)}/10)</span>
                </button>

                {/* Pathologies */}
                {[
                  { key: "cracks", label: "Fissures", color: "bg-rose-500", border: "border-rose-500/30", textActive: "text-rose-600 dark:text-rose-400", bgActive: "bg-rose-500/10", val: latestPoint?.cracks?.severity || "Aucune" },
                  { key: "humidity", label: "Humidité", color: "bg-blue-500", border: "border-blue-500/30", textActive: "text-blue-600 dark:text-blue-400", bgActive: "bg-blue-500/10", val: latestPoint?.humidity?.severity || "Aucune" },
                  { key: "infiltration", label: "Infiltrations", color: "bg-cyan-500", border: "border-cyan-500/30", textActive: "text-cyan-600 dark:text-cyan-400", bgActive: "bg-cyan-500/10", val: latestPoint?.infiltration?.severity || "Aucune" },
                  { key: "degradation", label: "Défauts d'étanchéité", color: "bg-amber-500", border: "border-amber-500/30", textActive: "text-amber-600 dark:text-amber-400", bgActive: "bg-amber-500/10", val: latestPoint?.degradation?.severity || "Aucune" },
                  { key: "corrosion", label: "Corrosion", color: "bg-orange-500", border: "border-orange-500/30", textActive: "text-orange-600 dark:text-orange-400", bgActive: "bg-orange-500/10", val: latestPoint?.corrosion?.severity || "Aucune" },
                  { key: "deformation", label: "Déformations", color: "bg-purple-500", border: "border-purple-500/30", textActive: "text-purple-600 dark:text-purple-400", bgActive: "bg-purple-500/10", val: latestPoint?.deformation?.severity || "Aucune" },
                  { key: "aging", label: "Vieillissement", color: "bg-slate-500", border: "border-slate-500/30", textActive: "text-slate-600 dark:text-slate-400", bgActive: "bg-slate-500/10", val: latestPoint?.aging?.severity || "Aucune" },
                ].map((item) => {
                  const isActive = activeLines[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleLine(item.key)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 text-xs cursor-pointer ${
                        isActive
                          ? `${item.bgActive} ${item.border} ${item.textActive} font-bold shadow-xs`
                          : "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span>{item.label}</span>
                      <span className="text-[10px] opacity-75">({item.val})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Line Chart & Clicked Point Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Graphic container (2/3 columns on desktop) */}
              <div className="md:col-span-2 h-72 relative bg-slate-50 dark:bg-slate-950/30 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-4 flex flex-col justify-between">
                <div className="w-full h-[90%]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      onClick={handlePointClick}
                      margin={{ top: 15, right: 15, left: -25, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="riskLineGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} /> {/* 🔴 */}
                          <stop offset="35%" stopColor="#f97316" stopOpacity={0.9} /> {/* 🟠 */}
                          <stop offset="65%" stopColor="#f59e0b" stopOpacity={0.9} /> {/* 🟡 */}
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.9} /> {/* 🟢 */}
                        </linearGradient>
                      </defs>
                      
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                      
                      <XAxis
                        dataKey="date"
                        tickFormatter={(str) => {
                          try {
                            const d = new Date(str);
                            return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
                          } catch (e) {
                            return str;
                          }
                        }}
                        tick={{ fill: "rgba(148, 163, 184, 0.6)", fontSize: 10, fontFamily: "sans-serif" }}
                        stroke="rgba(148, 163, 184, 0.1)"
                      />
                      
                      {/* Left YAxis for both global risk score and pathology severity */}
                      <YAxis
                        yAxisId="left"
                        domain={[0, 10]}
                        ticks={[0, 3, 6, 9, 10]}
                        tickFormatter={(v) => {
                          if (v === 0) return "0 (Sain)";
                          if (v === 3) return "3 (Faible)";
                          if (v === 6) return "6 (Moyen)";
                          if (v === 9) return "9 (Élevé)";
                          if (v === 10) return "10 (Max)";
                          return String(v);
                        }}
                        tick={{ fill: "rgba(148, 163, 184, 0.6)", fontSize: 9, fontFamily: "sans-serif" }}
                        stroke="rgba(148, 163, 184, 0.1)"
                        width={65}
                      />

                      {/* Horizontal threshold markers for Risk levels */}
                      <ReferenceLine yAxisId="left" y={3} stroke="#10b981" strokeDasharray="3 3" opacity={0.3} />
                      <ReferenceLine yAxisId="left" y={6} stroke="#f59e0b" strokeDasharray="3 3" opacity={0.3} />
                      <ReferenceLine yAxisId="left" y={9} stroke="#ef4444" strokeDasharray="3 3" opacity={0.3} />

                      <Tooltip
                        cursor={{ stroke: "rgba(148, 163, 184, 0.15)", strokeWidth: 1 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as any;
                            const badge = getScoreBadgeInfo(data.riskScore);
                            
                            const pathologies = [
                              { label: "Fissures", severity: data.cracks?.severity || "Aucune", color: "bg-rose-500" },
                              { label: "Humidité", severity: data.humidity?.severity || "Aucune", color: "bg-blue-500" },
                              { label: "Infiltrations", severity: data.infiltration?.severity || "Aucune", color: "bg-cyan-500" },
                              { label: "Défauts d'étanchéité", severity: data.degradation?.severity || "Aucune", color: "bg-amber-500" },
                              { label: "Corrosion", severity: data.corrosion?.severity || "Aucune", color: "bg-orange-500" },
                              { label: "Déformations", severity: data.deformation?.severity || "Aucune", color: "bg-purple-500" },
                              { label: "Vieillissement", severity: data.aging?.severity || "Aucune", color: "bg-slate-500" },
                            ];

                            return (
                              <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl text-xs space-y-2.5 max-w-[240px] text-white z-50">
                                <div className="border-b border-slate-800/80 pb-2">
                                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                    Inspection du {new Date(data.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </p>
                                  <div className="flex justify-between items-center mt-1.5">
                                    <span className="text-slate-300 font-light">Score de Risque :</span>
                                    <span className={`font-black text-sm ${badge.color.split(" ")[0]}`}>
                                      {data.riskScore.toFixed(1)} / 10
                                    </span>
                                  </div>
                                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${badge.color} inline-block mt-1.5 border`}>
                                    {badge.label}
                                  </span>
                                </div>

                                <div className="space-y-1.5">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pré-diagnostic Pathologies :</p>
                                  <div className="grid grid-cols-1 gap-1">
                                    {pathologies.map((path) => {
                                      const isDetected = path.severity !== "Aucune";
                                      return (
                                        <div key={path.label} className="flex justify-between items-center text-[10.5px]">
                                          <div className="flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${path.color}`} />
                                            <span className={isDetected ? "text-slate-200 font-normal" : "text-slate-500 font-light"}>
                                              {path.label}
                                            </span>
                                          </div>
                                          <span className={`font-semibold ${
                                            path.severity === "Élevée" ? "text-red-400" :
                                            path.severity === "Moyenne" ? "text-amber-400" :
                                            path.severity === "Faible" ? "text-blue-400" : "text-slate-500"
                                          }`}>
                                            {path.severity}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* Line for overall risk score */}
                      {activeLines.riskScore && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="riskScore"
                          stroke="url(#riskLineGradient)"
                          strokeWidth={4.5}
                          dot={renderCustomDot}
                          activeDot={{ r: 8, strokeWidth: 2, stroke: "#ffffff" }}
                          connectNulls
                        />
                      )}

                      {/* Lines for individual pathologies */}
                      {activeLines.cracks && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="cracksVal"
                          stroke="#f43f5e"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#f43f5e", stroke: "#ffffff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}

                      {activeLines.humidity && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="humidityVal"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#3b82f6", stroke: "#ffffff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}

                      {activeLines.infiltration && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="infiltrationVal"
                          stroke="#06b6d4"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#06b6d4", stroke: "#ffffff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}

                      {activeLines.degradation && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="degradationVal"
                          stroke="#eab308"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#eab308", stroke: "#ffffff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}

                      {activeLines.corrosion && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="corrosionVal"
                          stroke="#f97316"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#f97316", stroke: "#ffffff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}

                      {activeLines.deformation && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="deformationVal"
                          stroke="#a855f7"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#a855f7", stroke: "#ffffff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}

                      {activeLines.aging && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="agingVal"
                          stroke="#64748b"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#64748b", stroke: "#ffffff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}

                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-light text-center">
                  💡 Cliquez sur un point de la courbe ou activez les différentes pathologies pour comparer l'évolution chronologique.
                </div>
              </div>

              {/* Clicked Point Details (1/3 column on desktop) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex flex-col justify-between min-h-[240px]">
                {clickedPoint ? (
                  <div className="space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Détail de l'inspection</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                        {new Date(clickedPoint.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </h4>
                      
                      <div className="mt-3 space-y-1.5">
                        {/* Score */}
                        <div className="flex justify-between items-center bg-white dark:bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-light">Score :</span>
                          <span className={`text-xs font-bold ${getScoreBadgeInfo(clickedPoint.riskScore).color.split(" ")[0]}`}>
                            {clickedPoint.riskScore.toFixed(1)} / 10
                          </span>
                        </div>

                        {/* Niveau */}
                        <div className="flex justify-between items-center bg-white dark:bg-slate-900/40 px-3 py-1 rounded-xl border border-slate-100 dark:border-slate-800/40">
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-light">Niveau :</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getScoreBadgeInfo(clickedPoint.riskScore).color}`}>
                            {getScoreBadgeInfo(clickedPoint.riskScore).label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pathologies list at Clicked Point */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Sévérité des pathologies</span>
                      <div className="grid grid-cols-2 gap-1 bg-white/40 dark:bg-slate-900/10 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/20 max-h-36 overflow-y-auto">
                        {[
                          { label: "Fissures", obj: clickedPoint.cracks },
                          { label: "Humidité", obj: clickedPoint.humidity },
                          { label: "Infiltrations", obj: clickedPoint.infiltration },
                          { label: "Défauts d'étanchéité", obj: clickedPoint.degradation },
                          { label: "Corrosion", obj: clickedPoint.corrosion },
                          { label: "Déformations", obj: clickedPoint.deformation },
                          { label: "Vieillissement", obj: clickedPoint.aging },
                        ].map((item) => {
                          const severity = item.obj?.severity || "Aucune";
                          
                          let badgeStyle = "text-slate-500 bg-slate-100 dark:bg-slate-900/60 dark:text-slate-400";
                          if (severity === "Élevée") badgeStyle = "text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 font-semibold";
                          else if (severity === "Moyenne") badgeStyle = "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 font-semibold";
                          else if (severity === "Faible") badgeStyle = "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400";

                          return (
                            <div key={item.label} className="p-1 bg-white dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800/40 flex flex-col justify-between">
                              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-light truncate">{item.label}</span>
                              <span className={`text-[9.5px] px-1 py-0.5 rounded-md mt-1 text-center truncate ${badgeStyle}`}>
                                {severity}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Etat General */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Résumé global de l'IA</span>
                      <p className="text-[10.5px] text-slate-600 dark:text-slate-400 font-light leading-relaxed bg-white dark:bg-slate-900/20 p-2 rounded-xl border border-slate-100 dark:border-slate-800/40 italic">
                        "{clickedPoint.summary || clickedPoint.notes || 'Aucun détail particulier renseigné.'}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 animate-pulse mb-2" />
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-light">
                      Sélectionnez un point sur le graphique pour afficher ses détails
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Suivi détaillé des évolutions (📋 Evolution des pathologies) */}
            {previousPoint && latestPoint && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base font-bold font-display text-slate-800 dark:text-slate-200">
                    📋 Évolution des pathologies
                  </span>
                  <span className="text-[9px] bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded text-sky-500 uppercase font-bold">
                    Analyse comparative
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {pathologiesDiff.map((p) => {
                    // Let's select appropriate icon based on state
                    let StatusIcon = <Minus className="w-3.5 h-3.5" />;
                    if (p.status === "Corrigée") StatusIcon = <ShieldCheck className="w-3.5 h-3.5" />;
                    else if (p.status === "Améliorée") StatusIcon = <TrendingDown className="w-3.5 h-3.5" />;
                    else if (p.status === "Aggravée") StatusIcon = <TrendingUp className="w-3.5 h-3.5" />;
                    else if (p.status === "Nouvelle anomalie") StatusIcon = <AlertCircle className="w-3.5 h-3.5" />;

                    // Format badge labels beautifully as requested:
                    // 🟢 Corrigée, 🟡 Stable, 🟠 Améliorée, 🔴 Aggravée, ➕ Nouvelle anomalie
                    let labelWithIcon: string = p.status;
                    if (p.status === "Corrigée") labelWithIcon = "🟢 Corrigée";
                    else if (p.status === "Stable") labelWithIcon = "🟡 Stable";
                    else if (p.status === "Améliorée") labelWithIcon = "🟠 Améliorée";
                    else if (p.status === "Aggravée") labelWithIcon = "🔴 Aggravée";
                    else if (p.status === "Nouvelle anomalie") labelWithIcon = "➕ Nouvelle anomalie";

                    return (
                      <div
                        key={p.name}
                        className="p-3 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between hover:shadow-xs hover:border-slate-200/50 dark:hover:border-slate-800 transition duration-300"
                      >
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {p.name}
                        </span>
                        
                        <div className={`mt-2 px-2.5 py-1 rounded-lg border flex items-center justify-between gap-1.5 text-[10.5px] ${p.colorClass}`}>
                          <span className="font-bold">{labelWithIcon}</span>
                          {StatusIcon}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Intelligent AI Summary text block */}
            {aiEvolutionSummary && (
              <div className="p-4 bg-gradient-to-r from-sky-500/5 to-emerald-500/5 border border-sky-500/10 dark:border-sky-500/5 rounded-2xl">
                <div className="flex items-center gap-1.5 mb-2 text-sky-700 dark:text-sky-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 animate-pulse text-amber-500" />
                  <span>Résumé Intelligent de l'Évolution (Généré par BatiSmart Roof IA)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light font-sans">
                  {aiEvolutionSummary}
                </p>
              </div>
            )}

          </div>

          {/* --- NOUVEAU MODULE : RENTABILITÉ ÉCONOMIQUE --- */}
          {activeInspection && (() => {
            const defaultState = getDefaultBuildingState(activeInspection.riskScore);
            const userBuildingState = customBuildingStates[selectedBuilding] || defaultState;

            const defaultIntervention = getDefaultInterventionType(activeInspection.riskScore, userBuildingState);
            const userInterventionType = customInterventionTypes[selectedBuilding] || defaultIntervention;

            const defaultEcon = getEconomicAnalysis(activeInspection);
            const userSurface = customSurfaces[selectedBuilding] !== undefined 
              ? customSurfaces[selectedBuilding] 
              : (activeInspection.customSurface || defaultEcon.roofSurface);

            const econ = getEconomicAnalysis(activeInspection, userSurface, userBuildingState, userInterventionType);

            const activeStateObj = BUILDING_STATES.find(s => s.label === userBuildingState) || BUILDING_STATES[2];

            return (
              <div id="economic-profitability-card" className="bento-card p-6 mt-6 border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-5">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                      Aide à la Décision IA • Performance Financière
                    </span>
                    <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      💰 Rentabilité Économique & ROI
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Active State Badge */}
                    <div className={`px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${activeStateObj.colorClass}`}>
                      <span className="text-[11px] opacity-75">État :</span>
                      <span>{activeStateObj.badge}</span>
                    </div>

                    {/* Active Intervention Badge */}
                    <div className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-sky-500" />
                      <span>{userInterventionType}</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Controls Toolbar: 4 Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 mb-5">
                  
                  {/* Parameter 1: Choice of Building */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building className="w-3 h-3 text-emerald-500" />
                      Édifice inspecté
                    </label>
                    <select
                      value={selectedBuilding}
                      onChange={(e) => setSelectedBuilding(e.target.value)}
                      className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer w-full font-semibold shadow-xs"
                    >
                      {buildingNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Parameter 2: Surface Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <BarChart3 className="w-3 h-3 text-sky-500" />
                      Surface estimée (m²)
                    </label>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl p-0.5 shadow-xs">
                      <button
                        type="button"
                        onClick={() => {
                          const current = userSurface;
                          const next = Math.max(50, current - 100);
                          setCustomSurfaces(prev => ({ ...prev, [selectedBuilding]: next }));
                        }}
                        className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition font-bold text-xs cursor-pointer"
                        title="Diminuer de 100 m²"
                      >
                        -100
                      </button>
                      <input
                        type="number"
                        min="50"
                        max="20000"
                        value={userSurface}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setCustomSurfaces(prev => ({ ...prev, [selectedBuilding]: val }));
                        }}
                        className="w-full text-center font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-transparent border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = userSurface;
                          const next = Math.min(20000, current + 100);
                          setCustomSurfaces(prev => ({ ...prev, [selectedBuilding]: next }));
                        }}
                        className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition font-bold text-xs cursor-pointer"
                        title="Augmenter de 100 m²"
                      >
                        +100
                      </button>
                    </div>
                  </div>

                  {/* Parameter 3: État actuel du bâtiment */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-amber-500" />
                      État actuel du bâtiment
                    </label>
                    <select
                      value={userBuildingState}
                      onChange={(e) => setCustomBuildingStates(prev => ({ ...prev, [selectedBuilding]: e.target.value as BuildingState }))}
                      className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer w-full font-semibold shadow-xs"
                    >
                      {BUILDING_STATES.map((st) => (
                        <option key={st.label} value={st.label}>
                          {st.badge} {st.label === defaultState ? "(Détecté IA)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Parameter 4: Type d'intervention recommandé */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-sky-500" />
                      Type d'intervention recommandé
                    </label>
                    <select
                      value={userInterventionType}
                      onChange={(e) => setCustomInterventionTypes(prev => ({ ...prev, [selectedBuilding]: e.target.value as InterventionType }))}
                      className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer w-full font-semibold shadow-xs truncate"
                    >
                      {INTERVENTION_TYPES.map((it) => (
                        <option key={it.type} value={it.type}>
                          {it.type} {it.type === defaultIntervention ? "(Suggéré IA)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Main Economic cost range grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  
                  {/* Card A: Intervention Recommandée */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Intervention Recommandée</span>
                        <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                          {userInterventionType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                          {formatDA(econ.preventiveMin)}
                        </span>
                        <span className="text-xs text-slate-400 font-light">à</span>
                        <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                          {formatDA(econ.preventiveMax)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-light leading-normal">
                        Budget estimé pour un traitement ciblé (« {userInterventionType} ») adapté au bâtiment en état « {userBuildingState} » (surface : {userSurface} m²).
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/40 text-[9px] text-emerald-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                      Budget planifié & maîtrisé
                    </div>
                  </div>

                  {/* Card B: Réparation Tardive / Sinistre */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Réparation Tardive (Sinistre Futur)</span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatDA(econ.tardiveMin)}
                        </span>
                        <span className="text-xs text-slate-400 font-light">à</span>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatDA(econ.tardiveMax)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-light leading-normal">
                        Coût estimatif en cas de sinistre différé (infiltrations profondes dans la dalle béton, corrosion d'armatures et réfection lourde).
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/40 text-[9px] text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      Surcoût en cas d'inaction
                    </div>
                  </div>

                  {/* Card C: Économie Potentielle */}
                  <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Économie Budgétaire Générée</span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatDA(econ.savingMin)}
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">à</span>
                        <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatDA(econ.savingMax)}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-700/80 dark:text-emerald-300/75 mt-2 font-light leading-normal">
                        Fonds publics préservés en engageant l'intervention recommandée dès maintenant.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-emerald-100 dark:border-emerald-950/40 text-[9px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Gains de {Math.round(econ.savingMin / (econ.tardiveMin || 1) * 100)}% à {Math.round(econ.savingMax / (econ.tardiveMax || 1) * 100)}%</span>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  </div>

                </div>

                {/* ROI & Immobilisation Secondary row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  
                  {/* ROI radial metric block */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 flex items-center gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="32" cy="32" r="28" className="stroke-slate-200 dark:stroke-slate-800 fill-none" strokeWidth="6" />
                        <circle cx="32" cy="32" r="28" className="stroke-emerald-500 fill-none" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - Math.min(econ.roiPercentage, 800) / 800)}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{econ.roiPercentage}%</span>
                        <span className="text-[7px] text-slate-400 font-bold uppercase">ROI</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Retour sur Investissement (ROI)</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-snug">
                        {econ.roiText}
                      </p>
                    </div>
                  </div>

                  {/* Time saved indicator block */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 flex items-center gap-4">
                    <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-500 shrink-0">
                      <Calendar className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Temps d'Immobilisation Économisé</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-snug">
                        L'intervention « {userInterventionType} » dure environ <strong className="font-semibold text-slate-700 dark:text-slate-200">{econ.timeSavedDaysMin} à {econ.timeSavedDaysMax} jours</strong> évitant l'arrêt prolongé du service public.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Resources list & AI summary text block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Optimized Resources lists */}
                  <div className="md:col-span-1 p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Ressources Optimisées
                    </h4>
                    <ul className="space-y-1.5">
                      {econ.resourcesOptimized.slice(0, 5).map((res, idx) => (
                        <li key={idx} className="text-[10.5px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5 font-light">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span className="leading-snug">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Conclusion & Justification details */}
                  <div className="md:col-span-2 p-4 bg-gradient-to-r from-emerald-500/5 to-sky-500/5 border border-emerald-500/10 dark:border-emerald-500/5 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                        <Sparkles className="w-4 h-4 animate-pulse text-amber-500" />
                        <span>Explication de l'Intervention & Synthèse Financière IA</span>
                      </div>
                      
                      <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/50 dark:border-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                        <strong className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Pourquoi ce type d'intervention est recommandé :</strong>
                        {econ.interventionJustification}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light font-sans pt-1">
                        {econ.aiConclusion}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40 text-[9.5px] text-slate-400 dark:text-slate-500 italic leading-snug">
                      ⚠️ <strong>Mention légale :</strong> Les analyses financières ci-dessus sont des estimations indicatives dépendant de la surface des toitures, de leur état, du type d’intervention et des coûts moyens. Elles ne se substituent pas à un métré quantitatif professionnel.
                    </div>
                  </div>

                </div>

              </div>
            );
          })()}

          {/* Tableau de bord décisionnel & Validation de l'expert */}
          <div id="decision-dashboard-card" className="bento-card p-6 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Gouvernance & Décisions
                </span>
                <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-200">
                  🎯 Tableau de Bord Décisionnel
                </h3>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Édifice :</span>
                  <select
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    className="bg-slate-100 dark:bg-[#0c1435] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500/50 cursor-pointer max-w-xs truncate font-semibold shadow-xs"
                  >
                    {buildingNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Prédiagnostic :</span>
                  <select
                    value={selectedInspectionId}
                    onChange={(e) => setSelectedInspectionId(e.target.value)}
                    className="bg-slate-100 dark:bg-[#0c1435] border border-slate-200 dark:border-slate-800 text-sky-600 dark:text-sky-400 text-xs rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500/50 cursor-pointer font-bold shadow-xs"
                  >
                    {buildingInspections.map((ins) => {
                      const dateStr = new Date(ins.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' });
                      return (
                        <option key={ins.id} value={ins.id}>
                          Prédiag. du {dateStr} (Score: {ins.riskScore.toFixed(1)}/10)
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* AI Proposed Decision Row */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/30 rounded-xl">
                  <Sparkles className="w-5 h-5 text-sky-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1">
                    Décision Proposée par l'IA (BatiSmart Roof IA)
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {getAiProposedDecision(latestScore, scoreDiff).decision}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    {getAiProposedDecision(latestScore, scoreDiff).justification}
                  </p>
                </div>
              </div>
            </div>

            {/* Expert Validation Form */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
                👨‍💼 Validation de l'Expert
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                {/* Status Radio Buttons */}
                <button
                  type="button"
                  onClick={() => setExpertStatus("Validé")}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
                    expertStatus === "Validé"
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 hover:bg-slate-100 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${expertStatus === "Validé" ? "bg-emerald-500/20" : "bg-slate-200 dark:bg-slate-800"}`}>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Validé</p>
                      <p className="text-[10px] opacity-85 font-light">Structure approuvée</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${expertStatus === "Validé" ? "border-emerald-500" : "border-slate-300 dark:border-slate-700"}`}>
                    {expertStatus === "Validé" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setExpertStatus("À vérifier")}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
                    expertStatus === "À vérifier"
                      ? "bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-300"
                      : "bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 hover:bg-slate-100 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${expertStatus === "À vérifier" ? "bg-amber-500/20" : "bg-slate-200 dark:bg-slate-800"}`}>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">À vérifier</p>
                      <p className="text-[10px] opacity-85 font-light">Contre-visite requise</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${expertStatus === "À vérifier" ? "border-amber-500" : "border-slate-300 dark:border-slate-700"}`}>
                    {expertStatus === "À vérifier" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setExpertStatus("Refusé")}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
                    expertStatus === "Refusé"
                      ? "bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300"
                      : "bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 hover:bg-slate-100 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${expertStatus === "Refusé" ? "bg-red-500/20" : "bg-slate-200 dark:bg-slate-800"}`}>
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Refusé</p>
                      <p className="text-[10px] opacity-85 font-light">Structure non conforme</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${expertStatus === "Refusé" ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}>
                    {expertStatus === "Refusé" && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                  </div>
                </button>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Nom de l'expert *
                  </label>
                  <input
                    type="text"
                    required
                    value={expertNameInput}
                    onChange={(e) => setExpertNameInput(e.target.value)}
                    placeholder="Saisir votre nom complet"
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Organisme / Bureau d'études *
                  </label>
                  <input
                    type="text"
                    required
                    value={expertOrgInput}
                    onChange={(e) => setExpertOrgInput(e.target.value)}
                    placeholder="Organisme certificateur (ex: CTC)"
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Date de validation *
                  </label>
                  <input
                    type="date"
                    required
                    value={expertDateInput}
                    onChange={(e) => setExpertDateInput(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Comments */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Commentaires techniques additionnels
                </label>
                <textarea
                  rows={2}
                  value={expertCommentsInput}
                  onChange={(e) => setExpertCommentsInput(e.target.value)}
                  placeholder="Insérer ici vos observations sur l'étanchéité, l'acrotère, les descentes ou les fissures..."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition resize-none"
                />
              </div>

              {/* Canvas Interactive Signature */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide flex items-center justify-between">
                    <span>Signature manuscrite interactive</span>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-[10px] text-red-500 hover:text-red-600 font-medium cursor-pointer"
                    >
                      Effacer
                    </button>
                  </label>
                  
                  <div className="relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white">
                    <canvas
                      ref={signatureCanvasRef}
                      width={400}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full block bg-transparent cursor-crosshair h-[120px]"
                    />
                    {!expertSignatureData && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[11px] text-slate-400">
                        Signez à l'aide de votre souris ou doigt ici
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature Preview */}
                <div className="flex flex-col justify-between">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                      Aperçu de l'authentification
                    </label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl h-[120px] flex flex-col justify-between">
                      {expertSignatureData ? (
                        <div className="flex-1 flex items-center justify-center overflow-hidden">
                          <img
                            src={expertSignatureData}
                            alt="Signature Expert"
                            referrerPolicy="no-referrer"
                            className="max-h-[85px] object-contain filter dark:invert dark:hue-rotate-180"
                          />
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-[11px] text-slate-400 italic">
                          Aucune signature apposée
                        </div>
                      )}
                      
                      <div className="text-[9px] text-slate-400 text-center border-t border-slate-100 dark:border-slate-800 pt-1">
                        Certifié conforme BatiSmart Roof IA
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit and Feedback */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleSaveExpertValidation}
                  className="w-full sm:w-auto bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Enregistrer et Authentifier la Validation
                </button>

                {validationSuccess && (
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 w-full animate-fade-in">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      ✅ Décision & Signature enregistrées ! Le rapport PDF inclut désormais vos modifications J+2.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const target = activeInspection || latestInspection;
                        if (target) {
                          setPdfModalTarget(target);
                          setIsPdfModalOpen(true);
                        }
                      }}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Télécharger le PDF Mis à Jour
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Historique des interventions */}
          <div id="maintenance-history-card" className="bento-card p-6 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  🛠️ Maintenance de l'édifice
                </span>
                <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-200">
                  🛠️ Historique des Interventions
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-light">
                {matchingInterventions.length} opérations enregistrées
              </span>
            </div>

            {/* List of Interventions */}
            <div className="space-y-4 mb-8">
              {matchingInterventions.length > 0 ? (
                matchingInterventions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((interv) => (
                    <div
                      key={interv.id}
                      className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-sky-500/10 transition duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {interv.type}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(interv.date).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light mb-4">
                        {interv.description}
                      </p>

                      {/* Intervention Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-xl mb-4">
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-light">Entreprise</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{interv.company}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-light">Responsable</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{interv.responsible}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-light">Durée</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{interv.duration}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-light">Coût estimé</span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{interv.estimatedCost}</span>
                        </div>
                      </div>

                      {/* Side-by-side Photo Before / After */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative rounded-lg overflow-hidden border border-slate-200/50 dark:border-slate-800/80 h-32">
                          <img
                            src={interv.photoBefore}
                            alt="Avant travaux"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600/90 text-white text-[9px] font-bold rounded uppercase tracking-wider">
                            Avant
                          </div>
                        </div>

                        <div className="relative rounded-lg overflow-hidden border border-slate-200/50 dark:border-slate-800/80 h-32">
                          <img
                            src={interv.photoAfter}
                            alt="Après travaux"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600/90 text-white text-[9px] font-bold rounded uppercase tracking-wider">
                            Après
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-slate-400 text-xs font-light">
                  Aucune intervention enregistrée pour ce bâtiment. Utilisez le formulaire ci-dessous pour planifier ou enregistrer des travaux.
                </div>
              )}
            </div>

            {/* Add Intervention Form */}
            <form onSubmit={handleSaveInterventionSubmit} className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  ➕ Enregistrer de nouveaux travaux de maintenance
                </h4>
                <button
                  type="button"
                  onClick={handleQuickFillIntervention}
                  className="text-[11px] bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 px-2.5 py-1 rounded-lg transition font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-sky-500" />
                  <span>⚡ Auto-remplir exemple de chantier</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Type d'intervention *
                  </label>
                  <select
                    value={intervType}
                    onChange={(e) => setIntervType(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition cursor-pointer"
                  >
                    <option value="Rénovation complète étanchéité">Rénovation complète d'étanchéité</option>
                    <option value="Traitement des fissures & Pose de bâche">Traitement des fissures & Pose de bâche</option>
                    <option value="Cool Roof (Peinture blanche réflective)">Cool Roof (Peinture blanche réflective)</option>
                    <option value="Curage et débouchage pluvial">Curage et débouchage des évacuations</option>
                    <option value="Traitement acrotères et pontage">Traitement acrotères et pontage de joints</option>
                    <option value="Réfection partielle bitume">Réfection partielle du complexe d'étanchéité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Date de réalisation *
                  </label>
                  <input
                    type="date"
                    required
                    value={intervDate}
                    onChange={(e) => setIntervDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Description exhaustive des travaux réalisés *
                </label>
                <textarea
                  rows={2}
                  required
                  value={intervDescription}
                  onChange={(e) => setIntervDescription(e.target.value)}
                  placeholder="Décrire en détail l'injection de résine, l'application de la bâche bitumineuse, l'évacuation des gravats, etc."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={intervCompany}
                    onChange={(e) => setIntervCompany(e.target.value)}
                    placeholder="AWS, CTC..."
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    value={intervResponsible}
                    onChange={(e) => setIntervResponsible(e.target.value)}
                    placeholder="Chef de projet"
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Durée travaux *
                  </label>
                  <input
                    type="text"
                    required
                    value={intervDuration}
                    onChange={(e) => setIntervDuration(e.target.value)}
                    placeholder="ex: 3 jours"
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Coût estimé (DA) *
                  </label>
                  <input
                    type="text"
                    required
                    value={intervCost}
                    onChange={(e) => setIntervCost(e.target.value)}
                    placeholder="ex: 450 000 DA"
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Before & After Photos with Gallery & Upload options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Photo Avant */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center justify-between">
                    <span>Photo Avant (Dégradations)</span>
                    {intervPhotoBefore && (
                      <button
                        type="button"
                        onClick={() => setIntervPhotoBefore("")}
                        className="text-[10px] text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
                      >
                        Effacer
                      </button>
                    )}
                  </label>
                  
                  {/* Image Preview */}
                  <div className="aspect-video w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden flex flex-col items-center justify-center text-center p-3 group">
                    {intervPhotoBefore ? (
                      <>
                        <img src={intervPhotoBefore} alt="Aperçu Avant" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setGalleryPickerTarget("before")}
                            className="bg-white/95 dark:bg-slate-950/95 text-slate-800 dark:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold shadow transition cursor-pointer"
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
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>

                {/* Photo Après */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide flex items-center justify-between">
                    <span>Photo Après (Réparations)</span>
                    {intervPhotoAfter && (
                      <button
                        type="button"
                        onClick={() => setIntervPhotoAfter("")}
                        className="text-[10px] text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
                      >
                        Effacer
                      </button>
                    )}
                  </label>
                  
                  {/* Image Preview */}
                  <div className="aspect-video w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden flex flex-col items-center justify-center text-center p-3 group">
                    {intervPhotoAfter ? (
                      <>
                        <img src={intervPhotoAfter} alt="Aperçu Après" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setGalleryPickerTarget("after")}
                            className="bg-white/95 dark:bg-slate-950/95 text-slate-800 dark:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold shadow transition cursor-pointer"
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
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Action and feedback */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold py-3 px-6 rounded-xl border border-slate-700 dark:border-slate-600 shadow-md transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Enregistrer l'Intervention dans l'Historique
                </button>

                {intervSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fade-in">
                    ✅ Opération ajoutée avec succès à la chronologie du bâtiment !
                  </span>
                )}
              </div>
            </form>
          </div>



        </div>

        {/* Right 1 Column: Urgent Action Center (Critical warnings in bento card style) */}
        <div className="bento-card-critical bento-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b border-red-500/20 pb-3">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Priorités d'Intervention IA
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-light leading-relaxed mb-4">
              Ce module classe par ordre de priorité critique les édifices publics nécessitant des travaux d'étanchéité urgents. L'évaluation intelligente s'appuie sur la sévérité des infiltrations et des fissures détectées par l'algorithme. Cette hiérarchisation automatisée permet de planifier les interventions techniques pour sécuriser le patrimoine bâti algérien.
            </p>
            
            <div className="space-y-4">
              {criticalInspections.map((ins) => {
                const style = getRiskColor(ins.riskScore);
                return (
                  <div
                    key={ins.id}
                    onClick={() => {
                      if (onViewOnMap) {
                        onViewOnMap(ins);
                      } else {
                        onViewInspection(ins);
                      }
                    }}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 hover:border-sky-500/30 rounded-xl transition duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition duration-300">{ins.buildingName}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-1 flex items-center gap-1 font-light">
                          <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                          {ins.city}
                        </span>
                      </div>
                      
                      {/* Risk Score Badge */}
                      <span className={`px-2 py-1 rounded text-xs font-bold leading-none shrink-0 ${style.bg} ${style.text} border ${style.border}`}>
                        {ins.riskScore}
                      </span>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-light">
                      <span>{ins.buildingType}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewOnMap) onViewOnMap(ins);
                          }}
                          className="px-2 py-0.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1 transition"
                        >
                          <MapPin className="w-3 h-3 text-sky-500" />
                          Carte SIG
                        </button>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition font-medium">
                          Voir <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {criticalInspections.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs font-light">
                  Aucun bâtiment critique détecté. Toutes les infrastructures sont sous contrôle sécurisé !
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleCardClick("all")}
              className="w-full bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs py-2.5 px-4 rounded-xl font-bold transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Voir tous les bâtiments inspectés ({totalInspected})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-400 leading-normal block text-center font-light mt-1">
              Modèle de prédiagnostic expérimental BatiSmart Roof IA.
            </span>
          </div>
        </div>

      </div>

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

      {/* PDF Download and Share Assistant Modal */}
      {isPdfModalOpen && (
        <PdfDownloadModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          inspection={pdfModalTarget || activeInspection || latestInspection}
          showToast={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 border border-slate-700 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
