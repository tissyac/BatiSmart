import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, MessageSquare, RefreshCw, BookOpen, Cpu, Image as ImageIcon, X, Plus, Trash2, Maximize2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  timestamp: Date;
}

interface ChatScreenProps {
  language?: "fr" | "ar" | "en";
}

const translations = {
  fr: {
    placeholder: "Ex: Comment réparer cette fissure ?",
    headerTitle: "Espace d'Échange Intelligent",
    headerDesc: "Posez vos questions techniques ou envoyez des photos de vos bâtiments.",
    hybridActive: "Mode Hybride Actif",
    sidebarTitle: "Assistant Virtuel",
    sidebarStatus: "Gemini 3.5 Flash connecté",
    suggestionsTitle: "Suggestions de questions",
    expertiseTitle: "Expertise BatiSmart Roof IA",
    expertiseDesc: "Cet assistant intègre l'ensemble de la méthodologie de l'Université de Béjaïa pour le traitement préventif de l'étanchéité et la performance énergétique.",
    pressEnter: "Pressez Entrée pour envoyer le message.",
    poweredBy: "Alimenté par IA d'analyse civil",
    thinking: "L'Assistant BatiSmart Roof IA analyse vos données et vos photos...",
    welcomeMsg: "Bonjour ! Je suis l'**Assistant Virtuel BatiSmart Roof IA** 🧠🏢.\n\nJe suis à votre entière disposition pour vous guider dans le pré-diagnostic, l'évaluation et la réhabilitation technique des toitures-terrasses publiques d'Algérie.\n\n*Que souhaitez-vous savoir aujourd'hui ?* Vous pouvez me poser des questions ou **m'envoyer autant de photos de la galerie que vous le souhaitez** pour une analyse visuelle instantanée !",
    addPhotos: "Photos Galerie",
    attachImageTooltip: "Joindre des photos depuis la galerie (nombre illimité)",
    selectedPhotosCount: "photo(s) sélectionnée(s)",
    clearAllPhotos: "Tout effacer",
    addMorePhotos: "Ajouter plus",
    removeImage: "Supprimer la photo",
  },
  ar: {
    placeholder: "مثال: كيف يتم إصلاح هذا التشقق؟",
    headerTitle: "مساحة التبادل الذكي",
    headerDesc: "اطرح أسئلتك التقنية أو أرسل صور أسطح مبانيك.",
    hybridActive: "الوضع الهجين نشط",
    sidebarTitle: "المساعد الافتراضي",
    sidebarStatus: "جيميني 3.5 فلاش متصل",
    suggestionsTitle: "اقتراحات الأسئلة",
    expertiseTitle: "خبرة BatiSmart Roof IA الذكية",
    expertiseDesc: "يدمج هذا المساعد منهجية جامعة بجاية بالكامل للمعالجة الوقائية لكتامة المياه والأداء الطاقوي.",
    pressEnter: "اضغط على Enter لإرسال الرسالة.",
    poweredBy: "مدعوم من الذكاء الاصطناعي للتحليل المدني",
    thinking: "يقوم مساعد BatiSmart Roof IA بتحليل بياناتك وصورك...",
    welcomeMsg: "مرحباً! أنا **المساعد الافتراضي BatiSmart Roof IA** 🧠🏢.\n\nأنا تحت تصرفك لمساعدتك في تشخيص وتقييم وإعادة تأهيل الأسطح العامة في الجزائر.\n\n*ماذا تريد أن تعرف اليوم؟* يمكنك طرح الأسئلة أو **إرسال أي عدد من الصور من المعرض** للتحليل البصري الفوري!",
    addPhotos: "صور من المعرض",
    attachImageTooltip: "إرفاق صور من المعرض (عدد غير محدود)",
    selectedPhotosCount: "صورة حددتها",
    clearAllPhotos: "مسح الكل",
    addMorePhotos: "إضافة المزيد",
    removeImage: "إزالة الصورة",
  },
  en: {
    placeholder: "Ex: How to repair this crack?",
    headerTitle: "Smart Exchange Space",
    headerDesc: "Ask your technical questions or send roof inspection photos.",
    hybridActive: "Hybrid Mode Active",
    sidebarTitle: "Virtual Assistant",
    sidebarStatus: "Gemini 3.5 Flash connected",
    suggestionsTitle: "Suggested Questions",
    expertiseTitle: "BatiSmart Roof IA Expertise",
    expertiseDesc: "This assistant integrates the entire methodology of the University of Bejaia for preventive waterproofing and energy performance.",
    pressEnter: "Press Enter to send the message.",
    poweredBy: "Powered by Civil Analysis AI",
    thinking: "The BatiSmart Roof IA Assistant is analyzing your message and photos...",
    welcomeMsg: "Hello! I am the **BatiSmart Roof IA Virtual Assistant** 🧠🏢.\n\nI am entirely at your disposal to guide you through the diagnosis, evaluation, and technical rehabilitation of public flat roofs in Algeria.\n\n*What would you like to know today?* You can ask questions or **attach as many gallery photos as you want** for immediate visual analysis!",
    addPhotos: "Gallery Photos",
    attachImageTooltip: "Attach gallery photos (unlimited count)",
    selectedPhotosCount: "photo(s) selected",
    clearAllPhotos: "Clear all",
    addMorePhotos: "Add more",
    removeImage: "Remove photo",
  }
};

const quickPromptsByLang = {
  fr: [
    { label: "Comment fonctionne l'IA ?", query: "Comment fonctionne l'IA ?" },
    { label: "Pourquoi ce bâtiment est-il critique ?", query: "Pourquoi ce bâtiment est-il critique ?" },
    { label: "Quel matériau recommandez-vous ?", query: "Quel matériau recommandez-vous ?" },
    { label: "Comment réparer cette fissure ?", query: "Comment réparer cette fissure ?" },
    { label: "Réduction CO₂", query: "Parlez-moi de la Réduction CO₂ et de l'usage des éco-matériaux." },
    { label: "Isolement & Performance énergétique", query: "Quel est l'impact de l'isolement sur la performance énergétique ?" },
    { label: "Chaux-chanvre", query: "Quels sont les avantages du complexe Chaux-chanvre ?" },
    { label: "ODD concernés", query: "Quels sont les ODD (Objectifs de Développement Durable) concernés par BatiSmart ?" }
  ],
  ar: [
    { label: "كيف يعمل الذكاء الاصطناعي؟", query: "كيف يعمل الذكاء الاصطناعي؟" },
    { label: "لماذا هذا المبنى حرج؟", query: "لماذا هذا المبنى حرج؟" },
    { label: "ما هي المواد الموصى بها؟", query: "ما هي المواد التي توصي بها للكتامة؟" },
    { label: "كيف يتم إصلاح هذا التشقق؟", query: "كيف يتم إصلاح هذا التشقق في السقف؟" },
    { label: "خفض انبعاثات CO₂", query: "حدثني عن خفض انبعاثات CO₂ واستخدام المواد المستدامة." },
    { label: "العزل والأداء الطاقوي", query: "ما هو تأثير العزل على الأداء الطاقوي للمبنى؟" },
    { label: "الجير والقنب (Chaux-chanvre)", query: "ما هي مزايا مركب الجير والقنب (Chaux-chanvre)؟" },
    { label: "أهداف التنمية المستدامة (ODD)", query: "ما هي أهداف التنمية المستدامة (ODD) المعنية بمشروع BatiSmart؟" }
  ],
  en: [
    { label: "How does the AI work?", query: "How does the AI work?" },
    { label: "Why is this building critical?", query: "Why is this building critical?" },
    { label: "What material do you recommend?", query: "What material do you recommend for waterproofing?" },
    { label: "How to repair this crack?", query: "How to repair this roof crack?" },
    { label: "CO₂ Reduction", query: "Tell me about CO₂ reduction and the use of eco-materials." },
    { label: "Insulation & Energy Performance", query: "What is the impact of insulation on building energy performance?" },
    { label: "Lime-Hemp", query: "What are the advantages of the Lime-Hemp complex?" },
    { label: "ODDs (SDGs) concerned", query: "Which United Nations Sustainable Development Goals (ODDs/SDGs) are concerned?" }
  ]
};

export default function ChatScreen({ language = "fr" }: ChatScreenProps) {
  const t = translations[language] || translations["fr"];
  const currentQuickPrompts = quickPromptsByLang[language] || quickPromptsByLang["fr"];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t.welcomeMsg,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update welcome message if language changes and no other messages exist
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome") {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: t.welcomeMsg,
          timestamp: new Date()
        }
      ]);
    }
  }, [language]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, selectedImages]);

  // Handle gallery file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const readPromises = fileList.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            resolve("");
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((base64Strings) => {
      const valid = base64Strings.filter(Boolean);
      setSelectedImages((prev) => [...prev, ...valid]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    const imagesToSend = [...selectedImages];

    if (!text && imagesToSend.length === 0) return;

    if (!textToSend) {
      setInputValue("");
      setSelectedImages([]);
    }

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      images: imagesToSend.length > 0 ? imagesToSend : undefined,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
            images: m.images
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre le serveur de chat BatiSmart.");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: data.response || "Désolé, je n'ai pas pu générer de réponse.",
          timestamp: new Date()
        }
      ]);
      setIsSimulated(!!data.simulated);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: `⚠️ **Erreur de connexion** : Impossible de contacter l'Assistant BatiSmart en direct. \n\n*Alternative locale :* Vérifiez que le serveur fonctionne bien sur le port 3000.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render markdown-like bold and bullet text simply
  const renderMessageContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      let renderedLine = line;
      
      // Handle bold formatting (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-semibold text-slate-850 dark:text-slate-100">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const hasBold = parts.length > 0;
      const finalContent = hasBold ? parts : renderedLine;

      // Check if bullet point
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={index} className="ml-4 list-disc text-slate-700 dark:text-slate-300 text-xs md:text-sm my-1 leading-relaxed">
            {hasBold ? parts : line.trim().substring(2)}
          </li>
        );
      }

      return (
        <p key={index} className="text-slate-700 dark:text-slate-300 text-xs md:text-sm my-1.5 leading-relaxed min-h-[1rem]">
          {finalContent}
        </p>
      );
    });
  };

  const isRTL = language === "ar";

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-[#030712] flex-col md:flex-row">
      
      {/* Sidebar Panel for Quick Info - Hidden on mobile, visible on desktop */}
      <div className={`hidden md:flex w-80 bg-slate-50 dark:bg-[#070b19] p-5 flex-col justify-between shrink-0 ${isRTL ? "border-l border-slate-200 dark:border-slate-800" : "border-r border-slate-200 dark:border-slate-800"}`} style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-500">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-semibold font-display text-slate-800 dark:text-slate-200">{t.sidebarTitle}</h3>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                {t.sidebarStatus}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" /> {t.suggestionsTitle}
            </h4>
            <div className="flex flex-wrap md:flex-col gap-2">
              {currentQuickPrompts.map((p, idx) => (
                <button
                   key={idx}
                   onClick={() => handleSend(p.query)}
                   disabled={isLoading}
                   className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-sky-500/30 text-slate-700 dark:text-slate-300 hover:text-sky-600 rounded-xl text-left text-xs transition duration-300 cursor-pointer flex items-center gap-2 max-w-full"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Context Footer Badge */}
        <div className="mt-6 p-4 rounded-xl bg-sky-500/5 dark:bg-sky-950/20 border border-sky-500/10 dark:border-sky-900/40 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-light">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-1">
            <Cpu className="w-3.5 h-3.5 text-sky-500" />
            {t.expertiseTitle}
          </div>
          {t.expertiseDesc}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#030712] relative" style={{ direction: isRTL ? "rtl" : "ltr" }}>
        
        {/* Chat Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#070b19]">
          <div>
            <h2 className="text-base font-bold font-display text-slate-800 dark:text-slate-100">{t.headerTitle}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">{t.headerDesc}</p>
          </div>
          {isSimulated && (
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-600 px-2 py-0.5 rounded font-mono">
              {t.hybridActive}
            </span>
          )}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? "self-start" : "self-end flex-row-reverse ml-auto"}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isBot 
                    ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sky-600 shadow-sm" 
                    : "bg-sky-600 border-sky-500 text-white shadow-md shadow-sky-500/10"
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble Container */}
                <div className="max-w-full">
                  {/* Images attached by user in message */}
                  {msg.images && msg.images.length > 0 && (
                    <div className={`mb-2 grid gap-2 ${
                      msg.images.length === 1 
                        ? "grid-cols-1" 
                        : msg.images.length === 2 
                        ? "grid-cols-2" 
                        : "grid-cols-2 sm:grid-cols-3"
                    }`}>
                      {msg.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-black/10">
                          <img
                            src={imgUrl}
                            alt={`Photo jointe ${imgIdx + 1}`}
                            className="w-full h-32 md:h-36 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => setPreviewModalImage(imgUrl)}
                          />
                          <button
                            type="button"
                            onClick={() => setPreviewModalImage(imgUrl)}
                            className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Agrandir"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`p-4 rounded-2xl shadow-sm border ${
                    isBot 
                      ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none" 
                      : "bg-gradient-to-tr from-sky-600 to-sky-500 border-sky-500/20 text-white rounded-tr-none"
                  }`}>
                    {renderMessageContent(msg.content)}
                  </div>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-1 px-1 font-mono font-light">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {messages.length === 1 && (
            <div className="md:hidden space-y-3 mt-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-500" /> {t.suggestionsTitle}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {currentQuickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.query)}
                    disabled={isLoading}
                    className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-sky-500/30 text-slate-700 dark:text-slate-300 hover:text-sky-600 rounded-xl text-left text-xs transition duration-300 cursor-pointer flex items-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Thinking / Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sky-600 shadow-sm">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-tl-none flex items-center gap-2 text-xs font-light">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-500" />
                {t.thinking}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <div className="p-4 md:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b19]">
          
          {/* Selected Images Preview Bar */}
          {selectedImages.length > 0 && (
            <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-sky-500" />
                  <span>{selectedImages.length} {t.selectedPhotosCount}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t.addMorePhotos}
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedImages([])}
                    className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t.clearAllPhotos}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                {selectedImages.map((imgData, idx) => (
                  <div key={idx} className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-750 shadow-xs">
                    <img src={imgData} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                      title={t.removeImage}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative flex items-center gap-2">
            {/* Gallery Upload Trigger Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                selectedImages.length > 0 
                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30" 
                  : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-sky-500 hover:border-sky-500/30"
              }`}
              title={t.attachImageTooltip}
            >
              <ImageIcon className="w-5 h-5" />
              {selectedImages.length > 0 && (
                <span className="text-[10px] font-bold bg-sky-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {selectedImages.length}
                </span>
              )}
            </button>

            {/* Hidden Input for Gallery Image Files Selection */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="relative flex-1 flex items-center">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={selectedImages.length > 0 ? "Posez votre question sur ces photos..." : t.placeholder}
                rows={1}
                className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-4 pr-14 text-xs md:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all duration-300 resize-none max-h-32 shadow-inner ${isRTL ? "text-right pl-14 pr-4" : "text-left pl-4 pr-14"}`}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || (!inputValue.trim() && selectedImages.length === 0)}
                className={`absolute p-2.5 rounded-xl transition duration-300 flex items-center justify-center cursor-pointer border ${
                  (inputValue.trim() || selectedImages.length > 0) && !isLoading
                    ? "bg-sky-600 hover:bg-sky-500 text-white border-sky-500/20 shadow-md shadow-sky-500/10 hover:-translate-y-0.5"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-850"
                } ${isRTL ? "left-2" : "right-2"}`}
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1 font-light">
            <span>{t.pressEnter}</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              {t.poweredBy}
            </span>
          </div>
        </div>

      </div>

      {/* Lightbox Image Preview Modal */}
      {previewModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewModalImage(null)}
              className="absolute -top-10 right-0 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalImage}
              alt="Agrandissement photo"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
