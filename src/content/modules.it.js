// Testi per modulo (italiano). Le funzionalità si limitano a ciò che esiste oggi nel prodotto.

const modules = {
  audits: {
    name: 'Audit',
    summary: 'Create le checklist di audit, conducete gli audit sul campo e seguite ogni rilievo fino alla chiusura.',
    features: [
      'Griglie di audit con sezioni e domande ponderate, valutate per totale ponderato, tasso di conformità o livello di maturità (da E ad A)',
      '11 tipi di risposta: punteggi 0–5 e 0–10, Conforme / NC / NA, scostamento minore o maggiore, misure numeriche e altro',
      'Sessioni sul campo con GPS, foto obbligatorie, firme di auditor e auditato, e QR code per ogni zona',
      'Rilievi con analisi delle cause radice 5 Perché e Ishikawa, verifiche di efficacia e qualifiche degli auditor',
    ],
  },
  quality: {
    name: 'Qualità / PDCA',
    summary: 'Registrate non conformità e rilievi sul campo, e conducete cicli Plan-Do-Check-Act strutturati fino alla chiusura.',
    features: [
      'Non conformità per origine (cliente, fornitore, audit, ispezione) e gravità, con flusso aperta → analisi → azione → verifica → chiusa',
      'Cicli PDCA: indicatore, obiettivo e scadenza, cause radice con analisi 5M, verifica dell’obiettivo e di chi l’ha convalidato',
      'Fase Act che registra la modifica dello standard — nuovo documento, revisione, formazione o comunicazione — con evidenze e storico completo',
      'Gemba walk con criteri e osservazioni, e audit 5S valutati per ogni S',
    ],
  },
  kaizen: {
    name: 'Kaizen',
    summary: 'Raccogliete le idee di miglioramento di tutti, valutatele in comitato e misurate i risultati che producono.',
    features: [
      'Inviare un’idea in pochi secondi scansionando un QR code in reparto',
      'Valutazione in comitato con voti (anonimi se lo desiderate), oltre a voti e commenti dei dipendenti',
      'Risparmi stimati ed effettivi, con ROI calcolato automaticamente',
      'Campagne, obiettivi strategici, badge e uno storico degli stati non modificabile',
    ],
  },
  documents: {
    name: 'Documenti',
    summary: 'Documenti controllati con versioni, circuiti di approvazione e prese visione «letto e compreso».',
    features: [
      'Spazi e cartelle con regole di numerazione automatica',
      'Versioni e modelli di flusso di approvazione: bozza, revisione, approvato',
      'Prese visione firmate e tracciabili per ogni lettore',
      'Date di revisione e scadenza, livelli di riservatezza, regole di accesso e registro di audit dei documenti',
    ],
  },
  meetings: {
    name: 'Riunioni',
    summary: 'Pianificate e conducete le riunioni, e trasformate ogni decisione in un’azione tracciata.',
    features: [
      'Riunioni ricorrenti con partecipanti e conferme di presenza',
      'Punti all’ordine del giorno temporizzati, inclusa la revisione dei KPI',
      'Verbale generato e inviato automaticamente dopo la riunione',
      'Decisioni, azioni, un parcheggio per gli argomenti secondari e sondaggi di feedback',
    ],
  },
  tasks: {
    name: 'Attività',
    summary: 'Un’unica casella per tutto ciò che vi è assegnato, da qualunque modulo provenga.',
    features: [
      'Un unico elenco di lavoro con stato e priorità',
      'Raccoglie azioni PDCA, rilievi, attività di progetto, approvazioni di documenti, Kaizen, azioni delle riunioni e piani di audit',
      'Riceve anche valutazioni, attività CRM, richieste di ferie, ordini di manutenzione e ticket di helpdesk',
      'Disponibile nell’app mobile come «Il mio lavoro»',
    ],
  },
  projects: {
    name: 'Progetti',
    summary: 'Gestite i progetti con fasi, milestone, attività e una vista Gantt.',
    features: [
      'Fasi, milestone e attività con checklist e tracciamento dei blocchi',
      'Vista a diagramma di Gantt',
      'Registro delle criticità e team di progetto',
      'Consolidamento dell’avanzamento, storico degli stati, commenti e allegati',
    ],
  },
  talents: {
    name: 'Talenti',
    summary: 'Un modello delle competenze e una matrice di polivalenza, con le certificazioni monitorate prima della scadenza.',
    features: [
      'Famiglie di competenze, profili di ruolo con livelli richiesti, versionati',
      'Competenze dei dipendenti e analisi dei gap rispetto al profilo di ruolo',
      'Qualifiche e certificazioni con avvisi di scadenza a 90, 60, 30 e 7 giorni',
      'Piani di successione, posizionamento 9-box, previsioni di organico e percorsi di inserimento',
    ],
  },
  evaluations: {
    name: 'Valutazioni',
    summary: 'Valutazioni annuali e di fine periodo di prova, feedback a 360° e piani di sviluppo.',
    features: [
      'Campagne di valutazione: autovalutazione, responsabile, pari, esperto, osservazione Gemba e test',
      'Feedback a 360°, anonimo se necessario, con calibrazione',
      'Feedback continuo: colloqui individuali, check-in e feedback puntuali',
      'Piani e azioni di sviluppo, con istantanee delle performance',
    ],
  },
  training: {
    name: 'Formazione',
    summary: 'Pianificate e monitorate sessioni di formazione, budget e presenze.',
    features: [
      'Piani di formazione con budget totale, speso e residuo',
      'Formatori con costo giornaliero',
      'Sessioni interne, esterne, e-learning e in affiancamento collegate alle competenze',
      'Fabbisogni formativi generati dalle valutazioni, iscrizioni con presenze e punteggi',
    ],
  },
  hr: {
    name: 'Risorse umane',
    summary: 'Anagrafiche dei dipendenti e amministrazione HR quotidiana.',
    features: [
      'Siti, reparti, zone, posizioni e livelli retributivi',
      'Dipendenti, contratti e trasferimenti interni',
      'Tipi di assenza, assegnazioni e richieste; presenze inclusi gli straordinari',
      'Buste paga con voci di indennità, trattenute e imposte',
    ],
  },
  recruitment: {
    name: 'Selezione del personale',
    summary: 'L’assunzione dalla richiesta di personale alla scheda del dipendente, senza ridigitare nulla.',
    features: [
      'Richieste di personale con flusso di approvazione',
      'Annunci di lavoro, candidati, talent pool e candidature lungo le fasi di selezione',
      'Colloqui con feedback strutturati e raccomandazioni',
      'Offerte e negoziazione — «assumi» crea automaticamente il dipendente nelle Risorse umane',
    ],
  },
  crm: {
    name: 'CRM',
    summary: 'Lead, clienti, contatti e la vostra pipeline commerciale.',
    features: [
      'Lead con punteggi di marketing e commerciali, e importazione da Excel',
      'Clienti, contatti, territori e team commerciali',
      'Pipeline e fasi con probabilità, motivi di perdita e storico delle fasi',
      'Attività, preventivi, salute del cliente, rinnovi e regole di automazione',
    ],
  },
  marketing: {
    name: 'Marketing',
    summary: 'Campagne e-mail e WhatsApp e sequenze automatizzate che alimentano il CRM.',
    features: [
      'Modelli e-mail con drag-and-drop',
      'Pubblici e sequenze automatizzate in più fasi',
      'Campagne con varianti A/B e tracciamento UTM',
      'Tracciamento di aperture, clic e rimbalzi, lista di esclusione e invio WhatsApp',
    ],
  },
  sales: {
    name: 'Vendite',
    summary: 'Prodotti, listini e ordini clienti.',
    features: [
      'Prodotti con categorie, varianti e unità di misura',
      'Listini con sconti, formule e scaglioni di quantità',
      'Ordini di vendita dalla bozza al completamento, con quantità consegnate e fatturate',
      'Politica di fatturazione su ordine o su consegna',
    ],
  },
  purchase: {
    name: 'Acquisti',
    summary: 'Offerte dei fornitori e ordini di acquisto.',
    features: [
      'Richieste di offerta e ordini di acquisto',
      'Flusso di approvazione: in attesa, approvato, respinto',
      'Quantità ricevute tracciate per riga',
      'Listini fornitori',
    ],
  },
  accounting: {
    name: 'Contabilità',
    summary: 'Tenuta della contabilità, fatturazione e report finanziari.',
    features: [
      'Piano dei conti, imposte e termini di pagamento',
      'Registri e scritture con registrazione e storno',
      'Fatture clienti, fatture fornitori, note di credito e pagamenti, multivaluta',
      'Conto economico, scadenzario crediti e scadenzario debiti',
    ],
  },
  reporting: {
    name: 'Reporting',
    summary: 'Create le vostre dashboard e i vostri indicatori a partire dai dati di qualsiasi modulo.',
    features: [
      'Dashboard con schede KPI, grafici a linee, a barre e a torta e tabelle',
      'Definizioni dei KPI condivise in tutta l’azienda',
      'Dataset, misure e report su più pagine',
      'Invio programmato in PDF, Excel o CSV',
    ],
  },
  inventory: {
    name: 'Magazzino',
    summary: 'Magazzini, ubicazioni e scorte.',
    features: [
      'Magazzini e ubicazioni',
      'Lotti e numeri di serie con date di scadenza',
      'Trasferimenti e movimenti di magazzino',
      'Regole di riordino e valorizzazione delle scorte (costo medio o FIFO)',
    ],
  },
  manufacturing: {
    name: 'Produzione',
    summary: 'Pianificazione ed esecuzione della produzione.',
    features: [
      'Centri di lavoro con capacità, efficienza, costo orario e obiettivo OEE',
      'Cicli di lavorazione e operazioni',
      'Distinte base e componenti',
      'Ordini di produzione, ordini di lavoro e ordini di scarto',
    ],
  },
  maintenance: {
    name: 'Manutenzione',
    summary: 'Mantenete le attrezzature in funzione con piani preventivi e ordini di lavoro tracciati.',
    features: [
      'Attrezzature, categorie e squadre di manutenzione',
      'Piani preventivi attivati da un intervallo fisso o da una lettura del contatore',
      'Ordini di lavoro preventivi e correttivi con fasi e ricambi',
      'Richieste di manutenzione e calendario della manutenzione',
    ],
  },
  iot: {
    name: 'IoT',
    summary: 'Collegate i sensori delle macchine, monitorate le letture in tempo reale e ricevete avvisi.',
    features: [
      'Dispositivi — sensori, contatori, PLC, telecamere — via MQTT, HTTP o WebSocket',
      'Dati in tempo reale trasmessi a schermo',
      'Regole di allerta: sopra, sotto, uguale a o fuori da un intervallo',
      'Eventi di allerta con notifiche',
    ],
  },
  helpdesk: {
    name: 'Helpdesk',
    summary: 'Ticket di supporto interni o clienti con livelli di servizio.',
    features: [
      'Tipi di ticket e team di supporto',
      'Policy SLA con scadenze di prima risposta e di risoluzione per ticket',
      'Canali e-mail, portale e telefono, con note interne',
      'Knowledge base con categorie e articoli',
    ],
  },
}

export default modules
