import { Inspection } from "./types";

export const SEED_INSPECTIONS: Inspection[] = [
  // --- CHU Khelil Amrane ---
  {
    id: "insp_chu_1",
    buildingName: "CHU Khelil Amrane",
    buildingType: "Santé",
    city: "Béjaïa (06)",
    address: "Boulevard de l'ALN, Béjaïa",
    latitude: 36.7562,
    longitude: 5.0620,
    imageUrl: "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Urgence critique signalée au-dessus du bloc opératoire de chirurgie et du pavillon de pédiatrie.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-01-20T10:00:00Z",
    cracks: {
      detected: true,
      severity: "Élevée",
      description: "Fissuration structurelle transversale importante de la dalle principale supérieure du bloc opératoire. Les aciers du béton armé sont apparents et montrent de la corrosion."
    },
    humidity: {
      detected: true,
      severity: "Élevée",
      description: "Taux d'humidité supérieur à 92% mesuré en sous-face de dalle. Stalactites de calcite actives et formation de cloques d'eau sous la chape."
    },
    infiltration: {
      detected: true,
      severity: "Élevée",
      description: "Infiltrations directes affectant l'éclairage scialytique et le faux-plafond stérile, provoquant l'interruption des opérations chirurgicales."
    },
    degradation: {
      detected: true,
      severity: "Élevée",
      description: "Membrane d'étanchéité bitumineuse d'origine complètement craquelée et décollée sur les acrotères et joints de dilatation."
    },
    riskScore: 9.4,
    summary: "Défauts d'étanchéité structurels extrêmement graves compromettant la sécurité sanitaire et physique de l'infrastructure. Risque de contamination bactérienne par l'humidité.",
    recommendations: [
      "Décaper intégralement le revêtement bitumineux défectueux et la chape d'étanchéité désagrégée.",
      "Réaliser un traitement anti-corrosion en brossant et en passivant les armatures métalliques de la dalle de béton.",
      "Poser un nouveau complexe d'étanchéité bicouche élastomère SBS soudé à chaud, associé à une isolation thermique de 100mm en liège expansé d'origine algérienne locale.",
      "Appliquer un revêtement réflectif Cool Roof certifié blanc à haut albédo pour abaisser la température superficielle de la dalle."
    ],
    maintenanceStatus: "Clôturée",
    maintenanceTasks: [
      { id: "chu_t1", label: "Décaper intégralement le revêtement défectueux", completed: true },
      { id: "chu_t2", label: "Traitement anti-corrosion des armatures métalliques", completed: true },
      { id: "chu_t3", label: "Pose d'isolant thermique liège expansé local", completed: true },
      { id: "chu_t4", label: "Application du revêtement étanche et Cool Roof blanc", completed: true }
    ],
    maintenancePhotos: []
  },
  {
    id: "insp_chu_2",
    buildingName: "CHU Khelil Amrane",
    buildingType: "Santé",
    city: "Béjaïa (06)",
    address: "Boulevard de l'ALN, Béjaïa",
    latitude: 36.7562,
    longitude: 5.0620,
    imageUrl: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Visite de contrôle après la réalisation complète des travaux de rénovation de l'étanchéité.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-07-12T09:30:00Z",
    cracks: {
      detected: false,
      severity: "Aucune",
      description: "Toutes les fissures de dalle et d'acrotères ont été injectées sous pression et pontées avec succès."
    },
    humidity: {
      detected: true,
      severity: "Faible",
      description: "Humidité résiduelle en cours de séchage naturel au sein de la dalle de béton. Pas d'apport d'eau actif constaté."
    },
    infiltration: {
      detected: false,
      severity: "Aucune",
      description: "Parfaite imperméabilité constatée. Le test de mise en eau sur 48h s'est révélé concluant."
    },
    degradation: {
      detected: false,
      severity: "Aucune",
      description: "La nouvelle protection de résine polyuréthane continue (sans raccord vulnérable) assure une couverture impeccable."
    },
    riskScore: 1.8,
    summary: "Travaux d'étanchéité d'une excellente facture technique. Le bâtiment est parfaitement préservé, et le climatiseur de toiture a été posé sur patins d'amortissement.",
    recommendations: [
      "Planifier un contrôle visuel biannuel classique pour maintenir la propreté de la toiture.",
      "S'assurer que les accès techniques à la toiture restent fermés au personnel non autorisé pour préserver le Cool Roof."
    ],
    maintenanceStatus: "Clôturée",
    maintenanceTasks: [
      { id: "chu_t1", label: "Décaper intégralement le revêtement défectueux", completed: true },
      { id: "chu_t2", label: "Traitement anti-corrosion des armatures métalliques", completed: true },
      { id: "chu_t3", label: "Pose d'isolant thermique liège expansé local", completed: true },
      { id: "chu_t4", label: "Application du revêtement étanche et Cool Roof blanc", completed: true }
    ],
    maintenancePhotos: []
  },

  // --- APC de Béjaïa ---
  {
    id: "insp_apc_1",
    buildingName: "APC de Béjaïa",
    buildingType: "Administratif",
    city: "Béjaïa (06)",
    address: "Rue de la Liberté, Béjaïa Centre",
    latitude: 36.7512,
    longitude: 5.0561,
    imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Inspection après une série d'orages printaniers. Des infiltrations ont été signalées dans les bureaux d'état civil.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-03-05T09:00:00Z",
    cracks: {
      detected: true,
      severity: "Moyenne",
      description: "Plusieurs fissures d'origine thermique relevées au niveau des joints d'acrotères reliant la terrasse extérieure."
    },
    humidity: {
      detected: true,
      severity: "Élevée",
      description: "Présence d'auréoles d'humidité sur les plafonds administratifs et décollement marqué de la peinture intérieure."
    },
    infiltration: {
      detected: true,
      severity: "Moyenne",
      description: "Suintements d'eau récurrents sous forme de gouttes dans le hall d'accueil principal lors des averses importantes."
    },
    degradation: {
      detected: true,
      severity: "Moyenne",
      description: "Membrane d'asphalte d'origine brûlée et boursouflée par endroits sous l'action combinée des UV et du Sirocco."
    },
    riskScore: 7.4,
    summary: "Défauts d'étanchéité importants. Le défaut de drainage provoque une stagnation d'eau pluviale prolongée, aggravant le processus de corrosion.",
    recommendations: [
      "Nettoyer et dégager les conduits d'évacuation d'eaux pluviales (crapaudines encombrées par du sable).",
      "Traiter les fissures d'acrotères à l'aide d'un mortier fibré élastomère spécifique.",
      "Appliquer localement une résine polyuréthane d'étanchéité liquide SEL continue sur les zones d'ancrage."
    ],
    maintenanceStatus: "Planifiée",
    maintenanceTasks: [
      { id: "apc_t1", label: "Traitement des fissures d'acrotère", completed: true },
      { id: "apc_t2", label: "Pose de résine d'étanchéité liquide SEL", completed: true },
      { id: "apc_t3", label: "Curage technique des évacuations pluviales", completed: true },
      { id: "apc_t4", label: "Application du revêtement thermo-réflectif Cool Roof", completed: false }
    ],
    maintenancePhotos: []
  },
  {
    id: "insp_apc_2",
    buildingName: "APC de Béjaïa",
    buildingType: "Administratif",
    city: "Béjaïa (06)",
    address: "Rue de la Liberté, Béjaïa Centre",
    latitude: 36.7512,
    longitude: 5.0561,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Rapport de suivi après la pose de la membrane d'étanchéité de secours et le nettoyage complet des évacuations.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-07-10T14:30:00Z",
    cracks: {
      detected: true,
      severity: "Faible",
      description: "Les fissures majeures d'acrotère ont été consolidées. Seules quelques fissures inoffensives restent sous observation."
    },
    humidity: {
      detected: true,
      severity: "Faible",
      description: "Taux d'humidité réduit à 25% sous dalle, séchage presque complet de la zone d'état civil."
    },
    infiltration: {
      detected: false,
      severity: "Aucune",
      description: "Plus aucune infiltration n'est active dans l'enceinte de la mairie."
    },
    degradation: {
      detected: true,
      severity: "Faible",
      description: "Membrane superficiellement propre, en attente de l'application de la couche de finition réflective blanche."
    },
    riskScore: 3.2,
    summary: "L'état général du bâtiment est stabilisé et sécurisé. Le drainage fonctionne de manière impeccable.",
    recommendations: [
      "Procéder à la phase finale de protection thermique Cool Roof blanche pour prolonger la durée de vie de l'étanchéité réhabilitée.",
      "Inspecter à l'approche de la saison humide à l'automne."
    ],
    maintenanceStatus: "Planifiée",
    maintenanceTasks: [
      { id: "apc_t1", label: "Traitement des fissures d'acrotère", completed: true },
      { id: "apc_t2", label: "Pose de résine d'étanchéité liquide SEL", completed: true },
      { id: "apc_t3", label: "Curage technique des évacuations pluviales", completed: true },
      { id: "apc_t4", label: "Application du revêtement thermo-réflectif Cool Roof", completed: false }
    ],
    maintenancePhotos: []
  },

  // --- Université Abderrahmane Mira de Béjaïa ---
  {
    id: "insp_univ_1",
    buildingName: "Université Abderrahmane Mira de Béjaïa",
    buildingType: "Scolaire/Universitaire",
    city: "Béjaïa (06)",
    address: "Campus de Targa Ouzemour, Béjaïa",
    latitude: 36.7486,
    longitude: 5.0428,
    imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Inspection technique approfondie de la toiture du bâtiment de la bibliothèque centrale de l'université.",
    inspectorName: "Yacine Belkacem (Expert Diagnostiqueur)",
    inspectorEmail: "demo@batismart-roof.ai",
    date: "2026-02-15T11:00:00Z",
    cracks: {
      detected: true,
      severity: "Élevée",
      description: "Présence de crevasses d'étanchéité profondes à la jonction des dalles béton. Le joint d'étanchéité d'origine s'est totalement desséché."
    },
    humidity: {
      detected: true,
      severity: "Élevée",
      description: "Pénétration d'eau massive se manifestant par de larges moisissures et cloques noires au plafond de la salle de lecture."
    },
    infiltration: {
      detected: true,
      severity: "Moyenne",
      description: "Fuites régulières menaçant directement les étagères d'ouvrages scientifiques et le matériel informatique."
    },
    degradation: {
      detected: true,
      severity: "Élevée",
      description: "Membrane d'asphalte usée, montrant un pelage complet et des boursouflures d'eau sous-jacentes (cloquage avancé)."
    },
    riskScore: 8.2,
    summary: "Défauts d'étanchéité critiques. La toiture-terrasse ne remplit plus son rôle protecteur, créant un environnement insalubre pour les étudiants.",
    recommendations: [
      "Faire procéder en urgence à l'enlèvement de la végétation parasite et de la mousse accumulée dans les noues d'évacuation.",
      "Réaliser un traitement anticorrosion des armatures métalliques apparentes et un pontage souple des fissures d'acrotère.",
      "Planifier un décapage et une réfection bitumineuse SBS bicouche de l'ensemble de la toiture.",
      "Appliquer un revêtement thermo-réflectif Cool Roof blanc haut albédo pour abaisser la température superficielle et protéger du soleil."
    ],
    expertDecisionStatus: "Validé",
    expertName: "Dr. Yacine Belkacem",
    expertOrganization: "Contrôle Technique de Construction (CTC Béjaïa)",
    expertValidationDate: "2026-02-18T10:00:00Z",
    expertComments: "Dossier d'expertise IA et relevé photographique certifiés. La priorité de réhabilitation de la toiture de la bibliothèque centrale est officiellement validée.",
    maintenanceStatus: "En cours",
    maintenanceTasks: [
      { id: "univ_t1", label: "Enlèvement de la mousse & végétation parasite", completed: true },
      { id: "univ_t2", label: "Colmatage des joints de dilatation", completed: true },
      { id: "univ_t3", label: "Remise à niveau de la couche d'asphalte", completed: false },
      { id: "univ_t4", label: "Soudage de membranes élastomères SBS", completed: false }
    ],
    maintenancePhotos: []
  },
  {
    id: "insp_univ_2",
    buildingName: "Université Abderrahmane Mira de Béjaïa",
    buildingType: "Scolaire/Universitaire",
    city: "Béjaïa (06)",
    address: "Campus de Targa Ouzemour, Béjaïa",
    latitude: 36.7486,
    longitude: 5.0428,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1628533602410-b9df701fb61a?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Rapport de contrôle intermédiaire. Les travaux d'imperméabilisation d'urgence ont été effectués par l'équipe universitaire.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-07-11T10:15:00Z",
    cracks: {
      detected: true,
      severity: "Faible",
      description: "Fissures colmatées avec des joints souples élastomères. État jugé stable lors de l'examen mécanique."
    },
    humidity: {
      detected: true,
      severity: "Moyenne",
      description: "Humidité résiduelle notable en baisse progressive. La ventilation naturelle a été renforcée dans les salles touchées."
    },
    infiltration: {
      detected: false,
      severity: "Aucune",
      description: "Les infiltrations actives ont été stoppées. Aucun suintement constaté lors des dernières pluies d'été."
    },
    degradation: {
      detected: true,
      severity: "Moyenne",
      description: "Le revêtement nécessite toujours l'asphaltage complet définitif programmé pour la fin du mois."
    },
    riskScore: 4.8,
    summary: "Amélioration substantielle de l'intégrité de la structure. Les mesures d'urgence ont permis d'écarter le danger immédiat pesant sur les livres précieux.",
    recommendations: [
      "Poursuivre la réhabilitation définitive en posant la double couche bitumineuse asphalte SBS planifiée.",
      "Installer des pare-soleil ou stores thermiques pour protéger la surface."
    ],
    maintenanceStatus: "En cours",
    maintenanceTasks: [
      { id: "univ_t1", label: "Enlèvement de la mousse & végétation parasite", completed: true },
      { id: "univ_t2", label: "Colmatage des joints de dilatation", completed: true },
      { id: "univ_t3", label: "Remise à niveau de la couche d'asphalte", completed: false },
      { id: "univ_t4", label: "Soudage de membranes élastomères SBS", completed: false }
    ],
    maintenancePhotos: []
  },

  // --- Lycée Ibn Sina ---
  {
    id: "insp_lycee_1",
    buildingName: "Lycée Ibn Sina",
    buildingType: "Scolaire/Universitaire",
    city: "Béjaïa (06)",
    address: "Avenue des Frères Bouadou, Béjaïa",
    latitude: 36.7535,
    longitude: 5.0505,
    imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Visite annuelle de routine de l'établissement scolaire avant les examens du baccalauréat.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-04-10T11:00:00Z",
    cracks: {
      detected: true,
      severity: "Faible",
      description: "Légères fissures d'origine thermique relevées sur l'acrotère périphérique en béton. Pas d'effet structurel."
    },
    humidity: {
      detected: true,
      severity: "Moyenne",
      description: "Humidité locale détectée au niveau des angles d'acrotères à cause de l'accumulation de détritus (feuilles mortes de pins)."
    },
    infiltration: {
      detected: false,
      severity: "Aucune",
      description: "Aucune trace de fuite ou de pénétration d'eau active relevée dans les salles de classe sous-jacentes."
    },
    degradation: {
      detected: true,
      severity: "Moyenne",
      description: "La membrane montre un encrassement biologique (mousse verte) et des poussières fines obstruant le drainage."
    },
    riskScore: 5.8,
    summary: "Structure globalement saine mais exigeant un entretien courant de nettoyage pour parer à tout risque d'infiltration futur.",
    recommendations: [
      "Réaliser un nettoyage intégral des grilles pluviales d'évacuation (pose de crapaudines métalliques neuves).",
      "Éliminer la mousse parasite superficielle à l'aide d'un jet d'eau haute pression et de fongicide.",
      "Effectuer un pontage préventif des fissures d'acrotère."
    ],
    maintenanceStatus: "Non planifiée",
    maintenanceTasks: [
      { id: "lycee_t1", label: "Nettoyage des sables et feuilles mortes", completed: true },
      { id: "lycee_t2", label: "Pontage de fissures sur les joints d'acrotère", completed: false }
    ],
    maintenancePhotos: []
  },
  {
    id: "insp_lycee_2",
    buildingName: "Lycée Ibn Sina",
    buildingType: "Scolaire/Universitaire",
    city: "Béjaïa (06)",
    address: "Avenue des Frères Bouadou, Béjaïa",
    latitude: 36.7535,
    longitude: 5.0505,
    imageUrl: "https://images.unsplash.com/photo-1628533602410-b9df701fb61a?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1628533602410-b9df701fb61a?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Deuxième inspection de contrôle. Le nettoyage superficiel a été mené à bien par le service technique local.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-07-14T11:30:00Z",
    cracks: {
      detected: true,
      severity: "Faible",
      description: "Fissures d'acrotères stables. Toujours saines mais en attente du pontage au mastic polyuréthane fibré."
    },
    humidity: {
      detected: true,
      severity: "Faible",
      description: "L'humidité accumulée s'est évaporée suite au nettoyage complet de la terrasse."
    },
    infiltration: {
      detected: false,
      severity: "Aucune",
      description: "Absence totale d'infiltration."
    },
    degradation: {
      detected: true,
      severity: "Moyenne",
      description: "Membrane d'asphalte propre mais usée en surface par le soleil. À repeindre."
    },
    riskScore: 5.9,
    summary: "L'état général est stable et la circulation des eaux pluviales est entièrement rétablie. En attente de la budgétisation des travaux d'acrotères par la wilaya.",
    recommendations: [
      "Poursuivre la surveillance périodique de l'étanchéité.",
      "Procéder à la pose du mastic polyuréthane préconisé dès réception de la dotation budgétaire."
    ],
    maintenanceStatus: "Non planifiée",
    maintenanceTasks: [
      { id: "lycee_t1", label: "Nettoyage des sables et feuilles mortes", completed: true },
      { id: "lycee_t2", label: "Pontage de fissures sur les joints d'acrotère", completed: false }
    ],
    maintenancePhotos: []
  },

  // --- École El Hammadia ---
  {
    id: "insp_ecole_1",
    buildingName: "École El Hammadia",
    buildingType: "Scolaire/Universitaire",
    city: "Béjaïa (06)",
    address: "Rue El Hammadia, Béjaïa Centre",
    latitude: 36.7501,
    longitude: 5.0475,
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Inspection suite à des traces de suintement légères dans le réfectoire.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-03-20T14:00:00Z",
    cracks: {
      detected: true,
      severity: "Faible",
      description: "Micro-fissures d'étirement thermique constatées à proximité des bouches d'aération."
    },
    humidity: {
      detected: true,
      severity: "Faible",
      description: "Légère stagnation d'eau pluviale causée par une faible pente au niveau de la dalle d'évacuation."
    },
    infiltration: {
      detected: true,
      severity: "Faible",
      description: "Petites infiltrations d'eau diffuses (taches jaunâtres) sur le faux-plafond du réfectoire."
    },
    degradation: {
      detected: true,
      severity: "Faible",
      description: "La membrane d'étanchéité de bitume montre des signes de fatigue et d'usure de protection."
    },
    riskScore: 4.5,
    summary: "Désordres superficiels modérés. Un colmatage et une étanchéité liquide localisés permettront de régler les problèmes.",
    recommendations: [
      "Curer les tuyaux d'évacuation d'eaux pluviales de manière urgente.",
      "Appliquer un produit d'étanchéité temporaire au droit de la fissure de ventilation.",
      "Planifier un contrôle général après la saison des pluies."
    ],
    maintenanceStatus: "Planifiée",
    maintenanceTasks: [
      { id: "ecole_t1", label: "Traitement d'urgence des évacuations", completed: true },
      { id: "ecole_t2", label: "Pose d'étanchéité liquide provisoire", completed: false },
      { id: "ecole_t3", label: "Remplacement de la chape d'étanchéité", completed: false }
    ],
    maintenancePhotos: []
  },
  {
    id: "insp_ecole_2",
    buildingName: "École El Hammadia",
    buildingType: "Scolaire/Universitaire",
    city: "Béjaïa (06)",
    address: "Rue El Hammadia, Béjaïa Centre",
    latitude: 36.7501,
    longitude: 5.0475,
    imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Visite de réévaluation urgente après les intempéries majeures de fin de printemps.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-07-15T15:00:00Z",
    cracks: {
      detected: true,
      severity: "Moyenne",
      description: "Aggravation mécanique visible des micro-fissures d'étirement en fissures franches."
    },
    humidity: {
      detected: true,
      severity: "Élevée",
      description: "Infiltration d'eau active le long de la cage d'escalier, l'enduit de plâtre commence à s'effriter et à s'effondrer localement."
    },
    infiltration: {
      detected: true,
      severity: "Élevée",
      description: "Fuites d'eau directes dans les couloirs du premier étage et dans deux classes d'enseignement."
    },
    degradation: {
      detected: true,
      severity: "Élevée",
      description: "La membrane d'étanchéité bitumineuse est complètement déchirée et fissurée sous l'effet du gel printanier puis du soleil direct."
    },
    riskScore: 6.8,
    summary: "Situation s'étant nettement dégradée. Des réparations d'urgence doivent être engagées avant la rentrée scolaire d'automne pour garantir la sécurité des écoliers.",
    recommendations: [
      "Poser en urgence un système d'étanchéité provisoire (SEL de secours ou bâchage technique).",
      "Procéder à une réfection lourde de l'étanchéité de la zone sinistrée dès que possible."
    ],
    maintenanceStatus: "Planifiée",
    maintenanceTasks: [
      { id: "ecole_t1", label: "Traitement d'urgence des évacuations", completed: true },
      { id: "ecole_t2", label: "Pose d'étanchéité liquide provisoire", completed: false },
      { id: "ecole_t3", label: "Remplacement de la chape d'étanchéité", completed: false }
    ],
    maintenancePhotos: []
  },

  // --- Maison de la Culture de Béjaïa ---
  {
    id: "insp_maison_1",
    buildingName: "Maison de la Culture de Béjaïa",
    buildingType: "Culturel/Autre",
    city: "Béjaïa (06)",
    address: "Boulevard de l'ALN, Béjaïa",
    latitude: 36.7550,
    longitude: 5.0595,
    imageUrl: "https://images.unsplash.com/photo-1628533602410-b9df701fb61a?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1628533602410-b9df701fb61a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Inspection périodique de routine sur la toiture terrasse de la salle de spectacles.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-02-10T14:15:00Z",
    cracks: {
      detected: false,
      severity: "Aucune",
      description: "Pas de fissures visibles sur la dalle supérieure."
    },
    humidity: {
      detected: true,
      severity: "Faible",
      description: "Zones locales d'eau stagnante observées à cause de légers affaissements de la dalle."
    },
    infiltration: {
      detected: false,
      severity: "Aucune",
      description: "Absence de trace de suintement au niveau des faux-plafonds intérieurs."
    },
    degradation: {
      detected: true,
      severity: "Faible",
      description: "Usure normale de vieillissement de la protection extérieure."
    },
    riskScore: 3.2,
    summary: "Structure saine et fonctionnelle. Nécessite un entretien standard et annuel des gargouilles.",
    recommendations: [
      "Nettoyer les dalles de la terrasse technique.",
      "Appliquer un traitement hydrofuge superficiel préventif."
    ],
    maintenanceStatus: "Clôturée",
    maintenanceTasks: [
      { id: "maison_t1", label: "Nettoyage annuel des gargouilles", completed: true },
      { id: "maison_t2", label: "Application d'un vernis hydrofuge de protection", completed: true }
    ],
    maintenancePhotos: []
  },
  {
    id: "insp_maison_2",
    buildingName: "Maison de la Culture de Béjaïa",
    buildingType: "Culturel/Autre",
    city: "Béjaïa (06)",
    address: "Boulevard de l'ALN, Béjaïa",
    latitude: 36.7550,
    longitude: 5.0595,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1628533602410-b9df701fb61a?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Visite d'audit de routine de suivi, structure en excellent état.",
    inspectorName: "Yacine Belkacem",
    inspectorEmail: "expert.diagnostiqueur@batismart.dz",
    date: "2026-07-16T16:00:00Z",
    cracks: {
      detected: false,
      severity: "Aucune",
      description: "Aucun désordre physique constaté."
    },
    humidity: {
      detected: false,
      severity: "Aucune",
      description: "La toiture est parfaitement sèche, drainage impeccable suite au déblocage des tuyaux pluviaux."
    },
    infiltration: {
      detected: false,
      severity: "Aucune",
      description: "Excellente barrière d'étanchéité."
    },
    degradation: {
      detected: true,
      severity: "Faible",
      description: "Léger dépôt de poussières désertiques."
    },
    riskScore: 2.5,
    summary: "Bâtiment très bien entretenu. L'isolation et l'étanchéité fonctionnent de manière adéquate.",
    recommendations: [
      "Maintenir le plan d'entretien régulier chaque trimestre.",
      "Nettoyer les poussières de sable saharien après les épisodes de vent chaud."
    ],
    maintenanceStatus: "Clôturée",
    maintenanceTasks: [
      { id: "maison_t1", label: "Nettoyage annuel des gargouilles", completed: true },
      { id: "maison_t2", label: "Application d'un vernis hydrofuge de protection", completed: true }
    ],
    maintenancePhotos: []
  },
  // --- Personal User Inspections (Djihane Tamoum) ---
  {
    id: "insp_djihane_1",
    buildingName: "Bibliothèque Centrale - Université de Béjaïa",
    buildingType: "Scolaire/Universitaire",
    city: "Béjaïa (06)",
    address: "Campus Targua Ouzemmour, Béjaïa",
    latitude: 36.7512,
    longitude: 5.0561,
    imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615859131861-052f0641a60e?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Inspection complète de la toiture terrasse de la salle de lecture principale.",
    inspectorName: "Djihane Tamoum",
    inspectorEmail: "djihanetamoum@gmail.com",
    inspectorUid: "usr_djihanetamoum_gmail_com",
    date: "2026-03-10T11:00:00Z",
    cracks: {
      detected: true,
      severity: "Moyenne",
      description: "Fissures longitudinales au niveau des acrotères et des relevés d'étanchéité."
    },
    humidity: {
      detected: true,
      severity: "Élevée",
      description: "Infiltrations d'eau visibles sous forme d'auréoles d'humidité sur le plafond du 2ème étage."
    },
    infiltration: {
      detected: true,
      severity: "Moyenne",
      description: "Pénétration d'eau de pluie par le chéneau principal d'évacuation."
    },
    degradation: {
      detected: true,
      severity: "Moyenne",
      description: "Vieillissement et décollement de la membrane bitumineuse en périphérie."
    },
    riskScore: 7.8,
    summary: "Niveau de risque élevé nécessitant une réfection ciblée des relevés d'étanchéité et l'application d'un revêtement d'étanchéité liquide thermo-réflectif.",
    recommendations: [
      "Reprendre l'étanchéité des acrotères par pontage souple élastomère.",
      "Nettoyer les évacuations d'eaux pluviales obstruées.",
      "Appliquer une membrane d'étanchéité réflective Cool Roof."
    ],
    expertDecisionStatus: "Validé",
    expertName: "Dr. Yacine Belkacem",
    expertOrganization: "Contrôle Technique de Construction (CTC Béjaïa)",
    expertValidationDate: "2026-03-12T14:30:00Z",
    expertComments: "Expertise de terrain validée avec préconisation de travaux prioritaires.",
    maintenanceStatus: "En cours",
    maintenanceTasks: [
      { id: "djihane_t1", label: "Dégagement des gouttières et noues", completed: true },
      { id: "djihane_t2", label: "Reprise des relevés d'acrotères", completed: false },
      { id: "djihane_t3", label: "Application du revêtement Cool Roof", completed: false }
    ],
    maintenancePhotos: []
  },
  {
    id: "insp_djihane_2",
    buildingName: "Complexe Administratif Wilaya - Béjaïa",
    buildingType: "Administratif",
    city: "Béjaïa (06)",
    address: "Avenue de la Liberté, Béjaïa",
    latitude: 36.7530,
    longitude: 5.0580,
    imageUrl: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=800&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=800&q=80"
    ],
    notes: "Diagnostic préventif annuel des surfaces de toiture du bloc B.",
    inspectorName: "Djihane Tamoum",
    inspectorEmail: "djihanetamoum@gmail.com",
    inspectorUid: "usr_djihanetamoum_gmail_com",
    date: "2026-05-18T09:15:00Z",
    cracks: {
      detected: false,
      severity: "Aucune",
      description: "Aucune fissure majeure constatée sur la structure en béton."
    },
    humidity: {
      detected: true,
      severity: "Faible",
      description: "Légère stagnation d'eau localisée près de la sortie de toit."
    },
    infiltration: {
      detected: false,
      severity: "Aucune",
      description: "Pas d'infiltration constatée à l'intérieur des locaux."
    },
    degradation: {
      detected: true,
      severity: "Faible",
      description: "Décoloration superficielle du revêtement d'origine."
    },
    riskScore: 3.5,
    summary: "Bâtiment en bon état général. Maintenance préventive recommandée avant la saison hivernale.",
    recommendations: [
      "Appliquer un produit de protection hydrofuge.",
      "Vérifier le bon écoulement des eaux pluviales."
    ],
    expertDecisionStatus: "Validé",
    expertName: "Dr. Yacine Belkacem",
    expertOrganization: "CTC Béjaïa",
    expertValidationDate: "2026-05-20T10:00:00Z",
    expertComments: "Rapport conforme aux exigences d'entretien périodique.",
    maintenanceStatus: "Planifiée",
    maintenanceTasks: [
      { id: "djihane_b1", label: "Application du traitement hydrofuge", completed: false }
    ],
    maintenancePhotos: []
  }
];
