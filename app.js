/* ===================================================
   YOLNAMA — CRM & PMS SYSTEM FOR GUIDES
   Полное восстановление логики и интеграция Лендинга
   =================================================== */

'use strict';

const API = 'tables/bookings';
const STORAGE_KEYS = {
  bookings: 'tour_flow_bookings',
  settings: 'tour_flow_settings'
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
    legExcursion: 'Экскурсия',
    legBusy: 'Занят',
    legHoliday: 'Выходной',
    legPersonal: 'Личное',
    authTitle: 'Аккаунт',
    authSubtitle: 'Войдите, чтобы синхронизировать записи и открывать календарь с любого устройства.',
    lblEmail: 'Email',
    lblPassword: 'Пароль',
    loginBtn: 'Войти',
    registerBtn: 'Регистрация',
    lblFastAuth: 'Быстрый вход',
    lblGoogleHint: 'Можно войти через Google. После входа записи будут надежно храниться в облаке.',
    lblGoogleBtn: 'Войти через Google',
    lblLoggedInAs: 'Вы вошли как',
    lblLogoutBtn: 'Выйти',
    modalTitleNew: 'Новая запись',
    modalTitleEdit: 'Редактировать запись',
    lblStatusType: 'Статус / Тип дня',
    formExcursion: 'Экскурсия',
    formBusy: 'Занят',
    formHoliday: 'Выходной',
    formPersonal: 'Личное',
    lblDate: 'Дата',
    lblCity: 'Город',
    lblClient: 'Заказчик (Компания / Имя)',
    lblTourName: 'Экскурсия / группа',
    lblStartTime: 'Начало',
    lblEndTime: 'Окончание',
    lblPrice: 'Стоимость',
    lblCurrency: 'Валюта',
    lblGroupSize: 'Количество туристов',
    lblPaymentStatus: 'Статус оплаты',
    optUnpaid: 'Не оплачено',
    optPartial: 'Частичная оплата',
    optPaid: 'Оплачено',
    lblPaidAmount: 'Уже оплачено',
    lblRemainingAmount: 'Осталось оплатить',
    lblNotes: 'Заметки / Пожелания',
    btnDelete: 'Удалить',
    btnCancel: 'Отмена',
    btnSave: 'Сохранить',
    routeModalTitle: 'Бронь маршрута',
    lblRouteStart: 'Дата начала',
    lblRouteEnd: 'Дата окончания',
    btnGenDays: 'Сгенерировать дни',
    lblRouteClient: 'Заказчик',
    lblRouteGroupSize: 'Количество туристов',
    lblRouteDefPrice: 'Стоимость по умолчанию',
    lblRouteDefCurr: 'Валюта по умолчанию',
    lblRoutePayStatus: 'Статус оплаты',
    optRUnpaid: 'Не оплачено',
    optRPartial: 'Частичная оплата',
    optRPaid: 'Оплачено',
    lblRoutePaidAmt: 'Уже оплачено',
    lblRouteNotes: 'Общие заметки',
    btnRouteCancel: 'Отмена',
    btnRouteSave: 'Сохранить',
    detailModalTitle: 'Информация о дне',
    lblClose: 'Закрыть',
    lblDuplicate: 'Дублировать запись',
    lblEdit: 'Редактировать',
    statsModalTitle: 'Детальная статистика',
    lblStatsClose: 'Закрыть',
    lblDetails: 'Детали'
  },
  en: {
    title: 'Yolnama',
    subtitle: 'Operating system for guides and drivers',
    gridBtn: 'Grid',
    listBtn: 'List',
    todayBtn: 'Today',
    addSingleBtn: 'Add Single',
    addMultiBtn: 'Route',
    statTitle: 'Month Statistics',
    incomeTitle: 'Month Income',
    legendTitle: 'Legend',
    statsExcursions: 'Tours',
    statsBusy: 'Busy',
    statsHoliday: 'Day Off',
    statsTourists: 'Tourists',
    searchPlaceholder: 'Search by city, client, tour or group',
    statusAll: 'All statuses',
    resetBtn: 'Reset',
    resultsLabel: 'Records:',
    toolbarTitle: 'Search & Filters',
    toolbarHint: 'Quick search within the current month',
    toolbarCollapse: 'Collapse',
    toolbarExpand: 'Expand',
    noEvents: 'No events found for this month',
    legExcursion: 'Tour',
    legBusy: 'Busy',
    legHoliday: 'Day Off',
    legPersonal: 'Personal',
    authTitle: 'Account',
    authSubtitle: 'Log in to sync records and access your calendar from any device.',
    lblEmail: 'Email',
    lblPassword: 'Password',
    loginBtn: 'Log In',
    registerBtn: 'Sign Up',
    lblFastAuth: 'Fast Access',
    lblGoogleHint: 'You can sign in with Google. After logging in, records will be safely stored in the cloud.',
    lblGoogleBtn: 'Sign in with Google',
    lblLoggedInAs: 'Logged in as',
    lblLogoutBtn: 'Log Out',
    modalTitleNew: 'New Event',
    modalTitleEdit: 'Edit Event',
    lblStatusType: 'Status / Day Type',
    formExcursion: 'Tour',
    formBusy: 'Busy',
    formHoliday: 'Day Off',
    formPersonal: 'Personal',
    lblDate: 'Date',
    lblCity: 'City',
    lblClient: 'Client (Company / Name)',
    lblTourName: 'Tour / Group Name',
    lblStartTime: 'Start Time',
    lblEndTime: 'End Time',
    lblPrice: 'Price',
    lblCurrency: 'Currency',
    lblGroupSize: 'Tourists Count',
    lblPaymentStatus: 'Payment Status',
    optUnpaid: 'Unpaid',
    optPartial: 'Partial',
    optPaid: 'Paid',
    lblPaidAmount: 'Paid Amount',
    lblRemainingAmount: 'Remaining',
    lblNotes: 'Notes / Wishes',
    btnDelete: 'Delete',
    btnCancel: 'Cancel',
    btnSave: 'Save',
    routeModalTitle: 'Route Booking',
    lblRouteStart: 'Start Date',
    lblRouteEnd: 'End Date',
    btnGenDays: 'Generate Days',
    lblRouteClient: 'Client',
    lblRouteGroupSize: 'Tourists Count',
    lblRouteDefPrice: 'Default Price',
    lblRouteDefCurr: 'Default Currency',
    lblRoutePayStatus: 'Payment Status',
    optRUnpaid: 'Unpaid',
    optRPartial: 'Partial',
    optRPaid: 'Paid',
    lblRoutePaidAmt: 'Paid Amount',
    lblRouteNotes: 'General Notes',
    btnRouteCancel: 'Cancel',
    btnRouteSave: 'Save',
    detailModalTitle: 'Day Details',
    lblClose: 'Close',
    lblDuplicate: 'Duplicate Record',
    lblEdit: 'Edit',
    statsModalTitle: 'Detailed Statistics',
    lblStatsClose: 'Close',
    lblDetails: 'Details'
  },
  uz: {
    title: 'Yolnama',
    subtitle: 'Gidlar va haydovchilar uchun operatsion tizim',
    gridBtn: 'Setka',
    listBtn: 'Ro‘yxat',
    todayBtn: 'Bugun',
    addSingleBtn: 'Qo‘shish',
    addMultiBtn: 'Yo‘nalish',
    statTitle: 'Oylik statistika',
    incomeTitle: 'Oylik daromad',
    legendTitle: 'Belgilar',
    statsExcursions: 'Ekskursiyalar',
    statsBusy: 'Band',
    statsHoliday: 'Dam olish',
    statsTourists: 'Turistlar',
    searchPlaceholder: 'Shahar, mijoz, ekskursiya yoki guruh bo‘yicha qidirish',
    statusAll: 'Barcha statuslar',
    resetBtn: 'Tashlash',
    resultsLabel: 'Yozuvlar:',
    toolbarTitle: 'Qidiruv va filtrlar',
    toolbarHint: 'Joriy oy bo‘yicha tezkor qidiruv',
    toolbarCollapse: 'Yashirish',
    toolbarExpand: 'Ko‘rsatish',
    noEvents: 'Tanlangan oy uchun yozuvlar yo‘q',
    legExcursion: 'Ekskursiya',
    legBusy: 'Band',
    legHoliday: 'Dam olish',
    legPersonal: 'Shaxsiy',
    authTitle: 'Akkaunt',
    authSubtitle: 'Yozuvlarni sinxronizatsiya qilish va taqvimni istalgan qurilmadan ochish uchun kiring.',
    lblEmail: 'Email',
    lblPassword: 'Parol',
    loginBtn: 'Kirish',
    registerBtn: 'Ro‘yxatdan o‘tish',
    lblFastAuth: 'Tezkor kirish',
    lblGoogleHint: 'Google orqali kirishingiz mumkin. Kirgandan so‘ng yozuvlar bulutda xavfsiz saqlanadi.',
    lblGoogleBtn: 'Google orqali kirish',
    lblLoggedInAs: 'Siz bu profil bilan kirdingiz:',
    lblLogoutBtn: 'Chiqish',
    modalTitleNew: 'Yangi yozuv',
    modalTitleEdit: 'Yozuvni tahrirlash',
    lblStatusType: 'Status / Kun turi',
    formExcursion: 'Ekskursiya',
    formBusy: 'Band',
    formHoliday: 'Dam olish',
    formPersonal: 'Shaxsiy',
    lblDate: 'Sana',
    lblCity: 'Shahar',
    lblClient: 'Buyurtmachi (Kompaniya / Ism)',
    lblTourName: 'Ekskursiya / guruh',
    lblStartTime: 'Boshlanishi',
    lblEndTime: 'Tugashi',
    lblPrice: 'Qiymati',
    lblCurrency: 'Valyuta',
    lblGroupSize: 'Turistlar soni',
    lblPaymentStatus: 'To‘lov statusi',
    optUnpaid: 'To‘lanmagan',
    optPartial: 'Qisman to‘langan',
    optPaid: 'To‘langan',
    lblPaidAmount: 'To‘langan summa',
    lblRemainingAmount: 'To‘lanishi kerak',
    lblNotes: 'Eslatmalar / Istaklar',
    btnDelete: 'O‘chirish',
    btnCancel: 'Bekor qilish',
    btnSave: 'Saqlash',
    routeModalTitle: 'Yo‘nalishni band qilish',
    lblRouteStart: 'Boshlanish sanasi',
    lblRouteEnd: 'Tugash sanasi',
    btnGenDays: 'Kunlarni yaratish',
    lblRouteClient: 'Buyurtmachi',
    lblRouteGroupSize: 'Turistlar soni',
    lblRouteDefPrice: 'Standart qiymat',
    lblRouteDefCurr: 'Standart valyuta',
    lblRoutePayStatus: 'To‘lov statusi',
    optRUnpaid: 'To‘lanmagan',
    optRPartial: 'Qisman to‘langan',
    optRPaid: 'To‘langan',
    lblRoutePaidAmt: 'To‘langan summa',
    lblRouteNotes: 'Umumiy eslatmalar',
    btnRouteCancel: 'Bekor qilish',
    btnRouteSave: 'Saqlash',
    detailModalTitle: 'Kun haqida ma’lumot',
    lblClose: 'Yopish',
    lblDuplicate: 'Nusxa ko‘chirish',
    lblEdit: 'Tahrirlash',
    statsModalTitle: 'Batafsil statistika',
    lblStatsClose: 'Yopish',
    lblDetails: 'Batafsil'
  }
};

let bookings = [];
let currentNavDate = new Date();
let currentView = 'grid'; 
let generatedRouteDays = [];
let statsYear = new Date().getFullYear();

// DOM Elements Календаря
const currentMonthYearEl = document.getElementById('currentMonthYear');
const gridViewEl = document.getElementById('gridView');
const listViewEl = document.getElementById('listView');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const todayBtn = document.getElementById('todayBtnClick');
const setViewGridBtn = document.getElementById('setViewGrid');
const setViewListBtn = document.getElementById('setViewList');
const addBtn = document.getElementById('addBtn');
const routeBtn = document.getElementById('routeBtn');
const fabAdd = document.getElementById('fabAdd');
const bookingModal = document.getElementById('bookingModal');
const closeBookingModal = document.getElementById('closeBookingModal');
const cancelBookingBtn = document.getElementById('cancelBookingBtn');
const bookingForm = document.getElementById('bookingForm');
const deleteBookingBtn = document.getElementById('deleteBookingBtn');
const routeModal = document.getElementById('routeModal');
const closeRouteModal = document.getElementById('closeRouteModal');
const cancelRouteBtn = document.getElementById('cancelRouteBtn');
const routeForm = document.getElementById('routeForm');
const generateRouteDaysBtn = document.getElementById('generateRouteDaysBtn');
const routeDaysContainer = document.getElementById('routeDaysContainer');
const detailModal = document.getElementById('detailModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const detailCloseBtn = document.getElementById('detailCloseBtn');
const detailEditBtn = document.getElementById('detailEditBtn');
const detailDuplicateBtn = document.getElementById('detailDuplicateBtn');
const detailModalBody = document.getElementById('detailModalBody');
const statsModal = document.getElementById('statsModal');
const closeStatsModal = document.getElementById('closeStatsModal');
const statsModalClose2 = document.getElementById('statsModalClose2');
const viewStatsDetailsBtn = document.getElementById('viewStatsDetailsBtn');
const statsModalBody = document.getElementById('statsModalBody');
const statsModalYearLabel = document.getElementById('statsModalYearLabel');
const statsPrevYearBtn = document.getElementById('statsPrevYearBtn');
const statsNextYearBtn = document.getElementById('statsNextYearBtn');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const resetFiltersBtn = document.getElementById('resetFilters');
const filterCountEl = document.getElementById('filterCount');
const toggleFilterBar = document.getElementById('toggleFilterBar');
const filterBarContent = document.getElementById('filterBarContent');
const btnToggleFilters = document.getElementById('btnToggleFilters');
const filterChevron = document.getElementById('filterChevron');
const excursionFields = document.getElementById('excursionFields');
const partialPaymentRow = document.getElementById('partialPaymentRow');
const routePartialPaymentFields = document.getElementById('routePartialPaymentFields');
const langSelect = document.getElementById('langSelect');

// Элементы Интеграции Лендинга
const landingPage = document.getElementById('landingPageSection');
const mainApp = document.getElementById('mainPmsAppContainer');
const authModal = document.getElementById('customAuthModal');
const toast = document.getElementById('pmsToast');

function showToast(msg) {
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

function enterAppAsGuest() {
  landingPage.classList.add('hidden-panel');
  mainApp.classList.remove('hidden-panel');
  document.getElementById('authGuestState').classList.remove('hidden');
  document.getElementById('authUserState').classList.add('hidden');
  document.getElementById('pmsUserBadge').innerHTML = `<span>Гость</span>`;
  render();
  window.dispatchEvent(new Event('resize')); 
}

function enterAppAsUser(email) {
  landingPage.classList.add('hidden-panel');
  mainApp.classList.remove('hidden-panel');
  authModal.classList.remove('active');
  
  document.getElementById('authGuestState').classList.add('hidden');
  document.getElementById('authUserState').classList.remove('hidden');
  document.getElementById('userEmailDisplay').textContent = email;
  
  document.getElementById('pmsUserBadge').innerHTML = `
    <span>Вошли как: <b>${email}</b></span>
    <button class="btn-logout-pms" id="topLogoutBtn">Выйти</button>
  `;
  
  document.getElementById('topLogoutBtn')?.addEventListener('click', logoutAction);
  render();
  window.dispatchEvent(new Event('resize'));
}

function logoutAction() {
  mainApp.classList.add('hidden-panel');
  landingPage.classList.remove('hidden-panel');
  showToast("Вы вышли из аккаунта");
}

// Инициализация
function init() {
  loadData();
  setupEventListeners();
  setupLandingListeners();
  applyLanguage(langSelect.value);
  // Первоначально приложение скрыто, рендерится при входе в демо/аккаунт
}

function loadData() {
  const local = localStorage.getItem(STORAGE_KEYS.bookings);
  if (local) {
    try { bookings = JSON.parse(local); } catch(e) { bookings = []; }
  } else {
    bookings = [];
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
}

function setupLandingListeners() {
  document.getElementById('landingDemoBtn')?.addEventListener('click', () => {
    enterAppAsGuest();
    showToast("Демо-режим успешно запущен!");
  });

  document.getElementById('landingLoginBtn')?.addEventListener('click', () => {
    document.getElementById('authModalHeaderTitle').textContent = "Вход в Yolnama";
    authModal.classList.add('active');
  });

  document.getElementById('landingRegisterBtn')?.addEventListener('click', () => {
    document.getElementById('authModalHeaderTitle').textContent = "Регистрация в Yolnama";
    authModal.classList.add('active');
  });

  document.getElementById('closeAuthModalBtn')?.addEventListener('click', () => {
    authModal.classList.remove('active');
  });

  document.getElementById('fakeGoogleBtn')?.addEventListener('click', () => {
    enterAppAsUser("demo@google.com");
    showToast("Вход через Google успешно имитирован!");
  });

  document.getElementById('fakeSubmitReg')?.addEventListener('click', () => {
    enterAppAsUser("new_user@yolnama.com");
    showToast("Регистрация успешно имитирована!");
  });

  document.getElementById('fakeAuthForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('fakeEmailInput').value || "demo@yolnama.com";
    enterAppAsUser(email);
    showToast("Вход успешно имитирован!");
  });

  // Кнопки из сайдбара приложения
  safeClick('loginBtn', () => {
    const email = document.getElementById('authEmailInput').value || "demo@yolnama.com";
    enterAppAsUser(email);
    showToast("Вход успешно имитирован!");
  });
  
  safeClick('registerBtn', () => {
    enterAppAsUser("demo@yolnama.com");
    showToast("Регистрация успешно имитирована!");
  });

  safeClick('googleBtn', () => {
    enterAppAsUser("demo@google.com");
    showToast("Вход через Google успешно имитирован!");
  });

  safeClick('logoutBtn', logoutAction);
}

function setupEventListeners() {
  safeClick('prevMonth', () => { currentNavDate.setMonth(currentNavDate.getMonth() - 1); render(); });
  safeClick('nextMonth', () => { currentNavDate.setMonth(currentNavDate.getMonth() + 1); render(); });
  safeClick('todayBtnClick', () => { currentNavDate = new Date(); render(); });

  safeClick('setViewGrid', () => { currentView = 'grid'; updateViewToggle(); render(); });
  safeClick('setViewList', () => { currentView = 'list'; updateViewToggle(); render(); });

  const openNewBooking = () => openBookingModalForNew(toDateString(new Date()));
  safeClick('addBtn', openNewBooking);
  safeClick('fabAdd', openNewBooking);
  safeClick('routeBtn', openRouteModalNew);

  safeClick('closeBookingModal', () => closeModal(bookingModal));
  safeClick('cancelBookingBtn', () => closeModal(bookingModal));
  safeSubmit('bookingForm', onBookingFormSubmit);
  safeClick('deleteBookingBtn', onDeleteBookingClick);

  safeClick('closeRouteModal', () => closeModal(routeModal));
  safeClick('cancelRouteBtn', () => closeModal(routeModal));
  safeClick('generateRouteDaysBtn', onGenerateRouteDaysClick);
  safeSubmit('routeForm', onRouteFormSubmit);

  safeClick('closeDetailModal', () => closeModal(detailModal));
  safeClick('detailCloseBtn', () => closeModal(detailModal));
  safeClick('detailEditBtn', onDetailEditClick);
  safeClick('detailDuplicateBtn', onDetailDuplicateClick);

  safeClick('closeStatsModal', () => closeModal(statsModal));
  safeClick('statsModalClose2', () => closeModal(statsModal));
  safeClick('viewStatsDetailsBtn', openStatsModalView);
  safeClick('statsPrevYearBtn', () => { statsYear--; renderStatsModalContent(); });
  safeClick('statsNextYearBtn', () => { statsYear++; renderStatsModalContent(); });

  searchInput?.addEventListener('input', render);
  filterStatus?.addEventListener('change', render);
  
  safeClick('resetFilters', () => { 
    if (searchInput) searchInput.value = ''; 
    if (filterStatus) filterStatus.value = ''; 
    render(); 
  });

  toggleFilterBar?.addEventListener('click', (e) => {
    if (e.target.closest('#btnToggleFilters')) return;
    filterBarContent.classList.toggle('hidden');
    const isCollapsed = filterBarContent.classList.contains('hidden');
    const lang = langSelect.value;
    setTxtBySelector('#btnToggleFilters span', isCollapsed ? TRANSLATIONS[lang].toolbarExpand : TRANSLATIONS[lang].toolbarCollapse);
    if (filterChevron) filterChevron.className = isCollapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
  });

  btnToggleFilters?.addEventListener('click', () => {
    filterBarContent.classList.toggle('hidden');
    const isCollapsed = filterBarContent.classList.contains('hidden');
    const lang = langSelect.value;
    setTxtBySelector('#btnToggleFilters span', isCollapsed ? TRANSLATIONS[lang].toolbarExpand : TRANSLATIONS[lang].toolbarCollapse);
    if (filterChevron) filterChevron.className = isCollapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
  });

  document.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener('change', (e) => toggleFormFieldsByStatus(e.target.value));
  });

  document.getElementById('bookingPaymentStatus')?.addEventListener('change', (e) => {
    if (e.target.value === 'partial') {
      partialPaymentRow.classList.remove('hidden');
      updateRemainingAmount();
    } else {
      partialPaymentRow.classList.add('hidden');
    }
  });

  document.getElementById('bookingPrice')?.addEventListener('input', updateRemainingAmount);
  document.getElementById('bookingPaidAmount')?.addEventListener('input', updateRemainingAmount);

  document.getElementById('routePaymentStatus')?.addEventListener('change', (e) => {
    if (e.target.value === 'partial') routePartialPaymentFields.classList.remove('hidden');
    else routePartialPaymentFields.classList.add('hidden');
  });

  langSelect?.addEventListener('change', (e) => {
    applyLanguage(e.target.value);
    render();
  });
}

function updateRemainingAmount() {
  const price = Number(getVal('bookingPrice')) || 0;
  const paid = Number(getVal('bookingPaidAmount')) || 0;
  setVal('bookingRemainingAmount', Math.max(0, price - paid));
}

function applyLanguage(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;

  setTxt('navTitle', t.title);
  setTxt('navSubtitle', t.subtitle);
  setTxt('navRouteBtn', t.addMultiBtn);
  setTxt('navAddBtn', t.addSingleBtn);
  setTxt('statTitle', t.statTitle);
  setTxt('incomeTitle', t.incomeTitle);
  setTxt('legendTitle', t.legendTitle);

  setTxt('legExcursion', t.legExcursion);
  setTxt('legBusy', t.legBusy);
  setTxt('legHoliday', t.legHoliday);
  setTxt('legPersonal', t.legPersonal);

  setTxt('authTitle', t.authTitle);
  setTxt('authSubtitle', t.authSubtitle);
  setTxt('lblEmail', t.lblEmail);
  setTxt('lblPassword', t.lblPassword);
  setTxt('loginBtn', t.loginBtn);
  setTxt('registerBtn', t.registerBtn);
  setTxt('lblFastAuth', t.lblFastAuth);
  setTxt('lblGoogleHint', t.lblGoogleHint);
  setTxt('lblGoogleBtn', t.lblGoogleBtn);
  setTxt('lblLoggedInAs', t.lblLoggedInAs);
  setTxt('lblLogoutBtn', t.lblLogoutBtn);

  setTxt('toolbarToday', t.todayBtn);
  setTxt('toolbarGrid', t.gridBtn);
  setTxt('toolbarList', t.listBtn);
  setTxt('toolbarTitle', t.toolbarTitle);
  setTxt('toolbarHint', t.toolbarHint);
  setTxt('resetBtn', t.resetBtn);
  setTxt('resultsLabel', t.resultsLabel);
  setTxt('statusAll', t.statusAll);

  if (filterBarContent) {
    const isCollapsed = filterBarContent.classList.contains('hidden');
    setTxtBySelector('#btnToggleFilters span', isCollapsed ? t.toolbarExpand : t.toolbarCollapse);
  }

  setTxt('lblStatusType', t.lblStatusType);
  setTxt('formExcursion', t.formExcursion);
  setTxt('formBusy', t.formBusy);
  setTxt('formHoliday', t.formHoliday);
  setTxt('formPersonal', t.formPersonal);
  setTxt('lblDate', t.lblDate);
  setTxt('lblCity', t.lblCity);
  setTxt('lblClient', t.lblClient);
  setTxt('lblTourName', t.lblTourName);
  setTxt('lblStartTime', t.lblStartTime);
  setTxt('lblEndTime', t.lblEndTime);
  setTxt('lblPrice', t.lblPrice);
  setTxt('lblCurrency', t.lblCurrency);
  setTxt('lblGroupSize', t.lblGroupSize);
  setTxt('lblPaymentStatus', t.lblPaymentStatus);
  setTxt('optUnpaid', t.optUnpaid);
  setTxt('optPartial', t.optPartial);
  setTxt('optPaid', t.optPaid);
  setTxt('lblPaidAmount', t.lblPaidAmount);
  setTxt('lblRemainingAmount', t.lblRemainingAmount);
  setTxt('lblNotes', t.lblNotes);
  setTxt('btnDelete', t.btnDelete);
  setTxt('btnCancel', t.btnCancel);
  setTxt('btnSave', t.btnSave);

  setTxt('routeModalTitle', t.routeModalTitle);
  setTxt('lblRouteStart', t.lblRouteStart);
  setTxt('lblRouteEnd', t.lblRouteEnd);
  setTxt('btnGenDays', t.btnGenDays);
  setTxt('lblRouteClient', t.lblRouteClient);
  setTxt('lblRouteGroupSize', t.lblRouteGroupSize);
  setTxt('lblRouteDefPrice', t.lblRouteDefPrice);
  setTxt('lblRouteDefCurr', t.lblRouteDefCurr);
  setTxt('lblRoutePayStatus', t.lblRoutePayStatus);
  setTxt('optRUnpaid', t.optRUnpaid);
  setTxt('optRPartial', t.optRPartial);
  setTxt('optRPaid', t.optRPaid);
  setTxt('lblRoutePaidAmt', t.lblRoutePaidAmt);
  setTxt('lblRouteNotes', t.lblRouteNotes);
  setTxt('btnRouteCancel', t.btnRouteCancel);
  setTxt('btnRouteSave', t.btnRouteSave);

  setTxt('detailModalTitle', t.detailModalTitle);
  setTxt('lblClose', t.lblClose);
  setTxt('lblDuplicate', t.lblDuplicate);
  setTxt('lblEdit', t.lblEdit);

  setTxt('statsModalTitle', t.statsModalTitle);
  setTxt('lblStatsClose', t.lblStatsClose);
  setTxt('lblDetails', t.lblDetails);

  setTxt('lblExcursions', t.statsExcursions);
  setTxt('lblBusy', t.statsBusy);
  setTxt('lblHoliday', t.statsHoliday);
  setTxt('lblTourists', t.statsTourists);
}

function updateViewToggle() {
  if (currentView === 'grid') {
    setViewGridBtn?.classList.add('active');
    setViewListBtn?.classList.remove('active');
    gridViewEl?.classList.remove('hidden');
    listViewEl?.classList.add('hidden');
  } else {
    setViewGridBtn?.classList.remove('active');
    setViewListBtn?.classList.add('active');
    gridViewEl?.classList.add('hidden');
    listViewEl?.classList.remove('hidden');
  }
}

function openModal(modal) {
  modal?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal?.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleFormFieldsByStatus(status) {
  if (status === 'excursion') {
    excursionFields?.classList.remove('hidden');
  } else {
    excursionFields?.classList.add('hidden');
  }
}

function openBookingModalForNew(dateStr) {
  const lang = langSelect.value;
  setTxt('modalTitle', TRANSLATIONS[lang].modalTitleNew);
  bookingForm?.reset();
  setVal('bookingId', '');
  setVal('bookingDate', dateStr);
  deleteBookingBtn?.classList.add('hidden');
  toggleFormFieldsByStatus('excursion');
  partialPaymentRow?.classList.add('hidden');
  openModal(bookingModal);
}

function openBookingModalForEdit(id) {
  const lang = langSelect.value;
  const item = bookings.find(b => b.id === id);
  if (!item) return;

  setTxt('modalTitle', TRANSLATIONS[lang].modalTitleEdit);
  setVal('bookingId', item.id);
  setVal('bookingDate', item.date);

  const radio = bookingForm?.querySelector(`input[name="status"][value="${item.status}"]`);
  if (radio) radio.checked = true;
  toggleFormFieldsByStatus(item.status);

  setVal('bookingCity', item.city || '');
  setVal('bookingClient', item.client_name || '');
  setVal('bookingTourName', item.tour_name || '');
  setVal('bookingStartTime', item.start_time || '09:00');
  setVal('bookingEndTime', item.end_time || '18:00');
  setVal('bookingPrice', item.price || '');
  setVal('bookingCurrency', item.currency || 'UZS');
  setVal('bookingGroupSize', item.group_size || '');
  setVal('bookingPaymentStatus', item.payment_status || 'unpaid');
  setVal('bookingPaidAmount', item.paid_amount || '');
  setVal('bookingNotes', item.notes || '');

  if (item.payment_status === 'partial') {
    partialPaymentRow?.classList.remove('hidden');
    updateRemainingAmount();
  } else {
    partialPaymentRow?.classList.add('hidden');
  }

  deleteBookingBtn?.classList.remove('hidden');
  openModal(bookingModal);
}

function onBookingFormSubmit(e) {
  e.preventDefault();
  const id = getVal('bookingId');
  const status = bookingForm.querySelector('input[name="status"]:checked').value;
  const date = getVal('bookingDate');

  const isEx = (status === 'excursion');
  const payStatus = isEx ? getVal('bookingPaymentStatus') : 'unpaid';

  const row = {
    id: id || generateId(),
    date,
    status,
    city: isEx ? getVal('bookingCity') : '',
    client_name: isEx ? getVal('bookingClient') : '',
    tour_name: isEx ? getVal('bookingTourName') : '',
    start_time: isEx ? getVal('bookingStartTime') : '',
    end_time: isEx ? getVal('bookingEndTime') : '',
    price: isEx ? (Number(getVal('bookingPrice')) || 0) : 0,
    currency: isEx ? getVal('bookingCurrency') : 'UZS',
    group_size: isEx ? (Number(getVal('bookingGroupSize')) || 0) : 0,
    payment_status: payStatus,
    paid_amount: (isEx && payStatus === 'partial') ? (Number(getVal('bookingPaidAmount')) || 0) : 0,
    notes: getVal('bookingNotes')
  };

  if (id) {
    const idx = bookings.findIndex(b => b.id === id);
    if (idx !== -1) bookings[idx] = row;
  } else {
    bookings.push(row);
  }

  saveData();
  closeModal(bookingModal);
  closeModal(detailModal);
  render();
}

function onDeleteBookingClick() {
  const id = getVal('bookingId');
  if (!id) return;
  bookings = bookings.filter(b => b.id !== id);
  saveData();
  closeModal(bookingModal);
  closeModal(detailModal);
  render();
}

function openRouteModalNew() {
  routeForm?.reset();
  generatedRouteDays = [];
  if (routeDaysContainer) routeDaysContainer.innerHTML = '';
  routePartialPaymentFields?.classList.add('hidden');
  setVal('routeStartDate', toDateString(new Date()));
  setVal('routeEndDate', toDateString(new Date()));
  openModal(routeModal);
}

function onGenerateRouteDaysClick() {
  const startStr = getVal('routeStartDate');
  const endStr = getVal('routeEndDate');
  if (!startStr || !endStr) return;

  const start = new Date(startStr);
  const end = new Date(endStr);
  if (routeDaysContainer) routeDaysContainer.innerHTML = '';
  generatedRouteDays = [];

  if (end < start) return;

  let curr = new Date(start);
  while (curr <= end) {
    const dStr = toDateString(curr);
    generatedRouteDays.push({ date: dStr, city: '', note: '' });
    curr.setDate(curr.getDate() + 1);
  }

  const lang = langSelect.value;
  generatedRouteDays.forEach((day, i) => {
    const row = document.createElement('div');
    row.className = 'route-day-row';
    row.innerHTML = `
      <span class="route-day-date">${day.date}</span>
      <input type="text" placeholder="${TRANSLATIONS[lang].lblCity}" data-idx="${i}" class="route-day-city" style="padding: 6px; border:1px solid var(--border); border-radius:var(--radius-xs);">
      <input type="text" placeholder="${TRANSLATIONS[lang].lblNotes}" data-idx="${i}" class="route-day-note" style="padding: 6px; border:1px solid var(--border); border-radius:var(--radius-xs);">
    `;
    routeDaysContainer?.appendChild(row);
  });
}

function onRouteFormSubmit(e) {
  e.preventDefault();
  if (generatedRouteDays.length === 0) {
    onGenerateRouteDaysClick();
    if (generatedRouteDays.length === 0) return;
  }

  const citiesInputs = routeDaysContainer.querySelectorAll('.route-day-city');
  const notesInputs = routeDaysContainer.querySelectorAll('.route-day-note');

  citiesInputs.forEach(inp => {
    const idx = inp.getAttribute('data-idx');
    generatedRouteDays[idx].city = inp.value;
  });
  notesInputs.forEach(inp => {
    const idx = inp.getAttribute('data-idx');
    generatedRouteDays[idx].note = inp.value;
  });

  const client = getVal('routeClient');
  const size = Number(getVal('routeGroupSize')) || 0;
  const defPrice = Number(getVal('routeDefaultPrice')) || 0;
  const defCurr = getVal('routeDefaultCurrency');
  const payStatus = getVal('routePaymentStatus');
  const globalNotes = getVal('routeNotes');

  const sharedRouteId = `route-${generateId()}`;

  generatedRouteDays.forEach(day => {
    const row = {
      id: generateId(),
      route_id: sharedRouteId,
      date: day.date,
      status: 'excursion',
      city: day.city || '...',
      client_name: client,
      tour_name: globalNotes || 'Маршрут',
      start_time: '09:00',
      end_time: '18:00',
      price: defPrice,
      currency: defCurr,
      group_size: size,
      payment_status: payStatus,
      paid_amount: 0,
      notes: day.note ? `${globalNotes} | ${day.note}` : globalNotes
    };
    bookings.push(row);
  });

  saveData();
  closeModal(routeModal);
  render();
}

function openDetailModalView(id) {
  const item = bookings.find(b => b.id === id);
  if (!item) return;

  detailModalBody?.setAttribute('data-id', id);
  const lang = langSelect.value;
  const t = TRANSLATIONS[lang];

  let html = `
    <div style="margin-bottom: 12px;"><span class="badge status-${item.status}">${t['leg' + item.status.charAt(0).toUpperCase() + item.status.slice(1)]}</span></div>
    <div class="detail-row"><strong>${t.lblDate}:</strong> <span>${item.date}</span></div>
  `;

  if (item.status === 'excursion') {
    html += `
      <div class="detail-row"><strong>${t.lblCity}:</strong> <span>${escapeHtml(item.city || '—')}</span></div>
      <div class="detail-row"><strong>${t.lblClient}:</strong> <span>${escapeHtml(item.client_name || '—')}</span></div>
      <div class="detail-row"><strong>${t.lblTourName}:</strong> <span>${escapeHtml(item.tour_name || '—')}</span></div>
      <div class="detail-row"><strong>Время:</strong> <span>${item.start_time || '—'} - ${item.end_time || '—'}</span></div>
      <div class="detail-row"><strong>${t.lblPrice}:</strong> <span style="color:var(--success); font-weight:700;">${formatCurrency(item.price, item.currency)}</span></div>
      <div class="detail-row"><strong>${t.lblGroupSize}:</strong> <span>${item.group_size || 0}</span></div>
      <div class="detail-row"><strong>Статус оплаты:</strong> <span>${t['opt' + item.payment_status.charAt(0).toUpperCase() + item.payment_status.slice(1)]}</span></div>
    `;
    if (item.payment_status === 'partial') {
      const rem = Math.max(0, (item.price || 0) - (item.paid_amount || 0));
      html += `
        <div class="detail-row"><strong>${t.lblPaidAmount}:</strong> <span>${formatCurrency(item.paid_amount, item.currency)}</span></div>
        <div class="detail-row"><strong>${t.lblRemainingAmount}:</strong> <span style="color:var(--danger); font-weight:700;">${formatCurrency(rem, item.currency)}</span></div>
      `;
    }
  }

  if (item.notes) {
    html += `<div class="detail-row" style="flex-direction:column; align-items:flex-start; gap:4px; margin-top:8px;"><strong>${t.lblNotes}:</strong><span style="background:var(--surface2); width:100%; padding:8px; border-radius:var(--radius-xs); border:1px solid var(--border); font-size:.85rem;">${escapeHtml(item.notes)}</span></div>`;
  }

  if (detailModalBody) detailModalBody.innerHTML = html;
  openModal(detailModal);
}

function onDetailEditClick() {
  const id = detailModalBody?.getAttribute('data-id');
  if (id) openBookingModalForEdit(id);
}

function onDetailDuplicateClick() {
  const id = detailModalBody?.getAttribute('data-id');
  const item = bookings.find(b => b.id === id);
  if (!item) return;

  const duplicated = {
    ...item,
    id: generateId(),
    route_id: undefined
  };

  bookings.push(duplicated);
  saveData();
  closeModal(detailModal);
  render();
  openBookingModalForEdit(duplicated.id);
}

function getFilteredBookings() {
  const q = searchInput?.value.toLowerCase().trim() || '';
  const st = filterStatus?.value || '';
  const targetYear = currentNavDate.getFullYear();
  const targetMonth = currentNavDate.getMonth();

  return bookings.filter(b => {
    const d = new Date(b.date);
    if (d.getFullYear() !== targetYear || d.getMonth() !== targetMonth) return false;
    if (st && b.status !== st) return false;

    if (q) {
      const city = (b.city || '').toLowerCase();
      const client = (b.client_name || '').toLowerCase();
      const tour = (b.tour_name || '').toLowerCase();
      const notes = (b.notes || '').toLowerCase();
      if (!city.includes(q) && !client.includes(q) && !tour.includes(q) && !notes.includes(q)) return false;
    }
    return true;
  });
}

function render() {
  // Защита: рендерим календарь только если само PMS-приложение открыто на экране
  if (mainApp.classList.contains('hidden-panel')) return;

  const activeBookings = getFilteredBookings();
  if (filterCountEl) filterCountEl.textContent = activeBookings.length;

  const year = currentNavDate.getFullYear();
  const month = currentNavDate.getMonth();
  const lang = langSelect.value;

  const names = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  
  if (currentMonthYearEl) {
    currentMonthYearEl.textContent = `${names[month]} ${year}`;
  }

  renderSidebarStats(activeBookings);

  if (currentView === 'grid') {
    renderGridView(year, month, activeBookings);
  } else {
    renderListView(activeBookings);
  }
}

function renderSidebarStats(monthItems) {
  let exc = 0, busy = 0, hol = 0, tourists = 0;
  let incMap = {};

  monthItems.forEach(b => {
    if (b.status === 'excursion') {
      exc++;
      tourists += (b.group_size || 0);
      const cur = b.currency || 'UZS';
      incMap[cur] = (incMap[cur] || 0) + (b.price || 0);
    }
    else if (b.status === 'busy') busy++;
    else if (b.status === 'holiday') hol++;
  });

  setTxt('statExcursions', exc);
  setTxt('statBusy', busy);
  setTxt('statHoliday', hol);
  setTxt('statTourists', tourists);

  const incList = document.getElementById('incomeList');
  if (incList) {
    incList.innerHTML = '';
    const curs = Object.keys(incMap);
    if (curs.length === 0) {
      incList.innerHTML = `<div class="income-row">0 UZS</div>`;
    } else {
      curs.forEach(c => {
        const row = document.createElement('div');
        row.className = 'income-row';
        row.innerHTML = `<span>${c}:</span> <strong>${incMap[c].toLocaleString()}</strong>`;
        incList.appendChild(row);
      });
    }
  }
}

function renderGridView(year, month, activeBookings) {
  if (!gridViewEl) return;
  gridViewEl.innerHTML = '';
  
  const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  labels.forEach(l => {
    const d = document.createElement('div');
    d.className = 'day-label';
    d.textContent = l;
    gridViewEl.appendChild(d);
  });

  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset === -1) startOffset = 6; 

  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.className = 'day-cell empty';
    gridViewEl.appendChild(empty);
  }

  const todayStr = toDateString(new Date());

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement('div');
    const dStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    cell.className = 'day-cell';
    if (dStr === todayStr) cell.classList.add('today');

    const dayNum = document.createElement('div');
    dayNum.className = 'day-num';
    dayNum.textContent = day;
    cell.appendChild(dayNum);

    const dayItems = activeBookings.filter(b => b.date === dStr);
    dayItems.sort((a,b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));

    const pillsContainer = document.createElement('div');
    pillsContainer.className = 'pills-container';

    dayItems.slice(0, 3).forEach(item => {
      const pill = document.createElement('div');
      pill.className = `booking-pill status-${item.status}`;
      
      if (item.status === 'excursion') {
        const timeStr = item.start_time ? `${item.start_time} ` : '';
        pill.textContent = `${timeStr}${item.city || 'Тур'}`;
      } else {
        const lang = langSelect.value;
        pill.textContent = TRANSLATIONS[lang]['leg' + item.status.charAt(0).toUpperCase() + item.status.slice(1)];
      }
      
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetailModalView(item.id);
      });
      pillsContainer.appendChild(pill);
    });

    if (dayItems.length > 3) {
      const more = document.createElement('div');
      more.className = 'more-indicator';
      more.textContent = `+${dayItems.length - 3}`;
      pillsContainer.appendChild(more);
    }

    cell.appendChild(pillsContainer);

    const dayExcPrice = dayItems.filter(b => b.status === 'excursion').reduce((acc, curr) => acc + (curr.price || 0), 0);
    if (dayExcPrice > 0) {
      const incBadge = document.createElement('div');
      incBadge.className = 'day-income-badge';
      incBadge.textContent = dayExcPrice >= 1000 ? (dayExcPrice/1000).toFixed(0)+'k' : dayExcPrice;
      cell.appendChild(incBadge);
    }

    cell.addEventListener('click', () => {
      openBookingModalForNew(dStr);
    });

    gridViewEl.appendChild(cell);
  }
}

function renderListView(activeBookings) {
  if (!listViewEl) return;
  listViewEl.innerHTML = '';
  const lang = langSelect.value;
  
  if (activeBookings.length === 0) {
    listViewEl.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:40px 20px;">${TRANSLATIONS[lang].noEvents}</div>`;
    return;
  }

  activeBookings.sort((a,b) => a.date.localeCompare(b.date));

  activeBookings.forEach(item => {
    const row = document.createElement('div');
    row.className = 'list-item';
    
    const typeLabel = TRANSLATIONS[lang]['leg' + item.status.charAt(0).toUpperCase() + item.status.slice(1)];
    
    let sub = item.notes || '';
    if (item.status === 'excursion') {
      sub = `${item.city || ''} | ${item.client_name || ''} | ${formatCurrency(item.price, item.currency)}`;
    }

    row.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span class="list-item-date">${item.date} ${item.start_time ? `[${item.start_time}]` : ''}</span>
        <strong class="list-item-title">${item.status === 'excursion' ? item.tour_name : typeLabel}</strong>
        <span class="list-item-subtitle">${sub}</span>
      </div>
      <div class="badge status-${item.status}" style="font-size: .7rem; padding: 4px 8px;">${typeLabel}</div>
    `;

    row.addEventListener('click', () => openDetailModalView(item.id));
    listViewEl.appendChild(row);
  });
}

function openStatsModalView() {
  statsYear = currentNavDate.getFullYear();
  renderStatsModalContent();
  openModal(statsModal);
}

function renderStatsModalContent() {
  if (statsModalYearLabel) statsModalYearLabel.textContent = statsYear;
  if (!statsModalBody) return;
  statsModalBody.innerHTML = '';

  const lang = langSelect.value;
  const t = TRANSLATIONS[lang];

  const mNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  let tableHtml = `
    <table class="stats-table" style="width:100%; border-collapse:collapse; font-size:.85rem; text-align:left;">
      <thead>
        <tr style="border-bottom:2px solid var(--border); color:var(--text-muted);">
          <th style="padding:8px 4px;">Месяц</th>
          <th style="padding:8px 4px; text-align:center;">${t.statsExcursions}</th>
          <th style="padding:8px 4px; text-align:center;">${t.statsBusy}</th>
          <th style="padding:8px 4px; text-align:right;">Доход</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let m = 0; m < 12; m++) {
    const mItems = bookings.filter(b => {
      const d = new Date(b.date);
      return d.getFullYear() === statsYear && d.getMonth() === m;
    });

    let exc = 0, busy = 0;
    let incMap = {};
    mItems.forEach(b => {
      if (b.status === 'excursion') {
        exc++;
        incMap[b.currency || 'UZS'] = (incMap[b.currency || 'UZS'] || 0) + (b.price || 0);
      } else if (b.status === 'busy') {
        busy++;
      }
    });

    let incStr = '0';
    const keys = Object.keys(incMap);
    if (keys.length > 0) {
      incStr = keys.map(k => `${incMap[k].toLocaleString()} ${k}`).join('<br>');
    }

    tableHtml += `
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:8px 4px; font-weight:600;">${mNames[m]}</td>
        <td style="padding:8px 4px; text-align:center; color:var(--primary); font-weight:700;">${exc}</td>
        <td style="padding:8px 4px; text-align:center; color:var(--danger);">${busy}</td>
        <td style="padding:8px 4px; text-align:right; font-weight:700; color:var(--success); font-size:.8rem; line-height:1.2;">${incStr}</td>
      </tr>
    `;
  }

  tableHtml += `</tbody></table>`;
  statsModalBody.innerHTML = tableHtml;
}

// Хелперы и функции защиты твоего оригинального кода
function formatCurrency(value, currency) {
  const locale = langSelect.value === 'en' ? 'en-US' : 'ru-RU';
  return `${(value || 0).toLocaleString(locale, { maximumFractionDigits: 0 })} ${currency || 'UZS'}`;
}

function toDateString(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function generateId() {
  return `id-${Math.random().toString(36).slice(2, 11)}`;
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

function setTxtBySelector(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Запуск
init();
