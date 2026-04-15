// =========================================================
// Compteur de jeûne — logique principale
// =========================================================

const STORAGE_KEY = 'fastingTimerState';
const THEME_KEY = 'fastingTimerTheme';
const MAX_HISTORY = 10;

// Définition des phases du jeûne
const PHASES = [
  {
    name: 'Digestion',
    min: 0,
    max: 4,
    color: '#3b82f6',
    desc: 'Ton corps digère le dernier repas et utilise le glucose.',
  },
  {
    name: 'Autophagie légère',
    min: 4,
    max: 16,
    color: '#06b6d4',
    desc: 'Les réserves de glycogène se vident, l\'autophagie démarre.',
  },
  {
    name: 'Autophagie accrue',
    min: 16,
    max: 24,
    color: '#10b981',
    desc: 'Le recyclage cellulaire s\'intensifie, brûlage des graisses activé.',
  },
  {
    name: 'Cétose',
    min: 24,
    max: 48,
    color: '#f59e0b',
    desc: 'Le corps produit des cétones comme carburant principal.',
  },
  {
    name: 'Jeûne prolongé',
    min: 48,
    max: Infinity,
    color: '#ef4444',
    desc: 'Jeûne avancé — un suivi médical est vivement recommandé.',
  },
];

// =========================================================
// État
// =========================================================
let state = {
  startTime: null,   // timestamp ms, ou null si pas de jeûne en cours
  history: [],       // [{ start, end, duration }]
};

let tickInterval = null;

// =========================================================
// DOM
// =========================================================
const el = {
  timerLabel: document.getElementById('timerLabel'),
  timerDisplay: document.getElementById('timerDisplay'),
  timerStart: document.getElementById('timerStart'),
  phaseName: document.getElementById('phaseName'),
  phaseRange: document.getElementById('phaseRange'),
  phaseDesc: document.getElementById('phaseDesc'),
  progressFill: document.getElementById('progressFill'),
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  phasesList: document.getElementById('phasesList'),
  historyList: document.getElementById('historyList'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  themeToggle: document.getElementById('themeToggle'),
  themeIcon: document.getElementById('themeIcon'),
};

// =========================================================
// Persistance
// =========================================================
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = {
        startTime: parsed.startTime ?? null,
        history: Array.isArray(parsed.history) ? parsed.history : [],
      };
    }
  } catch (e) {
    console.warn('État corrompu, réinitialisation.', e);
    state = { startTime: null, history: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// =========================================================
// Thème
// =========================================================
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  el.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  el.themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'
  );
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
}

// =========================================================
// Utilitaires temps
// =========================================================
function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return (
    String(h).padStart(2, '0') + ':' +
    String(m).padStart(2, '0') + ':' +
    String(s).padStart(2, '0')
  );
}

function formatDurationHuman(ms) {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${String(m).padStart(2, '0')}min`;
}

function formatDateTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// =========================================================
// Phases
// =========================================================
function getPhase(hours) {
  return PHASES.find(p => hours >= p.min && hours < p.max) || PHASES[0];
}

function getPhaseProgress(hours, phase) {
  if (phase.max === Infinity) return 1;
  const span = phase.max - phase.min;
  return Math.min(1, Math.max(0, (hours - phase.min) / span));
}

function renderPhasesList(activePhase) {
  el.phasesList.innerHTML = '';
  PHASES.forEach(p => {
    const li = document.createElement('li');
    if (activePhase && p.name === activePhase.name) li.classList.add('active');

    const dot = document.createElement('span');
    dot.className = 'phase-dot';
    dot.style.backgroundColor = p.color;

    const info = document.createElement('div');
    info.className = 'phase-info';

    const name = document.createElement('span');
    name.className = 'phase-info-name';
    name.textContent = p.name;

    const range = document.createElement('span');
    range.className = 'phase-info-range';
    range.textContent = p.max === Infinity ? `${p.min}h et plus` : `${p.min}h – ${p.max}h`;

    info.appendChild(name);
    info.appendChild(range);
    li.appendChild(dot);
    li.appendChild(info);
    el.phasesList.appendChild(li);
  });
}

// =========================================================
// Affichage
// =========================================================
function updateTimerDisplay() {
  if (state.startTime) {
    const elapsed = Date.now() - state.startTime;
    const hours = elapsed / 3600000;
    const phase = getPhase(hours);

    el.timerLabel.textContent = 'Jeûne en cours';
    el.timerDisplay.textContent = formatDuration(elapsed);
    el.timerStart.textContent = `Démarré le ${formatDateTime(state.startTime)}`;

    el.phaseName.textContent = phase.name;
    el.phaseRange.textContent = phase.max === Infinity
      ? `${phase.min}h+`
      : `${phase.min}h – ${phase.max}h`;
    el.phaseDesc.textContent = phase.desc;

    const progress = getPhaseProgress(hours, phase);
    el.progressFill.style.width = `${progress * 100}%`;
    el.progressFill.style.background = phase.color;

    el.startBtn.classList.add('hidden');
    el.stopBtn.classList.remove('hidden');

    renderPhasesList(phase);
  } else {
    el.timerLabel.textContent = 'Aucun jeûne en cours';
    el.timerDisplay.textContent = '00:00:00';
    el.timerStart.textContent = '';

    el.phaseName.textContent = '—';
    el.phaseRange.textContent = '';
    el.phaseDesc.textContent = 'Appuie sur « Commencer le jeûne » pour démarrer.';
    el.progressFill.style.width = '0%';

    el.startBtn.classList.remove('hidden');
    el.stopBtn.classList.add('hidden');

    renderPhasesList(null);
  }
}

function renderHistory() {
  el.historyList.innerHTML = '';

  if (state.history.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-state';
    li.textContent = "Aucun jeûne enregistré pour l'instant.";
    el.historyList.appendChild(li);
    el.clearHistoryBtn.classList.add('hidden');
    return;
  }

  el.clearHistoryBtn.classList.remove('hidden');

  // Affichage du plus récent au plus ancien
  [...state.history].reverse().forEach(entry => {
    const li = document.createElement('li');

    const header = document.createElement('div');
    header.className = 'history-item-header';

    const date = document.createElement('span');
    date.className = 'history-date';
    date.textContent = formatDate(entry.start);

    const duration = document.createElement('span');
    duration.className = 'history-duration';
    duration.textContent = formatDurationHuman(entry.duration);

    header.appendChild(date);
    header.appendChild(duration);

    const times = document.createElement('div');
    times.className = 'history-times';
    times.textContent = `Début ${formatTime(entry.start)} → Fin ${formatTime(entry.end)}`;

    li.appendChild(header);
    li.appendChild(times);
    el.historyList.appendChild(li);
  });
}

// =========================================================
// Actions
// =========================================================
function startFast() {
  state.startTime = Date.now();
  saveState();
  startTicking();
  updateTimerDisplay();
}

function endFast() {
  if (!state.startTime) return;

  const end = Date.now();
  const duration = end - state.startTime;

  // Entrée uniquement si le jeûne a duré au moins 1 minute
  if (duration >= 60000) {
    state.history.push({
      start: state.startTime,
      end,
      duration,
    });
    // Conserver uniquement les 10 derniers
    if (state.history.length > MAX_HISTORY) {
      state.history = state.history.slice(-MAX_HISTORY);
    }
  }

  state.startTime = null;
  saveState();
  stopTicking();
  updateTimerDisplay();
  renderHistory();
}

function clearHistory() {
  if (!confirm('Effacer tout l\'historique ? Cette action est irréversible.')) return;
  state.history = [];
  saveState();
  renderHistory();
}

// =========================================================
// Boucle de rafraîchissement
// =========================================================
function startTicking() {
  if (tickInterval) return;
  tickInterval = setInterval(updateTimerDisplay, 1000);
}

function stopTicking() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

// =========================================================
// Initialisation
// =========================================================
function init() {
  loadTheme();
  loadState();

  el.startBtn.addEventListener('click', startFast);
  el.stopBtn.addEventListener('click', () => {
    if (confirm('Arrêter le jeûne en cours ?')) endFast();
  });
  el.clearHistoryBtn.addEventListener('click', clearHistory);
  el.themeToggle.addEventListener('click', toggleTheme);

  // Reprise du timer si un jeûne était en cours
  if (state.startTime) startTicking();

  updateTimerDisplay();
  renderHistory();

  // Relance le timer quand l'app revient au premier plan (iOS met en pause les JS en arrière-plan)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && state.startTime) {
      updateTimerDisplay();
      startTicking();
    }
  });
}

init();
