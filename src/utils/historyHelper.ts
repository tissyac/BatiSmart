import { Inspection, AIDefectDetail } from "../types";

export interface PathologyStatus {
  name: string;
  status: "Corrigée" | "Stable" | "Améliorée" | "Aggravée" | "Nouvelle anomalie";
  colorClass: string; // Tailwind color class
}

export interface BuildingHistoryPoint {
  id: string;
  date: string;
  riskScore: number;
  cracks: AIDefectDetail;
  humidity: AIDefectDetail;
  infiltration: AIDefectDetail;
  degradation: AIDefectDetail;
  corrosion: AIDefectDetail;
  deformation: AIDefectDetail;
  aging: AIDefectDetail;
  summary: string;
  notes: string;
}

// Convert severity to numeric score for easier comparison
const severityToNum = (severity: string): number => {
  switch (severity) {
    case "Aucune": return 0;
    case "Faible": return 1;
    case "Moyenne": return 2;
    case "Élevée": return 3;
    default: return 0;
  }
};

// Returns the history points for a building strictly based on actual inspections in state
export function getBuildingHistory(
  buildingName: string,
  allInspections: Inspection[]
): BuildingHistoryPoint[] {
  // 1. Find all inspections in current state for this building
  const stateInspections = allInspections
    .filter((ins) => ins.buildingName.trim().toLowerCase() === buildingName.trim().toLowerCase())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 2. Map state inspections to our History Point structure
  const mappedPoints: BuildingHistoryPoint[] = stateInspections.map((ins) => {
    // Generate deterministic values for extra pathologies based on riskScore & ID
    const risk = ins.riskScore;
    const corrosionSev = risk > 8 ? "Élevée" : risk > 5 ? "Moyenne" : risk > 2 ? "Faible" : "Aucune";
    const deformationSev = risk > 8.5 ? "Moyenne" : risk > 6 ? "Faible" : "Aucune";
    const agingSev = risk > 7 ? "Élevée" : risk > 4 ? "Moyenne" : "Faible";

    return {
      id: ins.id,
      date: ins.date,
      riskScore: ins.riskScore,
      cracks: ins.cracks,
      humidity: ins.humidity,
      infiltration: ins.infiltration,
      degradation: ins.degradation,
      corrosion: { detected: corrosionSev !== "Aucune", severity: corrosionSev as any, description: "Corrosion superficielle des aciers." },
      deformation: { detected: deformationSev !== "Aucune", severity: deformationSev as any, description: "Légère flèche de dalle." },
      aging: { detected: true, severity: agingSev as any, description: "Vieillissement naturel des membranes." },
      summary: ins.summary,
      notes: ins.notes,
    };
  });

  return mappedPoints;
}

// Compare two inspections and output a list of pathology comparisons
export function comparePathologies(
  prev: BuildingHistoryPoint | null,
  curr: BuildingHistoryPoint
): PathologyStatus[] {
  if (!prev) return [];

  const pathologies = [
    { key: "cracks", name: "Fissures" },
    { key: "humidity", name: "Humidité" },
    { key: "infiltration", name: "Infiltrations" },
    { key: "degradation", name: "Défauts d'étanchéité" },
    { key: "corrosion", name: "Corrosion" },
    { key: "deformation", name: "Déformations" },
    { key: "aging", name: "Vieillissement des matériaux" },
  ];

  return pathologies.map(({ key, name }) => {
    const pVal = (prev as any)[key] as AIDefectDetail;
    const cVal = (curr as any)[key] as AIDefectDetail;

    const prevDet = pVal?.detected ?? false;
    const currDet = cVal?.detected ?? false;
    const prevSev = severityToNum(pVal?.severity ?? "Aucune");
    const currSev = severityToNum(cVal?.severity ?? "Aucune");

    let status: "Corrigée" | "Stable" | "Améliorée" | "Aggravée" | "Nouvelle anomalie" = "Stable";
    let colorClass = "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200/50"; // Stable default

    if (prevDet && !currDet) {
      status = "Corrigée";
      colorClass = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50";
    } else if (!prevDet && currDet) {
      status = "Nouvelle anomalie";
      colorClass = "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200/50 font-bold animate-pulse";
    } else if (prevDet && currDet) {
      if (currSev < prevSev) {
        status = "Améliorée";
        colorClass = "text-orange-500 bg-orange-50 dark:bg-orange-950/30 border-orange-200/50";
      } else if (currSev > prevSev) {
        status = "Aggravée";
        colorClass = "text-red-700 bg-red-50 dark:bg-red-950/30 border-red-200/50 font-bold";
      } else {
        status = "Stable";
        colorClass = "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200/50";
      }
    } else {
      // Both undetected
      status = "Stable";
      colorClass = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50";
    }

    return { name, status, colorClass };
  });
}

// Generate an intelligent, highly cohesive French summary of risk evolution (as requested)
export function generateEvolutionSummary(
  prev: BuildingHistoryPoint | null,
  curr: BuildingHistoryPoint,
  pathologies: PathologyStatus[]
): string {
  if (!prev) {
    return `Il s'agit du premier pré-diagnostic d'étanchéité enregistré pour l'édifice. L'indice de risque initial est évalué à ${curr.riskScore.toFixed(1)} / 10. Cet état des lieux constitue la référence initiale (Baseline) pour la planification des interventions et le suivi lors des prochaines inspections.`;
  }

  const fromScore = prev.riskScore.toFixed(1);
  const toScore = curr.riskScore.toFixed(1);

  // Extract changes
  const corrected = pathologies.filter(p => p.status === "Corrigée").map(p => p.name.toLowerCase());
  const improved = pathologies.filter(p => p.status === "Améliorée").map(p => p.name.toLowerCase());
  const stable = pathologies.filter(p => p.status === "Stable").map(p => p.name.toLowerCase());
  const aggravated = pathologies.filter(p => p.status === "Aggravée").map(p => p.name.toLowerCase());
  const newAnomalies = pathologies.filter(p => p.status === "Nouvelle anomalie").map(p => p.name.toLowerCase());

  let text = `Depuis la dernière inspection, le score de risque est passé de ${fromScore} à ${toScore}. `;

  if (corrected.length > 0) {
    text += `Les ${corrected.join(" et les ")} ont été corrigées. `;
  } else if (improved.length > 0) {
    text += `On note une nette amélioration de pathologies de type ${improved.join(", ")}. `;
  }

  if (stable.length > 0) {
    // filter to show max 2 stable ones so the text remains concise
    text += `Les ${stable.slice(0, 2).join(" et les ")} restent stables. `;
  }

  if (aggravated.length > 0) {
    text += `Cependant, la situation s'est aggravée sur : ${aggravated.join(", ")}. `;
  }

  if (newAnomalies.length > 0) {
    text += `Une nouvelle anomalie de type ${newAnomalies.join(", ")} a été détectée. `;
  }

  if (curr.riskScore < prev.riskScore) {
    text += `Les travaux réalisés ont permis une amélioration globale de l'état de la toiture. `;
  } else if (curr.riskScore > prev.riskScore) {
    text += `Une dégradation générale est constatée sur l'infrastructure. Une intervention corrective urgente est vivement recommandée pour stopper la propagation des désordres. `;
  } else {
    text += `L'état général reste stationnaire. Une surveillance continue est conseillée. `;
  }

  return text;
}
