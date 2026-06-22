/* ===================================================
   YOLNAMA — SPRINT 7 BRAND REFRESH
   Мобильный календарь, фильтры, дублирование, улучшенный UX
   =================================================== */

'use strict';

const API = 'tables/bookings';
const STORAGE_KEYS = {
  bookings: 'tour_flow_bookings',
  settings: 'tour_flow_settings'
};


const SUPABASE_URL = 'https://whpzbpzvdewmfgyrnpqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocHpicHp2ZGV3bWZneXJucHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTc3OTEsImV4cCI6MjA5Njc3Mzc5MX0.76Gs4ckl9jFD3QcR1gLDn3cN1rbmDz7b6xcYf9AJabQ';

let supabaseClient = null;
let syncQueue = Promise.resolve();

const AUTH_TRANSLATIONS = {
  ru: {
    title: 'Аккаунт',
    subtitleGuest: 'Войдите, чтобы синхронизировать записи через Supabase и открывать их с любого устройства.',
    subtitleUser: 'Аккаунт подключён. Новые записи, маршруты и изменения сохраняются в Supabase.',
    emailLabel: 'Email',
    passwordLabel: 'Пароль',
    loginBtn: 'Войти',
    registerBtn: 'Регистрация',
    googleTitle: 'Быстрый вход',
    googleHint: 'Можно войти через Google. После входа записи будут храниться в Supabase и откроются на любом устройстве.',
    googleBtn: 'Войти через Google',
    loggedInAs: 'Вы вошли как',
    logoutBtn: 'Выйти',
    badgeGuest: 'Гость',
    badgeUser: 'Аккаунт подключён',
    connecting: 'Подключение к Supabase…',
    authRequired: 'Сначала войдите в аккаунт',
    passwordMin: 'Пароль должен содержать минимум 6 символов',
    checkEmail: 'Проверьте почту и подтвердите регистрацию, если Supabase запросил подтверждение',
    loginSuccess: 'Вход выполнен',
    registerSuccess: 'Регистрация выполнена',
    logoutSuccess: 'Вы вышли из аккаунта',
    loadError: 'Не удалось загрузить записи из Supabase',
    saveError: 'Не удалось сохранить изменения в Supabase',
    initError: 'Не удалось подключиться к Supabase',
    oauthRedirect: 'Переход к входу через Google…'
  },
  en: {
    title: 'Account',
    subtitleGuest: 'Sign in to sync bookings with Supabase and open them from any device.',
    subtitleUser: 'Account connected. New bookings, routes, and edits are saved to Supabase.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginBtn: 'Sign in',
    registerBtn: 'Register',
    googleTitle: 'Quick sign-in',
    googleHint: 'You can sign in with Google. After login, your records will be stored in Supabase and available on any device.',
    googleBtn: 'Continue with Google',
    loggedInAs: 'Signed in as',
    logoutBtn: 'Sign out',
    badgeGuest: 'Guest',
    badgeUser: 'Account connected',
    connecting: 'Connecting to Supabase…',
    authRequired: 'Please sign in first',
    passwordMin: 'Password must be at least 6 characters',
    checkEmail: 'Check your email and confirm registration if Supabase requires verification',
    loginSuccess: 'Signed in successfully',
    registerSuccess: 'Registration completed',
    logoutSuccess: 'Signed out successfully',
    loadError: 'Failed to load bookings from Supabase',
    saveError: 'Failed to save changes to Supabase',
    initError: 'Failed to connect to Supabase',
    oauthRedirect: 'Redirecting to Google sign-in…'
  },
  uz: {
    title: 'Hisob',
    subtitleGuest: 'Yozuvlarni Supabase orqali sinxronlash va istalgan qurilmada ochish uchun tizimga kiring.',
    subtitleUser: 'Hisob ulandi. Yangi yozuvlar, yoʻnalishlar va oʻzgartirishlar Supabase ga saqlanadi.',
    emailLabel: 'Email',
    passwordLabel: 'Parol',
    loginBtn: 'Kirish',
    registerBtn: 'Roʻyxatdan oʻtish',
    googleTitle: 'Tezkor kirish',
    googleHint: 'Google orqali kirish mumkin. Kirgandan soʻng yozuvlar Supabase da saqlanadi va har qanday qurilmada ochiladi.',
    googleBtn: 'Google orqali kirish',
    loggedInAs: 'Siz kirdingiz',
    logoutBtn: 'Chiqish',
    badgeGuest: 'Mehmon',
    badgeUser: 'Hisob ulandi',
    connecting: 'Supabase ga ulanmoqda…',
    authRequired: 'Avval hisobga kiring',
    passwordMin: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak',
    checkEmail: 'Agar Supabase tasdiq soʻrasa, emailingizni tekshirib roʻyxatdan oʻtishni tasdiqlang',
    loginSuccess: 'Kirish bajarildi',
    registerSuccess: 'Roʻyxatdan oʻtish bajarildi',
    logoutSuccess: 'Hisobdan chiqildi',
    loadError: 'Supabase dan yozuvlarni yuklab boʻlmadi',
    saveError: 'Oʻzgarishlarni Supabase ga saqlab boʻlmadi',
    initError: 'Supabase ga ulanib boʻlmadi',
    oauthRedirect: 'Google orqali kirishga yoʻnaltirilmoqda…'
  }
};

const STATUS_ORDER = ['excursion', 'busy', 'holiday', 'personal'];

const TRANSLATIONS = {
  ru: {
    title: 'Yolnama',
    subtitle: 'Операционная система для гидов и водителей',
    gridBtn: 'Сетка',
    listBtn: 'Список',
    todayBtn: 'Сегодня',
    addSingleBtn: 'Добавить',
    addMultiBtn: 'Маршрут',
    statTitle: 'Статистика месяца',
    incomeTitle: 'Доход за месяц',
    legendTitle: 'Обозначения',
    statsExcursions: 'Экскурсии',
    statsBusy: 'Занят',
    statsHoliday: 'Выходной',
    statsTourists: 'Туристы',
    searchPlaceholder: 'Поиск по городу, клиенту, экскурсии или группе',
    statusAll: 'Все статусы',
    resetBtn: 'Сбросить',
    resultsLabel: 'Записей',
    toolbarTitle: 'Поиск и фильтры',
    toolbarHint: 'Быстрый поиск по текущему месяцу',
    toolbarCollapse: 'Свернуть',
    toolbarExpand: 'Показать',
    noEvents: 'Нет записей за выбранный месяц',
    noResults: 'По выбранным фильтрам ничего не найдено',
    modalCreate: 'Новая запись',
    modalEdit: 'Редактировать запись',
    modalDuplicate: 'Дублировать запись',
    routeModalTitle: 'Бронь маршрута',
    detailModalTitle: 'Информация о дне',
    detailEdit: 'Редактировать',
    detailDuplicate: 'Дублировать запись',
    detailClose: 'Закрыть',
    deleteBtn: 'Удалить',
    cancelBtn: 'Отмена',
    saveBtn: 'Сохранить',
    statusLabel: 'Статус / Тип дня',
    dateLabel: 'Дата',
    cityLabel: 'Город',
    clientLabel: 'Заказчик',
    tourLabel: 'Экскурсия / группа',
    startLabel: 'Начало',
    endLabel: 'Окончание',
    priceLabel: 'Стоимость',
    currencyLabel: 'Валюта',
    groupLabel: 'Количество туристов',
    notesLabel: 'Заметки / Пожелания',
    routeStartLabel: 'Дата начала',
    routeEndLabel: 'Дата окончания',
    routeClientLabel: 'Заказчик',
    routeGroupLabel: 'Количество туристов',
    routePriceLabel: 'Стоимость по умолчанию',
    routeCurrencyLabel: 'Валюта по умолчанию',
    routeNotesLabel: 'Общие заметки',
    routeGenerateBtn: 'Сгенерировать дни',
    cityPlaceholder: 'Самарканд, Бухара...',
    clientPlaceholder: 'Восток Тур',
    tourPlaceholder: 'Сердце Самарканда / Group Silk Road',
    notesPlaceholder: 'Дополнительная информация...',
    routeClientPlaceholder: 'Название компании',
    routeNotesPlaceholder: 'Группа из 15 человек, без Шахрисабза...',
    routeDayCityPlaceholder: 'Город',
    routeDayTourPlaceholder: 'Экскурсия / группа',
    routeDayPricePlaceholder: 'Цена',
    deleteConfirm: 'Удалить эту запись?',
    routeGenerateFirst: 'Сначала сгенерируйте дни маршрута',
    invalidDateRange: 'Дата окончания не может быть раньше даты начала',
    invalidTimeRange: 'Время окончания не может быть раньше времени начала',
    pastDateBlocked: 'Нельзя создавать записи в прошедшие дни',
    pastEditBlocked: 'Записи в прошедших днях нельзя изменять',
    pastPaymentOnlyEdit: 'Для прошедших туров можно менять только статус оплаты',
    paymentStatusSaved: 'Статус оплаты обновлён',
    paymentEditTitle: 'Изменить статус оплаты',
    detailEditPayment: 'Изменить оплату',
    dayOccupied: 'На эту дату уже есть запись',
    timeOccupied: 'Это время уже занято другой записью',
    finishedLabel: 'Завершено',
    routeClientRequired: 'Укажите заказчика маршрута',
    bookingSaved: 'Запись сохранена',
    bookingDeleted: 'Запись удалена',
    routeGenerated: 'Дни маршрута созданы',
    routeSaved: 'Маршрут сохранён',
    filtersReset: 'Фильтры сброшены',
    duplicateReady: 'Запись подготовлена для дублирования',
    slotCheckHint: 'Выберите дату и время, чтобы сразу увидеть занятость',
    slotAvailable: 'Свободно — запись можно сохранить',
    routeCheckHint: 'Сгенерируйте дни маршрута, чтобы проверить занятые даты и время',
    routeAllClear: 'Конфликтов нет — маршрут можно сохранить',
    routeConflictsFound: 'Есть занятые даты или время. Исправьте отмеченные строки.',
    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    weekdays: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
    statuses: {
      excursion: 'Экскурсия',
      busy: 'Занят',
      holiday: 'Выходной',
      personal: 'Личное'
    },
    details: {
      date: 'Дата',
      status: 'Статус',
      city: 'Город',
      client: 'Заказчик',
      tour: 'Экскурсия / группа',
      time: 'Время',
      group: 'Туристы',
      price: 'Стоимость',
      notes: 'Заметки',
      noValue: '—'
    },
    paymentLabel: 'Статус оплаты',
    paidAmountLabel: 'Уже оплачено',
    unpaidAmountLabel: 'Осталось оплатить',
    paymentStatus: { unpaid: 'Не оплачено', partial: 'Частичная оплата', paid: 'Оплачено' },
    statsModalTitle: 'Детальная статистика',
    statsYear: 'Год',
    statsCompleted: 'Завершено',
    statsPlanned: 'Запланировано',
    statsSectionExcursions: 'Экскурсии',
    statsSectionBusy: 'Занятые дни',
    statsSectionHoliday: 'Выходные дни',
    statsSectionTourists: 'Туристы',
    statsSectionIncome: 'Доход за год',
    incomePaid: 'Оплачено',
    incomePartial: 'Частичная оплата',
    incomeUnpaid: 'Не оплачено',
    incomePending: 'Ожидает оплаты',
    openStatsBtn: 'Детали',
    statsMonthlyBreakdown: 'Помесячная разбивка',
    statsMonthLabel: 'Месяц',
    statsCompactCompletedPlanned: 'Завершено / запланировано'
  },
  en: {
    title: 'Yolnama',
    subtitle: 'Operating system for guides and drivers',
    gridBtn: 'Grid',
    listBtn: 'List',
    todayBtn: 'Today',
    addSingleBtn: 'Add',
    addMultiBtn: 'Route',
    statTitle: 'Monthly stats',
    incomeTitle: 'Monthly income',
    legendTitle: 'Legend',
    statsExcursions: 'Tours',
    statsBusy: 'Busy',
    statsHoliday: 'Holiday',
    statsTourists: 'Tourists',
    searchPlaceholder: 'Search by city, client, excursion or group',
    statusAll: 'All statuses',
    resetBtn: 'Reset',
    resultsLabel: 'Records',
    toolbarTitle: 'Search and filters',
    toolbarHint: 'Quick search in current month',
    toolbarCollapse: 'Collapse',
    toolbarExpand: 'Show',
    noEvents: 'No records for this month',
    noResults: 'No records match current filters',
    modalCreate: 'New record',
    modalEdit: 'Edit record',
    modalDuplicate: 'Duplicate record',
    routeModalTitle: 'Route booking',
    detailModalTitle: 'Day details',
    detailEdit: 'Edit',
    detailDuplicate: 'Duplicate',
    detailClose: 'Close',
    deleteBtn: 'Delete',
    cancelBtn: 'Cancel',
    saveBtn: 'Save',
    statusLabel: 'Status / Day type',
    dateLabel: 'Date',
    cityLabel: 'City',
    clientLabel: 'Client',
    tourLabel: 'Excursion / group',
    startLabel: 'Start',
    endLabel: 'End',
    priceLabel: 'Price',
    currencyLabel: 'Currency',
    groupLabel: 'Tourists count',
    notesLabel: 'Notes',
    routeStartLabel: 'Start date',
    routeEndLabel: 'End date',
    routeClientLabel: 'Client',
    routeGroupLabel: 'Tourists count',
    routePriceLabel: 'Default price',
    routeCurrencyLabel: 'Default currency',
    routeNotesLabel: 'Common notes',
    routeGenerateBtn: 'Generate days',
    cityPlaceholder: 'Samarkand, Bukhara...',
    clientPlaceholder: 'Vostok Tour',
    tourPlaceholder: 'Heart of Samarkand / Group Silk Road',
    notesPlaceholder: 'Additional information...',
    routeClientPlaceholder: 'Company name',
    routeNotesPlaceholder: 'Group of 15 people, without Shakhrisabz...',
    routeDayCityPlaceholder: 'City',
    routeDayTourPlaceholder: 'Excursion / group',
    routeDayPricePlaceholder: 'Price',
    deleteConfirm: 'Delete this record?',
    routeGenerateFirst: 'Generate route days first',
    invalidDateRange: 'End date cannot be earlier than start date',
    invalidTimeRange: 'End time cannot be earlier than start time',
    pastDateBlocked: 'You cannot create records in past days',
    pastEditBlocked: 'Past records cannot be edited',
    pastPaymentOnlyEdit: 'For past tours, only the payment status can be changed',
    paymentStatusSaved: 'Payment status updated',
    paymentEditTitle: 'Update payment status',
    detailEditPayment: 'Edit payment',
    dayOccupied: 'There is already a record on this date',
    timeOccupied: 'This time is already occupied by another record',
    finishedLabel: 'Finished',
    routeClientRequired: 'Add route client first',
    bookingSaved: 'Record saved',
    bookingDeleted: 'Record deleted',
    routeGenerated: 'Route days generated',
    routeSaved: 'Route saved',
    filtersReset: 'Filters reset',
    duplicateReady: 'Record is ready to be duplicated',
    slotCheckHint: 'Choose a date and time to check availability instantly',
    slotAvailable: 'Free — you can save this record',
    routeCheckHint: 'Generate route days to check busy dates and time slots',
    routeAllClear: 'No conflicts — the route can be saved',
    routeConflictsFound: 'Some dates or time slots are busy. Fix the highlighted rows.',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdays: ['Mo','Tu','We','Th','Fr','Sa','Su'],
    statuses: {
      excursion: 'Excursion',
      busy: 'Busy',
      holiday: 'Holiday',
      personal: 'Personal'
    },
    details: {
      date: 'Date',
      status: 'Status',
      city: 'City',
      client: 'Client',
      tour: 'Excursion / group',
      time: 'Time',
      group: 'Tourists',
      price: 'Price',
      notes: 'Notes',
      noValue: '—'
    },
    paymentLabel: 'Payment status',
    paidAmountLabel: 'Already paid',
    unpaidAmountLabel: 'Remaining unpaid',
    paymentStatus: { unpaid: 'Unpaid', partial: 'Partial payment', paid: 'Paid' },
    statsModalTitle: 'Detailed statistics',
    statsYear: 'Year',
    statsCompleted: 'Completed',
    statsPlanned: 'Planned',
    statsSectionExcursions: 'Excursions',
    statsSectionBusy: 'Busy days',
    statsSectionHoliday: 'Holidays',
    statsSectionTourists: 'Tourists',
    statsSectionIncome: 'Yearly income',
    incomePaid: 'Paid',
    incomePartial: 'Partial',
    incomeUnpaid: 'Unpaid',
    incomePending: 'Pending',
    openStatsBtn: 'Details',
    statsMonthlyBreakdown: 'Monthly breakdown',
    statsMonthLabel: 'Month',
    statsCompactCompletedPlanned: 'Completed / planned'
  },
  uz: {
    title: 'Yolnama',
    subtitle: 'Gidlar va haydovchilar uchun platforma',
    gridBtn: 'Setka',
    listBtn: 'Roʻyxat',
    todayBtn: 'Bugun',
    addSingleBtn: 'Qoʻshish',
    addMultiBtn: 'Yoʻnalish',
    statTitle: 'Oylik statistika',
    incomeTitle: 'Oylik daromad',
    legendTitle: 'Belgilar',
    statsExcursions: 'Ekskursiyalar',
    statsBusy: 'Band',
    statsHoliday: 'Dam olish',
    statsTourists: 'Turistlar',
    searchPlaceholder: 'Shahar, mijoz, ekskursiya yoki guruh bo‘yicha qidirish',
    statusAll: 'Barcha statuslar',
    resetBtn: 'Tozalash',
    resultsLabel: 'Yozuvlar',
    toolbarTitle: 'Qidiruv va filtrlar',
    toolbarHint: 'Joriy oy bo‘yicha tez qidiruv',
    toolbarCollapse: 'Yigʻish',
    toolbarExpand: 'Koʻrsatish',
    noEvents: 'Bu oy uchun yozuvlar yoʻq',
    noResults: 'Filtrlar bo‘yicha hech narsa topilmadi',
    modalCreate: 'Yangi yozuv',
    modalEdit: 'Yozuvni tahrirlash',
    modalDuplicate: 'Yozuv nusxasi',
    routeModalTitle: 'Yoʻnalish broni',
    detailModalTitle: 'Kun maʼlumoti',
    detailEdit: 'Tahrirlash',
    detailDuplicate: 'Nusxa olish',
    detailClose: 'Yopish',
    deleteBtn: 'Oʻchirish',
    cancelBtn: 'Bekor qilish',
    saveBtn: 'Saqlash',
    statusLabel: 'Status / kun turi',
    dateLabel: 'Sana',
    cityLabel: 'Shahar',
    clientLabel: 'Mijoz',
    tourLabel: 'Ekskursiya / guruh',
    startLabel: 'Boshlanish',
    endLabel: 'Tugash',
    priceLabel: 'Narx',
    currencyLabel: 'Valyuta',
    groupLabel: 'Turistlar soni',
    notesLabel: 'Izohlar',
    routeStartLabel: 'Boshlanish sanasi',
    routeEndLabel: 'Tugash sanasi',
    routeClientLabel: 'Mijoz',
    routeGroupLabel: 'Turistlar soni',
    routePriceLabel: 'Standart narx',
    routeCurrencyLabel: 'Standart valyuta',
    routeNotesLabel: 'Umumiy izohlar',
    routeGenerateBtn: 'Kunlarni yaratish',
    cityPlaceholder: 'Samarqand, Buxoro...',
    clientPlaceholder: 'Vostok Tour',
    tourPlaceholder: 'Samarqand yuragi / Group Silk Road',
    notesPlaceholder: 'Qo‘shimcha maʼlumot...',
    routeClientPlaceholder: 'Kompaniya nomi',
    routeNotesPlaceholder: '15 kishilik guruh, Shahrisabzsiz...',
    routeDayCityPlaceholder: 'Shahar',
    routeDayTourPlaceholder: 'Ekskursiya / guruh',
    routeDayPricePlaceholder: 'Narx',
    deleteConfirm: 'Ushbu yozuv oʻchirilsinmi?',
    routeGenerateFirst: 'Avval yoʻnalish kunlarini yarating',
    invalidDateRange: 'Tugash sanasi boshlanish sanasidan oldin bo‘lishi mumkin emas',
    invalidTimeRange: 'Tugash vaqti boshlanish vaqtidan oldin bo‘lishi mumkin emas',
    pastDateBlocked: 'Oʻtgan kunlarga yozuv yaratib boʻlmaydi',
    pastEditBlocked: 'Oʻtgan kunlardagi yozuvlarni tahrirlab boʻlmaydi',
    pastPaymentOnlyEdit: 'Oʻtgan turlarda faqat toʻlov holatini oʻzgartirish mumkin',
    paymentStatusSaved: 'Toʻlov holati yangilandi',
    paymentEditTitle: 'Toʻlov holatini oʻzgartirish',
    detailEditPayment: 'Toʻlovni tahrirlash',
    dayOccupied: 'Bu sanada allaqachon yozuv bor',
    timeOccupied: 'Bu vaqt boshqa yozuv bilan band',
    finishedLabel: 'Tugallangan',
    routeClientRequired: 'Yoʻnalish mijozini kiriting',
    bookingSaved: 'Yozuv saqlandi',
    bookingDeleted: 'Yozuv oʻchirildi',
    routeGenerated: 'Yoʻnalish kunlari yaratildi',
    routeSaved: 'Yoʻnalish saqlandi',
    filtersReset: 'Filtrlar tozalandi',
    duplicateReady: 'Yozuv nusxa olish uchun tayyorlandi',
    slotCheckHint: 'Bandlikni darhol ko‘rish uchun sana va vaqtni tanlang',
    slotAvailable: 'Boʻsh — yozuvni saqlash mumkin',
    routeCheckHint: 'Band sanalar va vaqtlarni tekshirish uchun yoʻnalish kunlarini yarating',
    routeAllClear: 'Konflikt yoʻq — yoʻnalishni saqlash mumkin',
    routeConflictsFound: 'Band sanalar yoki vaqtlar bor. Belgilangan qatorlarni tuzating.',
    months: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
    weekdays: ['Du','Se','Cho','Pa','Ju','Sha','Yak'],
    statuses: {
      excursion: 'Ekskursiya',
      busy: 'Band',
      holiday: 'Dam olish',
      personal: 'Shaxsiy'
    },
    details: {
      date: 'Sana',
      status: 'Status',
      city: 'Shahar',
      client: 'Mijoz',
      tour: 'Ekskursiya / guruh',
      time: 'Vaqt',
      group: 'Turistlar',
      price: 'Narx',
      notes: 'Izohlar',
      noValue: '—'
    },
    paymentLabel: "To'lov holati",
    paidAmountLabel: "To'langan summa",
    unpaidAmountLabel: "Qolgan summa",
    paymentStatus: { unpaid: "To'lanmagan", partial: "Qisman to'langan", paid: "To'langan" },
    statsModalTitle: 'Batafsil statistika',
    statsYear: 'Yil',
    statsCompleted: 'Bajarilgan',
    statsPlanned: 'Rejalashtirilgan',
    statsSectionExcursions: 'Ekskursiyalar',
    statsSectionBusy: 'Band kunlar',
    statsSectionHoliday: 'Dam olish kunlar',
    statsSectionTourists: 'Turistlar',
    statsSectionIncome: 'Yillik daromad',
    incomePaid: "To'langan",
    incomePartial: "Qisman",
    incomeUnpaid: "To'lanmagan",
    incomePending: 'Kutilmoqda',
    openStatsBtn: 'Batafsil',
    statsMonthlyBreakdown: "Oylar bo'yicha taqsimot",
    statsMonthLabel: 'Oy',
    statsCompactCompletedPlanned: 'Bajarilgan / rejalashtirilgan'
  }
};

const PAYMENT_STATUS_ORDER = ['unpaid', 'partial', 'paid'];
const PAYMENT_STATUS_CONFIG = {
  unpaid:  { color: '#dc2626', bg: '#fee2e2', icon: 'fa-circle-xmark' },
  partial: { color: '#d97706', bg: '#fef3c7', icon: 'fa-circle-half-stroke' },
  paid:    { color: '#16a34a', bg: '#dcfce7', icon: 'fa-circle-check' }
};

const STATUS_CONFIG = {
  excursion: { icon: 'fa-map-marked-alt', color: '#2563eb', bg: '#dbeafe' },
  busy: { icon: 'fa-ban', color: '#dc2626', bg: '#fee2e2' },
  holiday: { icon: 'fa-umbrella-beach', color: '#16a34a', bg: '#dcfce7' },
  personal: { icon: 'fa-user-clock', color: '#d97706', bg: '#fef3c7' }
};

const DEFAULT_FORM_DEFAULTS = {
  client_name: '',
  currency: 'UZS',
  group_size: '',
  start_time: '09:00',
  end_time: '18:00'
};

const state = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  currentView: 'grid',
  currentLang: 'ru',
  filters: { search: '', status: 'all' },
  bookings: [],
  formDefaults: { ...DEFAULT_FORM_DEFAULTS },
  ui: { filtersCollapsedMobile: true },
  statsYear: new Date().getFullYear(),
  user: null,
  authReady: false,
  authBusy: false,
  syncedBookingIds: new Set()
};

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp().catch((error) => {
    console.error('Bootstrap failed', error);
    showToast(getErrorMessage(error, getAuthT().initError), 'error');
  });
});

async function bootstrapApp() {
  loadSettings();
  clearLegacyLocalBookings();
  initDOMEvents();
  updateInterfaceLanguage();
  syncControlsFromState();
  renderAuthState();
  render();
  await initSupabase();
}

function initDOMEvents() {
  safeClick('prevMonthBtn', () => changeMonth(-1));
  safeClick('nextMonthBtn', () => changeMonth(1));
  safeClick('todayBtn', goToToday);
  safeClick('viewGridBtn', () => switchView('grid'));
  safeClick('viewListBtn', () => switchView('list'));
  safeClick('addBookingBtn', () => { if (!requireAuth()) return; openBookingModal(); });
  safeClick('closeBookingModal', closeBookingModal);
  safeClick('cancelBookingBtn', closeBookingModal);
  safeSubmit('bookingForm', onBookingFormSubmit);
  safeClick('deleteBookingBtn', onDeleteBookingClick);

  safeClick('addRouteBtn', () => { if (!requireAuth()) return; openRouteModal(); });
  safeClick('closeRouteModal', closeRouteModal);
  safeClick('cancelRouteBtn', closeRouteModal);
  safeClick('btnGenerateRouteDays', generateRouteDaysRows);
  safeClick('saveRouteBtn', submitRouteForm);
  safeSubmit('routeForm', onRouteFormSubmit);

  safeClick('closeDetailModal', closeDetailModal);
  safeClick('closeDetailModal2', closeDetailModal);
  safeClick('detailDuplicateBtn', onDuplicateBookingClick);
  safeClick('openStatsModalBtn', () => { if (!requireAuth()) return; openStatsModal(state.statsYear); });
  safeClick('statsSideCard', (e) => {
    if (e.target.closest('button')) return;
    if (!requireAuth()) return;
    openStatsModal(state.statsYear);
  });
  safeClick('closeStatsModal', closeStatsModal);
  safeClick('statsModalClose2', closeStatsModal);
  safeClick('statsPrevYearBtn', () => { state.statsYear -= 1; renderStatsModal(); });
  safeClick('statsNextYearBtn', () => { state.statsYear += 1; renderStatsModal(); });

  safeSubmit('authEmailForm', onAuthLoginSubmit);
  safeClick('authRegisterBtn', onAuthRegisterClick);
  safeClick('authGoogleBtn', onAuthGoogleClick);
  safeClick('logoutBtn', onLogoutClick);

  const searchInput = document.getElementById('bookingSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      persistSettings();
      render();
    });
  }

  const statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      state.filters.status = e.target.value;
      persistSettings();
      render();
    });
  }

  safeClick('resetFiltersBtn', resetFilters);
  safeClick('toolbarToggleBtn', toggleMobileToolbarPanel);

  bindBookingAvailabilityListeners();
  bindRouteAvailabilityListeners();

  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = state.currentLang;
    langSelect.addEventListener('change', (e) => {
      state.currentLang = e.target.value;
      persistSettings();
      updateInterfaceLanguage();
      render();
    });
  }

  document.querySelectorAll('input[name="status"]').forEach((radio) => {
    radio.addEventListener('change', (e) => toggleConditionalFields(e.target.value));
  });

  const paymentSel = document.getElementById('bookingPaymentStatus');
  if (paymentSel) paymentSel.addEventListener('change', updatePaymentStatusSelect);
  const bookingPriceInput = document.getElementById('bookingPrice');
  if (bookingPriceInput) bookingPriceInput.addEventListener('input', updatePaymentStatusSelect);
  const bookingPaidInput = document.getElementById('bookingPaidAmount');
  if (bookingPaidInput) bookingPaidInput.addEventListener('input', updatePaymentStatusSelect);
  const routePaymentSel = document.getElementById('routePaymentStatus');
  if (routePaymentSel) routePaymentSel.addEventListener('change', updatePaymentStatusSelect);
  const routePriceInput = document.getElementById('routePrice');
  if (routePriceInput) routePriceInput.addEventListener('input', () => {
    syncRouteDefaultPriceToRows();
    updatePaymentStatusSelect();
  });
  const routePaidInput = document.getElementById('routePaidAmount');
  if (routePaidInput) routePaidInput.addEventListener('input', updatePaymentStatusSelect);

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target !== backdrop) return;
      backdrop.classList.remove('active');
      updateBodyModalState();
    });
  });

  window.addEventListener('resize', () => {
    renderResultsSummary();
    updateMobileToolbarState();
    updateBookingAvailabilityHint();
    updateRouteAvailabilityHint();
  });
}

function getT() {
  return TRANSLATIONS[state.currentLang] || TRANSLATIONS.ru;
}

function getAuthT() {
  return AUTH_TRANSLATIONS[state.currentLang] || AUTH_TRANSLATIONS.ru;
}

function clearLegacyLocalBookings() {
  try {
    localStorage.removeItem(STORAGE_KEYS.bookings);
  } catch (error) {
    console.warn('Legacy bookings cleanup failed', error);
  }
}

function getSupabaseRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function setAuthBusy(flag) {
  state.authBusy = Boolean(flag);
  renderAuthState();
}

async function initSupabase() {
  if (!window.supabase?.createClient) {
    state.authReady = true;
    renderAuthState();
    throw new Error(getAuthT().initError);
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    await applySession(data?.session || null);
  } catch (error) {
    console.error('Supabase init failed', error);
    showToast(getErrorMessage(error, getAuthT().loadError), 'error');
  } finally {
    state.authReady = true;
    renderAuthState();
  }

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => {
      applySession(session).catch((error) => {
        console.error('Auth state apply failed', error);
        showToast(getErrorMessage(error, getAuthT().loadError), 'error');
      });
    }, 0);
  });
}

async function applySession(session) {
  const nextUser = session?.user || null;
  const previousUserId = state.user?.id || '';
  const nextUserId = nextUser?.id || '';

  state.user = nextUser;
  renderAuthState();

  if (!nextUser) {
    state.bookings = [];
    state.syncedBookingIds = new Set();
    closeAllModals();
    render();
    return;
  }

  if (previousUserId !== nextUserId || !state.syncedBookingIds.size) {
    await loadBookings();
  }

  render();
}

function renderAuthState() {
  const t = getAuthT();
  document.body.dataset.auth = state.user ? 'user' : 'guest';
  document.body.dataset.authReady = state.authReady ? '1' : '0';

  const guestView = document.getElementById('authGuestView');
  const userView = document.getElementById('authUserView');
  if (guestView) guestView.hidden = Boolean(state.user);
  if (userView) userView.hidden = !state.user;

  setTxt('authTitle', t.title);
  setTxt('authSubtitle', state.user ? t.subtitleUser : t.subtitleGuest);
  setTxt('authStatusBadgeText', !state.authReady ? t.connecting : (state.user ? t.badgeUser : t.badgeGuest));
  setTxt('authEmailLabel', t.emailLabel);
  setTxt('authPasswordLabel', t.passwordLabel);
  setTxt('authLoginBtnText', t.loginBtn);
  setTxt('authRegisterBtnText', t.registerBtn);
  setTxt('authGoogleTitle', t.googleTitle);
  setTxt('authGoogleHintText', t.googleHint);
  setTxt('authGoogleBtnText', t.googleBtn);
  setTxt('authLoggedInLabel', t.loggedInAs);
  setTxt('logoutBtnText', t.logoutBtn);
  setTxt('authCurrentUser', state.user?.email || '—');
  setTxt('authStatusNote', !state.authReady ? t.connecting : (state.user ? t.subtitleUser : t.subtitleGuest));

  ['authEmail', 'authPassword', 'authLoginBtn', 'authRegisterBtn', 'authGoogleBtn', 'logoutBtn'].forEach((id) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.disabled = !state.authReady || state.authBusy;
  });
}

function requireAuth() {
  if (state.user) return true;
  showToast(getAuthT().authRequired, 'error');
  return false;
}

async function onAuthLoginSubmit(event) {
  event.preventDefault();
  if (!state.authReady || !supabaseClient) return;

  const email = getVal('authEmail').trim().toLowerCase();
  const password = getVal('authPassword');
  if (!email || !password) return;

  setAuthBusy(true);
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    resetAuthForm();
    showToast(getAuthT().loginSuccess, 'success');
  } catch (error) {
    console.error('Login failed', error);
    showToast(getErrorMessage(error, getAuthT().initError), 'error');
  } finally {
    setAuthBusy(false);
  }
}

async function onAuthRegisterClick() {
  if (!state.authReady || !supabaseClient) return;

  const email = getVal('authEmail').trim().toLowerCase();
  const password = getVal('authPassword');
  if (!email || !password) return;
  if (password.length < 6) {
    showToast(getAuthT().passwordMin, 'error');
    return;
  }

  setAuthBusy(true);
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { redirectTo: getSupabaseRedirectUrl() }
    });
    if (error) throw error;
    resetAuthForm();
    if (data?.session) {
      showToast(getAuthT().registerSuccess, 'success');
    } else {
      showToast(getAuthT().checkEmail, 'info');
    }
  } catch (error) {
    console.error('Register failed', error);
    showToast(getErrorMessage(error, getAuthT().initError), 'error');
  } finally {
    setAuthBusy(false);
  }
}

async function onAuthGoogleClick() {
  if (!state.authReady || !supabaseClient) return;
  setAuthBusy(true);
  try {
    showToast(getAuthT().oauthRedirect, 'info');
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getSupabaseRedirectUrl() }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Google auth failed', error);
    showToast(getErrorMessage(error, getAuthT().initError), 'error');
    setAuthBusy(false);
  }
}

async function onLogoutClick() {
  if (!supabaseClient) return;
  setAuthBusy(true);
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    resetAuthForm();
    showToast(getAuthT().logoutSuccess, 'success');
  } catch (error) {
    console.error('Logout failed', error);
    showToast(getErrorMessage(error, getAuthT().initError), 'error');
  } finally {
    setAuthBusy(false);
  }
}

function resetAuthForm() {
  setVal('authPassword', '');
}

function getErrorMessage(error, fallback) {
  return String(error?.message || fallback || 'Unknown error');
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop.active').forEach((node) => node.classList.remove('active'));
  updateBodyModalState();
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return;
    const settings = JSON.parse(raw);
    if (typeof settings.currentYear === 'number') state.currentYear = settings.currentYear;
    if (typeof settings.currentMonth === 'number') state.currentMonth = settings.currentMonth;
    if (typeof settings.currentView === 'string') state.currentView = settings.currentView;
    if (typeof settings.currentLang === 'string') state.currentLang = settings.currentLang;
    if (settings.filters && typeof settings.filters === 'object') {
      state.filters.search = typeof settings.filters.search === 'string' ? settings.filters.search : '';
      state.filters.status = typeof settings.filters.status === 'string' ? settings.filters.status : 'all';
    }
    if (settings.formDefaults && typeof settings.formDefaults === 'object') {
      state.formDefaults = {
        ...DEFAULT_FORM_DEFAULTS,
        ...settings.formDefaults
      };
    }
    if (settings.ui && typeof settings.ui === 'object') {
      state.ui.filtersCollapsedMobile = settings.ui.filtersCollapsedMobile !== false;
    }
  } catch (error) {
    console.warn('Settings load failed', error);
  }
}

function persistSettings() {
  const payload = {
    currentYear: state.currentYear,
    currentMonth: state.currentMonth,
    currentView: state.currentView,
    currentLang: state.currentLang,
    filters: state.filters,
    formDefaults: state.formDefaults,
    ui: state.ui
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(payload));
}

async function loadBookings() {
  if (!supabaseClient || !state.user) {
    state.bookings = [];
    state.syncedBookingIds = new Set();
    return;
  }

  const { data, error } = await supabaseClient
    .from('bookings')
    .select('*')
    .eq('user_id', state.user.id)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;

  state.bookings = normalizeBookingsArray(data || []);
  state.syncedBookingIds = new Set(state.bookings.map((booking) => booking.id));
}

function persistBookings() {
  syncQueue = syncQueue.then(() => persistBookingsInternal());
  return syncQueue.then(() => true).catch(async (error) => {
    console.error('Supabase sync failed', error);
    try {
      await loadBookings();
      render();
    } catch (reloadError) {
      console.error('Reload after sync failure failed', reloadError);
    }
    showToast(getErrorMessage(error, getAuthT().saveError), 'error');
    return false;
  });
}

async function persistBookingsInternal() {
  if (!supabaseClient || !state.user) throw new Error(getAuthT().authRequired);

  state.bookings = normalizeBookingsArray(state.bookings);
  const nextIds = new Set(state.bookings.map((booking) => booking.id));
  const removedIds = Array.from(state.syncedBookingIds).filter((id) => !nextIds.has(id));

  if (removedIds.length) {
    const { error: deleteError } = await supabaseClient
      .from('bookings')
      .delete()
      .eq('user_id', state.user.id)
      .in('id', removedIds);
    if (deleteError) throw deleteError;
  }

  if (state.bookings.length) {
    const payload = state.bookings.map(serializeBookingForSupabase);
    const { error: upsertError } = await supabaseClient
      .from('bookings')
      .upsert(payload, { onConflict: 'id' });
    if (upsertError) throw upsertError;
  }

  state.syncedBookingIds = nextIds;
}

function serializeBookingForSupabase(booking) {
  const price = toMoneyNumber(booking?.price);
  const paymentStatus = PAYMENT_STATUS_ORDER.includes(booking?.payment_status) ? booking.payment_status : 'unpaid';
  return {
    id: booking?.id || generateId(),
    user_id: state.user.id,
    date: booking?.date || '',
    status: STATUS_ORDER.includes(booking?.status) ? booking.status : 'excursion',
    city: String(booking?.city || '').trim(),
    client_name: String(booking?.client_name || '').trim(),
    tour_name: String(booking?.tour_name || '').trim(),
    start_time: normalizeTimeValue(booking?.start_time) || null,
    end_time: normalizeTimeValue(booking?.end_time) || null,
    price,
    currency: String(booking?.currency || 'UZS').trim() || 'UZS',
    group_size: Number(booking?.group_size || 0),
    notes: String(booking?.notes || '').trim(),
    payment_status: paymentStatus,
    paid_amount: normalizePaidAmount(price, paymentStatus, booking?.paid_amount)
  };
}

function normalizeTimeValue(value) {
  const raw = String(value || '').trim();
  return /^\d{2}:\d{2}:\d{2}$/.test(raw) ? raw.slice(0, 5) : raw;
}

function normalizeBookingsArray(bookings) {
  return (Array.isArray(bookings) ? bookings : [])
    .map((item) => {
      const price = Number(item?.price || 0);
      const paymentStatus = PAYMENT_STATUS_ORDER.includes(item?.payment_status) ? item.payment_status : 'unpaid';
      return {
        id: String(item?.id || generateId()),
        date: String(item?.date || ''),
        status: STATUS_ORDER.includes(item?.status) ? item.status : 'excursion',
        city: String(item?.city || '').trim(),
        client_name: String(item?.client_name || '').trim(),
        tour_name: String(item?.tour_name || '').trim(),
        start_time: normalizeTimeValue(item?.start_time),
        end_time: normalizeTimeValue(item?.end_time),
        price,
        currency: String(item?.currency || 'UZS').trim() || 'UZS',
        group_size: Number(item?.group_size || 0),
        notes: String(item?.notes || '').trim(),
        payment_status: paymentStatus,
        paid_amount: normalizePaidAmount(price, paymentStatus, item?.paid_amount)
      };
    })
    .sort((a, b) => `${a.date}-${a.id}`.localeCompare(`${b.date}-${b.id}`));
}

function updateInterfaceLanguage() {
  const t = getT();

  document.title = `${t.title} — ${t.subtitle}`;
  setTxtBySelector('.header-title h1', t.title);
  setTxtBySelector('.header-title p', t.subtitle);
  setTxt('statTitle', t.statTitle);
  setTxt('incomeTitle', t.incomeTitle);
  setTxt('legendTitle', t.legendTitle);
  setTxt('toolbarTitle', t.toolbarTitle);
  setTxt('toolbarHint', t.toolbarHint);
  setTxt('todayBtn', t.todayBtn);
  setHtml('viewGridBtn', `<i class="fas fa-th"></i> ${t.gridBtn}`);
  setHtml('viewListBtn', `<i class="fas fa-list"></i> ${t.listBtn}`);
  setHtml('addRouteBtn', `<i class="fas fa-route"></i> ${t.addMultiBtn}`);
  setHtml('addBookingBtn', `<i class="fas fa-plus"></i> ${t.addSingleBtn}`);
  setTxt('resetFiltersBtn', t.resetBtn);
  setTxt('modalTitle', t.modalCreate);
  setTxt('routeModalTitle', t.routeModalTitle);
  setTxt('detailModalTitle', t.detailModalTitle);
  setHtml('detailEditBtn', `<i class="fas fa-pen"></i> ${t.detailEdit}`);
  setHtml('detailDuplicateBtn', `<i class="fas fa-copy"></i> ${t.detailDuplicate}`);
  setTxt('closeDetailModal2', t.detailClose);
  setTxt('cancelBookingBtn', t.cancelBtn);
  setTxt('saveBookingBtn', t.saveBtn);
  setTxt('deleteBookingBtn', t.deleteBtn);
  setTxt('cancelRouteBtn', t.cancelBtn);
  setTxt('saveRouteBtn', t.saveBtn);
  setHtml('btnGenerateRouteDays', `<i class="fas fa-gears"></i> ${t.routeGenerateBtn}`);

  setTxt('lblStatus', t.statusLabel);
  setTxt('lblDate', t.dateLabel);
  setTxt('lblCity', t.cityLabel);
  setTxt('lblClient', t.clientLabel);
  setTxt('lblTour', t.tourLabel);
  setTxt('lblStart', t.startLabel);
  setTxt('lblEnd', t.endLabel);
  setTxt('lblPrice', t.priceLabel);
  setTxt('lblCurrency', t.currencyLabel);
  setTxt('lblGroup', t.groupLabel);
  setTxt('lblNotes', t.notesLabel);
  setTxt('lblRouteStart', t.routeStartLabel);
  setTxt('lblRouteEnd', t.routeEndLabel);
  setTxt('lblRouteClient', t.routeClientLabel);
  setTxt('lblRouteGroup', t.routeGroupLabel);
  setTxt('lblRoutePrice', t.routePriceLabel);
  setTxt('lblRouteCurrency', t.routeCurrencyLabel);
  setTxt('lblRouteNotes', t.routeNotesLabel);

  setPlaceholder('bookingSearch', t.searchPlaceholder);
  setPlaceholder('bookingCity', t.cityPlaceholder);
  setPlaceholder('bookingClient', t.clientPlaceholder);
  setPlaceholder('bookingTour', t.tourPlaceholder);
  setPlaceholder('bookingNotes', t.notesPlaceholder);
  setPlaceholder('routeClient', t.routeClientPlaceholder);
  setPlaceholder('routeNotes', t.routeNotesPlaceholder);

  const labels = document.querySelectorAll('.stat-mini-box .stat-label');
  if (labels.length >= 4) {
    labels[0].textContent = t.statsExcursions;
    labels[1].textContent = t.statsBusy;
    labels[2].textContent = t.statsHoliday;
    labels[3].textContent = t.statsTourists;
  }

  const legendLabels = document.querySelectorAll('.legend-item span');
  if (legendLabels.length >= 4) {
    legendLabels[0].textContent = t.statuses.excursion;
    legendLabels[1].textContent = t.statuses.busy;
    legendLabels[2].textContent = t.statuses.holiday;
    legendLabels[3].textContent = t.statuses.personal;
  }

  const statusLabelNodes = document.querySelectorAll('[data-status-label]');
  statusLabelNodes.forEach((node) => {
    const key = node.getAttribute('data-status-label');
    if (key && t.statuses[key]) node.textContent = t.statuses[key];
  });

  renderStatusFilterOptions();
  renderWeekdays();
  syncControlsFromState();
  renderResultsSummary();
  renderRouteDayPlaceholders();
  updateMobileToolbarState();
  updateBookingAvailabilityHint();
  updateRouteAvailabilityHint();
  updatePaymentStatusLabels();
  renderAuthState();
}

function renderStatusFilterOptions() {
  const select = document.getElementById('statusFilter');
  if (!select) return;
  const t = getT();
  const currentValue = state.filters.status;
  select.innerHTML = [
    `<option value="all">${t.statusAll}</option>`,
    ...STATUS_ORDER.map((status) => `<option value="${status}">${t.statuses[status]}</option>`)
  ].join('');
  select.value = currentValue || 'all';
}

function syncControlsFromState() {
  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = state.currentLang;

  const search = document.getElementById('bookingSearch');
  if (search) search.value = state.filters.search;

  const status = document.getElementById('statusFilter');
  if (status) status.value = state.filters.status;

  const gridBtn = document.getElementById('viewGridBtn');
  const listBtn = document.getElementById('viewListBtn');
  if (gridBtn) gridBtn.classList.toggle('active', state.currentView === 'grid');
  if (listBtn) listBtn.classList.toggle('active', state.currentView === 'list');
  updateMobileToolbarState();
}

function goToToday() {
  const now = new Date();
  state.currentYear = now.getFullYear();
  state.currentMonth = now.getMonth();
  persistSettings();
  render();
}

function changeMonth(direction) {
  state.currentMonth += direction;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear += 1;
  } else if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear -= 1;
  }
  persistSettings();
  render();
}

function switchView(view) {
  state.currentView = view;
  persistSettings();
  syncControlsFromState();
  render();
}

function resetFilters() {
  state.filters = { search: '', status: 'all' };
  persistSettings();
  syncControlsFromState();
  render();
  showToast(getT().filtersReset, 'info');
}

function render() {
  const t = getT();
  setTxt('currentMonthLabel', `${t.months[state.currentMonth]} ${state.currentYear}`);
  syncControlsFromState();
  renderWeekdays();
  calculateAndRenderStats();
  renderResultsSummary();

  const gridView = document.getElementById('calendar-grid-view');
  const listView = document.getElementById('calendar-list-view');
  if (state.currentView === 'grid') {
    if (gridView) gridView.style.display = 'block';
    if (listView) listView.style.display = 'none';
    renderGrid();
  } else {
    if (gridView) gridView.style.display = 'none';
    if (listView) listView.style.display = 'block';
    renderList();
  }
  updateMobileToolbarState();
  updateBookingAvailabilityHint();
  updateRouteAvailabilityHint();
}

function renderWeekdays() {
  const header = document.getElementById('weekdaysHeader');
  if (!header) return;
  const t = getT();
  header.innerHTML = t.weekdays.map((day) => `<div class="weekday-label">${day}</div>`).join('');
}

function getCurrentMonthBookings() {
  const prefix = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
  return state.bookings.filter((booking) => booking.date.startsWith(prefix));
}

function getTodayDateString() {
  return toDateString(new Date());
}

function isPastDate(dateString) {
  return Boolean(dateString) && dateString < getTodayDateString();
}

function isFinishedExcursion(booking) {
  return booking?.status === 'excursion' && isPastDate(booking?.date || '');
}

function timeToMinutes(value) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(':').map(Number);
  return (hours * 60) + minutes;
}

function getSameDateBookings(dateString, ignoreId = '') {
  return state.bookings.filter((booking) => booking.date === dateString && (!ignoreId || booking.id !== ignoreId));
}

function isMobileViewport() {
  return window.innerWidth <= 768;
}

function toggleMobileToolbarPanel() {
  if (!isMobileViewport()) return;
  state.ui.filtersCollapsedMobile = !state.ui.filtersCollapsedMobile;
  persistSettings();
  updateMobileToolbarState();
}

function updateMobileToolbarState() {
  const panel = document.getElementById('toolbarPanel');
  const body = document.getElementById('toolbarPanelBody');
  const button = document.getElementById('toolbarToggleBtn');
  if (!panel || !body || !button) return;

  const mobile = isMobileViewport();
  const collapsed = mobile ? Boolean(state.ui.filtersCollapsedMobile) : false;
  panel.classList.toggle('mobile-collapsed', collapsed);
  body.hidden = collapsed;
  button.hidden = !mobile;

  const t = getT();
  button.setAttribute('aria-expanded', String(!collapsed));
  button.innerHTML = `<i class="fas ${collapsed ? 'fa-chevron-down' : 'fa-chevron-up'}"></i> ${collapsed ? t.toolbarExpand : t.toolbarCollapse}`;
}

function bindBookingAvailabilityListeners() {
  ['bookingDate', 'bookingStart', 'bookingEnd'].forEach((id) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.addEventListener('input', updateBookingAvailabilityHint);
    node.addEventListener('change', updateBookingAvailabilityHint);
  });
  document.querySelectorAll('input[name="status"]').forEach((radio) => {
    radio.addEventListener('change', updateBookingAvailabilityHint);
  });
}

function bindRouteAvailabilityListeners() {
  ['routeStart', 'routeEnd'].forEach((id) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.addEventListener('input', updateRouteAvailabilityHint);
    node.addEventListener('change', updateRouteAvailabilityHint);
  });

  const container = document.getElementById('routeDaysContainer');
  if (container) {
    container.addEventListener('input', updateRouteAvailabilityHint);
    container.addEventListener('change', updateRouteAvailabilityHint);
  }
}

function setFieldConflictState(ids, isConflict) {
  ids.forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.classList.toggle('is-conflict', Boolean(isConflict));
  });
}

function setHintPanelState(id, options = {}) {
  const node = document.getElementById(id);
  if (!node) return;
  const type = options.type || 'muted';
  const title = options.title || '';
  const message = options.message || '';
  const items = Array.isArray(options.items) ? options.items.filter(Boolean) : [];

  if (!message && !items.length) {
    node.hidden = true;
    node.innerHTML = '';
    node.className = 'form-hint-panel is-muted';
    return;
  }

  const iconMap = { success: 'fa-circle-check', error: 'fa-triangle-exclamation', muted: 'fa-circle-info' };
  const safeTitle = title ? `<strong>${escapeHtml(title)}</strong>` : '';
  const safeMessage = message ? `<div>${escapeHtml(message)}</div>` : '';
  const safeItems = items.length
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';

  node.hidden = false;
  node.className = `form-hint-panel is-${type}`;
  node.innerHTML = `
    <i class="fas ${iconMap[type] || iconMap.muted}"></i>
    <div class="hint-text">${safeTitle}${safeMessage}${safeItems}</div>
  `;
}

function getBookingFormCandidate() {
  const status = document.querySelector('input[name="status"]:checked')?.value || 'excursion';
  return {
    id: getVal('bookingId'),
    date: getVal('bookingDate'),
    status,
    start_time: status === 'excursion' ? getVal('bookingStart') : '',
    end_time: status === 'excursion' ? getVal('bookingEnd') : ''
  };
}

function isPastPaymentOnlyMode() {
  return document.getElementById('bookingModal')?.dataset?.pastPaymentOnly === '1';
}

function setBookingFormAccessMode({ pastPaymentOnly = false, showDelete = false } = {}) {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.dataset.pastPaymentOnly = pastPaymentOnly ? '1' : '0';

  const fieldIds = [
    'bookingDate',
    'bookingCity',
    'bookingClient',
    'bookingTour',
    'bookingStart',
    'bookingEnd',
    'bookingPrice',
    'bookingCurrency',
    'bookingGroup',
    'bookingNotes'
  ];

  fieldIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = pastPaymentOnly;
  });

  document.querySelectorAll('input[name="status"]').forEach((input) => {
    input.disabled = pastPaymentOnly;
  });

  const paymentSelect = document.getElementById('bookingPaymentStatus');
  if (paymentSelect) paymentSelect.disabled = false;

  const deleteBtn = document.getElementById('deleteBookingBtn');
  if (deleteBtn) {
    deleteBtn.disabled = pastPaymentOnly;
    deleteBtn.style.display = showDelete ? 'inline-flex' : 'none';
  }
}

function updateBookingAvailabilityHint() {
  const saveBtn = document.getElementById('saveBookingBtn');
  const bookingModal = document.getElementById('bookingModal');
  if (!saveBtn || !bookingModal) return;

  const t = getT();
  const candidate = getBookingFormCandidate();
  const ignoreId = getVal('bookingId');
  const status = candidate.status;
  const startTime = candidate.start_time;
  const endTime = candidate.end_time;

  setFieldConflictState(['bookingDate', 'bookingStart', 'bookingEnd'], false);

  if (!bookingModal.classList.contains('active')) {
    saveBtn.disabled = false;
    setHintPanelState('bookingAvailabilityHint', { type: 'muted', message: '' });
    return;
  }

  if (isPastPaymentOnlyMode()) {
    saveBtn.disabled = false;
    setHintPanelState('bookingAvailabilityHint', { type: 'info', message: t.pastPaymentOnlyEdit });
    return;
  }

  if (!candidate.date) {
    saveBtn.disabled = false;
    setHintPanelState('bookingAvailabilityHint', { type: 'muted', message: t.slotCheckHint });
    return;
  }

  if (status === 'excursion' && startTime && endTime && endTime < startTime) {
    saveBtn.disabled = true;
    setFieldConflictState(['bookingStart', 'bookingEnd'], true);
    setHintPanelState('bookingAvailabilityHint', { type: 'error', message: t.invalidTimeRange });
    return;
  }

  const conflictMessage = getBookingConflictMessage(candidate, ignoreId);
  if (conflictMessage) {
    saveBtn.disabled = true;
    setFieldConflictState(['bookingDate', 'bookingStart', 'bookingEnd'], true);
    setHintPanelState('bookingAvailabilityHint', { type: 'error', message: conflictMessage });
    return;
  }

  if (status === 'excursion' && (!startTime || !endTime)) {
    saveBtn.disabled = false;
    setHintPanelState('bookingAvailabilityHint', { type: 'muted', message: t.slotCheckHint });
    return;
  }

  saveBtn.disabled = false;
  setHintPanelState('bookingAvailabilityHint', { type: 'success', message: t.slotAvailable });
}

function buildRouteRowCandidate(row) {
  return {
    id: '',
    date: row.dataset.date || '',
    status: 'excursion',
    start_time: row.querySelector('.route-day-start')?.value || state.formDefaults.start_time || '09:00',
    end_time: row.querySelector('.route-day-end')?.value || state.formDefaults.end_time || '18:00'
  };
}

function updateRouteAvailabilityHint() {
  const routeModal = document.getElementById('routeModal');
  const saveBtn = document.getElementById('saveRouteBtn');
  const container = document.getElementById('routeDaysContainer');
  if (!routeModal || !saveBtn || !container) return;

  const t = getT();
  const startStr = getVal('routeStart');
  const endStr = getVal('routeEnd');
  const rows = Array.from(container.querySelectorAll('.route-day-row'));

  rows.forEach((row) => {
    row.classList.remove('has-conflict');
    let note = row.querySelector('.route-day-conflict');
    if (!note) {
      note = document.createElement('div');
      note.className = 'route-day-conflict';
      note.hidden = true;
      row.querySelector('.route-day-editor')?.appendChild(note);
    }
    note.hidden = true;
    note.textContent = '';
  });

  if (!routeModal.classList.contains('active')) {
    saveBtn.disabled = false;
    setHintPanelState('routeAvailabilityHint', { type: 'muted', message: '' });
    return;
  }

  if (!startStr || !endStr) {
    saveBtn.disabled = true;
    setHintPanelState('routeAvailabilityHint', { type: 'muted', message: t.routeCheckHint });
    return;
  }

  if (endStr < startStr) {
    saveBtn.disabled = true;
    setHintPanelState('routeAvailabilityHint', { type: 'error', message: t.invalidDateRange });
    return;
  }

  if (isPastDate(startStr) || isPastDate(endStr)) {
    saveBtn.disabled = true;
    setHintPanelState('routeAvailabilityHint', { type: 'error', message: t.pastDateBlocked });
    return;
  }

  if (!rows.length) {
    saveBtn.disabled = true;
    setHintPanelState('routeAvailabilityHint', { type: 'muted', message: t.routeCheckHint });
    return;
  }

  const conflictItems = [];
  rows.forEach((row) => {
    const candidate = buildRouteRowCandidate(row);
    let message = '';
    if (candidate.start_time && candidate.end_time && candidate.end_time < candidate.start_time) {
      message = t.invalidTimeRange;
    } else {
      message = getBookingConflictMessage(candidate);
    }

    const note = row.querySelector('.route-day-conflict');
    if (message && note) {
      row.classList.add('has-conflict');
      note.hidden = false;
      note.textContent = message;
      conflictItems.push(`${candidate.date}: ${message}`);
    }
  });

  if (conflictItems.length) {
    saveBtn.disabled = true;
    setHintPanelState('routeAvailabilityHint', {
      type: 'error',
      message: t.routeConflictsFound,
      items: conflictItems.slice(0, 4)
    });
    return;
  }

  saveBtn.disabled = false;
  setHintPanelState('routeAvailabilityHint', { type: 'success', message: t.routeAllClear });
}

function getBookingConflictMessage(candidate, ignoreId = '') {
  const t = getT();
  if (!candidate?.date) return '';
  if (isPastDate(candidate.date)) return t.pastDateBlocked;

  const sameDateBookings = getSameDateBookings(candidate.date, ignoreId);
  if (!sameDateBookings.length) return '';

  if (candidate.status !== 'excursion') {
    return t.dayOccupied;
  }

  for (const existing of sameDateBookings) {
    if (existing.status !== 'excursion') {
      return t.dayOccupied;
    }

    const candidateStart = timeToMinutes(candidate.start_time);
    const candidateEnd = timeToMinutes(candidate.end_time);
    const existingStart = timeToMinutes(existing.start_time);
    const existingEnd = timeToMinutes(existing.end_time);

    if (candidateStart === null || candidateEnd === null || existingStart === null || existingEnd === null) {
      return t.timeOccupied;
    }

    if (candidateStart < existingEnd && candidateEnd > existingStart) {
      return `${t.timeOccupied} (${existing.start_time}–${existing.end_time})`;
    }
  }

  return '';
}

function getVisibleBookings() {
  let items = getCurrentMonthBookings();
  const search = state.filters.search.trim().toLowerCase();
  const status = state.filters.status;

  if (status && status !== 'all') {
    items = items.filter((booking) => booking.status === status);
  }

  if (search) {
    items = items.filter((booking) => {
      const haystack = [
        booking.city,
        booking.client_name,
        booking.tour_name,
        booking.notes,
        booking.currency,
        booking.group_size
      ].join(' ').toLowerCase();
      return haystack.includes(search);
    });
  }

  return items.sort((a, b) => `${a.date}-${a.start_time}-${a.id}`.localeCompare(`${b.date}-${b.start_time}-${b.id}`));
}

function toMoneyNumber(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

function normalizePaidAmount(price, paymentStatus, paidAmount) {
  const total = toMoneyNumber(price);
  if (paymentStatus === 'paid') return total;
  if (paymentStatus === 'unpaid') return 0;
  return Math.min(total, toMoneyNumber(paidAmount));
}

function getPaymentSplit(booking) {
  const total = toMoneyNumber(booking?.price);
  const status = booking?.payment_status || 'unpaid';
  const paid = normalizePaidAmount(total, status, booking?.paid_amount);
  return { paid, unpaid: Math.max(0, total - paid) };
}

function addAmountToMap(map, currency, amount) {
  const value = toMoneyNumber(amount);
  if (!value) return;
  map[currency] = (map[currency] || 0) + value;
}

function accumulateIncomeByPayment(booking, paidMap, unpaidMap) {
  if (!booking || !booking.price) return;
  const currency = booking.currency || 'UZS';
  const split = getPaymentSplit(booking);
  addAmountToMap(paidMap, currency, split.paid);
  addAmountToMap(unpaidMap, currency, split.unpaid);
}

function getRouteRowsTotalPrice() {
  const rows = Array.from(document.querySelectorAll('.route-day-row'));
  if (!rows.length) return toMoneyNumber(getVal('routePrice'));
  return rows.reduce((sum, row) => {
    const rowValue = row.querySelector('.route-day-price')?.value;
    return sum + toMoneyNumber(rowValue || getVal('routePrice'));
  }, 0);
}

function syncPaymentSplitFields(prefix) {
  const paymentSelect = document.getElementById(prefix + 'PaymentStatus');
  const priceInput = document.getElementById(prefix + 'Price');
  const paidInput = document.getElementById(prefix + 'PaidAmount');
  const unpaidInput = document.getElementById(prefix + 'UnpaidPreview');
  const wrap = document.getElementById(prefix + 'PartialWrap');
  if (!paymentSelect || !priceInput || !paidInput || !unpaidInput || !wrap) return;

  const status = paymentSelect.value || 'unpaid';
  const total = prefix === 'route' ? getRouteRowsTotalPrice() : toMoneyNumber(priceInput.value);
  const normalizedPaid = normalizePaidAmount(total, status, paidInput.value);
  const unpaid = Math.max(0, total - normalizedPaid);

  if (status === 'partial') {
    wrap.hidden = false;
    paidInput.value = String(normalizedPaid);
  } else {
    wrap.hidden = true;
    paidInput.value = status === 'paid' ? String(total) : '0';
  }

  unpaidInput.value = String(unpaid);
}

function applyPaymentSelectStyle(selectEl) {
  if (!selectEl) return;
  const val = selectEl.value || 'unpaid';
  const conf = PAYMENT_STATUS_CONFIG[val] || PAYMENT_STATUS_CONFIG.unpaid;
  selectEl.style.borderColor = conf.color;
  selectEl.style.background = conf.bg;
  selectEl.style.color = conf.color;
  selectEl.style.fontWeight = '700';
}

function calculateAndRenderStats() {
  const visible = getVisibleBookings();
  const excursions = visible.filter((booking) => booking.status === 'excursion');
  const busy = visible.filter((booking) => booking.status === 'busy').length;
  const holiday = visible.filter((booking) => booking.status === 'holiday').length;
  const tourists = excursions.reduce((sum, booking) => sum + (Number(booking.group_size) || 0), 0);

  setTxt('excursions-count', excursions.length);
  setTxt('busy-count', busy);
  setTxt('holiday-count', holiday);
  setTxt('tourists-count', tourists);

  const t = getT();
  const paidMap = {}, unpaidMap = {};
  excursions.forEach((booking) => accumulateIncomeByPayment(booking, paidMap, unpaidMap));

  const incomeNode = document.getElementById('total-income');
  if (!incomeNode) return;

  const renderIncomeGroup = (map, labelKey, colorClass) => {
    const entries = Object.entries(map);
    if (!entries.length) return '';
    return '<div class="income-group">' +
      '<div class="income-group-label ' + colorClass + '">' + escapeHtml(t[labelKey]) + '</div>' +
      entries.map(([cur, val]) => '<div class="income-amount ' + colorClass + '">' + formatCurrency(val, cur) + '</div>').join('') +
      '</div>';
  };

  const allEmpty = !Object.keys(paidMap).length && !Object.keys(unpaidMap).length;
  if (allEmpty) {
    incomeNode.innerHTML = '<div class="income-amount">0 UZS</div>';
    return;
  }

  incomeNode.innerHTML =
    renderIncomeGroup(paidMap,   'incomePaid',   'income-paid') +
    renderIncomeGroup(unpaidMap, 'incomeUnpaid', 'income-unpaid');
}

function renderResultsSummary() {
  const node = document.getElementById('resultsSummary');
  if (!node) return;
  const t = getT();
  const count = getVisibleBookings().length;
  node.innerHTML = `<span class="results-summary-label">${t.resultsLabel}</span><strong>${count}</strong>`;
}

function renderGrid() {
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const compactMobile = isCompactMobile();
  const bookingsMap = new Map();
  getVisibleBookings().forEach((booking) => {
    const arr = bookingsMap.get(booking.date) || [];
    arr.push(booking);
    bookingsMap.set(booking.date, arr);
  });

  const firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
  const prevDaysInMonth = new Date(state.currentYear, state.currentMonth, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const visiblePills = compactMobile ? 1 : (window.innerWidth < 992 ? 2 : 3);
  const today = getTodayDateString();
  const t = getT();

  for (let i = 0; i < totalCells; i += 1) {
    let dayNumber;
    let month = state.currentMonth;
    let year = state.currentYear;
    let isCurrentMonth = true;

    if (i < startOffset) {
      dayNumber = prevDaysInMonth - startOffset + i + 1;
      month = state.currentMonth === 0 ? 11 : state.currentMonth - 1;
      year = state.currentMonth === 0 ? state.currentYear - 1 : state.currentYear;
      isCurrentMonth = false;
    } else if (i >= startOffset + daysInMonth) {
      dayNumber = i - startOffset - daysInMonth + 1;
      month = state.currentMonth === 11 ? 0 : state.currentMonth + 1;
      year = state.currentMonth === 11 ? state.currentYear + 1 : state.currentYear;
      isCurrentMonth = false;
    } else {
      dayNumber = i - startOffset + 1;
    }

    const cellDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    const dayBookings = bookingsMap.get(cellDate) || [];
    const isPast = isPastDate(cellDate);
    const hasDayBlocker = dayBookings.some((booking) => booking.status !== 'excursion');

    const cell = document.createElement('div');
    cell.className = 'day-cell';
    if (!isCurrentMonth) cell.classList.add('other-month');
    if (cellDate === today) cell.classList.add('today');
    if (isPast) cell.classList.add('past-day');
    if (i % 7 === 5 || i % 7 === 6) cell.classList.add('weekend-cell');

    cell.innerHTML = `<div class="day-num">${dayNumber}</div>`;

    const incomeLabel = getDayIncomeLabel(dayBookings);
    if (incomeLabel) {
      const tag = document.createElement('div');
      tag.className = 'day-income-tag';
      tag.textContent = incomeLabel;
      cell.appendChild(tag);
    }

    dayBookings.slice(0, visiblePills).forEach((booking) => cell.appendChild(createBookingPill(booking)));

    if (dayBookings.length > visiblePills) {
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'more-bookings-btn';
      more.textContent = `+${dayBookings.length - visiblePills}`;
      more.title = `${dayBookings.length} записи`;
      more.addEventListener('click', (e) => {
        e.stopPropagation();
        switchView('list');
      });
      cell.appendChild(more);
    }

    if (isPast) {
      cell.title = t.pastDateBlocked;
    } else if (hasDayBlocker) {
      cell.title = t.dayOccupied;
      cell.addEventListener('click', () => showToast(t.dayOccupied, 'info'));
    } else {
      cell.addEventListener('click', () => openBookingModal(null, cellDate));
    }

    grid.appendChild(cell);
  }
}

function getDayIncomeLabel(bookings) {
  const totals = {};
  bookings.forEach((booking) => {
    if (booking.status !== 'excursion' || !booking.price) return;
    const currency = booking.currency || 'UZS';
    totals[currency] = (totals[currency] || 0) + Number(booking.price || 0);
  });
  const entries = Object.entries(totals);
  if (entries.length !== 1) return '';
  const [currency, value] = entries[0];
  return formatCurrency(value, currency);
}

function createBookingPill(booking) {
  const pill = document.createElement('div');
  pill.className = 'booking-pill';
  const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
  const label = getBookingPillLabel(booking);
  const isFinished = isFinishedExcursion(booking);
  pill.style.backgroundColor = conf.bg;
  pill.style.color = conf.color;
  pill.style.borderLeft = `3px solid ${conf.color}`;
  if (isFinished) {
    pill.classList.add('finished-booking');
  }
  if (isCompactMobile()) {
    pill.classList.add('compact');
    pill.textContent = '';
  } else {
    pill.textContent = label;
  }
  pill.setAttribute('title', isFinished ? `${label} • ${getT().finishedLabel}` : label);
  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    openDetailModal(booking);
  });
  return pill;
}

function getBookingPillLabel(booking) {
  const t = getT();
  if (booking.status !== 'excursion') return t.statuses[booking.status] || t.statuses.excursion;
  if (booking.tour_name) return booking.city ? `[${booking.city}] ${booking.tour_name}` : booking.tour_name;
  if (booking.client_name) return booking.city ? `[${booking.city}] ${booking.client_name}` : booking.client_name;
  return booking.city ? `[${booking.city}] ${t.statuses.excursion}` : t.statuses.excursion;
}

function renderList() {
  const container = document.getElementById('list-view-container');
  if (!container) return;
  const t = getT();
  const visible = getVisibleBookings();

  if (!visible.length) {
    container.innerHTML = `<div class="empty-state">${state.filters.search || state.filters.status !== 'all' ? t.noResults : t.noEvents}</div>`;
    return;
  }

  container.innerHTML = visible
    .map((booking) => {
      const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
      const isFinished = isFinishedExcursion(booking);
      const statusLabel = isFinished ? `${getStatusLabel(booking.status)} • ${getT().finishedLabel}` : getStatusLabel(booking.status);
      return `
        <div class="list-item${isFinished ? ' finished-booking' : ''}" data-booking-id="${escapeHtml(booking.id)}">
          <div class="list-main">
            <div class="list-title-row">
              <strong>${escapeHtml(booking.date)}</strong>
              <span class="list-status-chip${isFinished ? ' finished-booking' : ''}" style="background:${conf.bg}; color:${conf.color};">${escapeHtml(statusLabel)}</span>
            </div>
            <div class="list-primary">${escapeHtml(getListPrimaryLabel(booking))}</div>
            <div class="list-meta">${escapeHtml(getListMeta(booking))}</div>
          </div>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('[data-booking-id]').forEach((item) => {
    item.addEventListener('click', () => {
      const booking = state.bookings.find((entry) => entry.id === item.dataset.bookingId);
      if (booking) openDetailModal(booking);
    });
  });
}

function getStatusLabel(status) {
  return getT().statuses[status] || getT().statuses.excursion;
}

function getListPrimaryLabel(booking) {
  if (booking.status !== 'excursion') return getStatusLabel(booking.status);
  return booking.tour_name || booking.client_name || getStatusLabel('excursion');
}

function getListMeta(booking) {
  const parts = [];
  if (booking.city) parts.push(booking.city);
  if (booking.client_name) parts.push(booking.client_name);
  if (booking.start_time || booking.end_time) parts.push([booking.start_time, booking.end_time].filter(Boolean).join('–'));
  if (booking.price) parts.push(formatCurrency(booking.price, booking.currency));
  if (booking.group_size) parts.push(`${booking.group_size}`);
  return parts.join(' • ');
}

function openBookingModal(booking = null, defaultDate = null, mode = 'create') {
  if (!requireAuth()) return;
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  const t = getT();
  const isEditing = Boolean(booking && booking.id && mode === 'edit');

  const isPastBooking = isEditing && isPastDate(booking?.date || '');
  const isPastPaymentOnly = isPastBooking && booking?.status === 'excursion';

  if (isPastBooking && !isPastPaymentOnly) {
    showToast(t.pastEditBlocked, 'error');
    return;
  }

  const initialDate = mode === 'duplicate' && isPastDate(booking?.date || '')
    ? getTodayDateString()
    : (booking?.date || defaultDate || getTodayDateString());

  if (!isEditing && isPastDate(initialDate)) {
    showToast(t.pastDateBlocked, 'error');
    return;
  }

  const title = isPastPaymentOnly
    ? (t.paymentEditTitle || t.modalEdit)
    : (isEditing ? t.modalEdit : mode === 'duplicate' ? t.modalDuplicate : t.modalCreate);

  setTxt('modalTitle', title);
  setVal('bookingId', isEditing ? booking.id : '');
  setVal('bookingDate', initialDate);
  setVal('bookingCity', booking?.city || '');
  setVal('bookingClient', booking?.client_name || state.formDefaults.client_name || '');
  setVal('bookingTour', booking?.tour_name || '');
  setVal('bookingStart', booking?.start_time || state.formDefaults.start_time || '09:00');
  setVal('bookingEnd', booking?.end_time || state.formDefaults.end_time || '18:00');
  setVal('bookingPrice', booking?.price || '');
  setVal('bookingGroup', booking?.group_size || state.formDefaults.group_size || '');
  setVal('bookingNotes', booking?.notes || '');
  setVal('bookingCurrency', booking?.currency || state.formDefaults.currency || 'UZS');

  const status = booking?.status || 'excursion';
  const radio = document.querySelector(`input[name="status"][value="${status}"]`);
  if (radio) radio.checked = true;
  toggleConditionalFields(status);

  const paymentStatus = booking?.payment_status || 'unpaid';
  const paymentSelectEl = document.getElementById('bookingPaymentStatus');
  if (paymentSelectEl) paymentSelectEl.value = paymentStatus;
  setVal('bookingPaidAmount', String(normalizePaidAmount(Number(booking?.price || 0), paymentStatus, booking?.paid_amount)));
  updatePaymentStatusSelect();

  setBookingFormAccessMode({ pastPaymentOnly: isPastPaymentOnly, showDelete: isEditing && !isPastPaymentOnly });

  modal.classList.add('active');
  updateBodyModalState();
  updateBookingAvailabilityHint();

  if (isPastPaymentOnly) {
    showToast(t.pastPaymentOnlyEdit, 'info');
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  modal.classList.remove('active');
  updateBodyModalState();
  setBookingFormAccessMode({ pastPaymentOnly: false, showDelete: false });
  setHintPanelState('bookingAvailabilityHint', { type: 'muted', message: '' });
}

function toggleConditionalFields(status) {
  const node = document.getElementById('conditionalFields');
  if (!node) return;
  node.style.display = status === 'excursion' ? 'block' : 'none';
  updateBookingAvailabilityHint();
}

async function onBookingFormSubmit(event) {
  event.preventDefault();
  const t = getT();
  const id = getVal('bookingId');
  const status = document.querySelector('input[name="status"]:checked')?.value || 'excursion';
  const startTime = getVal('bookingStart');
  const endTime = getVal('bookingEnd');
  const originalBooking = id ? state.bookings.find((booking) => booking.id === id) : null;

  if (originalBooking && isPastDate(originalBooking.date)) {
    if (originalBooking.status !== 'excursion') {
      showToast(t.pastEditBlocked, 'error');
      return;
    }

    const paymentStatus = getVal('bookingPaymentStatus') || originalBooking.payment_status || 'unpaid';
    const existingIndex = state.bookings.findIndex((booking) => booking.id === originalBooking.id);
    if (existingIndex >= 0) {
      state.bookings[existingIndex] = {
        ...originalBooking,
        payment_status: paymentStatus,
        paid_amount: normalizePaidAmount(Number(originalBooking.price || 0), paymentStatus, getVal('bookingPaidAmount'))
      };
      const synced = await persistBookings();
      if (!synced) return;
      persistSettings();
      closeBookingModal();
      closeDetailModal();
      render();
      showToast(t.paymentStatusSaved || t.bookingSaved, 'success');
    }
    return;
  }

  if (status === 'excursion' && startTime && endTime && endTime < startTime) {
    showToast(t.invalidTimeRange, 'error');
    return;
  }

  const bookingPrice = status === 'excursion' ? Number(getVal('bookingPrice') || 0) : 0;
  const bookingPaymentStatus = status === 'excursion' ? (getVal('bookingPaymentStatus') || 'unpaid') : 'unpaid';
  const data = {
    id: id || generateId(),
    date: getVal('bookingDate'),
    status,
    city: status === 'excursion' ? getVal('bookingCity').trim() : '',
    client_name: status === 'excursion' ? getVal('bookingClient').trim() : '',
    tour_name: status === 'excursion' ? getVal('bookingTour').trim() : '',
    start_time: status === 'excursion' ? startTime : '',
    end_time: status === 'excursion' ? endTime : '',
    price: bookingPrice,
    currency: status === 'excursion' ? (getVal('bookingCurrency') || 'UZS') : 'UZS',
    group_size: status === 'excursion' ? Number(getVal('bookingGroup') || 0) : 0,
    notes: getVal('bookingNotes').trim(),
    payment_status: bookingPaymentStatus,
    paid_amount: normalizePaidAmount(bookingPrice, bookingPaymentStatus, getVal('bookingPaidAmount'))
  };

  const conflictMessage = getBookingConflictMessage(data, id);
  if (conflictMessage) {
    showToast(conflictMessage, 'error');
    return;
  }

  const existingIndex = state.bookings.findIndex((booking) => booking.id === data.id);
  if (existingIndex >= 0) {
    state.bookings[existingIndex] = data;
  } else {
    state.bookings.push(data);
  }

  saveFormDefaultsFromBooking(data);
  const synced = await persistBookings();
  if (!synced) return;
  persistSettings();
  closeBookingModal();
  render();
  showToast(t.bookingSaved, 'success');
}

async function onDeleteBookingClick() {
  const t = getT();
  const id = getVal('bookingId');
  if (!id) return;
  const existing = state.bookings.find((booking) => booking.id === id);
  if (existing && isPastDate(existing.date)) {
    showToast(t.pastEditBlocked, 'error');
    return;
  }
  if (!window.confirm(t.deleteConfirm)) return;
  state.bookings = state.bookings.filter((booking) => booking.id !== id);
  const synced = await persistBookings();
  if (!synced) return;
  closeBookingModal();
  closeDetailModal();
  render();
  showToast(t.bookingDeleted, 'success');
}

function openRouteModal() {
  if (!requireAuth()) return;
  const modal = document.getElementById('routeModal');
  if (!modal) return;
  document.getElementById('routeForm')?.reset();
  const today = toDateString(new Date());
  setVal('routeStart', today);
  setVal('routeEnd', today);
  setVal('routeClient', state.formDefaults.client_name || '');
  setVal('routeGroupSize', state.formDefaults.group_size || '');
  setVal('routePrice', '');
  setVal('routeCurrency', state.formDefaults.currency || 'UZS');
  setVal('routeNotes', '');
  setVal('routePaymentStatus', 'unpaid');
  setVal('routePaidAmount', '0');
  setVal('routeUnpaidPreview', '0');
  setHtml('routeDaysContainer', '');
  modal.classList.add('active');
  updateBodyModalState();
  updatePaymentStatusSelect();
  updateRouteAvailabilityHint();
}

function closeRouteModal() {
  const modal = document.getElementById('routeModal');
  if (!modal) return;
  modal.classList.remove('active');
  updateBodyModalState();
  setHintPanelState('routeAvailabilityHint', { type: 'muted', message: '' });
}

function submitRouteForm() {
  const form = document.getElementById('routeForm');
  if (!form) return;
  if (typeof form.requestSubmit === 'function') {
    form.requestSubmit();
  } else {
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }
}

function collectExistingRouteRowValues() {
  const map = new Map();
  document.querySelectorAll('.route-day-row').forEach((row) => {
    map.set(row.dataset.date, {
      city: row.querySelector('.route-day-city')?.value.trim() || '',
      tour: row.querySelector('.route-day-tour')?.value.trim() || '',
      start: row.querySelector('.route-day-start')?.value || '',
      end: row.querySelector('.route-day-end')?.value || '',
      price: row.querySelector('.route-day-price')?.value || ''
    });
  });
  return map;
}

function bindRouteDayRowActions() {
  document.querySelectorAll('.route-day-remove').forEach((button) => {
    button.onclick = () => {
      button.closest('.route-day-row')?.remove();
      updatePaymentStatusSelect();
    };
  });

  document.querySelectorAll('.route-day-price').forEach((node) => {
    node.oninput = () => updatePaymentStatusSelect();
  });
}

function generateRouteDaysRows() {
  const t = getT();
  const startStr = getVal('routeStart');
  const endStr = getVal('routeEnd');
  const container = document.getElementById('routeDaysContainer');
  if (!container || !startStr || !endStr) return;
  if (endStr < startStr) {
    showToast(t.invalidDateRange, 'error');
    return;
  }
  if (isPastDate(startStr) || isPastDate(endStr)) {
    showToast(t.pastDateBlocked, 'error');
    return;
  }

  const preserved = collectExistingRouteRowValues();
  const defaultPrice = getVal('routePrice');
  const defaultStart = state.formDefaults.start_time || '09:00';
  const defaultEnd = state.formDefaults.end_time || '18:00';

  const parts = [];
  let current = new Date(`${startStr}T00:00:00`);
  const end = new Date(`${endStr}T00:00:00`);
  while (current <= end) {
    const date = toDateString(current);
    const existing = preserved.get(date) || {};
    parts.push(`
      <div class="route-day-row" data-date="${date}">
        <div class="route-day-date">📅 ${date}</div>
        <div class="route-day-editor">
          <div class="route-day-main-grid">
            <input type="text" class="form-control route-day-city" placeholder="${escapeHtml(t.routeDayCityPlaceholder)}" value="${escapeHtml(existing.city || '')}">
            <input type="text" class="form-control route-day-tour" placeholder="${escapeHtml(t.routeDayTourPlaceholder)}" value="${escapeHtml(existing.tour || '')}">
          </div>
          <div class="route-day-sub-grid">
            <input type="time" class="form-control route-day-start" value="${escapeHtml(existing.start || defaultStart)}">
            <input type="time" class="form-control route-day-end" value="${escapeHtml(existing.end || defaultEnd)}">
            <input type="number" class="form-control route-day-price" placeholder="${escapeHtml(t.routeDayPricePlaceholder)}" min="0" value="${escapeHtml(defaultPrice !== '' ? defaultPrice : (existing.price || ''))}">
          </div>
        </div>
        <button type="button" class="route-day-remove" aria-label="Удалить день"><i class="fas fa-trash"></i></button>
      </div>
    `);
    current.setDate(current.getDate() + 1);
  }
  container.innerHTML = parts.join('');
  bindRouteDayRowActions();
  syncRouteDefaultPriceToRows();
  updatePaymentStatusSelect();
  updateRouteAvailabilityHint();
  showToast(t.routeGenerated, 'success');
}

function syncRouteDefaultPriceToRows() {
  const defaultPrice = getVal('routePrice');
  if (defaultPrice === '') return;
  document.querySelectorAll('.route-day-price').forEach((node) => {
    node.value = defaultPrice;
  });
}

function distributeRoutePaidAmounts(bookings, totalPaid, routePaymentStatus) {
  const normalizedTotalPaid = toMoneyNumber(totalPaid);
  let remaining = normalizedTotalPaid;

  return bookings.map((booking) => {
    const price = toMoneyNumber(booking.price);
    let paidAmount = 0;

    if (routePaymentStatus === 'paid') {
      paidAmount = price;
    } else if (routePaymentStatus === 'partial') {
      paidAmount = Math.min(price, remaining);
      remaining = Math.max(0, remaining - paidAmount);
    }

    return {
      ...booking,
      payment_status: routePaymentStatus,
      paid_amount: paidAmount
    };
  });
}

function formatCurrencyMapCompact(map) {
  const entries = Object.entries(map || {});
  if (!entries.length) return '<span class="smb-empty">—</span>';
  return entries.map(([cur, val]) => `<div class="smb-income-line">${escapeHtml(formatCurrency(val, cur))}</div>`).join('');
}

function buildMonthlyStatsRows(bookings, year, today, t) {
  return t.months.map((monthName, monthIndex) => {
    const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    const items = bookings.filter((b) => (b.date || '').startsWith(prefix));
    const excursions = items.filter((b) => b.status === 'excursion');
    const busy = items.filter((b) => b.status === 'busy');
    const holiday = items.filter((b) => b.status === 'holiday');
    const excCompleted = excursions.filter((b) => b.date < today);
    const excPlanned = excursions.filter((b) => b.date >= today);
    const busyCompleted = busy.filter((b) => b.date < today);
    const busyPlanned = busy.filter((b) => b.date >= today);
    const holCompleted = holiday.filter((b) => b.date < today);
    const holPlanned = holiday.filter((b) => b.date >= today);
    const touristsCompleted = excCompleted.reduce((sum, b) => sum + (Number(b.group_size) || 0), 0);
    const touristsPlanned = excPlanned.reduce((sum, b) => sum + (Number(b.group_size) || 0), 0);
    const incomeMap = {};
    excursions.forEach((b) => addAmountToMap(incomeMap, b.currency || 'UZS', b.price));
    const hasData = items.length > 0;
    return `
      <div class="smb-row${hasData ? '' : ' is-empty'}">
        <div class="smb-month">${escapeHtml(monthName)}</div>
        <div class="smb-cell"><strong>${excCompleted.length}</strong><span>/ ${excPlanned.length}</span></div>
        <div class="smb-cell"><strong>${busyCompleted.length}</strong><span>/ ${busyPlanned.length}</span></div>
        <div class="smb-cell"><strong>${holCompleted.length}</strong><span>/ ${holPlanned.length}</span></div>
        <div class="smb-cell"><strong>${touristsCompleted}</strong><span>/ ${touristsPlanned}</span></div>
        <div class="smb-cell smb-income-cell">${formatCurrencyMapCompact(incomeMap)}</div>
      </div>
    `;
  }).join('');
}

function renderRouteDayPlaceholders() {
  const t = getT();
  document.querySelectorAll('.route-day-city').forEach((node) => {
    node.placeholder = t.routeDayCityPlaceholder;
  });
  document.querySelectorAll('.route-day-tour').forEach((node) => {
    node.placeholder = t.routeDayTourPlaceholder;
  });

  document.querySelectorAll('.route-day-price').forEach((node) => {
    node.placeholder = t.routeDayPricePlaceholder;
  });
}

async function onRouteFormSubmit(event) {
  event.preventDefault();
  updateRouteAvailabilityHint();
  const t = getT();
  const rows = Array.from(document.querySelectorAll('.route-day-row'));
  if (!rows.length) {
    showToast(t.routeGenerateFirst, 'error');
    return;
  }

  const startStr = getVal('routeStart');
  const endStr = getVal('routeEnd');
  if (endStr < startStr) {
    showToast(t.invalidDateRange, 'error');
    return;
  }
  if (isPastDate(startStr) || isPastDate(endStr)) {
    showToast(t.pastDateBlocked, 'error');
    return;
  }

  if (!getVal('routeClient').trim()) {
    showToast(t.routeClientRequired, 'error');
    document.getElementById('routeClient')?.focus();
    return;
  }

  const payload = collectRouteFormData(rows);

  for (const booking of payload.bookings) {
    if (booking.start_time && booking.end_time && booking.end_time < booking.start_time) {
      showToast(t.invalidTimeRange, 'error');
      return;
    }
    const conflictMessage = getBookingConflictMessage(booking);
    if (conflictMessage) {
      showToast(`${booking.date}: ${conflictMessage}`, 'error');
      return;
    }
  }

  payload.bookings.forEach((booking) => state.bookings.push(booking));
  saveFormDefaultsFromRoute(payload.defaults);
  const synced = await persistBookings();
  if (!synced) return;
  persistSettings();
  closeRouteModal();
  render();
  showToast(t.routeSaved, 'success');
}

function collectRouteFormData(rows) {
  const client = getVal('routeClient').trim();
  const groupSize = Number(getVal('routeGroupSize') || 0);
  const price = Number(getVal('routePrice') || 0);
  const currency = getVal('routeCurrency') || 'UZS';
  const notes = getVal('routeNotes').trim();
  const routePaymentStatus = getVal('routePaymentStatus') || 'unpaid';
  const routePaidAmount = Number(getVal('routePaidAmount') || 0);

  const rawBookings = rows.map((row) => {
    const rowPrice = Number(row.querySelector('.route-day-price')?.value || price || 0);
    return {
      id: generateId(),
      date: row.dataset.date,
      status: 'excursion',
      city: row.querySelector('.route-day-city')?.value.trim() || '',
      client_name: client,
      tour_name: row.querySelector('.route-day-tour')?.value.trim() || '',
      start_time: row.querySelector('.route-day-start')?.value || state.formDefaults.start_time || '09:00',
      end_time: row.querySelector('.route-day-end')?.value || state.formDefaults.end_time || '18:00',
      price: rowPrice,
      currency,
      group_size: groupSize,
      notes,
      payment_status: routePaymentStatus,
      paid_amount: 0
    };
  });

  const totalRoutePrice = rawBookings.reduce((sum, booking) => sum + toMoneyNumber(booking.price), 0);
  const normalizedRoutePaidAmount = normalizePaidAmount(totalRoutePrice, routePaymentStatus, routePaidAmount);
  const bookings = distributeRoutePaidAmounts(rawBookings, normalizedRoutePaidAmount, routePaymentStatus);

  return {
    bookings,
    defaults: {
      client_name: client,
      group_size: groupSize,
      currency,
      start_time: rows[0]?.querySelector('.route-day-start')?.value || state.formDefaults.start_time || '09:00',
      end_time: rows[0]?.querySelector('.route-day-end')?.value || state.formDefaults.end_time || '18:00'
    }
  };
}

function saveFormDefaultsFromBooking(booking) {
  if (booking.status !== 'excursion') return;
  state.formDefaults = {
    ...state.formDefaults,
    client_name: booking.client_name || state.formDefaults.client_name,
    currency: booking.currency || state.formDefaults.currency,
    group_size: booking.group_size || state.formDefaults.group_size,
    start_time: booking.start_time || state.formDefaults.start_time,
    end_time: booking.end_time || state.formDefaults.end_time
  };
}

function saveFormDefaultsFromRoute(defaults) {
  state.formDefaults = {
    ...state.formDefaults,
    ...defaults
  };
}

function openDetailModal(booking) {
  const modal = document.getElementById('detailModal');
  const body = document.getElementById('detailBody');
  if (!modal || !body) return;
  const t = getT();
  const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
  const noValue = t.details.noValue;
  const timeText = [booking.start_time, booking.end_time].filter(Boolean).join(' — ');
  const isFinished = isFinishedExcursion(booking);
  const statusText = isFinished ? `${getStatusLabel(booking.status)} • ${t.finishedLabel}` : getStatusLabel(booking.status);
  const statusStyle = isFinished
    ? 'background:#e5e7eb; color:#6b7280;'
    : `background:${conf.bg}; color:${conf.color};`;

  body.innerHTML = `
    <div class="detail-stack">
      <div class="detail-row"><span>${escapeHtml(t.details.date)}</span><strong>${escapeHtml(booking.date || noValue)}</strong></div>
      <div class="detail-row"><span>${escapeHtml(t.details.status)}</span><strong class="detail-status${isFinished ? ' finished-booking' : ''}" style="${statusStyle}">${escapeHtml(statusText)}</strong></div>
      ${booking.status === 'excursion' ? `
        <div class="detail-row"><span>${escapeHtml(t.details.city)}</span><strong>${escapeHtml(booking.city || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.client)}</span><strong>${escapeHtml(booking.client_name || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.tour)}</span><strong>${escapeHtml(booking.tour_name || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.time)}</span><strong>${escapeHtml(timeText || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.group)}</span><strong>${escapeHtml(String(booking.group_size || 0))}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.price)}</span><strong>${escapeHtml(formatCurrency(booking.price || 0, booking.currency || 'UZS'))}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.paymentLabel)}</span><strong><span class="payment-badge payment-badge-${escapeHtml(booking.payment_status||'unpaid')}">${escapeHtml((t.paymentStatus||{})[booking.payment_status||'unpaid']||'')}</span></strong></div>
        <div class="detail-row"><span>${escapeHtml(t.paidAmountLabel || '')}</span><strong>${escapeHtml(formatCurrency(getPaymentSplit(booking).paid, booking.currency || 'UZS'))}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.unpaidAmountLabel || '')}</span><strong>${escapeHtml(formatCurrency(getPaymentSplit(booking).unpaid, booking.currency || 'UZS'))}</strong></div>
      ` : ''}
      <div class="detail-notes">
        <span>${escapeHtml(t.details.notes)}</span>
        <p>${escapeHtml(booking.notes || noValue)}</p>
      </div>
    </div>
  `;

  const editBtn = document.getElementById('detailEditBtn');
  if (editBtn) {
    const pastBooking = isPastDate(booking.date || '');
    const canEditPastPayment = pastBooking && booking.status === 'excursion';
    editBtn.disabled = pastBooking && !canEditPastPayment;
    editBtn.title = canEditPastPayment ? (t.pastPaymentOnlyEdit || '') : (pastBooking ? t.pastEditBlocked : '');
    editBtn.innerHTML = `<i class="fas fa-pen"></i> ${escapeHtml(canEditPastPayment ? (t.detailEditPayment || t.detailEdit) : t.detailEdit)}`;
    editBtn.onclick = () => {
      if (pastBooking && !canEditPastPayment) {
        showToast(t.pastEditBlocked, 'error');
        return;
      }
      closeDetailModal();
      openBookingModal(booking, booking.date, 'edit');
    };
  }

  const duplicateBtn = document.getElementById('detailDuplicateBtn');
  if (duplicateBtn) {
    duplicateBtn.onclick = () => {
      closeDetailModal();
      openBookingModal({ ...booking, id: '' }, isPastDate(booking.date || '') ? getTodayDateString() : booking.date, 'duplicate');
      showToast(t.duplicateReady, 'info');
    };
  }

  modal.classList.add('active');
  updateBodyModalState();
}

function onDuplicateBookingClick() {
  const modal = document.getElementById('detailModal');
  if (!modal || !modal.classList.contains('active')) return;
}

// ─── Payment helpers ──────────────────────────────────────
function updatePaymentStatusLabels() {
  const t = getT();
  const sel = document.getElementById('bookingPaymentStatus');
  if (sel && t.paymentStatus) {
    Array.from(sel.options).forEach((opt) => {
      if (t.paymentStatus[opt.value]) opt.textContent = t.paymentStatus[opt.value];
    });
  }
  const rSel = document.getElementById('routePaymentStatus');
  if (rSel && t.paymentStatus) {
    Array.from(rSel.options).forEach((opt) => {
      if (t.paymentStatus[opt.value]) opt.textContent = t.paymentStatus[opt.value];
    });
  }
  const lbl = document.getElementById('lblPayment');
  if (lbl && t.paymentLabel) lbl.textContent = t.paymentLabel;
  const lbl2 = document.getElementById('lblRoutePayment');
  if (lbl2 && t.paymentLabel) lbl2.textContent = t.paymentLabel;
  const paidLbl = document.getElementById('lblPaidAmount');
  if (paidLbl && t.paidAmountLabel) paidLbl.textContent = t.paidAmountLabel;
  const unpaidLbl = document.getElementById('lblUnpaidAmount');
  if (unpaidLbl && t.unpaidAmountLabel) unpaidLbl.textContent = t.unpaidAmountLabel;
  const routePaidLbl = document.getElementById('lblRoutePaidAmount');
  if (routePaidLbl && t.paidAmountLabel) routePaidLbl.textContent = t.paidAmountLabel;
  const routeUnpaidLbl = document.getElementById('lblRouteUnpaidAmount');
  if (routeUnpaidLbl && t.unpaidAmountLabel) routeUnpaidLbl.textContent = t.unpaidAmountLabel;
  updatePaymentStatusSelect();
  const btn = document.getElementById('openStatsBtnLabel');
  if (btn && t.openStatsBtn) btn.textContent = t.openStatsBtn;
  const smt = document.getElementById('statsModalTitle');
  if (smt && t.statsModalTitle) smt.textContent = t.statsModalTitle;
}

function updatePaymentStatusSelect() {
  applyPaymentSelectStyle(document.getElementById('bookingPaymentStatus'));
  applyPaymentSelectStyle(document.getElementById('routePaymentStatus'));
  syncPaymentSplitFields('booking');
  syncPaymentSplitFields('route');
}

// ─── Stats Modal ─────────────────────────────────────────────
function getYearBookings(year) {
  return state.bookings.filter((b) => b.date.startsWith(String(year)));
}

function openStatsModal(year) {
  if (!requireAuth()) return;
  state.statsYear = year || state.currentYear;
  const modal = document.getElementById('statsModal');
  if (!modal) return;
  modal.classList.add('active');
  updateBodyModalState();
  renderStatsModal();
}

function closeStatsModal() {
  const modal = document.getElementById('statsModal');
  if (!modal) return;
  modal.classList.remove('active');
  updateBodyModalState();
}

function renderStatsModal() {
  const t = getT();
  const year = state.statsYear;
  const today = getTodayDateString();

  setTxt('statsModalYearLabel', t.statsYear + ': ' + year);

  const all = getYearBookings(year);
  const excursions      = all.filter((b) => b.status === 'excursion');
  const excCompleted    = excursions.filter((b) => b.date < today);
  const excPlanned      = excursions.filter((b) => b.date >= today);
  const busyAll         = all.filter((b) => b.status === 'busy');
  const busyCompleted   = busyAll.filter((b) => b.date < today);
  const busyPlanned     = busyAll.filter((b) => b.date >= today);
  const holidayAll      = all.filter((b) => b.status === 'holiday');
  const holCompleted    = holidayAll.filter((b) => b.date < today);
  const holPlanned      = holidayAll.filter((b) => b.date >= today);
  const touristsComp    = excCompleted.reduce((s, b) => s + (Number(b.group_size)||0), 0);
  const touristsPlan    = excPlanned.reduce((s, b) => s + (Number(b.group_size)||0), 0);

  const paidMap = {}, unpaidMap = {};
  excursions.forEach((b) => accumulateIncomeByPayment(b, paidMap, unpaidMap));

  const card = (icon, cls, label, comp, plan) =>
    '<div class="stats-detail-card">' +
      '<div class="sdc-header ' + cls + '">' +
        '<i class="fas ' + icon + '"></i><span>' + escapeHtml(label) + '</span>' +
        '<strong>' + (comp + plan) + '</strong>' +
      '</div>' +
      '<div class="sdc-row"><span><i class="fas fa-check-circle"></i> ' + escapeHtml(t.statsCompleted) + '</span><strong>' + comp + '</strong></div>' +
      '<div class="sdc-row sdc-planned"><span><i class="fas fa-clock"></i> ' + escapeHtml(t.statsPlanned) + '</span><strong>' + plan + '</strong></div>' +
    '</div>';

  const fmtGroup = (map, labelKey, cls) => {
    const entries = Object.entries(map);
    if (!entries.length) return '';
    return '<div class="sdc-income-group">' +
      '<div class="sdc-income-label ' + cls + '">' + escapeHtml(t[labelKey]) + '</div>' +
      entries.map(([cur, val]) => '<div class="sdc-income-amount ' + cls + '">' + formatCurrency(val, cur) + '</div>').join('') +
    '</div>';
  };

  const incomeHtml = (Object.keys(paidMap).length + Object.keys(unpaidMap).length)
    ? fmtGroup(paidMap,'incomePaid','income-paid') + fmtGroup(unpaidMap,'incomeUnpaid','income-unpaid')
    : '<div class="sdc-income-amount">0 UZS</div>';

  const monthlyBreakdownHtml =
    '<div class="stats-detail-card stats-monthly-card">' +
      '<div class="sdc-header sdc-slate"><i class="fas fa-calendar-days"></i><span>' + escapeHtml(t.statsMonthlyBreakdown || '') + '</span></div>' +
      '<div class="smb-note">' + escapeHtml(t.statsCompactCompletedPlanned || '') + '</div>' +
      '<div class="smb-table">' +
        '<div class="smb-head">' +
          '<div class="smb-month">' + escapeHtml(t.statsMonthLabel || '') + '</div>' +
          '<div class="smb-col">' + escapeHtml(t.statsSectionExcursions) + '</div>' +
          '<div class="smb-col">' + escapeHtml(t.statsSectionBusy) + '</div>' +
          '<div class="smb-col">' + escapeHtml(t.statsSectionHoliday) + '</div>' +
          '<div class="smb-col">' + escapeHtml(t.statsSectionTourists) + '</div>' +
          '<div class="smb-col">' + escapeHtml(t.statsSectionIncome) + '</div>' +
        '</div>' +
        buildMonthlyStatsRows(all, year, today, t) +
      '</div>' +
    '</div>';

  const body = document.getElementById('statsModalBody');
  if (!body) return;
  body.innerHTML =
    card('fa-map-marked-alt','sdc-blue',  t.statsSectionExcursions, excCompleted.length, excPlanned.length) +
    card('fa-ban',           'sdc-red',   t.statsSectionBusy,       busyCompleted.length,busyPlanned.length) +
    card('fa-umbrella-beach','sdc-green', t.statsSectionHoliday,    holCompleted.length, holPlanned.length) +
    card('fa-users',         'sdc-purple',t.statsSectionTourists,   touristsComp,        touristsPlan) +
    '<div class="stats-detail-card stats-income-card">' +
      '<div class="sdc-header sdc-gold"><i class="fas fa-wallet"></i><span>' + escapeHtml(t.statsSectionIncome) + '</span></div>' +
      '<div class="sdc-income-body">' + incomeHtml + '</div>' +
    '</div>' +
    monthlyBreakdownHtml;
}
// ─────────────────────────────────────────────────────────────

function closeDetailModal() {
  const modal = document.getElementById('detailModal');
  if (!modal) return;
  modal.classList.remove('active');
  updateBodyModalState();
}

function updateBodyModalState() {
  const isOpen = Array.from(document.querySelectorAll('.modal-backdrop')).some((node) => node.classList.contains('active'));
  document.body.classList.toggle('modal-open', isOpen);
}

function isCompactMobile() {
  return window.innerWidth <= 768;
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 220);
  }, 2400);
}

function formatCurrency(value, currency) {
  const locale = state.currentLang === 'en' ? 'en-US' : state.currentLang === 'uz' ? 'uz-UZ' : 'ru-RU';
  return `${Number(value || 0).toLocaleString(locale, { maximumFractionDigits: 0 })} ${currency || 'UZS'}`;
}

function toDateString(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function generateId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rnd = Math.random() * 16 | 0;
    const val = char === 'x' ? rnd : (rnd & 0x3 | 0x8);
    return val.toString(16);
  });
}

function safeClick(id, callback) {
  const node = document.getElementById(id);
  if (node) node.addEventListener('click', callback);
}

function safeSubmit(id, callback) {
  const node = document.getElementById(id);
  if (node) node.addEventListener('submit', callback);
}

function getVal(id) {
  return document.getElementById(id)?.value || '';
}

function setVal(id, value) {
  const node = document.getElementById(id);
  if (node) node.value = value;
}

function setTxt(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function setHtml(id, value) {
  const node = document.getElementById(id);
  if (node) node.innerHTML = value;
}

function setTxtBySelector(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function setPlaceholder(id, value) {
  const node = document.getElementById(id);
  if (node) node.placeholder = value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
