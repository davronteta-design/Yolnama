const SUPABASE_URL = 'https://whpzbpzvdewmfgyrnpqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocHpicHp2ZGV3bWZneXJucHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTc3OTEsImV4cCI6MjA5Njc3Mzc5MX0.76Gs4ckl9jFD3QcR1gLDn3cN1rbmDz7b6xcYf9AJabQ';

const STORAGE_KEYS = {
  demoMode: 'yolnama-demo-mode',
  lastTab: 'yolnama-active-tab'
};

const body = document.body;
const toastContainer = document.getElementById('toastContainer');

const landingPage = document.getElementById('landingPage');
const appWorkspace = document.getElementById('appWorkspace');

const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const heroLoginBtn = document.getElementById('heroLoginBtn');
const workspaceAuthBtn = document.getElementById('workspaceAuthBtn');
const settingsLoginBtn = document.getElementById('settingsLoginBtn');
const closeAuthModal = document.getElementById('closeAuthModal');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const googleAuthBtn = document.getElementById('googleAuthBtn');
const authModalTitle = document.getElementById('authModalTitle');
const authModalText = document.getElementById('authModalText');
const authModeHint = document.getElementById('authModeHint');

const demoEnterBtn = document.getElementById('demoEnterBtn');
const backToLandingBtn = document.getElementById('backToLandingBtn');
const logoutBtn = document.getElementById('logoutBtn');
const settingsLogoutBtn = document.getElementById('settingsLogoutBtn');
const userBadge = document.getElementById('userBadge');
const profileName = document.getElementById('profileName');
const profileStatus = document.getElementById('profileStatus');
const profileAvatarImage = document.getElementById('profileAvatarImage');
const profileAvatarFallback = document.getElementById('profileAvatarFallback');
const demoModeNote = document.getElementById('demoModeNote');

const settingsAvatar = document.getElementById('settingsAvatar');
const settingsUserName = document.getElementById('settingsUserName');
const settingsUserEmail = document.getElementById('settingsUserEmail');
const settingsAuthDescription = document.getElementById('settingsAuthDescription');

const openMobileSidebar = document.getElementById('openMobileSidebar');
const closeMobileSidebar = document.getElementById('closeMobileSidebar');
const mobileSidebarBackdrop = document.getElementById('mobileSidebarBackdrop');

const openBookingBtn = document.getElementById('openBookingBtn');
const openRouteBtn = document.getElementById('openRouteBtn');
const openStatsBtn = document.getElementById('openStatsBtn');
const bookingModal = document.getElementById('bookingModal');
const routeModal = document.getElementById('routeModal');
const statsModal = document.getElementById('statsModal');
const bookingForm = document.getElementById('bookingForm');
const routeForm = document.getElementById('routeForm');
const allModalBackdrops = document.querySelectorAll('.modal-backdrop');
const closeModalButtons = document.querySelectorAll('.js-close-modal');

const sidebarLinks = document.querySelectorAll('.workspace-sidebar .sidebar-link');
const mobileSidebarLinks = document.querySelectorAll('.mobile-nav .sidebar-link');
const tabPanels = document.querySelectorAll('.tab-panel');

const state = {
  authReady: false,
  authBusy: false,
  user: null,
  demo: false,
  activeTab: localStorage.getItem(STORAGE_KEYS.lastTab) || 'calendarTab'
};

let supabaseClient = null;

function setBodyScrollLock(locked) {
  body.classList.toggle('no-scroll', locked);
}

function getReadableError(error, fallback) {
  const message = String(error?.message || '').trim();
  return message || fallback;
}

function getAuthRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function setAuthBusy(flag) {
  state.authBusy = Boolean(flag);
  [loginBtn, registerBtn, googleAuthBtn, logoutBtn, settingsLogoutBtn].forEach((button) => {
    if (!button) return;
    button.disabled = state.authBusy || !state.authReady;
    button.classList.toggle('is-loading', state.authBusy);
  });
  [authEmail, authPassword].forEach((field) => {
    if (!field) return;
    field.disabled = state.authBusy || !state.authReady;
  });
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
  if (!document.querySelector('.modal-backdrop.is-open') && !mobileSidebarBackdrop.classList.contains('is-open')) {
    setBodyScrollLock(false);
  }
}

function closeAllModals() {
  allModalBackdrops.forEach((modal) => closeModal(modal));
}

function openDrawer() {
  mobileSidebarBackdrop.classList.add('is-open');
  mobileSidebarBackdrop.setAttribute('aria-hidden', 'false');
  setBodyScrollLock(true);
}

function closeDrawer() {
  mobileSidebarBackdrop.classList.remove('is-open');
  mobileSidebarBackdrop.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal-backdrop.is-open')) {
    setBodyScrollLock(false);
  }
}

function showToast(message, type = 'info') {
  if (!toastContainer) return;
  const iconMap = {
    info: 'fa-circle-info',
    success: 'fa-circle-check',
    error: 'fa-circle-xmark'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${iconMap[type] || iconMap.info}"></i><span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function getAvatarUrl(user) {
  const md = user?.user_metadata || {};
  return md.avatar_url || md.picture || md.photo_url || md.image || '';
}

function getUserDisplayName(user) {
  const md = user?.user_metadata || {};
  return md.full_name || md.name || md.user_name || md.preferred_username || (user?.email ? user.email.split('@')[0] : 'Пользователь');
}

function getUserInitial(text) {
  return (String(text || 'D').trim().charAt(0) || 'D').toUpperCase();
}

function updateAvatarUI(user, isDemo) {
  const avatarUrl = isDemo ? '' : getAvatarUrl(user);
  const displayName = isDemo ? 'Demo User' : getUserDisplayName(user);
  const initial = getUserInitial(displayName);

  if (profileAvatarImage) {
    if (avatarUrl) {
      profileAvatarImage.src = avatarUrl;
      profileAvatarImage.hidden = false;
    } else {
      profileAvatarImage.removeAttribute('src');
      profileAvatarImage.hidden = true;
    }
  }

  if (profileAvatarFallback) {
    profileAvatarFallback.textContent = initial;
    profileAvatarFallback.hidden = Boolean(avatarUrl);
  }

  if (settingsAvatar) {
    settingsAvatar.textContent = initial;
    if (avatarUrl) {
      settingsAvatar.style.backgroundImage = `url(${avatarUrl})`;
      settingsAvatar.style.backgroundSize = 'cover';
      settingsAvatar.style.backgroundPosition = 'center';
      settingsAvatar.style.color = 'transparent';
    } else {
      settingsAvatar.style.backgroundImage = '';
      settingsAvatar.style.color = '#fff';
    }
  }
}

function setUserBadge(label, avatarUrl = '', iconClass = 'fa-user') {
  if (!userBadge) return;
  const media = avatarUrl
    ? `<img class="user-badge-avatar" src="${avatarUrl}" alt="avatar">`
    : `<i class="fas ${iconClass}"></i>`;
  userBadge.innerHTML = `${media}<span>${label}</span>`;
}

function showWorkspace(mode = 'demo') {
  landingPage?.classList.add('hidden');
  appWorkspace?.classList.remove('hidden');
  body.dataset.view = 'workspace';
  if (mode === 'demo') {
    sessionStorage.setItem(STORAGE_KEYS.demoMode, '1');
  }
}

function showLanding() {
  appWorkspace?.classList.add('hidden');
  landingPage?.classList.remove('hidden');
  body.dataset.view = 'landing';
  closeDrawer();
  closeAllModals();
}

function applyDemoUI() {
  state.user = null;
  state.demo = true;
  body.dataset.authMode = 'demo';
  showWorkspace('demo');

  setUserBadge('Демо-режим', '', 'fa-flask');
  if (profileName) profileName.textContent = 'Demo User';
  if (profileStatus) profileStatus.textContent = 'Гость / Демо-режим';
  if (demoModeNote) {
    demoModeNote.hidden = false;
    demoModeNote.innerHTML = `
      <div class="demo-note-icon"><i class="fas fa-flask"></i></div>
      <div>
        <strong>Демо-режим активен</strong>
        <p>Можно тестировать календарь без входа. Данные не отправляются в Supabase и не синхронизируются между устройствами.</p>
      </div>`;
  }
  if (workspaceAuthBtn) workspaceAuthBtn.classList.remove('hidden');
  if (logoutBtn) logoutBtn.classList.add('hidden');
  if (settingsLoginBtn) settingsLoginBtn.classList.remove('hidden');
  if (settingsLogoutBtn) settingsLogoutBtn.classList.add('hidden');
  if (settingsAuthDescription) settingsAuthDescription.textContent = 'Сейчас активен демо-режим. Вы можете тестировать календарь и формы без входа, но такие изменения не синхронизируются с Supabase.';
  if (settingsUserName) settingsUserName.textContent = 'Demo User';
  if (settingsUserEmail) settingsUserEmail.textContent = 'demo@yolnama.com';
  if (authModalTitle) authModalTitle.textContent = 'Войти / Регистрация';
  if (authModalText) authModalText.textContent = 'Войдите через Email/пароль или Google. После входа записи будут доступны на ваших устройствах через Supabase. Без входа можно полноценно тестировать интерфейс в демо-режиме.';
  if (authModeHint) authModeHint.textContent = 'Если вы не хотите входить прямо сейчас, откройте календарь в демо-режиме — изменения останутся только в браузере.';
  updateAvatarUI(null, true);
}

function applyAuthenticatedUI(user) {
  state.user = user || null;
  state.demo = false;
  sessionStorage.removeItem(STORAGE_KEYS.demoMode);
  body.dataset.authMode = 'authenticated';
  showWorkspace('authenticated');

  const email = user?.email || 'user@yolnama.com';
  const displayName = getUserDisplayName(user);
  const avatarUrl = getAvatarUrl(user);

  setUserBadge(email, avatarUrl, 'fa-circle-check');
  if (profileName) profileName.textContent = displayName;
  if (profileStatus) profileStatus.textContent = email;
  if (demoModeNote) {
    demoModeNote.hidden = false;
    demoModeNote.innerHTML = `
      <div class="demo-note-icon"><i class="fas fa-cloud-check"></i></div>
      <div>
        <strong>Аккаунт подключён</strong>
        <p>После входа записи, маршруты и отчёты могут сохраняться в Supabase и открываться на любом устройстве.</p>
      </div>`;
  }
  if (workspaceAuthBtn) workspaceAuthBtn.classList.add('hidden');
  if (logoutBtn) logoutBtn.classList.remove('hidden');
  if (settingsLoginBtn) settingsLoginBtn.classList.add('hidden');
  if (settingsLogoutBtn) settingsLogoutBtn.classList.remove('hidden');
  if (settingsAuthDescription) settingsAuthDescription.textContent = 'Аккаунт активен. Данные можно синхронизировать через Supabase и продолжать работу на любом устройстве.';
  if (settingsUserName) settingsUserName.textContent = displayName;
  if (settingsUserEmail) settingsUserEmail.textContent = email;
  if (authModalTitle) authModalTitle.textContent = 'Аккаунт подключён';
  if (authModalText) authModalText.textContent = 'Вы уже вошли в Yolnama. Можно закрыть окно и продолжить работу в календаре и отчётах.';
  if (authModeHint) authModeHint.textContent = 'Для выхода используйте кнопку «Выйти» в правом верхнем углу или в разделе настроек.';
  updateAvatarUI(user, false);
}

function resetToGuestLanding() {
  state.user = null;
  state.demo = false;
  body.dataset.authMode = 'guest';
  sessionStorage.removeItem(STORAGE_KEYS.demoMode);
  showLanding();
  setUserBadge('Гость', '', 'fa-user');
  if (profileName) profileName.textContent = 'Гость';
  if (profileStatus) profileStatus.textContent = 'Войдите или запустите демо';
  if (workspaceAuthBtn) workspaceAuthBtn.classList.remove('hidden');
  if (logoutBtn) logoutBtn.classList.add('hidden');
  if (settingsLoginBtn) settingsLoginBtn.classList.remove('hidden');
  if (settingsLogoutBtn) settingsLogoutBtn.classList.add('hidden');
  if (settingsAuthDescription) settingsAuthDescription.textContent = 'Войдите через Email/пароль или Google, чтобы хранить записи в Supabase. Без входа можно работать в демо-режиме без синхронизации.';
  if (settingsUserName) settingsUserName.textContent = 'Demo User';
  if (settingsUserEmail) settingsUserEmail.textContent = 'demo@yolnama.com';
  updateAvatarUI(null, true);
}

async function initSupabase() {
  if (!window.supabase?.createClient) {
    state.authReady = true;
    setAuthBusy(false);
    showToast('Не удалось загрузить модуль авторизации. Доступен демо-режим.', 'error');
    return;
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
    if (data?.session?.user) {
      applyAuthenticatedUI(data.session.user);
    } else if (sessionStorage.getItem(STORAGE_KEYS.demoMode) === '1') {
      applyDemoUI();
    } else {
      resetToGuestLanding();
    }
  } catch (error) {
    console.error('Supabase init failed', error);
    if (sessionStorage.getItem(STORAGE_KEYS.demoMode) === '1') {
      applyDemoUI();
    } else {
      resetToGuestLanding();
    }
    showToast(getReadableError(error, 'Не удалось проверить текущую сессию.'), 'error');
  } finally {
    state.authReady = true;
    setAuthBusy(false);
  }

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => {
      if (session?.user) {
        applyAuthenticatedUI(session.user);
        closeModal(authModal);
        showToast('Вход выполнен успешно.', 'success');
      } else if (state.demo) {
        applyDemoUI();
      } else {
        resetToGuestLanding();
      }
    }, 0);
  });
}

async function onAuthLoginSubmit(event) {
  event.preventDefault();
  if (!supabaseClient || !state.authReady) {
    showToast('Авторизация пока недоступна. Используйте демо-режим.', 'error');
    return;
  }

  const email = authEmail?.value.trim().toLowerCase();
  const password = authPassword?.value || '';
  if (!email || !password) {
    showToast('Введите email и пароль.', 'error');
    return;
  }

  setAuthBusy(true);
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    closeModal(authModal);
    showToast('Вы успешно вошли в аккаунт.', 'success');
  } catch (error) {
    console.error('Login failed', error);
    showToast(getReadableError(error, 'Не удалось выполнить вход.'), 'error');
  } finally {
    setAuthBusy(false);
  }
}

async function onRegisterClick() {
  if (!supabaseClient || !state.authReady) {
    showToast('Регистрация пока недоступна. Используйте демо-режим.', 'error');
    return;
  }

  const email = authEmail?.value.trim().toLowerCase();
  const password = authPassword?.value || '';
  if (!email || !password) {
    showToast('Введите email и пароль.', 'error');
    return;
  }
  if (password.length < 6) {
    showToast('Пароль должен содержать минимум 6 символов.', 'error');
    return;
  }

  setAuthBusy(true);
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { redirectTo: getAuthRedirectUrl() }
    });
    if (error) throw error;
    if (data?.session?.user) {
      applyAuthenticatedUI(data.session.user);
      closeModal(authModal);
      showToast('Аккаунт создан и вход выполнен.', 'success');
    } else {
      showToast('Проверьте почту для подтверждения регистрации.', 'info');
    }
  } catch (error) {
    console.error('Register failed', error);
    showToast(getReadableError(error, 'Не удалось создать аккаунт.'), 'error');
  } finally {
    setAuthBusy(false);
  }
}

async function onGoogleAuthClick() {
  if (!supabaseClient || !state.authReady) {
    showToast('Google-вход пока недоступен. Используйте демо-режим.', 'error');
    return;
  }

  setAuthBusy(true);
  try {
    showToast('Перенаправляем на вход через Google…', 'info');
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getAuthRedirectUrl() }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Google auth failed', error);
    showToast(getReadableError(error, 'Не удалось запустить вход через Google.'), 'error');
    setAuthBusy(false);
  }
}

async function onLogoutClick() {
  if (!supabaseClient || !state.authReady) {
    applyDemoUI();
    showToast('Вы переключены в демо-режим.', 'info');
    return;
  }

  setAuthBusy(true);
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    authForm?.reset();
    applyDemoUI();
    showToast('Вы вышли из аккаунта. Доступен демо-режим.', 'success');
  } catch (error) {
    console.error('Logout failed', error);
    showToast(getReadableError(error, 'Не удалось выйти из аккаунта.'), 'error');
  } finally {
    setAuthBusy(false);
  }
}

function activateTab(tabId) {
  state.activeTab = tabId;
  localStorage.setItem(STORAGE_KEYS.lastTab, tabId);

  tabPanels.forEach((panel) => {
    panel.classList.toggle('hidden', panel.id !== tabId);
    panel.classList.toggle('active', panel.id === tabId);
  });

  sidebarLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.tab === tabId);
  });

  const mobileMap = {
    calendarTab: 'calendarTabMobile',
    routesTab: 'routesTabMobile',
    financeTab: 'financeTabMobile',
    settingsTab: 'settingsTabMobile'
  };

  mobileSidebarLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.tabTarget === mobileMap[tabId]);
  });
}

function handleDemoEntry() {
  applyDemoUI();
  showToast('Открыта демо-версия. Данные не будут сохранены в Supabase.', 'success');
}

function handleBookingSubmit(event) {
  event.preventDefault();
  const message = state.user
    ? 'Форма готова для сохранения в Supabase для авторизованного пользователя.'
    : 'Демо-режим: запись сохранена только локально для визуального теста.';
  closeModal(bookingModal);
  showToast(message, 'success');
}

function handleRouteSubmit(event) {
  event.preventDefault();
  const message = state.user
    ? 'Маршрут подготовлен для сохранения в Supabase.'
    : 'Демо-режим: маршрут сохранён только локально для визуального теста.';
  closeModal(routeModal);
  showToast(message, 'success');
}

function bindEvents() {
  openAuthBtn?.addEventListener('click', () => openModal(authModal));
  heroLoginBtn?.addEventListener('click', () => openModal(authModal));
  workspaceAuthBtn?.addEventListener('click', () => openModal(authModal));
  settingsLoginBtn?.addEventListener('click', () => openModal(authModal));
  closeAuthModal?.addEventListener('click', () => closeModal(authModal));

  authModal?.addEventListener('click', (event) => {
    if (event.target === authModal) closeModal(authModal);
  });

  authForm?.addEventListener('submit', onAuthLoginSubmit);
  registerBtn?.addEventListener('click', onRegisterClick);
  googleAuthBtn?.addEventListener('click', onGoogleAuthClick);

  demoEnterBtn?.addEventListener('click', handleDemoEntry);
  backToLandingBtn?.addEventListener('click', showLanding);
  logoutBtn?.addEventListener('click', onLogoutClick);
  settingsLogoutBtn?.addEventListener('click', onLogoutClick);

  openMobileSidebar?.addEventListener('click', openDrawer);
  closeMobileSidebar?.addEventListener('click', closeDrawer);
  mobileSidebarBackdrop?.addEventListener('click', (event) => {
    if (event.target === mobileSidebarBackdrop) closeDrawer();
  });

  openBookingBtn?.addEventListener('click', () => openModal(bookingModal));
  openRouteBtn?.addEventListener('click', () => openModal(routeModal));
  openStatsBtn?.addEventListener('click', () => openModal(statsModal));

  bookingForm?.addEventListener('submit', handleBookingSubmit);
  routeForm?.addEventListener('submit', handleRouteSubmit);

  closeModalButtons.forEach((button) => {
    button.addEventListener('click', () => closeAllModals());
  });

  allModalBackdrops.forEach((backdrop) => {
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) closeModal(backdrop);
    });
  });

  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => activateTab(link.dataset.tab));
  });

  mobileSidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const reverseMap = {
        calendarTabMobile: 'calendarTab',
        routesTabMobile: 'routesTab',
        financeTabMobile: 'financeTab',
        settingsTabMobile: 'settingsTab'
      };
      activateTab(reverseMap[link.dataset.tabTarget]);
      closeDrawer();
    });
  });

  document.querySelectorAll('.calendar-day').forEach((day) => {
    day.addEventListener('click', () => openModal(bookingModal));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllModals();
      closeDrawer();
    }
  });
}

function init() {
  activateTab(state.activeTab);
  bindEvents();
  resetToGuestLanding();
  initSupabase();
}

init();
