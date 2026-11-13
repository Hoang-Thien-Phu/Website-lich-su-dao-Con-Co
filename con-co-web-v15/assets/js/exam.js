const baseQuestions = window.CON_CO_QUESTIONS || [];
const MEMORY_KEY = 'conco_history_memory_v14';
const EXAM_KEY = 'conco_history_exam_once_v2';
const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
const $ = (selector) => document.querySelector(selector);
const questionText = $('#examQuestion');
const options = $('#examOptions');
const feedback = $('#examFeedback');
const nextButton = $('#nextExam');
const counter = $('#examCounter');
const progress = $('#examProgress');
const total = baseQuestions.length;

function randomizeExam() {
  return shuffle(baseQuestions).map((question) => {
    const correctText = typeof question.correct === 'string'
      ? question.correct
      : question.answers[question.correct];
    return {
      question: question.question,
      answers: shuffle(question.answers.map((text) => ({ text, correct: text === correctText }))),
    };
  });
}
function newState() {
  return { version: 2, questions: randomizeExam(), current: 0, score: 0, answered: false,
    selectedIndex: null, completed: false, resultSaved: false };
}
function readState() {
  try {
    const stored = JSON.parse(localStorage.getItem(EXAM_KEY));
    if (stored && stored.version === 2 && Array.isArray(stored.questions) && stored.questions.length === total) return stored;
  } catch (_) {}
  const fresh = newState();
  try { localStorage.setItem(EXAM_KEY, JSON.stringify(fresh)); } catch (_) {  }
  return fresh;
}
let state = readState();
let questions = state.questions;
function writeState(next = state) {
  state = next;
  try { localStorage.setItem(EXAM_KEY, JSON.stringify(state)); } catch (_) {  }
}

function renderBest() {
  let best = 0;
  try {
    const memory = JSON.parse(localStorage.getItem(MEMORY_KEY)) || {};
    if (memory.quizVersion === 32 && Number.isFinite(Number(memory.quizBest))) best = Math.min(total, Number(memory.quizBest));
  } catch (_) {}
  if ($('#bestScore')) $('#bestScore').textContent = state.completed ? String(state.score) : String(best);
  if ($('#bestTotal')) $('#bestTotal').textContent = `/${total}`;
}
function render() {
  questions = state.questions;
  renderBest();
  if (state.completed) { renderCompleted(); return; }
  const item = questions[state.current];
  if (!item) { state.completed = true; writeState(state); renderCompleted(); return; }
  counter.textContent = `CÂU ${String(state.current + 1).padStart(2, '0')} / ${total}`;
  progress.style.width = `${((state.current + 1) / total) * 100}%`;
  questionText.textContent = item.question;
  feedback.textContent = '';
  nextButton.disabled = !state.answered;
  nextButton.textContent = state.current === total - 1 ? 'NỘP BÀI' : 'CÂU TIẾP →';
  options.innerHTML = '';
  item.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'exam-option';
    button.type = 'button';
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer.text}`;
    button.disabled = state.answered;
    if (state.answered && answer.correct) button.classList.add('correct');
    if (state.answered && index === state.selectedIndex && !answer.correct) button.classList.add('wrong');
    button.addEventListener('click', () => choose(index));
    options.appendChild(button);
  });
  if (state.answered) {
    const selected = item.answers[state.selectedIndex];
    feedback.textContent = selected && selected.correct ? 'Chính xác.' : 'Chưa đúng. Đáp án đúng đã được đánh dấu.';
  }
}
function choose(index) {
  if (state.answered || state.completed) return;
  const answer = questions[state.current].answers[index];
  state.answered = true;
  state.selectedIndex = index;
  if (answer && answer.correct) state.score += 1;
  writeState(state);
  render();
}
function saveResultOnce() {
  if (state.resultSaved) return;
  try {
    const memory = JSON.parse(localStorage.getItem(MEMORY_KEY)) || {};
    memory.quizVersion = 32;
    memory.quizBest = state.score;
    memory.quizLast = state.score;
    memory.quizAttempts = 1;
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch (_) {}
  state.resultSaved = true;
  writeState(state);
}
function finish() {
  state.completed = true;
  writeState(state);
  saveResultOnce();
  renderCompleted();
}
function renderCompleted() {
  counter.textContent = 'ĐÃ HOÀN THÀNH';
  progress.style.width = '100%';
  questionText.textContent = 'Bạn đã hoàn thành bài trắc nghiệm.';
  options.innerHTML = `<div class="exam-result"><strong>${state.score}/${total}</strong><span>Kết quả của lượt làm duy nhất trên trình duyệt này.</span></div>`;
  feedback.textContent = 'Bài làm và điểm số đã được lưu. Bài kiểm tra không có nút làm lại.';
  nextButton.disabled = true;
  nextButton.hidden = true;
  renderBest();
}
nextButton.addEventListener('click', () => {
  if (!state.answered || state.completed) return;
  if (state.current >= total - 1) { finish(); return; }
  state.current += 1;
  state.answered = false;
  state.selectedIndex = null;
  writeState(state);
  render();
});
$('#exitExam')?.addEventListener('click', () => {
  location.href = location.protocol === 'file:' ? 'home.html' : '../home/';
});
if (total !== 30) {
  questionText.textContent = `Lỗi dữ liệu: bộ câu hỏi cần có 30 câu, hiện có ${total}.`;
  options.innerHTML = '';
  nextButton.disabled = true;
} else {
  if (state.completed) saveResultOnce();
  render();
}
