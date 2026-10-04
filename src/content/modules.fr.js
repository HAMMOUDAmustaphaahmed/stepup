// Textes par module (français). Les fonctionnalités se limitent à ce qui existe aujourd’hui dans le produit.

const modules = {
  audits: {
    name: 'Audits',
    summary: 'Construisez vos grilles d’audit, auditez sur le terrain et suivez chaque constat jusqu’à sa clôture.',
    features: [
      'Grilles d’audit avec sections et questions pondérées, notées par total pondéré, taux de conformité ou niveau de maturité (E à A)',
      '11 types de réponse : notes 0–5 et 0–10, Conforme / NC / NA, écart mineur ou majeur, mesures numériques…',
      'Sessions terrain avec GPS, photos obligatoires, signatures de l’auditeur et de l’audité, QR code par zone',
      'Constats avec 5 Pourquoi et Ishikawa, vérification d’efficacité et qualification des auditeurs',
    ],
  },
  quality: {
    name: 'Qualité / PDCA',
    summary: 'Enregistrez les non-conformités et les constats terrain, et menez des cycles Plan-Do-Check-Act jusqu’au bout.',
    features: [
      'Non-conformités par origine (client, fournisseur, audit, contrôle) et gravité, avec un circuit déclarée → analyse → action → vérification → close',
      'Cycles PDCA : indicateur, cible et échéance, causes racines avec analyse 5M, vérification de l’objectif et de qui l’a validé',
      'Étape Act qui enregistre le nouveau standard — document, révision, formation ou communication — avec preuves et historique complet',
      'Visites Gemba avec grilles et observations, audits 5S notés par S',
    ],
  },
  kaizen: {
    name: 'Kaizen',
    summary: 'Recueillez les idées d’amélioration de tous, examinez-les en comité et mesurez ce qu’elles rapportent.',
    features: [
      'Une idée déposée en quelques secondes en scannant un QR code en atelier',
      'Revue en comité avec votes (anonymes si vous le souhaitez), votes et commentaires des salariés',
      'Gains estimés et réels, avec retour sur investissement calculé automatiquement',
      'Campagnes, objectifs stratégiques, badges et historique des statuts non modifiable',
    ],
  },
  documents: {
    name: 'Documents',
    summary: 'Documents maîtrisés avec versions, circuits d’approbation et accusés « lu et compris ».',
    features: [
      'Espaces et dossiers avec règles de numérotation automatique',
      'Versions et modèles de circuit d’approbation : brouillon, relecture, approuvé',
      'Accusés de lecture signés et traçables pour chaque lecteur',
      'Dates de révision et d’expiration, niveaux de confidentialité, droits d’accès et journal d’audit',
    ],
  },
  meetings: {
    name: 'Réunions',
    summary: 'Planifiez et animez vos réunions, et transformez chaque décision en action suivie.',
    features: [
      'Réunions récurrentes avec participants et confirmations de présence',
      'Ordre du jour minuté, y compris des points de revue des KPI',
      'Compte rendu généré et envoyé automatiquement après la réunion',
      'Décisions, actions, « parking » pour les sujets annexes et questionnaires de satisfaction',
    ],
  },
  tasks: {
    name: 'Tâches',
    summary: 'Une seule boîte pour tout ce qui vous est assigné, quel que soit le module d’origine.',
    features: [
      'Une liste de travail unique avec statut et priorité',
      'Regroupe actions PDCA, constats, tâches projet, approbations de documents, Kaizen, actions de réunion et plans d’audit',
      'Reçoit aussi évaluations, activités CRM, demandes de congé, ordres de maintenance et tickets helpdesk',
      'Disponible dans l’application mobile sous « Mon travail »',
    ],
  },
  projects: {
    name: 'Projets',
    summary: 'Pilotez vos projets avec phases, jalons, tâches et vue Gantt.',
    features: [
      'Phases, jalons et tâches avec check-lists et suivi des blocages',
      'Vue en diagramme de Gantt',
      'Registre des problèmes et équipe projet',
      'Avancement consolidé, historique des statuts, commentaires et pièces jointes',
    ],
  },
  talents: {
    name: 'Talents',
    summary: 'Référentiel de compétences et matrice de polyvalence, avec des habilitations suivies avant qu’elles n’expirent.',
    features: [
      'Familles de compétences, fiches de poste avec niveaux requis, versionnées',
      'Compétences des salariés et analyse des écarts par rapport au poste',
      'Qualifications et habilitations avec alertes d’expiration à 90, 60, 30 et 7 jours',
      'Plans de succession, matrice 9-box, prévisions d’effectifs et parcours d’intégration',
    ],
  },
  evaluations: {
    name: 'Évaluations',
    summary: 'Entretiens annuels et de fin de période d’essai, feedback 360° et plans de développement.',
    features: [
      'Campagnes d’évaluation : auto-évaluation, manager, pairs, expert, observation Gemba et tests',
      'Feedback 360°, anonyme si besoin, avec calibration',
      'Feedback continu : entretiens individuels, points d’étape et retours ponctuels',
      'Plans et actions de développement, avec photographies de la performance',
    ],
  },
  training: {
    name: 'Formation',
    summary: 'Planifiez et suivez les formations, les budgets et les présences.',
    features: [
      'Plans de formation avec budget total, consommé et restant',
      'Formateurs avec coût journalier',
      'Sessions internes, externes, e-learning et en situation de travail, reliées aux compétences',
      'Besoins de formation issus des évaluations, inscriptions avec présence et résultats',
    ],
  },
  hr: {
    name: 'RH',
    summary: 'Dossiers salariés et administration RH au quotidien.',
    features: [
      'Sites, services, zones, postes et grilles de salaire',
      'Salariés, contrats et mobilités internes',
      'Types de congés, droits et demandes ; présences, heures supplémentaires comprises',
      'Bulletins de paie avec primes, retenues et impôts',
    ],
  },
  recruitment: {
    name: 'Recrutement',
    summary: 'Du besoin de recrutement au dossier salarié, sans rien ressaisir.',
    features: [
      'Demandes de recrutement avec circuit d’approbation',
      'Annonces, candidats, vivier et candidatures par étape de recrutement',
      'Entretiens avec retours structurés et recommandations',
      'Offres et négociation — « embaucher » crée automatiquement le salarié dans les RH',
    ],
  },
  crm: {
    name: 'CRM',
    summary: 'Prospects, comptes, contacts et pipeline commercial.',
    features: [
      'Prospects avec scores marketing et commercial, import Excel',
      'Comptes, contacts, territoires et équipes commerciales',
      'Pipelines et étapes avec probabilité, motifs de perte et historique',
      'Activités, devis, santé client, renouvellements et règles d’automatisation',
    ],
  },
  marketing: {
    name: 'Marketing',
    summary: 'Campagnes e-mail et WhatsApp et séquences automatisées qui alimentent le CRM.',
    features: [
      'Modèles d’e-mails en glisser-déposer',
      'Audiences et séquences automatisées en plusieurs étapes',
      'Campagnes avec variantes A/B et suivi UTM',
      'Suivi des ouvertures, clics et rebonds, liste d’exclusion et envoi WhatsApp',
    ],
  },
  sales: {
    name: 'Ventes',
    summary: 'Produits, listes de prix et commandes clients.',
    features: [
      'Produits avec catégories, variantes et unités',
      'Listes de prix avec remises, formules et paliers de quantité',
      'Commandes clients du brouillon à la livraison, avec quantités livrées et facturées',
      'Politique de facturation à la commande ou à la livraison',
    ],
  },
  purchase: {
    name: 'Achats',
    summary: 'Demandes de prix et commandes fournisseurs.',
    features: [
      'Demandes de prix et bons de commande',
      'Circuit d’approbation : en attente, approuvé, refusé',
      'Quantités reçues suivies par ligne',
      'Listes de prix fournisseurs',
    ],
  },
  accounting: {
    name: 'Comptabilité',
    summary: 'Tenue comptable, facturation et états financiers.',
    features: [
      'Plan comptable, taxes et conditions de paiement',
      'Journaux et écritures avec validation et extourne',
      'Factures clients, factures fournisseurs, avoirs et paiements, multi-devises',
      'Compte de résultat, balances âgées clients et fournisseurs',
    ],
  },
  reporting: {
    name: 'Reporting',
    summary: 'Construisez vos tableaux de bord et indicateurs à partir des données de tous les modules.',
    features: [
      'Tableaux de bord avec cartes KPI, courbes, barres, secteurs et tableaux',
      'Définitions de KPI partagées dans toute l’entreprise',
      'Jeux de données, mesures et rapports multi-pages',
      'Envoi programmé en PDF, Excel ou CSV',
    ],
  },
  inventory: {
    name: 'Stocks',
    summary: 'Entrepôts, emplacements et stocks.',
    features: [
      'Entrepôts et emplacements',
      'Lots et numéros de série avec dates de péremption',
      'Transferts et mouvements de stock',
      'Règles de réapprovisionnement et valorisation (coût moyen ou FIFO)',
    ],
  },
  manufacturing: {
    name: 'Production',
    summary: 'Planification et exécution de la production.',
    features: [
      'Postes de charge avec capacité, efficacité, coût horaire et objectif de TRS',
      'Gammes et opérations',
      'Nomenclatures et composants',
      'Ordres de fabrication, ordres de travail et déclarations de rebut',
    ],
  },
  maintenance: {
    name: 'Maintenance',
    summary: 'Gardez vos équipements en état avec des plans préventifs et des ordres de travail suivis.',
    features: [
      'Équipements, catégories et équipes de maintenance',
      'Plans préventifs déclenchés par intervalle fixe ou par relevé de compteur',
      'Ordres de travail préventifs et correctifs avec étapes et pièces',
      'Demandes d’intervention et calendrier de maintenance',
    ],
  },
  iot: {
    name: 'IoT',
    summary: 'Connectez les capteurs machines, suivez les mesures en direct et soyez alerté.',
    features: [
      'Équipements — capteurs, compteurs, automates, caméras — en MQTT, HTTP ou WebSocket',
      'Mesures diffusées en direct à l’écran',
      'Règles d’alerte : au-dessus, en dessous, égal ou hors plage',
      'Événements d’alerte avec notifications',
    ],
  },
  helpdesk: {
    name: 'Helpdesk',
    summary: 'Tickets de support internes ou clients avec niveaux de service.',
    features: [
      'Types de tickets et équipes de support',
      'Politiques SLA avec délais de première réponse et de résolution par ticket',
      'Canaux e-mail, portail et téléphone, avec notes internes',
      'Base de connaissances avec catégories et articles',
    ],
  },
}

export default modules
