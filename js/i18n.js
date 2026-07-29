(function () {
  var LOCALES = ['en', 'lv', 'ru'];
  var DEFAULT = 'lv';
  var STORAGE_KEY = 'elmsites_lang';

  /* Dictionary holds only LV + RU. English is the page's own markup,
     cached on first apply and restored when switching back to EN.
     Values may contain HTML (e.g. <span class="kw">…</span>, <br>). */
  var T = {
    /* shared nav + footer */
    'nav.story':   { lv: 'Mans stāsts', ru: 'Моя история' },
    'nav.about':   { lv: 'Par mani', ru: 'Обо мне' },
    'nav.contact': { lv: 'Kontakti', ru: 'Контакты' },
    'nav.cta':     { lv: ' Sazināties', ru: ' Связаться' },
    'footer.tagline': {
      lv: 'Mājaslapas uzņēmumiem visā pasaulē · Projektē un būvē viens cilvēks.',
      ru: 'Сайты для бизнеса по всему миру · Проектирует и создаёт один человек.'
    },
    'footer.copy': {
      lv: '© 2026 Elmsites · Bāze Rīgā, strādāju visā pasaulē',
      ru: '© 2026 Elmsites · База в Риге, работаю по всему миру'
    },

    /* shared buttons */
    'btn.demo':       { lv: 'Saņemt bezmaksas demo', ru: 'Получить бесплатное демо' },
    'btn.ourstory':   { lv: 'Mans stāsts', ru: 'Моя история' },
    'btn.start':      { lv: 'Sākt projektu', ru: 'Начать проект' },
    'btn.workwithus': { lv: 'Strādāsim kopā', ru: 'Работать с нами' },

    /* ---- HOME ---- */
    'hero.rot1': { lv: 'Mājaslapas', ru: 'Сайты' },
    'hero.rot2': { lv: 'Interneta veikali', ru: 'Интернет-магазины' },
    'hero.rot3': { lv: 'SEO optimizācija', ru: 'SEO-оптимизация' },
    'hero.sr': {
      lv: 'Elmsites veido mājaslapas, interneta veikalus un SEO optimizāciju.',
      ru: 'Elmsites создаёт сайты, интернет-магазины и SEO-оптимизацию.'
    },
    'home.hero.sub': {
      lv: 'Elmsites veido mājaslapas, interneta veikalus un SEO, kas palīdz cilvēkiem jūs atrast.',
      ru: 'Elmsites создаёт сайты, интернет-магазины и SEO, которое помогает клиентам вас найти.'
    },
    'home.feat.lead': {
      lv: 'Es uzbūvēju <span class="kw">visu no sākuma līdz beigām</span> — dizainu, kodu un to slīpējumu, kāda vairumam vietējo mājaslapu nekad nav.',
      ru: 'Я делаю <span class="kw">всё целиком</span> — дизайн, код и ту отточенность, которой у большинства местных сайтов не бывает.'
    },
    'home.card1.h': { lv: 'Individuāls dizains', ru: 'Индивидуальный дизайн' },
    'home.card1.p': {
      lv: 'Nekādu šablonu, nekāda vilkšanas un nomešanas haosa. Katra mājaslapa top no nulles, lai atbilstu uzņēmumam, ko tā pārstāv.',
      ru: 'Никаких шаблонов, никакого хаоса из перетаскивания блоков. Каждый сайт создаётся с нуля под конкретный бизнес.'
    },
    'home.card2.h': { lv: 'Ātra izpilde', ru: 'Быстрый результат' },
    'home.card2.p': {
      lv: 'Noslīpēta, darboties gatava mājaslapa vienā līdz divās nedēļās. Strādāju ātri, neaizmirstot par detaļām.',
      ru: 'Отполированный, готовый сайт за одну-две недели. Работаю быстро, не жертвуя деталями.'
    },
    'home.card3.h': { lv: 'Uzturēšana iekļauta', ru: 'Поддержка включена' },
    'home.card3.p': {
      lv: 'Palaišana ir sākums, ne beigas. Rūpējos par atjauninājumiem un izmaiņām, lai jūsu mājaslapa vienmēr būtu aktuāla.',
      ru: 'Запуск — это начало, а не конец. Беру на себя обновления и изменения, чтобы сайт оставался актуальным.'
    },

    'home.wyg.label': { lv: 'Ko jūs iegūstat', ru: 'Что вы получаете' },
    'home.wyg.h':     { lv: 'Veidots pēc jūsu garšas.', ru: 'Сделано как для себя.' },
    'home.wyg.sub': {
      lv: 'Katra mājaslapa top ātri, ielādējas ātri un pieder jums.',
      ru: 'Каждый сайт быстро создаётся, быстро загружается и принадлежит вам.'
    },
    'home.wyg.days.num': { lv: '7 dienas', ru: '7 дней' },
    'home.wyg.days.h': {
      lv: 'No brīža, kad saņemu materiālus. Kavēju — nemaksājat.',
      ru: 'С момента, когда получаю материалы. Опоздаю — не платите.'
    },
    'home.wyg.speed.h':  { lv: 'Ielāde zem sekundes', ru: 'Загрузка меньше секунды' },
    'home.wyg.speed.p': {
      lv: 'Ātrums nosaka pozīcijas un pirmo iespaidu. Katra mājaslapa ir optimizēta Google un telefoniem.',
      ru: 'Скорость определяет позиции в поиске и первое впечатление. Каждый сайт оптимизирован под Google и телефоны.'
    },
    'home.wyg.cust.h': { lv: 'Veidots, lai piesaistītu klientus', ru: 'Создано, чтобы приводить клиентов' },
    'home.wyg.cust.p': {
      lv: 'Atsauksmes, kartes un zvans ar vienu pieskārienu iebūvēti — apmeklētāji kļūst par klientiem, ne aizbraucējiem.',
      ru: 'Отзывы, карты и звонок в один тап встроены — посетители превращаются в заявки, а не уходят.'
    },
    'home.wyg.own.h': { lv: 'Viss pieder jums', ru: 'Всё принадлежит вам' },
    'home.wyg.own.p': {
      lv: 'Kods, domēns, saturs — viss jūsu jau no pirmās dienas. Nekādu platformas maksu, nekādu ķīlnieku abonementu.',
      ru: 'Код, домен, контент — всё ваше с первого дня. Никаких платежей за платформу, никаких абонементов-заложников.'
    },
    'home.wyg.lang.h': { lv: 'Katrs klients jūtas kā mājās', ru: 'Каждый клиент чувствует себя как дома' },
    'home.wyg.lang.p': {
      lv: 'Latviešu, angļu, krievu — viena mājaslapa, kas sveic katru apmeklētāju viņa valodā.',
      ru: 'Латышский, английский, русский — один сайт, который встречает каждого на его языке.'
    },

    /* demo showcase — design samples, never described as client work */
    'demos.label': { lv: 'Demo projekti', ru: 'Демо-проекты' },
    'demos.h':     { lv: 'Dizaina paraugi.', ru: 'Образцы дизайна.' },
    'demos.sub': {
      lv: 'Šie ir mani demo projekti — dizaina paraugi, nevis klientu darbi. Katrs uzbūvēts no nulles, lai parādītu, kā es strādāju.',
      ru: 'Это мои демо-проекты — образцы дизайна, а не работы для клиентов. Каждый собран с нуля, чтобы показать, как я работаю.'
    },
    'demos.badge': { lv: 'Demo', ru: 'Демо' },
    'demos.hint':  { lv: 'Velciet, lai redzētu vairāk →', ru: 'Листайте, чтобы увидеть больше →' },

    /* process strip */
    'process.label': { lv: 'Kā es strādāju', ru: 'Как я работаю' },
    'process.h':     { lv: 'Četri soļi, bez pārsteigumiem.', ru: 'Четыре шага, без сюрпризов.' },
    'process.s1.h':  { lv: 'Iepazīšanās zvans', ru: 'Знакомство по телефону' },
    'process.s1.p': {
      lv: 'Īss zvans, lai saprastu jūsu uzņēmumu, klientus un to, kas mājaslapai jāpanāk.',
      ru: 'Короткий звонок, чтобы понять ваш бизнес, клиентов и задачу сайта.'
    },
    'process.s2.h':  { lv: 'Piedāvājums', ru: 'Предложение' },
    'process.s2.p': {
      lv: 'Fiksēta cena un skaidrs apjoms rakstiski. Bez stundu likmēm, bez peldošiem cipariem.',
      ru: 'Фиксированная цена и понятный объём письменно. Без почасовой оплаты и плавающих цифр.'
    },
    'process.s3.h':  { lv: 'Izstrāde', ru: 'Разработка' },
    'process.s3.p': {
      lv: 'Projektēju un uzkodēju mājaslapu no nulles, rādot progresu, kamēr tā top.',
      ru: 'Проектирую и кодирую сайт с нуля, показывая прогресс по ходу работы.'
    },
    'process.s4.h':  { lv: 'Startēšana un atbalsts', ru: 'Запуск и поддержка' },
    'process.s4.p': {
      lv: 'Palaižu lapu, nododu jums visu un palieku sasniedzams turpmākajiem labojumiem.',
      ru: 'Запускаю сайт, передаю вам всё и остаюсь на связи для дальнейших правок.'
    },

    'home.pricing.label': { lv: 'Cenas', ru: 'Цены' },
    'home.pricing.h':     { lv: 'Viena cena un tas pieder jums.', ru: 'Одна цена. Всё ваше.' },
    'home.pricing.sub': {
      lv: 'Trīs paketes, bez abonementiem, bez aģentūras saistībām. Papildinājumi tikai tad, kad tie vajadzīgi.',
      ru: 'Три пакета, без подписок, без привязки к агентству. Дополнения — только когда они нужны.'
    },
    'pill.popular': { lv: 'Populārākais', ru: 'Самый популярный' },
    'pill.addons':  { lv: 'Papildinājumi', ru: 'Дополнения' },
    'price.suffix': { lv: 'vienreizējs', ru: 'разово' },
    'addons.note':  { lv: 'Pievieno jebkurai paketei', ru: 'Добавьте к любому пакету' },

    'pro.f1': { lv: 'Līdz 5 lapām, individuāls dizains ar smalku kustību', ru: 'До 5 страниц, индивидуальный дизайн с лёгкой анимацией' },
    'pro.f2': { lv: 'Google atsauksmes un kartes iebūvētas', ru: 'Google-отзывы и карты встроены' },
    'pro.f3': { lv: 'Pamata SEO un ielāde zem sekundes', ru: 'Базовое SEO и загрузка меньше секунды' },
    'pro.f4': { lv: 'Foto atlase un mākslinieciskā vadība', ru: 'Подбор фото и арт-дирекшн' },
    'pro.f5': { lv: '2 labojumu kārtas — gatavs ~10 dienās', ru: '2 раунда правок — готово за ~10 дней' },

    'basic.f1': { lv: 'Viena lapa, veidota vispirms telefoniem', ru: 'Одна страница, в первую очередь под телефоны' },
    'basic.f2': { lv: 'Kontaktforma + zvans ar pieskārienu un WhatsApp', ru: 'Форма связи + звонок в тап и WhatsApp' },
    'basic.f3': { lv: 'Google Maps iegulšana', ru: 'Встроенная Google-карта' },
    'basic.f4': { lv: 'Gatavs 5 dienās', ru: 'Готово за 5 дней' },
    'basic.f5': { lv: 'Viss pieder jums — bez ikmēneša maksas', ru: 'Всё ваше — без ежемесячной платы' },

    'max.f1': { lv: 'Viss no Pro', ru: 'Всё из Pro' },
    'max.f2': { lv: 'Rezervāciju vai pasūtījumu integrācija', ru: 'Интеграция бронирования или онлайн-заказов' },
    'max.f3': { lv: 'Pilns tekstu saturs — uzrakstu katru vārdu', ru: 'Полный копирайтинг — пишу каждое слово' },
    'max.f4': { lv: 'Prioritāra izstrāde — gatavs 7 dienās', ru: 'Приоритетная разработка — готово за 7 дней' },
    'max.f5': { lv: '30 dienas bezmaksas labojumu pēc palaišanas', ru: '30 дней бесплатных правок после запуска' },

    'addon.1': { lv: 'Hostings un aprūpe — dublējumi, ikmēneša labojumi', ru: 'Хостинг и уход — резервные копии, ежемесячные правки' },
    'addon.2': { lv: 'Papildu valoda (LV / EN / RU)', ru: 'Доп. язык (LV / EN / RU)' },
    'addon.3': { lv: 'Papildu lapa', ru: 'Доп. страница' },
    'addon.4': { lv: 'Logo + mini zīmola komplekts', ru: 'Логотип + мини-брендбук' },
    'addon.5': { lv: 'Pilns teksts (iekļauts Max)', ru: 'Полный копирайтинг (входит в Max)' },
    'addon.6': { lv: 'Steidzama piegāde — 48h', ru: 'Срочная сдача — 48 ч' },
    'addon.7': { lv: 'Google Business izveide + atsauksmju QR', ru: 'Настройка Google Business + QR для отзывов' },
    'addon.8': { lv: 'Pasūtījumi tiešsaistē / e-komercija', ru: 'Онлайн-заказы / интернет-магазин' },
    'addon.8.price': { lv: 'no €200', ru: 'от €200' },

    'home.cta.lead': {
      lv: 'Vai esat gatavs dot savam uzņēmumam mājaslapu, kādu tas <span class="kw">pelnījis?</span>',
      ru: 'Готовы дать своему бизнесу сайт, которого он <span class="kw">заслуживает?</span>'
    },

    /* ---- ABOUT ---- */
    'about.label':  { lv: 'Par mani', ru: 'Обо мне' },
    'about.h1': {
      lv: 'Viens cilvēks, kas <span class="kw">piegādā.</span>',
      ru: 'Один человек, который <span class="kw">доводит до конца.</span>'
    },
    'about.sub': {
      lv: 'Es projektēju un veidoju individuālas mājaslapas uzņēmumiem jebkur — ātri, bez liekās aģentūru birokrātijas.',
      ru: 'Я проектирую и создаю индивидуальные сайты для бизнеса где угодно — быстро, без агентской раздутости.'
    },
    'about.lead': {
      lv: 'Es daru <span class="kw">vienu lietu</span> un daru to labi: veidoju mājaslapas, kas liek uzņēmumiem tiešsaistē izskatīties tikpat labi kā klātienē.',
      ru: 'Я делаю <span class="kw">одно дело</span> и делаю его хорошо: создаю сайты, на которых бизнес выглядит так же хорошо, как вживую.'
    },
    'about.card1.h': { lv: 'Personīgi, ne korporatīvi', ru: 'Лично, а не корпоративно' },
    'about.card1.p': {
      lv: 'Jūs runājat tieši ar cilvēku, kas veido jūsu mājaslapu — ar mani. Nekādu klientu vadītāju, nekādas vilcināšanās, tikai ātra un godīga saziņa.',
      ru: 'Вы общаетесь напрямую с тем, кто делает ваш сайт — со мной. Никаких аккаунт-менеджеров и беготни, только быстрое, честное общение.'
    },
    'about.card2.h': { lv: 'Mūsdienīgi pēc noklusējuma', ru: 'Современно по умолчанию' },
    'about.card2.p': {
      lv: 'Elegants, tumšs, ātrs, gatavs telefoniem. Tāda mājaslapa, kas mazu uzņēmumu padara nopietnu un stabilu.',
      ru: 'Стильный, тёмный, быстрый, готовый к мобильным. Такой сайт, который делает малый бизнес солидным и серьёзным.'
    },
    'about.card3.h': { lv: 'Veidots, lai kalpotu', ru: 'Создано надолго' },
    'about.card3.p': {
      lv: 'Es nepazūdu pēc palaišanas. Atjauninājumi, labojumi un uzturēšana ir daļa no tā, kā strādāju.',
      ru: 'Я не исчезаю после запуска. Обновления, правки и поддержка — часть моей работы.'
    },
    'about.stat1.big': { lv: '1–2 ned.', ru: '1–2 нед.' },
    'about.stat1.cap': { lv: 'Izpildes laiks', ru: 'Срок' },
    'about.stat2.big': { lv: 'Individuāls', ru: 'Индивидуально' },
    'about.stat2.cap': { lv: 'Katrs projekts', ru: 'Каждый проект' },
    'about.stat3.big': { lv: 'Visā pasaulē', ru: 'По всему миру' },
    'about.stat3.cap': { lv: 'Klienti jebkur', ru: 'Клиенты везде' },
    'about.cta.lead': {
      lv: 'Izveidosim <span class="kw">jūsējo.</span>',
      ru: 'Давайте создадим <span class="kw">ваш.</span>'
    },

    /* ---- OUR STORY ---- */
    'story.label': { lv: 'Mans stāsts', ru: 'Моя история' },
    'story.h1': {
      lv: 'Sākās kā projekts.<br>Tagad tas ir <span class="kw">pilna laika darbs.</span>',
      ru: 'Начиналось как проект.<br>Теперь это <span class="kw">основная работа.</span>'
    },
    'story.sub': {
      lv: 'Tas, kas sākās Rīgā kā pusaudža aizraušanās ar mājaslapu veidošanu, pārtapa par kaut ko īstu — darbu, kurā palīdzu uzņēmumiem visā pasaulē.',
      ru: 'То, что началось в Риге как подростковое увлечение сайтами, превратилось в нечто настоящее — работу, в которой я помогаю бизнесу по всему миру.'
    },
    'story.muted': {
      lv: 'Es esmu jauns un strādāju viens — un uzskatu to par priekšrocību, ne par kaut ko slēpjamu. Uzaugu tiešsaistē, strādāju ātri un rūpējos par darbu tā, ka tas redzams katrā mājaslapā.',
      ru: 'Я молод и работаю один — и считаю это преимуществом, а не тем, что нужно скрывать. Я вырос в интернете, работаю быстро и отношусь к делу так, что это видно в каждом сайте.'
    },
    'story.tl1.when': { lv: 'Sākums', ru: 'Начало' },
    'story.tl1.h':    { lv: 'Blakusprojekts', ru: 'Побочный проект' },
    'story.tl1.p': {
      lv: 'Tas sākās Rīgā, veidojot mājaslapas praksei — mācoties dizainu, kodu un to, kā uzņēmumi sevi parāda tiešsaistē. Jo vairāk uzbūvēju, jo vairāk redzēju, cik daudziem uzņēmumiem nebija nekā vai bija kaut kas novecojis.',
      ru: 'Всё началось в Риге с сайтов ради практики — я учился дизайну, коду и тому, как бизнес представляет себя онлайн. Чем больше я делал, тем чаще видел, у скольких компаний нет ничего или что-то устаревшее.'
    },
    'story.tl2.when': { lv: 'Pavērsiens', ru: 'Поворот' },
    'story.tl2.h':    { lv: 'Visu uz vienu kārti', ru: 'Ва-банк' },
    'story.tl2.p': {
      lv: 'Tas, kas sākās kā prakse, kļuva par mērķi. Es pārvērtu prasmes īstā darbā — Elmsites — pilnībā veltītā tam, lai uzņēmumiem dotu mājaslapas, ar kurām lepoties.',
      ru: 'То, что было практикой, стало целью. Я превратил навыки в настоящее дело — Elmsites — полностью посвящённое тому, чтобы давать бизнесу сайты, которыми можно гордиться.'
    },
    'story.tl3.when': { lv: 'Tagad', ru: 'Сейчас' },
    'story.tl3.h':    { lv: 'Pilna laika, ar visu sirdi', ru: 'Полная занятость, с головой' },
    'story.tl3.p': {
      lv: 'Šodien tas ir tas, ko daru. Strādāju ar uzņēmumiem, lai kur tie būtu, projektēju un veidoju viņu mājaslapas no nulles un palieku, lai tās uzturētu. Jauns, izsalcis, šeit uz palikšanu.',
      ru: 'Сегодня это то, чем я занимаюсь. Работаю с бизнесом, где бы он ни был, проектирую и создаю сайты с нуля и остаюсь, чтобы поддерживать их. Молодой, голодный, здесь надолго.'
    },
    'story.cta.lead': {
      lv: 'Vai vēlaties būt daļa no <span class="kw">stāsta?</span>',
      ru: 'Хотите стать частью <span class="kw">истории?</span>'
    },

    /* ---- CONTACT ---- */
    'contact.label': { lv: 'Kontakti', ru: 'Контакты' },
    'contact.h1': {
      lv: 'Padarīsim jūsu<br>uzņēmumu <span class="kw">tādu, kāds tam jābūt.</span>',
      ru: 'Сделаем так, чтобы ваш<br>бизнес <span class="kw">выглядел достойно.</span>'
    },
    'contact.sub': {
      lv: 'Pastāstiet par savu uzņēmumu, un es sagatavošu bezmaksas demo — bez saistībām, bez maksas.',
      ru: 'Расскажите о своём бизнесе, и я соберу бесплатное демо — без обязательств и без оплаты.'
    },
    'contact.muted': {
      lv: 'Ātrākais veids, kā mani sasniegt, ir e-pasts. Uzrakstiet par savu uzņēmumu, un es ātri atbildēšu.',
      ru: 'Быстрее всего связаться со мной по электронной почте. Напишите о своём бизнесе, и я быстро отвечу.'
    },
    'contact.m.email': { lv: 'E-pasts', ru: 'Эл. почта' },
    'contact.m.phone': { lv: 'Tālrunis', ru: 'Телефон' }
  };

  function getSaved() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return LOCALES.indexOf(v) >= 0 ? v : DEFAULT;
    } catch (e) { return DEFAULT; }
  }
  function save(loc) {
    try { localStorage.setItem(STORAGE_KEY, loc); } catch (e) {}
  }

  function apply(loc) {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el._i18nEn === undefined) el._i18nEn = el.innerHTML;
      var key = el.getAttribute('data-i18n');
      var val;
      if (loc === 'en') val = el._i18nEn;
      else val = (T[key] && T[key][loc]) || el._i18nEn;
      el.innerHTML = val;
    }
    document.documentElement.setAttribute('lang', loc);

    var docks = document.querySelectorAll('.lang-dock a');
    for (var j = 0; j < docks.length; j++) {
      var a = docks[j];
      if (a.getAttribute('data-locale') === loc) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
    save(loc);
  }

  function wire() {
    var docks = document.querySelectorAll('.lang-dock a');
    for (var i = 0; i < docks.length; i++) {
      docks[i].addEventListener('click', function (e) {
        e.preventDefault();
        apply(this.getAttribute('data-locale'));
      });
    }
    apply(getSaved());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
