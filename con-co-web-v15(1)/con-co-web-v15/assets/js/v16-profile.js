(function () {
  const KEY = 'conco_v16_profile';
  const form = document.getElementById('v16ProfileForm');
  if (!form) return;

  const fields = ['displayName', 'fullName', 'className', 'area'];
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) {}

  fields.forEach(function (key) {
    const input = document.getElementById(key);
    if (input && saved[key]) input.value = saved[key];
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const profile = {};
    fields.forEach(function (key) {
      profile[key] = document.getElementById(key).value.trim();
    });

    if (!profile.displayName || !profile.fullName || !profile.className) {
      document.getElementById('v16ProfileStatus').textContent = 'Vui lòng điền các mục bắt buộc.';
      return;
    }

    profile.id = saved.id || ('p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
    profile.savedAt = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(profile));
      saved = profile;
      document.getElementById('v16ProfileStatus').textContent = 'Đã lưu hồ sơ trên thiết bị này.';
    } catch (_) {
      document.getElementById('v16ProfileStatus').textContent = 'Không thể lưu. Bộ nhớ trình duyệt có thể đã đầy.';
    }
  });

  const clear = document.getElementById('v16ClearProfile');
  if (clear) {
    clear.addEventListener('click', function () {
      localStorage.removeItem(KEY);
      document.getElementById('v16ProfileForm').reset();
      document.getElementById('v16ProfileStatus').textContent = 'Đã xóa hồ sơ trên thiết bị này.';
    });
  }
})();
