/**
 * IPO table — loads data/ipos.json
 */
(function () {
  const tbody = document.getElementById('ipo-tbody');
  const loading = document.getElementById('ipo-loading');
  const empty = document.getElementById('ipo-empty');
  const tableWrap = document.getElementById('ipo-table-wrap');

  function statusClass(s) {
    const map = {
      Upcoming: 'status-upcoming',
      Open: 'status-open',
      Closed: 'status-closed',
      Listed: 'status-listed'
    };
    return map[s] || 'status-closed';
  }

  function formatDate(d) {
    if (!d) return '—';
    try {
      const dt = new Date(d + 'T00:00:00');
      return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return d;
    }
  }

  function formatGmp(gmp, pct) {
    if (gmp == null) return '—';
    const sign = gmp > 0 ? '+' : '';
    const pctStr = pct != null ? ' (' + sign + pct + '%)' : '';
    return '₹' + gmp + pctStr;
  }

  function render(rows) {
    if (loading) loading.style.display = 'none';

    if (!rows || rows.length === 0) {
      if (empty) empty.style.display = 'block';
      if (tableWrap) tableWrap.style.display = 'none';
      return;
    }

    if (empty) empty.style.display = 'none';
    if (tableWrap) tableWrap.style.display = 'block';

    tbody.innerHTML = rows.map(function (r) {
      return (
        '<tr>' +
        '<td>' + (r.company || '—') + '</td>' +
        '<td>' + (r.priceBand || '—') + '</td>' +
        '<td>' + formatGmp(r.gmp, r.gmpPct) + '</td>' +
        '<td>' + formatDate(r.opens) + '</td>' +
        '<td>' + formatDate(r.closes) + '</td>' +
        '<td><span class="status-tag ' + statusClass(r.status) + '">' + (r.status || '—') + '</span></td>' +
        '</tr>'
      );
    }).join('');
  }

  if (loading) loading.style.display = 'block';

  fetch('data/ipos.json')
    .then(function (res) {
      if (!res.ok) throw new Error('fetch failed');
      return res.json();
    })
    .then(render)
    .catch(function () {
      render([
        {
          company: 'Sample Tech Ltd',
          priceBand: '₹180 – 190',
          gmp: 42,
          gmpPct: 22.1,
          opens: '2026-10-06',
          closes: '2026-10-08',
          status: 'Upcoming'
        },
        {
          company: 'Green Energy Co',
          priceBand: '₹95 – 100',
          gmp: 8,
          gmpPct: 8.0,
          opens: '2026-09-28',
          closes: '2026-09-30',
          status: 'Open'
        }
      ]);
    });
})();
