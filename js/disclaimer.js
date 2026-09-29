/**
 * Disclaimer modal — Overview/Home only.
 * Shows once per day; acceptance stored in localStorage.
 */
(function () {
  const STORAGE_KEY = 'pv_disclaimer_accepted_date';
  const overlay = document.getElementById('disclaimer-overlay');
  if (!overlay) return;

  const checkbox = document.getElementById('disclaimer-check');
  const btn = document.getElementById('disclaimer-got-it');
  const today = new Date().toISOString().slice(0, 10);

  function alreadyAccepted() {
    try {
      return localStorage.getItem(STORAGE_KEY) === today;
    } catch {
      return false;
    }
  }

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, today);
    } catch (_) {}
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (alreadyAccepted()) {
    overlay.remove();
    return;
  }

  // Show modal
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';

  checkbox.addEventListener('change', function () {
    btn.disabled = !checkbox.checked;
  });

  btn.addEventListener('click', function () {
    if (checkbox.checked) accept();
  });
})();
