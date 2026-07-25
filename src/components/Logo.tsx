import React, { useState } from "react";
import Logo3DShowcase from "./Logo3DShowcase";

interface LogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
  showSubtitle?: boolean;
  show3dBadge?: boolean;
  enable3dClick?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  variant = "light",
  showSubtitle = true,
  show3dBadge = false,
  enable3dClick = true,
}: LogoProps) {
  const [show3dModal, setShow3dModal] = useState(false);

  // Variant: "light" means logo for dark backgrounds, "dark" means logo for light backgrounds
  const isDarkBg = variant === "light";

  // Light blue box background for maximum legibility and contrast
  const sloganBg = isDarkBg 
    ? "bg-sky-900/90 text-sky-100 border-sky-400/60 shadow-md" 
    : "bg-sky-100 text-sky-950 border-sky-300 shadow-sm font-extrabold";

  let imgSizeClass = "w-36 h-auto";
  if (size === "xs") {
    imgSizeClass = "w-20 h-auto";
  } else if (size === "sm") {
    imgSizeClass = "w-28 h-auto";
  } else if (size === "lg") {
    imgSizeClass = "w-48 h-auto";
  } else if (size === "xl") {
    imgSizeClass = "w-64 h-auto";
  }

  return (
    <>
      <div
        className={`inline-flex flex-col items-center group cursor-pointer transition-all duration-300 hover:scale-[1.02] ${className}`}
        onClick={() => {
          if (enable3dClick) setShow3dModal(true);
        }}
        title="Cliquez pour afficher le Logo 3D Interactif à 360°"
      >
        {/* Textes au-dessus du logo */}
        {showSubtitle && (
          <div className="text-center mb-2.5 flex flex-col items-center gap-1.5 max-w-xs px-1">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wide text-center px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-sm border border-sky-400/30">
              Détecter aujourd'hui, préserver demain.
            </span>
            <p className={`text-[9.5px] sm:text-[10.5px] font-bold text-center leading-snug px-3 py-1.5 rounded-xl border ${sloganBg}`}>
              « Intelligence Artificielle au service de l’étanchéité du patrimoine bâti »
            </p>
          </div>
        )}

        {/* Main Official 3D Rendered Logo Image */}
        <div className="relative flex items-center justify-center p-1 rounded-2xl transition-all duration-300">
          <img
            src="/src/assets/images/batismart_logo_3d_1784761795283.jpg"
            alt="BatiSmart Roof IA Logo"
            referrerPolicy="no-referrer"
            className={`${imgSizeClass} object-contain rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-white border border-slate-200/60`}
          />

          {show3dBadge && (
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-lg border border-white/40 animate-pulse">
              3D
            </span>
          )}
        </div>
      </div>

      {/* Interactive 3D Modal */}
      {show3dModal && <Logo3DShowcase onClose={() => setShow3dModal(false)} />}
    </>
  );
}

