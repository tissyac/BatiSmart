import React, { useState, useEffect } from "react";
import { 
  X, 
  FileText, 
  Share2, 
  Download, 
  ExternalLink, 
  Printer, 
  Loader2, 
  Smartphone, 
  Laptop, 
  AlertCircle,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { Inspection } from "../types";
import { generateInspectionPDF } from "../utils/pdfGenerator";

interface PdfDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: Inspection | null;
  showToast: (message: string) => void;
}

export const PdfDownloadModal: React.FC<PdfDownloadModalProps> = ({
  isOpen,
  onClose,
  inspection,
  showToast
}) => {
  const [loadingAction, setLoadingAction] = useState<"share" | "save" | "preview" | "print" | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // High-performance background image optimization state
  const [optimizedInspection, setOptimizedInspection] = useState<Inspection | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Background optimize the image as soon as the modal is opened
  useEffect(() => {
    if (!isOpen || !inspection) {
      setOptimizedInspection(null);
      setIsOptimizing(false);
      return;
    }

    // Initialize with current inspection
    setOptimizedInspection(inspection);

    const optimizeImage = async () => {
      let updatedImageUrl = inspection.imageUrl;
      let updatedImageUrls = inspection.imageUrls ? [...inspection.imageUrls] : [];

      const needsMainProxy = !!(
        inspection.imageUrl &&
        !inspection.imageUrl.startsWith("data:image/") &&
        !inspection.imageUrl.includes(";base64,")
      );

      const needsUrlsProxy = !!(
        Array.isArray(inspection.imageUrls) &&
        inspection.imageUrls.some(
          (url) => url && !url.startsWith("data:image/") && !url.includes(";base64,")
        )
      );

      if (needsMainProxy || needsUrlsProxy) {
        setIsOptimizing(true);
        try {
          // Proxy main image if needed
          if (needsMainProxy) {
            const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(inspection.imageUrl!)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.base64) {
                updatedImageUrl = data.base64;
              }
            }
          }

          // Proxy list images if needed
          if (Array.isArray(inspection.imageUrls)) {
            updatedImageUrls = await Promise.all(
              inspection.imageUrls.map(async (url) => {
                if (url && !url.startsWith("data:image/") && !url.includes(";base64,")) {
                  try {
                    const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
                    if (res.ok) {
                      const data = await res.json();
                      if (data.base64) return data.base64;
                    }
                  } catch (e) {
                    console.warn("Failed to proxy image list item:", url, e);
                  }
                }
                return url;
              })
            );
          }

          setOptimizedInspection({
            ...inspection,
            imageUrl: updatedImageUrl,
            imageUrls: updatedImageUrls
          });
        } catch (e) {
          console.warn("Could not background optimize/proxy images for PDF:", e);
        } finally {
          setIsOptimizing(false);
        }
      }
    };

    optimizeImage();
  }, [isOpen, inspection]);

  if (!isOpen || !inspection) return null;

  const currentInspection = optimizedInspection || inspection;

  const handleShare = () => {
    setLoadingAction("share");
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      // 100% synchronous PDF generation preserves mobile user gestures
      const doc = generateInspectionPDF(currentInspection, false, "jspdf");
      const filename = `Rapport_BatiSmart_${currentInspection.buildingName.replace(/\s+/g, "_")}.pdf`;
      const blob = doc.output("blob");
      const file = new File([blob], filename, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: filename,
          text: `Rapport de pré-diagnostic d'étanchéité BatiSmart pour l'édifice ${currentInspection.buildingName}.`
        })
        .then(() => {
          setSuccessMessage("Menu de partage ouvert !");
          showToast("Partage du PDF initié 📸");
        })
        .catch((shareErr) => {
          console.warn("Share was aborted or failed:", shareErr);
          if (shareErr.name !== "AbortError") {
            // Fallback: open as preview
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            setSuccessMessage("Aperçu ouvert ! Vous pouvez le partager via votre navigateur.");
          }
        });
      } else {
        // Fallback: Web Share API or file sharing not supported on this browser
        const url = URL.createObjectURL(blob);
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          const win = window.open(url, "_blank");
          if (win) {
            setSuccessMessage("Aperçu PDF ouvert ! Utilisez l'icône de partage de votre navigateur mobile.");
            showToast("Aperçu ouvert pour partage 📱");
          } else {
            window.location.href = url;
          }
        } else {
          doc.save(filename);
          setSuccessMessage("Téléchargement du fichier PDF démarré !");
          showToast("Rapport PDF enregistré 💾");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Le partage direct a échoué. Veuillez essayer de l'ouvrir en tant qu'Aperçu PDF.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownload = () => {
    setLoadingAction("save");
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const doc = generateInspectionPDF(currentInspection, false, "jspdf");
      const filename = `Rapport_BatiSmart_${currentInspection.buildingName.replace(/\s+/g, "_")}.pdf`;
      doc.save(filename);
      setSuccessMessage("Téléchargement du fichier démarré !");
      showToast("Rapport PDF généré ! 💾");
    } catch (err) {
      console.error(err);
      setErrorMessage("Le téléchargement direct a échoué. Si le téléchargement automatique ne démarre pas sur votre smartphone Android, vous pouvez utiliser l'option de Partage ou ouvrir l'Aperçu PDF.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePreview = () => {
    setLoadingAction("preview");
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const doc = generateInspectionPDF(currentInspection, false, "jspdf");
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const previewWindow = window.open(url, "_blank", "noopener,noreferrer");

      if (previewWindow) {
        setSuccessMessage("Aperçu PDF ouvert dans un nouvel onglet !");
        showToast("Aperçu ouvert ! 👁️");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = `Rapport_BatiSmart_${currentInspection.buildingName.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSuccessMessage("Le PDF a été téléchargé pour consultation.");
        showToast("Aperçu téléchargé 💾");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Impossible d'ouvrir l'aperçu. Le téléchargement du PDF a été lancé à la place.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePrint = () => {
    setLoadingAction("print");
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const doc = generateInspectionPDF(currentInspection, false, "jspdf");
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);

      // Create a hidden iframe for silent, robust background printing
      const printIframe = document.createElement("iframe");
      printIframe.style.position = "fixed";
      printIframe.style.right = "0";
      printIframe.style.bottom = "0";
      printIframe.style.width = "0";
      printIframe.style.height = "0";
      printIframe.style.border = "none";
      printIframe.src = url;
      document.body.appendChild(printIframe);

      printIframe.onload = () => {
        try {
          printIframe.contentWindow?.focus();
          printIframe.contentWindow?.print();
          setSuccessMessage("Dialogue d'impression ouvert !");
          showToast("Boîte d'impression ouverte 🖨️");
          // Clean up the iframe and object URL after use
          setTimeout(() => {
            try {
              document.body.removeChild(printIframe);
              URL.revokeObjectURL(url);
            } catch (e) {}
          }, 30000);
        } catch (iframeErr) {
          console.error("Iframe printing failed, trying popup fallback:", iframeErr);
          const win = window.open(url, "_blank");
          if (win) {
            setSuccessMessage("Impression ouverte dans un nouvel onglet !");
          } else {
            window.location.href = url;
          }
        }
      };
    } catch (err) {
      console.error(err);
      setErrorMessage("L'action d'impression a échoué sur ce navigateur.");
    } finally {
      setLoadingAction(null);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, "_blank");
  };

  const isInIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  return (
    <div id="pdf-download-modal-backdrop" className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="pdf-download-modal-card" 
        className="relative w-full max-w-lg bg-white dark:bg-[#070b19] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col my-auto"
      >
        {/* Sky-Blue / Emerald Accent Top Indicator Banner */}
        <div className="h-2 w-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-850 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-md font-bold text-slate-900 dark:text-white">
              Assistant Téléchargement & Partage PDF
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Prédiagnostic technique : <span className="font-bold text-slate-700 dark:text-slate-300">"{inspection.buildingName}"</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {/* Status feedback alerts */}
          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Active Methods */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Choisissez l'action la plus adaptée à votre appareil
            </span>

            {/* 1. Share via Phone Sheet (Primary for mobile) */}
            <button
              onClick={handleShare}
              disabled={loadingAction !== null}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-600 hover:from-sky-600 hover:to-teal-700 text-white shadow-lg shadow-sky-500/10 transition flex items-center justify-between gap-3 text-left group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl text-white group-hover:scale-110 transition shrink-0">
                  <Smartphone className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    Partager / Envoyer le PDF <span className="bg-white/20 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full">Recommandé Mobile</span>
                  </div>
                  <div className="text-[10px] text-white/80 mt-0.5 font-light">
                    Ouvre le partage natif (WhatsApp, Email, Enregistrer sur iPhone/Android...)
                  </div>
                </div>
              </div>
              {loadingAction === "share" ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <Share2 className="w-4.5 h-4.5 group-hover:translate-x-1 transition shrink-0" />
              )}
            </button>

            {/* 2. Direct download (Primary for PC & Android) */}
            <button
              onClick={handleDownload}
              disabled={loadingAction !== null}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/80 transition flex items-center justify-between gap-3 text-left group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl text-amber-500 group-hover:scale-110 transition shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    Télécharger le Fichier <span className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full">Recommandé Android & PC</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-light">
                    Télécharge et enregistre directement le rapport .pdf dans le dossier de téléchargements de votre téléphone Android ou PC
                  </div>
                </div>
              </div>
              {loadingAction === "save" ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0 text-slate-500" />
              ) : (
                <Download className="w-4.5 h-4.5 text-slate-400 group-hover:translate-y-0.5 transition shrink-0" />
              )}
            </button>

            {/* 3. Browser preview in tab */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePreview}
                disabled={loadingAction !== null}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/45 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingAction === "preview" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5" />
                )}
                <span>Aperçu PDF</span>
              </button>

              <button
                onClick={handlePrint}
                disabled={loadingAction !== null}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/45 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingAction === "print" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin animate-pulse" />
                ) : (
                  <Printer className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>Imprimer</span>
              </button>
            </div>
          </div>

          {/* Emergency Section for Sandboxed Iframes */}
          {isInIframe() && (
            <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2.5">
              <div className="flex gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold leading-none">Blocage d'aperçu d'Iframe détecté</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    Vous visualisez actuellement BatiSmart à travers la visionneuse sécurisée d'AI Studio. Les navigateurs restreignent souvent les téléchargements de fichiers et l'accès caméra dans cet environnement.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openInNewTab}
                className="w-full py-2 px-4.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Ouvrir l'application en Plein Écran</span>
              </button>
            </div>
          )}

          {/* Quick FAQ info block */}
          <div className="flex gap-2 text-[10px] text-slate-400 dark:text-slate-500">
            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
            <p className="leading-relaxed">
              Les rapports de pré-diagnostic et critères de diagnostic IA de BatiSmart Roof IA comprennent des signatures d'analyse, des coordonnées géoréférencées GPS de l'édifice d'Algérie et un code QR technique unique d'identification.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
