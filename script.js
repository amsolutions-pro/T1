/* =========================================================
   Mémoire Trio — logique du jeu
   =========================================================

   Pass-and-play à 3. Chaque tour : une séquence de tuiles
   colorées clignote, le joueur doit la reproduire.
   La séquence grandit d'une case à chaque tour réussi.
   3 vies par joueur. Dernier en vie = vainqueur.
   Chrono global de 15 min.
   ========================================================= */

// -------- Constantes --------
const APP_VERSION      = 'v0.4';
const NAMES_KEY        = 'memoireTrio.names';

const TILE_COUNT       = 6;
const START_LENGTH     = 3;
const MAX_LENGTH       = 25;
const LIVES            = 3;
const TIME_LIMIT_MS    = 15 * 60 * 1000;
const WATCH_INTER_MS   = 420;   // pause entre 2 flashs
const WATCH_FLASH_MS   = 480;   // durée d'un flash
const FEEDBACK_MS      = 1200;  // durée de l'écran feedback avant pass

// Notes (Hz) — gamme pentatonique majeure, toutes les combinaisons sonnent bien
const TILE_FREQS = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];

// -------- Écrans --------
const screens = {
  setup:  document.getElementById('screenSetup'),
  pass:   document.getElementById('screenPass'),
  game:   document.getElementById('screenGame'),
  paused: document.getElementById('screenPaused'),
  end:    document.getElementById('screenEnd'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// -------- DOM --------
const el = {
  // setup
  name1: document.getElementById('name1'),
  name2: document.getElementById('name2'),
  name3: document.getElementById('name3'),
  soundToggle: document.getElementById('soundToggle'),
  startBtn: document.getElementById('startBtn'),
  // pass
  passName: document.getElementById('passName'),
  passLives: document.getElementById('passLives'),
  passRound: document.getElementById('passRound'),
  passLen: document.getElementById('passLen'),
  passScores: document.getElementById('passScores'),
  readyBtn: document.getElementById('readyBtn'),
  // game
  hudPlayer: document.getElementById('hudPlayer'),
  hudLives: document.getElementById('hudLives'),
  hudStatus: document.getElementById('hudStatus'),
  hudTimer: document.getElementById('hudTimer'),
  pauseBtn: document.getElementById('pauseBtn'),
  progressInner: document.getElementById('progressInner'),
  progressLabel: document.getElementById('progressLabel'),
  board: document.getElementById('board'),
  tiles: Array.from(document.querySelectorAll('.tile')),
  feedback: document.getElementById('feedback'),
  hudJoker: document.getElementById('hudJoker'),
  // paused
  resumeBtn: document.getElementById('resumeBtn'),
  quitBtn: document.getElementById('quitBtn'),
  // end
  endTitle: document.getElementById('endTitle'),
  endSub: document.getElementById('endSub'),
  ranking: document.getElementById('ranking'),
  replayBtn: document.getElementById('replayBtn'),
  homeBtn: document.getElementById('homeBtn'),
  versionTag: document.getElementById('versionTag'),
};

// -------- État --------
let state = null;       // état de la partie en cours
let timerInterval = null;
let soundEnabled = true;

function newGame(names) {
  state = {
    players: names.map(n => ({
      name: n,
      lives: LIVES,
      bestLength: 0,
      turnsPlayed: 0,
    })),
    currentIdx: 0,
    nextLength: START_LENGTH,
    round: 1,
    sequence: [],
    inputIdx: 0,
    phase: 'pass',
    startMs: Date.now(),
    pausedElapsed: 0,
    paused: false,
    ended: false,
    watchToken: 0,
    correctionAvailable: true,
  };
}

// -------- Audio (Web Audio API) --------
let audioCtx = null;
function ensureAudio() {
  if (!soundEnabled) return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, durMs = 300) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durMs / 1000);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durMs / 1000 + 0.05);
}

function playError() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.45);
}

function playWarn() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(330, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

function playSuccess() {
  [523.25, 659.25, 783.99].forEach((f, i) => {
    setTimeout(() => playTone(f, 180), i * 90);
  });
}

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

// -------- Helpers --------
function hearts(n) {
  return '❤'.repeat(Math.max(0, n)) + '♡'.repeat(Math.max(0, LIVES - n));
}

function formatTime(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

function aliveCount() {
  return state.players.filter(p => p.lives > 0).length;
}

function sequenceFor(length) {
  const seq = [];
  let prev = -1;
  for (let i = 0; i < length; i++) {
    let pick;
    // éviter de répéter immédiatement la même tuile (plus lisible)
    do { pick = Math.floor(Math.random() * TILE_COUNT); } while (pick === prev);
    seq.push(pick);
    prev = pick;
  }
  return seq;
}

// -------- Flux de jeu --------
function beginGame() {
  // Préparer le premier tour
  state.phase = 'pass';
  renderPassScreen();
  showScreen('pass');
  startTimer();
}

function renderPassScreen() {
  const p = state.players[state.currentIdx];
  el.passName.textContent = p.name;
  el.passLives.textContent = hearts(p.lives);
  el.passRound.textContent = state.round;
  el.passLen.textContent = state.nextLength;

  const scoreLines = state.players
    .map(pl => `${pl.name} · ${hearts(pl.lives)} · meilleur : ${pl.bestLength}`)
    .join('\n');
  el.passScores.textContent = scoreLines;
}

function startTurn() {
  state.sequence = sequenceFor(state.nextLength);
  state.inputIdx = 0;
  state.correctionAvailable = true;
  state.phase = 'watch';
  showScreen('game');
  updateHUD();
  el.feedback.textContent = '';
  el.feedback.className = 'feedback';
  el.board.classList.remove('is-input');
  el.board.classList.add('is-locked');
  el.hudStatus.textContent = 'Regarde bien…';
  el.hudStatus.className = 'hud-status is-watch';
  playSequence();
}

function playSequence() {
  let i = 0;
  // jeton capturé pour invalider les timeouts en retard après un pause/quit
  const token = ++state.watchToken;
  const step = () => {
    if (state.paused || state.ended) return;
    if (state.watchToken !== token) return;
    if (state.phase !== 'watch') return;
    if (i >= state.sequence.length) {
      enterInputPhase();
      return;
    }
    flashTile(state.sequence[i]);
    i++;
    setTimeout(step, WATCH_FLASH_MS + WATCH_INTER_MS);
  };
  setTimeout(step, 500);
}

function flashTile(idx) {
  const tile = el.tiles[idx];
  tile.classList.add('is-lit');
  playTone(TILE_FREQS[idx], 320);
  setTimeout(() => tile.classList.remove('is-lit'), WATCH_FLASH_MS);
}

function enterInputPhase() {
  state.phase = 'input';
  el.hudStatus.textContent = 'À toi de jouer';
  el.hudStatus.className = 'hud-status is-play';
  el.board.classList.remove('is-locked');
  el.board.classList.add('is-input');
  updateProgress();
}

function onTileTap(idx) {
  if (state.phase !== 'input' || state.paused) return;

  // Flash visuel + son pour chaque tap
  const tile = el.tiles[idx];
  tile.classList.add('is-lit');
  playTone(TILE_FREQS[idx], 220);
  vibrate(30);
  setTimeout(() => tile.classList.remove('is-lit'), 180);

  const expected = state.sequence[state.inputIdx];
  if (idx !== expected) {
    if (state.correctionAvailable) {
      state.correctionAvailable = false;
      updateHUD();
      el.hudStatus.textContent = '2ᵉ chance — retente cette case';
      el.hudStatus.className = 'hud-status is-ko';
      el.feedback.textContent = 'Joker utilisé, pas de vie perdue !';
      el.feedback.className = 'feedback ko';
      playWarn();
      vibrate(80);
      return;
    }
    handleFail();
    return;
  }
  state.inputIdx++;
  updateProgress();
  // Après une correction, on remet le status "À toi de jouer" pour signaler que ça continue
  if (!state.correctionAvailable && state.inputIdx < state.sequence.length) {
    el.hudStatus.textContent = 'À toi de jouer';
    el.hudStatus.className = 'hud-status is-play';
    el.feedback.textContent = '';
    el.feedback.className = 'feedback';
  }
  if (state.inputIdx >= state.sequence.length) {
    handleSuccess();
  }
}

function updateProgress() {
  const total = state.sequence.length;
  const done = state.inputIdx;
  el.progressInner.style.width = `${(done / total) * 100}%`;
  el.progressLabel.textContent = `${done} / ${total}`;
}

function handleSuccess() {
  state.phase = 'feedback';
  el.board.classList.remove('is-input');
  el.board.classList.add('is-locked');

  const p = state.players[state.currentIdx];
  p.turnsPlayed++;
  if (state.sequence.length > p.bestLength) p.bestLength = state.sequence.length;

  el.feedback.textContent = `Bravo ! Séquence de ${state.sequence.length} réussie.`;
  el.feedback.className = 'feedback ok';
  el.hudStatus.textContent = 'Réussi';
  el.hudStatus.className = 'hud-status is-ok';

  playSuccess();
  vibrate([0, 40, 40, 40]);

  // la séquence grandit pour le prochain tour
  if (state.nextLength < MAX_LENGTH) state.nextLength++;

  setTimeout(advanceTurn, FEEDBACK_MS);
}

function handleFail() {
  state.phase = 'feedback';
  el.board.classList.remove('is-input');
  el.board.classList.add('is-locked', 'shake');
  setTimeout(() => el.board.classList.remove('shake'), 450);

  const p = state.players[state.currentIdx];
  p.lives--;
  p.turnsPlayed++;

  const correctIdx = state.sequence[state.inputIdx];
  flashTile(correctIdx); // on montre brièvement la bonne tuile

  el.feedback.textContent = p.lives > 0
    ? `Raté ! Il te reste ${p.lives} vie${p.lives > 1 ? 's' : ''}.`
    : `Éliminé·e ! Meilleur score : ${p.bestLength}.`;
  el.feedback.className = 'feedback ko';
  el.hudStatus.textContent = 'Raté';
  el.hudStatus.className = 'hud-status is-ko';
  updateHUD();

  playError();
  vibrate([0, 120, 80, 120]);

  setTimeout(advanceTurn, FEEDBACK_MS + 300);
}

function advanceTurn() {
  if (state.ended) return;

  // Fin si tout le monde est éliminé ou si un seul survivant après au moins un tour joué
  if (aliveCount() === 0) return endGame();
  if (aliveCount() === 1 && state.players.every(p => p.turnsPlayed > 0)) return endGame();

  // Passer au prochain joueur en vie
  let next = state.currentIdx;
  for (let i = 0; i < state.players.length; i++) {
    next = (next + 1) % state.players.length;
    if (state.players[next].lives > 0) break;
  }
  state.currentIdx = next;
  state.round++;

  renderPassScreen();
  showScreen('pass');
}

// -------- HUD --------
function updateHUD() {
  const p = state.players[state.currentIdx];
  el.hudPlayer.textContent = p.name;
  el.hudLives.textContent = hearts(p.lives);
  if (state.correctionAvailable) {
    el.hudJoker.textContent = '🔄 joker';
    el.hudJoker.classList.remove('used');
  } else {
    el.hudJoker.textContent = '🔄 utilisé';
    el.hudJoker.classList.add('used');
  }
}

// -------- Timer global --------
function elapsed() {
  if (state.paused) return state.pausedElapsed;
  return Date.now() - state.startMs;
}

function startTimer() {
  stopTimer();
  const tick = () => {
    const remaining = TIME_LIMIT_MS - elapsed();
    el.hudTimer.textContent = formatTime(remaining);
    if (remaining <= 0 && !state.ended) endGame('timeout');
  };
  tick();
  timerInterval = setInterval(tick, 500);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// -------- Pause / reprise --------
function pauseGame() {
  if (state.ended || state.paused) return;
  state.paused = true;
  state.pausedElapsed = Date.now() - state.startMs;
  showScreen('paused');
}

function resumeGame() {
  if (!state.paused) return;
  state.paused = false;
  state.startMs = Date.now() - state.pausedElapsed;
  // Si on était en plein affichage de séquence ou en input, on renvoie sur l'écran "passe"
  // du joueur courant pour redémarrer proprement le tour.
  if (state.phase === 'watch' || state.phase === 'input') {
    renderPassScreen();
    showScreen('pass');
    state.phase = 'pass';
  } else {
    showScreen(state.phase === 'feedback' ? 'game' : 'pass');
  }
}

// -------- Fin de partie --------
function endGame(reason) {
  state.ended = true;
  stopTimer();

  // Classement : meilleure séquence, puis vies restantes, puis tours joués (moins = mieux à score égal ? on garde + pour fairness)
  const ranked = [...state.players].sort((a, b) => {
    if (b.bestLength !== a.bestLength) return b.bestLength - a.bestLength;
    if (b.lives !== a.lives) return b.lives - a.lives;
    return a.turnsPlayed - b.turnsPlayed;
  });

  el.endTitle.textContent = reason === 'timeout'
    ? 'Temps écoulé !'
    : 'Fin de partie';

  const winner = ranked[0];
  const tiedWinners = ranked.filter(r => r.bestLength === winner.bestLength && r.lives === winner.lives);
  if (tiedWinners.length > 1) {
    el.endSub.textContent = `Égalité entre ${tiedWinners.map(w => w.name).join(' et ')} !`;
  } else {
    el.endSub.textContent = `🏆 ${winner.name} remporte la partie.`;
  }

  el.ranking.innerHTML = '';
  ranked.forEach((p, i) => {
    const li = document.createElement('li');
    if (i === 0) li.classList.add('first');
    const pos = document.createElement('span');
    pos.className = 'rank-pos';
    pos.textContent = i === 0 ? '🏆' : `${i + 1}.`;
    const name = document.createElement('span');
    name.className = 'rank-name';
    name.textContent = p.name;
    const score = document.createElement('span');
    score.className = 'rank-score';
    score.textContent = `${p.bestLength} · ${hearts(p.lives)}`;
    li.appendChild(pos);
    li.appendChild(name);
    li.appendChild(score);
    el.ranking.appendChild(li);
  });

  showScreen('end');
}

// -------- Handlers --------
function onStartClick() {
  const typed = [
    el.name1.value.trim().slice(0, 12),
    el.name2.value.trim().slice(0, 12),
    el.name3.value.trim().slice(0, 12),
  ];
  // On mémorise ce que le joueur a réellement tapé (vide = on garde le placeholder au prochain rafraîchissement)
  saveNames(typed);
  const names = typed.map((n, i) => n || `Joueur ${i + 1}`);
  soundEnabled = el.soundToggle.checked;
  // Tente d'initialiser l'audio via l'interaction utilisateur (iOS)
  ensureAudio();
  newGame(names);
  beginGame();
}

function saveNames(names) {
  try { localStorage.setItem(NAMES_KEY, JSON.stringify(names)); } catch {}
}

function restoreNames() {
  try {
    const saved = JSON.parse(localStorage.getItem(NAMES_KEY) || 'null');
    if (!Array.isArray(saved)) return;
    // N'écrase pas les valeurs par défaut "Joueur N" : on ne met que si saisi
    const inputs = [el.name1, el.name2, el.name3];
    inputs.forEach((inp, i) => {
      if (typeof saved[i] === 'string' && saved[i]) inp.value = saved[i];
    });
  } catch {}
}

function bindEvents() {
  el.startBtn.addEventListener('click', onStartClick);
  el.readyBtn.addEventListener('click', () => {
    if (state && !state.ended) startTurn();
  });
  el.pauseBtn.addEventListener('click', pauseGame);
  el.resumeBtn.addEventListener('click', resumeGame);
  el.quitBtn.addEventListener('click', () => {
    state.paused = false;
    endGame('quit');
  });
  el.replayBtn.addEventListener('click', () => {
    const names = state.players.map(p => p.name);
    soundEnabled = el.soundToggle.checked;
    newGame(names);
    beginGame();
  });
  el.homeBtn.addEventListener('click', () => {
    stopTimer();
    showScreen('setup');
  });

  el.tiles.forEach(t => {
    const handler = (e) => {
      e.preventDefault();
      onTileTap(Number(t.dataset.i));
    };
    // Réactivité maximale : pointerdown plutôt que click
    t.addEventListener('pointerdown', handler);
  });

  // Sauvegarde des noms à la volée pendant la saisie
  [el.name1, el.name2, el.name3].forEach(inp => {
    inp.addEventListener('input', () => {
      const typed = [
        el.name1.value.trim().slice(0, 12),
        el.name2.value.trim().slice(0, 12),
        el.name3.value.trim().slice(0, 12),
      ];
      saveNames(typed);
    });
  });

  // iOS/Safari : remettre l'audio en route au retour au premier plan
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  });
}

bindEvents();
restoreNames();
el.versionTag.textContent = APP_VERSION;
