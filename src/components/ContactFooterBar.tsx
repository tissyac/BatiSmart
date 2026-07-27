import React, { useState } from "react";
import { Phone, Mail, MapPin, X, ChevronUp } from "lucide-react";

interface ContactFooterBarProps {
  theme: "light" | "dark";
}

export default function ContactFooterBar({ theme }: ContactFooterBarProps) {
  const isDark = theme === "dark";
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Sticky Contact Footer Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t transition-all duration-300 ${
          isDark
            ? "bg-slate-900/95 border-slate-800 shadow-2xl shadow-slate-950"
            : "bg-white/95 border-slate-200 shadow-2xl shadow-slate-200/50"
        }`}
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          {/* Collapsed View */}
          {!isExpanded && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm flex-1 min-w-0">
                <span
                  className={`font-bold whitespace-nowrap ${
                    isDark ? "text-sky-400" : "text-sky-600"
                  }`}
                >
                  BatiSmart Roof IA
                </span>
                <span className={isDark ? "text-slate-500" : "text-slate-400"}>
                  •
                </span>
                <span className={`truncate ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  📧 djihane.tamoum@tech.univ-bejaia.dz
                </span>
                <span className={isDark ? "text-slate-500" : "text-slate-400"}>
                  •
                </span>
                <span className={`hidden sm:inline ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  📱 +213 659 845 529
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href="mailto:djihane.tamoum@tech.univ-bejaia.dz?subject=Demande%20d'information%20-%20BatiSmart%20Roof%20IA"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isDark
                      ? "bg-sky-600 hover:bg-sky-700 text-white"
                      : "bg-sky-500 hover:bg-sky-600 text-white"
                  }`}
                >
                  Nous contacter
                </a>
                <button
                  onClick={() => setIsExpanded(true)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                      : "hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                  }`}
                  title="Plus d'infos"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Expanded View */}
          {isExpanded && (
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-bold ${isDark ? "text-sky-400" : "text-sky-600"}`}>
                  📞 Contactez Tamoum Djihane - BatiSmart Roof IA
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className={`p-1 rounded transition-colors ${
                    isDark
                      ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                      : "hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Email 1 */}
                <a
                  href="mailto:djihane.tamoum@tech.univ-bejaia.dz"
                  className={`flex items-start gap-2 p-2.5 rounded-lg text-xs transition-colors ${
                    isDark
                      ? "bg-slate-800/50 hover:bg-slate-800 text-slate-300"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-sky-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs">Email Pro</p>
                    <p className="text-[11px] opacity-75 truncate">
                      djihane.tamoum@tech.univ-bejaia.dz
                    </p>
                  </div>
                </a>

                {/* Email 2 */}
                <a
                  href="mailto:djihanetamoum@gmail.com"
                  className={`flex items-start gap-2 p-2.5 rounded-lg text-xs transition-colors ${
                    isDark
                      ? "bg-slate-800/50 hover:bg-slate-800 text-slate-300"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-sky-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs">Email Personnel</p>
                    <p className="text-[11px] opacity-75 truncate">
                      djihanetamoum@gmail.com
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+213659845529"
                  className={`flex items-start gap-2 p-2.5 rounded-lg text-xs transition-colors ${
                    isDark
                      ? "bg-slate-800/50 hover:bg-slate-800 text-slate-300"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs">Téléphone</p>
                    <p className="text-[11px] opacity-75">+213 659 845 529</p>
                  </div>
                </a>

                {/* Location */}
                <div
                  className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${
                    isDark ? "bg-slate-800/50 text-slate-300" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs">Localisation</p>
                    <p className="text-[11px] opacity-75">Béjaïa – Algérie</p>
                  </div>
                </div>
              </div>

              {/* Info Text */}
              <p
                className={`text-[11px] text-center ${
                  isDark ? "text-slate-500" : "text-slate-500"
                }`}
              >
                🎓 Étudiante en Master 2 Architecture | Université Abderrahmane Mira de Béjaïa
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div
        className={`h-14 sm:h-12 transition-all duration-300 ${
          isExpanded ? "sm:h-32 md:h-28" : ""
        }`}
      />
    </>
  );
}
