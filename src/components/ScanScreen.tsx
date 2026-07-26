import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  Upload, 
  RotateCw, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  ShieldAlert, 
  MessageSquare, 
  Send, 
  HelpCircle, 
  Cpu, 
  Coins, 
  FileText, 
  Printer, 
  Share2, 
  Wrench, 
  TrendingUp, 
  Droplet, 
  Flame, 
  Box, 
  Compass, 
  ShieldCheck,
  Check,
  X,
  Lock,
  Plus,
  SwitchCamera,
  CameraOff
} from "lucide-react";
import { Inspection, UserProfile } from "../types";
import { generateInspectionPDF } from "../utils/pdfGenerator";
import { PdfDownloadModal } from "./PdfDownloadModal";
import { getBudgetEstimation, formatDA } from "../utils/budgetHelper";

interface ScanScreenProps {
  onNewInspection: (inspection: Inspection, autoSwitch?: boolean) => void;
  inspectorName: string;
  inspectorEmail: string;
  language?: "fr" | "ar" | "en";
  user: UserProfile;
  onNavigateToTab?: (tab: string) => void;
  onViewOnMap?: (inspection: Inspection) => void;
}

// Sample images for testing
const SAMPLE_ROOFS = [
  {
    id: "sample_1",
    label: "Toiture asphalte fissurée (Modèle)",
    buildingName: "Bloc C - Faculté de Médecine d'Alger",
    type: "Scolaire/Universitaire",
    city: "Alger (16)",
    address: "Boulevard Didouche Mourad",
    notes: "Dégâts d'étanchéité soupçonnés le long de la conduite pluviale d'angle.",
    imageUrl: "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "sample_2",
    label: "Dalle béton infiltrée (Critique)",
    buildingName: "Tribunal Administratif de Bouira",
    type: "Judiciaire",
    city: "Alger (16)",
    address: "Avenue du 1er Novembre",
    notes: "Ancien dôme en béton fissuré subissant des tassements différentiels majeurs.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "sample_3",
    label: "Toiture saine rénovée (Saine)",
    buildingName: "Annexe Administrative d'Oran",
    type: "Administratif",
    city: "Oran (31)",
    address: "Boulevard de l'ALN",
    notes: "Terrasse technique de climatisation. Étanchéité récemment appliquée.",
    imageUrl: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1628533602410-b9df701fb61a?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

const ALGERIAN_WILAYAS = [
  "Adrar (01)", "Chlef (02)", "Laghouat (03)", "Oum El Bouaghi (04)", "Batna (05)",
  "Béjaïa (06)", "Biskra (07)", "Béchar (08)", "Blida (09)", "Bouira (10)",
  "Tébessa (11)", "Tlemcen (12)", "Tiaret (13)", "Tizi Ouzou (15)", "Alger (16)",
  "Djelfa (17)", "Jijel (18)", "Sétif (19)", "Saïda (20)", "Skikda (21)",
  "Sidi Bel Abbès (22)", "Annaba (23)", "Guelma (24)", "Constantine (25)",
  "Médéa (26)", "Mostaganem (27)", "M'Sila (28)", "Mascara (29)", "Ouargla (30)",
  "Oran (31)", "El Bayadh (32)", "Illizi (33)", "Bordj Bou Arréridj (34)",
  "Boumerdès (35)", "El Tarf (36)", "Tindouf (37)", "Tissemsilt (38)", "El Oued (39)",
  "Khenchela (40)", "Souk Ahras (41)", "Tipaza (42)", "Mila (43)", "Aïn Defla (44)",
  "Naâma (45)", "Aïn Témouchent (46)", "Ghardaïa (47)", "Relizane (48)",
  "Timimoun (49)", "Bordj Badji Mokhtar (50)", "Ouled Djellal (51)", "Béni Abbès (52)",
  "In Salah (53)", "In Guezzam (54)", "Touggourt (55)", "Djanet (56)",
  "El M'Ghair (57)", "El Meniaa (58)"
];

const WILAYA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Adrar (01)": { lat: 27.8797, lng: -0.2901 },
  "Chlef (02)": { lat: 36.1648, lng: 1.3313 },
  "Laghouat (03)": { lat: 33.8000, lng: 2.8651 },
  "Oum El Bouaghi (04)": { lat: 35.8754, lng: 7.1135 },
  "Batna (05)": { lat: 35.5550, lng: 6.1741 },
  "Béjaïa (06)": { lat: 36.7512, lng: 5.0567 },
  "Biskra (07)": { lat: 34.8503, lng: 5.7282 },
  "Béchar (08)": { lat: 31.6167, lng: -2.2167 },
  "Blida (09)": { lat: 36.4700, lng: 2.8300 },
  "Bouira (10)": { lat: 36.3749, lng: 3.9020 },
  "Tébessa (11)": { lat: 35.4042, lng: 8.1242 },
  "Tlemcen (12)": { lat: 34.8783, lng: -1.3150 },
  "Tiaret (13)": { lat: 35.3710, lng: 1.3170 },
  "Tizi Ouzou (15)": { lat: 36.7118, lng: 4.0459 },
  "Alger (16)": { lat: 36.7525, lng: 3.0420 },
  "Djelfa (17)": { lat: 34.6722, lng: 3.2531 },
  "Jijel (18)": { lat: 36.8205, lng: 5.7661 },
  "Sétif (19)": { lat: 36.1900, lng: 5.4100 },
  "Saïda (20)": { lat: 34.8303, lng: 0.1517 },
  "Skikda (21)": { lat: 36.8789, lng: 6.9044 },
  "Sidi Bel Abbès (22)": { lat: 35.1899, lng: -0.6308 },
  "Annaba (23)": { lat: 36.9015, lng: 7.7618 },
  "Guelma (24)": { lat: 36.4621, lng: 7.4261 },
  "Constantine (25)": { lat: 36.3650, lng: 6.6147 },
  "Médéa (26)": { lat: 36.2642, lng: 2.7539 },
  "Mostaganem (27)": { lat: 35.9312, lng: 0.0892 },
  "M'Sila (28)": { lat: 35.7058, lng: 4.5419 },
  "Mascara (29)": { lat: 35.3965, lng: 0.1403 },
  "Ouargla (30)": { lat: 31.9493, lng: 5.3250 },
  "Oran (31)": { lat: 35.6972, lng: -0.6353 },
  "El Bayadh (32)": { lat: 33.6803, lng: 1.0192 },
  "Illizi (33)": { lat: 26.4833, lng: 8.4667 },
  "Bordj Bou Arréridj (34)": { lat: 36.0731, lng: 4.7594 },
  "Boumerdès (35)": { lat: 36.7597, lng: 3.4731 },
  "El Tarf (36)": { lat: 36.7672, lng: 8.3136 },
  "Tindouf (37)": { lat: 27.6711, lng: -8.1478 },
  "Tissemsilt (38)": { lat: 35.6072, lng: 1.8106 },
  "El Oued (39)": { lat: 33.3678, lng: 6.8516 },
  "Khenchela (40)": { lat: 35.4167, lng: 7.1500 },
  "Souk Ahras (41)": { lat: 36.2864, lng: 7.9511 },
  "Tipaza (42)": { lat: 36.5894, lng: 2.4475 },
  "Mila (43)": { lat: 36.4503, lng: 6.2644 },
  "Aïn Defla (44)": { lat: 36.2653, lng: 2.0139 },
  "Naâma (45)": { lat: 33.2667, lng: -0.3167 },
  "Aïn Témouchent (46)": { lat: 35.2975, lng: -1.1403 },
  "Ghardaïa (47)": { lat: 32.4900, lng: 3.6700 },
  "Relizane (48)": { lat: 35.7372, lng: 0.5558 },
  "Timimoun (49)": { lat: 29.2639, lng: 0.2311 },
  "Bordj Badji Mokhtar (50)": { lat: 21.3278, lng: 0.9528 },
  "Ouled Djellal (51)": { lat: 34.4167, lng: 5.0667 },
  "Béni Abbès (52)": { lat: 30.0833, lng: -2.1667 },
  "In Salah (53)": { lat: 27.1936, lng: 2.4828 },
  "In Guezzam (54)": { lat: 19.5686, lng: 5.7725 },
  "Touggourt (55)": { lat: 33.1000, lng: 6.0667 },
  "Djanet (56)": { lat: 24.5550, lng: 9.4853 },
  "El M'Ghair (57)": { lat: 33.9500, lng: 5.9167 },
  "El Meniaa (58)": { lat: 30.5833, lng: 2.8833 }
};

export default function ScanScreen({ onNewInspection, inspectorName, inspectorEmail, language = "fr", user, onNavigateToTab, onViewOnMap }: ScanScreenProps) {
  // Input fields
  const [buildingName, setBuildingName] = useState("");
  const [buildingType, setBuildingType] = useState<Inspection["buildingType"]>("Administratif");
  const [city, setCity] = useState("Alger (16)");
  const [customCity, setCustomCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [latitude, setLatitude] = useState(36.7525);
  const [longitude, setLongitude] = useState(3.0420);

  // States
  const [gpsStatus, setGpsStatus] = useState<"idle" | "acquiring" | "success" | "error">("idle");
  const [gpsMessage, setGpsMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedSample, setSelectedSample] = useState<string>("");
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");

  // Acquisition mode: camera, gallery, drone, thermal, 3d_scan
  const [acquisitionMode, setAcquisitionMode] = useState<"camera" | "gallery" | "drone" | "thermal" | "3d_scan">("gallery");

  // Live Camera Stream States
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);
  const [cameraLaunching, setCameraLaunching] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Helper functions for Camera
  const startCamera = async (mode: "user" | "environment" = "environment") => {
    setCameraError(null);
    setCameraLaunching(true);
    setCameraReady(false);

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("La caméra live n'est pas disponible sur ce navigateur.");
      setCameraActive(false);
      setCameraLaunching(false);
      return;
    }

    const isSecureContext = typeof window !== "undefined" && window.isSecureContext;
    const isLocalhost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (!isSecureContext && !isLocalhost) {
      setCameraError("Cette page doit être servie via HTTPS pour utiliser la caméra live.");
      setCameraActive(false);
      setCameraLaunching(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setCameraStream(stream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
        videoRef.current.oncanplay = () => {
          setCameraReady(true);
        };
        await videoRef.current.play().catch(() => undefined);

        await new Promise(resolve => setTimeout(resolve, 1200));

        if (videoRef.current.videoWidth && videoRef.current.videoHeight) {
          setCameraReady(true);
        } else {
          stream.getTracks().forEach((track) => track.stop());
          setCameraStream(null);
          setCameraActive(false);
          setCameraReady(false);
          setCameraError("Le flux caméra live ne s'affiche pas correctement sur cet appareil. Utilisez la sélection photo ci-dessous.");
        }
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setCameraError(
        "Impossible d'accéder à l'appareil photo. Autorisez la caméra dans votre navigateur ou utilisez la prise de photo mobile."
      );
      setCameraActive(false);
    } finally {
      setCameraLaunching(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
    setCameraReady(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) {
      showToast("Le flux caméra n'est pas encore prêt. Veuillez patienter un instant.");
      return;
    }

    for (let attempt = 0; attempt < 8; attempt += 1) {
      if (videoRef.current.videoWidth && videoRef.current.videoHeight) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) {
      showToast("Le flux caméra n'est pas encore prêt. Veuillez patienter un instant.");
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL("image/jpeg", 0.85);

        setUploadedImages(prev => {
          const combined = [...prev, base64Image].slice(0, 5);
          setUploadedImage(base64Image);
          return combined;
        });

        setSelectedSample("");
        showToast("Photo de terrain capturée avec succès ! 📸");

        // Flash shutter effect
        setIsShutterFlashing(true);
        setTimeout(() => setIsShutterFlashing(false), 150);
      }
    } catch (err) {
      console.error("Failed to capture photo:", err);
      showToast("Erreur lors de la capture de l'image.");
    }
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    if (cameraActive) {
      startCamera(nextMode);
    }
  };

  const openNativeCameraPicker = () => {
    if (nativeCameraInputRef.current) {
      nativeCameraInputRef.current.value = "";
      nativeCameraInputRef.current.click();
    }
  };

  const handleModeSelection = (modeId: "camera" | "gallery" | "drone" | "thermal" | "3d_scan", modeLabel: string, isFuture: boolean) => {
    if (isFuture) {
      showToast(`Le module d'acquisition ${modeLabel} est en cours de développement (Phase 2).`);
      return;
    }

    setAcquisitionMode(modeId);
    if (modeId === "camera") {
      setTimeout(() => {
        openNativeCameraPicker();
      }, 120);
      showToast("Ouverture de l’appareil photo…");
    } else {
      showToast(`Mode d'acquisition '${modeLabel}' activé !`);
    }
  };

  useEffect(() => {
    if (acquisitionMode !== "camera") {
      stopCamera();
    }
  }, [acquisitionMode]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Force drone mode for drone operator on load
  useEffect(() => {
    if (user && user.role === "Opérateur drone / Agent de terrain") {
      setAcquisitionMode("drone");
    }
  }, [user]);

  // Flow states
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState<Inspection | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Conversational Assistant State
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantResult, setAssistantResult] = useState<{
    query: string;
    causes: string;
    severity: string;
    recomm: string;
    cost: string;
    priority: string;
  } | null>(null);

  // Financial Simulation State
  const [ministryBudget, setMinistryBudget] = useState(50); // M DA
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [selectedPathology, setSelectedPathology] = useState<any>(null);

  // Toast
  const [toastText, setToastText] = useState<string | null>(null);

  const scanSteps = [
    "Téléversement des photographies télémétriques...",
    "Géolocalisation du bâtiment via balises GPS...",
    "Analyse thermique et segmentation des fissures...",
    "Traitement du nuage de points par Gemini-3.5...",
    "Génération des recommandations de maintenance préventive..."
  ];

  const handleCityChange = (selectedCity: string) => {
    setCity(selectedCity);
    if (selectedCity === "Autre (Saisir manuellement)") return;
    const coords = WILAYA_COORDINATES[selectedCity];
    if (coords) {
      setLatitude(coords.lat + (Math.random() - 0.5) * 0.01);
      setLongitude(coords.lng + (Math.random() - 0.5) * 0.01);
    }
  };

  const handleAcquireGPS = () => {
    setGpsStatus("acquiring");
    setGpsMessage("Demande d'accès au chipset GPS...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setGpsStatus("success");
          setGpsMessage("Position GPS exacte détectée et acquise !");
        },
        (err) => {
          setGpsStatus("error");
          const activeCity = city === "Autre (Saisir manuellement)" ? "Alger (16)" : city;
          const coords = WILAYA_COORDINATES[activeCity] || WILAYA_COORDINATES["Alger (16)"];
          setLatitude(coords.lat + (Math.random() - 0.5) * 0.01);
          setLongitude(coords.lng + (Math.random() - 0.5) * 0.01);
          setGpsMessage("Accès GPS indisponible ou limité. Coordonnées de la Wilaya appliquées.");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setGpsStatus("error");
      setGpsMessage("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const processUploadedFiles = (files: FileList | File[], isAppend: boolean = false) => {
    if (files && files.length > 0) {
      setImageMimeType("image/jpeg");
      setSelectedSample("");
      
      const newImagesBase64: string[] = [];
      let processedCount = 0;
      const maxAllowed = isAppend ? Math.max(0, 5 - uploadedImages.length) : 5;
      const totalFiles = Math.min(files.length, maxAllowed);
      
      if (totalFiles <= 0) {
        showToast("Limite de 5 photos de terrain atteinte !");
        return;
      }
      
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          const rawBase64 = reader.result as string;
          // Compress and resize the image immediately using a client-side canvas
          const img = new Image();
          img.onload = () => {
            const maxDimension = 800; // 800px width/height is perfect for both Gemini AI analysis and high-quality PDF rendering
            let width = img.width;
            let height = img.height;

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              try {
                // Compress to JPEG with 0.75 quality for superb visual quality and minimal file size (~80-120KB)
                const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
                newImagesBase64.push(compressedBase64);
              } catch (err) {
                console.warn("Image compression failed, falling back to raw upload:", err);
                newImagesBase64.push(rawBase64);
              }
            } else {
              newImagesBase64.push(rawBase64);
            }
            
            processedCount++;
            if (processedCount === totalFiles) {
              setUploadedImages(prev => {
                const combined = isAppend ? [...prev, ...newImagesBase64].slice(0, 5) : newImagesBase64.slice(0, 5);
                if (combined.length > 0) {
                  setUploadedImage(combined[0]);
                }
                return combined;
              });
              showToast(`${processedCount} image(s) importée(s) avec succès !`);
            }
          };
          img.onerror = () => {
            newImagesBase64.push(rawBase64);
            processedCount++;
            if (processedCount === totalFiles) {
              setUploadedImages(prev => {
                const combined = isAppend ? [...prev, ...newImagesBase64].slice(0, 5) : newImagesBase64.slice(0, 5);
                if (combined.length > 0) {
                  setUploadedImage(combined[0]);
                }
                return combined;
              });
            }
          };
          img.src = rawBase64;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isAppend: boolean = false) => {
    const files = e.target.files;
    if (files) {
      processUploadedFiles(files, isAppend);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processUploadedFiles(files);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_ROOFS[0]) => {
    setSelectedSample(sample.id);
    setUploadedImage(sample.imageUrl);
    setUploadedImages(sample.imageUrls || [sample.imageUrl]);
    setBuildingName(sample.buildingName);
    setBuildingType(sample.type as Inspection["buildingType"]);
    setCity(sample.city);
    setAddress(sample.address);
    setNotes(sample.notes);
    handleCityChange(sample.city);
  };

  const handleStartAnalysis = async () => {
    setError("");
    if (!buildingName) {
      setError("Veuillez entrer le nom du bâtiment public.");
      return;
    }
    if (!uploadedImage) {
      setError("Veuillez téléverser une photo ou sélectionner un modèle.");
      return;
    }

    setScanning(true);
    setScanStep(0);

    const stepIntervals = [900, 1100, 1100, 1200, 800];
    
    const triggerStep = (idx: number) => {
      if (idx < scanSteps.length) {
        setScanStep(idx);
        setTimeout(() => triggerStep(idx + 1), stepIntervals[idx]);
      } else {
        executeBackendAnalysis();
      }
    };

    triggerStep(0);
  };

  const executeBackendAnalysis = async () => {
    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadedImage,
          images: uploadedImages,
          mimeType: imageMimeType,
          buildingName,
          notes
        })
      });

      if (!response.ok) {
        let errorDetail = "";
        try {
          const errJson = await response.json();
          errorDetail = errJson.error || errJson.message || "";
        } catch (_) {}
        throw new Error(errorDetail || `Status ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      const newInspection: Inspection = {
        id: "insp_" + Math.random().toString(36).substr(2, 9),
        buildingName,
        buildingType,
        city: city === "Autre (Saisir manuellement)" ? (customCity || "Autre") : city,
        address: address || `Rue principale, ${(city === "Autre (Saisir manuellement)" ? (customCity || "Autre") : city).split(" ")[0]}`,
        latitude,
        longitude,
        imageUrl: uploadedImage || "",
        imageUrls: uploadedImages.length > 0 ? uploadedImages : (uploadedImage ? [uploadedImage] : []),
        notes: notes || "Aucune note de terrain renseignée.",
        inspectorName: inspectorName || user?.displayName || "Inspecteur",
        inspectorEmail: (inspectorEmail || user?.email || "").trim().toLowerCase(),
        inspectorUid: user?.uid,
        date: new Date().toISOString(),
        isUserCreated: true,
        ...data
      };

      setScanResult(newInspection);
      // Enregistrer automatiquement dans l'historique en arrière-plan
      onNewInspection(newInspection, false);
      setScanning(false);
    } catch (err: any) {
      console.error(err);
      setError(`L'analyse cognitive a échoué. ${err?.message || "Veuillez vérifier la connexion ou l'état de l'image."}`);
      setScanning(false);
    }
  };

  // Conversational Assistant Handler
  const handleAssistantQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setAssistantLoading(true);
    setAssistantResult(null);

    // Simulated technical heritage answer based on prompt keywords
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const lowercase = queryText.toLowerCase();
    let causes = "Retrait thermique et fatigue de la dalle béton due aux forts écarts de température nuit/jour en milieu algérien.";
    let severity = "Moyenne";
    let recomm = "Application d'un mastic élastomère de pontage polyuréthane et pose d'un isolant en panneaux de liège expansé local.";
    let cost = "45 000 DA à 65 000 DA";
    let priority = "Action sous 60 jours (Moyenne)";

    if (lowercase.includes("fissure verticale") || lowercase.includes("fissure structurelle")) {
      causes = "Tassement différentiel des fondations ou fatigue mécanique de l'acrotère liée à un séisme ou tassement de sol argileux.";
      severity = "Élevée (Structurelle)";
      recomm = "Injection sous pression de coulis de chaux hydraulique naturelle ou de résines hydrophobes expansives de haute technicité.";
      cost = "110 000 DA";
      priority = "Urgente (Intervention sous 30 jours)";
    } else if (lowercase.includes("humidité") || lowercase.includes("infiltration") || lowercase.includes("fuite")) {
      causes = "Déchirure de la chape d'étanchéité bitumineuse bicouche au droit des évacuations pluviales obstruées.";
      severity = "Élevée";
      recomm = "Curage des conduits, pose de crapaudines en acier galvanisé, et réfection locale par membrane d'étanchéité liquide.";
      cost = "35 000 DA";
      priority = "Urgence Modérée (Intervention sous 45 jours)";
    } else if (lowercase.includes("béton") || lowercase.includes("dégradation")) {
      causes = "Carbonatation du béton armé due à une exposition prolongée aux gaz atmosphériques et à l'humidité saline côtière.";
      severity = "Critique";
      recomm = "Piquage du béton dégradé, brossage de l'acier oxydé, application d'un passivant antirouille puis reconstitution au mortier fibré hydrofuge.";
      cost = "85 000 DA";
      priority = "Prioritaire (Action immédiate)";
    }

    setAssistantResult({
      query: queryText,
      causes,
      severity,
      recomm,
      cost,
      priority
    });
    setAssistantLoading(false);
  };

  // Registration of generated report
  const handleSaveResultToHistory = () => {
    if (scanResult) {
      onNewInspection(scanResult);
      showToast("Prédiagnostic enregistré avec succès !");
      setScanResult(null);
      // Reset form on success
      setBuildingName("");
      setAddress("");
      setNotes("");
      setUploadedImage(null);
      setUploadedImages([]);
      setSelectedSample("");
    }
  };

  const showToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 3500);
  };

  // 12 pathologies dataset for the automatic intelligent detection display
  const detectedPathologies = (() => {
    switch (language) {
      case "ar":
        return [
          {
            name: "تشققات",
            prob: 94,
            severity: "حرج",
            loc: "منطقة جدار السطح الشمالي الشرقي",
            recomm: "حقن راتنج تمددي مانع لتسرب المياه أو ملاط جير هيدروليكي.",
            photo: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "رطوبة",
            prob: 88,
            severity: "متوسط",
            loc: "الجهة السفلية للبلاطة الخرسانية",
            recomm: "تطبيق طلاء جير طبيعي منفذ للهواء وتوفير تهوية نشطة.",
            photo: "https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Droplet className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "تسريب المياه",
            prob: 91,
            severity: "حرج",
            loc: "توصيلات قنوات تصريف مياه الأمطار",
            recomm: "تركيب غشاء عازل مزدوج الطبقات ملحوم بالحرارة لمنع التسرب.",
            photo: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "انفصال الطبقات",
            prob: 79,
            severity: "متوسط",
            loc: "الامتداد الجانبي الغربي للسقف",
            recomm: "إعادة ترميم فواصل الحواف والشرائط العازلة التالفة.",
            photo: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Layers className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "تآكل الحديد",
            prob: 76,
            severity: "متوسط",
            loc: "حديد التسليح الخرساني المكشوف",
            recomm: "تنظيف الحديد بالفرشاة المعدنية، طلاء مقاوم للصدأ، وملاط إصلاح خاص.",
            photo: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Wrench className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "أكسدة",
            prob: 64,
            severity: "ضعيف",
            loc: "الهياكل المعدنية الحاملة للمكيفات",
            recomm: "صنفرة السطح، طلاء أساس الزنك، ودهان نهائي مقاوم للعوامل الجوية.",
            photo: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
            color: "border-emerald-500 bg-emerald-50/40 text-emerald-700",
            icon: <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
          },
          {
            name: "طحالب وفطريات",
            prob: 82,
            severity: "ضعيف",
            loc: "محيط فتحات تصريف المياه بالسقف",
            recomm: "تنظيف بيئي بضغط منخفض واستخدام مضادات فطريات غير مسببة للتآكل.",
            photo: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
            color: "border-emerald-500 bg-emerald-50/40 text-emerald-700",
            icon: <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
          },
          {
            name: "تشوه هيكلي",
            prob: 58,
            severity: "متوسط",
            loc: "منطقة انحدار الصرف المركزية",
            recomm: "تصحيح ميل الانحدار باستخدام خرسانة خفيفة من الفلين الجزائري.",
            photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Compass className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "هبوط",
            prob: 52,
            severity: "حرج",
            loc: "منطقة تجمع مياه الأمطار",
            recomm: "تدعيم البلاطة خرسانياً وتسوية السطح باستخدام عازل فلين متين.",
            photo: "https://images.unsplash.com/photo-1516216628859-9bccecad13ca?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "تدهور الخرسانة",
            prob: 85,
            severity: "حرج",
            loc: "حواف البلاطات والأسوار الجانبية",
            recomm: "إزالة الأجزاء الهشة، حماية الفولاذ، وتغطية السطح بملاط طارد للرطوبة.",
            photo: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "خلل العزل المائي",
            prob: 97,
            severity: "حرج",
            loc: "مصافي تصريف الأمطار الزاوية",
            recomm: "إزالة الرمال (مخلفات ريح الشهيلي)، تنظيف القنوات واستبدال المصافي التالفة.",
            photo: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "تقادم الزمن",
            prob: 99,
            severity: "متوسط",
            loc: "المساحة الإجمالية لغطاء السطح",
            recomm: "تطبيق طلاء تبريد السقف (Cool Roof) عالي الانعكاس ومقاوم للأشعة فوق البنفسجية.",
            photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <RotateCw className="w-4.5 h-4.5 text-amber-500" />
          }
        ];
      case "en":
        return [
          {
            name: "Cracks",
            prob: 94,
            severity: "Critical",
            loc: "North-East Parapet Area",
            recomm: "Hydrophobic expansive polyurethane resin injection or natural hydraulic lime grout.",
            photo: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Humidity",
            prob: 88,
            severity: "Medium",
            loc: "Concrete slab underside",
            recomm: "Application of natural breathable lime coating and active ventilation.",
            photo: "https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Droplet className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "Infiltration",
            prob: 91,
            severity: "Critical",
            loc: "Rainwater drain pipe connections",
            recomm: "Installation of heat-welded SBS double-layer waterproofing membrane.",
            photo: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Peeling / Blistering",
            prob: 79,
            severity: "Medium",
            loc: "Western perimeter flashing",
            recomm: "Local repair of perimeter joints, flashings, and edge sealing bands.",
            photo: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Layers className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "Corrosion",
            prob: 76,
            severity: "Medium",
            loc: "Exposed steel rebars",
            recomm: "Mechanical wire brushing, anti-rust passivating primer application, and repair mortar.",
            photo: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Wrench className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "Oxidation",
            prob: 64,
            severity: "Low",
            loc: "AC metallic support structures",
            recomm: "Sanding, zinc-rich primer application, and weatherproof protective topcoat.",
            photo: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
            color: "border-emerald-500 bg-emerald-50/40 text-emerald-700",
            icon: <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
          },
          {
            name: "Moss & Lichen",
            prob: 82,
            severity: "Low",
            loc: "Roof drain perimeters",
            recomm: "Eco-friendly low-pressure cleaning and non-corrosive biocide treatment.",
            photo: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
            color: "border-emerald-500 bg-emerald-50/40 text-emerald-700",
            icon: <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
          },
          {
            name: "Deformation",
            prob: 58,
            severity: "Medium",
            loc: "Central drainage slope",
            recomm: "Correction of drainage slope using lightweight Algerian expanded cork concrete.",
            photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Compass className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "Sagging / Ponding",
            prob: 52,
            severity: "Critical",
            loc: "Rainwater disposal zone",
            recomm: "Slab structural reinforcement and leveling with robust cork insulation.",
            photo: "https://images.unsplash.com/photo-1516216628859-9bccecad13ca?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Concrete Degradation",
            prob: 85,
            severity: "Critical",
            loc: "Slab edge and peripheral parapets",
            recomm: "Chipping away loose parts, rebar passivation, and reprofiling with waterproof mortar.",
            photo: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Waterproofing Defect",
            prob: 97,
            severity: "Critical",
            loc: "Corner rainwater drains and strainers",
            recomm: "Desanding (Sirocco dust), clearing blocks, and replacing drainage strainers.",
            photo: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Weathering",
            prob: 99,
            severity: "Medium",
            loc: "Overall roof coating surface",
            recomm: "Application of a highly reflective UV-protective Cool Roof coating.",
            photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <RotateCw className="w-4.5 h-4.5 text-amber-500" />
          }
        ];
      default:
        return [
          {
            name: "Fissures",
            prob: 94,
            severity: "Critique",
            loc: "Zone Acrotère Nord-Est",
            recomm: "Injection de résine hydrophobe expansive.",
            photo: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Humidité",
            prob: 88,
            severity: "Moyenne",
            loc: "Sous-face de la dalle béton",
            recomm: "Application d'un enduit respirant à la chaux naturelle.",
            photo: "https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Droplet className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "Infiltration",
            prob: 91,
            severity: "Critique",
            loc: "Raccordements des conduits",
            recomm: "Pose de membrane bicouche SBS soudée au chalumeau.",
            photo: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Décollement",
            prob: 79,
            severity: "Moyenne",
            loc: "Relevé périphérique ouest",
            recomm: "Réfection locale des joints de rives et solins.",
            photo: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Layers className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "Corrosion",
            prob: 76,
            severity: "Moyenne",
            loc: "Armatures en acier apparentes",
            recomm: "Brossage métallique et application de primaire passivant.",
            photo: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Wrench className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "Oxydation",
            prob: 64,
            severity: "Faible",
            loc: "Supports de climatisation",
            recomm: "Traitement antirouille et remplacement des vis galvanisées.",
            photo: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
            color: "border-emerald-500 bg-emerald-50/40 text-emerald-700",
            icon: <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
          },
          {
            name: "Mousse",
            prob: 82,
            severity: "Faible",
            loc: "Périphérie des évacuations",
            recomm: "Traitement fongicide écologique et nettoyage à basse pression.",
            photo: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
            color: "border-emerald-500 bg-emerald-50/40 text-emerald-700",
            icon: <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
          },
          {
            name: "Déformation",
            prob: 58,
            severity: "Moyenne",
            loc: "Pente d'écoulement centrale",
            recomm: "Surveillance semestrielle et correction de forme de pente.",
            photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <Compass className="w-4.5 h-4.5 text-amber-500" />
          },
          {
            name: "Affaissement",
            prob: 52,
            severity: "Critique",
            loc: "Zone d'évacuation des pluies",
            recomm: "Reprise structurelle au béton de liège expansé léger.",
            photo: "https://images.unsplash.com/photo-1516216628859-9bccecad13ca?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Dégradation béton",
            prob: 85,
            severity: "Critique",
            loc: "Nez de dalle et acrotères",
            recomm: "Reconstitution structurée au mortier fibré hydrofuge.",
            photo: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Défaut d'étanchéité",
            prob: 97,
            severity: "Critique",
            loc: "Crapaudines pluviales d'angle",
            recomm: "Nettoyage des sables du Sirocco et remplacement de crapaudine.",
            photo: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
            color: "border-red-500 bg-red-50/40 text-red-700",
            icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          },
          {
            name: "Vieillissement",
            prob: 99,
            severity: "Moyenne",
            loc: "Surface globale de toiture",
            recomm: "Peinture Cool Roof blanche à haut albédo protectrice anti-UV.",
            photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
            color: "border-amber-500 bg-amber-50/40 text-amber-700",
            icon: <RotateCw className="w-4.5 h-4.5 text-amber-500" />
          }
        ];
    }
  })();

  // Ministry Budget Simulation Formula
  const securedSchools = Math.round((ministryBudget / 50) * 28);
  const securedAdmins = Math.round((ministryBudget / 50) * 14);
  const securedHospitals = Math.round((ministryBudget / 50) * 5);

  const simTranslations = {
    fr: {
      title: "Simulation Financière d’Impact (Ministère)",
      desc: "Ajustez l'enveloppe budgétaire globale (de 10 M DA à 200 M DA) pour observer l'impact direct et fluide sur la sécurisation du patrimoine bâti public.",
      budgetLabel: "Enveloppe budgétaire :",
      impactLabel: "Ajustement de précision :",
      sentence: `Pour un budget sélectionné de ${ministryBudget} M DA, l’algorithme calcule exactement que ${securedSchools} écoles, ${securedAdmins} administrations et ${securedHospitals} hôpitaux seront entièrement sécurisés et étanchéifiés (les ratios s’adaptent de manière fluide et proportionnelle pour les autres budgets).`,
      schools: "Écoles",
      admins: "Administrations",
      hospitals: "Hôpitaux"
    },
    ar: {
      title: "محاكاة الأثر المالي (الوزارة)",
      desc: "اضبط الميزانية الإجمالية المخصصة (من 10 مليون دج إلى 200 مليون دج) لملاحظة الأثر المباشر والسلس على تأمين المباني.",
      budgetLabel: "غلاف الميزانية:",
      impactLabel: "ضبط الدقة المالي:",
      sentence: `لميزانية مختارة قدرها ${ministryBudget} مليون دج، يحتسب الخوارزمي بدقة أنه سيتم تأمين وعزل ${securedSchools} مدرسة، ${securedAdmins} مبنى إداري و ${securedHospitals} مستشفى بالكامل (تتكيف النسب بسلاسة وتناسب مع الميزانيات الأخرى).`,
      schools: "مدارس",
      admins: "إدارات",
      hospitals: "مستشفيات"
    },
    en: {
      title: "Ministry Financial Impact Simulator",
      desc: "Vary the global budget allocation (from 10 M DA to 200 M DA) to observe the direct, fluid impact on securing public infrastructure.",
      budgetLabel: "Budget Envelope:",
      impactLabel: "Precision Alignment:",
      sentence: `For a selected budget of ${ministryBudget} M DA, the algorithm calculates exactly that ${securedSchools} schools, ${securedAdmins} administrations, and ${securedHospitals} hospitals will be fully secured and weatherproofed (ratios adapt fluidly and proportionally for other budgets).`,
      schools: "Schools",
      admins: "Administrations",
      hospitals: "Hospitals"
    }
  };

  const simT = simTranslations[language] || simTranslations["fr"];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto h-screen w-full font-sans relative text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#030712]">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Scanner d'Infrastructures Publics</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-light">
            Capturez, modélisez et diagnostiquez instantanément la structure des toitures-terrasses par IA cognitive.
          </p>
        </div>
      </div>

      {scanning ? (
        /* SCANNING PROGRESS STATE */
        <div className="bento-card p-12 text-center shadow-xl space-y-8 max-w-2xl mx-auto flex flex-col items-center justify-center relative overflow-hidden dark:bg-[#070b19] dark:border-slate-800">
          <div className="relative flex items-center justify-center w-32 h-32 mb-2">
            <div className="absolute inset-0 bg-sky-500/5 rounded-full border border-sky-500/10 animate-ping" />
            <div className="absolute inset-4 bg-sky-500/10 rounded-full border border-sky-500/20 animate-pulse" />
            <div className="relative p-6 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-inner">
              <Camera className="w-12 h-12 text-sky-600 animate-pulse" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white font-sans">Analyse Multidimensionnelle en Cours</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto font-light leading-relaxed">
              Veuillez patienter pendant que les algorithmes BatiSmart segmentent le nuage de points et estiment la gravité structurelle...
            </p>
          </div>

          <div className="w-full max-w-md space-y-3 pt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-semibold">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-500" />
              <span>{scanSteps[scanStep]}</span>
            </div>
          </div>

          <div className="w-full max-w-md bg-slate-900 border-2 border-emerald-500/30 rounded-xl p-5 text-left font-mono text-xs md:text-sm text-emerald-400 shadow-2xl shadow-emerald-500/10 space-y-2 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between border-b border-emerald-900/30 pb-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Console d'Inspection Temps Réel
              </span>
              <span className="text-[9px] text-emerald-500 font-bold font-mono">BatiSmart OS v3.5</span>
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 select-none">&gt;</span>
                <span>MODE_ACQUISITION : <strong className="text-emerald-200 font-extrabold">{acquisitionMode.toUpperCase()}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 select-none">&gt;</span>
                <span>COORDONNÉES_GPS_CIBLE : <strong className="text-emerald-200 font-extrabold">[{latitude.toFixed(6)}, {longitude.toFixed(6)}]</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 select-none">&gt;</span>
                <span className="animate-pulse text-emerald-300">SEGMENTATION_MATRICE_THERMIQUE : EN COURS...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 select-none">&gt;</span>
                <span>CONNEXION_COGNITIVE_CORE : <strong className="text-emerald-200 font-extrabold">ACTIVE (100%)</strong></span>
              </div>
              <div className="flex items-center gap-2 border-t border-emerald-900/20 pt-2 mt-1">
                <span className="text-sky-400 select-none animate-pulse">&gt;&gt;&gt;</span>
                <span className="text-sky-300 animate-pulse font-bold tracking-wide uppercase text-[10px] md:text-xs">
                  {scanSteps[scanStep]}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : scanResult ? (
        /* IMMEDIATE AI REPORT VIEW */
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-sky-50 dark:bg-[#070b19] border border-sky-100 dark:border-sky-900/40 p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-500 text-white rounded-2xl">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rapport de Prédiagnostic et Critères de Diagnostic IA Généré</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Le prédiagnostic de l'édifice public "{scanResult.buildingName}" a été calculé avec succès et enregistré automatiquement dans l'historique.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="flex-1 md:flex-none py-2 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Télécharger PDF / Partager
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/report/${scanResult.id}`);
                  showToast("Lien de pré-diagnostic copié avec succès !");
                }}
                className="flex-1 md:flex-none py-2 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-500" /> Partager
              </button>
              <button
                onClick={() => {
                  setIsPdfModalOpen(true);
                  showToast("Ouverture de l'assistant d'export & d'impression...");
                }}
                className="flex-1 md:flex-none py-2 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-500" /> Imprimer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Diagnostics Summary and Financial Simulator */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Summary card */}
              <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">Résultats du prédiagnostic assisté par IA</h4>
                
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50 dark:border-slate-850">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Score de Risque IA</span>
                    <span className={`text-sm font-extrabold ${scanResult.riskScore >= 7 ? "text-red-600" : "text-amber-500"}`}>{scanResult.riskScore} / 10</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">Prédiagnostic Global assisté par IA</span>
                    <div className="p-3 bg-sky-50/40 dark:bg-sky-950/25 border border-sky-100/60 dark:border-sky-900/20 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {scanResult.summary}
                    </div>
                  </div>

                  {/* Recommendations list */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommandations de l'IA</span>
                    {(() => {
                      const est = getBudgetEstimation(scanResult);
                      const urgency = scanResult.riskScore >= 8 
                        ? "Urgence absolue (immédiate)" 
                        : scanResult.riskScore >= 6 
                        ? "Intervention sous 30 jours (Élevée)" 
                        : scanResult.riskScore >= 3 
                        ? "Maintenance préventive sous 90 jours (Moyenne)" 
                        : "Entretien régulier et suivi périodique";
                      
                      const levelColor = scanResult.riskScore >= 8 
                        ? "text-red-600 font-extrabold" 
                        : scanResult.riskScore >= 6 
                        ? "text-rose-500 font-semibold" 
                        : scanResult.riskScore >= 3 
                        ? "text-amber-500 font-semibold" 
                        : "text-emerald-500 font-semibold";
                        
                      const levelName = scanResult.riskScore >= 8 
                        ? "Critique / Structurel" 
                        : scanResult.riskScore >= 6 
                        ? "Élevé" 
                        : scanResult.riskScore >= 3 
                        ? "Moyen" 
                        : "Faible";

                      const probableCause = scanResult.riskScore >= 6 
                        ? "Chocs thermiques, vieillissement des matériaux & infiltration prolongée d'eaux pluviales." 
                        : "Vieillissement superficiel normal de la membrane protectrice sous le soleil saharien.";

                      return (
                        <div className="space-y-2">
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">Prédiagnostic global :</span>
                            <span className="text-slate-600 dark:text-slate-400">{scanResult.summary}</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">Niveau de risque :</span>
                            <span className={levelColor}>{levelName}</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">Cause probable estimée :</span>
                            <span className="text-slate-600 dark:text-slate-400">{probableCause}</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">Urgence de l'intervention :</span>
                            <span className="text-amber-600 dark:text-amber-400 font-medium">{urgency}</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">Budget prévisionnel :</span>
                            <span className="text-sky-600 dark:text-sky-450 font-bold">
                              De {formatDA(est.minAmount)} à {formatDA(est.maxAmount)}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Scientific Mention */}
                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-light">
                    <p className="font-bold text-teal-600 dark:text-teal-400 mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Mention scientifique
                    </p>
                    Les résultats présentés correspondent à un prédiagnostic assisté par Intelligence Artificielle basé sur l'analyse d'images. Ils constituent une aide à la décision et doivent être validés par un architecte, un ingénieur ou un expert qualifié.
                  </div>
                </div>
              </div>

              {/* Estimation prévisionnelle des coûts d'intervention */}
              {(() => {
                const est = getBudgetEstimation(scanResult);
                return (
                  <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800 border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-emerald-500" />
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">
                        Estimation prévisionnelle des coûts d'intervention
                      </h4>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-light">
                      L'Intelligence Artificielle fournit une estimation budgétaire indicative destinée à aider les gestionnaires du patrimoine bâti dans la planification des interventions. Cette estimation constitue une aide à la décision et ne remplace pas un devis établi par un professionnel.
                    </p>

                    {/* Cost range display */}
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/20 rounded-xl text-center space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block">
                        Estimation comprise entre
                      </span>
                      <span className="text-lg font-black text-slate-800 dark:text-slate-100 block">
                        {formatDA(est.minAmount)} et {formatDA(est.maxAmount)}
                      </span>
                      
                      {/* Indice de confiance */}
                      <div className="pt-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          <span>Indice de confiance de l'estimation</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{est.confidenceText}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${est.confidenceIndex}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Parameters Box */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Paramètres utilisés pour l'estimation
                      </span>
                      <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-450 font-light">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <div>
                            <strong className="font-semibold text-slate-700 dark:text-slate-300">Niveau de risque : </strong>
                            {scanResult.riskScore}/10 ({scanResult.riskScore >= 7.5 ? "Critique" : scanResult.riskScore >= 6 ? "Élevé" : scanResult.riskScore >= 3 ? "Moyen" : "Faible"})
                          </div>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <div>
                            <strong className="font-semibold text-slate-700 dark:text-slate-300">Pathologies détectées : </strong>
                            {est.detectedPathologies.join(", ")}
                          </div>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <div>
                            <strong className="font-semibold text-slate-700 dark:text-slate-300">Niveau de dégradation : </strong>
                            {est.degradationLevel}
                          </div>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <div>
                            <strong className="font-semibold text-slate-700 dark:text-slate-300">Type d'intervention recommandé : </strong>
                            {est.recommendedIntervention}
                          </div>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <div>
                            <strong className="font-semibold text-slate-700 dark:text-slate-300">Coûts moyens de référence : </strong>
                            {est.referenceCosts}
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Analyse budgétaire section */}
                    <div className="p-4 bg-sky-50/30 dark:bg-sky-950/10 border border-sky-100/50 dark:border-sky-900/20 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest block">
                        Analyse budgétaire
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-light">
                        Cette estimation permet :
                      </p>
                      <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400 font-light list-disc pl-4">
                        <li>d'anticiper le budget des interventions ;</li>
                        <li>de comparer plusieurs bâtiments ;</li>
                        <li>de hiérarchiser les priorités ;</li>
                        <li>d'aider les collectivités territoriales à programmer les travaux.</li>
                      </ul>
                    </div>

                    {/* Mention importante */}
                    <div className="pt-2 text-[9px] text-slate-400 dark:text-slate-500 leading-normal font-light border-t border-slate-100 dark:border-slate-850">
                      Les montants affichés correspondent à une estimation budgétaire indicative calculée automatiquement à partir des résultats du prédiagnostic assisté par Intelligence Artificielle et de coûts moyens de référence. Ils ne constituent ni un devis contractuel ni une estimation définitive et doivent être validés par une étude technique réalisée par un professionnel qualifié.
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Right Column: 12 Pathologies grid */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold font-display text-slate-900 dark:text-white uppercase tracking-wider">
                      {language === "ar" ? "الكشف التلقائي الذكي" : language === "en" ? "Intelligent Automated Detection" : "Détection Automatique Inteligente"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
                      {language === "ar" 
                        ? "تحليل وفحص تلقائي للأمراض الهيكلية والعيوب الـ 12 الأكثر خطورة." 
                        : language === "en" 
                          ? "Comprehensive synthesis and automated inspection of the 12 critical roof pathologies." 
                          : "Synthèse et inspection automatique des 12 pathologies critiques de toiture."}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded-md font-bold self-start md:self-center">
                    {language === "ar" ? "12 خللاً هيكلياً" : language === "en" ? "12 PATHOLOGIES" : "12 PATHOLOGIES"}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 italic font-light">
                  💡 {language === "ar" 
                    ? "اضغط على أي بطاقة لعرض التفاصيل الكاملة، وتوصيات BatiSmart، والصور والعيوب بدقة عالية." 
                    : language === "en" 
                      ? "Click on any card to explore full details, BatiSmart recommendations, and high-resolution defect images." 
                      : "Cliquez sur une carte pour voir les détails, les recommandations BatiSmart et la photo en haute résolution."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {detectedPathologies.map((p, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedPathology(p)}
                      className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 hover:border-sky-500/70 hover:shadow-md cursor-pointer transition duration-300 transform hover:-translate-y-0.5"
                    >
                      {/* Image Thumbnail with zoom effect */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
                        <img 
                          src={p.photo} 
                          alt={p.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transform hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                          <span className="text-[8px] text-white font-bold bg-black/60 px-1 py-0.5 rounded">Zoom</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                            <span className="inline-block shrink-0">{p.icon}</span>
                            <span className="truncate">{p.name}</span>
                          </span>
                          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono font-bold">{p.prob}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8.5px] font-bold uppercase tracking-wider px-1.5 rounded ${
                            p.severity === "Critique" || p.severity === "حرج" || p.severity === "Critical"
                              ? "bg-red-50 text-red-600 dark:bg-red-950/40" 
                              : p.severity === "Moyenne" || p.severity === "متوسط" || p.severity === "Medium"
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40"
                                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
                          }`}>
                            {p.severity}
                          </span>
                          <span className="text-[9px] text-slate-400 truncate max-w-[120px] font-light">{p.loc}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-light leading-snug pt-0.5">
                          <span className="font-semibold text-[9.5px] text-slate-600 dark:text-slate-300">
                            {language === "ar" ? "توصية : " : language === "en" ? "Ref: " : "Réf : "}
                          </span>
                          <span className="line-clamp-1">{p.recomm}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final step action */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Enregistré automatiquement dans l'historique !</span>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setScanResult(null);
                        setBuildingName("");
                        setUploadedImage(null);
                        setSelectedSample("");
                      }}
                      className="py-2.5 px-5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      Fermer le Rapport
                    </button>
                    <button
                      onClick={handleSaveResultToHistory}
                      className="py-2.5 px-5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-md transition cursor-pointer"
                    >
                      Voir dans l'Historique
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : false ? (
        /* LOCK SCREEN FOR NON-TECHNICAL CONSULTATIVE ROLES */
        <div className="max-w-2xl mx-auto bento-card p-8 text-center space-y-6 mt-12 shadow-xl dark:bg-[#070b19] dark:border-slate-800 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse">
            <Lock className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Espace Prédiagnostic & Analyse Toiture</h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
              Mode Consultation Active (Habilitation : {user.role})
            </p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light max-w-lg mx-auto">
            Votre profil d'accès est configuré avec des privilèges de **Consultation et Prise de Décision**. Les fonctions d'analyse par Intelligence Artificielle en temps réel et d'acquisition sur site sont réservées aux Experts-Diagnostiqueurs agréés et aux agents de terrain.
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-850/80 text-left space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Privilèges autorisés pour votre profil :</h4>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-light">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Consultation de la carte SIG interactive des 69 wilayas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Téléchargement des rapports techniques PDF professionnels
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Interaction complète avec l'Assistant Conversationnel BatiSmart Roof IA
              </li>
              {user.role === "Collectivité locale (APC / Wilaya / Ministère)" && (
                <li className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="text-emerald-500 font-bold">✓</span> Accès illimité au simulateur financier ministériel
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab("history")}
                className="w-full sm:w-auto py-2.5 px-6 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition cursor-pointer"
              >
                Consulter l'Historique des Prédiagnostics
              </button>
            )}
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab("map")}
                className="w-full sm:w-auto py-2.5 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-250 dark:border-slate-800 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-sky-500" />
                <span>Ouvrir la Carte SIG (69 Wilayas)</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* NORMAL ACQUISITION & ASSISTANT VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in duration-300">
          
          {/* Left Columns: Inputs, Location and Assistant */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Main Metadata Form */}
            <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800">
              <h3 className="text-sm font-semibold font-display text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-1.5">
                <Compass className="w-4.5 h-4.5 text-sky-500" />
                Identité du Bâtiment Public
              </h3>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-light">
                  {error}
                </div>
              )}

              {/* Building name */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-medium mb-1.5">Nom Officiel de l'Édifice</label>
                <input
                  type="text"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  placeholder="ex: École Primaire Ibn Badis"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all duration-300"
                  required
                />
              </div>

              {/* Two columns: Type & Wilaya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-medium mb-1.5">Type de Structure</label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value as Inspection["buildingType"])}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-sm text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition duration-300 cursor-pointer"
                  >
                    <option value="Administratif">Administratif</option>
                    <option value="Scolaire/Universitaire">Scolaire / Universitaire</option>
                    <option value="Judiciaire">Judiciaire</option>
                    <option value="Santé">Santé</option>
                    <option value="Culturel/Autre">Culturel / Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-medium mb-1.5">Wilaya d'Implantation</label>
                  <select
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-sm text-slate-850 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition duration-300 cursor-pointer"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                    <option value="Autre (Saisir manuellement)">Autre (Saisir manuellement)</option>
                  </select>
                </div>
              </div>

              {/* Conditional manual city name */}
              {city === "Autre (Saisir manuellement)" && (
                <div className="animate-fade-in">
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-medium mb-1.5">Saisir le nom de la Wilaya / Ville</label>
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="ex: Tipaza (42)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all duration-300"
                    required
                  />
                </div>
              )}

              {/* Address */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-medium mb-1.5">Adresse Physique Complète</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ex: Rue Khemisti, près du Siège de la Wilaya"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all duration-300"
                />
              </div>

              {/* Coordinates panel with GPS status info */}
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    Géolocalisation GPS du Bâtiment
                  </span>
                  <button
                    type="button"
                    onClick={handleAcquireGPS}
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-500 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${gpsStatus === "acquiring" ? "animate-spin" : ""}`} />
                    {gpsStatus === "acquiring" ? "Détection..." : "Détecter ma position"}
                  </button>
                </div>

                {gpsStatus !== "idle" && (
                  <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                    gpsStatus === "success" 
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 animate-fade-in" 
                      : gpsStatus === "acquiring"
                        ? "bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 text-sky-700 dark:text-sky-400 animate-pulse"
                        : "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 animate-fade-in"
                  }`}>
                    {gpsMessage}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-450 uppercase tracking-wider font-semibold mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-450 uppercase tracking-wider font-semibold mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Field notes */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-medium mb-1.5">Notes de Terrain (Facultatif)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Signalez tout signe visible de infiltration d'eau, mousse, stagnation pluviale ou usure thermique..."
                  rows={2}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all duration-300 resize-none"
                />
              </div>
            </div>

            {/* Specialized Conversational BatiSmart AI assistant */}
            <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800 border-l-4 border-l-sky-500">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <MessageSquare className="w-5 h-5 text-sky-500 animate-pulse" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">Assistant BatiSmart Roof IA</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-light">Spécialiste de la restauration et protection du patrimoine bâti algérien</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal font-light">
                Décrivez verbalement une pathologie ou une anomalie constatée sur un bâtiment pour obtenir un avis technique immédiat :
              </p>

              {/* Text Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={assistantQuery}
                  onChange={(e) => setAssistantQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAssistantQuery(assistantQuery)}
                  placeholder="ex: Ce bâtiment présente une fissure verticale."
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => handleAssistantQuery(assistantQuery)}
                  disabled={assistantLoading}
                  className="bg-sky-600 hover:bg-sky-500 text-white rounded-xl px-4 py-2 transition text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  {assistantLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Consulter
                </button>
              </div>

              {/* Pre-suggested quick queries */}
              <div className="flex flex-wrap gap-2 pt-1.5">
                {[
                  "Ce bâtiment présente une fissure verticale.",
                  "Infiltration d'eau active au bloc de cardiologie.",
                  "Présence d'humidité persistante et mousse verte."
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAssistantQuery(q);
                      handleAssistantQuery(q);
                    }}
                    className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 px-2.5 py-1.5 rounded-lg border border-slate-200/65 dark:border-slate-800/80 transition cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat-GPT styled custom result screen */}
              {assistantResult && (
                <div className="p-4 bg-slate-100/60 dark:bg-slate-950/40 rounded-xl border border-slate-250 dark:border-slate-850/80 space-y-3.5 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/20 py-1.5 px-3 rounded-lg border border-sky-100 dark:border-sky-900/30">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Réponse de l'Assistant Expert BatiSmart Roof IA :</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block">🔍 Causes probables</span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">{assistantResult.causes}</p>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block">⚠️ Niveau de gravité</span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">{assistantResult.severity}</p>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block">🛠 Intervention recommandée</span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">{assistantResult.recomm}</p>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block">🪙 Coût estimatif</span>
                      <p className="text-sky-600 dark:text-sky-450 font-bold font-mono">{assistantResult.cost}</p>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block">🚀 Priorité</span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">{assistantResult.priority}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Columns: Photo Capture Mode & Samples */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Visual acquisition and mode selections */}
            <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800">
              <h3 className="text-sm font-semibold font-display text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center justify-between">
                <span>Modes de Capture</span>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold px-2.5 py-0.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/40 rounded-full">Intégré</span>
              </h3>

               {/* Grid of the 5 requested modes buttons */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 pb-1">
                {[
                  { id: "camera", label: "Caméra", icon: <Camera className="w-4 h-4" />, desc: "Photo mobile", isFuture: false },
                  { id: "gallery", label: "Galerie", icon: <Upload className="w-4 h-4" />, desc: "Fichier local", isFuture: false },
                  { id: "drone", label: "Drone", icon: <Compass className="w-4 h-4" />, desc: "Cliché aérien", isFuture: true },
                  { id: "thermal", label: "Caméra thermique", icon: <Flame className="w-4 h-4" />, desc: "Infrarouge", isFuture: true },
                  { id: "3d_scan", label: "Scan 3D", icon: <Box className="w-4 h-4" />, desc: "Nuage points", isFuture: true }
                ].filter((mode) => {
                  if (user && user.role === "Opérateur drone / Agent de terrain") {
                    return mode.id === "drone" || mode.id === "camera";
                  }
                  return true;
                }).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleModeSelection(mode.id as any, mode.label, mode.isFuture)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition cursor-pointer relative ${
                      acquisitionMode === mode.id
                        ? "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 font-bold"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-50"
                    }`}
                  >
                    {mode.isFuture && (
                      <span className="absolute -top-2.5 right-0 left-0 text-[6.5px] font-bold px-1 py-0.5 bg-amber-500 text-[#070b19] rounded-lg uppercase tracking-tight shadow-md animate-pulse text-center w-max mx-auto block z-10">
                        🚧 En développement
                      </span>
                    )}
                    <div className="mt-1.5">{mode.icon}</div>
                    <span className="text-[10px] font-semibold mt-1 block leading-none">{mode.label}</span>
                    <span className="text-[7.5px] opacity-70 block mt-0.5 leading-none font-light truncate max-w-[50px]">{mode.desc}</span>
                  </button>
                ))}
              </div>

              {/* Mode Specific Upload Container */}
              <div className="space-y-3">
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative rounded-xl border border-dashed min-h-[320px] flex flex-col items-center justify-center text-center overflow-hidden group transition-all duration-300 ${
                    isDragging 
                      ? "border-sky-500 bg-sky-500/10 scale-[1.01] ring-4 ring-sky-500/20" 
                      : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/45"
                  }`}
                >
                  
                  {/* Shutter flash overlay effect */}
                  {isShutterFlashing && (
                    <div className="absolute inset-0 bg-white z-40 animate-pulse" />
                  )}

                  {acquisitionMode === "camera" && cameraActive && cameraReady ? (
                    /* LIVE CAMERA STREAM VIEW */
                    <div className="absolute inset-0 w-full h-full bg-black flex flex-col items-center justify-between">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      {/* High-tech overlay sight reticle */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-white/25 rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 border border-white/40 rounded-full" />
                        </div>
                        {/* Corner markers */}
                        <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-sky-400/80" />
                        <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-sky-400/80" />
                        <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-sky-400/80" />
                        <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-sky-400/80" />
                      </div>

                      {/* Top status tag */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-mono font-bold flex items-center gap-1.5 z-10 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span>FLUX LIVE : CAMÉRA {facingMode === "environment" ? "ARRIÈRE" : "FRONTALE"}</span>
                      </div>

                      {/* Controls toolbar overlay at the bottom */}
                      <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-2 z-10">
                        {/* Switch camera mode */}
                        <button
                          type="button"
                          onClick={toggleCameraFacing}
                          className="bg-black/60 backdrop-blur-md text-white p-2.5 rounded-xl transition cursor-pointer border border-white/10"
                          title="Pivoter l'appareil photo"
                        >
                          <SwitchCamera className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={openNativeCameraPicker}
                          className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-[10px] font-bold py-2 px-3 rounded-full shadow-md transition flex items-center gap-1.5 border border-emerald-400/50"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Appareil photo mobile</span>
                        </button>

                        {/* Capture button */}
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs py-2.5 px-5 rounded-full shadow-lg transition flex items-center gap-1.5 border border-sky-400 cursor-pointer animate-pulse"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Prendre la photo</span>
                        </button>

                        {/* Stop stream */}
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="bg-black/60 backdrop-blur-md text-white p-2.5 rounded-xl transition cursor-pointer border border-white/10"
                          title="Désactiver le flux vidéo"
                        >
                          <CameraOff className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : uploadedImage ? (
                    /* SHOW SELECTED IMAGE PREVIEW */
                    <>
                      <img
                        src={uploadedImage}
                        alt="Toiture à diagnostiquer"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover rounded-xl group-hover:scale-[1.02] transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-60 rounded-xl" />
                      
                      {/* Interactive visual button to go back to camera live if camera mode is active */}
                      {acquisitionMode === "camera" && (
                        <div className="absolute bottom-4 left-4 z-10">
                          <button
                            type="button"
                            onClick={() => startCamera(facingMode)}
                            className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg shadow-md transition flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Réactiver l'Appareil Photo</span>
                          </button>
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedImage(null);
                            setUploadedImages([]);
                            setSelectedSample("");
                          }}
                          className="bg-red-600 hover:bg-red-500 text-white py-1 px-2.5 rounded-lg text-[10px] font-bold shadow-lg transition cursor-pointer"
                        >
                          Effacer tout ({uploadedImages.length})
                        </button>
                      </div>
                    </>
                  ) : (
                    /* EMPTY DROPZONE WITH FILE INPUT FALLBACK */
                    <>
                      {acquisitionMode === "camera" && (cameraError || !cameraReady) ? (
                        <div className="p-6 space-y-4 max-w-md text-center">
                          <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto text-amber-500">
                            <AlertCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">
                              Caméra non disponible pour le moment
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              Autorisez l’accès à la caméra dans votre navigateur, puis relancez la prise de photo.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => startCamera(facingMode)}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Camera className="w-4 h-4 shrink-0" />
                            <span>Réessayer l’appareil photo</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-9 h-9 text-slate-400 mb-2 group-hover:text-sky-500 transition" />
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold block">
                            {acquisitionMode === "camera" && "Prendre une photo directement"}
                            {acquisitionMode === "gallery" && "Sélectionner ou glisser la photo"}
                            {acquisitionMode === "drone" && "Sélectionner un cliché par Drone"}
                            {acquisitionMode === "thermal" && "Sélectionner un pré-diagnostic Thermographique"}
                            {acquisitionMode === "3d_scan" && "Charger un nuage photogrammétrique 3D"}
                          </span>
                          <span className="text-[9.5px] text-slate-400 dark:text-slate-500 block mt-1 font-light">Photo directe • Pas de sélection de fichiers</span>
                          
                          {acquisitionMode === "camera" ? (
                            <div className="mt-4 flex flex-col items-center justify-center gap-3 w-full max-w-sm px-4 z-10">
                              <button
                                type="button"
                                onClick={openNativeCameraPicker}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 transition flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Camera className="w-4 h-4 shrink-0 animate-bounce" />
                                <span>Prendre une photo</span>
                              </button>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                                Sur mobile, l’appareil photo natif s’ouvre directement.
                              </p>
                            </div>
                          ) : (
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                <input
                  ref={nativeCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture={facingMode === "user" ? "user" : "environment"}
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Multi-image thumbnail gallery */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-1.5 animate-fade-in text-left">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider block">
                      Photos de l'inspection ({uploadedImages.length} / 5) :
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {uploadedImages.map((img, index) => (
                        <div 
                          key={index} 
                          className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer group/thumb ${
                            uploadedImage === img 
                              ? "border-sky-500 ring-2 ring-sky-500/30" 
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                          }`}
                          onClick={() => setUploadedImage(img)}
                        >
                          <img 
                            src={img} 
                            alt={`Miniature ${index + 1}`} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = uploadedImages.filter((_, idx) => idx !== index);
                              setUploadedImages(updated);
                              if (uploadedImage === img) {
                                setUploadedImage(updated.length > 0 ? updated[0] : null);
                              }
                            }}
                            className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-red-600 text-white p-0.5 rounded-full opacity-0 group-hover/thumb:opacity-100 transition duration-200 cursor-pointer"
                            title="Supprimer cette photo"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 font-semibold">
                            #{index + 1}
                          </div>
                        </div>
                      ))}
                      
                      {uploadedImages.length < 5 && (
                        <div className="relative aspect-square rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 flex flex-col items-center justify-center cursor-pointer transition">
                          <Plus className="w-4 h-4 text-slate-400" />
                          <span className="text-[8px] text-slate-400 font-semibold mt-0.5">Ajouter</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageChange(e, true)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Start Diagnosis Button */}
              <button
                type="button"
                onClick={handleStartAnalysis}
                className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold text-xs py-3 px-4 rounded-xl transition shadow-lg shadow-sky-500/15 flex items-center justify-center gap-2 border border-sky-400/20 cursor-pointer duration-300"
              >
                <Sparkles className="w-4 h-4 animate-pulse text-sky-200" />
                Lancer le Prédiagnostic Assisté par IA
              </button>

            </div>

            {/* Test model samples list */}
            <div className="bento-card p-5 space-y-3 dark:bg-[#070b19] dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                Ou utilisez un modèle de test pré-rempli :
              </span>
              
              <div className="space-y-2">
                {SAMPLE_ROOFS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                      selectedSample === sample.id
                        ? "bg-sky-50 dark:bg-sky-950/40 border-sky-500 dark:border-sky-600 text-sky-800 dark:text-sky-300"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-750"
                    }`}
                  >
                    <Layers className={`w-4 h-4 shrink-0 ${selectedSample === sample.id ? "text-sky-500" : "text-slate-400 dark:text-slate-500"}`} />
                    <div className="overflow-hidden">
                       <span className="text-[11px] font-semibold block leading-none">{sample.label}</span>
                       <span className="text-[9px] text-slate-400 dark:text-slate-500 block truncate mt-1 font-light">{sample.buildingName}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Floating Toast Notification */}
      {toastText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold">{toastText}</span>
        </div>
      )}

      {/* Interactive Pathology Detail Modal with photo and recommendations */}
      {selectedPathology && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-250">
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-250 text-slate-700 dark:text-slate-300"
            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
          >
            {/* High-Resolution Header Image */}
            <div className="relative h-56 w-full bg-slate-950">
              <img 
                src={selectedPathology.photo} 
                alt={selectedPathology.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
              
              {/* Top Row Indicators */}
              <div className={`absolute top-4 ${language === "ar" ? "left-4 flex-row-reverse" : "right-4"} flex items-center gap-2`}>
                <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  {selectedPathology.prob}% {language === "ar" ? "ثقة" : language === "en" ? "Conf" : "Confiance"}
                </span>
                
                <button 
                  onClick={() => setSelectedPathology(null)}
                  className="p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-white/90 hover:text-white transition shadow-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Badge Overlay inside image */}
              <div className={`absolute bottom-4 ${language === "ar" ? "right-6" : "left-6"} right-6 space-y-1`}>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm inline-block ${
                  selectedPathology.severity === "Critique" || selectedPathology.severity === "حرج" || selectedPathology.severity === "Critical"
                    ? "bg-red-600 text-white" 
                    : selectedPathology.severity === "Moyenne" || selectedPathology.severity === "متوسط" || selectedPathology.severity === "Medium"
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-600 text-white"
                }`}>
                  {selectedPathology.severity}
                </span>
                <h3 className="text-lg font-extrabold text-white font-display drop-shadow-md">
                  {selectedPathology.name}
                </h3>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
              
              {/* Location Section */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  📍 {language === "ar" ? "الموقع الدقيق" : language === "en" ? "PRECISE LOCALIZATION" : "LOCALISATION PRÉCISE"}
                </span>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPathology.loc}
                  </span>
                </div>
              </div>

              {/* Recommendation Section */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  🛠️ {language === "ar" ? "توصيات مهندسي BatiSmart" : language === "en" ? "BATISMART RECOMMENDATION" : "RECOMMANDATION TECHNIQUE BATISMART"}
                </span>
                <div className="p-4 bg-sky-500/5 dark:bg-sky-500/10 rounded-xl border border-sky-200/50 dark:border-sky-800/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <span>{language === "ar" ? "الحل المستدام الموصى به :" : language === "en" ? "Recommended Sustainable Solution:" : "Solution Durable Recommandée :"}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedPathology.recomm}
                  </p>
                </div>
              </div>

              {/* Confidence analysis rate bar */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                  <span>{language === "ar" ? "موثوقية الكشف التلقائي" : language === "en" ? "Detection Confidence Rating" : "Fiabilité de la détection automatique"}</span>
                  <span className="font-mono font-bold text-sky-500">{selectedPathology.prob}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-600 to-sky-400 h-full rounded-full" 
                    style={{ width: `${selectedPathology.prob}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Footer with close button */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-850 flex justify-end">
              <button 
                onClick={() => setSelectedPathology(null)}
                className="py-2 px-6 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-750 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {language === "ar" ? "إغلاق" : language === "en" ? "Close" : "Fermer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Download and Share Assistant Modal */}
      {scanResult && (
        <PdfDownloadModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          inspection={scanResult}
          showToast={showToast}
        />
      )}

    </div>
  );
}
