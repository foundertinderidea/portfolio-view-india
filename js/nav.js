/**
 * Mobile nav toggle
 */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const list = document.querySelector('.nav-list');
  if (!toggle || !list) return;

  toggle.addEventListener('click', function () {
    const open = list.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close on link click (mobile)
  list.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      list.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
