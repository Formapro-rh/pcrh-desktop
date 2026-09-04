/* ============================================================
   Audits PCRH — application de bureau (Electron)
   Gestion des audits de conformité RH de l'entreprise
   ============================================================ */

const CATEGORIES_TEMPLATE = [
  { id:'gestion-quotidienne', nom:"Gestion quotidienne", sousDomaines:[
      {id:'gq-adm', nom:"Gestion administrative"},
      {id:'gq-tps', nom:"Gestion du temps de travail"},
      {id:'gq-cgs', nom:"Congés payés et congés divers"},
      {id:'gq-eva', nom:"Évaluation des salariés"},
      {id:'gq-dis', nom:"Procédures disciplinaires"},
      {id:'gq-ri', nom:"Règlement intérieur"},
      {id:'gq-fp', nom:"Fiches de poste"},
      {id:'gq-imp', nom:"Impliquer, mobiliser, motiver le personnel"},
    ], criteres:[
    { id:'gq-adm-1', sd:'gq-adm', label:"Votre calcul de l'effectif correspond-il à la définition légale ?", refs:[
        { label:"Article L1111-2", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006900783" },
      ] },
    { id:'gq-adm-2', sd:'gq-adm', label:"Disposez-vous d'un registre du personnel ?", refs:[
        { label:"Article D1221-23 à D1221-27", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018537878" },
      ] },
    { id:'gq-adm-3', sd:'gq-adm', label:"Avez-vous un affichage obligatoire accessible et complet ?" },
    { id:'gq-adm-4', sd:'gq-adm', label:"Avez-vous un exemplaire de la convention collective à la disposition de vos salariés ?" },
    { id:'gq-adm-5', sd:'gq-adm', label:"Disposez-vous de dossiers du personnel complets et à jour ?" },
    { id:'gq-adm-6', sd:'gq-adm', label:"Disposez-vous d'un organigramme à jour ?" },
    { id:'gq-adm-7', sd:'gq-adm', label:"La conservation de vos archives R.H. est-elle de 6 ans minimum ?" },
    { id:'gq-tps-1', sd:'gq-tps', label:"Les salariés disposent-ils d'au moins un jour de repos hebdomadaire fixe ?", refs:[
        { label:"Article L3132-1 à L3132-27-2", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902583" },
        { label:"Article L3132-1 à L3132-3-1", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902583" },
      ] },
    { id:'gq-tps-2', sd:'gq-tps', label:"Les durées hebdomadaires maximales légales et conventionnelles sont-elles respectées ?", refs:[
        { label:"Article L3121-18 à L3121-26", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020428" },
        { label:"Article R3121-8 à R3121-16", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033543487" },
      ] },
    { id:'gq-tps-3', sd:'gq-tps', label:"Les durées journalières maximales légales et conventionnelles sont-elles respectées ?", refs:[
        { label:"Article D3121-4 à D3121-7", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033509331" },
        { label:"Article L3121-18 à L3121-26", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020428" },
        { label:"Article R3121-8 à R3121-16", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033543487" },
      ] },
    { id:'gq-tps-4', sd:'gq-tps', label:"Sauf dérogations spécifiques, vous assurez-vous que vos salariés disposent d'un repos quotidien d'au moins 11 heures entre deux journées de travail ?", refs:[
        { label:"Article L3131-1", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020918" },
        { label:"Article D3131-1 à D3131-7", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033509910" },
      ] },
    { id:'gq-tps-5', sd:'gq-tps', label:"Avez-vous un suivi, une preuve des heures de travail effectuées ?", refs:[
        { label:"Article L3171-4", url:"https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000006902808" },
      ] },
    { id:'gq-tps-6', sd:'gq-tps', label:"Les heures supplémentaires effectuées donnent-elles lieu à une compensation financière majorée, ou à un repos compensateur ?", refs:[
        { label:"Article L3121-27 à L3121-31", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020376" },
      ] },
    { id:'gq-tps-7', sd:'gq-tps', label:"Les salariés en temps partiel réalisent-ils des heures complémentaires ?" },
    { id:'gq-tps-8', sd:'gq-tps', label:"Avez-vous recours à un aménagement du temps de travail sur une période supérieure à la semaine ?" },
    { id:'gq-tps-9', sd:'gq-tps', label:"Avez-vous recours à des astreintes ?" },
    { id:'gq-tps-10', sd:'gq-tps', label:"Avez-vous mis en place du télétravail au sein de votre organisation ?" },
    { id:'gq-cgs-1', sd:'gq-cgs', label:"Vos salariés bénéficient-ils des congés payés légaux ?", refs:[
        { label:"Article L3141-3 à L3141-9", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020826" },
      ] },
    { id:'gq-cgs-2', sd:'gq-cgs', label:"En cas d'accident du travail, votre calcul des droits à congé payé prend-il en compte les périodes au-delà de la première année de l'arrêt de travail ?", refs:[
        { label:"Cour de cassation Pourvoi n° 22-17.340", url:"https://www.legifrance.gouv.fr/juri/id/JURITEXT000048085897" },
        { label:"Cour de cassation Pourvoi n° 22-10.529", url:"https://www.legifrance.gouv.fr/juri/id/JURITEXT000048085864" },
        { label:"Cour de Cassation Pourvoi n°22-17.638", url:"https://www.legifrance.gouv.fr/juri/id/JURITEXT000048085922" },
      ] },
    { id:'gq-cgs-3', sd:'gq-cgs', label:"En cas de maladie ou d'accident, vos salariés continuent-ils d'acquérir des congés payés pendant leur période d'absence ?", refs:[
        { label:"Cour de cassation Pourvoi n° 22-17.340", url:"https://www.legifrance.gouv.fr/juri/id/JURITEXT000048085897" },
        { label:"Cour de cassation Pourvoi n° 22-10.529", url:"https://www.legifrance.gouv.fr/juri/id/JURITEXT000048085864" },
        { label:"Cour de Cassation Pourvoi n°22-17.638", url:"https://www.legifrance.gouv.fr/juri/id/JURITEXT000048085922" },
      ] },
    { id:'gq-cgs-4', sd:'gq-cgs', label:"La période de prise des congés est-elle communiquée au moins 2 mois avant le début des congés ?", refs:[
        { label:"Article L3141-12 à L3141-14", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902649" },
        { label:"Article L3141-15", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020765" },
        { label:"Article L3141-16", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035652687" },
      ] },
    { id:'gq-cgs-5', sd:'gq-cgs', label:"Dans le cas d'un fractionnement du congé principal (4 premières semaines) hors de la période de prise des congés, attribuez-vous des congés supplémentaires de fractionnement ?" },
    { id:'gq-cgs-6', sd:'gq-cgs', label:"À défaut, disposez-vous des courriers de renoncement aux jours de fractionnement ou d'un accord collectif vous couvrant ?" },
    { id:'gq-cgs-7', sd:'gq-cgs', label:"Vos salariés bénéficient-ils des congés pour évènements familiaux ?", refs:[
        { label:"Article L3142-1 à L3142-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042685486" },
      ] },
    { id:'gq-cgs-8', sd:'gq-cgs', label:"L'ordre des départs en congés est-il communiqué au moins 1 mois à l'avance aux salariés ?" },
    { id:'gq-eva-1', sd:'gq-eva', label:"Réalisez-vous des entretiens d'évaluation des salariés ?" },
    { id:'gq-dis-1', sd:'gq-dis', label:"Avez-vous des problématiques de respect des consignes de sécurité ou d'exécution du travail dans l'entreprise ?" },
    { id:'gq-dis-2', sd:'gq-dis', label:"La procédure disciplinaire est-elle bien engagée avant la fin d'un délai de 2 mois qui court à compter de la prise de connaissance de faits fautifs ?", refs:[
        { label:"Article L1332-4", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901450" },
      ] },
    { id:'gq-dis-3', sd:'gq-dis', label:"Toute sanction disciplinaire autre qu'un avertissement donne-t-elle bien lieu à une convocation, ainsi qu'à un entretien préalable à la notification de votre décision ?", refs:[
        { label:"Article L1332-1 à L1332-2", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901447" },
      ] },
    { id:'gq-ri-1', sd:'gq-ri', label:"Disposez-vous d'un règlement intérieur ?", refs:[
        { label:"L1311-2", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038610176" },
      ] },
    { id:'gq-fp-1', sd:'gq-fp', label:"Disposez-vous de fiches de poste ?" },
    { id:'gq-imp-1', sd:'gq-imp', label:"Avez-vous une politique d'implication et de motivation de votre personnel ?" },
    { id:'gq-imp-2', sd:'gq-imp', label:"Avez-vous une politique de création de valeur ou d'innovation dans votre établissement ?" },
  ]},
  { id:'recrutement', nom:"Recrutement", sousDomaines:[
      {id:'rec-def', nom:"Définition du besoin"},
      {id:'rec-rch', nom:"Recherche du candidat"},
      {id:'rec-pre', nom:"Pré-sélection des candidats"},
      {id:'rec-sel', nom:"Sélection du candidat"},
      {id:'rec-rep', nom:"Réponse positive et négative"},
      {id:'rec-int', nom:"Intégration"},
    ], criteres:[
    { id:'rec-def-1', sd:'rec-def', label:"Avez-vous une check-list de la préparation d'un recrutement ?" },
    { id:'rec-def-2', sd:'rec-def', label:"Préalablement au recrutement, définissez-vous le profil du candidat recherché ?" },
    { id:'rec-rch-1', sd:'rec-rch', label:"Rédigez-vous les offres d'emploi ?" },
    { id:'rec-rch-2', sd:'rec-rch', label:"Les offres d'emploi contiennent-elles les mentions obligatoires ?", refs:[
        { label:"Article L5332-2", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006903800" },
        { label:"Article L5332-1", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006903799" },
      ] },
    { id:'rec-rch-3', sd:'rec-rch', label:"Les offres d'emploi présentent-elles des informations vraies, vérifiables et n'induisant pas en erreur un candidat ?" },
    { id:'rec-rch-4', sd:'rec-rch', label:"Vos offres d'emploi comportent-elles exclusivement des mentions licites ?", refs:[
        { label:"Article L1221-6 à L1221-9", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006900845" },
        { label:"Article L1142-1", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006900801" },
      ] },
    { id:'rec-rch-5', sd:'rec-rch', label:"Pour des profils plus rares, personnalisez-vous les offres d'emploi ?" },
    { id:'rec-rch-6', sd:'rec-rch', label:"Travaillez-vous avec des organismes et entreprises vous proposant des candidats ?" },
    { id:'rec-rch-7', sd:'rec-rch', label:"Utilisez-vous la cooptation pour la recherche de candidat ?" },
    { id:'rec-rch-8', sd:'rec-rch', label:"Si le recrutement est un succès, le salarié cooptant est-il gratifié ?" },
    { id:'rec-pre-1', sd:'rec-pre', label:"Pré-sélectionnez-vous les CV et lettres de motivation que vous recevez ?" },
    { id:'rec-sel-1', sd:'rec-sel', label:"Réalisez-vous les recrutements ?" },
    { id:'rec-sel-2', sd:'rec-sel', label:"Avez-vous une méthodologie de recrutement standardisée et écrite ?" },
    { id:'rec-sel-3', sd:'rec-sel', label:"Les critères de sélection sont-ils définis clairement ?" },
    { id:'rec-sel-4', sd:'rec-sel', label:"Les méthodes de sélection sont-elles légales et objectives ?" },
    { id:'rec-sel-5', sd:'rec-sel', label:"Utilisez-vous l'entretien individuel de recrutement ?" },
    { id:'rec-sel-6', sd:'rec-sel', label:"Disposez-vous d'une trame d'entretien de recrutement ?" },
    { id:'rec-sel-7', sd:'rec-sel', label:"Utilisez-vous l'entretien collectif ?" },
    { id:'rec-sel-8', sd:'rec-sel', label:"Avez-vous recours à la simulation de poste ?" },
    { id:'rec-sel-9', sd:'rec-sel', label:"Utilisez-vous des tests d'aptitudes ?" },
    { id:'rec-sel-10', sd:'rec-sel', label:"Utilisez-vous des tests de personnalité ?" },
    { id:'rec-sel-11', sd:'rec-sel', label:"Utilisez-vous l'assessment center ?" },
    { id:'rec-sel-12', sd:'rec-sel', label:"Disposez-vous d'outils de suivi de la sélection du candidat ?" },
    { id:'rec-rep-1', sd:'rec-rep', label:"Après le choix final, réalisez-vous une promesse unilatérale de contrat de travail ?" },
    { id:'rec-rep-2', sd:'rec-rep', label:"À chacune de vos étapes de sélection, répondez-vous par la négative aux différents candidats ?" },
    { id:'rec-int-1', sd:'rec-int', label:"Avez-vous mis en place un système d'accompagnement des nouveaux affectés, y compris intérimaires, pour faciliter leur adaptation et leur insertion dans l'entreprise ?" },
  ]},
  { id:'contractualisation', nom:"Contractualisation", sousDomaines:[
      {id:'ctr-cc', nom:"Convention collective applicable"},
      {id:'ctr-ct', nom:"Contrats de travail"},
      {id:'ctr-cl', nom:"Clauses contractuelles spécifiques"},
      {id:'ctr-sp', nom:"Contrats spécifiques"},
      {id:'ctr-fa', nom:"Forfaits annuels en jours ou en heures"},
      {id:'ctr-pm', nom:"Prévoyance et mutuelle"},
      {id:'ctr-au', nom:"Autres travailleurs"},
    ], criteres:[
    { id:'ctr-cc-1', sd:'ctr-cc', label:"Connaissez-vous la convention collective applicable à votre entreprise ?", refs:[
        { label:"Article L2221-1 à L2221-3", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901659" },
        { label:"Trouver ma convention collective (code.travail.gouv.fr)", url:"https://code.travail.gouv.fr/outils/convention-collective" },
      ] },
    { id:'ctr-cc-2', sd:'ctr-cc', label:"Respectez-vous les classifications de la convention collective qui vous sont applicables ?", refs:[
        { label:"Article L2221-1 à L2221-3", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901659" },
        { label:"Trouver ma convention collective (code.travail.gouv.fr)", url:"https://code.travail.gouv.fr/outils/convention-collective" },
      ] },
    { id:'ctr-cc-3', sd:'ctr-cc', label:"Votre activité principale et la convention collective appliquée sont-elles en adéquation ?", refs:[
        { label:"Article L2261-2", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901780" },
        { label:"Trouver ma convention collective (code.travail.gouv.fr)", url:"https://code.travail.gouv.fr/outils/convention-collective" },
      ] },
    { id:'ctr-cc-4', sd:'ctr-cc', label:"Connaissez-vous les différentes souplesses ou contraintes qu'elle vous procure ?", refs:[
        { label:"Trouver ma convention collective (code.travail.gouv.fr)", url:"https://code.travail.gouv.fr/outils/convention-collective" },
      ] },
    { id:'ctr-cc-5', sd:'ctr-cc', label:"Connaissez-vous les différents avantages qu'elle procure à vos salariés ?", refs:[
        { label:"Trouver ma convention collective (code.travail.gouv.fr)", url:"https://code.travail.gouv.fr/outils/convention-collective" },
      ] },
    { id:'ctr-ct-1', sd:'ctr-ct', label:"Avez-vous des salariés travaillant à temps partiel ?" },
    { id:'ctr-ct-2', sd:'ctr-ct', label:"Les contrats de travail à temps partiel mentionnent-ils l'ensemble des clauses légales obligatoires afférentes ?", refs:[
        { label:"Article L3123-6", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020080" },
        { label:"Article R. 3124-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033471450" },
      ] },
    { id:'ctr-ct-3', sd:'ctr-ct', label:"Respectez-vous la durée minimale du travail à temps partiel ?", refs:[
        { label:"Article L3123-27", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033019953" },
      ] },
    { id:'ctr-ct-4', sd:'ctr-ct', label:"Avez-vous des travailleurs étrangers salariés dans votre entreprise ?" },
    { id:'ctr-ct-5', sd:'ctr-ct', label:"Disposez-vous d'une copie des titres, cartes, certificats ou autorisations de séjour toujours en cours de validité ?", refs:[
        { label:"Article R5221-1 à R5221-9", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049999770" },
      ] },
    { id:'ctr-ct-6', sd:'ctr-ct', label:"Procédez-vous à une vérification systématique du titre de séjour par la préfecture ?" },
    { id:'ctr-ct-7', sd:'ctr-ct', label:"Avez-vous recours à une période d'essai pour vos embauches ?" },
    { id:'ctr-ct-8', sd:'ctr-ct', label:"Avez-vous recours au prolongement de la période d'essai pour vos embauches ?" },
    { id:'ctr-ct-9', sd:'ctr-ct', label:"En cas de rupture de la période d'essai, respectez-vous le délai de prévenance associé ?", refs:[
        { label:"Article L1221-25", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029144958" },
      ] },
    { id:'ctr-ct-10', sd:'ctr-ct', label:"Les durées des périodes d'essai respectent-elles les durées légales et conventionnelles ?", refs:[
        { label:"Article L1221-19 à L1221-26", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019071113" },
      ] },
    { id:'ctr-ct-11', sd:'ctr-ct', label:"Les contrats à durée déterminée de vos salariés sont-ils écrits ?", refs:[
        { label:"Article L1242-12", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901206" },
      ] },
    { id:'ctr-ct-12', sd:'ctr-ct', label:"L'ensemble des clauses obligatoires liées aux CDD sont-elles stipulées dans les contrats de travail ?", refs:[
        { label:"Article L1242-12 à L1242-13", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901206" },
      ] },
    { id:'ctr-ct-13', sd:'ctr-ct', label:"La période d'essai de vos CDD correspond-elle à la durée maximale légale ou conventionnelle ?", refs:[
        { label:"L1242-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901204" },
      ] },
    { id:'ctr-ct-14', sd:'ctr-ct', label:"Le délai de carence entre deux CDD sur un même poste est-il bien respecté ? (hors remplacement d'un salarié ou travail saisonnier)", refs:[
        { label:"Article L1244-3 à L1244-4-1", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031087486" },
      ] },
    { id:'ctr-ct-15', sd:'ctr-ct', label:"Le recours aux CDD repose-t-il sur l'un des motifs prévus par le code du travail ?", refs:[
        { label:"Article L1242-1 à L1242-4", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901194" },
        { label:"Article L1248-2", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901238" },
      ] },
    { id:'ctr-ct-16', sd:'ctr-ct', label:"Les CDD respectent-ils les durées légales maximales ?", refs:[
        { label:"Article L1242-7 à L1242-9", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033024651" },
      ] },
    { id:'ctr-ct-17', sd:'ctr-ct', label:"Les contrats à durée indéterminée de vos salariés sont-ils écrits ?" },
    { id:'ctr-ct-18', sd:'ctr-ct', label:"Les déclarations préalables à l'embauche sont-elles réalisées dans les 8 jours qui précèdent l'embauche d'un salarié ?", refs:[
        { label:"Article L1221-10 à L1221-12-1", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006900849" },
      ] },
    { id:'ctr-ct-19', sd:'ctr-ct', label:"Souhaiteriez-vous optimiser vos embauches par le recours aux contrats aidés ?" },
    { id:'ctr-ct-20', sd:'ctr-ct', label:"Connaissez-vous et avez-vous recours à des contrats d'apprentissage pour vos embauches ?" },
    { id:'ctr-ct-21', sd:'ctr-ct', label:"Connaissez-vous et avez-vous recours à des contrats de professionnalisation pour vos embauches nécessitant une formation en simultané ?" },
    { id:'ctr-cl-1', sd:'ctr-cl', label:"Avez-vous recours à des clauses de non-concurrence ?" },
    { id:'ctr-cl-2', sd:'ctr-cl', label:"Avez-vous recours à des clauses d'exclusivité dans vos contrats de travail ?" },
    { id:'ctr-cl-3', sd:'ctr-cl', label:"Avez-vous recours à des clauses de mobilité dans vos contrats de travail ?" },
    { id:'ctr-cl-4', sd:'ctr-cl', label:"La clause de mobilité comporte-t-elle un délai de prévenance raisonnable en cas de changement d'affectation du salarié ?" },
    { id:'ctr-cl-5', sd:'ctr-cl', label:"La clause de mobilité définit-elle de façon précise sa zone géographique d'application ?" },
    { id:'ctr-cl-6', sd:'ctr-cl', label:"Avez-vous recours à des clauses de dédit-formation dans vos contrats de travail ?" },
    { id:'ctr-cl-7', sd:'ctr-cl', label:"Avez-vous recours à des clauses de garantie d'emploi dans vos contrats de travail ?" },
    { id:'ctr-cl-8', sd:'ctr-cl', label:"Avez-vous recours à des clauses de responsabilité financière dans vos contrats de travail ?" },
    { id:'ctr-cl-9', sd:'ctr-cl', label:"Avez-vous recours à des clauses d'indivisibilité dans vos contrats de travail ?" },
    { id:'ctr-sp-1', sd:'ctr-sp', label:"Avez-vous recours à des CDI de chantier ou d'opération ?", refs:[
        { label:"Article L1223-8 à L1223-9", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035639131" },
      ] },
    { id:'ctr-fa-1', sd:'ctr-fa', label:"Avez-vous recours à des conventions de forfaits annuels en jours ou en heures ?" },
    { id:'ctr-pm-1', sd:'ctr-pm', label:"Avez-vous mis en place une mutuelle obligatoire couvrant l'ensemble de vos salariés ?", refs:[
        { label:"Article L911-1 à L911-8", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006745463" },
        { label:"Article R871-1 et R871-2 du code de la sécurité sociale", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006754255" },
        { label:"Circulaire DSS/SD2A/SD3C/SD5D no 2015-30 du 30 janvier 2015", url:"https://www.complementaire-sante-solidaire.gouv.fr/fichier-utilisateur/fichiers/CIRCULAIRE_DSS_SD2A_SD3C_SD5D_2015_30%20du%2030%20janvier%202015_contrats_responsables.pdf" },
        { label:"article L.932-6 du code de la Sécurité Social", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038658384" },
        { label:"Article L911-1 à L911-8 du Code de la sécurité sociale", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006745463" },
        { label:"articles D911-0 à D911-8", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038093115" },
        { label:"Cass. civ. 2 10/07/2014 n° 13-21.101", url:"https://www.legifrance.gouv.fr/juri/id/JURITEXT000029245556" },
        { label:"Article L242-1 du code de la sécurité sociale", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038836902" },
        { label:"Circulaire N°2015-0000045", url:"https://www.urssaf.fr/portail/files/live/sites/urssaf/files/Lettres_circulaires/2015/ref_LCIRC-2015-0000045.pdf" },
        { label:"article L.141-4 du Code des assurances", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006793544" },
        { label:"article R242-1-6 du code de la sécurité Sociale", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038701542" },
        { label:"Article L871-1 du code de la sécurité sociale", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042685398" },
      ] },
    { id:'ctr-pm-2', sd:'ctr-pm', label:"Disposez-vous d'une prévoyance décès couvrant les salariés cadres de l'entreprise ?", refs:[
        { label:"Article 7 - CCN de retraite et de prévoyance des cadres du 14 mars 1947", url:"http://dcalin.fr/textoff/convention_cadres_1947.html" },
      ] },
    { id:'ctr-pm-3', sd:'ctr-pm', label:"Tenez-vous à jour une feuille d'émargement attestant de l'information des salariés sur leur mutuelle/prévoyance ?" },
    { id:'ctr-pm-4', sd:'ctr-pm', label:"Votre convention collective prévoit-elle une prévoyance obligatoire pour vos salariés ?" },
    { id:'ctr-pm-5', sd:'ctr-pm', label:"Avez-vous souscrit un contrat de prévoyance conforme à la convention collective ayant institué cette obligation ?" },
    { id:'ctr-au-1', sd:'ctr-au', label:"Avez-vous recours à des bénévoles au sein de votre organisation ?" },
    { id:'ctr-au-2', sd:'ctr-au', label:"Avez-vous recours à des stagiaires ?" },
    { id:'ctr-au-3', sd:'ctr-au', label:"Avez-vous recours à des travailleurs indépendants (auto-entrepreneurs) ?" },
  ]},
  { id:'sante-securite', nom:"Santé/Sécurité au travail", sousDomaines:[
      {id:'sst-du', nom:"Document Unique d'Évaluation des Risques Professionnels"},
      {id:'sst-grp', nom:"Gestion des risques professionnels"},
      {id:'sst-for', nom:"Formations sécurité"},
      {id:'sst-atmp', nom:"Gestion des AT/MP"},
      {id:'sst-reg', nom:"Registre de sécurité"},
      {id:'sst-tech', nom:"Sécurité : obligations techniques"},
      {id:'sst-med', nom:"Suivi médical"},
    ], criteres:[
    { id:'sst-du-1', sd:'sst-du', label:"Avez-vous élaboré votre Document Unique d'Évaluation des Risques Professionnels ?", refs:[
        { label:"Article R4121-1 à R4121-4", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000023795562" },
      ] },
    { id:'sst-grp-1', sd:'sst-grp', label:"Avez-vous établi un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail ?", refs:[
        { label:"L4121-3-1", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043893919" },
      ] },
    { id:'sst-grp-2', sd:'sst-grp', label:"Avez-vous identifié des situations propices aux Risques Psycho-Sociaux dans votre entreprise ?" },
    { id:'sst-grp-3', sd:'sst-grp', label:"La mise à jour du document unique a-t-elle été réalisée pour le risque du COVID-19 ?" },
    { id:'sst-grp-4', sd:'sst-grp', label:"Avez-vous travaillé sur les situations de travail dans un contexte dégradé ? (épidémie, pandémie, catastrophe naturelle ou technologique pouvant impacter l'entreprise)" },
    { id:'sst-grp-5', sd:'sst-grp', label:"L'évaluation réalisée débouche-t-elle bien sur la liste des mesures prises en cours d'année, leurs conditions d'exécution, leurs indicateurs de résultats, l'estimation de leur coût, les ressources internes de l'entreprise pouvant être mobilisées, ainsi qu'un calendrier de mise en œuvre ?" },
    { id:'sst-grp-6', sd:'sst-grp', label:"Supposez-vous la présence de postes pénibles dans votre entreprise ?" },
    { id:'sst-grp-7', sd:'sst-grp', label:"Avez-vous réalisé une mesure des facteurs de pénibilité pour ces postes ?" },
    { id:'sst-for-1', sd:'sst-for', label:"Avez-vous complété le passeport de prévention de vos salariés à chaque formation ?", refs:[
        { label:"Article L4141-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054336916" },
      ] },
    { id:'sst-for-2', sd:'sst-for', label:"Avez-vous des salariés Sauveteurs Secouristes du Travail ?", refs:[
        { label:"Article R4224-15 à R4224-16", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532203" },
      ] },
    { id:'sst-for-3', sd:'sst-for', label:"Avez-vous désigné un responsable en matière de santé et de sécurité au travail dans l'entreprise ?", refs:[
        { label:"Article L4644-1", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043893856" },
      ] },
    { id:'sst-for-4', sd:'sst-for', label:"Avez-vous réalisé une formation incendie pour vos salariés ?", refs:[
        { label:"Article R4141-1 à R4141-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532882" },
      ] },
    { id:'sst-for-5', sd:'sst-for', label:"Existe-t-il des campagnes de sensibilisation à la santé et à la sécurité destinées à développer la motivation, l'esprit et les comportements sécuritaires, par la promotion des bonnes pratiques en la matière ?" },
    { id:'sst-for-6', sd:'sst-for', label:"Les nouveaux arrivants et intérimaires appelés à intervenir sur le site de l'entreprise utilisatrice reçoivent-ils une formation à la sécurité liée à la nature des risques du site ?", refs:[
        { label:"Article R4141-1 à R4141-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532882" },
      ] },
    { id:'sst-for-7', sd:'sst-for', label:"Les salariés ont-ils eu une formation pratique et adaptée à leur profession en matière de sécurité ?", refs:[
        { label:"Article R4141-1 à R4141-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532882" },
      ] },
    { id:'sst-atmp-1', sd:'sst-atmp', label:"Déclarez-vous tout accident de travail ou de trajet, même bénin, dans les 48 heures au plus tard après en avoir eu connaissance ?", refs:[
        { label:"Article R441-1 à R441-9", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006750567" },
      ] },
    { id:'sst-atmp-2', sd:'sst-atmp', label:"Avez-vous identifié des maladies professionnelles potentielles auxquelles les salariés seraient exposés ?" },
    { id:'sst-atmp-3', sd:'sst-atmp', label:"Organisez-vous systématiquement un examen médical de reprise pour vos salariés ayant été arrêtés pour maladie ou accident professionnel et non professionnel ?", refs:[
        { label:"Article R4624-29 à R4624-33", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045371016" },
      ] },
    { id:'sst-atmp-4', sd:'sst-atmp', label:"Les accidents et situations potentiellement graves font-ils l'objet d'une enquête et d'une analyse, afin de déterminer les causes, pour définir les actions de prévention appropriées ?", refs:[
        { label:"Article L4121-1 à L4121-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035640828" },
      ] },
    { id:'sst-reg-1', sd:'sst-reg', label:"Disposez-vous d'un registre de sécurité ?", refs:[
        { label:"Article L4711-1 à L4711-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006903383" },
      ] },
    { id:'sst-tech-1', sd:'sst-tech', label:"Avez-vous une consigne de sécurité incendie affichée dans l'entreprise ?", refs:[
        { label:"Article R4227-37 à R4227-41", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000024769379" },
      ] },
    { id:'sst-tech-2', sd:'sst-tech', label:"Disposez-vous d'extincteurs adaptés et en nombre suffisant ?", refs:[
        { label:"Article R4227-28 à R4227-33", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532081" },
      ] },
    { id:'sst-tech-3', sd:'sst-tech', label:"Les contrôles réglementaires des extincteurs sont-ils effectués tous les ans ?", refs:[
        { label:"Article L4711-1 à L4711-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006903383" },
        { label:"Article R4227-29", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532079" },
      ] },
    { id:'sst-tech-4', sd:'sst-tech', label:"Disposez-vous d'une alarme incendie ?", refs:[
        { label:"Article R4227-34 à R4227-36", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532067" },
      ] },
    { id:'sst-tech-5', sd:'sst-tech', label:"Le contrôle réglementaire de l'alarme incendie est-il effectué régulièrement ?", refs:[
        { label:"Article R4224-17 à R4224-19", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532197" },
      ] },
    { id:'sst-tech-6', sd:'sst-tech', label:"Disposez-vous d'une armoire à pharmacie dans l'entreprise ?", refs:[
        { label:"Article R4224-14 à R4224-16", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532205" },
      ] },
    { id:'sst-tech-7', sd:'sst-tech', label:"Disposez-vous de kits premiers secours ? (pour les salariés mobiles)", refs:[
        { label:"Article R4224-14", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018532205" },
      ] },
    { id:'sst-tech-8', sd:'sst-tech', label:"Y a-t-il un lieu d'évacuation défini dans l'entreprise ?", refs:[
        { label:"Article R4227-37 à R4227-41", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000024769379" },
      ] },
    { id:'sst-tech-9', sd:'sst-tech', label:"Réalisez-vous des exercices d'évacuation tous les 6 mois ?", refs:[
        { label:"Article R4227-39", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000024769386" },
      ] },
    { id:'sst-tech-10', sd:'sst-tech', label:"Disposez-vous d'éclairages d'évacuation ?", refs:[
        { label:"Article R4227-14", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000022764985" },
      ] },
    { id:'sst-tech-11', sd:'sst-tech', label:"Mettez-vous à disposition des salariés des Équipements de Protection Individuels adaptés à chaque poste de travail ?", refs:[
        { label:"Article L4321-1 à L4321-3", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006903209" },
        { label:"Article R4311-8 à R4311-11", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019760811" },
      ] },
    { id:'sst-tech-12', sd:'sst-tech', label:"Utilisez-vous des produits considérés comme dangereux ?" },
    { id:'sst-tech-13', sd:'sst-tech', label:"Si vos fournisseurs ou sous-traitants utilisent des produits considérés comme dangereux, possédez-vous les fiches de données de sécurité des substances auxquelles vos salariés peuvent être directement ou indirectement exposés ?", refs:[
        { label:"Article R4411-73", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025739718" },
      ] },
    { id:'sst-tech-14', sd:'sst-tech', label:"Disposez-vous d'un poste de secours d'urgence dans l'entreprise ?" },
    { id:'sst-med-1', sd:'sst-med', label:"Vos salariés ont-ils bénéficié d'une visite d'information et de prévention réalisée par un médecin du travail, un interne en médecine ou un infirmier, dans les 3 mois qui suivent leur embauche ?", refs:[
        { label:"Article R4624-10 à R4624-15", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033769085" },
      ] },
    { id:'sst-med-2', sd:'sst-med', label:"Vos salariés ont-ils bénéficié d'un renouvellement de la visite d'information et de prévention dans les cinq ans (ou 3 ans pour les salariés concernés) qui suivent la dernière visite ?", refs:[
        { label:"Article R4624-10 à R4624-15", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033769085" },
      ] },
    { id:'sst-med-3', sd:'sst-med', label:"Vos salariés bénéficiant d'un suivi individuel renforcé ont-ils passé un examen médical d'aptitude préalablement à leur affectation sur le poste ?", refs:[
        { label:"Article R4624-24 à R4624-27", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033769104" },
      ] },
    { id:'sst-med-4', sd:'sst-med', label:"Vos salariés travaillant de nuit ou ayant moins de 18 ans ont-ils bénéficié d'une visite d'information et de prévention préalablement à leur embauche ?", refs:[
        { label:"Article R4624-17 à R4624-21", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033769059" },
      ] },
    { id:'sst-med-5', sd:'sst-med', label:"Tenez-vous à jour une liste des salariés requérant un suivi individuel renforcé ?" },
    { id:'sst-med-6', sd:'sst-med', label:"Avez-vous effectué le renouvellement de la visite d'information et de prévention chaque fois qu'un travailleur a vu les risques d'exposition de son emploi évoluer ?", refs:[
        { label:"Article R4624-10 à R4624-15", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033769085" },
      ] },
    { id:'sst-med-7', sd:'sst-med', label:"Disposez-vous de l'ensemble des attestations de suivi des visites d'information et de prévention ainsi que des renouvellements organisés ?", refs:[
        { label:"Article R4624-10 à R4624-15", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033769085" },
      ] },
  ]},
  { id:'formation', nom:"Formation", sousDomaines:[
      {id:'for-epp', nom:"Entretien de parcours professionnel"},
      {id:'for-pdc', nom:"Plan de développement des compétences"},
      {id:'for-mch', nom:"Management du capital humain"},
      {id:'for-hab', nom:"Habilitations"},
      {id:'for-aut', nom:"Autres dispositifs de formations"},
    ], criteres:[
    { id:'for-epp-1', sd:'for-epp', label:"L'entretien de parcours professionnel est-il réalisé tous les quatre ans ?" },
    { id:'for-pdc-1', sd:'for-pdc', label:"Disposez-vous d'un plan annuel de développement des compétences (plan de formation) formalisé ?", refs:[
        { label:"Article L6312-1", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037385757" },
      ] },
    { id:'for-pdc-2', sd:'for-pdc', label:"Existe-t-il un dossier individuel de formation pour chaque salarié ?" },
    { id:'for-mch-1', sd:'for-mch', label:"Avez-vous identifié les compétences clés nécessaires au bon fonctionnement de votre entreprise ?" },
    { id:'for-mch-2', sd:'for-mch', label:"Le développement personnel de vos salariés est-il une préoccupation principale de l'entreprise ?" },
    { id:'for-hab-1', sd:'for-hab', label:"Avez-vous des activités nécessitant des habilitations spécifiques ?" },
    { id:'for-hab-2', sd:'for-hab', label:"Avez-vous une liste à jour des postes et personnes disposant d'une habilitation spécifique ?" },
    { id:'for-hab-3', sd:'for-hab', label:"Vos salariés intervenant sur ces activités spécifiques disposent-ils des habilitations obligatoires ?" },
    { id:'for-hab-4', sd:'for-hab', label:"Vos salariés sont-ils en possession d'un document personnel justifiant de leurs habilitations ?" },
    { id:'for-aut-1', sd:'for-aut', label:"Avant une embauche, avez-vous déjà pensé à recourir aux préparations opérationnelles à l'emploi (POE) ou à l'AFPR (action de formation préalable au recrutement) pour acquérir les compétences requises pour exercer le métier ciblé ?" },
    { id:'for-aut-2', sd:'for-aut', label:"Existe-t-il dans votre entreprise des savoir-faire pour lesquels il n'existe aucune formation externe référencée ?" },
    { id:'for-aut-3', sd:'for-aut', label:"Souhaitez-vous faire monter en compétences vos salariés via d'autres dispositifs que le plan de développement des compétences ?" },
    { id:'for-aut-4', sd:'for-aut', label:"Connaissez-vous l'existence du dispositif de Validation des Acquis de l'Expérience pour valoriser par un diplôme les acquis de vos salariés ?" },
    { id:'for-aut-5', sd:'for-aut', label:"Connaissez-vous les possibilités offertes par le Compte Personnel de Formation permettant à tout salarié de suivre une formation éligible à ce dispositif ?" },
    { id:'for-aut-6', sd:'for-aut', label:"Proposez-vous à vos salariés disposant d'au moins 5 années d'ancienneté de réaliser un bilan de compétences ?" },
  ]},
  { id:'remuneration', nom:"Politique de rémunération", sousDomaines:[
      {id:'rem-bs', nom:"Bulletins de salaire"},
      {id:'rem-an', nom:"Avantages en nature"},
      {id:'rem-evr', nom:"Éléments variables de rémunération"},
      {id:'rem-drs', nom:"Dispositifs de rémunération spécifique"},
      {id:'rem-fp', nom:"Frais professionnels"},
    ], criteres:[
    { id:'rem-bs-1', sd:'rem-bs', label:"Le nombre d'heures figurant sur les bulletins de salaire correspond-il au nombre d'heures réellement accomplies au cours de la période visée ?", refs:[
        { label:"Article L3243-1 à L3243-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902862" },
      ] },
    { id:'rem-bs-2', sd:'rem-bs', label:"Le suivi des congés payés est-il inscrit et à jour sur les bulletins de salaire ?" },
    { id:'rem-bs-3', sd:'rem-bs', label:"Les bulletins de salaire sont-ils systématiquement délivrés aux salariés ?", refs:[
        { label:"Article L3243-1 à L3243-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902862" },
      ] },
    { id:'rem-bs-4', sd:'rem-bs', label:"Les bulletins de salaire sont-ils conservés au moins 5 années après la date de leur remise ?", refs:[
        { label:"Article L3243-1 à L3243-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902862" },
      ] },
    { id:'rem-bs-5', sd:'rem-bs', label:"Les déclarations sociales sont-elles effectuées dans le respect de la périodicité imposée ?", refs:[
        { label:"Arrêté du 23 mars 2017", url:"https://www.legifrance.gouv.fr/jorf/jo/2017/03/23/0070/" },
      ] },
    { id:'rem-bs-6', sd:'rem-bs', label:"Les taux de cotisation appliqués sur le bulletin de salaire sont-ils conformes à la législation en vigueur, ainsi qu'aux spécificités de votre branche professionnelle ?", refs:[
        { label:"Article R3243-1 à R3243-9", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041757540" },
      ] },
    { id:'rem-an-1', sd:'rem-an', label:"Accordez-vous des avantages en nature ?", refs:[
        { label:"Circulaire Acoss n°2003-014", url:"https://www.urssaf.fr/accueil/outils-documentation/outils/recherche-lettres-circulaires.html" },
        { label:"Circulaire DSS/SDFSS/5 B no 2005-389", url:"https://legislation.lassuranceretraite.fr/Pdf/circulaire_ministerielle_2005_389_19082005.pdf" },
        { label:"Lettre Circulaire N° 2005-129", url:"https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/outils/lettres-circulaires/2005/ref_lc2005-129.pdf" },
        { label:"Arrêté du 10 décembre 2002", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000417638" },
        { label:"Circulaire DSSn°2003-7 07/01/2003", url:"https://sante.gouv.fr/fichiers/bo/2003/03-04/a0040220.htm" },
        { label:"Arrêté du 25 février 2025 relatif à l'évaluation des avantages en nature pour le calcul des cotisations de sécurité sociale des salariés", url:"https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051254024" },
        { label:"Circulaire Acoss 2005-389 19/08/2005", url:"https://legislation.lassuranceretraite.fr/Pdf/circulaire_ministerielle_2005_389_19082005.pdf" },
      ] },
    { id:'rem-an-2', sd:'rem-an', label:"Accordez-vous un avantage en nature nourriture à vos salariés ?", refs:[
        { label:"Circulaire Acoss n°2003-014", url:"https://www.urssaf.fr/accueil/outils-documentation/outils/recherche-lettres-circulaires.html" },
        { label:"Circulaire DSS/SDFSS/5 B no 2005-389", url:"https://legislation.lassuranceretraite.fr/Pdf/circulaire_ministerielle_2005_389_19082005.pdf" },
        { label:"Lettre Circulaire N° 2005-129", url:"https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/outils/lettres-circulaires/2005/ref_lc2005-129.pdf" },
        { label:"Arrêté du 10 décembre 2002", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000417638" },
        { label:"Circulaire DSSn°2003-7 07/01/2003", url:"https://sante.gouv.fr/fichiers/bo/2003/03-04/a0040220.htm" },
        { label:"Circulaire Acoss 2005-389 19/08/2005", url:"https://legislation.lassuranceretraite.fr/Pdf/circulaire_ministerielle_2005_389_19082005.pdf" },
      ] },
    { id:'rem-an-3', sd:'rem-an', label:"Accordez-vous un avantage logement à vos salariés ?", refs:[
        { label:"Circulaire Acoss n°2003-014", url:"https://www.urssaf.fr/accueil/outils-documentation/outils/recherche-lettres-circulaires.html" },
        { label:"Circulaire DSS/SDFSS/5 B no 2005-389", url:"https://legislation.lassuranceretraite.fr/Pdf/circulaire_ministerielle_2005_389_19082005.pdf" },
        { label:"Lettre Circulaire N° 2005-129", url:"https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/outils/lettres-circulaires/2005/ref_lc2005-129.pdf" },
        { label:"Arrêté du 10 décembre 2002", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000417638" },
        { label:"Circulaire DSSn°2003-7 07/01/2003", url:"https://sante.gouv.fr/fichiers/bo/2003/03-04/a0040220.htm" },
        { label:"Circulaire Acoss 2005-389 19/08/2005", url:"https://legislation.lassuranceretraite.fr/Pdf/circulaire_ministerielle_2005_389_19082005.pdf" },
      ] },
    { id:'rem-an-4', sd:'rem-an', label:"Vos salariés bénéficient-ils de prix préférentiels sur les produits réalisés ou vendus par l'entreprise ?", refs:[
        { label:"Article L242-1 du code de la sécurité sociale", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038836902" },
        { label:"Circulaire DSSn°2003-7 07/01/2003", url:"https://sante.gouv.fr/fichiers/bo/2003/03-04/a0040220.htm" },
      ] },
    { id:'rem-an-5', sd:'rem-an', label:"La réduction tarifaire appliquée est-elle inférieure ou égale à 30 % du prix public TTC ?", refs:[
        { label:"Article L242-1 du code de la sécurité sociale", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038836902" },
        { label:"Circulaire DSSn°2003-7 07/01/2003", url:"https://sante.gouv.fr/fichiers/bo/2003/03-04/a0040220.htm" },
      ] },
    { id:'rem-an-6', sd:'rem-an', label:"Appliquez-vous un avantage en nature concernant cette réduction tarifaire ?", refs:[
        { label:"Article L242-1 du code de la sécurité sociale", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038836902" },
        { label:"Circulaire DSSn°2003-7 07/01/2003", url:"https://sante.gouv.fr/fichiers/bo/2003/03-04/a0040220.htm" },
      ] },
    { id:'rem-an-7', sd:'rem-an', label:"Le port de la tenue vestimentaire est-il obligatoire ?", refs:[
        { label:"Article R4321-5 code du travail", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033471392" },
        { label:"Article L242-1 du code de la sécurité sociale", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038836902" },
        { label:"Circulaire Acoss 2005-389 19/08/2005", url:"https://legislation.lassuranceretraite.fr/Pdf/circulaire_ministerielle_2005_389_19082005.pdf" },
        { label:"Article R4323-1 à Article R4323-110", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018531533" },
      ] },
    { id:'rem-an-8', sd:'rem-an', label:"Mettez-vous à disposition de vos salariés des outils issus des nouvelles technologies de l'information et de la communication ?", refs:[
        { label:"Lettre Circulaire N° 2005-129", url:"https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/outils/lettres-circulaires/2005/ref_lc2005-129.pdf" },
        { label:"Arrêté du 10 décembre 2002", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000417638" },
      ] },
    { id:'rem-an-9', sd:'rem-an', label:"Des véhicules sont-ils mis à disposition de vos salariés ?", refs:[
        { label:"Circulaire DSSn°2003-7 07/01/2003", url:"https://sante.gouv.fr/fichiers/bo/2003/03-04/a0040220.htm" },
        { label:"Circulaire Acoss 2005-389 19/08/2005", url:"https://legislation.lassuranceretraite.fr/Pdf/circulaire_ministerielle_2005_389_19082005.pdf" },
      ] },
    { id:'rem-an-10', sd:'rem-an', label:"Prenez-vous en charge les amendes de vos salariés ?", refs:[
        { label:"article L121-6 alinéa 2 du code de la route", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033425486" },
      ] },
    { id:'rem-an-11', sd:'rem-an', label:"Déclarez-vous les infractions routières commises par vos salariés ?", refs:[
        { label:"article L121-6 alinéa 2 du code de la route", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033425486" },
      ] },
    { id:'rem-an-12', sd:'rem-an', label:"Prenez-vous en charge l'entretien des vêtements de travail de vos salariés ?" },
    { id:'rem-evr-1', sd:'rem-evr', label:"Avez-vous recours à des primes pour motiver vos salariés et valoriser le travail accompli ?" },
    { id:'rem-evr-2', sd:'rem-evr', label:"Avez-vous établi des critères objectifs d'octroi des augmentations salariales ?", refs:[
        { label:"Article L3221-1 à L3221-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902817" },
      ] },
    { id:'rem-evr-3', sd:'rem-evr', label:"Avez-vous établi des critères permettant de déterminer la rémunération d'un poste à l'intérieur de la fourchette salariale conventionnelle ?" },
    { id:'rem-evr-4', sd:'rem-evr', label:"Disposez-vous de tableaux de bord de suivi de la réalisation des objectifs conditionnant l'octroi des différentes primes et augmentations salariales ?" },
    { id:'rem-evr-5', sd:'rem-evr', label:"Respectez-vous les grilles de classification et de rémunération conventionnelles pour l'ensemble de vos salariés ?", refs:[
        { label:"Article L3231-2 à Article L3231-3", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902832" },
      ] },
    { id:'rem-evr-6', sd:'rem-evr', label:"Vérifiez-vous régulièrement l'adéquation des rémunérations pratiquées sur chaque poste de votre entreprise par rapport à la réalité du marché de l'emploi ?" },
    { id:'rem-drs-1', sd:'rem-drs', label:"Avez-vous mis en place un Compte Épargne Temps dans votre entreprise ?" },
    { id:'rem-drs-2', sd:'rem-drs', label:"Avez-vous mis en place un Plan Épargne Entreprise pour vos salariés ?" },
    { id:'rem-drs-3', sd:'rem-drs', label:"Avez-vous mis en place un Plan Épargne Retraite Collective dans votre entreprise ?" },
    { id:'rem-drs-4', sd:'rem-drs', label:"Avez-vous mis en place un dispositif d'intéressement dans votre entreprise ?" },
    { id:'rem-drs-5', sd:'rem-drs', label:"Avez-vous mis en place un dispositif de participation pour vos salariés ?", refs:[
        { label:"Article L3322-1 à L3322-8", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038613215" },
      ] },
    { id:'rem-drs-6', sd:'rem-drs', label:"Avez-vous mis en place un dispositif de prévoyance dans votre entreprise ?", refs:[
        { label:"Article L911-1 à L911-8", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006745463" },
      ] },
    { id:'rem-drs-7', sd:'rem-drs', label:"Avez-vous mis en place une attribution d'actions gratuites pour fidéliser vos salariés ?" },
    { id:'rem-drs-8', sd:'rem-drs', label:"Avez-vous mis en place une attribution de Bons de Souscription de Parts de Créateur d'Entreprise (BSPCE) pour fidéliser vos salariés ?" },
    { id:'rem-fp-1', sd:'rem-fp', label:"Accordez-vous des indemnités de grands déplacements ?" },
    { id:'rem-fp-2', sd:'rem-fp', label:"Accordez-vous des titres-restaurant ?", refs:[
        { label:"Article L3262-1 à L3262-7 du code du travail", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035652827" },
        { label:"article R3262-1 à R3262-46", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000028699405" },
      ] },
    { id:'rem-fp-3', sd:'rem-fp', label:"Avez-vous connaissance des différentes prises en charge facultatives des frais de transport personnels permettant une exonération de charges ?", refs:[
        { label:"décret n° 2018-716 du 3 août 2018", url:"https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000037301309" },
        { label:"Décret n° 2016-144 du 11/02/16", url:"https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000032036463" },
        { label:"Article L3261-2 à l'art. 3261-3-1 du Code du travail", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019950566" },
        { label:"Circulaire ACOSS N°2009-021", url:"https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/outils/lettres-circulaires/2009/ref_lc2009-021.pdf" },
      ] },
    { id:'rem-fp-4', sd:'rem-fp', label:"Participez-vous aux frais de transport public de tous vos salariés ?", refs:[
        { label:"Art.L3261-16", url:"https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000018487476/" },
        { label:"Article L3261-2 à l'art. 3261-3-1 du Code du travail", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019950566" },
        { label:"Circulaire ACOSS N°2009-021", url:"https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/outils/lettres-circulaires/2009/ref_lc2009-021.pdf" },
      ] },
    { id:'rem-fp-5', sd:'rem-fp', label:"Pour les salariés ayant un horaire inférieur à un mi-temps, bénéficient-ils d'une prise en charge des titres de transport au prorata du nombre d'heures travaillées par rapport à un mi-temps ?" },
    { id:'rem-fp-6', sd:'rem-fp', label:"Pour les salariés ayant un horaire égal ou supérieur à un mi-temps, bénéficient-ils d'une prise en charge des titres de transport dans les mêmes conditions que les salariés à temps complet ?" },
    { id:'rem-fp-7', sd:'rem-fp', label:"Prenez-vous en charge 50 % du prix de la totalité d'abonnements souscrits ?", refs:[
        { label:"Art.L3261-16", url:"https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000018487476/" },
        { label:"Article L3261-2 à l'art.3261-3-1 du Code du travail", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019950566" },
        { label:"Circulaire ACOSS N°2009-021", url:"https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/outils/lettres-circulaires/2009/ref_lc2009-021.pdf" },
      ] },
    { id:'rem-fp-8', sd:'rem-fp', label:"Le montant figure-t-il sur le bulletin de salaire du collaborateur ?", refs:[
        { label:"Art.L3261-16", url:"https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000018487476/" },
        { label:"Article L3261-2 à l'art. 3261-3-1 du Code du travail", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019950566" },
        { label:"Circulaire ACOSS N°2009-021", url:"https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/outils/lettres-circulaires/2009/ref_lc2009-021.pdf" },
      ] },
    { id:'rem-fp-9', sd:'rem-fp', label:"Prenez-vous en charge plus de 50 % du prix de la totalité d'abonnements souscrits ?", refs:[
        { label:"Art.L3261-16", url:"https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000018487476/" },
        { label:"Article L3261-2 à l'art. 3261-3-1 du Code du travail", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019950566" },
        { label:"Circulaire ACOSS N°2009-021", url:"https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/outils/lettres-circulaires/2009/ref_lc2009-021.pdf" },
      ] },
    { id:'rem-fp-10', sd:'rem-fp', label:"Remboursez-vous des frais de repas à vos salariés ?" },
    { id:'rem-fp-11', sd:'rem-fp', label:"Vos salariés utilisent-ils leur véhicule personnel à des fins professionnelles ?" },
  ]},
  { id:'rupture-contrat', nom:"Rupture du contrat de travail", sousDomaines:[
      {id:'rup-cmr', nom:"Choix du mode de rupture"},
      {id:'rup-ct', nom:"Certificat de travail"},
      {id:'rup-cddca', nom:"[CDD] Rupture d'un commun accord"},
      {id:'rup-cddcdi', nom:"[CDD] Rupture CDD en raison d'une embauche en CDI"},
      {id:'rup-dem', nom:"[CDI] Démission"},
      {id:'rup-rc', nom:"[CDI] Rupture conventionnelle"},
      {id:'rup-lmp', nom:"[CDI] Licenciement pour motif personnel"},
      {id:'rup-lfg', nom:"[CDI - CDD] Licenciement pour faute grave ou lourde"},
      {id:'rup-lin', nom:"[CDI - CDD] Licenciement pour inaptitude"},
      {id:'rup-lei', nom:"[CDI] Licenciement économique individuel"},
      {id:'rup-lec', nom:"[CDI] Licenciement économique de 2 à 9 salariés sur une période de moins de 30 jours"},
      {id:'rup-lecol', nom:"[CDI] Licenciement économique collectif de 10 salariés au moins"},
      {id:'rup-rcc', nom:"[CDI] Rupture conventionnelle collective"},
    ], criteres:[
    { id:'rup-cmr-1', sd:'rup-cmr', label:"Avant la rupture, avez-vous bien prévu une période de transfert des tâches du collaborateur concerné avant sa sortie ?" },
    { id:'rup-cmr-2', sd:'rup-cmr', label:"Lors du choix du mode de rupture, prenez-vous en considération la situation personnelle et familiale de votre salarié ?" },
    { id:'rup-cmr-3', sd:'rup-cmr', label:"Mesurez-vous les risques juridiques latents liés au contrat de travail et à la relation de travail passée avant le choix du mode de rupture ?" },
    { id:'rup-ct-1', sd:'rup-ct', label:"Lors du départ d'un salarié, décernez-vous le certificat de travail ?" },
    { id:'rup-ct-2', sd:'rup-ct', label:"Sur ces mêmes certificats de travail, l'ensemble des mentions obligatoires sont-elles présentes ?" },
    { id:'rup-cddca-1', sd:'rup-cddca', label:"Dans le cas d'une rupture d'un commun accord d'un CDD, disposez-vous d'un accord écrit et signé par le salarié concerné et vous-même établissant les conditions de cette rupture ?", refs:[
        { label:"Article L1243-1 à L1243-3", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029946319" },
      ] },
    { id:'rup-cddcdi-1', sd:'rup-cddcdi', label:"Dans le cas d'une rupture pour embauche du salarié en CDI dans une autre entreprise, disposez-vous d'un justificatif de cette embauche ?", refs:[
        { label:"Article L1243-2", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031087476" },
      ] },
    { id:'rup-dem-1', sd:'rup-dem', label:"En cas de démission d'un salarié, disposez-vous d'un écrit de sa part justifiant de sa volonté claire et non équivoque de mettre fin à son contrat ?", refs:[
        { label:"Cour de cassation, civile, Chambre sociale, 26 mai 2010, 08-44.923", url:"https://www.legifrance.gouv.fr/juri/id/JURITEXT000022282357" },
      ] },
    { id:'rup-rc-1', sd:'rup-rc', label:"Effectuez-vous la convocation à l'entretien de rupture conventionnelle au moins 5 jours ouvrables avant la date de l'entretien ?", refs:[
        { label:"Article L1237-11 à L1237-16", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019071187" },
      ] },
    { id:'rup-rc-2', sd:'rup-rc', label:"La convention de rupture est-elle signée par les deux parties suite à l'entretien ?", refs:[
        { label:"Article L1237-11 à L1237-16", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019071187" },
      ] },
    { id:'rup-rc-3', sd:'rup-rc', label:"Le lendemain de la signature de la convention de rupture, respectez-vous le délai de rétractation de 15 jours calendaires avant envoi à la DIRECCTE ?", refs:[
        { label:"Article L1237-11 à L1237-16", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019071187" },
      ] },
    { id:'rup-rc-4', sd:'rup-rc', label:"Suite à la fin du délai de rétractation, envoyez-vous la convention de rupture pour homologation à la DIRECCTE, le contrat ne prenant fin qu'après un délai de 15 jours ouvrables ?", refs:[
        { label:"Article L1237-11 à L1237-16", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019071187" },
      ] },
    { id:'rup-rc-5', sd:'rup-rc', label:"Si le salarié concerné est un salarié protégé, une convention de rupture spécifique soumise à autorisation de l'inspection du travail est-elle bien complétée ?", refs:[
        { label:"Article R2421-18 à R2421-19", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036439609" },
      ] },
    { id:'rup-lmp-1', sd:'rup-lmp', label:"Effectuez-vous une convocation à un entretien préalable, au moins 5 jours ouvrables avant la date prévue pour l'entretien ?", refs:[
        { label:"Article L1232-2 à L1232-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901000" },
      ] },
    { id:'rup-lmp-2', sd:'rup-lmp', label:"Abordez-vous, lors de l'entretien préalable, le fait que votre décision finale est incertaine ?", refs:[
        { label:"Article L1232-2 à L1232-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901000" },
      ] },
    { id:'rup-lmp-3', sd:'rup-lmp', label:"La décision et les motifs de licenciement sont-ils notifiés au moins 2 jours ouvrables après l'entretien ?", refs:[
        { label:"Article L1232-6", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036762096" },
      ] },
    { id:'rup-lfg-1', sd:'rup-lfg', label:"Effectuez-vous la convocation à l'entretien préalable, au moins 5 jours ouvrables avant la date prévue pour l'entretien ?", refs:[
        { label:"Article L1232-2 à L1232-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901000" },
      ] },
    { id:'rup-lfg-2', sd:'rup-lfg', label:"Abordez-vous, lors de l'entretien préalable, le fait que votre décision finale est incertaine ?", refs:[
        { label:"Article L1232-2 à L1232-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901000" },
      ] },
    { id:'rup-lfg-3', sd:'rup-lfg', label:"La décision et les motifs de licenciement sont-ils notifiés au moins 2 jours ouvrables après l'entretien ?", refs:[
        { label:"Article L1232-6", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036762096" },
      ] },
    { id:'rup-lfg-4', sd:'rup-lfg', label:"Lorsqu'un licenciement pour faute grave ou lourde est envisagé, une mise à pied à titre conservatoire est-elle notifiée avant ou au moment de la convocation à l'entretien préalable ?", refs:[
        { label:"Article L1332-1 à L1332-3", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901447" },
      ] },
    { id:'rup-lin-1', sd:'rup-lin', label:"La procédure de licenciement pour inaptitude est-elle engagée après un avis d'inaptitude rendu par le médecin du travail ?", refs:[
        { label:"Article R4624-42", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033768966" },
      ] },
    { id:'rup-lin-2', sd:'rup-lin', label:"Effectuez-vous la convocation à l'entretien préalable, au moins 5 jours ouvrables avant la date prévue pour l'entretien ?", refs:[
        { label:"Article L1232-2 à L1232-5", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901000" },
      ] },
    { id:'rup-lin-3', sd:'rup-lin', label:"Présentez-vous les recherches de solutions de reclassement entreprises ou les solutions trouvées à votre salarié avant et pendant l'entretien préalable ?", refs:[
        { label:"Article L1226-10 à L1226-12", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035653215" },
        { label:"Article L1226-2 à L1226-4-3", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035653236" },
      ] },
    { id:'rup-lin-4', sd:'rup-lin', label:"Suite au dernier avis d'inaptitude reçu, consultez-vous le comité social et économique avant la convocation à l'entretien préalable même lorsqu'il n'existe aucune possibilité de reclassement ?", refs:[
        { label:"Article L1226-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035653215" },
      ] },
    { id:'rup-lin-5', sd:'rup-lin', label:"Suite à l'avis d'inaptitude rendu par le médecin du travail, commencez-vous la recherche de solutions de reclassement pour le salarié concerné (sauf cas de dispense) ?", refs:[
        { label:"Article L1226-10 à L1226-12", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035653215" },
        { label:"Article L1226-2 à L1226-4-3", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035653236" },
      ] },
    { id:'rup-lei-1', sd:'rup-lei', label:"Effectuez-vous la convocation à l'entretien préalable, au moins 5 jours ouvrables avant la date prévue pour l'entretien ?", refs:[
        { label:"Article L1233-11 à L1233-14", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006901023" },
      ] },
    { id:'rup-lei-2', sd:'rup-lei', label:"Lors de l'entretien préalable, informez-vous et proposez-vous à votre salarié le Contrat de Sécurisation Professionnelle ?", refs:[
        { label:"Article L1233-65 à L1233-70", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000024422267" },
      ] },
    { id:'rup-lei-3', sd:'rup-lei', label:"Effectuez-vous l'envoi de la notification de licenciement au moins 7 jours ouvrables (non-cadres) ou 15 jours ouvrables (cadres) après l'entretien préalable ?", refs:[
        { label:"Article L1233-15", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032344944" },
      ] },
    { id:'rup-lei-4', sd:'rup-lei', label:"Informez-vous la DIRECCTE par courrier recommandé de l'envoi des notifications de licenciement dans les 8 jours maximum qui suivent leur envoi ?", refs:[
        { label:"Article D1233-3", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018537688" },
      ] },
    { id:'rup-lec-1', sd:'rup-lec', label:"Consultez-vous au préalable le Comité social et économique sur le projet de licenciement et les critères d'ordre des licenciements ?", refs:[
        { label:"Article L1233-8 à L1233-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036261850" },
      ] },
    { id:'rup-lecol-1', sd:'rup-lecol', label:"Avez-vous construit un Plan de Sauvegarde pour l'Emploi ?", refs:[
        { label:"Article L1233-61 à L1233-64", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025578782" },
      ] },
    { id:'rup-lecol-2', sd:'rup-lecol', label:"En cas de carence d'IRP, avez-vous procédé à l'information de la DIRECCTE du projet de licenciement collectif, tout en informant le même jour vos salariés par voie d'affichage ?", refs:[
        { label:"Article L1233-46 à L1233-51", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035652915" },
        { label:"Article L1233-53 à L1233-56", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031013940" },
      ] },
    { id:'rup-rcc-1', sd:'rup-rcc', label:"Avez-vous ouvert des négociations sur une rupture conventionnelle collective en vue de la conclusion d'un accord majoritaire ?", refs:[
        { label:"Article L1237-19 à 1237-19-14", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035623969" },
      ] },
  ]},
  { id:'dialogue-social', nom:"Dialogue social", sousDomaines:[
      {id:'dlg-cse', nom:"Comité social et économique"},
      {id:'dlg-ds', nom:"Délégué syndical"},
      {id:'dlg-ss', nom:"Section syndicale"},
    ], criteres:[
    { id:'dlg-cse-1', sd:'dlg-cse', label:"Avez-vous réalisé des élections professionnelles des membres du comité social et économique au cours des 4 dernières années ?", refs:[
        { label:"Article L2314-4 à L2314-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035651165" },
      ] },
    { id:'dlg-ds-1', sd:'dlg-ds', label:"Avez-vous un ou plusieurs délégués syndicaux ?" },
    { id:'dlg-ss-1', sd:'dlg-ss', label:"Avez-vous un ou plusieurs représentants à la section syndicale dans l'entreprise ?" },
  ]},
  { id:'gestion-strategique', nom:"Gestion stratégique", sousDomaines:[
      {id:'gst-pil', nom:"La gestion R.H. dans le pilotage de l'entreprise"},
      {id:'gst-div', nom:"Gestion de la diversité, de l'égalité et l'équité professionnelle"},
      {id:'gst-gepp', nom:"G.E.P.P."},
      {id:'gst-ind', nom:"Indicateurs"},
      {id:'gst-me', nom:"Marque employeur"},
      {id:'gst-ia', nom:"Intelligence artificielle"},
    ], criteres:[
    { id:'gst-pil-1', sd:'gst-pil', label:"Définissez-vous des objectifs R.H. à partir de la stratégie générale de l'entreprise ?" },
    { id:'gst-pil-2', sd:'gst-pil', label:"La direction prend-elle en considération les données sociales (salaire chargé, masse salariale, indicateurs...) dans sa prise de décision ?" },
    { id:'gst-pil-3', sd:'gst-pil', label:"La gestion des ressources humaines est-elle considérée comme stratégique par la direction de l'entreprise ?" },
    { id:'gst-pil-4', sd:'gst-pil', label:"La gestion des ressources humaines est-elle considérée comme une partie indissociable de la stratégie globale de l'entreprise ?" },
    { id:'gst-pil-5', sd:'gst-pil', label:"Les salariés ont-ils connaissance de l'utilité de la fonction des ressources humaines pour l'entreprise et pour eux-mêmes ?" },
    { id:'gst-div-1', sd:'gst-div', label:"Avez-vous mis en place un dispositif de mesure des écarts de rémunération entre les femmes et les hommes ?", refs:[
        { label:"Article D1142-2 à D1142-14", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038026011" },
      ] },
    { id:'gst-div-2', sd:'gst-div', label:"Favoriser une politique humaine et sociale de parité et de diversité au sein du personnel est-elle une préoccupation de l'entreprise ?" },
    { id:'gst-div-3', sd:'gst-div', label:"L'embauche de salariés en situation de handicap est-elle une préoccupation de la direction ?" },
    { id:'gst-gepp-1', sd:'gst-gepp', label:"Réalisez-vous une analyse annuelle des effectifs, utilisée (ou non) comme base de travail de la G.E.P.P. ?" },
    { id:'gst-gepp-2', sd:'gst-gepp', label:"Avez-vous identifié les causes (internes et externes) pouvant augmenter ou diminuer vos besoins en ressources humaines (effectifs et compétences) ?" },
    { id:'gst-gepp-3', sd:'gst-gepp', label:"Avez-vous, grâce à des projections, quantifié vos besoins futurs en ressources humaines (effectifs et compétences) ?" },
    { id:'gst-gepp-4', sd:'gst-gepp', label:"Avez-vous réalisé une analyse quantitative et qualitative de votre effectif vous servant de base à la mise en place d'une G.E.P.P. ?" },
    { id:'gst-gepp-5', sd:'gst-gepp', label:"Avez-vous mis en pratique votre G.E.P.P. ?" },
    { id:'gst-gepp-6', sd:'gst-gepp', label:"Avez-vous une commission paritaire G.E.P.P. ?" },
    { id:'gst-ind-1', sd:'gst-ind', label:"Utilisez-vous des indicateurs pour la gestion de vos salariés ?" },
    { id:'gst-me-1', sd:'gst-me', label:"Avez-vous défini une stratégie de marque employeur ?" },
    { id:'gst-me-2', sd:'gst-me', label:"Avez-vous identifié et formalisé vos atouts en tant qu'employeur ?" },
    { id:'gst-me-3', sd:'gst-me', label:"Communiquez-vous régulièrement sur vos valeurs auprès de vos employés ?" },
    { id:'gst-me-4', sd:'gst-me', label:"Évaluez-vous régulièrement la perception de sa marque employeur par les employés ?" },
    { id:'gst-ia-1', sd:'gst-ia', label:"L'intelligence artificielle est-elle intégrée dans vos processus RH ?" },
  ]},
  { id:'bdese', nom:"Base de Données Économiques, Sociales et Environnementales", sousDomaines:[
      {id:'bde-gen', nom:"Généralités"},
      {id:'bde-inv', nom:"Contenu : informations au titre des investissements"},
      {id:'bde-egf', nom:"Contenu : égalité professionnelle entre les femmes et les hommes"},
      {id:'bde-fpe', nom:"Contenu : fonds propres, endettement et impôts"},
      {id:'bde-rsd', nom:"Contenu : rémunération des salariés et dirigeants"},
      {id:'bde-asc', nom:"Contenu : activités sociales et culturelles"},
      {id:'bde-rf', nom:"Contenu : rémunération des financeurs"},
      {id:'bde-ffd', nom:"Contenu : flux financiers à destination de l'entreprise"},
      {id:'bde-st', nom:"Contenu : sous-traitance"},
      {id:'bde-tcf', nom:"Contenu : transferts commerciaux et financiers (entreprises appartenant à un groupe)"},
    ], criteres:[
    { id:'bde-gen-1', sd:'bde-gen', label:"Avez-vous mis en place une Base de Données Économiques, Sociales et Environnementales (BDESE) ?", refs:[
        { label:"Article L2312-36", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037385879" },
      ] },
    { id:'bde-inv-1', sd:'bde-inv', label:"La BDESE contient-elle des informations relatives à l'investissement matériel et immatériel ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-inv-2', sd:'bde-inv', label:"La BDESE contient-elle des informations relatives à l'investissement social ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-egf-1', sd:'bde-egf', label:"La BDESE contient-elle des informations relatives au diagnostic et à l'analyse de la situation respective des femmes et des hommes pour chacune des catégories professionnelles de l'entreprise ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-egf-2', sd:'bde-egf', label:"La BDESE contient-elle des informations relatives à l'analyse des écarts de salaire et de déroulement de carrière en fonction de l'âge, de la qualification et de l'ancienneté ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-egf-3', sd:'bde-egf', label:"La BDESE contient-elle des informations relatives à l'évolution des taux de promotion respectifs des femmes et des hommes par métiers dans l'entreprise ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-fpe-1', sd:'bde-fpe', label:"La BDESE contient-elle des informations relatives aux capitaux propres de l'entreprise ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-fpe-2', sd:'bde-fpe', label:"La BDESE contient-elle des informations relatives aux emprunts et dettes financières dont les échéances et charges financières ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-fpe-3', sd:'bde-fpe', label:"La BDESE contient-elle des informations relatives aux impôts et taxes ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-rsd-1', sd:'bde-rsd', label:"La BDESE contient-elle des informations relatives à l'évolution des rémunérations salariales ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-asc-1', sd:'bde-asc', label:"La BDESE contient-elle des informations relatives au montant de la contribution aux activités sociales et culturelles du comité d'entreprise ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-asc-2', sd:'bde-asc', label:"La BDESE contient-elle des informations relatives au mécénat ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-rf-1', sd:'bde-rf', label:"La BDESE contient-elle des informations relatives à la rémunération de l'actionnariat salarié ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-rf-2', sd:'bde-rf', label:"La BDESE contient-elle des informations relatives à la rémunération des actionnaires ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-ffd-1', sd:'bde-ffd', label:"La BDESE contient-elle des informations relatives aux aides publiques ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-ffd-2', sd:'bde-ffd', label:"La BDESE contient-elle des informations relatives aux crédits d'impôts ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-ffd-3', sd:'bde-ffd', label:"La BDESE contient-elle des informations relatives aux exonérations et réductions de cotisations sociales ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-ffd-4', sd:'bde-ffd', label:"La BDESE contient-elle des informations relatives aux réductions d'impôts ?", refs:[
        { label:"Article R2312-8 à R2312-10", url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038620214" },
      ] },
    { id:'bde-st-1', sd:'bde-st', label:"La BDESE contient-elle des informations relatives à la sous-traitance réalisée par l'entreprise ?" },
    { id:'bde-st-2', sd:'bde-st', label:"La BDESE contient-elle des informations relatives à la sous-traitance utilisée par l'entreprise ?" },
    { id:'bde-tcf-1', sd:'bde-tcf', label:"La BDESE contient-elle des informations relatives aux cessions, fusions et acquisitions réalisées ?" },
    { id:'bde-tcf-2', sd:'bde-tcf', label:"La BDESE contient-elle des informations relatives aux transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du groupe lorsqu'ils présentent une importance significative ?" },
  ]},
  { id:'donnees-personnelles', nom:"Sécurisation des données personnelles", sousDomaines:[
      {id:'dp-col', nom:"Collecte"},
      {id:'dp-tra', nom:"Traitements"},
      {id:'dp-con', nom:"Conservation"},
      {id:'dp-des', nom:"Destruction"},
    ], criteres:[
    { id:'dp-col-1', sd:'dp-col', label:"Avez-vous listé les différentes procédures vous permettant de récolter des données sociales ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-col-2', sd:'dp-col', label:"Traitez / conservez-vous des données concernant vos salariés ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-col-3', sd:'dp-col', label:"Ces données vous sont-elles utiles ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-col-4', sd:'dp-col', label:"Avez-vous identifié / listé les différentes données dont vous disposez ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-col-5', sd:'dp-col', label:"Informez-vous les personnes de manière claire et complète quant à la récolte, au traitement et à la conservation de leurs données personnelles ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-tra-1', sd:'dp-tra', label:"Avez-vous des prestataires qui travaillent / ont contact avec vos données ou celles de vos salariés ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-tra-2', sd:'dp-tra', label:"Disposez-vous d'un contrat de sous-traitance avec les prestataires qui traitent / ont un contact avec vos données et celles de vos salariés ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-tra-3', sd:'dp-tra', label:"Disposez-vous du registre de traitement de vos sous-traitants RH et paie ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-tra-4', sd:'dp-tra', label:"Tenez-vous une liste des prestataires qui travaillent / ont contact avec vos données ou celles de vos salariés ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-tra-5', sd:'dp-tra', label:"Avez-vous mis en place un registre des traitements R.H. ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-1', sd:'dp-con', label:"Contrôlez-vous les accès aux données de l'entreprise ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-2', sd:'dp-con', label:"Assurez-vous la sécurité des données de manière appropriée ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-3', sd:'dp-con', label:"Avez-vous déterminé un niveau de protection des données en fonction de leur degré de sensibilité ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-4', sd:'dp-con', label:"Tenez-vous une liste des personnes qui ont accès aux données de l'entreprise (salariés et prestataires) ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-5', sd:'dp-con', label:"Tenez-vous une liste des personnes qui ont accès aux locaux de l'entreprise (salariés et prestataires) ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-6', sd:'dp-con', label:"Disposez-vous d'une procédure de classement et d'archivage de vos données numériques ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-7', sd:'dp-con', label:"Disposez-vous d'un lieu de stockage de vos données numériques ? (salle de serveurs, serveur en ligne...)", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-8', sd:'dp-con', label:"Le lieu de stockage des archives numériques est-il sécurisé ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-9', sd:'dp-con', label:"Vos données numériques sont-elles sécurisées (cryptage, sauvegardes...) ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-10', sd:'dp-con', label:"Disposez-vous d'une procédure de classement et d'archivage de vos données physiques ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-11', sd:'dp-con', label:"Disposez-vous d'un lieu de stockage de vos données physiques ? (salle d'archive...)", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-con-12', sd:'dp-con', label:"Disposez-vous d'un serveur informatique commun à plusieurs postes de travail ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-1', sd:'dp-des', label:"Enregistrez-vous les interventions de destruction des données sociales dans un document récapitulatif sécurisé ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-2', sd:'dp-des', label:"Avez-vous une procédure de destruction sécurisée des données sociales numériques de vos salariés ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-3', sd:'dp-des', label:"Les temps de conservation des informations numériques en fonction de la donnée sont-ils respectés ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-4', sd:'dp-des', label:"Avez-vous une procédure de destruction sécurisée des archives papier de vos salariés ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-5', sd:'dp-des', label:"Les temps de conservation des archives en fonction de la donnée sont-ils respectés ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-6', sd:'dp-des', label:"Les archives sont-elles supprimées passé ce délai ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-7', sd:'dp-des', label:"Avez-vous un responsable en charge de la destruction des données sociales après les délais légaux ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-8', sd:'dp-des', label:"Avez-vous un responsable en charge du contrôle de la destruction des données sociales ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-9', sd:'dp-des', label:"Avez-vous une procédure de contrôle de la bonne destruction des données sociales dont le délai de conservation est dépassé ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
    { id:'dp-des-10', sd:'dp-des', label:"Pour les données n'ayant pas de durée de conservation légale, avez-vous déterminé une durée de conservation propre à votre entreprise ?", refs:[
        { label:"LOI n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles", url:"https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037085952/" },
      ] },
  ]},
  { id:'rse-social', nom:"RSE - Volet social", sousDomaines:[
      {id:'rse-gov', nom:"Gouvernance"},
      {id:'rse-com', nom:"Communication et participation"},
      {id:'rse-vie', nom:"Vie professionnelle"},
      {id:'rse-mai', nom:"Maillage territorial"},
      {id:'rse-div', nom:"Gestion des diversités"},
    ], criteres:[
    { id:'rse-gov-1', sd:'rse-gov', label:"Veillez-vous à appliquer le code du travail français ainsi que la convention collective applicable ?" },
    { id:'rse-gov-2', sd:'rse-gov', label:"Avez-vous audité la globalité de votre pratique de gestion R.H. ?" },
    { id:'rse-gov-3', sd:'rse-gov', label:"Avez-vous mis en place un projet et/ou des actions RSE ?" },
    { id:'rse-gov-4', sd:'rse-gov', label:"Avez-vous adopté des codes ou chartes ayant pour thème principal la RSE ?" },
    { id:'rse-gov-5', sd:'rse-gov', label:"Auditez-vous votre politique RSE ?" },
    { id:'rse-gov-6', sd:'rse-gov', label:"Avez-vous nommé un animateur RSE ?" },
    { id:'rse-gov-7', sd:'rse-gov', label:"Avez-vous des sous-traitants ou fournisseurs ?" },
    { id:'rse-gov-8', sd:'rse-gov', label:"Les sous-traitants et fournisseurs ont-ils une démarche RSE ?" },
    { id:'rse-com-1', sd:'rse-com', label:"Avez-vous identifié les parties prenantes internes pouvant prendre part à la RSE ?" },
    { id:'rse-com-2', sd:'rse-com', label:"Le personnel de votre entreprise accède-t-il aux informations RSE de manière régulière ?" },
    { id:'rse-com-3', sd:'rse-com', label:"Vos managers, constituant la ligne managériale de l'entreprise, ont-ils été sensibilisés à la démarche RSE ?" },
    { id:'rse-com-4', sd:'rse-com', label:"La mise en place et la consultation des instances représentatives du personnel correspondent-elles aux obligations légales ?" },
    { id:'rse-com-5', sd:'rse-com', label:"Avez-vous un support de communication dédié à votre RSE ? (journal, feuillet, site...)" },
    { id:'rse-com-6', sd:'rse-com', label:"Communiquez-vous votre RSE à l'extérieur de l'entreprise ?" },
    { id:'rse-vie-1', sd:'rse-vie', label:"La prévention de la santé sécurité des salariés est-elle un axe formalisé de votre politique RSE ?" },
    { id:'rse-vie-2', sd:'rse-vie', label:"Le développement des compétences de vos salariés est-il un axe formalisé de votre politique RSE ?" },
    { id:'rse-vie-3', sd:'rse-vie', label:"La reconnaissance de vos salariés est-elle un axe formalisé de votre politique RSE ?" },
    { id:'rse-vie-4', sd:'rse-vie', label:"Votre politique RSE intègre-t-elle le droit à la déconnexion des outils de communication liés aux activités professionnelles en dehors des heures de travail ?" },
    { id:'rse-vie-5', sd:'rse-vie', label:"Avez-vous sensibilisé les parties prenantes sur la confidentialité des données personnelles ?" },
    { id:'rse-mai-1', sd:'rse-mai', label:"Avez-vous identifié les parties prenantes et institutions territoriales qui peuvent participer à votre RSE ?" },
    { id:'rse-mai-2', sd:'rse-mai', label:"Agissez-vous directement avec votre entreprise dans des actions locales en correspondance avec les objectifs de votre RSE ?" },
    { id:'rse-mai-3', sd:'rse-mai', label:"Invitez-vous vos salariés à participer à des actions locales en lien avec votre politique RSE ?" },
    { id:'rse-mai-4', sd:'rse-mai', label:"Votre projet RSE est-il lié à celui d'autres entreprises locales ?" },
    { id:'rse-div-1', sd:'rse-div', label:"Vos procédures RH intègrent-elles la lutte contre les discriminations ?" },
    { id:'rse-div-2', sd:'rse-div', label:"Votre politique RSE définit-elle des actions de lutte contre les discriminations ?" },
    { id:'rse-div-3', sd:'rse-div', label:"Avez-vous adopté la charte de la diversité ?" },
  ]},
];

/** Groups a category's flat `criteres` array into ordered sous-domaine sections,
 *  using each category's `sousDomaines` list for section titles and ordering. */
function sousDomaineGroups(cat){
  if(!cat.sousDomaines) return [{ sd:null, nom:null, criteres: cat.criteres }];
  const bySd = new Map();
  cat.criteres.forEach(c=>{
    if(!bySd.has(c.sd)) bySd.set(c.sd, []);
    bySd.get(c.sd).push(c);
  });
  return cat.sousDomaines
    .filter(sd=>bySd.has(sd.id))
    .map(sd=>({ sd: sd.id, nom: sd.nom, criteres: bySd.get(sd.id) }));
}

/** Flat index of every question in the grid, by criterion id, for global search
 *  ("does this mission contain a question/answer matching the search text?").
 *  Rebuilt (not just built once) whenever the grid changes — see
 *  rebuildCriteresIndex() below. */
const CRITERES_INDEX = {};
function rebuildCriteresIndex(){
  Object.keys(CRITERES_INDEX).forEach(k=>{ delete CRITERES_INDEX[k]; });
  CATEGORIES_TEMPLATE.forEach(cat=>{
    cat.criteres.forEach(crit=>{
      CRITERES_INDEX[crit.id] = { label: crit.label, catNom: cat.nom, catId: cat.id };
    });
  });
}
rebuildCriteresIndex();

/** Pristine snapshot of the built-in grid, captured once at load — the
 *  starting point every time grid overrides are (re)applied, so edits are
 *  never compounded onto an already-edited copy. */
const BASE_CATEGORIES_TEMPLATE = JSON.parse(JSON.stringify(CATEGORIES_TEMPLATE));

/** Merges this space's grid customizations (edited/added/removed questions,
 *  stored in the shared folder — see Store.loadGridOverrides) onto a fresh
 *  copy of the base grid, then mutates CATEGORIES_TEMPLATE/CRITERES_INDEX
 *  *in place* so every existing reference to them (the whole app just reads
 *  the `CATEGORIES_TEMPLATE` binding, never a separately-captured copy)
 *  picks up the change without needing to be threaded through as a
 *  parameter. Safe to call repeatedly (e.g. after every edit) — always
 *  recomputed from the untouched base, never additive. */
function applyGridOverrides(overrides){
  const o = overrides || {};
  const removed = new Set(o.removedQuestionIds||[]);
  const edits = o.questionEdits||{};
  const added = o.addedQuestions||[];

  const next = JSON.parse(JSON.stringify(BASE_CATEGORIES_TEMPLATE));
  next.forEach(cat=>{
    cat.criteres = cat.criteres
      .filter(c=>!removed.has(c.id))
      .map(c=>{
        const e = edits[c.id];
        if(!e) return c;
        const merged = Object.assign({}, c);
        if(e.label!=null) merged.label = e.label;
        if(e.refs!=null) merged.refs = e.refs;
        return merged;
      });
  });
  added.forEach(q=>{
    const cat = next.find(c=>c.id===q.catId);
    if(cat) cat.criteres.push({ id:q.id, label:q.label, sd:q.sd||undefined, refs:q.refs||[] });
  });

  CATEGORIES_TEMPLATE.length = 0;
  CATEGORIES_TEMPLATE.push(...next);
  rebuildCriteresIndex();
}

/** Small "§" button shown next to a question that has legal references (crit.refs).
 *  Clicking it opens a dropdown of article links; clicking a link opens it in the
 *  system's default browser (via the main process — see main.js `app:openExternal`). */
function renderRefBtn(crit){
  if(!crit.refs || !crit.refs.length) return '';
  const open = App.state.openRefFor === crit.id;
  return `<span class="ref-wrap no-print">
    <button type="button" class="ref-btn ${open?'open':''}" onclick="App.toggleRef('${crit.id}', event)" title="Références légales">${icon('scale',13)}</button>
    ${open ? `<div class="ref-menu">
      ${crit.refs.map(r=>`<button type="button" class="ref-item" onclick="App.openRefLink('${esc(r.url)}', event)">${esc(r.label)}</button>`).join('')}
    </div>` : ''}
  </span>`;
}

/** Renders a question's attached-files row: a chip per file (click to open,
 *  optional × to remove) plus, when editable, a "Joindre" button. Returns ''
 *  in read-only mode with nothing attached, to avoid empty clutter in the
 *  report view. */
function renderAttachments(missionId, catId, critId, attachments, editable){
  const atts = attachments||[];
  if(!editable && atts.length===0) return '';
  return `<div class="att-row">
    ${atts.map(a=>`<span class="att-chip" title="${esc(a.name)}">
      <a href="#" onclick="event.preventDefault(); App.openQuestionAttachment('${missionId}','${critId}','${a.file}');">${icon('paperclip',12)} ${esc(a.name.length>24?a.name.slice(0,21)+'…':a.name)}</a>
      ${editable ? `<button type="button" class="att-x" title="Retirer" onclick="App.removeQuestionAttachment('${catId}','${critId}','${a.file}', event)">${icon('x',10)}</button>` : ''}
    </span>`).join('')}
    ${editable ? `<button type="button" class="btn ghost att-add" onclick="App.addQuestionAttachment('${catId}','${critId}')">${icon('paperclip',12)} Joindre un fichier</button>` : ''}
  </div>`;
}

const NOTE_LABELS = { na:"N/A", 0:"Non conforme", 1:"Partiel", 2:"Conforme" };
const STATUT_MISSION = { brouillon:"Brouillon", en_cours:"En cours", cloture:"Clôturé" };
const STATUT_NC = { ouvert:"Ouvert", en_cours_nc:"En cours", clos:"Clos" };
const GRAVITE_NC = { mineure:"Mineure", majeure:"Majeure", critique:"Critique" };

function icon(name, size){
  size = size || 16;
  const p = 'stroke="currentColor" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
  const paths = {
    dashboard:`<rect x="3" y="3" width="7" height="7" rx="1.3" ${p}/><rect x="14" y="3" width="7" height="7" rx="1.3" ${p}/><rect x="3" y="14" width="7" height="7" rx="1.3" ${p}/><rect x="14" y="14" width="7" height="7" rx="1.3" ${p}/>`,
    list:`<circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/><line x1="9" y1="6" x2="21" y2="6" ${p}/><line x1="9" y1="12" x2="21" y2="12" ${p}/><line x1="9" y1="18" x2="21" y2="18" ${p}/>`,
    plus:`<line x1="12" y1="5" x2="12" y2="19" ${p}/><line x1="5" y1="12" x2="19" y2="12" ${p}/>`,
    chev:`<polyline points="9 6 15 12 9 18" ${p}/>`,
    pencil:`<path d="M12 20h9" ${p}/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" ${p}/>`,
    printer:`<polyline points="6 9 6 2 18 2 18 9" ${p}/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" ${p}/><rect x="6" y="14" width="12" height="8" ${p}/>`,
    back:`<line x1="19" y1="12" x2="5" y2="12" ${p}/><polyline points="12 19 5 12 12 5" ${p}/>`,
    trash:`<polyline points="3 6 5 6 21 6" ${p}/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" ${p}/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" ${p}/>`,
    x:`<line x1="18" y1="6" x2="6" y2="18" ${p}/><line x1="6" y1="6" x2="18" y2="18" ${p}/>`,
    wand:`<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 6.2l1.4-1.4M17.8 11.8l1.4 1.4M12.2 6.2l-1.4-1.4" ${p}/><path d="M3 21l9-9" ${p}/><path d="M11.5 6.5l6 6" ${p}/>`,
    lock:`<rect x="4" y="10" width="16" height="10" rx="2" ${p}/><path d="M8 10V7a4 4 0 0 1 8 0v3" ${p}/>`,
    settings:`<circle cx="12" cy="12" r="3" ${p}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" ${p}/>`,
    folder:`<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" ${p}/>`,
    scale:`<path d="M12 3v18M6 7h12M6 7l-3.5 7a3.5 3.5 0 0 0 7 0L6 7ZM18 7l-3.5 7a3.5 3.5 0 0 0 7 0L18 7Z" ${p}/><path d="M9 21h6" ${p}/>`,
    download:`<path d="M12 3v12" ${p}/><polyline points="7 10 12 15 17 10" ${p}/><path d="M5 21h14" ${p}/>`,
    building:`<rect x="4" y="3" width="16" height="18" rx="1" ${p}/><line x1="9" y1="7" x2="9" y2="7.01" ${p}/><line x1="15" y1="7" x2="15" y2="7.01" ${p}/><line x1="9" y1="11" x2="9" y2="11.01" ${p}/><line x1="15" y1="11" x2="15" y2="11.01" ${p}/><line x1="9" y1="15" x2="9" y2="15.01" ${p}/><line x1="15" y1="15" x2="15" y2="15.01" ${p}/><line x1="10" y1="21" x2="10" y2="18" ${p}/><line x1="14" y1="21" x2="14" y2="18" ${p}/>`,
    copy:`<rect x="9" y="9" width="12" height="12" rx="1.5" ${p}/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" ${p}/>`,
    paperclip:`<path d="M21.4 11.05 12.2 20.2a5 5 0 0 1-7.07-7.07l9.2-9.2a3.5 3.5 0 0 1 4.94 4.95l-9.2 9.19a2 2 0 0 1-2.82-2.83l8.48-8.48" ${p}/>`,
    help:`<circle cx="12" cy="12" r="10" ${p}/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" ${p}/><line x1="12" y1="17" x2="12.01" y2="17" ${p}/>`,
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">${paths[name]||''}</svg>`;
}

function esc(s){
  return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
/** Safely embeds `s` as a single-quoted JS string literal inside an HTML
 *  attribute (e.g. onclick="App.fn('...')"). Escaping order matters: the
 *  browser HTML-decodes an attribute's value *before* handing it to the JS
 *  parser, so escaping for JS must happen first, then esc() for HTML on
 *  top — esc() alone would turn a `'` into `&#39;`, which decodes right
 *  back into an unescaped `'` and breaks out of the JS string. */
function jsAttr(s){
  return esc(String(s==null?'':s).replace(/\\/g,'\\\\').replace(/'/g,"\\'"));
}
function uid(prefix){ return prefix+'-'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function genReference(){
  const d = new Date();
  const ym = d.getFullYear()+String(d.getMonth()+1).padStart(2,'0');
  return 'AUD-'+ym+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
}
function todayISO(){ return new Date().toISOString().slice(0,10); }
function formatDate(iso){
  if(!iso) return '—';
  const d = new Date(iso+'T00:00:00');
  if(isNaN(d)) return iso;
  return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' });
}
/** For full ISO timestamps (with time), e.g. deletedAt/rapportAt — unlike
 *  formatDate() this does not append a bare T00:00:00, which would corrupt
 *  an already-complete timestamp. */
function formatDateTime(iso){
  if(!iso) return '—';
  const d = new Date(iso);
  if(isNaN(d)) return iso;
  return d.toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
function formatDateShort(iso){
  const d = new Date(iso+'T00:00:00');
  if(isNaN(d)) return iso;
  return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit' });
}

function newMissionDraft(){
  return {
    id: uid('aud'),
    reference: genReference(),
    client: '', consultant: '', auditeur: (Store.lastAuditeur()||''),
    perimetre: '',
    dateMission: todayISO(), dateAudit: todayISO(),
    statut: 'brouillon',
    grid: CATEGORIES_TEMPLATE.map(cat=>({
      catId: cat.id, criteres: cat.criteres.map(c=>({ id:c.id, note:null, comment:'' }))
    })),
    nonConformites: [],
    historique: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/** Human-readable summary of what changed between two versions of a mission,
 *  for the per-audit history log. Returns null when nothing meaningful
 *  changed (e.g. a save triggered only by an internal field bump). */
function summarizeMissionChanges(oldMission, newMission){
  if(!oldMission) return "Audit créé.";
  const parts = [];

  if(oldMission.statut !== newMission.statut){
    parts.push(`Statut : ${STATUT_MISSION[oldMission.statut]||oldMission.statut} → ${STATUT_MISSION[newMission.statut]||newMission.statut}`);
  }
  const FIELD_LABEL = { client:'Entreprise', consultant:'Service audité', auditeur:'Auditeur', reference:'Référence', perimetre:'Périmètre', dateAudit:"Date d'audit", prochainAuditPrevu:'Prochain audit prévu' };
  Object.keys(FIELD_LABEL).forEach(f=>{
    if((oldMission[f]||'') !== (newMission[f]||'')) parts.push(`${FIELD_LABEL[f]} modifié`);
  });

  let notesChanged=0, commentsChanged=0, customAdded=0, customRemoved=0, attachmentsAdded=0, attachmentsRemoved=0;
  const oldCritById = {};
  (oldMission.grid||[]).forEach(catG=>(catG.criteres||[]).forEach(c=>{ oldCritById[c.id]=c; }));
  const newCritIds = new Set();
  (newMission.grid||[]).forEach(catG=>(catG.criteres||[]).forEach(c=>{
    newCritIds.add(c.id);
    const o = oldCritById[c.id];
    const oAtt = (o&&o.attachments)||[], nAtt = c.attachments||[];
    if(!o){ if(c.custom) customAdded++; attachmentsAdded += nAtt.length; return; }
    if(o.note !== c.note) notesChanged++;
    if((o.comment||'') !== (c.comment||'')) commentsChanged++;
    const oFiles = new Set(oAtt.map(a=>a.file)), nFiles = new Set(nAtt.map(a=>a.file));
    nAtt.forEach(a=>{ if(!oFiles.has(a.file)) attachmentsAdded++; });
    oAtt.forEach(a=>{ if(!nFiles.has(a.file)) attachmentsRemoved++; });
  }));
  Object.values(oldCritById).forEach(o=>{
    if(o.custom && !newCritIds.has(o.id)) customRemoved++;
    if(!newCritIds.has(o.id)) attachmentsRemoved += (o.attachments||[]).length;
  });
  if(notesChanged) parts.push(`${notesChanged} réponse${notesChanged>1?'s':''} modifiée${notesChanged>1?'s':''}`);
  if(commentsChanged) parts.push(`${commentsChanged} commentaire${commentsChanged>1?'s':''} modifié${commentsChanged>1?'s':''}`);
  if(customAdded) parts.push(`${customAdded} question${customAdded>1?'s':''} personnalisée${customAdded>1?'s':''} ajoutée${customAdded>1?'s':''}`);
  if(customRemoved) parts.push(`${customRemoved} question${customRemoved>1?'s':''} personnalisée${customRemoved>1?'s':''} supprimée${customRemoved>1?'s':''}`);
  if(attachmentsAdded) parts.push(`${attachmentsAdded} fichier${attachmentsAdded>1?'s':''} joint${attachmentsAdded>1?'s':''}`);
  if(attachmentsRemoved) parts.push(`${attachmentsRemoved} fichier${attachmentsRemoved>1?'s':''} retiré${attachmentsRemoved>1?'s':''}`);

  const oldCatById = {};
  (oldMission.grid||[]).forEach(c=>{ oldCatById[c.catId]=c; });
  let naAdded=0, naRemoved=0;
  (newMission.grid||[]).forEach(c=>{
    const o = oldCatById[c.catId];
    if(!!c.na === !!(o&&o.na)) return;
    if(c.na) naAdded++; else naRemoved++;
  });
  if(naAdded) parts.push(`${naAdded} domaine${naAdded>1?'s':''} marqué${naAdded>1?'s':''} non applicable`);
  if(naRemoved) parts.push(`${naRemoved} domaine${naRemoved>1?'s':''} redevenu${naRemoved>1?'s':''} applicable`);

  const oldNcById = {};
  (oldMission.nonConformites||[]).forEach(n=>{ oldNcById[n.id]=n; });
  const newNcIds = new Set((newMission.nonConformites||[]).map(n=>n.id));
  let ncAdded=0, ncStatutChanged=0, ncOtherChanged=0, ncRemoved=0;
  (newMission.nonConformites||[]).forEach(n=>{
    const o = oldNcById[n.id];
    if(!o){ ncAdded++; return; }
    if(o.statut !== n.statut) ncStatutChanged++;
    else if(JSON.stringify(o) !== JSON.stringify(n)) ncOtherChanged++;
  });
  (oldMission.nonConformites||[]).forEach(n=>{ if(!newNcIds.has(n.id)) ncRemoved++; });
  if(ncAdded) parts.push(`${ncAdded} non-conformité${ncAdded>1?'s':''} ajoutée${ncAdded>1?'s':''}`);
  if(ncStatutChanged) parts.push(`${ncStatutChanged} non-conformité${ncStatutChanged>1?'s':''} : statut mis à jour`);
  if(ncOtherChanged) parts.push(`${ncOtherChanged} non-conformité${ncOtherChanged>1?'s':''} modifiée${ncOtherChanged>1?'s':''}`);
  if(ncRemoved) parts.push(`${ncRemoved} non-conformité${ncRemoved>1?'s':''} supprimée${ncRemoved>1?'s':''}`);

  if((oldMission.deletedAt||null) !== (newMission.deletedAt||null)){
    parts.push(newMission.deletedAt ? 'Envoyé à la corbeille' : 'Restauré depuis la corbeille');
  }
  if(!oldMission.rapportFichier && newMission.rapportFichier) parts.push('Rapport final joint');
  if(oldMission.rapportFichier && !newMission.rapportFichier) parts.push('Rapport final retiré');

  return parts.length ? parts.join(' · ') : null;
}
function cloneMission(m){ return JSON.parse(JSON.stringify(m)); }

function computeScores(mission){
  // A domain marked "non applicable" for this audit (catG.na) is excluded
  // entirely from scoring — its questions still exist and can carry notes,
  // but neither its own score nor the global score counts them.
  const catScores = mission.grid.map(catG=>{
    const tpl = CATEGORIES_TEMPLATE.find(c=>c.id===catG.catId);
    if(catG.na){
      return { catId: catG.catId, nom: tpl?tpl.nom:catG.catId, pct: null, count: 0, total: catG.criteres.length, na: true };
    }
    let sum=0, count=0;
    catG.criteres.forEach(c=>{ if(c.note===0||c.note===1||c.note===2){ sum+=c.note; count++; } });
    const pct = count>0 ? Math.round((sum/(count*2))*100) : null;
    return { catId: catG.catId, nom: tpl?tpl.nom:catG.catId, pct, count, total: catG.criteres.length };
  });
  let sum=0, count=0, total=0;
  mission.grid.forEach(catG=>{
    if(catG.na) return;
    total += catG.criteres.length;
    catG.criteres.forEach(c=>{ if(c.note===0||c.note===1||c.note===2){ sum+=c.note; count++; } });
  });
  const global = count>0 ? Math.round((sum/(count*2))*100) : null;
  return { catScores, global, scored: count, total };
}
function scoreClass(pct){
  if(pct==null) return 'score-none';
  if(pct>=80) return 'score-good';
  if(pct>=55) return 'score-warn';
  return 'score-bad';
}
function scoreColor(pct){
  if(pct==null) return 'var(--ink-3)';
  if(pct>=80) return 'var(--good)';
  if(pct>=55) return 'var(--warning)';
  return 'var(--critical)';
}
function openNCCount(mission){
  return (mission.nonConformites||[]).filter(nc=>nc.statut!=='clos').length;
}
/** True if this non-conformité is still open and its échéance is in the past. */
function isOverdueNC(nc){
  if(!nc || nc.statut==='clos' || !nc.echeance) return false;
  const due = new Date(nc.echeance+'T23:59:59');
  if(isNaN(due)) return false;
  return due.getTime() < Date.now();
}
function overdueNCCount(mission){
  return (mission.nonConformites||[]).filter(isOverdueNC).length;
}

/** Urgency of a "prochain audit prévu" date: 'overdue' (past), 'soon'
 *  (within 30 days), 'ok' (further out), or null (no date set). */
function auditDueStatus(dateStr){
  if(!dateStr) return null;
  const due = new Date(dateStr+'T00:00:00');
  if(isNaN(due)) return null;
  const days = Math.round((due.getTime()-Date.now())/(24*60*60*1000));
  if(days<0) return 'overdue';
  if(days<=30) return 'soon';
  return 'ok';
}

/** Global search: true if `q` (already lowercased) matches this mission's
 *  identity fields, OR any question label / comment in its grid, OR any
 *  field of its non-conformités. Lets the dashboard search box find an audit
 *  by a specific question or answer, not just by client/auditeur name. */
function missionMatchesQuery(m, q){
  const hay = [m.client, m.consultant, m.auditeur, m.reference, m.perimetre].filter(Boolean).join(' ').toLowerCase();
  if(hay.includes(q)) return true;
  for(const catG of (m.grid||[])){
    for(const c of (catG.criteres||[])){
      const label = c.custom ? c.label : (CRITERES_INDEX[c.id]||{}).label;
      if(label && label.toLowerCase().includes(q)) return true;
      if(c.comment && c.comment.toLowerCase().includes(q)) return true;
    }
  }
  for(const nc of (m.nonConformites||[])){
    const ncHay = [nc.critereLabel, nc.description, nc.actionCorrective, nc.responsable].filter(Boolean).join(' ').toLowerCase();
    if(ncHay.includes(q)) return true;
  }
  return false;
}

/* ---------------- Data store (talks to the Electron main process) ---------------- */
const Store = {
  async list(){ return await window.api.listMissions(); },
  /** Saves a mission. Passes the mission's own last-known `updatedAt` as the
   *  expected version — if someone else has since saved a newer version of
   *  this exact mission, the main process refuses and returns {conflict:true}
   *  instead of silently overwriting their changes. Pass {force:true} to
   *  overwrite anyway (used when the user explicitly resolves a conflict). */
  async save(mission, opts){
    // Log what changed, for the per-audit history panel — computed against the
    // last version this app instance knows about (App.state.missions), before
    // this save. Never blocks the actual save if App isn't ready yet somehow.
    try{
      const old = App.state.missions.find(m=>m.id===mission.id);
      const resume = summarizeMissionChanges(old, mission);
      if(resume){
        mission.historique = (mission.historique||[]).concat([{ at:new Date().toISOString(), auteur:this.editorName(), resume }]);
      }
    }catch(e){}
    const res = await window.api.saveMission({ mission, expectedUpdatedAt: mission.updatedAt, force: !!(opts && opts.force) });
    if(res.ok){
      mission.updatedAt = res.updatedAt;
      try{ if(mission.auditeur) localStorage.setItem('pcrh_auditeur', mission.auditeur); }catch(e){}
    }
    return res;
  },
  async remove(id){ await window.api.deleteMission(id); },
  lastAuditeur(){ try{ return localStorage.getItem('pcrh_auditeur')||''; }catch(e){ return ''; } },
  /** The name of whoever is using THIS installation, remembered locally
   *  (never written to the shared audits data) so per-audit history entries
   *  can say who made a change. Purely declarative, not an authentication
   *  mechanism — consistent with the shared-credential "espace" model. */
  editorName(){ try{ return localStorage.getItem('pcrh_editor_name')||''; }catch(e){ return ''; } },
  setEditorName(name){ try{ localStorage.setItem('pcrh_editor_name', (name||'').trim()); }catch(e){} },
};

/** What changed in each version, shown once via the "Quoi de neuf" screen
 *  right after an automatic update (App.checkWhatsNew). Add an entry here
 *  whenever you ship a user-visible change, keyed by the package.json
 *  version it ships in. */
const CHANGELOG = {
  '1.2.0': [
    "Tableau de bord : nouveaux graphiques du score moyen et des non-conformités ouvertes, par domaine.",
  ],
  '1.3.0': [
    "Sauvegardes automatiques du dossier partagé (une copie par jour, conservée 30 jours) — accessible depuis Paramètres.",
  ],
  '1.4.0': [
    "Cet écran « Quoi de neuf » : il vous informe désormais des changements après chaque mise à jour automatique.",
  ],
  '1.5.0': [
    "Historique des modifications sur chaque audit (qui a fait quoi, et quand) — visible en bas de la fiche de l'audit.",
    "Nouveau champ « Votre nom » dans Paramètres, pour que l'historique vous attribue vos modifications.",
  ],
  '1.6.0': [
    "Nouvelle section « Clients » : vue consolidée de tous les audits d'une même entreprise, avec leur évolution dans le temps.",
  ],
  '1.7.0': [
    "Le tableau des missions se trie désormais en cliquant sur l'en-tête d'une colonne (référence, entreprise, date, score, non-conformités...).",
  ],
  '1.8.0': [
    "Bouton « Dupliquer » sur un audit : reprend l'entreprise, le service audité, l'auditeur et le périmètre, avec une grille vierge — pratique pour un audit de suivi chez un client déjà audité.",
  ],
  '1.9.0': [
    "Possibilité d'ajouter des questions propres à un audit, en plus de la grille standard — utile pour un point spécifique à un client, sans modifier la grille commune.",
  ],
  '1.10.0': [
    "Pièces jointes sur chaque question (photo, scan, document) — visibles sur la fiche de l'audit, absentes du rapport PDF client.",
    "Un domaine entier peut être marqué « Non applicable » pour un audit donné (ex : BDESE pour une petite structure) — il est alors exclu du score, sans perdre les réponses déjà saisies.",
    "Notification de bureau à l'ouverture de l'application s'il existe des non-conformités en retard.",
  ],
  '1.11.0': [
    "Le fichier d'audits est désormais chiffré dans le dossier partagé (clé dérivée de votre code d'accès) : plus personne ne peut en lire le contenu en l'ouvrant directement, sans passer par l'application.",
  ],
  '1.12.0': [
    "L'écran de connexion ne propose plus de créer un espace librement — cette action se fait désormais depuis Paramètres, réservée à qui a déjà accès à un espace existant.",
  ],
  '1.13.0': [
    "Champ « Prochain audit prévu » par audit, avec rappel visuel sur la fiche client (approche ou dépassement de l'échéance).",
    "Export PDF / impression de la fiche client (score moyen, évolution, historique des audits).",
    "Comparaison entre deux audits d'un même client : score par domaine, non-conformités résolues, nouvelles ou toujours ouvertes.",
  ],
  '1.14.0': [
    "Interface adaptée au tactile sur tablette : boutons, cases à cocher et champs agrandis, boutons de notation sur leur propre ligne — sans aucun changement sur ordinateur (souris/trackpad).",
  ],
  '1.15.0': [
    "Nouvelle page « Gérer la grille des questions » (Paramètres) : modifier le texte d'une question, ses liens de référence légale, ou ajouter/retirer une question — sans passer par une mise à jour de l'application.",
  ],
  '1.16.0': [
    "Barre de recherche dans « Gérer la grille des questions », pour retrouver une question sans ouvrir chaque domaine un par un.",
    "Export complet de l'espace en .zip (Paramètres) : audits, grille personnalisée, pièces jointes et rapports en une seule archive.",
  ],
  '1.17.0': [
    "Nouveau guide d'utilisation intégré (Paramètres → Consulter le guide d'utilisation), qui résume toutes les fonctionnalités de l'application.",
  ],
  '1.17.1': [
    "Le guide d'utilisation est désormais accessible directement depuis le tableau de bord (bouton « Guide »), en plus de Paramètres.",
  ],
};

/** Simple x.y.z version comparator: negative if a<b, 0 if equal, positive if a>b. */
function compareVersions(a, b){
  const pa = String(a).split('.').map(Number);
  const pb = String(b).split('.').map(Number);
  for(let i=0; i<Math.max(pa.length, pb.length); i++){
    const na = pa[i]||0, nb = pb[i]||0;
    if(na!==nb) return na-nb;
  }
  return 0;
}

/* ---------------- App ---------------- */
const App = {
  state:{
    booted:false,
    auth:{ unlocked:false, folder:null, identifiant:null, tab:'join',
      formFolder:null, formIdentifiant:'', formCode:'', formCode2:'', error:'', busy:false, folderExists:null },
    view:'dashboard', missions:[], filters:{ q:'', statut:'' },
    sort:{ field:'dateAudit', dir:'desc' },
    draft:null, openCats:new Set(CATEGORIES_TEMPLATE.map(c=>c.id)),
    reportId:null, confirm:null, conflict:null, toast:'',
    showSettings:false, settingsForm:null,
    showCreateSpace:false, newSpaceForm:null,
    compareA:null, compareB:null,
    gridOverrides:null, gridOpenCats:new Set(), gridEditingId:null, confirmRemoveQuestion:null, gridSearch:'',
    openRefFor:null,
    reportGenBusy:false,
    whatsNew:null,
  },

  async boot(){
    const last = await window.api.lastFolder();
    if(last.folder){
      this.state.auth.formFolder = last.folder;
      const info = await window.api.spaceInfo(last.folder);
      this.state.auth.folderExists = info.exists;
      this.state.auth.tab = info.exists ? 'join' : 'create';
    }
    this.state.booted = true;
    this.render();
  },

  /* ---- auth actions ---- */
  setAuthTab(tab){ this.state.auth.tab = tab; this.state.auth.error=''; this.render(); },
  updateAuthField(field, value){ this.state.auth[field] = value; },
  async chooseFolder(){
    const res = await window.api.chooseFolder();
    if(res.canceled) return;
    this.state.auth.formFolder = res.path;
    const info = await window.api.spaceInfo(res.path);
    this.state.auth.folderExists = info.exists;
    this.state.auth.tab = info.exists ? 'join' : 'create';
    this.state.auth.error = '';
    this.render();
  },
  async submitCreate(){
    const a = this.state.auth;
    if(!a.formFolder){ a.error = "Choisissez d'abord le dossier partagé de l'espace d'audits."; this.render(); return; }
    if(a.formCode !== a.formCode2){ a.error = "Les deux codes d'accès saisis ne correspondent pas."; this.render(); return; }
    a.busy = true; a.error=''; this.render();
    const res = await window.api.createSpace({ folder:a.formFolder, identifiant:a.formIdentifiant, code:a.formCode });
    a.busy = false;
    if(!res.ok){ a.error = res.error; this.render(); return; }
    await this.onUnlocked(res.folder);
  },
  async submitJoin(){
    const a = this.state.auth;
    if(!a.formFolder){ a.error = "Choisissez d'abord le dossier partagé de l'espace d'audits."; this.render(); return; }
    a.busy = true; a.error=''; this.render();
    const res = await window.api.unlockSpace({ folder:a.formFolder, identifiant:a.formIdentifiant, code:a.formCode });
    a.busy = false;
    if(!res.ok){ a.error = res.error; this.render(); return; }
    await this.onUnlocked(res.folder);
  },
  async onUnlocked(folder){
    const cur = await window.api.currentSpace();
    this.state.auth.unlocked = true;
    this.state.auth.folder = cur.folder;
    this.state.auth.identifiant = cur.identifiant;
    this.state.auth.error = '';
    this.state.view = 'dashboard';
    await this.loadGridOverrides();
    await this.loadMissions();
    this.startPolling();
    await this.checkWhatsNew();
    this.notifyOverdueOnce();
    this.render();
  },

  /** Loads this space's grid customizations (if any) from the shared folder
   *  and applies them on top of the built-in questionnaire, before any
   *  mission is created or rendered. A missing file or a read failure just
   *  means "no customization yet" — never blocks login. */
  async loadGridOverrides(){
    let overrides = { questionEdits:{}, addedQuestions:[], removedQuestionIds:[] };
    try{
      const res = await window.api.getGridOverrides();
      if(res.ok && res.overrides) overrides = res.overrides;
    }catch(e){ /* fall back to the built-in grid */ }
    this.state.gridOverrides = overrides;
    applyGridOverrides(overrides);
  },
  /** Persists this space's current grid overrides and re-applies them —
   *  called after every edit made in the grid editor. */
  async saveGridOverrides(){
    applyGridOverrides(this.state.gridOverrides);
    await window.api.saveGridOverrides(this.state.gridOverrides);
  },

  /* ---- grid editor ("Gérer la grille") ---- */
  openGridEditor(){
    this.state.showSettings = false;
    this.state.gridOpenCats = new Set();
    this.state.gridEditingId = null;
    this.state.gridSearch = '';
    this.state.view = 'grid';
    window.scrollTo(0,0);
    this.render();
  },
  openHelp(){
    this.state.showSettings = false;
    this.state.view = 'help';
    window.scrollTo(0,0);
    this.render();
  },
  toggleGridCat(catId){
    if(this.state.gridOpenCats.has(catId)) this.state.gridOpenCats.delete(catId); else this.state.gridOpenCats.add(catId);
    this.render();
  },
  setGridSearch(q){ this.state.gridSearch = q; this.render(); },
  isAddedQuestion(critId){
    return this.state.gridOverrides.addedQuestions.some(q=>q.id===critId);
  },
  startEditQuestion(critId){
    this.state.gridEditingId = critId;
    this.render();
    const el = document.getElementById('gridedit-'+critId);
    if(el){ el.focus(); }
  },
  cancelEditQuestion(){ this.state.gridEditingId = null; this.render(); },
  async saveQuestionLabel(critId, newLabel){
    newLabel = (newLabel||'').trim();
    if(!newLabel) return;
    const added = this.state.gridOverrides.addedQuestions.find(q=>q.id===critId);
    if(added){
      added.label = newLabel;
    } else {
      this.state.gridOverrides.questionEdits[critId] = Object.assign({}, this.state.gridOverrides.questionEdits[critId], { label: newLabel });
    }
    this.state.gridEditingId = null;
    await this.saveGridOverrides();
    this.showToast('Question modifiée');
    this.render();
  },
  async addQuestionRef(critId, label, url){
    label = (label||'').trim(); url = (url||'').trim();
    if(!label || !url) { this.showToast('Indiquez un libellé et un lien'); return; }
    const info = CATEGORIES_TEMPLATE.flatMap(c=>c.criteres).find(c=>c.id===critId);
    const currentRefs = (info&&info.refs) || [];
    const nextRefs = currentRefs.concat([{ label, url }]);
    const added = this.state.gridOverrides.addedQuestions.find(q=>q.id===critId);
    if(added) added.refs = nextRefs;
    else this.state.gridOverrides.questionEdits[critId] = Object.assign({}, this.state.gridOverrides.questionEdits[critId], { refs: nextRefs });
    await this.saveGridOverrides();
    this.showToast('Lien ajouté');
    this.render();
  },
  async removeQuestionRef(critId, idx){
    const info = CATEGORIES_TEMPLATE.flatMap(c=>c.criteres).find(c=>c.id===critId);
    const currentRefs = (info&&info.refs) || [];
    const nextRefs = currentRefs.filter((_,i)=>i!==idx);
    const added = this.state.gridOverrides.addedQuestions.find(q=>q.id===critId);
    if(added) added.refs = nextRefs;
    else this.state.gridOverrides.questionEdits[critId] = Object.assign({}, this.state.gridOverrides.questionEdits[critId], { refs: nextRefs });
    await this.saveGridOverrides();
    this.render();
  },
  async addGridQuestion(catId, sd, label){
    label = (label||'').trim();
    if(!label) return;
    this.state.gridOverrides.addedQuestions.push({ id: uid('gtpl'), catId, sd: sd||undefined, label, refs: [] });
    await this.saveGridOverrides();
    this.showToast('Question ajoutée à la grille');
    this.render();
  },
  requestRemoveGridQuestion(critId){ this.state.confirmRemoveQuestion = critId; this.render(); },
  cancelRemoveGridQuestion(){ this.state.confirmRemoveQuestion = null; this.render(); },
  async confirmRemoveGridQuestion(){
    const critId = this.state.confirmRemoveQuestion;
    this.state.confirmRemoveQuestion = null;
    const added = this.state.gridOverrides.addedQuestions.findIndex(q=>q.id===critId);
    if(added>=0){
      this.state.gridOverrides.addedQuestions.splice(added,1);
    } else {
      if(!this.state.gridOverrides.removedQuestionIds.includes(critId)) this.state.gridOverrides.removedQuestionIds.push(critId);
      delete this.state.gridOverrides.questionEdits[critId];
    }
    await this.saveGridOverrides();
    this.showToast('Question retirée de la grille');
    this.render();
  },

  /** One native desktop notification per unlock (not on every 20s poll)
   *  when non-conformités are already past their échéance — a nudge for
   *  anyone who doesn't have the dashboard open all day. Never blocks
   *  login if notifications are unsupported or denied. */
  notifyOverdueOnce(){
    try{
      if(typeof Notification==='undefined') return;
      const overdue = this.state.missions.filter(m=>!m.deletedAt).reduce((a,m)=>a+overdueNCCount(m),0);
      if(overdue<=0) return;
      const body = `${overdue} non-conformité${overdue>1?'s':''} en retard sur vos audits.`;
      if(Notification.permission==='granted'){
        new Notification('Audits PCRH', { body });
      } else if(Notification.permission==='default'){
        Notification.requestPermission().then(p=>{ if(p==='granted') new Notification('Audits PCRH', { body }); }).catch(()=>{});
      }
    }catch(e){ /* non-blocking */ }
  },

  /** Compares the running app's version to the last one recorded on this
   *  machine (stored locally, never in the shared audits data). If an
   *  automatic update moved it forward, queue up the "Quoi de neuf" modal
   *  with every changelog entry in between. Never blocks login on failure. */
  async checkWhatsNew(){
    try{
      const { version } = await window.api.getAppVersion();
      const { version: lastSeen } = await window.api.getLastSeenVersion();
      if(lastSeen && lastSeen !== version){
        const entries = Object.keys(CHANGELOG)
          .filter(v => compareVersions(v, lastSeen) > 0 && compareVersions(v, version) <= 0)
          .sort(compareVersions)
          .map(v => ({ version: v, items: CHANGELOG[v] }));
        if(entries.length) this.state.whatsNew = { version, entries };
      }
      await window.api.setLastSeenVersion(version);
    } catch(e) { /* non-blocking: worst case, no "what's new" this time */ }
  },
  closeWhatsNew(){ this.state.whatsNew = null; this.render(); },
  async lock(){
    this.stopPolling();
    await window.api.lock();
    this.state.auth.unlocked = false;
    this.state.auth.formCode = ''; this.state.auth.formCode2='';
    this.state.missions = [];
    this.state.showSettings = false;
    this.state.view = 'dashboard';
    const info = await window.api.spaceInfo(this.state.auth.formFolder);
    this.state.auth.folderExists = info.exists;
    this.state.auth.tab = 'join';
    this.render();
  },

  /* ---- polling refresh (picks up teammates' writes to the shared file) ---- */
  startPolling(){
    this.stopPolling();
    this._poll = setInterval(async ()=>{
      if(!this.state.auth.unlocked) return;
      if(this.state.view!=='dashboard') return;
      await this.loadMissions(true);
      this.render();
    }, 20000);
    window.addEventListener('focus', this._onFocus = async ()=>{
      if(!this.state.auth.unlocked) return;
      await this.loadMissions(true);
      this.render();
    });
  },
  stopPolling(){
    if(this._poll) clearInterval(this._poll);
    if(this._onFocus) window.removeEventListener('focus', this._onFocus);
  },

  async loadMissions(){ this.state.missions = await Store.list(); },

  /* ---- navigation ---- */
  setView(v){ this.state.view=v; this.state.confirm=null; window.scrollTo(0,0); this.render(); },
  newMission(){ this.state.draft = newMissionDraft(); this.state.openCats = new Set(CATEGORIES_TEMPLATE.map(c=>c.id)); this.state.view='form'; window.scrollTo(0,0); this.render(); },
  editMission(id){
    const m = this.state.missions.find(x=>x.id===id);
    if(!m) return;
    this.state.draft = cloneMission(m);
    this.state.openCats = new Set(CATEGORIES_TEMPLATE.map(c=>c.id));
    this.state.view='form'; window.scrollTo(0,0); this.render();
  },
  /** Opens a new, unsaved draft pre-filled from an existing audit's identity
   *  (entreprise, service audité, auditeur, périmètre) — grid, notes,
   *  non-conformités, statut, dates and rapport joint are all reset, so you
   *  don't retype everything for a follow-up audit at the same client. The
   *  duplicate is only created once the user saves it, same as newMission(). */
  duplicateMission(id, evt){
    if(evt) evt.stopPropagation();
    const orig = this.state.missions.find(x=>x.id===id);
    if(!orig) return;
    const copy = cloneMission(orig);
    copy.id = uid('aud');
    copy.reference = genReference();
    copy.statut = 'brouillon';
    copy.dateMission = todayISO();
    copy.dateAudit = todayISO();
    // Rebuild against the CURRENT grid template, in case it changed since the original audit.
    copy.grid = CATEGORIES_TEMPLATE.map(cat=>({
      catId: cat.id, criteres: cat.criteres.map(c=>({ id:c.id, note:null, comment:'' }))
    }));
    copy.nonConformites = [];
    copy.historique = [{ at:new Date().toISOString(), auteur:Store.editorName(), resume:`Dupliqué depuis l'audit ${orig.reference}.` }];
    delete copy.rapportFichier; delete copy.rapportAt; delete copy.deletedAt;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();
    this.state.draft = copy;
    this.state.openCats = new Set(CATEGORIES_TEMPLATE.map(c=>c.id));
    this.state.view = 'form';
    window.scrollTo(0,0);
    this.render();
  },
  viewReport(id){ this.state.reportId=id; this.state.view='report'; window.scrollTo(0,0); this.render(); },
  viewClient(name){
    this.state.clientName=name; this.state.view='client';
    const c = this.clientsSummary().find(x=>x.name===name);
    if(c && c.missions.length>=2){
      this.state.compareA = c.missions[1].id; // second most recent = "avant"
      this.state.compareB = c.missions[0].id; // most recent = "après"
    }
    window.scrollTo(0,0); this.render();
  },
  setCompare(which, id){ this.state['compare'+which] = id; this.render(); },
  viewClientByMissionId(id, evt){
    if(evt) evt.stopPropagation();
    const m = this.state.missions.find(x=>x.id===id);
    if(!m || !m.client) return;
    this.viewClient(m.client);
  },

  toggleRef(critId, evt){
    if(evt) evt.stopPropagation();
    this.state.openRefFor = (this.state.openRefFor===critId ? null : critId);
    this.render();
  },
  openRefLink(url, evt){
    if(evt) evt.stopPropagation();
    window.api.openExternal(url);
    this.state.openRefFor = null;
    this.render();
  },
  closeRefMenus(){
    if(this.state.openRefFor){ this.state.openRefFor = null; this.render(); }
  },

  updateDraftField(field, value){ if(this.state.draft) this.state.draft[field]=value; },
  setNote(catId, critId, note){
    const cat = this.state.draft.grid.find(c=>c.catId===catId);
    const crit = cat.criteres.find(c=>c.id===critId);
    crit.note = (crit.note===note ? null : note);
    this.render();
  },
  setComment(catId, critId, val){
    const cat = this.state.draft.grid.find(c=>c.catId===catId);
    cat.criteres.find(c=>c.id===critId).comment = val;
  },
  /** Adds a one-off question to this specific audit's grid, for something
   *  the standard 339-question template doesn't cover. Stored on the
   *  mission itself (not the shared template), so it never affects other
   *  audits — counts toward this domain's score like any other question. */
  addCustomQuestion(catId, label){
    label = (label||'').trim();
    if(!label) return;
    const cat = this.state.draft.grid.find(c=>c.catId===catId);
    if(!cat) return;
    cat.criteres.push({ id: uid('custom'), note:null, comment:'', custom:true, label });
    this.render();
  },
  removeCustomQuestion(catId, critId, evt){
    if(evt) evt.stopPropagation();
    const cat = this.state.draft.grid.find(c=>c.catId===catId);
    if(!cat) return;
    cat.criteres = cat.criteres.filter(c=>c.id!==critId);
    this.render();
  },

  /* ---- attachments on a grid question (proofs: photos, scans, documents) ---- */
  async addQuestionAttachment(catId, critId){
    const res = await window.api.addAttachment({ missionId: this.state.draft.id, critId });
    if(res.canceled) return;
    if(!res.ok){ this.showToast(res.error || "Échec de l'ajout du fichier"); return; }
    const cat = this.state.draft.grid.find(c=>c.catId===catId);
    const crit = cat.criteres.find(c=>c.id===critId);
    crit.attachments = (crit.attachments||[]).concat([{ file: res.file, name: res.name, addedAt: new Date().toISOString() }]);
    this.render();
  },
  async openQuestionAttachment(missionId, critId, file){
    const res = await window.api.openAttachment({ missionId, critId, file });
    if(!res.ok) this.showToast(res.error || "Impossible d'ouvrir le fichier");
  },
  async removeQuestionAttachment(catId, critId, file, evt){
    if(evt) evt.stopPropagation();
    const res = await window.api.removeAttachment({ missionId: this.state.draft.id, critId, file });
    if(!res.ok){ this.showToast(res.error || "Échec de la suppression"); return; }
    const cat = this.state.draft.grid.find(c=>c.catId===catId);
    const crit = cat.criteres.find(c=>c.id===critId);
    crit.attachments = (crit.attachments||[]).filter(a=>a.file!==file);
    this.render();
  },
  /** Excludes a whole domain from this audit's scoring (e.g. BDESE for a
   *  company under 50 employees) without deleting any answers already
   *  entered — reversible any time. */
  toggleCategoryNA(catId, evt){
    if(evt) evt.stopPropagation();
    const cat = this.state.draft.grid.find(c=>c.catId===catId);
    if(!cat) return;
    cat.na = !cat.na;
    this.render();
  },
  toggleCat(catId){
    if(this.state.openCats.has(catId)) this.state.openCats.delete(catId); else this.state.openCats.add(catId);
    this.render();
  },

  addNC(prefill){
    this.state.draft.nonConformites.push(Object.assign({
      id: uid('nc'), critereId:'', critereLabel:'', gravite:'mineure', description:'',
      actionCorrective:'', responsable:'', echeance:'', statut:'ouvert'
    }, prefill||{}));
    this.render();
  },
  removeNC(id){
    this.state.draft.nonConformites = this.state.draft.nonConformites.filter(n=>n.id!==id);
    this.render();
  },
  updateNC(id, field, value, rerender){
    const nc = this.state.draft.nonConformites.find(n=>n.id===id);
    if(nc) nc[field]=value;
    if(rerender) this.render();
  },
  generateNC(){
    const existingCritIds = new Set(this.state.draft.nonConformites.map(n=>n.critereId).filter(Boolean));
    let added = 0;
    this.state.draft.grid.forEach(catG=>{
      const tpl = CATEGORIES_TEMPLATE.find(c=>c.id===catG.catId);
      catG.criteres.forEach(c=>{
        if((c.note===0||c.note===1) && !existingCritIds.has(c.id)){
          const critTpl = tpl.criteres.find(t=>t.id===c.id);
          this.state.draft.nonConformites.push({
            id: uid('nc'), critereId:c.id, critereLabel: critTpl?critTpl.label:c.id,
            gravite: c.note===0 ? 'majeure' : 'mineure',
            description: c.comment || '', actionCorrective:'', responsable:'', echeance:'', statut:'ouvert'
          });
          added++;
        }
      });
    });
    this.showToast(added>0 ? added+" non-conformité(s) générée(s) depuis la grille" : "Aucun nouvel écart à générer");
    this.render();
  },

  async saveDraft(close){
    if(!this.state.draft.client || !this.state.draft.consultant){
      this.showToast("Merci de renseigner au moins l'entreprise et le service audité");
      return;
    }
    const res = await Store.save(this.state.draft);
    if(res.conflict){
      this.state.conflict = { mission: this.state.draft, close };
      this.render();
      return;
    }
    await this.loadMissions();
    this.showToast("Audit enregistré");
    if(close){ this.state.view='dashboard'; this.state.draft=null; }
    this.render();
  },
  async resolveConflictOverwrite(){
    const c = this.state.conflict;
    this.state.conflict = null;
    await Store.save(c.mission, { force:true });
    await this.loadMissions();
    this.showToast("Enregistré — votre version a remplacé celle de votre collègue");
    if(c.close){ this.state.view='dashboard'; this.state.draft=null; }
    this.render();
  },
  async resolveConflictReload(){
    const c = this.state.conflict;
    this.state.conflict = null;
    await this.loadMissions();
    const fresh = this.state.missions.find(x=>x.id===c.mission.id);
    if(fresh){ this.state.draft = cloneMission(fresh); this.state.view='form'; }
    this.showToast("Version la plus récente rechargée — vos modifications non enregistrées ont été perdues");
    this.render();
  },

  async exportPdf(id){
    const m = this.state.missions.find(x=>x.id===id);
    if(!m) return;
    this.showToast('Génération du PDF…');
    const res = await window.api.exportReportPdf({ reference: m.reference });
    if(res.canceled) return;
    this.showToast(res.ok ? 'PDF enregistré : '+res.path : (res.error || "Échec de l'export PDF"));
  },
  /** Exports whatever is currently on screen (the client detail page) to
   *  PDF — reuses the same main-process printToPDF plumbing as a single
   *  audit's export; `reference` there is only ever used for the default
   *  file name, so the client's name works just as well. */
  async exportClientPdf(name){
    this.showToast('Génération du PDF…');
    const res = await window.api.exportReportPdf({ reference: name });
    if(res.canceled) return;
    this.showToast(res.ok ? 'PDF enregistré : '+res.path : (res.error || "Échec de l'export PDF"));
  },
  async exportXlsx(){
    const missions = this.state.missions.filter(m=>!m.deletedAt);
    if(missions.length===0){ this.showToast("Aucun audit à exporter"); return; }
    const audits = missions.map(m=>{
      const sc = computeScores(m);
      return {
        'Référence': m.reference,
        'Entreprise': m.client||'',
        'Service audité': m.consultant||'',
        'Auditeur': m.auditeur||'',
        'Date de mission': m.dateMission||'',
        "Date d'audit": m.dateAudit||'',
        'Statut': STATUT_MISSION[m.statut]||m.statut,
        'Score global (%)': sc.global,
        'Critères notés': sc.scored,
        'Critères total': sc.total,
        'Non-conformités ouvertes': openNCCount(m),
        'Non-conformités totales': (m.nonConformites||[]).length,
        'Périmètre': m.perimetre||'',
      };
    });
    const nonConformites = [];
    missions.forEach(m=>{
      (m.nonConformites||[]).forEach(n=>{
        nonConformites.push({
          'Référence audit': m.reference,
          'Entreprise': m.client||'',
          'Écart': n.critereLabel||n.description||'',
          'Gravité': GRAVITE_NC[n.gravite]||n.gravite,
          'Description': n.description||'',
          'Action corrective': n.actionCorrective||'',
          'Responsable': n.responsable||'',
          'Échéance': n.echeance||'',
          'Statut': STATUT_NC[n.statut]||n.statut,
        });
      });
    });
    const res = await window.api.exportXlsx({ audits, nonConformites });
    if(res.canceled) return;
    if(!res.ok){ this.showToast(res.error || "Échec de l'export"); return; }
    this.showToast('Export enregistré : '+res.path);
  },

  requestDelete(id){ this.state.confirm = { id, kind:'trash' }; this.render(); },
  requestPurge(id){ this.state.confirm = { id, kind:'purge' }; this.render(); },
  cancelConfirm(){ this.state.confirm=null; this.render(); },
  async confirmDelete(){
    const id = this.state.confirm.id;
    this.state.confirm = null;
    const orig = this.state.missions.find(x=>x.id===id);
    if(!orig) return;
    const m = cloneMission(orig);
    m.deletedAt = new Date().toISOString();
    const res = await Store.save(m);
    await this.loadMissions();
    if(this.state.view==='report' && this.state.reportId===id) this.state.view='dashboard';
    if(this.state.view==='form' && this.state.draft && this.state.draft.id===id){ this.state.view='dashboard'; this.state.draft=null; }
    this.showToast(res.ok ? "Audit déplacé vers la corbeille" : (res.error||"Échec de la suppression"));
    this.render();
  },
  async confirmPurge(){
    const id = this.state.confirm.id;
    this.state.confirm = null;
    await Store.remove(id);
    await this.loadMissions();
    this.showToast("Audit supprimé définitivement");
    this.render();
  },
  async restoreMission(id){
    const orig = this.state.missions.find(x=>x.id===id);
    if(!orig) return;
    const m = cloneMission(orig);
    delete m.deletedAt;
    const res = await Store.save(m);
    await this.loadMissions();
    this.showToast(res.ok ? "Audit restauré" : (res.error||"Échec de la restauration"));
    this.render();
  },

  showToast(msg){
    this.state.toast = msg;
    this.render();
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(()=>{ this.state.toast=''; const t=document.getElementById('toast'); if(t) t.classList.remove('show'); }, 2600);
  },

  setFilter(field, val){ this.state.filters[field]=val; this.render(); },
  filteredMissions(){
    const q = this.state.filters.q.trim().toLowerCase();
    const st = this.state.filters.statut;
    const list = this.state.missions.filter(m=>{
      if(m.deletedAt) return false;
      if(st && m.statut!==st) return false;
      if(q && !missionMatchesQuery(m, q)) return false;
      return true;
    });
    return this.sortMissions(list);
  },

  /** Numeric/date fields default to a "biggest/most-recent first" sort on
   *  first click, since that's almost always the useful reading direction;
   *  text fields default to A→Z. Clicking the same column again flips it. */
  setSort(field){
    const DESC_FIRST = new Set(['dateAudit','score','nc']);
    if(this.state.sort.field === field){
      this.state.sort = { field, dir: this.state.sort.dir==='asc' ? 'desc' : 'asc' };
    } else {
      this.state.sort = { field, dir: DESC_FIRST.has(field) ? 'desc' : 'asc' };
    }
    this.render();
  },
  sortMissions(list){
    const { field, dir } = this.state.sort;
    if(!field) return list;
    const mul = dir==='asc' ? 1 : -1;
    const val = (m)=>{
      switch(field){
        case 'reference': return (m.reference||'').toLowerCase();
        case 'client': return (m.client||'').toLowerCase();
        case 'consultant': return (m.consultant||'').toLowerCase();
        case 'auditeur': return (m.auditeur||'').toLowerCase();
        case 'dateAudit': return m.dateAudit||'';
        case 'statut': return m.statut||'';
        case 'score': { const s = computeScores(m).global; return s==null ? -1 : s; }
        case 'nc': return openNCCount(m);
        default: return '';
      }
    };
    return list.slice().sort((a,b)=>{
      const va = val(a), vb = val(b);
      if(va<vb) return -1*mul;
      if(va>vb) return 1*mul;
      return 0;
    });
  },
  /** Renders a clickable, sort-indicating <th>. */
  sortTh(field, label){
    const s = this.state.sort;
    const active = s.field===field;
    const arrow = active ? (s.dir==='asc' ? ' ▲' : ' ▼') : '';
    return `<th onclick="App.setSort('${field}')" style="cursor:pointer; user-select:none; ${active?'color:var(--ink);':''}" title="Trier par ${label.toLowerCase()}">${label}${arrow}</th>`;
  },

  /* ---- settings ---- */
  async openSettings(){
    this.state.settingsForm = { identifiant:this.state.auth.identifiant, code:'', code2:'', error:'', editing:false, busy:false, apiKey:'', apiKeyBusy:false, apiKeySaved:false };
    this.state.showSettings = true; this.render();
    const res = await window.api.getApiKey();
    this.state.settingsForm.apiKey = res.apiKey || '';
    this.render();
  },
  closeSettings(){ this.state.showSettings=false; this.render(); },
  toggleEditCode(){ this.state.settingsForm.editing = !this.state.settingsForm.editing; this.render(); },
  updateSettingsField(f,v){ this.state.settingsForm[f]=v; },
  async submitChangeCode(){
    const f = this.state.settingsForm;
    if(f.code !== f.code2){ f.error = "Les deux codes saisis ne correspondent pas."; this.render(); return; }
    f.busy = true; f.error=''; this.render();
    const res = await window.api.changeCode({ newIdentifiant:f.identifiant, newCode:f.code });
    f.busy = false;
    if(!res.ok){ f.error = res.error; this.render(); return; }
    this.state.auth.identifiant = f.identifiant;
    f.editing = false; f.code=''; f.code2='';
    this.showToast("Identifiant et code d'accès mis à jour");
  },
  async revealFolder(){ await window.api.revealDataFile(); },
  async revealBackups(){ await window.api.openBackupsFolder(); },
  async exportAllSpace(){
    this.showToast("Préparation de l'export…");
    const res = await window.api.exportAllSpace();
    if(res.canceled) return;
    this.showToast(res.ok ? 'Export enregistré : '+res.path : (res.error||"Échec de l'export"));
  },

  /* ---- create an additional espace, from Settings only (never on the
   *  public login screen) — keeps that ability in the hands of whoever
   *  already has valid credentials for an existing espace. ---- */
  openCreateSpaceModal(){
    this.state.newSpaceForm = { folder:'', identifiant:'', code:'', code2:'', error:'', busy:false };
    this.state.showCreateSpace = true;
    this.render();
  },
  closeCreateSpaceModal(){ this.state.showCreateSpace = false; this.render(); },
  updateNewSpaceField(field, value){ this.state.newSpaceForm[field] = value; },
  async chooseNewSpaceFolder(){
    const res = await window.api.chooseFolder();
    if(res.canceled) return;
    this.state.newSpaceForm.folder = res.path;
    this.render();
  },
  async submitCreateNewSpace(){
    const f = this.state.newSpaceForm;
    if(!f.folder){ f.error = "Choisissez d'abord un dossier pour ce nouvel espace."; this.render(); return; }
    if(!f.identifiant || !f.identifiant.trim()){ f.error = "L'identifiant est requis."; this.render(); return; }
    if(f.code !== f.code2){ f.error = "Les deux codes saisis ne correspondent pas."; this.render(); return; }
    f.busy = true; f.error=''; this.render();
    const res = await window.api.createSpace({ folder: f.folder, identifiant: f.identifiant, code: f.code });
    f.busy = false;
    if(!res.ok){ f.error = res.error; this.render(); return; }
    this.state.showCreateSpace = false;
    this.state.showSettings = false;
    await this.onUnlocked(res.folder);
    this.showToast('Nouvel espace créé — vous y êtes maintenant connecté');
  },
  async copyAuditDataForClaude(id){
    const m = this.state.missions.find(x=>x.id===id);
    if(!m) return;
    const sc = computeScores(m);
    const lines = [];
    lines.push("Rédige un rapport d'audit de conformité RH professionnel, en français, à destination du client, à partir des données ci-dessous.");
    lines.push("Structure attendue : une synthèse (2-4 paragraphes), une appréciation pour chaque domaine, puis une conclusion avec recommandations prioritaires.");
    lines.push("N'invente aucun fait, aucun chiffre ni aucune non-conformité qui ne figurerait pas dans les données fournies.");
    lines.push("");
    lines.push("--- Données de l'audit ---");
    lines.push(`Entreprise : ${m.client || '—'}`);
    lines.push(`Service audité : ${m.consultant || '—'}`);
    lines.push(`Auditeur : ${m.auditeur || '—'}`);
    lines.push(`Date d'audit : ${m.dateAudit || '—'}`);
    if(m.perimetre) lines.push(`Périmètre : ${m.perimetre}`);
    lines.push(`Score global : ${sc.global!=null?sc.global+' %':'—'} (${sc.scored} / ${sc.total} critères notés)`);
    lines.push('');
    lines.push('Scores par domaine :');
    sc.catScores.forEach(cs=>{ lines.push(`- ${cs.nom} : ${cs.pct!=null?cs.pct+' %':'N/A'} (${cs.count}/${cs.total} critères notés)`); });
    lines.push('');
    const nc = m.nonConformites||[];
    lines.push(`Non-conformités (${nc.length}) :`);
    if(nc.length===0){ lines.push('- Aucune.'); }
    else nc.forEach(n=>{
      lines.push(`- [${GRAVITE_NC[n.gravite]||n.gravite}] ${n.critereLabel||n.description||'Écart'} — Action corrective : ${n.actionCorrective||'—'} — Responsable : ${n.responsable||'—'} — Échéance : ${n.echeance||'—'} — Statut : ${STATUT_NC[n.statut]||n.statut}`);
    });
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Données copiées — collez-les dans claude.ai');
    } catch(e) {
      this.showToast("Impossible de copier automatiquement, réessayez.");
      return;
    }
    if(window.api && window.api.openExternal) window.api.openExternal('https://claude.ai/new');
  },
  async attachReport(id){
    const orig = this.state.missions.find(x=>x.id===id);
    if(!orig) return;
    const res = await window.api.attachReport({ reference: orig.reference });
    if(res.canceled) return;
    if(!res.ok){ this.showToast(res.error || "Échec de l'ajout du rapport"); return; }
    const m = cloneMission(orig);
    m.rapportFichier = res.fileName;
    m.rapportAt = new Date().toISOString();
    const saveRes = await Store.save(m);
    await this.loadMissions();
    this.showToast(saveRes.ok ? 'Rapport joint à cet audit' : (saveRes.error||"Cet audit a été modifié ailleurs entre-temps, réessayez."));
    this.render();
  },
  async openAttachedReport(id){
    const m = this.state.missions.find(x=>x.id===id);
    if(!m || !m.rapportFichier) return;
    const res = await window.api.openReportFile(m.rapportFichier);
    if(!res.ok) this.showToast(res.error || "Impossible d'ouvrir le fichier");
  },
  async removeAttachedReport(id){
    const orig = this.state.missions.find(x=>x.id===id);
    if(!orig) return;
    const m = cloneMission(orig);
    delete m.rapportFichier; delete m.rapportAt;
    const res = await Store.save(m);
    await this.loadMissions();
    if(!res.ok) this.showToast(res.error||"Cet audit a été modifié ailleurs entre-temps, réessayez.");
    this.render();
  },
  async generateAiReport(id){
    const m = this.state.missions.find(x=>x.id===id);
    if(!m) return;
    this.state.reportGenBusy = true; this.render();
    const sc = computeScores(m);
    let res;
    try {
      res = await window.api.generateReport({ mission: m, scores: sc });
    } finally {
      this.state.reportGenBusy = false;
    }
    if(res.canceled){ this.render(); return; }
    if(!res.ok){ this.showToast(res.error || "Échec de la génération du rapport"); this.render(); return; }
    this.showToast('Rapport enregistré : ' + res.path);
    this.render();
  },
  async saveApiKey(){
    const f = this.state.settingsForm;
    f.apiKeyBusy = true; f.apiKeySaved = false; this.render();
    await window.api.setApiKey(f.apiKey);
    f.apiKeyBusy = false; f.apiKeySaved = true;
    this.showToast('Clé API Anthropic enregistrée');
  },

  /* ---------------- render ---------------- */
  render(){
    // Full innerHTML replace destroys and recreates every DOM node, which
    // silently drops focus from whatever input the user was typing in (e.g.
    // the live search box, which re-renders on every keystroke). Save the
    // focused element's id + cursor position and restore them afterwards.
    const active = document.activeElement;
    const activeId = active && active.id;
    const selStart = active && typeof active.selectionStart === 'number' ? active.selectionStart : null;
    const selEnd = active && typeof active.selectionEnd === 'number' ? active.selectionEnd : null;

    document.getElementById('app').innerHTML = this.state.auth.unlocked ? this.renderShell() : this.renderLogin();

    if(activeId){
      const el = document.getElementById(activeId);
      if(el){
        el.focus();
        if(selStart!=null && el.setSelectionRange){
          try{ el.setSelectionRange(selStart, selEnd); }catch(e){}
        }
      }
    }
  },

  renderLogin(){
    const a = this.state.auth;
    if(!this.state.booted){
      return `<div class="login-screen"><div class="login-card" style="text-align:center; color:var(--ink-3); font-size:13px;">Chargement…</div></div>`;
    }
    return `<div class="login-screen">
      <div class="bg-blobs" aria-hidden="true">
        <svg class="blob blob-1" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M54.5,-63.4C69.4,-53.6,79.2,-35.6,82.8,-16.4C86.4,2.8,83.8,23.2,73.6,38.6C63.4,54,45.6,64.4,26.8,71.1C8,77.8,-11.8,80.8,-30.4,75.7C-49,70.6,-66.4,57.4,-76.4,39.7C-86.4,22,-89,-0.2,-83.1,-19.7C-77.2,-39.2,-62.8,-56,-45.8,-65.5C-28.8,-75,-9.2,-77.2,7.9,-74.1C25,-71,49.7,-62.6,54.5,-63.4Z"/></svg>
        <svg class="blob blob-2" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M62.9,-52.7C77.5,-37.4,84.1,-16.6,81.6,2.7C79.1,22,67.5,39.9,52.1,52.4C36.7,64.9,17.5,72,-2.6,74.9C-22.7,77.8,-43.6,76.5,-58.9,65.4C-74.2,54.3,-83.9,33.4,-86.4,11.7C-88.9,-10,-84.2,-32.5,-71.8,-48.6C-59.4,-64.7,-39.3,-74.4,-19,-76.1C1.3,-77.8,21.9,-72.5,62.9,-52.7Z"/></svg>
        <svg class="blob-line" viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg"><path d="M0,180 C110,80 190,250 300,130 C380,40 460,20 560,70" fill="none" stroke-width="1.6"/></svg>
      </div>
      <div class="login-card">
      <div class="login-brand"><div class="seal">RH</div><div class="name">Audits PCRH</div></div>
      <div class="login-sub">Application de gestion des audits de conformité RH</div>

      <div class="field" style="margin-bottom:16px;">
        <label>Dossier de l'espace d'audits</label>
        <div class="folder-row">
          <div class="folder-display">${a.formFolder ? esc(a.formFolder) : "Aucun dossier sélectionné"}</div>
          <button class="btn" onclick="App.chooseFolder()">${icon('folder',15)} Choisir…</button>
        </div>
      </div>

      ${a.error ? `<div class="login-error">${icon('x',14)} ${esc(a.error)}</div>` : ''}

      ${a.formFolder && a.folderExists===false ? `
        <div class="login-hint" style="color:var(--warning); margin-bottom:12px;">Aucun espace d'audits n'existe encore dans ce dossier. Demandez à la personne qui gère les audits d'en créer un depuis Paramètres → Créer un nouvel espace.</div>
      ` : ''}

      <div class="login-field"><label>Identifiant</label><input type="text" value="${esc(a.formIdentifiant)}" placeholder="ex : Cabinet Alfred Gory" oninput="App.updateAuthField('formIdentifiant', this.value)"/></div>
      <div class="login-field"><label>Code d'accès</label><input type="password" value="${esc(a.formCode)}" placeholder="••••••••" oninput="App.updateAuthField('formCode', this.value)" onkeydown="if(event.key==='Enter') App.submitJoin()"/></div>
      <button class="btn-login" ${a.busy?'disabled':''} onclick="App.submitJoin()">${a.busy?'Connexion…':'Se connecter'}</button>
      <div class="login-hint">Utilisez l'identifiant et le code d'accès partagés par votre équipe pour ce dossier.</div>
    </div></div>`;
  },

  renderShell(){
    return `
      <div class="sidebar no-print">
        <div class="brand">
          <div class="mark"><div class="seal">RH</div><div class="name">Audits PCRH</div></div>
          <div class="sub">Audit de conformité RH</div>
        </div>
        <button class="btn-new" onclick="App.newMission()">${icon('plus',16)} Nouvel audit</button>
        <nav class="nav">
          <button class="nav-item ${this.state.view==='dashboard'?'active':''}" onclick="App.setView('dashboard')">${icon('dashboard')} Tableau de bord</button>
          <button class="nav-item ${this.state.view==='form'||this.state.view==='report'?'active':''}" onclick="App.setView('dashboard')">${icon('list')} Missions auditées</button>
          <button class="nav-item ${this.state.view==='clients'||this.state.view==='client'?'active':''}" onclick="App.setView('clients')">${icon('building',16)} Clients</button>
          <button class="nav-item ${this.state.view==='trash'?'active':''}" onclick="App.setView('trash')">${icon('trash',16)} Corbeille${this.trashCount()>0?` <span class="mono" style="margin-left:auto; font-size:11px; color:var(--ink-3);">${this.trashCount()}</span>`:''}</button>
        </nav>
        <div class="sidebar-foot">
          <button class="nav-item" onclick="App.openSettings()">${icon('settings',16)} Paramètres</button>
          <button class="nav-item" onclick="App.lock()">${icon('lock',16)} Verrouiller</button>
          <div class="sync-pill"><span class="dot"></span>Espace : ${esc(this.state.auth.identifiant||'')}</div>
          <div class="field-hint" title="${esc(this.state.auth.folder||'')}">Dossier local/partagé</div>
        </div>
      </div>
      <div class="main">
        <div class="container">
          ${this.state.view==='dashboard' ? this.renderDashboard() :
            this.state.view==='form' ? this.renderForm() :
            this.state.view==='report' ? this.renderReport() :
            this.state.view==='clients' ? this.renderClients() :
            this.state.view==='client' ? this.renderClientDetail() :
            this.state.view==='grid' ? this.renderGridEditor() :
            this.state.view==='help' ? this.renderHelp() :
            this.state.view==='trash' ? this.renderTrash() : ''}
        </div>
      </div>
      ${this.state.confirm ? this.renderConfirm() : ''}
      ${this.state.confirmRemoveQuestion ? this.renderConfirmRemoveQuestion() : ''}
      ${this.state.conflict ? this.renderConflict() : ''}
      ${this.state.showSettings ? this.renderSettings() : ''}
      ${this.state.showCreateSpace ? this.renderCreateSpaceModal() : ''}
      ${this.state.whatsNew ? this.renderWhatsNew() : ''}
      <div id="toast" class="toast ${this.state.toast?'show':''}">${esc(this.state.toast)}</div>
    `;
  },

  renderWhatsNew(){
    const w = this.state.whatsNew;
    return `<div class="modal-back" onclick="if(event.target===this) App.closeWhatsNew()">
      <div class="modal" style="max-width:460px;">
        <h3>Quoi de neuf dans Audits PCRH ${esc(w.version)}</h3>
        ${w.entries.map(e => `
          <div style="margin-bottom:14px;">
            ${w.entries.length>1 ? `<div style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--ink-3); margin-bottom:5px;">Version ${esc(e.version)}</div>` : ''}
            <ul style="margin:0; padding-left:18px; font-size:13px; color:var(--ink-2); line-height:1.6;">
              ${e.items.map(it=>`<li>${esc(it)}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
        <div class="row" style="margin-top:4px;"><button class="btn primary" onclick="App.closeWhatsNew()">Compris</button></div>
      </div>
    </div>`;
  },

  trashCount(){ return this.state.missions.filter(m=>m.deletedAt).length; },

  renderConfirm(){
    const c = this.state.confirm;
    const isPurge = c.kind==='purge';
    return `<div class="modal-back" onclick="if(event.target===this) App.cancelConfirm()">
      <div class="modal">
        <h3>${isPurge ? 'Supprimer définitivement cet audit ?' : 'Mettre cet audit à la corbeille ?'}</h3>
        <p>${isPurge ? "Cette action est irréversible : la grille, les commentaires et le plan d'actions associés seront perdus définitivement." : "Vous pourrez le restaurer depuis la Corbeille tant qu'il n'aura pas été supprimé définitivement."}</p>
        <div class="row">
          <button class="btn" onclick="App.cancelConfirm()">Annuler</button>
          <button class="btn danger" onclick="${isPurge?'App.confirmPurge()':'App.confirmDelete()'}">${icon('trash',15)} ${isPurge?'Supprimer définitivement':'Mettre à la corbeille'}</button>
        </div>
      </div>
    </div>`;
  },

  renderConfirmRemoveQuestion(){
    const critId = this.state.confirmRemoveQuestion;
    const info = CRITERES_INDEX[critId];
    return `<div class="modal-back" onclick="if(event.target===this) App.cancelRemoveGridQuestion()">
      <div class="modal">
        <h3>Retirer cette question de la grille ?</h3>
        <p>« ${esc(info?info.label:critId)} »</p>
        <p>Elle n'apparaîtra plus dans les nouveaux audits. Les audits déjà réalisés qui y avaient déjà répondu conservent cette réponse dans leur score, mais elle ne s'affichera plus à l'écran.</p>
        <div class="row">
          <button class="btn" onclick="App.cancelRemoveGridQuestion()">Annuler</button>
          <button class="btn danger" onclick="App.confirmRemoveGridQuestion()">${icon('trash',15)} Retirer</button>
        </div>
      </div>
    </div>`;
  },

  renderConflict(){
    const c = this.state.conflict;
    return `<div class="modal-back">
      <div class="modal">
        <h3>Conflit de modification</h3>
        <p>Un·e collègue a enregistré des changements sur cet audit (« ${esc(c.mission.client||c.mission.reference)} ») pendant que vous le modifiiez. Que voulez-vous faire ?</p>
        <div class="row" style="flex-direction:column; align-items:stretch; gap:8px;">
          <button class="btn" onclick="App.resolveConflictReload()">Recharger la version la plus récente (perdre mes modifications)</button>
          <button class="btn danger" onclick="App.resolveConflictOverwrite()">Écraser avec ma version</button>
        </div>
      </div>
    </div>`;
  },

  renderTrash(){
    const trashed = this.state.missions.filter(m=>m.deletedAt).sort((a,b)=>new Date(b.deletedAt)-new Date(a.deletedAt));
    return `
      <div class="pagehead">
        <div>
          <h1>Corbeille</h1>
          <div class="lede">Audits mis à la corbeille — restaurez-les ou supprimez-les définitivement.</div>
        </div>
        <div class="hactions">
          <button class="btn ghost" onclick="App.setView('dashboard')">${icon('back',15)} Retour au tableau de bord</button>
        </div>
      </div>
      <div class="panel">
        ${trashed.length===0 ? `<div class="empty-state"><div class="glyph">${icon('trash',20)}</div><h3>Corbeille vide</h3><p>Les audits supprimés depuis le tableau de bord apparaissent ici avant leur suppression définitive.</p></div>` : `
        <div class="table-wrap"><table>
          <thead><tr><th>Référence</th><th>Entreprise</th><th>Mis à la corbeille le</th><th></th></tr></thead>
          <tbody>
            ${trashed.map(m=>`
              <tr>
                <td class="ref">${esc(m.reference)}</td>
                <td class="client-cell">${esc(m.client)||'—'}</td>
                <td class="tnum">${formatDateTime(m.deletedAt)}</td>
                <td style="text-align:right; white-space:nowrap;">
                  <button class="btn" onclick="App.restoreMission('${m.id}')">Restaurer</button>
                  <button class="btn danger" onclick="App.requestPurge('${m.id}')">${icon('trash',14)} Supprimer définitivement</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table></div>`}
      </div>
    `;
  },

  renderSettings(){
    const f = this.state.settingsForm;
    return `<div class="modal-back" onclick="if(event.target===this) App.closeSettings()">
      <div class="modal" style="max-width:440px;">
        <h3>Paramètres de l'espace</h3>
        <div class="settings-row"><div class="k">Identifiant actuel</div><div class="v">${esc(this.state.auth.identifiant)}</div></div>
        <div class="settings-row"><div class="k">Dossier de données</div><div class="v" style="max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${esc(this.state.auth.folder)}">${esc(this.state.auth.folder)}</div></div>
        <div class="settings-row"><div class="k">Fichier d'audits</div><button class="btn ghost" onclick="App.revealFolder()">Ouvrir l'emplacement</button></div>
        <div class="settings-row"><div class="k">Chiffrement des données</div><div class="v" style="color:var(--good);">Activé</div></div>
        <div class="field-hint" style="margin:-4px 0 0;">Le fichier d'audits est chiffré avec une clé dérivée de votre code d'accès : illisible sans lui, y compris en l'ouvrant directement depuis le dossier partagé.</div>
        <div class="settings-row"><div class="k">Sauvegardes automatiques</div><button class="btn ghost" onclick="App.revealBackups()">Ouvrir le dossier</button></div>
        <div class="field-hint" style="margin:-4px 0 0;">Une copie de sécurité est conservée automatiquement avant chaque modification (30 derniers jours), au cas où un audit serait perdu ou corrompu.</div>
        <div class="settings-row"><div class="k">Export complet de l'espace</div><button class="btn ghost" onclick="App.exportAllSpace()">${icon('download',15)} Exporter en .zip</button></div>
        <div class="field-hint" style="margin:-4px 0 0;">Audits, grille personnalisée, pièces jointes et rapports en une seule archive — pour garder une copie externe, ou avant un changement important.</div>

        <div style="margin-top:16px; padding-top:14px; border-top:1px solid var(--border);">
          <div class="login-field"><label>Votre nom</label><input type="text" value="${esc(Store.editorName())}" placeholder="ex : Marie Dupont" oninput="Store.setEditorName(this.value)"/></div>
          <div class="field-hint">Utilisé uniquement pour l'historique des modifications de chaque audit (qui a fait quoi), sur cet ordinateur.</div>
        </div>

        ${!f.editing ? `
          <div class="settings-row"><div class="k">Identifiant / code d'accès</div><button class="btn" onclick="App.toggleEditCode()">Changer</button></div>
        ` : `
          <div style="margin-top:14px;">
            ${f.error ? `<div class="login-error">${icon('x',14)} ${esc(f.error)}</div>` : ''}
            <div class="login-field"><label>Nouvel identifiant</label><input type="text" value="${esc(f.identifiant)}" oninput="App.updateSettingsField('identifiant', this.value)"/></div>
            <div class="login-field"><label>Nouveau code d'accès</label><input type="password" value="${esc(f.code)}" oninput="App.updateSettingsField('code', this.value)"/></div>
            <div class="login-field"><label>Confirmer le nouveau code</label><input type="password" value="${esc(f.code2)}" oninput="App.updateSettingsField('code2', this.value)"/></div>
            <div class="row">
              <button class="btn" onclick="App.toggleEditCode()">Annuler</button>
              <button class="btn primary" ${f.busy?'disabled':''} onclick="App.submitChangeCode()">Enregistrer</button>
            </div>
          </div>
        `}
        <div style="margin-top:18px; padding-top:14px; border-top:1px solid var(--border);">
          <div style="font-weight:600; font-size:13px; margin-bottom:4px;">Génération de rapport par IA (Claude)</div>
          <div class="field-hint" style="margin-bottom:10px;">Clé API Anthropic utilisée pour rédiger automatiquement les rapports d'audit. Elle est enregistrée uniquement sur cet ordinateur, jamais dans le dossier partagé.</div>
          <div class="login-field"><label>Clé API Anthropic</label><input type="password" value="${esc(f.apiKey)}" placeholder="sk-ant-…" oninput="App.updateSettingsField('apiKey', this.value); App.state.settingsForm.apiKeySaved=false;"/></div>
          <div class="row">
            <button class="btn primary" ${f.apiKeyBusy?'disabled':''} onclick="App.saveApiKey()">${f.apiKeyBusy?'Enregistrement…':'Enregistrer la clé'}</button>
            ${f.apiKeySaved ? `<span style="color:var(--good); font-size:12.5px;">✓ Enregistrée</span>` : ''}
          </div>
        </div>

        <div style="margin-top:18px; padding-top:14px; border-top:1px solid var(--border);">
          <button class="btn ghost" onclick="App.openHelp()">${icon('help',15)} Consulter le guide d'utilisation</button>
        </div>

        <div style="margin-top:18px; padding-top:14px; border-top:1px solid var(--border);">
          <div style="font-weight:600; font-size:13px; margin-bottom:4px;">Grille de questions</div>
          <div class="field-hint" style="margin-bottom:10px;">Modifier le texte d'une question, ses liens de référence légale, ou ajouter/retirer une question — pour tous les nouveaux audits de cet espace.</div>
          <button class="btn" onclick="App.openGridEditor()">${icon('list')} Gérer la grille des questions…</button>
        </div>

        <div style="margin-top:18px; padding-top:14px; border-top:1px solid var(--border);">
          <div style="font-weight:600; font-size:13px; margin-bottom:4px;">Créer un nouvel espace</div>
          <div class="field-hint" style="margin-bottom:10px;">Pour démarrer un espace d'audits séparé (autre dossier partagé, autre identifiant/code) — vous y serez automatiquement connecté après création. Volontairement absent de l'écran de connexion pour que seule une personne ayant déjà accès à un espace existant puisse en créer un nouveau.</div>
          <button class="btn" onclick="App.openCreateSpaceModal()">${icon('plus',15)} Créer un nouvel espace…</button>
        </div>

        <div class="row" style="margin-top:18px;"><button class="btn ghost" onclick="App.closeSettings()">Fermer</button></div>
      </div>
    </div>`;
  },

  renderCreateSpaceModal(){
    const f = this.state.newSpaceForm;
    return `<div class="modal-back" onclick="if(event.target===this) App.closeCreateSpaceModal()">
      <div class="modal" style="max-width:440px;">
        <h3>Créer un nouvel espace</h3>
        <p>Un espace totalement séparé de celui-ci, avec son propre dossier partagé et ses propres identifiants.</p>
        ${f.error ? `<div class="login-error">${icon('x',14)} ${esc(f.error)}</div>` : ''}
        <div class="field" style="margin-bottom:12px;">
          <label>Dossier du nouvel espace</label>
          <div class="folder-row">
            <div class="folder-display">${f.folder ? esc(f.folder) : "Aucun dossier sélectionné"}</div>
            <button class="btn" onclick="App.chooseNewSpaceFolder()">${icon('folder',15)} Choisir…</button>
          </div>
        </div>
        <div class="login-field"><label>Identifiant de l'espace</label><input type="text" value="${esc(f.identifiant)}" placeholder="ex : Cabinet Alfred Gory" oninput="App.updateNewSpaceField('identifiant', this.value)"/></div>
        <div class="login-field"><label>Code d'accès</label><input type="password" value="${esc(f.code)}" placeholder="Au moins 4 caractères" oninput="App.updateNewSpaceField('code', this.value)"/></div>
        <div class="login-field"><label>Confirmer le code d'accès</label><input type="password" value="${esc(f.code2)}" placeholder="Ressaisir le code" oninput="App.updateNewSpaceField('code2', this.value)" onkeydown="if(event.key==='Enter') App.submitCreateNewSpace()"/></div>
        <div class="row" style="margin-top:14px;">
          <button class="btn ghost" onclick="App.closeCreateSpaceModal()">Annuler</button>
          <button class="btn primary" ${f.busy?'disabled':''} onclick="App.submitCreateNewSpace()">${f.busy?'Création…':"Créer l'espace"}</button>
        </div>
      </div>
    </div>`;
  },

  /* ---------- Dashboard ---------- */
  renderDashboard(){
    const all = this.state.missions.filter(m=>!m.deletedAt);
    const scored = all.map(m=>computeScores(m));
    const withScore = scored.filter(s=>s.global!=null);
    const avg = withScore.length ? Math.round(withScore.reduce((a,s)=>a+s.global,0)/withScore.length) : null;
    const openNC = all.reduce((a,m)=>a+openNCCount(m),0);
    const overdueNC = all.reduce((a,m)=>a+overdueNCCount(m),0);
    const enCours = all.filter(m=>m.statut==='en_cours').length;
    const cloture = all.filter(m=>m.statut==='cloture').length;
    const brouillon = all.filter(m=>m.statut==='brouillon').length;
    const list = this.filteredMissions();

    return `
      <div class="dash-blobs" aria-hidden="true">
        <svg class="blob blob-1" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M54.5,-63.4C69.4,-53.6,79.2,-35.6,82.8,-16.4C86.4,2.8,83.8,23.2,73.6,38.6C63.4,54,45.6,64.4,26.8,71.1C8,77.8,-11.8,80.8,-30.4,75.7C-49,70.6,-66.4,57.4,-76.4,39.7C-86.4,22,-89,-0.2,-83.1,-19.7C-77.2,-39.2,-62.8,-56,-45.8,-65.5C-28.8,-75,-9.2,-77.2,7.9,-74.1C25,-71,49.7,-62.6,54.5,-63.4Z"/></svg>
        <svg class="blob blob-2" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M62.9,-52.7C77.5,-37.4,84.1,-16.6,81.6,2.7C79.1,22,67.5,39.9,52.1,52.4C36.7,64.9,17.5,72,-2.6,74.9C-22.7,77.8,-43.6,76.5,-58.9,65.4C-74.2,54.3,-83.9,33.4,-86.4,11.7C-88.9,-10,-84.2,-32.5,-71.8,-48.6C-59.4,-64.7,-39.3,-74.4,-19,-76.1C1.3,-77.8,21.9,-72.5,62.9,-52.7Z"/></svg>
      </div>
      <div style="position:relative; z-index:1;">
      <div class="pagehead">
        <div>
          <h1>Tableau de bord</h1>
          <div class="lede">Suivi des audits de conformité RH réalisés au sein de l'entreprise.</div>
        </div>
        <div class="hactions">
          <button class="btn ghost" onclick="App.openHelp()" title="Guide d'utilisation">${icon('help',15)} Guide</button>
          <button class="btn" onclick="App.exportXlsx()">${icon('download',15)} Exporter (Excel)</button>
          <button class="btn primary" onclick="App.newMission()">${icon('plus',15)} Nouvel audit</button>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi"><div class="label">Missions auditées</div><div class="value tnum">${all.length}</div><div class="sub">${brouillon} en brouillon</div></div>
        <div class="kpi"><div class="label">Score moyen</div><div class="value tnum" style="color:${scoreColor(avg)}">${avg!=null?avg+' %':'—'}</div><div class="sub">sur ${withScore.length} mission${withScore.length>1?'s':''} notée${withScore.length>1?'s':''}</div></div>
        <div class="kpi"><div class="label">Non-conformités ouvertes</div><div class="value tnum" style="color:${openNC>0?'var(--critical)':'var(--good)'}">${openNC}</div><div class="sub" style="${overdueNC>0?'color:var(--critical); font-weight:600;':''}">${overdueNC>0?`⚠ ${overdueNC} en retard`:'tous audits confondus'}</div></div>
        <div class="kpi"><div class="label">Missions en cours</div><div class="value tnum">${enCours}</div><div class="sub">${cloture} clôturée${cloture>1?'s':''}</div></div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Évolution du score global</h2>
          <div class="stat-chips">
            <div class="chip"><span class="cdot" style="background:var(--ink-3)"></span>Brouillon ${brouillon}</div>
            <div class="chip"><span class="cdot" style="background:var(--warning)"></span>En cours ${enCours}</div>
            <div class="chip"><span class="cdot" style="background:var(--good)"></span>Clôturé ${cloture}</div>
          </div>
        </div>
        <div class="panel-body chart-wrap">${this.renderTrendChart(all, scored)}</div>
      </div>

      <div class="panel-row">
        <div class="panel">
          <div class="panel-head"><h2>Score moyen par domaine</h2></div>
          <div class="panel-body chart-wrap">${this.renderDomainScoreChart(scored)}</div>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Non-conformités ouvertes par domaine</h2></div>
          <div class="panel-body chart-wrap">${this.renderNCDomainChart(all)}</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2>Missions auditées</h2>
          <div class="filters">
            <input id="dashboard-search" type="text" placeholder="Rechercher entreprise, question, réponse, non-conformité…" value="${esc(this.state.filters.q)}" oninput="App.setFilter('q', this.value)" title="Recherche aussi dans les questions de la grille, les commentaires et le plan d'actions"/>
            <select onchange="App.setFilter('statut', this.value)">
              <option value="">Tous statuts</option>
              <option value="brouillon" ${this.state.filters.statut==='brouillon'?'selected':''}>Brouillon</option>
              <option value="en_cours" ${this.state.filters.statut==='en_cours'?'selected':''}>En cours</option>
              <option value="cloture" ${this.state.filters.statut==='cloture'?'selected':''}>Clôturé</option>
            </select>
          </div>
        </div>
        ${list.length===0 ? this.renderEmptyMissions(all.length>0) : `
        <div class="table-wrap"><table>
          <thead><tr>
            ${this.sortTh('reference','Référence')}${this.sortTh('client','Entreprise')}${this.sortTh('consultant','Service audité')}${this.sortTh('auditeur','Auditeur')}${this.sortTh('dateAudit',"Date d'audit")}${this.sortTh('statut','Statut')}${this.sortTh('score','Score')}${this.sortTh('nc','NC ouvertes')}<th></th>
          </tr></thead>
          <tbody>
            ${list.map(m=>{
              const sc = computeScores(m);
              const nc = openNCCount(m);
              const overdue = overdueNCCount(m);
              return `<tr onclick="App.viewReport('${m.id}')">
                <td class="ref">${esc(m.reference)}</td>
                <td class="client-cell">${m.client ? `<a href="#" class="client-link" onclick="App.viewClientByMissionId('${m.id}', event); return false;">${esc(m.client)}</a>` : '—'}</td>
                <td>${esc(m.consultant)||'—'}</td>
                <td>${esc(m.auditeur)||'—'}</td>
                <td class="tnum">${formatDate(m.dateAudit)}</td>
                <td><span class="badge ${m.statut}"><span class="bdot"></span>${STATUT_MISSION[m.statut]||m.statut}</span></td>
                <td><span class="score-chip ${scoreClass(sc.global)}">${sc.global!=null?sc.global:'—'}${sc.global!=null?'<span class="u"> %</span>':''}</span></td>
                <td class="tnum">${nc>0?`<span class="badge ouvert" title="${overdue>0?overdue+' en retard':''}"><span class="bdot"></span>${nc}${overdue>0?' ⚠':''}</span>`:'<span style="color:var(--ink-3)">0</span>'}</td>
                <td onclick="event.stopPropagation()">
                  <button class="btn ghost" title="Modifier" onclick="App.editMission('${m.id}')">${icon('pencil',15)}</button>
                  <button class="btn ghost" title="Dupliquer" onclick="App.duplicateMission('${m.id}', event)">${icon('copy',15)}</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table></div>`}
      </div>
      </div>
    `;
  },

  renderEmptyMissions(hasAnyButFiltered){
    if(hasAnyButFiltered){
      return `<div class="empty-state"><div class="glyph">?</div><h3>Aucun résultat</h3><p>Aucune mission ne correspond à ces filtres.</p></div>`;
    }
    return `<div class="empty-state">
      <div class="glyph">RH</div>
      <h3>Aucun audit pour le moment</h3>
      <p>Créez votre premier audit pour évaluer la conformité RH de l'entreprise, sur une grille de ${CATEGORIES_TEMPLATE.length} domaines et ${CATEGORIES_TEMPLATE.reduce((a,c)=>a+c.criteres.length,0)} questions.</p>
      <button class="btn primary" onclick="App.newMission()">${icon('plus',15)} Créer un audit</button>
    </div>`;
  },

  renderTrendChart(all, scored){
    const pts = all.map((m,i)=>({ m, s:scored[i] })).filter(p=>p.s.global!=null && p.m.dateAudit)
      .sort((a,b)=> a.m.dateAudit.localeCompare(b.m.dateAudit));
    if(pts.length < 2){
      return `<div class="chart-empty">Au moins deux audits notés sont nécessaires pour afficher une tendance.</div>`;
    }
    const W=900, H=220, padL=34, padR=16, padT=14, padB=28;
    const times = pts.map(p=> new Date(p.m.dateAudit+'T00:00:00').getTime());
    const tMin = Math.min(...times), tMax = Math.max(...times);
    const x = t => tMax===tMin ? padL + (W-padL-padR)/2 : padL + (t-tMin)/(tMax-tMin)*(W-padL-padR);
    const y = v => padT + (1 - v/100) * (H-padT-padB);
    const coords = pts.map(p=>({ x:x(new Date(p.m.dateAudit+'T00:00:00').getTime()), y:y(p.s.global), p }));
    const line = coords.map((c,i)=> (i===0?'M':'L')+c.x.toFixed(1)+' '+c.y.toFixed(1)).join(' ');
    const area = line + ` L${coords[coords.length-1].x.toFixed(1)} ${y(0).toFixed(1)} L${coords[0].x.toFixed(1)} ${y(0).toFixed(1)} Z`;
    const grid = [0,25,50,75,100].map(v=>`
      <line x1="${padL}" y1="${y(v)}" x2="${W-padR}" y2="${y(v)}" stroke="var(--border)" stroke-width="1"/>
      <text x="${padL-8}" y="${y(v)+4}" text-anchor="end" font-size="10.5" fill="var(--ink-3)" font-family="IBM Plex Mono, monospace">${v}</text>
    `).join('');
    const xTickIdx = [0, Math.floor((coords.length-1)/2), coords.length-1];
    const xTicks = [...new Set(xTickIdx)].map(i=>{
      const c = coords[i];
      return `<text x="${c.x}" y="${H-8}" text-anchor="middle" font-size="10.5" fill="var(--ink-3)" font-family="IBM Plex Mono, monospace">${formatDateShort(pts[i].m.dateAudit)}</text>`;
    }).join('');
    const dots = coords.map((c,i)=> `<circle cx="${c.x}" cy="${c.y}" r="${i===coords.length-1?4.5:3}" fill="${i===coords.length-1?'var(--accent)':'var(--surface)'}" stroke="var(--accent)" stroke-width="2"><title>${esc(pts[i].m.client)} — ${formatDate(pts[i].m.dateAudit)} — ${pts[i].s.global}%</title></circle>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="width:100%; height:auto; display:block;">
      <defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
      </linearGradient></defs>
      ${grid}
      <path d="${area}" fill="url(#trendFill)"/>
      <path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}
      ${xTicks}
    </svg>`;
  },

  /** Average conformity score per domain, across every scored mission —
   *  surfaces the domains where clients most often fall short, company-wide. */
  renderDomainScoreChart(scored){
    const agg = {}; // catId -> { sum, count, nom }
    scored.forEach(s=>{
      s.catScores.forEach(cs=>{
        if(cs.pct==null) return;
        if(!agg[cs.catId]) agg[cs.catId] = { sum:0, count:0, nom:cs.nom };
        agg[cs.catId].sum += cs.pct;
        agg[cs.catId].count += 1;
      });
    });
    const rows = Object.values(agg).map(v=>({ nom:v.nom, pct: Math.round(v.sum/v.count) })).sort((a,b)=>a.pct-b.pct);
    if(rows.length===0){
      return `<div class="chart-empty">Notez au moins un audit pour voir le score moyen par domaine.</div>`;
    }
    return `<div class="bar-chart">${rows.map(r=>`
      <div class="bar-row">
        <div class="bar-top"><span class="lbl" title="${esc(r.nom)}">${esc(r.nom)}</span><span class="val" style="color:${scoreColor(r.pct)}">${r.pct} %</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${r.pct}%; background:${scoreColor(r.pct)}"></div></div>
      </div>
    `).join('')}</div>`;
  },

  /** Count of still-open non-conformités, grouped by domain — shows where
   *  corrective actions are most needed across the whole portfolio. */
  renderNCDomainChart(all){
    const agg = {}; // key -> { count, nom }
    all.forEach(m=>{
      (m.nonConformites||[]).forEach(nc=>{
        if(nc.statut==='clos') return;
        const info = nc.critereId ? CRITERES_INDEX[nc.critereId] : null;
        const key = info ? info.catId : 'autre';
        const nom = info ? info.catNom : 'Autre';
        if(!agg[key]) agg[key] = { count:0, nom };
        agg[key].count += 1;
      });
    });
    const rows = Object.values(agg).sort((a,b)=>b.count-a.count);
    if(rows.length===0){
      return `<div class="chart-empty">Aucune non-conformité ouverte actuellement.</div>`;
    }
    const max = Math.max(...rows.map(r=>r.count));
    return `<div class="bar-chart">${rows.map(r=>`
      <div class="bar-row">
        <div class="bar-top"><span class="lbl" title="${esc(r.nom)}">${esc(r.nom)}</span><span class="val" style="color:var(--critical)">${r.count}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(r.count/max*100)}%; background:var(--critical)"></div></div>
      </div>
    `).join('')}</div>`;
  },

  /* ---------- Clients ---------- */
  /** Groups every (non-deleted) mission by client name — case/whitespace-
   *  insensitively, since it's freeform text — and computes, per client, the
   *  audit count, latest audit, latest score, and its evolution versus the
   *  audit before it. */
  clientsSummary(){
    const all = this.state.missions.filter(m=>!m.deletedAt);
    const byKey = {};
    all.forEach(m=>{
      const name = (m.client||'').trim();
      const key = name.toLowerCase() || ' ';
      if(!byKey[key]) byKey[key] = { name: name || '(Sans nom)', missions: [] };
      byKey[key].missions.push(m);
    });
    return Object.values(byKey).map(g=>{
      const sorted = g.missions.slice().sort((a,b)=> (b.dateAudit||'').localeCompare(a.dateAudit||''));
      const scores = sorted.map(computeScores);
      return {
        name: g.name,
        count: sorted.length,
        lastDate: sorted[0].dateAudit,
        lastScore: scores[0].global,
        prevScore: scores.length>1 ? scores[1].global : null,
        nextAudit: sorted[0].prochainAuditPrevu || null,
        missions: sorted,
      };
    }).sort((a,b)=> (b.lastDate||'').localeCompare(a.lastDate||''));
  },

  renderClients(){
    const clients = this.clientsSummary();
    return `
      <div class="pagehead">
        <div>
          <h1>Clients</h1>
          <div class="lede">Vue consolidée des audits réalisés, par entreprise cliente.</div>
        </div>
      </div>
      <div class="panel">
        ${clients.length===0 ? `<div class="empty-state"><div class="glyph">RH</div><h3>Aucun client pour le moment</h3><p>Les clients apparaissent ici dès qu'un premier audit est créé.</p></div>` : `
        <div class="table-wrap"><table>
          <thead><tr><th>Entreprise</th><th>Audits</th><th>Dernier audit</th><th>Dernier score</th><th>Évolution</th><th>Prochain audit</th></tr></thead>
          <tbody>
            ${clients.map(c=>{
              const delta = (c.lastScore!=null && c.prevScore!=null) ? c.lastScore - c.prevScore : null;
              const due = auditDueStatus(c.nextAudit);
              const dueColor = due==='overdue' ? 'var(--critical)' : due==='soon' ? 'var(--warning)' : 'var(--ink-2)';
              return `<tr onclick="App.viewClient('${jsAttr(c.name)}')">
                <td class="client-cell">${esc(c.name)}</td>
                <td class="tnum">${c.count}</td>
                <td class="tnum">${formatDate(c.lastDate)}</td>
                <td><span class="score-chip ${scoreClass(c.lastScore)}">${c.lastScore!=null?c.lastScore:'—'}${c.lastScore!=null?'<span class="u"> %</span>':''}</span></td>
                <td class="tnum">${delta==null ? '<span style="color:var(--ink-3)">—</span>' : delta===0 ? '<span style="color:var(--ink-3)">= 0 pt</span>' : `<span style="color:${delta>0?'var(--good)':'var(--critical)'}">${delta>0?'▲':'▼'} ${Math.abs(delta)} pt${Math.abs(delta)>1?'s':''}</span>`}</td>
                <td class="tnum" style="color:${dueColor}; ${due&&due!=='ok'?'font-weight:600;':''}">${c.nextAudit ? formatDate(c.nextAudit)+(due==='overdue'?' ⚠':'') : '<span style="color:var(--ink-3)">—</span>'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table></div>`}
      </div>
    `;
  },

  renderClientDetail(){
    const name = this.state.clientName;
    const clients = this.clientsSummary();
    const c = clients.find(x=>x.name===name);
    if(!c) return `<div class="empty-state"><h3>Client introuvable</h3><button class="btn" onclick="App.setView('clients')">Retour aux clients</button></div>`;
    const scored = c.missions.map(computeScores);
    const withScore = scored.filter(s=>s.global!=null);
    const avg = withScore.length ? Math.round(withScore.reduce((a,s)=>a+s.global,0)/withScore.length) : null;
    const openNC = c.missions.reduce((a,m)=>a+openNCCount(m),0);
    const due = auditDueStatus(c.nextAudit);
    const dueColor = due==='overdue' ? 'var(--critical)' : due==='soon' ? 'var(--warning)' : 'var(--ink)';
    return `
      <div class="pagehead">
        <div class="hactions" style="margin-bottom:8px;">
          <button class="btn ghost" onclick="App.setView('clients')">${icon('back',15)} Retour aux clients</button>
        </div>
        <div>
          <h1>${esc(c.name)}</h1>
          <div class="lede">${c.count} audit${c.count>1?'s':''} réalisé${c.count>1?'s':''} pour cette entreprise.</div>
        </div>
        <div class="hactions" style="margin-left:auto;">
          <button class="btn ghost" onclick="window.print()">${icon('printer',15)} Imprimer</button>
          <button class="btn primary" onclick="App.exportClientPdf('${jsAttr(c.name)}')">${icon('download',15)} Exporter en PDF</button>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi"><div class="label">Audits réalisés</div><div class="value tnum">${c.count}</div></div>
        <div class="kpi"><div class="label">Score moyen</div><div class="value tnum" style="color:${scoreColor(avg)}">${avg!=null?avg+' %':'—'}</div></div>
        <div class="kpi"><div class="label">Dernier score</div><div class="value tnum" style="color:${scoreColor(c.lastScore)}">${c.lastScore!=null?c.lastScore+' %':'—'}</div></div>
        <div class="kpi"><div class="label">Non-conformités ouvertes</div><div class="value tnum" style="color:${openNC>0?'var(--critical)':'var(--good)'}">${openNC}</div></div>
        <div class="kpi"><div class="label">Prochain audit prévu</div><div class="value tnum" style="color:${dueColor}; font-size:22px;">${c.nextAudit?formatDate(c.nextAudit):'—'}</div><div class="sub">${due==='overdue'?'⚠ échéance dépassée':due==='soon'?'dans moins de 30 jours':c.nextAudit?'':'non renseigné'}</div></div>
      </div>

      ${c.missions.length>=2 ? `
      <div class="panel">
        <div class="panel-head"><h2>Évolution du score</h2></div>
        <div class="panel-body chart-wrap">${this.renderTrendChart(c.missions, scored)}</div>
      </div>

      <div class="panel no-print">
        <div class="panel-head"><h2>Comparer deux audits</h2></div>
        <div class="panel-body">
          <div class="form-grid" style="grid-template-columns:1fr 1fr; margin-bottom:16px;">
            <div class="field"><label>Audit A</label>
              <select onchange="App.setCompare('A', this.value)">
                ${c.missions.map(m=>`<option value="${m.id}" ${this.state.compareA===m.id?'selected':''}>${formatDate(m.dateAudit)} — ${esc(m.reference)}</option>`).join('')}
              </select>
            </div>
            <div class="field"><label>Audit B</label>
              <select onchange="App.setCompare('B', this.value)">
                ${c.missions.map(m=>`<option value="${m.id}" ${this.state.compareB===m.id?'selected':''}>${formatDate(m.dateAudit)} — ${esc(m.reference)}</option>`).join('')}
              </select>
            </div>
          </div>
          ${this.renderComparison(c.missions)}
        </div>
      </div>` : ''}

      <div class="panel">
        <div class="panel-head"><h2>Historique des audits</h2></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Référence</th><th>Service audité</th><th>Auditeur</th><th>Date d'audit</th><th>Statut</th><th>Score</th><th>NC ouvertes</th></tr></thead>
          <tbody>
            ${c.missions.map(m=>{
              const sc = computeScores(m);
              const nc = openNCCount(m);
              const overdue = overdueNCCount(m);
              return `<tr onclick="App.viewReport('${m.id}')">
                <td class="ref">${esc(m.reference)}</td>
                <td>${esc(m.consultant)||'—'}</td>
                <td>${esc(m.auditeur)||'—'}</td>
                <td class="tnum">${formatDate(m.dateAudit)}</td>
                <td><span class="badge ${m.statut}"><span class="bdot"></span>${STATUT_MISSION[m.statut]||m.statut}</span></td>
                <td><span class="score-chip ${scoreClass(sc.global)}">${sc.global!=null?sc.global:'—'}${sc.global!=null?'<span class="u"> %</span>':''}</span></td>
                <td class="tnum">${nc>0?`<span class="badge ouvert" title="${overdue>0?overdue+' en retard':''}"><span class="bdot"></span>${nc}${overdue>0?' ⚠':''}</span>`:'<span style="color:var(--ink-3)">0</span>'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table></div>
      </div>
    `;
  },

  /** Domain-by-domain score comparison plus a non-conformités breakdown
   *  (resolved / new / still open) between two audits of the same client,
   *  matched by critereId — non-conformités without one (freely added, not
   *  tied to a grid question) can't be reliably matched across audits and
   *  are left out of that specific breakdown. */
  renderComparison(missions){
    const a = missions.find(m=>m.id===this.state.compareA);
    const b = missions.find(m=>m.id===this.state.compareB);
    if(!a || !b) return `<div class="chart-empty">Choisissez deux audits à comparer.</div>`;
    if(a.id===b.id) return `<div class="chart-empty">Choisissez deux audits différents.</div>`;
    const scA = computeScores(a), scB = computeScores(b);
    const deltaGlobal = (scA.global!=null && scB.global!=null) ? scB.global-scA.global : null;

    const domainRows = CATEGORIES_TEMPLATE.map(cat=>{
      const csA = scA.catScores.find(c=>c.catId===cat.id);
      const csB = scB.catScores.find(c=>c.catId===cat.id);
      return { nom: cat.nom, pctA: csA?csA.pct:null, pctB: csB?csB.pct:null };
    }).filter(r=> r.pctA!=null || r.pctB!=null);

    const openIdsA = new Set((a.nonConformites||[]).filter(n=>n.statut!=='clos' && n.critereId).map(n=>n.critereId));
    const openIdsB = new Set((b.nonConformites||[]).filter(n=>n.statut!=='clos' && n.critereId).map(n=>n.critereId));
    const labelFor = critId => (CRITERES_INDEX[critId]||{}).label || critId;
    const resolved = [...openIdsA].filter(id=>!openIdsB.has(id));
    const nouvelles = [...openIdsB].filter(id=>!openIdsA.has(id));
    const persistantes = [...openIdsA].filter(id=>openIdsB.has(id));
    const arrow = d => d==null ? '<span style="color:var(--ink-3)">—</span>' : d===0 ? '<span style="color:var(--ink-3)">=</span>' : `<span style="color:${d>0?'var(--good)':'var(--critical)'}">${d>0?'▲':'▼'} ${Math.abs(d)}</span>`;

    return `
      <div style="display:flex; align-items:baseline; gap:14px; margin-bottom:16px; flex-wrap:wrap;">
        <div style="font-size:12px; color:var(--ink-3); text-transform:uppercase; letter-spacing:0.05em; font-weight:600;">Score global</div>
        <div class="tnum" style="font-size:19px; font-weight:600;">
          <span style="color:${scoreColor(scA.global)}">${scA.global!=null?scA.global+'%':'—'}</span>
          <span style="color:var(--ink-3); margin:0 6px; font-weight:400;">→</span>
          <span style="color:${scoreColor(scB.global)}">${scB.global!=null?scB.global+'%':'—'}</span>
        </div>
        ${deltaGlobal!=null ? `<div style="font-size:13px;">${arrow(deltaGlobal)} pt${Math.abs(deltaGlobal)>1?'s':''}</div>` : ''}
      </div>

      <div class="table-wrap"><table>
        <thead><tr><th>Domaine</th><th>${formatDate(a.dateAudit)}</th><th>${formatDate(b.dateAudit)}</th><th>Évolution</th></tr></thead>
        <tbody>
          ${domainRows.map(r=>{
            const d = (r.pctA!=null && r.pctB!=null) ? r.pctB-r.pctA : null;
            return `<tr>
              <td>${esc(r.nom)}</td>
              <td class="tnum" style="color:${scoreColor(r.pctA)}">${r.pctA!=null?r.pctA+'%':'—'}</td>
              <td class="tnum" style="color:${scoreColor(r.pctB)}">${r.pctB!=null?r.pctB+'%':'—'}</td>
              <td class="tnum">${arrow(d)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>

      <div style="margin-top:18px; display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:16px;">
        <div>
          <div style="font-weight:600; font-size:12.5px; color:var(--good); margin-bottom:6px;">✓ Résolues (${resolved.length})</div>
          ${resolved.length ? `<ul style="margin:0; padding-left:16px; font-size:12.5px; color:var(--ink-2); line-height:1.6;">${resolved.map(id=>`<li>${esc(labelFor(id))}</li>`).join('')}</ul>` : `<div class="field-hint">Aucune</div>`}
        </div>
        <div>
          <div style="font-weight:600; font-size:12.5px; color:var(--critical); margin-bottom:6px;">Nouvelles (${nouvelles.length})</div>
          ${nouvelles.length ? `<ul style="margin:0; padding-left:16px; font-size:12.5px; color:var(--ink-2); line-height:1.6;">${nouvelles.map(id=>`<li>${esc(labelFor(id))}</li>`).join('')}</ul>` : `<div class="field-hint">Aucune</div>`}
        </div>
        <div>
          <div style="font-weight:600; font-size:12.5px; color:var(--warning); margin-bottom:6px;">Toujours ouvertes (${persistantes.length})</div>
          ${persistantes.length ? `<ul style="margin:0; padding-left:16px; font-size:12.5px; color:var(--ink-2); line-height:1.6;">${persistantes.map(id=>`<li>${esc(labelFor(id))}</li>`).join('')}</ul>` : `<div class="field-hint">Aucune</div>`}
        </div>
      </div>
    `;
  },

  /* ---------- Grid editor ("Gérer la grille") ---------- */
  renderGridEditor(){
    const q = this.state.gridSearch.trim().toLowerCase();
    const searching = q.length>0;
    return `
      <div class="pagehead">
        <div class="hactions" style="margin-bottom:8px;">
          <button class="btn ghost" onclick="App.setView('dashboard')">${icon('back',15)} Retour</button>
        </div>
        <div>
          <h1>Gérer la grille des questions</h1>
          <div class="lede">Ces modifications s'appliquent à tous les nouveaux audits de cet espace. Un audit déjà créé garde la grille telle qu'elle était au moment de sa création.</div>
        </div>
      </div>

      <div class="filters" style="margin-bottom:16px;">
        <input type="text" style="min-width:280px;" placeholder="Rechercher une question…" value="${esc(this.state.gridSearch)}" oninput="App.setGridSearch(this.value)" id="grid-search"/>
      </div>

      <div class="panel">
        ${CATEGORIES_TEMPLATE.map(cat=>{
          const groups = sousDomaineGroups(cat)
            .map(group=>({ ...group, criteres: searching ? group.criteres.filter(c=>c.label.toLowerCase().includes(q)) : group.criteres }))
            .filter(group=>group.criteres.length>0);
          if(searching && groups.length===0) return '';
          const open = searching ? true : this.state.gridOpenCats.has(cat.id);
          const matchCount = searching ? groups.reduce((a,g)=>a+g.criteres.length,0) : cat.criteres.length;
          return `<div class="cat-block">
            <div class="cat-head ${open?'open':''}" onclick="${searching?'':`App.toggleGridCat('${cat.id}')`}" style="${searching?'cursor:default;':''}">
              <div class="left">${icon('chev',15)}<h3>${esc(cat.nom)}</h3><span class="n">${matchCount} question${matchCount>1?'s':''}</span></div>
            </div>
            ${open ? `<div class="cat-body">
              ${groups.map(group=>`
                ${group.nom ? `<div class="sd-head">${esc(group.nom)}</div>` : ''}
                ${group.criteres.map(crit=>this.renderGridQuestionRow(crit)).join('')}
                ${searching ? '' : `
                <div class="crit-row" style="align-items:center;">
                  <div class="crit-main">
                    <input type="text" class="crit-comment" id="newgq-${cat.id}-${group.sd||'none'}" placeholder="Ajouter une question dans ${esc(group.nom||cat.nom)}…" onkeydown="if(event.key==='Enter'){ App.addGridQuestion('${cat.id}', ${group.sd?`'${group.sd}'`:'null'}, this.value); this.value=''; }"/>
                  </div>
                  <button class="btn ghost" onclick="const el=document.getElementById('newgq-${cat.id}-${group.sd||'none'}'); App.addGridQuestion('${cat.id}', ${group.sd?`'${group.sd}'`:'null'}, el.value); el.value='';">${icon('plus',15)} Ajouter</button>
                </div>`}
              `).join('')}
            </div>` : ''}
          </div>`;
        }).join('')}
        ${searching && CATEGORIES_TEMPLATE.every(cat=>sousDomaineGroups(cat).every(g=>!g.criteres.some(c=>c.label.toLowerCase().includes(q)))) ? `<div class="empty-state"><h3>Aucun résultat</h3><p>Aucune question ne correspond à « ${esc(this.state.gridSearch)} ».</p></div>` : ''}
      </div>
    `;
  },

  renderGridQuestionRow(crit){
    const editing = this.state.gridEditingId === crit.id;
    const isAdded = this.isAddedQuestion(crit.id);
    return `<div class="crit-row">
      <div class="crit-main">
        ${editing ? `
          <div style="display:flex; gap:8px; align-items:flex-start; margin-bottom:7px;">
            <input type="text" id="gridedit-${crit.id}" class="crit-comment" style="flex:1;" value="${esc(crit.label)}" onkeydown="if(event.key==='Enter'){ App.saveQuestionLabel('${crit.id}', this.value); } if(event.key==='Escape'){ App.cancelEditQuestion(); }"/>
            <button class="btn ghost" title="Enregistrer" onclick="App.saveQuestionLabel('${crit.id}', document.getElementById('gridedit-${crit.id}').value)">${icon('pencil',13)}</button>
            <button class="btn ghost" title="Annuler" onclick="App.cancelEditQuestion()">${icon('x',13)}</button>
          </div>
        ` : `
          <div class="crit-label">${esc(crit.label)}${isAdded?' <span style="font-size:10.5px; color:var(--accent-ink); background:var(--accent-soft); padding:1px 6px; border-radius:5px; font-weight:600;">ajoutée</span>':''}
            <button class="btn ghost" title="Modifier le texte" style="padding:2px 6px; margin-left:6px;" onclick="App.startEditQuestion('${crit.id}')">${icon('pencil',12)}</button>
          </div>
        `}
        <div class="att-row">
          ${(crit.refs||[]).map((r,i)=>`<span class="att-chip" title="${esc(r.url)}">
            <a href="#" onclick="event.preventDefault(); App.openRefLink('${jsAttr(r.url)}');">${icon('scale',12)} ${esc(r.label)}</a>
            <button type="button" class="att-x" title="Retirer ce lien" onclick="App.removeQuestionRef('${crit.id}', ${i})">${icon('x',10)}</button>
          </span>`).join('')}
        </div>
        <div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;">
          <input type="text" id="reflabel-${crit.id}" class="crit-comment" style="max-width:180px;" placeholder="Libellé du lien"/>
          <input type="text" id="refurl-${crit.id}" class="crit-comment" style="max-width:260px;" placeholder="https://…"/>
          <button class="btn ghost" onclick="App.addQuestionRef('${crit.id}', document.getElementById('reflabel-${crit.id}').value, document.getElementById('refurl-${crit.id}').value); document.getElementById('reflabel-${crit.id}').value=''; document.getElementById('refurl-${crit.id}').value='';">${icon('plus',13)} Lien</button>
        </div>
      </div>
      <button class="btn ghost" title="Retirer cette question" onclick="App.requestRemoveGridQuestion('${crit.id}')">${icon('trash',14)}</button>
    </div>`;
  },

  /* ---------- Guide d'utilisation ---------- */
  renderHelp(){
    const section = (titre, items) => `
      <div class="panel">
        <div class="panel-head"><h2>${esc(titre)}</h2></div>
        <div class="panel-body">
          ${items.map(it=>`
            <div style="margin-bottom:14px;">
              <div style="font-weight:600; font-size:13px; margin-bottom:3px;">${esc(it[0])}</div>
              <div style="font-size:13px; color:var(--ink-2); line-height:1.55;">${it[1]}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return `
      <div class="pagehead">
        <div class="hactions" style="margin-bottom:8px;">
          <button class="btn ghost" onclick="App.setView('dashboard')">${icon('back',15)} Retour</button>
        </div>
        <div>
          <h1>Guide d'utilisation</h1>
          <div class="lede">Un aperçu de ce que fait l'application, section par section.</div>
        </div>
      </div>

      ${section('Prise en main', [
        ["Se connecter", "L'identifiant et le code d'accès sont partagés par toute l'équipe pour un même dossier. Un seul espace suffit en général : rejoignez-le plutôt que d'en créer un nouveau."],
        ["Tableau de bord", "Vue d'ensemble : missions auditées, score moyen, non-conformités ouvertes, graphiques de score par domaine et par non-conformités, tableau des missions (triable en cliquant sur un en-tête de colonne, cherchable via la barre de recherche)."],
      ])}

      ${section('Réaliser un audit', [
        ["Nouvel audit", "Renseignez l'entreprise, le service audité, l'auditeur, les dates, puis notez chaque question : N/A, Non conforme, Partiel ou Conforme, avec un commentaire optionnel."],
        ["Domaine non applicable", "Une case « Non applicable » en haut de chaque domaine (ex : BDESE pour une petite structure) l'exclut du score sans effacer les réponses déjà données."],
        ["Question personnalisée", "En bas de chaque domaine, un champ permet d'ajouter une question propre à cet audit précis — elle compte dans le score mais n'apparaît que dans cet audit."],
        ["Pièces jointes", "Sous chaque question, un bouton « Joindre un fichier » permet d'attacher une preuve (photo, scan, document)."],
        ["Non-conformités & plan d'actions", "« Générer depuis la grille » crée automatiquement un écart pour chaque question notée Non conforme ou Partiel ; « Ajouter » permet d'en saisir une librement."],
        ["Dupliquer un audit", "Depuis le tableau de bord ou la fiche d'un audit, reprend l'entreprise/service/auditeur/périmètre avec une grille vierge — pratique pour un audit de suivi."],
        ["Historique de l'audit", "En bas de la fiche d'un audit : qui a fait quoi et quand (statut, réponses, non-conformités, pièces jointes...)."],
      ])}

      ${section('Rapports et exports', [
        ["Export PDF / Impression", "Depuis la fiche d'un audit ou d'un client : bouton « Exporter en PDF » ou « Imprimer »."],
        ["Export Excel", "Depuis le tableau de bord : exporte tous les audits et toutes les non-conformités dans un classeur Excel."],
        ["Rapport rédigé par IA", "Deux options sur la fiche d'un audit : « Générer le rapport (IA — clé API) » utilise votre clé API Anthropic personnelle (payante, à renseigner dans Paramètres) ; « Copier pour claude.ai (gratuit) » copie les données de l'audit et ouvre claude.ai pour générer le rapport gratuitement."],
        ["Joindre le rapport final", "Une fois le rapport rédigé (Word ou PDF), joignez-le à l'audit correspondant depuis sa fiche — il sera rangé dans le dossier partagé."],
      ])}

      ${section('Clients', [
        ["Fiche client", "La section « Clients » regroupe tous les audits d'une même entreprise : score moyen, dernier score, non-conformités ouvertes, prochain audit prévu, évolution dans le temps."],
        ["Comparer deux audits", "Sur la fiche d'un client ayant au moins 2 audits : choisissez deux audits à comparer pour voir l'évolution du score par domaine et les non-conformités résolues, nouvelles ou toujours ouvertes."],
        ["Prochain audit prévu", "Un champ dans le formulaire d'un audit ; un rappel visuel (orange puis rouge ⚠) apparaît sur la liste des clients à l'approche ou au dépassement de l'échéance."],
      ])}

      ${section('Corbeille', [
        ["Mettre à la corbeille", "Un audit supprimé passe d'abord par la Corbeille (menu latéral) — il reste restaurable tant qu'il n'est pas supprimé définitivement."],
        ["Suppression définitive", "Depuis la Corbeille uniquement, et irréversible : la grille, les commentaires et les pièces jointes de l'audit sont perdus."],
      ])}

      ${section('Paramètres', [
        ["Changer le code d'accès", "Renouvelle l'identifiant/code partagés par l'équipe pour cet espace."],
        ["Gérer la grille des questions", "Modifier le texte d'une question, ses liens de référence légale, ou ajouter/retirer une question — avec une barre de recherche pour la retrouver rapidement. S'applique aux nouveaux audits ; un audit déjà créé garde sa grille telle quelle."],
        ["Sauvegardes automatiques", "Une copie de sécurité du fichier d'audits est conservée chaque jour pendant 30 jours, sans action de votre part."],
        ["Export complet de l'espace", "Un bouton « Exporter en .zip » regroupe audits, grille personnalisée, pièces jointes et rapports en une archive — utile avant un changement important ou pour une copie externe."],
        ["Créer un nouvel espace", "Pour démarrer un espace totalement séparé (autre dossier, autre identifiant/code) — vous basculez automatiquement dessus après création."],
        ["Votre nom", "Sert uniquement à l'historique des modifications de chaque audit (qui a fait quoi), propre à cet ordinateur."],
      ])}

      ${section('Mises à jour et sécurité', [
        ["Mise à jour automatique", "L'application vérifie et installe les nouvelles versions toute seule ; un écran « Quoi de neuf » résume les changements après chaque mise à jour."],
        ["Chiffrement des données", "Le fichier d'audits est chiffré avec une clé dérivée du code d'accès de l'espace — illisible sans lui, y compris en l'ouvrant directement depuis le dossier partagé."],
        ["Alerte de retard", "Une notification de bureau apparaît à l'ouverture de l'application s'il existe des non-conformités dont l'échéance est dépassée."],
      ])}
    `;
  },

  /* ---------- Form ---------- */
  renderForm(){
    const d = this.state.draft;
    const sc = computeScores(d);
    const circ = 2*Math.PI*33;
    const dash = sc.global!=null ? (sc.global/100)*circ : 0;
    return `
      <div class="pagehead">
        <div>
          <div class="report-id">${esc(d.reference)}</div>
          <h1>${d.client ? esc(d.client) : 'Nouvel audit'}</h1>
          <div class="lede">Grille d'audit de conformité RH — notez chaque question puis complétez le plan d'actions si nécessaire.</div>
        </div>
        <div class="hactions">
          <button class="btn ghost" onclick="App.setView('dashboard')">${icon('back',15)} Retour</button>
          <button class="btn" onclick="App.saveDraft(false)">Enregistrer</button>
          <button class="btn primary" onclick="App.saveDraft(true)">Enregistrer et fermer</button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Informations de l'audit</h2></div>
        <div class="panel-body">
          <div class="form-grid">
            <div class="field"><label>Entreprise auditée</label><input type="text" value="${esc(d.client)}" placeholder="Nom de l'entreprise" oninput="App.updateDraftField('client', this.value)"/></div>
            <div class="field"><label>Service / responsable RH audité</label><input type="text" value="${esc(d.consultant)}" placeholder="Ex : Direction des Ressources Humaines" oninput="App.updateDraftField('consultant', this.value)"/></div>
            <div class="field"><label>Auditeur</label><input type="text" value="${esc(d.auditeur)}" placeholder="Votre nom" oninput="App.updateDraftField('auditeur', this.value)"/></div>
            <div class="field"><label>Date de l'audit (référence)</label><input type="date" value="${esc(d.dateMission)}" oninput="App.updateDraftField('dateMission', this.value)"/></div>
            <div class="field"><label>Date de l'audit</label><input type="date" value="${esc(d.dateAudit)}" oninput="App.updateDraftField('dateAudit', this.value)"/></div>
            <div class="field"><label>Statut de l'audit</label>
              <select onchange="App.updateDraftField('statut', this.value)">
                <option value="brouillon" ${d.statut==='brouillon'?'selected':''}>Brouillon</option>
                <option value="en_cours" ${d.statut==='en_cours'?'selected':''}>En cours</option>
                <option value="cloture" ${d.statut==='cloture'?'selected':''}>Clôturé</option>
              </select>
            </div>
            <div class="field"><label>Prochain audit prévu</label><input type="date" value="${esc(d.prochainAuditPrevu)}" oninput="App.updateDraftField('prochainAuditPrevu', this.value)"/></div>
          </div>
          <div class="form-grid wide" style="margin-top:14px;">
            <div class="field"><label>Périmètre de l'audit</label><textarea placeholder="Objet et périmètre de l'audit de conformité RH…" oninput="App.updateDraftField('perimetre', this.value)">${esc(d.perimetre)}</textarea></div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="score-hero">
          <div class="gauge">
            <svg viewBox="0 0 74 74" width="82" height="82">
              <circle cx="37" cy="37" r="33" fill="none" stroke="var(--surface-2)" stroke-width="7"/>
              <circle cx="37" cy="37" r="33" fill="none" stroke="${scoreColor(sc.global)}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}"/>
            </svg>
            <div class="gval">${sc.global!=null?sc.global+'%':'—'}</div>
          </div>
          <div class="meta">
            <div class="t">Score global</div>
            <div class="d">${sc.scored} / ${sc.total} critères notés · ${(sc.total-sc.scored)} en attente ou N/A</div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Grille d'audit</h2></div>
        ${CATEGORIES_TEMPLATE.map(cat=>{
          const catG = d.grid.find(c=>c.catId===cat.id);
          const cs = sc.catScores.find(c=>c.catId===cat.id);
          const open = this.state.openCats.has(cat.id);
          return `<div class="cat-block">
            <div class="cat-head ${open?'open':''}" onclick="App.toggleCat('${cat.id}')">
              <div class="left">${icon('chev',15)}<h3>${esc(cat.nom)}</h3><span class="n">${cs.count}/${cs.total}</span></div>
              <div style="display:flex; align-items:center; gap:12px;">
                <label class="na-toggle" onclick="event.stopPropagation()" title="Exclure ce domaine du score de cet audit">
                  <input type="checkbox" ${catG.na?'checked':''} onchange="App.toggleCategoryNA('${cat.id}')"/> Non applicable
                </label>
                <div class="cat-score" style="color:${catG.na?'var(--ink-3)':scoreColor(cs.pct)}">${catG.na ? 'N/A' : (cs.pct!=null?cs.pct+'%':'—')}</div>
              </div>
            </div>
            ${open ? `<div class="cat-body">
              ${catG.na ? `<div class="divider-note" style="margin:6px 0 10px; color:var(--ink-2);">Domaine marqué non applicable pour cet audit — exclu du score. Les réponses ci-dessous restent visibles mais ne comptent pas.</div>` : ''}
              ${sousDomaineGroups(cat).map(group=>`
                ${group.nom ? `<div class="sd-head">${esc(group.nom)}</div>` : ''}
                ${group.criteres.map(crit=>{
                  const val = catG.criteres.find(c=>c.id===crit.id);
                  return `<div class="crit-row">
                    <div class="crit-main">
                      <div class="crit-label">${esc(crit.label)}${renderRefBtn(crit)}</div>
                      <input class="crit-comment" type="text" placeholder="Commentaire (optionnel)" value="${esc(val.comment)}" oninput="App.setComment('${cat.id}','${crit.id}', this.value)"/>
                      ${renderAttachments(d.id, cat.id, crit.id, val.attachments, true)}
                    </div>
                    <div class="seg">
                      <button class="${val.note===null?'sel-na':''}" onclick="App.setNote('${cat.id}','${crit.id}', null)">N/A</button>
                      <button class="${val.note===0?'sel-0':''}" onclick="App.setNote('${cat.id}','${crit.id}', 0)">Non conforme</button>
                      <button class="${val.note===1?'sel-1':''}" onclick="App.setNote('${cat.id}','${crit.id}', 1)">Partiel</button>
                      <button class="${val.note===2?'sel-2':''}" onclick="App.setNote('${cat.id}','${crit.id}', 2)">Conforme</button>
                    </div>
                  </div>`;
                }).join('')}
              `).join('')}
              ${catG.criteres.some(c=>c.custom) ? `<div class="sd-head">Questions ajoutées pour cet audit</div>` : ''}
              ${catG.criteres.filter(c=>c.custom).map(c=>`
                <div class="crit-row">
                  <div class="crit-main">
                    <div class="crit-label">${esc(c.label)} <button class="btn ghost" title="Supprimer cette question" style="padding:1px 5px; margin-left:4px; vertical-align:middle;" onclick="App.removeCustomQuestion('${cat.id}','${c.id}', event)">${icon('x',12)}</button></div>
                    <input class="crit-comment" type="text" placeholder="Commentaire (optionnel)" value="${esc(c.comment)}" oninput="App.setComment('${cat.id}','${c.id}', this.value)"/>
                    ${renderAttachments(d.id, cat.id, c.id, c.attachments, true)}
                  </div>
                  <div class="seg">
                    <button class="${c.note===null?'sel-na':''}" onclick="App.setNote('${cat.id}','${c.id}', null)">N/A</button>
                    <button class="${c.note===0?'sel-0':''}" onclick="App.setNote('${cat.id}','${c.id}', 0)">Non conforme</button>
                    <button class="${c.note===1?'sel-1':''}" onclick="App.setNote('${cat.id}','${c.id}', 1)">Partiel</button>
                    <button class="${c.note===2?'sel-2':''}" onclick="App.setNote('${cat.id}','${c.id}', 2)">Conforme</button>
                  </div>
                </div>
              `).join('')}
              <div class="crit-row" style="align-items:center;">
                <div class="crit-main">
                  <input type="text" class="crit-comment" id="newq-${cat.id}" placeholder="Ajouter une question propre à cet audit…" onkeydown="if(event.key==='Enter'){ App.addCustomQuestion('${cat.id}', this.value); this.value=''; }"/>
                </div>
                <button class="btn ghost" onclick="const el=document.getElementById('newq-${cat.id}'); App.addCustomQuestion('${cat.id}', el.value); el.value='';">${icon('plus',15)} Ajouter</button>
              </div>
            </div>` : ''}
          </div>`;
        }).join('')}
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2>Non-conformités &amp; plan d'actions</h2>
          <div class="hactions">
            <button class="btn ghost" onclick="App.generateNC()">${icon('wand',15)} Générer depuis la grille</button>
            <button class="btn" onclick="App.addNC()">${icon('plus',15)} Ajouter</button>
          </div>
        </div>
        <div class="panel-body">
          ${d.nonConformites.length===0 ? `<div class="divider-note">Aucune non-conformité enregistrée. Les critères notés « Non conforme » ou « Partiel » peuvent être générés automatiquement ici.</div>` :
          d.nonConformites.map(nc=>`
            <div class="nc-card">
              <div class="nc-top">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span class="nc-ref">${nc.critereLabel ? esc(nc.critereLabel) : 'Écart libre'}</span>
                  ${isOverdueNC(nc) ? `<span class="badge critique"><span class="bdot"></span>Échéance dépassée</span>` : ''}
                </div>
                <button class="btn ghost" title="Supprimer" onclick="App.removeNC('${nc.id}')">${icon('x',14)}</button>
              </div>
              <div class="nc-grid">
                <div class="field"><label>Gravité</label>
                  <select onchange="App.updateNC('${nc.id}','gravite',this.value,true)">
                    <option value="mineure" ${nc.gravite==='mineure'?'selected':''}>Mineure</option>
                    <option value="majeure" ${nc.gravite==='majeure'?'selected':''}>Majeure</option>
                    <option value="critique" ${nc.gravite==='critique'?'selected':''}>Critique</option>
                  </select>
                </div>
                <div class="field"><label>Statut</label>
                  <select onchange="App.updateNC('${nc.id}','statut',this.value,true)">
                    <option value="ouvert" ${nc.statut==='ouvert'?'selected':''}>Ouvert</option>
                    <option value="en_cours_nc" ${nc.statut==='en_cours_nc'?'selected':''}>En cours</option>
                    <option value="clos" ${nc.statut==='clos'?'selected':''}>Clos</option>
                  </select>
                </div>
                <div class="field full"><label>Description de l'écart</label><textarea oninput="App.updateNC('${nc.id}','description',this.value)">${esc(nc.description)}</textarea></div>
                <div class="field full"><label>Action corrective</label><textarea oninput="App.updateNC('${nc.id}','actionCorrective',this.value)">${esc(nc.actionCorrective)}</textarea></div>
                <div class="field"><label>Responsable</label><input type="text" value="${esc(nc.responsable)}" oninput="App.updateNC('${nc.id}','responsable',this.value)"/></div>
                <div class="field"><label>Échéance</label><input type="date" value="${esc(nc.echeance)}" oninput="App.updateNC('${nc.id}','echeance',this.value)"/></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="hactions" style="justify-content:flex-end; margin-top:-6px;">
        ${d.reference ? `<button class="btn danger" onclick="App.requestDelete('${d.id}')">${icon('trash',15)} Supprimer cet audit</button>` : ''}
      </div>
    `;
  },

  /* ---------- Report ---------- */
  renderReport(){
    const m = this.state.missions.find(x=>x.id===this.state.reportId);
    if(!m) return `<div class="empty-state"><h3>Audit introuvable</h3><button class="btn" onclick="App.setView('dashboard')">Retour au tableau de bord</button></div>`;
    const sc = computeScores(m);
    const nc = m.nonConformites||[];
    return `
      <div class="pagehead">
        <div class="hactions" style="margin-bottom:8px;">
          <button class="btn ghost" onclick="App.setView('dashboard')">${icon('back',15)} Retour</button>
        </div>
        <div class="hactions" style="margin-left:auto;">
          <button class="btn" onclick="App.editMission('${m.id}')">${icon('pencil',15)} Modifier</button>
          <button class="btn" onclick="App.duplicateMission('${m.id}')">${icon('copy',15)} Dupliquer</button>
          <button class="btn" onclick="App.copyAuditDataForClaude('${m.id}')">${icon('wand',15)} Copier pour claude.ai (gratuit)</button>
          <button class="btn" ${this.state.reportGenBusy?'disabled':''} onclick="App.generateAiReport('${m.id}')">${icon('wand',15)} ${this.state.reportGenBusy?'Génération en cours…':'Générer le rapport (IA — clé API)'}</button>
          <button class="btn ghost" onclick="window.print()">${icon('printer',15)} Imprimer</button>
          <button class="btn primary" onclick="App.exportPdf('${m.id}')">${icon('download',15)} Exporter en PDF</button>
          <button class="btn danger" onclick="App.requestDelete('${m.id}')">${icon('trash',15)} Supprimer</button>
        </div>
      </div>

      <div class="panel">
        <div class="report-head">
          <div>
            <div class="report-id">${esc(m.reference)}</div>
            <h2 class="report-title">${esc(m.client)||'—'}</h2>
            <div style="color:var(--ink-2); font-size:13px;">Audit de conformité RH — service audité : <b>${esc(m.consultant)||'—'}</b></div>
            <div class="report-meta">
              <div>Auditeur : <b>${esc(m.auditeur)||'—'}</b></div>
              <div>Statut : <span class="badge ${m.statut}"><span class="bdot"></span>${STATUT_MISSION[m.statut]}</span></div>
              <div>Date de mission : <b class="tnum">${formatDate(m.dateMission)}</b></div>
              <div>Date d'audit : <b class="tnum">${formatDate(m.dateAudit)}</b></div>
            </div>
            ${m.perimetre ? `<div style="margin-top:12px; font-size:12.5px; color:var(--ink-2); max-width:60ch;">${esc(m.perimetre)}</div>` : ''}
          </div>
          <div class="gauge" style="width:96px;height:96px;">
            <svg viewBox="0 0 74 74" width="96" height="96">
              <circle cx="37" cy="37" r="33" fill="none" stroke="var(--surface-2)" stroke-width="7"/>
              <circle cx="37" cy="37" r="33" fill="none" stroke="${scoreColor(sc.global)}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${sc.global!=null?(sc.global/100*2*Math.PI*33).toFixed(1):0} ${(2*Math.PI*33).toFixed(1)}"/>
            </svg>
            <div class="gval">${sc.global!=null?sc.global+'%':'—'}</div>
          </div>
        </div>
      </div>

      <div class="panel no-print">
        <div class="panel-head"><h2>Rapport final</h2></div>
        <div class="panel-body">
          ${m.rapportFichier ? `
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <div style="flex:1; min-width:0;">
                <div style="font-weight:600; font-size:13px;">${esc(m.rapportFichier)}</div>
                <div class="field-hint">Joint le ${formatDateTime(m.rapportAt)}</div>
              </div>
              <button class="btn" onclick="App.openAttachedReport('${m.id}')">${icon('folder',15)} Ouvrir</button>
              <button class="btn ghost" onclick="App.attachReport('${m.id}')">Remplacer</button>
              <button class="btn danger" onclick="App.removeAttachedReport('${m.id}')">${icon('trash',15)} Retirer</button>
            </div>
          ` : `
            <div class="divider-note" style="margin-bottom:10px;">Aucun rapport final joint à cet audit pour l'instant.</div>
            <button class="btn primary" onclick="App.attachReport('${m.id}')">${icon('folder',15)} Joindre le rapport (Word / PDF)</button>
          `}
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Détail par catégorie</h2></div>
        <div class="report-cats">
          ${CATEGORIES_TEMPLATE.map(cat=>{
            const catG = m.grid.find(c=>c.catId===cat.id);
            const cs = sc.catScores.find(c=>c.catId===cat.id);
            return `<div>
              <div class="report-cat-row">
                <div style="font-weight:600; font-size:13.5px;">${esc(cat.nom)}${catG.na?' <span style="font-weight:500; color:var(--ink-3); font-size:12px;">(non applicable)</span>':''}</div>
                <div class="score-chip ${catG.na?'score-none':scoreClass(cs.pct)}">${catG.na ? 'N/A' : (cs.pct!=null?cs.pct+'<span class="u"> %</span>':'—')}</div>
              </div>
              <div class="report-crit-detail">
                ${sousDomaineGroups(cat).map(group=>`
                  ${group.nom ? `<div class="sd-head">${esc(group.nom)}</div>` : ''}
                  ${group.criteres.map(crit=>{
                    const val = catG.criteres.find(c=>c.id===crit.id);
                    const noteTxt = val.note===null ? 'N/A' : NOTE_LABELS[val.note];
                    return `<div class="report-crit-line">
                      <div class="txt"><b>${noteTxt}</b> — ${esc(crit.label)}${val.comment?(' · '+esc(val.comment)):''}${renderRefBtn(crit)}</div>
                      ${val.attachments&&val.attachments.length ? `<div class="no-print">${renderAttachments(m.id, cat.id, crit.id, val.attachments, false)}</div>` : ''}
                    </div>`;
                  }).join('')}
                `).join('')}
                ${catG.criteres.filter(c=>c.custom).map(c=>{
                  const noteTxt = c.note===null ? 'N/A' : NOTE_LABELS[c.note];
                  return `<div class="report-crit-line">
                    <div class="txt"><b>${noteTxt}</b> — ${esc(c.label)}${c.comment?(' · '+esc(c.comment)):''}</div>
                    ${c.attachments&&c.attachments.length ? `<div class="no-print">${renderAttachments(m.id, cat.id, c.id, c.attachments, false)}</div>` : ''}
                  </div>`;
                }).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Non-conformités &amp; plan d'actions</h2>
          <div class="stat-chips no-print">
            <div class="chip"><span class="cdot" style="background:var(--critical)"></span>Ouvertes ${nc.filter(n=>n.statut==='ouvert').length}</div>
            <div class="chip"><span class="cdot" style="background:var(--warning)"></span>En cours ${nc.filter(n=>n.statut==='en_cours_nc').length}</div>
            <div class="chip"><span class="cdot" style="background:var(--good)"></span>Closes ${nc.filter(n=>n.statut==='clos').length}</div>
            ${nc.some(isOverdueNC) ? `<div class="chip" style="background:var(--critical-soft); color:var(--critical);"><span class="cdot" style="background:var(--critical)"></span>En retard ${nc.filter(isOverdueNC).length}</div>` : ''}
          </div>
        </div>
        ${nc.length===0 ? `<div class="divider-note">Aucune non-conformité relevée sur cette mission.</div>` : `
        <div class="table-wrap"><table>
          <thead><tr><th>Écart</th><th>Gravité</th><th>Action corrective</th><th>Responsable</th><th>Échéance</th><th>Statut</th></tr></thead>
          <tbody>
            ${nc.map(n=>`<tr>
              <td>${esc(n.critereLabel||n.description||'—')}</td>
              <td><span class="badge ${n.gravite}"><span class="bdot"></span>${GRAVITE_NC[n.gravite]}</span></td>
              <td>${esc(n.actionCorrective)||'—'}</td>
              <td>${esc(n.responsable)||'—'}</td>
              <td class="tnum" ${isOverdueNC(n)?'style="color:var(--critical); font-weight:600;"':''}>${n.echeance?formatDate(n.echeance):'—'}${isOverdueNC(n)?' ⚠':''}</td>
              <td><span class="badge ${n.statut}"><span class="bdot"></span>${STATUT_NC[n.statut]}</span></td>
            </tr>`).join('')}
          </tbody>
        </table></div>`}
      </div>

      <div class="panel no-print">
        <div class="panel-head"><h2>Historique des modifications</h2></div>
        <div class="panel-body">
          ${(m.historique&&m.historique.length) ? `
          <div class="table-wrap"><table>
            <thead><tr><th>Date</th><th>Par</th><th>Modification</th></tr></thead>
            <tbody>
              ${m.historique.slice().reverse().map(h=>`<tr>
                <td class="tnum" style="white-space:nowrap;">${formatDateTime(h.at)}</td>
                <td>${esc(h.auteur)||'—'}</td>
                <td>${esc(h.resume)}</td>
              </tr>`).join('')}
            </tbody>
          </table></div>
          ` : `<div class="divider-note">Aucun historique pour l'instant.</div>`}
        </div>
      </div>
    `;
  },
};

document.addEventListener('click', (evt)=>{
  if(!evt.target.closest('.ref-wrap')) App.closeRefMenus();
});

App.boot();
