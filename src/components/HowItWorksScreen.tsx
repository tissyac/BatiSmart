import React from "react";
import { 
  Camera, 
  Sparkles, 
  Cpu, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  CheckCircle,
  Eye,
  Workflow,
  HelpCircle,
  ShieldCheck,
  Info,
  Bot,
  Target,
  Award,
  Zap
} from "lucide-react";

interface HowItWorksScreenProps {
  theme?: "light" | "dark";
}

export default function HowItWorksScreen({ theme = "dark" }: HowItWorksScreenProps) {
  const isDark = theme === "dark";

  const workflowSteps = [
    {
      id: 1,
      title: "Photo Smartphone",
      subtitle: "Acquisition initiale",
      desc: "Prise de vue standard RGB haute définition sur le terrain ou importation d'une photo géolocalisée.",
      icon: Camera,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Prétraitement de l'image",
      subtitle: "Optimisation de contraste",
      desc: "Filtrage numérique, correction de l'exposition et alignement de la perspective pour faciliter la détection.",
      icon: Layers,
      color: "from-cyan-500 to-sky-500"
    },
    {
      id: 3,
      title: "Analyse IA",
      subtitle: "Réseaux neuronaux",
      desc: "Traitement par l'algorithme de Vision par ordinateur de BatiSmart Roof IA pour segmenter la toiture-terrasse.",
      icon: Cpu,
      color: "from-sky-500 to-indigo-500"
    },
    {
      id: 4,
      title: "Détection des pathologies",
      subtitle: "Extraction de motifs",
      desc: "Identification automatique des types d'altération et extraction de caractéristiques géométriques et spectrales.",
      icon: AlertTriangle,
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: 5,
      title: "Classification",
      subtitle: "Évaluation de gravité",
      desc: "Tri sélectif de l'anomalie détectée selon une matrice technique multi-label standardisée.",
      icon: Eye,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 6,
      title: "Calcul du score",
      subtitle: "Index de vulnérabilité",
      desc: "Aggregation mathématique pondérée des pathologies pour établir un score d'évaluation de 0 à 10.",
      icon: TrendingUp,
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Rapport PDF",
      subtitle: "Restitution technique",
      desc: "Génération automatique et sécurisée du rapport de prédiagnostic assisté par IA avec préconisations de réhabilitation.",
      icon: FileText,
      color: "from-rose-500 to-emerald-500"
    }
  ];

  const targetPathologies = [
    "Fissures",
    "Humidité",
    "Infiltrations",
    "Dégradation de l'étanchéité",
    "Corrosion",
    "Stagnation d'eau",
    "Déformation visible"
  ];

  const criteria = [
    "Nombre de pathologies détectées",
    "Gravité des pathologies",
    "Surface affectée",
    "Niveau de dégradation",
    "Risque potentiel"
  ];

  return (
    <div className={`flex-1 overflow-y-auto h-full font-sans transition-colors duration-300 ${
      isDark ? "bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* HEADER SECTION */}
      <div className={`px-8 py-10 border-b relative overflow-hidden ${
        isDark ? "border-slate-900 bg-slate-950/40" : "border-slate-200 bg-white"
      }`}>
        {isDark && (
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        )}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-[#0ea5e9] tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Ingénierie & Vision par Ordinateur
            </span>
            <h1 className="text-3xl font-extrabold font-display tracking-tight leading-none">
              Fonctionnement de l'Intelligence Artificielle
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-light leading-relaxed">
              BatiSmart Roof IA réalise un prédiagnostic assisté par Intelligence Artificielle à partir d'images des toitures.
            </p>
          </div>
          <div className={`p-3 rounded-2xl border shrink-0 flex items-center gap-3 ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-100/80 border-slate-200"
          }`}>
            <Workflow className="w-8 h-8 text-sky-500" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Architecture</span>
              <span className="text-xs font-bold block">Pipeline d'analyse</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10 space-y-12">
        
        {/* INPUT DATA CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${
            isDark ? "bg-sky-950/80 border-sky-800 text-sky-100" : "bg-sky-50 border-sky-200 text-sky-950 shadow-sm"
          }`}>
            <h3 className="text-xs font-extrabold text-[#0ea5e9] tracking-widest uppercase mb-3 flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> Nature des images analysées
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-sm mt-0.5">●</span>
                <div>
                  <span className="font-extrabold text-xs text-sky-950 dark:text-sky-100">Photographies RGB de smartphones (Android/iOS)</span>
                  <p className="text-[11px] text-sky-800 dark:text-sky-300 font-medium mt-0.5">Clichés standards capturés sur le terrain par les agents de collecte à l'aide de leur téléphone portable.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-sm mt-0.5">●</span>
                <div>
                  <span className="font-extrabold text-xs text-sky-950 dark:text-sky-100">Images de toitures-terrasses de bâtiments publics</span>
                  <p className="text-[11px] text-sky-800 dark:text-sky-300 font-medium mt-0.5">Vues globales de la surface des toitures-terrasses plates ou toitures inaccessibles du patrimoine public.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-sm mt-0.5">●</span>
                <div>
                  <span className="font-extrabold text-xs text-sky-950 dark:text-sky-100">Vues rapprochées des pathologies</span>
                  <p className="text-[11px] text-sky-800 dark:text-sky-300 font-medium mt-0.5">Photographies détaillées de près des anomalies singulières (fissures, humidité, cloquage, usure) pour caractériser l'altération.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 border-t pt-2 border-dashed border-sky-300 dark:border-sky-800">
                <span className="text-amber-500 font-bold text-sm mt-0.5">⚠</span>
                <div>
                  <span className="font-bold text-[10.5px] text-sky-900 dark:text-sky-200 block">Drones, caméras thermiques & scans 3D :</span>
                  <p className="text-[10px] text-sky-800 dark:text-sky-300 font-medium">Ces technologies d'acquisition correspondent à des axes de recherche futurs en cours de développement et ne sont pas encore intégrées ni exploitées par le présent prototype.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className={`p-6 rounded-2xl border ${
            isDark ? "bg-sky-950/80 border-sky-800 text-sky-100" : "bg-sky-50 border-sky-200 text-sky-950 shadow-sm"
          }`}>
            <h3 className="text-xs font-extrabold text-[#0ea5e9] tracking-widest uppercase mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Méthode de classification (Vision Artificielle)
            </h3>
            <p className="text-[11.5px] text-sky-800 dark:text-sky-200 font-medium mb-3 leading-relaxed">
              Le prototype de recherche repose sur des techniques de vision par ordinateur utilisant des modèles de Deep Learning (réseaux de neurones de types <strong>CNN</strong> et <strong>YOLO</strong>) entrainés pour réaliser automatiquement les tâches de :
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2 text-sky-900 dark:text-sky-200 font-medium">
                <span className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full mt-1.5 shrink-0" />
                <span><strong className="font-bold text-sky-950 dark:text-sky-100">Détection automatique :</strong> Localisation spatiale des anomalies visibles sur les toitures.</span>
              </li>
              <li className="flex items-start gap-2 text-sky-900 dark:text-sky-200 font-medium">
                <span className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full mt-1.5 shrink-0" />
                <span><strong className="font-bold text-sky-950 dark:text-sky-100">Classification par catégorie :</strong> Identification typologique (fissures, humidité, corrosion, etc.).</span>
              </li>
              <li className="flex items-start gap-2 text-sky-900 dark:text-sky-200 font-medium">
                <span className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full mt-1.5 shrink-0" />
                <span><strong className="font-bold text-sky-950 dark:text-sky-100">Évaluation du niveau de risque :</strong> Calcul mathématique multicritère de l'index de dégradation.</span>
              </li>
              <li className="flex items-start gap-2 text-sky-900 dark:text-sky-200 font-medium">
                <span className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full mt-1.5 shrink-0" />
                <span><strong className="font-bold text-sky-950 dark:text-sky-100">Recommandations de traitement :</strong> Génération assistée d'actions correctives.</span>
              </li>
            </ul>
            <div className="mt-3.5 pt-2 border-t border-dashed border-sky-300 dark:border-sky-800 text-[10px] text-amber-700 dark:text-amber-400 font-medium leading-snug">
              ℹ️ <strong>Statut réglementaire :</strong> Cette méthode de prédiagnostic n'est pas homologuée ni officiellement certifiée. Il s'agit d'un outil d'aide à la décision à caractère expérimental.
            </div>
          </div>
        </div>

        {/* SECTION 1: SCHÉMA GRAPHIQUE INTERACTIF */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold tracking-widest text-sky-700 dark:text-sky-400 uppercase flex items-center gap-2">
            <span>●</span> Schéma logique du processus d'analyse (Workflow)
          </h3>
          
          <div className={`p-6 rounded-2xl border ${
            isDark ? "bg-sky-950/80 border-sky-800" : "bg-sky-50 border-sky-200 shadow-sm"
          }`}>
            {/* Horizontal flow diagram for desktops / Vertical list for mobiles */}
            <div className="hidden lg:grid grid-cols-7 gap-1 relative py-4">
              {/* Connector Lines */}
              <div className="absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-20 -z-10" />

              {workflowSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center relative px-2 group">
                    {/* Node Circle */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} p-[1px] shadow-lg group-hover:scale-110 transition-all duration-300 flex items-center justify-center text-white relative`}>
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? "bg-[#0b1129]" : "bg-white"}`}>
                        <Icon className="w-5 h-5 text-sky-500 group-hover:text-teal-400 transition" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-slate-700">
                        {step.id}
                      </span>
                    </div>

                    {/* Step Title */}
                    <span className="text-[10px] font-extrabold mt-4 block leading-tight text-slate-800 dark:text-slate-200">
                      {step.title}
                    </span>
                    <span className="text-[8px] opacity-75 mt-0.5 block font-light leading-none text-slate-500 dark:text-slate-400">
                      {step.subtitle}
                    </span>

                    {/* Arrow for intermediate steps */}
                    {idx < workflowSteps.length - 1 && (
                      <div className="absolute top-[20px] -right-2 flex items-center text-slate-300 dark:text-slate-700">
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Flow */}
            <div className="lg:hidden space-y-4">
              {workflowSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.color} p-[1px] flex items-center justify-center text-white shrink-0 relative`}>
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? "bg-[#070b19]" : "bg-white"}`}>
                        <Icon className="w-4.5 h-4.5 text-sky-500" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-slate-900 text-white rounded-full text-[8px] font-bold flex items-center justify-center border border-slate-700">
                        {step.id}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11.5px] font-extrabold text-slate-800 dark:text-slate-200 leading-none">
                        {step.title}
                      </h4>
                      <span className="text-[9.5px] text-slate-450 block font-medium mt-0.5">
                        {step.subtitle}
                      </span>
                    </div>
                    {idx < workflowSteps.length - 1 && (
                      <div className="h-4 border-l border-slate-350 dark:border-slate-700 ml-5 my-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: PATHOLOGIES DÉTECTEÉS */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold tracking-widest text-slate-400 uppercase flex items-center gap-2">
            <span>●</span> Pathologies détectées automatiquement
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {targetPathologies.map((patho, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border flex gap-3 items-center ${
                  isDark ? "bg-[#070b19]/40 border-slate-850 hover:border-emerald-500/20" : "bg-white border-slate-200 hover:shadow-sm"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{patho}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: CALCUL DU SCORE DE RISQUE */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold tracking-widest text-slate-400 uppercase flex items-center gap-2">
            <span>●</span> Calcul du niveau de risque
          </h3>
          
          <div className={`p-6 rounded-2xl border space-y-6 ${
            isDark ? "bg-[#070b19]/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-light">
              Le score est calculé automatiquement à partir des anomalies détectées sur les images analysées.
            </p>

            {/* Threshold scale */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-emerald-500/5 text-center">
                <span className="text-lg font-black text-emerald-500 block">0 – 2</span>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Faible</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-sky-500/5 text-center">
                <span className="text-lg font-black text-sky-500 block">3 – 5</span>
                <span className="text-[10px] font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-widest">Moyen</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-amber-500/5 text-center">
                <span className="text-lg font-black text-amber-500 block">6 – 8</span>
                <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Élevé</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-rose-500/5 text-center">
                <span className="text-lg font-black text-rose-500 block">9 – 10</span>
                <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest">Critique</span>
              </div>
            </div>

            {/* Criteria description */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-3">Critères pris en compte pour le calcul du score :</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {criteria.map((crit, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border text-center flex flex-col justify-center items-center ${
                    isDark ? "bg-slate-900/40 border-slate-850" : "bg-slate-50 border-slate-150"
                  }`}>
                    <span className="text-[9.5px] font-bold text-slate-700 dark:text-slate-300 leading-tight">{crit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: SPÉCIFICATIONS & RIGUEUR SCIENTIFIQUE */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold tracking-widest text-slate-400 uppercase flex items-center gap-2">
            <span>●</span> Spécifications & Rigueur Scientifique de l'IA
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border space-y-3.5 ${
              isDark ? "bg-[#070b19]/40 border-slate-850" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  Base de données d'apprentissage
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  Le prototype est entraîné sur une <strong>base de données expérimentale</strong> constituée d'images annotées de pathologies du bâtiment (fissures, humidité, corrosion, etc.). Dans le cadre du développement futur de ce projet de recherche, cette base sera progressivement enrichie par des données réelles collectées sur des <strong>bâtiments publics algériens</strong>. 
                  <br /><br />
                  Cela permettra d'ajuster les algorithmes aux particularités architecturales et climatiques locales.
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3.5 ${
              isDark ? "bg-[#070b19]/40 border-slate-850" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  Performances & Taux de Précision
                </h3>
                <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed font-light">
                  Conformément aux exigences de rigueur scientifique de notre comité d'encadrement, aucun taux d'exactitude ou de précision global (par exemple 90% ou 95%) n'est avancé de manière absolue sans validation métrologique indépendante.
                  <br /><br />
                  Les performances réelles des modèles de classification sont actuellement <strong>en cours d'évaluation expérimentale</strong> et seront affinées au fur et à mesure de l'expansion de la base de données d'apprentissage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: VALIDATION EXPÉRIMENTALE DU PROTOTYPE */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold tracking-widest text-slate-400 uppercase flex items-center gap-2">
            <span>●</span> Validation expérimentale du prototype
          </h3>

          <div className={`p-6 rounded-2xl border ${
            isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-250 shadow-sm"
          }`}>
            <p className="text-[11.5px] text-slate-600 dark:text-slate-450 leading-relaxed font-light mb-4">
              Dans le cadre de l'état actuel de recherche de notre prototype universitaire, des tests fonctionnels et des simulations expérimentales ont été menés pour valider son architecture logicielle. Ces essais de démonstration sur quelques bâtiments témoins ne constituent pas une validation scientifique définitive :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4.5 rounded-xl border ${isDark ? "bg-[#0b1021] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 mb-1">
                  🧪 Inspections de démonstration
                </h4>
                <p className="text-[10.5px] text-slate-550 dark:text-slate-400 leading-relaxed font-light">
                  Réalisation de simulations d'inspections visuelles et de tests techniques sur une sélection de 5 bâtiments représentatifs pour vérifier le comportement fonctionnel de l'interface.
                </p>
              </div>
              <div className={`p-4.5 rounded-xl border ${isDark ? "bg-[#0b1021] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 mb-1">
                  🤖 Analyse par IA & Classification
                </h4>
                <p className="text-[10.5px] text-slate-550 dark:text-slate-400 leading-relaxed font-light">
                  Validation de la transmission d'images et de l'extraction des caractéristiques visuelles des pathologies par notre algorithme expérimental (CNN/YOLO).
                </p>
              </div>
              <div className={`p-4.5 rounded-xl border ${isDark ? "bg-[#0b1021] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 mb-1">
                  📊 Calcul du niveau de risque
                </h4>
                <p className="text-[10.5px] text-slate-550 dark:text-slate-400 leading-relaxed font-light">
                  Vérification expérimentale de l'algorithme d'évaluation du niveau de risque et de la pertinence de l'indice de dégradation calculé (échelle de 0 à 10).
                </p>
              </div>
              <div className={`p-4.5 rounded-xl border ${isDark ? "bg-[#0b1021] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 mb-1">
                  📄 Rapports PDF & Cartographie SIG
                </h4>
                <p className="text-[10.5px] text-slate-550 dark:text-slate-400 leading-relaxed font-light">
                  Vérification du moteur de rendu PDF pour les rapports d'aide à la décision et de la liaison cartographique SIG pour la géo-localisation des diagnostics sur la carte interactive.
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400 font-light leading-relaxed">
              ⚠️ <strong>Rappel de validation :</strong> Ces essais ont uniquement pour but de prouver le concept technologique (Proof of Concept - POC) devant le jury de Label Startup et doivent impérativement être consolidés par des diagnostics professionnels in situ.
            </div>
          </div>
        </div>

        {/* FOOTER SCIENTIFIQUE / DISCLAIMER */}
        <div className={`p-6 rounded-2xl border border-dashed flex flex-col sm:flex-row items-center gap-4 ${
          isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-100/30 border-slate-250"
        }`}>
          <HelpCircle className="w-10 h-10 text-[#10b981] shrink-0" />
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              Aide à la Décision & Limites de Responsabilité
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              <strong>BatiSmart Roof IA</strong> constitue un outil expérimental de prédiagnostic d'aide à la décision et ne remplace jamais l'analyse technique d'un ingénieur de structure, d'un organisme agréé tel que le CTC (Contrôle Technique de Construction) ou d'un expert habilité du bâtiment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
