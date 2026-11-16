(function () {
  const nav = document.querySelector('.site-header .nav');
  if (!nav || nav.querySelector('.nav-more')) return;

  const scriptUrl = new URL(document.currentScript.src, location.href);
  const rootUrl = new URL('../../', scriptUrl);
  const links = [
    ['profile.html', 'Hồ sơ người học'],
    ['ranking.html', 'Bảng xếp hạng'],
    ['gallery.html', 'Thư viện ảnh'],
    ['unity.html', 'Không gian Unity']
  ];

  const menu = document.createElement('details');
  menu.className = 'nav-more';
  const summary = document.createElement('summary');
  summary.textContent = 'Tiện ích';
  const box = document.createElement('div');
  box.className = 'nav-more-menu';

  links.forEach(function (item) {
    const a = document.createElement('a');
    a.href = new URL(item[0], rootUrl).href;
    a.textContent = item[1];
    if (location.pathname.endsWith('/' + item[0]) || location.pathname.endsWith(item[0])) {
      a.classList.add('active');
    }
    box.appendChild(a);
  });

  menu.appendChild(summary);
  menu.appendChild(box);
  nav.appendChild(menu);
})();
