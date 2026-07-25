import React, { useState } from "react";
import { 
  Camera, Smartphone, MapPin, Cpu, ShieldAlert, Sparkles, AlertTriangle, 
  Activity, BarChart3, Filter, Map, LayoutDashboard, FileText, Download, 
  Clock, ShieldCheck, CheckCircle2, TrendingDown, Coins, CalendarRange,
  ChevronRight, Play, Eye, ClipboardList, Info, HelpCircle
} from "lucide-react";

interface FiveStepsDiagnosticProps {
  theme?: "light" | "dark";
}

export default function FiveStepsDiagnostic({ theme = "light" }: FiveStepsDiagnosticProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activePathology, setActivePathology] = useState<string>("Fissures");

  const stepsData = [
    {
      id: 1,
      title: "INSPECTION & COLLECTE",
      fullTitle: "1. INSPECTION ET COLLECTE DES DONNÉES",
      subtitle: "Capture sur le terrain avec smartphone",
      icon: Smartphone,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      bullets: [
        "Photos haute résolution géolocalisées en temps réel",
        "Vidéos multi-angles et enregistrement de métadonnées",
        "Application légère compatible Android & iOS",
        "Fonctionne en mode déconnecté (hors ligne)"
      ],
      highlight: "Données automatiquement géolocalisées",
      illustration: (
        <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between p-3">
          {/* Smartphone UI container */}
          <div className="absolute inset-0 bg-[radial-gradient(#2a334d_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>REC 1080P</span>
            </div>
            <span>36.7510° N, 5.0567° E</span>
          </div>

          {/* Camera Frame View */}
          <div className="relative flex-1 flex items-center justify-center">
            {/* Target bracket */}
            <div className="w-16 h-16 border border-sky-400/60 rounded-sm relative">
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-sky-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-sky-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-sky-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-sky-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              </div>
            </div>
            
            {/* Simulated Roof Slab Background */}
            <div className="absolute inset-x-4 bottom-2 top-8 border border-slate-700/50 bg-slate-800/40 rounded flex items-end justify-center pb-2 overflow-hidden">
              <div className="w-full h-1/2 bg-slate-700/60 transform rotate-6 scale-110 border-t border-slate-600 flex items-center justify-center">
                <span className="text-[8px] text-slate-400 uppercase tracking-widest font-mono">Terrasse Béton</span>
              </div>
            </div>
          </div>

          {/* Controls bar */}
          <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-300 font-mono bg-slate-900/80 p-1.5 rounded border border-slate-850">
            <div className="flex items-center gap-1.5">
              <Camera className="w-3 h-3 text-sky-400" />
              <span>Photo_Région_06_Bâtiment_12.jpg</span>
            </div>
            <span className="text-[8px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-bold uppercase">Géotag OK</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "ANALYSE IA",
      fullTitle: "2. ANALYSE INTELLIGENTE PAR IA",
      subtitle: "Détection automatique des pathologies",
      icon: Cpu,
      color: "from-sky-500 to-blue-600",
      textColor: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-50 dark:bg-sky-950/30",
      bullets: [
        "Modèle YOLO & réseaux de neurones CNN entraînés sur 10k+ images",
        "Identification automatique de 12 familles de pathologies",
        "Analyse multi-angles : photos HD, drone, imagerie thermique",
        "Vitesse d'exécution ultra-rapide (analyse en moins de 30s)"
      ],
      highlight: "Segmentation pixel par pixel",
      illustration: (
        <div className="relative w-full aspect-video bg-[#0f172a] rounded-xl overflow-hidden border border-slate-800 shadow-md p-3 flex flex-col justify-between">
          <div className="absolute inset-0 bg-sky-500/5 pointer-events-none" />
          
          <div className="flex items-center justify-between text-[10px] text-sky-400 font-mono">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 animate-pulse text-sky-400" />
              MOTEUR DE SEGMENTATION IA
            </span>
            <span className="text-[9px] bg-sky-950 border border-sky-800/80 px-2 py-0.5 rounded text-sky-300 font-bold">MODE : ACTIVE</span>
          </div>

          {/* Roof mockup image with annotated bounding boxes */}
          <div className="relative flex-1 bg-slate-800/80 border border-slate-700/50 rounded-lg overflow-hidden my-1.5 flex items-center justify-center">
            {/* Visual simulation of a roof top with colored boxes */}
            <div className="w-full h-full relative p-2">
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-28 h-12 border border-red-500/80 bg-red-500/10 rounded flex flex-col justify-between p-1 z-10">
                <span className="text-[8px] bg-red-600 text-white font-extrabold px-1 py-0.2 rounded w-fit uppercase leading-none">Fissures : 94%</span>
                <span className="w-full border-t border-dashed border-red-500/40 self-center my-auto" />
              </div>

              <div className="absolute top-3 right-4 w-24 h-10 border border-purple-500/80 bg-purple-500/10 rounded flex flex-col justify-between p-1 z-10">
                <span className="text-[8px] bg-purple-600 text-white font-extrabold px-1 py-0.2 rounded w-fit uppercase leading-none">Infiltrations : 87%</span>
                <div className="w-3 h-3 rounded-full bg-purple-500/20 absolute bottom-1 right-1 animate-ping" />
              </div>

              <div className="absolute bottom-2 left-1/3 w-36 h-8 border border-amber-500/80 bg-amber-500/10 rounded flex flex-col justify-between p-1 z-10">
                <span className="text-[8px] bg-amber-600 text-white font-extrabold px-1 py-0.2 rounded w-fit uppercase leading-none">Humidité : 82%</span>
              </div>
              
              {/* Slate concrete grid background effect */}
              <div className="absolute inset-0 border border-slate-700 opacity-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)", backgroundSize: "20px 20px" }} />
            </div>
          </div>

          {/* Badges footer */}
          <div className="flex flex-wrap gap-1">
            {["Fissures", "Infiltrations", "Humidité", "Stagnation", "Moisissures"].map((tag) => (
              <span key={tag} className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded">
                #{tag}
              </span>
            ))}
            <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-sky-950 text-sky-400 rounded">
              +6 autres
            </span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "ÉVALUATION DU RISQUE",
      fullTitle: "3. ÉVALUATION DU NIVEAU DE RISQUE",
      subtitle: "Score de criticité automatisé",
      icon: ShieldAlert,
      color: "from-amber-500 to-red-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      bullets: [
        "Indexation globale de gravité notée de 0 à 10 par zone",
        "Cartographie de chaleur thermique des faiblesses d'étanchéité",
        "Déclenchement automatique de priorités d'intervention d'urgence",
        "Algorithme prédictif évaluant la vitesse de détérioration"
      ],
      highlight: "Estimation instantanée de l'urgence",
      illustration: (
        <div className="relative w-full aspect-video bg-[#0d1326] rounded-xl overflow-hidden border border-slate-800 shadow-md p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">SCORE DE RISQUE GLOBAL</span>
          
          <div className="flex items-center justify-between gap-4 my-2">
            {/* Circle gauge block */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="32" className="stroke-red-500" strokeWidth="6" fill="transparent" strokeDasharray="200" strokeDashoffset="36" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-red-500 font-display leading-none">8.2</span>
                <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">/ 10</span>
              </div>
            </div>

            {/* Critical alert notes */}
            <div className="flex-1 text-left space-y-1">
              <span className="px-2 py-0.5 bg-red-950 border border-red-900/50 rounded-full text-[9px] font-extrabold text-red-400 uppercase inline-block">
                Risque Élevé
              </span>
              <p className="text-[10.5px] text-slate-300 font-bold leading-snug">
                Infiltration active critique détectée sur la terrasse sud (EP Ibn Badis).
              </p>
              <p className="text-[9px] text-slate-500 leading-normal font-mono">
                Délai d'intervention conseillé : &lt; 30 jours.
              </p>
            </div>
          </div>

          {/* Simulated heat map thumbnail */}
          <div className="bg-slate-900 border border-slate-800 rounded p-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>Carte des vulnérabilités thermiques active</span>
            </div>
            <div className="w-14 h-3 rounded overflow-hidden bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 relative flex items-center justify-between text-[7px] text-slate-950 font-bold px-1">
              <span>F</span>
              <span>E</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "CARTOGRAPHIE SIG",
      fullTitle: "4. CARTOGRAPHIE ET AIDE À LA DÉCISION",
      subtitle: "Intégration SIG et tableau de bord intelligent",
      icon: Map,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      bullets: [
        "Visualisation cartographique interactive à l'échelle des wilayas",
        "Filtres avancés par typologie de bâtiment, urgence et commune",
        "Suivi consolidé de l'historique d'étanchéité du patrimoine public",
        "Aide à la planification pluriannuelle des chantiers d'étanchéité"
      ],
      highlight: "Aide à la décision GovTech",
      illustration: (
        <div className="relative w-full aspect-video bg-[#0f172a] rounded-xl overflow-hidden border border-slate-800 shadow-md p-3 flex flex-col justify-between">
          {/* Simulated map graphic */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#38bdf8 1.5px, transparent 1.5px)", backgroundSize: "16px 16px" }} />
          
          <div className="relative z-10 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
            <span className="flex items-center gap-1">
              <Map className="w-3.5 h-3.5" />
              SIG DÉCISIONNEL WILAYA
            </span>
            <span className="text-[8.5px] font-bold text-slate-500">ZOOM 12x</span>
          </div>

          {/* Interactive pins overlay */}
          <div className="relative flex-1 flex items-center justify-center my-1.5 border border-slate-800 bg-slate-900/60 rounded overflow-hidden">
            <div className="absolute top-3 left-8 flex flex-col items-center">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping absolute" />
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full border border-white" />
              <span className="text-[7px] text-slate-400 font-mono mt-0.5">École A</span>
            </div>

            <div className="absolute bottom-4 right-10 flex flex-col items-center">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
              <span className="text-[7px] text-slate-400 font-mono mt-0.5">Hôpital B</span>
            </div>

            <div className="absolute top-6 right-16 flex flex-col items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping absolute" />
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
              <span className="text-[7px] text-slate-400 font-mono mt-0.5">Mairie C</span>
            </div>

            {/* Scale card */}
            <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-slate-850 px-2 py-1 rounded text-[7px] text-slate-400 font-mono flex items-center gap-2">
              <span className="flex items-center gap-1">🟢 Sain : 37</span>
              <span className="flex items-center gap-1">🟡 Alerte : 56</span>
              <span className="flex items-center gap-1">🔴 Risque : 35</span>
            </div>
          </div>

          {/* Minimal widgets footer */}
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono bg-slate-950 p-1 rounded border border-slate-900">
            <span>Bâtiments analysés : 128</span>
            <span className="text-emerald-400 font-bold">Base synchronisée 🟢</span>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "RAPPORT & MAINTENANCE",
      fullTitle: "5. RAPPORT ET MAINTENANCE PRÉDICTIVE",
      subtitle: "Rapport automatique et suivi dans le temps",
      icon: FileText,
      color: "from-teal-500 to-emerald-600",
      textColor: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950/30",
      bullets: [
        "Génération instantanée de rapports d'aide à la décision en format PDF",
        "Fiches annotées avec localisation exacte du sinistre et photos",
        "Recommandations techniques claires sur l'utilisation d'éco-matériaux",
        "Devis et budgétisation optimisée d'après l'échelle de dégradation"
      ],
      highlight: "Rapport d'aide à la décision et export",
      illustration: (
        <div className="relative w-full aspect-video bg-white text-slate-800 rounded-xl overflow-hidden border border-slate-300 shadow-md p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-sky-600 rounded flex items-center justify-center text-white font-black text-[9px]">B</div>
              <div>
                <span className="text-[9px] font-black tracking-tight block text-slate-900 leading-none">BatiSmart Roof IA</span>
                <span className="text-[6.5px] text-slate-400 block mt-0.5">Rapport d'aide à la décision</span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[7px] font-extrabold uppercase">Réf. #2026-64</span>
          </div>

          {/* Document Content Mock */}
          <div className="flex-1 py-2 text-left space-y-1 text-[8px]">
            <div className="flex justify-between border-b border-slate-100 pb-1 text-[7.5px] font-bold text-slate-800">
              <span>Bâtiment : École Ibn Badis</span>
              <span>Date : 25/05/2026</span>
            </div>
            
            <p className="font-bold text-slate-900 leading-tight">
              Anomalie : Infiltrations importantes au niveau de la toiture terrasse ouest.
            </p>
            <p className="text-slate-500 font-light leading-normal">
              Recommandation : Réfection de l'étanchéité par application d'enduit de chaux naturelle et béton de chanvre éco-sourcé.
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[7px] font-mono font-bold">
              <span className="text-red-600">GRAVITÉ : 8.2 / 10 (CRITIQUE)</span>
              <span className="text-slate-800">Budget estimé : 45 000 DA</span>
            </div>
          </div>

          {/* Button placeholder */}
          <button className="w-full bg-[#0ea5e9] text-white rounded py-1 text-[9px] font-bold flex items-center justify-center gap-1 hover:bg-sky-600 transition">
            <Download className="w-3 h-3" />
            Télécharger le Rapport PDF d'aide à la décision
          </button>
        </div>
      )
    }
  ];

  const benefitsData = [
    { label: "GAIN DE TEMPS", desc: "Pré-diagnostic en moins de 2 minutes", icon: Clock },
    { label: "RÉDUCTION DES COÛTS", desc: "Interventions ciblées et budgétisation optimisée", icon: Coins },
    { label: "PLUS DE SÉCURITÉ", desc: "Anticipation des risques et prévention des dégâts", icon: ShieldCheck },
    { label: "MEILLEURE DURABILITÉ", desc: "Prolongation de la durée de vie du patrimoine bâti", icon: CheckCircle2 },
    { label: "DÉCISION ÉCLAIRÉE", desc: "Données fiables pour une aide à la décision efficace", icon: TrendingDown }
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Upper header */}
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2 flex-wrap">
          <Sparkles className="w-6 h-6 text-sky-500 animate-pulse" />
          <span>BatiSmart Roof IA : 5 ÉTAPES POUR UN PRÉ-DIAGNOSTIC INTELLIGENT</span>
        </h3>
        <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400 font-display">
          De l'inspection sur le terrain à la décision stratégique
        </p>
      </div>

      {/* Main 5 columns interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
        {stepsData.map((step) => {
          const StepIcon = step.icon;
          const isSelected = activeStep === step.id;

          return (
            <div 
              key={step.id}
              onClick={() => setActiveStep(isSelected ? null : step.id)}
              className={`flex flex-col justify-between border rounded-2xl p-4 transition-all duration-300 cursor-pointer relative group overflow-hidden ${
                isSelected 
                  ? "border-sky-500 ring-2 ring-sky-500/10 shadow-lg bg-sky-500/5" 
                  : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#070b19] hover:border-sky-500/40 hover:shadow-md"
              }`}
            >
              {/* Animated top color bar */}
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${step.color}`} />
              
              {/* Header */}
              <div className="space-y-2 z-10 pt-2">
                <div className="flex items-center justify-between">
                  {/* Circular step badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white bg-gradient-to-br ${step.color} shadow-sm`}>
                    {step.id}
                  </div>
                  <StepIcon className={`w-4.5 h-4.5 ${step.textColor} transition-transform duration-300 group-hover:scale-110`} />
                </div>

                <div className="min-h-[48px] flex flex-col justify-center">
                  <h4 className="font-black text-[11px] md:text-xs tracking-wider text-slate-950 dark:text-white uppercase leading-tight font-display">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                    {step.subtitle}
                  </p>
                </div>
              </div>

              {/* Graphic Mockup box */}
              <div className="my-4 transition-transform duration-300 group-hover:scale-[1.01]">
                {step.illustration}
              </div>

              {/* Bullet points & highlight content */}
              <div className="space-y-3 z-10">
                <ul className="space-y-1.5 text-[10px] md:text-[10.5px] font-bold text-slate-800 dark:text-slate-300 leading-snug">
                  {step.bullets.slice(0, isSelected ? 4 : 2).map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-sky-500 mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {step.bullets.length > 2 && !isSelected && (
                  <button className="text-[9.5px] font-extrabold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
                    <span>Voir plus de détails</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}

                {/* Lower highlight tag */}
                <div className="pt-2 border-t border-slate-150 dark:border-slate-800/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    {step.highlight}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer statistics benefits row */}
      <div className="bg-[#0c1229] dark:bg-[#070b19] text-white border border-slate-800 rounded-2xl p-4 md:p-5 mt-6 shadow-xl relative overflow-hidden">
        {/* Glow backdrop decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-12 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-between text-center relative z-10 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {benefitsData.map((benefit, idx) => {
            const BenefitIcon = benefit.icon;
            return (
              <div key={idx} className={`space-y-1.5 ${idx > 1 ? "pt-3 md:pt-0" : ""} ${idx > 0 ? "md:pl-4" : ""}`}>
                <div className="flex items-center justify-center gap-2">
                  <BenefitIcon className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-[10px] font-extrabold tracking-wider text-sky-300 uppercase block">
                    {benefit.label}
                  </span>
                </div>
                <p className="text-[10.5px] font-bold text-slate-100 leading-tight">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
