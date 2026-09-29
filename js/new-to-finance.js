/**
 * New To Finance — Emergency fund, IPO savings, age-based calculator
 * Persists inputs to localStorage: portfolioView_ntf_v1
 */
(function () {
  const STORAGE_KEY = 'portfolioView_ntf_v1';

  // Allocation by age band (directional, category-level)
  const ALLOCATIONS = {
    '20-25': { sip: 45, equity: 35, debt: 10, gold: 10 },
    '25-30': { sip: 40, equity: 30, debt: 15, gold: 15 },
    '30-40': { sip: 30, equity: 25, debt: 25, gold: 20 },
    '40-50': { sip: 20, equity: 20, debt: 35, gold: 25 },
    '50+':   { sip: 10, equity: 15, debt: 45, gold: 30 }
  };

  const COLORS = {
    sip: '#2563eb',
    equity: '#8b5cf6',
    debt: '#06b6d4',
    gold: '#f59e0b'
  };

  const LABELS = {
    sip: 'SIP',
    equity: 'Equity',
    debt: 'Debt',
    gold: 'Gold'
  };

  // ---- Helpers ----
  function formatINR(n) {
    if (n == null || isNaN(n)) return '₹0';
    const abs = Math.abs(Math.round(n));
    const str = abs.toString();
    let result = '';
    let count = 0;
    for (let i = str.length - 1; i >= 0; i--) {
      count++;
      result = str[i] + result;
      if (i > 0) {
        if (count === 3) {
          result = ',' + result;
          count = 0;
        } else if (count === 2 && result.replace(/,/g, '').length > 3) {
          result = ',' + result;
          count = 0;
        }
      }
    }
    // Standard Indian grouping
    const s = Math.round(n).toString();
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    const formatted = rest
      ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3
      : last3;
    return '₹' + formatted;
  }

  function parseNum(val) {
    if (val == null || val === '') return 0;
    const cleaned = String(val).replace(/[₹,\s]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  // ---- Emergency Fund ----
  const expenseInput = document.getElementById('monthly-expenses');
  const monthsInput = document.getElementById('months-cover');
  const currentSavingsInput = document.getElementById('current-emergency');
  const targetEl = document.getElementById('emergency-target');
  const progressFill = document.getElementById('emergency-progress');
  const gapEl = document.getElementById('emergency-gap');

  function updateEmergency() {
    const expenses = parseNum(expenseInput && expenseInput.value);
    const months = Math.min(6, Math.max(3, parseNum(monthsInput && monthsInput.value) || 3));
    if (monthsInput) monthsInput.value = months;
    const target = expenses * months;
    const current = parseNum(currentSavingsInput && currentSavingsInput.value);

    if (targetEl) targetEl.textContent = formatINR(target);

    if (progressFill) {
      const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
      progressFill.style.width = pct + '%';
    }

    if (gapEl) {
      const gap = Math.max(0, target - current);
      gapEl.textContent = gap > 0
        ? 'Gap remaining: ' + formatINR(gap)
        : target > 0 ? 'Target reached' : '';
    }

    const state = loadState();
    state.expenses = expenses;
    state.months = months;
    state.currentEmergency = current;
    saveState(state);
  }

  // ---- IPO Savings ----
  const ipoBalanceInput = document.getElementById('ipo-balance');
  const ipoAppAmountInput = document.getElementById('ipo-app-amount');
  const ipoAppsEl = document.getElementById('ipo-apps-count');

  function updateIpo() {
    const balance = parseNum(ipoBalanceInput && ipoBalanceInput.value);
    const appAmt = parseNum(ipoAppAmountInput && ipoAppAmountInput.value) || 15000;
    if (ipoAppAmountInput && !ipoAppAmountInput.value) ipoAppAmountInput.value = 15000;

    const apps = appAmt > 0 ? Math.floor(balance / appAmt) : 0;
    if (ipoAppsEl) {
      ipoAppsEl.textContent = apps + (apps === 1 ? ' application' : ' applications');
    }

    const state = loadState();
    state.ipoBalance = balance;
    state.ipoAppAmount = appAmt;
    saveState(state);
  }

  // ---- Age calculator + pie ----
  let currentAge = '20-25';
  const ageTabs = document.querySelectorAll('.age-tab');
  const monthlyInvestInput = document.getElementById('monthly-invest');
  const pieCanvas = document.getElementById('pie-chart');
  const legendEl = document.getElementById('pie-legend');
  const ageLabelEl = document.getElementById('age-label');

  function drawPie(alloc) {
    if (!pieCanvas) return;
    const ctx = pieCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    pieCanvas.width = size * dpr;
    pieCanvas.height = size * dpr;
    pieCanvas.style.width = size + 'px';
    pieCanvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 8;

    const keys = ['sip', 'equity', 'debt', 'gold'];
    let start = -Math.PI / 2;

    keys.forEach(function (k) {
      const slice = (alloc[k] / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = COLORS[k];
      ctx.fill();
      start += slice;
    });

    // Center hole
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  function renderLegend(alloc) {
    if (!legendEl) return;
    const keys = ['sip', 'equity', 'debt', 'gold'];
    legendEl.innerHTML = keys.map(function (k) {
      return (
        '<li>' +
        '<span class="legend-dot" style="background:' + COLORS[k] + '"></span>' +
        '<span>' + LABELS[k] + '</span>' +
        '<span class="legend-value">' + alloc[k] + '%</span>' +
        '</li>'
      );
    }).join('');
  }

  function updateAgeCalc() {
    const alloc = ALLOCATIONS[currentAge] || ALLOCATIONS['20-25'];
    if (ageLabelEl) ageLabelEl.textContent = currentAge;
    drawPie(alloc);
    renderLegend(alloc);

    const state = loadState();
    state.age = currentAge;
    state.monthlyInvest = parseNum(monthlyInvestInput && monthlyInvestInput.value);
    saveState(state);
  }

  // ---- Init from storage ----
  function init() {
    const state = loadState();

    if (expenseInput && state.expenses != null) expenseInput.value = state.expenses || '';
    if (monthsInput) monthsInput.value = state.months || 3;
    if (currentSavingsInput && state.currentEmergency != null) {
      currentSavingsInput.value = state.currentEmergency || '';
    }
    if (ipoBalanceInput) {
      ipoBalanceInput.value = state.ipoBalance != null ? state.ipoBalance : 30000;
    }
    if (ipoAppAmountInput) {
      ipoAppAmountInput.value = state.ipoAppAmount != null ? state.ipoAppAmount : 15000;
    }
    if (monthlyInvestInput && state.monthlyInvest != null) {
      monthlyInvestInput.value = state.monthlyInvest || '';
    }
    if (state.age && ALLOCATIONS[state.age]) {
      currentAge = state.age;
    }

    ageTabs.forEach(function (tab) {
      const age = tab.getAttribute('data-age');
      if (age === currentAge) tab.classList.add('active');
      else tab.classList.remove('active');
      tab.addEventListener('click', function () {
        ageTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentAge = age;
        updateAgeCalc();
      });
    });

    if (expenseInput) expenseInput.addEventListener('input', updateEmergency);
    if (monthsInput) monthsInput.addEventListener('input', updateEmergency);
    if (currentSavingsInput) currentSavingsInput.addEventListener('input', updateEmergency);
    if (ipoBalanceInput) ipoBalanceInput.addEventListener('input', updateIpo);
    if (ipoAppAmountInput) ipoAppAmountInput.addEventListener('input', updateIpo);
    if (monthlyInvestInput) monthlyInvestInput.addEventListener('input', updateAgeCalc);

    updateEmergency();
    updateIpo();
    updateAgeCalc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
