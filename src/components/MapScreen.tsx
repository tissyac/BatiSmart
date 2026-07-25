import React, { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, MapPin, AlertTriangle, ShieldAlert, CheckCircle, Info } from "lucide-react";
import { Inspection } from "../types";

interface MapScreenProps {
  inspections: Inspection[];
  onViewInspection: (inspection: Inspection) => void;
  selectedInspectionId?: string | null;
  theme?: string;
}

export default function MapScreen({ inspections, onViewInspection, selectedInspectionId, theme }: MapScreenProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const tileLayerRef = useRef<any>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

  // Filtered inspections for list side-pane
  const filteredInspections = inspections.filter((ins) => {
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

  // Color helper for maps
  const getMarkerColor = (score: number) => {
    if (score >= 7.0) return "#dc2626"; // Red 600
    if (score >= 4.0) return "#d97706"; // Amber 600
    return "#059669"; // Emerald 600
  };

  useEffect(() => {
    // 1. Double check that Leaflet global 'L' is available
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    // 2. Initialize Map if not already initialized
    if (!mapInstanceRef.current) {
      // Centered at Algeria (approximate mid-point of coast buildings)
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [36.3, 3.5], 
        zoom: 7,
        zoomControl: true
      });
    }

    const map = mapInstanceRef.current;

    // 3. Mount beautiful CartoDB tiles dynamically depending on active theme
    const isDark = theme === "dark";
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    // 4. Clear any previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // 5. Populate Markers
    filteredInspections.forEach((ins) => {
      const color = getMarkerColor(ins.riskScore);
      
      // We will render beautiful custom SVG markers as L.divIcon
      const iconHtml = `
        <div style="position: relative; display: flex; items-center; justify-content: center;">
          <div style="position: absolute; width: 24px; height: 24px; background-color: ${color}; opacity: 0.2; border-radius: 50%; transform: scale(1.6); animation: pulse 2s infinite;"></div>
          <div style="width: 14px; height: 14px; background-color: ${color}; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.25); z-index: 10;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([ins.latitude, ins.longitude], { icon: customIcon })
        .addTo(map);

      // Create interactive popup HTML
      const popupContent = document.createElement("div");
      popupContent.className = "p-1 font-sans text-slate-800 dark:text-slate-100 space-y-2";
      popupContent.style.minWidth = "240px";

      const textColor = isDark ? "#f8fafc" : "#0f172a";
      const subColor = isDark ? "#94a3b8" : "#64748b";
      const cardBg = isDark ? "rgba(15, 23, 42, 0.75)" : "rgba(241, 245, 249, 0.9)";
      const cardBorder = isDark ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.9)";
      const bgBtn = isDark ? "#0284c7" : "#0ea5e9";

      let riskLevel = "Faible";
      let riskBadgeBg = "rgba(16, 185, 129, 0.12)";
      let riskBadgeText = "#10b981";
      let riskBadgeBorder = "rgba(16, 185, 129, 0.25)";

      if (ins.riskScore >= 7.0) {
        riskLevel = "Élevé";
        riskBadgeBg = "rgba(239, 68, 68, 0.12)";
        riskBadgeText = "#ef4444";
        riskBadgeBorder = "rgba(239, 68, 68, 0.25)";
      } else if (ins.riskScore >= 4.0) {
        riskLevel = "Modéré";
        riskBadgeBg = "rgba(245, 158, 11, 0.12)";
        riskBadgeText = "#f59e0b";
        riskBadgeBorder = "rgba(245, 158, 11, 0.25)";
      }

      const formattedDate = new Date(ins.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });

      const prediagName = ins.buildingType 
        ? `Prédiagnostic ${ins.buildingType}`
        : "Prédiagnostic Toiture IA";

      popupContent.innerHTML = `
        <div style="min-width: 230px; max-width: 270px; padding: 2px;">
          <!-- 1. Nom du bâtiment -->
          <div style="margin-bottom: 8px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: ${bgBtn};">
              📍 ${ins.city}
            </div>
            <strong style="color: ${textColor}; font-size: 13.5px; font-weight: 700; line-height: 1.3; display: block; margin-top: 2px;">
              ${ins.buildingName}
            </strong>
          </div>

          <!-- 2. Nom du prédiagnostic -->
          <div style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 8px; padding: 6px 8px; margin-bottom: 8px;">
            <div style="font-size: 9.5px; color: ${subColor}; font-weight: 600; text-transform: uppercase;">
              Prédiagnostic IA
            </div>
            <div style="font-size: 11px; font-weight: 600; color: ${textColor}; margin-top: 1px;">
              📋 ${prediagName}
            </div>
          </div>

          <!-- 3. Score & 4. Niveau de risque & 5. Date d'inspection -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px;">
            <div style="background-color: ${riskBadgeBg}; border: 1px solid ${riskBadgeBorder}; border-radius: 8px; padding: 5px 7px;">
              <div style="font-size: 9px; color: ${riskBadgeText}; font-weight: 700; text-transform: uppercase;">
                Score & Risque
              </div>
              <div style="font-size: 12px; font-weight: 800; color: ${riskBadgeText}; margin-top: 1px; display: flex; align-items: center; justify-content: space-between;">
                <span>${ins.riskScore.toFixed(1)}/10</span>
                <span style="font-size: 9.5px; background-color: ${riskBadgeText}; color: #ffffff; padding: 1px 4px; border-radius: 4px;">${riskLevel}</span>
              </div>
            </div>

            <div style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 8px; padding: 5px 7px;">
              <div style="font-size: 9px; color: ${subColor}; font-weight: 600; text-transform: uppercase;">
                Date d'inspection
              </div>
              <div style="font-size: 11px; font-weight: 600; color: ${textColor}; margin-top: 2px;">
                📅 ${formattedDate}
              </div>
            </div>
          </div>

          <!-- 6. Bouton Consulter -->
          <button id="popup-btn-${ins.id}" style="width: 100%; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; padding: 7px 10px; border-radius: 8px; font-size: 11.5px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(2,132,199,0.25); display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>Consulter</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      `;

      // Mount element event listener on popup open
      marker.bindPopup(popupContent, {
        className: "custom-leaflet-popup",
        closeButton: false,
        offset: [0, -5]
      });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`popup-btn-${ins.id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            onViewInspection(ins);
          });
        }
      });

      (marker as any).inspectionId = ins.id;
      markersRef.current.push(marker);
    });

    // 6. Adjust map bounds or center on selected building
    if (selectedInspectionId) {
      const targetIns = inspections.find((ins) => ins.id === selectedInspectionId);
      if (targetIns && mapInstanceRef.current) {
        map.setView([targetIns.latitude, targetIns.longitude], 15, { animate: true });
        const targetMarker = markersRef.current.find((m) => (m as any).inspectionId === selectedInspectionId);
        if (targetMarker) {
          setTimeout(() => {
            targetMarker.openPopup();
          }, 350);
        }
      } else if (filteredInspections.length > 0 && mapInstanceRef.current) {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.15));
      }
    } else if (filteredInspections.length > 0 && mapInstanceRef.current) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.15));
    }

  }, [filteredInspections, theme, selectedInspectionId]);

  // Dedicated effect to re-focus when selectedInspectionId changes
  useEffect(() => {
    if (selectedInspectionId && mapInstanceRef.current && markersRef.current.length > 0) {
      const targetIns = inspections.find((ins) => ins.id === selectedInspectionId);
      if (targetIns) {
        mapInstanceRef.current.setView([targetIns.latitude, targetIns.longitude], 15, { animate: true });
        const targetMarker = markersRef.current.find((m) => (m as any).inspectionId === selectedInspectionId);
        if (targetMarker) {
          setTimeout(() => {
            targetMarker.openPopup();
          }, 250);
        }
      }
    }
  }, [selectedInspectionId, inspections]);

  // Handle flying to a building coordinate
  const handleFlyTo = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 13, {
        animate: true,
        duration: 1.2
      });
      setMobileView("map");
    }
  };

  // Invalidate Leaflet map size when mobile tab view switches to "map"
  useEffect(() => {
    if (mobileView === "map" && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [mobileView]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden font-sans text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#030712]">
      
      {/* Mobile View Toggle Tabs */}
      <div className="md:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b19] shrink-0 z-20">
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition cursor-pointer ${
            mobileView === "map"
              ? "border-sky-500 text-sky-600 dark:text-sky-400 font-bold"
              : "border-transparent text-slate-500 dark:text-slate-400"
          }`}
        >
          Carte Interactive
        </button>
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition cursor-pointer ${
            mobileView === "list"
              ? "border-sky-500 text-sky-600 dark:text-sky-400 font-bold"
              : "border-transparent text-slate-500 dark:text-slate-400"
          }`}
        >
          Filtres & Liste ({filteredInspections.length})
        </button>
      </div>

      <div className="flex flex-1 h-full w-full overflow-hidden relative">
        {/* Sidebar: Filters & Buildings List */}
        <div className={`
          ${mobileView === "list" ? "flex w-full" : "hidden"}
          md:flex md:w-88 bg-white dark:bg-[#070b19] border-r border-slate-200 dark:border-slate-800/80 flex-col h-full shrink-0
        `}>
          
          {/* Search header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-sm font-semibold font-display text-slate-800 dark:text-slate-200 mb-3">Filtres Cartographiques</h3>
            
            <div className="space-y-3">
              {/* Search query input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher bâtiment, ville..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all duration-300"
                />
              </div>

              {/* Structure Type filter */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Type de structure</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition duration-300"
                >
                  <option value="all">Tous les types</option>
                  <option value="Administratif">Administratif</option>
                  <option value="Scolaire/Universitaire">Scolaire / Universitaire</option>
                  <option value="Judiciaire">Judiciaire</option>
                  <option value="Santé">Santé</option>
                </select>
              </div>

              {/* Severity filter */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Gravité de Risque</label>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition duration-300"
                >
                  <option value="all">Tous les risques</option>
                  <option value="critical">Danger Critique (Score ≥ 7.0)</option>
                  <option value="medium">Moyen / Alerte (Score 4.0 - 6.9)</option>
                  <option value="secure">Toitures Saines (Score &lt; 4.0)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Inspections List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex items-center justify-between px-2 mb-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span>Résultats ({filteredInspections.length})</span>
              <span>SIG Interactif</span>
            </div>

            {filteredInspections.map((ins) => {
              const isHigh = ins.riskScore >= 7.0;
              const isMed = ins.riskScore >= 4.0 && ins.riskScore < 7.0;
              const badgeBg = isHigh 
                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40" 
                : isMed 
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40" 
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40";

              return (
                <div
                  key={ins.id}
                  onClick={() => handleFlyTo(ins.latitude, ins.longitude)}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-800 rounded-xl transition duration-300 cursor-pointer group flex items-start gap-3 shadow-sm"
                >
                  {/* Visual Icon indicator */}
                  <div className="mt-1 shrink-0">
                    {isHigh ? (
                      <ShieldAlert className="w-5 h-5 text-red-600" />
                    ) : isMed ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>

                  <div className="overflow-hidden flex-1">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition duration-300">
                      {ins.buildingName}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1">
                      {ins.city} • {ins.buildingType}
                    </p>
                    
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${badgeBg}`}>
                        Risque : {ins.riskScore}/10
                      </span>
                      <span className="text-[9px] text-sky-600 dark:text-sky-400 group-hover:underline font-light">
                        Centrer la carte
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredInspections.length === 0 && (
              <div className="text-center py-12 px-4 text-slate-400 dark:text-slate-500 text-xs font-light space-y-1">
                <MapPin className="w-6 h-6 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">Aucun bâtiment géolocalisé</p>
                <p className="text-[11px] leading-relaxed">Réalisez un pré-diagnostic IA pour faire apparaître un nouveau point GPS sur la carte interactive.</p>
              </div>
            )}
          </div>

        </div>

        {/* Main interactive map stage */}
        <div className={`
          ${mobileView === "map" ? "flex" : "hidden"}
          md:flex flex-1 h-full relative bg-slate-100 dark:bg-[#030712]
        `}>
          <div ref={mapContainerRef} className="w-full h-full z-10" />
          
          {/* Floating Quick Guide on Map Layer */}
          <div className="absolute bottom-5 right-5 z-20 bg-white/95 dark:bg-[#070b19]/95 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-lg flex items-center gap-3 max-w-sm pointer-events-none">
            <Info className="w-5 h-5 text-sky-500 shrink-0" />
            <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-light">
              <span className="text-slate-800 dark:text-slate-200 font-semibold block mb-0.5">Légende de risque des toitures :</span>
              🔴 Critique (Score ≥ 7) | 🟡 Alerte (Score 4 - 6) | 🟢 Saine (&lt; 4)
            </div>
          </div>
        </div>

      </div>
    </div>
  );

}
