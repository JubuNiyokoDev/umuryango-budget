export const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    budget: 'Budget',
    history: 'Historique',
    settings: 'Paramètres',

    // Home Screen
    monthlyCalendar: 'Calendrier du mois',
    today: "Aujourd'hui",
    selectMonth: 'Sélectionner le mois',

    // Day Details
    dayDetails: 'Détails du jour',
    morning: 'Matin',
    noon: 'Midi',
    evening: 'Soir',
    addItem: 'Ajouter un article',
    itemName: "Nom de l'article",
    price: 'Prix',
    total: 'Total',
    validateDay: 'Valider le jour',
    dayValidated: 'Jour validé',
    dayCannotBeEdited: 'Ce jour ne peut plus être modifié',
    contributor: 'Contributeur',

    // Budget Screen
    monthlyBudget: 'Budget mensuel',
    automaticBudget: 'Budget automatique',
    totalBudget: 'Budget total',
    consumed: 'Consommé',
    remaining: 'Restant',
    setBudget: 'Définir le budget',
    contributors: 'Contributeurs',
    addContributor: 'Ajouter un contributeur',
    contributorName: 'Nom du contributeur',
    contribution: 'Contribution',
    paid: 'Payé',
    shouldContribute: 'Doit contribuer',
    overpaid: 'Surplus',

    // History
    historyTitle: 'Historique',
    noHistory: 'Aucun historique disponible',
    statistics: 'Statistiques',
    monthlyStats: 'Statistiques mensuelles',

    // Status
    planned: 'Planifié',
    validated: 'Validé',
    pending: 'En attente',

    // Spending levels
    lowSpending: 'Dépenses faibles',
    mediumSpending: 'Dépenses moyennes',
    highSpending: 'Dépenses élevées',

    // Statistics
    daysValidated: 'Jours validés',
    daysPlanned: 'Jours planifiés',
    averagePerDay: 'Moyenne par jour',
    totalPlanned: 'Total planifié',
    totalConsumed: 'Total consommé',
    remainingAmount: 'Montant restant',
    expensesPerMeal: 'Dépenses par repas',

    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    currency: 'BIF',
    confirm: 'Confirmer',
    error: 'Erreur',
    success: 'Succès',
    loading: 'Chargement...',

    // New features
    theme: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    security: 'Sécurité',
    pin: 'PIN',
    createPin: 'Créer un PIN',
    enterPin: 'Entrer le PIN',
    verifyPin: 'Vérifier le PIN',
    deleteData: 'Supprimer les données',
    selectDataToDelete: 'Sélectionner les données à supprimer',
    deleteAll: 'Tout supprimer',

    // Messages
    budgetCalculatedAutomatically:
      'Le budget est calculé automatiquement selon vos planifications',
    dayValidatedSuccessfully: 'Jour validé avec succès',
    cannotEditValidatedDay: 'Impossible de modifier un jour validé',
    enterValidAmount: 'Veuillez entrer un montant valide',
    contributorAdded: 'Contributeur ajouté avec succès',
    pinRequired: 'PIN requis pour cette action',
    dataDeletedSuccessfully: 'Données supprimées avec succès',
    budgetRequiredForContributors:
      'Un budget planifié est requis pour ajouter des contributeurs',
    secureYourApp: 'Sécurisez votre application',
    pinSetupDescription:
      'Pour protéger vos données budgétaires, veuillez créer un PIN de sécurité. Ce PIN sera requis pour supprimer des données.',
    createYourPin: 'Créer votre PIN',
    choosePinDescription: 'Choisissez un PIN de 4 chiffres',
    pinRequiredForDeletion: 'PIN de sécurité requis pour supprimer des données',

    // Import/Export
    importExport: 'Import/Export',
    exportData: 'Exporter les données',
    importData: 'Importer les données',
    exportDescription: 'Exporter toutes vos données budgétaires',
    importDescription: 'Importer des données depuis un autre appareil',
    exportSuccess: 'Données exportées avec succès',
    importSuccess: 'Données importées et fusionnées avec succès',
    selectFile: 'Sélectionner un fichier',
    invalidFile: 'Fichier invalide ou corrompu',
    dataWillBeMerged:
      'Les données seront fusionnées avec vos données existantes',
    newDataPriority:
      'En cas de conflit, les nouvelles données seront prioritaires',
    exportInProgress: 'Export en cours...',
    importInProgress: 'Import en cours...',
    shareData: 'Partager les données',

    // Settings sections
    dataManagement: 'Gestion des données',
    about: 'À propos',
    features: 'Fonctionnalités',
    appearance: 'Apparence',
    language: 'Langue',
    currentLanguage: 'Langue actuelle',

    // Data management
    localDataStorage:
      "Toutes vos données sont stockées localement sur votre appareil.\nAucune information n'est envoyée vers des serveurs externes.",
    deleteDataButton: 'Supprimer des données',

    // About section
    version: 'Version',
    developedWith: 'Développé avec',

    // Features list
    interactiveCalendar: '• Calendrier mensuel interactif',
    dailyMealTracking: '• Suivi des repas quotidiens',
    monthlyBudgetManagement: '• Gestion du budget mensuel',
    expenseHistory: '• Historique des dépenses',
    multilingualSupport: '• Support multilingue (FR/RN)',
    secureLocalStorage: '• Stockage local sécurisé',
    lightDarkThemes: '• Thèmes clair et sombre',
    pinProtection: '• Protection par PIN',

    // Budget messages
    noContributorsAdded: 'Aucun contributeur ajouté',
    monthSummary: 'Résumé du mois',

    // Common labels that were missing
    totalBudgetLabel: 'Budget total',
    consumedLabel: 'Consommé',
    remainingLabel: 'Restant',
    validatedDaysLabel: 'Jours validés',
    plannedDaysLabel: 'Jours planifiés',

    // Months
    january: 'Janvier',
    february: 'Février',
    march: 'Mars',
    april: 'Avril',
    may: 'Mai',
    june: 'Juin',
    july: 'Juillet',
    august: 'Août',
    september: 'Septembre',
    october: 'Octobre',
    november: 'Novembre',
    december: 'Décembre',

    // Days of week
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',

    // Additional common texts
    configured: 'Configuré',
    notConfigured: 'Non configuré',
    french: 'Français',
    kirundi: 'Kirundi',

    // Messages
    planFirstBudget:
      "Planifiez d'abord votre budget mensuel pour ajouter des contributeurs",
    fileCreated: 'Fichier créé',
    fileLocation: 'Emplacement',
    fileSavedInApp: "Le fichier est sauvegardé dans l'application",
    exportCancelled: 'Export annulé',
    permissionDenied: 'Permission refusée',
    cannotSaveAutomatically: 'Impossible de sauvegarder automatiquement',
    chooseWhereToSave: 'Choisir où sauvegarder le fichier',
    saveInDownloads: 'Sauvegarder dans Downloads',
    saveFile: 'Sauvegarder le fichier',
    fileSaved: 'Fichier sauvegardé',
    fileReadyToBeSaved: 'Fichier prêt à être sauvegardé',

    // Budget calculation message
    budgetCalculatedFromMeals:
      'Le budget est calculé automatiquement selon vos planifications',
    daysOfMonth: 'Jours du mois',

    // Additional missing translations
    noItemsAdded: 'Aucun article ajouté',
    spendingLevel: 'Niveau de dépenses',
    currentMonth: 'Mois actuel',
    dayOfWeek: 'Jour de la semaine',

    // Day names short
    sun: 'Dim',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mer',
    thu: 'Jeu',
    fri: 'Ven',
    sat: 'Sam',

    // Numbers for days
    day1: '1',
    day2: '2',
    day3: '3',
    day4: '4',
    day5: '5',
    day6: '6',
    day7: '7',
    day8: '8',
    day9: '9',
    day10: '10',
    day11: '11',
    day12: '12',
    day13: '13',
    day14: '14',
    day15: '15',
    day16: '16',
    day17: '17',
    day18: '18',
    day19: '19',
    day20: '20',
    day21: '21',
    day22: '22',
    day23: '23',
    day24: '24',
    day25: '25',
    day26: '26',
    day27: '27',
    day28: '28',
    day29: '29',
    day30: '30',
    day31: '31',

    // Status messages
    dataExportedSuccessfully: 'Données exportées avec succès',
    chooseWhereToSaveFile: 'Choisissez où sauvegarder le fichier',
    fileSavedSuccessfully: 'Fichier sauvegardé avec succès',

    // Common UI elements
    close: 'Fermer',
    open: 'Ouvrir',
    back: 'Retour',
    next: 'Suivant',

    // Data Deletion Modal
    selectAtLeastOneMonth: 'Veuillez sélectionner au moins un mois à supprimer',
    confirmDeletion: 'Confirmer la suppression',
    confirmDeletionMessage:
      'Êtes-vous sûr de vouloir supprimer {items} ?\n\nCette action est irréversible.',
    cannotDeleteData: 'Impossible de supprimer les données',
    selectDataToDeleteDescription:
      'Sélectionnez les données à supprimer. Votre PIN sera requis pour confirmer.',
    deleteAllData: 'Supprimer toutes les données',
    deleteAllDataDescription:
      "Efface complètement l'historique et toutes les données",
    orSelectSpecificMonths: 'Ou sélectionnez des mois spécifiques:',
    allData: 'toutes les données',

    // Settings alerts
    whatWouldYouLikeToDo: 'Que souhaitez-vous faire?',
    modifyPin: 'Modifier le PIN',
    deletePin: 'Supprimer le PIN',
    pinVerified: 'PIN vérifié',
    pinDeletedSuccessfully: 'PIN supprimé avec succès',
    allDataDeleted: 'Toutes les données ont été supprimées',
    pinCreatedSuccessfully: 'PIN créé avec succès',
    exportDataDescription:
      'Vos données seront sauvegardées dans un fichier JSON sur votre téléphone.\n\nLe fichier sera créé dans le dossier UmuryangoBudget accessible depuis vos fichiers.',
    cannotExportData: "Impossible d'exporter les données",

    // Budget alerts
    budgetRequired: 'Budget requis',
    budgetRequiredMessage:
      "Vous devez d'abord planifier un budget pour ce mois avant d'ajouter des contributeurs. Planifiez vos repas dans le calendrier pour générer automatiquement le budget.",
    fillAllFields: 'Veuillez remplir tous les champs',
    cannotAddContributor: "Impossible d'ajouter le contributeur",
    updatePayment: 'Mettre à jour le paiement',
    enterNewPaidAmount: 'Entrez le nouveau montant payé:',
    paymentUpdated: 'Paiement mis à jour',
    cannotUpdatePayment: 'Impossible de mettre à jour le paiement',

    // MealSection
    pleaseEnterValidPrice: 'Veuillez entrer un prix valide',
    deleteItem: "Supprimer l'article",
    confirmDeleteItem: 'Êtes-vous sûr de vouloir supprimer cet article?',
    by: 'Par',
    previous: 'Précédent',

    // Planning Actions
    planningActions: 'Actions de planification',
    copyDay: 'Copier la journée',
    pasteDay: 'Coller la journée',
    duplicateDay: 'Dupliquer',
    bulkPlan: 'Planification par lot',
    copied: 'Copié!',
    dayOf: 'Journée du',
    elements: 'éléments',
    mealCopied: 'Repas copié avec succès',
    cannotPasteDifferentMealType:
      'Vous ne pouvez coller que le même type de repas',
    replaceContent: 'Remplacer le contenu ?',
    mealAlreadyHasItems:
      'Ce repas contient déjà des éléments. Voulez-vous les remplacer ?',
    replace: 'Remplacer',
    duplicateTo: 'Dupliquer vers quels jours ?',
    planMultipleDays: 'Planifier plusieurs jours',
    selectAtLeastOneDate: 'Sélectionnez au moins une date',
    duplicateToSelected: 'Dupliquer vers {count} jour(s) sélectionné(s) ?',
    planningDuplicatedSuccessfully: 'Planification dupliquée avec succès',
    planningAppliedToMultipleDays: 'Planification appliquée à {count} jour(s)',
    clipboardInfo: 'Copié: {info}',
    morningMeal: 'Matin',
    noonMeal: 'Midi',
    eveningMeal: 'Soir',

    // Meal times
    breakfast: 'Petit-déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',

    // Calendar
    tomorrow: 'Demain',
    yesterday: 'Hier',

    // Budget status
    budgetExceeded: 'Budget dépassé',
    budgetOnTrack: 'Budget respecté',
    noBudgetSet: 'Aucun budget défini',

    // Validation
    pleaseEnterValidAmount: 'Veuillez entrer un montant valide',
    pleaseEnterItemName: "Veuillez entrer le nom de l'article",
    fieldRequired: 'Champ requis',

    // Export/Import additional
    processingData: 'Traitement des données...',

    // Settings additional
    resetApp: "Réinitialiser l'application",
    clearAllData: 'Effacer toutes les données',
    backupData: 'Sauvegarder les données',
    restoreData: 'Restaurer les données',

    // Notifications
    budgetAlert: 'Alerte budget',
    dailyReminder: 'Rappel quotidien',
    weeklyReport: 'Rapport hebdomadaire',

    // Time periods
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel',

    // Actions
    duplicate: 'Dupliquer',
    copy: 'Copier',
    paste: 'Coller',
    cut: 'Couper',
    undo: 'Annuler',
    redo: 'Refaire',

    // Status indicators
    online: 'En ligne',
    offline: 'Hors ligne',
    syncing: 'Synchronisation...',
    synced: 'Synchronisé',

    // File operations
    fileNotFound: 'Fichier non trouvé',
    fileCorrupted: 'Fichier corrompu',
    fileTooLarge: 'Fichier trop volumineux',
    fileUploaded: 'Fichier téléchargé',

    // Permissions
    permissionRequired: 'Permission requise',
    grantPermission: 'Accorder la permission',
    permissionGranted: 'Permission accordée',

    // Network
    noInternetConnection: 'Pas de connexion Internet',
    connectionLost: 'Connexion perdue',
    reconnecting: 'Reconnexion...',
    connected: 'Connecté',

    // Day details additional
    information: 'Information',
    warning: 'Attention',
    dayAlreadyValidated: 'Ce jour est déjà validé',
    noMealsPlannedValidateAnyway:
      'Aucun repas planifié pour ce jour. Voulez-vous quand même valider?',
    validateDayConfirmation:
      'Valider ce jour avec un total de {amount} {currency}?\n\nUne fois validé, ce jour ne pourra plus être modifié.',
    notPlanned: 'Non planifié',
    status: 'Statut',
    validatedOn: 'Validé le',
    readOnlyModePastDay: 'Mode lecture seule - Jour passé',
    noPlanningForThisDay: 'Aucune planification pour ce jour',
    pastDayNoMealsPlanned:
      "Ce jour est passé et n'avait pas de repas planifiés",
    dateNotSpecified: 'Date non spécifiée',

    // Month names in French (for translation mapping)
    janvier: 'Janvier',
    février: 'Février',
    mars: 'Mars',
    avril: 'Avril',
    mai: 'Mai',
    juin: 'Juin',
    juillet: 'Juillet',
    août: 'Août',
    septembre: 'Septembre',
    octobre: 'Octobre',
    novembre: 'Novembre',
    décembre: 'Décembre',

    // PIN Modal
    pinMustBe4Digits: 'Le PIN doit contenir au moins 4 chiffres',
    pinsDoNotMatch: 'Les PINs ne correspondent pas',
    cannotCreatePin: 'Impossible de créer le PIN',
    errorCreatingPin: 'Une erreur est survenue lors de la création du PIN',
    pleaseEnterPin: 'Veuillez entrer votre PIN',
    incorrectPin: 'PIN incorrect',
    errorVerifyingPin: 'Une erreur est survenue lors de la vérification du PIN',
    confirmPin: 'Confirmer le PIN',
    createSecurityPin: 'Créez un PIN de sécurité pour protéger vos données',
    confirmYourPin: 'Confirmez votre PIN',
  },
  rn: {
    // Navigation
    home: 'Ku rugo',
    budget: "Ingengo y'amafaranga",
    history: 'Amateka',
    settings: 'Amagenekerezo',

    // Home Screen
    monthlyCalendar: "Kalandari y'ukwezi",
    today: 'Uyu musi',
    selectMonth: 'Hitamwo ukwezi',

    // Day Details
    dayDetails: "Ibisobanuro vy'umusi",
    morning: 'Bukeye',
    noon: "Isaha z'umuhingamo",
    evening: 'Nimugoroba',
    addItem: 'Shiramwo ikintu',
    itemName: "Izina ry'ikintu",
    price: 'Igiciro',
    total: 'Igiteranyo',
    validateDay: 'Emeza umusi',
    dayValidated: 'Umusi wemejwe',
    dayCannotBeEdited: 'Umusi ntiwashobora guhindurwa',
    contributor: 'Uwugabura',

    // Budget Screen
    monthlyBudget: "Ingengo y'amafaranga y'ukwezi",
    automaticBudget: "Ingengo y'amafaranga yikora",
    totalBudget: 'Ingengo yose',
    consumed: 'Vyakoreshejwe',
    remaining: 'Vyasigaye',
    setBudget: 'Tegura ingengo',
    contributors: 'Abagabura',
    addContributor: 'Shiramwo uwundi agabura',
    contributorName: "Izina ry'uwugabura",
    contribution: 'Uruhare',
    paid: 'Yaratanzeko',
    shouldContribute: 'Agomba gutanga',
    overpaid: 'Yarenze',

    // History
    historyTitle: 'Amateka',
    noHistory: 'Nta mateka ahari',
    statistics: 'Ibiharuro',
    monthlyStats: "Ibiharuro vy'ukwezi",

    // Status
    planned: 'Vyateguwe',
    validated: 'Vyemejwe',
    pending: 'Birindiriye',

    // Spending levels
    lowSpending: 'Amafaranga make',
    mediumSpending: 'Amafaranga hagati',
    highSpending: 'Amafaranga menshi',

    // Statistics
    daysValidated: 'Imisi yemejwe',
    daysPlanned: 'Imisi yateguwe',
    averagePerDay: 'Impuzandengo ku musi',
    totalPlanned: 'Vyose vyateguwe',
    totalConsumed: 'Vyose vyakozweko',
    remainingAmount: 'Amafaranga asigaye',
    expensesPerMeal: 'Amafaranga ku funguro',

    // Common
    save: 'Bika',
    cancel: 'Oya',
    delete: 'Futa',
    edit: 'Hindura',
    add: 'Shiramwo',
    currency: 'BIF',
    confirm: 'Emeza',
    error: 'Ikosa',
    success: 'Vyagenze neza',
    loading: 'Biriko birakorwa...',

    // New features
    theme: 'Insiguro',
    light: 'Umuco',
    dark: 'Umwiza',
    system: 'Sisiteme',
    security: 'Umutekano',
    pin: 'PIN',
    createPin: 'Kora PIN',
    enterPin: 'Injiza PIN',
    verifyPin: 'Raba neza PIN',
    deleteData: 'Futa amakuru',
    selectDataToDelete: 'Hitamwo amakuru yosibwa',
    deleteAll: 'Futa vyose',

    // Messages
    budgetCalculatedAutomatically:
      "Ingengo y'amafaranga ibarwa ukurikije uko wayiteguye",
    dayValidatedSuccessfully: 'Umusi wemejwe neza',
    cannotEditValidatedDay: 'Umusi wemejwe ntiwahindurwa',
    enterValidAmount: 'Injiza amafaranga yemewe',
    contributorAdded: 'Uwugabura yarongewe neza',
    pinRequired: 'PIN irakenewe kugira ubandanye',
    dataDeletedSuccessfully: 'Amakuru yasibwe neza',
    budgetRequiredForContributors:
      'Ugomba kubanza utegure ingengo kugira wongere abagabura',
    secureYourApp: 'Rinda porogaramu yawe',
    pinSetupDescription:
      "Gushitsa umutekano w'amakuru yawe, tegura PIN. Izokoreshwa mu guFuta amakuru.",
    createYourPin: 'Kora PIN yawe',
    choosePinDescription: "Hitamwo PIN y'ibiharuro 4",
    pinRequiredForDeletion: 'PIN irakenewe kugira usibe amakuru',

    // Import/Export
    importExport: 'Kwinjiza/Kusohora',
    exportData: 'Sohora amakuru',
    importData: 'Injiza amakuru',
    exportDescription: 'Sohora amakuru yawe yose',
    importDescription: 'Injiza amakuru avuye ku kindi gikoresho',
    exportSuccess: 'Amakuru yasohowe neza',
    importSuccess: 'Amakuru yinjijwe neza',
    selectFile: 'Hitamwo dosiye',
    invalidFile: 'Dosiye yangiritse canke atariyo',
    dataWillBeMerged: "Amakuru azohuzwa n'ayo usanzwe ufise",
    newDataPriority: 'Iyo haba urwanko, amakuru mashasha niyo yihuta',
    exportInProgress: 'Biriko bisohoka...',
    importInProgress: 'Biriko binjizwa...',
    shareData: 'Sangira amakuru',

    // Settings sections
    dataManagement: 'Gucunga amakuru',
    about: 'Ibijanye na',
    features: 'Ibikora',
    appearance: 'Isura',
    language: 'Ururimi',
    currentLanguage: 'Ururimi uriko ukoresha',

    // Data management
    localDataStorage:
      'Amakuru yawe yose abikwa kuri iki gikoresho.\nNta makuru yoherezwa hanze.',
    deleteDataButton: 'Futa amakuru',

    // About section
    version: 'Verisiyo',
    developedWith: 'Vyakozwe hakoreshejwe',

    // Features list
    interactiveCalendar: "• Kalandari y'ukwezi ikora neza",
    dailyMealTracking: "• Gukurikirana ivy'ibiribwa vy'umusi ku musi",
    monthlyBudgetManagement: "• Gucunga ingengo y'amafaranga y'ukwezi",
    expenseHistory: "• Amateka y'amafaranga yakoreshejwe",
    multilingualSupport: "• Inkunga y'indimi nyinshi (FR/RN)",
    secureLocalStorage: '• Kubika amakuru mu mutekano',
    lightDarkThemes: '• Ico kugaragara mu muco no mu mwiza',
    pinProtection: '• Kurinda na PIN',

    // Budget messages
    noContributorsAdded: 'Nta wundi agabura yarongewe',
    monthSummary: "Incamake y'ukwezi",

    // Common labels
    totalBudgetLabel: 'Ingengo yose',
    consumedLabel: 'Vyakoreshejwe',
    remainingLabel: 'Vyasigaye',
    validatedDaysLabel: 'Imisi yemejwe',
    plannedDaysLabel: 'Imisi yateguwe',

    // Months (Ikirundi ciza)
    january: 'Nzero',
    february: 'Ruhuhuma',
    march: 'Ntwarante',
    april: 'Ndamukiza',
    may: 'Rusama',
    june: 'Ruheshi',
    july: 'Mukakaro',
    august: 'Myandagaro',
    september: 'Nyakanga',
    october: 'Gitugutu',
    november: 'Munyonyo',
    december: 'Kigarama',

    // Days of week
    monday: 'Ku wa mbere',
    tuesday: 'Ku wa kabiri',
    wednesday: 'Ku wa gatatu',
    thursday: 'Ku wa kane',
    friday: 'Ku wa gatanu',
    saturday: 'Ku wa gatandatu',
    sunday: "Ku w'Imana",

    // Additional common texts
    configured: 'Vyateguwe',
    notConfigured: 'Ntivyateguwe',
    french: 'Igifaransa',
    kirundi: 'Ikirundi',

    // Messages
    planFirstBudget:
      "Tegura ubwa mbere ingengo y'ukwezi kugira wongere abagabura",
    fileCreated: 'Dosiye yaremwe',
    fileLocation: 'Aho iri',
    fileSavedInApp: 'Dosiye ibitswe muri porogaramu',
    exportCancelled: 'Kusohora vyahagaritswe',
    permissionDenied: 'Uruhushya rwankwe',
    cannotSaveAutomatically: 'Ntishobora kubikwa yonyene',
    chooseWhereToSave: 'Hitamwo aho kubika dosiye',
    saveInDownloads: 'Bika mu bikurura',
    saveFile: 'Bika dosiye',
    fileSaved: 'Dosiye yabitswe',
    fileReadyToBeSaved: 'Dosiye yiteguye kubikwa',

    // Budget calculation message
    budgetCalculatedFromMeals:
      "Ingengo y'amafaranga ibarwa ukurikije ivy'imirinduro yawe",
    daysOfMonth: "Imisi y'ukwezi",

    // PIN Modal
    pinMustBe4Digits: 'PIN igomba kuba ifise nibura imibare 4',
    pinsDoNotMatch: 'PIN ntizihura',
    cannotCreatePin: 'Ntishobora gukora PIN',
    errorCreatingPin: 'Habaye ikosa mu gukora PIN',
    pleaseEnterPin: 'Injiza PIN yawe',
    incorrectPin: 'PIN si nayo',
    errorVerifyingPin: 'Habaye ikosa mu kugenzura PIN',
    confirmPin: 'Emeza PIN',
    createSecurityPin: "Kora PIN y'umutekano kugirango urinde amakuru yawe",
    confirmYourPin: 'Emeza PIN yawe',
    next: 'Komeza',

    // Data Deletion Modal
    selectAtLeastOneMonth: 'Hitamo nibura ukwezi kumwe wo gusiba',
    confirmDeletion: 'Emeza gusiba',
    confirmDeletionMessage:
      'Uremeza gusiba {items} ?\n\nIki gikorwa ntikizongera gusubizwa.',
    cannotDeleteData: 'Ntishobora gusiba amakuru',
    selectDataToDeleteDescription:
      'Hitamo amakuru wo gusiba. PIN yawe izakenwa kugirango wemeze.',
    deleteAllData: 'Siba amakuru yose',
    deleteAllDataDescription: "Gusiba burundu amateka n'amakuru yose",
    orSelectSpecificMonths: 'Canke hitamo amezi runaka:',
    allData: 'amakuru yose',

    // Settings alerts
    whatWouldYouLikeToDo: 'Ushaka gukora iki?',
    modifyPin: 'Hindura PIN',
    deletePin: 'Siba PIN',
    pinVerified: 'PIN yemejwe',
    pinDeletedSuccessfully: 'PIN yasibwe neza',
    allDataDeleted: 'Amakuru yose yasibwe',
    pinCreatedSuccessfully: 'PIN yaremwe neza',
    exportDataDescription:
      'Amakuru yawe azabikwa mu dosiye ya JSON kuri terefone yawe.\n\nDosiye izaremwa mu bubiko bwa UmuryangoBudget bushobora kuboneka mu madosiye yawe.',
    cannotExportData: 'Ntishobora gusohora amakuru',

    // Budget alerts
    budgetRequired: "Ingengo y'imari irakenewe",
    budgetRequiredMessage:
      "Ugomba kubanza utegure ingengo y'imari y'uku kwezi mbere yo kongera abatanze. Tegura ibiryo byawe mu kalindari kugirango hakorwe ingengo y'imari wenyine.",
    fillAllFields: 'Uzuza ibice byose',
    cannotAddContributor: 'Ntishobora kongera uwatanze',
    updatePayment: 'Vugurura kwishyura',
    enterNewPaidAmount: 'Injiza amafaranga mashya yishyuwe:',
    paymentUpdated: 'Kwishyura byavuguruwe',
    cannotUpdatePayment: 'Ntishobora kuvugurura kwishyura',

    // MealSection
    pleaseEnterValidPrice: 'Injiza igiciro nyacyo',
    deleteItem: 'Siba ikintu',
    confirmDeleteItem: 'Uremeza gusiba iki kintu?',
    by: 'Na',

    // Planning Actions
    planningActions: 'Ibikorwa vyo gutegura',
    copyDay: 'Koporora umusi',
    pasteDay: 'Shira umusi',
    duplicateDay: 'Gusubiramo',
    bulkPlan: 'Gutegura byinshi',
    copied: 'Vyakoporoye!',
    dayOf: 'Umusi wa',
    elements: 'ibintu',
    mealCopied: 'Ifunguro ryakoporoye neza',
    cannotPasteDifferentMealType:
      "Ushobora gushira ubwoko bumwe bw'ifunguro gusa",
    replaceContent: 'Gusimbura ibiri ?',
    mealAlreadyHasItems: 'Iri funguro rifise ibintu. Urashaka kubisimbura ?',
    replace: 'Simbura',
    duplicateTo: 'Gusubiramo ku minsi ihe ?',
    planMultipleDays: 'Gutegura iminsi myinshi',
    selectAtLeastOneDate: 'Hitamo nibura itariki imwe',
    duplicateToSelected: 'Gusubiramo ku minsi {count} wahisemo ?',
    planningDuplicatedSuccessfully: 'Imiteguro yasubiramwo neza',
    planningAppliedToMultipleDays: 'Imiteguro yakoreshejwe ku minsi {count}',
    clipboardInfo: 'Vyakoporoye: {info}',
    morningMeal: 'Bukeye',
    noonMeal: 'Saa sita',
    eveningMeal: 'Nimugoroba',
  },
};

export type TranslationKey = keyof typeof translations.fr;
