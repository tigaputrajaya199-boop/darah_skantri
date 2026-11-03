// ============================================================================
// DARAH SKANTRI — Gedung Sekolah 4 Lantai, 1 Lobby Mabar 4 Orang & Kuntilanak
// ============================================================================

const socket = io();

// Elemen DOM Utama
const studioIntroOverlay = document.getElementById('studio-intro-overlay');
const studioIntroSub = document.getElementById('studio-intro-sub');
const studioIntroBar = document.getElementById('studio-intro-bar');
const lobbyStageBg = document.getElementById('lobby-stage-bg');
const ffLobby = document.getElementById('ff-lobby');
const mabarMenuOverlay = document.getElementById('mabar-menu-overlay');
const endOverlay = document.getElementById('end-overlay');
const endTitle = document.getElementById('end-title');
const endReason = document.getElementById('end-reason');
const hud = document.getElementById('hud');

const usernameInput = document.getElementById('username-input');
const btnRestart = document.getElementById('btn-restart');
const btnBackLobby = document.getElementById('btn-back-lobby');

// Elemen DOM Lobby 1 Orang & Menu Mabar 4 Orang
const ffLobbyModeTag = document.getElementById('ff-lobby-mode-tag');
const ffSeasonTag = document.getElementById('ff-season-tag');
const ffRoomCode = document.getElementById('ff-room-code');
const ffSkillDesc = document.getElementById('ff-skill-desc');
const ffChatMessages = document.getElementById('ff-chat-messages');
const ffChatInput = document.getElementById('ff-chat-input');
const btnSendChat = document.getElementById('btn-send-chat');
const btnStartMatch = document.getElementById('btn-start-match');
const skinCards = document.querySelectorAll('.ff-skin-card');

const btnOpenMabarMenu = document.getElementById('btn-open-mabar-menu');
const btnOpenMabarBottom = document.getElementById('btn-open-mabar-bottom');
const btnCloseMabarMenu = document.getElementById('btn-close-mabar-menu');
const btnModeSolo = document.getElementById('btn-mode-solo');
const btnModeMabar4 = document.getElementById('btn-mode-mabar4');
const mabarSquadCount = document.getElementById('mabar-squad-count');
const mabarRoomCodeInput = document.getElementById('mabar-room-code-input');
const btnJoinMabarRoom = document.getElementById('btn-join-mabar-room');
const btnCopyLink = document.getElementById('btn-copy-link');
const btnKickBot = document.getElementById('btn-kick-bot');
const btnViewSquadStage = document.getElementById('btn-view-squad-stage');
const btnStartMabarMatch = document.getElementById('btn-start-mabar-match');
const inviteFriendBtns = document.querySelectorAll('.btn-invite-friend');

// Elemen DOM HUD In-Game
const hudFloorTitle = document.getElementById('hud-floor-title');
const hudRoom = document.getElementById('hud-room');
const padlocksLabel = document.getElementById('padlocks-label');
const hudQuota = document.getElementById('hud-quota');
const hudTarget = document.getElementById('hud-target');
const padlockBadges = document.querySelectorAll('.padlock-badge');
const teamList = document.getElementById('team-list');
const systemFeed = document.getElementById('system-feed');
const interactionPrompt = document.getElementById('interaction-prompt');
const staminaFill = document.getElementById('stamina-fill');
const batteryFill = document.getElementById('battery-fill');
const slot0 = document.getElementById('slot-0');
const slot1 = document.getElementById('slot-1');
const zoneStatus = document.getElementById('zone-status');
const bloodVignette = document.getElementById('blood-vignette');
const deathBanner = document.getElementById('death-banner');
const lockerOverlay = document.getElementById('locker-overlay');
const reviveQuestBox = document.getElementById('revive-quest-box');
const questProgress = document.getElementById('quest-progress');
const questDesc = document.getElementById('quest-desc');
const floorTransitionBanner = document.getElementById('floor-transition-banner');
const floorBannerTitle = document.getElementById('floor-banner-title');
const floorBannerSub = document.getElementById('floor-banner-sub');
const kuntiLaughBanner = document.getElementById('kunti-laugh-banner');

// ============================================================================
// DATA 6 KARAKTER UTAMA SMK SKANTRI (ADIT, MAULANA, FERY, WAHYU, ALEX, RAFI)
// & KATALOG SETELAN SKIN / BAJU KUSTOM
// ============================================================================
const LEGACY_SKIN_MAP = {
  rizky: 'adit',
  siti: 'maulana',
  bima: 'fery',
  citra: 'wahyu',
  dedi: 'alex'
};

function normalizeSkinId(rawId) {
  const key = String(rawId || 'adit').trim().toLowerCase();
  if (LEGACY_SKIN_MAP[key]) return LEGACY_SKIN_MAP[key];
  return SKIN_CATALOG[key] ? key : 'adit';
}

const SKIN_CATALOG = {
  adit: {
    title: 'ADIT (KETUA OSIS)',
    shirtColor: 0xf8fafc,
    pantsColor: 0x64748b,
    accentColor: 0xef4444,
    skillHtml: '<strong>Adit (Ketua OSIS):</strong> Berlari +15% lebih cepat di koridor sekolah saat dikejar Kuntilanak.'
  },
  maulana: {
    title: 'MAULANA (INDIGO)',
    shirtColor: 0x1e1b4b,
    pantsColor: 0x312e81,
    accentColor: 0xa855f7,
    skillHtml: '<strong>Maulana (Indigo):</strong> Mata batin mampu merasakan & mengambil Kunci serta menyalakan Lilin dari jarak jauh.'
  },
  fery: {
    title: 'FERY (ATLET BASKET)',
    shirtColor: 0xdc2626,
    pantsColor: 0x1e293b,
    accentColor: 0xfacc15,
    skillHtml: '<strong>Fery (Atlet Basket):</strong> Stamina lari +30% lebih tahan lama dan cepat pulih.'
  },
  wahyu: {
    title: 'WAHYU (TIM MEDIS PMR)',
    shirtColor: 0xffffff,
    pantsColor: 0x334155,
    accentColor: 0x10b981,
    skillHtml: '<strong>Wahyu (Tim Medis PMR):</strong> Senter medis ekstra terang dan pengisian ulang baterai 40% lebih cepat.'
  },
  alex: {
    title: 'ALEX (KEAMANAN)',
    shirtColor: 0x1e3a8a,
    pantsColor: 0x0f172a,
    accentColor: 0xfbbf24,
    skillHtml: '<strong>Alex (Keamanan):</strong> Senter patroli dengan baterai +40% lebih awet di kegelapan.'
  },
  rafi: {
    title: 'RAFI (ANAK TEKNIK TKJ)',
    shirtColor: 0x0284c7,
    pantsColor: 0x0f172a,
    accentColor: 0x38bdf8,
    skillHtml: '<strong>Rafi (Anak Teknik TKJ):</strong> Berlari +10% lebih cepat & baterai senter +25% lebih hemat.'
  }
};

// Alias kompatibilitas nama lama
SKIN_CATALOG.rizky = SKIN_CATALOG.adit;
SKIN_CATALOG.siti = SKIN_CATALOG.maulana;
SKIN_CATALOG.bima = SKIN_CATALOG.fery;
SKIN_CATALOG.citra = SKIN_CATALOG.wahyu;
SKIN_CATALOG.dedi = SKIN_CATALOG.alex;

const OUTFIT_CATALOG = {
  default: {
    label: 'Baju Khas Karakter',
    shirtColor: null,
    pantsColor: null,
    accentColor: null
  },
  osis: {
    label: 'Seragam OSIS Putih-Abu',
    shirtColor: 0xffffff,
    pantsColor: 0x64748b,
    accentColor: 0xef4444
  },
  pramuka: {
    label: 'Seragam Pramuka',
    shirtColor: 0xd6a87c,
    pantsColor: 0x5c3a21,
    accentColor: 0xdc2626
  },
  hoodie: {
    label: 'Jaket Hoodie Skantri',
    shirtColor: 0x18181b,
    pantsColor: 0x1e293b,
    accentColor: 0xef4444
  },
  basket: {
    label: 'Jersey Basket Merah-Emas',
    shirtColor: 0xdc2626,
    pantsColor: 0x111827,
    accentColor: 0xfacc15
  },
  wearpack: {
    label: 'Wearpack Praktik SMK',
    shirtColor: 0x0284c7,
    pantsColor: 0x0f172a,
    accentColor: 0x38bdf8
  },
  batik: {
    label: 'Batik Khas Skantri',
    shirtColor: 0x6b21a8,
    pantsColor: 0x18181b,
    accentColor: 0xf59e0b
  },
  jas: {
    label: 'Jas Almamater Sultan',
    shirtColor: 0x090d16,
    pantsColor: 0x111827,
    accentColor: 0xeab308
  }
};

const PADLOCK_COLORS = {
  1: 0xef4444,
  2: 0xfbbf24,
  3: 0x38bdf8,
  4: 0x22c55e,
  5: 0xa855f7,
  6: 0xe5e7eb
};

// ============================================================================
// SYNTHESIZER AUDIO HOROR + SUARA KETAWA KUNTILANAK ("HIHIHIHIHI!")
// ============================================================================
class HorrorAudio {
  constructor() {
    this.ctx = null;
    this.ambientStarted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.ambientStarted) {
      this.startAmbientDrone();
      this.ambientStarted = true;
    }
  }

  startAmbientDrone() {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.value = 43;
    osc2.frequency.value = 64.5;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 100;

    gain.gain.value = 0.04;
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start();
    osc2.start();
  }

  // SUARA KETAWA KUNTILANAK ("Hi-hi-hi-hi-hi-ha-ha-ha!")
  playKuntilanakLaugh(volumeScale = 0.85) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Deretan suku kata ketawa melengking khas Kuntilanak ("Hi-hi-hi-hi-hi-hi-ha-ha!")
    const syllables = [
      { f1: 1180, f2: 1360, dur: 0.13, delay: 0.0 },
      { f1: 1220, f2: 1420, dur: 0.13, delay: 0.16 },
      { f1: 1150, f2: 1340, dur: 0.13, delay: 0.32 },
      { f1: 1260, f2: 1480, dur: 0.14, delay: 0.48 },
      { f1: 1190, f2: 1390, dur: 0.14, delay: 0.65 },
      { f1: 1100, f2: 1280, dur: 0.16, delay: 0.82 },
      { f1: 980,  f2: 1160, dur: 0.20, delay: 1.01 },
      { f1: 860,  f2: 1020, dur: 0.28, delay: 1.24 }
    ];

    const masterGain = this.ctx.createGain();
    masterGain.gain.value = Math.min(0.42, Math.max(0.08, volumeScale * 0.36));

    // Efek Delay/Echo Lorong Sekolah agar suara ketawa menggema seram
    const delayNode = this.ctx.createDelay();
    delayNode.delayTime.value = 0.22;
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.35;
    delayNode.connect(feedback);
    feedback.connect(delayNode);

    masterGain.connect(this.ctx.destination);
    masterGain.connect(delayNode);
    delayNode.connect(this.ctx.destination);

    syllables.forEach((s) => {
      const start = now + s.delay;
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const vib = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();
      const env = this.ctx.createGain();

      osc.type = 'sawtooth';
      subOsc.type = 'triangle';

      osc.frequency.setValueAtTime(s.f1, start);
      osc.frequency.exponentialRampToValueAtTime(s.f2, start + s.dur * 0.45);
      osc.frequency.exponentialRampToValueAtTime(s.f1 * 0.82, start + s.dur);

      subOsc.frequency.setValueAtTime(s.f1 * 0.5, start);
      subOsc.frequency.exponentialRampToValueAtTime(s.f2 * 0.5, start + s.dur * 0.45);

      // Vibrato suara kuntilanak bergetar
      vib.frequency.value = 28;
      vibGain.gain.value = 35;
      vib.connect(vibGain);
      vibGain.connect(osc.frequency);

      // Filter vokal "i / a"
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1850;
      bandpass.Q.value = 2.2;

      env.gain.setValueAtTime(0.001, start);
      env.gain.linearRampToValueAtTime(0.9, start + 0.025);
      env.gain.exponentialRampToValueAtTime(0.001, start + s.dur);

      osc.connect(bandpass);
      subOsc.connect(bandpass);
      bandpass.connect(env);
      env.connect(masterGain);

      osc.start(start);
      subOsc.start(start);
      vib.start(start);
      osc.stop(start + s.dur + 0.02);
      subOsc.stop(start + s.dur + 0.02);
      vib.stop(start + s.dur + 0.02);
    });
  }

  playClick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.055);
  }

  playSkinSelect() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [520, 780].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0.14, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.15);
    });
  }

  playStep() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(92, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.095);
  }

  playLockerCreak() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.linearRampToValueAtTime(115, now + 0.18);
    osc.frequency.linearRampToValueAtTime(160, now + 0.32);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playPickup() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(980, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  playUnlockPadlock() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [320, 640, 960].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx === 0 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.18, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.26);
    });
  }

  playRitualChime() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [330, 495, 660].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.16, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.62);
    });
  }

  playHeartbeat() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(68, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(26, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.19);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playJumpscare() {
    if (!this.ctx) return;
    this.playKuntilanakLaugh(1.0);
    const now = this.ctx.currentTime;
    for (const freq of [135, 210, 325, 620, 810]) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 0.55, now + 0.9);
      gain.gain.setValueAtTime(0.2, now);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.92);
    }
  }

  // Jingle Audio Sinematik Logo "DEAN ADIT STUDIO"
  playStudioJingle() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub-bass impact drop
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(38, now + 1.1);
    subGain.gain.setValueAtTime(0.32, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(now);
    sub.stop(now + 1.25);

    // Chord sinematik megah (D minor -> A major shimmer)
    const notes = [
      { f: 293.66, d: 0.0, dur: 1.4 },
      { f: 440.0,  d: 0.12, dur: 1.35 },
      { f: 587.33, d: 0.24, dur: 1.3 },
      { f: 740.0,  d: 0.38, dur: 1.45 },
      { f: 880.0,  d: 0.52, dur: 1.6 }
    ];
    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.d);
      g.gain.setValueAtTime(0.001, now + n.d);
      g.gain.linearRampToValueAtTime(0.12, now + n.d + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + n.d + n.dur);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now + n.d);
      osc.stop(now + n.d + n.dur + 0.05);
    });
  }
}

const audio = new HorrorAudio();

// ============================================================================
// CONTROLLER ANIMASI LOGO "DEAN ADIT STUDIO" SAAT MASUK GAME
// ============================================================================
let studioIntroInterval = null;
let studioIntroTimeout = null;
let studioIntroCallback = null;

function finishStudioIntro() {
  if (!studioIntroOverlay) return;
  if (studioIntroInterval) {
    clearInterval(studioIntroInterval);
    studioIntroInterval = null;
  }
  if (studioIntroTimeout) {
    clearTimeout(studioIntroTimeout);
    studioIntroTimeout = null;
  }
  if (studioIntroBar) studioIntroBar.style.width = '100%';
  studioIntroOverlay.classList.add('fade-out');

  const cb = studioIntroCallback;
  studioIntroCallback = null;

  setTimeout(() => {
    studioIntroOverlay.classList.remove('active', 'fade-out');
    if (typeof cb === 'function') cb();
  }, 950);
}

function playStudioIntroAnimation(subtitleText = '🩸 MEMUAT AKUN & GEDUNG SEKOLAH DARAH SKANTRI...', durationMs = 6000, onComplete = null) {
  if (!studioIntroOverlay) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  if (studioIntroInterval) clearInterval(studioIntroInterval);
  if (studioIntroTimeout) clearTimeout(studioIntroTimeout);

  studioIntroCallback = onComplete;
  if (studioIntroSub) studioIntroSub.textContent = subtitleText;
  if (studioIntroBar) studioIntroBar.style.width = '0%';

  // Reset ulang animasi CSS elemen di dalam studio intro
  const centerStage = studioIntroOverlay.querySelector('.studio-center-stage');
  if (centerStage) {
    centerStage.style.animation = 'none';
    void centerStage.offsetWidth;
    centerStage.style.animation = '';
  }

  studioIntroOverlay.classList.remove('fade-out');
  studioIntroOverlay.classList.add('active');

  const pctEl = document.getElementById('studio-intro-pct');
  const startTs = performance.now();
  studioIntroInterval = setInterval(() => {
    const elapsed = performance.now() - startTs;
    const pct = Math.min(100, (elapsed / durationMs) * 100);
    if (studioIntroBar) studioIntroBar.style.width = `${pct.toFixed(1)}%`;
    if (pctEl) pctEl.textContent = `MEMUAT SISTEM LOGIN & PETA SEKOLAH... ${Math.floor(pct)}%`;
  }, 45);

  studioIntroTimeout = setTimeout(() => {
    finishStudioIntro();
  }, durationMs);
}

if (studioIntroOverlay) {
  studioIntroOverlay.addEventListener('click', () => {
    audio.init();
    audio.playStudioJingle();
    finishStudioIntro();
  });

  // Putar otomatis saat pertama kali membuka halaman game (6 detik dengan animasi bercak tangan darah)
  playStudioIntroAnimation('🩸 MEMUAT AKUN & GEDUNG SEKOLAH DARAH SKANTRI...', 6000, null);
}

// ============================================================================
// SETUP THREE.JS SCENE
// ============================================================================
const scene = new THREE.Scene();
const INGAME_BG_COLOR = new THREE.Color(0x060204);
const INGAME_FOG = new THREE.FogExp2(0x060204, 0.044);
scene.background = null;
scene.fog = null;

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 85);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x451a22, 0.25);
scene.add(ambientLight);

const schoolHemiLight = new THREE.HemisphereLight(0x475569, 0x180407, 0.24);
scene.add(schoolHemiLight);

const myFlashlight = new THREE.SpotLight(0xfff4dc, 3.1, 29, Math.PI / 4.4, 0.48, 1.4);
const myFlashlightTarget = new THREE.Object3D();
scene.add(myFlashlight);
scene.add(myFlashlightTarget);
myFlashlight.target = myFlashlightTarget;

const selfGlow = new THREE.PointLight(0x521820, 0.36, 4.5);
scene.add(selfGlow);

// ============================================================================
// STATE CLIENT & SCREEN MODE (DEFAULT: LANGSUNG LOBBY 1 ORANG / SOLO)
// ============================================================================
let currentScreen = 'lobby';
let lobbyMode = 'solo'; // 'solo' (1 Orang) | 'mabar' (4 Orang)
let myPlayerId = null;
let mySkinId = 'adit';
let myOutfit = {
  outfitId: 'default',
  headgear: 'default',
  skinTone: '#f1c27d',
  customShirt: '',
  customPants: ''
};
try {
  const savedOutfitRaw = localStorage.getItem('darah_skantri_outfit');
  if (savedOutfitRaw) {
    const parsedOutfit = JSON.parse(savedOutfitRaw);
    if (parsedOutfit && typeof parsedOutfit === 'object') {
      myOutfit = { ...myOutfit, ...parsedOutfit };
    }
  }
  const savedSkinRaw = localStorage.getItem('darah_skantri_skin');
  if (savedSkinRaw) {
    mySkinId = normalizeSkinId(savedSkinRaw);
  }
} catch (e) {}
let mapGrid = [];
let cellSize = 4;
let currentFloorNum = 1;

const myState = {
  x: 0,
  y: 1.6,
  z: 22,
  yaw: 0,
  pitch: 0,
  flashlight: true,
  stamina: 100,
  battery: 100,
  alive: true,
  hiding: false,
  lockerId: null,
  inventory: []
};

const keys = {};
const otherPlayerMeshes = new Map();
const scrapMeshes = new Map();
const lockerMeshes = new Map();
const candleMeshes = new Map();
const doorPadlockMeshes = new Map();
let worldGroup = new THREE.Group();
scene.add(worldGroup);

const lobbyStageGroup = new THREE.Group();
scene.add(lobbyStageGroup);
let lobbyCharacterGroup = new THREE.Group();
lobbyStageGroup.add(lobbyCharacterGroup);
let lobbyRings = [];

let flickeringLights = [];
let scrapsData = [];
let lockersData = [];
let ritualCandlesData = [];
let reviveReadyState = false;
let playersData = {};
let monsterData = { x: 0, z: 0, yaw: 0, state: 'patrol' };

// ============================================================================
// PANGGUNG 3D LOBBY DI ATAS PANGGUNG KREASI SMKS PGRI SINGOSARI
// ============================================================================
const STAGE_CENTER_X = 0.72;
const SOLO_PODIUM_SLOT = { x: STAGE_CENTER_X, z: 99.0, yaw: 0.0 };
const PODIUM_SLOTS = [
  { x: -0.98, z: 98.92, yaw: 0.14 },
  { x: 0.15, z: 99.0, yaw: 0.05 },
  { x: 1.29, z: 99.0, yaw: -0.05 },
  { x: 2.42, z: 98.92, yaw: -0.14 }
];

const lobbyTextureLoader = new THREE.TextureLoader();
const lobbyStageTexture = lobbyTextureLoader.load('lobby-bg.jpeg?v=20261103');

function buildFreeFireLobbyStage(mode = lobbyMode) {
  while (lobbyStageGroup.children.length > 0) {
    lobbyStageGroup.remove(lobbyStageGroup.children[0]);
  }
  lobbyCharacterGroup = new THREE.Group();
  lobbyStageGroup.add(lobbyCharacterGroup);
  lobbyRings = [];

  // Backdrop 3D Panggung Kreasi (1280x634) tepat pada bidang Z=99.0 agar kaki karakter (Y=0.02, Z=99.0)
  // selalu terkunci presisi di atas lantai keramik panggung baik di HP (Portrait/Landscape) maupun PC
  const stageBackdropPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(13.147, 6.512),
    new THREE.MeshBasicMaterial({
      map: lobbyStageTexture,
      depthTest: false,
      depthWrite: false
    })
  );
  stageBackdropPlane.position.set(0, 1.623, 99.0);
  stageBackdropPlane.renderOrder = -10;
  lobbyStageGroup.add(stageBackdropPlane);

  // Pencahayaan Panggung Kreasi (Menyesuaikan cahaya pagi panggung & pantulan lantai keramik pada foto)
  const stageRoofLight = new THREE.PointLight(0xffffff, 2.4, 24);
  stageRoofLight.position.set(STAGE_CENTER_X, 3.8, 102.5);
  lobbyStageGroup.add(stageRoofLight);

  const stageWarmBounce = new THREE.PointLight(0xfde68a, 1.45, 20);
  stageWarmBounce.position.set(STAGE_CENTER_X, 1.1, 101.8);
  lobbyStageGroup.add(stageWarmBounce);

  const backCyanRimLight = new THREE.PointLight(0x67e8f9, 1.2, 18);
  backCyanRimLight.position.set(STAGE_CENTER_X, 2.4, 96.8);
  lobbyStageGroup.add(backCyanRimLight);

  const slotsToBuild = mode === 'solo' ? [SOLO_PODIUM_SLOT] : PODIUM_SLOTS;
  const radiusScale = mode === 'solo' ? 1.15 : 0.95;

  slotsToBuild.forEach((slot) => {
    const pedGroup = new THREE.Group();

    // Bayangan pijakan kaki di atas lantai keramik panggung foto
    const shadowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.56 * radiusScale, 28),
      new THREE.MeshBasicMaterial({
        color: 0x090406,
        transparent: true,
        opacity: 0.52
      })
    );
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.008;
    pedGroup.add(shadowDisc);

    const neonRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.58 * radiusScale, 0.026, 8, 36),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = 0.018;
    pedGroup.add(neonRing);
    lobbyRings.push(neonRing);

    pedGroup.position.set(slot.x, 0, slot.z);
    lobbyStageGroup.add(pedGroup);
  });
}

buildFreeFireLobbyStage('solo');

// ============================================================================
// MODEL 3D KARAKTER SESUAI NAMA (RIZKY, SITI, BIMA, CITRA, PAK DEDI)
// ============================================================================
function createPlayerBannerSprite(nameText, subText, badgeColor = '#fde047') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(12, 5, 8, 0.85)';
  ctx.fillRect(6, 6, 244, 68);
  ctx.strokeStyle = badgeColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, 244, 68);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 21px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(nameText, 128, 34);

  ctx.fillStyle = badgeColor;
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(subText, 128, 59);

  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(1.5, 0.46, 1);
  sprite.position.y = 2.28;
  return sprite;
}

function createCharacterMesh(player, isLobbyPodium = false) {
  const skinId = normalizeSkinId(player.skinId || 'adit');
  const skinInfo = SKIN_CATALOG[skinId] || SKIN_CATALOG.adit;

  const pOutfit = (player.outfit && typeof player.outfit === 'object')
    ? player.outfit
    : (player.id === myPlayerId || isLobbyPodium ? myOutfit : {});
  const outfitId = OUTFIT_CATALOG[pOutfit.outfitId] ? pOutfit.outfitId : 'default';
  const outfitPreset = OUTFIT_CATALOG[outfitId];
  const headgearMode = pOutfit.headgear || 'default';

  const finalShirtColor = pOutfit.customShirt
    ? new THREE.Color(pOutfit.customShirt)
    : new THREE.Color(outfitPreset.shirtColor !== null ? outfitPreset.shirtColor : skinInfo.shirtColor);
  const finalPantsColor = pOutfit.customPants
    ? new THREE.Color(pOutfit.customPants)
    : new THREE.Color(outfitPreset.pantsColor !== null ? outfitPreset.pantsColor : skinInfo.pantsColor);
  const finalAccentColor = new THREE.Color(
    outfitPreset.accentColor !== null ? outfitPreset.accentColor : skinInfo.accentColor
  );
  const finalSkinTone = new THREE.Color(pOutfit.skinTone || '#f1c27d');

  const group = new THREE.Group();
  const faceDir = isLobbyPodium ? 1 : -1;

  const skinToneMat = new THREE.MeshStandardMaterial({ color: finalSkinTone, roughness: 0.6 });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: finalShirtColor,
    roughness: 0.48,
    transparent: true,
    opacity: 1.0
  });
  const pantsMat = new THREE.MeshStandardMaterial({ color: finalPantsColor, roughness: 0.68 });
  const accentMat = new THREE.MeshBasicMaterial({ color: finalAccentColor });

  // Kaki Kiri & Kaki Kanan (Celana Sekolah)
  const legGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.65, 10);
  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.set(-0.13, 0.32, 0);
  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.set(0.13, 0.32, 0);
  group.add(leftLeg, rightLeg);

  // Sepatu Sekolah Hitam
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4 });
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.24), shoeMat);
  shoeL.position.set(-0.13, 0.05, 0.03 * faceDir);
  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.24), shoeMat);
  shoeR.position.set(0.13, 0.05, 0.03 * faceDir);
  group.add(shoeL, shoeR);

  // Badan / Baju Seragam
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.68, 0.28), shirtMat);
  torso.position.y = 0.96;
  group.add(torso);

  // Lengan Kiri & Kanan
  const armGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.58, 10);
  const leftArm = new THREE.Mesh(armGeo, shirtMat);
  leftArm.position.set(-0.33, 0.94, 0);
  const rightArm = new THREE.Mesh(armGeo, shirtMat);
  rightArm.position.set(0.33, 0.94, 0);
  group.add(leftArm, rightArm);

  // Kepala & Mata
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), skinToneMat);
  head.position.y = 1.54;
  group.add(head);

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), eyeMat);
  eyeL.position.set(-0.08, 1.56, 0.21 * faceDir);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), eyeMat);
  eyeR.position.set(0.08, 1.56, 0.21 * faceDir);
  group.add(eyeL, eyeR);

  // Rambut Dasar
  const baseHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.54),
    new THREE.MeshStandardMaterial({ color: 0x111827 })
  );
  baseHair.position.y = 1.56;
  group.add(baseHair);

  // Detail Baju / Kostum (OUTFIT)
  const effectiveStyle = outfitId === 'default' ? skinId : outfitId;
  if (effectiveStyle === 'adit' || effectiveStyle === 'osis') {
    const redTie = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.04), accentMat);
    redTie.position.set(0, 0.98, 0.15 * faceDir);
    group.add(redTie);

    const osisBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 0.12, 10),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    osisBand.position.set(-0.33, 1.02, 0);
    group.add(osisBand);
  } else if (effectiveStyle === 'pramuka') {
    const kacuRed = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.32, 4),
      new THREE.MeshBasicMaterial({ color: 0xdc2626 })
    );
    kacuRed.rotation.x = Math.PI;
    kacuRed.position.set(0, 1.12, 0.15 * faceDir);
    group.add(kacuRed);
  } else if (effectiveStyle === 'hoodie' || effectiveStyle === 'maulana') {
    const hoodCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.045, 8, 16),
      accentMat
    );
    hoodCollar.rotation.x = Math.PI / 2;
    hoodCollar.position.set(0, 1.29, 0);
    group.add(hoodCollar);

    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.04), accentMat);
    pocket.position.set(0, 0.78, 0.15 * faceDir);
    group.add(pocket);
  } else if (effectiveStyle === 'fery' || effectiveStyle === 'basket') {
    const numberBadge = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.03), accentMat);
    numberBadge.position.set(0, 1.0, 0.15 * faceDir);
    group.add(numberBadge);
  } else if (effectiveStyle === 'wahyu') {
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.04), crossMat);
    crossV.position.set(0, 1.0, 0.15 * faceDir);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.04), crossMat);
    crossH.position.set(0, 1.0, 0.15 * faceDir);
    group.add(crossV, crossH);
  } else if (effectiveStyle === 'alex' || effectiveStyle === 'jas') {
    const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.04), accentMat);
    lapelL.position.set(-0.11, 1.02, 0.15 * faceDir);
    const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.04), accentMat);
    lapelR.position.set(0.11, 1.02, 0.15 * faceDir);
    const badge = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), accentMat);
    badge.position.set(0.14, 1.12, 0.16 * faceDir);
    group.add(lapelL, lapelR, badge);
  } else if (effectiveStyle === 'rafi' || effectiveStyle === 'wearpack' || effectiveStyle === 'batik') {
    const stripeH = new THREE.Mesh(new THREE.BoxGeometry(0.51, 0.07, 0.29), accentMat);
    stripeH.position.set(0, 1.06, 0);
    const pocketBadge = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.04), accentMat);
    pocketBadge.position.set(-0.13, 1.12, 0.15 * faceDir);
    group.add(stripeH, pocketBadge);
  }

  // Detail Aksesoris Kepala / Skin Aura (HEADGEAR)
  const resolvedHeadgear =
    headgearMode !== 'default'
      ? headgearMode
      : skinId === 'maulana'
      ? 'aura'
      : skinId === 'fery'
      ? 'headband'
      : skinId === 'wahyu' || skinId === 'alex'
      ? 'cap'
      : skinId === 'rafi'
      ? 'glasses'
      : 'none';

  if (resolvedHeadgear === 'cap') {
    const capTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.24, 0.13, 16),
      new THREE.MeshStandardMaterial({ color: skinId === 'wahyu' ? 0x10b981 : 0x0f172a })
    );
    capTop.position.y = 1.74;
    group.add(capTop);

    const capVisor = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.04, 0.2),
      new THREE.MeshBasicMaterial({ color: 0x090d16 })
    );
    capVisor.position.set(0, 1.69, 0.18 * faceDir);
    group.add(capVisor);
  } else if (resolvedHeadgear === 'headband') {
    const headband = new THREE.Mesh(
      new THREE.CylinderGeometry(0.248, 0.248, 0.07, 16),
      accentMat
    );
    headband.position.y = 1.63;
    group.add(headband);
  } else if (resolvedHeadgear === 'glasses') {
    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.08, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    visor.position.set(0, 1.56, 0.22 * faceDir);
    group.add(visor);
  } else if (resolvedHeadgear === 'aura') {
    const indigoRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.03, 8, 28),
      accentMat
    );
    indigoRing.rotation.x = Math.PI / 2;
    indigoRing.position.y = 0.06;
    group.add(indigoRing);
  }

  const outfitLabel = outfitId === 'default' ? skinInfo.title : `${skinInfo.title} • ${outfitPreset.label}`;

  if (!isLobbyPodium) {
    const spot = new THREE.SpotLight(0xfff4e0, 2.0, 18, Math.PI / 5, 0.5, 1.5);
    spot.position.set(0, 1.45, 0);
    const target = new THREE.Object3D();
    target.position.set(0, 1.45, -6);
    group.add(spot);
    group.add(target);
    spot.target = target;
    group.userData = { flashlight: spot, suitMat: shirtMat, skinId };

    const nameSprite = createPlayerBannerSprite(player.name, outfitLabel, '#fde047');
    group.add(nameSprite);
  } else {
    const statusText = outfitId === 'default' ? (player.ready ? '✔ SIAP MABAR' : '⏳ DI LOBBY') : outfitPreset.label.toUpperCase();
    const badgeColor = player.ready ? '#4ade80' : '#fbbf24';
    const banner = createPlayerBannerSprite(player.name, `${skinInfo.title} • ${statusText}`, badgeColor);
    group.add(banner);
  }

  return group;
}


function syncLobbyPodiumCharacters() {
  const pList = Object.values(playersData);
  const effectiveMode = lobbyMode === 'solo' && pList.length <= 1 ? 'solo' : 'mabar';

  // Pastikan panggung 3D sesuai mode (1 Podium Tengah vs 4 Podium Squad)
  if (lobbyRings.length !== (effectiveMode === 'solo' ? 1 : 4)) {
    buildFreeFireLobbyStage(effectiveMode);
  }

  while (lobbyCharacterGroup.children.length > 0) {
    lobbyCharacterGroup.remove(lobbyCharacterGroup.children[0]);
  }

  if (effectiveMode === 'solo') {
    if (ffRoomCode) ffRoomCode.textContent = '1 ORANG (SOLO)';
    if (ffLobbyModeTag) ffLobbyModeTag.textContent = '🔥 LOBBY 1 ORANG (SOLO PLAYER)';
    if (ffSeasonTag) ffSeasonTag.textContent = 'MODE SOLO • LOBBY 1 ORANG';
    if (mabarSquadCount) mabarSquadCount.textContent = '1 / 1 PEMAIN (MODE SOLO)';
    if (btnModeSolo) btnModeSolo.classList.add('active-mode-btn');
    if (btnModeMabar4) btnModeMabar4.classList.remove('active-mode-btn');

    const soloPlayer = pList[0] || {
      name: (usernameInput && usernameInput.value.trim()) || 'Adit•OSIS',
      skinId: mySkinId,
      outfit: myOutfit,
      ready: true
    };
    soloPlayer.skinId = mySkinId;
    soloPlayer.outfit = myOutfit;
    const charMesh = createCharacterMesh(soloPlayer, true);
    charMesh.position.set(SOLO_PODIUM_SLOT.x, 0.02, SOLO_PODIUM_SLOT.z);
    charMesh.rotation.y = SOLO_PODIUM_SLOT.yaw;
    charMesh.userData.baseYaw = SOLO_PODIUM_SLOT.yaw;
    lobbyCharacterGroup.add(charMesh);
  } else {
    if (ffRoomCode) ffRoomCode.textContent = `SQUAD ${pList.length}/4 PEMAIN`;
    if (ffLobbyModeTag) ffLobbyModeTag.textContent = `🔥 SQUAD MABAR 4 ORANG (${pList.length}/4)`;
    if (ffSeasonTag) ffSeasonTag.textContent = 'MODE CO-OP • LOBBY MABAR 4 ORANG';
    if (mabarSquadCount) mabarSquadCount.textContent = `${pList.length} / 4 PEMAIN DI SQUAD MABAR`;
    if (btnModeSolo) btnModeSolo.classList.remove('active-mode-btn');
    if (btnModeMabar4) btnModeMabar4.classList.add('active-mode-btn');

    for (let i = 0; i < 4; i++) {
      const slot = PODIUM_SLOTS[i];
      const p = pList[i];
      if (p) {
        const charMesh = createCharacterMesh(p, true);
        charMesh.position.set(slot.x, 0.02, slot.z);
        charMesh.rotation.y = slot.yaw;
        charMesh.userData.baseYaw = slot.yaw;
        lobbyCharacterGroup.add(charMesh);
      } else {
        const emptyBanner = createPlayerBannerSprite(`SLOT MABAR #${i + 1}`, 'MENUNGGU PEMAIN...', '#9ca3af');
        emptyBanner.position.set(slot.x, 1.15, slot.z);
        emptyBanner.userData.isBannerOnly = true;
        lobbyCharacterGroup.add(emptyBanner);
      }
    }
  }
}

syncLobbyPodiumCharacters();

// ============================================================================
// MODEL 3D HANTU DARI FILE GLB (Skin_Wahyu.glb) + ANIMASI KEJAR ALA PETA ETA ROBLOX
// ============================================================================
function parseGLBBufferNative(arrayBuffer) {
  const dv = new DataView(arrayBuffer);
  const magic = dv.getUint32(0, true);
  if (magic !== 0x46546c67) {
    throw new Error('Bukan file GLB valid');
  }
  const jsonChunkLen = dv.getUint32(12, true);
  const jsonBytes = new Uint8Array(arrayBuffer, 20, jsonChunkLen);
  const gltf = JSON.parse(new TextDecoder('utf-8').decode(jsonBytes));

  const binChunkOffset = 20 + jsonChunkLen + 8;
  const prim = gltf.meshes[0].primitives[0];

  function getAccessorTypedArray(accIdx) {
    const acc = gltf.accessors[accIdx];
    const bv = gltf.bufferViews[acc.bufferView];
    const byteOffset = binChunkOffset + (bv.byteOffset || 0) + (acc.byteOffset || 0);
    const numComponents = acc.type === 'VEC3' ? 3 : acc.type === 'VEC2' ? 2 : 1;
    const length = acc.count * numComponents;
    if (acc.componentType === 5126) {
      return new Float32Array(arrayBuffer.slice(byteOffset, byteOffset + length * 4));
    }
    if (acc.componentType === 5125) {
      return new Uint32Array(arrayBuffer.slice(byteOffset, byteOffset + length * 4));
    }
    if (acc.componentType === 5123) {
      return new Uint16Array(arrayBuffer.slice(byteOffset, byteOffset + length * 2));
    }
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  if (prim.attributes.POSITION !== undefined) {
    geometry.setAttribute('position', new THREE.BufferAttribute(getAccessorTypedArray(prim.attributes.POSITION), 3));
  }
  if (prim.attributes.NORMAL !== undefined) {
    geometry.setAttribute('normal', new THREE.BufferAttribute(getAccessorTypedArray(prim.attributes.NORMAL), 3));
  }
  if (prim.attributes.TEXCOORD_0 !== undefined) {
    geometry.setAttribute('uv', new THREE.BufferAttribute(getAccessorTypedArray(prim.attributes.TEXCOORD_0), 2));
  }
  if (prim.indices !== undefined) {
    geometry.setIndex(new THREE.BufferAttribute(getAccessorTypedArray(prim.indices), 1));
  }

  function loadEmbeddedTexture(texIdx) {
    if (!gltf.textures || !gltf.textures[texIdx]) return null;
    const imgDef = gltf.images[gltf.textures[texIdx].source];
    const bv = gltf.bufferViews[imgDef.bufferView];
    const start = binChunkOffset + (bv.byteOffset || 0);
    const slice = arrayBuffer.slice(start, start + bv.byteLength);
    const blob = new Blob([slice], { type: imgDef.mimeType || 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const tex = new THREE.TextureLoader().load(url, () => {
      URL.revokeObjectURL(url);
    });
    tex.flipY = false;
    return tex;
  }

  const baseColorTex = loadEmbeddedTexture(0);
  const normalTex = loadEmbeddedTexture(2);

  const mat = new THREE.MeshStandardMaterial({
    map: baseColorTex,
    normalMap: normalTex,
    roughness: 0.68,
    metalness: 0.12,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: baseColorTex,
    emissiveIntensity: 0.42,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, mat);
  const root = new THREE.Group();
  root.add(mesh);
  return root;
}

function setupGhostMeshAnimationAndMaterials(rootGroup, monsterGroup) {
  const box = new THREE.Box3().setFromObject(rootGroup);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // Skala karakter hantu 3D menjadi ~2.42m (tinggi menyeramkan di koridor sekolah)
  const targetHeight = 2.42;
  const scale = size.y > 0.01 ? targetHeight / size.y : 1.28;
  rootGroup.scale.set(scale, scale, scale);
  rootGroup.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

  const animMeshes = [];
  const ghostMaterials = [];

  rootGroup.traverse((child) => {
    if (child.isMesh && child.geometry) {
      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          m.metalness = 0.12;
          m.roughness = 0.68;
          m.emissive = new THREE.Color(0xffffff);
          if (m.map) m.emissiveMap = m.map;
          m.emissiveIntensity = 0.42;
          m.needsUpdate = true;
          ghostMaterials.push(m);
        });
      }

      const posAttr = child.geometry.attributes.position;
      if (posAttr && posAttr.count > 0) {
        posAttr.setUsage(THREE.DynamicDrawUsage);
        const basePositions = new Float32Array(posAttr.array);
        const legIndices = [];
        const upperIndices = [];

        for (let i = 0; i < posAttr.count; i++) {
          const bx = basePositions[i * 3];
          const by = basePositions[i * 3 + 1];
          // Area kaki (terpisah rapi di x = -0.05 di bawah y = -0.45)
          if (by < -0.45) {
            const w = Math.min(1.0, (-0.45 - by) / 0.48);
            legIndices.push({
              idx3: i * 3,
              isLeft: bx < -0.05,
              weight: w
            });
          } else if (by > -0.22) {
            // Area bahu/tangan & kepala untuk gerakan mengejar agresif
            const torsoWeight = Math.min(1.0, (by + 0.22) / 0.65);
            const isHead = by > 0.56;
            const headWeight = isHead ? Math.min(1.0, (by - 0.56) / 0.36) : 0;
            upperIndices.push({
              idx3: i * 3,
              torsoWeight,
              headWeight
            });
          }
        }

        animMeshes.push({
          posAttr,
          basePositions,
          legIndices,
          upperIndices
        });
      }
    }
  });

  monsterGroup.userData.animMeshes = animMeshes;
  monsterGroup.userData.ghostMaterials = ghostMaterials;
  monsterGroup.userData.glbLoaded = true;
}

function loadGhost3DModel(modelHolder, fallbackHolder, monsterGroup) {
  const candidateUrls = ['Skin_Wahyu.glb', 'http://localhost:3000/Skin_Wahyu.glb'];

  function applyLoadedModel(rootObj) {
    while (fallbackHolder.children.length > 0) {
      fallbackHolder.remove(fallbackHolder.children[0]);
    }
    fallbackHolder.visible = false;
    setupGhostMeshAnimationAndMaterials(rootObj, monsterGroup);
    modelHolder.add(rootObj);
  }

  function tryFetchAndParse(urlIdx) {
    if (urlIdx >= candidateUrls.length) return;
    fetch(candidateUrls[urlIdx])
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        if (typeof THREE.GLTFLoader === 'function') {
          const loader = new THREE.GLTFLoader();
          loader.parse(
            arrayBuffer,
            '',
            (gltf) => {
              applyLoadedModel(gltf.scene);
            },
            () => {
              try {
                const root = parseGLBBufferNative(arrayBuffer);
                applyLoadedModel(root);
              } catch (e) {}
            }
          );
        } else {
          const root = parseGLBBufferNative(arrayBuffer);
          applyLoadedModel(root);
        }
      })
      .catch(() => {
        tryFetchAndParse(urlIdx + 1);
      });
  }

  tryFetchAndParse(0);
}

function createMonsterMesh() {
  const group = new THREE.Group();
  const bodyPivot = new THREE.Group();
  group.add(bodyPivot);

  const modelHolder = new THREE.Group();
  const fallbackHolder = new THREE.Group();
  bodyPivot.add(modelHolder);
  bodyPivot.add(fallbackHolder);

  // Siluet sementara selama beberapa milidetik sebelum Skin_Wahyu.glb selesai dimuat
  const tempMat = new THREE.MeshStandardMaterial({ color: 0x3b0a10, roughness: 0.7, emissive: 0x1f0408 });
  const tempBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 2.2, 12), tempMat);
  tempBody.position.y = 1.1;
  fallbackHolder.add(tempBody);

  // Muat 3D Model Skin_Wahyu.glb sebagai karakter Hantu Utama
  loadGhost3DModel(modelHolder, fallbackHolder, group);

  // Banner Nama di Atas Kepala Hantu (Ala Boss / Nextbot Peta Eta Roblox)
  const ghostBanner = createPlayerBannerSprite('👻 HANTU WAHYU (3D)', 'MENGEJAR PLAYER • ALA PETA ETA', '#ef4444');
  ghostBanner.position.y = 2.92;
  group.add(ghostBanner);

  // EFEK SINAR MERAH & PENCAHAYAAN 3D DI SEKELILING HANTU
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xff0022,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const redBeam = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.38, 3.1, 18, 1, true), beamMat);
  redBeam.position.y = 1.55;
  group.add(redBeam);

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff2233,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.045, 8, 28), ringMat);
  ring1.rotation.x = Math.PI / 2;
  ring1.position.y = 0.12;
  group.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.035, 8, 28), ringMat);
  ring2.rotation.x = Math.PI / 2;
  ring2.position.y = 1.25;
  group.add(ring2);

  // Cahaya depan khusus agar tekstur 3D model Skin_Wahyu.glb terlihat sangat jelas di lorong gelap
  const frontModelLight = new THREE.PointLight(0xffe4e6, 2.4, 9.5);
  frontModelLight.position.set(0, 1.8, 1.15);
  group.add(frontModelLight);

  const redAuraLight = new THREE.PointLight(0xff0022, 4.0, 15);
  redAuraLight.position.set(0, 1.85, -0.3);
  group.add(redAuraLight);

  group.userData = {
    bodyPivot,
    redBeam,
    ring1,
    ring2,
    redAuraLight,
    frontModelLight,
    animMeshes: [],
    ghostMaterials: [],
    glbLoaded: false
  };
  return group;
}


const monsterMesh = createMonsterMesh();
scene.add(monsterMesh);

// ============================================================================
// MAP GEDUNG SEKOLAH ROBLOX (4 LANTAI, KELAS, PAPAN TULIS, MEJA KURSI & LOKER)
// ============================================================================
function createWallTexture(floorNum = 1) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');

  // Bagian atas dinding tembok sekolah tua yang kusam, retak & mencekam
  ctx.fillStyle = '#6e665b';
  ctx.fillRect(0, 0, 256, 158);

  // Bercak lembab & jamur tua di tembok atas
  ctx.fillStyle = 'rgba(20, 12, 14, 0.34)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(25 + i * 42, 45 + (i % 3) * 34, 22 + (i % 2) * 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tekstur garis blok bata & retakan dinding sekolah
  ctx.strokeStyle = 'rgba(25, 18, 15, 0.38)';
  ctx.lineWidth = 2;
  for (let y = 16; y < 156; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  // Garis retakan tajam di dinding
  ctx.strokeStyle = '#1c1311';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(64, 38);
  ctx.lineTo(78, 72);
  ctx.lineTo(68, 108);
  ctx.lineTo(86, 142);
  ctx.moveTo(192, 52);
  ctx.lineTo(176, 94);
  ctx.lineTo(188, 134);
  ctx.stroke();

  // Ventilasi udara atas dinding kelas sekolah (gelap & berkarat)
  ctx.fillStyle = '#0f1319';
  ctx.fillRect(28, 14, 80, 22);
  ctx.fillRect(148, 14, 80, 22);
  ctx.strokeStyle = '#3b2416';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 14, 80, 22);
  ctx.strokeRect(148, 14, 80, 22);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  for (let vy = 19; vy <= 31; vy += 5) {
    ctx.beginPath();
    ctx.moveTo(30, vy);
    ctx.lineTo(106, vy);
    ctx.moveTo(150, vy);
    ctx.lineTo(226, vy);
    ctx.stroke();
  }

  // Warna cat bawah dinding (Wainscoting) khas tiap lantai sekolah versi gelap angker
  const lowerColors = ['#163023', '#13263b', '#3b1219', '#332414'];
  const lowerWallColor = lowerColors[(floorNum - 1) % lowerColors.length];
  ctx.fillStyle = lowerWallColor;
  ctx.fillRect(0, 158, 256, 86);

  // Lis kayu pembatas tengah dinding sekolah (Dado rail)
  ctx.fillStyle = '#361f10';
  ctx.fillRect(0, 152, 256, 10);
  ctx.fillStyle = '#52321b';
  ctx.fillRect(0, 154, 256, 3);

  // Plint keramik bawah dinding (Baseboard)
  ctx.fillStyle = '#0d0f12';
  ctx.fillRect(0, 240, 256, 16);

  // Cipratan & lelehan darah mengering di dinding sekolah
  ctx.fillStyle = 'rgba(125, 10, 16, 0.72)';
  const bloodSpots = [
    { x: 52, y: 96, r: 14, drip: 48 },
    { x: 138, y: 82, r: 18, drip: 64 },
    { x: 205, y: 115, r: 12, drip: 42 },
    { x: 95, y: 178, r: 15, drip: 38 }
  ];
  bloodSpots.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(b.x - 2.5, b.y, 5, b.drip);
    ctx.fillRect(b.x + 4, b.y + 4, 2.5, b.drip * 0.75);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createFloorTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');

  // Lantai keramik kotak-kotak sekolah tua yang kotor, retak & bernoda darah
  const tiles = 4;
  const step = 256 / tiles;
  for (let r = 0; r < tiles; r++) {
    for (let col = 0; col < tiles; col++) {
      const isEven = (r + col) % 2 === 0;
      ctx.fillStyle = isEven ? '#57524c' : '#423e39';
      ctx.fillRect(col * step, r * step, step, step);

      ctx.strokeStyle = '#24201d';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(col * step + 1, r * step + 1, step - 2, step - 2);
    }
  }

  // Noda darah gelap & jejak kotor di keramik lantai
  ctx.fillStyle = 'rgba(95, 8, 14, 0.55)';
  ctx.beginPath();
  ctx.arc(88, 96, 26, 0, Math.PI * 2);
  ctx.arc(182, 174, 18, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(22, 22);
  return tex;
}

function createCeilingTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');

  // Plafon gipsum sekolah gelap & lembab bocor
  ctx.fillStyle = '#262428';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = '#141215';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, 128, 128);
  ctx.strokeRect(128, 0, 128, 128);
  ctx.strokeRect(0, 128, 128, 128);
  ctx.strokeRect(128, 128, 128, 128);

  ctx.fillStyle = 'rgba(15, 8, 10, 0.5)';
  ctx.beginPath();
  ctx.arc(64, 64, 36, 0, Math.PI * 2);
  ctx.arc(192, 180, 42, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 18);
  return tex;
}

// Membuat objek Meja + Kursi Kayu Siswa ala Sekolah Roblox
function createStudentDeskAndChair() {
  const group = new THREE.Group();
  const woodTopMat = new THREE.MeshStandardMaterial({ color: 0x9c6635, roughness: 0.65 });
  const woodDarkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.75 });
  const metalLegMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.4 });

  // Daun meja sekolah
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.06, 0.56), woodTopMat);
  top.position.set(0, 0.76, 0);
  group.add(top);

  // Laci kolong meja
  const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.12, 0.48), woodDarkMat);
  drawer.position.set(0, 0.67, 0);
  group.add(drawer);

  // 4 Kaki meja
  const legGeo = new THREE.BoxGeometry(0.05, 0.74, 0.05);
  [
    [-0.38, -0.23],
    [0.38, -0.23],
    [-0.38, 0.23],
    [0.38, 0.23]
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, metalLegMat);
    leg.position.set(lx, 0.37, lz);
    group.add(leg);
  });

  // Kursi kayu siswa di belakang meja
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.44), woodTopMat);
  seat.position.set(0, 0.45, 0.48);
  group.add(seat);

  const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.42, 0.05), woodDarkMat);
  backrest.position.set(0, 0.68, 0.68);
  group.add(backrest);

  const chairLegGeo = new THREE.BoxGeometry(0.045, 0.45, 0.045);
  [
    [-0.19, 0.3],
    [0.19, 0.3],
    [-0.19, 0.66],
    [0.19, 0.66]
  ].forEach(([cx, cz]) => {
    const cLeg = new THREE.Mesh(chairLegGeo, metalLegMat);
    cLeg.position.set(cx, 0.225, cz);
    group.add(cLeg);
  });

  return group;
}


// Membuat Papan Tulis Hijau Kelas + Tulisan Darah & Kapur Horor
function createSchoolChalkboard(roomTitle = 'KELAS X-A', floorNum = 1) {
  const group = new THREE.Group();

  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');

  // Latar papan tulis hijau tua kotor & tergores
  ctx.fillStyle = '#0c2417';
  ctx.fillRect(0, 0, 512, 256);

  // Bercak darah gelap di sudut papan tulis
  ctx.fillStyle = 'rgba(140, 12, 18, 0.55)';
  ctx.beginPath();
  ctx.arc(72, 68, 42, 0, Math.PI * 2);
  ctx.arc(435, 190, 50, 0, Math.PI * 2);
  ctx.fill();

  // Tulisan kapur & peringatan darah di papan tulis
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`=== ${roomTitle} (LANTAI ${floorNum}) ===`, 256, 48);

  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.fillText('JANGAN MENOLEH KE BELAKANG!', 256, 98);

  ctx.fillStyle = '#fca5a5';
  ctx.font = '19px monospace';
  ctx.fillText('• Dia mendengar langkah kakimu di lorong...', 256, 140);
  ctx.fillText('• Sembunyi di Kamar Mandi / Loker [E]!', 256, 172);

  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('|||| |||| ||||  CARI 6 KONCI SEKARANG!', 256, 218);

  const boardTex = new THREE.CanvasTexture(c);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x3b2312, roughness: 0.8 });
  const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.48, 0.08), frameMat);
  group.add(frameMesh);

  const boardMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.74, 1.32),
    new THREE.MeshBasicMaterial({ map: boardTex })
  );
  boardMesh.position.z = 0.045;
  group.add(boardMesh);

  // Tempat kapur & penghapus di bawah papan tulis
  const tray = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.07, 0.16), frameMat);
  tray.position.set(0, -0.72, 0.06);
  group.add(tray);

  return group;
}


// Membuat Papan Mading (Majalah Dinding) / Poster Koridor Sekolah
function createSchoolMadingBoard(titleText = 'MADING OSIS SMK SKANTRI') {
  const group = new THREE.Group();
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 160;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#6b4423';
  ctx.fillRect(0, 0, 256, 160);
  ctx.fillStyle = '#1e3a2f';
  ctx.fillRect(10, 10, 236, 140);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(titleText, 128, 30);

  // Kertas-kertas tempelan mading warna-warni
  const notes = [
    { x: 22, y: 42, w: 62, h: 48, col: '#fef08a' },
    { x: 96, y: 44, w: 64, h: 44, col: '#bfdbfe' },
    { x: 172, y: 42, w: 60, h: 50, col: '#fecaca' },
    { x: 34, y: 98, w: 85, h: 40, col: '#bbf7d0' },
    { x: 134, y: 96, w: 92, h: 42, col: '#f5d0fe' }
  ];
  notes.forEach((n) => {
    ctx.fillStyle = n.col;
    ctx.fillRect(n.x, n.y, n.w, n.h);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(n.x + n.w / 2, n.y + 5, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(c);
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 1.08, 0.07),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  group.add(mesh);
  return group;
}


// Membuat Jendela Koridor Sekolah Roblox
function createSchoolWindowFrame() {
  const group = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a321f, roughness: 0.7 });
  const glassMat = new THREE.MeshBasicMaterial({ color: 0x172554, transparent: true, opacity: 0.85 });

  const outer = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.35, 0.08), frameMat);
  group.add(outer);

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.92, 1.18), glassMat);
  glass.position.z = 0.045;
  group.add(glass);

  // Teralis / Sekat jendela kayu
  const barV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.2, 0.1), frameMat);
  const barH = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.06, 0.1), frameMat);
  group.add(barV, barH);

  return group;
}


// Membuat Lampu Neon Panjang Plafon Sekolah (Rusak, Berkedip & Mencekam)
function createCeilingFluorescentLamp(withPointLight = false, isFlickering = false) {
  const group = new THREE.Group();
  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.07, 0.26),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.5 })
  );
  group.add(housing);

  const tubeColor = isFlickering ? 0xef4444 : 0x94a3b8;
  const tube = new THREE.Mesh(
    new THREE.BoxGeometry(1.48, 0.045, 0.16),
    new THREE.MeshBasicMaterial({ color: tubeColor })
  );
  tube.position.y = -0.04;
  // Beberapa tabung lampu neon miring hampir lepas dari plafon
  if (isFlickering) {
    tube.rotation.z = 0.12;
    tube.position.y = -0.11;
  }
  group.add(tube);

  if (withPointLight) {
    const light = new THREE.PointLight(isFlickering ? 0xdc2626 : 0x93c5fd, isFlickering ? 0.95 : 0.72, 11.5);
    light.position.y = -0.18;
    group.add(light);
    flickeringLights.push(light);
  }
  return group;
}


// Membuat Kusen Pintu Ruang Kelas Terbuka (Doorway Arch) di Koridor Sekolah
function createClassroomDoorwayArch(roomLabel = 'KELAS X-A') {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7 });
  const doorLeafMat = new THREE.MeshStandardMaterial({ color: 0x7c4d25, roughness: 0.65 });

  // Tiang kusen kiri & kanan
  const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.55, 0.28), woodMat);
  leftPost.position.set(-1.88, 1.775, 0);
  const rightPost = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.55, 0.28), woodMat);
  rightPost.position.set(1.88, 1.775, 0);

  // Balok atas kusen pintu + ventilasi atas
  const topBeam = new THREE.Mesh(new THREE.BoxGeometry(3.98, 0.55, 0.3), woodMat);
  topBeam.position.set(0, 3.28, 0);

  // Daun pintu kayu kelas yang terbuka menempel ke samping
  const openDoor = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.55, 0.08), doorLeafMat);
  openDoor.position.set(-1.35, 1.3, 0.42);
  openDoor.rotation.y = Math.PI / 2.4;

  // Plang Nomor Kelas di atas kusen pintu
  const plaque = createSafeRoomSign(`🏫 ${roomLabel}`, 'RUANG KELAS');
  plaque.scale.set(1.45, 0.52, 1);
  plaque.position.set(0, 2.82, 0.25);

  group.add(leftPost, rightPost, topBeam, openDoor, plaque);
  return group;
}

// Membuat Meja + Kursi Guru di Depan Papan Tulis Kelas
function createTeacherDeskAndChair() {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.65 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.75 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.6 });

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.72), woodMat);
  deskTop.position.set(0, 0.8, 0);
  const deskFront = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.74, 0.06), darkWoodMat);
  deskFront.position.set(0, 0.4, -0.32);
  const leftSide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.76, 0.68), darkWoodMat);
  leftSide.position.set(-0.65, 0.38, 0);
  const rightDrawer = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.76, 0.68), darkWoodMat);
  rightDrawer.position.set(0.48, 0.38, 0);
  group.add(deskTop, deskFront, leftSide, rightDrawer);

  // Tumpukan buku absen di meja guru
  const book1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.05, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x1d4ed8 })
  );
  book1.position.set(-0.32, 0.86, 0.05);
  const book2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.05, 0.2),
    new THREE.MeshStandardMaterial({ color: 0xdc2626 })
  );
  book2.position.set(-0.3, 0.91, 0.05);
  group.add(book1, book2);

  // Kursi guru di belakang meja
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.07, 0.5), cushionMat);
  seat.position.set(-0.1, 0.48, 0.56);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.07), cushionMat);
  back.position.set(-0.1, 0.76, 0.78);
  group.add(seat, back);

  return group;
}

// Membuat Kursi Panjang Koridor & Ruang Aman (School Hallway Bench)
function createHallwayBench() {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8c5828, roughness: 0.65 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.35 });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.07, 0.48), woodMat);
  seat.position.set(0, 0.46, 0);
  const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.38, 0.06), woodMat);
  back.position.set(0, 0.7, -0.22);
  group.add(seat, back);

  [-0.9, 0, 0.9].forEach((lx) => {
    const legF = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.46, 0.06), ironMat);
    legF.position.set(lx, 0.23, 0.18);
    const legB = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.85, 0.06), ironMat);
    legB.position.set(lx, 0.425, -0.2);
    group.add(legF, legB);
  });

  return group;
}

// Membuat Interior Kamar Mandi Sekolah Roblox Horor (Keramik Kotor Berdarah, Wastafel Darah, Cermin Retak & Kloset WC)
function createSchoolBathroomInterior(titleText = 'KAMAR MANDI SISWA', side = 'west') {
  const group = new THREE.Group();

  // Lantai keramik kamar mandi sekolah yang lembab, retak & bernoda darah
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  for (let r = 0; r < 4; r++) {
    for (let col = 0; col < 4; col++) {
      ctx.fillStyle = (r + col) % 2 === 0 ? '#334e5e' : '#1e3340';
      ctx.fillRect(col * 32, r * 32, 32, 32);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(col * 32, r * 32, 32, 32);
    }
  }
  ctx.fillStyle = 'rgba(135, 10, 18, 0.65)';
  ctx.beginPath();
  ctx.arc(64, 64, 24, 0, Math.PI * 2);
  ctx.fill();

  const tileTex = new THREE.CanvasTexture(c);
  tileTex.wrapS = THREE.RepeatWrapping;
  tileTex.wrapT = THREE.RepeatWrapping;
  tileTex.repeat.set(4, 4);

  const bathFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(3.85, 7.6),
    new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.35, metalness: 0.15 })
  );
  bathFloor.rotation.x = -Math.PI / 2;
  bathFloor.position.set(0, 0.015, -1.8);
  group.add(bathFloor);

  // Meja Wastafel Keramik Kusam + Air Berdarah + Cermin Retak Bertulisan Darah
  const porcelainMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4, metalness: 0.1 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 });
  const partitionMat = new THREE.MeshStandardMaterial({ color: 0x134e4a, roughness: 0.65 });

  // Tekstur Cermin Kamar Mandi Retak & Tulisan Darah
  const mc = document.createElement('canvas');
  mc.width = 256;
  mc.height = 128;
  const mctx = mc.getContext('2d');
  mctx.fillStyle = '#1e293b';
  mctx.fillRect(0, 0, 256, 128);
  mctx.strokeStyle = '#64748b';
  mctx.lineWidth = 2;
  mctx.beginPath();
  mctx.moveTo(40, 0);
  mctx.lineTo(110, 65);
  mctx.lineTo(80, 128);
  mctx.moveTo(110, 65);
  mctx.lineTo(195, 95);
  mctx.stroke();
  mctx.fillStyle = '#dc2626';
  mctx.font = 'bold 22px serif';
  mctx.textAlign = 'center';
  mctx.fillText('DIA DI BELAKANGMU', 128, 72);
  const mirrorTex = new THREE.CanvasTexture(mc);
  const mirrorMat = new THREE.MeshBasicMaterial({ map: mirrorTex });

  const sinkX = side === 'west' ? -1.52 : 1.52;
  const sinkRot = side === 'west' ? Math.PI / 2 : -Math.PI / 2;

  const sinkGroup = new THREE.Group();
  const counter = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.58), porcelainMat);
  counter.position.set(0, 0.84, 0);
  sinkGroup.add(counter);

  [-0.55, 0.55].forEach((bx, idx) => {
    const basin = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.42), porcelainMat);
    basin.position.set(bx, 0.88, 0.02);
    // Salah satu wastafel berisi air merah darah!
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.32),
      new THREE.MeshBasicMaterial({ color: idx === 0 ? 0x991b1b : 0x1e3a5f })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(bx, 0.955, 0.02);
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 8), chromeMat);
    faucet.position.set(bx, 1.02, -0.18);
    sinkGroup.add(basin, water, faucet);
  });

  // Cermin kamar mandi
  const mirrorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 1.05, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x334155 })
  );
  mirrorFrame.position.set(0, 1.62, -0.26);
  const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.96, 0.92), mirrorMat);
  mirrorGlass.position.set(0, 1.62, -0.23);
  sinkGroup.add(mirrorFrame, mirrorGlass);

  sinkGroup.position.set(sinkX, 0, -3.2);
  sinkGroup.rotation.y = sinkRot;
  group.add(sinkGroup);

  // 2 Bilik Kloset Duduk Kamar Mandi tambahan di sisi seberang
  const stallX = side === 'west' ? 1.25 : -1.25;
  [-1.2, -3.1].forEach((sz) => {
    const toiletGroup = new THREE.Group();
    // Sekat partisi bilik kamar mandi
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.1, 0.07), partitionMat);
    sideWall.position.set(0, 1.05, 0.58);
    toiletGroup.add(sideWall);

    // Kloset duduk keramik putih
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.42, 12), porcelainMat);
    bowl.position.set(0, 0.21, 0);
    const seatLid = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 12), porcelainMat);
    seatLid.position.set(0, 0.43, 0);
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.38), porcelainMat);
    tank.position.set(side === 'west' ? 0.24 : -0.24, 0.62, 0);
    toiletGroup.add(bowl, seatLid, tank);

    toiletGroup.position.set(stallX, 0, sz);
    group.add(toiletGroup);
  });

  // Plang Toilet di atas kamar mandi
  const sign = createPlayerBannerSprite(`🚻 ${titleText}`, 'BILIK WC & WASTAFEL [SEMBUNYI: E]', '#38bdf8');
  sign.position.set(0, 2.88, -1.5);
  group.add(sign);

  return group;
}

// Membuat Tangga 3D Gedung Sekolah menuju Lantai Atas (Tangga Depan Ruang Aman & Tangga Belakang Ruang Aman)
function createSchoolStaircase3D(currentFl = 1, stairKind = 'front') {
  const group = new THREE.Group();
  const isFront = stairKind === 'front';
  const isBack = stairKind === 'back';
  const stepMat = new THREE.MeshStandardMaterial({
    color: isFront ? 0x94a3b8 : isBack ? 0xa1a1aa : 0x64748b,
    roughness: 0.55
  });
  const glowStripMat = new THREE.MeshBasicMaterial({
    color: isFront ? 0x38bdf8 : isBack ? 0xfacc15 : 0x4ade80
  });
  const railMat = new THREE.MeshStandardMaterial({
    color: isFront ? 0x38bdf8 : isBack ? 0xf59e0b : 0x38bdf8,
    metalness: 0.75,
    roughness: 0.28
  });

  // 10 Anak tangga naik bertingkat menuju Balkon Lantai Atas
  for (let i = 0; i < 10; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.22, 0.34), stepMat);
    step.position.set(0, 0.11 + i * 0.22, -0.15 - i * 0.28);
    group.add(step);

    // Garis lampu neon di bibir tiap anak tangga agar mudah terlihat dari Ruang Aman
    const strip = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.04, 0.05), glowStripMat);
    strip.position.set(0, 0.21 + i * 0.22, -0.01 - i * 0.28);
    group.add(strip);
  }

  // Balkon Peron Lantai Atas (Mezzanine Atas)
  const landing = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.22, 1.35), stepMat);
  landing.position.set(0, 2.25, -3.15);
  group.add(landing);

  const upperRailBack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.9, 0.08), railMat);
  upperRailBack.position.set(0, 2.75, -3.75);
  group.add(upperRailBack);

  // Pegangan besi tangga (Handrail kiri & kanan)
  [-0.98, 0.98].forEach((rx) => {
    const postBot = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.1, 8), railMat);
    postBot.position.set(rx, 0.55, -0.15);
    const postTop = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.1, 8), railMat);
    postTop.position.set(rx, 2.75, -2.85);
    const handrail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 3.35), railMat);
    handrail.position.set(rx, 1.72, -1.5);
    handrail.rotation.x = 0.66;
    group.add(postBot, postTop, handrail);
  });

  const nextUpFloor = (currentFl % 3) + 1;
  const backTargetFloor = currentFl > 1 ? currentFl - 1 : 2;
  let stairTitle = `🪜 TANGGA DEPAN RUANG AMAN (KE LT.${nextUpFloor})`;
  let stairSub = `NAIK CARI KONCI DI LANTAI ATAS [JALAN / TEKAN E]`;
  if (isBack) {
    stairTitle = `🪜 TANGGA BELAKANG RUANG AMAN (KE LT.${backTargetFloor})`;
    stairSub = `NAIK / TURUN LANTAI ATAS [JALAN / TEKAN E]`;
  } else if (stairKind === 'west' || stairKind === 'east') {
    stairTitle = `🪜 TANGGA SAMPING KE LANTAI ${nextUpFloor}`;
    stairSub = `TEKAN [E] NAIK/TURUN LANTAI 1 • 2 • 3`;
  }

  const banner = createSafeRoomSign(stairSub, stairTitle);
  banner.scale.set(2.45, 0.85, 1);
  banner.position.set(0, 2.95, -0.85);
  group.add(banner);

  const stairLight = new THREE.PointLight(isBack ? 0xfacc15 : 0x38bdf8, 2.1, 11);
  stairLight.position.set(0, 3.05, -0.6);
  group.add(stairLight);

  return group;
}

// Membuat Ruang Aman (Safe Room) dengan Akses Terbuka ke Tangga Depan Ruang Aman & Tangga Belakang Ruang Aman
function buildRobloxSafeRoomProps(safeWorld, floorNum) {
  const group = new THREE.Group();

  // Lantai Karpet Hijau Safe Zone (Mencakup Ruang Aman row 12 & Area Tangga Belakang row 13)
  const safeCarpet = new THREE.Mesh(
    new THREE.PlaneGeometry(11.6, 8.2),
    new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.75 })
  );
  safeCarpet.rotation.x = -Math.PI / 2;
  safeCarpet.position.set(safeWorld.x, 0.02, safeWorld.z + 2.0);
  group.add(safeCarpet);

  // Garis Pembatas Laser Hijau Anti-Hantu di Depan Ruang Aman (Menghadap Tangga Depan Ruang Aman)
  const barrierZ = safeWorld.z - 2.0;
  const laserMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide
  });
  const forcefield = new THREE.Mesh(new THREE.PlaneGeometry(11.4, 3.5), laserMat);
  forcefield.position.set(safeWorld.x, 1.75, barrierZ);
  group.add(forcefield);

  // Balok garis laser horizontal terang
  [0.2, 1.1, 2.0, 3.1].forEach((ly) => {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(11.4, 0.045, 0.045),
      new THREE.MeshBasicMaterial({ color: 0x4ade80 })
    );
    beam.position.set(safeWorld.x, ly, barrierZ);
    group.add(beam);
  });

  // Plang besar di atas Garis Batas Depan Ruang Aman
  const safeHeader = createSafeRoomSign(
    '⬆️ DEPAN: TANGGA LANTAI ATAS • ⬇️ BELAKANG: TANGGA BELAKANG',
    `🛡️ RUANG AMAN LANTAI ${floorNum} (HANTU TIDAK BISA MASUK)`
  );
  safeHeader.scale.set(2.9, 0.9, 1);
  safeHeader.position.set(safeWorld.x, 2.98, barrierZ);
  group.add(safeHeader);

  // Meja Kontrol CCTV & Monitor Keamanan di sisi Barat Ruang Aman (tidak menghalangi jalan ke Tangga Belakang)
  const cctvDesk = createTeacherDeskAndChair();
  cctvDesk.position.set(safeWorld.x - 4.2, 0, safeWorld.z - 0.3);
  cctvDesk.rotation.y = Math.PI / 2;

  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.44, 0.08),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  monitor.position.set(0.1, 1.06, 0);
  cctvDesk.add(monitor);
  group.add(cctvDesk);

  // Kursi Panjang Ruang Aman di sisi Barat-Selatan Ruang Aman
  const safeBench = createHallwayBench();
  safeBench.position.set(safeWorld.x - 4.1, 0, safeWorld.z + 2.4);
  safeBench.rotation.y = Math.PI / 2;
  group.add(safeBench);

  return group;
}

function createSafeRoomSign(arrowText, labelText) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#052e16';
  ctx.fillRect(4, 4, 248, 88);
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, 248, 88);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 21px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(labelText, 128, 38);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(arrowText, 128, 74);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.8, 0.66, 1);
  return sprite;
}

function buildExitDoorWithPadlocks(safeWorld, floorNum) {
  doorPadlockMeshes.clear();
  const doorGroup = new THREE.Group();

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8, roughness: 0.3 });
  const doorPanelMat = new THREE.MeshStandardMaterial({ color: 0x3f1d24, metalness: 0.5, roughness: 0.5 });

  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.2, 0.4), frameMat);
  leftPillar.position.set(-1.55, 1.6, 0);
  const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.2, 0.4), frameMat);
  rightPillar.position.set(1.55, 1.6, 0);
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(3.45, 0.35, 0.45), frameMat);
  topBar.position.set(0, 3.2, 0);
  doorGroup.add(leftPillar, rightPillar, topBar);

  const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(1.35, 3.0, 0.2), doorPanelMat);
  leftDoor.position.set(-0.7, 1.5, 0);
  const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(1.35, 3.0, 0.2), doorPanelMat);
  rightDoor.position.set(0.7, 1.5, 0);
  doorGroup.add(leftDoor, rightDoor);

  const chainBar = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.16, 0.3), frameMat);
  chainBar.position.set(0, 1.55, 0.14);
  doorGroup.add(chainBar);

  for (let i = 1; i <= 6; i++) {
    const padGroup = new THREE.Group();
    const lockColor = PADLOCK_COLORS[i] || 0xef4444;

    const bodyMat = new THREE.MeshStandardMaterial({
      color: lockColor,
      emissive: lockColor,
      emissiveIntensity: 0.4,
      metalness: 0.7,
      roughness: 0.2
    });

    const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.16), bodyMat);
    padGroup.add(lockBody);

    const shackle = new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.03, 8, 16, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.9 })
    );
    shackle.position.y = 0.18;
    padGroup.add(shackle);

    const px = -1.15 + (i - 1) * 0.46;
    padGroup.position.set(px, 1.5, 0.26);
    padGroup.userData = { bodyMat, shackle, lockColor };

    doorGroup.add(padGroup);
    doorPadlockMeshes.set(i, padGroup);
  }

  const doorTitle = '🚪 PINTU 6 GEMBOK RUANG AMAN';
  const exitSign = createSafeRoomSign('🔑 PASANG 6 KONCI DARI LT.1, 2 & 3 [E]', doorTitle);
  exitSign.position.set(0, 2.85, 0.35);
  doorGroup.add(exitSign);

  // Tempatkan Pintu 6 Gembok di dinding Timur Ruang Aman agar jalur tengah ke Tangga Belakang Ruang Aman terbuka lebar!
  doorGroup.position.set(safeWorld.x + 5.62, 0, safeWorld.z + 0.4);
  doorGroup.rotation.y = -Math.PI / 2;
  worldGroup.add(doorGroup);
}

function buildMapGeometry(floorNum = 1) {
  scene.remove(worldGroup);
  worldGroup = new THREE.Group();
  scene.add(worldGroup);
  flickeringLights = [];

  const wallTex = createWallTexture(floorNum);
  const floorTex = createFloorTexture();
  const ceilTex = createCeilingTexture();

  const totalSize = mapGrid.length * cellSize;
  const offset = totalSize / 2;

  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.65, metalness: 0.08 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(totalSize, totalSize), floorMat);
  floor.rotation.x = -Math.PI / 2;
  worldGroup.add(floor);

  const ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.9 });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(totalSize, totalSize), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 3.6;
  worldGroup.add(ceiling);

  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.78 });
  const wallGeo = new THREE.BoxGeometry(cellSize, 3.6, cellSize);

  const safeWorld = gridToWorldClient(12, 7);

  const roomLabelsByFloor = {
    1: ['KELAS X-A', 'RUANG GURU LT.1', 'KELAS X-B', 'KAMAR MANDI PUTRA LT.1', 'KAMAR MANDI PUTRI LT.1'],
    2: ['KELAS XI-IPA', 'PERPUSTAKAAN LT.2', 'KAMAR MANDI UTARA LT.2', 'KAMAR MANDI BARAT LT.2', 'KAMAR MANDI TIMUR LT.2'],
    3: ['KELAS XII-A', 'LAB KOMPUTER LT.3', 'KAMAR MANDI UTARA LT.3', 'KAMAR MANDI BARAT LT.3', 'KAMAR MANDI TIMUR LT.3'],
    4: ['AULA SEKOLAH', 'RUANG OSIS', 'STUDIO MUSIK', 'KAMAR MANDI BARAT', 'KAMAR MANDI TIMUR']
  };
  const labels = roomLabelsByFloor[floorNum] || roomLabelsByFloor[1];

  for (let r = 0; r < mapGrid.length; r++) {
    for (let c = 0; c < mapGrid[r].length; c++) {
      const cell = mapGrid[r][c];
      const wx = c * cellSize - offset + cellSize / 2;
      const wz = r * cellSize - offset + cellSize / 2;

      if (cell === 1) {
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set(wx, 1.8, wz);
        worldGroup.add(wall);
      } else if (cell === 0) {
        // Pasang Lampu Neon Plafon Sekolah di sepanjang lorong & ruang kelas
        const isMainCorridorLamp = (r + c) % 3 === 0;
        if (isMainCorridorLamp) {
          const emitLight = (r + c) % 6 === 0;
          const isFlicker = (r * 7 + c * 3) % 5 === 0;
          const neonFixture = createCeilingFluorescentLamp(emitLight, isFlicker);
          neonFixture.position.set(wx, 3.55, wz);
          if (r === 1 || r === 5 || r === 7 || r === 11) {
            neonFixture.rotation.y = Math.PI / 2;
          }
          worldGroup.add(neonFixture);
        }

        // Petunjuk Arah Ruang Aman, Kamar Mandi & Tangga Lantai 2-3 di setiap persimpangan koridor sekolah
        if ((r === 11 && (c === 3 || c === 7 || c === 11)) ||
            (r === 7 && (c === 3 || c === 7 || c === 11)) ||
            (r === 5 && (c === 5 || c === 9)) ||
            (r === 1 && c === 7)) {
          const dx = safeWorld.x - wx;
          let arrow = '▼ LURUS KE RUANG AMAN ▼';
          if (dx > 2.5) arrow = '► RUANG AMAN (SELATAN) ▼';
          else if (dx < -2.5) arrow = '◄ RUANG AMAN (SELATAN) ▼';

          const nextLabel = `🛡️ RUANG AMAN & PINTU 6 KONCI (LT.${floorNum})`;
          const sign = createSafeRoomSign(arrow, nextLabel);
          sign.position.set(wx, 2.9, wz);
          worldGroup.add(sign);
        }
      }
    }
  }

  // ==========================================================================
  // RUANG KELAS (KURSI, MEJA GURU, PAPAN TULIS) & KAMAR MANDI (WC, WASTAFEL)
  // ==========================================================================
  const roomConfigs = [
    { row: 2, col: 3, doorRow: 1, doorCol: 3, name: labels[0], boardSide: 'west', isBathroom: false },
    { row: 3, col: 7, doorRow: 4, doorCol: 7, name: labels[1], boardSide: 'north', isBathroom: false },
    { row: 2, col: 11, doorRow: 1, doorCol: 11, name: labels[2], boardSide: 'east', isBathroom: floorNum >= 2 },
    { row: 9, col: 3, doorRow: 7, doorCol: 3, name: labels[3], boardSide: 'west', isBathroom: true },
    { row: 9, col: 11, doorRow: 7, doorCol: 11, name: labels[4], boardSide: 'east', isBathroom: true }
  ];

  roomConfigs.forEach((cfg) => {
    const rmPos = gridToWorldClient(cfg.row, cfg.col);
    const doorPos = gridToWorldClient(cfg.doorRow, cfg.doorCol);

    // Kusen pintu masuk ruangan + Plang Nama Ruangan
    const arch = createClassroomDoorwayArch(cfg.name);
    arch.position.set(doorPos.x, 0, doorPos.z);
    worldGroup.add(arch);

    // Lampu remang mencekam di dalam ruangan (merah darah berkedip di kamar mandi, kuning redup di kelas)
    const classLight = new THREE.PointLight(cfg.isBathroom ? 0xef4444 : 0xfde68a, cfg.isBathroom ? 0.95 : 0.85, 11);
    classLight.position.set(rmPos.x, 3.25, rmPos.z);
    worldGroup.add(classLight);
    if (cfg.isBathroom) {
      flickeringLights.push(classLight);
    }

    if (cfg.isBathroom) {
      // Bangun Kamar Mandi Sekolah Roblox lengkap dengan Wastafel, Cermin, Lantai Keramik Biru & Kloset WC!
      const bathInterior = createSchoolBathroomInterior(cfg.name, cfg.boardSide);
      bathInterior.position.set(rmPos.x, 0, rmPos.z + 1.8);
      worldGroup.add(bathInterior);
    } else {
      // Pasang Papan Tulis Hijau + Meja & Kursi Guru di dalam Ruang Kelas
      const board = createSchoolChalkboard(cfg.name, floorNum);
      const teacherSet = createTeacherDeskAndChair();
      if (cfg.boardSide === 'west') {
        board.position.set(rmPos.x - 1.92, 1.85, rmPos.z);
        board.rotation.y = Math.PI / 2;
        teacherSet.position.set(rmPos.x - 1.1, 0, rmPos.z - 1.25);
        teacherSet.rotation.y = Math.PI / 2;
      } else if (cfg.boardSide === 'east') {
        board.position.set(rmPos.x + 1.92, 1.85, rmPos.z);
        board.rotation.y = -Math.PI / 2;
        teacherSet.position.set(rmPos.x + 1.1, 0, rmPos.z - 1.25);
        teacherSet.rotation.y = -Math.PI / 2;
      } else {
        board.position.set(rmPos.x, 1.85, rmPos.z - 1.92);
        board.rotation.y = 0;
        teacherSet.position.set(rmPos.x - 1.1, 0, rmPos.z - 1.15);
        teacherSet.rotation.y = 0;
      }
      worldGroup.add(board, teacherSet);

      // Pasang deretan Kursi & Meja Kayu Siswa di ruang kelas
      const deskOffsets = [
        { dx: -1.15, dz: -0.2, yaw: 0 },
        { dx: 1.15, dz: -0.2, yaw: 0 },
        { dx: -1.15, dz: 1.35, yaw: 0.06 },
        { dx: 1.15, dz: 1.35, yaw: -0.05 },
        { dx: -1.15, dz: 2.75, yaw: -0.04 },
        { dx: 1.15, dz: 2.75, yaw: 0.04 }
      ];
      deskOffsets.forEach((dOff) => {
        const desk = createStudentDeskAndChair();
        desk.position.set(rmPos.x + dOff.dx, 0, rmPos.z + dOff.dz);
        desk.rotation.y = dOff.yaw;
        worldGroup.add(desk);
      });
    }
  });

  // ==========================================================================
  // 2 TANGGA UTAMA: DEPAN RUANG AMAN & BELAKANG RUANG AMAN (+ TANGGA SAMPING)
  // ==========================================================================
  // 1. Tangga Depan Ruang Aman (Baris 10, Kolom 7 — Tepat di Depan Pintu Masuk Ruang Aman)
  const frontStairPos = gridToWorldClient(10, 7);
  const frontStairs = createSchoolStaircase3D(floorNum, 'front');
  frontStairs.position.set(frontStairPos.x, 0, frontStairPos.z + 1.15);
  frontStairs.rotation.y = 0; // Anak tangga menghadap ke Ruang Aman (Selatan) dan naik ke Utara
  worldGroup.add(frontStairs);

  // 2. Tangga Belakang Ruang Aman (Baris 13, Kolom 7 — Tepat di Belakang Ruang Aman)
  const backStairPos = gridToWorldClient(13, 7);
  const backStairs = createSchoolStaircase3D(floorNum, 'back');
  backStairs.position.set(backStairPos.x, 0, backStairPos.z - 0.85);
  backStairs.rotation.y = Math.PI; // Anak tangga menghadap ke Ruang Aman (Utara) dan naik ke Selatan
  worldGroup.add(backStairs);

  // Tangga Samping Koridor Barat & Timur
  const westStairPos = gridToWorldClient(11, 1);
  const westStairs = createSchoolStaircase3D(floorNum, 'west');
  westStairs.position.set(westStairPos.x - 0.65, 0, westStairPos.z + 1.45);
  westStairs.rotation.y = Math.PI / 2;
  worldGroup.add(westStairs);

  const eastStairPos = gridToWorldClient(11, 13);
  const eastStairs = createSchoolStaircase3D(floorNum, 'east');
  eastStairs.position.set(eastStairPos.x + 0.65, 0, eastStairPos.z + 1.45);
  eastStairs.rotation.y = -Math.PI / 2;
  worldGroup.add(eastStairs);

  // Deretan Kursi Panjang Koridor Sekolah (di lorong depan kelas & kamar mandi)
  const benchCoords = [
    { row: 11, col: 4, zOff: -1.55, rotY: 0 },
    { row: 11, col: 10, zOff: -1.55, rotY: 0 },
    { row: 7, col: 5, zOff: 1.55, rotY: Math.PI },
    { row: 7, col: 9, zOff: 1.55, rotY: Math.PI },
    { row: 5, col: 7, zOff: -1.55, rotY: 0 }
  ];
  benchCoords.forEach((bc) => {
    const bp = gridToWorldClient(bc.row, bc.col);
    const bench = createHallwayBench();
    bench.position.set(bp.x, 0, bp.z + bc.zOff);
    bench.rotation.y = bc.rotY;
    worldGroup.add(bench);
  });

  // ==========================================================================
  // DEKORASI KORIDOR SEKOLAH ROBLOX (MADING & JENDELA SEKOLAH)
  // ==========================================================================
  const corridorWindows = [
    { row: 11, col: 2, zOff: 1.94, rotY: Math.PI },
    { row: 11, col: 4, zOff: 1.94, rotY: Math.PI },
    { row: 11, col: 10, zOff: 1.94, rotY: Math.PI },
    { row: 11, col: 12, zOff: 1.94, rotY: Math.PI },
    { row: 1, col: 2, zOff: -1.94, rotY: 0 },
    { row: 1, col: 6, zOff: -1.94, rotY: 0 },
    { row: 1, col: 8, zOff: -1.94, rotY: 0 },
    { row: 1, col: 12, zOff: -1.94, rotY: 0 }
  ];
  corridorWindows.forEach((cw) => {
    const wp = gridToWorldClient(cw.row, cw.col);
    const win = createSchoolWindowFrame();
    win.position.set(wp.x, 1.95, wp.z + cw.zOff);
    win.rotation.y = cw.rotY;
    worldGroup.add(win);
  });

  const madingLocations = [
    { row: 11, col: 5, zOff: -1.93, rotY: 0, title: `MADING LANTAI ${floorNum} — DENAH KELAS & KAMAR MANDI` },
    { row: 11, col: 9, zOff: -1.93, rotY: 0, title: 'CARI 6 KONCI UNTUK BUKA PINTU RUANG AMAN' },
    { row: 7, col: 6, zOff: -1.93, rotY: 0, title: 'GUNAKAN TANGGA [E] KE LANTAI 2 & LANTAI 3' },
    { row: 5, col: 3, zOff: 1.93, rotY: Math.PI, title: 'SEMBUNYI DI KAMAR MANDI / LOKER SAAT DIKEJAR' }
  ];
  madingLocations.forEach((md) => {
    const mp = gridToWorldClient(md.row, md.col);
    const mading = createSchoolMadingBoard(md.title);
    mading.position.set(mp.x, 1.85, mp.z + md.zOff);
    mading.rotation.y = md.rotY;
    worldGroup.add(mading);
  });

  // Bangun Ruang Aman lengkap dengan Garis Laser Hijau, Meja CCTV, Kursi & Pintu 6 Konci
  const safeRoomProps = buildRobloxSafeRoomProps(safeWorld, floorNum);
  worldGroup.add(safeRoomProps);

  const safeLight = new THREE.PointLight(0x4ade80, 2.3, 18);
  safeLight.position.set(safeWorld.x, 3.2, safeWorld.z - 1.5);
  worldGroup.add(safeLight);

  buildExitDoorWithPadlocks(safeWorld, floorNum);
}

function syncLockersMeshes(lockers) {
  lockersData = lockers || [];
  for (const lk of lockersData) {
    let mesh = lockerMeshes.get(lk.id);
    if (!mesh) {
      const group = new THREE.Group();
      const isBathroomStall = lk.kind === 'stall' || String(lk.id).startsWith('stall_');

      if (isBathroomStall) {
        // Bilik Kamar Mandi Interaktif (lengkap dengan Kloset Duduk & Pintu Bilik WC)
        const stallWallMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.45 });
        const stallDoorMat = new THREE.MeshStandardMaterial({ color: 0x14b8a6, roughness: 0.4 });
        const porcelainMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });

        const leftW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.25, 1.15), stallWallMat);
        leftW.position.set(-0.58, 1.125, 0);
        const rightW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.25, 1.15), stallWallMat);
        rightW.position.set(0.58, 1.125, 0);
        const backW = new THREE.Mesh(new THREE.BoxGeometry(1.24, 2.25, 0.08), stallWallMat);
        backW.position.set(0, 1.125, -0.54);
        const door = new THREE.Mesh(new THREE.BoxGeometry(1.06, 1.95, 0.06), stallDoorMat);
        door.position.set(0, 1.08, 0.55);

        // Kloset duduk di dalam bilik
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.42, 12), porcelainMat);
        bowl.position.set(0, 0.21, -0.15);
        const tank = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.45, 0.18), porcelainMat);
        tank.position.set(0, 0.62, -0.38);

        group.add(leftW, rightW, backW, door, bowl, tank);

        const indicator = new THREE.PointLight(0x2dd4bf, 0.95, 5.0);
        indicator.position.set(0, 2.55, 0.55);
        group.add(indicator);

        const label = createSafeRoomSign('[E] SEMBUNYI DI WC', '🚻 BILIK KAMAR MANDI');
        label.scale.set(1.3, 0.48, 1);
        label.position.set(0, 2.68, 0);
        group.add(label);

        group.userData.indicator = indicator;
      } else {
        // Loker Besi Biru-Abu Khas Sekolah di Game Roblox (Berdampingan 2 Pintu Loker)
        const metalBodyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, metalness: 0.55, roughness: 0.38 });
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.5, roughness: 0.35 });
        const ventMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
        const handleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });

        const cabinet = new THREE.Mesh(new THREE.BoxGeometry(1.24, 2.4, 0.82), metalBodyMat);
        cabinet.position.y = 1.2;
        group.add(cabinet);

        [-0.29, 0.29].forEach((dx) => {
          const door = new THREE.Mesh(new THREE.BoxGeometry(0.54, 2.22, 0.06), doorMat);
          door.position.set(dx, 1.2, 0.41);
          group.add(door);

          for (let vy = 1.85; vy <= 2.1; vy += 0.08) {
            const vent = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.08), ventMat);
            vent.position.set(dx, vy, 0.42);
            group.add(vent);
          }

          const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.09), handleMat);
          handle.position.set(dx + 0.18, 1.22, 0.44);
          group.add(handle);
        });

        const indicator = new THREE.PointLight(0x38bdf8, 0.85, 4.5);
        indicator.position.set(0, 2.58, 0.52);
        group.add(indicator);

        const label = createSafeRoomSign('[E] SEMBUNYI', 'LOKER SISWA');
        label.scale.set(1.15, 0.44, 1);
        label.position.set(0, 2.7, 0);
        group.add(label);

        group.userData.indicator = indicator;
      }

      group.position.set(lk.x, 0, lk.z);
      group.rotation.y = lk.yaw || 0;

      scene.add(group);
      lockerMeshes.set(lk.id, group);
      mesh = group;
    }

    if (mesh.userData.indicator) {
      mesh.userData.indicator.color.setHex(lk.occupantId ? 0xf59e0b : 0x38bdf8);
    }
  }
}

function syncCandlesMeshes(candles) {
  ritualCandlesData = candles || [];
  const anyDead = Object.values(playersData).some((p) => !p.alive);

  for (const c of ritualCandlesData) {
    let mesh = candleMeshes.get(c.id);
    if (!mesh) {
      const group = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.55, 0.15, 12),
        new THREE.MeshStandardMaterial({ color: 0x27272a })
      );
      base.position.y = 0.08;
      group.add(base);

      const wax = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.16, 0.75, 10),
        new THREE.MeshStandardMaterial({ color: 0xfef2f2, emissive: 0x4c0519 })
      );
      wax.position.y = 0.45;
      group.add(wax);

      const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xd946ef })
      );
      flame.position.y = 0.92;
      group.add(flame);

      const light = new THREE.PointLight(0xd946ef, 1.5, 6.5);
      light.position.y = 1.05;
      group.add(light);

      group.userData = { flame, light };
      group.position.set(c.x, 0, c.z);
      scene.add(group);
      candleMeshes.set(c.id, group);
      mesh = group;
    }

    mesh.position.set(c.x, 0, c.z);
    mesh.visible = currentScreen === 'playing' && anyDead;
    if (mesh.userData.flame && mesh.userData.light) {
      const colorHex = c.lit ? 0x22c55e : 0xe879f9;
      mesh.userData.flame.material.color.setHex(colorHex);
      mesh.userData.light.color.setHex(colorHex);
      mesh.userData.light.intensity = c.lit ? 2.2 : 1.2;
    }
  }
}

function syncScrapsMeshes(scraps) {
  scrapsData = scraps || [];
  const activeIds = new Set();

  for (const s of scrapsData) {
    const padMesh = doorPadlockMeshes.get(s.lockIndex);
    if (padMesh) {
      if (s.deposited) {
        padMesh.position.y = 1.28;
        padMesh.userData.shackle.position.y = 0.28;
        padMesh.userData.bodyMat.color.setHex(0x22c55e);
        padMesh.userData.bodyMat.emissive.setHex(0x22c55e);
      } else {
        padMesh.position.y = 1.5;
        padMesh.userData.shackle.position.y = 0.18;
        padMesh.userData.bodyMat.color.setHex(padMesh.userData.lockColor);
        padMesh.userData.bodyMat.emissive.setHex(padMesh.userData.lockColor);
      }
    }
  }

  for (const s of scrapsData) {
    if (s.carrierId || s.deposited) continue;
    if (s.keyFloor && s.keyFloor !== currentFloorNum) continue;
    activeIds.add(s.id);

    let mesh = scrapMeshes.get(s.id);
    if (!mesh) {
      const group = new THREE.Group();
      // Model 3D Konci Sekolah Roblox + Gantungan Keytag Warna + Meja Alas & Cahaya Beacon
      const keyPivot = new THREE.Group();
      const keyMat = new THREE.MeshStandardMaterial({
        color: s.color,
        emissive: s.color,
        emissiveIntensity: 0.65,
        metalness: 0.85,
        roughness: 0.2
      });

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 10, 20), keyMat);
      ring.position.y = 0.26;
      keyPivot.add(ring);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.46, 10), keyMat);
      shaft.position.y = -0.04;
      keyPivot.add(shaft);

      const tooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.045), keyMat);
      tooth1.position.set(0.07, -0.16, 0);
      const tooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.05, 0.045), keyMat);
      tooth2.position.set(0.055, -0.24, 0);
      keyPivot.add(tooth1, tooth2);

      // Gantungan Tag Konci Khas Peta Eta Roblox
      const keyTag = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.24, 0.04),
        new THREE.MeshBasicMaterial({ color: s.color })
      );
      keyTag.position.set(-0.18, 0.24, 0);
      keyPivot.add(keyTag);

      group.add(keyPivot);
      group.userData.keyPivot = keyPivot;

      // Meja kecil / kotak alas Konci di bawahnya agar terlihat seperti terletak di atas meja sekolah
      const standMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7 });
      const standTop = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.06, 0.52), standMat);
      standTop.position.y = -0.36;
      const standLeg = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.52, 0.38), standMat);
      standLeg.position.y = -0.64;
      group.add(standTop, standLeg);

      // Sorot sinar vertikal (Beacon Konci) agar mudah ditemukan di Kamar Mandi & Kelas
      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.24, 2.2, 12, 1, true),
        new THREE.MeshBasicMaterial({
          color: s.color,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      beacon.position.y = 0.65;
      group.add(beacon);

      const kFl = s.keyFloor || currentFloorNum;
      const label = createPlayerBannerSprite(`🔑 KONCI #${s.lockIndex} (LT.${kFl}) [TEKAN E]`, 'BAWA KE PINTU RUANG AMAN', '#fde047');
      label.scale.set(1.38, 0.44, 1);
      label.position.y = 0.78;
      group.add(label);

      const glow = new THREE.PointLight(s.color, 1.5, 5.5);
      glow.position.y = 0.35;
      group.add(glow);

      scene.add(group);
      scrapMeshes.set(s.id, group);
      mesh = group;
    }

    mesh.position.set(s.x, s.y || 0.88, s.z);
  }

  for (const [id, mesh] of scrapMeshes.entries()) {
    if (!activeIds.has(id)) {
      scene.remove(mesh);
      scrapMeshes.delete(id);
    }
  }
}

function gridToWorldClient(row, col) {
  const offset = (mapGrid.length * cellSize) / 2;
  return {
    x: col * cellSize - offset + cellSize / 2,
    z: row * cellSize - offset + cellSize / 2
  };
}

function worldToGridClient(x, z) {
  const offset = (mapGrid.length * cellSize) / 2;
  const col = Math.floor((x + offset) / cellSize);
  const row = Math.floor((z + offset) / cellSize);
  return { row, col };
}

function canMoveTo(nx, nz) {
  if (!mapGrid || mapGrid.length === 0) return true;
  const radius = 0.42;
  const checkPoints = [
    [nx - radius, nz - radius],
    [nx + radius, nz - radius],
    [nx - radius, nz + radius],
    [nx + radius, nz + radius]
  ];
  for (const [px, pz] of checkPoints) {
    const { row, col } = worldToGridClient(px, pz);
    if (row < 0 || row >= mapGrid.length || col < 0 || col >= mapGrid[0].length) return false;
    if (mapGrid[row][col] === 1) return false;
  }
  return true;
}

// ============================================================================
// INTERAKSI LOBBY 1 ORANG, MENU KHUSUS MABAR 4 ORANG & IN-GAME CONTROLS
// ============================================================================
function getCurrentPlayerName() {
  return (usernameInput && usernameInput.value.trim()) || 'Adit•OSIS';
}

function joinCurrentLobbyOnServer() {
  const payload = {
    username: getCurrentPlayerName(),
    skinId: mySkinId,
    outfit: myOutfit,
    mode: lobbyMode
  };
  if (lobbyMode === 'mabar' && mabarRoomCodeInput) {
    payload.roomCode = mabarRoomCodeInput.value.trim().toUpperCase() || 'SEKOLAH1';
  }
  socket.emit('joinRoom', payload);
}

// Otomatis masuk ke Lobby 1 Orang (Solo) saat game dibuka & saat WebSocket terhubung ulang
joinCurrentLobbyOnServer();
socket.on('connect', () => {
  if (currentScreen === 'lobby') {
    joinCurrentLobbyOnServer();
  }
});

if (usernameInput) {
  usernameInput.addEventListener('change', () => {
    const newName = getCurrentPlayerName();
    socket.emit('changeName', newName);
    syncLobbyPodiumCharacters();
  });
  usernameInput.addEventListener('keyup', () => {
    const newName = getCurrentPlayerName();
    socket.emit('changeName', newName);
  });
}

function openMabarMenuModal() {
  audio.init();
  audio.playClick();
  if (mabarMenuOverlay) mabarMenuOverlay.classList.add('active');
}

function closeMabarMenuModal() {
  audio.playClick();
  if (mabarMenuOverlay) mabarMenuOverlay.classList.remove('active');
}

if (btnOpenMabarMenu) btnOpenMabarMenu.addEventListener('click', openMabarMenuModal);
if (btnOpenMabarBottom) btnOpenMabarBottom.addEventListener('click', openMabarMenuModal);
if (btnCloseMabarMenu) btnCloseMabarMenu.addEventListener('click', closeMabarMenuModal);
if (btnViewSquadStage) btnViewSquadStage.addEventListener('click', closeMabarMenuModal);

if (btnModeSolo) {
  btnModeSolo.addEventListener('click', () => {
    audio.init();
    audio.playClick();
    lobbyMode = 'solo';
    socket.emit('joinRoom', {
      username: getCurrentPlayerName(),
      skinId: mySkinId,
      mode: 'solo'
    });
    syncLobbyPodiumCharacters();
  });
}

if (btnModeMabar4) {
  btnModeMabar4.addEventListener('click', () => {
    audio.init();
    audio.playClick();
    lobbyMode = 'mabar';
    const roomCode = (mabarRoomCodeInput && mabarRoomCodeInput.value.trim().toUpperCase()) || 'SEKOLAH1';
    socket.emit('joinRoom', {
      username: getCurrentPlayerName(),
      skinId: mySkinId,
      mode: 'mabar',
      roomCode
    });
    syncLobbyPodiumCharacters();
  });
}

if (btnJoinMabarRoom) {
  btnJoinMabarRoom.addEventListener('click', () => {
    audio.init();
    audio.playClick();
    lobbyMode = 'mabar';
    const roomCode = (mabarRoomCodeInput && mabarRoomCodeInput.value.trim().toUpperCase()) || 'SEKOLAH1';
    socket.emit('joinRoom', {
      username: getCurrentPlayerName(),
      skinId: mySkinId,
      mode: 'mabar',
      roomCode
    });
    syncLobbyPodiumCharacters();
  });
}

inviteFriendBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    audio.init();
    audio.playSkinSelect();
    const friendKey = btn.getAttribute('data-friend') || 'siti';
    if (lobbyMode !== 'mabar') {
      lobbyMode = 'mabar';
      const roomCode = (mabarRoomCodeInput && mabarRoomCodeInput.value.trim().toUpperCase()) || 'SEKOLAH1';
      socket.emit('joinRoom', {
        username: getCurrentPlayerName(),
        skinId: mySkinId,
        mode: 'mabar',
        roomCode
      });
      setTimeout(() => {
        socket.emit('inviteFriend', friendKey);
      }, 120);
    } else {
      socket.emit('inviteFriend', friendKey);
    }
  });
});

if (btnKickBot) {
  btnKickBot.addEventListener('click', () => {
    audio.init();
    audio.playClick();
    socket.emit('kickFriend');
  });
}

if (btnCopyLink) {
  btnCopyLink.addEventListener('click', () => {
    audio.init();
    audio.playClick();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    const line = document.createElement('div');
    line.className = 'chat-line system';
    line.innerHTML = '★ Link Invite Mabar 4 Orang berhasil disalin! Bagikan ke temanmu.';
    if (ffChatMessages) {
      ffChatMessages.appendChild(line);
      ffChatMessages.scrollTop = ffChatMessages.scrollHeight;
    }
  });
}

if (btnStartMabarMatch) {
  btnStartMabarMatch.addEventListener('click', () => {
    closeMabarMenuModal();
    audio.init();
    audio.playRitualChime();
    socket.emit('startMatch');
  });
}

function selectCharacterById(chosenRaw) {
  const chosen = normalizeSkinId(chosenRaw);
  mySkinId = chosen;
  try {
    localStorage.setItem('darah_skantri_skin', mySkinId);
  } catch (e) {}

  skinCards.forEach((c) => {
    c.classList.toggle('active', c.getAttribute('data-skin') === chosen);
  });
  document.querySelectorAll('.char-grid-card').forEach((c) => {
    c.classList.toggle('active', c.getAttribute('data-char') === chosen);
  });

  if (SKIN_CATALOG[chosen] && ffSkillDesc) {
    ffSkillDesc.innerHTML = SKIN_CATALOG[chosen].skillHtml;
  }
  const charModalActiveName = document.getElementById('char-modal-active-name');
  if (charModalActiveName && SKIN_CATALOG[chosen]) {
    charModalActiveName.textContent = SKIN_CATALOG[chosen].title;
  }

  socket.emit('changeSkin', { skinId: chosen, outfit: myOutfit });
  syncLobbyPodiumCharacters();
}

skinCards.forEach((card) => {
  card.addEventListener('click', () => {
    audio.init();
    audio.playSkinSelect();
    const chosen = card.getAttribute('data-skin') || 'adit';
    selectCharacterById(chosen);
  });
});

// ============================================================================
// CONTROLLER MENU GANTI KARAKTER SENDIRI & MENU GANTI SKIN DAN BAJU
// ============================================================================
const charMenuOverlay = document.getElementById('char-menu-overlay');
const outfitMenuOverlay = document.getElementById('outfit-menu-overlay');
const btnOpenCharMenu = document.getElementById('btn-open-char-menu');
const btnOpenCharPanel = document.getElementById('btn-open-char-panel');
const btnCloseCharMenu = document.getElementById('btn-close-char-menu');
const btnCloseCharBottom = document.getElementById('btn-close-char-bottom');
const btnSwitchToOutfit = document.getElementById('btn-switch-to-outfit');
const btnCharToOutfitBottom = document.getElementById('btn-char-to-outfit-bottom');

const btnOpenOutfitMenu = document.getElementById('btn-open-outfit-menu');
const btnOpenOutfitPanel = document.getElementById('btn-open-outfit-panel');
const btnCloseOutfitMenu = document.getElementById('btn-close-outfit-menu');
const btnOutfitToChar = document.getElementById('btn-outfit-to-char');
const btnSaveOutfit = document.getElementById('btn-save-outfit');
const ffActiveOutfitLabel = document.getElementById('ff-active-outfit-label');

const customShirtColorInput = document.getElementById('custom-shirt-color');
const customPantsColorInput = document.getElementById('custom-pants-color');
const btnResetOutfitColors = document.getElementById('btn-reset-outfit-colors');

function syncCharAndOutfitUI() {
  const normSkin = normalizeSkinId(mySkinId);
  skinCards.forEach((c) => {
    c.classList.toggle('active', c.getAttribute('data-skin') === normSkin);
  });
  document.querySelectorAll('.char-grid-card').forEach((c) => {
    c.classList.toggle('active', c.getAttribute('data-char') === normSkin);
  });
  if (SKIN_CATALOG[normSkin] && ffSkillDesc) {
    ffSkillDesc.innerHTML = SKIN_CATALOG[normSkin].skillHtml;
  }
  const charModalActiveName = document.getElementById('char-modal-active-name');
  if (charModalActiveName && SKIN_CATALOG[normSkin]) {
    charModalActiveName.textContent = SKIN_CATALOG[normSkin].title;
  }

  const presetObj = OUTFIT_CATALOG[myOutfit.outfitId] || OUTFIT_CATALOG.default;
  if (ffActiveOutfitLabel) {
    ffActiveOutfitLabel.textContent = presetObj.label;
  }
  document.querySelectorAll('.outfit-preset-card').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-outfit') === myOutfit.outfitId);
  });
  document.querySelectorAll('.btn-headgear').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-headgear') === (myOutfit.headgear || 'default'));
  });
  document.querySelectorAll('.skin-tone-btn').forEach((btn) => {
    btn.classList.toggle(
      'active',
      (btn.getAttribute('data-tone') || '').toLowerCase() === String(myOutfit.skinTone || '#f1c27d').toLowerCase()
    );
  });
}

function saveAndBroadcastOutfit() {
  try {
    localStorage.setItem('darah_skantri_outfit', JSON.stringify(myOutfit));
  } catch (e) {}
  syncCharAndOutfitUI();
  socket.emit('changeOutfit', myOutfit);
  syncLobbyPodiumCharacters();
}

function openCharMenuModal() {
  audio.init();
  audio.playClick();
  syncCharAndOutfitUI();
  if (outfitMenuOverlay) outfitMenuOverlay.classList.remove('active');
  if (charMenuOverlay) charMenuOverlay.classList.add('active');
}

function closeCharMenuModal() {
  audio.playClick();
  if (charMenuOverlay) charMenuOverlay.classList.remove('active');
}

function openOutfitMenuModal() {
  audio.init();
  audio.playClick();
  syncCharAndOutfitUI();
  if (charMenuOverlay) charMenuOverlay.classList.remove('active');
  if (outfitMenuOverlay) outfitMenuOverlay.classList.add('active');
}

function closeOutfitMenuModal() {
  audio.playClick();
  if (outfitMenuOverlay) outfitMenuOverlay.classList.remove('active');
}

if (btnOpenCharMenu) btnOpenCharMenu.addEventListener('click', openCharMenuModal);
if (btnOpenCharPanel) btnOpenCharPanel.addEventListener('click', openCharMenuModal);
if (btnCloseCharMenu) btnCloseCharMenu.addEventListener('click', closeCharMenuModal);
if (btnCloseCharBottom) btnCloseCharBottom.addEventListener('click', closeCharMenuModal);
if (btnSwitchToOutfit) btnSwitchToOutfit.addEventListener('click', openOutfitMenuModal);
if (btnCharToOutfitBottom) btnCharToOutfitBottom.addEventListener('click', openOutfitMenuModal);

if (btnOpenOutfitMenu) btnOpenOutfitMenu.addEventListener('click', openOutfitMenuModal);
if (btnOpenOutfitPanel) btnOpenOutfitPanel.addEventListener('click', openOutfitMenuModal);
if (btnCloseOutfitMenu) btnCloseOutfitMenu.addEventListener('click', closeOutfitMenuModal);
if (btnOutfitToChar) btnOutfitToChar.addEventListener('click', openCharMenuModal);
if (btnSaveOutfit) {
  btnSaveOutfit.addEventListener('click', () => {
    saveAndBroadcastOutfit();
    closeOutfitMenuModal();
  });
}

document.querySelectorAll('.char-grid-card').forEach((card) => {
  card.addEventListener('click', () => {
    audio.init();
    audio.playSkinSelect();
    const chosen = card.getAttribute('data-char') || 'adit';
    selectCharacterById(chosen);
  });
});

document.querySelectorAll('.outfit-preset-card').forEach((btn) => {
  btn.addEventListener('click', () => {
    audio.init();
    audio.playSkinSelect();
    const oId = btn.getAttribute('data-outfit') || 'default';
    myOutfit.outfitId = oId;
    myOutfit.customShirt = '';
    myOutfit.customPants = '';
    saveAndBroadcastOutfit();
  });
});

document.querySelectorAll('.btn-headgear').forEach((btn) => {
  btn.addEventListener('click', () => {
    audio.init();
    audio.playSkinSelect();
    myOutfit.headgear = btn.getAttribute('data-headgear') || 'default';
    saveAndBroadcastOutfit();
  });
});

document.querySelectorAll('.skin-tone-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    audio.init();
    audio.playSkinSelect();
    myOutfit.skinTone = btn.getAttribute('data-tone') || '#f1c27d';
    saveAndBroadcastOutfit();
  });
});

if (customShirtColorInput) {
  customShirtColorInput.addEventListener('input', () => {
    myOutfit.customShirt = customShirtColorInput.value;
    saveAndBroadcastOutfit();
  });
}

if (customPantsColorInput) {
  customPantsColorInput.addEventListener('input', () => {
    myOutfit.customPants = customPantsColorInput.value;
    saveAndBroadcastOutfit();
  });
}

if (btnResetOutfitColors) {
  btnResetOutfitColors.addEventListener('click', () => {
    audio.init();
    audio.playClick();
    myOutfit = {
      outfitId: 'default',
      headgear: 'default',
      skinTone: '#f1c27d',
      customShirt: '',
      customPants: ''
    };
    saveAndBroadcastOutfit();
  });
}

syncCharAndOutfitUI();

function sendLobbyChat() {
  const txt = ffChatInput.value.trim();
  if (!txt) return;
  socket.emit('lobbyChat', txt);
  ffChatInput.value = '';
}

if (btnSendChat) btnSendChat.addEventListener('click', sendLobbyChat);
if (ffChatInput) {
  ffChatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendLobbyChat();
  });
}

btnStartMatch.addEventListener('click', () => {
  audio.init();
  audio.playRitualChime();
  socket.emit('startMatch');
});

btnRestart.addEventListener('click', () => {
  socket.emit('restartRound');
});

btnBackLobby.addEventListener('click', () => {
  socket.emit('backToLobby');
});

const btnLeaveMatch = document.getElementById('btn-leave-match');
if (btnLeaveMatch) {
  btnLeaveMatch.addEventListener('click', () => {
    audio.playClick();
    socket.emit('leaveMatch');
  });
}

// ============================================================================
// CONTROLLER SETINGAN GRAFIK GAME (PRESET, RESOLUSI, KABUT, BAYANGAN, FOV, FPS)
// ============================================================================
const graphicsOverlay = document.getElementById('graphics-settings-overlay');
const btnOpenGraphics = document.getElementById('btn-open-graphics');
const btnHudGraphics = document.getElementById('btn-hud-graphics');
const btnCloseGraphics = document.getElementById('btn-close-graphics');
const btnSaveGraphics = document.getElementById('btn-save-graphics');
const btnResetGraphics = document.getElementById('btn-reset-graphics');
const gfxPresetBtns = document.querySelectorAll('.btn-gfx-preset');

const gfxPresetLabel = document.getElementById('gfx-preset-label');
const gfxResVal = document.getElementById('gfx-res-val');
const gfxFogVal = document.getElementById('gfx-fog-val');
const gfxShadowVal = document.getElementById('gfx-shadow-val');
const gfxBrightnessVal = document.getElementById('gfx-brightness-val');
const gfxFovVal = document.getElementById('gfx-fov-val');
const gfxToggleVal = document.getElementById('gfx-toggle-val');

const gfxResolutionSelect = document.getElementById('gfx-resolution-select');
const gfxFogSelect = document.getElementById('gfx-fog-select');
const gfxShadowSelect = document.getElementById('gfx-shadow-select');
const gfxBrightnessRange = document.getElementById('gfx-brightness-range');
const gfxFovRange = document.getElementById('gfx-fov-range');
const btnToggleFlicker = document.getElementById('btn-toggle-flicker');
const btnToggleFps = document.getElementById('btn-toggle-fps');
const fpsCounterBadge = document.getElementById('fps-counter-badge');

const DEFAULT_GRAPHICS = {
  preset: 'high',
  resolutionScale: 1.0,
  fogMode: 'normal',
  shadowQuality: 'high',
  brightness: 100,
  fov: 70,
  flickerEnabled: true,
  showFps: true
};

let graphicsConfig = { ...DEFAULT_GRAPHICS };
try {
  const savedGfx = localStorage.getItem('darah_skantri_graphics');
  if (savedGfx) {
    graphicsConfig = { ...DEFAULT_GRAPHICS, ...JSON.parse(savedGfx) };
  }
} catch (e) {}

const PRESET_PROFILES = {
  low: {
    label: 'RENDAH (SMOOTH FPS)',
    shortTag: 'LOW',
    resolutionScale: 0.5,
    fogMode: 'normal',
    shadowQuality: 'off',
    brightness: 110,
    fov: 70,
    flickerEnabled: false
  },
  medium: {
    label: 'SEDANG (STANDAR)',
    shortTag: 'MED',
    resolutionScale: 0.75,
    fogMode: 'normal',
    shadowQuality: 'low',
    brightness: 105,
    fov: 70,
    flickerEnabled: true
  },
  high: {
    label: 'TINGGI (HD)',
    shortTag: 'HD',
    resolutionScale: 1.0,
    fogMode: 'normal',
    shadowQuality: 'high',
    brightness: 100,
    fov: 70,
    flickerEnabled: true
  },
  ultra: {
    label: 'ULTRA HOROR (MAX)',
    shortTag: 'ULTRA',
    resolutionScale: 1.5,
    fogMode: 'thick',
    shadowQuality: 'high',
    brightness: 95,
    fov: 74,
    flickerEnabled: true
  }
};

function applyGraphicsSettings(saveToStorage = true) {
  // 1. Terapkan Resolusi Render (Pixel Ratio)
  const scale = Number(graphicsConfig.resolutionScale) || 1.0;
  const baseRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(Math.max(0.4, Math.min(2.5, baseRatio * scale)));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 2. Terapkan Ketebalan Kabut Horor & Jarak Pandang
  if (graphicsConfig.fogMode === 'thick') {
    INGAME_FOG.density = 0.056;
    camera.far = 68;
  } else if (graphicsConfig.fogMode === 'clear') {
    INGAME_FOG.density = 0.024;
    camera.far = 110;
  } else {
    INGAME_FOG.density = 0.044;
    camera.far = 85;
  }
  if (currentScreen === 'playing') {
    scene.fog = INGAME_FOG;
  } else {
    scene.fog = null;
  }

  // 3. Terapkan Kualitas Bayangan & Pencahayaan
  if (graphicsConfig.shadowQuality === 'off') {
    renderer.shadowMap.enabled = false;
    myFlashlight.castShadow = false;
  } else if (graphicsConfig.shadowQuality === 'low') {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    myFlashlight.castShadow = false;
  } else {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    myFlashlight.castShadow = true;
  }

  // 4. Terapkan Kecerahan Layar (Brightness & Ambient Light)
  const brightPct = Number(graphicsConfig.brightness) || 100;
  const brightFactor = brightPct / 100;
  ambientLight.intensity = 0.25 * brightFactor;
  schoolHemiLight.intensity = 0.24 * brightFactor;
  renderer.domElement.style.filter = brightPct === 100 ? 'none' : `brightness(${brightFactor.toFixed(2)})`;

  // 5. Terapkan FOV Kamera
  const fovDeg = Number(graphicsConfig.fov) || 70;
  camera.fov = fovDeg;
  camera.updateProjectionMatrix();

  // 6. Sinkronkan tampilan UI Modal Setingan Grafik
  gfxPresetBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-preset') === graphicsConfig.preset);
  });
  const prof = PRESET_PROFILES[graphicsConfig.preset];
  if (gfxPresetLabel) {
    gfxPresetLabel.textContent = prof ? prof.label : 'KUSTOM (CUSTOM)';
  }
  if (gfxResolutionSelect) gfxResolutionSelect.value = String(graphicsConfig.resolutionScale);
  if (gfxResVal) gfxResVal.textContent = `${Math.round(scale * 100)}%`;

  if (gfxFogSelect) gfxFogSelect.value = graphicsConfig.fogMode;
  if (gfxFogVal) {
    gfxFogVal.textContent =
      graphicsConfig.fogMode === 'thick'
        ? 'Pekat & Seram'
        : graphicsConfig.fogMode === 'clear'
        ? 'Tipis & Jelas'
        : 'Horor Standar';
  }

  if (gfxShadowSelect) gfxShadowSelect.value = graphicsConfig.shadowQuality;
  if (gfxShadowVal) {
    gfxShadowVal.textContent =
      graphicsConfig.shadowQuality === 'off'
        ? 'Mati'
        : graphicsConfig.shadowQuality === 'low'
        ? 'Standar'
        : 'Tinggi (HD)';
  }

  if (gfxBrightnessRange) gfxBrightnessRange.value = String(brightPct);
  if (gfxBrightnessVal) gfxBrightnessVal.textContent = `${brightPct}%`;

  if (gfxFovRange) gfxFovRange.value = String(fovDeg);
  if (gfxFovVal) gfxFovVal.textContent = `${fovDeg}°`;

  if (btnToggleFlicker) {
    btnToggleFlicker.textContent = `💡 KEDIP LAMPU: ${graphicsConfig.flickerEnabled ? 'ON' : 'OFF'}`;
    btnToggleFlicker.classList.toggle('active-mode-btn', Boolean(graphicsConfig.flickerEnabled));
  }
  if (btnToggleFps) {
    btnToggleFps.textContent = `📊 FPS LIVE: ${graphicsConfig.showFps ? 'ON' : 'OFF'}`;
    btnToggleFps.classList.toggle('active-mode-btn', Boolean(graphicsConfig.showFps));
  }
  if (gfxToggleVal) {
    gfxToggleVal.textContent = `${graphicsConfig.flickerEnabled ? 'Kedip ON' : 'Kedip OFF'} • ${graphicsConfig.showFps ? 'FPS ON' : 'FPS OFF'}`;
  }
  if (fpsCounterBadge) {
    fpsCounterBadge.style.display = graphicsConfig.showFps ? 'block' : 'none';
  }

  if (saveToStorage) {
    try {
      localStorage.setItem('darah_skantri_graphics', JSON.stringify(graphicsConfig));
    } catch (e) {}
  }
}

function openGraphicsModal() {
  audio.init();
  audio.playClick();
  if (typeof document.exitPointerLock === 'function' && document.pointerLockElement) {
    try {
      document.exitPointerLock();
    } catch (e) {}
  }
  if (graphicsOverlay) graphicsOverlay.classList.add('active');
}

function closeGraphicsModal() {
  audio.playClick();
  if (graphicsOverlay) graphicsOverlay.classList.remove('active');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice && currentScreen === 'playing' && document.pointerLockElement !== renderer.domElement) {
    try {
      renderer.domElement.requestPointerLock();
    } catch (e) {}
  }
}

if (btnOpenGraphics) btnOpenGraphics.addEventListener('click', openGraphicsModal);
if (btnHudGraphics) btnHudGraphics.addEventListener('click', openGraphicsModal);
if (btnCloseGraphics) btnCloseGraphics.addEventListener('click', closeGraphicsModal);
if (btnSaveGraphics) {
  btnSaveGraphics.addEventListener('click', () => {
    applyGraphicsSettings(true);
    closeGraphicsModal();
  });
}
if (btnResetGraphics) {
  btnResetGraphics.addEventListener('click', () => {
    audio.playClick();
    graphicsConfig = { ...DEFAULT_GRAPHICS };
    applyGraphicsSettings(true);
  });
}

gfxPresetBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    audio.init();
    audio.playSkinSelect();
    const pKey = btn.getAttribute('data-preset') || 'high';
    const prof = PRESET_PROFILES[pKey];
    if (prof) {
      graphicsConfig.preset = pKey;
      graphicsConfig.resolutionScale = prof.resolutionScale;
      graphicsConfig.fogMode = prof.fogMode;
      graphicsConfig.shadowQuality = prof.shadowQuality;
      graphicsConfig.brightness = prof.brightness;
      graphicsConfig.fov = prof.fov;
      graphicsConfig.flickerEnabled = prof.flickerEnabled;
      applyGraphicsSettings(true);
    }
  });
});

if (gfxResolutionSelect) {
  gfxResolutionSelect.addEventListener('change', () => {
    graphicsConfig.preset = 'custom';
    graphicsConfig.resolutionScale = Number(gfxResolutionSelect.value) || 1.0;
    applyGraphicsSettings(true);
  });
}
if (gfxFogSelect) {
  gfxFogSelect.addEventListener('change', () => {
    graphicsConfig.preset = 'custom';
    graphicsConfig.fogMode = gfxFogSelect.value;
    applyGraphicsSettings(true);
  });
}
if (gfxShadowSelect) {
  gfxShadowSelect.addEventListener('change', () => {
    graphicsConfig.preset = 'custom';
    graphicsConfig.shadowQuality = gfxShadowSelect.value;
    applyGraphicsSettings(true);
  });
}
if (gfxBrightnessRange) {
  gfxBrightnessRange.addEventListener('input', () => {
    graphicsConfig.brightness = Number(gfxBrightnessRange.value) || 100;
    applyGraphicsSettings(true);
  });
}
if (gfxFovRange) {
  gfxFovRange.addEventListener('input', () => {
    graphicsConfig.fov = Number(gfxFovRange.value) || 70;
    applyGraphicsSettings(true);
  });
}
if (btnToggleFlicker) {
  btnToggleFlicker.addEventListener('click', () => {
    audio.playClick();
    graphicsConfig.flickerEnabled = !graphicsConfig.flickerEnabled;
    if (!graphicsConfig.flickerEnabled) {
      for (let i = 0; i < flickeringLights.length; i++) {
        flickeringLights[i].intensity = 0.85;
      }
    }
    applyGraphicsSettings(true);
  });
}
if (btnToggleFps) {
  btnToggleFps.addEventListener('click', () => {
    audio.playClick();
    graphicsConfig.showFps = !graphicsConfig.showFps;
    applyGraphicsSettings(true);
  });
}

applyGraphicsSettings(false);

// ============================================================================
// CONTROLLER DAFTAR AKUN BARU, LOGIN & SIMPAN TEMAN BARU UNTUK MABAR
// ============================================================================
const accountModalOverlay = document.getElementById('account-modal-overlay');
const btnOpenAccount = document.getElementById('btn-open-account');
const btnCloseAccount = document.getElementById('btn-close-account');
const btnCloseAccountBottom = document.getElementById('btn-close-account-bottom');
const btnOpenMabarFromAcc = document.getElementById('btn-open-mabar-from-acc');
const btnLogoutAccount = document.getElementById('btn-logout-account');

const ffAccountBadge = document.getElementById('ff-account-badge');
const accNameBadge = document.getElementById('acc-name-badge');
const accIdBadge = document.getElementById('acc-id-badge');
const accFriendsCount = document.getElementById('acc-friends-count');

const accUsernameInput = document.getElementById('acc-username-input');
const accPinInput = document.getElementById('acc-pin-input');
const accSkinSelect = document.getElementById('acc-skin-select');
const btnRegisterAccount = document.getElementById('btn-register-account');
const btnLoginAccount = document.getElementById('btn-login-account');
const accStatusMsg = document.getElementById('acc-status-msg');

const accFriendNameInput = document.getElementById('acc-friend-name-input');
const accFriendSkinSelect = document.getElementById('acc-friend-skin-select');
const btnAccSaveFriend = document.getElementById('btn-acc-save-friend');
const accSavedFriendsPreview = document.getElementById('acc-saved-friends-preview');

const newFriendNameInput = document.getElementById('new-friend-name-input');
const newFriendSkinSelect = document.getElementById('new-friend-skin-select');
const btnSaveNewFriend = document.getElementById('btn-save-new-friend');
const friendSaveFeedback = document.getElementById('friend-save-feedback');
const savedFriendsListEl = document.getElementById('saved-friends-list');

const SKIN_ROLE_LABEL = {
  adit: 'Ketua OSIS',
  maulana: 'Indigo / Mata Batin',
  fery: 'Atlet Basket',
  wahyu: 'Tim Medis PMR',
  alex: 'Keamanan Sekolah',
  rafi: 'Anak Teknik TKJ',
  rizky: 'Ketua OSIS',
  siti: 'Indigo / Mata Batin',
  bima: 'Atlet Basket',
  citra: 'Tim Medis PMR',
  dedi: 'Keamanan Sekolah'
};

let currentAccount = null;
let mySavedFriends = [];

try {
  const rawFriends = localStorage.getItem('darah_skantri_friends');
  if (rawFriends) {
    mySavedFriends = JSON.parse(rawFriends) || [];
  }
  const rawAcc = localStorage.getItem('darah_skantri_account');
  if (rawAcc) {
    currentAccount = JSON.parse(rawAcc) || null;
  }
} catch (e) {}

function persistAccountAndFriends() {
  try {
    localStorage.setItem('darah_skantri_friends', JSON.stringify(mySavedFriends));
    if (currentAccount) {
      currentAccount.savedFriends = mySavedFriends;
      localStorage.setItem('darah_skantri_account', JSON.stringify(currentAccount));
    } else {
      localStorage.removeItem('darah_skantri_account');
    }
  } catch (e) {}
}

function inviteSavedFriendToMabar(friendObj) {
  if (!friendObj) return;
  audio.init();
  audio.playSkinSelect();
  const payload = {
    name: friendObj.name,
    skinId: friendObj.skinId || 'siti'
  };
  if (lobbyMode !== 'mabar') {
    lobbyMode = 'mabar';
    const roomCode = (mabarRoomCodeInput && mabarRoomCodeInput.value.trim().toUpperCase()) || 'SEKOLAH1';
    socket.emit('joinRoom', {
      username: getCurrentPlayerName(),
      skinId: mySkinId,
      mode: 'mabar',
      roomCode
    });
    setTimeout(() => {
      socket.emit('inviteFriend', payload);
    }, 120);
  } else {
    socket.emit('inviteFriend', payload);
  }
}

function renderSavedFriendsList() {
  if (savedFriendsListEl) {
    savedFriendsListEl.innerHTML = '';
    mySavedFriends.forEach((fr) => {
      const row = document.createElement('div');
      row.className = 'invite-row saved-friend-row';
      const roleName = SKIN_ROLE_LABEL[fr.skinId] || 'Teman Mabar';
      const codeTag = fr.friendCode ? ` • ${fr.friendCode}` : '';
      row.innerHTML = `
        <div class="invite-info">
          <strong>⭐ ${fr.name}</strong>
          <small class="online-tag">● Teman Tersimpan — ${roleName}${codeTag}</small>
        </div>
        <div class="saved-friend-actions">
          <button class="btn-invite-friend btn-invite-saved" type="button">+ UNDANG</button>
          <button class="btn-delete-friend" type="button" title="Hapus Teman">✖</button>
        </div>
      `;
      const btnInv = row.querySelector('.btn-invite-saved');
      const btnDel = row.querySelector('.btn-delete-friend');
      if (btnInv) {
        btnInv.addEventListener('click', () => inviteSavedFriendToMabar(fr));
      }
      if (btnDel) {
        btnDel.addEventListener('click', () => handleRemoveSavedFriend(fr.id));
      }
      savedFriendsListEl.appendChild(row);
    });
  }

  if (accSavedFriendsPreview) {
    accSavedFriendsPreview.innerHTML = '';
    if (mySavedFriends.length === 0) {
      accSavedFriendsPreview.innerHTML =
        '<div style="font-size:11.5px; color:#94a3b8; padding:6px 0;">Belum ada teman baru yang disimpan. Tambahkan nama teman di atas!</div>';
    } else {
      mySavedFriends.forEach((fr) => {
        const item = document.createElement('div');
        item.className = 'invite-row saved-friend-row';
        const roleName = SKIN_ROLE_LABEL[fr.skinId] || 'Teman Mabar';
        item.innerHTML = `
          <div class="invite-info">
            <strong>⭐ ${fr.name}</strong>
            <small class="online-tag">● ${roleName} (${fr.friendCode || 'TEMAN'})</small>
          </div>
          <div class="saved-friend-actions">
            <button class="btn-invite-friend btn-acc-invite-now" type="button">+ UNDANG MABAR</button>
            <button class="btn-delete-friend" type="button" title="Hapus">✖</button>
          </div>
        `;
        const bInv = item.querySelector('.btn-acc-invite-now');
        const bDel = item.querySelector('.btn-delete-friend');
        if (bInv) {
          bInv.addEventListener('click', () => {
            closeAccountModal();
            openMabarMenuModal();
            inviteSavedFriendToMabar(fr);
          });
        }
        if (bDel) {
          bDel.addEventListener('click', () => handleRemoveSavedFriend(fr.id));
        }
        accSavedFriendsPreview.appendChild(item);
      });
    }
  }
}

function syncAccountUI() {
  if (currentAccount && currentAccount.username) {
    if (ffAccountBadge) {
      ffAccountBadge.textContent = `✓ AKUN: ${currentAccount.accountId || 'SKANTRI'}`;
      ffAccountBadge.classList.add('logged-in');
    }
    if (btnOpenAccount) {
      btnOpenAccount.textContent = `👤 AKUN: ${currentAccount.username.toUpperCase()}`;
    }
    if (accNameBadge) {
      accNameBadge.textContent = `${currentAccount.username} (Terdaftar)`;
    }
    if (accIdBadge) {
      accIdBadge.textContent = `ID: ${currentAccount.accountId || 'SK-USER'}`;
    }
    if (accFriendsCount) {
      accFriendsCount.textContent = `Akun aktif! Memiliki ${mySavedFriends.length} teman tersimpan yang siap diundang mabar 4 orang.`;
    }
    if (btnLogoutAccount) {
      btnLogoutAccount.classList.remove('hidden');
    }
  } else {
    if (ffAccountBadge) {
      ffAccountBadge.textContent = 'TAMU (BELUM DAFTAR)';
      ffAccountBadge.classList.remove('logged-in');
    }
    if (btnOpenAccount) {
      btnOpenAccount.textContent = '👤 DAFTAR AKUN';
    }
    if (accNameBadge) {
      accNameBadge.textContent = 'Mode Tamu (Belum Daftar Akun)';
    }
    if (accIdBadge) {
      accIdBadge.textContent = 'ID: GUEST';
    }
    if (accFriendsCount) {
      accFriendsCount.textContent = `Teman tersimpan lokal: ${mySavedFriends.length} orang. Daftar akun baru agar tersimpan permanen di server!`;
    }
    if (btnLogoutAccount) {
      btnLogoutAccount.classList.add('hidden');
    }
  }
  renderSavedFriendsList();
}

function openAccountModal() {
  audio.init();
  audio.playClick();
  if (accStatusMsg) {
    accStatusMsg.textContent = '';
    accStatusMsg.classList.remove('error');
  }
  if (currentAccount && accUsernameInput && !accUsernameInput.value) {
    accUsernameInput.value = currentAccount.username || '';
  }
  if (accSkinSelect) {
    accSkinSelect.value = mySkinId || 'rizky';
  }
  syncAccountUI();
  if (accountModalOverlay) accountModalOverlay.classList.add('active');
}

function closeAccountModal() {
  audio.playClick();
  if (accountModalOverlay) accountModalOverlay.classList.remove('active');
}

if (btnOpenAccount) btnOpenAccount.addEventListener('click', openAccountModal);
if (btnCloseAccount) btnCloseAccount.addEventListener('click', closeAccountModal);
if (btnCloseAccountBottom) btnCloseAccountBottom.addEventListener('click', closeAccountModal);
if (btnOpenMabarFromAcc) {
  btnOpenMabarFromAcc.addEventListener('click', () => {
    closeAccountModal();
    openMabarMenuModal();
  });
}

if (btnLogoutAccount) {
  btnLogoutAccount.addEventListener('click', () => {
    audio.playClick();
    currentAccount = null;
    persistAccountAndFriends();
    syncAccountUI();
    if (accStatusMsg) {
      accStatusMsg.classList.remove('error');
      accStatusMsg.textContent = 'Berhasil keluar dari akun. Kamu bisa mendaftarkan akun baru sekarang.';
    }
  });
}

const accLoginAnimBox = document.getElementById('acc-login-anim-box');
const accLoginAnimTitle = document.getElementById('acc-login-anim-title');
const accLoginAnimStep = document.getElementById('acc-login-anim-step');
const accLoginProgressFill = document.getElementById('acc-login-progress-fill');
const accLoginPctLabel = document.getElementById('acc-login-pct-label');
let accLoginAnimTimer = null;

function runBloodyLoginAnimation(isRegister, username, onComplete) {
  if (!accLoginAnimBox) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }
  if (accLoginAnimTimer) clearInterval(accLoginAnimTimer);

  accLoginAnimBox.classList.remove('hidden');
  if (accLoginProgressFill) accLoginProgressFill.style.width = '0%';
  if (accLoginPctLabel) accLoginPctLabel.textContent = '0%';
  if (accLoginAnimTitle) {
    accLoginAnimTitle.textContent = isRegister
      ? `🩸 MENDAFTARKAN AKUN BARU "${username.toUpperCase()}"...`
      : `🖐️ MEMVERIFIKASI LOGIN AKUN "${username.toUpperCase()}"...`;
  }

  audio.init();
  audio.playHeartbeat();

  const durationMs = 3600; // 3.6 detik agar animasi login/daftar terasa mantap dan tidak terlalu cepat
  const startTs = performance.now();

  accLoginAnimTimer = setInterval(() => {
    const elapsed = performance.now() - startTs;
    const pct = Math.min(100, (elapsed / durationMs) * 100);
    if (accLoginProgressFill) accLoginProgressFill.style.width = `${pct.toFixed(1)}%`;
    if (accLoginPctLabel) accLoginPctLabel.textContent = `${Math.floor(pct)}%`;

    if (accLoginAnimStep) {
      if (pct < 34) {
        accLoginAnimStep.textContent = '🖐️ Mencetak cap tangan berlumuran darah pada buku induk sekolah...';
      } else if (pct < 70) {
        accLoginAnimStep.textContent = '🔐 Menyinkronkan PIN rahasia & daftar teman mabar ke server...';
      } else {
        accLoginAnimStep.textContent = '✅ Segel Darah Terverifikasi! Membuka profil siswa SMK Skantri...';
      }
    }

    if (pct >= 100) {
      clearInterval(accLoginAnimTimer);
      accLoginAnimTimer = null;
      setTimeout(() => {
        accLoginAnimBox.classList.add('hidden');
        if (typeof onComplete === 'function') onComplete();
      }, 320);
    }
  }, 45);
}

if (btnRegisterAccount) {
  btnRegisterAccount.addEventListener('click', () => {
    audio.init();
    audio.playClick();
    const uname = (accUsernameInput && accUsernameInput.value.trim()) || '';
    const pin = (accPinInput && accPinInput.value.trim()) || '';
    const chosenSkin = (accSkinSelect && accSkinSelect.value) || mySkinId || 'rizky';

    if (uname.length < 3) {
      if (accStatusMsg) {
        accStatusMsg.classList.add('error');
        accStatusMsg.textContent = '⚠️ Nama akun baru minimal 3 karakter!';
      }
      return;
    }
    if (pin.length < 3) {
      if (accStatusMsg) {
        accStatusMsg.classList.add('error');
        accStatusMsg.textContent = '⚠️ PIN / Kata Sandi minimal 3 karakter!';
      }
      return;
    }

    runBloodyLoginAnimation(true, uname, () => {
      socket.emit('registerAccount', {
        username: uname,
        pin,
        skinId: chosenSkin,
        savedFriends: mySavedFriends
      });
    });
  });
}

if (btnLoginAccount) {
  btnLoginAccount.addEventListener('click', () => {
    audio.init();
    audio.playClick();
    const uname = (accUsernameInput && accUsernameInput.value.trim()) || '';
    const pin = (accPinInput && accPinInput.value.trim()) || '';
    if (!uname || !pin) {
      if (accStatusMsg) {
        accStatusMsg.classList.add('error');
        accStatusMsg.textContent = '⚠️ Masukkan Username & PIN akunmu untuk login!';
      }
      return;
    }
    runBloodyLoginAnimation(false, uname, () => {
      socket.emit('loginAccount', { username: uname, pin });
    });
  });
}

function handleSaveNewFriend(friendNameRaw, friendSkinRaw, feedbackEl) {
  audio.init();
  audio.playSkinSelect();
  const cleanName = (friendNameRaw || '').trim().slice(0, 16);
  const skinId = friendSkinRaw in SKIN_ROLE_LABEL ? friendSkinRaw : 'siti';

  if (cleanName.length < 2) {
    if (feedbackEl) {
      feedbackEl.style.color = '#f87171';
      feedbackEl.textContent = '⚠️ Ketik nama teman baru minimal 2 huruf!';
    }
    return false;
  }

  // Kirim ke server agar disimpan ke database akun & disinkronkan
  socket.emit('saveNewFriend', {
    friendName: cleanName,
    friendSkin: skinId
  });

  if (feedbackEl) {
    feedbackEl.style.color = '#4ade80';
    feedbackEl.textContent = `✅ Teman "${cleanName}" berhasil disimpan! Klik [+ UNDANG] di bawah untuk ajak mabar.`;
  }
  return true;
}

function handleRemoveSavedFriend(friendId) {
  audio.playClick();
  mySavedFriends = mySavedFriends.filter((f) => f.id !== friendId);
  persistAccountAndFriends();
  renderSavedFriendsList();
  socket.emit('removeSavedFriend', { friendId });
}

if (btnSaveNewFriend) {
  btnSaveNewFriend.addEventListener('click', () => {
    const ok = handleSaveNewFriend(
      newFriendNameInput ? newFriendNameInput.value : '',
      newFriendSkinSelect ? newFriendSkinSelect.value : 'siti',
      friendSaveFeedback
    );
    if (ok && newFriendNameInput) {
      newFriendNameInput.value = '';
    }
  });
}

if (newFriendNameInput) {
  newFriendNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && btnSaveNewFriend) {
      btnSaveNewFriend.click();
    }
  });
}

if (btnAccSaveFriend) {
  btnAccSaveFriend.addEventListener('click', () => {
    const ok = handleSaveNewFriend(
      accFriendNameInput ? accFriendNameInput.value : '',
      accFriendSkinSelect ? accFriendSkinSelect.value : 'siti',
      accStatusMsg
    );
    if (ok && accFriendNameInput) {
      accFriendNameInput.value = '';
    }
  });
}

socket.on('accountAuthResult', (res) => {
  if (!res) return;
  if (!res.ok) {
    if (accStatusMsg) {
      accStatusMsg.classList.add('error');
      accStatusMsg.textContent = `❌ ${res.message || 'Gagal memproses akun.'}`;
    }
    return;
  }

  audio.playRitualChime();
  const acc = res.account || {};
  currentAccount = {
    accountId: acc.accountId,
    username: acc.username,
    skinId: acc.skinId || mySkinId,
    savedFriends: Array.isArray(acc.savedFriends) ? acc.savedFriends : mySavedFriends
  };
  mySavedFriends = currentAccount.savedFriends;

  if (usernameInput) {
    usernameInput.value = currentAccount.username;
  }
  if (currentAccount.skinId && SKIN_CATALOG[currentAccount.skinId]) {
    mySkinId = currentAccount.skinId;
    skinCards.forEach((c) => {
      c.classList.toggle('active', c.getAttribute('data-skin') === mySkinId);
    });
    if (ffSkillDesc) {
      ffSkillDesc.innerHTML = SKIN_CATALOG[mySkinId].skillHtml;
    }
  }

  persistAccountAndFriends();
  syncAccountUI();
  syncLobbyPodiumCharacters();

  if (accStatusMsg) {
    accStatusMsg.classList.remove('error');
    accStatusMsg.textContent = `✅ ${res.message || 'Akun aktif!'}`;
  }
});

socket.on('friendSavedResult', (res) => {
  if (!res || !res.ok) return;
  if (Array.isArray(res.savedFriends) && res.savedFriends.length > 0) {
    mySavedFriends = res.savedFriends;
  } else if (res.friend) {
    const existsIdx = mySavedFriends.findIndex(
      (f) => f.name.toLowerCase() === res.friend.name.toLowerCase()
    );
    if (existsIdx >= 0) {
      mySavedFriends[existsIdx] = res.friend;
    } else {
      mySavedFriends.unshift(res.friend);
    }
  }
  persistAccountAndFriends();
  syncAccountUI();
});

socket.on('friendRemovedResult', (res) => {
  if (res && Array.isArray(res.savedFriends)) {
    mySavedFriends = res.savedFriends;
    persistAccountAndFriends();
    syncAccountUI();
  }
});

// Sinkronkan tampilan akun & daftar teman tersimpan saat pertama kali buka
if (currentAccount && currentAccount.username && usernameInput) {
  usernameInput.value = currentAccount.username;
}
syncAccountUI();

function safeRequestPointerLock() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;
  if (renderer.domElement && typeof renderer.domElement.requestPointerLock === 'function') {
    try {
      renderer.domElement.requestPointerLock();
    } catch (e) {}
  }
}

function safeExitPointerLock() {
  if (typeof document.exitPointerLock === 'function' && document.pointerLockElement) {
    try {
      document.exitPointerLock();
    } catch (e) {}
  }
}

renderer.domElement.addEventListener('click', () => {
  if (currentScreen === 'playing' && document.pointerLockElement !== renderer.domElement) {
    safeRequestPointerLock();
  }
});

// ============================================================================
// KONTROL SENTUH MOBILE / HP (JOYSTICK, GESER LAYAR KAMERA & TOMBOL AKSI)
// ============================================================================
const mobileMoveVec = { forward: 0, right: 0 };
let mobileSprintActive = false;

(function initMobileTouchControls() {
  const joyZone = document.getElementById('mobile-joystick-zone');
  const joyStick = document.getElementById('mobile-joystick-stick');
  const lookZone = document.getElementById('mobile-look-zone');
  const btnInteract = document.getElementById('btn-mob-interact');
  const btnSprint = document.getElementById('btn-mob-sprint');
  const btnFlashlight = document.getElementById('btn-mob-flashlight');
  const btnStairs = document.getElementById('btn-mob-stairs');
  const btnDrop = document.getElementById('btn-mob-drop');
  const btnRevive = document.getElementById('btn-mob-revive');

  let joyTouchId = null;
  let joyCenterX = 0;
  let joyCenterY = 0;
  const maxJoyRadius = 38;

  if (joyZone && joyStick) {
    joyZone.addEventListener(
      'touchstart',
      (e) => {
        if (currentScreen !== 'playing') return;
        e.preventDefault();
        audio.init();
        const t = e.changedTouches[0];
        joyTouchId = t.identifier;
        const rect = joyZone.getBoundingClientRect();
        joyCenterX = rect.left + rect.width / 2;
        joyCenterY = rect.top + rect.height / 2;
        updateJoystick(t.clientX, t.clientY);
      },
      { passive: false }
    );

    joyZone.addEventListener(
      'touchmove',
      (e) => {
        if (joyTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === joyTouchId) {
            e.preventDefault();
            updateJoystick(t.clientX, t.clientY);
            break;
          }
        }
      },
      { passive: false }
    );

    const endJoy = (e) => {
      if (joyTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joyTouchId) {
          joyTouchId = null;
          mobileMoveVec.forward = 0;
          mobileMoveVec.right = 0;
          joyStick.style.transform = 'translate(0px, 0px)';
          break;
        }
      }
    };
    joyZone.addEventListener('touchend', endJoy);
    joyZone.addEventListener('touchcancel', endJoy);
  }

  function updateJoystick(cx, cy) {
    let dx = cx - joyCenterX;
    let dy = cy - joyCenterY;
    const dist = Math.hypot(dx, dy);
    if (dist > maxJoyRadius) {
      dx = (dx / dist) * maxJoyRadius;
      dy = (dy / dist) * maxJoyRadius;
    }
    if (joyStick) {
      joyStick.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    }
    mobileMoveVec.right = dx / maxJoyRadius;
    mobileMoveVec.forward = -dy / maxJoyRadius;
  }

  let lookTouchId = null;
  let lastLookX = 0;
  let lastLookY = 0;

  if (lookZone) {
    lookZone.addEventListener(
      'touchstart',
      (e) => {
        if (currentScreen !== 'playing') return;
        e.preventDefault();
        audio.init();
        const t = e.changedTouches[0];
        lookTouchId = t.identifier;
        lastLookX = t.clientX;
        lastLookY = t.clientY;
      },
      { passive: false }
    );

    lookZone.addEventListener(
      'touchmove',
      (e) => {
        if (lookTouchId === null || currentScreen !== 'playing') return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === lookTouchId) {
            e.preventDefault();
            const dx = t.clientX - lastLookX;
            const dy = t.clientY - lastLookY;
            lastLookX = t.clientX;
            lastLookY = t.clientY;
            const sensitivity = 0.0052;
            myState.yaw -= dx * sensitivity;
            myState.pitch -= dy * sensitivity;
            const maxPitch = Math.PI / 2 - 0.12;
            myState.pitch = Math.max(-maxPitch, Math.min(maxPitch, myState.pitch));
            break;
          }
        }
      },
      { passive: false }
    );

    const endLook = (e) => {
      if (lookTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === lookTouchId) {
          lookTouchId = null;
          break;
        }
      }
    };
    lookZone.addEventListener('touchend', endLook);
    lookZone.addEventListener('touchcancel', endLook);
  }

  if (btnInteract) {
    btnInteract.addEventListener('click', () => {
      audio.init();
      if (currentScreen === 'playing') handleInteractAction();
    });
  }

  if (btnSprint) {
    btnSprint.addEventListener('click', () => {
      audio.init();
      mobileSprintActive = !mobileSprintActive;
      btnSprint.classList.toggle('active', mobileSprintActive);
    });
  }

  if (btnFlashlight) {
    btnFlashlight.addEventListener('click', () => {
      audio.init();
      if (currentScreen === 'playing' && myState.alive && !myState.hiding && myState.battery > 0) {
        myState.flashlight = !myState.flashlight;
        audio.playClick();
      }
    });
  }

  if (btnStairs) {
    btnStairs.addEventListener('click', () => {
      audio.init();
      if (currentScreen === 'playing' && myState.alive && !myState.hiding) {
        audio.playClick();
        socket.emit('useStairs', { stair: 'front' });
      }
    });
  }

  if (btnDrop) {
    btnDrop.addEventListener('click', () => {
      audio.init();
      if (currentScreen === 'playing' && myState.alive && !myState.hiding && myState.inventory.length > 0) {
        socket.emit('dropScrap');
        audio.playClick();
      }
    });
  }

  if (btnRevive) {
    btnRevive.addEventListener('click', () => {
      audio.init();
      if (currentScreen === 'playing') {
        socket.emit('revivePlayers');
      }
    });
  }
})();

document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== renderer.domElement || currentScreen !== 'playing') return;
  const sensitivity = 0.0022;
  myState.yaw -= e.movementX * sensitivity;
  myState.pitch -= e.movementY * sensitivity;
  const maxPitch = Math.PI / 2 - 0.12;
  myState.pitch = Math.max(-maxPitch, Math.min(maxPitch, myState.pitch));
});

window.addEventListener('keydown', (e) => {
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  if (
    activeTag === 'INPUT' ||
    activeTag === 'SELECT' ||
    activeTag === 'TEXTAREA' ||
    document.activeElement === ffChatInput ||
    document.activeElement === usernameInput ||
    document.activeElement === mabarRoomCodeInput
  ) {
    return;
  }
  const code = e.code;
  keys[code] = true;

  if (code === 'KeyP') {
    if (graphicsOverlay && graphicsOverlay.classList.contains('active')) {
      closeGraphicsModal();
    } else {
      openGraphicsModal();
    }
    return;
  }

  if (currentScreen !== 'playing') return;

  if (code === 'KeyF') {
    if (myState.alive && !myState.hiding && myState.battery > 0) {
      myState.flashlight = !myState.flashlight;
      audio.playClick();
    }
  } else if (code === 'KeyE') {
    handleInteractAction();
  } else if (code === 'KeyH') {
    socket.emit('revivePlayers');
  } else if (code === 'KeyQ') {
    socket.emit('leaveMatch');
  } else if (code === 'KeyG') {
    if (myState.alive && !myState.hiding && myState.inventory.length > 0) {
      socket.emit('dropScrap');
      audio.playClick();
    }
  } else if (code === 'KeyR') {
    if (myState.alive && !myState.hiding) {
      socket.emit('extractNow');
    }
  } else if (code === 'Digit1') {
    if (myState.alive && !myState.hiding) {
      audio.playClick();
      socket.emit('useStairs', { floor: 1 });
    }
  } else if (code === 'Digit2') {
    if (myState.alive && !myState.hiding) {
      audio.playClick();
      socket.emit('useStairs', { floor: 2 });
    }
  } else if (code === 'Digit3') {
    if (myState.alive && !myState.hiding) {
      audio.playClick();
      socket.emit('useStairs', { floor: 3 });
    }
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function handleInteractAction() {
  if (myState.hiding) {
    socket.emit('toggleHide');
    audio.playLockerCreak();
    return;
  }

  const reachBonus = mySkinId === 'maulana' || mySkinId === 'siti' ? 0.65 : 0.0;
  const anyDead = Object.values(playersData).some((p) => !p.alive);

  if (anyDead) {
    for (const c of ritualCandlesData) {
      if (!c.lit && Math.hypot(c.x - myState.x, c.z - myState.z) <= 2.9 + reachBonus) {
        socket.emit('activateCandle', c.id);
        audio.playRitualChime();
        return;
      }
    }
  }

  if (myState.alive) {
    for (const lk of lockersData) {
      if (!lk.occupantId && Math.hypot(lk.x - myState.x, lk.z - myState.z) <= 2.4) {
        socket.emit('toggleHide');
        audio.playLockerCreak();
        return;
      }
    }
  }

  const { row, col } = worldToGridClient(myState.x, myState.z);
  if (myState.alive && row >= 12 && col >= 6 && col <= 8 && myState.inventory.length > 0) {
    socket.emit('depositScrap');
    audio.playUnlockPadlock();
    return;
  }

  // Interaksi Tangga Gedung Sekolah menuju Lantai 2 & Lantai 3 (di Tangga Barat col<=1 atau Tangga Timur col>=13)
  if (myState.alive && row >= 10 && row <= 11 && (col <= 1 || col >= 13)) {
    const nextFloor = col <= 1 ? (currentFloorNum % 3) + 1 : currentFloorNum === 3 ? 2 : 3;
    socket.emit('useStairs', { floor: nextFloor });
    audio.playRitualChime();
    return;
  }

  if (myState.alive) {
    let nearest = null;
    let minDist = 3.0 + reachBonus;
    for (const s of scrapsData) {
      if (s.carrierId || s.deposited) continue;
      const d = Math.hypot(s.x - myState.x, s.z - myState.z);
      if (d < minDist) {
        minDist = d;
        nearest = s;
      }
    }

    if (nearest && myState.inventory.length < 2) {
      socket.emit('pickupScrap', nearest.id);
      audio.playPickup();
    }
  }
}

// ============================================================================
// SOCKET.IO / WEBSOCKET EVENTS
// ============================================================================
socket.on('joinedRoom', (data) => {
  myPlayerId = data.playerId;
  if (data.mode) {
    lobbyMode = data.mode;
  }
  mapGrid = data.mapGrid;
  cellSize = data.cellSize;
  currentFloorNum = data.state.currentFloor || 1;

  hudTarget.textContent = data.state.targetQuota;
  updateFloorHeader(currentFloorNum, data.state.floorName);

  buildMapGeometry(currentFloorNum);

  playersData = data.state.players;
  const me = playersData[myPlayerId];
  if (me) {
    if (usernameInput && document.activeElement !== usernameInput) {
      usernameInput.value = me.name;
    }
    mySkinId = me.skinId || 'rizky';
    myState.x = me.x;
    myState.y = me.y;
    myState.z = me.z;
    myState.alive = me.alive;
    myState.hiding = Boolean(me.hiding);
    myState.flashlight = me.flashlight;
    myState.inventory = me.inventory || [];
  }

  syncScrapsMeshes(data.state.scraps);
  syncLockersMeshes(data.state.lockers);
  syncCandlesMeshes(data.state.ritualCandles);

  if (data.state.state === 'lobby') {
    enterLobbyScreen();
  } else {
    enterPlayingScreen(data.state);
  }
});

socket.on('lobbyUpdated', ({ players }) => {
  playersData = players;
  if (playersData[myPlayerId]) {
    mySkinId = playersData[myPlayerId].skinId || mySkinId;
  }
  syncLobbyPodiumCharacters();
});

socket.on('lobbyChatMessage', ({ sender, text, isSystem }) => {
  const line = document.createElement('div');
  line.className = isSystem ? 'chat-line system' : 'chat-line';
  line.innerHTML = isSystem ? `★ ${text}` : `<strong>[${sender}]:</strong> ${text}`;
  ffChatMessages.appendChild(line);
  ffChatMessages.scrollTop = ffChatMessages.scrollHeight;
});

socket.on('matchStarted', (roomState) => {
  finishStudioIntro();
  audio.init();
  audio.playStudioJingle();
  enterPlayingScreen(roomState);
});

// Event saat Pintu 6 Gembok Terbuka & Tim Naik ke Lantai Berikutnya!
socket.on('floorAdvanced', (roomState) => {
  currentFloorNum = roomState.currentFloor || 1;
  updateFloorHeader(currentFloorNum, roomState.floorName);

  // Bersihkan mesh kunci lama
  for (const m of scrapMeshes.values()) scene.remove(m);
  scrapMeshes.clear();

  buildMapGeometry(currentFloorNum);

  playersData = roomState.players;
  const me = playersData[myPlayerId];
  if (me) {
    myState.x = me.x;
    myState.y = me.y;
    myState.z = me.z;
    myState.yaw = 0;
    myState.pitch = 0;
    myState.alive = true;
    myState.hiding = false;
    myState.inventory = [];
  }

  lockerOverlay.classList.add('hidden');
  deathBanner.classList.add('hidden');
  bloodVignette.style.opacity = '0';

  syncScrapsMeshes(roomState.scraps);
  syncLockersMeshes(roomState.lockers);
  syncCandlesMeshes(roomState.ritualCandles);
  hudQuota.textContent = roomState.quota;
  updateHUD();

  audio.playRitualChime();
  floorBannerTitle.textContent = `🚪 PINTU TERBUKA! NAIK KE LANTAI ${currentFloorNum} / 4`;
  floorBannerSub.textContent = roomState.floorName || `LANTAI ${currentFloorNum}`;
  floorTransitionBanner.classList.remove('hidden');
  setTimeout(() => {
    floorTransitionBanner.classList.add('hidden');
  }, 4200);
});

// Event saat Hantu Kuntilanak Ketawa!
let laughBannerTimeout = null;
socket.on('kuntiLaugh', ({ x, z, targetName }) => {
  if (currentScreen !== 'playing') return;
  const dist = Math.hypot((x || 0) - myState.x, (z || 0) - myState.z);
  const vol = Math.max(0.18, 1 - dist / 28);
  audio.playKuntilanakLaugh(vol);

  if (targetName || dist < 18) {
    kuntiLaughBanner.textContent = targetName
      ? `🔊 "HIHIHIHIHI...!" — KUNTILANAK BERLARI CEPAT MENGEJAR ${targetName.toUpperCase()}!`
      : '🔊 "HIHIHIHIHI...!" — SUARA KUNTILANAK TERTAWA DI LORONG SEKOLAH!';
    kuntiLaughBanner.classList.remove('hidden');
    if (laughBannerTimeout) clearTimeout(laughBannerTimeout);
    laughBannerTimeout = setTimeout(() => {
      kuntiLaughBanner.classList.add('hidden');
    }, 2800);
  }
});

socket.on('returnedToLobby', (roomState) => {
  playersData = roomState.players;
  enterLobbyScreen();
});

function updateFloorHeader(floorNum, floorName) {
  hudFloorTitle.textContent = `🏫 LANTAI ${floorNum} / 4`;
  hudRoom.textContent = floorName || `GEDUNG SEKOLAH LANTAI ${floorNum}`;
  padlocksLabel.textContent = floorNum < 4
    ? `6 GEMBOK PINTU NAIK KE LANTAI ${floorNum + 1}`
    : '6 GEMBOK PINTU KELUAR SEKOLAH (LANTAI 4)';
}

function enterLobbyScreen() {
  currentScreen = 'lobby';
  safeExitPointerLock();
  endOverlay.classList.remove('active');
  hud.classList.add('hidden');
  deathBanner.classList.add('hidden');
  lockerOverlay.classList.add('hidden');
  kuntiLaughBanner.classList.add('hidden');
  bloodVignette.style.opacity = '0';

  if (lobbyStageBg) lobbyStageBg.classList.remove('hidden');
  scene.background = null;
  scene.fog = null;
  renderer.setClearColor(0x000000, 0);

  ffLobby.classList.remove('hidden');
  lobbyStageGroup.visible = true;
  worldGroup.visible = false;
  monsterMesh.visible = false;

  syncLobbyPodiumCharacters();
}

function enterPlayingScreen(roomState) {
  currentScreen = 'playing';
  currentFloorNum = roomState.currentFloor || 1;
  updateFloorHeader(currentFloorNum, roomState.floorName);

  if (lobbyStageBg) lobbyStageBg.classList.add('hidden');
  scene.background = INGAME_BG_COLOR;
  scene.fog = INGAME_FOG;
  renderer.setClearColor(0x060204, 1);

  ffLobby.classList.add('hidden');
  endOverlay.classList.remove('active');
  deathBanner.classList.add('hidden');
  lockerOverlay.classList.add('hidden');
  bloodVignette.style.opacity = '0';
  hud.classList.remove('hidden');

  lobbyStageGroup.visible = false;
  worldGroup.visible = true;
  monsterMesh.visible = true;

  buildMapGeometry(currentFloorNum);

  for (const m of otherPlayerMeshes.values()) scene.remove(m);
  otherPlayerMeshes.clear();

  playersData = roomState.players;
  const me = playersData[myPlayerId];
  if (me) {
    mySkinId = me.skinId || mySkinId;
    myState.x = me.x;
    myState.y = me.y;
    myState.z = me.z;
    myState.yaw = 0;
    myState.pitch = 0;
    myState.stamina = 100;
    myState.battery = 100;
    myState.alive = true;
    myState.hiding = false;
    myState.flashlight = true;
    myState.inventory = [];
  }

  reviveReadyState = false;
  syncScrapsMeshes(roomState.scraps);
  syncLockersMeshes(roomState.lockers);
  syncCandlesMeshes(roomState.ritualCandles);
  hudQuota.textContent = roomState.quota;
  updateHUD();

  safeRequestPointerLock();
}

socket.on('worldTick', (data) => {
  playersData = data.players;
  monsterData = data.monster;
  reviveReadyState = Boolean(data.reviveReady);

  if (data.currentFloor && data.currentFloor !== currentFloorNum) {
    currentFloorNum = data.currentFloor;
    updateFloorHeader(currentFloorNum, data.floorName);
  }

  if (playersData[myPlayerId]) {
    myState.alive = playersData[myPlayerId].alive;
    myState.inventory = playersData[myPlayerId].inventory || [];
  }

  hudQuota.textContent = data.quota;
  syncCandlesMeshes(ritualCandlesData);
  updateHUD();
});

socket.on('hideStateChanged', (data) => {
  myState.hiding = Boolean(data.hiding);
  myState.lockerId = data.lockerId;
  if (myState.hiding) {
    myState.flashlight = false;
    myState.x = data.x;
    myState.z = data.z;
    lockerOverlay.classList.remove('hidden');
  } else {
    lockerOverlay.classList.add('hidden');
  }
});

socket.on('lockersUpdated', (lockers) => {
  syncLockersMeshes(lockers);
});

socket.on('ritualUpdated', ({ ritualCandles, reviveReady }) => {
  reviveReadyState = Boolean(reviveReady);
  syncCandlesMeshes(ritualCandles);
  updateHUD();
});

socket.on('playersRevived', ({ players, ritualCandles, reviveReady }) => {
  playersData = players;
  reviveReadyState = Boolean(reviveReady);
  if (playersData[myPlayerId]) {
    myState.alive = playersData[myPlayerId].alive;
    myState.x = playersData[myPlayerId].x;
    myState.z = playersData[myPlayerId].z;
    myState.flashlight = true;
  }
  deathBanner.classList.add('hidden');
  bloodVignette.style.opacity = '0';
  audio.playRitualChime();
  syncCandlesMeshes(ritualCandles);
  updateHUD();
});

socket.on('scrapUpdated', (data) => {
  syncScrapsMeshes(data.scraps);
  if (data.players) {
    playersData = data.players;
    if (playersData[myPlayerId]) {
      myState.inventory = playersData[myPlayerId].inventory || [];
    }
  }
  if (typeof data.quota === 'number') {
    hudQuota.textContent = data.quota;
  }
  updateHUD();
});

let jumpscareTimer = 0;

socket.on('playerKilled', ({ victimId, scraps, ritualCandles, reviveReady }) => {
  reviveReadyState = Boolean(reviveReady);
  syncScrapsMeshes(scraps);
  if (ritualCandles) syncCandlesMeshes(ritualCandles);

  if (victimId === myPlayerId) {
    myState.alive = false;
    myState.flashlight = false;
    myState.hiding = false;
    jumpscareTimer = 0.95;
    lockerOverlay.classList.add('hidden');
    audio.playJumpscare();
    bloodVignette.style.opacity = '0.92';
    deathBanner.classList.remove('hidden');
  }
  updateHUD();
});

socket.on('systemMessage', (msg) => {
  addFeedMessage(msg);
});

socket.on('roundEnded', ({ state, reason }) => {
  safeExitPointerLock();
  endOverlay.classList.add('active');
  endTitle.textContent = state === 'won' ? '🏆 BOOYAH! LOLOS DARI SEKOLAH!' : '💀 TERKUTUK DI SEKOLAH';
  endTitle.style.color = state === 'won' ? '#fde047' : '#dc2626';
  endReason.textContent = reason;
});

function addFeedMessage(text) {
  const div = document.createElement('div');
  div.className = 'feed-item';
  div.textContent = text;
  systemFeed.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, 5000);
}

function updateHUD() {
  padlockBadges.forEach((badge) => {
    const lockIdx = Number(badge.getAttribute('data-lock'));
    const keyObj = scrapsData.find((s) => s.lockIndex === lockIdx);
    if (keyObj && keyObj.deposited) {
      badge.classList.add('unlocked');
      badge.textContent = `🔓 #${lockIdx}`;
    } else {
      badge.classList.remove('unlocked');
      badge.textContent = `🔒 #${lockIdx}`;
    }
  });

  teamList.innerHTML = '';
  let anyDead = false;
  for (const p of Object.values(playersData)) {
    if (!p.alive) anyDead = true;
    const li = document.createElement('li');
    const nameSpan = document.createElement('span');
    nameSpan.textContent = p.id === myPlayerId ? `${p.name} (Kamu)` : p.name;
    const statusSpan = document.createElement('span');
    if (!p.alive) {
      statusSpan.className = 'status-dead';
      statusSpan.textContent = 'ARWAH';
    } else if (p.hiding) {
      statusSpan.className = 'status-hiding';
      statusSpan.textContent = 'DI LEMARI';
    } else {
      statusSpan.className = 'status-alive';
      statusSpan.textContent = 'HIDUP';
    }
    li.appendChild(nameSpan);
    li.appendChild(statusSpan);
    teamList.appendChild(li);
  }

  if (anyDead) {
    reviveQuestBox.classList.remove('hidden');
    const litCount = ritualCandlesData.filter((c) => c.lit).length;
    questProgress.textContent = `Segel Lilin Darah: ${litCount} / 3`;
    if (litCount >= 3 || reviveReadyState) {
      questDesc.textContent = 'SEGEL LENGKAP! Pergi ke Ruang Aman & tekan [H] untuk menghidupkan tim!';
    } else {
      questDesc.textContent = 'Cari & nyalakan 3 Segel Lilin bercahaya ungu di lorong [E], lalu tekan [H] di Ruang Aman!';
    }
  } else {
    reviveQuestBox.classList.add('hidden');
  }

  const slots = [slot0, slot1];
  for (let i = 0; i < 2; i++) {
    const scrapId = myState.inventory[i];
    if (scrapId) {
      const item = scrapsData.find((s) => s.id === scrapId);
      slots[i].textContent = item ? `🔑 ${item.name}` : 'KUNCI';
      slots[i].classList.add('filled');
    } else {
      slots[i].textContent = `KUNCI ${i + 1}: KOSONG`;
      slots[i].classList.remove('filled');
    }
  }
}

// ============================================================================
// GAME LOOP UTAMA
// ============================================================================
let lastTime = performance.now();
let stepTimer = 0;
let heartbeatTimer = 0;
let netSyncTimer = 0;
let fpsFrameCount = 0;
let fpsAccumTime = 0;

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  // Update penghitung FPS Live
  fpsFrameCount++;
  fpsAccumTime += dt;
  if (fpsAccumTime >= 0.5) {
    const currentFps = Math.min(240, Math.round(fpsFrameCount / fpsAccumTime));
    fpsFrameCount = 0;
    fpsAccumTime = 0;
    if (fpsCounterBadge && graphicsConfig.showFps) {
      const prof = PRESET_PROFILES[graphicsConfig.preset];
      const tag = prof ? prof.shortTag : 'CUSTOM';
      const resPct = Math.round((Number(graphicsConfig.resolutionScale) || 1) * 100);
      fpsCounterBadge.textContent = `${currentFps} FPS • ${tag} (${resPct}%)`;
      fpsCounterBadge.style.color = currentFps >= 45 ? '#4ade80' : currentFps >= 25 ? '#facc15' : '#f87171';
    }
  }

  if (currentScreen === 'lobby' || currentScreen === 'menu') {
    if (scene.background !== null) {
      scene.background = null;
      scene.fog = null;
      renderer.setClearColor(0x000000, 0);
    }

    // Proyeksikan kamera agar pijakan kaki karakter berada tepat di atas lantai Panggung Kreasi
    // dan tidak terpotong di layar HP (Portrait maupun Landscape)
    const IMG_ASPECT = 1280 / 634;
    const winAspect = window.innerWidth / Math.max(1, window.innerHeight);
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad((camera.fov || 70) * 0.5));
    let lobbyDist;
    let camX = 0;
    let camY = 1.623;

    if (winAspect < 1.0) {
      // Layar HP Portrait: fokuskan kamera tepat ke tengah panggung (STAGE_CENTER_X) agar karakter & panggung utuh di tengah
      const minStageHalfWidth = lobbyMode === 'solo' ? 2.45 : 2.85;
      lobbyDist = Math.max(3.256 / tanHalfFov, minStageHalfWidth / (tanHalfFov * Math.max(0.38, winAspect)));
      camX = STAGE_CENTER_X;
      camY = 1.25;
    } else {
      const coverZoom = winAspect > IMG_ASPECT ? winAspect / IMG_ASPECT : 1.0;
      lobbyDist = 3.256 / (tanHalfFov * coverZoom);
    }

    camera.position.set(camX, camY, 99.0 + lobbyDist);
    camera.rotation.set(0, 0, 0);
    myFlashlight.intensity = 0;

    lobbyCharacterGroup.children.forEach((child, idx) => {
      if (child.userData && child.userData.isBannerOnly) {
        child.position.y = 1.15 + Math.sin(now * 0.003 + idx) * 0.03;
      } else {
        child.position.y = 0.02;
        if (child.userData && typeof child.userData.baseYaw === 'number') {
          child.rotation.y = child.userData.baseYaw + Math.sin(now * 0.002 + idx) * 0.06;
        }
      }
    });
    lobbyRings.forEach((r) => {
      r.rotation.z += 1.2 * dt;
    });

    renderer.render(scene, camera);
    return;
  }

  // Keahlian 6 Karakter Sekolah (Adit, Maulana, Fery, Wahyu, Alex, Rafi)
  const normMySkin = normalizeSkinId(mySkinId);
  const speedMultiplier = normMySkin === 'adit' ? 1.15 : normMySkin === 'rafi' ? 1.1 : 1.0;
  const staminaDrainMult = normMySkin === 'fery' ? 0.7 : 1.0;
  const batteryDrainMult = normMySkin === 'alex' ? 0.6 : normMySkin === 'rafi' ? 0.75 : 1.0;
  const batteryRegenMult = normMySkin === 'wahyu' ? 1.45 : 1.0;
  const torchIntensity = normMySkin === 'wahyu' ? 3.5 : 2.7;

  if (!myState.hiding) {
    let moveForward = mobileMoveVec.forward;
    let moveRight = mobileMoveVec.right;
    if (keys['KeyW'] || keys['ArrowUp']) moveForward += 1;
    if (keys['KeyS'] || keys['ArrowDown']) moveForward -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) moveRight += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) moveRight -= 1;

    const isMoving = Math.abs(moveForward) > 0.04 || Math.abs(moveRight) > 0.04;
    const wantsSprint =
      (keys['ShiftLeft'] || keys['ShiftRight'] || mobileSprintActive) && isMoving && myState.stamina > 5;

    let speed = (myState.alive ? 3.9 : 4.7) * speedMultiplier;
    if (wantsSprint && myState.alive) {
      speed = 6.35 * speedMultiplier;
      myState.stamina = Math.max(0, myState.stamina - 24 * staminaDrainMult * dt);
    } else {
      myState.stamina = Math.min(100, myState.stamina + (mySkinId === 'bima' ? 22 : 15) * dt);
    }

    if (isMoving) {
      const len = Math.hypot(moveForward, moveRight);
      moveForward /= len;
      moveRight /= len;

      const sin = Math.sin(myState.yaw);
      const cos = Math.cos(myState.yaw);

      const dx = (-sin * moveForward + cos * moveRight) * speed * dt;
      const dz = (-cos * moveForward - sin * moveRight) * speed * dt;

      if (canMoveTo(myState.x + dx, myState.z)) myState.x += dx;
      if (canMoveTo(myState.x, myState.z + dz)) myState.z += dz;

      if (myState.alive) {
        stepTimer += dt * (wantsSprint ? 1.65 : 1.0);
        if (stepTimer > 0.46) {
          audio.playStep();
          stepTimer = 0;
        }
      }
    }
  }

  const g = worldToGridClient(myState.x, myState.z);
  const inSafeZone = g.row >= 12 && g.col >= 6 && g.col <= 8;

  if (myState.flashlight && myState.alive && !myState.hiding) {
    myState.battery = Math.max(0, myState.battery - 2.1 * batteryDrainMult * dt);
    if (myState.battery <= 0) myState.flashlight = false;
  } else {
    myState.battery = Math.min(100, myState.battery + (inSafeZone ? 18 : 3.8) * batteryRegenMult * dt);
  }

  staminaFill.style.width = `${myState.stamina}%`;
  batteryFill.style.width = `${myState.battery}%`;

  if (myState.hiding) {
    zoneStatus.textContent = 'STATUS: DI LEMARI KELAS';
    zoneStatus.style.borderColor = '#38bdf8';
    zoneStatus.style.color = '#38bdf8';
  } else if (inSafeZone) {
    zoneStatus.textContent = `ZONA: PINTU LANTAI ${currentFloorNum} & RUANG AMAN`;
    zoneStatus.style.borderColor = '#16a34a';
    zoneStatus.style.color = '#4ade80';
  } else {
    zoneStatus.textContent = `ZONA: LORONG SEKOLAH LT.${currentFloorNum}`;
    zoneStatus.style.borderColor = '#dc2626';
    zoneStatus.style.color = '#f87171';
  }

  updateInteractionPrompt(inSafeZone);

  camera.position.set(myState.x, myState.y, myState.z);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = myState.yaw;
  camera.rotation.x = myState.pitch;

  selfGlow.position.copy(camera.position);
  selfGlow.color.setHex(myState.alive ? 0x4a151b : 0x9333ea);
  selfGlow.intensity = myState.alive ? 0.38 : 0.9;

  myFlashlight.position.copy(camera.position);
  myFlashlight.intensity = myState.flashlight && myState.alive && !myState.hiding ? torchIntensity : 0;

  const dir = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation);
  myFlashlightTarget.position.copy(camera.position).add(dir.multiplyScalar(8));

  netSyncTimer += dt;
  if (netSyncTimer >= 0.05) {
    netSyncTimer = 0;
    socket.emit('playerMove', {
      x: myState.x,
      y: myState.y,
      z: myState.z,
      yaw: myState.yaw,
      pitch: myState.pitch,
      flashlight: myState.flashlight
    });
  }

  const activePlayerIds = new Set();
  for (const [id, p] of Object.entries(playersData)) {
    if (id === myPlayerId || p.hiding) continue;
    activePlayerIds.add(id);

    let mesh = otherPlayerMeshes.get(id);
    if (!mesh || mesh.userData.skinId !== p.skinId) {
      if (mesh) scene.remove(mesh);
      mesh = createCharacterMesh(p, false);
      scene.add(mesh);
      otherPlayerMeshes.set(id, mesh);
    }

    mesh.position.x += (p.x - mesh.position.x) * 0.25;
    mesh.position.z += (p.z - mesh.position.z) * 0.25;
    mesh.rotation.y = p.yaw;

    if (mesh.userData.suitMat) {
      mesh.userData.suitMat.opacity = p.alive ? 1.0 : 0.4;
    }
    if (mesh.userData.flashlight) {
      mesh.userData.flashlight.intensity = p.flashlight && p.alive ? 2.0 : 0;
    }
  }

  for (const [id, mesh] of otherPlayerMeshes.entries()) {
    if (!activePlayerIds.has(id)) {
      scene.remove(mesh);
      otherPlayerMeshes.delete(id);
    }
  }

  for (const mesh of scrapMeshes.values()) {
    if (mesh.userData.keyPivot) {
      mesh.userData.keyPivot.rotation.y += 1.8 * dt;
      mesh.userData.keyPivot.position.y = Math.sin(now * 0.004) * 0.08;
    } else {
      mesh.rotation.y += 1.8 * dt;
    }
  }

  // Animasi 3D Model Hantu (Skin_Wahyu.glb) Mengejar Player Ala Peta Eta Roblox
  if (jumpscareTimer > 0) {
    jumpscareTimer = Math.max(0, jumpscareTimer - dt);
    // Saat tertangkap, tampilkan 3D Hantu tepat di depan wajah kamera player (Jumpscare 3D)
    const forwardX = -Math.sin(myState.yaw);
    const forwardZ = -Math.cos(myState.yaw);
    monsterMesh.position.set(
      myState.x + forwardX * 1.12,
      0,
      myState.z + forwardZ * 1.12
    );
    monsterMesh.rotation.y = Math.atan2(-forwardX, -forwardZ);
    camera.position.x += (Math.random() - 0.5) * 0.16;
    camera.position.y += (Math.random() - 0.5) * 0.16;
  } else {
    const prevMx = monsterMesh.position.x;
    const prevMz = monsterMesh.position.z;
    monsterMesh.position.x += (monsterData.x - monsterMesh.position.x) * 0.34;
    monsterMesh.position.z += (monsterData.z - monsterMesh.position.z) * 0.34;

    // Interpolasi sudut hadap hantu agar mulus menghadap arah kejaran / player
    let targetYaw = monsterData.yaw;
    const moveDx = monsterData.x - prevMx;
    const moveDz = monsterData.z - prevMz;
    if (Math.hypot(moveDx, moveDz) > 0.015) {
      targetYaw = Math.atan2(moveDx, moveDz);
    }
    let angleDiff = targetYaw - monsterMesh.rotation.y;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    monsterMesh.rotation.y += angleDiff * Math.min(1, dt * 12);
  }

  const isChasing = monsterData.state === 'chase' || jumpscareTimer > 0;
  const runPhase = now * (isChasing ? 0.013 : 0.0065);

  if (monsterMesh.userData.bodyPivot) {
    // Saat mengejar player, tubuh 3D condong agresif ke depan & berguncang seiring langkah lari
    monsterMesh.userData.bodyPivot.rotation.x = isChasing ? 0.22 : 0.05;
    monsterMesh.userData.bodyPivot.rotation.z = Math.cos(runPhase) * (isChasing ? 0.075 : 0.03);
    monsterMesh.userData.bodyPivot.position.y = isChasing
      ? 0.06 + Math.abs(Math.sin(runPhase)) * 0.18
      : 0.02 + Math.abs(Math.sin(runPhase)) * 0.06;
  }

  // Animasi Vertex Kaki Berlari & Ayunan Tubuh pada 3D Model Skin_Wahyu.glb
  if (monsterMesh.userData.animMeshes && monsterMesh.userData.animMeshes.length > 0) {
    const strideAmp = isChasing ? 0.28 : 0.14;
    const liftAmp = isChasing ? 0.13 : 0.05;
    const sinP = Math.sin(runPhase);
    const cosP = Math.cos(runPhase);
    const headTwitch = isChasing ? Math.sin(now * 0.032) * 0.045 : Math.sin(now * 0.006) * 0.02;

    for (const am of monsterMesh.userData.animMeshes) {
      const arr = am.posAttr.array;
      const base = am.basePositions;

      for (let i = 0; i < am.legIndices.length; i++) {
        const leg = am.legIndices[i];
        const idx = leg.idx3;
        const w = leg.weight;
        const dirSign = leg.isLeft ? 1 : -1;
        const swingZ = sinP * dirSign * strideAmp * w;
        const liftY = Math.max(0, cosP * dirSign) * liftAmp * w;
        arr[idx] = base[idx];
        arr[idx + 1] = base[idx + 1] + liftY;
        arr[idx + 2] = base[idx + 2] + swingZ;
      }

      for (let i = 0; i < am.upperIndices.length; i++) {
        const up = am.upperIndices[i];
        const idx = up.idx3;
        const bx = base[idx];
        // Ayunan bahu/tangan berlawanan dengan langkah kaki saat mengejar player
        const armSwingZ = -bx * sinP * (isChasing ? 0.36 : 0.15) * up.torsoWeight;
        const headOffsetX = headTwitch * up.headWeight;
        arr[idx] = bx + headOffsetX;
        arr[idx + 1] = base[idx + 1];
        arr[idx + 2] = base[idx + 2] + armSwingZ;
      }

      am.posAttr.needsUpdate = true;
    }
  }

  if (monsterMesh.userData.ghostMaterials) {
    for (const gm of monsterMesh.userData.ghostMaterials) {
      gm.emissiveIntensity = isChasing ? 0.56 + Math.sin(now * 0.02) * 0.12 : 0.42;
    }
  }

  if (monsterMesh.userData.ring1) {
    monsterMesh.userData.ring1.rotation.z += (isChasing ? 4.8 : 2.5) * dt;
    monsterMesh.userData.ring2.rotation.z -= (isChasing ? 5.4 : 3.0) * dt;
    const pulse = 1 + Math.sin(now * 0.012) * (isChasing ? 0.25 : 0.12);
    monsterMesh.userData.redBeam.scale.set(pulse, 1, pulse);
    monsterMesh.userData.redAuraLight.intensity = isChasing ? 6.2 : 3.8;
    if (monsterMesh.userData.frontModelLight) {
      monsterMesh.userData.frontModelLight.intensity = isChasing ? 3.1 : 2.3;
    }
  }

  const distToMonster = Math.hypot(monsterMesh.position.x - myState.x, monsterMesh.position.z - myState.z);
  if (distToMonster < 16) {
    const terrorFactor = Math.max(0, 1 - distToMonster / 16);
    if (myState.alive) {
      bloodVignette.style.opacity = String((terrorFactor * 0.84).toFixed(2));
    }

    if (distToMonster < 8.5 && !myState.hiding) {
      camera.position.x += (Math.random() - 0.5) * 0.07 * terrorFactor;
      camera.position.y += (Math.random() - 0.5) * 0.07 * terrorFactor;
    }

    heartbeatTimer += dt;
    const beatInterval = Math.max(0.24, 0.9 - terrorFactor * 0.65);
    if (heartbeatTimer >= beatInterval) {
      audio.playHeartbeat();
      heartbeatTimer = 0;
    }
  } else if (myState.alive) {
    bloodVignette.style.opacity = '0';
  }

  if (graphicsConfig.flickerEnabled) {
    for (let i = 0; i < flickeringLights.length; i++) {
      if (Math.random() < 0.06) {
        flickeringLights[i].intensity = Math.random() < 0.3 ? 0.05 : 0.75;
      }
    }
  }

  renderer.render(scene, camera);
}

function updateInteractionPrompt(inSafeZone) {
  if (myState.hiding) {
    interactionPrompt.textContent = 'Tekan [E] Keluar dari Kamar Mandi / Loker Sekolah';
    interactionPrompt.classList.remove('hidden');
    return;
  }

  const reachBonus = mySkinId === 'maulana' || mySkinId === 'siti' ? 0.65 : 0.0;
  const anyDead = Object.values(playersData).some((p) => !p.alive);

  if (anyDead) {
    for (const c of ritualCandlesData) {
      if (!c.lit && Math.hypot(c.x - myState.x, c.z - myState.z) <= 2.9 + reachBonus) {
        interactionPrompt.textContent = `🕯️ Tekan [E] Nyalakan ${c.name}`;
        interactionPrompt.classList.remove('hidden');
        return;
      }
    }
  }

  if (inSafeZone) {
    if (anyDead && reviveReadyState) {
      interactionPrompt.textContent = '✨ SEGEL LENGKAP! Tekan [H] untuk HIDUPKAN ULANG TIM di Ruang Aman!';
      interactionPrompt.classList.remove('hidden');
      return;
    }
    if (myState.alive && myState.inventory.length > 0) {
      const actionTxt = currentFloorNum < 4
        ? `🔓 Tekan [E] Pasang Konci ke Pintu Ruang Aman (Naik Lantai ${currentFloorNum + 1})!`
        : '🔓 Tekan [E] Pasang Konci ke Pintu Keluar Sekolah!';
      interactionPrompt.textContent = actionTxt;
      interactionPrompt.classList.remove('hidden');
      return;
    }
  }

  const { row, col } = worldToGridClient(myState.x, myState.z);
  if (myState.alive && row >= 10 && row <= 11 && (col <= 1 || col >= 13)) {
    const nextFloor = col <= 1 ? (currentFloorNum % 3) + 1 : currentFloorNum === 3 ? 2 : 3;
    interactionPrompt.textContent = `🪜 Tekan [E] Naik/Turun Tangga ke LANTAI ${nextFloor} (Atau Tekan [1] / [2] / [3])`;
    interactionPrompt.classList.remove('hidden');
    return;
  }

  if (myState.alive) {
    for (const lk of lockersData) {
      if (!lk.occupantId && Math.hypot(lk.x - myState.x, lk.z - myState.z) <= 2.4) {
        const isStall = lk.kind === 'stall' || String(lk.id).startsWith('stall_');
        interactionPrompt.textContent = isStall
          ? '🚻 Tekan [E] Sembunyi di Bilik Kamar Mandi Sekolah'
          : '🚪 Tekan [E] Sembunyi di Loker Siswa';
        interactionPrompt.classList.remove('hidden');
        return;
      }
    }
  }

  if (myState.alive) {
    let nearest = null;
    let minDist = 3.0 + reachBonus;
    for (const s of scrapsData) {
      if (s.carrierId || s.deposited) continue;
      const d = Math.hypot(s.x - myState.x, s.z - myState.z);
      if (d < minDist) {
        minDist = d;
        nearest = s;
      }
    }

    if (nearest) {
      if (myState.inventory.length >= 2) {
        interactionPrompt.textContent = 'Tangan Penuh (Maks 2 Konci)! Buka Gembok di Ruang Aman atau Tekan [G] Jatuhkan';
      } else {
        interactionPrompt.textContent = `🔑 Tekan [E] Ambil ${nearest.name}`;
      }
      interactionPrompt.classList.remove('hidden');
      return;
    }
  }

  interactionPrompt.classList.add('hidden');
}

requestAnimationFrame(animate);
