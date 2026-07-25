import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Building, 
  Camera, 
  Cpu, 
  AlertTriangle, 
  Lightbulb, 
  FileText, 
  Map, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Wrench, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  ChevronLeft,
  UserCheck,
  MapPin,
  UploadCloud,
  BarChart2,
  CheckSquare,
  Compass,
  Bot,
  Activity,
  Globe,
  Flame,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock
} from "lucide-react";

interface HowBatiSmartWorksScreenProps {
  theme?: "light" | "dark";
}

export default function HowBatiSmartWorksScreen({ theme = "dark" }: HowBatiSmartWorksScreenProps) {
  const isDark = theme === "dark";
  const [currentStep, setCurrentStep] = useState(0);
  const [pipelineSubStep, setPipelineSubStep] = useState(0);
  React.useEffect(() => {
    if (currentStep === 10) {
      const interval = setInterval(() => {
        setPipelineSubStep((prev) => (prev + 1) % 5);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const steps = [
    {
      id: 1,
      title: "1. Connexion sécurisée",
      shortTitle: "Connexion",
      icon: Lock,
      desc: "Authentification sécurisée de l'utilisateur avec accès protégé par rôle. Le prototype BatiSmart Roof AI adapte dynamiquement ses droits d'accès en fonction de votre profil d'utilisateur (Agent de terrain, Bureau d'études / Expert, Collectivité locale ou Administrateur) pour garantir la souveraineté des données de vos bâtiments publics.",
      color: "from-blue-600 to-sky-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/60 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <span className="font-extrabold text-sky-950 dark:text-sky-100 tracking-wider">PORTAIL BATISMART</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="space-y-2 py-4">
            <div className="p-2.5 rounded-xl bg-sky-100/90 dark:bg-sky-900/60 border border-sky-200 dark:border-sky-700">
              <span className="text-[10px] text-sky-700 dark:text-sky-300 block mb-1 font-semibold">PROFIL D'ACCÈS</span>
              <div className="flex items-center gap-2 text-sky-900 dark:text-sky-200 font-extrabold">
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Expert / Bureau d'études</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[10px] flex items-center gap-1.5 font-bold">
              <span>✓ Connexion sécurisée établie (Token JWT)</span>
            </div>
          </div>
          <div className="text-[9px] text-sky-800 dark:text-sky-300 text-center font-mono font-medium">
            Habilitation : Consultation & Annotation technique
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "2. Identification du bâtiment",
      shortTitle: "Bâtiment & GPS",
      icon: Building,
      desc: "Déclarez un édifice ou sélectionnez un bâtiment public existant dans l'inventaire de la Wilaya. Renseignez sa fiche technique (adresse, typologie de toiture plate inaccessible ou accessible, année de mise en service) et affectez-lui ses coordonnées géographiques GPS précises.",
      color: "from-sky-600 to-blue-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center gap-2 border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="font-extrabold text-sky-950 dark:text-sky-100">Localisation d'Édifice</span>
          </div>
          <div className="space-y-1.5 py-3 flex-1 flex flex-col justify-center">
            <div className="font-extrabold text-sky-900 dark:text-sky-200 text-xs">APC de Béjaïa (Hôtel de Ville)</div>
            <div className="text-[10px] text-sky-700 dark:text-sky-300 font-mono font-semibold">GPS: 36.7512° N, 5.0561° E</div>
            <div className="text-[10px] text-sky-800 dark:text-sky-300 font-medium">Wilaya : Béjaïa (06) • Toiture : Plate inaccessible</div>
            <div className="mt-2 w-full h-2 bg-sky-200 dark:bg-sky-900 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-sky-500 rounded-full" />
            </div>
          </div>
          <div className="text-[9.5px] text-sky-900 dark:text-sky-200 font-extrabold bg-sky-100 dark:bg-sky-900/60 border border-sky-300 dark:border-sky-700 rounded-lg p-1.5 text-center">
            Enregistré dans l'inventaire SIG
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "3. Acquisition des données",
      shortTitle: "Photos & Terrain",
      icon: Camera,
      desc: "Importez les photographies RGB de la toiture-terrasse capturées par les agents de terrain à l'aide de leur smartphone (iOS ou Android). L'interface supporte le téléversement par cliquer-glisser ainsi que la capture directe. Elle est optimisée pour des photographies rapprochées montrant les fissures ou les traces de stagnation d'eau.",
      color: "from-indigo-600 to-sky-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/60 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80" 
            alt="Toiture terrasse" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="z-20 flex items-center justify-between">
            <span className="font-extrabold text-white tracking-wide uppercase text-[9px] bg-sky-600 px-2 py-0.5 rounded shadow-xs">MODE FIELD ACQUISITION</span>
            <span className="text-red-500 text-[9px] font-mono font-extrabold animate-pulse bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded">● CAM LIVE</span>
          </div>
          <div className="z-20 text-center py-5 flex flex-col items-center justify-center gap-1 bg-sky-950/70 backdrop-blur-xs rounded-xl p-2 border border-sky-400/40">
            <UploadCloud className="w-7 h-7 text-sky-300 animate-bounce" />
            <span className="text-[10.5px] text-white font-extrabold">Glisser les clichés RGB</span>
            <span className="text-[9.5px] text-sky-100 font-medium">Format JPEG/PNG standards de smartphones</span>
          </div>
          <div className="z-20 text-[9px] text-white font-mono font-bold text-center bg-sky-950/80 py-0.5 rounded">
            Résolution min recommandée : 12 MP
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "4. Analyse par Intelligence Artificielle",
      shortTitle: "Analyse IA",
      icon: Cpu,
      desc: "Le modèle de vision par ordinateur (Deep Learning expérimental) analyse le cliché pixel par pixel. Il applique une détection automatique des pathologies d'étanchéité visibles en superposant des boîtes englobantes colorées autour des défauts structuraux majeurs identifiés.",
      color: "from-indigo-600 to-violet-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs relative overflow-hidden">
          <div className="absolute inset-x-0 h-0.5 bg-sky-500 top-1/2 shadow-[0_0_10px_#0ea5e9] animate-[scanLine_2s_infinite_ease-in-out] z-10" />
          <div className="z-20 flex items-center justify-between border-b border-sky-200 dark:border-sky-800 pb-1">
            <span className="text-[10px] font-extrabold text-sky-950 dark:text-sky-100 tracking-wider">DETECTION RESEAU DE NEURONES</span>
            <span className="text-[9px] text-sky-800 dark:text-sky-300 font-mono font-bold bg-sky-200 dark:bg-sky-900 px-1.5 py-0.5 rounded">GPU Active</span>
          </div>
          <div className="z-20 my-auto space-y-2">
            <div className="border border-red-500/80 bg-red-50 dark:bg-red-950/50 p-2 rounded-xl relative">
              <span className="absolute -top-2.5 left-2 bg-red-600 text-white font-mono text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold shadow-xs">FISSURE ACTIVE</span>
              <p className="text-[10px] text-red-950 dark:text-red-200 font-bold mt-1">Fissure de cisaillement détectée sur le revêtement.</p>
            </div>
            <div className="border border-blue-500/80 bg-sky-100 dark:bg-sky-900/60 p-2 rounded-xl relative">
              <span className="absolute -top-2.5 left-2 bg-blue-600 text-white font-mono text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold shadow-xs">STAGNATION D'EAU</span>
              <p className="text-[10px] text-sky-950 dark:text-sky-100 font-bold mt-1">Humidité persistante décelée en périphérie.</p>
            </div>
          </div>
          <div className="z-20 text-[9px] text-sky-800 dark:text-sky-300 text-center font-mono font-semibold">
            Prototype de recherche (CNN & YOLO)
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "5. Évaluation du niveau de risque",
      shortTitle: "Niveau de risque",
      icon: AlertTriangle,
      desc: "L'IA calcule un index mathématique d'évaluation du niveau de risque de dégradation allant de 0.0 (parfait état) à 10.0 (sinistre critique imminent). Les anomalies sont classifiées par catégorie pour évaluer la gravité cumulée et l'urgence de la réhabilitation.",
      color: "from-amber-600 to-orange-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <span className="font-extrabold text-sky-950 dark:text-sky-100">INDICE DE RISQUE CALCULÉ</span>
            <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">MODÉRÉ</span>
          </div>
          <div className="flex items-center justify-center py-4 gap-4">
            <div className="relative w-18 h-18 rounded-full border-4 border-dashed border-orange-500 flex items-center justify-center bg-orange-50 dark:bg-orange-950/40">
              <span className="text-xl font-black text-orange-600 dark:text-orange-400">6.8</span>
              <span className="text-[8px] text-sky-800 dark:text-sky-300 font-bold absolute bottom-1.5">/ 10</span>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="text-sky-950 dark:text-sky-100 font-extrabold">Classification :</div>
              <div className="text-sky-800 dark:text-sky-300 font-semibold">• Fissures : Criticité moyenne</div>
              <div className="text-sky-800 dark:text-sky-300 font-semibold">• Infiltration : Risque potentiel</div>
            </div>
          </div>
          <div className="text-[9px] text-amber-900 dark:text-amber-200 font-bold bg-amber-100 dark:bg-amber-950/60 p-1.5 rounded-lg border border-amber-300 dark:border-amber-800 text-center">
            Prédiagnostic à consolider par un expert qualifié
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "6. Recommandations intelligentes",
      shortTitle: "Préconisations",
      icon: Lightbulb,
      desc: "À partir des pathologies identifiées par vision par ordinateur, l'algorithme génère des fiches de préconisations techniques adaptées : réfection d'étanchéité, pose d'un revêtement d'éco-matériaux locaux réfléchissants (Cool Roof), entretien des gargouilles ou traitement des acrotères.",
      color: "from-emerald-600 to-teal-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center gap-1.5 border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-extrabold text-sky-950 dark:text-sky-100">Recommandation Assistée</span>
          </div>
          <div className="space-y-2 py-3 flex-1 flex flex-col justify-center">
            <div className="bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-2 rounded-xl text-emerald-950 dark:text-emerald-200">
              <div className="font-extrabold text-[10.5px]">Pose de membrane élastomère</div>
              <p className="text-[9.5px] text-emerald-800 dark:text-emerald-300 font-medium mt-0.5">Application d'une résine armée sur les fissures actives pour bloquer l'infiltration.</p>
            </div>
            <div className="bg-sky-100/90 dark:bg-sky-900/60 border border-sky-300 dark:border-sky-700 p-2 rounded-xl text-sky-950 dark:text-sky-100">
              <div className="font-extrabold text-[10.5px]">Option Éco : Cool Roof Algérien</div>
              <p className="text-[9.5px] text-sky-800 dark:text-sky-300 font-medium mt-0.5">Revêtement blanc à haute réflectance thermique pour limiter la surchauffe.</p>
            </div>
          </div>
          <div className="text-[9px] text-sky-800 dark:text-sky-300 font-mono font-semibold text-center">
            Génération par arbre de décision technique
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "7. Rapport d'aide à la décision (PDF)",
      shortTitle: "Rapport PDF",
      icon: FileText,
      desc: "Générez d'un clic un rapport PDF complet qui résume le prédiagnostic d'étanchéité, l'indice de dégradation calculé, les photos annotées, la géo-localisation de l'édifice et les estimations financières d'aide à la budgétisation. Ce rapport sert de base pour planifier l'attribution des enveloppes de réhabilitation.",
      color: "from-teal-600 to-sky-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="font-extrabold text-sky-950 dark:text-sky-100">EXPORTER LE COMPTE RENDU</span>
            </div>
            <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded uppercase font-extrabold shadow-xs">PDF</span>
          </div>
          <div className="p-3 bg-sky-100/90 dark:bg-sky-900/60 rounded-xl border border-sky-200 dark:border-sky-700 text-center py-4 flex flex-col items-center justify-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
              PDF
            </div>
            <span className="text-[10px] font-extrabold text-sky-950 dark:text-sky-100">Rapport_BatiSmart_Aide_Decision.pdf</span>
            <span className="text-[9px] text-sky-700 dark:text-sky-300 font-medium">QR Code d'identification inclus</span>
          </div>
          <button className="w-full bg-sky-600 text-white rounded-lg py-1.5 text-[9.5px] font-extrabold shadow-md hover:bg-sky-700 transition">
            Simuler le téléchargement
          </button>
        </div>
      )
    },
    {
      id: 8,
      title: "8. Cartographie SIG Algérie",
      shortTitle: "Carte SIG",
      icon: Map,
      desc: "Tous les prédiagnostics sont centralisés sur la carte interactive SIG. Vous pouvez visualiser instantanément l'ensemble du patrimoine public d'une collectivité locale et repérer les toitures nécessitant une maintenance prioritaire grâce à un code couleur (vert, orange, rouge) basé sur l'index de risque calculé.",
      color: "from-blue-600 to-indigo-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none">
            <Globe className="w-32 h-32 text-sky-500" />
          </div>
          <div className="z-20 flex items-center justify-between border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <span className="font-extrabold text-sky-950 dark:text-sky-100">CARTE SYSTEME SIG</span>
            <span className="bg-sky-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">Béjaïa (06)</span>
          </div>
          <div className="z-20 flex-1 flex flex-col justify-center items-center gap-1.5 py-4">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>
            <span className="text-[10.5px] text-sky-950 dark:text-sky-100 font-extrabold">5 Bâtiments Géo-référencés</span>
            <span className="text-[9px] text-sky-700 dark:text-sky-300 font-semibold">Wilaya pilote : Béjaïa</span>
          </div>
          <div className="z-20 text-[9px] text-sky-800 dark:text-sky-300 text-center font-mono font-semibold">
            Couches de données : Cadastre, Climat & Risques
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "9. Tableau de bord décisionnel et interactif",
      shortTitle: "Tableau de bord",
      icon: LayoutDashboard,
      desc: "Le tableau de bord centralise en temps réel les principaux indicateurs de l'état du patrimoine bâti. Il permet de suivre les prédiagnostics, les niveaux de risque, les alertes, les interventions, la rentabilité économique (ROI), les tableaux de bord décisionnels et d'aider les décideurs à planifier, prioriser et optimiser les actions de maintenance.",
      color: "from-sky-600 to-indigo-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-800/80 pb-1.5">
            <span className="font-extrabold text-sky-950 dark:text-sky-100 uppercase text-[9px] tracking-wider">CONSOLE ANALYTIQUE</span>
            <span className="text-[8.5px] bg-sky-600 text-white px-2 py-0.5 rounded uppercase font-extrabold">LIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-2 py-2 flex-1">
            <div className="p-2 rounded-xl bg-sky-100/90 dark:bg-sky-900/60 border border-sky-200 dark:border-sky-700 text-center">
              <span className="text-[8.5px] text-sky-700 dark:text-sky-300 block uppercase font-bold">Bâtis inspectés</span>
              <span className="text-base font-black text-sky-950 dark:text-sky-100">5</span>
            </div>
            <div className="p-2 rounded-xl bg-sky-100/90 dark:bg-sky-900/60 border border-sky-200 dark:border-sky-700 text-center">
              <span className="text-[8.5px] text-sky-700 dark:text-sky-300 block uppercase font-bold">Indice Moyen</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400">4.1 / 10</span>
            </div>
            <div className="p-2 rounded-xl bg-sky-100/90 dark:bg-sky-900/60 border border-sky-200 dark:border-sky-700 text-center col-span-2 flex items-center justify-between px-3">
              <span className="text-[9px] text-sky-900 dark:text-sky-200 font-extrabold uppercase">Simulateur budget :</span>
              <span className="text-[10.5px] font-black text-emerald-700 dark:text-emerald-400 font-mono">1.2M DZD</span>
            </div>
          </div>
          <div className="text-[9px] text-sky-800 dark:text-sky-300 text-center font-mono font-semibold">
            Filtrage dynamique chronologique intégré
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "10. Assistant IA interactif",
      shortTitle: "Assistant IA",
      icon: MessageSquare,
      desc: "BatiSmart intègre un Assistant conversationnel de support et de conseils d'ingénierie. Il est capable d'expliquer les conclusions d'un prédiagnostic, d'expliciter le calcul de l'indice de risque, de conseiller sur l'application de normes techniques locales (DTR) et d'aider les agents de terrain en cas de besoin d'auto-réparation de l'application.",
      color: "from-blue-600 to-sky-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center gap-1.5 border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <Bot className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="font-extrabold text-sky-950 dark:text-sky-100">Conseiller Technique IA</span>
          </div>
          <div className="space-y-2 py-3 flex-1 flex flex-col justify-end">
            <div className="p-2 rounded-xl bg-sky-200/80 dark:bg-sky-900/80 text-sky-950 dark:text-sky-100 text-[10px] max-w-[85%] self-start border border-sky-300 dark:border-sky-700 font-semibold">
              Comment traiter une fissure de 3mm ?
            </div>
            <div className="p-2 rounded-xl bg-sky-600 text-white text-[10px] max-w-[85%] self-end font-bold shadow-xs">
              🤖 Il est recommandé d'injecter un mastic polyuréthane après brossage...
            </div>
          </div>
          <div className="text-[9px] text-sky-800 dark:text-sky-300 text-center font-mono font-semibold">
            Expertise sur les désordres d'étanchéité
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "11. Comment fonctionne l'Intelligence Artificielle ?",
      shortTitle: "Moteur IA",
      icon: Sparkles,
      desc: "Découvrez notre pipeline de traitement d'images sous forme d'une animation moderne. Les images standards capturées par smartphone subissent 5 phases successives :\n\n1. Prétraitement : Redimensionnement, normalisation d'exposition et amélioration des contrastes de texture.\n2. Détection : Extraction des caractéristiques géométriques des fissures par vision par ordinateur.\n3. Classification : Identification de la famille d'anomalies (cloquage, usure, humidité stagnante).\n4. Calcul de risque : Calcul mathématique de l'indice de dégradation de 0 à 10.\n5. Recommandations : Liaison des anomalies aux préconisations d'aide à la décision.",
      color: "from-indigo-600 to-sky-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <span className="font-extrabold text-sky-950 dark:text-sky-100">PIPELINE DE TRAITEMENT IA</span>
            <span className="text-sky-700 dark:text-sky-300 text-[9px] font-mono font-extrabold animate-pulse bg-sky-200/80 dark:bg-sky-900 px-1.5 py-0.5 rounded">BOUCLE ACTIVE</span>
          </div>
          
          <div className="py-2 space-y-1">
            {[
              { idx: 0, label: "1. Prétraitement d'image", desc: "Amélioration des contrastes texturaux" },
              { idx: 1, label: "2. Détection YOLO / CNN", desc: "Localisation des défauts visuels" },
              { idx: 2, label: "3. Classification d'anomalie", desc: "Identification de la famille (fissures, eau)" },
              { idx: 3, label: "4. Calcul de risque", desc: "Évaluation de la criticité de dégradation" },
              { idx: 4, label: "5. Génération préconisations", desc: "Recommandations de traitement" }
            ].map((subStep) => (
              <div 
                key={subStep.idx}
                className={`p-1 px-2 rounded-lg transition-all duration-300 flex items-center justify-between ${
                  pipelineSubStep === subStep.idx 
                    ? "bg-sky-600 text-white font-extrabold shadow-xs scale-[1.02]" 
                    : "bg-sky-100/80 dark:bg-sky-900/40 text-sky-900 dark:text-sky-300 font-medium"
                }`}
              >
                <div>
                  <span className="text-[10px] block leading-tight">{subStep.label}</span>
                  {pipelineSubStep === subStep.idx && (
                    <span className="text-[8px] font-medium text-sky-100 block leading-none mt-0.5">{subStep.desc}</span>
                  )}
                </div>
                {pipelineSubStep === subStep.idx && (
                  <RefreshCw className="w-3 h-3 text-white animate-spin" />
                )}
              </div>
            ))}
          </div>

          <div className="text-[9.5px] text-amber-900 dark:text-amber-200 text-center font-bold leading-none">
            Analyse indicative de recherche universitaire
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "12. Paramètres",
      shortTitle: "Paramètres",
      icon: Settings,
      desc: "Configurez l'application selon vos préférences : basculez à tout moment entre le mode sombre et le mode clair pour le confort visuel sur le terrain, sélectionnez votre langue d'usage préférée (Français, Arabe, Anglais), configurez les alertes et gérez les options de confidentialité des données publiques.",
      color: "from-slate-700 to-slate-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center gap-1.5 border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <Settings className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="font-extrabold text-sky-950 dark:text-sky-100">Préférences Système</span>
          </div>
          <div className="space-y-1.5 py-3 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between p-2 bg-sky-100/90 dark:bg-sky-900/60 rounded-xl border border-sky-200 dark:border-sky-700">
              <span className="text-sky-900 dark:text-sky-200 font-bold">Langue</span>
              <span className="text-sky-600 dark:text-sky-400 font-extrabold">FR / AR / EN</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-sky-100/90 dark:bg-sky-900/60 rounded-xl border border-sky-200 dark:border-sky-700">
              <span className="text-sky-900 dark:text-sky-200 font-bold">Mode Sombre</span>
              <span className="w-6 h-3 bg-sky-600 rounded-full relative flex items-center justify-end px-0.5"><span className="w-2 h-2 bg-white rounded-full"></span></span>
            </div>
            <div className="flex items-center justify-between p-2 bg-sky-100/90 dark:bg-sky-900/60 rounded-xl border border-sky-200 dark:border-sky-700">
              <span className="text-sky-900 dark:text-sky-200 font-bold">Rapports Cloud</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold uppercase text-[9px]">Synchronisés</span>
            </div>
          </div>
          <div className="text-[9px] text-sky-800 dark:text-sky-300 text-center font-mono font-semibold">
            Paramétrage conforme aux exigences RGPD
          </div>
        </div>
      )
    },
    {
      id: 13,
      title: "13. Support & Updates",
      shortTitle: "Support & Updates",
      icon: Wrench,
      desc: "Le centre d'assistance technique intelligent intègre une Foire Aux Questions (FAQ), une documentation de tutoriels interactifs, une boîte à suggestions pour enrichir la recherche, un outil d'enregistrement de tickets de bugs avec téléversement et le journal de version répertoriant les dernières mises à jour du prototype.",
      color: "from-blue-600 to-sky-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <span className="font-extrabold text-sky-950 dark:text-sky-100">ASSISTANCE & MISES À JOUR</span>
            <span className="bg-sky-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">V1.3.2</span>
          </div>
          <div className="space-y-1.5 py-3 flex-1 flex flex-col justify-center">
            <div className="p-2 bg-sky-100/90 dark:bg-sky-900/60 rounded-xl border border-sky-200 dark:border-sky-700 flex items-center justify-between text-sky-950 dark:text-sky-100 font-bold">
              <span>🛠️ Auto-réparation Android</span>
              <span className="text-[8px] bg-sky-600 text-white px-1.5 py-0.5 rounded uppercase font-extrabold">PRÊT</span>
            </div>
            <div className="p-2 bg-sky-100/90 dark:bg-sky-900/60 rounded-xl border border-sky-200 dark:border-sky-700 flex items-center justify-between text-sky-900 dark:text-sky-200 font-semibold">
              <span>📝 Soumettre un rapport de bug</span>
              <span className="font-bold text-sky-600">+</span>
            </div>
            <div className="text-[9px] text-sky-800 dark:text-sky-300 text-center italic mt-1 font-medium">
              "Centre de maintenance applicatif réactif"
            </div>
          </div>
          <div className="text-[9px] text-sky-800 dark:text-sky-300 text-center font-mono font-semibold">
            Support prototype universitaire actif
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: "14. Fonctionnalités futures (R&D)",
      shortTitle: "Axe R&D",
      icon: ArrowUpRight,
      desc: "Inscrit dans une vision d'avenir Smart City, le plan de développement du prototype prévoit l'intégration de technologies avancées : vols de drones autonomes pour l'acquisition automatique de photos, caméras thermiques pour détecter l'humidité sous-jacente non visible à l'œil nu, scans 3D LIDAR, liaison avec la maquette numérique BIM, jumeaux numériques interactifs de structures de l'Etat, capteurs IoT d'humidité intégrés et modèles de maintenance prédictive avancée.",
      color: "from-indigo-600 to-sky-500",
      illustration: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-sky-50/90 dark:bg-sky-950/80 rounded-2xl border border-sky-300 dark:border-sky-800 text-xs">
          <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-800/80 pb-2">
            <span className="font-extrabold text-sky-950 dark:text-sky-100">FEUILLE DE ROUTE SCIENTIFIQUE</span>
            <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded animate-pulse">R&D</span>
          </div>
          <div className="grid grid-cols-2 gap-2 py-2 flex-1">
            <div className="p-2 rounded-xl bg-sky-100/90 dark:bg-sky-900/60 border border-sky-200 dark:border-sky-700 text-center flex flex-col items-center justify-center">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-0.5" />
              <span className="text-[9px] font-extrabold text-sky-950 dark:text-sky-100">Drones & LIDAR</span>
            </div>
            <div className="p-2 rounded-xl bg-sky-100/90 dark:bg-sky-900/60 border border-sky-200 dark:border-sky-700 text-center flex flex-col items-center justify-center">
              <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400 mb-0.5" />
              <span className="text-[9px] font-extrabold text-sky-950 dark:text-sky-100">Thermographie</span>
            </div>
            <div className="p-2 rounded-xl bg-sky-100/90 dark:bg-sky-900/60 border border-sky-200 dark:border-sky-700 text-center flex flex-col items-center justify-center">
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400 mb-0.5" />
              <span className="text-[9px] font-extrabold text-sky-950 dark:text-sky-100">BIM / Jumeaux</span>
            </div>
            <div className="p-2 rounded-xl bg-sky-100/90 dark:bg-sky-900/60 border border-sky-200 dark:border-sky-700 text-center flex flex-col items-center justify-center">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-0.5" />
              <span className="text-[9px] font-extrabold text-sky-950 dark:text-sky-100">Capteurs IoT</span>
            </div>
          </div>
          <div className="text-[9px] text-sky-800 dark:text-sky-300 text-center font-mono font-semibold">
            Développements futurs en cours de recherche
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const activeStepObj = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto scrollbar-thin ${
      isDark ? "bg-[#0b1021]/30" : "bg-slate-50/50"
    }`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* TITLE SECTION */}
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-widest text-[#0ea5e9] uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> GUIDE INTERACTIF DE DÉCOUVERTE RAPIDE
          </span>
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Comment fonctionne BatiSmart Roof AI ?
          </h2>
        </div>

        {/* PROGRESS BAR */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? "bg-sky-950/80 border-sky-800 text-sky-100" : "bg-sky-50 border-sky-200 text-sky-950 shadow-xs"
        }`}>
          <div className="flex items-center justify-between text-[11px] font-extrabold mb-2">
            <span>Étape {currentStep + 1} sur {steps.length} — {activeStepObj.shortTitle}</span>
            <span className="text-sky-600 dark:text-sky-400 font-black">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2.5 bg-sky-200/80 dark:bg-sky-900/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sky-600 via-sky-400 to-emerald-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ACTIVE CARD SLIDER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: INTERACTIVE VISUAL DEMO */}
          <div className="lg:col-span-5 flex flex-col">
            <div className={`p-6 rounded-3xl border flex-1 flex flex-col justify-between relative overflow-hidden min-h-[250px] ${
              isDark ? "bg-sky-950/80 border-sky-800" : "bg-sky-50 border-sky-200 shadow-sm"
            }`}>
              {/* Background gradient glowing */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${activeStepObj.color} opacity-10 rounded-full blur-3xl pointer-events-none`} />
              
              <div className="text-[10px] text-sky-700 dark:text-sky-300 font-extrabold uppercase tracking-widest flex items-center gap-1">
                <span>SIMULATION FONCTIONNELLE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
              </div>
              
              <div className="my-6 flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-[320px] aspect-video flex items-center justify-center"
                  >
                    {activeStepObj.illustration}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="text-center text-[10px] text-sky-800 dark:text-sky-300 font-medium">
                * Maquette interactive visualisant le fonctionnement réel de l'application
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TEXT CONTENT & STEPS WALKTHROUGH */}
          <div className="lg:col-span-7 flex flex-col">
            <div className={`p-6 md:p-8 rounded-3xl border flex-1 flex flex-col justify-between ${
              isDark ? "bg-sky-950/80 border-sky-800 text-sky-100" : "bg-sky-50 border-sky-200 text-sky-950 shadow-sm"
            }`}>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 flex-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-[#0ea5e9] flex items-center justify-center shrink-0 shadow-inner">
                      {React.createElement(activeStepObj.icon, { className: "w-6 h-6" })}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        {activeStepObj.title}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-450 uppercase tracking-wider block mt-0.5">
                        Module applicatif • BatiSmart Roof AI
                      </span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed whitespace-pre-line pt-2">
                    {activeStepObj.desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* ACTION BUTTONS: PREVIOUS / NEXT */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-5 mt-6 gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition duration-300 ${
                    currentStep === 0 
                      ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400" 
                      : "border-slate-250 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>

                <div className="flex gap-1.5">
                  {steps.map((_, sidx) => (
                    <button
                      key={sidx}
                      onClick={() => setCurrentStep(sidx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentStep === sidx 
                          ? "bg-sky-500 w-5" 
                          : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
                      }`}
                      aria-label={`Aller à l'étape ${sidx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition duration-300 ${
                    currentStep === steps.length - 1
                      ? "opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400 shadow-none"
                      : "bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white cursor-pointer"
                  }`}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* QUICK NAVIGATION GRID */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold tracking-widest text-slate-450 uppercase flex items-center gap-2">
            <span>●</span> Accès rapide aux 14 rubriques du parcours
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = currentStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between min-h-[90px] transition-all duration-300 group cursor-pointer ${
                    isActive
                      ? "bg-sky-500 text-white font-extrabold border-sky-400 shadow-md ring-2 ring-sky-400/40"
                      : isDark
                        ? "bg-sky-950/60 border-sky-800/80 hover:border-sky-600 text-sky-200 hover:text-white"
                        : "bg-sky-50 border-sky-200 hover:border-sky-400 text-sky-950 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isActive ? "bg-sky-500/10 text-sky-400" : "bg-slate-100 dark:bg-slate-950/60 text-slate-400 group-hover:text-sky-500"
                    }`}>
                      <StepIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-black font-mono text-slate-400 dark:text-slate-500">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold tracking-tight leading-tight block truncate w-full">
                    {step.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
