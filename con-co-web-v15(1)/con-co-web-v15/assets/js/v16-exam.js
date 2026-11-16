(function () {
  const PROFILE_KEY = 'conco_v16_profile';
  const RANK_KEY = 'conco_v16_ranking';
  const EXAM_KEY = 'conco_history_exam_once_v2_' + getProfileId();
  const TIMER_KEY = 'conco_v16_exam_timer_' + getProfileId();
  let timer = readTimer();

  if (!timer.done && !timer.running) {
    timer.running = true;
    timer.lastStart = Date.now();
    saveTimer();
  }
  if (!timer.startedAt) {
    timer.startedAt = Date.now();
    timer.lastStart = Date.now();
    timer.running = true;
    saveTimer();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pauseTimer();
    else resumeTimer();
  });
  window.addEventListener('pagehide', pauseTimer);
  window.addEventListener('pageshow', resumeTimer);

  const check = setInterval(function () {
    let state;
    try { state = JSON.parse(localStorage.getItem(EXAM_KEY)); } catch (_) {}
    if (!state || !state.completed || timer.done) return;

    pauseTimer();
    timer.done = true;
    saveTimer();

    let profile = {};
    try { profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; } catch (_) {}
    const elapsed = Math.max(1, Math.ceil(timer.elapsedMs / 1000));
    let rows = [];
    try { rows = JSON.parse(localStorage.getItem(RANK_KEY)) || []; } catch (_) {}

    rows = rows.filter(function (row) { return row.profileId !== getProfileId(); });
    rows.push({
      profileId: getProfileId(),
      displayName: profile.displayName || 'Khách',
      className: profile.className || '—',
      score: Math.max(0, Math.min(30, Number(state.score) || 0)),
      seconds: elapsed,
      savedAt: new Date().toISOString()
    });
    rows.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.seconds - b.seconds;
    });

    try { localStorage.setItem(RANK_KEY, JSON.stringify(rows.slice(0, 100))); } catch (_) {}
    clearInterval(check);
    showResultNotice();
  }, 500);

  function getProfileId() {
    try {
      const profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
      return profile.id || 'guest';
    } catch (_) { return 'guest'; }
  }

  function readTimer() {
    try { return JSON.parse(localStorage.getItem(TIMER_KEY)) || { elapsedMs: 0, running: false, done: false }; }
    catch (_) { return { elapsedMs: 0, running: false, done: false }; }
  }

  function saveTimer() {
    try { localStorage.setItem(TIMER_KEY, JSON.stringify(timer)); } catch (_) {}
  }

  function pauseTimer() {
    if (!timer.running || timer.done) return;
    timer.elapsedMs += Math.max(0, Date.now() - timer.lastStart);
    timer.running = false;
    saveTimer();
  }

  function resumeTimer() {
    if (timer.running || timer.done) return;
    timer.lastStart = Date.now();
    timer.running = true;
    saveTimer();
  }

  function showResultNotice() {
    const note = document.createElement('p');
    note.className = 'v16-hint';
    note.textContent = 'Đã lưu điểm và thời gian làm bài vào bảng xếp hạng trên thiết bị này.';
    const card = document.querySelector('.exam-card');
    if (card) card.appendChild(note);
  }
})();
