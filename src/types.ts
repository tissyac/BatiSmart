export interface AIDefectDetail {
  detected: boolean;
  severity: "Aucune" | "Faible" | "Moyenne" | "Élevée";
  description: string;
}

export interface AIDiagnostic {
  cracks: AIDefectDetail;
  humidity: AIDefectDetail;
  infiltration: AIDefectDetail;
  degradation: AIDefectDetail;
  riskScore: number; // 0 to 10
  summary: string;
  recommendations: string[];
}

export interface Inspection {
  id: string;
  buildingName: string;
  buildingType: "Administratif" | "Scolaire/Universitaire" | "Judiciaire" | "Santé" | "Culturel/Autre";
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  imageUrls?: string[];
  notes: string;
  inspectorName: string;
  inspectorEmail: string;
  inspectorUid?: string;
  date: string; // ISO String
  
  // AI results
  cracks: AIDefectDetail;
  humidity: AIDefectDetail;
  infiltration: AIDefectDetail;
  degradation: AIDefectDetail;
  riskScore: number;
  summary: string;
  recommendations: string[];

  // Maintenance tracking & collaborative RBAC annotations
  maintenanceStatus?: "Non planifiée" | "Planifiée" | "En cours" | "Clôturée";
  maintenanceTasks?: { id: string; label: string; completed: boolean }[];
  maintenancePhotos?: { id: string; label: string; url: string; date: string }[];

  // Expert decision validation fields
  expertDecisionStatus?: "Validé" | "À vérifier" | "Refusé";
  expertName?: string;
  expertOrganization?: string;
  expertValidationDate?: string;
  expertSignature?: string;
  expertComments?: string;
  aiProposedDecision?: string;
  aiProposedJustification?: string;
  customSurface?: number;
  isUserCreated?: boolean;
}

export type UserRole =
  | "Administrateur"
  | "Expert / Diagnostiqueur"
  | "Collectivité locale (APC / Wilaya / Ministère)"
  | "Bureau d'études"
  | "Entreprise de maintenance"
  | "Gestionnaire du patrimoine / Propriétaire ou Client"
  | "Opérateur drone / Agent de terrain"
  | "Inspecteur"
  | "Technicien";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  wilaya: string;
  createdAt: string;
}

export interface Intervention {
  id: string;
  buildingName: string;
  linkedInspectionId: string;
  date: string;
  type: string;
  description: string;
  company: string;
  responsible: string;
  duration: string;
  estimatedCost: string;
  photoBefore: string;
  photoAfter: string;
}

