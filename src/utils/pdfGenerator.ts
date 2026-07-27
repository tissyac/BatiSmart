import { jsPDF } from "jspdf";
import { Inspection } from "../types";
import { getBudgetEstimation, formatDA, getEconomicAnalysis } from "./budgetHelper";
import { getBuildingHistory, comparePathologies, generateEvolutionSummary } from "./historyHelper";

export function generateInspectionPDF(
  rawInspection: Inspection,
  triggerPrint: boolean = false,
  outputType: "save" | "blob" | "dataurl" | "share" | "jspdf" = "save"
): any {
  try {
    // Highly robust sanitization and parsing to prevent runtime crashes during PDF generation
    const parseNum = (val: any, fallback: number): number => {
      if (typeof val === "number" && !isNaN(val)) return val;
      if (typeof val === "string") {
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) return parsed;
      }
      return fallback;
    };

    const parsedRecommendations = Array.isArray(rawInspection?.recommendations)
      ? rawInspection.recommendations
          .map(r => r !== null && r !== undefined ? String(r).trim() : "")
          .filter(r => r !== "")
      : ["Aucune recommandation requise pour le moment."];

    const inspection = {
      id: rawInspection?.id || "insp_" + Math.random().toString(36).substr(2, 9),
      buildingName: rawInspection?.buildingName || "Structure Publique",
      buildingType: rawInspection?.buildingType || "Administratif",
      city: rawInspection?.city || "Alger (16)",
      address: rawInspection?.address || "Alger, Algérie",
      latitude: parseNum(rawInspection?.latitude, 36.7538),
      longitude: parseNum(rawInspection?.longitude, 3.0588),
      imageUrl: rawInspection?.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      notes: rawInspection?.notes || "Aucune note.",
      inspectorName: rawInspection?.inspectorName || "Inspecteur",
      inspectorEmail: rawInspection?.inspectorEmail || "inspecteur@batismart.dz",
      date: rawInspection?.date || new Date().toISOString(),
      riskScore: parseNum(rawInspection?.riskScore, 0.0),
      summary: rawInspection?.summary || "Pré-diagnostic de toiture.",
      recommendations: parsedRecommendations.length > 0 ? parsedRecommendations : ["Aucune recommandation requise pour le moment."],
      cracks: {
        detected: !!rawInspection?.cracks?.detected,
        severity: rawInspection?.cracks?.severity || "Aucune",
        description: rawInspection?.cracks?.description || "Aucune fissure constatée."
      },
      humidity: {
        detected: !!rawInspection?.humidity?.detected,
        severity: rawInspection?.humidity?.severity || "Aucune",
        description: rawInspection?.humidity?.description || "Aucune trace d'humidité active."
      },
      infiltration: {
        detected: !!rawInspection?.infiltration?.detected,
        severity: rawInspection?.infiltration?.severity || "Aucune",
        description: rawInspection?.infiltration?.description || "Aucune trace d'infiltration active."
      },
      degradation: {
        detected: !!rawInspection?.degradation?.detected,
        severity: rawInspection?.degradation?.severity || "Aucune",
        description: rawInspection?.degradation?.description || "Aucun signe d'altération."
      },
      imageUrls: Array.isArray(rawInspection?.imageUrls) ? rawInspection.imageUrls : [],
      customSurface: rawInspection?.customSurface,
      maintenanceStatus: rawInspection?.maintenanceStatus,
      maintenanceTasks: rawInspection?.maintenanceTasks,
      maintenancePhotos: rawInspection?.maintenancePhotos,
      expertDecisionStatus: rawInspection?.expertDecisionStatus,
      expertName: rawInspection?.expertName,
      expertOrganization: rawInspection?.expertOrganization,
      expertValidationDate: rawInspection?.expertValidationDate,
      expertSignature: rawInspection?.expertSignature,
      expertComments: rawInspection?.expertComments,
      aiProposedDecision: rawInspection?.aiProposedDecision,
      aiProposedJustification: rawInspection?.aiProposedJustification,
      selectedTechnicalOptions: rawInspection?.selectedTechnicalOptions,
      selectedMaintenanceOptions: rawInspection?.selectedMaintenanceOptions,
      maintenanceDescription: rawInspection?.maintenanceDescription,
      maintenanceInterventionType: rawInspection?.maintenanceInterventionType,
      maintenanceInterventionDate: rawInspection?.maintenanceInterventionDate,
      maintenanceCompany: rawInspection?.maintenanceCompany,
      maintenanceResponsible: rawInspection?.maintenanceResponsible,
      maintenanceDuration: rawInspection?.maintenanceDuration,
      maintenanceCost: rawInspection?.maintenanceCost
    } as Inspection;

    const safeBuildingName = (inspection.buildingName || "Structure_Publique")
      .replace(/[/\\?%*:|"<>\s]+/g, "_")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const filename = `Rapport_BatiSmart_Roof_IA_${safeBuildingName}.pdf`;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Page Width and Height
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 44;

  // Clean Deep Contrast Colors (Optimized for High-Contrast Light Mode / Professional Printing)
  const darkNavy = "#070b19";     // Pure elegant deep navy for titles & primary text
  const valueBlack = "#0f172a";   // Charcoal black for high readability values
  const labelSlate = "#475569";   // Strong grey for labels
  const lightBlue = "#0ea5e9";    // Sky blue accent lines
  const emeraldGreen = "#10b981"; // Emerald green for healthy status
  const charcoal = "#334155";     // Dark charcoal for secondary content
  const lightGray = "#f8fafc";    // Very light grey for card backgrounds
  const borderGray = "#cbd5e1";   // Solid grey border for high contrast in light mode

  let y = 31;

  const addPageWithHeader = (pageTitle: string) => {
    doc.addPage();
    
    // Draw Header
    doc.setFillColor("#0ea5e9"); // Sky Blue triangle
    doc.triangle(15, 10, 25, 10, 20, 20, "F");
    doc.setFillColor("#10b981"); // Emerald triangle
    doc.triangle(20, 20, 30, 20, 25, 10, "F");

    // Logo Text
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(darkNavy);
    doc.text("BatiSmart", 33, 16);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(emeraldGreen);
    doc.text("Roof IA", 53, 16);

    // Small subtitle
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(labelSlate);
    doc.text("PRÉDIAGNOSTIC ET CRITÈRES DE DIAGNOSTIC IA (SUITE)", 33, 21);

    // Page title on the right
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(darkNavy);
    doc.text(pageTitle.toUpperCase(), pageWidth - 15, 16, { align: "right" });

    // Decorative border separating header from content
    doc.setDrawColor(lightBlue);
    doc.setLineWidth(0.4);
    doc.line(15, 24, pageWidth - 15, 24);

    y = 32;
  };

  // --- 1. BRAND LOGO & OFFICIAL HEADER ---
  // Draw beautiful dual-triangle vector logo in upper-left corner
  doc.setFillColor("#0ea5e9"); // Sky Blue triangle
  doc.triangle(15, 10, 25, 10, 20, 20, "F");
  doc.setFillColor("#10b981"); // Emerald triangle
  doc.triangle(20, 20, 30, 20, 25, 10, "F");

  // Logo Text
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(darkNavy);
  doc.text("BatiSmart", 33, 15);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(emeraldGreen);
  doc.text("Roof IA", 33, 20);

  // Official Algerian Header on the right (Highly Readable, high contrast)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(valueBlack);
  doc.text("RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE", pageWidth - 15, 11, { align: "right" });
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(charcoal);
  doc.text("MINISTÈRE DE L'HABITAT, DE L'URBANISME ET DE LA VILLE", pageWidth - 15, 15, { align: "right" });
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(labelSlate);
  doc.text("Direction Générale de la Construction et de la Maintenance", pageWidth - 15, 19, { align: "right" });

  // Decorative border separating header from content
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.6);
  doc.line(15, 23, pageWidth - 15, 23);

  // --- 2. REPORT TITLE & RISK BADGE ---
  y = 31;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(darkNavy);
  doc.text("RAPPORT DE PRÉDIAGNOSTIC ET CRITÈRES DE DIAGNOSTIC IA", 15, y);

  // Risk Level Badge with High Contrast
  const isHighRisk = inspection.riskScore >= 7.0;
  const isMediumRisk = inspection.riskScore >= 4.0 && inspection.riskScore < 7.0;
  const badgeColor = isHighRisk ? "#ef4444" : isMediumRisk ? "#d97706" : "#059669"; // darkened for better print contrast
  const badgeText = isHighRisk ? "DANGER CRITIQUE (URGENT)" : isMediumRisk ? "MAINTENANCE REQUISE" : "TOITURE CONFORME";

  doc.setFillColor(badgeColor);
  doc.rect(pageWidth - 75, y - 4, 60, 7.5, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor("#ffffff");
  doc.text(`SCORE: ${inspection.riskScore}/10 - ${badgeText}`, pageWidth - 45, y + 0.8, { align: "center" });

  y += 9;

  // --- 3. GENERAL INFORMATION GRID (DYNAMIC WRAPPING & COPIOUS SPACE) ---
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy);
  doc.setFont("Helvetica", "bold");
  doc.text("1. DONNÉES D'IDENTIFICATION DU BÂTIMENT", 15, y);
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.35);
  doc.line(15, y + 1.5, 90, y + 1.5);

  y += 4.5;
  const infoBoxStartY = y;
  
  // Box with spacious height to support wrapping values beautifully without clipping
  const infoBoxHeight = 36;
  doc.setFillColor("#f8fafc");
  doc.rect(15, infoBoxStartY, pageWidth - 30, infoBoxHeight, "F");
  doc.setDrawColor(borderGray);
  doc.setLineWidth(0.3);
  doc.rect(15, infoBoxStartY, pageWidth - 30, infoBoxHeight, "S");

  let gy = infoBoxStartY + 5.5;

  // Row 1: Building Name & Type
  doc.setFontSize(7.5);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(labelSlate);
  doc.text("Nom de l'édifice :", 19, gy);
  doc.text("Type d'édifice / structure :", 112, gy);

  gy += 4;
  doc.setFontSize(9.5);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(darkNavy);
  
  // Wrap long building names to prevent overlaps (e.g. "Université Abderrahmane Mira")
  const wrappedName = doc.splitTextToSize(inspection.buildingName, 85);
  doc.text(wrappedName, 19, gy);

  doc.setFont("Helvetica", "normal");
  doc.setTextColor(valueBlack);
  doc.text(inspection.buildingType, 112, gy);

  // Push next lines based on wrapped name height
  const nameLines = wrappedName.length;
  gy += (nameLines > 1) ? 8.5 : 6;

  // Row 2: Address & Date
  doc.setFontSize(7.5);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(labelSlate);
  doc.text("Adresse & Localisation :", 19, gy);
  doc.text("Date du pré-diagnostic :", 112, gy);

  gy += 4;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(valueBlack);
  const wrappedAddress = doc.splitTextToSize(`${inspection.address}, ${inspection.city}`, 85);
  doc.text(wrappedAddress, 19, gy);
  let formattedDate = "";
  try {
    const d = new Date(inspection.date);
    formattedDate = isNaN(d.getTime()) ? new Date().toLocaleDateString("fr-FR") : d.toLocaleDateString("fr-FR");
  } catch (e) {
    formattedDate = new Date().toLocaleDateString("fr-FR");
  }
  doc.text(formattedDate, 112, gy);

  const addressLines = wrappedAddress.length;
  gy += (addressLines > 1) ? 8.5 : 6;

  // Row 3: Coordinates & Inspector
  doc.setFontSize(7.5);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(labelSlate);
  doc.text("Coordonnées GPS géoréférencées :", 19, gy);
  doc.text("Inspecteur technique agréé :", 112, gy);

  gy += 4;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(valueBlack);
  doc.text(`${inspection.latitude.toFixed(6)}° N, ${inspection.longitude.toFixed(6)}° E`, 19, gy);
  doc.text(inspection.inspectorName, 112, gy);

  y = infoBoxStartY + infoBoxHeight + 6;

  // --- 4. IMAGE & MAP COORDINATES SIDE-BY-SIDE ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy);
  doc.text("2. CAPTURE DE TERRAIN & POSITIONNEMENT SIG", 15, y);
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.35);
  doc.line(15, y + 1.5, 95, y + 1.5);

  y += 4.5;

  const imgWidth = 85;
  const imgHeight = 42;

  // Render Image Box (using raw base64 if present, or drawing a beautiful schematic vector drawing)
  let imageRendered = false;
  if (inspection.imageUrl && (inspection.imageUrl.startsWith("data:image/") || inspection.imageUrl.includes(";base64,"))) {
    try {
      let format = "JPEG";
      const matches = inspection.imageUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
      if (matches && matches[1]) {
        const ext = matches[1].toUpperCase();
        if (ext === "PNG") format = "PNG";
        else if (ext === "WEBP") format = "WEBP";
        else if (ext === "SVG+XML" || ext === "SVG") format = "SVG";
      }
      doc.addImage(inspection.imageUrl, format, 15, y, imgWidth, imgHeight);
      imageRendered = true;
    } catch (e) {
      console.warn("Failed to render base64 image in PDF:", e);
    }
  }

  // Fallback vector drawing of roof-terrace (makes the PDF look amazing even without base64 images!)
  if (!imageRendered) {
    doc.setFillColor("#0f172a");
    doc.rect(15, y, imgWidth, imgHeight, "F");
    
    // Draw grid lines
    doc.setDrawColor("#1e293b");
    doc.setLineWidth(0.2);
    for (let i = 15; i < 15 + imgWidth; i += 5) doc.line(i, y, i, y + imgHeight);
    for (let j = y; j < y + imgHeight; j += 5) doc.line(15, j, 15 + imgWidth, j);

    // Schematic lines
    doc.setDrawColor("#38bdf8");
    doc.setLineWidth(0.4);
    doc.line(20, y + 8, 80, y + 8); // roof level
    doc.line(80, y + 8, 80, y + 33); // walls
    doc.line(20, y + 8, 20, y + 33);
    
    // Water accumulation symbol
    doc.setFillColor("#0ea5e9");
    doc.ellipse(50, y + 8, 12, 1.5, "F");
    
    // Draw crack line
    doc.setDrawColor("#ef4444");
    doc.setLineWidth(0.8);
    doc.line(30, y + 8, 33, y + 17);
    doc.line(33, y + 17, 31, y + 25);

    // Annotation text inside the schematic
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor("#ffffff");
    doc.text("SCHÉMA TECHNIQUE D'ANALYSE", 25, y + 5);
    doc.setTextColor("#ef4444");
    doc.text("FISSURE DÉTECTÉE", 34, y + 18);
    doc.setTextColor("#38bdf8");
    doc.text("STAGNATION D'EAU", 42, y + 12);
  }

  // Positionnement SIG (GIS) Box
  const sigX = 105;
  doc.setFillColor("#f1f5f9");
  doc.rect(sigX, y, imgWidth - 5, imgHeight, "F");
  doc.setDrawColor(borderGray);
  doc.setLineWidth(0.3);
  doc.rect(sigX, y, imgWidth - 5, imgHeight, "S");

  // Draw technical radar/crosshair for coordinates
  const radarCx = sigX + 20;
  const radarCy = y + (imgHeight / 2);
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.25);
  doc.circle(radarCx, radarCy, 12, "S");
  doc.circle(radarCx, radarCy, 6, "S");
  doc.line(radarCx - 15, radarCy, radarCx + 15, radarCy);
  doc.line(radarCx, radarCy - 15, radarCx, radarCy + 15);
  // Red dot
  doc.setFillColor("#ef4444");
  doc.circle(radarCx + 3, radarCy - 2, 1.2, "F");

  // SIG Info text with high legibility
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("SYSTÈME GÉOGRAPHIQUE (SIG)", sigX + 38, y + 8);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(charcoal);
  doc.text(`Wilaya : ${inspection.city}`, sigX + 38, y + 14);
  doc.text(`Lat : ${inspection.latitude.toFixed(5)}° N`, sigX + 38, y + 20);
  doc.text(`Lng : ${inspection.longitude.toFixed(5)}° E`, sigX + 38, y + 26);
  doc.text("Base cartographique :", sigX + 38, y + 32);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(emeraldGreen);
  doc.text("Algérie SIG National (69 Wilayas)", sigX + 38, y + 37);

  y += imgHeight + 6;

  // --- 5. AI PATHOLOGIES & DETECTIONS MATRIX ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(darkNavy);
  doc.text("3. RÉSULTATS DU PRÉDIAGNOSTIC ET CRITÈRES DE DIAGNOSTIC (IA)", 15, y);
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.35);
  doc.line(15, y + 1.5, 125, y + 1.5);

  y += 4.5;

  // Table Header
  doc.setFillColor(darkNavy);
  doc.rect(15, y, pageWidth - 30, 6.5, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor("#ffffff");
  doc.text("Critères / Pathologies", 18, y + 4.5);
  doc.text("Statut IA", 72, y + 4.5);
  doc.text("Niveau de Risque", 98, y + 4.5);
  doc.text("Description Technique & Localisation", 128, y + 4.5);

  const defects = [
    { label: "Fissuration Structurelle", ...inspection.cracks },
    { label: "Humidité / Moisissure", ...inspection.humidity },
    { label: "Infiltration d'Eau Active", ...inspection.infiltration },
    { label: "Défaut d'Étanchéité / Usure", ...inspection.degradation }
  ];

  y += 6.5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);

  defects.forEach((defect) => {
    // Wrap description to fit within the table column width (195 - 128 = 67mm, we use 64mm width for comfortable padding)
    const wrappedDesc = doc.splitTextToSize(defect.description || "", 64);
    const lineCount = wrappedDesc.length;
    // Calculate row height dynamically based on description lines.
    // Each line takes about 3.5mm of vertical space. We add a padding of 5mm.
    const rowHeight = Math.max(8.5, (lineCount * 3.5) + 5);

    doc.setFillColor("#fafafa");
    doc.rect(15, y, pageWidth - 30, rowHeight, "F");
    doc.setDrawColor(borderGray);
    doc.setLineWidth(0.25);
    doc.rect(15, y, pageWidth - 30, rowHeight, "S");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(darkNavy);
    // Center label vertically
    doc.text(defect.label, 18, y + (rowHeight / 2) + 1.2);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(defect.detected ? "#ef4444" : "#047857");
    doc.text(defect.detected ? "DÉTECTÉ" : "SAIN", 72, y + (rowHeight / 2) + 1.2);

    const sevColors: Record<string, string> = { 
      "Élevée": "#ef4444", 
      "Moyenne": "#d97706", 
      "Faible": "#0284c7", 
      "Aucune": "#059669" 
    };
    doc.setFontSize(8.5);
    doc.setTextColor(sevColors[defect.severity] || charcoal);
    doc.text(defect.severity, 98, y + (rowHeight / 2) + 1.2);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(valueBlack);
    // Draw wrapped lines beautifully
    doc.text(wrappedDesc, 128, y + 4.5);

    y += rowHeight;
  });

  // Synthèse Note Box with dynamic height calculation to avoid text overlapping
  y += 3;
  const noteText = inspection.summary || "";
  const splitSummary = doc.splitTextToSize(noteText, pageWidth - 36);
  const lineCount = splitSummary.length;
  // Calculate exact box height based on number of wrapped lines plus top & bottom padding
  const synthesisBoxHeight = Math.max(15, (lineCount * 3.8) + 7);

  doc.setFillColor("#f0f9ff"); // Very light blue background
  doc.rect(15, y, pageWidth - 30, synthesisBoxHeight, "F");
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.35);
  doc.rect(15, y, pageWidth - 30, synthesisBoxHeight, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("NOTE DE SYNTHÈSE DES CRITÈRES DE DIAGNOSTIC IA :", 18, y + 5);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(valueBlack);
  doc.text(splitSummary, 18, y + 9);

  y += synthesisBoxHeight + 6.5;

  // Page 1 footer will be generated dynamically at the end of the document

  // --- ADD PAGE BREAK FOR NEW PAGE 2 (RISK EVOLUTION) ---
  doc.addPage();

  // --- NEW PAGE 2 HEADER ---
  doc.setFillColor("#0ea5e9"); // Sky Blue triangle
  doc.triangle(15, 10, 25, 10, 20, 20, "F");
  doc.setFillColor("#10b981"); // Emerald triangle
  doc.triangle(20, 20, 30, 20, 25, 10, "F");

  // Logo Text
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(darkNavy);
  doc.text("BatiSmart", 33, 16);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(emeraldGreen);
  doc.text("Roof IA", 53, 16);

  // Small subtitle
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(labelSlate);
  doc.text("PRÉDIAGNOSTIC D'ÉTANCHÉITÉ ASSISTÉ PAR IA (SUITE)", 33, 21);

  // Page title on the right
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(darkNavy);
  doc.text("ÉVOLUTION DU NIVEAU DE RISQUE", pageWidth - 15, 16, { align: "right" });

  // Decorative border separating header from content
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.4);
  doc.line(15, 24, pageWidth - 15, 24);

  y = 32;

  // Retrieve inspections list for calculating history and comparing pathologies
  let allInspections: Inspection[] = [];
  try {
    const stored = localStorage.getItem("batismart_inspections");
    if (stored) {
      allInspections = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load inspections for PDF:", e);
  }

  // Get history
  const historyPoints = getBuildingHistory(inspection.buildingName, allInspections);
  const latestPoint: any = historyPoints[historyPoints.length - 1] || (inspection as any);
  const previousPoint: any = historyPoints.length > 1 ? historyPoints[historyPoints.length - 2] : null;

  // Section Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy);
  doc.text("3b. ÉVOLUTION DEPUIS LA DERNIÈRE INSPECTION", 15, y);
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.35);
  doc.line(15, y + 1.5, 125, y + 1.5);

  // Side-by-side Score Comparison Card
  y += 6.5;
  const cardW = pageWidth - 30;
  const cardH = 24;
  doc.setFillColor("#f8fafc");
  doc.rect(15, y, cardW, cardH, "F");
  doc.setDrawColor(borderGray);
  doc.setLineWidth(0.25);
  doc.rect(15, y, cardW, cardH, "S");

  // Draw vertical separation line
  doc.setDrawColor("#cbd5e1");
  doc.setLineWidth(0.2);
  doc.line(15 + cardW/3, y + 3, 15 + cardW/3, y + cardH - 3);
  doc.line(15 + (2*cardW)/3, y + 3, 15 + (2*cardW)/3, y + cardH - 3);

  // Col 1: Score Précédent
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(labelSlate);
  doc.text("SCORE PRÉCÉDENT", 19, y + 5.5);
  doc.setFontSize(12);
  doc.setTextColor(darkNavy);
  doc.text(previousPoint ? `${previousPoint.riskScore.toFixed(1)} / 10` : "N/A (1er diag.)", 19, y + 12.5);
  doc.setFontSize(6);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(charcoal);
  const prevDateStr = previousPoint ? new Date(previousPoint.date).toLocaleDateString("fr-FR") : "Aucune";
  doc.text(previousPoint ? `Inspection du ${prevDateStr}` : "Aucune inspection antérieure", 19, y + 18.5);

  // Col 2: Score Actuel
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(labelSlate);
  doc.text("SCORE ACTUEL", 15 + cardW/3 + 4, y + 5.5);
  doc.setFontSize(12);
  doc.setTextColor(darkNavy);
  doc.text(`${latestPoint.riskScore.toFixed(1)} / 10`, 15 + cardW/3 + 4, y + 12.5);
  doc.setFontSize(6);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(charcoal);
  const currDateStr = new Date(latestPoint.date).toLocaleDateString("fr-FR");
  doc.text(`Inspection du ${currDateStr}`, 15 + cardW/3 + 4, y + 18.5);

  // Col 3: Évolution & Tendance
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(labelSlate);
  doc.text("ÉVOLUTION & TENDANCE", 15 + (2*cardW)/3 + 4, y + 5.5);
  
  const rawScoreDiff = previousPoint ? (latestPoint.riskScore - previousPoint.riskScore) : 0;
  const diffText = previousPoint 
    ? (rawScoreDiff > 0 ? `+${rawScoreDiff.toFixed(1)} (Dégradation)` : rawScoreDiff < 0 ? `${rawScoreDiff.toFixed(1)} (Amélioration)` : "0.0 (Stable)")
    : "Premier Diagnostic";
  const diffColor = previousPoint 
    ? (rawScoreDiff > 0 ? "#ef4444" : rawScoreDiff < 0 ? "#059669" : "#475569")
    : "#0284c7";
  
  doc.setFontSize(8.5);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(diffColor);
  doc.text(diffText, 15 + (2*cardW)/3 + 4, y + 12);
  doc.setFontSize(6);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(charcoal);
  const trendExplanation = previousPoint
    ? (rawScoreDiff > 0 ? "Bâtiment nécessitant des travaux." : rawScoreDiff < 0 ? "Impact positif des travaux de maintenance." : "Aucune évolution majeure constatée.")
    : "État des lieux initial de référence";
  doc.text(trendExplanation, 15 + (2*cardW)/3 + 4, y + 18.5);

  // --- GRAPHICAL RISK EVOLUTION CHART ---
  y += cardH + 4;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("GRAPHIQUE DE TENDANCE CHRONOLOGIQUE DU RISQUE ET DES PATHOLOGIES", 15, y);

  y += 3.5;
  const chartH = 26;
  const chartW = pageWidth - 30;
  
  // Background box for the chart
  doc.setFillColor("#fdfdfd");
  doc.rect(15, y, chartW, chartH, "F");
  doc.setDrawColor("#e2e8f0");
  doc.setLineWidth(0.2);
  doc.rect(15, y, chartW, chartH, "S");

  // Draw horizontal grid lines (for scores 0, 3, 6, 9, 10)
  doc.setDrawColor("#f1f5f9");
  doc.setLineWidth(0.15);
  const ticks = [0, 3, 6, 9, 10];
  ticks.forEach((s) => {
    const gridY = y + chartH - 4 - (s / 10) * (chartH - 8);
    doc.line(25, gridY, 15 + chartW - 10, gridY);
    
    // Draw Y-axis labels with severity tags
    let label = String(s);
    if (s === 0) label = "0 (Sain)";
    else if (s === 3) label = "3 (Faible)";
    else if (s === 6) label = "6 (Moyen)";
    else if (s === 9) label = "9 (Élevé)";
    else if (s === 10) label = "10";
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(4.8);
    doc.setTextColor(labelSlate);
    doc.text(label, 23, gridY + 1.4, { align: "right" });
  });

  // Render a mini legend at the top of the chart
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(4.8);
  doc.setTextColor(charcoal);
  
  let legX = 15 + chartW - 55;
  const legY = y + 2.5;
  
  // Global Risk
  doc.setDrawColor("#10b981");
  doc.setLineWidth(0.65);
  doc.line(legX, legY, legX + 3, legY);
  doc.text("Risque Global", legX + 4, legY + 0.8);
  
  legX += 13;
  // Fissures
  doc.setDrawColor("#f43f5e");
  doc.setLineWidth(0.2);
  doc.line(legX, legY, legX + 3, legY);
  doc.text("Fissures", legX + 4, legY + 0.8);
  
  legX += 10;
  // Humidité
  doc.setDrawColor("#3b82f6");
  doc.line(legX, legY, legX + 3, legY);
  doc.text("Humidité", legX + 4, legY + 0.8);
  
  legX += 11;
  // Infiltrations
  doc.setDrawColor("#06b6d4");
  doc.line(legX, legY, legX + 3, legY);
  doc.text("Infiltr.", legX + 4, legY + 0.8);

  // Map history points to coordinates
  if (historyPoints.length > 0) {
    const chartPoints = historyPoints.slice(-4); // Take up to last 4 inspections for clean density
    const numPoints = chartPoints.length;
    const xStart = 30;
    const xEnd = 15 + chartW - 15;
    const yBottom = y + chartH - 4;
    const yHeight = chartH - 8;

    const coords = chartPoints.map((pt, index) => {
      const px = numPoints > 1 
        ? xStart + (index / (numPoints - 1)) * (xEnd - xStart)
        : xStart + (xEnd - xStart) / 2;
      const py = yBottom - (pt.riskScore / 10) * yHeight;
      return { x: px, y: py, score: pt.riskScore, date: pt.date };
    });

    // Helper function to draw pathology trends in chart
    const mapSeverity = (severity: string): number => {
      if (severity === "Élevée") return 9;
      if (severity === "Moyenne") return 6;
      if (severity === "Faible") return 3;
      return 0;
    };

    const drawPathologyLine = (
      key: "cracks" | "humidity" | "infiltration",
      color: string
    ) => {
      const pCoords = chartPoints.map((pt, index) => {
        const px = numPoints > 1 
          ? xStart + (index / (numPoints - 1)) * (xEnd - xStart)
          : xStart + (xEnd - xStart) / 2;
        const val = mapSeverity(pt[key]?.severity || "Aucune");
        const py = yBottom - (val / 10) * yHeight;
        return { x: px, y: py };
      });

      // Draw thin pathology lines
      doc.setLineWidth(0.2);
      doc.setDrawColor(color);
      for (let i = 0; i < pCoords.length - 1; i++) {
        doc.line(pCoords[i].x, pCoords[i].y, pCoords[i+1].x, pCoords[i+1].y);
      }

      // Draw small dots
      pCoords.forEach((p) => {
        doc.setFillColor(color);
        doc.circle(p.x, p.y, 0.4, "F");
      });
    };

    // Draw the three main pathology trends
    drawPathologyLine("cracks", "#f43f5e");      // Rose for Fissures
    drawPathologyLine("humidity", "#3b82f6");    // Blue for Humidité
    drawPathologyLine("infiltration", "#06b6d4"); // Cyan for Infiltrations

    // Draw the continuous risk score trend line
    doc.setLineWidth(0.65);
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i+1];
      
      // Select segment color based on destination point score
      let segColor = "#10b981"; // 🟢
      if (p2.score >= 9.0) segColor = "#ef4444"; // 🔴
      else if (p2.score >= 6.0) segColor = "#f97316"; // 🟠
      else if (p2.score >= 3.0) segColor = "#f59e0b"; // 🟡
      
      doc.setDrawColor(segColor);
      doc.line(p1.x, p1.y, p2.x, p2.y);
    }

    // Draw colored data points (circles) and labels
    coords.forEach((cp) => {
      let ptColor = "#10b981"; // 🟢
      if (cp.score >= 9.0) ptColor = "#ef4444"; // 🔴
      else if (cp.score >= 6.0) ptColor = "#f97316"; // 🟠
      else if (cp.score >= 3.0) ptColor = "#f59e0b"; // 🟡

      // Inner point circle
      doc.setFillColor(ptColor);
      doc.circle(cp.x, cp.y, 1.4, "F");
      doc.setDrawColor("#ffffff");
      doc.setLineWidth(0.4);
      doc.circle(cp.x, cp.y, 1.4, "S");

      // Draw score text above point
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(darkNavy);
      doc.text(cp.score.toFixed(1), cp.x, cp.y - 2.5, { align: "center" });

      // Draw date text below point
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(5.5);
      doc.setTextColor(charcoal);
      let dLabel = "";
      try {
        const dObj = new Date(cp.date);
        dLabel = dObj.toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit', year: '2-digit' });
      } catch (e) {
        dLabel = String(cp.date);
      }
      doc.text(dLabel, cp.x, yBottom + 2.5, { align: "center" });
    });
  }

  // Comparative Table of pathologies
  y += chartH + 5;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("TABLEAU COMPARATIF DES PATHOLOGIES PRINCIPALES", 15, y);

  y += 3.5;
  doc.setFillColor(darkNavy);
  doc.rect(15, y, pageWidth - 30, 5, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor("#ffffff");
  doc.text("Pathologie détectée", 18, y + 3.5);
  doc.text("État Précédent", 75, y + 3.5);
  doc.text("État Actuel (IA)", 115, y + 3.5);
  doc.text("Évolution", 155, y + 3.5);

  y += 5;
  
  // Build and compare pathologies
  const defaultPrevPoint = previousPoint || latestPoint;
  const pathologiesDiff = comparePathologies(defaultPrevPoint, latestPoint);

  pathologiesDiff.forEach((p) => {
    doc.setFillColor("#fafafa");
    doc.rect(15, y, pageWidth - 30, 5.5, "F");
    doc.setDrawColor(borderGray);
    doc.setLineWidth(0.2);
    doc.rect(15, y, pageWidth - 30, 5.5, "S");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(valueBlack);
    doc.text(p.name, 18, y + 3.8);

    // Find previous vs current severity
    let key = "";
    if (p.name === "Fissures") key = "cracks";
    else if (p.name === "Humidité") key = "humidity";
    else if (p.name === "Infiltrations") key = "infiltration";
    else if (p.name === "Défauts d'étanchéité") key = "degradation";
    else if (p.name === "Corrosion") key = "corrosion";
    else if (p.name === "Déformations") key = "deformation";
    else if (p.name === "Vieillissement des matériaux") key = "aging";

    const prevPathObj = previousPoint ? (previousPoint as any)[key] : null;
    const currPathObj = (latestPoint as any)[key];

    const prevSevText = prevPathObj ? `${prevPathObj.severity} (${prevPathObj.detected ? 'Détecté' : 'Sain'})` : "N/A";
    const currSevText = currPathObj ? `${currPathObj.severity} (${currPathObj.detected ? 'Détecté' : 'Sain'})` : "N/A";

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(charcoal);
    doc.text(prevSevText, 75, y + 3.8);
    doc.text(currSevText, 115, y + 3.8);

    // Draw status badge
    let badgeColor = "#475569"; // Stable default
    if (p.status === "Corrigée") badgeColor = "#059669";
    else if (p.status === "Améliorée") badgeColor = "#0ea5e9";
    else if (p.status === "Aggravée") badgeColor = "#ef4444";
    else if (p.status === "Nouvelle anomalie") badgeColor = "#ea580c";

    doc.setFont("Helvetica", "bold");
    doc.setTextColor(badgeColor);
    doc.text(p.status, 155, y + 3.8);

    y += 5.5;
  });

  // AI-generated summary text
  y += 3.5;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("ANALYSE SYNTHÉTIQUE INTELLIGENTE (BatiSmart Roof IA)", 15, y);

  y += 3.5;
  const summaryText = generateEvolutionSummary(defaultPrevPoint, latestPoint, pathologiesDiff);
  const splitEvolutionSummary = doc.splitTextToSize(summaryText, pageWidth - 36);
  const boxHeight = Math.max(14, (splitEvolutionSummary.length * 3.4) + 5.5);

  doc.setFillColor("#f0fdf4"); // Emerald light tint
  doc.rect(15, y, pageWidth - 30, boxHeight, "F");
  doc.setDrawColor("#bbf7d0");
  doc.setLineWidth(0.3);
  doc.rect(15, y, pageWidth - 30, boxHeight, "S");

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(valueBlack);
  doc.text(splitEvolutionSummary, 18, y + 4.2);

  // Conclusion on intervention efficiency
  y += boxHeight + 4.5;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("CONCLUSION SUR L'EFFICACITÉ DES TRAVAUX RÉALISÉS", 15, y);

  y += 3.5;
  let conclusionText = "";
  if (!previousPoint) {
    conclusionText = `Ce rapport constitue le premier pré-diagnostic d'étanchéité et de santé structurelle assisté par IA réalisé sur le bâtiment "${inspection.buildingName}". L'indice de risque initial est établi à ${latestPoint.riskScore.toFixed(1)} / 10 sur la base des anomalies détectées. Cet état des lieux constitue la baseline de référence pour engager les actions préventives et assurer le suivi chronologique lors des prochaines inspections.`;
  } else if (rawScoreDiff < 0) {
    conclusionText = `Les analyses comparatives d'imagerie et d'étanchéité démontrent de manière indiscutable que les interventions correctives et travaux de réhabilitation entrepris sur la toiture-terrasse du bâtiment "${inspection.buildingName}" ont porté leurs fruits. La baisse de l'indice de risque global de ${previousPoint?.riskScore.toFixed(1)} à ${latestPoint.riskScore.toFixed(1)} s'explique par la correction efficace des pathologies majeures détectées lors de l'inspection précédente du ${prevDateStr}. Les membranes d'étanchéité ont été restaurées avec succès et les infiltrations actives ont été stoppées. Il est recommandé de poursuivre le programme d'inspections régulières pour pérenniser ces résultats.`;
  } else if (rawScoreDiff > 0) {
    conclusionText = `L'absence de travaux correctifs ou de maintenance adéquate à la suite du pré-diagnostic précédent du ${prevDateStr} a conduit à une aggravation inquiétante et progressive de l'état structurel de la toiture du bâtiment "${inspection.buildingName}". L'indice de risque a bondi de ${previousPoint?.riskScore.toFixed(1)} à ${latestPoint.riskScore.toFixed(1)} (soit une augmentation critique de +${rawScoreDiff.toFixed(1)}). De nouvelles pathologies sont apparues (telles que des infiltrations actives ou fissurations thermiques d'acrotères sous l'effet du climat de la Wilaya de ${inspection.city}), menaçant l'intégrité de la structure sous-jacente. Une intervention de réhabilitation d'urgence s'avère désormais impérative.`;
  } else {
    conclusionText = `L'état de la toiture-terrasse du bâtiment "${inspection.buildingName}" demeure globalement stable par rapport à la dernière inspection du ${prevDateStr}. L'indice de risque se maintient à ${latestPoint.riskScore.toFixed(1)} / 10. Bien qu'aucune dégradation nouvelle ou critique n'ait été enregistrée au cours de cette période, les anomalies préexistantes ne se sont pas résorbées d'elles-mêmes. L'exécution du programme de maintenance préventive et de réhabilitation légère planifié reste vivement conseillée pour éviter tout risque de dérive ou de détérioration soudaine lors des prochaines saisons hivernales.`;
  }

  const splitConclusion = doc.splitTextToSize(conclusionText, pageWidth - 36);
  const conclusionBoxH = (splitConclusion.length * 3.4) + 5.5;

  doc.setFillColor("#fafafa");
  doc.rect(15, y, pageWidth - 30, conclusionBoxH, "F");
  doc.setDrawColor(borderGray);
  doc.setLineWidth(0.2);
  doc.rect(15, y, pageWidth - 30, conclusionBoxH, "S");

  doc.setFont("Helvetica", "italic");
  doc.setFontSize(6.8);
  doc.setTextColor(charcoal);
  doc.text(splitConclusion, 18, y + 4.2);

  // --- ADD PAGE BREAK FOR ORIGINAL PAGE 2 (NOW PAGE 3) ---
  addPageWithHeader("ANNEXE TECHNIQUE DE RÉHABILITATION");

  // --- 5.5. MÉTHODOLOGIE D'ANALYSE & EXPLICATION DU SCORE (Scientific & Technical Precision) ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(darkNavy);
  doc.text("4. CRITÈRES DE DIAGNOSTIC ET MÉTHODOLOGIE D'ANALYSE", 15, y);
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.35);
  doc.line(15, y + 1.5, 125, y + 1.5);

  y += 6.5;

  const boxW = (pageWidth - 36) / 2; // Left and Right boxes width
  const boxH = 40;
  const rightBoxX = 15 + boxW + 6;

  // Draw Left Box (Méthode d'analyse)
  doc.setFillColor("#f8fafc");
  doc.rect(15, y, boxW, boxH, "F");
  doc.setDrawColor("#cbd5e1");
  doc.setLineWidth(0.25);
  doc.rect(15, y, boxW, boxH, "S");

  // Left Box Content
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("CRITÈRES D'ANALYSE TECHNIQUE", 19, y + 5);

  doc.setFontSize(7.5);
  doc.setTextColor(labelSlate);
  doc.setFont("Helvetica", "bold");
  doc.text("Méthodes & Référentiels :", 19, y + 10.5);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(valueBlack);
  doc.text("• Critères d'imagerie HD & Drone", 19, y + 15);
  doc.text("• Vision par ordinateur multicritère", 19, y + 19.5);
  doc.text("• Référentiels BatiSmart & Bouygues", 19, y + 24);

  doc.setFont("Helvetica", "bolditalic");
  doc.setFontSize(7);
  doc.setTextColor("#dc2626"); // Red text for scientific notice/disclaimer
  const disclaimerText = doc.splitTextToSize("Ce rapport constitue un pré-diagnostic selon critères IA et aide à la décision.", boxW - 8);
  doc.text(disclaimerText, 19, y + 29.5);

  // Draw Right Box (Explication du Score)
  doc.setFillColor("#f8fafc");
  doc.rect(rightBoxX, y, boxW, boxH, "F");
  doc.setDrawColor("#cbd5e1");
  doc.setLineWidth(0.25);
  doc.rect(rightBoxX, y, boxW, boxH, "S");

  // Right Box Content
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("CRITÈRES DE SCORE DE DIAGNOSTIC", rightBoxX + 4, y + 5);

  // Colored indicator points or text for score severity
  doc.setFontSize(8);
  
  doc.setFillColor("#10b981"); // green
  doc.circle(rightBoxX + 6, y + 10, 1.2, "F");
  doc.setTextColor("#047857");
  doc.setFont("Helvetica", "bold");
  doc.text("Score 0 - 2  (Risque Faible / Conforme)", rightBoxX + 9, y + 11);

  doc.setFillColor("#d97706"); // amber
  doc.circle(rightBoxX + 6, y + 15.5, 1.2, "F");
  doc.setTextColor("#b45309");
  doc.text("Score 3 - 5  (Risque Moyen / Vigilance)", rightBoxX + 9, y + 16.5);

  doc.setFillColor("#ea580c"); // orange
  doc.circle(rightBoxX + 6, y + 21, 1.2, "F");
  doc.setTextColor("#c2410c");
  doc.text("Score 6 - 8  (Risque Élevé / Travaux)", rightBoxX + 9, y + 22);

  doc.setFillColor("#dc2626"); // red
  doc.circle(rightBoxX + 6, y + 26.5, 1.2, "F");
  doc.setTextColor("#991b1b");
  doc.text("Score 9 - 10 (Risque Critique Urgent)", rightBoxX + 9, y + 27.5);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(labelSlate);
  const scoreExplanation = doc.splitTextToSize("Calcul automatique basé sur la gravité et le cumul des critères de dégradation.", boxW - 8);
  doc.text(scoreExplanation, rightBoxX + 4, y + 32.5);

  y += boxH + 8;

  // --- 6. TECHNICAL RECOMMENDATIONS & ACTION TIMELINE ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy);
  doc.text("5. PROGRAMME DE RÉHABILITATION ET DE MAINTENANCE PRÉVENTIVE", 15, y);
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.35);
  doc.line(15, y + 1.5, 125, y + 1.5);

  y += 6.5;

  // Take first 4 recommendations
  const activeRecommendations = (inspection.recommendations || []).slice(0, 4);
  activeRecommendations.forEach((rec, idx) => {
    const splitRec = doc.splitTextToSize(rec, pageWidth - 36);
    const cardHeight = (splitRec.length * 3.6) + 8.5;

    // Handle page break automatically if content exceeds page boundary
    if (y + cardHeight > 260) {
      addPageWithHeader("PROGRAMME DE RÉHABILITATION (SUITE)");
    }

    // Draw a neat light gray card with a subtle border
    doc.setFillColor("#f8fafc");
    doc.rect(15, y, pageWidth - 30, cardHeight, "F");
    doc.setDrawColor("#cbd5e1");
    doc.setLineWidth(0.2);
    doc.rect(15, y, pageWidth - 30, cardHeight, "S");

    // Vertical sky blue indicator bar on the left side of the card
    doc.setFillColor(lightBlue);
    doc.rect(15, y, 1.5, cardHeight, "F");

    // Label indicator
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(darkNavy);
    doc.text(`Recommandation #${idx + 1} :`, 20, y + 5);

    // Text content
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(valueBlack);
    doc.text(splitRec, 20, y + 9.5);

    y += cardHeight + 4;
  });

  // --- 6. ESTIMATION PRÉVISIONNELLE DES COÛTS D'INTERVENTION ---
  const est = getBudgetEstimation(inspection);
  
  if (y + 66.5 > 260) {
    addPageWithHeader("ESTIMATION DES COÛTS D'INTERVENTION");
  }
  
  // Section Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy);
  doc.text("6. ESTIMATION PRÉVISIONNELLE DES COÛTS D'INTERVENTION", 15, y);
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.35);
  doc.line(15, y + 1.5, 125, y + 1.5);

  y += 6.5;

  // Intro text
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(charcoal);
  const introParagraphText = "L'Intelligence Artificielle fournit une estimation budgétaire indicative destinée à aider les gestionnaires du patrimoine bâti dans la planification des interventions. Cette estimation constitue une aide à la décision et ne remplace pas un devis établi par un professionnel.";
  const splitIntro = doc.splitTextToSize(introParagraphText, pageWidth - 30);
  doc.text(splitIntro, 15, y);
  
  y += (splitIntro.length * 3.6) + 3.5;

  // Prepare wrapped parameter texts to prevent overlap and truncation
  const textWidth = pageWidth - 40; // ~170mm width
  const interventionLines = doc.splitTextToSize(`• Intervention préconisée : ${est.recommendedIntervention}`, textWidth);
  const referenceLines = doc.splitTextToSize(`• Base de tarification : ${est.referenceCosts}`, textWidth);
  const riskLine = `• Niveau de risque : ${inspection.riskScore}/10 (${est.degradationLevel})   |   Type de structure : ${inspection.buildingType}`;

  // Calculate dynamic budget box height based on actual lines of text
  const paramLinesCount = 1 + interventionLines.length + referenceLines.length;
  const budgetBoxH = 29 + (paramLinesCount * 3.6) + 2;
  const budgetBoxW = pageWidth - 30;

  // Draw budget range card/box
  doc.setFillColor("#f0fdf4"); // Emerald extremely light green
  doc.rect(15, y, budgetBoxW, budgetBoxH, "F");
  doc.setDrawColor("#bbf7d0"); // Emerald border
  doc.setLineWidth(0.3);
  doc.rect(15, y, budgetBoxW, budgetBoxH, "S");

  // Vertical green bar accent
  doc.setFillColor("#10b981");
  doc.rect(15, y, 1.5, budgetBoxH, "F");

  // Cost range text
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor("#166534"); // dark green
  doc.text("FOURCHETTE D'ESTIMATION PRÉVISIONNELLE :", 20, y + 5.5);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(darkNavy);
  doc.text(`De ${formatDA(est.minAmount)} à ${formatDA(est.maxAmount)}`, 20, y + 11.5);

  // Confidence Index Indicator
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(charcoal);
  doc.text(`Indice de confiance de l'estimation : ${est.confidenceText} (${est.confidenceIndex}%)`, 20, y + 17);

  // Draw small bar for confidence index
  const barW = 100;
  const barH = 1.8;
  doc.setFillColor("#e2e8f0");
  doc.rect(20, y + 18.8, barW, barH, "F");
  doc.setFillColor("#10b981");
  doc.rect(20, y + 18.8, (barW * est.confidenceIndex) / 100, barH, "F");

  // Parameters used title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(charcoal);
  doc.text("Paramètres d'estimation utilisés par l'IA :", 20, y + 25);
  
  // Draw parameters dynamically
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(valueBlack);

  let paramY = y + 28.5;
  doc.text(riskLine, 20, paramY);
  paramY += 3.6;

  interventionLines.forEach((line: string) => {
    doc.text(line, 20, paramY);
    paramY += 3.6;
  });

  referenceLines.forEach((line: string) => {
    doc.text(line, 20, paramY);
    paramY += 3.6;
  });

  y += budgetBoxH + 4;

  // Legal text box at the bottom of the section
  const legalParagraphText = "Cette estimation budgétaire est générée automatiquement par BatiSmart Roof IA sur la base d'un algorithme de pré-diagnostic selon les critères de l'Intelligence Artificielle et de barèmes de coûts moyens de référence. Elle est fournie à titre purement indicatif pour accompagner les gestionnaires et décideurs publics dans la planification préliminaire de leurs interventions. Elle ne constitue en aucun cas un devis contractuel, une offre commerciale ou un engagement financier, et ne dispense pas de la réalisation d'un diagnostic technique approfondi et d'un chiffrage détaillé par des professionnels qualifiés du bâtiment.";
  const splitLegal = doc.splitTextToSize(legalParagraphText, pageWidth - 36);
  const legalBoxH = (splitLegal.length * 3.6) + 5;

  if (y + legalBoxH > 260) {
    addPageWithHeader("ESTIMATION DES COÛTS (SUITE)");
  }

  doc.setFillColor("#fafafa"); // extremely light gray
  doc.rect(15, y, pageWidth - 30, legalBoxH, "F");
  doc.setDrawColor("#e2e8f0");
  doc.setLineWidth(0.2);
  doc.rect(15, y, pageWidth - 30, legalBoxH, "S");

  doc.setFont("Helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor("#475569");
  doc.text(splitLegal, 18, y + 4.5);

  y += legalBoxH + 6;

  // --- 6.2. ANALYSE DE RENTABILITÉ ÉCONOMIQUE & RETOUR SUR INVESTISSEMENT (ROI) ---
  const econ = getEconomicAnalysis(inspection, inspection.customSurface);

  // If there's not enough space for Section 6.2 on Page 3 (needs ~75mm), add a Page Break!
  if (y + 75 > 260) {
    addPageWithHeader("ANALYSE ÉCONOMIQUE & PERFORMANCE FINANCIÈRE");
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(darkNavy);
  doc.text("6.2. ANALYSE DE RENTABILITÉ ÉCONOMIQUE & RETOUR SUR INVESTISSEMENT (ROI)", 15, y);
  doc.setDrawColor(lightBlue);
  doc.setLineWidth(0.35);
  doc.line(15, y + 1.5, 125, y + 1.5);

  y += 6;

  // Draw bento-style side-by-side card for the costs
  const econBoxW = pageWidth - 30;
  const econBoxH = 28;

  doc.setFillColor("#f8fafc"); // light slate background
  doc.rect(15, y, econBoxW, econBoxH, "F");
  doc.setDrawColor("#e2e8f0");
  doc.setLineWidth(0.2);
  doc.rect(15, y, econBoxW, econBoxH, "S");

  // Vertical emerald/blue accent stripes
  doc.setFillColor("#10b981");
  doc.rect(15, y, 1.2, econBoxH, "F");

  // Three column layout inside the box
  const colW = econBoxW / 3;

  // Headers
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(labelSlate);
  doc.text("A. INTERVENTION PRÉVENTIVE", 18, y + 5.5);
  doc.setTextColor("#ef4444"); // Red
  doc.text("B. RÉPARATION TARDIVE (SINISTRE)", 18 + colW, y + 5.5);
  doc.setTextColor("#15803d"); // Green
  doc.text("C. ÉCONOMIE BUDGÉTAIRE GÉNÉRÉE", 18 + 2 * colW, y + 5.5);

  // Values
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(valueBlack);
  doc.text(`${formatDA(econ.preventiveMin)} - ${formatDA(econ.preventiveMax)}`, 18, y + 11.5);

  doc.setTextColor("#b91c1c"); // deep red
  doc.text(`${formatDA(econ.tardiveMin)} - ${formatDA(econ.tardiveMax)}`, 18 + colW, y + 11.5);

  doc.setTextColor("#166534"); // dark green
  doc.setFontSize(9.5);
  doc.text(`${formatDA(econ.savingMin)} - ${formatDA(econ.savingMax)}`, 18 + 2 * colW, y + 11.5);

  // Subtexts / Descriptions
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(charcoal);
  const prevLines = doc.splitTextToSize("Traitement immédiat de la toiture (Cool Roof local, joints).", colW - 6);
  doc.text(prevLines, 18, y + 16);

  const tardLines = doc.splitTextToSize("Infiltration de dalle béton, dépose asphaltes, sinistres intérieurs.", colW - 6);
  doc.text(tardLines, 18 + colW, y + 16);

  const saveLines = doc.splitTextToSize(`Wilaya épargnée par rapport au sinistre (${Math.round(econ.savingMin / (econ.tardiveMin || 1) * 100)}% d'économie).`, colW - 6);
  doc.text(saveLines, 18 + 2 * colW, y + 16);

  y += econBoxH + 4.5;

  // ROI / Time saved / Resources list (Bento secondary metrics)
  // Let's create a combined box for ROI, Time and Resources
  const secondaryBoxH = 22;
  doc.setFillColor("#fafafa");
  doc.rect(15, y, econBoxW, secondaryBoxH, "F");
  doc.setDrawColor("#e2e8f0");
  doc.setLineWidth(0.2);
  doc.rect(15, y, econBoxW, secondaryBoxH, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy);
  doc.text("Indicateur de Performance de la Maintenance Préventive :", 18, y + 5);
  doc.text("Temps d'immobilisation de la toiture :", 110, y + 5);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(valueBlack);

  const leftLine1 = doc.splitTextToSize(`• ROI Dynamique : ${econ.roiPercentage}% (Ratio ${(econ.savingMin / Math.max(1, (econ.preventiveMin + econ.preventiveMax) / 2)).toFixed(1)}x) - Gain de ${formatDA(econ.savingMin)}`, 88);
  const leftLine2 = doc.splitTextToSize(`• Ressources Optimisées : Liège algérien, main d'œuvre réduite de 80%`, 88);

  const rightLine1 = doc.splitTextToSize(`• Préventif : 3 à 6 jours d'intervention légère`, 80);
  const rightLine2 = doc.splitTextToSize(`• Tardif : 25 à ${econ.timeSavedDaysMax} jours d'arrêt technique`, 80);

  doc.text(leftLine1, 18, y + 10);
  doc.text(leftLine2, 18, y + 15.5);

  doc.text(rightLine1, 110, y + 10);
  doc.text(rightLine2, 110, y + 15.5);

  y += secondaryBoxH + 4.5;

  // AI Economic Conclusion Box
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(darkNavy);
  doc.text("Conclusion de l'Analyse Économique par l'IA :", 15, y);

  y += 3;
  const splitEconConclusion = doc.splitTextToSize(econ.aiConclusion, pageWidth - 36);
  const econConclusionBoxH = (splitEconConclusion.length * 3.2) + 4.5;

  doc.setFillColor("#f0fdf4"); // light emerald green
  doc.rect(15, y, pageWidth - 30, econConclusionBoxH, "F");
  doc.setDrawColor("#bbf7d0");
  doc.setLineWidth(0.25);
  doc.rect(15, y, pageWidth - 30, econConclusionBoxH, "S");

  doc.setFont("Helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor("#166534"); // dark green
  doc.text(splitEconConclusion, 18, y + 3.8);

  y += econConclusionBoxH + 4.5;

  // Disclaimer text
  const econDisclaimer = "Avis d'aide à la décision : Ces calculs sont fondés sur des barèmes et indices moyens de la construction en Algérie et les données du prédiagnostic IA. Ils constituent une aide à la décision indicative pour la Wilaya et ne constituent pas un devis contractuel.";
  const splitEconDisclaimer = doc.splitTextToSize(econDisclaimer, pageWidth - 36);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(4.8);
  doc.setTextColor("#94a3b8");
  doc.text(splitEconDisclaimer, 15, y);

  y += (splitEconDisclaimer.length * 2.5) + 6;

  // --- 6. TABLEAU DE BORD DÉCISIONNEL & VALIDATION DE L'EXPERT ---
  // If there's not enough space for the decision section (needs ~45mm), add a Page Break!
  if (y + 60 > 260) {
    addPageWithHeader("TABLEAU DE BORD DÉCISIONNEL");
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("6. TABLEAU DE BORD DÉCISIONNEL", 15, y);
  
  y += 3.5;

  const techOptions = inspection.selectedTechnicalOptions || [];
  const maintenanceOpts = inspection.selectedMaintenanceOptions || [];
  const maintenanceDescription = inspection.maintenanceDescription || "";
  const maintenanceType = inspection.maintenanceInterventionType || "";
  const maintenanceDate = inspection.maintenanceInterventionDate || "";
  const maintenanceCompany = inspection.maintenanceCompany || "";
  const maintenanceResponsible = inspection.maintenanceResponsible || "";
  const maintenanceDuration = inspection.maintenanceDuration || "";
  const maintenanceCost = inspection.maintenanceCost || "";
  const governanceLines: string[] = [];

  if (techOptions.length > 0) {
    governanceLines.push("4.1. Options techniques recommandées :");
    techOptions.forEach(option => governanceLines.push(`• ${option}`));
  }

  const maintenanceSummaryLines: string[] = [];
  if (maintenanceType) maintenanceSummaryLines.push(`Type d'intervention : ${maintenanceType}`);
  if (maintenanceDate) maintenanceSummaryLines.push(`Date : ${maintenanceDate}`);
  if (maintenanceCompany) maintenanceSummaryLines.push(`Entreprise : ${maintenanceCompany}`);
  if (maintenanceResponsible) maintenanceSummaryLines.push(`Responsable : ${maintenanceResponsible}`);
  if (maintenanceDuration) maintenanceSummaryLines.push(`Durée : ${maintenanceDuration}`);
  if (maintenanceCost) maintenanceSummaryLines.push(`Coût estimé : ${maintenanceCost}`);
  if (maintenanceDescription) maintenanceSummaryLines.push(`Description : ${maintenanceDescription}`);
  if (maintenanceOpts.length > 0) maintenanceSummaryLines.push(...maintenanceOpts.map(option => `• ${option}`));

  if (maintenanceSummaryLines.length > 0) {
    governanceLines.push("4.2. Maintenance de l’édifice :");
    governanceLines.push(...maintenanceSummaryLines);
  }

  if (governanceLines.length > 0) {
    doc.setFillColor("#f8fafc");
    doc.rect(15, y, pageWidth - 30, 24, "F");
    doc.setDrawColor("#cbd5e1");
    doc.setLineWidth(0.2);
    doc.rect(15, y, pageWidth - 30, 24, "S");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(darkNavy);
    doc.text("Données de gouvernance & maintenance", 20, y + 5);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(6.6);
    doc.setTextColor(charcoal);
    const wrappedGovernance = doc.splitTextToSize(governanceLines.join("\n"), pageWidth - 46);
    doc.text(wrappedGovernance, 20, y + 9.5);

    y += 28;
  }

  const decisionBoxH = 34;
  doc.setFillColor("#f8fafc"); // light slate
  doc.rect(15, y, pageWidth - 30, decisionBoxH, "F");
  doc.setDrawColor("#cbd5e1");
  doc.setLineWidth(0.2);
  doc.rect(15, y, pageWidth - 30, decisionBoxH, "S");

  // Proposed decision by IA
  const proposedDecision = inspection.aiProposedDecision || "Intervention corrective recommandée";
  const proposedJustification = inspection.aiProposedJustification || "Le score de risque est élevé. Des travaux de réhabilitation de l'étanchéité sont recommandés.";

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy);
  doc.text("Décision proposée par l'IA :", 20, y + 5);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  if (proposedDecision.includes("Aucune") || proposedDecision.includes("🟢")) {
    doc.setTextColor("#10b981"); // green
  } else if (proposedDecision.includes("Surveillance") || proposedDecision.includes("🟡")) {
    doc.setTextColor("#d97706"); // amber
  } else if (proposedDecision.includes("Urgente") || proposedDecision.includes("🚨") || proposedDecision.includes("🔴")) {
    doc.setTextColor("#dc2626"); // red
  } else {
    doc.setTextColor("#f97316"); // orange
  }
  doc.text(proposedDecision, 56, y + 5);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(charcoal);
  const splitJustif = doc.splitTextToSize(proposedJustification, pageWidth - 42);
  doc.text(splitJustif, 20, y + 9);

  // Divider line inside box
  doc.setDrawColor("#e2e8f0");
  doc.line(18, y + 17, pageWidth - 18, y + 17);

  // Expert Validation Status
  const validationStatus = inspection.expertDecisionStatus || "À vérifier";
  const expertName = inspection.expertName || "Non renseigné";
  const expertOrg = inspection.expertOrganization || "Non renseigné";
  const validationDate = inspection.expertValidationDate ? new Date(inspection.expertValidationDate).toLocaleDateString('fr-FR') : "Non renseigné";
  const expertComments = inspection.expertComments || "Aucun commentaire particulier saisi.";

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy);
  doc.text("Validation de l'expert :", 20, y + 21);

  // Validation state badge
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  if (validationStatus === "Validé") {
    doc.setTextColor("#166534");
    doc.text("[X] Validé      [ ] À vérifier      [ ] Refusé", 53, y + 21);
  } else if (validationStatus === "À vérifier") {
    doc.setTextColor("#854d0e");
    doc.text("[ ] Validé      [X] À vérifier      [ ] Refusé", 53, y + 21);
  } else {
    doc.setTextColor("#991b1b");
    doc.text("[ ] Validé      [ ] À vérifier      [X] Refusé", 53, y + 21);
  }

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(charcoal);
  doc.text(`Expert : ${expertName} (${expertOrg})`, 20, y + 25);
  doc.text(`Date : ${validationDate}`, 120, y + 25);

  const splitComments = doc.splitTextToSize(`Commentaires : ${expertComments}`, pageWidth - 42);
  doc.text(splitComments, 20, y + 29);

  // If there's a signature, draw it in the box or at the bottom visa area!
  if (inspection.expertSignature) {
    try {
      doc.setFont("Times", "italic");
      doc.setFontSize(7);
      doc.setTextColor("#475569");
      doc.text("Signature :", 155, y + 21);
      doc.addImage(inspection.expertSignature, "PNG", 168, y + 17, 20, 7);
    } catch (e) {
      doc.text("[Signature numérique]", 168, y + 21);
    }
  }

  y += decisionBoxH + 6;

  // --- 7. SUIVI DE MAINTENANCE À J+2 & EXÉCUTION DES TRAVAUX DE CHANTIER ---
  let storedInterventions: any[] = [];
  try {
    const rawInv = localStorage.getItem("batismart_interventions");
    if (rawInv) storedInterventions = JSON.parse(rawInv);
  } catch (e) {}

  const bInterventions = storedInterventions.filter((inv: any) => 
    (inv.buildingName && inspection.buildingName && inv.buildingName.trim().toLowerCase() === inspection.buildingName.trim().toLowerCase()) ||
    (inv.linkedInspectionId && inv.linkedInspectionId === inspection.id)
  );

  if (y + 40 > 260) {
    addPageWithHeader("SUIVI DE MAINTENANCE & CHANTIER (J+2)");
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy);
  doc.text("7. SUIVI DE MAINTENANCE À J+2 & EXÉCUTION DES TRAVAUX", 15, y);

  y += 3.5;
  const maintBoxH = 36;
  doc.setFillColor("#f8fafc");
  doc.rect(15, y, pageWidth - 30, maintBoxH, "F");
  doc.setDrawColor("#cbd5e1");
  doc.setLineWidth(0.2);
  doc.rect(15, y, pageWidth - 30, maintBoxH, "S");

  // Statut de maintenance
  const currentMStatus = inspection.maintenanceStatus || "Planifiée";
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy);
  doc.text("Statut de la maintenance à J+2 :", 20, y + 5);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  if (currentMStatus === "Clôturée") doc.setTextColor("#166534");
  else if (currentMStatus === "En cours") doc.setTextColor("#0284c7");
  else doc.setTextColor("#d97706");
  doc.text(currentMStatus.toUpperCase(), 68, y + 5);

  // Maintenance Tasks
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(darkNavy);
  doc.text("Programme & Tâches de réhabilitation (J+2) :", 20, y + 10);

  const defaultTasks = [
    { id: "1", label: "Traitement des fissures & pontage des acrotères", completed: true },
    { id: "2", label: "Application primaire d'accrochage & résine SEL", completed: true },
    { id: "3", label: "Nettoyage des noues & contrôle des évacuations pluviales", completed: true }
  ];
  const activeTasks = Array.isArray(inspection.maintenanceTasks) && inspection.maintenanceTasks.length > 0 
    ? inspection.maintenanceTasks 
    : defaultTasks;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  let taskY = y + 14;
  activeTasks.slice(0, 4).forEach((t: any) => {
    const mark = t.completed ? "[X]" : "[ ]";
    doc.setTextColor(t.completed ? "#166534" : "#475569");
    doc.text(`${mark} ${t.label}`, 22, taskY);
    taskY += 3.8;
  });

  // Interventions history summary
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(darkNavy);
  doc.text(`Interventions de chantier enregistrées (${bInterventions.length}) :`, 110, y + 10);

  let invY = y + 14;
  if (bInterventions.length === 0) {
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(6.5);
    doc.setTextColor(charcoal);
    doc.text("• Diagnostic initial en attente d'engagement de travaux", 112, invY);
  } else {
    bInterventions.slice(0, 3).forEach((inv: any) => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(valueBlack);
      doc.text(`• ${inv.type} (${inv.company || "Entreprise"}) - ${inv.estimatedCost || "Coût N/A"}`, 112, invY);
      invY += 3.5;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(5.8);
      doc.setTextColor(charcoal);
      const desc = inv.description ? inv.description.substring(0, 45) : "Chantier d'étanchéité";
      doc.text(`  Date: ${inv.date} | ${desc}`, 112, invY);
      invY += 4;
    });
  }

  y += maintBoxH + 6;

  // --- 8. RELEVÉS PHOTOGRAPHIQUES ET CLICHÉS DETERRAIN ---
  // Collect up to 5 unique photos for the gallery
  const photosToRender: string[] = [];
  if (Array.isArray(inspection.imageUrls)) {
    inspection.imageUrls.forEach(url => {
      if (url && typeof url === "string" && !photosToRender.includes(url)) {
        photosToRender.push(url);
      }
    });
  }
  if (inspection.imageUrl && typeof inspection.imageUrl === "string" && !photosToRender.includes(inspection.imageUrl)) {
    // Make sure we include the main image as well if it's not already in the list
    photosToRender.unshift(inspection.imageUrl);
  }
  // Remove possible duplicate entries and limit to 5
  const finalPhotos = Array.from(new Set(photosToRender)).filter(Boolean).slice(0, 5);

  let photosSectionHeight = 0;
  if (finalPhotos.length > 0) {
    if (finalPhotos.length === 1) {
      photosSectionHeight = 6.5 + 70 + 12;
    } else if (finalPhotos.length === 2) {
      photosSectionHeight = 6.5 + 55 + 12;
    } else if (finalPhotos.length === 3) {
      photosSectionHeight = 6.5 + 38 + 12;
    } else if (finalPhotos.length === 4) {
      photosSectionHeight = 6.5 + (2 * 55) + 8 + 12;
    } else { // 5 photos
      photosSectionHeight = 6.5 + (2 * 38) + 10 + 12;
    }
  }

  // Calculate if the photos section and signatures fit on Page 2
  const neededSpace = y + photosSectionHeight + 45 + 10; // signatures need ~45mm, adding 10mm safety margin
  
  if (neededSpace >= footerY && finalPhotos.length > 0) {
    // Doesn't fit on Page 2! Add Page 3!
    addPageWithHeader("ANNEXE III : VUES DE TERRAIN & SIGNATURES");
  } else {
    y = Math.max(y + 2, 110);
  }

  if (finalPhotos.length > 0) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(darkNavy);
    doc.text("8. RELEVÉS PHOTOGRAPHIQUES DE TERRAIN (HAUTE CLARTÉ)", 15, y);
    doc.setDrawColor(lightBlue);
    doc.setLineWidth(0.35);
    doc.line(15, y + 1.5, 125, y + 1.5);

    y += 6.5;

    const captions = [
      "Cliché #1 : Vue d'ensemble de la zone inspectée",
      "Cliché #2 : Zoom sur les désordres observés",
      "Cliché #3 : Point singulier / Détails techniques",
      "Cliché #4 : Perspective technique complémentaire",
      "Cliché #5 : Éléments structuraux et finitions"
    ];

    if (finalPhotos.length === 1) {
      const w = 110;
      const h = 70;
      const x = (pageWidth - w) / 2;
      const photoUrl = finalPhotos[0];

      doc.setFillColor("#f8fafc");
      doc.rect(x, y, w, h, "F");
      doc.setDrawColor("#cbd5e1");
      doc.setLineWidth(0.25);
      doc.rect(x, y, w, h, "S");

      try {
        let format = "JPEG";
        if (photoUrl.startsWith("data:image/")) {
          const matches = photoUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
          if (matches && matches[1]) {
            const ext = matches[1].toUpperCase();
            if (ext === "PNG") format = "PNG";
            else if (ext === "WEBP") format = "WEBP";
          }
        }
        doc.addImage(photoUrl, format, x + 0.5, y + 0.5, w - 1, h - 1);
      } catch (e) {
        console.warn("Failed to render single photo in PDF:", e);
      }

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(darkNavy);
      doc.text(captions[0], pageWidth / 2, y + h + 5, { align: "center" });

      y += h + 12;

    } else if (finalPhotos.length === 2) {
      const w = 85;
      const h = 55;
      const gap = 10;
      const startX = (pageWidth - (2 * w + gap)) / 2;

      for (let i = 0; i < 2; i++) {
        const x = startX + i * (w + gap);
        const photoUrl = finalPhotos[i];

        doc.setFillColor("#f8fafc");
        doc.rect(x, y, w, h, "F");
        doc.setDrawColor("#cbd5e1");
        doc.setLineWidth(0.25);
        doc.rect(x, y, w, h, "S");

        try {
          let format = "JPEG";
          if (photoUrl.startsWith("data:image/")) {
            const matches = photoUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
            if (matches && matches[1]) {
              const ext = matches[1].toUpperCase();
              if (ext === "PNG") format = "PNG";
              else if (ext === "WEBP") format = "WEBP";
            }
          }
          doc.addImage(photoUrl, format, x + 0.5, y + 0.5, w - 1, h - 1);
        } catch (e) {
          console.warn(`Failed to render photo ${i} in PDF:`, e);
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(darkNavy);
        doc.text(captions[i], x + w / 2, y + h + 5, { align: "center" });
      }

      y += h + 12;

    } else if (finalPhotos.length === 3) {
      const w = 56;
      const h = 38;
      const gap = 6;
      const startX = (pageWidth - (3 * w + 2 * gap)) / 2;

      for (let i = 0; i < 3; i++) {
        const x = startX + i * (w + gap);
        const photoUrl = finalPhotos[i];

        doc.setFillColor("#f8fafc");
        doc.rect(x, y, w, h, "F");
        doc.setDrawColor("#cbd5e1");
        doc.setLineWidth(0.25);
        doc.rect(x, y, w, h, "S");

        try {
          let format = "JPEG";
          if (photoUrl.startsWith("data:image/")) {
            const matches = photoUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
            if (matches && matches[1]) {
              const ext = matches[1].toUpperCase();
              if (ext === "PNG") format = "PNG";
              else if (ext === "WEBP") format = "WEBP";
            }
          }
          doc.addImage(photoUrl, format, x + 0.5, y + 0.5, w - 1, h - 1);
        } catch (e) {
          console.warn(`Failed to render photo ${i} in PDF:`, e);
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(darkNavy);
        doc.text(captions[i], x + w / 2, y + h + 5, { align: "center" });
      }

      y += h + 12;

    } else if (finalPhotos.length === 4) {
      const w = 85;
      const h = 55;
      const gapX = 10;
      const gapY = 8;
      const startX = (pageWidth - (2 * w + gapX)) / 2;

      for (let i = 0; i < 4; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = startX + col * (w + gapX);
        const curY = y + row * (h + gapY);
        const photoUrl = finalPhotos[i];

        doc.setFillColor("#f8fafc");
        doc.rect(x, curY, w, h, "F");
        doc.setDrawColor("#cbd5e1");
        doc.setLineWidth(0.25);
        doc.rect(x, curY, w, h, "S");

        try {
          let format = "JPEG";
          if (photoUrl.startsWith("data:image/")) {
            const matches = photoUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
            if (matches && matches[1]) {
              const ext = matches[1].toUpperCase();
              if (ext === "PNG") format = "PNG";
              else if (ext === "WEBP") format = "WEBP";
            }
          }
          doc.addImage(photoUrl, format, x + 0.5, curY + 0.5, w - 1, h - 1);
        } catch (e) {
          console.warn(`Failed to render photo ${i} in PDF:`, e);
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(darkNavy);
        doc.text(captions[i], x + w / 2, curY + h + 5, { align: "center" });
      }

      y += 2 * h + gapY + 12;

    } else { // 5 photos
      const w = 56;
      const h = 38;
      const gap = 6;
      const startX1 = (pageWidth - (3 * w + 2 * gap)) / 2;

      for (let i = 0; i < 3; i++) {
        const x = startX1 + i * (w + gap);
        const photoUrl = finalPhotos[i];

        doc.setFillColor("#f8fafc");
        doc.rect(x, y, w, h, "F");
        doc.setDrawColor("#cbd5e1");
        doc.setLineWidth(0.25);
        doc.rect(x, y, w, h, "S");

        try {
          let format = "JPEG";
          if (photoUrl.startsWith("data:image/")) {
            const matches = photoUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
            if (matches && matches[1]) {
              const ext = matches[1].toUpperCase();
              if (ext === "PNG") format = "PNG";
              else if (ext === "WEBP") format = "WEBP";
            }
          }
          doc.addImage(photoUrl, format, x + 0.5, y + 0.5, w - 1, h - 1);
        } catch (e) {
          console.warn(`Failed to render photo ${i} in PDF:`, e);
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(darkNavy);
        doc.text(captions[i], x + w / 2, y + h + 5, { align: "center" });
      }

      const startX2 = (pageWidth - (2 * w + gap)) / 2;
      const row2Y = y + h + 10;

      for (let i = 3; i < 5; i++) {
        const x = startX2 + (i - 3) * (w + gap);
        const photoUrl = finalPhotos[i];

        doc.setFillColor("#f8fafc");
        doc.rect(x, row2Y, w, h, "F");
        doc.setDrawColor("#cbd5e1");
        doc.setLineWidth(0.25);
        doc.rect(x, row2Y, w, h, "S");

        try {
          let format = "JPEG";
          if (photoUrl.startsWith("data:image/")) {
            const matches = photoUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
            if (matches && matches[1]) {
              const ext = matches[1].toUpperCase();
              if (ext === "PNG") format = "PNG";
              else if (ext === "WEBP") format = "WEBP";
            }
          }
          doc.addImage(photoUrl, format, x + 0.5, row2Y + 0.5, w - 1, h - 1);
        } catch (e) {
          console.warn(`Failed to render photo ${i} in PDF:`, e);
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(darkNavy);
        doc.text(captions[i], x + w / 2, row2Y + h + 5, { align: "center" });
      }

      y = row2Y + h + 12;
    }
  }

  // --- 8. SIGNATURES & OFFICIAL STAMP ---
  doc.setDrawColor(borderGray);
  doc.setLineWidth(0.3);
  doc.line(15, footerY, pageWidth - 15, footerY);

  // Signature titles
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy);
  doc.text("Visa de l'Inspecteur Technique", 20, footerY + 5);
  doc.text("Commission BatiSmart Roof IA", 78, footerY + 5);
  doc.text("Authentification Numérique QR", pageWidth - 55, footerY + 5);

  // Draw cursive decorative signature for first column
  doc.setFont("Times", "italic");
  doc.setFontSize(10);
  doc.setTextColor("#0f172a");
  doc.text(`${inspection.inspectorName}`, 25, footerY + 11);

  // Draw an official circular stamp for BatiSmart
  const stampCx = 92;
  const stampCy = footerY + 15;
  doc.setDrawColor("#dc2626"); // strong red
  doc.setLineWidth(0.35);
  doc.circle(stampCx, stampCy, 8, "S");
  doc.circle(stampCx, stampCy, 7.2, "S");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(4);
  doc.setTextColor("#dc2626");
  doc.text("BatiSmart Roof IA", stampCx - 4.5, stampCy - 1);
  doc.text("STARTUP", stampCx - 4, stampCy + 1.5);
  doc.text("ALGERIA", stampCx - 3.8, stampCy + 4);

  // QR Code drawn in vector
  const qrX = pageWidth - 48;
  const qrY = footerY + 8;
  const qrSize = 18;
  doc.setFillColor("#000000");
  doc.rect(qrX, qrY, qrSize, qrSize, "S");
  doc.setLineWidth(0.15);
  
  // Outer squares (Position detection patterns)
  doc.rect(qrX + 1, qrY + 1, 4, 4, "F");
  doc.setFillColor("#ffffff"); doc.rect(qrX + 2, qrY + 2, 2, 2, "F");
  doc.setFillColor("#000000"); doc.rect(qrX + 2.5, qrY + 2.5, 1, 1, "F");

  doc.rect(qrX + qrSize - 5, qrY + 1, 4, 4, "F");
  doc.setFillColor("#ffffff"); doc.rect(qrX + qrSize - 4, qrY + 2, 2, 2, "F");
  doc.setFillColor("#000000"); doc.rect(qrX + qrSize - 3.5, qrY + 2.5, 1, 1, "F");

  doc.rect(qrX + 1, qrY + qrSize - 5, 4, 4, "F");
  doc.setFillColor("#ffffff"); doc.rect(qrX + 2, qrY + qrSize - 4, 2, 2, "F");
  doc.setFillColor("#000000"); doc.rect(qrX + 2.5, qrY + qrSize - 3.5, 1, 1, "F");

  // Random pixel points inside the QR Code
  doc.setFillColor("#000000");
  const points = [
    [7, 2], [8, 2], [10, 1], [11, 2], [12, 3], [13, 2],
    [1, 7], [2, 8], [3, 7], [5, 6], [7, 7], [9, 8], [11, 7], [13, 8],
    [6, 10], [8, 11], [10, 10], [12, 11], [13, 10], [9, 12],
    [7, 13], [8, 13], [11, 13], [12, 13], [13, 13]
  ];
  points.forEach(([px, py]) => {
    doc.rect(qrX + px, qrY + py, 1, 1, "F");
  });

  // --- DYNAMIC PAGE-NUMBERING & BRAND FOOTER LOOP ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Draw fine separation line for the footer
    doc.setDrawColor("#cbd5e1");
    doc.setLineWidth(0.2);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

    // Disclaimer (Mention légale)
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(7.0);
    doc.setTextColor("#475569");
    const disclaimer1 = "Les résultats présentés correspondent à un pré-diagnostic selon critères IA basés sur l'analyse d'images multicritères.";
    const disclaimer2 = "Ils constituent une aide à la décision et doivent être consolidés par un expert qualifié ou un organisme d'audit.";
    doc.text(disclaimer1, pageWidth / 2, pageHeight - 15, { align: "center" });
    doc.text(disclaimer2, pageWidth / 2, pageHeight - 11, { align: "center" });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.0);
    doc.setTextColor("#64748b");
    doc.text(`Rapport de Critères de Diagnostic BatiSmart Roof IA • ID: ${inspection.id}`, 15, pageHeight - 5);
    doc.text(`Page ${i}/${totalPages} • Béjaïa, Algérie`, pageWidth - 45, pageHeight - 5);
  }

  // Handle output formats
  if (outputType === "jspdf") {
    return doc;
  }
  
  if (outputType === "blob") {
    return doc.output("blob");
  }

  if (outputType === "dataurl") {
    return doc.output("datauristring");
  }

  if (outputType === "share") {
    try {
      const blob = doc.output("blob");
      const file = new File([blob], filename, { type: "application/pdf" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: filename,
          text: `Rapport de pré-diagnostic d'étanchéité BatiSmart Roof IA pour l'édifice ${inspection.buildingName}.`
        }).catch((err) => {
          console.warn("Share failed, saving directly:", err);
          doc.save(filename);
        });
        return true;
      }
    } catch (shareErr) {
      console.warn("Navigator share failed, falling back to direct download:", shareErr);
    }
    // Fallback to standard save if sharing not supported or failed
    doc.save(filename);
    return true;
  }

  // Trigger browser download or print
  if (triggerPrint) {
    try {
      doc.autoPrint();
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (!win) {
        // If popup blocker or sandbox iframe blocked window.open, fallback to direct download
        doc.save(filename);
      }
    } catch (err) {
      console.warn("Could not open print tab, downloading directly:", err);
      doc.save(filename);
    }
  } else {
    doc.save(filename);
  }
  return true;
} catch (error) {
  console.error("Critical error inside generateInspectionPDF:", error);
  return false;
}
}
