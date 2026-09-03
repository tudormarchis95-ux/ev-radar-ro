/* Comparație europeană: numai date cu sursă și metodologie verificabile. */

const state = { comparison: null };
const monthNames = {
    '01': 'Ianuarie', '02': 'Februarie', '03': 'Martie', '04': 'Aprilie',
    '05': 'Mai', '06': 'Iunie', '07': 'Iulie', '08': 'August',
    '09': 'Septembrie', '10': 'Octombrie', '11': 'Noiembrie', '12': 'Decembrie'
};
const monthCodes = {
    '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR', '05': 'MAY', '06': 'JUN',
    '07': 'JUL', '08': 'AUG', '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
};

function animateElementValue(id, endValue, duration = 600) {
    const element = document.getElementById(id);
    if (!element) return;
    const start = Number(String(element.textContent).replace(/[^0-9-]/g, '')) || 0;
    const startTime = performance.now();
    const update = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(start + (endValue - start) * eased).toLocaleString('ro-RO');
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

function validatePeriod(period) {
    if (!period || !period.source || !period.sourceUrl?.startsWith('https://') || !Array.isArray(period.countries)) return false;
    const codes = new Set();
    return period.countries.every(country => {
        const valid = country.code && !codes.has(country.code)
            && Number.isInteger(country.bev) && Number.isInteger(country.total)
            && country.bev >= 0 && country.total > 0 && country.bev <= country.total;
        codes.add(country.code);
        return valid;
    });
}

async function loadComparison() {
    const response = await fetch(`rapoarte/european_comparison.json?t=${Date.now()}`);
    if (!response.ok) throw new Error('Setul european verificat nu este disponibil.');
    const data = await response.json();
    if (data.schemaVersion !== 1 || !data.periods) throw new Error('Schema comparației europene este invalidă.');
    for (const [key, period] of Object.entries(data.periods)) {
        if (!/^20\d{2}-\d{2}$/.test(key) || !validatePeriod(period)) {
            throw new Error(`Perioada europeană ${key} nu trece validarea.`);
        }
    }
    state.comparison = data;
}

function configurePeriodSelectors() {
    const periods = Object.keys(state.comparison.periods).sort();
    const yearSelect = document.getElementById('public-year-select');
    const monthSelect = document.getElementById('public-month-select');
    const years = [...new Set(periods.map(period => period.slice(0, 4)))].sort().reverse();

    yearSelect.innerHTML = '';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    const latest = periods[periods.length - 1];
    yearSelect.value = latest.slice(0, 4);
    updateMonthOptions(latest.slice(5));
    yearSelect.addEventListener('change', () => {
        updateMonthOptions();
        renderComparison();
    });
    monthSelect.addEventListener('change', renderComparison);
}

function updateMonthOptions(preferredMonth) {
    const year = document.getElementById('public-year-select').value;
    const monthSelect = document.getElementById('public-month-select');
    const months = Object.keys(state.comparison.periods)
        .filter(period => period.startsWith(`${year}-`))
        .map(period => period.slice(5))
        .sort();
    monthSelect.innerHTML = '';
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = `${month}|${monthCodes[month]}`;
        option.textContent = monthNames[month];
        monthSelect.appendChild(option);
    });
    const selected = preferredMonth && months.includes(preferredMonth) ? preferredMonth : months[months.length - 1];
    if (selected) monthSelect.value = `${selected}|${monthCodes[selected]}`;
}

function selectedPeriodKey() {
    const year = document.getElementById('public-year-select').value;
    const month = document.getElementById('public-month-select').value.split('|')[0];
    return year && month ? `${year}-${month}` : null;
}

function renderBarList(containerId, countries, metric, formatter) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const maximum = Math.max(...countries.map(country => metric(country)), 1);
    countries.forEach(country => {
        const item = document.createElement('div');
        item.className = 'bar-item';

        const label = document.createElement('div');
        label.className = 'country-label';
        const flag = document.createElement('span');
        flag.className = 'country-flag';
        flag.textContent = country.flag;
        const name = document.createElement('span');
        name.textContent = country.name;
        label.append(flag, name);

        const track = document.createElement('div');
        track.className = 'bar-track';
        const fill = document.createElement('div');
        fill.className = `bar-fill${country.code === 'RO' ? ' highlight' : ''}`;
        fill.style.width = `${(metric(country) / maximum * 100).toFixed(1)}%`;
        track.appendChild(fill);

        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = formatter(metric(country));
        item.append(label, track, value);
        container.appendChild(item);
    });
}

function renderComparison() {
    const key = selectedPeriodKey();
    const period = key && state.comparison.periods[key];
    if (!period) return;

    const countries = period.countries.map(country => ({
        ...country,
        share: country.bev / country.total * 100
    }));
    const byShare = [...countries].sort((a, b) => b.share - a.share);
    const byVolume = [...countries].sort((a, b) => b.bev - a.bev);
    renderBarList('market-share-list', byShare, country => country.share, value => `${value.toFixed(2)}%`);
    renderBarList('volumes-list', byVolume, country => country.bev, value => value.toLocaleString('ro-RO'));

    const [year, month] = key.split('-');
    const periodLabel = `${monthNames[month]} ${year}`;
    document.getElementById('divider-month-name').textContent = periodLabel;
    document.getElementById('comp-hero-month-name').textContent = periodLabel.toLowerCase();

    const romania = countries.find(country => country.code === 'RO');
    if (romania) {
        animateElementValue('val-comp-hero-volume', romania.bev);
        animateElementValue('ro-comp-volume', romania.bev);
        document.getElementById('ro-comp-share').textContent = `${romania.share.toFixed(2)}%`;
        const status = romania.share >= 20 ? 'Piață matură' : romania.share >= 10 ? 'În tranziție' : 'Adopție în dezvoltare';
        document.getElementById('ro-adoption-status').textContent = status;
    }

    const leader = byShare[0];
    document.getElementById('comparison-leader').textContent = `${leader.name} ${leader.flag}`;
    document.getElementById('comparison-leader-note').textContent =
        `${leader.share.toFixed(2)}% din autoturismele noi au fost BEV în ${periodLabel.toLowerCase()}.`;

    const sourceNote = document.getElementById('comparison-source-note');
    sourceNote.innerHTML = '';
    const link = document.createElement('a');
    link.href = period.sourceUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = `Sursa: ${period.source}, publicată la ${period.publishedAt}`;
    sourceNote.appendChild(link);
    if (period.provisional) sourceNote.append(' · date provizorii');
}

function showError(error) {
    const message = error instanceof Error ? error.message : String(error);
    for (const id of ['market-share-list', 'volumes-list']) {
        const container = document.getElementById(id);
        container.textContent = message;
        container.style.color = 'var(--warning-color)';
    }
    document.getElementById('comparison-source-note').textContent =
        'Nu afișăm estimări sau luni copiate. Comparația revine când există date verificate.';
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadComparison();
        configurePeriodSelectors();
        renderComparison();
    } catch (error) {
        console.error('[Comparație]', error);
        showError(error);
    }
});
