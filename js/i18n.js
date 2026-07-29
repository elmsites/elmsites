(function () {
  var LOCALES = ['en', 'lv', 'ru'];
  var DEFAULT = 'lv';
  var STORAGE_KEY = 'elmsites_lang';

  /* Dictionary holds only LV + RU. English is the page's own markup,
     cached on first apply and restored when switching back to EN.
     Values may contain HTML (e.g. <span class="kw">…</span>, <br>). */
  var T = {
    /* shared nav + footer */
    'nav.story':   { lv: 'Mūsu stāsts', ru: 'Наша история' },
    'nav.about':   { lv: 'Par mums', ru: 'О нас' },
    'nav.contact': { lv: 'Kontakti', ru: 'Контакты' },
    'nav.cta':     { lv: ' Sazināties', ru: ' Связаться' },
    'footer.tagline': {
      lv: 'Mājaslapas uzņēmumiem visā pasaulē · Veido jauna komanda, kas piegādā.',
      ru: 'Сайты для бизнеса по всему миру · Создано молодой командой, которая доводит до результата.'
    },
    'footer.copy': {
      lv: '© 2026 Elmsites · Bāze Rīgā, strādājam visā pasaulē',
      ru: '© 2026 Elmsites · База в Риге, работаем по всему миру'
    },

    /* shared buttons */
    'btn.demo':       { lv: 'Saņemt bezmaksas demo', ru: 'Получить бесплатное демо' },
    'btn.ourstory':   { lv: 'Mūsu stāsts', ru: 'Наша история' },
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
      lv: 'Mēs veidojam <span class="kw">visu no sākuma līdz beigām</span> — dizainu, kodu un to slīpējumu, kāda vairumam vietējo mājaslapu nekad nav.',
      ru: 'Мы делаем <span class="kw">всё целиком</span> — дизайн, код и ту отточенность, которой у большинства местных сайтов не бывает.'
    },
    'home.card1.h': { lv: 'Individuāls dizains', ru: 'Индивидуальный дизайн' },
    'home.card1.p': {
      lv: 'Nekādu šablonu, nekāda vilkšanas un nomešanas haosa. Katra mājaslapa top no nulles, lai atbilstu uzņēmumam, ko tā pārstāv.',
      ru: 'Никаких шаблонов, никакого хаоса из перетаскивания блоков. Каждый сайт создаётся с нуля под конкретный бизнес.'
    },
    'home.card2.h': { lv: 'Ātra izpilde', ru: 'Быстрый результат' },
    'home.card2.p': {
      lv: 'Noslīpēta, darboties gatava mājaslapa vienā līdz divās nedēļās. Strādājam ātri, neaizmirstot par detaļām.',
      ru: 'Отполированный, готовый сайт за одну-две недели. Работаем быстро, не жертвуя деталями.'
    },
    'home.card3.h': { lv: 'Uzturēšana iekļauta', ru: 'Поддержка включена' },
    'home.card3.p': {
      lv: 'Palaišana ir sākums, ne beigas. Rūpējamies par atjauninājumiem un izmaiņām, lai jūsu mājaslapa vienmēr būtu aktuāla.',
      ru: 'Запуск — это начало, а не конец. Берём на себя обновления и изменения, чтобы сайт оставался актуальным.'
    },

    'home.wyg.label': { lv: 'Ko jūs iegūstat', ru: 'Что вы получаете' },
    'home.wyg.h':     { lv: 'Veidots pēc jūsu garšas.', ru: 'Сделано как для себя.' },
    'home.wyg.sub': {
      lv: 'Katra mājaslapa top ātri, ielādējas ātri un pieder jums.',
      ru: 'Каждый сайт быстро создаётся, быстро загружается и принадлежит вам.'
    },
    'home.wyg.days.num': { lv: '5 dienas', ru: '5 дней' },
    'home.wyg.days.h':   { lv: 'No pirmā zvana līdz palaišanai', ru: 'От первого звонка до запуска' },
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
    'max.f3': { lv: 'Pilns tekstu saturs — rakstām katru vārdu', ru: 'Полный копирайтинг — пишем каждое слово' },
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
    'about.label':  { lv: 'Par mums', ru: 'О нас' },
    'about.h1': {
      lv: 'Studija, kas veidota, lai <span class="kw">piegādātu.</span>',
      ru: 'Студия, созданная, чтобы <span class="kw">доводить до конца.</span>'
    },
    'about.sub': {
      lv: 'Mēs projektējam un veidojam individuālas mājaslapas uzņēmumiem jebkur — ātri, bez liekās aģentūru birokrātijas.',
      ru: 'Мы проектируем и создаём индивидуальные сайты для бизнеса где угодно — быстро, без агентской раздутости.'
    },
    'about.lead': {
      lv: 'Mēs darām <span class="kw">vienu lietu</span> un darām to labi: veidojam mājaslapas, kas liek uzņēmumiem tiešsaistē izskatīties tikpat labi kā klātienē.',
      ru: 'Мы делаем <span class="kw">одно дело</span> и делаем его хорошо: создаём сайты, на которых бизнес выглядит так же хорошо, как вживую.'
    },
    'about.card1.h': { lv: 'Personīgi, ne korporatīvi', ru: 'Лично, а не корпоративно' },
    'about.card1.p': {
      lv: 'Jūs runājat tieši ar cilvēkiem, kas veido jūsu mājaslapu. Nekādu klientu vadītāju, nekādas vilcināšanās — tikai ātra, godīga saziņa.',
      ru: 'Вы общаетесь напрямую с теми, кто делает ваш сайт. Никаких аккаунт-менеджеров, никакой беготни — только быстрое, честное общение.'
    },
    'about.card2.h': { lv: 'Mūsdienīgi pēc noklusējuma', ru: 'Современно по умолчанию' },
    'about.card2.p': {
      lv: 'Elegants, tumšs, ātrs, gatavs telefoniem. Tāda mājaslapa, kas mazu uzņēmumu padara nopietnu un stabilu.',
      ru: 'Стильный, тёмный, быстрый, готовый к мобильным. Такой сайт, который делает малый бизнес солидным и серьёзным.'
    },
    'about.card3.h': { lv: 'Veidots, lai kalpotu', ru: 'Создано надолго' },
    'about.card3.p': {
      lv: 'Mēs nepazūdam pēc palaišanas. Atjauninājumi, labojumi un uzturēšana ir daļa no tā, kā strādājam.',
      ru: 'Мы не исчезаем после запуска. Обновления, правки и поддержка — часть нашей работы.'
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
    'story.label': { lv: 'Mūsu stāsts', ru: 'Наша история' },
    'story.h1': {
      lv: 'Sākās kā projekts.<br>Tagad tas ir <span class="kw">pilna laika darbs.</span>',
      ru: 'Начиналось как проект.<br>Теперь это <span class="kw">основная работа.</span>'
    },
    'story.sub': {
      lv: 'Tas, kas sākās kā daži pusaudži Rīgā, kuri veidoja mājaslapas prieka pēc, pārtapa par kaut ko īstu — studiju, kas apkalpo uzņēmumus visā pasaulē.',
      ru: 'То, что началось с пары подростков в Риге, делавших сайты ради удовольствия, превратилось в нечто настоящее — студию, работающую с бизнесом по всему миру.'
    },
    'story.muted': {
      lv: 'Mēs esam jauna komanda, un uzskatām to par priekšrocību, ne par kaut ko slēpjamu. Mēs uzaugām tiešsaistē, strādājam ātri un rūpējamies par darbu tā, ka tas redzams katrā mūsu mājaslapā.',
      ru: 'Мы молодая команда и считаем это преимуществом, а не тем, что нужно скрывать. Мы выросли в интернете, работаем быстро и относимся к делу так, что это видно в каждом сайте.'
    },
    'story.tl1.when': { lv: 'Sākums', ru: 'Начало' },
    'story.tl1.h':    { lv: 'Blakusprojekts', ru: 'Побочный проект' },
    'story.tl1.p': {
      lv: 'Tas sākās Rīgā, veidojot mājaslapas praksei — mācoties dizainu, kodu un to, kā uzņēmumi sevi parāda tiešsaistē. Jo vairāk veidojām, jo vairāk redzējām, cik daudz uzņēmumu nebija nekā vai bija kaut kas novecojis.',
      ru: 'Всё началось в Риге с сайтов ради практики — мы учились дизайну, коду и тому, как бизнес представляет себя онлайн. Чем больше мы делали, тем чаще видели, у скольких компаний нет ничего или что-то устаревшее.'
    },
    'story.tl2.when': { lv: 'Pavērsiens', ru: 'Поворот' },
    'story.tl2.h':    { lv: 'Visu uz vienu kārti', ru: 'Ва-банк' },
    'story.tl2.p': {
      lv: 'Tas, kas sākās kā prakse, kļuva par mērķi. Mēs pārvērtām prasmes īstā studijā — Elmsites — pilnībā veltītā tam, lai uzņēmumiem dotu mājaslapas, ar kurām lepoties.',
      ru: 'То, что было практикой, стало целью. Мы превратили навыки в настоящую студию — Elmsites — полностью посвящённую тому, чтобы давать бизнесу сайты, которыми можно гордиться.'
    },
    'story.tl3.when': { lv: 'Tagad', ru: 'Сейчас' },
    'story.tl3.h':    { lv: 'Pilna laika, ar visu sirdi', ru: 'Полная занятость, с головой' },
    'story.tl3.p': {
      lv: 'Šodien tas ir tas, ko darām. Strādājam ar uzņēmumiem, lai kur tie būtu, projektējam un veidojam viņu mājaslapas no nulles un paliekam, lai tās uzturētu. Jauni, izsalkuši, šeit uz palikšanu.',
      ru: 'Сегодня это то, чем мы занимаемся. Работаем с бизнесом, где бы он ни был, проектируем и создаём сайты с нуля и остаёмся, чтобы поддерживать их. Молодые, голодные, здесь надолго.'
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
      lv: 'Pastāstiet par savu uzņēmumu, un mēs sagatavosim bezmaksas demo — bez saistībām, bez maksas.',
      ru: 'Расскажите о своём бизнесе, и мы соберём бесплатное демо — без обязательств и без оплаты.'
    },
    'contact.muted': {
      lv: 'Ātrākais veids, kā mūs sasniegt, ir e-pasts. Uzrakstiet par savu uzņēmumu, un mēs ātri atbildēsim.',
      ru: 'Быстрее всего связаться с нами по электронной почте. Напишите о своём бизнесе, и мы быстро ответим.'
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
