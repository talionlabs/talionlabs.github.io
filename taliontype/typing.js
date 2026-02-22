/**
 * typing.js — TalionType
 * ════════════════════════════════════════════════════════════════
 * A TalionLabs product · https://talionlabs.github.io
 *
 * SECTIONS:
 *  1.  Config & Constants
 *  2.  Firebase Setup Instructions
 *  3.  Word Banks & Text Content
 *  4.  Global State
 *  5.  DOM Cache
 *  6.  WPM-Based Level System (3 WPM = 1 level, max level 100 at 300+ WPM)
 *  7.  Text Generation (Words / Sentences / Code / Punctuation / Numbers / Custom)
 *  8.  Arena Rendering (dual-layer overlay)
 *  9.  Cursor Positioning (live + ghost)
 *  10. Ghost Race Engine (record → replay → animate)
 *  11. Adaptive Difficulty
 *  12. Timer Engine
 *  13. Metric Calculations
 *  14. Anti-Cheat Module
 *  15. Input Handler
 *  16. Live HUD
 *  17. Finish Test & Results
 *  18. Init / Reset
 *  19. Pause / Resume
 *  20. WPM Canvas Chart
 *  21. Error Breakdown
 *  22. Key Heatmap
 *  23. Confetti
 *  24. Local Leaderboard
 *  25. Firebase Leaderboard (Global / Weekly / Monthly + Tie-breakers)
 *  26. Leaderboard Rendering & Filters
 *  27. Auth (Google + Email)
 *  28. Personal Stats & History
 *  29. 35-Achievement System (Common / Rare / Epic)
 *  30. Daily Challenge
 *  31. Social Sharing
 *  32. Sound Engine
 *  33. Pro / Gumroad
 *  34. Settings
 *  35. Theme
 *  36. Event Bindings & Boot
 * ════════════════════════════════════════════════════════════════
 */
;(function () {
'use strict';

/* ═══════════════════════════════════════════════════════════
   §1  CONFIG & CONSTANTS
═══════════════════════════════════════════════════════════ */
const VER         = '3.0.0';
const HOME_URL    = 'https://talionlabs.github.io';
const GUMROAD_URL = 'https://gumroad.com/l/taliontype-pro'; // update this
const MAX_LEVEL   = 100;
const WPM_PER_LVL = 3;   // Whole number — 300 WPM = Level 100 (350 WPM cap enforced by anti-cheat)
const LB_MAX      = 50;   // top-50 per leaderboard

// Adaptive difficulty breakpoints (avg WPM of last 5 tests)
const ADAPT_THRESHOLDS = { easy: 35, medium: 70 }; // <35=easy, <70=medium, else=hard

/* ═══════════════════════════════════════════════════════════
   §3  WORD BANKS & TEXT CONTENT
═══════════════════════════════════════════════════════════ */
const WORDS = {
  easy: [
    'the','be','to','of','and','a','in','that','have','it','for','not','on',
    'with','he','as','you','do','at','this','but','his','by','from','they','we',
    'say','her','she','or','an','will','my','one','all','would','there','their',
    'what','so','up','out','if','about','who','get','which','go','me','when',
    'make','can','like','time','no','just','him','know','take','people','into',
    'year','your','good','some','could','them','see','than','then','now','look',
    'only','come','its','over','think','also','back','after','two','how','our',
    'work','well','way','even','new','want','any','give','day','most','us','too',
    'big','man','old','ask','part','run','try','much','let','put','end','why',
    'long','home','hand','place','case','week','fact','group','point','play',
  ],
  medium: [
    'ability','absence','account','achieve','acquire','address','advance',
    'airline','ancient','another','anxiety','approve','archive','arrange',
    'article','attempt','average','balance','battery','between','billion',
    'brought','cabinet','capital','captain','careful','central','certain',
    'chapter','charity','climate','college','combine','command','comment',
    'complex','concern','conduct','confirm','connect','context','control',
    'correct','council','country','culture','current','decided','declare',
    'defined','deliver','develop','digital','display','diverse','driving',
    'dynamic','economy','element','embrace','emotion','endless','enhance',
    'explore','factory','feeling','finance','forward','freedom','further',
    'genuine','history','however','imagine','include','involve','justice',
    'kitchen','language','leading','library','limited','message','mistake',
    'morning','natural','nothing','obvious','opinion','outside','patient',
    'payment','perfect','picture','problem','process','product','protect',
    'purpose','quickly','realize','receive','related','replace','respect',
    'results','science','service','several','similar','society','student',
    'subject','suggest','support','teacher','thought','through','tonight',
    'trouble','usually','various','version','village','website','whether',
    'already','because','between','business','change','coming','company',
  ],
  hard: [
    'aberration','abominable','accelerate','accommodate','acknowledge',
    'acquisition','ambiguous','anachronism','anticipate','apocalyptic',
    'apparatus','architecture','arithmetic','assassination','astonishment',
    'atmosphere','authoritative','bureaucracy','catastrophe','circumstances',
    'clarification','collaboration','complicated','comprehensive','concentration',
    'configuration','consciousness','contradiction','controversial','coordination',
    'cryptocurrency','deterioration','determination','disambiguation',
    'diversification','electromagnetic','establishment','exacerbation',
    'extrapolate','fluorescent','hallucination','heterogeneous','hierarchical',
    'hypothetical','identification','implementation','incompatible',
    'infrastructure','instantiation','juxtaposition','lexicographical',
    'manifestation','metamorphosis','miscommunication','multidimensional',
    'obfuscation','orchestration','overwhelming','perpendicular',
    'philanthropist','physiological','predetermined','prioritization',
    'quintessential','rationalization','reconnaissance','reverberation',
    'revolutionary','sophisticated','straightforward','subconscious',
    'transcontinental','unintelligible','unprecedented','vulnerabilities',
    'entrepreneurship','acknowledgement','categorization','contemporaneous',
    'disproportionate','extraordinarily','incomprehensible','indispensable',
  ],
};

const SENTENCES = {
  easy: [
    'The quick brown fox jumps over the lazy dog.',
    'A journey of a thousand miles begins with a single step.',
    'All that glitters is not gold in this world.',
    'The early bird catches the worm every morning.',
    'Actions speak louder than words ever could.',
    'Every cloud has a silver lining somewhere.',
    'Practice makes perfect if you keep at it daily.',
    'Two heads are better than one on hard problems.',
    'Where there is a will, there is always a way forward.',
    'You miss one hundred percent of the shots you never take.',
  ],
  medium: [
    'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    'In the middle of every difficulty lies opportunity waiting to be discovered.',
    'It does not matter how slowly you go as long as you do not stop moving forward.',
    'The future belongs to those who believe in the beauty of their dreams every day.',
    'Success is not final, failure is not fatal; it is the courage to continue that counts.',
    'Life is what happens when you are busy making other plans for the distant future.',
    'The only way to do great work is to love what you do with genuine passion and care.',
    'Strive not to be a success, but rather to be of value to those around you daily.',
    'An unexamined life is not worth living, according to the ancient philosophers of Greece.',
    'Happiness is not something ready made; it comes from your own actions and choices.',
  ],
  hard: [
    'Technological advancement in artificial intelligence has precipitated unprecedented transformations across virtually every sector of contemporary civilization.',
    'Epistemological frameworks that undergird scientific methodology necessitate rigorous falsifiability criteria and systematic empirical verification procedures.',
    'Quantum entanglement demonstrates nonlocal correlations between particles that seemingly violate classical intuitions about separability and causal independence.',
    'Psycholinguistic research consistently demonstrates that bilingual individuals exhibit superior cognitive flexibility and executive function capabilities.',
    'Constitutional jurisprudence necessitates balancing competing fundamental rights through proportionality analysis and contextual interpretation of legislative intent.',
    'Neuroplasticity research has fundamentally transformed our understanding of the human brain\'s remarkable capacity for structural and functional reorganization.',
    'The philosophical implications of quantum mechanics challenge deterministic worldviews, suggesting that reality at its most fundamental level is probabilistic.',
    'Macroeconomic stabilization policies must carefully balance competing objectives including price stability, full employment, and sustainable growth.',
  ],
};

const CODE_SNIPPETS = [
  `function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}`,
  `const memoize = (fn) => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n};`,
  `async function fetchWithRetry(url, retries = 3) {\n  for (let i = 0; i < retries; i++) {\n    try {\n      const res = await fetch(url);\n      if (!res.ok) throw new Error(res.status);\n      return await res.json();\n    } catch (err) {\n      if (i === retries - 1) throw err;\n      await new Promise(r => setTimeout(r, 2 ** i * 1000));\n    }\n  }\n}`,
  `class EventEmitter {\n  constructor() { this.events = {}; }\n  on(event, fn) {\n    (this.events[event] = this.events[event] || []).push(fn);\n    return this;\n  }\n  emit(event, ...args) {\n    (this.events[event] || []).forEach(fn => fn(...args));\n    return this;\n  }\n  off(event, fn) {\n    this.events[event] = (this.events[event] || []).filter(f => f !== fn);\n    return this;\n  }\n}`,
  `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left  = arr.filter(x => x < pivot);\n  const mid   = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), ...mid, ...quickSort(right)];\n}`,
  `const createStore = (reducer, initial) => {\n  let state = initial;\n  const listeners = [];\n  return {\n    getState: () => state,\n    dispatch: (action) => {\n      state = reducer(state, action);\n      listeners.forEach(l => l());\n    },\n    subscribe: (fn) => {\n      listeners.push(fn);\n      return () => listeners.filter(l => l !== fn);\n    }\n  };\n};`,
];

const PUNCT_LINES = [
  'Wait, really? No — stop.', 'Hello, world! It works.',
  'Oh? Okay... let\'s go.', 'Yes! Finally, it\'s done.',
  'Hmm, let\'s see: ready?', 'Come on; don\'t rush it.',
  'Great — but be careful!', 'Sure, why not? Let\'s try.',
  'Indeed, it\'s working now.', 'Fine — quickly, though.',
  'Look: it\'s quite simple.', 'Try again, okay? Focus.',
  'Ready, set, go! Now type.', 'Wow! That\'s very fast.',
  'Right; let\'s start again.', 'Listen — it matters here.',
];

const PUNCTUATION = [',', '.', '!', '?', ';', ':'];
const NUMBERS     = '0123456789'.split('');

/* ═══════════════════════════════════════════════════════════
   §4  GLOBAL STATE
═══════════════════════════════════════════════════════════ */
const S = {
  // Config
  mode: 'words', diff: 'medium', duration: 30,
  // Session
  text: '', charIdx: 0, typed: '',
  started: false, finished: false, paused: false, timerActive: false,
  timeLeft: 30, startTime: null, pauseStart: null,
  // Metrics
  correctChars: 0, totalTyped: 0,
  errMap: {}, keyErr: {}, keyPresses: {},
  wpmSamples: [],
  charTimes: [],   // ms elapsed when each char was typed (for ghost)
  curStreak: 0, bestStreak: 0,
  arenaScroll: 0,   // px of vertical scroll offset in the words-wrap
  // Level (WPM-based)
  bestWpm: 0,
  // Settings
  fontSize: 20, smoothCaret: true, soundEnabled: false,
  showLiveWpm: true, usePunct: false, useNums: false,
  customCount: 50, customText: '',
  noBlink: false, showProgress: true, errSnd: false, hiCon: false, reducedMotion: false,
  // Ghost
  ghostEnabled: false,
  ghostRecord: null,  // { charTimes[], wpm, acc, mode, diff, duration, date }
  ghostRafId: null,
  // Adaptive
  adaptiveOverride: null,
  // Firebase
  fbApp: null, fbDB: null, fbAuth: null,
  currentUser: null, fbReady: false,
  // Misc
  lastResult: null, activeTab: 'global',
  isDailyActive: false, dailyChallenge: null,
  achievements: {}, history: [],
  isPro: false,
};

/* ═══════════════════════════════════════════════════════════
   §5  DOM CACHE
═══════════════════════════════════════════════════════════ */
const D = {};
function cacheDOM() {
  const ids = [
    'wordsTarget','wordsTyped','liveCursor','ghostCursor','ghostInput',
    'arena','arenaHint','arenaFill','wordsWrap','pausedOv','btnResume',
    'ghostBar','ghostRecordWpm','ghostVsLabel',
    'hcTimer','hcGhost','ghostWpmVal',
    'timerVal','wpmVal','accVal','streakVal',
    'btnReset','btnPause','pauseIco','pauseLbl','btnSaveGhost',
    'resultsPanel','confettiCv','resWpmBig','resBadges','lvlUpBadge',
    'resWpm','resRaw','resAcc','resErrors','resCons','resStreak','resWpmNote',
    'ghostResult','grVerdict','grDetail',
    'wpmChart','errChips','heatmapWrap',
    'btnAgain','btnSaveScore','btnShareRes','btnSetGhost',
    // BUG-13: hdrLevel was missing
    'hdrLevel','lvlOrb','lvlNum','lvlDisp','lvlWpmLabel','lvlFill','lvlSub',
    'adaptToast','adaptMsg','adaptClose',
    'dailyBanner','dbDesc','dbReward','btnStartDaily','closeDB','dailyBadge',
    'settingsPanel','closeSet','fsSlider','fsVal',
    'wordCount','customTxt','optSmooth','optSound','optLiveWpm',
    'optPunct','optNums','optProgress','optBlink','optErrSnd','optHiCon','optReducedMotion','btnResetAll',
    'authBtn','authBtnTxt','authOv','closeAuth','btnGoogle',
    'btnEmailIn','btnEmailUp','authEmail','authPw','authName','authErr',
    'lbOv','closeLB','lbBody','lbPb','lbPbWpm','lbPbRank','lbNote',
    'lbModeFilter','lbDiffFilter','lbTimeFilter','btnLBFilter',
    'ghostOv','closeGhost','ghostBody',
    'statsOv','closeStats','statCards','histChart',
    'achOv','closeAch','achGrid','achStats','achBadge',
    'dailyOv','closeDaily','dailyBody',
    'proOv','closePro','btnBuyPro','proKeyInput','btnVerifyPro',
    'proVerifyNote','proFeaturesList','btnPro',
    'saveOv','closeSave','saveName','btnConfSave','saveSumEl','saveNote',
    'shareOv','closeShare','shareCard','btnTwitter','btnCopy',
    // BUG-08: feedback modal was missing from cacheDOM
    'feedbackOv','closeFeedback','feedbackTxt','btnSendFeedback',
    'achToast','atIcon','atName',
    'toast','backdrop','themeToggle','adTop','adBot',
    'ghostToggleWrap','ghostToggle',
    'hamburgerBtn','mobileMenu',
    'mmDaily','mmGhost','mmAch','mmLB','mmStats','mmFriends','mmSettings',
    'mmAuthBtn','mmAuthBtnTxt','mmBtnPro','mmThemeToggle',
    'mmDailyBadge','mmAchBadge',
    // BUG-12: removed dead 'volSlider','volVal' entries (elements don't exist in HTML)
    'friendsOv','closeFriends',
    'tabSignIn','tabSignUp','btnForgotPw',
    'ftStats','ftLB','ftPro','ftAch','ftDaily',
    // BUG-03: desktop nav buttons were missing — caused all nav clicks to silently fail
    'btnLB','btnStats','btnAch','btnFriends','btnDaily','btnGhost','btnSet',
  ];
  ids.forEach(id => { D[id] = document.getElementById(id); });
  D.modePills = document.querySelectorAll('[data-mode]');
  D.diffPills = document.querySelectorAll('[data-diff]');
  D.timePills = document.querySelectorAll('[data-time]');
  D.lbTabs    = document.querySelectorAll('[data-lbt]');
  D.ftModes   = document.querySelectorAll('.ft-mode');
}

/* ═══════════════════════════════════════════════════════════
   §6  WPM-BASED LEVEL SYSTEM
═══════════════════════════════════════════════════════════
   Level = floor(bestWPM / WPM_PER_LVL), capped at MAX_LEVEL.
   Level ONLY advances if user beats their personal best WPM.
═══════════════════════════════════════════════════════════ */
function calcLevel(wpm) {
  return Math.min(MAX_LEVEL, Math.max(1, Math.floor(wpm / WPM_PER_LVL)));
}

function currentLevel() { return calcLevel(S.bestWpm); }

function refreshLevelUI() {
  const lvl       = currentLevel();
  const curWpm    = S.bestWpm;
  const lo        = lvl       * WPM_PER_LVL;
  const hi        = (lvl + 1) * WPM_PER_LVL;
  const pct       = lvl >= MAX_LEVEL ? 100
                  : Math.min(100, ((curWpm - lo) / (hi - lo)) * 100);
  const toNext    = Math.max(0, hi - curWpm);

  if (D.lvlNum)  D.lvlNum.textContent  = lvl;
  if (D.lvlDisp) D.lvlDisp.textContent = lvl;
  if (D.lvlFill) D.lvlFill.style.width = pct + '%';
  if (D.lvlWpmLabel) D.lvlWpmLabel.textContent = `${curWpm} WPM best`;
  if (D.lvlSub)  D.lvlSub.textContent =
    lvl >= MAX_LEVEL ? 'MAX LEVEL 🏆' : `${toNext} WPM to level ${lvl + 1}`;
}

/* ═══════════════════════════════════════════════════════════
   §7  TEXT GENERATION
═══════════════════════════════════════════════════════════ */
function generateText() {
  const { mode, customCount, customText, usePunct, useNums, adaptiveOverride, diff, duration } = S;
  const eff = adaptiveOverride || diff;
  // BUG-04: Ensure we always generate enough text for the full duration.
  // Assume up to 120 WPM with a 30% safety buffer so the test never ends early.
  const minWords = Math.ceil((120 / 60) * duration * 1.3);

  if (mode === 'custom' && customText.trim()) return customText.trim();

  if (mode === 'punctuation') {
    // BUG-04/20: Repeat PUNCT_LINES until we have enough words
    let result = '';
    while (result.split(' ').length < minWords) {
      result += (result ? ' ' : '') + shuffle([...PUNCT_LINES]).join(' ');
    }
    return result.trim();
  }

  if (mode === 'numbers') {
    const pool = WORDS.medium;
    const out  = [];
    const n    = Math.max(customCount, minWords);
    for (let i = 0; i < n; i++) {
      if (Math.random() < 0.35) {
        const t = Math.floor(Math.random() * 4);
        if (t === 0) out.push(String(rndInt(1, 9999)));
        else if (t === 1) out.push(`${rndInt(1,99)} + ${rndInt(1,99)}`);
        else if (t === 2) out.push(`${rndInt(10,99)} - ${rndInt(1,9)}`);
        else              out.push(`${rndInt(2,12)} * ${rndInt(2,12)}`);
      } else {
        out.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    }
    return out.join(' ');
  }

  if (mode === 'sentences') {
    // BUG-20: Repeat/cycle sentences until we have enough words
    const pool = SENTENCES[eff] || SENTENCES.medium;
    let result = '';
    let shuffled = shuffle([...pool]);
    let si = 0;
    while (result.split(' ').length < minWords) {
      if (si >= shuffled.length) { shuffled = shuffle([...pool]); si = 0; }
      result += (result ? ' ' : '') + shuffled[si++];
    }
    return result.trim();
  }

  if (mode === 'code') {
    // BUG-21: Concatenate snippets (avoiding back-to-back repeats) until long enough
    let result = '';
    let lastIdx = -1;
    while (result.split(/\s+/).filter(Boolean).length < minWords) {
      let idx;
      do { idx = Math.floor(Math.random() * CODE_SNIPPETS.length); } while (idx === lastIdx && CODE_SNIPPETS.length > 1);
      lastIdx = idx;
      result += (result ? '\n' : '') + CODE_SNIPPETS[idx];
    }
    return result;
  }

  // Words mode
  const pool = eff === 'easy' ? WORDS.easy
             : eff === 'hard' ? WORDS.hard
             :                  WORDS.medium;

  const n = Math.max(customCount, minWords);
  const words = [];
  for (let i = 0; i < n; i++) {
    let w = pool[Math.floor(Math.random() * pool.length)];
    if (useNums  && Math.random() < 0.08) w = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    // BUG-22: use the full PUNCTUATION array (was incorrectly capped at 4)
    if (usePunct && i > 0 && Math.random() < 0.18) {
      words[words.length - 1] += PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
    }
    words.push(w);
  }
  return words.join(' ');
}

function rndInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

// Bug 7: Show active modifier flags in config bar
function updateModeFlags() {
  const c = document.getElementById('cfgFlags');
  if (!c) return;
  c.innerHTML = '';
  if (S.usePunct) {
    const b = document.createElement('span');
    b.className = 'mode-flag'; b.textContent = '• Punct ON';
    c.appendChild(b);
  }
  if (S.useNums) {
    const b = document.createElement('span');
    b.className = 'mode-flag'; b.textContent = '123 ON';
    c.appendChild(b);
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ═══════════════════════════════════════════════════════════
   §8  ARENA RENDERING (dual-layer overlay)
═══════════════════════════════════════════════════════════ */
function renderArena() {
  D.wordsTarget.innerHTML = '';
  D.wordsTyped.innerHTML  = '';
  D.wordsWrap.style.fontSize = S.fontSize + 'px';

  S.text.split('').forEach((ch, i) => {
    const span    = document.createElement('span');
    span.dataset.ti = i;
    span.className  = 'tg tg-u';
    span.textContent = ch;
    D.wordsTarget.appendChild(span);
  });
}

function renderChar(idx, state) {
  const tg = D.wordsTarget.querySelector(`[data-ti="${idx}"]`);
  if (tg) tg.className = `tg tg-${state === 'u' ? 'u' : 'a'}`;

  let ty = D.wordsTyped.querySelector(`[data-li="${idx}"]`);
  if (state === 'u') { if (ty) ty.remove(); return; }

  if (!ty) {
    ty = document.createElement('span');
    ty.dataset.li = idx;
    D.wordsTyped.appendChild(ty);
    reorderTyped();
  }
  const ch = S.text[idx] || '';
  ty.className  = `lt lt-${state}`;
  ty.textContent = ch === ' ' ? '\u00A0' : ch;
}

function reorderTyped() {
  const spans = [...D.wordsTyped.querySelectorAll('[data-li]')];
  spans.sort((a, b) => +a.dataset.li - +b.dataset.li)
       .forEach(s => D.wordsTyped.appendChild(s));
}

function updateProgress() {
  const pct = S.text.length ? Math.min(100, (S.charIdx / S.text.length) * 100) : 0;
  if (D.arenaFill) D.arenaFill.style.width = pct + '%';
}

/* ═══════════════════════════════════════════════════════════
   §9  CURSOR POSITIONING
═══════════════════════════════════════════════════════════ */
function positionLiveCursor() {
  if (S.finished) return;                         // Bug 4 guard
  const wrap = D.wordsWrap, cursor = D.liveCursor;
  if (!wrap || !cursor) return;

  const tgEl = D.wordsTarget.querySelector(`[data-ti="${S.charIdx}"]`)
            || D.wordsTarget.querySelector(`[data-ti="${S.charIdx - 1}"]`);
  if (!tgEl) { cursor.style.opacity = '0'; return; }

  cursor.style.opacity = '1';
  const wR = wrap.getBoundingClientRect();
  const eR = tgEl.getBoundingClientRect();

  // ── Arena text scrolling ────────────────────────────────
  // eR positions are visual (after current CSS transform).
  // naturalTop = visual position + current scroll offset
  const lineH  = parseFloat(getComputedStyle(wrap).lineHeight) || S.fontSize * 1.85;
  const visualTopEl = eR.top - wR.top;
  const naturalTop  = visualTopEl + S.arenaScroll;

  // Keep cursor on row 2 (lineH px from top); scroll triggers when moving to row 3+
  // BUG-05: Use Math.floor (not Math.round) to prevent oscillation at line boundaries
  const targetScroll = Math.max(0, Math.floor((naturalTop - lineH) / lineH) * lineH);

  if (targetScroll !== S.arenaScroll) {
    S.arenaScroll = targetScroll;
    const tx = `translateY(-${S.arenaScroll}px)`;
    if (D.wordsTarget) D.wordsTarget.style.transform = tx;
    if (D.wordsTyped)  D.wordsTyped.style.transform  = tx;
  }

  // Cursor position uses natural coordinates relative to wrap
  let left = eR.left - wR.left;
  if (S.charIdx > 0 && !D.wordsTarget.querySelector(`[data-ti="${S.charIdx}"]`)) {
    const prev = D.wordsTarget.querySelector(`[data-ti="${S.charIdx - 1}"]`);
    if (prev) left = prev.getBoundingClientRect().right - wR.left;
  }

  cursor.style.left   = `${left}px`;
  cursor.style.top    = `${naturalTop - S.arenaScroll}px`;
  cursor.style.height = `${eR.height || S.fontSize * 1.4}px`;
}

function positionGhostCursor(charIdx) {
  const gc = D.ghostCursor;
  if (!gc) return;
  if (charIdx < 0 || charIdx >= S.text.length) { gc.hidden = true; return; }

  const tgEl = D.wordsTarget.querySelector(`[data-ti="${charIdx}"]`);
  if (!tgEl) { gc.hidden = true; return; }

  gc.hidden = false;
  const wR = D.wordsWrap.getBoundingClientRect();
  const eR = tgEl.getBoundingClientRect();

  // BUG-06: eR.top is already the visual (post-transform) position.
  // Do NOT add S.arenaScroll — that would push the ghost below the visible area.
  gc.style.left   = `${eR.left - wR.left}px`;
  gc.style.top    = `${eR.top  - wR.top}px`;
  gc.style.height = `${eR.height || S.fontSize * 1.4}px`;
}

/* ═══════════════════════════════════════════════════════════
   §10  GHOST RACE ENGINE
═══════════════════════════════════════════════════════════
   charTimes[i] = milliseconds after test start when char i was typed.
   During replay: ghost pos = max index where charTimes[i] <= elapsed.
   Ghost record is saved per mode+diff+duration key, only if new WPM > saved.
═══════════════════════════════════════════════════════════ */
function ghostKey() {
  return `tt_ghost_${S.mode}_${S.adaptiveOverride || S.diff}_${S.duration}`;
}

function loadGhostRecord() {
  try {
    const r = JSON.parse(localStorage.getItem(ghostKey()) || 'null');
    S.ghostRecord = r;
    return r;
  } catch { S.ghostRecord = null; return null; }
}

function saveGhostRecord(wpm, acc) {
  const existing = loadGhostRecord();
  if (existing && existing.wpm >= wpm) return false; // not better

  const rec = {
    charTimes: [...S.charTimes],
    wpm, acc,
    mode: S.mode,
    diff: S.adaptiveOverride || S.diff,
    duration: S.duration,
    date: new Date().toISOString(),
  };
  localStorage.setItem(ghostKey(), JSON.stringify(rec));
  S.ghostRecord = rec;
  return true;
}

function clearGhostRecord() {
  localStorage.removeItem(ghostKey());
  S.ghostRecord = null;
}

function startGhostAnimation() {
  if (!S.ghostRecord || !S.isPro) return;
  D.ghostCursor.hidden = false;
  D.hcGhost.hidden     = false;
  D.ghostBar.hidden    = false;
  D.ghostRecordWpm.textContent = S.ghostRecord.wpm + ' WPM';
  tickGhost();
}

function tickGhost() {
  if (!S.started || S.finished || !S.ghostEnabled || !S.ghostRecord) return;
  if (!S.isPro) return;

  if (!S.paused) {
    const elapsed = performance.now() - S.startTime;
    const times   = S.ghostRecord.charTimes;
    let pos = 0;
    while (pos < times.length && times[pos] <= elapsed) pos++;

    positionGhostCursor(pos);

    const ghostWpm = pos > 0
      ? Math.round((pos / 5) / (elapsed / 60000))
      : 0;
    if (D.ghostWpmVal) D.ghostWpmVal.textContent = ghostWpm || '—';
    if (D.ghostVsLabel) D.ghostVsLabel.innerHTML = `You: <b>${calcLiveWPM() || '—'}</b>`;

    if (pos >= S.text.length) { D.ghostCursor.hidden = true; return; }
  }

  S.ghostRafId = requestAnimationFrame(tickGhost);
}

function stopGhost() {
  cancelAnimationFrame(S.ghostRafId);
  if (D.ghostCursor) D.ghostCursor.hidden = true;
  if (D.hcGhost)     D.hcGhost.hidden     = true;
  if (D.ghostBar)    D.ghostBar.hidden    = true;
}

function showGhostResult(myWpm) {
  if (!S.ghostRecord) return;
  const ghostWpm = S.ghostRecord.wpm;
  const beat = myWpm > ghostWpm;
  const tie  = myWpm === ghostWpm;

  D.ghostResult.hidden    = false;
  D.grVerdict.textContent = beat ? '🏆 You beat the ghost!'
                          : tie  ? '🤝 Dead heat — it\'s a tie!'
                                 : '👻 Ghost wins this round.';
  D.grDetail.textContent  = `Ghost: ${ghostWpm} WPM  ·  You: ${myWpm} WPM`;
  D.grVerdict.style.color = beat ? 'var(--ok)' : tie ? 'var(--warn)' : 'var(--err)';

  if (beat) addResBadge('👻 Ghost Slayer', 'ghost-win');
}

function renderGhostModal() {
  const rec = loadGhostRecord();

  if (!S.isPro) {
    D.ghostBody.innerHTML = `
      <div style="text-align:center;padding:1.5rem">
        <div style="font-size:3rem;margin-bottom:.75rem">👻</div>
        <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;margin-bottom:.5rem">Ghost Races</div>
        <div style="font-size:.87rem;color:var(--text-m);line-height:1.7;margin-bottom:1.25rem">
          Race against your personal best in real time.<br>Ghost races require <b>TalionType Pro</b>.
        </div>
        <button class="ctrl-btn accent" id="ghostProBtn" style="margin:0 auto">⚡ Upgrade to Pro — $5</button>
      </div>`;
    document.getElementById('ghostProBtn')
      ?.addEventListener('click', () => { closeModal(D.ghostOv); openModal(D.proOv); });
    return;
  }

  if (!rec) {
    D.ghostBody.innerHTML = `
      <div style="padding:1rem">
        <div style="font-size:.9rem;color:var(--text-m);line-height:1.7;margin-bottom:1rem">
          No ghost record saved for <b>${S.mode} / ${S.adaptiveOverride || S.diff} / ${S.duration}s</b>.<br>
          Complete a test and click <b>Set as Ghost</b> in the results to save your run.
        </div>
        <div style="font-size:.8rem;color:var(--text-f)">Enable the Ghost Race toggle in the mode bar to race once you have a record.</div>
      </div>`;
    return;
  }

  D.ghostBody.innerHTML = `
    <div class="ghost-record">
      <div class="gr-head">
        <div>
          <div class="gr-wpm">${rec.wpm} WPM</div>
          <div class="gr-meta">${rec.acc}% accuracy · ${rec.mode} / ${rec.diff} · ${rec.duration}s</div>
          <div style="font-size:.72rem;color:var(--text-f);margin-top:.3rem">Saved: ${new Date(rec.date).toLocaleDateString()}</div>
        </div>
        <button class="ctrl-btn danger small" id="btnClearGhost">Clear Ghost</button>
      </div>
    </div>
    <div style="font-size:.84rem;color:var(--text-m);line-height:1.7;margin-top:.75rem">
      Toggle <b>Ghost Race</b> in the mode bar and start a test with the same settings to race this ghost.
      Your ghost cursor appears in purple — try to stay ahead!
    </div>`;

  document.getElementById('btnClearGhost')?.addEventListener('click', () => {
    clearGhostRecord();
    showToast('Ghost cleared');
    renderGhostModal();
  });
}

/* ═══════════════════════════════════════════════════════════
   §11  ADAPTIVE DIFFICULTY
═══════════════════════════════════════════════════════════ */
function runAdaptiveCheck() {
  if (S.diff !== 'adaptive') { S.adaptiveOverride = null; return; }

  const recent = S.history.slice(-5).map(r => r.wpm);
  if (recent.length < 2) { S.adaptiveOverride = 'medium'; return; }

  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const suggested = avg < ADAPT_THRESHOLDS.easy   ? 'easy'
                  : avg < ADAPT_THRESHOLDS.medium  ? 'medium'
                  :                                  'hard';

  if (suggested === S.adaptiveOverride) return;
  S.adaptiveOverride = suggested;

  const labels = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  if (D.adaptMsg) D.adaptMsg.textContent =
    `Adaptive → ${labels[suggested]} (avg ${Math.round(avg)} WPM over last ${recent.length} tests)`;
  if (D.adaptToast) { D.adaptToast.hidden = false; setTimeout(() => { D.adaptToast.hidden = true; }, 5500); }
}

/* ═══════════════════════════════════════════════════════════
   §12  TIMER ENGINE
═══════════════════════════════════════════════════════════ */
let _timerInt = null, _sampleInt = null, _hudInt = null;

function startTimer() {
  if (S.timerActive) return;
  S.timerActive = true;
  S.startTime   = performance.now();
  gaEvent('test_start', { mode: S.mode, diff: S.diff, duration: S.duration });

  if (S.ghostEnabled && S.ghostRecord && S.isPro) startGhostAnimation();

  // BUG-23: Compensate for setInterval drift by computing timeLeft from wall-clock
  const _timerStart = performance.now();
  const _totalDuration = S.duration;
  _timerInt = setInterval(() => {
    if (S.paused) return;
    const elapsed = (performance.now() - _timerStart - S._totalPausedMs) / 1000;
    S.timeLeft = Math.max(0, _totalDuration - Math.floor(elapsed));
    if (D.timerVal) D.timerVal.textContent = S.timeLeft;
    if (D.hcTimer)  D.hcTimer.classList.toggle('urgent', S.timeLeft <= 10);
    if (S.timeLeft <= 0) finishTest();
  }, 200); // poll at 200ms for accuracy

  _sampleInt = setInterval(() => {
    if (S.paused || !S.timerActive) return;
    S.wpmSamples.push({ t: S.duration - S.timeLeft, wpm: calcLiveWPM() });
  }, 2000);

  _hudInt = setInterval(() => { if (!S.paused) updateHUD(); }, 300);
}

function stopTimer() {
  clearInterval(_timerInt);
  clearInterval(_sampleInt);
  clearInterval(_hudInt);
  S.timerActive = false;
}

/* ═══════════════════════════════════════════════════════════
   §13  METRIC CALCULATIONS
═══════════════════════════════════════════════════════════ */
function elapsedMin()    { return Math.max(0.0001, (performance.now() - S.startTime) / 60000); }
function calcLiveWPM()   { return Math.round(S.correctChars / 5 / elapsedMin()); }
function calcRawWPM()    { return Math.round(S.totalTyped   / 5 / elapsedMin()); }
function calcAccuracy()  { return S.totalTyped ? Math.round((S.correctChars / S.totalTyped) * 100) : 100; }

function calcConsistency() {
  const w = S.wpmSamples.map(s => s.wpm).filter(x => x > 0);
  if (w.length < 3) return 100;
  const avg = w.reduce((a, b) => a + b) / w.length;
  if (avg === 0) return 0; // BUG-19: prevent NaN from division-by-zero
  const sd  = Math.sqrt(w.reduce((s, v) => s + (v - avg) ** 2, 0) / w.length);
  return Math.round(Math.max(0, Math.min(100, (1 - sd / avg) * 100)));
}

/* ═══════════════════════════════════════════════════════════
   §14  ANTI-CHEAT
═══════════════════════════════════════════════════════════ */
const AC = {
  ts: [],
  record(t) {
    this.ts.push(t);
    // Bug 19: sliding window — keep only last 2 seconds
    const cutoff = t - 2000;
    while (this.ts.length && this.ts[0] < cutoff) this.ts.shift();
  },
  reset()   { this.ts = []; },
  check(wpm, acc) {
    if (wpm > 350) return { ok: false, why: 'WPM exceeds physical limit (350)' };

    // Bug 6a: Tighter burst — >10 keypresses in 200ms is inhuman
    const burst = this.ts.filter(t => t > performance.now() - 200).length;
    if (burst > 10) return { ok: false, why: 'Input burst detected' };

    // BUG-10: Raised from 250 to 350 — world records exceed 250 WPM legitimately
    if (wpm > 350 && acc >= 99) return { ok: false, why: 'Suspicious score' };
    if (wpm > 180 && acc === 100 && S.duration <= 30) return { ok: false, why: 'Suspicious score' };

    // Bug 6c: Average chars-per-second via S.charTimes
    const times = S.charTimes.filter(t => t != null);
    if (times.length > 5) {
      const totalMs = times[times.length - 1] - times[0];
      const avgMs   = totalMs / (times.length - 1);
      if (avgMs < 60) return { ok: false, why: 'Typing interval too fast' };
    }

    return { ok: true };
  },
};

/* ═══════════════════════════════════════════════════════════
   §15  INPUT HANDLER
═══════════════════════════════════════════════════════════ */
function handleInput() {
  if (S.finished || S.paused) return;
  const val = D.ghostInput.value;

  if (!S.started) {
    S.started = true;
    if (D.btnPause)   D.btnPause.disabled = false;
    if (D.arenaHint)  D.arenaHint.style.opacity = '0';
    startTimer();
  }

  const now  = performance.now();
  AC.record(now);

  const nLen = val.length;
  const pLen = S.charIdx;

  if (nLen > pLen) {
    const typedCh    = val[nLen - 1];
    const expectedCh = S.text[S.charIdx];
    S.totalTyped++;

    // Record char timestamp for ghost
    S.charTimes[S.charIdx] = now - S.startTime;

    const correct = typedCh === expectedCh;
    if (correct) {
      renderChar(S.charIdx, 'c');
      S.correctChars++;
      S.curStreak++;
      if (S.curStreak > S.bestStreak) S.bestStreak = S.curStreak;
      playSound('c');
    } else {
      renderChar(S.charIdx, 'e');
      S.errMap[S.charIdx] = { ex: expectedCh, got: typedCh };
      S.curStreak = 0;
      playSound('e');
    }

    // Track key presses & errors
    const k = (typedCh || '').toLowerCase();
    S.keyPresses[k] = (S.keyPresses[k] || 0) + 1;
    if (!correct) S.keyErr[k] = (S.keyErr[k] || 0) + 1;

    S.charIdx++;

  } else if (nLen < pLen) {
    if (S.charIdx > 0) {
      S.charIdx--;
      const wasErr = !!S.errMap[S.charIdx];
      if (!wasErr) S.correctChars = Math.max(0, S.correctChars - 1);
      S.totalTyped = Math.max(0, S.totalTyped - 1); // Bug 17: un-count deleted char
      delete S.errMap[S.charIdx];
      renderChar(S.charIdx, 'u');
      D.ghostInput.value = D.ghostInput.value.substring(0, S.charIdx);
    }
  }

  S.typed = D.ghostInput.value;
  requestAnimationFrame(positionLiveCursor);
  updateProgress();

  if (S.charIdx >= S.text.length) finishTest();
}

function handleKeyDown(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    if (!S.started || S.finished) initTest();
  }
}

/* ═══════════════════════════════════════════════════════════
   §16  LIVE HUD
═══════════════════════════════════════════════════════════ */
function updateHUD() {
  if (D.wpmVal)    D.wpmVal.textContent    = (S.showLiveWpm && S.started) ? calcLiveWPM() : '—';
  if (D.accVal)    D.accVal.textContent    = S.started ? calcAccuracy() + '%' : '—';
  if (D.streakVal) D.streakVal.textContent = S.curStreak;
}

/* ═══════════════════════════════════════════════════════════
   §17  FINISH TEST & RESULTS
═══════════════════════════════════════════════════════════ */
function finishTest() {
  if (S.finished) return;
  S.finished = true;
  stopTimer();
  stopGhost();

  const wpm  = calcLiveWPM();
  const raw  = calcRawWPM();
  const acc  = calcAccuracy();
  const cons = calcConsistency();
  const errs = Object.keys(S.errMap).length;

  // Anti-cheat check
  const chk = AC.check(wpm, acc);
  if (!chk.ok) showToast(`⚠ ${chk.why} — score flagged.`);

  // Level update (WPM-based, only if new best)
  const prevBest  = S.bestWpm;
  const prevLevel = currentLevel();
  const isNewBest = wpm > prevBest && chk.ok;
  if (isNewBest) S.bestWpm = wpm;
  const newLevel = currentLevel();

  // Build result
  const result = {
    wpm, raw, acc, cons, errors: errs,
    mode: S.mode, diff: S.adaptiveOverride || S.diff,
    duration: S.duration, streak: S.bestStreak,
    date: new Date().toISOString(), flagged: !chk.ok, isNewBest,
  };
  S.lastResult = result;
  saveHistory(result);
  persistProfile();
  refreshLevelUI();

  // Ghost race result
  if (S.ghostEnabled && S.ghostRecord && S.isPro) showGhostResult(wpm);

  // Achievements
  checkAchievements(result);

  // Daily completion
  if (S.isDailyActive) checkDailyCompletion(result);

  // Auto-save ghost if new personal best
  if (isNewBest) {
    const saved = saveGhostRecord(wpm, acc);
    if (saved) D.btnSetGhost && (D.btnSetGhost.textContent = '✓ Ghost Saved');
  }

  // Fill results panel
  if (D.resWpmBig)  D.resWpmBig.textContent  = wpm;
  if (D.resWpm)     D.resWpm.textContent     = wpm;
  if (D.resRaw)     D.resRaw.textContent     = raw;
  if (D.resAcc)     D.resAcc.textContent     = acc + '%';
  if (D.resErrors)  D.resErrors.textContent  = errs;
  if (D.resCons)    D.resCons.textContent    = cons + '%';
  if (D.resStreak)  D.resStreak.textContent  = S.bestStreak;
  if (D.resWpmNote) D.resWpmNote.textContent = isNewBest ? '🏆 Personal Best!' : `Best: ${prevBest} WPM`;

  if (isNewBest)              addResBadge('🏆 New PB', '');
  if (newLevel > prevLevel)   { D.lvlUpBadge && (D.lvlUpBadge.hidden = false); addResBadge(`⬆ Level ${newLevel}`, 'new'); runConfetti(); }
  else if (D.lvlUpBadge)      D.lvlUpBadge.hidden = true;

  if (D.resultsPanel) D.resultsPanel.hidden = false;
  if (D.ghostInput)   D.ghostInput.disabled = true;
  if (D.liveCursor)   D.liveCursor.style.opacity = '0';   // Bug 4: hide cursor after test
  // Show results ad
  const adR = document.getElementById('adResults');
  if (adR) adR.hidden = false;

  requestAnimationFrame(() => {
    renderWPMChart(S.wpmSamples, 'wpmChart');
    renderErrors();
    renderHeatmap();
  });

  D.resultsPanel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  gaEvent('test_complete', { wpm, acc, mode: S.mode, diff: S.diff, isNewBest });
}

function addResBadge(text, cls) {
  if (!D.resBadges) return;
  const b = document.createElement('span');
  b.className  = `rbadge ${cls}`;
  b.textContent = text;
  D.resBadges.appendChild(b);
}

/* ═══════════════════════════════════════════════════════════
   §18  INIT / RESET
═══════════════════════════════════════════════════════════ */
function initTest(isDaily = false) {
  stopTimer();
  stopGhost();
  AC.reset();

  S.typed = ''; S.charIdx = 0; S.started = false; S.finished = false;
  S.paused = false; S.timerActive = false; S.timeLeft = S.duration;
  S.startTime = null; S.pauseStart = null;
  S.errMap = {}; S.keyErr = {}; S.keyPresses = {};
  S.wpmSamples = []; S.charTimes = [];
  S.correctChars = 0; S.totalTyped = 0;
  S.curStreak = 0; S.bestStreak = 0;
  S.arenaScroll = 0;
  S._totalPausedMs = 0;
  // Reset text layer scroll
  if (D.wordsTarget) D.wordsTarget.style.transform = '';
  if (D.wordsTyped)  D.wordsTyped.style.transform  = '';
  S.isDailyActive = isDaily;

  runAdaptiveCheck();
  S.text = (isDaily && S.dailyChallenge?.text) ? S.dailyChallenge.text : generateText();

  // Reset UI
  if (D.timerVal)     D.timerVal.textContent    = S.duration;
  if (D.wpmVal)       D.wpmVal.textContent      = '—';
  if (D.accVal)       D.accVal.textContent      = '—';
  if (D.streakVal)    D.streakVal.textContent   = '0';
  if (D.btnPause)     D.btnPause.disabled       = true;
  if (D.pauseLbl)     D.pauseLbl.textContent    = 'Pause';
  if (D.resultsPanel) D.resultsPanel.hidden     = true;
  const adR = document.getElementById('adResults');
  if (adR) adR.hidden = true;
  if (D.resBadges)    D.resBadges.innerHTML     = '';
  if (D.ghostResult)  D.ghostResult.hidden      = true;
  if (D.ghostInput)   { D.ghostInput.disabled   = false; D.ghostInput.value = ''; }
  if (D.hcTimer)      D.hcTimer.classList.remove('urgent');
  if (D.pausedOv)     D.pausedOv.hidden         = true;
  if (D.arenaHint)    D.arenaHint.style.opacity = '1';
  if (D.arenaFill)    D.arenaFill.style.width   = '0%';
  if (D.ghostCursor)  D.ghostCursor.hidden      = true;
  if (D.hcGhost)      D.hcGhost.hidden          = true;
  if (D.ghostBar)     D.ghostBar.hidden         = true;
  if (D.btnSetGhost)  D.btnSetGhost.textContent = 'Set as Ghost';

  if (D.wordsWrap) D.wordsWrap.style.fontSize = S.fontSize + 'px';
  if (D.arena)     D.arena.classList.toggle('smooth-caret', S.smoothCaret);

  if (S.ghostEnabled) loadGhostRecord();

  renderArena();
  requestAnimationFrame(positionLiveCursor);
  updateModeFlags(); // Bug 7: update modifier indicators

  // BUG-09: Always focus ghostInput regardless of screen width
  D.ghostInput?.focus();
}

/* ═══════════════════════════════════════════════════════════
   §19  PAUSE / RESUME
═══════════════════════════════════════════════════════════ */
function togglePause() {
  if (!S.started || S.finished) return;
  S.paused = !S.paused;
  if (S.paused) {
    S.pauseStart = performance.now();
    if (D.ghostInput)  D.ghostInput.disabled  = true;
    if (D.pausedOv)    D.pausedOv.hidden      = false;
    if (D.pauseLbl)    D.pauseLbl.textContent = 'Resume';
  } else {
    const pausedMs = performance.now() - S.pauseStart;
    S._totalPausedMs = (S._totalPausedMs || 0) + pausedMs;
    S.startTime += pausedMs;
    if (D.ghostInput)  D.ghostInput.disabled  = false;
    if (D.pausedOv)    D.pausedOv.hidden      = true;
    if (D.pauseLbl)    D.pauseLbl.textContent = 'Pause';
    D.ghostInput?.focus();
  }
}

/* ═══════════════════════════════════════════════════════════
   §20  WPM CANVAS CHART
═══════════════════════════════════════════════════════════ */
function renderWPMChart(samples, canvasId) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const dpr = window.devicePixelRatio || 1;
  const cw  = cv.parentElement?.clientWidth || 700;
  const ch  = 200;
  cv.width  = cw * dpr; cv.height = ch * dpr;
  cv.style.width = cw + 'px'; cv.style.height = ch + 'px';

  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cw, ch);

  const C = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const acc  = C('--acc');
  const tf   = C('--text-f');
  const bd   = C('--border-s');

  if (!samples || samples.length < 2) {
    ctx.fillStyle = tf; ctx.font = '13px Outfit,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Complete a longer test to see the WPM graph', cw / 2, ch / 2);
    return;
  }

  const pad  = { t: 20, r: 20, b: 30, l: 50 };
  const gw   = cw - pad.l - pad.r;
  const gh   = ch - pad.t - pad.b;
  const maxW = Math.max(...samples.map(s => s.wpm), 10);
  const maxT = Math.max(...samples.map(s => s.t),   1);
  const px   = t => pad.l + (t / maxT) * gw;
  const py   = w => pad.t + gh - (w / maxW) * gh;

  // Grid
  [0.25, 0.5, 0.75, 1].forEach(p => {
    const y = pad.t + gh * (1 - p);
    ctx.strokeStyle = bd; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + gw, y); ctx.stroke();
    ctx.fillStyle = tf; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxW * p), pad.l - 6, y + 4);
  });

  // Gradient fill
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + gh);
  grad.addColorStop(0, acc + '44'); grad.addColorStop(1, acc + '00');
  ctx.beginPath();
  ctx.moveTo(px(samples[0].t), pad.t + gh);
  samples.forEach(s => ctx.lineTo(px(s.t), py(s.wpm)));
  ctx.lineTo(px(samples[samples.length - 1].t), pad.t + gh);
  ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

  // Line
  ctx.beginPath(); ctx.strokeStyle = acc; ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  samples.forEach((s, i) => i === 0 ? ctx.moveTo(px(s.t), py(s.wpm)) : ctx.lineTo(px(s.t), py(s.wpm)));
  ctx.stroke();

  // Dots
  samples.forEach(s => {
    ctx.beginPath(); ctx.arc(px(s.t), py(s.wpm), 4, 0, Math.PI * 2);
    ctx.fillStyle   = acc; ctx.fill();
    ctx.strokeStyle = C('--bg-card'); ctx.lineWidth = 1.5; ctx.stroke();
  });
}

/* ═══════════════════════════════════════════════════════════
   §21  ERROR BREAKDOWN
═══════════════════════════════════════════════════════════ */
function renderErrors() {
  if (!D.errChips) return;
  D.errChips.innerHTML = '';
  const errs = Object.entries(S.keyErr).sort((a, b) => b[1] - a[1]);
  if (!errs.length) { D.errChips.innerHTML = '<span class="enone">✓ Perfect — no errors!</span>'; return; }
  errs.forEach(([k, n]) => {
    const c = document.createElement('span');
    c.className   = 'echip';
    c.innerHTML   = `<span class="ek">${esc(k || '?')}</span><span class="ec">×${n}</span>`;
    D.errChips.appendChild(c);
  });
}

/* ═══════════════════════════════════════════════════════════
   §22  KEY HEATMAP
═══════════════════════════════════════════════════════════ */
const KB_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
];

function renderHeatmap() {
  if (!D.heatmapWrap) return;
  D.heatmapWrap.innerHTML = '';
  const maxP = Math.max(...Object.values(S.keyPresses), 1);

  KB_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kbd-row';
    row.forEach(k => {
      const el = document.createElement('div');
      el.className = 'kkey';
      el.textContent = k.toUpperCase();
      const p = S.keyPresses[k] || 0;
      const e = S.keyErr[k]     || 0;
      if (p > 0) {
        const errRate = e / p;
        if (errRate > 0.4)        el.classList.add('he');
        else if (p / maxP > 0.6) el.classList.add('h3');
        else if (p / maxP > 0.3) el.classList.add('h2');
        else                      el.classList.add('h1');
        el.title = `${k.toUpperCase()}: ${p} presses, ${e} errors`;
      }
      rowEl.appendChild(el);
    });
    D.heatmapWrap.appendChild(rowEl);
  });

  const spaceRow = document.createElement('div');
  spaceRow.className = 'kbd-row';
  const spaceKey = document.createElement('div');
  spaceKey.className = 'kkey space'; spaceKey.textContent = 'SPACE';
  if ((S.keyPresses[' '] || 0) > 0) spaceKey.classList.add('h1');
  spaceRow.appendChild(spaceKey);
  D.heatmapWrap.appendChild(spaceRow);
}

/* ═══════════════════════════════════════════════════════════
   §23  CONFETTI
═══════════════════════════════════════════════════════════ */
function runConfetti() {
  const cv = D.confettiCv;
  if (!cv) return;
  cv.width  = cv.offsetWidth  || 800;
  cv.height = cv.offsetHeight || 400;
  const ctx  = cv.getContext('2d');
  const cols = ['#00D9B0', '#FF6935', '#FFD700', '#FF4050', '#B57BFF', '#4DB8FF'];
  const pieces = Array.from({ length: 100 }, () => ({
    x: Math.random() * cv.width,  y: Math.random() * -cv.height,
    w: rndInt(4, 10),             h: rndInt(6, 16),
    vx: (Math.random() - 0.5) * 3, vy: Math.random() * 4 + 2,
    col: cols[Math.floor(Math.random() * cols.length)],
    rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.2,
  }));
  let frame = 0;
  function tick() {
    if (frame++ > 180) { ctx.clearRect(0, 0, cv.width, cv.height); return; }
    ctx.clearRect(0, 0, cv.width, cv.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════════════════════
   §24  LOCAL LEADERBOARD
═══════════════════════════════════════════════════════════ */
const LS_LB = 'tt_lb_local';

function getLocalLB() {
  try { return JSON.parse(localStorage.getItem(LS_LB) || '[]'); } catch { return []; }
}

function saveLocalScore(name, r) {
  const lb = getLocalLB();
  lb.push({ name, wpm: r.wpm, acc: r.acc, mode: r.mode, diff: r.diff,
            duration: r.duration, level: currentLevel(), date: new Date().toISOString() });
  // Sort by tie-break: wpm DESC → acc DESC → timestamp ASC (earlier = better)
  lb.sort((a, b) => b.wpm - a.wpm || b.acc - a.acc
    || new Date(a.date) - new Date(b.date));
  localStorage.setItem(LS_LB, JSON.stringify(lb.slice(0, 100)));
}

function renderLocalLB(filters = {}) {
  let lb = getLocalLB();
  if (filters.mode)     lb = lb.filter(r => r.mode === filters.mode);
  if (filters.diff)     lb = lb.filter(r => r.diff === filters.diff);
  if (filters.duration) lb = lb.filter(r => String(r.duration) === String(filters.duration));

  if (!lb.length) {
    D.lbBody.innerHTML = '<div class="lb-empty">No local scores match these filters.</div>';
    return;
  }
  D.lbBody.innerHTML = buildLBTable(lb.slice(0, 50).map((r, i) => ({
    rank: i + 1, name: r.name || 'Anonymous',
    wpm: r.wpm, acc: r.acc + '%',
    extra: `Lvl ${r.level || '—'}`,
    date: new Date(r.date).toLocaleDateString(), uid: null,
  })));
}

/* ═══════════════════════════════════════════════════════════
   §25  FIREBASE LEADERBOARD
═══════════════════════════════════════════════════════════
   Collections: tt_lb_global  tt_lb_weekly  tt_lb_monthly
   Tie-breaker: wpm DESC → acc DESC → timestamp ASC (earlier beats later)
   Top-50 cap per collection.
═══════════════════════════════════════════════════════════ */
const FB_COL = { global: 'tt_lb_global', weekly: 'tt_lb_weekly', monthly: 'tt_lb_monthly' };

function initFirebase(cfg) {
  try {
    if (typeof firebase === 'undefined') {
      setFBStatus('Firebase SDK not loaded. Uncomment the three script tags in index.html.', false);
      return false;
    }
    const ex = firebase.apps.find(a => a.name === 'tt');
    S.fbApp  = ex || firebase.initializeApp(cfg, 'tt');
    S.fbDB   = firebase.firestore(S.fbApp);
    S.fbAuth = firebase.auth(S.fbApp);
    S.fbAuth.onAuthStateChanged(u => { S.currentUser = u; updateAuthUI(); });
    S.fbReady = true;
    setFBStatus('Connected ✓', true);
    localStorage.setItem('tt_fb_cfg', JSON.stringify(cfg));
    return true;
  } catch (e) { setFBStatus('Error: ' + e.message, false); return false; }
}

function setFBStatus(msg, ok) {
  if (D.fbStatus) { D.fbStatus.textContent = msg; D.fbStatus.className = 'fb-status ' + (ok ? 'ok' : 'err'); }
  if (D.lbNote)   D.lbNote.textContent = ok && S.currentUser ? '' : ok ? 'Sign in to post globally.' : 'Sign in to post to the global leaderboard.';
}

function getWeekKey() {
  const n = new Date(), d = (n.getDay() + 6) % 7, m = new Date(n);
  m.setDate(n.getDate() - d);
  return `${m.getFullYear()}-${m.getMonth() + 1}-${m.getDate()}`;
}
function getMonthKey() {
  const n = new Date();
  return `${n.getFullYear()}-${n.getMonth() + 1}`;
}

async function saveToFirestoreCol(colName, data) {
  if (!S.fbDB || !S.currentUser) return null;
  try {
    const col  = S.fbDB.collection(colName);
    // Ordered by tie-break: wpm DESC, acc DESC, timestamp ASC
    const snap = await col
      .orderBy('wpm',       'desc')
      .orderBy('acc',       'desc')
      .orderBy('timestamp', 'asc')
      .limit(LB_MAX).get();
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Check if current user already has an entry
    const myDoc = docs.find(d => d.uid === S.currentUser.uid);
    if (myDoc) {
      const better = data.wpm > myDoc.wpm
                  || (data.wpm === myDoc.wpm && data.acc > myDoc.acc);
      if (better) { await col.doc(myDoc.id).set(data); return myDoc.id; }
      return null; // not better
    }

    if (docs.length < LB_MAX) {
      const ref = await col.add(data); return ref.id;
    }

    // Replace lowest-ranked entry if new score beats it
    const lowest = docs[docs.length - 1];
    const beatsLowest = data.wpm > lowest.wpm
                     || (data.wpm === lowest.wpm && data.acc > lowest.acc);
    if (beatsLowest) {
      await col.doc(lowest.id).delete();
      const ref = await col.add(data); return ref.id;
    }
    return null;
  } catch (e) { console.error('Firestore write error:', e); return null; }
}

async function saveGlobalScore(name, r) {
  if (!S.fbDB || !S.currentUser) return;
  const uid  = S.currentUser.uid;
  const base = {
    uid, name, wpm: r.wpm, acc: r.acc, level: currentLevel(),
    mode: r.mode, diff: r.diff, duration: r.duration,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const [g, w, m] = await Promise.all([
    saveToFirestoreCol(FB_COL.global,  base),
    saveToFirestoreCol(FB_COL.weekly,  { ...base, weekKey:  getWeekKey()  }),
    saveToFirestoreCol(FB_COL.monthly, { ...base, monthKey: getMonthKey() }),
  ]);
  showToast((g || w || m) ? '✓ Score saved to global leaderboard!' : 'Score didn\'t make top 50.');
}

async function loadFirestoreLB(colName, filters = {}) {
  if (!S.fbDB) return null;
  try {
    let q = S.fbDB.collection(colName)
      .orderBy('wpm',       'desc')
      .orderBy('acc',       'desc')
      .orderBy('timestamp', 'asc');

    // Apply filters
    if (filters.weekKey)  q = q.where('weekKey',  '==', filters.weekKey);
    if (filters.monthKey) q = q.where('monthKey', '==', filters.monthKey);
    if (filters.mode)     q = q.where('mode',     '==', filters.mode);
    if (filters.diff)     q = q.where('diff',     '==', filters.diff);
    if (filters.duration) q = q.where('duration', '==', parseInt(filters.duration));

    const snap = await q.limit(LB_MAX).get();
    return snap.docs.map((d, i) => ({
      rank:  i + 1,
      uid:   d.data().uid,
      name:  d.data().name   || 'Anonymous',
      wpm:   d.data().wpm    || 0,
      acc:  (d.data().acc    || 0) + '%',
      extra: `Lvl ${d.data().level || '—'}`,
      date:  d.data().timestamp?.toDate ? d.data().timestamp.toDate().toLocaleDateString() : '',
    }));
  } catch (e) { console.error('Firestore read error:', e); return null; }
}

/* ═══════════════════════════════════════════════════════════
   §26  LEADERBOARD RENDERING & FILTERS
═══════════════════════════════════════════════════════════ */
function getLBFilters() {
  return {
    mode:     D.lbModeFilter?.value  || '',
    diff:     D.lbDiffFilter?.value  || '',
    duration: D.lbTimeFilter?.value  || '',
  };
}

async function renderLB(tab) {
  S.activeTab = tab;
  if (!D.lbBody) return;
  D.lbBody.innerHTML = '<div class="lb-load">Loading scores…</div>';

  const f = getLBFilters();

  if (tab === 'local') {
    renderLocalLB(f);
    if (D.lbPb) D.lbPb.hidden = true;
    return;
  }

  if (!S.fbReady) {
    D.lbBody.innerHTML = '<div class="lb-empty">Global leaderboard requires Firebase. Local scores available on the Local tab.</div>';
    return;
  }

  let filters = { ...f };
  if (tab === 'weekly')  filters.weekKey  = getWeekKey();
  if (tab === 'monthly') filters.monthKey = getMonthKey();

  const colName = FB_COL[tab] || FB_COL.global;
  const rows    = await loadFirestoreLB(colName, filters);

  if (!rows)        { D.lbBody.innerHTML = '<div class="lb-empty">Error loading. Check Firebase config.</div>'; return; }
  if (!rows.length) { D.lbBody.innerHTML = '<div class="lb-empty">No scores yet. Be the first!</div>'; return; }

  D.lbBody.innerHTML = buildLBTable(rows);

  // Personal best footer
  const best = getBestWPM();
  if (best > 0 && D.lbPb) {
    const myRow = rows.find(r => r.uid === S.currentUser?.uid);
    D.lbPb.hidden          = false;
    D.lbPbWpm.textContent  = `${best} WPM`;
    D.lbPbRank.textContent = myRow ? `Rank #${myRow.rank}` : 'Not in top 50';
  }
  gaEvent('view_leaderboard', { tab });
}

function buildLBTable(rows) {
  const rankCls = r => r.rank === 1 ? 'gold' : r.rank === 2 ? 'silver' : r.rank === 3 ? 'bronze' : '';
  const medal   = r => r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank;
  const rowCls  = r => {
    const isMe = S.currentUser && r.uid === S.currentUser.uid ? 'lb-me' : '';
    const top  = r.rank === 1 ? 'lb-top1' : r.rank === 2 ? 'lb-top2' : r.rank === 3 ? 'lb-top3' : '';
    return [isMe, top].filter(Boolean).join(' ');
  };
  const badge = r => r.wpm >= 150 ? '<span class="lb-badge fire">🔥</span>'
                   : r.wpm >= 100 ? '<span class="lb-badge">⚡</span>' : '';

  let html = `<table class="lb-table"><thead><tr>
    <th>#</th><th>Name</th><th>WPM</th><th>Acc</th><th>Level</th><th>Date</th>
  </tr></thead><tbody>`;
  rows.forEach(r => {
    html += `<tr class="${rowCls(r)}">
      <td class="lb-rank ${rankCls(r)}">${medal(r)}</td>
      <td class="lb-name">${esc(r.name)}${badge(r)}</td>
      <td class="lb-wpm">${r.wpm}</td>
      <td style="font-family:'JetBrains Mono',monospace;color:var(--text-m)">${r.acc}</td>
      <td style="color:var(--text-f)">${esc(r.extra || '—')}</td>
      <td style="color:var(--text-f);font-size:.75rem">${r.date || ''}</td>
    </tr>`;
  });
  return html + '</tbody></table>';
}

/* ═══════════════════════════════════════════════════════════
   §27  AUTH (Google + Email)
═══════════════════════════════════════════════════════════ */
function updateAuthUI() {
  const u = S.currentUser;
  const label = u ? (u.displayName || u.email?.split('@')[0] || 'Me') : 'Sign In';
  if (D.authBtnTxt)   D.authBtnTxt.textContent   = label;
  if (D.mmAuthBtnTxt) D.mmAuthBtnTxt.textContent  = label;
  if (D.authBtn)    D.authBtn.classList.toggle('in', !!u);
  if (D.mmAuthBtn)  D.mmAuthBtn.classList.toggle('in', !!u);
  if (D.lbNote)     D.lbNote.textContent = S.fbReady && u ? '' : S.fbReady ? 'Sign in to post globally.' : 'Sign in to post to the global leaderboard.';
}

async function doGoogleSignIn() {
  if (!S.fbAuth) { showToast('Connect Firebase first'); return; }
  try {
    await S.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    closeModal(D.authOv); showToast('Signed in with Google ✓');
  } catch (e) { if (D.authErr) D.authErr.textContent = e.message; }
}

async function doEmailSignIn() {
  if (!S.fbAuth) { showToast('Connect Firebase first'); return; }
  try {
    await S.fbAuth.signInWithEmailAndPassword(D.authEmail.value.trim(), D.authPw.value);
    closeModal(D.authOv); showToast('Signed in ✓');
  } catch (e) { if (D.authErr) D.authErr.textContent = e.message; }
}

async function doEmailSignUp() {
  if (!S.fbAuth) { showToast('Connect Firebase first'); return; }
  try {
    const cred = await S.fbAuth.createUserWithEmailAndPassword(D.authEmail.value.trim(), D.authPw.value);
    const name = D.authName?.value.trim() || 'Typist';
    await cred.user.updateProfile({ displayName: name });
    closeModal(D.authOv); showToast('Account created ✓');
  } catch (e) { if (D.authErr) D.authErr.textContent = e.message; }
}

async function doSignOut() {
  if (!S.fbAuth || !S.currentUser) { openModal(D.authOv); return; }
  await S.fbAuth.signOut();
  showToast('Signed out');
}

/* ═══════════════════════════════════════════════════════════
   §28  PERSONAL STATS & HISTORY
═══════════════════════════════════════════════════════════ */
const LS_HIST = 'tt_history';
const LS_PROF = 'tt_profile';

function saveHistory(r) {
  const h = getHistory(); h.push(r);
  localStorage.setItem(LS_HIST, JSON.stringify(h.slice(-200)));
  S.history = h;
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch { return []; }
}

function getBestWPM() {
  return S.history.length ? Math.max(...S.history.map(r => r.wpm)) : 0;
}

function persistProfile() {
  localStorage.setItem(LS_PROF, JSON.stringify({
    bestWpm: S.bestWpm, achievements: S.achievements,
  }));
}

function loadProfile() {
  try {
    const p = JSON.parse(localStorage.getItem(LS_PROF) || '{}');
    S.bestWpm      = p.bestWpm      || getBestWPM();
    S.achievements = p.achievements || {};
  } catch {}
}

function renderStats() {
  if (!D.statCards) return;
  const h = S.history, n = h.length;

  if (!n) {
    D.statCards.innerHTML = '<p style="color:var(--text-f);grid-column:1/-1;text-align:center;padding:1.5rem">No tests completed yet!</p>';
    return;
  }

  const wpms   = h.map(r => r.wpm);
  const accs   = h.map(r => r.acc);
  const best   = Math.max(...wpms);
  const avgW   = Math.round(wpms.reduce((a, b) => a + b, 0) / n);
  const avgA   = Math.round(accs.reduce((a, b) => a + b, 0) / n);
  const r5     = wpms.slice(-5);
  const trend  = r5.length > 1 ? (r5[r5.length - 1] > r5[0] ? '↑' : r5[r5.length - 1] < r5[0] ? '↓' : '→') : '—';
  const modeMap = h.reduce((acc, r) => { acc[r.mode] = (acc[r.mode] || 0) + 1; return acc; }, {});
  const favMode = Object.entries(modeMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const totalSec = h.reduce((s, r) => s + (r.duration || 30), 0);
  const achCount = Object.keys(S.achievements).length;

  const cards = [
    { v: n,               l: 'Tests' },
    { v: best,            l: 'Best WPM' },
    { v: avgW,            l: 'Avg WPM' },
    { v: avgA + '%',      l: 'Avg Accuracy' },
    { v: currentLevel(),  l: 'Level' },
    { v: S.bestWpm,       l: 'Personal Best' },
    { v: trend,           l: 'WPM Trend' },
    { v: fmtSec(totalSec),l: 'Time Typed' },
    { v: favMode,         l: 'Fav Mode' },
    { v: achCount,        l: 'Achievements' },
  ];

  D.statCards.innerHTML = cards.map(c =>
    `<div class="stcard"><span class="stv">${c.v}</span><span class="stl">${c.l}</span></div>`
  ).join('');

  setTimeout(() => {
    const data = h.slice(-30).map((r, i) => ({ t: i, wpm: r.wpm }));
    renderWPMChart(data, 'histChart');
  }, 80);
}

function fmtSec(s) {
  return s < 60 ? s + 's' : s < 3600 ? Math.round(s / 60) + 'm' : (s / 3600).toFixed(1) + 'h';
}

/* ═══════════════════════════════════════════════════════════
   §29  35-ACHIEVEMENT SYSTEM (Common / Rare / Epic)
═══════════════════════════════════════════════════════════ */
const ACH_DEFS = [
  // Speed milestones
  { id:'wpm_30',    ico:'🐢', name:'Turtle',          desc:'Reach 30 WPM',   tier:'common', check: r => r.wpm >= 30 },
  { id:'wpm_50',    ico:'⚡', name:'Speed Demon',      desc:'Reach 50 WPM',  tier:'common', check: r => r.wpm >= 50 },
  { id:'wpm_75',    ico:'🏃', name:'Fast Mover',       desc:'Reach 75 WPM',  tier:'common', check: r => r.wpm >= 75 },
  { id:'wpm_100',   ico:'🔥', name:'Century',          desc:'Reach 100 WPM',  tier:'rare',   check: r => r.wpm >= 100 },
  { id:'wpm_125',   ico:'💨', name:'Gale Force',       desc:'Reach 125 WPM',  tier:'rare',   check: r => r.wpm >= 125 },
  { id:'wpm_150',   ico:'🌪', name:'Lightning',        desc:'Reach 150 WPM',  tier:'rare',   check: r => r.wpm >= 150 },
  { id:'wpm_175',   ico:'☄', name:'Comet',             desc:'Reach 175 WPM', tier:'epic',   check: r => r.wpm >= 175 },
  { id:'wpm_200',   ico:'🚀', name:'Supersonic',       desc:'Reach 200 WPM', tier:'epic',   check: r => r.wpm >= 200 },
  { id:'wpm_220',   ico:'🛸', name:'Transcendent',     desc:'Reach 220 WPM', tier:'epic',   check: r => r.wpm >= 220 },
  // Accuracy
  { id:'acc_99',    ico:'✨', name:'Nearly Perfect',   desc:'99%+ accuracy on any test',  tier:'common', check: r => r.acc >= 99 },
  { id:'acc_100',   ico:'💎', name:'Perfectionist',    desc:'100% accuracy on any test',  tier:'rare',   check: r => r.acc === 100 },
  { id:'acc_100h',  ico:'🏆', name:'Flawless',         desc:'100% accuracy on Hard difficulty',  tier:'epic',   check: r => r.acc === 100 && r.diff === 'hard' },
  // Streaks
  { id:'str_25',    ico:'🔗', name:'Chain',            desc:'25+ character streak',   tier:'common', check: r => r.streak >= 25 },
  { id:'str_50',    ico:'⛓', name:'Unbreakable',      desc:'50+ character streak',  tier:'common', check: r => r.streak >= 50 },
  { id:'str_100',   ico:'🧲', name:'Magnetic',         desc:'100+ character streak',  tier:'rare',   check: r => r.streak >= 100 },
  { id:'str_200',   ico:'∞',  name:'Infinite',         desc:'200+ character streak',  tier:'epic',   check: r => r.streak >= 200 },
  // Test counts
  { id:'t1',        ico:'🎯', name:'First Blood',      desc:'Complete your first test',   tier:'common', check: (_, h) => h.length >= 1 },
  { id:'t10',       ico:'📝', name:'Regular',          desc:'Complete 10 tests',   tier:'common', check: (_, h) => h.length >= 10 },
  { id:'t50',       ico:'🏋', name:'Dedicated',        desc:'Complete 50 tests',  tier:'common', check: (_, h) => h.length >= 50 },
  { id:'t100',      ico:'🎖', name:'Veteran',          desc:'Complete 100 tests',  tier:'rare',   check: (_, h) => h.length >= 100 },
  { id:'t500',      ico:'🌟', name:'Legend',           desc:'Complete 500 tests', tier:'epic',   check: (_, h) => h.length >= 500 },
  // Levels
  { id:'lvl5',      ico:'🎮', name:'Getting Started',  desc:'Reach level 5',   tier:'common', check: () => currentLevel() >= 5 },
  { id:'lvl10',     ico:'🥉', name:'Bronze Typist',    desc:'Reach level 10',  tier:'common', check: () => currentLevel() >= 10 },
  { id:'lvl25',     ico:'🥈', name:'Silver Typist',    desc:'Reach level 25',  tier:'rare',   check: () => currentLevel() >= 25 },
  { id:'lvl50',     ico:'🥇', name:'Gold Typist',      desc:'Reach level 50', tier:'rare',   check: () => currentLevel() >= 50 },
  { id:'lvl100',    ico:'👑', name:'Grand Master',     desc:'Reach level 100!', tier:'epic',   check: () => currentLevel() >= 100 },
  // Modes & special
  { id:'code',      ico:'🐒', name:'Code Monkey',      desc:'Complete a Code test',  tier:'common', check: r => r.mode === 'code' },
  { id:'punct',     ico:'❗', name:'Punctuator',       desc:'Complete Punctuation mode',  tier:'common', check: r => r.mode === 'punctuation' },
  { id:'nums',      ico:'🔢', name:'Numerist',         desc:'Complete Numbers mode',  tier:'common', check: r => r.mode === 'numbers' },
  { id:'marathon',  ico:'🏃', name:'Marathon',         desc:'Complete a 120s test',  tier:'rare',   check: r => r.duration >= 120 },
  { id:'hard',      ico:'💀', name:'Hard Mode',        desc:'Complete a Hard difficulty test',  tier:'common', check: r => r.diff === 'hard' },
  { id:'no_err',    ico:'🎯', name:'Zero Errors',      desc:'Finish any test with 0 errors',  tier:'rare',   check: r => r.errors === 0 },
  { id:'adaptive',  ico:'🧠', name:'Self-Aware',       desc:'Complete a test in Adaptive mode',  tier:'common', check: r => r._adaptive === true },
  // Ghost & Daily
  { id:'ghost_beat',ico:'👻', name:'Ghost Slayer',     desc:'Beat your own ghost record',  tier:'rare',   check: r => r._ghost_beat === true },
  { id:'daily1',    ico:'📅', name:'Daily Player',     desc:'Complete a daily challenge',  tier:'common', check: r => r._daily === true },
  { id:'daily7',    ico:'🗓', name:'Week Warrior',     desc:'Complete 7 daily challenges in a row',  tier:'rare',   check: () => getDailyStreak() >= 7 },
];

function getDailyStreak() {
  try { return parseInt(localStorage.getItem('tt_daily_streak') || '0'); } catch { return 0; }
}

function checkAchievements(result) {
  const history = S.history;
  const newUnlocks = [];

  ACH_DEFS.forEach(a => {
    if (S.achievements[a.id]) return;
    try {
      if (a.check(result, history)) {
        S.achievements[a.id] = new Date().toISOString();
        newUnlocks.push(a);
      }
    } catch { /* ignore */ }
  });

  if (newUnlocks.length) {
    if (D.achBadge) D.achBadge.hidden = false;
    if (D.mmAchBadge) D.mmAchBadge.hidden = false;
    persistProfile();
    newUnlocks.forEach((a, i) => setTimeout(() => showAchToast(a), i * 2200));
  }
}

function showAchToast(ach) {
  if (!D.achToast) return;
  if (D.atIcon) D.atIcon.textContent = ach.ico;
  if (D.atName) D.atName.textContent = ach.name;
  D.achToast.hidden = false;
  D.achToast.classList.add('show');
  setTimeout(() => {
    D.achToast.classList.remove('show');
    setTimeout(() => { D.achToast.hidden = true; }, 400);
  }, 3800);
}

function renderAchievements() {
  if (!D.achGrid) return;
  const total    = ACH_DEFS.length;
  const unlocked = ACH_DEFS.filter(a => S.achievements[a.id]).length;

  if (D.achStats) {
    D.achStats.innerHTML = `
      <span class="ach-count">${unlocked}/${total}</span>
      <div class="ach-prog-wrap">
        <div style="font-size:.76rem;color:var(--text-m);margin-bottom:.4rem">${Math.round((unlocked / total) * 100)}% unlocked</div>
        <div class="ach-prog-track"><div class="ach-prog-fill" style="width:${(unlocked / total) * 100}%"></div></div>
      </div>`;
  }

  D.achGrid.innerHTML = '';
  ACH_DEFS.forEach(a => {
    const un    = !!S.achievements[a.id];
    const isNew = un && Date.now() - new Date(S.achievements[a.id]).getTime() < 600000;
    const card  = document.createElement('div');
    card.className = `acard ${un ? 'unlocked' : 'locked'} ${a.tier}`;
    card.innerHTML = `
      <div class="a-tier ${a.tier}">${isNew ? 'NEW' : a.tier.toUpperCase()}</div>
      <div class="a-ico">${a.ico}</div>
      <div class="a-name">${a.name}</div>
      <div class="a-desc">${a.desc}</div>`;
    D.achGrid.appendChild(card);
  });

  if (D.achBadge) D.achBadge.hidden = true;
}

/* ═══════════════════════════════════════════════════════════
   §30  DAILY CHALLENGE
═══════════════════════════════════════════════════════════ */
const DAILY_POOL = [
  { title:'Speed Sprint',       desc:'Hit 80+ WPM on a 30s Words/Medium test',  check: r => r.wpm >= 80  && r.mode === 'words'       && r.duration === 30 },
  { title:'Marathon Man',       desc:'Complete a 120s test with 90%+ accuracy',  check: r => r.acc >= 90  && r.duration >= 120 },
  { title:'Error-Free Zone',    desc:'Finish any 30s+ test with zero errors',  check: r => r.errors === 0 && r.duration >= 30 },
  { title:'Code Warrior',       desc:'Complete a Code test with 85%+ accuracy',  check: r => r.mode === 'code' && r.acc >= 85 },
  { title:'Hard Knocks',        desc:'Reach 60 WPM on Hard difficulty',  check: r => r.diff === 'hard' && r.wpm >= 60 },
  { title:'Sentence Master',    desc:'Complete a Sentences test with 95%+ accuracy',  check: r => r.mode === 'sentences' && r.acc >= 95 },
  { title:'Streak Champion',    desc:'Achieve a 100+ character streak in one test',  check: r => r.streak >= 100 },
  { title:'Punctuation Pro',    desc:'Complete Punctuation mode with 90%+ accuracy',  check: r => r.mode === 'punctuation' && r.acc >= 90 },
  { title:'Number Cruncher',    desc:'Complete Numbers mode with 80%+ accuracy',  check: r => r.mode === 'numbers' && r.acc >= 80 },
  { title:'The Centurion',      desc:'Break 100 WPM in any test',  check: r => r.wpm >= 100 },
  { title:'Consistency King',   desc:'Score 90%+ consistency on a 60s+ test',  check: r => r.cons >= 90 && r.duration >= 60 },
  { title:'Quick Draw',         desc:'Type 50+ WPM on a 15s test',  check: r => r.wpm >= 50 && r.duration === 15 },
  { title:'Adaptive Master',    desc:'Complete any test in Adaptive difficulty mode',  check: r => r._adaptive === true },
  { title:'The Perfectionist',  desc:'100% accuracy on Hard difficulty', check: r => r.acc === 100 && r.diff === 'hard' },
];

function getDailyDef() {
  const now    = new Date();
  const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const idx    = (now.getDate() + now.getMonth() * 7 + now.getFullYear()) % DAILY_POOL.length;
  const def    = DAILY_POOL[idx];
  const done   = localStorage.getItem('tt_daily_' + dayKey) === 'done';
  const next   = new Date(now); next.setDate(next.getDate() + 1); next.setHours(0, 0, 0, 0);
  const hours  = Math.round((next - now) / 3_600_000);
  return { ...def, dayKey, done, hoursLeft: hours };
}

function initDailyChallenge() {
  const dc = getDailyDef();
  S.dailyChallenge = dc;
  if (!dc.done) {
    if (D.dailyBanner) D.dailyBanner.hidden = false;
    if (D.dbDesc)      D.dbDesc.textContent  = dc.desc;
    if (D.dbReward)    D.dbReward.textContent = `Daily Bonus`;
    if (D.dailyBadge)   D.dailyBadge.hidden    = false;
    if (D.mmDailyBadge) D.mmDailyBadge.hidden  = false;
  }
}

function renderDailyModal() {
  if (!D.dailyBody) return;
  const dc = getDailyDef();
  D.dailyBody.innerHTML = `
    <div class="dc-card">
      <div class="dc-pre">Today's Challenge</div>
      <div class="dc-title">${dc.title}</div>
      <div class="dc-desc">${dc.desc}</div>
      <div class="dc-reward">🎁 Daily Bonus Reward</div>
      <div class="dc-expires">Resets in ~${dc.hoursLeft}h</div>
    </div>
    ${dc.done
      ? '<div class="dc-done">✓ Challenge completed today! Come back tomorrow.</div>'
      : '<button class="ctrl-btn accent" id="startDailyBtn" style="width:100%;justify-content:center">Start Challenge</button>'
    }`;
  document.getElementById('startDailyBtn')?.addEventListener('click', () => {
    closeModal(D.dailyOv);
    startDailyChallenge();
  });
}

function startDailyChallenge() {
  if (D.dailyBanner) D.dailyBanner.hidden = true;
  S.isDailyActive = true;
  S.mode = 'words'; S.diff = 'medium'; S.duration = 30; S.timeLeft = 30;
  syncPills();
  initTest(true);
  D.ghostInput?.focus();
}

function checkDailyCompletion(result) {
  const dc = S.dailyChallenge;
  if (!dc || dc.done) return;

  const passed = dc.check({ ...result, _adaptive: S.diff === 'adaptive' });
  if (!passed) { showToast('Daily not completed yet. Keep trying!'); return; }

  localStorage.setItem('tt_daily_' + dc.dayKey, 'done');

  // Update streak
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yk        = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
  const lastDay   = localStorage.getItem('tt_daily_last') || '';
  const streak    = lastDay === yk ? getDailyStreak() + 1 : 1;
  localStorage.setItem('tt_daily_streak', String(streak));
  localStorage.setItem('tt_daily_last',   dc.dayKey);

  showToast(`🎉 Daily complete! ${streak}-day streak!`);
  checkAchievements({ ...result, _daily: true });
}

/* ═══════════════════════════════════════════════════════════
   §31  SOCIAL SHARING
═══════════════════════════════════════════════════════════ */
function buildShareText(r) {
  r = r || S.lastResult;
  // BUG-11: guard against null result to prevent "undefined WPM" in share text
  if (!r || r.wpm == null) return 'Check out TalionType — free typing speed test!\n' + window.location.origin + window.location.pathname;
  return `I just typed ${r.wpm} WPM with ${r.acc}% accuracy on TalionType!\n`
       + `${r.errors === 0 ? '✨ Zero errors!\n' : ''}Mode: ${r.mode} / ${r.diff}\n\n`
       // BUG-18: use clean URL without fragments/query strings
       + `Challenge me → ${window.location.origin + window.location.pathname}`;
}

function openShareModal() {
  const r = S.lastResult; if (!r) return;
  if (D.shareCard) {
    D.shareCard.innerHTML = `
      <div style="font-size:2.5rem;font-weight:700;color:var(--acc)">${r.wpm} WPM</div>
      <div style="margin:.4rem 0;color:var(--text-m)">${r.acc}% accuracy · ${r.errors} errors</div>
      <div style="font-size:.75rem;color:var(--text-f)">${r.mode} / ${r.diff} · ${r.duration}s · TalionType by TalionLabs</div>`;
  }
  openModal(D.shareOv);
}

function doTwitterShare() {
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(buildShareText()), '_blank');
  gaEvent('share', { platform: 'twitter' });
}

function doCopyShare() {
  const text = buildShareText();
  // BUG-30: removed deprecated document.execCommand('copy') fallback
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied!')).catch(() => showToast('Could not copy'));
  } else {
    showToast('Clipboard not available in this browser');
  }
  gaEvent('share', { platform: 'copy' });
}

/* ═══════════════════════════════════════════════════════════
   §32  SOUND ENGINE
═══════════════════════════════════════════════════════════ */
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}
function playSound(type) {
  if (!S.soundEnabled) return;
  if (type === 'e' && !S.errSnd) return; // Bug 15: separate error sound toggle
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (type === 'c') { osc.type = 'sine';   osc.frequency.value = 1047; gain.gain.value = 0.028; }
    else              { osc.type = 'square'; osc.frequency.value = 196;  gain.gain.value = 0.035; }
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
    osc.stop(ctx.currentTime + 0.07);
  } catch { /* ignore audio errors */ }
}

/* ═══════════════════════════════════════════════════════════
   §33  PRO / GUMROAD
═══════════════════════════════════════════════════════════ */
const PRO_FEATURES_DEF = [
  { ico:'👻', name:'Ghost Races',       sub:'Race your personal best in real time' },
  { ico:'📊', name:'Advanced Analytics',sub:'Full history, trends & session insights' },
  { ico:'🚫', name:'Ad-Free',           sub:'Clean distraction-free experience' },
  { ico:'📅', name:'Daily Bonuses',     sub:'Exclusive daily challenge rewards' },
  { ico:'🎨', name:'Custom Themes',     sub:'Color schemes & font options (coming soon)' },
  { ico:'⚡', name:'Priority Support',  sub:'Direct line to TalionLabs team' },
];

function loadPro() {
  S.isPro = localStorage.getItem('tt_pro') === 'true';
  if (S.isPro) {
    if (D.btnPro)   { D.btnPro.classList.add('active');   D.btnPro.title   = 'Pro unlocked ✓'; }
    if (D.mmBtnPro) { D.mmBtnPro.classList.add('active'); D.mmBtnPro.title = 'Pro unlocked ✓'; }
  }
  if (D.ghostToggleWrap) D.ghostToggleWrap.style.opacity = S.isPro ? '1' : '0.5';
}

function renderProModal() {
  if (!D.proFeaturesList) return;
  D.proFeaturesList.innerHTML = PRO_FEATURES_DEF.map(f => `
    <div class="pro-feat">
      <span class="pro-feat-ico">${f.ico}</span>
      <div class="pro-feat-txt">
        <span class="pro-feat-ttl">${f.name}</span>
        <span class="pro-feat-sub">${f.sub}</span>
      </div>
    </div>`).join('');
}

function verifyProKey() {
  const key   = (D.proKeyInput?.value || '').trim().toUpperCase();
  // Pattern: TALION-XXXX-XXXX-XXXX  (replace with real Gumroad webhook validation)
  const valid = /^TALION-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)
             || key === 'TALION-DEMO-PRO-KEY'; // for testing

  if (valid) {
    localStorage.setItem('tt_pro', 'true');
    localStorage.setItem('tt_pro_key', key);
    S.isPro = true;
    if (D.btnPro)          D.btnPro.classList.add('active');
    if (D.ghostToggleWrap) D.ghostToggleWrap.style.opacity = '1';
    if (D.proVerifyNote)   { D.proVerifyNote.style.color = 'var(--ok)'; D.proVerifyNote.textContent = '✓ Pro unlocked! Thank you for supporting TalionType.'; }
    showToast('⚡ Pro unlocked!');
  } else {
    if (D.proVerifyNote) { D.proVerifyNote.style.color = 'var(--err)'; D.proVerifyNote.textContent = 'Invalid key. Purchase at Gumroad to get yours.'; }
  }
}

/* ═══════════════════════════════════════════════════════════
   §34  SETTINGS
═══════════════════════════════════════════════════════════ */
const LS_SET = 'tt_settings';

function readSettings() {
  S.fontSize     = parseInt(D.fsSlider?.value) || 20;
  S.smoothCaret  = D.optSmooth?.checked  ?? true;
  S.soundEnabled = D.optSound?.checked   ?? false;
  S.showLiveWpm  = D.optLiveWpm?.checked ?? true;
  S.usePunct     = D.optPunct?.checked   ?? false;
  S.useNums      = D.optNums?.checked    ?? false;
  S.customCount  = parseInt(D.wordCount?.value) || 50;
  S.customText   = D.customTxt?.value    || '';
  applySettings();
}

function applySettings() {
  if (D.wordsWrap) D.wordsWrap.style.fontSize = S.fontSize + 'px';
  if (D.arena)     D.arena.classList.toggle('smooth-caret', S.smoothCaret);
  if (D.arena)     D.arena.classList.toggle('no-blink', !!S.noBlink);
  // Bug 15 - Progress bar
  const prog = document.getElementById('arenaProg');
  if (prog) prog.style.display = S.showProgress === false ? 'none' : '';
  // Bug 15 - High contrast
  document.documentElement.setAttribute('data-hicon', S.hiCon ? 'true' : 'false');
  // Bug 15 - Reduced motion
  document.documentElement.setAttribute('data-reduced', S.reducedMotion ? 'true' : 'false');
  if (D.ghostToggleWrap) D.ghostToggleWrap.style.opacity = S.isPro ? '1' : '0.5';
  // Bug 7: update mode flags
  updateModeFlags();
  localStorage.setItem(LS_SET, JSON.stringify({
    fontSize: S.fontSize, smoothCaret: S.smoothCaret, soundEnabled: S.soundEnabled,
    showLiveWpm: S.showLiveWpm, usePunct: S.usePunct, useNums: S.useNums,
    customCount: S.customCount, noBlink: S.noBlink, showProgress: S.showProgress,
    errSnd: S.errSnd, hiCon: S.hiCon, reducedMotion: S.reducedMotion,
  }));
}

function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_SET) || '{}');
    const ap = (k, el, sk, isBool) => {
      if (s[k] !== undefined) {
        S[sk || k] = s[k];
        if (el) isBool ? (el.checked = s[k]) : (el.value = s[k]);
      }
    };
    ap('fontSize',     D.fsSlider,          'fontSize');
    ap('smoothCaret',  D.optSmooth,         'smoothCaret',   true);
    ap('soundEnabled', D.optSound,          'soundEnabled',  true);
    ap('showLiveWpm',  D.optLiveWpm,        'showLiveWpm',   true);
    ap('usePunct',     D.optPunct,          'usePunct',      true);
    ap('useNums',      D.optNums,           'useNums',       true);
    ap('customCount',  D.wordCount,         'customCount');
    ap('noBlink',      D.optBlink,          'noBlink',       true);
    ap('showProgress', D.optProgress,       'showProgress',  true);
    ap('errSnd',       D.optErrSnd,         'errSnd',        true);
    ap('hiCon',        D.optHiCon,          'hiCon',         true);
    ap('reducedMotion',D.optReducedMotion,  'reducedMotion', true);
    if (D.fsVal) D.fsVal.textContent = (S.fontSize || 20) + 'px';
  } catch {}

  // Restore Firebase config
  try {
    const fb = localStorage.getItem('tt_fb_cfg');
    if (fb) initFirebase(JSON.parse(fb));
  } catch {}
}

/* ═══════════════════════════════════════════════════════════
   §35  THEME
═══════════════════════════════════════════════════════════ */
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('tt_theme', next);
}

function loadTheme() {
  const t = localStorage.getItem('tt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
}

/* ═══════════════════════════════════════════════════════════
   §36  EVENT BINDINGS & BOOT
═══════════════════════════════════════════════════════════ */

// ── Modal helpers ──────────────────────────────────────────
function openModal(el)  { if (!el) return; el.hidden = false; D.backdrop?.classList.add('active'); }
function closeModal(el) {
  if (!el) return; el.hidden = true;
  const anyOpen = document.querySelector('.modal-ov:not([hidden])');
  if (!anyOpen && !D.settingsPanel?.classList.contains('open')) {
    D.backdrop?.classList.remove('active');
  }
}
function openSettings()  {
  const p = D.settingsPanel;
  if (!p) return;
  p.hidden = false;
  // rAF ensures the browser paints hidden=false before we add .open for the CSS transition
  requestAnimationFrame(() => p.classList.add('open'));
  D.backdrop?.classList.add('active');
}
function closeSettings() {
  const p = D.settingsPanel;
  if (!p) return;
  p.classList.remove('open');
  // BUG-16: defer hidden until after the CSS transition completes (~300ms)
  // so the slide-out animation is visible instead of the panel blinking away
  setTimeout(() => { p.hidden = true; }, 300);
  if (!document.querySelector('.modal-ov:not([hidden])')) D.backdrop?.classList.remove('active');
}

function showToast(msg, ms = 3000) {
  if (!D.toast) return;
  D.toast.textContent = msg;
  D.toast.classList.add('show');
  setTimeout(() => D.toast.classList.remove('show'), ms);
}

function esc(str = '') {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function gaEvent(name, params = {}) {
  if (typeof window.gtag === 'function' && window.GA_ENABLED) window.gtag('event', name, params);
}

// ── Sync pill active states ────────────────────────────────
function syncPills() {
  D.modePills.forEach(p => p.classList.toggle('active', p.dataset.mode === S.mode));
  D.diffPills.forEach(p => p.classList.toggle('active', p.dataset.diff === S.diff));
  D.timePills.forEach(p => p.classList.toggle('active', +p.dataset.time === S.duration));
}

// ── Save score flow ────────────────────────────────────────
function openSaveModal() {
  const r = S.lastResult; if (!r) return;
  const chk = AC.check(r.wpm, r.acc);
  if (!chk.ok) { showToast('⚠ Score flagged: ' + chk.why); return; }

  if (D.saveSumEl) D.saveSumEl.innerHTML = `
    <div style="color:var(--acc);font-size:1.8rem;font-weight:700">${r.wpm} <span style="font-size:1rem">WPM</span></div>
    <div>${r.acc}% accuracy · ${r.errors} errors · ${r.mode}/${r.diff}</div>`;

  if (D.saveName)  D.saveName.value       = S.currentUser?.displayName || '';
  if (D.saveNote)  D.saveNote.textContent = S.fbReady
    ? (S.currentUser ? 'Score will post to global leaderboard.' : 'Sign in to post globally. Local save always works.')
    : 'Score saved locally.';

  openModal(D.saveOv);
}

async function confirmSave() {
  const r    = S.lastResult; if (!r) return;
  const name = D.saveName?.value.trim() || 'Anonymous';

  saveLocalScore(name, r);

  if (S.fbReady && S.currentUser) {
    await saveGlobalScore(name, r);
  } else {
    showToast('✓ Score saved locally!');
  }
  closeModal(D.saveOv);
}

// ── Debounce utility ───────────────────────────────────────
function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Main event binding ─────────────────────────────────────
function bindEvents() {
  // Typing
  D.ghostInput?.addEventListener('input',   handleInput);
  D.ghostInput?.addEventListener('keydown', handleKeyDown);
  D.arena?.addEventListener('click', () => { if (!S.finished) D.ghostInput?.focus(); });

  // Controls
  D.btnReset?.addEventListener('click',  () => initTest());
  D.btnPause?.addEventListener('click',  togglePause);
  D.btnResume?.addEventListener('click', togglePause);

  // Results
  D.btnAgain?.addEventListener('click',    () => initTest());
  D.btnSaveScore?.addEventListener('click', openSaveModal);
  D.btnShareRes?.addEventListener('click',  openShareModal);
  D.btnSetGhost?.addEventListener('click',  () => {
    if (!S.lastResult) { showToast('Complete a test first.'); return; }
    if (!S.isPro)      { openModal(D.proOv); return; }
    const r = S.lastResult;
    saveGhostRecord(r.wpm, r.acc);
    if (D.btnSetGhost) D.btnSetGhost.textContent = '✓ Ghost Saved!';
  });

  // Mode pills
  D.modePills.forEach(p => p.addEventListener('click', () => {
    S.mode = p.dataset.mode; syncPills();
    gaEvent('mode_change', { mode: S.mode });
    initTest();
  }));

  // Difficulty pills
  D.diffPills.forEach(p => p.addEventListener('click', () => {
    S.diff = p.dataset.diff; syncPills();
    initTest();
  }));

  // Duration pills
  D.timePills.forEach(p => p.addEventListener('click', () => {
    S.duration = parseInt(p.dataset.time); S.timeLeft = S.duration; syncPills();
    initTest();
  }));

  // Ghost toggle
  D.ghostToggle?.addEventListener('change', () => {
    if (!S.isPro) { D.ghostToggle.checked = false; openModal(D.proOv); return; }
    S.ghostEnabled = D.ghostToggle.checked;
    if (S.ghostEnabled) loadGhostRecord();
  });


  // ── Mobile hamburger menu ──────────────────────────────────
  function closeMobileMenu() {
    if (!D.mobileMenu || !D.hamburgerBtn) return;
    D.mobileMenu.classList.remove('open');
    D.hamburgerBtn.classList.remove('open');
    D.hamburgerBtn.setAttribute('aria-expanded', 'false');
    D.mobileMenu.setAttribute('aria-hidden', 'true');
  }
  function openMobileMenu() {
    if (!D.mobileMenu || !D.hamburgerBtn) return;
    D.mobileMenu.classList.add('open');
    D.hamburgerBtn.classList.add('open');
    D.hamburgerBtn.setAttribute('aria-expanded', 'true');
    D.mobileMenu.setAttribute('aria-hidden', 'false');
  }
  D.hamburgerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    D.mobileMenu?.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (D.mobileMenu?.classList.contains('open') &&
        !D.mobileMenu.contains(e.target) &&
        e.target !== D.hamburgerBtn) closeMobileMenu();
  });

  // Wire all mobile menu buttons (mirror desktop equivalents)
  D.mmDaily?.addEventListener('click', () => { closeMobileMenu(); openModal(D.dailyOv); renderDailyModal(); });
  D.mmGhost?.addEventListener('click', () => { closeMobileMenu(); openModal(D.ghostOv); renderGhostModal(); });
  D.mmAch?.addEventListener('click',   () => { closeMobileMenu(); openModal(D.achOv);   renderAchievements(); });
  D.mmLB?.addEventListener('click',    () => { closeMobileMenu(); openModal(D.lbOv);    renderLB(S.activeTab); });
  D.mmStats?.addEventListener('click', () => { closeMobileMenu(); openModal(D.statsOv); renderStats(); });
  D.mmFriends?.addEventListener('click',() => { closeMobileMenu(); openModal(D.friendsOv); });
  D.mmSettings?.addEventListener('click',()=> { closeMobileMenu(); openSettings(); });
  D.mmAuthBtn?.addEventListener('click', ()=> { closeMobileMenu(); if (S.currentUser) doSignOut(); else openModal(D.authOv); });
  D.mmBtnPro?.addEventListener('click',  ()=> { closeMobileMenu(); renderProModal(); openModal(D.proOv); });
  D.mmThemeToggle?.addEventListener('click', ()=> toggleTheme());

  // Sync badges to mobile menu
  const syncMobileBadges = () => {
    if (D.mmDailyBadge) D.mmDailyBadge.hidden = D.dailyBadge?.hidden ?? true;
    if (D.mmAchBadge)   D.mmAchBadge.hidden   = D.achBadge?.hidden   ?? true;
    if (D.mmAuthBtnTxt && D.authBtnTxt) D.mmAuthBtnTxt.textContent = D.authBtnTxt.textContent;
  };
  // Run immediately and after any modal close
  syncMobileBadges();
  document.addEventListener('modalclose', syncMobileBadges);

  // Header nav
  D.btnSet?.addEventListener('click',  openSettings);
  D.closeSet?.addEventListener('click', closeSettings);
  D.themeToggle?.addEventListener('click', toggleTheme);

  D.btnLB?.addEventListener('click', () => {
    openModal(D.lbOv); renderLB(S.activeTab);
  });
  D.closeLB?.addEventListener('click', () => closeModal(D.lbOv));

  D.btnStats?.addEventListener('click', () => { openModal(D.statsOv); renderStats(); });
  D.closeStats?.addEventListener('click', () => closeModal(D.statsOv));

  D.btnAch?.addEventListener('click', () => { openModal(D.achOv); renderAchievements(); });
  D.closeAch?.addEventListener('click', () => closeModal(D.achOv));

  // Bug 16: friendsOv properly wired
  D.btnFriends?.addEventListener('click', () => openModal(D.friendsOv));
  D.closeFriends?.addEventListener('click', () => closeModal(D.friendsOv));

  D.btnDaily?.addEventListener('click', () => { openModal(D.dailyOv); renderDailyModal(); });
  D.closeDaily?.addEventListener('click', () => closeModal(D.dailyOv));
  D.btnStartDaily?.addEventListener('click', () => { D.dailyBanner.hidden = true; startDailyChallenge(); });
  D.closeDB?.addEventListener('click', () => { if (D.dailyBanner) D.dailyBanner.hidden = true; });

  D.btnGhost?.addEventListener('click', () => { openModal(D.ghostOv); renderGhostModal(); });
  D.closeGhost?.addEventListener('click', () => closeModal(D.ghostOv));

  D.btnPro?.addEventListener('click', () => { renderProModal(); openModal(D.proOv); });
  D.closePro?.addEventListener('click', () => closeModal(D.proOv));
  D.btnVerifyPro?.addEventListener('click', verifyProKey);

  // BUG-08: Feedback modal was entirely unwired — wire it now
  D.closeFeedback?.addEventListener('click', () => closeModal(D.feedbackOv));
  D.btnSendFeedback?.addEventListener('click', () => {
    const txt = D.feedbackTxt?.value?.trim() || '';
    const body = txt ? encodeURIComponent(txt) : '';
    window.open(`mailto:support@talionlabs.com${body ? '?body=' + body : ''}`, '_blank');
  });

  // Auth
  D.authBtn?.addEventListener('click', () => { if (S.currentUser) doSignOut(); else openModal(D.authOv); });
  D.closeAuth?.addEventListener('click', () => closeModal(D.authOv));
  D.btnGoogle?.addEventListener('click',  doGoogleSignIn);
  D.btnEmailIn?.addEventListener('click', doEmailSignIn);
  D.btnEmailUp?.addEventListener('click', doEmailSignUp);

  // Bug 13: Wire auth tabs
  D.tabSignIn?.addEventListener('click', () => {
    D.tabSignIn?.classList.add('active'); D.tabSignUp?.classList.remove('active');
    if (D.authName)  D.authName.style.display  = 'none';
    if (D.btnEmailIn) D.btnEmailIn.style.display = '';
    if (D.btnEmailUp) D.btnEmailUp.style.display = 'none';
    if (D.btnForgotPw) D.btnForgotPw.style.display = '';
    if (D.authErr) D.authErr.textContent = '';
  });
  D.tabSignUp?.addEventListener('click', () => {
    D.tabSignUp?.classList.add('active'); D.tabSignIn?.classList.remove('active');
    if (D.authName)  D.authName.style.display  = '';
    if (D.btnEmailIn) D.btnEmailIn.style.display = 'none';
    if (D.btnEmailUp) D.btnEmailUp.style.display = '';
    if (D.btnForgotPw) D.btnForgotPw.style.display = 'none';
    if (D.authErr) D.authErr.textContent = '';
  });

  // Bug 14: Wire forgot password
  D.btnForgotPw?.addEventListener('click', async () => {
    const email = D.authEmail?.value.trim();
    if (!email) { if (D.authErr) D.authErr.textContent = 'Enter your email first.'; return; }
    if (!S.fbAuth) { if (D.authErr) D.authErr.textContent = 'Sign-in not available.'; return; }
    try {
      await S.fbAuth.sendPasswordResetEmail(email);
      if (D.authErr) { D.authErr.style.color = 'var(--ok)'; D.authErr.textContent = 'Reset email sent! Check your inbox.'; }
    } catch (e) { if (D.authErr) { D.authErr.style.color = 'var(--err)'; D.authErr.textContent = e.message; } }
  });

  // Leaderboard tabs
  D.lbTabs.forEach(tab => tab.addEventListener('click', () => {
    D.lbTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderLB(tab.dataset.lbt);
  }));
  D.btnLBFilter?.addEventListener('click', () => renderLB(S.activeTab));

  // Save score
  D.closeSave?.addEventListener('click',    () => closeModal(D.saveOv));
  D.btnConfSave?.addEventListener('click',  confirmSave);

  // Share
  D.closeShare?.addEventListener('click',   () => closeModal(D.shareOv));
  D.btnTwitter?.addEventListener('click',   doTwitterShare);
  D.btnCopy?.addEventListener('click',      doCopyShare);

  // Settings controls
  D.fsSlider?.addEventListener('input', () => {
    S.fontSize = parseInt(D.fsSlider.value);
    if (D.fsVal)     D.fsVal.textContent    = S.fontSize + 'px';
    if (D.wordsWrap) D.wordsWrap.style.fontSize = S.fontSize + 'px';
  });
  [D.optSmooth, D.optSound, D.optLiveWpm, D.optPunct, D.optNums,
   D.optProgress, D.optBlink, D.optErrSnd, D.optHiCon, D.optReducedMotion]
    .forEach(el => el?.addEventListener('change', readSettings));  D.wordCount?.addEventListener('change', readSettings);
  D.customTxt?.addEventListener('input', debounce(readSettings, 600));

  D.btnResetAll?.addEventListener('click', () => {
    if (!confirm('Reset ALL local data? This cannot be undone.')) return;
    ['tt_history','tt_profile','tt_lb_local','tt_settings','tt_fb_cfg','tt_theme','tt_pro','tt_pro_key','tt_daily_streak','tt_daily_last']
      .concat(Object.keys(localStorage).filter(k => k.startsWith('tt_ghost_') || k.startsWith('tt_daily_')))
      .forEach(k => localStorage.removeItem(k));
    location.reload();
  });

  // Backdrop / Escape
  D.backdrop?.addEventListener('click', () => {
    closeSettings();
    document.querySelectorAll('.modal-ov:not([hidden])').forEach(closeModal);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSettings();
      document.querySelectorAll('.modal-ov:not([hidden])').forEach(closeModal);
    }
  });

  // Adaptive toast close
  D.adaptClose?.addEventListener('click', () => { if (D.adaptToast) D.adaptToast.hidden = true; });

  // Footer links
  D.ftStats?.addEventListener('click',   e => { e.preventDefault(); openModal(D.statsOv); renderStats(); });
  D.ftLB?.addEventListener('click',      e => { e.preventDefault(); openModal(D.lbOv);   renderLB('global'); });
  D.ftPro?.addEventListener('click',     e => { e.preventDefault(); renderProModal(); openModal(D.proOv); });
  D.ftAch?.addEventListener('click',     e => { e.preventDefault(); openModal(D.achOv);  renderAchievements(); });
  D.ftDaily?.addEventListener('click',   e => { e.preventDefault(); openModal(D.dailyOv); renderDailyModal(); });
  D.ftModes.forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); S.mode = a.dataset.m; syncPills(); initTest();
  }));

  // Resize: re-render chart
  window.addEventListener('resize', debounce(() => {
    if (!D.resultsPanel?.hidden) renderWPMChart(S.wpmSamples, 'wpmChart');
    if (!S.finished) requestAnimationFrame(positionLiveCursor);
  }, 250));
}

// ── Boot ──────────────────────────────────────────────────
initFirebase({
  apiKey: "AIzaSyCOuHtbHLnsBCEymB531mdejppQlhx1Iec",
  authDomain: "taliontype.firebaseapp.com",
  projectId: "taliontype",
  storageBucket: "taliontype.firebasestorage.app",
  messagingSenderId: "272114711228",
  appId: "1:272114711228:web:ee83a1312052ee0ce26eb9",
  measurementId: "G-YJ365M26CK"
});
function boot() {
  cacheDOM();
  loadTheme();
  loadProfile();
  loadSettings();
  loadPro();
  S.history = getHistory();
  S.bestWpm = getBestWPM();
  bindEvents();
  refreshLevelUI();
  initDailyChallenge();
  syncPills();
  initTest();

  // Bug 18: populate copyright year
  const yearEl = document.getElementById('copyrightYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Console branding
  console.log(
    '%c⌨ TalionType%c v' + VER,
    'background:#00D9B0;color:#07090D;padding:4px 12px;border-radius:4px 0 0 4px;font-weight:800;font-family:Syne,sans-serif',
    'background:#0C1018;color:#00D9B0;padding:4px 12px;border-radius:0 4px 4px 0;font-family:JetBrains Mono,monospace'
  );
  console.log('%cA TalionLabs product · ' + HOME_URL, 'color:#4E5F75;font-family:Outfit,sans-serif');
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})(); // end IIFE
