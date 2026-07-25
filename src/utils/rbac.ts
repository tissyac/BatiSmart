import { UserRole } from "../types";

/**
 * Checks if a specific tab is authorized for a given user role.
 * Update: The core tabs (Scan Toiture IA, Dashboard, Maps) are unlocked for all roles
 * to let everyone access the main pre-diagnostic value of the application.
 */
export function isTabAuthorized(tabId: string, role: UserRole): boolean {
  // All roles are fully authorized to access and view all core tabs (Home, Scan, Dashboard, Map, Chat, History, Settings).
  return true;
}

/**
 * Gets a friendly list of authorized profiles for a given tab.
 */
export function getRequiredRoles(tabId: string): string {
  return "Tous les profils (Accès libre)";
}

/**
 * Generates an access restriction warning message if needed.
 */
export function getRestrictionMessage(tabId: string, role: UserRole): string {
  return "";
}

