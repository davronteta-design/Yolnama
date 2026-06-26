/* ===================================================
   YOLNAMA — SPRINT 7 BRAND REFRESH
   Мобильный календарь, фильтры, дублирование, улучшенный UX
   =================================================== */

'use strict';

const SUPABASE_URL = 'https://whpzbpzvdewmfgyrnpqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocHpicHp2ZGV3bWZneXJucHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTc3OTEsImV4cCI6MjA5Njc3Mzc5MX0.76Gs4ckl9jFD3QcR1gLDn3cN1rbmDz7b6xcYf9AJabQ';

const STORAGE_KEYS = {
  demoMode: 'yolnama-demo-mode',
  lastTab: 'yolnama-active-tab',
  lastLang: 'yolnama-lang'
};

const TRANSLATIONS = {
  ru: {
    authBadge: 'Авторизация', authTitle: 'Войти / Регистрация', authText: 'Войдите через Email/пароль или Google. Если не хотите входить сейчас — откройте демо-режим и тестируйте календарь локально.', authHint: 'Если не хотите входить прямо сейчас, откройте календарь в демо-режиме — данные останутся только в браузере.',
    email: 'Email', password: 'Пароль', login: 'Войти', register: 'Регистрация', googleLogin: 'Войти через Google', logout: 'Выйти', loginRegister: 'Войти / Регистрация',
    brandSub: 'Операционная система для гидов и водителей', heroTitle: 'Yolnama — Операционная система для гидов и водителей', heroText: 'Современная CRM/PMS-система: календарь занятости, бронирование маршрутов, учёт доходов и аккуратная рабочая панель без визуального хаоса.',
    demoBtn: 'Попробовать демо-версию', point1: 'Календарь, маршруты и финансы в одном месте', point2: 'Демо-режим без обязательной регистрации', point3: 'Чистый интерфейс для ПК и мобильных устройств',
    featureCalendar: 'Календарь', featureCalendarText: 'Контроль экскурсий, занятых дней, выходных и личных слотов.', featureFinance: 'Доходы', featureFinanceText: 'Оплаты, суммы по валютам и понятная сводка по месяцам.', featureRoutes: 'Маршруты и отчёты', featureRoutesText: 'Многодневные поездки, быстрые формы и статистика по годам.', featureStats: 'Статистика',
    featuresBadge: 'Преимущества', featuresTitle: 'Профессиональный интерфейс как у CRM для бронирования', featuresText: 'Сначала пользователь видит чистую главную страницу, а полноценная рабочая панель открывается только после входа или запуска демо.',
    card1: 'Удобная сетка занятости без бесконечной простыни блоков и форм.', card2: 'Доходы, остатки оплат и прозрачный учёт по маршрутам и клиентам.', card3: 'Сводные показатели по месяцам и годам в одном окне.', card4: 'Многодневные поездки с автоматическим созданием дней маршрута.',
    footerText: 'Tourism PMS для гидов и водителей в Узбекистане', toLanding: 'На главную', menu: 'Меню', workspaceSub: 'Рабочая панель', demoMode: 'Демо-режим', demoActive: 'Демо-режим активен', demoActiveText: 'Можно тестировать календарь без входа. Данные сохраняются только в этом браузере.',
    navBadge: 'Навигация', sections: 'Разделы', tabCalendar: 'Календарь', tabRoutes: 'Мои маршруты', tabFinance: 'Финансы и отчёты', tabSettings: 'Настройки аккаунта',
    calendarHeading: 'Занятость и бронирование', calendarSub: 'Все формы открываются в модальных окнах, а календарь и статистика остаются чистыми и удобными.', reports: 'Отчёты', newRoute: 'Новый маршрут', newEntry: 'Новая запись', quickStats: 'Краткая статистика', filters: 'Фильтры', search: 'Поиск', status: 'Статус', resetFilters: 'Сбросить', legend: 'Обозначения', excursion: 'Экскурсия', busy: 'Занят', holiday: 'Выходной', personal: 'Личное', today: 'Сегодня', grid: 'Сетка', list: 'Список',
    routesHeading: 'Список маршрутов', routesSub: 'Здесь отображаются маршруты, созданные через форму многодневной брони.', financeHeading: 'Доходы и сводка', financeSub: 'Суммы автоматически считаются по всем экскурсионным записям в календаре.', settingsHeading: 'Настройки аккаунта', settingsSub: 'Войдите через Email/пароль или Google, чтобы использовать авторизацию. Без входа можно полноценно работать в демо-режиме.',
    date: 'Дата', city: 'Город', client: 'Заказчик', tourName: 'Экскурсия / группа', start: 'Начало', end: 'Окончание', tourists: 'Туристы', price: 'Стоимость', currency: 'Валюта', notes: 'Заметки', delete: 'Удалить', cancel: 'Отмена', save: 'Сохранить', startDate: 'Дата начала', endDate: 'Дата окончания', defaultPrice: 'Стоимость по умолчанию', routeDays: 'Дни маршрута', generateDays: 'Сгенерировать дни', saveRoute: 'Сохранить маршрут', details: 'Детали', dayInfo: 'Информация о дне', close: 'Закрыть', edit: 'Редактировать', yearStats: 'Годовая статистика', income: 'Доход',
    noEvents: 'На этот месяц записей нет.', noRoutes: 'Пока нет созданных маршрутов.', noFinance: 'Пока нет доходов для отображения.',
    demoOpened: 'Открыта демо-версия. Данные сохраняются только в этом браузере.', authUnavailable: 'Авторизация пока недоступна. Можно продолжить в демо-режиме.', enterEmailPassword: 'Введите email и пароль.', passwordMin: 'Пароль должен содержать минимум 6 символов.', loginSuccess: 'Вход выполнен успешно.', registerSuccess: 'Аккаунт создан и вход выполнен.', registerCheckEmail: 'Проверьте почту для подтверждения регистрации.', logoutSuccess: 'Вы вышли из аккаунта.', oauthStart: 'Перенаправляем на вход через Google…',
    bookingSaved: 'Запись сохранена.', bookingDeleted: 'Запись удалена.', routeGenerated: 'Дни маршрута сгенерированы.', routeSaved: 'Маршрут сохранён.', filtersReset: 'Фильтры сброшены.', noRouteDays: 'Сначала сгенерируйте дни маршрута.', invalidRouteDates: 'Дата окончания не может быть раньше даты начала.',
    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'], weekdays: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
  },
  en: {
    authBadge: 'Auth', authTitle: 'Login / Register', authText: 'Sign in with email/password or Google. If you do not want to sign in now, open demo mode and test the calendar locally.', authHint: 'If you do not want to sign in now, use demo mode — data will stay only in this browser.',
    email: 'Email', password: 'Password', login: 'Login', register: 'Register', googleLogin: 'Continue with Google', logout: 'Logout', loginRegister: 'Login / Register',
    brandSub: 'Operating system for guides and drivers', heroTitle: 'Yolnama — Operating system for guides and drivers', heroText: 'Modern CRM/PMS: availability calendar, route booking, income tracking and a clean workspace without visual chaos.',
    demoBtn: 'Try demo version', point1: 'Calendar, routes and finance in one place', point2: 'Demo mode without mandatory registration', point3: 'Clean interface for desktop and mobile',
    featureCalendar: 'Calendar', featureCalendarText: 'Manage tours, busy days, days off and personal slots.', featureFinance: 'Income', featureFinanceText: 'Payments, amounts by currency and clear monthly totals.', featureRoutes: 'Routes & reports', featureRoutesText: 'Multi-day trips, quick forms and yearly statistics.', featureStats: 'Statistics',
    featuresBadge: 'Benefits', featuresTitle: 'Professional booking CRM style interface', featuresText: 'The user first sees a clean landing page, and the full workspace opens only after login or demo start.',
    card1: 'Clean availability grid without endless stacked forms.', card2: 'Income, balances and transparent route/client accounting.', card3: 'Monthly and yearly summary metrics in one place.', card4: 'Multi-day trips with automatic route day generation.',
    footerText: 'Tourism PMS for guides and drivers in Uzbekistan', toLanding: 'Back to landing', menu: 'Menu', workspaceSub: 'Workspace', demoMode: 'Demo mode', demoActive: 'Demo mode enabled', demoActiveText: 'You can test the calendar without login. Data is stored only in this browser.',
    navBadge: 'Navigation', sections: 'Sections', tabCalendar: 'Calendar', tabRoutes: 'My routes', tabFinance: 'Finance & reports', tabSettings: 'Account settings',
    calendarHeading: 'Availability and booking', calendarSub: 'All forms open in modals, while calendar and stats stay clean and usable.', reports: 'Reports', newRoute: 'New route', newEntry: 'New entry', quickStats: 'Quick stats', filters: 'Filters', search: 'Search', status: 'Status', resetFilters: 'Reset', legend: 'Legend', excursion: 'Excursion', busy: 'Busy', holiday: 'Holiday', personal: 'Personal', today: 'Today', grid: 'Grid', list: 'List',
    routesHeading: 'Routes list', routesSub: 'Routes created via the multi-day booking form are shown here.', financeHeading: 'Income and summary', financeSub: 'Amounts are calculated automatically from excursion records.', settingsHeading: 'Account settings', settingsSub: 'Sign in with email/password or Google to use auth. Without login you can fully work in demo mode.',
    date: 'Date', city: 'City', client: 'Client', tourName: 'Tour / group', start: 'Start', end: 'End', tourists: 'Tourists', price: 'Price', currency: 'Currency', notes: 'Notes', delete: 'Delete', cancel: 'Cancel', save: 'Save', startDate: 'Start date', endDate: 'End date', defaultPrice: 'Default price', routeDays: 'Route days', generateDays: 'Generate days', saveRoute: 'Save route', details: 'Details', dayInfo: 'Day information', close: 'Close', edit: 'Edit', yearStats: 'Yearly statistics', income: 'Income',
    noEvents: 'No entries for this month yet.', noRoutes: 'No routes created yet.', noFinance: 'No income to display yet.',
    demoOpened: 'Demo version opened. Data is stored only in this browser.', authUnavailable: 'Authentication is unavailable now. You can continue in demo mode.', enterEmailPassword: 'Enter email and password.', passwordMin: 'Password must contain at least 6 characters.', loginSuccess: 'Signed in successfully.', registerSuccess: 'Account created and signed in.', registerCheckEmail: 'Check your email to confirm registration.', logoutSuccess: 'Signed out.', oauthStart: 'Redirecting to Google sign-in…',
    bookingSaved: 'Entry saved.', bookingDeleted: 'Entry deleted.', routeGenerated: 'Route days generated.', routeSaved: 'Route saved.', filtersReset: 'Filters reset.', noRouteDays: 'Generate route days first.', invalidRouteDates: 'End date cannot be earlier than start date.',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'], weekdays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  },
  uz: {
    authBadge: 'Kirish', authTitle: 'Kirish / Roʻyxatdan oʻtish', authText: 'Email/parol yoki Google orqali kiring. Hozircha kirmasangiz, demo rejimida kalendarni lokal sinab ko‘ring.', authHint: 'Hozir kirmasangiz ham bo‘ladi — demo rejimida ma’lumotlar faqat shu brauzerda qoladi.',
    email: 'Email', password: 'Parol', login: 'Kirish', register: 'Roʻyxatdan oʻtish', googleLogin: 'Google orqali kirish', logout: 'Chiqish', loginRegister: 'Kirish / Roʻyxatdan oʻtish',
    brandSub: 'Gidlar va haydovchilar uchun tizim', heroTitle: 'Yolnama — Gidlar va haydovchilar uchun tizim', heroText: 'Zamonaviy CRM/PMS: bandlik kalendari, yo‘nalish bronlari, daromad hisobi va tartibli ish paneli.',
    demoBtn: 'Demo versiyani sinash', point1: 'Kalendar, yo‘nalishlar va moliya bir joyda', point2: 'Majburiy ro‘yxatdan o‘tmasdan demo rejim', point3: 'Kompyuter va mobil uchun toza interfeys',
    featureCalendar: 'Kalendar', featureCalendarText: 'Ekskursiyalar, band kunlar, dam olish va shaxsiy slotlar nazorati.', featureFinance: 'Daromad', featureFinanceText: 'To‘lovlar, valyutalar bo‘yicha summalar va oylik natija.', featureRoutes: 'Yo‘nalishlar va hisobotlar', featureRoutesText: 'Ko‘p kunlik safarlar, tez formalar va yillik statistika.', featureStats: 'Statistika',
    featuresBadge: 'Afzalliklar', featuresTitle: 'Bron qilish CRM uslubidagi professional interfeys', featuresText: 'Foydalanuvchi avval toza landing sahifani ko‘radi, to‘liq ish maydoni esa faqat kirgandan yoki demo bosilgandan keyin ochiladi.',
    card1: 'Cheksiz blok va formalarsiz qulay bandlik setkasi.', card2: 'Daromad, qoldiq to‘lovlar va aniq hisob.', card3: 'Oylik va yillik ko‘rsatkichlar bitta oynada.', card4: 'Ko‘p kunlik safarlar uchun avtomatik kun yaratish.',
    footerText: 'Oʻzbekistondagi gidlar va haydovchilar uchun Tourism PMS', toLanding: 'Bosh sahifaga', menu: 'Menyu', workspaceSub: 'Ish paneli', demoMode: 'Demo rejim', demoActive: 'Demo rejim yoqilgan', demoActiveText: 'Kalendardan login qilmasdan foydalanishingiz mumkin. Ma’lumotlar faqat shu brauzerda saqlanadi.',
    navBadge: 'Navigatsiya', sections: 'Bo‘limlar', tabCalendar: 'Kalendar', tabRoutes: 'Yo‘nalishlarim', tabFinance: 'Moliya va hisobotlar', tabSettings: 'Hisob sozlamalari',
    calendarHeading: 'Bandlik va bronlash', calendarSub: 'Barcha formalar modal oynalarda ochiladi, kalendar va statistika esa toza ko‘rinishda qoladi.', reports: 'Hisobotlar', newRoute: 'Yangi yo‘nalish', newEntry: 'Yangi yozuv', quickStats: 'Qisqa statistika', filters: 'Filtrlar', search: 'Qidiruv', status: 'Holat', resetFilters: 'Tozalash', legend: 'Belgilar', excursion: 'Ekskursiya', busy: 'Band', holiday: 'Dam olish', personal: 'Shaxsiy', today: 'Bugun', grid: 'Setka', list: 'Roʻyxat',
    routesHeading: 'Yo‘nalishlar ro‘yxati', routesSub: 'Ko‘p kunlik forma orqali yaratilgan yo‘nalishlar shu yerda ko‘rinadi.', financeHeading: 'Daromad va umumiy ko‘rsatkichlar', financeSub: 'Summalar ekskursiya yozuvlari asosida avtomatik hisoblanadi.', settingsHeading: 'Hisob sozlamalari', settingsSub: 'Email/parol yoki Google orqali kiring. Login qilmasdan ham demo rejimida ishlashingiz mumkin.',
    date: 'Sana', city: 'Shahar', client: 'Mijoz', tourName: 'Ekskursiya / guruh', start: 'Boshlanish', end: 'Tugash', tourists: 'Turistlar', price: 'Narx', currency: 'Valyuta', notes: 'Izoh', delete: 'O‘chirish', cancel: 'Bekor qilish', save: 'Saqlash', startDate: 'Boshlanish sanasi', endDate: 'Tugash sanasi', defaultPrice: 'Standart narx', routeDays: 'Yo‘nalish kunlari', generateDays: 'Kunlarni yaratish', saveRoute: 'Yo‘nalishni saqlash', details: 'Tafsilotlar', dayInfo: 'Kun haqida ma’lumot', close: 'Yopish', edit: 'Tahrirlash', yearStats: 'Yillik statistika', income: 'Daromad',
    noEvents: 'Bu oy uchun yozuvlar yo‘q.', noRoutes: 'Hozircha yo‘nalishlar yaratilmagan.', noFinance: 'Ko‘rsatish uchun daromad yo‘q.',
    demoOpened: 'Demo versiya ochildi. Ma’lumotlar faqat shu brauzerda saqlanadi.', authUnavailable: 'Autentifikatsiya hozircha mavjud emas. Demo rejimda davom etishingiz mumkin.', enterEmailPassword: 'Email va parolni kiriting.', passwordMin: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak.', loginSuccess: 'Muvaffaqiyatli kirdingiz.', registerSuccess: 'Hisob yaratildi va kirish bajarildi.', registerCheckEmail: 'Roʻyxatdan oʻtishni tasdiqlash uchun emailingizni tekshiring.', logoutSuccess: 'Hisobdan chiqildi.', oauthStart: 'Google orqali kirishga yo‘naltirilmoqda…',
    bookingSaved: 'Yozuv saqlandi.', bookingDeleted: 'Yozuv o‘chirildi.', routeGenerated: 'Yo‘nalish kunlari yaratildi.', routeSaved: 'Yo‘nalish saqlandi.', filtersReset: 'Filtrlar tozalandi.', noRouteDays: 'Avval yo‘nalish kunlarini yarating.', invalidRouteDates: 'Tugash sanasi boshlanish sanasidan oldin bo‘lishi mumkin emas.',
    months: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'], weekdays: ['Du','Se','Cho','Pa','Ju','Sha','Yak']
  }
};

const STATUS_CONFIG = {
  excursion: { color: '#2563eb', bg: '#dbeafe', labelKey: 'excursion' },
  busy: { color: '#dc2626', bg: '#fee2e2', labelKey: 'busy' },
  holiday: { color: '#16a34a', bg: '#dcfce7', labelKey: 'holiday' },
  personal: { color: '#ea580c', bg: '#ffedd5', labelKey: 'personal' }
};

const body = document.body;
const $ = (id) => document.getElementById(id);

const elements = {
  landingPage: $('landingPage'), appWorkspace: $('appWorkspace'), toastContainer: $('toastContainer'), authModal: $('authModal'), routeModal: $('routeModal'), bookingModal: $('bookingModal'), detailModal: $('detailModal'), statsModal: $('statsModal'), mobileSidebarBackdrop: $('mobileSidebarBackdrop'),
  openAuthBtn: $('openAuthBtn'), heroLoginBtn: $('heroLoginBtn'), workspaceAuthBtn: $('workspaceAuthBtn'), settingsLoginBtn: $('settingsLoginBtn'), closeAuthModal: $('closeAuthModal'), authForm: $('authForm'), authEmail: $('authEmail'), authPassword: $('authPassword'), loginBtn: $('loginBtn'), registerBtn: $('registerBtn'), googleAuthBtn: $('googleAuthBtn'),
  demoEnterBtn: $('demoEnterBtn'), backToLandingBtn: $('backToLandingBtn'), logoutBtn: $('logoutBtn'), settingsLogoutBtn: $('settingsLogoutBtn'), userBadge: $('userBadge'), profileName: $('profileName'), profileStatus: $('profileStatus'), profileAvatarImage: $('profileAvatarImage'), profileAvatarFallback: $('profileAvatarFallback'), demoModeNote: $('demoModeNote'), settingsAvatar: $('settingsAvatar'), settingsUserName: $('settingsUserName'), settingsUserEmail: $('settingsUserEmail'), settingsAuthDescription: $('settingsAuthDescription'),
  openMobileSidebar: $('openMobileSidebar'), closeMobileSidebar: $('closeMobileSidebar'),
  openBookingBtn: $('openBookingBtn'), openRouteBtn: $('openRouteBtn'), openStatsBtn: $('openStatsBtn'),
  prevMonthBtn: $('prevMonthBtn'), nextMonthBtn: $('nextMonthBtn'), todayBtn: $('todayBtn'), viewGridBtn: $('viewGridBtn'), viewListBtn: $('viewListBtn'), currentMonthLabel: $('currentMonthLabel'), weekdaysHeader: $('weekdaysHeader'), calendarGrid: $('calendarGrid'), listContainer: $('list-view-container'), gridView: $('calendar-grid-view'), listView: $('calendar-list-view'),
  searchInput: $('searchInput'), statusFilter: $('statusFilter'), resetFiltersBtn: $('resetFiltersBtn'),
  statExcursions: $('statExcursions'), statBusy: $('statBusy'), statTourists: $('statTourists'), statIncome: $('statIncome'), routesList: $('routesList'), financeSummary: $('financeSummary'), financeList: $('financeList'),
  bookingForm: $('bookingForm'), bookingId: $('bookingId'), bookingDate: $('bookingDate'), bookingStatus: $('bookingStatus'), bookingCity: $('bookingCity'), bookingClient: $('bookingClient'), bookingTour: $('bookingTour'), bookingStart: $('bookingStart'), bookingEnd: $('bookingEnd'), bookingGroup: $('bookingGroup'), bookingPrice: $('bookingPrice'), bookingCurrency: $('bookingCurrency'), bookingNotes: $('bookingNotes'), bookingModalTitle: $('bookingModalTitle'), conditionalFields: $('conditionalFields'), deleteBookingBtn: $('deleteBookingBtn'), saveBookingBtn: $('saveBookingBtn'),
  routeForm: $('routeForm'), routeStart: $('routeStart'), routeEnd: $('routeEnd'), routeClient: $('routeClient'), routeGroupSize: $('routeGroupSize'), routePrice: $('routePrice'), routeCurrency: $('routeCurrency'), routeNotes: $('routeNotes'), routeDaysContainer: $('routeDaysContainer'), btnGenerateRouteDays: $('btnGenerateRouteDays'),
  detailBody: $('detailBody'), detailEditBtn: $('detailEditBtn'), statsModalBody: $('statsModalBody'),
  langSelect: $('langSelect')
};

const state = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  currentView: 'grid',
  currentLang: localStorage.getItem(STORAGE_KEYS.lastLang) || 'ru',
  activeTab: localStorage.getItem(STORAGE_KEYS.lastTab) || 'calendarTab',
  filters: { search: '', status: 'all' },
  bookings: [],
  authReady: false,
  authBusy: false,
  user: null,
  demo: false,
  selectedBookingId: ''
};

let supabaseClient = null;

function t() {
  return TRANSLATIONS[state.currentLang] || TRANSLATIONS.ru;
}

function storageKey() {
  if (state.user?.id) return `yolnama-bookings-user-${state.user.id}`;
  if (state.user?.email) return `yolnama-bookings-email-${state.user.email}`;
  return 'yolnama-bookings-demo';
}

function formatCurrency(amount, currency) {
  const value = Number(amount || 0);
  return new Intl.NumberFormat(state.currentLang === 'ru' ? 'ru-RU' : 'en-US', {
    style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0
  }).format(value);
}

function toDateString(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function showToast(message, type = 'info') {
  const iconMap = { info: 'fa-circle-info', success: 'fa-circle-check', error: 'fa-circle-xmark' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${iconMap[type] || iconMap.info}"></i><span>${message}</span>`;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function setBodyScrollLock(locked) {
  body.classList.toggle('no-scroll', locked);
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  setBodyScrollLock(true);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal-backdrop.is-open') && !elements.mobileSidebarBackdrop.classList.contains('is-open')) {
    setBodyScrollLock(false);
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop.is-open').forEach(closeModal);
}

function openDrawer() {
  elements.mobileSidebarBackdrop.classList.add('is-open');
  elements.mobileSidebarBackdrop.setAttribute('aria-hidden', 'false');
  setBodyScrollLock(true);
}

function closeDrawer() {
  elements.mobileSidebarBackdrop.classList.remove('is-open');
  elements.mobileSidebarBackdrop.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal-backdrop.is-open')) setBodyScrollLock(false);
}

function getUserInitial(text) {
  return (String(text || 'Y').trim().charAt(0) || 'Y').toUpperCase();
}

function getUserDisplayName(user) {
  const md = user?.user_metadata || {};
  return md.full_name || md.name || md.user_name || (user?.email ? user.email.split('@')[0] : 'User');
}

function getAvatarUrl(user) {
  const md = user?.user_metadata || {};
  return md.avatar_url || md.picture || md.photo_url || '';
}

function setUserBadge(label, avatarUrl = '', iconClass = 'fa-user') {
  const media = avatarUrl ? `<img class="user-badge-avatar" src="${avatarUrl}" alt="avatar">` : `<i class="fas ${iconClass}"></i>`;
  elements.userBadge.innerHTML = `${media}<span>${label}</span>`;
}

function updateAvatarUI(user, demo = false) {
  const avatarUrl = demo ? '' : getAvatarUrl(user);
  const initial = getUserInitial(demo ? 'Demo' : getUserDisplayName(user));
  if (avatarUrl) {
    elements.profileAvatarImage.src = avatarUrl;
    elements.profileAvatarImage.hidden = false;
    elements.profileAvatarFallback.hidden = true;
    elements.settingsAvatar.style.backgroundImage = `url(${avatarUrl})`;
    elements.settingsAvatar.style.backgroundSize = 'cover';
    elements.settingsAvatar.style.backgroundPosition = 'center';
    elements.settingsAvatar.textContent = '';
  } else {
    elements.profileAvatarImage.removeAttribute('src');
    elements.profileAvatarImage.hidden = true;
    elements.profileAvatarFallback.hidden = false;
    elements.profileAvatarFallback.textContent = initial;
    elements.settingsAvatar.style.backgroundImage = '';
    elements.settingsAvatar.textContent = initial;
  }
}

function showLanding() {
  elements.appWorkspace.classList.add('hidden');
  elements.landingPage.classList.remove('hidden');
  body.dataset.view = 'landing';
  closeDrawer();
  closeAllModals();
}

function showWorkspace() {
  elements.landingPage.classList.add('hidden');
  elements.appWorkspace.classList.remove('hidden');
  body.dataset.view = 'workspace';
}

function persistBookings() {
  localStorage.setItem(storageKey(), JSON.stringify(state.bookings));
}

function loadBookings() {
  try {
    const raw = localStorage.getItem(storageKey());
    state.bookings = raw ? JSON.parse(raw) : [];
  } catch {
    state.bookings = [];
  }
}

function applyDemoMode() {
  state.user = null;
  state.demo = true;
  sessionStorage.setItem(STORAGE_KEYS.demoMode, '1');
  body.dataset.authMode = 'demo';
  showWorkspace();
  setUserBadge(t().demoMode, '', 'fa-flask');
  elements.profileName.textContent = 'Demo User';
  elements.profileStatus.textContent = 'demo@yolnama.com';
  elements.settingsUserName.textContent = 'Demo User';
  elements.settingsUserEmail.textContent = 'demo@yolnama.com';
  elements.settingsAuthDescription.textContent = t().demoActiveText;
  elements.workspaceAuthBtn.classList.remove('hidden');
  elements.logoutBtn.classList.add('hidden');
  elements.settingsLoginBtn.classList.remove('hidden');
  elements.settingsLogoutBtn.classList.add('hidden');
  updateAvatarUI(null, true);
  loadBookings();
  renderAll();
}

function applyAuthenticatedUser(user) {
  state.user = user;
  state.demo = false;
  sessionStorage.removeItem(STORAGE_KEYS.demoMode);
  body.dataset.authMode = 'authenticated';
  showWorkspace();
  const email = user?.email || 'user@yolnama.com';
  const name = getUserDisplayName(user);
  setUserBadge(email, getAvatarUrl(user), 'fa-circle-check');
  elements.profileName.textContent = name;
  elements.profileStatus.textContent = email;
  elements.settingsUserName.textContent = name;
  elements.settingsUserEmail.textContent = email;
  elements.settingsAuthDescription.textContent = t().settingsSub;
  elements.workspaceAuthBtn.classList.add('hidden');
  elements.logoutBtn.classList.remove('hidden');
  elements.settingsLoginBtn.classList.add('hidden');
  elements.settingsLogoutBtn.classList.remove('hidden');
  updateAvatarUI(user, false);
  loadBookings();
  renderAll();
}

function resetToGuest() {
  state.user = null;
  state.demo = false;
  body.dataset.authMode = 'guest';
  showLanding();
  setUserBadge('Guest', '', 'fa-user');
  elements.profileName.textContent = 'Guest';
  elements.profileStatus.textContent = '—';
  elements.workspaceAuthBtn.classList.remove('hidden');
  elements.logoutBtn.classList.add('hidden');
  elements.settingsLoginBtn.classList.remove('hidden');
  elements.settingsLogoutBtn.classList.add('hidden');
  updateAvatarUI(null, true);
}

function getReadableError(error, fallback) {
  const message = String(error?.message || '').trim();
  return message || fallback;
}

function setAuthBusy(flag) {
  state.authBusy = Boolean(flag);
  [elements.loginBtn, elements.registerBtn, elements.googleAuthBtn, elements.logoutBtn, elements.settingsLogoutBtn].forEach((button) => {
    if (button) button.disabled = state.authBusy || !state.authReady;
  });
  [elements.authEmail, elements.authPassword].forEach((field) => {
    if (field) field.disabled = state.authBusy || !state.authReady;
  });
}

async function initSupabase() {
  if (!window.supabase?.createClient) {
    state.authReady = true;
    setAuthBusy(false);
    return;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (data?.session?.user) {
      applyAuthenticatedUser(data.session.user);
    } else if (sessionStorage.getItem(STORAGE_KEYS.demoMode) === '1') {
      applyDemoMode();
    } else {
      resetToGuest();
    }
  } catch (error) {
    showToast(getReadableError(error, t().authUnavailable), 'error');
    if (sessionStorage.getItem(STORAGE_KEYS.demoMode) === '1') applyDemoMode();
  } finally {
    state.authReady = true;
    setAuthBusy(false);
  }

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => {
      if (session?.user) {
        applyAuthenticatedUser(session.user);
        closeModal(elements.authModal);
      }
    }, 0);
  });
}

async function onAuthLoginSubmit(event) {
  event.preventDefault();
  if (!supabaseClient || !state.authReady) {
    showToast(t().authUnavailable, 'error');
    return;
  }
  const email = elements.authEmail.value.trim().toLowerCase();
  const password = elements.authPassword.value;
  if (!email || !password) {
    showToast(t().enterEmailPassword, 'error');
    return;
  }
  setAuthBusy(true);
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    showToast(t().loginSuccess, 'success');
  } catch (error) {
    showToast(getReadableError(error, t().authUnavailable), 'error');
  } finally {
    setAuthBusy(false);
  }
}

async function onRegisterClick() {
  if (!supabaseClient || !state.authReady) {
    showToast(t().authUnavailable, 'error');
    return;
  }
  const email = elements.authEmail.value.trim().toLowerCase();
  const password = elements.authPassword.value;
  if (!email || !password) {
    showToast(t().enterEmailPassword, 'error');
    return;
  }
  if (password.length < 6) {
    showToast(t().passwordMin, 'error');
    return;
  }
  setAuthBusy(true);
  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password, options: { redirectTo: `${window.location.origin}${window.location.pathname}` } });
    if (error) throw error;
    if (data?.session?.user) {
      applyAuthenticatedUser(data.session.user);
      closeModal(elements.authModal);
      showToast(t().registerSuccess, 'success');
    } else {
      showToast(t().registerCheckEmail, 'info');
    }
  } catch (error) {
    showToast(getReadableError(error, t().authUnavailable), 'error');
  } finally {
    setAuthBusy(false);
  }
}

async function onGoogleAuthClick() {
  if (!supabaseClient || !state.authReady) {
    showToast(t().authUnavailable, 'error');
    return;
  }
  setAuthBusy(true);
  try {
    showToast(t().oauthStart, 'info');
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}${window.location.pathname}` } });
    if (error) throw error;
  } catch (error) {
    showToast(getReadableError(error, t().authUnavailable), 'error');
    setAuthBusy(false);
  }
}

async function onLogoutClick() {
  if (supabaseClient && state.user) {
    setAuthBusy(true);
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (error) {
      showToast(getReadableError(error, t().logoutSuccess), 'error');
    } finally {
      setAuthBusy(false);
    }
  }
  applyDemoMode();
  showToast(t().logoutSuccess, 'success');
}

function filteredBookings() {
  const q = state.filters.search.trim().toLowerCase();
  return state.bookings.filter((b) => {
    const statusOk = state.filters.status === 'all' || b.status === state.filters.status;
    const searchOk = !q || [b.city, b.client_name, b.tour_name, b.notes].join(' ').toLowerCase().includes(q);
    return statusOk && searchOk;
  });
}

function monthlyBookings(includeFilters = false) {
  const prefix = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
  const source = includeFilters ? filteredBookings() : state.bookings;
  return source.filter((b) => b.date && b.date.startsWith(prefix));
}

function renderStats() {
  const month = monthlyBookings();
  const excursions = month.filter((b) => b.status === 'excursion');
  const busy = month.filter((b) => b.status === 'busy').length;
  const tourists = excursions.reduce((sum, b) => sum + (Number(b.group_size) || 0), 0);
  const incomeByCurrency = {};
  excursions.forEach((b) => {
    const cur = b.currency || 'USD';
    incomeByCurrency[cur] = (incomeByCurrency[cur] || 0) + (Number(b.price) || 0);
  });
  elements.statExcursions.textContent = String(excursions.length);
  elements.statBusy.textContent = String(busy);
  elements.statTourists.textContent = String(tourists);
  const firstCurrency = Object.keys(incomeByCurrency)[0];
  elements.statIncome.textContent = firstCurrency ? formatCurrency(incomeByCurrency[firstCurrency], firstCurrency) : '0';
}

function renderGrid() {
  const tr = t();
  elements.weekdaysHeader.innerHTML = tr.weekdays.map((day) => `<div>${day}</div>`).join('');
  elements.calendarGrid.innerHTML = '';

  const firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
  const prevDaysInMonth = new Date(state.currentYear, state.currentMonth, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const todayStr = toDateString(new Date());
  const filtered = filteredBookings();

  for (let i = 0; i < totalCells; i++) {
    let dayNum;
    let month = state.currentMonth;
    let year = state.currentYear;
    let currentMonth = true;

    if (i < startOffset) {
      dayNum = prevDaysInMonth - startOffset + i + 1;
      month = state.currentMonth === 0 ? 11 : state.currentMonth - 1;
      year = state.currentMonth === 0 ? state.currentYear - 1 : state.currentYear;
      currentMonth = false;
    } else if (i >= startOffset + daysInMonth) {
      dayNum = i - startOffset - daysInMonth + 1;
      month = state.currentMonth === 11 ? 0 : state.currentMonth + 1;
      year = state.currentMonth === 11 ? state.currentYear + 1 : state.currentYear;
      currentMonth = false;
    } else {
      dayNum = i - startOffset + 1;
    }

    const cellDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `calendar-day${currentMonth ? '' : ' muted'}${cellDate === todayStr ? ' today' : ''}`;
    const dayEvents = filtered.filter((b) => b.date === cellDate).map((booking) => {
      const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
      const label = booking.status === 'excursion' ? (booking.city ? `${booking.city} • ` : '') + (booking.tour_name || tr.excursion) : tr[conf.labelKey];
      return `<span class="event-pill event-${booking.status}" data-booking-id="${booking.id}">${escapeHtml(label)}</span>`;
    }).join('');
    button.innerHTML = `<span class="day-number">${dayNum}</span><div class="day-events">${dayEvents}</div>`;
    button.addEventListener('click', () => openBookingModal(null, cellDate));
    elements.calendarGrid.appendChild(button);
  }

  elements.calendarGrid.querySelectorAll('[data-booking-id]').forEach((pill) => {
    pill.addEventListener('click', (event) => {
      event.stopPropagation();
      openDetailModal(pill.dataset.bookingId);
    });
  });
}

function renderList() {
  const tr = t();
  const month = monthlyBookings(true);
  elements.listContainer.innerHTML = '';
  if (!month.length) {
    elements.listContainer.innerHTML = `<div class="route-card">${tr.noEvents}</div>`;
    return;
  }
  month.sort((a, b) => a.date.localeCompare(b.date));
  month.forEach((booking) => {
    const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(booking.date)} — ${escapeHtml(booking.status === 'excursion' ? (booking.tour_name || tr.excursion) : tr[conf.labelKey])}</strong>
        <div class="list-item-meta">${escapeHtml(booking.city || '')} ${booking.client_name ? '• ' + escapeHtml(booking.client_name) : ''} ${booking.price ? '• ' + escapeHtml(formatCurrency(booking.price, booking.currency)) : ''}</div>
      </div>
      <span class="event-pill event-${booking.status}">${escapeHtml(tr[conf.labelKey])}</span>`;
    item.addEventListener('click', () => openDetailModal(booking.id));
    elements.listContainer.appendChild(item);
  });
}

function renderRoutesTab() {
  const tr = t();
  const routes = new Map();
  state.bookings.filter((b) => b.route_id).forEach((booking) => {
    if (!routes.has(booking.route_id)) routes.set(booking.route_id, []);
    routes.get(booking.route_id).push(booking);
  });
  elements.routesList.innerHTML = '';
  if (!routes.size) {
    elements.routesList.innerHTML = `<div class="route-card">${tr.noRoutes}</div>`;
    return;
  }
  Array.from(routes.entries()).forEach(([, items]) => {
    items.sort((a, b) => a.date.localeCompare(b.date));
    const first = items[0];
    const total = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const card = document.createElement('div');
    card.className = 'route-card';
    card.innerHTML = `
      <div class="route-card-head">
        <div>
          <strong>${escapeHtml(first.client_name || 'Route')}</strong>
          <div class="list-item-meta">${escapeHtml(items[0].date)} → ${escapeHtml(items[items.length - 1].date)} • ${items.length} ${tr.routeDays.toLowerCase()}</div>
        </div>
        <strong>${escapeHtml(formatCurrency(total, first.currency || 'USD'))}</strong>
      </div>
      <div class="route-days-list">${items.map((item) => `<div class="route-day-item"><strong>${escapeHtml(item.date)}</strong> — ${escapeHtml(item.city || '')}${item.tour_name ? ' • ' + escapeHtml(item.tour_name) : ''}</div>`).join('')}</div>`;
    elements.routesList.appendChild(card);
  });
}

function renderFinanceTab() {
  const tr = t();
  const excursions = state.bookings.filter((b) => b.status === 'excursion');
  const totals = {};
  excursions.forEach((b) => {
    const cur = b.currency || 'USD';
    totals[cur] = (totals[cur] || 0) + (Number(b.price) || 0);
  });
  elements.financeSummary.innerHTML = '';
  elements.financeList.innerHTML = '';
  const currencies = Object.keys(totals);
  if (!currencies.length) {
    elements.financeList.innerHTML = `<div class="route-card">${tr.noFinance}</div>`;
    return;
  }
  currencies.forEach((cur) => {
    const pill = document.createElement('div');
    pill.className = 'finance-pill';
    pill.innerHTML = `<span>${tr.income} ${cur}</span><strong>${escapeHtml(formatCurrency(totals[cur], cur))}</strong>`;
    elements.financeSummary.appendChild(pill);
  });
  excursions.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12).forEach((booking) => {
    const div = document.createElement('div');
    div.className = 'finance-entry';
    div.innerHTML = `<div class="finance-entry-head"><strong>${escapeHtml(booking.tour_name || booking.client_name || tr.excursion)}</strong><strong>${escapeHtml(formatCurrency(booking.price, booking.currency || 'USD'))}</strong></div><div class="list-item-meta">${escapeHtml(booking.date)} ${booking.city ? '• ' + escapeHtml(booking.city) : ''}</div>`;
    elements.financeList.appendChild(div);
  });
}

function renderStatsModal() {
  const yearPrefix = `${state.currentYear}-`;
  const yearItems = state.bookings.filter((b) => b.date && b.date.startsWith(yearPrefix));
  const excursions = yearItems.filter((b) => b.status === 'excursion');
  const busy = yearItems.filter((b) => b.status === 'busy').length;
  const tourists = excursions.reduce((sum, b) => sum + (Number(b.group_size) || 0), 0);
  const totalIncome = excursions.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  const baseCurrency = excursions[0]?.currency || 'USD';

  const monthly = Array.from({ length: 12 }, (_, index) => {
    const prefix = `${state.currentYear}-${String(index + 1).padStart(2, '0')}`;
    const items = state.bookings.filter((b) => b.date && b.date.startsWith(prefix));
    const ex = items.filter((b) => b.status === 'excursion');
    return {
      month: t().months[index],
      excursions: ex.length,
      busy: items.filter((b) => b.status === 'busy').length,
      tourists: ex.reduce((sum, b) => sum + (Number(b.group_size) || 0), 0),
      income: ex.reduce((sum, b) => sum + (Number(b.price) || 0), 0)
    };
  });

  elements.statsModalBody.innerHTML = `
    <div class="stats-grid">
      <div class="stats-card"><span>${escapeHtml(t().excursion)}</span><strong>${excursions.length}</strong></div>
      <div class="stats-card"><span>${escapeHtml(t().busy)}</span><strong>${busy}</strong></div>
      <div class="stats-card"><span>${escapeHtml(t().tourists)}</span><strong>${tourists}</strong></div>
      <div class="stats-card"><span>${escapeHtml(t().income)}</span><strong>${escapeHtml(formatCurrency(totalIncome, baseCurrency))}</strong></div>
    </div>
    <table class="stats-table">
      <thead><tr><th>${escapeHtml(t().date)}</th><th>${escapeHtml(t().excursion)}</th><th>${escapeHtml(t().busy)}</th><th>${escapeHtml(t().tourists)}</th><th>${escapeHtml(t().income)}</th></tr></thead>
      <tbody>
        ${monthly.map((row) => `<tr><td>${escapeHtml(row.month)}</td><td>${row.excursions}</td><td>${row.busy}</td><td>${row.tourists}</td><td>${escapeHtml(formatCurrency(row.income, baseCurrency))}</td></tr>`).join('')}
      </tbody>
    </table>`;
}

function render() {
  elements.currentMonthLabel.textContent = `${t().months[state.currentMonth]} ${state.currentYear}`;
  elements.viewGridBtn.classList.toggle('active', state.currentView === 'grid');
  elements.viewListBtn.classList.toggle('active', state.currentView === 'list');
  elements.gridView.classList.toggle('hidden', state.currentView !== 'grid');
  elements.listView.classList.toggle('hidden', state.currentView !== 'list');
  renderStats();
  renderGrid();
  renderList();
  renderRoutesTab();
  renderFinanceTab();
}

function renderAll() {
  updateStaticTranslations();
  render();
}

function updateStaticTranslations() {
  const tr = t();
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (tr[key]) node.textContent = tr[key];
  });
  elements.searchInput.placeholder = state.currentLang === 'en' ? 'Samarkand, client, tour' : state.currentLang === 'uz' ? 'Samarqand, mijoz, tur' : 'Самарканд, клиент, тур';
  document.querySelectorAll('#bookingStatus option').forEach((opt) => { opt.textContent = tr[opt.value]; });
  const statusOptions = elements.statusFilter.options;
  statusOptions[0].textContent = state.currentLang === 'en' ? 'All' : state.currentLang === 'uz' ? 'Barchasi' : 'Все';
  statusOptions[1].textContent = tr.excursion;
  statusOptions[2].textContent = tr.busy;
  statusOptions[3].textContent = tr.holiday;
  statusOptions[4].textContent = tr.personal;
}

function changeMonth(step) {
  state.currentMonth += step;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear += 1;
  } else if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear -= 1;
  }
  render();
}

function openBookingModal(id = null, defaultDate = '') {
  if (id) {
    const booking = state.bookings.find((item) => item.id === id);
    if (!booking) return;
    elements.bookingModalTitle.textContent = t().edit;
    elements.bookingId.value = booking.id;
    elements.bookingDate.value = booking.date;
    elements.bookingStatus.value = booking.status;
    elements.bookingCity.value = booking.city || '';
    elements.bookingClient.value = booking.client_name || '';
    elements.bookingTour.value = booking.tour_name || '';
    elements.bookingStart.value = booking.start_time || '09:00';
    elements.bookingEnd.value = booking.end_time || '18:00';
    elements.bookingGroup.value = booking.group_size || '';
    elements.bookingPrice.value = booking.price || '';
    elements.bookingCurrency.value = booking.currency || 'USD';
    elements.bookingNotes.value = booking.notes || '';
    elements.deleteBookingBtn.classList.remove('hidden');
  } else {
    elements.bookingForm.reset();
    elements.bookingModalTitle.textContent = t().newEntry;
    elements.bookingId.value = '';
    elements.bookingDate.value = defaultDate || toDateString(new Date());
    elements.bookingStatus.value = 'excursion';
    elements.bookingStart.value = '09:00';
    elements.bookingEnd.value = '18:00';
    elements.bookingCurrency.value = 'USD';
    elements.deleteBookingBtn.classList.add('hidden');
  }
  toggleConditionalFields(elements.bookingStatus.value);
  openModal(elements.bookingModal);
}

function toggleConditionalFields(status) {
  elements.conditionalFields.classList.toggle('hidden', status !== 'excursion');
}

function onBookingSubmit(event) {
  event.preventDefault();
  const id = elements.bookingId.value || `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const status = elements.bookingStatus.value;
  const record = {
    id,
    date: elements.bookingDate.value,
    status,
    city: elements.bookingCity.value.trim(),
    client_name: elements.bookingClient.value.trim(),
    tour_name: elements.bookingTour.value.trim(),
    start_time: elements.bookingStart.value,
    end_time: elements.bookingEnd.value,
    group_size: Number(elements.bookingGroup.value) || 0,
    price: Number(elements.bookingPrice.value) || 0,
    currency: elements.bookingCurrency.value || 'USD',
    notes: elements.bookingNotes.value.trim(),
    route_id: ''
  };
  const index = state.bookings.findIndex((item) => item.id === id);
  if (index >= 0) state.bookings[index] = { ...state.bookings[index], ...record };
  else state.bookings.push(record);
  persistBookings();
  closeModal(elements.bookingModal);
  render();
  showToast(t().bookingSaved, 'success');
}

function onDeleteBooking() {
  const id = elements.bookingId.value;
  if (!id) return;
  state.bookings = state.bookings.filter((item) => item.id !== id);
  persistBookings();
  closeModal(elements.bookingModal);
  render();
  showToast(t().bookingDeleted, 'success');
}

function generateRouteDaysRows() {
  const start = elements.routeStart.value;
  const end = elements.routeEnd.value;
  if (!start || !end) return;
  if (end < start) {
    showToast(t().invalidRouteDates, 'error');
    return;
  }
  const rows = [];
  let current = new Date(start);
  const finish = new Date(end);
  while (current <= finish) {
    const value = toDateString(current);
    rows.push(`
      <div class="route-day-row" data-date="${value}">
        <div class="route-day-date">${escapeHtml(value)}</div>
        <input class="route-day-city" type="text" placeholder="${escapeHtml(t().city)}" />
        <input class="route-day-tour" type="text" placeholder="${escapeHtml(t().tourName)}" />
        <input class="route-day-price" type="number" min="0" placeholder="0" />
      </div>`);
    current.setDate(current.getDate() + 1);
  }
  elements.routeDaysContainer.innerHTML = rows.join('');
  showToast(t().routeGenerated, 'success');
}

function onRouteSubmit(event) {
  event.preventDefault();
  const rows = Array.from(elements.routeDaysContainer.querySelectorAll('.route-day-row'));
  if (!rows.length) {
    showToast(t().noRouteDays, 'error');
    return;
  }
  const routeId = `route-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const client = elements.routeClient.value.trim();
  const groupSize = Number(elements.routeGroupSize.value) || 0;
  const currency = elements.routeCurrency.value || 'USD';
  const defaultPrice = Number(elements.routePrice.value) || 0;
  const notes = elements.routeNotes.value.trim();

  rows.forEach((row) => {
    const date = row.dataset.date;
    const city = row.querySelector('.route-day-city').value.trim();
    const tour = row.querySelector('.route-day-tour').value.trim();
    const price = Number(row.querySelector('.route-day-price').value) || defaultPrice;
    state.bookings.push({
      id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date,
      status: 'excursion',
      city,
      client_name: client,
      tour_name: tour,
      start_time: '09:00',
      end_time: '18:00',
      group_size: groupSize,
      price,
      currency,
      notes,
      route_id: routeId
    });
  });

  persistBookings();
  closeModal(elements.routeModal);
  render();
  activateTab('routesTab');
  showToast(t().routeSaved, 'success');
}

function openDetailModal(id) {
  const booking = state.bookings.find((item) => item.id === id);
  if (!booking) return;
  state.selectedBookingId = id;
  const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
  elements.detailBody.innerHTML = `
    <div class="detail-row"><span class="detail-label">${escapeHtml(t().date)}</span><strong>${escapeHtml(booking.date)}</strong></div>
    <div class="detail-row"><span class="detail-label">${escapeHtml(t().status)}</span><strong>${escapeHtml(t()[conf.labelKey])}</strong></div>
    <div class="detail-row"><span class="detail-label">${escapeHtml(t().city)}</span><strong>${escapeHtml(booking.city || '—')}</strong></div>
    <div class="detail-row"><span class="detail-label">${escapeHtml(t().client)}</span><strong>${escapeHtml(booking.client_name || '—')}</strong></div>
    <div class="detail-row"><span class="detail-label">${escapeHtml(t().tourName)}</span><strong>${escapeHtml(booking.tour_name || '—')}</strong></div>
    <div class="detail-row"><span class="detail-label">${escapeHtml(t().income)}</span><strong>${escapeHtml(booking.price ? formatCurrency(booking.price, booking.currency || 'USD') : '—')}</strong></div>
    <div class="detail-row"><span class="detail-label">${escapeHtml(t().notes)}</span><strong>${escapeHtml(booking.notes || '—')}</strong></div>`;
  openModal(elements.detailModal);
}

function activateTab(tabId) {
  state.activeTab = tabId;
  localStorage.setItem(STORAGE_KEYS.lastTab, tabId);
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('hidden', panel.id !== tabId);
    panel.classList.toggle('active', panel.id === tabId);
  });
  document.querySelectorAll('.workspace-sidebar .sidebar-link').forEach((link) => link.classList.toggle('active', link.dataset.tab === tabId));
  const mobileMap = { calendarTab: 'calendarTabMobile', routesTab: 'routesTabMobile', financeTab: 'financeTabMobile', settingsTab: 'settingsTabMobile' };
  document.querySelectorAll('.mobile-nav .sidebar-link').forEach((link) => link.classList.toggle('active', link.dataset.tabTarget === mobileMap[tabId]));
}

function updateLanguage(lang) {
  state.currentLang = TRANSLATIONS[lang] ? lang : 'ru';
  localStorage.setItem(STORAGE_KEYS.lastLang, state.currentLang);
  renderAll();
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function bindEvents() {
  elements.openAuthBtn.addEventListener('click', () => openModal(elements.authModal));
  elements.heroLoginBtn.addEventListener('click', () => openModal(elements.authModal));
  elements.workspaceAuthBtn.addEventListener('click', () => openModal(elements.authModal));
  elements.settingsLoginBtn.addEventListener('click', () => openModal(elements.authModal));
  elements.closeAuthModal.addEventListener('click', () => closeModal(elements.authModal));
  elements.authModal.addEventListener('click', (event) => { if (event.target === elements.authModal) closeModal(elements.authModal); });
  elements.authForm.addEventListener('submit', onAuthLoginSubmit);
  elements.registerBtn.addEventListener('click', onRegisterClick);
  elements.googleAuthBtn.addEventListener('click', onGoogleAuthClick);
  elements.demoEnterBtn.addEventListener('click', () => { applyDemoMode(); showToast(t().demoOpened, 'success'); });
  elements.backToLandingBtn.addEventListener('click', showLanding);
  elements.logoutBtn.addEventListener('click', onLogoutClick);
  elements.settingsLogoutBtn.addEventListener('click', onLogoutClick);
  elements.openMobileSidebar.addEventListener('click', openDrawer);
  elements.closeMobileSidebar.addEventListener('click', closeDrawer);
  elements.mobileSidebarBackdrop.addEventListener('click', (event) => { if (event.target === elements.mobileSidebarBackdrop) closeDrawer(); });

  elements.openBookingBtn.addEventListener('click', () => openBookingModal());
  elements.openRouteBtn.addEventListener('click', () => {
    elements.routeForm.reset();
    elements.routeDaysContainer.innerHTML = '';
    const today = toDateString(new Date());
    elements.routeStart.value = today;
    elements.routeEnd.value = today;
    openModal(elements.routeModal);
  });
  elements.openStatsBtn.addEventListener('click', () => { renderStatsModal(); openModal(elements.statsModal); });
  elements.prevMonthBtn.addEventListener('click', () => changeMonth(-1));
  elements.nextMonthBtn.addEventListener('click', () => changeMonth(1));
  elements.todayBtn.addEventListener('click', () => { state.currentYear = new Date().getFullYear(); state.currentMonth = new Date().getMonth(); render(); });
  elements.viewGridBtn.addEventListener('click', () => { state.currentView = 'grid'; render(); });
  elements.viewListBtn.addEventListener('click', () => { state.currentView = 'list'; render(); });
  elements.searchInput.addEventListener('input', (event) => { state.filters.search = event.target.value; render(); });
  elements.statusFilter.addEventListener('change', (event) => { state.filters.status = event.target.value; render(); });
  elements.resetFiltersBtn.addEventListener('click', () => {
    state.filters = { search: '', status: 'all' };
    elements.searchInput.value = '';
    elements.statusFilter.value = 'all';
    render();
    showToast(t().filtersReset, 'success');
  });
  elements.bookingStatus.addEventListener('change', (event) => toggleConditionalFields(event.target.value));
  elements.bookingForm.addEventListener('submit', onBookingSubmit);
  elements.deleteBookingBtn.addEventListener('click', onDeleteBooking);
  elements.routeForm.addEventListener('submit', onRouteSubmit);
  elements.btnGenerateRouteDays.addEventListener('click', generateRouteDaysRows);
  elements.detailEditBtn.addEventListener('click', () => { closeModal(elements.detailModal); openBookingModal(state.selectedBookingId); });
  document.querySelectorAll('.js-close-modal').forEach((button) => button.addEventListener('click', () => closeAllModals()));
  document.querySelectorAll('.workspace-sidebar .sidebar-link').forEach((link) => link.addEventListener('click', () => activateTab(link.dataset.tab)));
  document.querySelectorAll('.mobile-nav .sidebar-link').forEach((link) => link.addEventListener('click', () => {
    const reverse = { calendarTabMobile: 'calendarTab', routesTabMobile: 'routesTab', financeTabMobile: 'financeTab', settingsTabMobile: 'settingsTab' };
    activateTab(reverse[link.dataset.tabTarget]);
    closeDrawer();
  }));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeAllModals(); closeDrawer(); } });
  elements.langSelect.value = state.currentLang;
  elements.langSelect.addEventListener('change', (event) => updateLanguage(event.target.value));
}

function init() {
  bindEvents();
  activateTab(state.activeTab);
  updateStaticTranslations();
  resetToGuest();
  initSupabase();
  if (sessionStorage.getItem(STORAGE_KEYS.demoMode) === '1') applyDemoMode();
}

document.addEventListener('DOMContentLoaded', init);
