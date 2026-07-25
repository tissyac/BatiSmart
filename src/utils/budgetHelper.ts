import { Inspection } from "../types";

export interface BudgetEstimation {
  minAmount: number;
  maxAmount: number;
  degradationLevel: string;
  recommendedIntervention: string;
  detectedPathologies: string[];
  referenceCosts: string;
  confidenceIndex: number;
  confidenceText: string;
}

export function getBudgetEstimation(inspection: Inspection | null): BudgetEstimation {
  if (!inspection) {
    return {
      minAmount: 0,
      maxAmount: 0,
      degradationLevel: "Non renseigné",
      recommendedIntervention: "Aucune intervention recommandée",
      detectedPathologies: [],
      referenceCosts: "Non spécifié",
      confidenceIndex: 0,
      confidenceText: "Indisponible"
    };
  }

  const score = inspection.riskScore;
  let minAmount = 150000;
  let maxAmount = 250000;
  let degradationLevel = "Faible";
  let recommendedIntervention = "Entretien préventif régulier & Protection passive Cool Roof (peinture réflective)";
  let confidenceIndex = 95;

  if (score >= 3 && score < 6) {
    minAmount = 300000;
    maxAmount = 450000;
    degradationLevel = "Modéré";
    recommendedIntervention = "Réparation d'étanchéité locale, colmatage des fissures & curage des évacuations pluviales";
    confidenceIndex = 90;
  } else if (score >= 6 && score < 8) {
    minAmount = 600000;
    maxAmount = 850000;
    degradationLevel = "Élevé";
    recommendedIntervention = "Réfection complète de la chape d'étanchéité & Pose de panneaux isolants en liège expansé local";
    confidenceIndex = 85;
  } else if (score >= 8) {
    minAmount = 1200000;
    maxAmount = 1650000;
    degradationLevel = "Critique / Structurel";
    recommendedIntervention = "Consolidation de la dalle béton, réfection complète d'étanchéité multicouche & isolation thermique haute performance";
    confidenceIndex = 80;
  }

  // Gather detected pathologies
  const detectedPathologies: string[] = [];
  if (inspection.cracks?.detected) {
    detectedPathologies.push(`Fissures (gravité: ${inspection.cracks.severity || 'Faible'})`);
  }
  if (inspection.humidity?.detected) {
    detectedPathologies.push(`Humidité (gravité: ${inspection.humidity.severity || 'Faible'})`);
  }
  if (inspection.infiltration?.detected) {
    detectedPathologies.push(`Infiltrations d'eau (gravité: ${inspection.infiltration.severity || 'Faible'})`);
  }
  if (inspection.degradation?.detected) {
    detectedPathologies.push(`Dégradation de l'étanchéité (gravité: ${inspection.degradation.severity || 'Faible'})`);
  }

  if (detectedPathologies.length === 0) {
    detectedPathologies.push("Aucune pathologie majeure détectée");
  }

  // Adjust cost references based on building type for high realism
  let referenceCosts = "Coûts de référence d'étanchéité et travaux de génie civil appliqués au bâtiment public en Algérie.";
  if (inspection.buildingType === "Santé") {
    minAmount = Math.round(minAmount * 1.25);
    maxAmount = Math.round(maxAmount * 1.25);
    referenceCosts = "Tarifs de référence pour les établissements de santé publics (normes de sécurité sanitaire élevées, travaux en site occupé).";
  } else if (inspection.buildingType === "Judiciaire") {
    minAmount = Math.round(minAmount * 1.15);
    maxAmount = Math.round(maxAmount * 1.15);
    referenceCosts = "Tarifs de référence pour les bâtiments judiciaires sensibles (contraintes d'accès élevées, travaux sécurisés).";
  } else if (inspection.buildingType === "Scolaire/Universitaire") {
    minAmount = Math.round(minAmount * 1.05);
    maxAmount = Math.round(maxAmount * 1.05);
    referenceCosts = "Tarifs de référence pour les établissements d'enseignement publics (travaux hors périodes de cours ou planifiés).";
  }

  const confidenceText = `${confidenceIndex}% (${confidenceIndex >= 90 ? 'Élevé' : 'Modéré'})`;

  return {
    minAmount,
    maxAmount,
    degradationLevel,
    recommendedIntervention,
    detectedPathologies,
    referenceCosts,
    confidenceIndex,
    confidenceText
  };
}

export function formatDA(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DA";
}

export type BuildingState = "Excellent" | "Bon" | "Moyen" | "Dégradé" | "Très dégradé" | "Critique";

export interface BuildingStateInfo {
  label: BuildingState;
  badge: string;
  colorClass: string;
  riskThreshold: string;
}

export const BUILDING_STATES: BuildingStateInfo[] = [
  { label: "Excellent", badge: "🟢 Excellent", colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", riskThreshold: "0.0 - 1.9" },
  { label: "Bon", badge: "🟢 Bon", colorClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20", riskThreshold: "2.0 - 3.9" },
  { label: "Moyen", badge: "🟡 Moyen", colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", riskThreshold: "4.0 - 5.9" },
  { label: "Dégradé", badge: "🟠 Dégradé", colorClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", riskThreshold: "6.0 - 7.4" },
  { label: "Très dégradé", badge: "🔴 Très dégradé", colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", riskThreshold: "7.5 - 8.9" },
  { label: "Critique", badge: "🚨 Critique", colorClass: "bg-red-600/15 text-red-600 dark:text-red-400 border-red-500/30", riskThreshold: "9.0 - 10.0" }
];

export type InterventionType = 
  | "Entretien préventif"
  | "Réparation ponctuelle"
  | "Réfection partielle de l'étanchéité"
  | "Réfection complète de l'étanchéité"
  | "Réhabilitation de la toiture"
  | "Intervention d'urgence"
  | "Reconstruction partielle";

export interface InterventionTypeInfo {
  type: InterventionType;
  description: string;
  recommendedStates: BuildingState[];
}

export const INTERVENTION_TYPES: InterventionTypeInfo[] = [
  {
    type: "Entretien préventif",
    description: "Nettoyage des noues, curage des évacuations pluviales et application de résine Cool Roof.",
    recommendedStates: ["Excellent", "Bon"]
  },
  {
    type: "Réparation ponctuelle",
    description: "Traitement localisé des ponts thermiques, joints d'acrotères et solins d'étanchéité.",
    recommendedStates: ["Bon", "Moyen"]
  },
  {
    type: "Réfection partielle de l'étanchéité",
    description: "Remplacement ciblé des zones décollées ou boursouflées et pose de renforts d'étanchéité.",
    recommendedStates: ["Moyen"]
  },
  {
    type: "Réfection complète de l'étanchéité",
    description: "Dépose de l'ancien complexe d'étanchéité, ragréage de la forme de pente et pose multicouche bitumineuse/polyuréthane.",
    recommendedStates: ["Dégradé"]
  },
  {
    type: "Réhabilitation de la toiture",
    description: "Réfection lourde incluant la pose d'isolant thermique haute performance (liège expansé) et refonte de la dalle.",
    recommendedStates: ["Très dégradé"]
  },
  {
    type: "Intervention d'urgence",
    description: "Mise en sécurité immédiate avec bâchage lourd, étaiement temporaire et colmatage sous pluie.",
    recommendedStates: ["Critique"]
  },
  {
    type: "Reconstruction partielle",
    description: "Reconstruction de la structure en béton armé affectée et étanchéisation neuve aux normes parasismiques.",
    recommendedStates: ["Critique"]
  }
];

export function getDefaultBuildingState(riskScore: number): BuildingState {
  if (riskScore < 2.0) return "Excellent";
  if (riskScore < 4.0) return "Bon";
  if (riskScore < 6.0) return "Moyen";
  if (riskScore < 7.5) return "Dégradé";
  if (riskScore < 9.0) return "Très dégradé";
  return "Critique";
}

export function getDefaultInterventionType(riskScore: number, state?: BuildingState): InterventionType {
  const currentState = state || getDefaultBuildingState(riskScore);
  switch (currentState) {
    case "Excellent":
      return "Entretien préventif";
    case "Bon":
      return "Réparation ponctuelle";
    case "Moyen":
      return "Réfection partielle de l'étanchéité";
    case "Dégradé":
      return "Réfection complète de l'étanchéité";
    case "Très dégradé":
      return "Réhabilitation de la toiture";
    case "Critique":
      return riskScore >= 9.5 ? "Reconstruction partielle" : "Intervention d'urgence";
  }
}

export interface EconomicAnalysis {
  roofSurface: number; // m²
  affectedArea: number; // m²
  buildingState: BuildingState;
  interventionType: InterventionType;
  preventiveMin: number; // DA
  preventiveMax: number; // DA
  tardiveMin: number; // DA
  tardiveMax: number; // DA
  savingMin: number; // DA
  savingMax: number; // DA
  timeSavedDaysMin: number;
  timeSavedDaysMax: number;
  resourcesOptimized: string[];
  roiText: string;
  roiPercentage: number;
  aiConclusion: string;
  interventionJustification: string;
}

export function getEconomicAnalysis(
  inspection: Inspection | null,
  overrideSurface?: number,
  overrideState?: BuildingState,
  overrideIntervention?: InterventionType
): EconomicAnalysis {
  if (!inspection) {
    const defaultState: BuildingState = overrideState || "Moyen";
    const defaultIntervention: InterventionType = overrideIntervention || "Réfection partielle de l'étanchéité";
    return {
      roofSurface: overrideSurface || 1000,
      affectedArea: (overrideSurface || 1000) * 0.1,
      buildingState: defaultState,
      interventionType: defaultIntervention,
      preventiveMin: 0,
      preventiveMax: 0,
      tardiveMin: 0,
      tardiveMax: 0,
      savingMin: 0,
      savingMax: 0,
      timeSavedDaysMin: 0,
      timeSavedDaysMax: 0,
      resourcesOptimized: [],
      roiText: "N/A",
      roiPercentage: 0,
      aiConclusion: "Données indisponibles.",
      interventionJustification: "Données indisponibles."
    };
  }

  // 1. Surface estimation
  let roofSurface = 1000;
  if (overrideSurface !== undefined && overrideSurface > 0) {
    roofSurface = overrideSurface;
  } else {
    const nameLower = (inspection.buildingName || "").toLowerCase();
    if (nameLower.includes("chu") || nameLower.includes("khelil") || nameLower.includes("amrane")) {
      roofSurface = 1500;
    } else if (nameLower.includes("apc") || nameLower.includes("mairie")) {
      roofSurface = 800;
    } else if (nameLower.includes("univ") || nameLower.includes("mira") || nameLower.includes("campus")) {
      roofSurface = 2200;
    } else if (nameLower.includes("sina") || nameLower.includes("lycée")) {
      roofSurface = 1200;
    } else if (nameLower.includes("hammadia") || nameLower.includes("école")) {
      roofSurface = 1000;
    } else if (nameLower.includes("culture") || nameLower.includes("maison")) {
      roofSurface = 950;
    } else {
      if (inspection.buildingType === "Santé") roofSurface = 1500;
      else if (inspection.buildingType === "Scolaire/Universitaire") roofSurface = 1200;
      else if (inspection.buildingType === "Administratif") roofSurface = 800;
    }
  }

  // 2. Determine building state & intervention type
  const buildingState: BuildingState = overrideState || getDefaultBuildingState(inspection.riskScore);
  const interventionType: InterventionType = overrideIntervention || getDefaultInterventionType(inspection.riskScore, buildingState);

  // 3. State Multiplier for baseline cost calculation
  let stateMultiplier = 1.0;
  switch (buildingState) {
    case "Excellent": stateMultiplier = 0.65; break;
    case "Bon": stateMultiplier = 0.82; break;
    case "Moyen": stateMultiplier = 1.0; break;
    case "Dégradé": stateMultiplier = 1.35; break;
    case "Très dégradé": stateMultiplier = 1.75; break;
    case "Critique": stateMultiplier = 2.30; break;
  }

  // 4. Base prices per m² depending on intervention type
  let basePriceMin = 1000;
  let basePriceMax = 1800;
  let delayedFactor = 4.5;
  let daysSavedMin = 20;
  let daysSavedMax = 35;

  switch (interventionType) {
    case "Entretien préventif":
      basePriceMin = 750;
      basePriceMax = 1300;
      delayedFactor = 6.0;
      daysSavedMin = 15;
      daysSavedMax = 25;
      break;
    case "Réparation ponctuelle":
      basePriceMin = 1500;
      basePriceMax = 2400;
      delayedFactor = 5.2;
      daysSavedMin = 18;
      daysSavedMax = 30;
      break;
    case "Réfection partielle de l'étanchéité":
      basePriceMin = 3200;
      basePriceMax = 4800;
      delayedFactor = 4.2;
      daysSavedMin = 22;
      daysSavedMax = 38;
      break;
    case "Réfection complète de l'étanchéité":
      basePriceMin = 5800;
      basePriceMax = 8200;
      delayedFactor = 3.5;
      daysSavedMin = 28;
      daysSavedMax = 45;
      break;
    case "Réhabilitation de la toiture":
      basePriceMin = 9000;
      basePriceMax = 12500;
      delayedFactor = 2.8;
      daysSavedMin = 35;
      daysSavedMax = 55;
      break;
    case "Intervention d'urgence":
      basePriceMin = 12000;
      basePriceMax = 16500;
      delayedFactor = 2.4;
      daysSavedMin = 40;
      daysSavedMax = 60;
      break;
    case "Reconstruction partielle":
      basePriceMin = 17500;
      basePriceMax = 24000;
      delayedFactor = 2.0;
      daysSavedMin = 45;
      daysSavedMax = 70;
      break;
  }

  // 5. Risk & Building Type modifiers
  const riskFactor = 1 + (inspection.riskScore / 10) * 0.35;
  let buildingTypeMultiplier = 1.0;
  if (inspection.buildingType === "Santé") buildingTypeMultiplier = 1.25;
  else if (inspection.buildingType === "Judiciaire") buildingTypeMultiplier = 1.15;
  else if (inspection.buildingType === "Scolaire/Universitaire") buildingTypeMultiplier = 1.05;

  // 6. Cost calculations
  const preventiveMin = Math.round((roofSurface * basePriceMin * stateMultiplier * riskFactor * buildingTypeMultiplier) / 100) * 100;
  const preventiveMax = Math.round((roofSurface * basePriceMax * stateMultiplier * riskFactor * buildingTypeMultiplier) / 100) * 100;

  const tardiveMin = Math.round((preventiveMin * delayedFactor) / 100) * 100;
  const tardiveMax = Math.round((preventiveMax * delayedFactor) / 100) * 100;

  const savingMin = Math.max(0, tardiveMin - preventiveMax);
  const savingMax = Math.max(0, tardiveMax - preventiveMin);

  // Affected area
  const scoreRatio = Math.min(1.0, inspection.riskScore / 10);
  const affectedArea = Math.round(roofSurface * (0.05 + scoreRatio * 0.70));

  // ROI calculation
  const avgPreventive = (preventiveMin + preventiveMax) / 2;
  const avgSaving = (savingMin + savingMax) / 2;
  const roiPercentage = avgPreventive > 0 ? Math.round((avgSaving / avgPreventive) * 100) : 0;
  const roiRatio = avgPreventive > 0 ? (avgSaving / avgPreventive).toFixed(1) : "0";

  const roiText = `${roiPercentage}% (Ratio ${roiRatio}x) — 1 DA investi évite ${roiRatio} DA de sinistres`;

  // AI Justification for intervention type
  const interventionJustification = `Le prédiagnostic BatiSmart Roof IA préconise l'option « ${interventionType} » en cohérence avec l'état actuel de l'édifice classé « ${buildingState} » (Score de risque : ${inspection.riskScore.toFixed(1)}/10) et la superficie inspectée (${roofSurface} m²). Cette solution technique permet de traiter précisément les pathologies actives (infiltrations, fissures) sans engager des dépenses superflues.`;

  // AI Economic conclusion
  const aiConclusion = `L'analyse financière BatiSmart Roof IA pour l'édifice « ${inspection.buildingName} » (${inspection.buildingType || 'Bâtiment public'}) démontre qu'en appliquant l'intervention « ${interventionType} » sur cette structure évaluée en état « ${buildingState} » (surface : ${roofSurface} m²), le budget prévisionnel optimisé est compris entre ${formatDA(preventiveMin)} et ${formatDA(preventiveMax)}. Retarder ces travaux exposerait l'établissement à des réparations lourdes ou sinistres majeurs évalués entre ${formatDA(tardiveMin)} et ${formatDA(tardiveMax)}. L'engagement immédiat de l'opération génère une économie budgétaire nette estimée entre ${formatDA(savingMin)} et ${formatDA(savingMax)}, soit un retour sur investissement (ROI) de ${roiPercentage}%.`;

  return {
    roofSurface,
    affectedArea,
    buildingState,
    interventionType,
    preventiveMin,
    preventiveMax,
    tardiveMin,
    tardiveMax,
    savingMin,
    savingMax,
    timeSavedDaysMin: daysSavedMin,
    timeSavedDaysMax: daysSavedMax,
    resourcesOptimized: [
      `Séquençage adapté à l'état « ${buildingState} » pour une surface de ${roofSurface} m²`,
      `Mise en œuvre du procédé « ${interventionType} » sécurisant la structure`,
      "Préservation intégrale des dalles en béton armé et éléments porteurs",
      "Valorisation des éco-matériaux locaux (liège expansé et mortiers isolants)",
      "Continuité de service public garantie sans interruption d'activité",
      "Économie d'énergie thermique connexe grâce au revêtement Cool Roof"
    ],
    roiText,
    roiPercentage,
    aiConclusion,
    interventionJustification
  };
}
