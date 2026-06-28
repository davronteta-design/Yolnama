/* ===================================================
   GUIDE ORGANIZER — MAIN APPLICATION LOGIC WITH MULTILANG
   =================================================== */

'use strict';

const API = 'tables/bookings';

// Словари переводов
const TRANSLATIONS = {
  ru: {
    title: 'Tour Flow',
    subtitle: 'Календарь экскурсовода',
    gridBtn: 'Сетка',
    listBtn: 'Список',
    todayBtn: 'Сегодня',
    statTitle: 'Статистика месяца',
    incomeTitle: 'Доход за месяц',
    legendTitle: 'Обозначения',
    statsExcursions: 'Экскурсии',
    statsBusy: 'Занят',
    statsHoliday: 'Выходной',
    statsTourists: 'Туристы',
    addSingleBtn: 'Добавить',
    addMultiBtn: 'Маршрут',
    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthsGen: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
    weekdays: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
  },
  en: {
    title: 'Tour Flow',
    subtitle: 'Guide Calendar',
    gridBtn: 'Grid',
    listBtn: 'List',
    todayBtn: 'Today',
    statTitle: 'Monthly Stats',
    incomeTitle: 'Monthly Income',
    legendTitle: 'Legend',
    statsExcursions: 'Tours',
    statsBusy: 'Busy',
    statsHoliday: 'Holiday',
    statsTourists: 'Tourists',
    addSingleBtn: 'Add New',
    addMultiBtn: 'Route',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    monthsGen: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdays: ['Mo','Tu','We','Th','Fr','Sa','Su']
  },
  uz: {
    title: 'Tour Flow',
    subtitle: 'Gid taqvimi',
    gridBtn: 'Setka',
    listBtn: 'Ro\'yxat',
    todayBtn: 'Bugun',
    statTitle: 'Oylik statistika',
    incomeTitle: 'Oylik daromad',
    legendTitle: 'Belgilar',
    statsExcursions: 'Ekskursiyalar',
    statsBusy: 'Band',
    statsHoliday: 'Dam olish',
    statsTourists: 'Turistlar',
    addSingleBtn: 'Yozuv qo\'shish',
    addMultiBtn: 'Yo\'nalish',
    months: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
    monthsGen: ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'],
    weekdays: ['Du','Se','Cho','Pa','Ju','Sha','Yak']
  }
};

const STATUS_CONFIG = {
  excursion: { label: 'Экскурсия',   icon: 'fa-map-marked-alt', color: '#2563eb', bg: '#dbeafe' },
  busy:      { label: 'Занят',       icon: 'fa-ban',            color: '#dc2626', bg: '#fee2e2' },
  holiday:   { label: 'Выходной',    icon: 'fa-umbrella-beach', color: '#16a34a', bg: '#dcfce7' },
  personal:  { label: 'Личное',      icon: 'fa-user-clock',     color: '#d97706', bg: '#fef3c7' },
};

let state = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  currentView: 'grid', 
  currentLang: 'ru',   
  bookings: []
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initDOMEvents();
  fetchBookings();
});

function initDOMEvents() {
  // Стрелки месяцев
  safeClick('prevMonthBtn', () => changeMonth(-1));
  safeClick('nextMonthBtn', () => changeMonth(1));
  safeClick('todayBtn', () => {
    state.currentYear = new Date().getFullYear();
    state.currentMonth = new Date().getMonth();
    render();
  });

  // Переключение видов
  safeClick('viewGridBtn', () => switchView('grid'));
  safeClick('viewListBtn', () => switchView('list'));

  // Селектор смены языка (без всплывающих alert)
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = state.currentLang;
    langSelect.addEventListener('change', (e) => {
      state.currentLang = e.target.value;
      updateInterfaceLanguage(); 
      render();                  
    });
  }

  // Действия модального окна одиночной записи
  safeClick('addBookingBtn', () => openBookingModal());
  safeClick('closeBookingModal', closeBookingModal);
  safeClick('cancelBookingBtn', closeBookingModal);
  safeSubmit('bookingForm', onBookingFormSubmit);
  safeClick('deleteBookingBtn', onDeleteBookingClick);

  // Слежение за изменением статусов в форме
  const radios = document.querySelectorAll('input[name="status"]');
  radios.forEach(r => {
    r.addEventListener('change', (e) => toggleConditionalFields(e.target.value));
  });

  // Действия многодневного маршрута
  safeClick('addRouteBtn', openRouteModal);
  safeClick('closeRouteModal', closeRouteModal);
  safeClick('cancelRouteBtn', closeRouteModal);
  safeClick('btnGenerateRouteDays', generateRouteDaysRows);
  safeSubmit('routeForm', onRouteFormSubmit);

  // Закрытие деталей
  safeClick('closeDetailModal', closeDetailModal);
  safeClick('closeDetailModal2', closeDetailModal);

  // Применяем язык по умолчанию при первом запуске
  updateInterfaceLanguage();
}

// Изменение статичных текстов на странице на лету
function updateInterfaceLanguage() {
  const lang = state.currentLang;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ru;

  const subEl = document.querySelector('.brand p');
  if (subEl) subEl.textContent = t.subtitle;

  const gBtn = document.getElementById('viewGridBtn');
  const lBtn = document.getElementById('viewListBtn');
  const tBtn = document.getElementById('todayBtn');
  if (gBtn) gBtn.innerHTML = `<i class="fas fa-th"></i> ${t.gridBtn}`;
  if (lBtn) lBtn.innerHTML = `<i class="fas fa-list"></i> ${t.listBtn}`;
  if (tBtn) tBtn.textContent = t.todayBtn;

  setTxt('statTitle', t.statTitle);
  setTxt('incomeTitle', t.incomeTitle);
  setTxt('legendTitle', t.legendTitle);

  const addSingle = document.getElementById('addBookingBtn');
  const addMulti = document.getElementById('addRouteBtn');
  if (addSingle) addSingle.innerHTML = `<i class="fas fa-plus"></i> ${t.addSingleBtn}`;
  if (addMulti) addMulti.innerHTML = `<i class="fas fa-route"></i> ${t.addMultiBtn}`;

  // Обновление ярлыков статистики
  const labels = document.querySelectorAll('.stat-mini-box .stat-label');
  if (labels.length >= 4) {
    labels[0].textContent = t.statsExcursions;
    labels[1].textContent = t.statsBusy;
    labels[2].textContent = t.statsHoliday;
    labels[3].textContent = t.statsTourists;
  }
}

// Загрузка данных
async function fetchBookings() {
  const local = localStorage.getItem('tour_flow_bookings');
  if (local) {
    try { state.bookings = JSON.parse(local); } catch(e) { state.bookings = []; }
  }
  render();
}

function saveFallback() {
  localStorage.setItem('tour_flow_bookings', JSON.stringify(state.bookings));
}

function changeMonth(dir) {
  state.currentMonth += dir;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear++;
  } else if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear--;
  }
  render();
}

function switchView(view) {
  state.currentView = view;
  const gBtn = document.getElementById('viewGridBtn');
  const lBtn = document.getElementById('viewListBtn');
  if (gBtn) gBtn.classList.toggle('active', view === 'grid');
  if (lBtn) lBtn.classList.toggle('active', view === 'list');
  render();
}

function render() {
  const lang = state.currentLang;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ru;

  const label = document.getElementById('currentMonthLabel');
  if (label) {
    label.textContent = `${t.months[state.currentMonth]} ${state.currentYear}`;
  }

  calculateAndRenderStats();

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

function calculateAndRenderStats() {
  const prefix = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
  const monthly = state.bookings.filter(b => b.date && b.date.startsWith(prefix));

  const excursions = monthly.filter(b => b.status === 'excursion');
  const busyCount  = monthly.filter(b => b.status === 'busy').length;
  const holCount   = monthly.filter(b => b.status === 'holiday').length;

  let totalTourists = 0;
  let incomeWallet = {};

  excursions.forEach(b => {
    totalTourists += (parseInt(b.group_size) || 0);
    if (b.price) {
      const cur = b.currency || 'UZS';
      incomeWallet[cur] = (incomeWallet[cur] || 0) + parseFloat(b.price);
    }
  });

  setTxt('excursions-count', excursions.length);
  setTxt('busy-count', busyCount);
  setTxt('holiday-count', holCount);
  setTxt('tourists-count', totalTourists);

  const incomeEl = document.getElementById('total-income');
  if (incomeEl) {
    const keys = Object.keys(incomeWallet);
    if (keys.length === 0) {
      incomeEl.innerHTML = `<div class="income-amount">0 UZS</div>`;
    } else {
      incomeEl.innerHTML = keys.map(cur => 
        `<div class="income-amount">${formatCurrency(incomeWallet[cur], cur)}</div>`
      ).join('');
    }
  }
}

function renderGrid() {
  const lang = state.currentLang;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ru;

  const header = document.getElementById('weekdaysHeader');
  if (header) {
    header.innerHTML = t.weekdays.map(w => `<div class="weekday-label">${w}</div>`).join('');
  }

  const grid = document.getElementById('calendarGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
  let startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
  const prevDaysInMonth = new Date(state.currentYear, state.currentMonth, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  for (let i = 0; i < totalCells; i++) {
    let dayNum, m = state.currentMonth, y = state.currentYear, isCurr = true;

    if (i < startOffset) {
      dayNum = prevDaysInMonth - startOffset + i + 1;
      m = state.currentMonth === 0 ? 11 : state.currentMonth - 1;
      y = state.currentMonth === 0 ? state.currentYear - 1 : state.currentYear;
      isCurr = false;
    } else if (i >= startOffset + daysInMonth) {
      dayNum = i - startOffset - daysInMonth + 1;
      m = state.currentMonth === 11 ? 0 : state.currentMonth + 1;
      y = state.currentMonth === 11 ? state.currentYear + 1 : state.currentYear;
      isCurr = false;
    } else {
      dayNum = i - startOffset + 1;
    }

    const cellDate = `${y}-${String(m + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

    const cell = document.createElement('div');
    cell.className = 'day-cell';
    if (!isCurr) cell.classList.add('other-month');
    if (cellDate === todayStr) cell.classList.add('today');
    if (i % 7 === 5 || i % 7 === 6) cell.classList.add('weekend-cell');

    cell.innerHTML = `<div class="day-num">${dayNum}</div>`;

    const dayBookings = state.bookings.filter(b => b.date === cellDate);

    dayBookings.forEach(b => {
      const pill = document.createElement('div');
      pill.className = 'booking-pill';
      const conf = STATUS_CONFIG[b.status] || STATUS_CONFIG.excursion;
      
      pill.style.backgroundColor = conf.bg;
      pill.style.color = conf.color;
      pill.style.borderLeft = `3px solid ${conf.color}`;

      if (b.status === 'excursion') {
        pill.textContent = (b.city ? `[${b.city}] ` : '') + (b.client_name || 'Экскурсия');
      } else {
        pill.textContent = conf.label;
      }

      pill.onclick = (e) => {
        e.stopPropagation();
        openDetailModal(b);
      };
      cell.appendChild(pill);
    });

    cell.onclick = () => openBookingModal(null, cellDate);
    grid.appendChild(cell);
  }
}

function renderList() {
  const container = document.getElementById('list-view-container');
  if (!container) return;
  container.innerHTML = '';

  const prefix = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
  const monthly = state.bookings.filter(b => b.date && b.date.startsWith(prefix));
  
  if (monthly.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:30px;">Нет событий на этот месяц.</p>`;
    return;
  }

  monthly.forEach(b => {
    const item = document.createElement('div');
    item.className = 'list-item';
    const conf = STATUS_CONFIG[b.status] || STATUS_CONFIG.excursion;
    
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>📅 ${b.date}</strong> — ${b.status === 'excursion' ? (b.tour_name || 'Экскурсия') : conf.label}
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
            ${b.city ? '📍 '+b.city : ''} ${b.client_name ? ' | 👥 '+b.client_name : ''} ${b.price ? ' | 💰 '+formatCurrency(b.price, b.currency) : ''}
          </div>
        </div>
        <span style="background:${conf.bg}; color:${conf.color}; padding:4px 10px; border-radius:8px; font-size:0.8rem; font-weight:600;">${conf.label}</span>
      </div>
    `;
    item.onclick = () => openDetailModal(b);
    container.appendChild(item);
  });
}

function openBookingModal(booking = null, defaultDate = null) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  modal.classList.add('active');

  if (booking) {
    setTxt('modalTitle', 'Редактировать запись');
    setVal('bookingId', booking.id);
    setVal('bookingDate', booking.date);
    setVal('bookingCity', booking.city || '');
    setVal('bookingClient', booking.client_name || '');
    setVal('bookingTour', booking.tour_name || '');
    setVal('bookingStart', booking.start_time || '09:00');
    setVal('bookingEnd', booking.end_time || '18:00');
    setVal('bookingPrice', booking.price || '');
    setVal('bookingGroup', booking.group_size || '');
    setVal('bookingNotes', booking.notes || '');
    
    document.getElementById('bookingCurrency').value = booking.currency || 'UZS';
    
    const radioToCheck = document.querySelector(`input[name="status"][value="${booking.status}"]`);
    if (radioToCheck) radioToCheck.checked = true;
    toggleConditionalFields(booking.status);

    document.getElementById('deleteBookingBtn').style.display = 'block';
  } else {
    document.getElementById('bookingForm').reset();
    setTxt('modalTitle', 'Новая запись');
    setVal('bookingId', '');
    setVal('bookingDate', defaultDate || new Date().toISOString().split('T')[0]);
    document.getElementById('statusExcursion').checked = true;
    toggleConditionalFields('excursion');
    document.getElementById('deleteBookingBtn').style.display = 'none';
  }
}

function closeBookingModal() {
  document.getElementById('bookingModal').classList.remove('active');
}

function toggleConditionalFields(status) {
  document.getElementById('conditionalFields').style.display = (status === 'excursion') ? 'block' : 'none';
}

function onBookingFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('bookingId').value;
  const status = document.querySelector('input[name="status"]:checked').value;

  const data = {
    id: id || 'id-' + Math.random().toString(36).substr(2, 9),
    date: document.getElementById('bookingDate').value,
    status: status,
    city: document.getElementById('bookingCity').value,
    client_name: document.getElementById('bookingClient').value,
    tour_name: document.getElementById('bookingTour').value,
    start_time: document.getElementById('bookingStart').value,
    end_time: document.getElementById('bookingEnd').value,
    price: parseFloat(document.getElementById('bookingPrice').value) || 0,
    currency: document.getElementById('bookingCurrency').value || 'UZS',
    group_size: parseInt(document.getElementById('bookingGroup').value) || 0,
    notes: document.getElementById('bookingNotes').value
  };

  if (id) {
    const idx = state.bookings.findIndex(b => b.id === id);
    if (idx !== -1) state.bookings[idx] = data;
  } else {
    state.bookings.push(data);
  }

  saveFallback();
  closeBookingModal();
  render();
}

function onDeleteBookingClick() {
  const id = document.getElementById('bookingId').value;
  if (!id) return;
  if (confirm("Удалить эту запись?")) {
    state.bookings = state.bookings.filter(b => b.id !== id);
    saveFallback();
    closeBookingModal();
    render();
  }
}

// Функции для многодневных маршрутов
function openRouteModal() {
  document.getElementById('routeModal').classList.add('active');
  document.getElementById('routeForm').reset();
  document.getElementById('routeDaysContainer').innerHTML = '';
  const todayStr = new Date().toISOString().split('T')[0];
  setVal('routeStart', todayStr);
  setVal('routeEnd', todayStr);
}
function closeRouteModal() {
  document.getElementById('routeModal').classList.remove('active');
}

function generateRouteDaysRows() {
  const startStr = document.getElementById('routeStart').value;
  const endStr = document.getElementById('routeEnd').value;
  const container = document.getElementById('routeDaysContainer');
  if (!container || !startStr || !endStr) return;

  container.innerHTML = '';
  let current = new Date(startStr);
  const end = new Date(endStr);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const row = document.createElement('div');
    row.className = 'route-day-row';
    row.dataset.date = dateStr;
    row.innerHTML = `
      <div class="route-day-date">📅 ${dateStr}</div>
      <input type="text" class="form-control route-day-city" placeholder="Город" required style="padding:6px 10px;">
      <input type="text" class="form-control route-day-tour" placeholder="Программа" style="padding:6px 10px;">
    `;
    container.appendChild(row);
    current.setDate(current.getDate() + 1);
  }
}

function onRouteFormSubmit(e) {
  e.preventDefault();
  const rows = document.querySelectorAll('.route-day-row');
  if (rows.length === 0) { alert('Сгенерируйте дни!'); return; }

  const client = document.getElementById('routeClient').value;
  const group = parseInt(document.getElementById('routeGroupSize').value) || 0;
  const currency = document.getElementById('routeCurrency').value;
  const notes = document.getElementById('routeNotes').value;

  rows.forEach(row => {
    state.bookings.push({
      id: 'id-' + Math.random().toString(36).substr(2, 9),
      date: row.dataset.date,
      status: 'excursion',
      city: row.querySelector('.route-day-city').value,
      client_name: client,
      tour_name: row.querySelector('.route-day-tour').value,
      price: 0,
      currency: currency,
      group_size: group,
      notes: notes
    });
  });

  saveFallback();
  closeRouteModal();
  render();
}

// Детали брони
function openDetailModal(booking) {
  const modal = document.getElementById('detailModal');
  const body = document.getElementById('detailBody');
  if (!modal || !body) return;
  modal.classList.add('active');

  const conf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.excursion;
  body.innerHTML = `
    <div style="line-height: 1.6;">
      <p><strong>Дата:</strong> ${booking.date}</p>
      <p><strong>Статус:</strong> <span style="background:${conf.bg}; color:${conf.color}; padding:2px 6px; border-radius:6px; font-weight:600;">${conf.label}</span></p>
      ${booking.status === 'excursion' ? `
        <p><strong>📍 Город:</strong> ${booking.city || '—'}</p>
        <p><strong>👥 Заказчик:</strong> ${booking.client_name || '—'}</p>
        <p><strong>🗺️ Экскурсия:</strong> ${booking.tour_name || '—'}</p>
        <p><strong>🧑‍🤝‍🧑 Туристы:</strong> ${booking.group_size || 0} чел.</p>
        <p><strong>💰 Стоимость:</strong> ${formatCurrency(booking.price || 0, booking.currency)}</p>
      ` : ''}
      ${booking.notes ? `<p style="background:var(--surface2); padding:8px; border-radius:6px; margin-top:8px;"><strong>Заметки:</strong> ${booking.notes}</p>` : ''}
    </div>
  `;

  document.getElementById('detailEditBtn').onclick = () => {
    closeDetailModal();
    openBookingModal(booking);
  };
}
function closeDetailModal() {
  document.getElementById('detailModal').classList.remove('active');
}

// Помощники
function formatCurrency(num, cur) {
  const syms = { UZS: 'сум', USD: '$', EUR: '€', RUB: '₽' };
  return Number(num).toLocaleString('ru-RU') + ' ' + (syms[cur] || cur);
}
function safeClick(id, cb) { const el = document.getElementById(id); if (el) el.onclick = cb; }
function safeSubmit(id, cb) { const el = document.getElementById(id); if (el) el.onsubmit = cb; }
function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v; }
function setTxt(id, t) { const el = document.getElementById(id); if (el) el.textContent = t; }
