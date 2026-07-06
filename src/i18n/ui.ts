/* ============================================================
   Pumpa UI dictionaries — EN is the source locale; IT and ES are
   typed against it, so a missing key is a build error, never a
   silent English fallback on a translated page.

   Rules (agreed):
   - Unit notation (km, L/100km, MPG, kWh…) is NEVER translated.
   - CSV headers/values stay English/machine-format.
   - Currency symbols are symbols, not words.
   IT translations: pending owner review. ES: pending native review.
   ============================================================ */

export const locales = ['en', 'it', 'es'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
  es: 'Español',
};

const en = {
  chrome: {
    skip: 'Skip to content',
    navLabel: 'Site',
    brandHome: 'Pumpa home',
    nav: { home: 'Home', calculator: 'Calculator', tips: 'Tips', about: 'About' },
    langLabel: 'Language',
    theme: {
      dark: 'Dark', light: 'Light', contrast: 'High contrast',
      change: 'Change theme, current:',
    },
    footer: {
      blurb: 'A fuel & commute cost tracker that lives in your browser — nothing uploaded, nothing to sign up for.',
      product: 'Product',
      legal: 'Legal',
      privacy: 'Privacy',
      cookies: 'Cookies',
      bottom: '© Pumpa. Made for people who’d rather keep their fuel money.',
    },
  },

  home: {
    metaTitle: 'Pumpa — know what every trip really costs',
    metaDescription: 'Free fuel & commute cost calculator. Work out the fuel cost of any trip, log fill-ups, track spending — metric, US or UK units, any currency, all stored on your device.',
    eyebrow: 'Fuel · Commute · Cost',
    h1Pre: 'Know what every trip ',
    h1Accent: 'really',
    h1Post: ' costs.',
    sub: 'Enter your distance, your car’s consumption and the price at the pump — Pumpa turns them into a number you can actually act on. Log trips and fill-ups, watch what you spend each month, and switch freely between metric, US and UK units. No account, no upload: everything stays on your device.',
    ctaPrimary: 'Open the calculator',
    ctaSecondary: 'Read the tips',
    lcd: { label: 'Trip cost', sub: 'vs your usual route' },
    how: {
      title: 'How it works',
      steps: [
        { title: 'Enter a trip', body: 'Distance, your car’s consumption, and the fuel price at the pump. Metric, US or UK — switching actually converts your numbers, it doesn’t just relabel them.' },
        { title: 'See the cost', body: 'Fuel used and trip cost, instantly — plus how it compares to your usual route, so detours and shortcuts get an honest price tag.' },
        { title: 'Log & learn', body: 'Save trips and fill-ups. Pumpa turns them into monthly spending, your real consumption, and cost-per-distance — export it all as CSV or PDF whenever you like.' },
      ],
    },
    why: {
      title: 'Why Pumpa',
      items: [
        { title: 'Your data stays yours.', body: 'Everything’s stored in your browser. No account to create, nothing uploaded to a server.' },
        { title: 'Works the way you drive.', body: 'Metric, US or UK units, any currency, real conversions — not a US-only tool with everyone else bolted on.' },
        { title: 'Honest numbers.', body: 'Real consumption from your actual fill-ups, not a hopeful estimate.' },
      ],
    },
    teaser: {
      title: 'Save at the pump',
      lead: 'Small changes, real savings. Practical, no-nonsense guides to spending less on fuel.',
      browse: 'Browse all tips',
    },
    pro: {
      title: 'Pumpa Pro',
      h: 'One unlock. Yours forever.',
      body: 'The calculator is free and stays free. Pro removes the history limits, unlocks the full PDF report and keeps the app ad-free — a one-time unlock, no subscription, right inside the calculator.',
      perks: ['Unlimited trip & fill-up history', 'Full PDF report export', 'No ads, ever'],
    },
  },

  about: {
    metaTitle: 'About Pumpa',
    metaDescription: 'Why Pumpa exists: an honest, private fuel cost tracker that runs entirely in your browser.',
    eyebrow: 'About',
    h1: 'A trip computer for the rest of us.',
    lede: 'Most cars tell you how much fuel you’re burning. Very few tell you what it costs — in your money, for your commute, over a month of real driving.',
    p1: 'Pumpa started as a single question: <em>“what does this drive actually cost me?”</em> Answering it shouldn’t need an account, an app store or a data-hungry service. So Pumpa is a plain web tool: open it, type three numbers, get an answer. Log your trips and fill-ups and it becomes a running record of what your driving costs — with reports, real-consumption stats and exports.',
    h2Privacy: 'Private by architecture',
    pPrivacy: 'Everything you enter is stored in your browser’s local storage, on your device. There is no server, no account and no sync — which means nobody can lose, sell or leak your data, including us. Use the CSV or PDF export to take your data anywhere.',
    h2Units: 'Units and currencies, done properly',
    pUnits: 'Metric, US and UK measurement systems are fully supported and independent of currency — kilometres priced in dollars or miles in złoty, whatever matches how you actually drive and pay. Switching systems converts your numbers correctly, including the inverse MPG ↔ L/100km relationship.',
    h2Contact: 'Contact',
    pContact: 'Questions, bug reports, ideas — email <a href="mailto:mat.zandonella@gmail.com">mat.zandonella@gmail.com</a>.',
  },

  privacy: {
    metaTitle: 'Privacy — Pumpa',
    metaDescription: 'Pumpa stores everything on your device. No accounts, no tracking of your driving data, no server.',
    eyebrow: 'Privacy',
    h1: 'Your data never leaves your device.',
    p1: 'Pumpa has no backend. Trips, fill-ups, preferences and the Pro unlock are stored in your browser’s <code>localStorage</code> on your own device. Nothing you type into the calculator is transmitted to us or anyone else.',
    h2Practice: 'What this means in practice',
    pPractice: 'Clearing your browser’s site data erases your Pumpa history — use the CSV export to keep a backup. Your data does not follow you between browsers or devices, because there is no account and no sync.',
    h2Third: 'Third parties',
    pThird: 'Pages load fonts from Google Fonts, which involves your browser requesting font files from Google’s servers. If advertising is added to the free tier in the future, this page will be updated first with exactly what that involves.',
    updated: 'Last updated: July 2026',
  },

  cookies: {
    metaTitle: 'Cookies — Pumpa',
    metaDescription: 'Pumpa sets no cookies. Here’s exactly what is stored in your browser and why.',
    eyebrow: 'Cookies',
    h1: 'No cookies. Really.',
    p1: 'Pumpa doesn’t set cookies, and there is no tracking, analytics or advertising script on this site today. What Pumpa does use is your browser’s <code>localStorage</code> — a small store that never leaves your device and is never sent to any server.',
    h2Stored: 'What’s in that storage',
    pStored: 'Your logged trips and fill-ups, your unit and currency preferences, a manually set fuel price, your Pro unlock, your theme choice and your trip-plan draft. That’s the complete list. Clearing this site’s data in your browser removes all of it — export a CSV first if you want a backup.',
    h2Changes: 'If this ever changes',
    pChanges: 'If advertising is added to the free tier in the future, this page and the <a href="{privacyUrl}">privacy page</a> will describe exactly what it involves before it ships.',
  },

  tips: {
    metaTitle: 'Tips — Pumpa',
    metaDescription: 'Practical articles on fuel economy, fuel prices and commute costs — the math behind cheaper driving.',
    eyebrow: 'Tips',
    h1: 'Drive the same. Pay less.',
    lede: 'Short, practical reads on fuel economy, pricing quirks and commute math — each one something you can act on before your next fill-up.',
    readMore: 'Read →',
    crumb: 'Tips',
    articleTitleSuffix: ' — Pumpa Tips',
    cta: {
      h: 'Put it to the numbers',
      body: 'The calculator prices your trips, logs fill-ups and computes your real consumption — free, in your browser, stored on your device.',
      button: 'Open the calculator',
    },
  },

  calc: {
    metaTitle: 'Fuel cost calculator — Pumpa',
    metaDescription: 'Calculate the fuel cost of any trip, log fill-ups and track spending. Metric, US and UK units, any currency, stored on your device.',
  },
};

export type Dict = typeof en;

const it: Dict = {
  chrome: {
    skip: 'Salta al contenuto',
    navLabel: 'Sito',
    brandHome: 'Pumpa — pagina iniziale',
    nav: { home: 'Home', calculator: 'Calcolatore', tips: 'Consigli', about: 'Chi siamo' },
    langLabel: 'Lingua',
    theme: {
      dark: 'Scuro', light: 'Chiaro', contrast: 'Contrasto elevato',
      change: 'Cambia tema, attuale:',
    },
    footer: {
      blurb: 'Un tracker di costi di carburante e pendolarismo che vive nel tuo browser — niente upload, niente registrazione.',
      product: 'Prodotto',
      legal: 'Note legali',
      privacy: 'Privacy',
      cookies: 'Cookie',
      bottom: '© Pumpa. Fatto per chi preferisce tenersi i soldi della benzina.',
    },
  },

  home: {
    metaTitle: 'Pumpa — scopri quanto costa davvero ogni viaggio',
    metaDescription: 'Calcolatore gratuito dei costi di carburante e pendolarismo. Calcola il costo di ogni viaggio, registra i rifornimenti, tieni d’occhio la spesa — unità metriche, US o UK, qualsiasi valuta, tutto salvato sul tuo dispositivo.',
    eyebrow: 'Carburante · Pendolarismo · Costi',
    h1Pre: 'Scopri quanto costa ',
    h1Accent: 'davvero',
    h1Post: ' ogni viaggio.',
    sub: 'Inserisci la distanza, il consumo della tua auto e il prezzo alla pompa — Pumpa li trasforma in un numero su cui puoi davvero ragionare. Registra viaggi e rifornimenti, osserva quanto spendi ogni mese e passa liberamente tra unità metriche, US e UK. Nessun account, nessun upload: tutto resta sul tuo dispositivo.',
    ctaPrimary: 'Apri il calcolatore',
    ctaSecondary: 'Leggi i consigli',
    lcd: { label: 'Costo viaggio', sub: 'rispetto al tuo percorso abituale' },
    how: {
      title: 'Come funziona',
      steps: [
        { title: 'Inserisci un viaggio', body: 'Distanza, consumo della tua auto e prezzo del carburante alla pompa. Metrico, US o UK — il cambio converte davvero i tuoi numeri, non si limita a rietichettarli.' },
        { title: 'Vedi il costo', body: 'Carburante usato e costo del viaggio, all’istante — più il confronto con il tuo percorso abituale, così deviazioni e scorciatoie hanno un prezzo onesto.' },
        { title: 'Registra e impara', body: 'Salva viaggi e rifornimenti. Pumpa li trasforma in spesa mensile, consumo reale e costo per distanza — esporta tutto in CSV o PDF quando vuoi.' },
      ],
    },
    why: {
      title: 'Perché Pumpa',
      items: [
        { title: 'I tuoi dati restano tuoi.', body: 'Tutto è salvato nel tuo browser. Nessun account da creare, niente caricato su un server.' },
        { title: 'Funziona come guidi tu.', body: 'Unità metriche, US o UK, qualsiasi valuta, conversioni vere — non uno strumento solo americano con il resto del mondo appiccicato dopo.' },
        { title: 'Numeri onesti.', body: 'Il consumo reale dai tuoi rifornimenti effettivi, non una stima ottimista.' },
      ],
    },
    teaser: {
      title: 'Risparmia alla pompa',
      lead: 'Piccoli cambiamenti, risparmi veri. Guide pratiche e senza fronzoli per spendere meno in carburante.',
      browse: 'Tutti i consigli',
    },
    pro: {
      title: 'Pumpa Pro',
      h: 'Uno sblocco. Tuo per sempre.',
      body: 'Il calcolatore è gratuito e resta gratuito. Pro rimuove i limiti dello storico, sblocca il report PDF completo e tiene l’app senza pubblicità — uno sblocco una tantum, nessun abbonamento, direttamente nel calcolatore.',
      perks: ['Storico illimitato di viaggi e rifornimenti', 'Esportazione completa del report PDF', 'Niente pubblicità, mai'],
    },
  },

  about: {
    metaTitle: 'Chi siamo — Pumpa',
    metaDescription: 'Perché esiste Pumpa: un tracker onesto e privato dei costi del carburante che gira interamente nel tuo browser.',
    eyebrow: 'Chi siamo',
    h1: 'Un computer di bordo per tutti gli altri.',
    lede: 'Quasi tutte le auto ti dicono quanto carburante stai bruciando. Pochissime ti dicono quanto ti costa — nella tua valuta, per il tuo tragitto, su un mese di guida vera.',
    p1: 'Pumpa è nato da una sola domanda: <em>“quanto mi costa davvero questo viaggio?”</em> Rispondere non dovrebbe richiedere un account, un app store o un servizio affamato di dati. Così Pumpa è un semplice strumento web: aprilo, digita tre numeri, ottieni una risposta. Registra viaggi e rifornimenti e diventa un registro continuo di quanto ti costa guidare — con report, statistiche sul consumo reale ed esportazioni.',
    h2Privacy: 'Privato per architettura',
    pPrivacy: 'Tutto ciò che inserisci è salvato nella memoria locale del tuo browser, sul tuo dispositivo. Non c’è server, non c’è account e non c’è sincronizzazione — quindi nessuno può perdere, vendere o far trapelare i tuoi dati, noi compresi. Usa l’esportazione CSV o PDF per portare i tuoi dati dove vuoi.',
    h2Units: 'Unità e valute, fatte bene',
    pUnits: 'I sistemi metrico, US e UK sono pienamente supportati e indipendenti dalla valuta — chilometri prezzati in dollari o miglia in złoty, come davvero guidi e paghi. Il cambio di sistema converte i numeri correttamente, compresa la relazione inversa MPG ↔ L/100km.',
    h2Contact: 'Contatti',
    pContact: 'Domande, segnalazioni, idee — scrivi a <a href="mailto:mat.zandonella@gmail.com">mat.zandonella@gmail.com</a>.',
  },

  privacy: {
    metaTitle: 'Privacy — Pumpa',
    metaDescription: 'Pumpa salva tutto sul tuo dispositivo. Nessun account, nessun tracciamento dei tuoi dati di guida, nessun server.',
    eyebrow: 'Privacy',
    h1: 'I tuoi dati non lasciano mai il tuo dispositivo.',
    p1: 'Pumpa non ha un backend. Viaggi, rifornimenti, preferenze e lo sblocco Pro sono salvati nel <code>localStorage</code> del tuo browser, sul tuo dispositivo. Nulla di ciò che digiti nel calcolatore viene trasmesso a noi o a chiunque altro.',
    h2Practice: 'Cosa significa in pratica',
    pPractice: 'Cancellare i dati del sito dal browser elimina il tuo storico Pumpa — usa l’esportazione CSV per tenerne una copia. I tuoi dati non ti seguono tra browser o dispositivi, perché non c’è account né sincronizzazione.',
    h2Third: 'Terze parti',
    pThird: 'Le pagine caricano i font da Google Fonts: il tuo browser richiede quindi i file dei font ai server di Google. Se in futuro verrà aggiunta pubblicità al piano gratuito, questa pagina sarà aggiornata per prima con la descrizione esatta di cosa comporta.',
    updated: 'Ultimo aggiornamento: luglio 2026',
  },

  cookies: {
    metaTitle: 'Cookie — Pumpa',
    metaDescription: 'Pumpa non imposta cookie. Ecco esattamente cosa viene salvato nel tuo browser e perché.',
    eyebrow: 'Cookie',
    h1: 'Niente cookie. Davvero.',
    p1: 'Pumpa non imposta cookie e su questo sito oggi non ci sono script di tracciamento, analisi o pubblicità. Quello che Pumpa usa è il <code>localStorage</code> del tuo browser — un piccolo archivio che non lascia mai il tuo dispositivo e non viene mai inviato a nessun server.',
    h2Stored: 'Cosa c’è in quell’archivio',
    pStored: 'I tuoi viaggi e rifornimenti registrati, le preferenze di unità e valuta, un prezzo del carburante impostato manualmente, il tuo sblocco Pro, il tema scelto e la bozza del piano di viaggio. Questa è la lista completa. Cancellare i dati di questo sito dal browser rimuove tutto — esporta prima un CSV se vuoi una copia.',
    h2Changes: 'Se qualcosa cambierà',
    pChanges: 'Se in futuro verrà aggiunta pubblicità al piano gratuito, questa pagina e la <a href="{privacyUrl}">pagina privacy</a> descriveranno esattamente cosa comporta prima che succeda.',
  },

  tips: {
    metaTitle: 'Consigli — Pumpa',
    metaDescription: 'Articoli pratici su consumi, prezzi del carburante e costi del pendolarismo — la matematica per guidare spendendo meno.',
    eyebrow: 'Consigli',
    h1: 'Guida come sempre. Paga meno.',
    lede: 'Letture brevi e pratiche su consumi, stranezze dei prezzi e matematica del pendolarismo — ognuna qualcosa su cui agire prima del prossimo rifornimento.',
    readMore: 'Leggi →',
    crumb: 'Consigli',
    articleTitleSuffix: ' — Consigli Pumpa',
    cta: {
      h: 'Mettilo alla prova dei numeri',
      body: 'Il calcolatore prezza i tuoi viaggi, registra i rifornimenti e calcola il tuo consumo reale — gratis, nel tuo browser, salvato sul tuo dispositivo.',
      button: 'Apri il calcolatore',
    },
  },

  calc: {
    metaTitle: 'Calcolatore costi carburante — Pumpa',
    metaDescription: 'Calcola il costo in carburante di ogni viaggio, registra i rifornimenti e tieni d’occhio la spesa. Unità metriche, US e UK, qualsiasi valuta, salvato sul tuo dispositivo.',
  },
};

const es: Dict = {
  chrome: {
    skip: 'Saltar al contenido',
    navLabel: 'Sitio',
    brandHome: 'Pumpa — página de inicio',
    nav: { home: 'Inicio', calculator: 'Calculadora', tips: 'Consejos', about: 'Acerca de' },
    langLabel: 'Idioma',
    theme: {
      dark: 'Oscuro', light: 'Claro', contrast: 'Contraste alto',
      change: 'Cambiar tema, actual:',
    },
    footer: {
      blurb: 'Un registro de costes de combustible y trayectos que vive en tu navegador — nada se sube, nada que registrar.',
      product: 'Producto',
      legal: 'Legal',
      privacy: 'Privacidad',
      cookies: 'Cookies',
      bottom: '© Pumpa. Hecho para quienes prefieren quedarse con el dinero de la gasolina.',
    },
  },

  home: {
    metaTitle: 'Pumpa — descubre lo que de verdad cuesta cada viaje',
    metaDescription: 'Calculadora gratuita de costes de combustible y trayectos. Calcula el coste de cualquier viaje, registra repostajes y controla el gasto — unidades métricas, US o UK, cualquier moneda, todo guardado en tu dispositivo.',
    eyebrow: 'Combustible · Trayectos · Costes',
    h1Pre: 'Descubre lo que ',
    h1Accent: 'de verdad',
    h1Post: ' cuesta cada viaje.',
    sub: 'Introduce la distancia, el consumo de tu coche y el precio en el surtidor — Pumpa los convierte en un número con el que puedes decidir de verdad. Registra viajes y repostajes, observa cuánto gastas cada mes y cambia libremente entre unidades métricas, US y UK. Sin cuenta, sin subir nada: todo se queda en tu dispositivo.',
    ctaPrimary: 'Abrir la calculadora',
    ctaSecondary: 'Leer los consejos',
    lcd: { label: 'Coste del viaje', sub: 'frente a tu ruta habitual' },
    how: {
      title: 'Cómo funciona',
      steps: [
        { title: 'Introduce un viaje', body: 'Distancia, el consumo de tu coche y el precio del combustible en el surtidor. Métrico, US o UK — el cambio convierte de verdad tus números, no se limita a reetiquetarlos.' },
        { title: 'Ve el coste', body: 'Combustible usado y coste del viaje, al instante — más la comparación con tu ruta habitual, para que desvíos y atajos tengan un precio honesto.' },
        { title: 'Registra y aprende', body: 'Guarda viajes y repostajes. Pumpa los convierte en gasto mensual, tu consumo real y coste por distancia — expórtalo todo en CSV o PDF cuando quieras.' },
      ],
    },
    why: {
      title: 'Por qué Pumpa',
      items: [
        { title: 'Tus datos siguen siendo tuyos.', body: 'Todo se guarda en tu navegador. Sin cuenta que crear, nada subido a un servidor.' },
        { title: 'Funciona como tú conduces.', body: 'Unidades métricas, US o UK, cualquier moneda, conversiones reales — no una herramienta solo americana con el resto del mundo añadido a última hora.' },
        { title: 'Números honestos.', body: 'Consumo real a partir de tus repostajes, no una estimación optimista.' },
      ],
    },
    teaser: {
      title: 'Ahorra en el surtidor',
      lead: 'Pequeños cambios, ahorros reales. Guías prácticas y sin rodeos para gastar menos en combustible.',
      browse: 'Ver todos los consejos',
    },
    pro: {
      title: 'Pumpa Pro',
      h: 'Un desbloqueo. Tuyo para siempre.',
      body: 'La calculadora es gratuita y lo seguirá siendo. Pro elimina los límites del historial, desbloquea el informe PDF completo y mantiene la app sin anuncios — un pago único, sin suscripción, directamente en la calculadora.',
      perks: ['Historial ilimitado de viajes y repostajes', 'Exportación completa del informe PDF', 'Sin anuncios, nunca'],
    },
  },

  about: {
    metaTitle: 'Acerca de Pumpa',
    metaDescription: 'Por qué existe Pumpa: un registro honesto y privado de costes de combustible que funciona por completo en tu navegador.',
    eyebrow: 'Acerca de',
    h1: 'Un ordenador de a bordo para el resto de nosotros.',
    lede: 'Casi todos los coches te dicen cuánto combustible estás quemando. Muy pocos te dicen cuánto te cuesta — en tu moneda, para tu trayecto, a lo largo de un mes de conducción real.',
    p1: 'Pumpa nació de una sola pregunta: <em>«¿cuánto me cuesta de verdad este viaje?»</em> Responderla no debería exigir una cuenta, una tienda de apps ni un servicio hambriento de datos. Así que Pumpa es una herramienta web sencilla: ábrela, teclea tres números y obtén una respuesta. Registra tus viajes y repostajes y se convierte en un registro continuo de lo que te cuesta conducir — con informes, estadísticas de consumo real y exportaciones.',
    h2Privacy: 'Privado por arquitectura',
    pPrivacy: 'Todo lo que introduces se guarda en el almacenamiento local de tu navegador, en tu dispositivo. No hay servidor, ni cuenta, ni sincronización — así que nadie puede perder, vender o filtrar tus datos, nosotros incluidos. Usa la exportación CSV o PDF para llevarte tus datos a donde quieras.',
    h2Units: 'Unidades y monedas, bien hechas',
    pUnits: 'Los sistemas métrico, US y UK están totalmente soportados y son independientes de la moneda — kilómetros con precios en dólares o millas en złoty, según cómo conduzcas y pagues de verdad. El cambio de sistema convierte tus números correctamente, incluida la relación inversa MPG ↔ L/100km.',
    h2Contact: 'Contacto',
    pContact: 'Preguntas, errores, ideas — escribe a <a href="mailto:mat.zandonella@gmail.com">mat.zandonella@gmail.com</a>.',
  },

  privacy: {
    metaTitle: 'Privacidad — Pumpa',
    metaDescription: 'Pumpa guarda todo en tu dispositivo. Sin cuentas, sin rastreo de tus datos de conducción, sin servidor.',
    eyebrow: 'Privacidad',
    h1: 'Tus datos nunca salen de tu dispositivo.',
    p1: 'Pumpa no tiene backend. Viajes, repostajes, preferencias y el desbloqueo Pro se guardan en el <code>localStorage</code> de tu navegador, en tu propio dispositivo. Nada de lo que escribes en la calculadora se transmite a nosotros ni a nadie.',
    h2Practice: 'Qué significa en la práctica',
    pPractice: 'Borrar los datos del sitio en tu navegador elimina tu historial de Pumpa — usa la exportación CSV para conservar una copia. Tus datos no te siguen entre navegadores o dispositivos, porque no hay cuenta ni sincronización.',
    h2Third: 'Terceros',
    pThird: 'Las páginas cargan las fuentes desde Google Fonts, lo que implica que tu navegador solicita los archivos de fuentes a los servidores de Google. Si en el futuro se añade publicidad al plan gratuito, esta página se actualizará primero con una descripción exacta de lo que implica.',
    updated: 'Última actualización: julio de 2026',
  },

  cookies: {
    metaTitle: 'Cookies — Pumpa',
    metaDescription: 'Pumpa no instala cookies. Esto es exactamente lo que se guarda en tu navegador y por qué.',
    eyebrow: 'Cookies',
    h1: 'Sin cookies. De verdad.',
    p1: 'Pumpa no instala cookies, y hoy no hay ningún script de rastreo, analítica o publicidad en este sitio. Lo que Pumpa sí usa es el <code>localStorage</code> de tu navegador — un pequeño almacén que nunca sale de tu dispositivo y nunca se envía a ningún servidor.',
    h2Stored: 'Qué hay en ese almacén',
    pStored: 'Tus viajes y repostajes registrados, tus preferencias de unidades y moneda, un precio de combustible fijado a mano, tu desbloqueo Pro, el tema elegido y el borrador del plan de viaje. Esa es la lista completa. Borrar los datos de este sitio en tu navegador lo elimina todo — exporta antes un CSV si quieres una copia.',
    h2Changes: 'Si esto cambia algún día',
    pChanges: 'Si en el futuro se añade publicidad al plan gratuito, esta página y la <a href="{privacyUrl}">página de privacidad</a> describirán exactamente qué implica antes de que ocurra.',
  },

  tips: {
    metaTitle: 'Consejos — Pumpa',
    metaDescription: 'Artículos prácticos sobre consumo, precios del combustible y costes de los trayectos — las matemáticas de conducir gastando menos.',
    eyebrow: 'Consejos',
    h1: 'Conduce igual. Paga menos.',
    lede: 'Lecturas breves y prácticas sobre consumo, rarezas de los precios y matemáticas del trayecto diario — cada una con algo que aplicar antes de tu próximo repostaje.',
    readMore: 'Leer →',
    crumb: 'Consejos',
    articleTitleSuffix: ' — Consejos Pumpa',
    cta: {
      h: 'Ponlo a prueba con números',
      body: 'La calculadora pone precio a tus viajes, registra repostajes y calcula tu consumo real — gratis, en tu navegador, guardado en tu dispositivo.',
      button: 'Abrir la calculadora',
    },
  },

  calc: {
    metaTitle: 'Calculadora de costes de combustible — Pumpa',
    metaDescription: 'Calcula el coste en combustible de cualquier viaje, registra repostajes y controla el gasto. Unidades métricas, US y UK, cualquier moneda, guardado en tu dispositivo.',
  },
};

const dicts: Record<Locale, Dict> = { en, it, es };

export function useT(locale: Locale): Dict {
  return dicts[locale] || dicts.en;
}

/** '/calculator/' + 'it' -> '/it/calculator/'; en stays unprefixed. */
export function localeHref(locale: Locale, path: string): string {
  return locale === 'en' ? path : `/${locale}${path}`;
}

/** Strip a locale prefix from a pathname: '/it/tips/' -> '/tips/'. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const m = pathname.match(/^\/(it|es)(\/.*|$)/);
  if (m) return { locale: m[1] as Locale, path: m[2] || '/' };
  return { locale: 'en', path: pathname };
}

/** Tiny {placeholder} filler for dict strings that embed URLs. */
export function fill(template: string, params: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}
