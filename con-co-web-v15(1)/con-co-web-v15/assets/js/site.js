var memoryKey = 'conco_history_memory_v14';
var defaultMemory = {
  docsRead: [],
  quizBest: 0,
  quizLast: 0,
  quizAttempts: 0,
  quizVersion: 32,
  videoNote: '',
  theme: 'light',
  visits: 0,
  lastVisit: ''
};

function loadMemory() {
  try {
    var saved = JSON.parse(localStorage.getItem(memoryKey));
    if (!saved) saved = {};
    for (var key in defaultMemory) {
      if (saved[key] === undefined) saved[key] = defaultMemory[key];
    }
    if (saved.quizVersion !== 32) {
      saved.quizBest = 0;
      saved.quizLast = 0;
      saved.quizAttempts = 0;
      saved.quizVersion = 32;
      localStorage.setItem(memoryKey, JSON.stringify(saved));
    }
    return saved;
  } catch (error) {
    return Object.assign({}, defaultMemory);
  }
}

function saveMemory(changes) {
  var saved = loadMemory();
  for (var key in changes) saved[key] = changes[key];
  try {
    localStorage.setItem(memoryKey, JSON.stringify(saved));
  } catch (error) {}
  return saved;
}

window.loadMemory = loadMemory;
window.saveMemory = saveMemory;

function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  var button = document.getElementById('themeToggle');
  if (button) {
    button.textContent = theme === 'dark' ? 'Sáng' : 'Tối';
    button.title = theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
  }
}

var themeButton = document.getElementById('themeToggle');
var memory = loadMemory();
setTheme(memory.theme || 'light');

if (themeButton) {
  themeButton.addEventListener('click', function () {
    var current = loadMemory().theme;
    var next = current === 'dark' ? 'light' : 'dark';
    saveMemory({ theme: next });
    setTheme(next);
  });
}

var today = new Date().toDateString();
var oldMemory = loadMemory();
if (oldMemory.lastVisit !== today) {
  saveMemory({ visits: oldMemory.visits + 1, lastVisit: today });
}

if (document.body.getAttribute('data-page') === 'progress') {
  var progressMemory = loadMemory();
  var docs = document.getElementById('statDocs');
  var quiz = document.getElementById('statQuiz');
  var attempts = document.getElementById('statAttempts');
  var visits = document.getElementById('statVisits');
  var note = document.getElementById('latestNote');
  if (docs) docs.textContent = progressMemory.docsRead.length + '/5';
  if (quiz) quiz.textContent = Math.min(30, Number(progressMemory.quizBest) || 0) + '/30';
  if (attempts) attempts.textContent = progressMemory.quizAttempts;
  if (visits) visits.textContent = Math.max(1, progressMemory.visits);
  if (note) note.textContent = progressMemory.videoNote || 'Chưa có ghi chú video.';
  var clearButton = document.getElementById('clearMemory');
  if (clearButton) {
    clearButton.addEventListener('click', function () {
      saveMemory({ docsRead: [], videoNote: '', visits: 0, lastVisit: '', theme: loadMemory().theme });
      location.reload();
    });
  }
}
