(function () {
  if (location.protocol !== 'file:') return;
  const map = {
    '/home/': 'home.html',
    '/journey/': 'journey.html',
    '/document/': 'document.html',
    '/documentory/': 'document.html',
    '/documentary/': 'document.html',
    '/exam/': 'exam.html',
    '/video/': 'document.html',
    '/game/': 'game.html',
    '/research/': 'research.html',
    '/sources/': 'sources.html',
    '/progress/': 'progress.html'
  };
  function patchLinks() {
    document.querySelectorAll('a[href]').forEach((a) => {
      if (a.target === '_blank') return;
      const raw = a.getAttribute('href') || '';
      if (!raw.startsWith('../')) return;
      try {
        const url = new URL(raw, location.href);
        const key = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
        if (map[key]) a.setAttribute('href', `../${map[key]}${url.search}${url.hash}`);
      } catch (_) {}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', patchLinks, {once:true});
  else patchLinks();
})();
