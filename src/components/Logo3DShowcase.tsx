import React, { useState, useRef, useEffect } from "react";
import { X, RotateCw, Play, Pause, Sparkles, Sun, Shield, Layers, Droplets, Cpu, Download, Eye, Maximize2, RefreshCw } from "lucide-react";

interface Logo3DShowcaseProps {
  onClose: () => void;
}

export default function Logo3DShowcase({ onClose }: Logo3DShowcaseProps) {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(10);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [bgMode, setBgMode] = useState<"white" | "transparent" | "dark">("white");
  const [materialPreset, setMaterialPreset] = useState<"studio" | "neon" | "metallic">("studio");
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Auto 360 animation loop
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (isAutoSpinning && !isDragging) {
        setRotationY((prev) => (prev + 0.6) % 360);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoSpinning, isDragging]);

  // Mouse interaction for 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    rotStartRef.current = { x: rotationX, y: rotationY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setRotationY((rotStartRef.current.y + deltaX * 0.8) % 360);
    setRotationX(Math.max(-45, Math.min(45, rotStartRef.current.x - deltaY * 0.5)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Background style classes
  const getBgClass = () => {
    if (bgMode === "white") return "bg-white text-slate-900 border-slate-200";
    if (bgMode === "dark") return "bg-slate-950 text-white border-slate-800";
    return "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100 text-slate-900 border-slate-300";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: 3D Studio Canvas Area */}
        <div
          className={`flex-1 flex flex-col items-center justify-center p-8 relative min-h-[380px] md:min-h-[500px] select-none transition-colors duration-500 ${getBgClass()}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Studio Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
            {materialPreset === "neon" && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>
            )}
          </div>

          {/* Top Info Banner */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-xs font-semibold text-white shadow-lg pointer-events-none">
            <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
            <span>Studio 3D Rendu Réaliste & Rotatif 360°</span>
          </div>

          {/* Rotatable 3D Container */}
          <div
            className="relative cursor-grab active:cursor-grabbing transition-transform duration-75 ease-out flex flex-col items-center justify-center my-auto"
            style={{
              transform: `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Photorealistic 3D Render Image Asset with 3D Depth Shadow */}
            <div className="relative group">
              <img
                src="/src/assets/images/batismart_logo_3d_1784761795283.jpg"
                alt="BatiSmart Roof IA 3D Logo Studio Render"
                referrerPolicy="no-referrer"
                className={`w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain rounded-2xl transition-all duration-300 ${
                  materialPreset === "neon"
                    ? "drop-shadow-[0_0_35px_rgba(2,132,199,0.7)]"
                    : "drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                }`}
              />

              {/* Reflections Overlay Effect */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60"
                style={{
                  transform: `translateZ(20px)`,
                }}
              ></div>
            </div>

            {/* Simulated 3D Floor Shadow */}
            <div
              className="w-72 h-8 rounded-[100%] bg-black/30 blur-md mt-4 transition-all duration-150"
              style={{
                transform: `rotateX(80deg) scale(${1 - Math.abs(rotationX) / 100})`,
              }}
            ></div>
          </div>

          {/* Interactive Drag Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-medium text-slate-400 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60 pointer-events-none flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
            <span>Faites glisser pour faire pivoter à 360° | Molette pour zoomer</span>
          </div>
        </div>

        {/* Right Column: Control Panel & Specifications */}
        <div className="w-full md:w-80 p-6 bg-slate-900 text-slate-100 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 overflow-y-auto">
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sky-400 font-extrabold text-sm uppercase tracking-wider mb-1">
                <Shield className="w-4 h-4" />
                <span>BatiSmart Roof IA</span>
              </div>
              <h2 className="text-xl font-black text-white">Identité Visuelle 3D</h2>
              <p className="text-xs text-slate-400 mt-1">
                Logo redesigné intégrant toiture-terrasse, membrane d'étanchéité, infiltrations, bouclier et IA.
              </p>
            </div>

            {/* Animation & Rotation Controls */}
            <div className="space-y-4 mb-6">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Contrôle Animation 360°
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isAutoSpinning
                      ? "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  {isAutoSpinning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isAutoSpinning ? "Mettre en Pause" : "Lancer Rotation 360°"}</span>
                </button>

                <button
                  onClick={() => {
                    setRotationX(10);
                    setRotationY(0);
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  title="Réinitialiser l'angle"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Background Environments */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Fond de Studio
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setBgMode("white")}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    bgMode === "white"
                      ? "border-sky-500 bg-sky-500/10 text-sky-400"
                      : "border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white"
                  }`}
                >
                  Blanc Studio
                </button>
                <button
                  onClick={() => setBgMode("transparent")}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    bgMode === "transparent"
                      ? "border-sky-500 bg-sky-500/10 text-sky-400"
                      : "border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white"
                  }`}
                >
                  Damier PNG
                </button>
                <button
                  onClick={() => setBgMode("dark")}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    bgMode === "dark"
                      ? "border-sky-500 bg-sky-500/10 text-sky-400"
                      : "border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white"
                  }`}
                >
                  Dark Tech
                </button>
              </div>
            </div>

            {/* Material & Lighting Presets */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Rendu Matériaux
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setMaterialPreset("studio")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs border text-left transition-all ${
                    materialPreset === "studio"
                      ? "border-sky-500 bg-slate-800 text-white"
                      : "border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800/80"
                  }`}
                >
                  <span className="font-semibold">Verre, Métal & Réfractivité</span>
                  <span className="text-[10px] text-sky-400 font-bold">Standard Studio</span>
                </button>
                <button
                  onClick={() => setMaterialPreset("neon")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs border text-left transition-all ${
                    materialPreset === "neon"
                      ? "border-sky-500 bg-slate-800 text-white"
                      : "border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800/80"
                  }`}
                >
                  <span className="font-semibold">Électrique IA & Luminescence</span>
                  <span className="text-[10px] text-blue-400 font-bold">Glow Cyber</span>
                </button>
              </div>
            </div>

            {/* Key Symbol Breakdown */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Symbolique du Redesign :</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span>Toiture-terrasse en perspective isometric</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Membrane d'étanchéité multicouche en coupe</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>Goutte d'eau & détection des infiltrations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-300"></span>
                  <span>Bouclier protecteur du patrimoine bâti</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span>Circuits IA & Géolocalisation SIG / Smart City</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                // Trigger download of 3D image asset
                const link = document.createElement("a");
                link.href = "/src/assets/images/batismart_logo_3d_1784761795283.jpg";
                link.download = "BatiSmart_Roof_IA_Logo_3D.jpg";
                link.click();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-sky-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger Rendu 3D HD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
