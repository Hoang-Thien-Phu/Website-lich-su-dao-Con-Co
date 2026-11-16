(function () {
  const KEY = 'conco_v16_ranking';
  const body = document.getElementById('v16RankingBody');
  const status = document.getElementById('v16RankingStatus');
  if (!body) return;

  let rows = [];
  try { rows = JSON.parse(localStorage.getItem(KEY)) || []; } catch (_) {}
  rows.sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return a.seconds - b.seconds;
  });

  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="5" class="v16-empty">Chưa có kết quả nào trên thiết bị này. Hãy lưu hồ sơ rồi làm bài trắc nghiệm.</td></tr>';
  } else {
    body.innerHTML = '';
    rows.forEach(function (row, index) {
      const tr = document.createElement('tr');
      const values = [
        String(index + 1),
        row.displayName || 'Học sinh',
        row.className || '—',
        String(row.score) + '/30',
        formatTime(row.seconds)
      ];
      values.forEach(function (value, col) {
        const td = document.createElement('td');
        td.textContent = value;
        if (col === 0) td.className = 'rank-number';
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  if (status) {
    status.textContent = 'Đang hiển thị ' + rows.length + ' kết quả lưu trên trình duyệt này; không phải bảng xếp hạng toàn trường.';
  }

  const clear = document.getElementById('v16ClearRanking');
  if (clear) {
    clear.addEventListener('click', function () {
      if (!confirm('Xóa toàn bộ bảng điểm lưu trên thiết bị này?')) return;
      localStorage.removeItem(KEY);
      location.reload();
    });
  }

  function formatTime(seconds) {
    const value = Math.max(0, Number(seconds) || 0);
    const min = Math.floor(value / 60);
    const sec = value % 60;
    return min + ' phút ' + String(sec).padStart(2, '0') + ' giây';
  }
})();
