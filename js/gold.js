/**
 * Gold rates — loads data/gold-rates.json
 */
(function () {
  const container = document.getElementById('city-cards');
  if (!container) return;

  function formatRate(n) {
    if (n == null) return '—';
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  function render(data) {
    const cities = data.cities || {};
    const order = ['Bangalore', 'Mumbai', 'Kolkata', 'Hyderabad'];
    container.innerHTML = order.map(function (name) {
      const rates = cities[name] || {};
      return (
        '<div class="city-card">' +
        '<h3>' + name + '</h3>' +
        '<div class="rate-row"><span class="rate-label">22K</span><span class="rate-value">' + formatRate(rates['22k']) + '</span></div>' +
        '<div class="rate-row"><span class="rate-label">24K</span><span class="rate-value">' + formatRate(rates['24k']) + '</span></div>' +
        '</div>'
      );
    }).join('');
  }

  fetch('data/gold-rates.json')
    .then(function (res) {
      if (!res.ok) throw new Error('fetch failed');
      return res.json();
    })
    .then(render)
    .catch(function () {
      render({
        cities: {
          Bangalore: { '22k': 6850, '24k': 7470 },
          Mumbai: { '22k': 6880, '24k': 7500 },
          Kolkata: { '22k': 6820, '24k': 7440 },
          Hyderabad: { '22k': 6840, '24k': 7460 }
        }
      });
    });
})();
