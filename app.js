/* ===================================================
   YOLNAMA — SPRINT 8 ENHANCEMENTS
   Payment statuses, Excel export, guide/driver fields, route day editing
   =================================================== */

'use strict';

const API = 'tables/bookings';
const STORAGE_KEYS = {
  bookings: 'tour_flow_bookings',
  settings: 'tour_flow_settings'
};

const STATUS_ORDER = ['excursion', 'busy', 'holiday', 'personal'];
const PAYMENT_STATUS_ORDER = ['unpaid', 'partial', 'paid'];

const TRANSLATIONS = {
  ru: {
    title: 'Yolnama',
    subtitle: 'Операционная система для гидов и водителей',
    gridBtn: 'Сетка',
    listBtn: 'Список',
    todayBtn: 'Сегодня',
    addSingleBtn: 'Добавить',
    addMultiBtn: 'Маршрут',
    exportBtn: 'Экспорт Excel',
    statTitle: 'Статистика месяца',
    incomeTitle: 'Доход за месяц',
    legendTitle: 'Обозначения',
    statsExcursions: 'Экскурсии',
    statsBusy: 'Занят',
    statsHoliday: 'Выходной',
    statsTourists: 'Туристы',
    searchPlaceholder: 'Поиск по городу, клиенту, экскурсии или группе',
    statusAll: 'Все статусы',
    paymentAll: 'Все платежи',
    guideAll: 'Все гиды',
    driverAll: 'Все водители',
    resetBtn: 'Сбросить',
    resultsLabel: 'Записей',
    toolbarTitle: 'Поиск и фильтры',
    toolbarHint: 'Быстрый поиск по текущему месяцу',
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
    guideLabel: 'Гид',
    driverLabel: 'Водитель',
    startLabel: 'Начало',
    endLabel: 'Окончание',
    priceLabel: 'Стоимость',
    currencyLabel: 'Валюта',
    groupLabel: 'Количество туристов',
    paymentStatusLabel: 'Статус оплаты',
    notesLabel: 'Заметки / Пожелания',
    routeStartLabel: 'Дата начала',
    routeEndLabel: 'Дата окончания',
    routeClientLabel: 'Заказчик',
    routeGroupLabel: 'Количество туристов',
    routeGuideLabel: 'Гид по умолчанию',
    routeDriverLabel: 'Водитель по умолчанию',
    routePriceLabel: 'Стоимость по умолчанию',
    routeCurrencyLabel: 'Валюта по умолчанию',
    routeNotesLabel: 'Общие заметки',
    routeGenerateBtn: 'Сгенерировать дни',
    routeEditDaysBtn: 'Редактировать дни маршрута',
    cityPlaceholder: 'Самарканд, Бухара...',
    clientPlaceholder: 'Восток Тур',
    tourPlaceholder: 'Сердце Самарканда / Group Silk Road',
    guidePlaceholder: 'Иван Петров',
    driverPlaceholder: 'Али Хасанов',
    notesPlaceholder: 'Дополнительная информация...',
    routeClientPlaceholder: 'Название компании',
    routeNotesPlaceholder: 'Группа из 15 человек, без Шахрисабза...',
    routeDayCityPlaceholder: 'Город',
    routeDayTourPlaceholder: 'Экскурсия / группа',
    deleteConfirm: 'Удалить эту запись?',
    routeGenerateFirst: 'Сначала сгенерируйте дни маршрута',
    invalidDateRange: 'Дата окончания не может быть раньше даты начала',
    invalidTimeRange: 'Время окончания не может быть раньше времени начала',
    bookingSaved: 'Запись сохранена',
    bookingDeleted: 'Запись удалена',
    routeGenerated: 'Дни маршрута созданы',
    routeSaved: 'Маршрут сохранён',
    filtersReset: 'Фильтры сброшены',
    duplicateReady: 'Запись подготовлена для дублирования',
    exportSuccess: 'Файл Excel успешно загружен',
    paymentStatuses: {
      unpaid: 'Не оплачено',
      partial: 'Частичная оплата',
      paid: 'Оплачено'
    },
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
      guide: 'Гид',
      driver: 'Водитель',
      time: 'Время',
      group: 'Туристы',
      price: 'Стоимость',
      paymentStatus: 'Статус оплаты',
      notes: 'Заметки',
      noValue: '—'
    }
  },
  en: {
    title: 'Yolnama',
    subtitle: 'Operating system for guides and drivers',
    gridBtn: 'Grid',
    listBtn: 'List',
    todayBtn: 'Today',
    addSingleBtn: 'Add',
    addMultiBtn: 'Route',
    exportBtn: 'Export Excel',
    statTitle: 'Monthly stats',
    incomeTitle: 'Monthly income',
    legendTitle: 'Legend',
    statsExcursions: 'Tours',
    statsBusy: 'Busy',
    statsHoliday: 'Holiday',
    statsTourists: 'Tourists',
    searchPlaceholder: 'Search by city, client, excursion or group',
    statusAll: 'All statuses',
    paymentAll: 'All payments',
    guideAll: 'All guides',
    driverAll: 'All drivers',
    resetBtn: 'Reset',
    resultsLabel: 'Records',
    toolbarTitle: 'Search and filters',
    toolbarHint: 'Quick search in current month',
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
    guideLabel: 'Guide',
    driverLabel: 'Driver',
    startLabel: 'Start',
    endLabel: 'End',
    priceLabel: 'Price',
    currencyLabel: 'Currency',
    groupLabel: 'Tourists count',
    paymentStatusLabel: 'Payment status',
    notesLabel: 'Notes',
    routeStartLabel: 'Start date',
    routeEndLabel: 'End date',
    routeClientLabel: 'Client',
    routeGroupLabel: 'Tourists count',
    routeGuideLabel: 'Default guide',
    routeDriverLabel: 'Default driver',
    routePriceLabel: 'Default price',
    routeCurrencyLabel: 'Default currency',
    routeNotesLabel: 'Common notes',
    routeGenerateBtn: 'Generate days',
    routeEditDaysBtn: 'Edit route days',
    cityPlaceholder: 'Samarkand, Bukhara...',
    clientPlaceholder: 'Vostok Tour',
    tourPlaceholder: 'Heart of Samarkand / Group Silk Road',
    guidePlaceholder: 'John Smith',
    driverPlaceholder: 'Ali Hassan',
    notesPlaceholder: 'Additional information...',
    routeClientPlaceholder: 'Company name',
    routeNotesPlaceholder: 'Group of 15 people, without Shakhrisabz...',
    routeDayCityPlaceholder: 'City',
    routeDayTourPlaceholder: 'Excursion / group',
    deleteConfirm: 'Delete this record?',
    routeGenerateFirst: 'Generate route days first',
    invalidDateRange: 'End date cannot be earlier than start date',
    invalidTimeRange: 'End time cannot be earlier than start time',
    bookingSaved: 'Record saved',
    bookingDeleted: 'Record deleted',
    routeGenerated: 'Route days generated',
    routeSaved: 'Route saved',
    filtersReset: 'Filters reset',
    duplicateReady: 'Record is ready to be duplicated',
    exportSuccess: 'Excel file downloaded successfully',
    paymentStatuses: {
      unpaid: 'Unpaid',
      partial: 'Partial',
      paid: 'Paid'
    },
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
      guide: 'Guide',
      driver: 'Driver',
      time: 'Time',
      group: 'Tourists',
      price: 'Price',
      paymentStatus: 'Payment status',
      notes: 'Notes',
      noValue: '—'
    }
  },
  uz: {
    title: 'Yolnama',
    subtitle: 'Gidlar va haydovchilar uchun platforma',
    gridBtn: 'Setka',
    listBtn: 'Roʻyxat',
    todayBtn: 'Bugun',
    addSingleBtn: 'Qoʻshish',
    addMultiBtn: 'Yoʻnalish',
    exportBtn: 'Excel Eksporti',
    statTitle: 'Oylik statistika',
    incomeTitle: 'Oylik daromad',
    legendTitle: 'Belgilar',
    statsExcursions: 'Ekskursiyalar',
    statsBusy: 'Band',
    statsHoliday: 'Dam olish',
    statsTourists: 'Turistlar',
    searchPlaceholder: 'Shahar, mijoz, ekskursiya yoki guruh bo\'yicha qidirish',
    statusAll: 'Barcha statuslar',
    paymentAll: 'Barcha to\'lovlar',
    guideAll: 'Barcha gidlar',
    driverAll: 'Barcha haydovchilar',
    resetBtn: 'Tozalash',
    resultsLabel: 'Yozuvlar',
    toolbarTitle: 'Qidiruv va filtrlar',
    toolbarHint: 'Joriy oy bo\'yicha tez qidiruv',
    noEvents: 'Bu oy uchun yozuvlar yoʻq',
    noResults: 'Filtrlar bo\'yicha hech narsa topilmadi',
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
    guideLabel: 'Gid',
    driverLabel: 'Haydovchi',
    startLabel: 'Boshlanish',
    endLabel: 'Tugash',
    priceLabel: 'Narx',
    currencyLabel: 'Valyuta',
    groupLabel: 'Turistlar soni',
    paymentStatusLabel: 'To\'lov holati',
    notesLabel: 'Izohlar',
    routeStartLabel: 'Boshlanish sanasi',
    routeEndLabel: 'Tugash sanasi',
    routeClientLabel: 'Mijoz',
    routeGroupLabel: 'Turistlar soni',
    routeGuideLabel: 'Standart gid',
    routeDriverLabel: 'Standart haydovchi',
    routePriceLabel: 'Standart narx',
    routeCurrencyLabel: 'Standart valyuta',
    routeNotesLabel: 'Umumiy izohlar',
    routeGenerateBtn: 'Kunlarni yaratish',
    routeEditDaysBtn: 'Yoʻnalish kunlarini tahrirlash',
    cityPlaceholder: 'Samarqand, Buxoro...',
    clientPlaceholder: 'Vostok Tour',
    tourPlaceholder: 'Samarqand yuragi / Group Silk Road',
    guidePlaceholder: 'Ibrohim Qoʻliyev',
    driverPlaceholder: 'Ali Hasan',
    notesPlaceholder: 'Qo\'shimcha maʼlumot...',
    routeClientPlaceholder: 'Kompaniya nomi',
    routeNotesPlaceholder: '15 kishilik guruh, Shahrisabzsiz...',
    routeDayCityPlaceholder: 'Shahar',
    routeDayTourPlaceholder: 'Ekskursiya / guruh',
    deleteConfirm: 'Ushbu yozuv oʻchirilsinmi?',
    routeGenerateFirst: 'Avval yoʻnalish kunlarini yarating',
    invalidDateRange: 'Tugash sanasi boshlanish sanasidan oldin bo\'lishi mumkin emas',
    invalidTimeRange: 'Tugash vaqti boshlanish vaqtidan oldin bo\'lishi mumkin emas',
    bookingSaved: 'Yozuv saqlandi',
    bookingDeleted: 'Yozuv oʻchirildi',
    routeGenerated: 'Yoʻnalish kunlari yaratildi',
    routeSaved: 'Yoʻnalish saqlandi',
    filtersReset: 'Filtrlar tozalandi',
    duplicateReady: 'Yozuv nusxa olish uchun tayyorlandi',
    exportSuccess: 'Excel fayli muvaffaqiyatli yuklab olinshdi',
    paymentStatuses: {
      unpaid: 'To\'lanmagan',
      partial: 'Qisman to\'landi',
      paid: 'To\'landi'
    },
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
      guide: 'Gid',
      driver: 'Haydovchi',
      time: 'Vaqt',
      group: 'Turistlar',
      price: 'Narx',
      paymentStatus: 'To\'lov holati',
      notes: 'Izohlar',
      noValue: '—'
    }
  }
};

const STATUS_CONFIG = {
  excursion: { icon: 'fa-map-marked-alt', color: '#2563eb', bg: '#dbeafe' },
  busy: { icon: 'fa-ban', color: '#dc2626', bg: '#fee2e2' },
  holiday: { icon: 'fa-umbrella-beach', color: '#16a34a', bg: '#dcfce7' },
  personal: { icon: 'fa-user-clock', color: '#d97706', bg: '#fef3c7' }
};

const PAYMENT_CONFIG = {
  unpaid: { color: '#dc2626', bg: '#fee2e2', icon: 'fa-circle-xmark' },
  partial: { color: '#f59e0b', bg: '#fef3c7', icon: 'fa-circle-half-stroke' },
  paid: { color: '#16a34a', bg: '#dcfce7', icon: 'fa-circle-check' }
};

const DEFAULT_FORM_DEFAULTS = {
  client_name: '',
  guide: '',
  driver: '',
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
  filters: { search: '', status: 'all', payment: 'all', guide: 'all', driver: 'all' },
  bookings: [],
  formDefaults: { ...DEFAULT_FORM_DEFAULTS },
  routeDaysData: []
};

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadBookings();
  initDOMEvents();
  updateInterfaceLanguage();
  syncControlsFromState();
  render();
});

function initDOMEvents() {
  safeClick('prevMonthBtn', () => changeMonth(-1));
  safeClick('nextMonthBtn', () => changeMonth(1));
  safeClick('todayBtn', goToToday);
  safeClick('viewGridBtn', () => switchView('grid'));
  safeClick('viewListBtn', () => switchView('list'));
  safeClick('addBookingBtn', () => openBookingModal());
  safeClick('closeBookingModal', closeBookingModal);
  safeClick('cancelBookingBtn', closeBookingModal);
  safeSubmit('bookingForm', onBookingFormSubmit);
  safeClick('deleteBookingBtn', onDeleteBookingClick);

  safeClick('addRouteBtn', openRouteModal);
  safeClick('closeRouteModal', closeRouteModal);
  safeClick('cancelRouteBtn', closeRouteModal);
  safeClick('btnGenerateRouteDays', generateRouteDaysRows);
  safeClick('btnEditRouteDays', editRouteDays);
  safeSubmit('routeForm', onRouteFormSubmit);

  safeClick('closeDetailModal', closeDetailModal);
  safeClick('closeDetailModal2', closeDetailModal);
  safeClick('detailDuplicateBtn', onDuplicateBookingClick);

  safeClick('exportExcelBtn', exportToExcel);

  const searchInput = document.getElementById('bookingSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      persistSettings();
      render();
    });
  }

  ['statusFilter', 'paymentFilter', 'guideFilter', 'driverFilter'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        const key = id.replace('Filter', '').toLowerCase();
        state.filters[key] = e.target.value;
        persistSettings();
        render();
      });
    }
  });

  safeClick('resetFiltersBtn', resetFilters);

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

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target !== backdrop) return;
      backdrop.classList.remove('active');
      updateBodyModalState();
    });
  });

  window.addEventListener('resize', renderResultsSummary);
}

function getT() {
  return TRANSLATIONS[state.currentLang] || TRANSLATIONS.ru;
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
      state.filters = {
        search: typeof settings.filters.search === 'string' ? settings.filters.search : '',
        status: typeof settings.filters.status === 'string' ? settings.filters.status : 'all',
        payment: typeof settings.filters.payment === 'string' ? settings.filters.payment : 'all',
        guide: typeof settings.filters.guide === 'string' ? settings.filters.guide : 'all',
        driver: typeof settings.filters.driver === 'string' ? settings.filters.driver : 'all'
      };
    }
    if (settings.formDefaults && typeof settings.formDefaults === 'object') {
      state.formDefaults = {
        ...DEFAULT_FORM_DEFAULTS,
        ...settings.formDefaults
      };
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
    formDefaults: state.formDefaults
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(payload));
}

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.bookings);
    const parsed = raw ? JSON.parse(raw) : [];
    state.bookings = normalizeBookingsArray(parsed);
  } catch (error) {
    console.warn('Bookings load failed', error);
    state.bookings = [];
  }
}

function persistBookings() {
  state.bookings = normalizeBookingsArray(state.bookings);
  localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(state.bookings));
}

function normalizeBookingsArray(bookings) {
  return (Array.isArray(bookings) ? bookings : [])
    .map((item) => ({
      id: String(item?.id || generateId()),
      date: String(item?.date || ''),
      status: STATUS_ORDER.includes(item?.status) ? item.status : 'excursion',
      city: String(item?.city || '').trim(),
      client_name: String(item?.client_name || '').trim(),
      tour_name: String(item?.tour_name || '').trim(),
      guide: String(item?.guide || '').trim(),
      driver: String(item?.driver || '').trim(),
      start_time: String(item?.start_time || '').trim(),
      end_time: String(item?.end_time || '').trim(),
      price: Number(item?.price || 0),
      currency: String(item?.currency || 'UZS').trim() || 'UZS',
      group_size: Number(item?.group_size || 0),
      payment_status: PAYMENT_STATUS_ORDER.includes(item?.payment_status) ? item.payment_status : 'unpaid',
      notes: String(item?.notes || '').trim()
    }))
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
  setHtml('exportExcelBtn', `<i class="fas fa-file-excel"></i> ${t.exportBtn}`);
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
  setHtml('btnEditRouteDays', `<i class="fas fa-pencil"></i> ${t.routeEditDaysBtn}`);

  setTxt('lblStatus', t.statusLabel);
  setTxt('lblDate', t.dateLabel);
  setTxt('lblCity', t.cityLabel);
  setTxt('lblClient', t.clientLabel);
  setTxt('lblTour', t.tourLabel);
  setTxt('lblGuide', t.guideLabel);
  setTxt('lblDriver', t.driverLabel);
  setTxt('lblStart', t.startLabel);
  setTxt('lblEnd', t.endLabel);
  setTxt('lblPrice', t.priceLabel);
  setTxt('lblCurrency', t.currencyLabel);
  setTxt('lblGroup', t.groupLabel);
  setTxt('lblPaymentStatus', t.paymentStatusLabel);
  setTxt('lblNotes', t.notesLabel);
  setTxt('lblRouteStart', t.routeStartLabel);
  setTxt('lblRouteEnd', t.routeEndLabel);
  setTxt('lblRouteClient', t.routeClientLabel);
  setTxt('lblRouteGroup', t.routeGroupLabel);
  setTxt('lblRouteGuide', t.routeGuideLabel);
  setTxt('lblRouteDriver', t.routeDriverLabel);
  setTxt('lblRoutePrice', t.routePriceLabel);
  setTxt('lblRouteCurrency', t.routeCurrencyLabel);
  setTxt('lblRouteNotes', t.routeNotesLabel);

  setPlaceholder('bookingSearch', t.searchPlaceholder);
  setPlaceholder('bookingCity', t.cityPlaceholder);
  setPlaceholder('bookingClient', t.clientPlaceholder);
  setPlaceholder('bookingTour', t.tourPlaceholder);
  setPlaceholder('bookingGuide', t.guidePlaceholder);
  setPlaceholder('bookingDriver', t.driverPlaceholder);
  setPlaceholder('bookingNotes', t.notesPlaceholder);
  setPlaceholder('routeClient', t.routeClientPlaceholder);
  setPlaceholder('routeGuide', t.guidePlaceholder);
  setPlaceholder('routeDriver', t.driverPlaceholder);
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
  renderPaymentFilterOptions();
  renderGuideFilterOptions();
  renderDriverFilterOptions();
  renderWeekdays();
  syncControlsFromState();
  renderResultsSummary();
  renderRouteDayPlaceholders();
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

function renderPaymentFilterOptions() {
  const select = document.getElementById('paymentFilter');
  if (!select) return;
  const t = getT();
  const currentValue = state.filters.payment;
  select.innerHTML = [
    `<option value="all">${t.paymentAll}</option>`,
    ...PAYMENT_STATUS_ORDER.map((status) => `<option value="${status}">${t.paymentStatuses[status]}</option>`)
  ].join('');
  select.value = currentValue || 'all';
}

function renderGuideFilterOptions() {
  const select = document.getElementById('guideFilter');
  if (!select) return;
  const t = getT();
  const guides = [...new Set(state.bookings.map((b) => b.guide).filter(Boolean))].sort();
  const currentValue = state.filters.guide;
  select.innerHTML = [
    `<option value="all">${t.guideAll}</option>`,
    ...guides.map((guide) => `<option value="${guide}">${escapeHtml(guide)}</option>`)
  ].join('');
  select.value = currentValue || 'all';
}

function renderDriverFilterOptions() {
  const select = document.getElementById('driverFilter');
  if (!select) return;
  const t = getT();
  const drivers = [...new Set(state.bookings.map((b) => b.driver).filter(Boolean))].sort();
  const currentValue = state.filters.driver;
  select.innerHTML = [
    `<option value="all">${t.driverAll}</option>`,
    ...drivers.map((driver) => `<option value="${driver}">${escapeHtml(driver)}</option>`)
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

  const payment = document.getElementById('paymentFilter');
  if (payment) payment.value = state.filters.payment;

  const guide = document.getElementById('guideFilter');
  if (guide) guide.value = state.filters.guide;

  const driver = document.getElementById('driverFilter');
  if (driver) driver.value = state.filters.driver;

  const gridBtn = document.getElementById('viewGridBtn');
  const listBtn = document.getElementById('viewListBtn');
  if (gridBtn) gridBtn.classList.toggle('active', state.currentView === 'grid');
  if (listBtn) listBtn.classList.toggle('active', state.currentView === 'list');
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
  state.filters = { search: '', status: 'all', payment: 'all', guide: 'all', driver: 'all' };
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

function getVisibleBookings() {
  let items = getCurrentMonthBookings();
  const search = state.filters.search.trim().toLowerCase();
  const status = state.filters.status;
  const payment = state.filters.payment;
  const guide = state.filters.guide;
  const driver = state.filters.driver;

  if (status && status !== 'all') {
    items = items.filter((booking) => booking.status === status);
  }

  if (payment && payment !== 'all') {
    items = items.filter((booking) => booking.payment_status === payment);
  }

  if (guide && guide !== 'all') {
    items = items.filter((booking) => booking.guide === guide);
  }

  if (driver && driver !== 'all') {
    items = items.filter((booking) => booking.driver === driver);
  }

  if (search) {
    items = items.filter((booking) => {
      const haystack = [
        booking.city,
        booking.client_name,
        booking.tour_name,
        booking.guide,
        booking.driver,
        booking.notes,
        booking.currency,
        booking.group_size
      ].join(' ').toLowerCase();
      return haystack.includes(search);
    });
  }

  return items.sort((a, b) => `${a.date}-${a.start_time}-${a.id}`.localeCompare(`${b.date}-${b.start_time}-${b.id}`));
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

  const incomeMap = {};
  excursions.forEach((booking) => {
    if (!booking.price) return;
    const currency = booking.currency || 'UZS';
    incomeMap[currency] = (incomeMap[currency] || 0) + Number(booking.price || 0);
  });

  const incomeNode = document.getElementById('total-income');
  if (!incomeNode) return;
  const entries = Object.entries(incomeMap);
  if (!entries.length) {
    incomeNode.innerHTML = '<div class="income-amount">0 UZS</div>';
    return;
  }

  incomeNode.innerHTML = entries
    .map(([currency, value]) => `<div class="income-amount">${formatCurrency(value, currency)}</div>`)
    .join('');
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
  const visiblePills = compactMobile ? 2 : (window.innerWidth < 768 ? 2 : 3);
  const today = toDateString(new Date());

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

    const cell = document.createElement('div');
    cell.className = 'day-cell';
    if (!isCurrentMonth) cell.classList.add('other-month');
    if (cellDate === today) cell.classList.add('today');
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

    cell.addEventListener('click', () => openBookingModal(null, cellDate));
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
  pill.style.backgroundColor = conf.bg;
  pill.style.color = conf.color;
  pill.style.borderLeft = `3px solid ${conf.color}`;
  if (isCompactMobile()) {
    pill.classList.add('compact');
    pill.textContent = '';
  } else {
    pill.textContent = label;
  }
  pill.setAttribute('title', label);
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
    container.innerHTML = `<div class="empty-state">${state.filters.search || state.filters.status !== 'all' || state.filters.payment !== 'all' || state.filters.guide !== 'all' || state.filters.driver !== 'all' ? t.noResults : t.noEvents}</div>`;
    return;
  }

  container.innerHTML = visible
    .map((booking) => {
      const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
      const paymentConf = PAYMENT_CONFIG[booking.payment_status] || PAYMENT_CONFIG.unpaid;
      return `
        <div class="list-item" data-booking-id="${escapeHtml(booking.id)}">
          <div class="list-main">
            <div class="list-title-row">
              <strong>${escapeHtml(booking.date)}</strong>
              <span class="list-status-chip" style="background:${conf.bg}; color:${conf.color};">${escapeHtml(getStatusLabel(booking.status))}</span>
              ${booking.status === 'excursion' ? `<span class="list-status-chip" style="background:${paymentConf.bg}; color:${paymentConf.color};"><i class="fas ${paymentConf.icon}"></i> ${escapeHtml(t.paymentStatuses[booking.payment_status])}</span>` : ''}
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
  if (booking.guide) parts.push(`${getT().guideLabel}: ${booking.guide}`);
  if (booking.driver) parts.push(`${getT().driverLabel}: ${booking.driver}`);
  if (booking.start_time || booking.end_time) parts.push([booking.start_time, booking.end_time].filter(Boolean).join('–'));
  if (booking.price) parts.push(formatCurrency(booking.price, booking.currency));
  if (booking.group_size) parts.push(`${booking.group_size}`);
  return parts.join(' • ');
}

function openBookingModal(booking = null, defaultDate = null, mode = 'create') {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  const t = getT();
  const isEditing = Boolean(booking && booking.id && mode === 'edit');
  const title = isEditing ? t.modalEdit : mode === 'duplicate' ? t.modalDuplicate : t.modalCreate;

  setTxt('modalTitle', title);
  setVal('bookingId', isEditing ? booking.id : '');
  setVal('bookingDate', booking?.date || defaultDate || toDateString(new Date()));
  setVal('bookingCity', booking?.city || '');
  setVal('bookingClient', booking?.client_name || state.formDefaults.client_name || '');
  setVal('bookingTour', booking?.tour_name || '');
  setVal('bookingGuide', booking?.guide || state.formDefaults.guide || '');
  setVal('bookingDriver', booking?.driver || state.formDefaults.driver || '');
  setVal('bookingStart', booking?.start_time || state.formDefaults.start_time || '09:00');
  setVal('bookingEnd', booking?.end_time || state.formDefaults.end_time || '18:00');
  setVal('bookingPrice', booking?.price || '');
  setVal('bookingGroup', booking?.group_size || state.formDefaults.group_size || '');
  setVal('bookingNotes', booking?.notes || '');
  setVal('bookingCurrency', booking?.currency || state.formDefaults.currency || 'UZS');
  setVal('bookingPaymentStatus', booking?.payment_status || 'unpaid');

  const status = booking?.status || 'excursion';
  const radio = document.querySelector(`input[name="status"][value="${status}"]`);
  if (radio) radio.checked = true;
  toggleConditionalFields(status);

  const deleteBtn = document.getElementById('deleteBookingBtn');
  if (deleteBtn) deleteBtn.style.display = isEditing ? 'inline-flex' : 'none';

  modal.classList.add('active');
  updateBodyModalState();
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  modal.classList.remove('active');
  updateBodyModalState();
}

function toggleConditionalFields(status) {
  const node = document.getElementById('conditionalFields');
  if (!node) return;
  node.style.display = status === 'excursion' ? 'block' : 'none';
}

function onBookingFormSubmit(event) {
  event.preventDefault();
  const t = getT();
  const id = getVal('bookingId');
  const status = document.querySelector('input[name="status"]:checked')?.value || 'excursion';
  const startTime = getVal('bookingStart');
  const endTime = getVal('bookingEnd');

  if (status === 'excursion' && startTime && endTime && endTime < startTime) {
    showToast(t.invalidTimeRange, 'error');
    return;
  }

  const data = {
    id: id || generateId(),
    date: getVal('bookingDate'),
    status,
    city: status === 'excursion' ? getVal('bookingCity').trim() : '',
    client_name: status === 'excursion' ? getVal('bookingClient').trim() : '',
    tour_name: status === 'excursion' ? getVal('bookingTour').trim() : '',
    guide: status === 'excursion' ? getVal('bookingGuide').trim() : '',
    driver: status === 'excursion' ? getVal('bookingDriver').trim() : '',
    start_time: status === 'excursion' ? startTime : '',
    end_time: status === 'excursion' ? endTime : '',
    price: status === 'excursion' ? Number(getVal('bookingPrice') || 0) : 0,
    currency: status === 'excursion' ? (getVal('bookingCurrency') || 'UZS') : 'UZS',
    group_size: status === 'excursion' ? Number(getVal('bookingGroup') || 0) : 0,
    payment_status: status === 'excursion' ? (getVal('bookingPaymentStatus') || 'unpaid') : 'unpaid',
    notes: getVal('bookingNotes').trim()
  };

  const existingIndex = state.bookings.findIndex((booking) => booking.id === data.id);
  if (existingIndex >= 0) {
    state.bookings[existingIndex] = data;
  } else {
    state.bookings.push(data);
  }

  saveFormDefaultsFromBooking(data);
  persistBookings();
  persistSettings();
  closeBookingModal();
  render();
  showToast(t.bookingSaved, 'success');
}

function onDeleteBookingClick() {
  const t = getT();
  const id = getVal('bookingId');
  if (!id) return;
  if (!window.confirm(t.deleteConfirm)) return;
  state.bookings = state.bookings.filter((booking) => booking.id !== id);
  persistBookings();
  closeBookingModal();
  closeDetailModal();
  render();
  showToast(t.bookingDeleted, 'success');
}

function openRouteModal() {
  const modal = document.getElementById('routeModal');
  if (!modal) return;
  document.getElementById('routeForm')?.reset();
  const today = toDateString(new Date());
  setVal('routeStart', today);
  setVal('routeEnd', today);
  setVal('routeClient', state.formDefaults.client_name || '');
  setVal('routeGuide', state.formDefaults.guide || '');
  setVal('routeDriver', state.formDefaults.driver || '');
  setVal('routeGroupSize', state.formDefaults.group_size || '');
  setVal('routePrice', '');
  setVal('routeCurrency', state.formDefaults.currency || 'UZS');
  setVal('routeNotes', '');
  setHtml('routeDaysContainer', '');
  state.routeDaysData = [];
  modal.classList.add('active');
  updateBodyModalState();
}

function closeRouteModal() {
  const modal = document.getElementById('routeModal');
  if (!modal) return;
  modal.classList.remove('active');
  state.routeDaysData = [];
  updateBodyModalState();
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

  state.routeDaysData = [];
  const parts = [];
  let current = new Date(`${startStr}T00:00:00`);
  const end = new Date(`${endStr}T00:00:00`);
  let dayIndex = 0;
  while (current <= end) {
    const date = toDateString(current);
    state.routeDaysData.push({ date, city: '', tour: '', guide: '', driver: '' });
    parts.push(`
      <div class="route-day-row" data-date="${date}" data-day-index="${dayIndex}">
        <div class="route-day-date">📅 ${date}</div>
        <input type="text" class="form-control route-day-city" placeholder="${escapeHtml(t.routeDayCityPlaceholder)}">
        <input type="text" class="form-control route-day-tour" placeholder="${escapeHtml(t.routeDayTourPlaceholder)}">
        <input type="text" class="form-control route-day-guide" placeholder="${escapeHtml(t.guidePlaceholder)}">
        <input type="text" class="form-control route-day-driver" placeholder="${escapeHtml(t.driverPlaceholder)}">
      </div>
    `);
    current.setDate(current.getDate() + 1);
    dayIndex++;
  }
  container.innerHTML = parts.join('');
  showToast(t.routeGenerated, 'success');
}

function editRouteDays() {
  const container = document.getElementById('routeDaysContainer');
  if (!container) return;
  const rows = container.querySelectorAll('.route-day-row');
  rows.forEach((row) => {
    const inputs = row.querySelectorAll('input');
    inputs.forEach((input) => {
      input.disabled = !input.disabled;
    });
  });
}

function renderRouteDayPlaceholders() {
  const t = getT();
  document.querySelectorAll('.route-day-city').forEach((node) => {
    node.placeholder = t.routeDayCityPlaceholder;
  });
  document.querySelectorAll('.route-day-tour').forEach((node) => {
    node.placeholder = t.routeDayTourPlaceholder;
  });
  document.querySelectorAll('.route-day-guide').forEach((node) => {
    node.placeholder = t.guidePlaceholder;
  });
  document.querySelectorAll('.route-day-driver').forEach((node) => {
    node.placeholder = t.driverPlaceholder;
  });
}

function onRouteFormSubmit(event) {
  event.preventDefault();
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

  const payload = collectRouteFormData(rows);
  payload.bookings.forEach((booking) => state.bookings.push(booking));
  saveFormDefaultsFromRoute(payload.defaults);
  persistBookings();
  persistSettings();
  closeRouteModal();
  render();
  showToast(t.routeSaved, 'success');
}

function collectRouteFormData(rows) {
  const client = getVal('routeClient').trim();
  const guide = getVal('routeGuide').trim();
  const driver = getVal('routeDriver').trim();
  const groupSize = Number(getVal('routeGroupSize') || 0);
  const price = Number(getVal('routePrice') || 0);
  const currency = getVal('routeCurrency') || 'UZS';
  const notes = getVal('routeNotes').trim();

  const bookings = rows.map((row) => ({
    id: generateId(),
    date: row.dataset.date,
    status: 'excursion',
    city: row.querySelector('.route-day-city')?.value.trim() || '',
    client_name: client,
    tour_name: row.querySelector('.route-day-tour')?.value.trim() || '',
    guide: row.querySelector('.route-day-guide')?.value.trim() || guide,
    driver: row.querySelector('.route-day-driver')?.value.trim() || driver,
    start_time: state.formDefaults.start_time || '09:00',
    end_time: state.formDefaults.end_time || '18:00',
    price,
    currency,
    group_size: groupSize,
    payment_status: 'unpaid',
    notes
  }));

  return {
    bookings,
    defaults: {
      client_name: client,
      guide,
      driver,
      group_size: groupSize,
      currency,
      start_time: state.formDefaults.start_time || '09:00',
      end_time: state.formDefaults.end_time || '18:00'
    }
  };
}

function saveFormDefaultsFromBooking(booking) {
  if (booking.status !== 'excursion') return;
  state.formDefaults = {
    ...state.formDefaults,
    client_name: booking.client_name || state.formDefaults.client_name,
    guide: booking.guide || state.formDefaults.guide,
    driver: booking.driver || state.formDefaults.driver,
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
  const paymentConf = PAYMENT_CONFIG[booking.payment_status] || PAYMENT_CONFIG.unpaid;
  const noValue = t.details.noValue;
  const timeText = [booking.start_time, booking.end_time].filter(Boolean).join(' — ');

  body.innerHTML = `
    <div class="detail-stack">
      <div class="detail-row"><span>${escapeHtml(t.details.date)}</span><strong>${escapeHtml(booking.date || noValue)}</strong></div>
      <div class="detail-row"><span>${escapeHtml(t.details.status)}</span><strong class="detail-status" style="background:${conf.bg}; color:${conf.color};">${escapeHtml(getStatusLabel(booking.status))}</strong></div>
      ${booking.status === 'excursion' ? `
        <div class="detail-row"><span>${escapeHtml(t.details.city)}</span><strong>${escapeHtml(booking.city || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.client)}</span><strong>${escapeHtml(booking.client_name || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.tour)}</span><strong>${escapeHtml(booking.tour_name || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.guide)}</span><strong>${escapeHtml(booking.guide || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.driver)}</span><strong>${escapeHtml(booking.driver || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.time)}</span><strong>${escapeHtml(timeText || noValue)}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.group)}</span><strong>${escapeHtml(String(booking.group_size || 0))}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.price)}</span><strong>${escapeHtml(formatCurrency(booking.price || 0, booking.currency || 'UZS'))}</strong></div>
        <div class="detail-row"><span>${escapeHtml(t.details.paymentStatus)}</span><strong class="detail-status" style="background:${paymentConf.bg}; color:${paymentConf.color};"><i class="fas ${paymentConf.icon}"></i> ${escapeHtml(t.paymentStatuses[booking.payment_status])}</strong></div>
      ` : ''}
      <div class="detail-notes">
        <span>${escapeHtml(t.details.notes)}</span>
        <p>${escapeHtml(booking.notes || noValue)}</p>
      </div>
    </div>
  `;

  const editBtn = document.getElementById('detailEditBtn');
  if (editBtn) {
    editBtn.onclick = () => {
      closeDetailModal();
      openBookingModal(booking, booking.date, 'edit');
    };
  }

  const duplicateBtn = document.getElementById('detailDuplicateBtn');
  if (duplicateBtn) {
    duplicateBtn.onclick = () => {
      closeDetailModal();
      openBookingModal({ ...booking, id: '' }, booking.date, 'duplicate');
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

function closeDetailModal() {
  const modal = document.getElementById('detailModal');
  if (!modal) return;
  modal.classList.remove('active');
  updateBodyModalState();
}

function exportToExcel() {
  const t = getT();
  const visible = getVisibleBookings();
  if (!visible.length) {
    showToast('Нет данных для экспорта', 'warning');
    return;
  }

  const headers = [
    'Date', 'Status', 'City', 'Client', 'Tour', 'Guide', 'Driver',
    'Start Time', 'End Time', 'Price', 'Currency', 'Group Size', 'Payment Status', 'Notes'
  ];
  const rows = visible.map((booking) => [
    booking.date,
    getStatusLabel(booking.status),
    booking.city,
    booking.client_name,
    booking.tour_name,
    booking.guide,
    booking.driver,
    booking.start_time,
    booking.end_time,
    booking.price,
    booking.currency,
    booking.group_size,
    t.paymentStatuses[booking.payment_status] || booking.payment_status,
    booking.notes
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        const val = String(cell || '');
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const fileName = `yolnama-export-${toDateString(new Date())}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(t.exportSuccess, 'success');
}

function updateBodyModalState() {
  const isOpen = Array.from(document.querySelectorAll('.modal-backdrop')).some((node) => node.classList.contains('active'));
  document.body.classList.toggle('modal-open', isOpen);
}

function isCompactMobile() {
  return window.innerWidth <= 640;
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
