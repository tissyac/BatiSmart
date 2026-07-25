import React, { useState, useEffect } from "react";
import { Mail, Lock, User, MapPin, Briefcase, RefreshCw, Shield, ClipboardCheck, Landmark, FileText, Hammer, Building2, Plane, Check, Sun, Moon } from "lucide-react";
import { UserProfile, UserRole } from "../types";
import Logo from "./Logo";
import { safeStorage } from "../utils/storage";

const AVAILABLE_PROFILES = [
  {
    id: "Administrateur" as const,
    label: "Administrateur",
    desc: "Gestion complète des utilisateurs, statistiques de pré-diagnostic, budgets, carte SIG & rapports",
    icon: Shield,
    color: "text-red-500 bg-red-500/10 border-red-500/25"
  },
  {
    id: "Expert / Diagnostiqueur" as const,
    label: "Expert / Diagnostiqueur",
    desc: "Création d'inspections, scanner IA, rapports PDF pro & conseils personnalisés BatiSmart Roof IA",
    icon: ClipboardCheck,
    color: "text-sky-500 bg-sky-500/10 border-sky-500/25"
  },
  {
    id: "Collectivité locale (APC / Wilaya / Ministère)" as const,
    label: "Collectivité locale (APC / Wilaya / Ministère)",
    desc: "Suivi du territoire, carte interactive SIG, simulation financière & priorisation des interventions",
    icon: Landmark,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25"
  },
  {
    id: "Bureau d'études" as const,
    label: "Bureau d'études",
    desc: "Analyses de pré-diagnostics, téléchargement de rapports, formulation d'expertises complémentaires",
    icon: FileText,
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/25"
  },
  {
    id: "Entreprise de maintenance" as const,
    label: "Entreprise de maintenance",
    desc: "Mise à jour des interventions, photos avant/après travaux & suivi de l'avancement",
    icon: Hammer,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/25"
  },
  {
    id: "Gestionnaire du patrimoine / Propriétaire ou Client" as const,
    label: "Gestionnaire du patrimoine / Propriétaire ou Client",
    desc: "Consultation de son parc de bâtiments, scores de risques, rapports PDF & historique d'alertes",
    icon: Building2,
    color: "text-teal-500 bg-teal-500/10 border-teal-500/25"
  },
  {
    id: "Opérateur drone / Agent de terrain" as const,
    label: "Opérateur drone / Agent de terrain",
    desc: "Acquisition de données par drone, capture d'images sur site, géo-localisation GPS & missions",
    icon: Plane,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/25"
  },
  {
    id: "Inspecteur" as const,
    label: "Inspecteur",
    desc: "Saisie d'inspections sur site, signalement de pathologies, relevés de terrain détaillés",
    icon: ClipboardCheck,
    color: "text-pink-500 bg-pink-500/10 border-pink-500/25"
  },
  {
    id: "Technicien" as const,
    label: "Technicien",
    desc: "Vérification technique des acrotères, entretien courant, suivi des tâches assignées",
    icon: Hammer,
    color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/25"
  }
];



interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("Expert / Diagnostiqueur");
  const [wilaya, setWilaya] = useState("Alger (16)");
  const [customWilaya, setCustomWilaya] = useState("");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Automatic recognition based on email keywords
  useEffect(() => {
    if (!email) return;
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes("admin")) {
      setRole("Administrateur");
    } else if (lowerEmail.includes("expert") || lowerEmail.includes("diag")) {
      setRole("Expert / Diagnostiqueur");
    } else if (lowerEmail.includes("apc") || lowerEmail.includes("wilaya") || lowerEmail.includes("ministere") || lowerEmail.includes("mairie") || lowerEmail.includes("gov") || lowerEmail.includes("collectivite")) {
      setRole("Collectivité locale (APC / Wilaya / Ministère)");
    } else if (lowerEmail.includes("bureau") || lowerEmail.includes("etude") || lowerEmail.includes("archi")) {
      setRole("Bureau d'études");
    } else if (lowerEmail.includes("maintenance") || lowerEmail.includes("travaux") || lowerEmail.includes("reparation")) {
      setRole("Entreprise de maintenance");
    } else if (lowerEmail.includes("proprietaire") || lowerEmail.includes("gestionnaire") || lowerEmail.includes("patrimoine") || lowerEmail.includes("client")) {
      setRole("Gestionnaire du patrimoine / Propriétaire ou Client");
    } else if (lowerEmail.includes("drone") || lowerEmail.includes("terrain") || lowerEmail.includes("pilote") || lowerEmail.includes("operateur")) {
      setRole("Opérateur drone / Agent de terrain");
    }
  }, [email]);

  const ALGERIAN_WILAYAS = [
    "Adrar (01)",
    "Chlef (02)",
    "Laghouat (03)",
    "Oum El Bouaghi (04)",
    "Batna (05)",
    "Béjaïa (06)",
    "Biskra (07)",
    "Béchar (08)",
    "Blida (09)",
    "Bouira (10)",
    "Tébessa (11)",
    "Tlemcen (12)",
    "Tiaret (13)",
    "Tizi Ouzou (15)",
    "Alger (16)",
    "Djelfa (17)",
    "Jijel (18)",
    "Sétif (19)",
    "Saïda (20)",
    "Skikda (21)",
    "Sidi Bel Abbès (22)",
    "Annaba (23)",
    "Guelma (24)",
    "Constantine (25)",
    "Médéa (26)",
    "Mostaganem (27)",
    "M'Sila (28)",
    "Mascara (29)",
    "Ouargla (30)",
    "Oran (31)",
    "El Bayadh (32)",
    "Illizi (33)",
    "Bordj Bou Arréridj (34)",
    "Boumerdès (35)",
    "El Tarf (36)",
    "Tindouf (37)",
    "Tissemsilt (38)",
    "El Oued (39)",
    "Khenchela (40)",
    "Souk Ahras (41)",
    "Tipaza (42)",
    "Mila (43)",
    "Aïn Defla (44)",
    "Naâma (45)",
    "Aïn Témouchent (46)",
    "Ghardaïa (47)",
    "Relizane (48)",
    "Timimoun (49)",
    "Bordj Badji Mokhtar (50)",
    "Ouled Djellal (51)",
    "Béni Abbès (52)",
    "In Salah (53)",
    "In Guezzam (54)",
    "Touggourt (55)",
    "Djanet (56)",
    "El M'Ghair (57)",
    "El Meniaa (58)"
  ];

  const AUTH_CREDENTIALS_KEY = "batismart_auth_credentials";

  const loadCredentials = (): Record<string, string> => {
    const stored = safeStorage.getItem(AUTH_CREDENTIALS_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const saveCredentials = (credentials: Record<string, string>) => {
    safeStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(credentials));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (isReset) {
        setMessage(`Un e-mail de réinitialisation a été envoyé à l'adresse : ${email}`);
        setLoading(false);
        setTimeout(() => {
          setIsReset(false);
          setIsLogin(true);
        }, 3000);
        return;
      }

      const cleanEmail = email.trim().toLowerCase();
      const credentials = loadCredentials();

      if (isLogin) {
        const savedPassword = credentials[cleanEmail];
        if (!savedPassword) {
          setError("Aucun compte trouvé avec cette adresse e-mail.");
          setLoading(false);
          return;
        }

        if (savedPassword !== password) {
          setError("Mot de passe incorrect. Veuillez réessayer.");
          setLoading(false);
          return;
        }

        const userUid = "usr_" + cleanEmail.replace(/[^a-z0-9]/g, "_");
        const authenticatedUser: UserProfile = {
          uid: userUid,
          email: cleanEmail,
          displayName: name || (cleanEmail.split("@")[0].charAt(0).toUpperCase() + cleanEmail.split("@")[0].slice(1)),
          role: role,
          wilaya: wilaya || "Béjaïa (06)",
          createdAt: new Date().toISOString()
        };
        safeStorage.setItem("batismart_user", JSON.stringify(authenticatedUser));
        onAuthSuccess(authenticatedUser);
      } else {
        // Register Simulation
        if (!name) {
          setError("Veuillez entrer votre nom complet.");
          setLoading(false);
          return;
        }

        const newUserEmail = cleanEmail;
        const userUid = "usr_" + newUserEmail.replace(/[^a-z0-9]/g, "_");
        const newUser: UserProfile = {
          uid: userUid,
          email: newUserEmail,
          displayName: name,
          role: role,
          wilaya: wilaya === "Autre (Saisir manuellement)" ? (customWilaya || "Autre") : wilaya,
          createdAt: new Date().toISOString()
        };

        saveCredentials({
          ...credentials,
          [newUserEmail]: password
        });
        safeStorage.setItem("batismart_user", JSON.stringify(newUser));
        onAuthSuccess(newUser);
      }
      setLoading(false);
    }, 1000);
  };

  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(() => {
    return (safeStorage.getItem("batismart_theme") as "light" | "dark") || "light";
  });

  const isDark = currentTheme === "dark";

  const handleThemeChange = () => {
    const nextTheme = isDark ? "light" : "dark";
    setCurrentTheme(nextTheme);
    safeStorage.setItem("batismart_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative p-4 font-sans overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-850"
    }`}>
      {/* Dynamic Grid Background Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isDark 
          ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] opacity-60" 
          : "bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] opacity-80"
      } bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]`} />
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
 
      {/* Floating Theme Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleThemeChange}
          type="button"
          className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
            isDark 
              ? "bg-slate-900/80 border-slate-800 text-amber-400 hover:text-amber-350 hover:bg-slate-900" 
              : "bg-white border-slate-200 text-slate-600 hover:text-sky-600 shadow-sm"
          }`}
          title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Auth Card Container */}
      <div className={`relative w-full max-w-lg border p-8 rounded-2xl shadow-xl transition-all duration-300 z-10 ${
        isDark ? "bg-[#070c1e] border-slate-900" : "bg-white border-slate-200/80"
      }`}>
        
        {/* Logo and App Brand Title */}
        <div className="flex flex-col items-center mb-6">
          <Logo size="md" variant={isDark ? "light" : "dark"} show3dBadge={true} className="scale-90" />
        </div>

        {/* State Indicators */}
        {error && (
          <div className={`mb-5 p-3.5 rounded-lg border text-xs font-light leading-relaxed ${
            isDark ? "bg-red-950/25 border-red-900/40 text-red-400" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {error}
          </div>
        )}

        {message && (
          <div className={`mb-5 p-3.5 rounded-lg border text-xs font-light leading-relaxed ${
            isDark ? "bg-emerald-950/25 border-emerald-900/40 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}>Adresse E-mail Professionnelle</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: ingenieur@batismart.dz"
                className={`w-full border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-sky-500 transition-all duration-300 ${
                  isDark 
                    ? "bg-[#0e162f] border-slate-800 text-white placeholder-slate-500" 
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
                required
              />
            </div>
          </div>

          {/* Password (Hidden in Reset state) */}
          {!isReset && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`block text-xs font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>Mot de passe</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => { setIsReset(true); setIsLogin(false); }}
                    className="text-sky-500 hover:text-sky-400 text-xs transition font-semibold cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-sky-500 transition-all duration-300 ${
                    isDark 
                      ? "bg-[#0e162f] border-slate-800 text-white placeholder-slate-500" 
                      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                  required={!isReset}
                />
              </div>
            </div>
          )}

          {/* Register-Only Fields */}
          {!isLogin && !isReset && (
            <>
              {/* Full Name */}
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>Nom et Prénom</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Dr. Amine Belkacem"
                    className={`w-full border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-sky-500 transition-all duration-300 ${
                      isDark 
                        ? "bg-[#0e162f] border-slate-800 text-white placeholder-slate-500" 
                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                    required={!isLogin}
                  />
                </div>
              </div>

              {/* Algerian Wilaya */}
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}>Wilaya d'Affectation</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className={`w-full border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-sky-500 transition-all cursor-pointer appearance-none ${
                        isDark 
                          ? "bg-[#0e162f] border-slate-800 text-slate-200" 
                          : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      {ALGERIAN_WILAYAS.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                      <option value="Autre (Saisir manuellement)">Autre (Saisir manuellement)</option>
                    </select>
                  </div>
                </div>

                {wilaya === "Autre (Saisir manuellement)" && (
                  <div className="animate-fade-in">
                    <label className={`block text-[11px] font-medium mb-1.5 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>Saisir le nom de la Wilaya</label>
                    <input
                      type="text"
                      value={customWilaya}
                      onChange={(e) => setCustomWilaya(e.target.value)}
                      placeholder="ex: Tipaza (42) ou autre"
                      className={`w-full border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-sky-500 transition-all duration-300 ${
                        isDark 
                          ? "bg-[#0e162f] border-slate-800 text-white placeholder-slate-500" 
                          : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                      required
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Visual Profile Selector Card Grid */}
          {!isReset && (
            <div className="space-y-3 mt-3">
              <label className={`block font-bold text-xs uppercase tracking-wider ${
                isDark ? "text-slate-300" : "text-slate-800"
              }`}>
                Choisissez votre profil ou laissez l'IA le détecter :
              </label>
              <div className={`grid grid-cols-1 gap-3 max-h-[340px] overflow-y-auto pr-1 border rounded-xl p-2.5 ${
                isDark ? "border-slate-800 bg-[#060917]" : "border-slate-200 bg-slate-50/50"
              }`}>
                {AVAILABLE_PROFILES.map((profile) => {
                  const ProfileIcon = profile.icon;
                  const isSelected = role === profile.id;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => setRole(profile.id)}
                      className={`flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? isDark 
                            ? "bg-sky-950/40 border-sky-500/70 shadow-md ring-1 ring-sky-500/30" 
                            : "bg-sky-500/10 border-sky-500/50 shadow-md ring-1 ring-sky-500/25"
                          : isDark 
                            ? "bg-[#0c122a] border-slate-800/80 hover:border-slate-700" 
                            : "bg-white border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className={`p-3 rounded-xl shrink-0 ${profile.color}`}>
                        <ProfileIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[13.5px] font-extrabold ${isSelected ? "text-sky-500 font-black" : isDark ? "text-slate-200" : "text-slate-900"}`}>
                            {profile.label}
                          </span>
                          {isSelected && (
                            <div className="bg-sky-500 text-white rounded-full p-0.5 shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 hover:shadow-lg hover:shadow-sky-500/10 text-white font-semibold text-sm py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 duration-300"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Chargement en cours...
              </>
            ) : isReset ? (
              "Envoyer le lien de réinitialisation"
            ) : isLogin ? (
              "Se connecter"
            ) : (
              "Créer mon compte"
            )}
          </button>

          {/* Dynamic State Toggle Footer */}
          <div className={`mt-6 pt-5 border-t text-center space-y-3 ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            {isLogin ? (
              <p className={`text-xs font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Nouveau sur la plateforme ?{" "}
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setIsReset(false); }}
                  className="text-sky-500 hover:text-sky-400 font-semibold transition cursor-pointer"
                >
                  S'inscrire gratuitement
                </button>
              </p>
            ) : (
              <p className={`text-xs font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Vous avez déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setIsReset(false); }}
                  className="text-sky-500 hover:text-sky-400 font-semibold transition cursor-pointer"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
