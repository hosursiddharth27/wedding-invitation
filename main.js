/**
 * Rahul & Priya — Royal Digital Wedding Invitation Experience
 * Crafted for WebNova
 */

// =============================================================================
// 1. FLOATING ROSE PETALS CANVAS SIMULATION
// =============================================================================
class PetalsCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.petalCount = window.innerWidth < 768 ? 22 : 45;
    this.mouse = { x: -1000, y: -1000 };
    this.colors = [
      { r: 158, g: 31, b: 77, alpha: 0.85 },   // Deep crimson burgundy
      { r: 186, g: 45, b: 85, alpha: 0.8 },    // Rich velvet rose
      { r: 232, g: 168, b: 124, alpha: 0.75 }, // Rose gold shimmer
      { r: 110, g: 20, b: 50, alpha: 0.9 },    // Dark wine
      { r: 247, g: 215, b: 190, alpha: 0.65 }  // Soft blush peach
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    for (let i = 0; i < this.petalCount; i++) {
      this.petals.push(this.createPetal(true));
    }

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createPetal(initial = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: initial ? Math.random() * this.canvas.height : -20 - Math.random() * 40,
      size: 10 + Math.random() * 14,
      speedX: -1 + Math.random() * 2,
      speedY: 0.8 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: -1.5 + Math.random() * 3,
      oscillation: Math.random() * Math.PI * 2,
      oscillationSpeed: 0.02 + Math.random() * 0.03,
      color: this.colors[Math.floor(Math.random() * this.colors.length)]
    };
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);

    const grad = this.ctx.createRadialGradient(0, 0, 1, 0, 0, p.size);
    grad.addColorStop(0, `rgba(${p.color.r + 30}, ${p.color.g + 20}, ${p.color.b + 20}, ${p.color.alpha})`);
    grad.addColorStop(0.7, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.alpha})`);
    grad.addColorStop(1, `rgba(${Math.max(0, p.color.r - 40)}, ${Math.max(0, p.color.g - 20)}, ${Math.max(0, p.color.b - 20)}, 0.2)`);

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    // Organic curved petal silhouette
    this.ctx.moveTo(0, -p.size);
    this.ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.9, p.size * 0.6, 0, p.size);
    this.ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.6, -p.size * 0.9, -p.size * 0.6, 0, -p.size);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let p of this.petals) {
      p.oscillation += p.oscillationSpeed;
      p.x += p.speedX + Math.sin(p.oscillation) * 1.2;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Soft mouse deflection
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        p.x -= (dx / dist) * 2;
        p.y -= (dy / dist) * 2;
      }

      // Recycle petals at bottom
      if (p.y > this.canvas.height + 30 || p.x < -50 || p.x > this.canvas.width + 50) {
        Object.assign(p, this.createPetal(false));
      }

      this.drawPetal(p);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// =============================================================================
// 2. ROMANTIC AMBIENT AUDIO ENGINE (Web Audio API Synthesizer)
// =============================================================================
class RomanticAudioPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.timerId = null;
    this.droneGain = null;
    this.masterGain = null;
    
    // Raag Yaman / Bhupali inspired frequencies (sweet, romantic royal scale)
    this.melodyNotes = [
      220.00, // A3
      246.94, // B3
      277.18, // C#4
      329.63, // E4
      369.99, // F#4
      440.00, // A4
      493.88, // B4
      554.37, // C#5
      659.25  // E5
    ];
    this.step = 0;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startDrone() {
    if (this.droneGain) return;
    const droneRoot = 110; // A2
    const droneFifth = 164.81; // E3

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.droneGain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 3);

    // Warm Tanpura Drone Oscillators
    [droneRoot, droneFifth, droneRoot * 2].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.4 / (idx + 1), this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.droneGain);
      osc.start();
    });

    this.droneGain.connect(this.masterGain);
  }

  playNote(freq, duration = 2.4) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Sitar / Harp chime timbre
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Filter for warm wooden acoustic touch
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    // Pluck Envelope
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  scheduleMelody() {
    if (!this.isPlaying) return;
    
    // Choose notes with gentle rhythmic cadence
    const pattern = [0, 2, 4, 5, 4, 2, 3, 5, 7, 5, 4, 1];
    const noteIdx = pattern[this.step % pattern.length];
    const freq = this.melodyNotes[noteIdx];
    
    this.playNote(freq, 2.2);
    this.step++;

    // Randomize slight pacing for human acoustic feeling
    const delay = [900, 1100, 800, 1400, 1000][this.step % 5];
    this.timerId = setTimeout(() => this.scheduleMelody(), delay);
  }

  toggle() {
    this.ensureContext();
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.ensureContext();
    this.isPlaying = true;
    this.startDrone();
    this.scheduleMelody();
    document.body.classList.add('playing');
    this.updateUI(true);
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId) clearTimeout(this.timerId);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    }
    document.body.classList.remove('playing');
    this.updateUI(false);
  }

  updateUI(playing) {
    const textEl = document.getElementById('musicStateText');
    if (textEl) {
      textEl.textContent = playing ? 'Mute Music' : 'Play Melody';
    }
  }
}

// =============================================================================
// 3. ENVELOPE OPENING & REPLAY ORCHESTRATION
// =============================================================================
function initEnvelopeExperience(audioPlayer) {
  const envelopeScreen = document.getElementById('envelopeScreen');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSeal = document.getElementById('waxSeal');
  const openBtn = document.getElementById('openInvitationBtn');
  const invitationContent = document.getElementById('invitationContent');
  const replayBtn = document.getElementById('replayBtn');
  const footerReplayBtn = document.getElementById('footerReplayBtn');

  function openEnvelope() {
    if (envelopeWrapper.classList.contains('opening')) return;

    // Start audio player upon user click (if not already started)
    if (!audioPlayer.isPlaying) {
      audioPlayer.play();
    }

    // Step 1: Animate envelope wrapper (wax seal breaks, flap opens, card slides)
    envelopeWrapper.classList.add('opening');

    // Step 2: Show invitation page underneath
    invitationContent.classList.remove('hidden');
    invitationContent.setAttribute('aria-hidden', 'false');

    // Step 3: Fade out envelope screen smoothly
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1400);

    // Step 4: Hide envelope screen from accessibility tree
    setTimeout(() => {
      envelopeScreen.setAttribute('aria-hidden', 'true');
    }, 2400);
  }

  function resetEnvelope() {
    envelopeScreen.setAttribute('aria-hidden', 'false');
    envelopeScreen.classList.remove('opened');
    envelopeWrapper.classList.remove('opening');
    invitationContent.classList.add('hidden');
    invitationContent.setAttribute('aria-hidden', 'true');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  if (openBtn) openBtn.addEventListener('click', openEnvelope);
  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (replayBtn) replayBtn.addEventListener('click', resetEnvelope);
  if (footerReplayBtn) footerReplayBtn.addEventListener('click', resetEnvelope);

  // Keyboard accessibility for wax seal
  if (waxSeal) {
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }
}

// =============================================================================
// 4. WEDDING COUNTDOWN TIMER
// =============================================================================
function initCountdownTimer() {
  // Wedding Date: Dec 18, 2026, 11:30 AM IST
  const targetDate = new Date('2026-12-18T11:30:00+05:30').getTime();

  const daysEl = document.getElementById('daysVal');
  const hoursEl = document.getElementById('hoursVal');
  const minsEl = document.getElementById('minutesVal');
  const secsEl = document.getElementById('secondsVal');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// =============================================================================
// 5. TIMELINE SCROLL PROGRESSION
// =============================================================================
function initTimelineScroll() {
  const storySection = document.getElementById('story');
  const spineProgress = document.getElementById('spineProgress');
  if (!storySection || !spineProgress) return;

  window.addEventListener('scroll', () => {
    const rect = storySection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate progress through the section
    const totalHeight = rect.height - windowHeight;
    const currentScrolled = -rect.top;

    if (currentScrolled <= 0) {
      spineProgress.style.height = '0%';
    } else if (currentScrolled >= totalHeight) {
      spineProgress.style.height = '100%';
    } else {
      const percentage = (currentScrolled / totalHeight) * 100;
      spineProgress.style.height = `${Math.min(100, Math.max(0, percentage))}%`;
    }
  }, { passive: true });
}

// =============================================================================
// DOM READY BOOTSTRAP
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Petals Canvas
  new PetalsCanvas('petalsCanvas');

  // 2. Romantic Audio Player
  const audioPlayer = new RomanticAudioPlayer();
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => audioPlayer.toggle());
  }

  // 3. Envelope Unfolding Experience
  initEnvelopeExperience(audioPlayer);

  // 4. Wedding Countdown
  initCountdownTimer();

  // 5. Timeline Spine Scroll Tracker
  initTimelineScroll();
});
