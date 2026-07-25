import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Check, 
  Languages,
  Eye,
  Info,
  Smartphone,
  Save,
  CheckSquare,
  Square
} from "lucide-react";
import { safeStorage } from "../utils/storage";
import { UserProfile, UserRole } from "../types";
import { Users, UserPlus, Trash2, ShieldAlert } from "lucide-react";

interface SettingsScreenProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  language?: "fr" | "ar" | "en";
  setLanguage?: (lang: "fr" | "ar" | "en") => void;
  user: UserProfile;
}

export default function SettingsScreen({ theme, setTheme, language = "fr", setLanguage, user }: SettingsScreenProps) {
  // Langue state
  const [lang, setLang] = useState<"fr" | "ar" | "en">(language);

  useEffect(() => {
    setLang(language);
  }, [language]);

  const handleSelectLang = (newLang: "fr" | "ar" | "en") => {
    setLang(newLang);
    if (setLanguage) {
      setLanguage(newLang);
    }
  };

  // Notifications states
  const [notifMandatory, setNotifMandatory] = useState<boolean>(() => {
    return safeStorage.getItem("notif_mandatory") !== "false";
  });
  const [notifHumidity, setNotifHumidity] = useState<boolean>(() => {
    return safeStorage.getItem("notif_humidity") !== "false";
  });
  const [notifFissure, setNotifFissure] = useState<boolean>(() => {
    return safeStorage.getItem("notif_fissure") !== "false";
  });
  const [notifReport, setNotifReport] = useState<boolean>(() => {
    return safeStorage.getItem("notif_report") !== "false";
  });

  // Saved state toast
  const [saved, setSaved] = useState(false);

  // RBAC User and Role management states
  const [teamUsers, setTeamUsers] = useState<any[]>(() => {
    const stored = safeStorage.getItem("batismart_team_users");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // fall through
      }
    }
    return [
      { id: "1", displayName: "Kamel Benali", email: "admin@batismart.dz", role: "Administrateur", wilaya: "Alger (16)", status: "Active" },
      { id: "2", displayName: "Yacine Belkacem", email: "expert.diagnostiqueur@batismart.dz", role: "Expert / Diagnostiqueur", wilaya: "Alger (16)", status: "Active" },
      { id: "3", displayName: "Nadia Zeroual", email: "apc.alger@batismart.dz", role: "Collectivité locale (APC / Wilaya / Ministère)", wilaya: "Alger (16)", status: "Active" },
      { id: "4", displayName: "Samy Mansouri", email: "bureau.etude@batismart.dz", role: "Bureau d'études", wilaya: "Tizi Ouzou (15)", status: "Active" },
      { id: "5", displayName: "Karim Haddad", email: "maintenance.batiment@batismart.dz", role: "Entreprise de maintenance", wilaya: "Blida (09)", status: "Active" },
      { id: "6", displayName: "Farid Meziane", email: "gestionnaire.patrimoine@batismart.dz", role: "Gestionnaire du patrimoine / Propriétaire ou Client", wilaya: "Oran (31)", status: "Active" },
      { id: "7", displayName: "Riad Dahmani", email: "pilote.drone@batismart.dz", role: "Opérateur drone / Agent de terrain", wilaya: "Constantine (25)", status: "Active" },
    ];
  });

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("Expert / Diagnostiqueur");
  const [newUserWilaya, setNewUserWilaya] = useState("Alger (16)");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const newUserObj = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      displayName: newUserName,
      email: newUserEmail,
      role: newUserRole,
      wilaya: newUserWilaya,
      status: "Active"
    };
    const updated = [...teamUsers, newUserObj];
    setTeamUsers(updated);
    safeStorage.setItem("batismart_team_users", JSON.stringify(updated));
    setNewUserName("");
    setNewUserEmail("");
    setShowAddForm(false);
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const updated = teamUsers.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setTeamUsers(updated);
    safeStorage.setItem("batismart_team_users", JSON.stringify(updated));
  };

  const handleToggleUserStatus = (userId: string) => {
    const updated = teamUsers.map(u => u.id === userId ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u);
    setTeamUsers(updated);
    safeStorage.setItem("batismart_team_users", JSON.stringify(updated));
  };

  const handleDeleteUser = (userId: string) => {
    const updated = teamUsers.filter(u => u.id !== userId);
    setTeamUsers(updated);
    safeStorage.setItem("batismart_team_users", JSON.stringify(updated));
  };

  const handleSaveSettings = () => {
    safeStorage.setItem("batismart_lang", lang);
    safeStorage.setItem("notif_mandatory", String(notifMandatory));
    safeStorage.setItem("notif_humidity", String(notifHumidity));
    safeStorage.setItem("notif_fissure", String(notifFissure));
    safeStorage.setItem("notif_report", String(notifReport));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Translations dictionary for Settings Screen
  const t = {
    fr: {
      title: "Paramètres de la Console",
      subtitle: "Gérez vos préférences d'interface, de langue, de notifications d'urgence et de confidentialité.",
      sectionTheme: "Apparence & Mode Sombre",
      themeDesc: "Basculez entre le thème clair et le thème sombre pour optimiser le confort visuel sur le terrain.",
      themeDark: "Mode Sombre",
      themeLight: "Mode Clair",
      sectionLang: "Langue du Système",
      langDesc: "Sélectionnez la langue d'affichage pour l'ensemble des rapports d'inspection et pré-diagnostics de l'IA.",
      langFr: "Français",
      langAr: "العربية (Arabe)",
      langEn: "English (Anglais)",
      sectionNotif: "Abonnement aux Notifications d'Urgence",
      notifDesc: "Configurez les alertes push et e-mails générées en temps réel par les algorithmes de détection.",
      notifMand: "Inspection obligatoire",
      notifMandDesc: "Alertes d'inspections décennales obligatoires planifiées par l'État.",
      notifHum: "Humidité détectée",
      notifHumDesc: "Notification immédiate si un taux d'humidité critique est détecté par l'IA.",
      notifFiss: "Nouvelle fissure",
      notifFissDesc: "Alerte si une fissure structurelle évolutive ou dangereuse est identifiée.",
      notifRep: "Rapport disponible",
      notifRepDesc: "Notification dès que le rapport PDF officiel est signé par le système.",
      sectionPriv: "Confidentialité & Sécurité des Données",
      privTitle: "Conformité de Souveraineté des Données",
      privDesc: "Conformément à la réglementation algérienne relative à la sécurité du patrimoine immobilier public et à la protection des données sensibles, l'ensemble des coordonnées GPS de positionnement, relevés photométriques et rapports d'expertises structurelles BatiSmart sont chiffrés de bout en bout et hébergés localement sur un cloud souverain.",
      privLaw: "Protégé par la loi n° 18-07 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.",
      saveBtn: "Enregistrer les Préférences",
      saveSuccess: "Configurations enregistrées avec succès !",
    },
    ar: {
      title: "إعدادات لوحة التحكم",
      subtitle: "قم بإدارة تفضيلات الواجهة، اللغة، إشعارات الطوارئ، وإعدادات السرية والأمان.",
      sectionTheme: "المظهر والوضع الداكن",
      themeDesc: "قم بالتبديل بين الوضع الفاتح والداكن لتحسين الراحة البصرية أثناء الفحص الميداني.",
      themeDark: "الوضع الداكن",
      themeLight: "الوضع الفاتح",
      sectionLang: "لغة النظام",
      langDesc: "اختر لغة العرض المفضلة لجميع تقارير الفحص والتشخيصات الذكية.",
      langFr: "Français (الفرنسية)",
      langAr: "العربية",
      langEn: "English (الإنجليزية)",
      sectionNotif: "الاشتراك في إشعارات الطوارئ",
      notifDesc: "اضبط التنبيهات الفورية والرسائل الإلكترونية التي يرسلها نظام الفحص الذكي في الوقت الفعلي.",
      notifMand: "الفحص الإجباري",
      notifMandDesc: "تنبيهات الفحوصات الدورية الإجبارية المقررة من الدولة.",
      notifHum: "اكتشاف رطوبة",
      notifHumDesc: "إشعار فوري عند رصد نسبة رطوبة حرجة بواسطة الذكاء الاصطناعي.",
      notifFiss: "شرخ جديد",
      notifFissDesc: "تنبيه عند تحديد شرخ هيكلي متطور أو خطير في الجدران أو الأسقف.",
      notifRep: "التقرير جاهز",
      notifRepDesc: "إشعار فوري فور إصدار وتوقيع التقرير الرسمي بصيغة PDF.",
      sectionPriv: "السرية وأمن البيانات",
      privTitle: "الامتثال لسيادة البيانات الوطنية",
      privDesc: "وفقاً للتشريعات الجزائرية المتعلقة بأمن الأملاك الوطنية العمومية وحماية البيانات الحساسة، فإن جميع إحداثيات GPS، الصور الجوية، وتقارير الفحص الفنية المنجزة عبر منصة BatiSmart مشفرة بالكامل ومخزنة محلياً في سحابة وطنية سيادية.",
      privLaw: "محمي بموجب القانون رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي.",
      saveBtn: "حفظ الإعدادات",
      saveSuccess: "تم حفظ الإعدادات بنجاح!",
    },
    en: {
      title: "Console Settings",
      subtitle: "Manage your interface preferences, language, emergency notification alerts, and data privacy options.",
      sectionTheme: "Appearance & Dark Mode",
      themeDesc: "Toggle between light and dark visual themes to optimize visibility and screen contrast during inspection tasks.",
      themeDark: "Dark Mode",
      themeLight: "Light Mode",
      sectionLang: "System Language",
      langDesc: "Select the display language used for all generated AI pre-diagnostic reports, inspection records, and tools.",
      langFr: "Français (French)",
      langAr: "العربية (Arabic)",
      langEn: "English",
      sectionNotif: "Emergency Notifications Subscription",
      notifDesc: "Configure active real-time push and email alerts dispatched by the cognitive analysis engine.",
      notifMand: "Mandatory Inspection",
      notifMandDesc: "Alerts regarding mandatory decennial civil engineering audits mandated by state services.",
      notifHum: "Humidity Detected",
      notifHumDesc: "Immediate alert when critical moisture levels or pooling water are identified by the AI.",
      notifFiss: "New Crack Identified",
      notifFissDesc: "High priority warning if a structural, progressive, or expanding crack is detected.",
      notifRep: "Report Available",
      notifRepDesc: "Notification when the official PDF pre-diagnostic report is generated and authenticated.",
      sectionPriv: "Privacy & Data Security Compliance",
      privTitle: "Sovereign Data Protection Standards",
      privDesc: "In accordance with Algerian regulation on the security of public real estate heritage and public databases, all positioning GPS coordinates, high-resolution imagery, and BatiSmart technical engineering reports are end-to-end encrypted and hosted locally on secure domestic cloud nodes.",
      privLaw: "Protected under Law No. 18-07 on the protection of individuals in the processing of personal data.",
      saveBtn: "Save Preferences",
      saveSuccess: "Preferences saved successfully!",
    }
  };

  const currentT = t[lang];

  return (
    <div className={`p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto h-screen w-full font-sans text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#030712] ${lang === "ar" ? "rtl text-right" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-sky-500" />
            {currentT.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-light max-w-2xl">
            {currentT.subtitle}
          </p>
        </div>

        {/* Save button floating header */}
        <button
          onClick={handleSaveSettings}
          className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {currentT.saveBtn}
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs rounded-xl font-medium animate-fade-in flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
          {currentT.saveSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Theme & Language */}
        <div className="space-y-6">
          
          {/* Appearance Section */}
          <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Moon className="w-5 h-5 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{currentT.sectionTheme}</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-light">
              {currentT.themeDesc}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setTheme("light")}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition duration-300 ${
                  theme === "light"
                    ? "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                {currentT.themeLight}
                {theme === "light" && <Check className="w-3.5 h-3.5 ml-auto text-sky-500" />}
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition duration-300 ${
                  theme === "dark"
                    ? "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
                }`}
              >
                <Moon className="w-4 h-4 text-sky-500" />
                {currentT.themeDark}
                {theme === "dark" && <Check className="w-3.5 h-3.5 ml-auto text-sky-500" />}
              </button>
            </div>
          </div>

          {/* Language Selector Section */}
          <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Globe className="w-5 h-5 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{currentT.sectionLang}</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-light">
              {currentT.langDesc}
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                { key: "fr", label: currentT.langFr, flag: "🇫🇷" },
                { key: "ar", label: currentT.langAr, flag: "🇩🇿" },
                { key: "en", label: currentT.langEn, flag: "🇬🇧" }
              ].map((language) => (
                <button
                  key={language.key}
                  onClick={() => handleSelectLang(language.key as "fr" | "ar" | "en")}
                  className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition duration-300 ${
                    lang === language.key
                      ? "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.label}</span>
                  </div>
                  {lang === language.key && (
                    <div className="w-5 h-5 bg-sky-500 text-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection end */}

        </div>

        {/* Right Column: Notifications & Confidentiality */}
        <div className="space-y-6">
          
          {/* Notifications Section */}
          <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Bell className="w-5 h-5 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{currentT.sectionNotif}</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-light">
              {currentT.notifDesc}
            </p>

            <div className="space-y-3.5 pt-2">
              
              {/* Notif 1: Inspection Obligatoire */}
              <div 
                onClick={() => setNotifMandatory(!notifMandatory)}
                className={`p-3 rounded-xl border flex items-start gap-3 transition cursor-pointer select-none ${
                  notifMandatory 
                    ? "bg-white dark:bg-slate-900/60 border-sky-500/40" 
                    : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {notifMandatory ? (
                    <div className="w-4.5 h-4.5 bg-sky-500 text-white rounded-md flex items-center justify-center border border-sky-500">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 border border-slate-350 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{currentT.notifMand}</span>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 leading-normal font-light">{currentT.notifMandDesc}</p>
                </div>
              </div>

              {/* Notif 2: Humidité détectée */}
              <div 
                onClick={() => setNotifHumidity(!notifHumidity)}
                className={`p-3 rounded-xl border flex items-start gap-3 transition cursor-pointer select-none ${
                  notifHumidity 
                    ? "bg-white dark:bg-slate-900/60 border-sky-500/40" 
                    : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {notifHumidity ? (
                    <div className="w-4.5 h-4.5 bg-sky-500 text-white rounded-md flex items-center justify-center border border-sky-500">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 border border-slate-350 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{currentT.notifHum}</span>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 leading-normal font-light">{currentT.notifHumDesc}</p>
                </div>
              </div>

              {/* Notif 3: Nouvelle Fissure */}
              <div 
                onClick={() => setNotifFissure(!notifFissure)}
                className={`p-3 rounded-xl border flex items-start gap-3 transition cursor-pointer select-none ${
                  notifFissure 
                    ? "bg-white dark:bg-slate-900/60 border-sky-500/40" 
                    : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {notifFissure ? (
                    <div className="w-4.5 h-4.5 bg-sky-500 text-white rounded-md flex items-center justify-center border border-sky-500">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 border border-slate-350 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{currentT.notifFiss}</span>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 leading-normal font-light">{currentT.notifFissDesc}</p>
                </div>
              </div>

              {/* Notif 4: Rapport disponible */}
              <div 
                onClick={() => setNotifReport(!notifReport)}
                className={`p-3 rounded-xl border flex items-start gap-3 transition cursor-pointer select-none ${
                  notifReport 
                    ? "bg-white dark:bg-slate-900/60 border-sky-500/40" 
                    : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {notifReport ? (
                    <div className="w-4.5 h-4.5 bg-sky-500 text-white rounded-md flex items-center justify-center border border-sky-500">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 border border-slate-350 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{currentT.notifRep}</span>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 leading-normal font-light">{currentT.notifRepDesc}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Privacy Section */}
          <div className="bento-card p-6 space-y-4 dark:bg-[#070b19] dark:border-slate-800 border-l-4 border-l-sky-500">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Lock className="w-5 h-5 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{currentT.sectionPriv}</h3>
            </div>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg text-sky-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">{currentT.privTitle}</h4>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                {currentT.privDesc}
              </p>

              <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                <span className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal font-mono">
                  {currentT.privLaw}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. SECTION GESTION DES UTILISATEURS & HABILITATIONS (RBAC) */}
      <div className="border-t border-slate-200 dark:border-slate-850 pt-8">
        <div className={`bento-card p-6 space-y-6 dark:bg-[#070b19] dark:border-slate-800 relative overflow-hidden`}>
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-sky-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  Gestion d'Équipe & Attribution des Rôles (RBAC)
                  <span className="text-[8px] font-black bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded text-sky-500 tracking-widest uppercase">Sécurisé</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-light">
                  Supervisez les habilitations de sécurité, attribuez les rôles métiers et contrôlez les autorisations d'accès BatiSmart.
                </p>
              </div>
            </div>

            {user.role === "Administrateur" && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold rounded-lg hover:bg-sky-500 hover:text-white transition-all duration-300"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {showAddForm ? "Annuler" : "Ajouter un membre"}
              </button>
            )}
          </div>

          {/* Locked overlay notice for non-Admins */}
          {user.role !== "Administrateur" && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3 text-amber-500">
              <Lock className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold block">Accès Restreint aux Administrateurs</span>
                <p className="text-[11px] leading-relaxed font-normal">
                  La gestion de la console d'administration, la création de comptes et la modification des matrices de rôles sont verrouillées. 
                  Votre profil actuel (<strong className="underline">{user.role}</strong>) dispose de droits en lecture seule sur cet écran.
                </p>
              </div>
            </div>
          )}

          {/* Form to simulate adding a new user */}
          {showAddForm && user.role === "Administrateur" && (
            <form onSubmit={handleAddUser} className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Nouveau profil utilisateur</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="ex: Ahmed Mansour"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition duration-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Adresse Email</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="ex: a.mansour@batismart.dz"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition duration-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Rôle Métier (Matrice RBAC)</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition duration-300 cursor-pointer"
                  >
                    <option value="Administrateur">👨‍💼 Administrateur</option>
                    <option value="Expert / Diagnostiqueur">👷 Expert / Diagnostiqueur</option>
                    <option value="Collectivité locale (APC / Wilaya / Ministère)">🏛️ Collectivité locale</option>
                    <option value="Bureau d'études">🏢 Bureau d'études</option>
                    <option value="Entreprise de maintenance">🔧 Entreprise de maintenance</option>
                    <option value="Gestionnaire du patrimoine / Propriétaire ou Client">🏗️ Gestionnaire du patrimoine / Propriétaire ou Client</option>
                    <option value="Opérateur drone / Agent de terrain">🚁 Opérateur drone</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Région / Wilaya</label>
                  <input
                    type="text"
                    required
                    value={newUserWilaya}
                    onChange={(e) => setNewUserWilaya(e.target.value)}
                    placeholder="ex: Alger (16)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition duration-300"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-300 cursor-pointer"
                >
                  Enregistrer l'utilisateur
                </button>
              </div>
            </form>
          )}

          {/* Interactive User Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-850">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-450 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="p-3.5 pl-4">Nom de l'Agent</th>
                  <th className="p-3.5">Habilitation / Rôle BatiSmart</th>
                  <th className="p-3.5">Circonscription / Wilaya</th>
                  <th className="p-3.5 text-center">Statut</th>
                  {user.role === "Administrateur" && <th className="p-3.5 text-right pr-4">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                {teamUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                    {/* User profile details */}
                    <td className="p-3.5 pl-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 font-bold flex items-center justify-center">
                        {u.displayName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block leading-snug">{u.displayName}</span>
                        <span className="text-[10px] text-slate-450 dark:text-slate-550 block leading-none mt-0.5">{u.email}</span>
                      </div>
                    </td>

                    {/* Role allocation */}
                    <td className="p-3.5">
                      {user.role === "Administrateur" ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value as UserRole)}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2 text-[11px] text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-sky-500 transition duration-300 cursor-pointer max-w-[240px] truncate"
                        >
                          <option value="Administrateur">👨‍💼 Administrateur</option>
                          <option value="Expert / Diagnostiqueur">👷 Expert / Diagnostiqueur</option>
                          <option value="Collectivité locale (APC / Wilaya / Ministère)">🏛️ Collectivité locale</option>
                          <option value="Bureau d'études">🏢 Bureau d'études</option>
                          <option value="Entreprise de maintenance">🔧 Entreprise de maintenance</option>
                          <option value="Gestionnaire du patrimoine / Propriétaire ou Client">🏗️ Gestionnaire du patrimoine / Propriétaire ou Client</option>
                          <option value="Opérateur drone / Agent de terrain">🚁 Opérateur drone</option>
                        </select>
                      ) : (
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{u.role}</span>
                      )}
                    </td>

                    {/* Wilaya territorial area */}
                    <td className="p-3.5">
                      <span className="text-slate-650 dark:text-slate-400 font-semibold">{u.wilaya}</span>
                    </td>

                    {/* Active/Inactive toggling status */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          if (user.role === "Administrateur") handleToggleUserStatus(u.id);
                        }}
                        disabled={user.role !== "Administrateur"}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold select-none transition-all duration-300 ${
                          u.status === "Active"
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
                        } ${user.role === "Administrateur" ? "cursor-pointer hover:bg-opacity-80" : "cursor-default"}`}
                      >
                        {u.status === "Active" ? "Actif" : "Suspendu"}
                      </button>
                    </td>

                    {/* Delete item action (Admin only) */}
                    {user.role === "Administrateur" && (
                      <td className="p-3.5 text-right pr-4">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          title="Supprimer ce membre"
                          className="p-1.5 rounded-lg border border-rose-500/10 hover:border-rose-500 text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Save Button Row */}
      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleSaveSettings}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs py-3 px-8 rounded-xl transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4.5 h-4.5" />
          {currentT.saveBtn}
        </button>
      </div>

    </div>
  );
}
