/**
 * typing.js — KeyForge Typing Game
 * ═══════════════════════════════════════════════════════════════
 * Complete game logic: words engine, timer, WPM/accuracy calc,
 * heatmap, error tracking, WPM chart, leaderboard, Firebase,
 * settings, themes, anti-cheat, XP, streaks, and more.
 *
 * Architecture: Module pattern with a single `Game` namespace.
 * No external dependencies — vanilla JS only.
 * ═══════════════════════════════════════════════════════════════
 */

;(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     SECTION 1 — WORD BANKS
  ══════════════════════════════════════════════════════════════ */
  const WORD_BANKS = {
    easy: [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
      'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
      'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
      'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
      'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
      'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
      'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
      'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
      'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how'
    ],
    medium: [
      'ability', 'absence', 'account', 'achieve', 'acquire', 'address',
      'advance', 'adverse', 'airline', 'ancient', 'another', 'anxiety',
      'approve', 'archive', 'arrange', 'article', 'assault', 'attempt',
      'average', 'balance', 'battery', 'because', 'between', 'billion',
      'brought', 'cabinet', 'capital', 'captain', 'careful', 'central',
      'certain', 'chapter', 'charity', 'climate', 'college', 'combine',
      'command', 'comment', 'complex', 'concept', 'concern', 'conduct',
      'confirm', 'connect', 'context', 'control', 'correct', 'council',
      'country', 'culture', 'current', 'database', 'decided', 'declare',
      'defence', 'defined', 'deliver', 'deposit', 'develop', 'digital',
      'discuss', 'display', 'dispute', 'distant', 'diverse', 'driving',
      'dynamic', 'eastern', 'economy', 'edition', 'element', 'embrace',
      'emotion', 'enabled', 'endless', 'enforce', 'enhance', 'explore'
    ],
    hard: [
      'aberration', 'abominable', 'accelerate', 'accommodate', 'acknowledge',
      'acquisition', 'ambiguous', 'anachronism', 'anticipate', 'apocalyptic',
      'apparatus', 'appropriate', 'approximate', 'architecture', 'arithmetic',
      'assassination', 'astonishment', 'atmosphere', 'atrocious', 'authoritative',
      'bureaucracy', 'catastrophe', 'circumstances', 'clarification', 'collaboration',
      'complicated', 'comprehensive', 'concentration', 'confidential', 'configuration',
      'consciousness', 'contradiction', 'controversial', 'conversation', 'coordination',
      'cryptocurrency', 'deterioration', 'determination', 'disambiguation',
      'disproportionate', 'diversification', 'electromagnetic', 'establishment',
      'exacerbation', 'exaggeration', 'exhaustive', 'extraordinary', 'extrapolate',
      'fluorescent', 'hallucination', 'heterogeneous', 'hierarchical', 'hypothetical',
      'identification', 'implementation', 'impersonation', 'inappropriate', 'incompatible'
    ]
  };

  const SENTENCES = {
    easy: [
      'The quick brown fox jumps over the lazy dog.',
      'A journey of a thousand miles begins with a single step.',
      'All that glitters is not gold.',
      'To be or not to be that is the question.',
      'The early bird catches the worm.',
      'Actions speak louder than words.',
      'Every cloud has a silver lining.',
      'Better late than never but never late is better.',
      'Where there is a will there is a way.',
      'Two heads are better than one.'
    ],
    medium: [
      'The greatest glory in living lies not in never falling, but in rising every time we fall.',
      'In the middle of every difficulty lies opportunity waiting to be discovered.',
      'It does not matter how slowly you go as long as you do not stop moving forward.',
      'The future belongs to those who believe in the beauty of their own dreams.',
      'Spread love everywhere you go and let no one ever come to you without leaving happier.',
      'When you reach the end of your rope tie a knot in it and hang on patiently.',
      'Success is not final and failure is not fatal it is the courage to continue that counts.',
      'Believe you can and you are already halfway there on your journey.',
      'You will face many defeats in life but never let yourself be defeated by them.',
      'The most common way people give up their power is by thinking they have none.'
    ],
    hard: [
      'Technological advancement in artificial intelligence has precipitated unprecedented transformations across virtually every sector of contemporary civilization.',
      'Epistemological frameworks that undergird scientific methodology necessitate rigorous falsifiability criteria and systematic empirical verification procedures.',
      'Quantum entanglement demonstrates nonlocal correlations between particles that seemingly violate classical intuitions about separability and causal independence.',
      'Psycholinguistic research consistently demonstrates that bilingual individuals exhibit superior cognitive flexibility and executive function capabilities compared to monolinguals.',
      'Photosynthesis converts electromagnetic radiation into biochemical energy through chlorophyll absorption and subsequent Calvin cycle carboxylation reactions.',
      'Constitutional jurisprudence necessitates balancing competing fundamental rights through proportionality analysis and contextual interpretation of legislative intent.',
    ]
  };

  const CODE_SNIPPETS = [
    `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
    `const debounce = (fn, delay) => {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n};`,
    `async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}`,
    `class EventEmitter {\n  constructor() { this.events = {}; }\n  on(event, listener) {\n    (this.events[event] = this.events[event] || []).push(listener);\n  }\n  emit(event, ...args) {\n    (this.events[event] || []).forEach(fn => fn(...args));\n  }\n}`,
    `const memoize = (fn) => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n};`
  ];

  const PUNCTUATION = [',', '.', '!', '?', ';', ':'];
  const NUMBERS     = ['0','1','2','3','4','5','6','7','8','9'];

  /* ══════════════════════════════════════════════════════════════
     SECTION 2 — STATE
  ══════════════════════════════════════════════════════════════ */
  const State = {
    mode:         'words',   // words | sentences | code | custom
    difficulty:   'medium',
    testDuration: 30,        // seconds
    timeLeft:     30,
    timerActive:  false,
    paused:       false,
    started:      false,
    finished:     false,

    // Text & position
    targetText:   '',        // full text to type
    words:        [],        // array of word strings
    typed:        '',        // everything user has typed
    charIndex:    0,         // current char position

    // Metrics
    startTime:    null,
    endTime:      null,
    errorMap:     {},        // { charIndex: { expected, got } }
    keyErrorMap:  {},        // { key: count } — for heatmap
    keyPressMap:  {},        // { key: count } — for heatmap coverage
    wpmSamples:   [],        // [{ t, wpm }] for graph
    correctChars: 0,
    totalTyped:   0,
    currentStreak: 0,
    bestStreak:   0,

    // Settings
    fontSize:     20,
    smoothCaret:  true,
    soundEnabled: false,
    showLiveWpm:  true,
    usePunctuation: false,
    useNumbers:   false,
    customWordCount: 50,
    customText:   '',

    // Session
    totalXP:      0,
    testHistory:  [],        // from localStorage
  };

  /* ══════════════════════════════════════════════════════════════
     SECTION 3 — DOM CACHE
  ══════════════════════════════════════════════════════════════ */
  const DOM = {};
  function cacheDOM() {
    const ids = [
      'wordsDisplay','ghostInput','timerVal','wpmVal','accVal','streakVal',
      'btnReset','btnPause','btnLeaderboard','btnStats','btnSettings',
      'closeSettings','settingsPanel','resultsPanel','leaderboardOverlay',
      'closeLeaderboard','leaderboardBody','statsOverlay','closeStats',
      'personalStats','saveScoreOverlay','closeSaveScore','btnSaveScore',
      'btnConfirmSave','playerName','btnPlayAgain','wpmChart','historyChart',
      'errorGrid','keyboardHeatmap','resWpm','resAcc','resErrors',
      'resConsistency','resStreak','resRaw','xpBadge','firebaseNotice',
      'themeToggle','backdrop','toast','firebaseConfig','btnSaveFirebase',
      'fontSizeSlider','fontSizeVal','smoothCaret','soundEnabled',
      'showLiveWpm','usePunctuation','useNumbers','customWordCount',
      'customText','typingArena','liveWpm','liveAcc','liveStreak'
    ];
    ids.forEach(id => { DOM[id] = document.getElementById(id); });

    DOM.modePills = document.querySelectorAll('[data-mode]');
    DOM.diffPills = document.querySelectorAll('[data-diff]');
    DOM.timePills = document.querySelectorAll('[data-time]');
    DOM.tabBtns   = document.querySelectorAll('.tab-btn');
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 4 — TEXT GENERATION
  ══════════════════════════════════════════════════════════════ */
  function generateText() {
    const { mode, difficulty, customWordCount, customText, usePunctuation, useNumbers } = State;

    if (mode === 'custom' && customText.trim()) {
      return customText.trim();
    }
    if (mode === 'sentences') {
      const pool = SENTENCES[difficulty] || SENTENCES.medium;
      return shuffle([...pool]).slice(0, 4).join(' ');
    }
    if (mode === 'code') {
      return CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    }

    // words mode
    const pool = WORD_BANKS[difficulty] || WORD_BANKS.medium;
    const count = Math.max(customWordCount, 20);
    let words = [];
    for (let i = 0; i < count; i++) {
      let w = pool[Math.floor(Math.random() * pool.length)];
      if (useNumbers && Math.random() < 0.1) {
        w = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
      }
      if (usePunctuation && Math.random() < 0.15) {
        w += PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
      }
      words.push(w);
    }
    return words.join(' ');
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 5 — RENDER WORDS DISPLAY
  ══════════════════════════════════════════════════════════════ */
  function renderText() {
    const display = DOM.wordsDisplay;
    display.innerHTML = '';

    // Progress bar
    const pbWrap = document.createElement('div');
    pbWrap.className = 'progress-bar-wrap';
    const pbFill = document.createElement('div');
    pbFill.className = 'progress-bar-fill';
    pbFill.id = 'progressFill';
    pbFill.style.width = '0%';
    pbWrap.appendChild(pbFill);
    display.appendChild(pbWrap);

    // Render each character
    State.targetText.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'letter untyped';
      span.dataset.index = i;
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      if (ch === '\n') { span.innerHTML = '↵\n'; span.style.opacity = '0.3'; }
      display.appendChild(span);
    });

    // Cursor element
    const cursor = document.createElement('span');
    cursor.className = 'cursor-caret blink';
    cursor.id = 'typeCursor';
    display.appendChild(cursor);

    positionCursor();
  }

  function positionCursor() {
    const cursor = document.getElementById('typeCursor');
    const letters = DOM.wordsDisplay.querySelectorAll('.letter');
    if (!cursor || !letters.length) return;

    const idx = State.charIndex;
    if (idx < letters.length) {
      letters[idx].parentNode.insertBefore(cursor, letters[idx]);
    } else if (letters.length > 0) {
      letters[letters.length - 1].after(cursor);
    }
  }

  function updateLetterState(index, state) {
    const el = DOM.wordsDisplay.querySelector(`[data-index="${index}"]`);
    if (el) el.className = `letter ${state}`;
  }

  function updateProgress() {
    const fill = document.getElementById('progressFill');
    if (fill) {
      const pct = Math.min(100, (State.charIndex / State.targetText.length) * 100);
      fill.style.width = `${pct}%`;
    }
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 6 — TIMER
  ══════════════════════════════════════════════════════════════ */
  let timerInterval = null;
  let wpmSampleInterval = null;

  function startTimer() {
    if (State.timerActive) return;
    State.timerActive = true;
    State.startTime = performance.now();

    timerInterval = setInterval(() => {
      if (State.paused) return;
      State.timeLeft--;
      DOM.timerVal.textContent = State.timeLeft;

      // Urgent color when < 10s
      const chip = DOM.timerVal.closest('.timer-chip');
      if (chip) chip.classList.toggle('urgent', State.timeLeft <= 10);

      if (State.timeLeft <= 0) finishTest();
    }, 1000);

    // Sample WPM every 2 seconds for graph
    wpmSampleInterval = setInterval(() => {
      if (!State.paused && State.timerActive) {
        const wpm = calcLiveWPM();
        const elapsed = (State.testDuration - State.timeLeft);
        State.wpmSamples.push({ t: elapsed, wpm });
      }
    }, 2000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    clearInterval(wpmSampleInterval);
    State.timerActive = false;
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 7 — CALCULATIONS
  ══════════════════════════════════════════════════════════════ */

  /** Net WPM = (correct chars / 5) / elapsed minutes */
  function calcLiveWPM() {
    if (!State.startTime) return 0;
    const elapsed = (performance.now() - State.startTime) / 60000; // minutes
    if (elapsed <= 0) return 0;
    return Math.round(State.correctChars / 5 / elapsed);
  }

  /** Raw WPM = (total typed chars / 5) / elapsed minutes */
  function calcRawWPM() {
    if (!State.startTime) return 0;
    const elapsed = (performance.now() - State.startTime) / 60000;
    if (elapsed <= 0) return 0;
    return Math.round(State.totalTyped / 5 / elapsed);
  }

  function calcAccuracy() {
    if (State.totalTyped === 0) return 100;
    return Math.round((State.correctChars / State.totalTyped) * 100);
  }

  function calcConsistency() {
    const samples = State.wpmSamples.map(s => s.wpm).filter(w => w > 0);
    if (samples.length < 2) return 100;
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance = samples.reduce((sum, w) => sum + (w - avg) ** 2, 0) / samples.length;
    const cv = Math.sqrt(variance) / avg;
    return Math.round(Math.max(0, Math.min(100, (1 - cv) * 100)));
  }

  function calcXP(wpm, acc, duration) {
    const base = Math.round((wpm * (acc / 100)) * (duration / 30));
    const diffMult = { easy: 0.8, medium: 1, hard: 1.4 }[State.difficulty] || 1;
    return Math.round(base * diffMult);
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 8 — ANTI-CHEAT
  ══════════════════════════════════════════════════════════════ */
  const AntiCheat = {
    maxReasonableWPM: 250,
    suspiciousThreshold: 220,
    keyTimestamps: [],

    record(ts) { this.keyTimestamps.push(ts); },

    check(wpm, acc) {
      if (wpm > this.maxReasonableWPM) return { flagged: true, reason: 'WPM exceeds physical limit' };

      // Check for impossible burst speed (> 20 chars in 100ms)
      const recent = this.keyTimestamps.filter(t => t > performance.now() - 200);
      if (recent.length > 25) return { flagged: true, reason: 'Input burst detected' };

      // Perfect accuracy with very high WPM is suspicious
      if (wpm > this.suspiciousThreshold && acc === 100) {
        return { flagged: true, reason: 'Suspicious score pattern' };
      }

      return { flagged: false };
    },

    reset() { this.keyTimestamps = []; }
  };

  /* ══════════════════════════════════════════════════════════════
     SECTION 9 — INPUT HANDLING
  ══════════════════════════════════════════════════════════════ */
  function handleInput(e) {
    if (State.finished || State.paused) return;

    const value = DOM.ghostInput.value;

    // First keystroke → start timer
    if (!State.started) {
      State.started = true;
      DOM.btnPause.disabled = false;
      startTimer();
    }

    AntiCheat.record(performance.now());

    const prevLength = State.charIndex;
    const newLength  = value.length;

    if (newLength > prevLength) {
      // Character added
      const typedChar    = value[value.length - 1];
      const expectedChar = State.targetText[State.charIndex];

      State.totalTyped++;

      const correct = typedChar === expectedChar;

      if (correct) {
        updateLetterState(State.charIndex, 'correct');
        State.correctChars++;
        State.currentStreak++;
        if (State.currentStreak > State.bestStreak) State.bestStreak = State.currentStreak;
        if (State.soundEnabled) playSound('correct');
      } else {
        updateLetterState(State.charIndex, 'incorrect');
        State.errorMap[State.charIndex] = { expected: expectedChar, got: typedChar };
        State.currentStreak = 0;

        // Track key errors for heatmap
        const k = typedChar.toLowerCase();
        State.keyErrorMap[k] = (State.keyErrorMap[k] || 0) + 1;

        if (State.soundEnabled) playSound('error');
      }

      // Track key presses
      const kp = typedChar.toLowerCase();
      State.keyPressMap[kp] = (State.keyPressMap[kp] || 0) + 1;

      State.charIndex++;

    } else if (newLength < prevLength) {
      // Backspace
      if (State.charIndex > 0) {
        State.charIndex--;
        updateLetterState(State.charIndex, 'untyped');
        // Correct char was removed — decrement
        if (!State.errorMap[State.charIndex]) {
          State.correctChars = Math.max(0, State.correctChars - 1);
        }
      }
    }

    State.typed = value;
    positionCursor();
    updateProgress();
    updateLiveStats();

    // Check completion (all chars typed)
    if (State.charIndex >= State.targetText.length) {
      finishTest();
    }
  }

  function handleKeyDown(e) {
    // Prevent default browser behaviors that break typing
    if (e.key === 'Tab') { e.preventDefault(); }
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 10 — LIVE STATS UPDATE
  ══════════════════════════════════════════════════════════════ */
  let liveUpdateThrottle = null;

  function updateLiveStats() {
    if (liveUpdateThrottle) return;
    liveUpdateThrottle = setTimeout(() => {
      liveUpdateThrottle = null;
      const wpm = calcLiveWPM();
      const acc = calcAccuracy();

      if (State.showLiveWpm) {
        DOM.wpmVal.textContent = wpm || '—';
        DOM.liveWpm.style.opacity = '1';
      }
      DOM.accVal.textContent  = State.totalTyped > 0 ? `${acc}%` : '—';
      DOM.streakVal.textContent = State.currentStreak;
    }, 80);
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 11 — FINISH TEST
  ══════════════════════════════════════════════════════════════ */
  function finishTest() {
    if (State.finished) return;
    State.finished = true;
    State.endTime  = performance.now();
    stopTimer();

    const wpm  = calcLiveWPM();
    const raw  = calcRawWPM();
    const acc  = calcAccuracy();
    const cons = calcConsistency();
    const errs = Object.keys(State.errorMap).length;
    const xp   = calcXP(wpm, acc, State.testDuration);

    // Anti-cheat
    const cheat = AntiCheat.check(wpm, acc);
    if (cheat.flagged) {
      showToast(`⚠ Score flagged: ${cheat.reason}. Not saved.`);
    }

    // Save to history
    const record = {
      date: new Date().toISOString(),
      wpm, raw, acc, cons, errors: errs,
      mode: State.mode, difficulty: State.difficulty,
      duration: State.testDuration, xp,
      flagged: cheat.flagged
    };
    saveToHistory(record);

    // Accumulate XP
    State.totalXP += xp;
    localStorage.setItem('kf_xp', State.totalXP);

    // Show results
    DOM.resWpm.textContent        = wpm;
    DOM.resAcc.textContent        = `${acc}%`;
    DOM.resErrors.textContent     = errs;
    DOM.resConsistency.textContent = `${cons}%`;
    DOM.resStreak.textContent     = State.bestStreak;
    DOM.resRaw.textContent        = raw;
    DOM.xpBadge.textContent       = `+${xp} XP`;
    DOM.xpBadge.classList.add('pop');

    DOM.resultsPanel.hidden = false;
    DOM.resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    renderWPMChart(State.wpmSamples);
    renderErrorBreakdown();
    renderKeyHeatmap();
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 12 — INIT / RESET
  ══════════════════════════════════════════════════════════════ */
  function initTest() {
    stopTimer();

    // Reset state
    State.typed          = '';
    State.charIndex      = 0;
    State.started        = false;
    State.finished       = false;
    State.timerActive    = false;
    State.paused         = false;
    State.timeLeft       = State.testDuration;
    State.startTime      = null;
    State.endTime        = null;
    State.errorMap       = {};
    State.keyErrorMap    = {};
    State.keyPressMap    = {};
    State.wpmSamples     = [];
    State.correctChars   = 0;
    State.totalTyped     = 0;
    State.currentStreak  = 0;
    State.bestStreak     = 0;
    AntiCheat.reset();

    // Generate text
    State.targetText = generateText();

    // UI
    DOM.timerVal.textContent   = State.testDuration;
    DOM.wpmVal.textContent     = '—';
    DOM.accVal.textContent     = '—';
    DOM.streakVal.textContent  = '0';
    DOM.btnPause.disabled      = true;
    DOM.btnPause.textContent   = '⏸ Pause';
    DOM.resultsPanel.hidden    = true;
    DOM.ghostInput.value       = '';
    DOM.ghostInput.disabled    = false;
    DOM.ghostInput.focus();

    const chip = DOM.timerVal.closest('.timer-chip');
    if (chip) chip.classList.remove('urgent');

    // Apply font size
    DOM.wordsDisplay.style.fontSize = `${State.fontSize}px`;

    // Smooth caret
    DOM.typingArena.classList.toggle('smooth-caret', State.smoothCaret);

    renderText();
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 13 — PAUSE / RESUME
  ══════════════════════════════════════════════════════════════ */
  function togglePause() {
    if (!State.started || State.finished) return;

    State.paused = !State.paused;
    DOM.btnPause.innerHTML = State.paused
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';

    if (State.paused) {
      DOM.ghostInput.disabled = true;
      // Show paused overlay
      const overlay = document.createElement('div');
      overlay.className = 'paused-overlay';
      overlay.id = 'pausedOverlay';
      overlay.textContent = '⏸ Paused — click Resume to continue';
      DOM.typingArena.appendChild(overlay);
      // Adjust start time to account for pause
      State._pauseStart = performance.now();
    } else {
      DOM.ghostInput.disabled = false;
      DOM.ghostInput.focus();
      const pausedOverlay = document.getElementById('pausedOverlay');
      if (pausedOverlay) pausedOverlay.remove();
      // Adjust startTime forward by pause duration
      if (State._pauseStart) {
        const pauseDuration = performance.now() - State._pauseStart;
        State.startTime += pauseDuration;
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 14 — WPM CHART
  ══════════════════════════════════════════════════════════════ */
  function renderWPMChart(samples) {
    const canvas = DOM.wpmChart;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const dpr    = window.devicePixelRatio || 1;
    const w      = canvas.offsetWidth || 800;
    const h      = 200;

    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';

    ctx.clearRect(0, 0, w, h);

    if (!samples || samples.length < 2) {
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-faint').trim();
      ctx.font = '14px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Not enough data for graph', w / 2, h / 2);
      return;
    }

    const pad   = { top: 20, right: 20, bottom: 30, left: 50 };
    const cw    = w - pad.left - pad.right;
    const ch    = h - pad.top  - pad.bottom;
    const maxWpm = Math.max(...samples.map(s => s.wpm), 10);
    const maxT   = Math.max(...samples.map(s => s.t), 1);

    const accent  = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const textM   = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
    const borderC = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();

    // Grid lines
    ctx.strokeStyle = borderC;
    ctx.lineWidth   = 0.5;
    [0.25, 0.5, 0.75, 1].forEach(p => {
      const y = pad.top + ch * (1 - p);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
      ctx.fillStyle = textM; ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxWpm * p), pad.left - 6, y + 4);
    });

    // Axis labels
    ctx.fillStyle = textM; ctx.font = '11px DM Sans, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Time (s)', w / 2, h - 4);

    // Area fill
    const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    gradient.addColorStop(0, accent + '55');
    gradient.addColorStop(1, accent + '00');

    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top + ch);
    samples.forEach((s, i) => {
      const x = pad.left + (s.t / maxT) * cw;
      const y = pad.top  + ch - (s.wpm / maxWpm) * ch;
      if (i === 0) ctx.lineTo(x, y); else ctx.lineTo(x, y);
    });
    const lastX = pad.left + (samples[samples.length - 1].t / maxT) * cw;
    ctx.lineTo(lastX, pad.top + ch);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = accent;
    ctx.lineWidth   = 2.5;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';
    samples.forEach((s, i) => {
      const x = pad.left + (s.t / maxT) * cw;
      const y = pad.top  + ch - (s.wpm / maxWpm) * ch;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    samples.forEach(s => {
      const x = pad.left + (s.t / maxT) * cw;
      const y = pad.top  + ch - (s.wpm / maxWpm) * ch;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle   = accent;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    });
  }

  function renderHistoryChart(history) {
    const canvas = DOM.historyChart;
    if (!canvas || !history.length) return;
    const samples = history.slice(-20).map((r, i) => ({ t: i, wpm: r.wpm }));
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w   = canvas.offsetWidth || 700;
    const h   = 180;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    renderWPMChart_generic(ctx, samples, w, h);
  }

  function renderWPMChart_generic(ctx, samples, w, h) {
    // Same rendering logic as renderWPMChart but reusable
    ctx.clearRect(0, 0, w, h);
    if (!samples || samples.length < 2) return;
    const pad    = { top: 20, right: 20, bottom: 30, left: 50 };
    const cw     = w - pad.left - pad.right;
    const ch     = h - pad.top  - pad.bottom;
    const maxWpm = Math.max(...samples.map(s => s.wpm), 10);
    const maxT   = Math.max(...samples.map(s => s.t), 1);
    const accent  = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const borderC = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
    const textM   = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();

    ctx.strokeStyle = borderC; ctx.lineWidth = 0.5;
    [0.5, 1].forEach(p => {
      const y = pad.top + ch * (1 - p);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
      ctx.fillStyle = textM; ctx.font = '11px JetBrains Mono, monospace'; ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxWpm * p), pad.left - 6, y + 4);
    });

    ctx.beginPath(); ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    samples.forEach((s, i) => {
      const x = pad.left + (s.t / maxT) * cw;
      const y = pad.top  + ch - (s.wpm / maxWpm) * ch;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    samples.forEach(s => {
      const x = pad.left + (s.t / maxT) * cw;
      const y = pad.top  + ch - (s.wpm / maxWpm) * ch;
      ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.fill();
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 15 — ERROR BREAKDOWN
  ══════════════════════════════════════════════════════════════ */
  function renderErrorBreakdown() {
    const grid = DOM.errorGrid;
    grid.innerHTML = '';

    const errors = State.keyErrorMap;
    const sorted = Object.entries(errors).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      grid.innerHTML = '<p class="no-errors">✓ Perfect — no errors!</p>';
      return;
    }

    sorted.forEach(([key, count]) => {
      const item = document.createElement('div');
      item.className = 'error-item';
      item.innerHTML = `<span class="error-key">${escapeHTML(key)}</span><span class="error-count">×${count}</span>`;
      grid.appendChild(item);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 16 — KEY HEATMAP
  ══════════════════════════════════════════════════════════════ */
  const KB_LAYOUT = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
  ];

  function renderKeyHeatmap() {
    const wrap = DOM.keyboardHeatmap;
    wrap.innerHTML = '';

    const maxPress  = Math.max(...Object.values(State.keyPressMap), 1);
    const maxErrors = Math.max(...Object.values(State.keyErrorMap), 1);

    KB_LAYOUT.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'kbd-row';

      row.forEach(key => {
        const keyEl  = document.createElement('div');
        keyEl.className = 'kbd-key';
        keyEl.textContent = key.toUpperCase();

        const presses = State.keyPressMap[key]  || 0;
        const errs    = State.keyErrorMap[key]  || 0;
        const errRate = presses > 0 ? errs / presses : 0;

        if (presses === 0) {
          // not touched
        } else if (errRate > 0.5) {
          keyEl.classList.add('heat-error');
        } else if (errs > 0) {
          keyEl.classList.add('heat-4');
        } else {
          const intensity = presses / maxPress;
          if (intensity > 0.6) keyEl.classList.add('heat-3');
          else if (intensity > 0.3) keyEl.classList.add('heat-2');
          else keyEl.classList.add('heat-1');
        }

        // Tooltip
        if (presses > 0) {
          keyEl.title = `${key.toUpperCase()} — ${presses} press${presses>1?'es':''}, ${errs} error${errs!==1?'s':''}`;
        }

        rowEl.appendChild(keyEl);
      });

      wrap.appendChild(rowEl);
    });

    // Space bar row
    const spaceRow = document.createElement('div');
    spaceRow.className = 'kbd-row';
    const spaceKey = document.createElement('div');
    spaceKey.className = 'kbd-key';
    spaceKey.dataset.width = 'space';
    spaceKey.textContent = 'SPACE';
    spaceKey.style.width = '180px';
    const spaceCount = State.keyPressMap[' '] || 0;
    if (spaceCount > 0) spaceKey.classList.add('heat-1');
    spaceRow.appendChild(spaceKey);
    wrap.appendChild(spaceRow);
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 17 — LEADERBOARD (LOCAL + FIREBASE)
  ══════════════════════════════════════════════════════════════ */

  // ── Local Storage Leaderboard ──────────────────────
  function getLocalLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem('kf_leaderboard') || '[]');
    } catch { return []; }
  }

  function saveLocalScore(name, wpm, acc, mode, difficulty) {
    const lb = getLocalLeaderboard();
    lb.push({
      name,
      wpm,
      acc,
      mode,
      difficulty,
      date: new Date().toISOString()
    });
    lb.sort((a, b) => b.wpm - a.wpm);
    const top100 = lb.slice(0, 100);
    localStorage.setItem('kf_leaderboard', JSON.stringify(top100));
    return top100;
  }

  function renderLocalLeaderboard() {
    const lb = getLocalLeaderboard();
    const body = DOM.leaderboardBody;
    if (!lb.length) {
      body.innerHTML = '<p class="loading-msg">No local scores yet. Complete a test!</p>';
      return;
    }

    let html = '<table class="lb-table"><thead><tr>';
    html += '<th class="lb-rank">#</th><th class="lb-name">Name</th>';
    html += '<th class="lb-wpm">WPM</th><th>ACC</th><th>Mode</th><th>Date</th>';
    html += '</tr></thead><tbody>';

    lb.slice(0, 50).forEach((row, i) => {
      const isTop = i < 3 ? 'lb-top' : '';
      const d = new Date(row.date);
      const dateStr = `${d.getMonth()+1}/${d.getDate()}`;
      html += `<tr class="${isTop}">
        <td class="lb-rank">${i + 1}</td>
        <td class="lb-name">${escapeHTML(row.name || 'Anonymous')}</td>
        <td class="lb-wpm">${row.wpm}</td>
        <td>${row.acc}%</td>
        <td>${row.mode || '—'}/${row.difficulty || '—'}</td>
        <td>${dateStr}</td>
      </tr>`;
    });

    html += '</tbody></table>';
    body.innerHTML = html;
  }

  // ── Firebase Leaderboard ───────────────────────────
  /* ════════════════════════════════════════════════════
     FIREBASE INTEGRATION
     ──────────────────────────────────────────────────
     1. Go to https://console.firebase.google.com
     2. Create a project → Add Web App
     3. Enable Firestore + Anonymous Auth
     4. Copy your config JSON and paste it in Settings → Firebase Config
     5. Firestore security rules (allow read; allow write if auth.uid != null):
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /leaderboard/{doc} {
              allow read: if true;
              allow write: if request.auth != null;
            }
          }
        }
  ════════════════════════════════════════════════════ */

  let firebaseApp    = null;
  let firestoreDB    = null;
  let firebaseAuth   = null;
  let currentUser    = null;

  function initFirebase(config) {
    try {
      if (typeof firebase === 'undefined') {
        showToast('Firebase SDK not loaded. See index.html comments to add SDK.');
        return false;
      }
      firebaseApp  = firebase.initializeApp(config, 'keyforge');
      firestoreDB  = firebase.firestore(firebaseApp);
      firebaseAuth = firebase.auth(firebaseApp);

      // Anonymous sign-in
      firebaseAuth.signInAnonymously()
        .then(cred => {
          currentUser = cred.user;
          showToast('✓ Firebase connected!');
          DOM.firebaseNotice.style.display = 'none';
        })
        .catch(err => showToast('Firebase auth error: ' + err.message));

      return true;
    } catch (err) {
      showToast('Firebase init error: ' + err.message);
      return false;
    }
  }

  async function saveGlobalScore(name, wpm, acc, mode, difficulty) {
    if (!firestoreDB || !currentUser) {
      showToast('Firebase not connected. Score saved locally.');
      return null;
    }
    try {
      const doc = await firestoreDB.collection('leaderboard').add({
        name:       name || 'Anonymous',
        wpm,
        acc,
        mode,
        difficulty,
        uid:        currentUser.uid,
        timestamp:  firebase.firestore.FieldValue.serverTimestamp()
      });
      showToast('✓ Score saved globally!');
      return doc.id;
    } catch (err) {
      showToast('Save error: ' + err.message);
      return null;
    }
  }

  async function loadGlobalLeaderboard() {
    if (!firestoreDB) return null;
    try {
      const snap = await firestoreDB.collection('leaderboard')
        .orderBy('wpm', 'desc').limit(50).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      showToast('Load error: ' + err.message);
      return null;
    }
  }

  async function renderGlobalLeaderboard() {
    DOM.leaderboardBody.innerHTML = '<div class="loading-msg">Loading…</div>';
    const rows = await loadGlobalLeaderboard();
    if (!rows) {
      DOM.leaderboardBody.innerHTML = '<p class="loading-msg">Firebase not connected. Check Settings.</p>';
      return;
    }

    let html = '<table class="lb-table"><thead><tr>';
    html += '<th>#</th><th>Name</th><th>WPM</th><th>ACC</th><th>Mode</th>';
    html += '</tr></thead><tbody>';

    rows.forEach((row, i) => {
      const isMe  = currentUser && row.uid === currentUser.uid ? 'lb-me' : '';
      const isTop = i < 3 ? 'lb-top' : '';
      html += `<tr class="${isMe} ${isTop}">
        <td class="lb-rank">${i + 1}</td>
        <td class="lb-name">${escapeHTML(row.name || 'Anon')}</td>
        <td class="lb-wpm">${row.wpm}</td>
        <td>${row.acc}%</td>
        <td>${row.mode || '—'}</td>
      </tr>`;
    });

    html += '</tbody></table>';
    DOM.leaderboardBody.innerHTML = html;
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 18 — HISTORY & PERSONAL STATS
  ══════════════════════════════════════════════════════════════ */
  function saveToHistory(record) {
    let history = getHistory();
    history.push(record);
    if (history.length > 200) history = history.slice(-200);
    localStorage.setItem('kf_history', JSON.stringify(history));
    State.testHistory = history;
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem('kf_history') || '[]'); }
    catch { return []; }
  }

  function renderPersonalStats() {
    const history = getHistory();
    const total   = history.length;
    if (!total) {
      DOM.personalStats.innerHTML = '<p class="loading-msg" style="grid-column:1/-1">No tests yet. Complete a test to see stats.</p>';
      return;
    }

    const wpms  = history.map(r => r.wpm);
    const accs  = history.map(r => r.acc);
    const best  = Math.max(...wpms);
    const avgW  = Math.round(wpms.reduce((a, b) => a + b, 0) / total);
    const avgA  = Math.round(accs.reduce((a, b) => a + b, 0) / total);
    const xp    = parseInt(localStorage.getItem('kf_xp') || '0');
    const recent = history.slice(-5).map(r => r.wpm);
    const trend  = recent.length > 1
      ? (recent[recent.length - 1] - recent[0] > 0 ? '↑' : '↓')
      : '—';

    const stats = [
      { label: 'Tests',     val: total },
      { label: 'Best WPM',  val: best },
      { label: 'Avg WPM',   val: avgW },
      { label: 'Avg Acc',   val: `${avgA}%` },
      { label: 'Total XP',  val: xp },
      { label: 'Trend',     val: trend }
    ];

    DOM.personalStats.innerHTML = stats.map(s =>
      `<div class="pstat-card"><span class="pstat-val">${s.val}</span><span class="pstat-label">${s.label}</span></div>`
    ).join('');

    // WPM history chart
    const chartData = history.slice(-30).map((r, i) => ({ t: i, wpm: r.wpm }));
    renderHistoryChart_local(chartData);
  }

  function renderHistoryChart_local(data) {
    const canvas = DOM.historyChart;
    if (!canvas || !data.length) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = canvas.offsetWidth || 700;
    const h   = 180;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    renderWPMChart_generic(ctx, data, w, h);
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 19 — SOUND ENGINE (Web Audio API)
  ══════════════════════════════════════════════════════════════ */
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!State.soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.frequency.value = 880;
        gain.gain.value = 0.04;
        osc.type = 'sine';
      } else {
        osc.frequency.value = 220;
        gain.gain.value = 0.06;
        osc.type = 'square';
      }

      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.stop(ctx.currentTime + 0.08);
    } catch { /* audio not supported */ }
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 20 — SETTINGS
  ══════════════════════════════════════════════════════════════ */
  function openSettings() {
    DOM.settingsPanel.hidden = false;
    DOM.settingsPanel.removeAttribute('hidden');
    requestAnimationFrame(() => DOM.settingsPanel.classList.add('open'));
    DOM.backdrop.classList.add('active');
  }

  function closeSettings() {
    DOM.settingsPanel.classList.remove('open');
    DOM.backdrop.classList.remove('active');
    setTimeout(() => { DOM.settingsPanel.setAttribute('hidden', ''); }, 300);
  }

  function applySettings() {
    State.fontSize     = parseInt(DOM.fontSizeSlider.value) || 20;
    State.smoothCaret  = DOM.smoothCaret.checked;
    State.soundEnabled = DOM.soundEnabled.checked;
    State.showLiveWpm  = DOM.showLiveWpm.checked;
    State.usePunctuation = DOM.usePunctuation.checked;
    State.useNumbers   = DOM.useNumbers.checked;
    State.customWordCount = parseInt(DOM.customWordCount.value) || 50;
    State.customText   = DOM.customText.value;

    DOM.wordsDisplay.style.fontSize = `${State.fontSize}px`;
    DOM.typingArena.classList.toggle('smooth-caret', State.smoothCaret);
    DOM.liveWpm.style.opacity = State.showLiveWpm ? '1' : '0.3';

    localStorage.setItem('kf_settings', JSON.stringify({
      fontSize: State.fontSize,
      smoothCaret: State.smoothCaret,
      soundEnabled: State.soundEnabled,
      showLiveWpm: State.showLiveWpm,
      usePunctuation: State.usePunctuation,
      useNumbers: State.useNumbers,
      customWordCount: State.customWordCount
    }));
  }

  function loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem('kf_settings') || '{}');
      if (s.fontSize)     { State.fontSize = s.fontSize; DOM.fontSizeSlider.value = s.fontSize; DOM.fontSizeVal.textContent = s.fontSize + 'px'; }
      if (s.smoothCaret   !== undefined) { State.smoothCaret   = s.smoothCaret;   DOM.smoothCaret.checked   = s.smoothCaret; }
      if (s.soundEnabled  !== undefined) { State.soundEnabled  = s.soundEnabled;  DOM.soundEnabled.checked  = s.soundEnabled; }
      if (s.showLiveWpm   !== undefined) { State.showLiveWpm   = s.showLiveWpm;   DOM.showLiveWpm.checked   = s.showLiveWpm; }
      if (s.usePunctuation !== undefined) { State.usePunctuation = s.usePunctuation; DOM.usePunctuation.checked = s.usePunctuation; }
      if (s.useNumbers    !== undefined) { State.useNumbers    = s.useNumbers;    DOM.useNumbers.checked    = s.useNumbers; }
      if (s.customWordCount) { State.customWordCount = s.customWordCount; DOM.customWordCount.value = s.customWordCount; }
    } catch { /* ignore */ }

    State.totalXP = parseInt(localStorage.getItem('kf_xp') || '0');
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 21 — THEME
  ══════════════════════════════════════════════════════════════ */
  function toggleTheme() {
    const html    = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next    = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('kf_theme', next);
  }

  function loadTheme() {
    const saved = localStorage.getItem('kf_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 22 — MODALS
  ══════════════════════════════════════════════════════════════ */
  function openModal(overlay) {
    overlay.hidden = false;
    DOM.backdrop.classList.add('active');
  }

  function closeModal(overlay) {
    overlay.hidden = true;
    if (!DOM.settingsPanel.classList.contains('open')) {
      DOM.backdrop.classList.remove('active');
    }
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 23 — PILL CONTROLS
  ══════════════════════════════════════════════════════════════ */
  function setPillActive(group, key, value) {
    document.querySelectorAll(`[data-${key}]`).forEach(el => {
      el.classList.toggle('active', el.dataset[key] === String(value));
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 24 — SAVE SCORE FLOW
  ══════════════════════════════════════════════════════════════ */
  let pendingScore = null;

  function promptSaveScore() {
    const wpm = parseInt(DOM.resWpm.textContent) || 0;
    const acc = parseInt(DOM.resAcc.textContent) || 0;

    // Validate score
    const cheat = AntiCheat.check(wpm, acc);
    if (cheat.flagged) {
      showToast(`⚠ Score not saved: ${cheat.reason}`);
      return;
    }

    pendingScore = { wpm, acc, mode: State.mode, difficulty: State.difficulty };
    openModal(DOM.saveScoreOverlay);
  }

  async function confirmSave() {
    if (!pendingScore) return;
    const name = DOM.playerName.value.trim() || 'Anonymous';

    // Save locally always
    saveLocalScore(name, pendingScore.wpm, pendingScore.acc, pendingScore.mode, pendingScore.difficulty);

    // Try Firebase
    if (firestoreDB) {
      await saveGlobalScore(name, pendingScore.wpm, pendingScore.acc, pendingScore.mode, pendingScore.difficulty);
    } else {
      showToast('✓ Score saved locally!');
    }

    closeModal(DOM.saveScoreOverlay);
    pendingScore = null;
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 25 — UTILITIES
  ══════════════════════════════════════════════════════════════ */
  function showToast(msg) {
    DOM.toast.textContent = msg;
    DOM.toast.classList.add('show');
    setTimeout(() => DOM.toast.classList.remove('show'), 3000);
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 26 — EVENT BINDINGS
  ══════════════════════════════════════════════════════════════ */
  function bindEvents() {

    // Ghost input
    DOM.ghostInput.addEventListener('input',   handleInput);
    DOM.ghostInput.addEventListener('keydown', handleKeyDown);

    // Typing arena click → focus input
    DOM.typingArena.addEventListener('click', () => {
      if (!State.finished) DOM.ghostInput.focus();
    });

    // Buttons
    DOM.btnReset.addEventListener('click', () => initTest());
    DOM.btnPause.addEventListener('click', togglePause);

    // Settings
    DOM.btnSettings.addEventListener('click', openSettings);
    DOM.closeSettings.addEventListener('click', closeSettings);

    // Theme
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Leaderboard
    DOM.btnLeaderboard.addEventListener('click', () => {
      openModal(DOM.leaderboardOverlay);
      renderLocalLeaderboard();
    });
    DOM.closeLeaderboard.addEventListener('click', () => closeModal(DOM.leaderboardOverlay));

    // Leaderboard tabs
    DOM.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.tab === 'global') {
          renderGlobalLeaderboard();
        } else {
          renderLocalLeaderboard();
        }
      });
    });

    // Stats
    DOM.btnStats.addEventListener('click', () => {
      openModal(DOM.statsOverlay);
      renderPersonalStats();
      setTimeout(() => {
        const h = getHistory();
        const data = h.slice(-30).map((r, i) => ({ t: i, wpm: r.wpm }));
        renderHistoryChart_local(data);
      }, 100);
    });
    DOM.closeStats.addEventListener('click', () => closeModal(DOM.statsOverlay));

    // Save score
    DOM.btnSaveScore.addEventListener('click', promptSaveScore);
    DOM.btnConfirmSave.addEventListener('click', confirmSave);
    DOM.closeSaveScore.addEventListener('click', () => closeModal(DOM.saveScoreOverlay));

    // Play again
    DOM.btnPlayAgain.addEventListener('click', () => initTest());

    // Mode pills
    DOM.modePills.forEach(pill => {
      pill.addEventListener('click', () => {
        State.mode = pill.dataset.mode;
        setPillActive(null, 'mode', State.mode);
        initTest();
      });
    });

    // Difficulty pills
    DOM.diffPills.forEach(pill => {
      pill.addEventListener('click', () => {
        State.difficulty = pill.dataset.diff;
        setPillActive(null, 'diff', State.difficulty);
        initTest();
      });
    });

    // Time pills
    DOM.timePills.forEach(pill => {
      pill.addEventListener('click', () => {
        State.testDuration = parseInt(pill.dataset.time);
        State.timeLeft     = State.testDuration;
        setPillActive(null, 'time', State.testDuration);
        initTest();
      });
    });

    // Settings inputs — live apply
    DOM.fontSizeSlider.addEventListener('input', () => {
      DOM.fontSizeVal.textContent = DOM.fontSizeSlider.value + 'px';
      State.fontSize = parseInt(DOM.fontSizeSlider.value);
      DOM.wordsDisplay.style.fontSize = State.fontSize + 'px';
    });

    [DOM.smoothCaret, DOM.soundEnabled, DOM.showLiveWpm,
     DOM.usePunctuation, DOM.useNumbers].forEach(el => {
      el.addEventListener('change', applySettings);
    });

    DOM.customWordCount.addEventListener('change', applySettings);
    DOM.customText.addEventListener('input', applySettings);

    // Firebase connect
    DOM.btnSaveFirebase.addEventListener('click', () => {
      try {
        const cfg = JSON.parse(DOM.firebaseConfig.value.trim());
        if (initFirebase(cfg)) {
          DOM.firebaseConfig.style.borderColor = 'var(--correct)';
        }
      } catch {
        showToast('Invalid JSON. Check your Firebase config.');
      }
    });

    // Backdrop click → close everything
    DOM.backdrop.addEventListener('click', () => {
      closeSettings();
      closeModal(DOM.leaderboardOverlay);
      closeModal(DOM.statsOverlay);
      closeModal(DOM.saveScoreOverlay);
    });

    // Keyboard shortcut: Tab → restart, Escape → close panels
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeSettings();
        closeModal(DOM.leaderboardOverlay);
        closeModal(DOM.statsOverlay);
        closeModal(DOM.saveScoreOverlay);
      }
    });

    // Resize → re-render charts if results visible
    window.addEventListener('resize', debounce(() => {
      if (!DOM.resultsPanel.hidden) {
        renderWPMChart(State.wpmSamples);
      }
    }, 300));
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 27 — BOOT
  ══════════════════════════════════════════════════════════════ */
  function boot() {
    cacheDOM();
    loadTheme();
    loadSettings();
    bindEvents();
    initTest();

    // Focus input on desktop
    if (window.innerWidth > 768) {
      setTimeout(() => DOM.ghostInput.focus(), 100);
    }

    // Show cached Firebase notice only if not connected
    if (!firestoreDB) {
      DOM.firebaseNotice.style.display = '';
    }

    console.log(
      '%c⌨ KeyForge %cv1.0.0',
      'background:#C6863A;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:bold',
      'background:#1C1A17;color:#C6863A;padding:4px 8px;border-radius:0 4px 4px 0'
    );
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(); // end IIFE
