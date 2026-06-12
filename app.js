/* ===================================================
   TOUR FLOW — GUIDE CALENDAR
   Sprint 1: file structure, encoding, mobile header, mobile forms
   =================================================== */

'use strict';

const STORAGE_KEYS = {
  bookings: 'tour_flow_bookings',
  settings: 'tour_flow_settings'
};

const STATUS_CONFIG = {
  excursion: { color: '#2563eb', bg: '#dbeafe', icon: 'fa-map-marked-alt' },
  busy:      { color: '#dc2626', bg: '#fee2e2', icon: 'fa-ban' },
  holiday:   { color: '#16a34a', bg: '#dcfce7', icon: 'fa-umbrella-beach' },
  personal:  { color: '#d97706', bg: '#fef3c7', icon: 'fa-user-clock' }
};

const TRANSLATIONS = {
  ru: {
    title: 'Tour Flow',
    subtitle: 'Календарь экскурсовода',
    calendarHint: 'Планируйте экскурсии, занятые и свободные дни',
    gridBtn: 'Сетка',
    listBtn: 'Список',
    todayBtn: 'Сегодня',
    addBtn: 'Добавить',
    routeBtn: 'Маршрут',
    statTitle: 'Статистика месяца',
    incomeTitle: 'Доход за месяц',
    legendTitle: 'Обозначения',
    statsExcursions: 'Экскурсии',
    statsBusy: 'Занят',
    statsHoliday: 'Выходной',
    statsTourists: 'Туристы',
    statuses: {
      excursion: 'Экскурсия',
      busy: 'Занят',
      holiday: 'Выходной',
      personal: 'Личное'
    },
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    emptyMonth: 'На этот месяц записей пока нет',
    noDetails: 'Нет данных',
    modalNew: 'Новая запись',
    modalEdit: 'Редактировать запись',
    routeModalTitle: 'Бронь маршрута',
    detailTitle: 'Информация о дне',
    detailEdit: 'Редактировать',
    close: 'Закрыть',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    generateDays: 'Сгенерировать дни',
    labels: {
      status: 'Статус / Тип дня',
      date: 'Дата',
      city: 'Город',
      client: 'Заказчик',
      tour: 'Название экскурсии',
      start: 'Начало',
      end: 'Окончание',
      price: 'Стоимость',
      currency: 'Валюта',
      group: 'Количество туристов',
      notes: 'Заметки / Пожелания',
      routeStart: 'Дата начала',
      routeEnd: 'Дата окончания',
      routeClient: 'Заказчик',
      routeGroup: 'Количество туристов',
      routeCurrency: 'Валюта по умолчанию',
      routeNotes: 'Общие заметки'
    },
    placeholders: {
      city: 'Самарканд, Бухара...',
      client: 'Восток Тур',
      tour: 'Сердце Самарканда',
      price: '0',
      group: '15',
      notes: 'Дополнительная информация...',
      routeClient: 'Название компании',
      routeGroup: '15',
      routeNotes: 'Группа из 15 человек, без Шахрисабза...',
      routeCity: 'Город',
      routeTour: 'Программа дня'
    },
    confirmDeleteTitle: 'Удалить запись?',
    confirmDeleteText: 'Это действие нельзя отменить.',
    validation: {
      routeDates: 'Дата окончания не может быть раньше даты начала',
      routeDaysEmpty: 'Сначала сгенерируйте дни маршрута',
      bookingDateRequired: 'Укажите дату записи',
      bookingSaved: 'Запись сохранена',
      bookingDeleted: 'Запись удалена',
      routeSaved: 'Маршрут сохранён',
      routeGenerated: 'Дни маршрута созданы',
      routeRequiredFields: 'Заполните хотя бы город для каждого дня маршрута'
    },
    detail: {
      date: 'Дата',
      status: 'Статус',
      city: 'Город',
      client: 'Заказчик',
      tour: 'Экскурсия',
      group: 'Туристы',
      price: 'Стоимость',
      time: 'Время',
      notes: 'Заметки',
      noValue: '—'
    },
    more: 'ещё',
    touristsShort: 'чел.'
  },
  en: {
    title: 'Tour Flow',
    subtitle: 'Guide Calendar',
    calendarHint: 'Plan tours, busy and free days',
    gridBtn: 'Grid',
    listBtn: 'List',
    todayBtn: 'Today',
    addBtn: 'Add',
    routeBtn: 'Route',
    statTitle: 'Monthly Stats',
    incomeTitle: 'Monthly Income',
    legendTitle: 'Legend',
    statsExcursions: 'Tours',
    statsBusy: 'Busy',
    statsHoliday: 'Holiday',
    statsTourists: 'Tourists',
    statuses: {
      excursion: 'Tour',
      busy: 'Busy',
      holiday: 'Holiday',
      personal: 'Personal'
    },
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    emptyMonth: 'No bookings for this month yet',
    noDetails: 'No data',
    modalNew: 'New Booking',
    modalEdit: 'Edit Booking',
    routeModalTitle: 'Route Booking',
    detailTitle: 'Day Details',
    detailEdit: 'Edit',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    generateDays: 'Generate days',
    labels: {
      status: 'Status / Day type',
      date: 'Date',
      city: 'City',
      client: 'Client',
      tour: 'Tour name',
      start: 'Start',
      end: 'End',
      price: 'Price',
      currency: 'Currency',
      group: 'Tourists',
      notes: 'Notes',
      routeStart: 'Start date',
      routeEnd: 'End date',
      routeClient: 'Client',
      routeGroup: 'Tourists',
      routeCurrency: 'Default currency',
      routeNotes: 'General notes'
    },
    placeholders: {
      city: 'Samarkand, Bukhara...',
      client: 'Vostok Tour',
      tour: 'Heart of Samarkand',
      price: '0',
      group: '15',
      notes: 'Additional information...',
      routeClient: 'Company name',
      routeGroup: '15',
      routeNotes: 'Group of 15 people, without Shakhrisabz...',
      routeCity: 'City',
      routeTour: 'Day program'
    },
    confirmDeleteTitle: 'Delete booking?',
    confirmDeleteText: 'This action cannot be undone.',
    validation: {
      routeDates: 'End date cannot be earlier than start date',
      routeDaysEmpty: 'Generate route days first',
      bookingDateRequired: 'Please select a booking date',
      bookingSaved: 'Booking saved',
      bookingDeleted: 'Booking deleted',
      routeSaved: 'Route saved',
      routeGenerated: 'Route days generated',
      routeRequiredFields: 'Please fill at least the city for each route day'
    },
    detail: {
      date: 'Date',
      status: 'Status',
      city: 'City',
      client: 'Client',
      tour: 'Tour',
      group: 'Tourists',
      price: 'Price',
      time: 'Time',
      notes: 'Notes',
      noValue: '—'
    },
    more: 'more',
    touristsShort: 'people'
  },
  uz: {
    title: 'Tour Flow',
    subtitle: 'Gid taqvimi',
    calendarHint: 'Ekskursiyalar, band va bo‘sh kunlarni rejalashtiring',
    gridBtn: 'Setka',
    listBtn: 'Roʻyxat',
    todayBtn: 'Bugun',
    addBtn: 'Qoʻshish',
    routeBtn: 'Yoʻnalish',
    statTitle: 'Oylik statistika',
    incomeTitle: 'Oylik daromad',
    legendTitle: 'Belgilar',
    statsExcursions: 'Ekskursiyalar',
    statsBusy: 'Band',
    statsHoliday: 'Dam olish',
    statsTourists: 'Turistlar',
    statuses: {
      excursion: 'Ekskursiya',
      busy: 'Band',
      holiday: 'Dam olish',
      personal: 'Shaxsiy'
    },
    weekdays: ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Yak'],
    months: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
    emptyMonth: 'Bu oy uchun yozuvlar hali yoʻq',
    noDetails: 'Maʼlumot yoʻq',
    modalNew: 'Yangi yozuv',
    modalEdit: 'Yozuvni tahrirlash',
    routeModalTitle: 'Yoʻnalish broni',
    detailTitle: 'Kun maʼlumotlari',
    detailEdit: 'Tahrirlash',
    close: 'Yopish',
    cancel: 'Bekor qilish',
    save: 'Saqlash',
    delete: 'Oʻchirish',
    generateDays: 'Kunlarni yaratish',
    labels: {
      status: 'Holat / Kun turi',
      date: 'Sana',
      city: 'Shahar',
      client: 'Buyurtmachi',
      tour: 'Ekskursiya nomi',
      start: 'Boshlanishi',
      end: 'Tugashi',
      price: 'Narx',
      currency: 'Valyuta',
      group: 'Turistlar soni',
      notes: 'Izohlar',
      routeStart: 'Boshlanish sanasi',
      routeEnd: 'Tugash sanasi',
      routeClient: 'Buyurtmachi',
      routeGroup: 'Turistlar soni',
      routeCurrency: 'Asosiy valyuta',
      routeNotes: 'Umumiy izohlar'
    },
    placeholders: {
      city: 'Samarqand, Buxoro...',
      client: 'Vostok Tour',
      tour: 'Samarqand yuragi',
      price: '0',
      group: '15',
      notes: 'Qoʻshimcha maʼlumot...',
      routeClient: 'Kompaniya nomi',
      routeGroup: '15',
      routeNotes: '15 kishilik guruh, Shahrisabzsiz...',
      routeCity: 'Shahar',
      routeTour: 'Kun dasturi'
    },
    confirmDeleteTitle: 'Yozuv oʻchirilsinmi?',
    confirmDeleteText: 'Bu amalni bekor qilib boʻlmaydi.',
    validation: {
      routeDates: 'Tugash sanasi boshlanish sanasidan oldin bo‘lishi mumkin emas',
      routeDaysEmpty: 'Avval yoʻnalish kunlarini yarating',
      bookingDateRequired: 'Yozuv sanasini kiriting',
      bookingSaved: 'Yozuv saqlandi',
      bookingDeleted: 'Yozuv oʻchirildi',
      routeSaved: 'Yoʻnalish saqlandi',
      routeGenerated: 'Yoʻnalish kunlari yaratildi',
      routeRequiredFields: 'Har bir kun uchun kamida shaharni kiriting'
    },
    detail: {
      date: 'Sana',
      status: 'Holat',
      city: 'Shahar',
      client: 'Buyurtmachi',
      tour: 'Ekskursiya',
      group: 'Turistlar',
      price: 'Narx',
      time: 'Vaqt',
      notes: 'Izohlar',
      noValue: '—'
    },
    more: 'yana',
    touristsShort: 'kishi'
  }
};

let state = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  currentView: 'grid',
  currentLang: 'ru',
  bookings: []
};

/* ======================== INIT ======================== */
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadBookings();
  initDOMEvents();
  updateInterfaceLanguage();
  render();
});

function initDOMEvents() {
  safeClick('prevMonthBtn', () => changeMonth(-1));
  safeClick('nextMonthBtn', () => changeMonth(1));
  safeClick('todayBtn', goToToday);
  safeClick('viewGridBtn', () => switchView('grid'));
  safeClick('viewListBtn', () => switchView('list'));
  safeClick('addBookingBtn', () => openBookingModal());
  safeClick('mobileAddBookingBtn', () => openBookingModal());
  safeClick('addRouteBtn', openRouteModal);

  safeClick('closeBookingModal', closeBookingModal);
  safeClick('cancelBookingBtn', closeBookingModal);
  safeSubmit('bookingForm', onBookingFormSubmit);
  safeClick('deleteBookingBtn', onDeleteBookingClick);

  safeClick('closeRouteModal', closeRouteModal);
  safeClick('cancelRouteBtn', closeRouteModal);
  safeClick('btnGenerateRouteDays', generateRouteDaysRows);
  safeSubmit('routeForm', onRouteFormSubmit);

  safeClick('closeDetailModal', closeDetailModal);
  safeClick('closeDetailModal2', closeDetailModal);

  document.querySelectorAll('input[name="status"]').forEach((radio) => {
    radio.addEventListener('change', (e) => toggleConditionalFields(e.target.value));
  });

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

  bindModalBackdropClose();
  bindEscClose();
}

function bindModalBackdropClose() {
  ['bookingModal', 'routeModal', 'detailModal'].forEach((id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target !== modal) return;
      if (id === 'bookingModal') closeBookingModal();
      if (id === 'routeModal') closeRouteModal();
      if (id === 'detailModal') closeDetailModal();
    });
  });
}

function bindEscClose() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeBookingModal();
    closeRouteModal();
    closeDetailModal();
    closeConfirmDialog();
  });
}

/* ======================== STORAGE ======================== */
function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.currentLang && TRANSLATIONS[saved.currentLang]) state.currentLang = saved.currentLang;
    if (saved.currentView === 'grid' || saved.currentView === 'list') state.currentView = saved.currentView;
  } catch (error) {
    console.warn('Settings load error:', error);
  }
}

function persistSettings() {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({
    currentLang: state.currentLang,
    currentView: state.currentView
  }));
}

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.bookings);
    state.bookings = raw ? normalizeBookingsArray(JSON.parse(raw)) : [];
  } catch (error) {
    console.warn('Bookings load error:', error);
    state.bookings = [];
  }
}

function persistBookings() {
  localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(state.bookings));
}

function normalizeBookingsArray(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter(Boolean)
    .map((item) => ({
      id: item.id || generateId(),
      date: item.date || '',
      status: ['excursion', 'busy', 'holiday', 'personal'].includes(item.status) ? item.status : 'excursion',
      city: item.city || '',
      client_name: item.client_name || '',
      tour_name: item.tour_name || '',
      start_time: item.start_time || '',
      end_time: item.end_time || '',
      price: Number(item.price) || 0,
      currency: item.currency || 'UZS',
      group_size: Number(item.group_size) || 0,
      notes: item.notes || ''
    }))
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}

/* ======================== TRANSLATIONS ======================== */
function t() {
  return TRANSLATIONS[state.currentLang] || TRANSLATIONS.ru;
}

function updateInterfaceLanguage() {
  const tr = t();
  document.documentElement.lang = state.currentLang;
  document.title = `${tr.title} — ${tr.subtitle}`;

  setTxt('appTitle', tr.title);
  setTxt('appSubtitle', tr.subtitle);
  setTxt('calendarHint', tr.calendarHint);

  setTxt('addBookingBtnText', tr.addBtn);
  setTxt('addRouteBtnText', tr.routeBtn);
  setTxt('viewGridBtnText', tr.gridBtn);
  setTxt('viewListBtnText', tr.listBtn);
  setTxt('todayBtn', tr.todayBtn);

  setTxt('statTitle', tr.statTitle);
  setTxt('incomeTitle', tr.incomeTitle);
  setTxt('legendTitle', tr.legendTitle);
  setTxt('statsExcursionsLabel', tr.statsExcursions);
  setTxt('statsBusyLabel', tr.statsBusy);
  setTxt('statsHolidayLabel', tr.statsHoliday);
  setTxt('statsTouristsLabel', tr.statsTourists);

  setTxt('legendExcursion', tr.statuses.excursion);
  setTxt('legendBusy', tr.statuses.busy);
  setTxt('legendHoliday', tr.statuses.holiday);
  setTxt('legendPersonal', tr.statuses.personal);

  setTxt('modalTitle', document.getElementById('bookingId')?.value ? tr.modalEdit : tr.modalNew);
  setTxt('routeModalTitle', tr.routeModalTitle);
  setTxt('detailModalTitle', tr.detailTitle);
  setTxt('detailEditBtnText', tr.detailEdit);
  setTxt('closeDetailModal2', tr.close);
  setTxt('cancelBookingBtn', tr.cancel);
  setTxt('saveBookingBtn', tr.save);
  setTxt('deleteBookingBtn', tr.delete);
  setTxt('cancelRouteBtn', tr.cancel);
  setTxt('saveRouteBtn', tr.save);
  setTxt('btnGenerateRouteDaysText', tr.generateDays);

  setTxt('lblStatus', tr.labels.status);
  setTxt('lblDate', tr.labels.date);
  setTxt('lblCity', tr.labels.city);
  setTxt('lblClient', tr.labels.client);
  setTxt('lblTour', tr.labels.tour);
  setTxt('lblStart', tr.labels.start);
  setTxt('lblEnd', tr.labels.end);
  setTxt('lblPrice', tr.labels.price);
  setTxt('lblCurrency', tr.labels.currency);
  setTxt('lblGroup', tr.labels.group);
  setTxt('lblNotes', tr.labels.notes);

  setTxt('lblRouteStart', tr.labels.routeStart);
  setTxt('lblRouteEnd', tr.labels.routeEnd);
  setTxt('lblRouteClient', tr.labels.routeClient);
  setTxt('lblRouteGroup', tr.labels.routeGroup);
  setTxt('lblRouteCurrency', tr.labels.routeCurrency);
  setTxt('lblRouteNotes', tr.labels.routeNotes);

  setTxt('statusExcursionText', tr.statuses.excursion);
  setTxt('statusBusyText', tr.statuses.busy);
  setTxt('statusHolidayText', tr.statuses.holiday);
  setTxt('statusPersonalText', tr.statuses.personal);

  setAttr('bookingCity', 'placeholder', tr.placeholders.city);
  setAttr('bookingClient', 'placeholder', tr.placeholders.client);
  setAttr('bookingTour', 'placeholder', tr.placeholders.tour);
  setAttr('bookingPrice', 'placeholder', tr.placeholders.price);
  setAttr('bookingGroup', 'placeholder', tr.placeholders.group);
  setAttr('bookingNotes', 'placeholder', tr.placeholders.notes);
  setAttr('routeClient', 'placeholder', tr.placeholders.routeClient);
  setAttr('routeGroupSize', 'placeholder', tr.placeholders.routeGroup);
  setAttr('routeNotes', 'placeholder', tr.placeholders.routeNotes);

  const mobileAdd = document.getElementById('mobileAddBookingBtn');
  if (mobileAdd) mobileAdd.setAttribute('aria-label', tr.addBtn);

  renderRouteDayPlaceholders();
}

/* ======================== NAVIGATION ======================== */
function goToToday() {
  state.currentYear = new Date().getFullYear();
  state.currentMonth = new Date().getMonth();
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
  render();
}

function switchView(view) {
  state.currentView = view;
  persistSettings();

  const gridBtn = document.getElementById('viewGridBtn');
  const listBtn = document.getElementById('viewListBtn');
  if (gridBtn) gridBtn.classList.toggle('active', view === 'grid');
  if (listBtn) listBtn.classList.toggle('active', view === 'list');

  render();
}

/* ======================== RENDER ======================== */
function render() {
  const tr = t();
  setTxt('currentMonthLabel', `${tr.months[state.currentMonth]} ${state.currentYear}`);

  calculateAndRenderStats();

  const gridView = document.getElementById('calendar-grid-view');
  const listView = document.getElementById('calendar-list-view');
  const isGrid = state.currentView === 'grid';

  if (gridView) gridView.style.display = isGrid ? 'block' : 'none';
  if (listView) listView.style.display = isGrid ? 'none' : 'block';

  if (isGrid) {
    renderGrid();
  } else {
    renderList();
  }
}

function calculateAndRenderStats() {
  const currentPrefix = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
  const monthly = state.bookings.filter((booking) => booking.date?.startsWith(currentPrefix));

  const excursions = monthly.filter((booking) => booking.status === 'excursion');
  const busyCount = monthly.filter((booking) => booking.status === 'busy').length;
  const holidayCount = monthly.filter((booking) => booking.status === 'holiday').length;
  const touristsCount = excursions.reduce((sum, booking) => sum + (Number(booking.group_size) || 0), 0);

  const wallet = {};
  excursions.forEach((booking) => {
    if (!booking.price) return;
    const currency = booking.currency || 'UZS';
    wallet[currency] = (wallet[currency] || 0) + Number(booking.price);
  });

  setTxt('excursions-count', excursions.length);
  setTxt('busy-count', busyCount);
  setTxt('holiday-count', holidayCount);
  setTxt('tourists-count', touristsCount);

  const incomeEl = document.getElementById('total-income');
  if (!incomeEl) return;

  const currencies = Object.keys(wallet);
  if (currencies.length === 0) {
    incomeEl.innerHTML = `<div class="income-amount">0 UZS</div>`;
    return;
  }

  incomeEl.innerHTML = currencies
    .map((currency) => `<div class="income-amount">${formatCurrency(wallet[currency], currency)}</div>`)
    .join('');
}

function renderGrid() {
  renderWeekdays();

  const grid = document.getElementById('calendarGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const firstDayOfMonth = new Date(state.currentYear, state.currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(state.currentYear, state.currentMonth, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const today = new Date();
  const todayString = toDateString(today);
  const isMobile = window.innerWidth <= 768;
  const visiblePills = isMobile ? 2 : 3;

  for (let i = 0; i < totalCells; i += 1) {
    let dayNumber;
    let month = state.currentMonth;
    let year = state.currentYear;
    let isCurrentMonth = true;

    if (i < startOffset) {
      dayNumber = daysInPrevMonth - startOffset + i + 1;
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
    const dayBookings = state.bookings.filter((booking) => booking.date === cellDate);

    const cell = document.createElement('div');
    cell.className = 'day-cell';
    if (!isCurrentMonth) cell.classList.add('other-month');
    if (cellDate === todayString) cell.classList.add('today');
    if (i % 7 === 5 || i % 7 === 6) cell.classList.add('weekend-cell');

    cell.innerHTML = `<div class="day-num">${dayNumber}</div>`;

    dayBookings.slice(0, visiblePills).forEach((booking) => {
      cell.appendChild(createBookingPill(booking));
    });

    if (dayBookings.length > visiblePills) {
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'more-pill';
      more.textContent = `+${dayBookings.length - visiblePills} ${t().more}`;
      more.addEventListener('click', (event) => {
        event.stopPropagation();
        switchView('list');
      });
      cell.appendChild(more);
    }

    cell.addEventListener('click', () => openBookingModal(null, cellDate));
    grid.appendChild(cell);
  }
}

function createBookingPill(booking) {
  const pill = document.createElement('div');
  const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
  pill.className = 'booking-pill';
  pill.style.backgroundColor = conf.bg;
  pill.style.color = conf.color;
  pill.style.borderLeftColor = conf.color;

  const label = booking.status === 'excursion'
    ? `${booking.city ? `[${booking.city}] ` : ''}${booking.client_name || getStatusLabel('excursion')}`
    : getStatusLabel(booking.status);

  pill.textContent = label;
  pill.addEventListener('click', (event) => {
    event.stopPropagation();
    openDetailModal(booking);
  });
  return pill;
}

function renderList() {
  const container = document.getElementById('list-view-container');
  if (!container) return;

  const prefix = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
  const monthly = state.bookings
    .filter((booking) => booking.date?.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (monthly.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-xmark"></i>
        <div>${t().emptyMonth}</div>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  monthly.forEach((booking) => {
    const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div class="list-item-info">
        <strong>${escapeHtml(booking.date)} — ${escapeHtml(getListPrimaryLabel(booking))}</strong>
        <div class="list-item-meta">${escapeHtml(getListMeta(booking))}</div>
      </div>
      <span class="list-item-badge" style="background:${conf.bg};color:${conf.color};">${escapeHtml(getStatusLabel(booking.status))}</span>
    `;
    item.addEventListener('click', () => openDetailModal(booking));
    container.appendChild(item);
  });
}

function renderWeekdays() {
  const header = document.getElementById('weekdaysHeader');
  if (!header) return;
  header.innerHTML = t().weekdays.map((day) => `<div class="weekday-label">${day}</div>`).join('');
}

/* ======================== BOOKING MODAL ======================== */
function openBookingModal(booking = null, defaultDate = '') {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const form = document.getElementById('bookingForm');
  if (form) form.reset();

  if (booking) {
    setTxt('modalTitle', t().modalEdit);
    setVal('bookingId', booking.id);
    setVal('bookingDate', booking.date || '');
    setVal('bookingCity', booking.city || '');
    setVal('bookingClient', booking.client_name || '');
    setVal('bookingTour', booking.tour_name || '');
    setVal('bookingStart', booking.start_time || '09:00');
    setVal('bookingEnd', booking.end_time || '18:00');
    setVal('bookingPrice', booking.price || '');
    setVal('bookingGroup', booking.group_size || '');
    setVal('bookingNotes', booking.notes || '');
    setVal('bookingCurrency', booking.currency || 'UZS');

    const radio = document.querySelector(`input[name="status"][value="${booking.status}"]`);
    if (radio) radio.checked = true;

    const deleteBtn = document.getElementById('deleteBookingBtn');
    if (deleteBtn) deleteBtn.style.display = 'inline-flex';
    toggleConditionalFields(booking.status);
  } else {
    setTxt('modalTitle', t().modalNew);
    setVal('bookingId', '');
    setVal('bookingDate', defaultDate || toDateString(new Date()));
    setVal('bookingStart', '09:00');
    setVal('bookingEnd', '18:00');
    setVal('bookingCurrency', 'UZS');
    const excursionRadio = document.getElementById('statusExcursion');
    if (excursionRadio) excursionRadio.checked = true;

    const deleteBtn = document.getElementById('deleteBookingBtn');
    if (deleteBtn) deleteBtn.style.display = 'none';
    toggleConditionalFields('excursion');
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function toggleConditionalFields(status) {
  const conditional = document.getElementById('conditionalFields');
  if (!conditional) return;
  conditional.style.display = status === 'excursion' ? 'block' : 'none';
}

function onBookingFormSubmit(event) {
  event.preventDefault();
  const id = getVal('bookingId');
  const status = document.querySelector('input[name="status"]:checked')?.value || 'excursion';
  const date = getVal('bookingDate');

  if (!date) {
    showToast(t().validation.bookingDateRequired, 'warning');
    return;
  }

  const booking = {
    id: id || generateId(),
    date,
    status,
    city: getVal('bookingCity').trim(),
    client_name: getVal('bookingClient').trim(),
    tour_name: getVal('bookingTour').trim(),
    start_time: getVal('bookingStart'),
    end_time: getVal('bookingEnd'),
    price: Number(getVal('bookingPrice')) || 0,
    currency: getVal('bookingCurrency') || 'UZS',
    group_size: Number(getVal('bookingGroup')) || 0,
    notes: getVal('bookingNotes').trim()
  };

  if (id) {
    const index = state.bookings.findIndex((item) => item.id === id);
    if (index !== -1) state.bookings[index] = booking;
  } else {
    state.bookings.push(booking);
  }

  state.bookings = normalizeBookingsArray(state.bookings);
  persistBookings();
  closeBookingModal();
  render();
  showToast(t().validation.bookingSaved, 'success');
}

async function onDeleteBookingClick() {
  const id = getVal('bookingId');
  if (!id) return;

  const confirmed = await openConfirmDialog(t().confirmDeleteTitle, t().confirmDeleteText);
  if (!confirmed) return;

  state.bookings = state.bookings.filter((booking) => booking.id !== id);
  persistBookings();
  closeBookingModal();
  render();
  showToast(t().validation.bookingDeleted, 'success');
}

/* ======================== ROUTE MODAL ======================== */
function openRouteModal() {
  const modal = document.getElementById('routeModal');
  const form = document.getElementById('routeForm');
  if (form) form.reset();

  setVal('routeStart', toDateString(new Date()));
  setVal('routeEnd', toDateString(new Date()));
  setVal('routeCurrency', 'UZS');

  const container = document.getElementById('routeDaysContainer');
  if (container) container.innerHTML = '';

  modal?.classList.add('active');
  modal?.setAttribute('aria-hidden', 'false');
}

function closeRouteModal() {
  const modal = document.getElementById('routeModal');
  modal?.classList.remove('active');
  modal?.setAttribute('aria-hidden', 'true');
}

function generateRouteDaysRows() {
  const startString = getVal('routeStart');
  const endString = getVal('routeEnd');
  const container = document.getElementById('routeDaysContainer');
  if (!container || !startString || !endString) return;

  if (endString < startString) {
    showToast(t().validation.routeDates, 'warning');
    return;
  }

  container.innerHTML = '';
  const current = new Date(startString);
  const end = new Date(endString);

  while (current <= end) {
    const dateString = toDateString(current);
    const row = document.createElement('div');
    row.className = 'route-day-row';
    row.dataset.date = dateString;
    row.innerHTML = `
      <div class="route-day-date">${escapeHtml(dateString)}</div>
      <input type="text" class="form-control route-day-city" placeholder="${escapeHtml(t().placeholders.routeCity)}" />
      <input type="text" class="form-control route-day-tour" placeholder="${escapeHtml(t().placeholders.routeTour)}" />
    `;
    container.appendChild(row);
    current.setDate(current.getDate() + 1);
  }

  showToast(t().validation.routeGenerated, 'success');
}

function renderRouteDayPlaceholders() {
  document.querySelectorAll('.route-day-city').forEach((input) => {
    input.placeholder = t().placeholders.routeCity;
  });
  document.querySelectorAll('.route-day-tour').forEach((input) => {
    input.placeholder = t().placeholders.routeTour;
  });
}

function onRouteFormSubmit(event) {
  event.preventDefault();

  const rows = [...document.querySelectorAll('.route-day-row')];
  if (rows.length === 0) {
    showToast(t().validation.routeDaysEmpty, 'warning');
    return;
  }

  const client = getVal('routeClient').trim();
  const groupSize = Number(getVal('routeGroupSize')) || 0;
  const currency = getVal('routeCurrency') || 'UZS';
  const notes = getVal('routeNotes').trim();

  const hasEmptyRequiredRow = rows.some((row) => !row.querySelector('.route-day-city')?.value.trim());
  if (hasEmptyRequiredRow) {
    showToast(t().validation.routeRequiredFields, 'warning');
    return;
  }

  rows.forEach((row) => {
    state.bookings.push({
      id: generateId(),
      date: row.dataset.date,
      status: 'excursion',
      city: row.querySelector('.route-day-city')?.value.trim() || '',
      client_name: client,
      tour_name: row.querySelector('.route-day-tour')?.value.trim() || '',
      start_time: '',
      end_time: '',
      price: 0,
      currency,
      group_size: groupSize,
      notes
    });
  });

  state.bookings = normalizeBookingsArray(state.bookings);
  persistBookings();
  closeRouteModal();
  render();
  showToast(t().validation.routeSaved, 'success');
}

/* ======================== DETAIL MODAL ======================== */
function openDetailModal(booking) {
  const modal = document.getElementById('detailModal');
  const body = document.getElementById('detailBody');
  if (!modal || !body) return;

  const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
  const detail = t().detail;
  const timeLabel = booking.start_time || booking.end_time
    ? `${booking.start_time || detail.noValue} — ${booking.end_time || detail.noValue}`
    : detail.noValue;

  body.innerHTML = `
    <p><strong>${detail.date}:</strong> ${escapeHtml(booking.date || detail.noValue)}</p>
    <p><strong>${detail.status}:</strong> <span style="background:${conf.bg};color:${conf.color};padding:2px 6px;border-radius:6px;font-weight:700;">${escapeHtml(getStatusLabel(booking.status))}</span></p>
    ${booking.status === 'excursion' ? `
      <p><strong>${detail.city}:</strong> ${escapeHtml(booking.city || detail.noValue)}</p>
      <p><strong>${detail.client}:</strong> ${escapeHtml(booking.client_name || detail.noValue)}</p>
      <p><strong>${detail.tour}:</strong> ${escapeHtml(booking.tour_name || detail.noValue)}</p>
      <p><strong>${detail.time}:</strong> ${escapeHtml(timeLabel)}</p>
      <p><strong>${detail.group}:</strong> ${escapeHtml(String(booking.group_size || 0))} ${escapeHtml(t().touristsShort)}</p>
      <p><strong>${detail.price}:</strong> ${escapeHtml(formatCurrency(booking.price || 0, booking.currency || 'UZS'))}</p>
    ` : ''}
    ${booking.notes ? `<div class="detail-notes"><strong>${detail.notes}:</strong><br>${escapeHtml(booking.notes)}</div>` : ''}
  `;

  const editBtn = document.getElementById('detailEditBtn');
  if (editBtn) {
    editBtn.onclick = () => {
      closeDetailModal();
      openBookingModal(booking);
    };
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeDetailModal() {
  const modal = document.getElementById('detailModal');
  modal?.classList.remove('active');
  modal?.setAttribute('aria-hidden', 'true');
}

/* ======================== CONFIRM DIALOG ======================== */
function openConfirmDialog(title, text) {
  closeConfirmDialog();

  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay active';
    overlay.id = 'confirmDialog';
    overlay.innerHTML = `
      <div class="confirm-box" role="dialog" aria-modal="true">
        <h4>${escapeHtml(title)}</h4>
        <p>${escapeHtml(text)}</p>
        <div class="confirm-box-actions">
          <button type="button" class="btn btn-secondary" data-confirm-action="cancel">${escapeHtml(t().cancel)}</button>
          <button type="button" class="btn btn-danger" data-confirm-action="confirm">${escapeHtml(t().delete)}</button>
        </div>
      </div>
    `;

    const cleanup = (value) => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 150);
      resolve(value);
    };

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) cleanup(false);
    });

    overlay.querySelector('[data-confirm-action="cancel"]')?.addEventListener('click', () => cleanup(false));
    overlay.querySelector('[data-confirm-action="confirm"]')?.addEventListener('click', () => cleanup(true));

    document.body.appendChild(overlay);
  });
}

function closeConfirmDialog() {
  const dialog = document.getElementById('confirmDialog');
  if (!dialog) return;
  dialog.classList.remove('active');
  setTimeout(() => dialog.remove(), 150);
}

/* ======================== TOASTS ======================== */
function showToast(message, type = 'default') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${getToastIcon(type)}"></i><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('toast-hide'), 2600);
  setTimeout(() => toast.remove(), 3000);
}

function getToastIcon(type) {
  if (type === 'success') return 'fa-circle-check';
  if (type === 'error') return 'fa-circle-xmark';
  if (type === 'warning') return 'fa-triangle-exclamation';
  return 'fa-circle-info';
}

/* ======================== HELPERS ======================== */
function getStatusLabel(status) {
  return t().statuses[status] || t().statuses.excursion;
}

function getListPrimaryLabel(booking) {
  if (booking.status !== 'excursion') return getStatusLabel(booking.status);
  return booking.tour_name || booking.client_name || getStatusLabel('excursion');
}

function getListMeta(booking) {
  const parts = [];
  if (booking.city) parts.push(booking.city);
  if (booking.client_name) parts.push(booking.client_name);
  if (booking.start_time || booking.end_time) parts.push(`${booking.start_time || '—'} — ${booking.end_time || '—'}`);
  if (booking.price) parts.push(formatCurrency(booking.price, booking.currency || 'UZS'));
  if (booking.group_size) parts.push(`${booking.group_size} ${t().touristsShort}`);
  return parts.join(' • ') || t().noDetails;
}

function formatCurrency(amount, currency = 'UZS') {
  const locale = state.currentLang === 'ru' ? 'ru-RU' : state.currentLang === 'uz' ? 'uz-UZ' : 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  } catch {
    return `${Number(amount || 0).toLocaleString(locale)} ${currency}`;
  }
}

function toDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function generateId() {
  return `id-${Math.random().toString(36).slice(2, 11)}`;
}

function safeClick(id, callback) {
  const element = document.getElementById(id);
  if (element) element.addEventListener('click', callback);
}

function safeSubmit(id, callback) {
  const element = document.getElementById(id);
  if (element) element.addEventListener('submit', callback);
}

function setVal(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value;
}

function getVal(id) {
  const element = document.getElementById(id);
  return element ? element.value : '';
}

function setTxt(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function setAttr(id, attr, value) {
  const element = document.getElementById(id);
  if (element) element.setAttribute(attr, value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
