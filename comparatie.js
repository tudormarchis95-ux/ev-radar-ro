/* Comparație europeană: date locale, surse explicite și perioade comparabile. */

const state = {
    comparison: null,
    map: null,
    projectionExtent: null,
    metric: 'registrations',
    group: 'regional',
    selectedCode: 'RO'
};

const monthNames = {
    '01': 'Ianuarie', '02': 'Februarie', '03': 'Martie', '04': 'Aprilie',
    '05': 'Mai', '06': 'Iunie', '07': 'Iulie', '08': 'August',
    '09': 'Septembrie', '10': 'Octombrie', '11': 'Noiembrie', '12': 'Decembrie'
};

const monthCodes = {
    '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR', '05': 'MAY', '06': 'JUN',
    '07': 'JUL', '08': 'AUG', '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
};

const smallCountryMarkers = new Set(['HR', 'NL', 'SI', 'SK']);
const mapViewport = {width: 920, height: 620};
const europeProjection = {centerLon: 10, centerLat: 52, padding: 20};
const countryAnchors = {
    AT: [14.1, 47.6], BG: [25.3, 42.7], CZ: [15.4, 49.8], DE: [10.4, 51.1],
    EE: [25.5, 58.6], ES: [-3.7, 40.3], FR: [2.3, 46.4], GB: [-2.8, 54.2],
    GR: [22.0, 39.1], HR: [16.4, 45.2], HU: [19.3, 47.2], LT: [23.9, 55.2],
    LV: [24.6, 57.0], NL: [5.4, 52.2], NO: [9.2, 61.5], PL: [19.2, 52.0],
    RO: [24.9, 45.9], SE: [15.3, 62.0], SI: [14.9, 46.1], SK: [19.5, 48.7]
};

const legends = {
    registrations: [
        {max: 5, label: 'sub 5%', color: '#dcecf5'},
        {max: 10, label: '5–10%', color: '#abd5e9'},
        {max: 20, label: '10–20%', color: '#69b6d8'},
        {max: 40, label: '20–40%', color: '#2588bd'},
        {max: Infinity, label: 'peste 40%', color: '#004b87'}
    ],
    fleet: [
        {max: 0.5, label: 'sub 0,5%', color: '#dcecf5'},
        {max: 1, label: '0,5–1%', color: '#abd5e9'},
        {max: 2, label: '1–2%', color: '#69b6d8'},
        {max: 5, label: '2–5%', color: '#2588bd'},
        {max: Infinity, label: 'peste 5%', color: '#004b87'}
    ]
};

function formatNumber(value) {
    return Number(value).toLocaleString('ro-RO');
}

function formatPercent(value) {
    return `${Number(value).toLocaleString('ro-RO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}%`;
}

function formatSignedPercent(value) {
    const number = Number(value);
    const prefix = number > 0 ? '+' : '';
    return `${prefix}${number.toLocaleString('ro-RO', {minimumFractionDigits: 1, maximumFractionDigits: 1})}%`;
}

function formatDate(value) {
    const [year, month, day] = String(value).split('-');
    return year && month && day ? `${day}.${month}.${year}` : value;
}

function formatQuarter(value) {
    const match = /^(20\d{2})-Q([1-4])$/.exec(value || '');
    return match ? `Trimestrul ${match[2]} ${match[1]}` : value;
}

function registrationShare(country) {
    return country.bev / country.total * 100;
}

function fleetGrowth(country) {
    return (country.fleet / country.previousYearEnd - 1) * 100;
}

function validateCountries(countries, metric) {
    if (!Array.isArray(countries) || !countries.length) return false;
    const codes = new Set();
    return countries.every(country => {
        if (!/^[A-Z]{2}$/.test(country.code || '') || codes.has(country.code) || !country.name || !country.flag) return false;
        codes.add(country.code);
        if (metric === 'registrations') {
            return Number.isInteger(country.bev) && Number.isInteger(country.total)
                && country.bev >= 0 && country.total > 0 && country.bev <= country.total
                && Number.isFinite(country.yoy);
        }
        return Number.isInteger(country.fleet) && Number.isInteger(country.previousYearEnd)
            && country.fleet >= 0 && country.previousYearEnd > 0
            && Number.isFinite(country.fleetShare) && country.fleetShare >= 0;
    });
}

function validateComparison(data) {
    if (!data || data.schemaVersion !== 2 || !data.groups || !data.registrationPeriods || !data.fleetPeriods) return false;
    for (const group of Object.values(data.groups)) {
        if (!group.label || !Array.isArray(group.codes) || group.codes.length !== new Set(group.codes).size) return false;
    }
    for (const [key, period] of Object.entries(data.registrationPeriods)) {
        if (!/^20\d{2}-\d{2}$/.test(key) || !period.sourceUrl?.startsWith('https://')
            || !period.publishedAt || !validateCountries(period.countries, 'registrations')) return false;
    }
    for (const [key, period] of Object.entries(data.fleetPeriods)) {
        if (!/^20\d{2}-Q[1-4]$/.test(key) || !period.sourceUrl?.startsWith('https://')
            || !period.methodologyUrl?.startsWith('https://') || !period.shareAsOf
            || !validateCountries(period.countries, 'fleet')) return false;
    }
    const latestRegistration = data.registrationPeriods[Object.keys(data.registrationPeriods).sort().at(-1)];
    const latestFleet = data.fleetPeriods[Object.keys(data.fleetPeriods).sort().at(-1)];
    const registrationCodes = new Set(latestRegistration.countries.map(country => country.code));
    const fleetCodes = new Set(latestFleet.countries.map(country => country.code));
    return Object.values(data.groups).every(group =>
        group.codes.includes('RO')
        && group.codes.every(code => registrationCodes.has(code) && fleetCodes.has(code))
    );
}

function validateMap(data) {
    if (!data || data.schemaVersion !== 1 || !data.bounds || !Array.isArray(data.features) || !data.features.length) return false;
    const codes = new Set();
    return data.features.every(feature => {
        const code = feature?.properties?.code;
        const type = feature?.geometry?.type;
        if (!code || codes.has(code) || !['Polygon', 'MultiPolygon'].includes(type)) return false;
        codes.add(code);
        return Array.isArray(feature.geometry.coordinates);
    });
}

async function loadData() {
    const cacheBuster = Date.now();
    const [comparisonResponse, mapResponse] = await Promise.all([
        fetch(`rapoarte/european_comparison.json?t=${cacheBuster}`),
        fetch(`rapoarte/europe_map.json?t=${cacheBuster}`)
    ]);
    if (!comparisonResponse.ok || !mapResponse.ok) throw new Error('Datele comparative nu sunt disponibile.');
    const [comparison, map] = await Promise.all([comparisonResponse.json(), mapResponse.json()]);
    if (!validateComparison(comparison) || !validateMap(map)) throw new Error('Datele comparative nu trec verificarea de integritate.');
    state.comparison = comparison;
    state.map = map;
    state.projectionExtent = calculateProjectionExtent(map.bounds);
}

function registrationPeriodKey() {
    const year = document.getElementById('public-year-select').value;
    const month = document.getElementById('public-month-select').value.split('|')[0];
    return year && month ? `${year}-${month}` : null;
}

function latestFleetKey() {
    return Object.keys(state.comparison.fleetPeriods).sort().at(-1);
}

function currentPeriod() {
    if (state.metric === 'registrations') {
        const key = registrationPeriodKey();
        return {key, period: state.comparison.registrationPeriods[key]};
    }
    const key = latestFleetKey();
    return {key, period: state.comparison.fleetPeriods[key]};
}

function configurePeriodSelectors() {
    const periods = Object.keys(state.comparison.registrationPeriods).sort();
    const yearSelect = document.getElementById('public-year-select');
    const years = [...new Set(periods.map(period => period.slice(0, 4)))].sort().reverse();
    yearSelect.replaceChildren();
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    const latest = periods.at(-1);
    yearSelect.value = latest.slice(0, 4);
    updateMonthOptions(latest.slice(5));
    yearSelect.addEventListener('change', () => {
        updateMonthOptions();
        renderAll();
    });
    document.getElementById('public-month-select').addEventListener('change', renderAll);
}

function updateMonthOptions(preferredMonth) {
    const year = document.getElementById('public-year-select').value;
    const monthSelect = document.getElementById('public-month-select');
    const months = Object.keys(state.comparison.registrationPeriods)
        .filter(period => period.startsWith(`${year}-`))
        .map(period => period.slice(5))
        .sort();
    monthSelect.replaceChildren();
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = `${month}|${monthCodes[month]}`;
        option.textContent = monthNames[month];
        monthSelect.appendChild(option);
    });
    const selected = preferredMonth && months.includes(preferredMonth) ? preferredMonth : months.at(-1);
    if (selected) monthSelect.value = `${selected}|${monthCodes[selected]}`;
}

function metricValue(country) {
    return state.metric === 'registrations' ? registrationShare(country) : country.fleetShare;
}

function volumeValue(country) {
    return state.metric === 'registrations' ? country.bev : country.fleet;
}

function countriesForCurrentView() {
    const {period} = currentPeriod();
    const codes = state.comparison.groups[state.group].codes;
    const byCode = new Map(period.countries.map(country => [country.code, country]));
    return codes.map(code => byCode.get(code)).filter(Boolean);
}

function colorForValue(value) {
    return legends[state.metric].find(item => value < item.max)?.color || legends[state.metric].at(-1).color;
}

function lambertAzimuthalEqualArea(coordinate) {
    const radians = Math.PI / 180;
    const longitude = coordinate[0] * radians;
    const latitude = coordinate[1] * radians;
    const centerLongitude = europeProjection.centerLon * radians;
    const centerLatitude = europeProjection.centerLat * radians;
    const longitudeDelta = longitude - centerLongitude;
    const denominator = 1
        + Math.sin(centerLatitude) * Math.sin(latitude)
        + Math.cos(centerLatitude) * Math.cos(latitude) * Math.cos(longitudeDelta);
    const scale = Math.sqrt(2 / Math.max(denominator, 0.000001));
    return [
        scale * Math.cos(latitude) * Math.sin(longitudeDelta),
        scale * (Math.cos(centerLatitude) * Math.sin(latitude)
            - Math.sin(centerLatitude) * Math.cos(latitude) * Math.cos(longitudeDelta))
    ];
}

function calculateProjectionExtent(bounds) {
    const points = [];
    const steps = 100;
    for (let index = 0; index <= steps; index += 1) {
        const ratio = index / steps;
        const longitude = bounds.minLon + (bounds.maxLon - bounds.minLon) * ratio;
        const latitude = bounds.minLat + (bounds.maxLat - bounds.minLat) * ratio;
        points.push(
            lambertAzimuthalEqualArea([longitude, bounds.minLat]),
            lambertAzimuthalEqualArea([longitude, bounds.maxLat]),
            lambertAzimuthalEqualArea([bounds.minLon, latitude]),
            lambertAzimuthalEqualArea([bounds.maxLon, latitude])
        );
    }
    return {
        minX: Math.min(...points.map(point => point[0])),
        maxX: Math.max(...points.map(point => point[0])),
        minY: Math.min(...points.map(point => point[1])),
        maxY: Math.max(...points.map(point => point[1]))
    };
}

function projectCoordinate(coordinate) {
    const {width, height} = mapViewport;
    const {padding} = europeProjection;
    const extent = state.projectionExtent;
    const [rawX, rawY] = lambertAzimuthalEqualArea(coordinate);
    const projectedWidth = extent.maxX - extent.minX;
    const projectedHeight = extent.maxY - extent.minY;
    const scale = Math.min((width - padding * 2) / projectedWidth, (height - padding * 2) / projectedHeight);
    const offsetX = (width - projectedWidth * scale) / 2;
    const offsetY = (height - projectedHeight * scale) / 2;
    return [
        offsetX + (rawX - extent.minX) * scale,
        offsetY + (extent.maxY - rawY) * scale
    ];
}

function collectProjectedPoints(coordinates, points) {
    if (!Array.isArray(coordinates)) return;
    if (coordinates.length >= 2 && Number.isFinite(coordinates[0]) && Number.isFinite(coordinates[1])) {
        points.push(projectCoordinate(coordinates));
        return;
    }
    coordinates.forEach(item => collectProjectedPoints(item, points));
}

function mapViewBoxForCurrentLayout() {
    const fullViewBox = {x: 0, y: 0, width: mapViewport.width, height: mapViewport.height};
    if (!window.matchMedia('(max-width: 640px)').matches) return fullViewBox;

    const visibleCodes = new Set(state.comparison.groups[state.group].codes);
    const points = [];
    state.map.features
        .filter(feature => visibleCodes.has(feature.properties.code))
        .forEach(feature => collectProjectedPoints(feature.geometry.coordinates, points));
    if (!points.length) return fullViewBox;

    const padding = 28;
    const minX = Math.min(...points.map(point => point[0])) - padding;
    const maxX = Math.max(...points.map(point => point[0])) + padding;
    const minY = Math.min(...points.map(point => point[1])) - padding;
    const maxY = Math.max(...points.map(point => point[1])) + padding;
    const shell = document.getElementById('map-shell');
    const targetAspect = Math.max((shell.clientWidth || 320) / (shell.clientHeight || 390), 0.65);
    let width = maxX - minX;
    let height = maxY - minY;
    if (width / height > targetAspect) height = width / targetAspect;
    else width = height * targetAspect;
    width = Math.min(width, mapViewport.width);
    height = Math.min(height, mapViewport.height);

    let x = (minX + maxX - width) / 2;
    let y = (minY + maxY - height) / 2;
    x = Math.max(0, Math.min(x, mapViewport.width - width));
    y = Math.max(0, Math.min(y, mapViewport.height - height));
    return {x, y, width, height};
}

function updateMapViewBox() {
    const svg = document.getElementById('europe-map');
    const viewBox = mapViewBoxForCurrentLayout();
    svg.setAttribute('viewBox', `${viewBox.x.toFixed(1)} ${viewBox.y.toFixed(1)} ${viewBox.width.toFixed(1)} ${viewBox.height.toFixed(1)}`);
}

function positionMapHotspot(hotspot, coordinate) {
    const shell = document.getElementById('map-shell');
    const svg = document.getElementById('europe-map');
    const [x, y] = projectCoordinate(coordinate);
    const shellRect = shell.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const scale = Math.min(svgRect.width / viewBox.width, svgRect.height / viewBox.height);
    const offsetX = svgRect.left - shellRect.left + (svgRect.width - viewBox.width * scale) / 2;
    const offsetY = svgRect.top - shellRect.top + (svgRect.height - viewBox.height * scale) / 2;
    hotspot.style.left = `${offsetX + (x - viewBox.x) * scale}px`;
    hotspot.style.top = `${offsetY + (y - viewBox.y) * scale}px`;
}

function positionMapHotspots() {
    document.querySelectorAll('.map-hotspot').forEach(hotspot => {
        const anchor = countryAnchors[hotspot.dataset.countryCode];
        if (anchor) positionMapHotspot(hotspot, anchor);
    });
}

function ringPath(ring) {
    return ring.map((point, index) => {
        const [x, y] = projectCoordinate(point);
        return `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join('') + 'Z';
}

function geometryPath(geometry) {
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    return polygons.map(polygon => polygon.map(ringPath).join('')).join('');
}

function tooltipRows(country) {
    if (state.metric === 'registrations') {
        return [
            ['Autoturisme BEV noi', formatNumber(country.bev)],
            ['Total autoturisme noi', formatNumber(country.total)],
            ['Cotă BEV', formatPercent(registrationShare(country))],
            ['Față de aceeași lună din 2025', formatSignedPercent(country.yoy)]
        ];
    }
    return [
        ['Autoturisme electrice M1 (EAFO)', formatNumber(country.fleet)],
        ['Pondere în parcul auto (2025)', formatPercent(country.fleetShare)],
        ['Față de finalul lui 2025', formatSignedPercent(fleetGrowth(country))]
    ];
}

function buildTooltip(country) {
    const fragment = document.createDocumentFragment();
    const title = document.createElement('strong');
    title.textContent = `${country.flag} ${country.name}`;
    const grid = document.createElement('div');
    grid.className = 'map-tooltip-grid';
    tooltipRows(country).forEach(([label, value]) => {
        const labelElement = document.createElement('span');
        labelElement.textContent = label;
        const valueElement = document.createElement('b');
        valueElement.textContent = value;
        grid.append(labelElement, valueElement);
    });
    fragment.append(title, grid);
    return fragment;
}

function showTooltip(country, event) {
    const tooltip = document.getElementById('map-tooltip');
    const shell = document.getElementById('map-shell');
    tooltip.replaceChildren(buildTooltip(country));
    tooltip.classList.add('is-visible');
    tooltip.setAttribute('aria-hidden', 'false');
    const rect = shell.getBoundingClientRect();
    const requestedX = event?.clientX ? event.clientX - rect.left + 14 : rect.width / 2;
    const requestedY = event?.clientY ? event.clientY - rect.top + 14 : 18;
    const width = Math.min(250, rect.width - 24);
    const left = Math.max(12, Math.min(requestedX, rect.width - width - 12));
    const top = Math.max(12, Math.min(requestedY, rect.height - 150));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function hideTooltip() {
    const tooltip = document.getElementById('map-tooltip');
    tooltip.classList.remove('is-visible');
    tooltip.setAttribute('aria-hidden', 'true');
}

function selectCountry(code) {
    state.selectedCode = code;
    document.getElementById('country-select').value = code;
    renderMap();
    renderSelectedCountry();
}

function bindMapInteraction(element, country, outline) {
    element.addEventListener('pointerenter', event => {
        outline?.classList.add('is-hovered');
        showTooltip(country, event);
    });
    element.addEventListener('pointermove', event => showTooltip(country, event));
    element.addEventListener('pointerleave', () => {
        outline?.classList.remove('is-hovered');
        hideTooltip();
    });
    element.addEventListener('focus', event => {
        outline?.classList.add('is-focused');
        showTooltip(country, event);
    });
    element.addEventListener('blur', () => {
        outline?.classList.remove('is-focused');
        hideTooltip();
    });
    element.addEventListener('click', () => selectCountry(country.code));
    element.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectCountry(country.code);
        }
    });
}

function renderMap() {
    const namespace = 'http://www.w3.org/2000/svg';
    const countriesGroup = document.getElementById('europe-map-countries');
    const outlinesGroup = document.getElementById('europe-map-outlines');
    const outlinesByCode = new Map();
    const markersGroup = document.getElementById('europe-map-markers');
    const hotspots = document.getElementById('map-hotspots');
    const currentCountries = countriesForCurrentView();
    updateMapViewBox();
    const dataByCode = new Map(currentCountries.map(country => [country.code, country]));
    countriesGroup.replaceChildren();
    outlinesGroup.replaceChildren();
    markersGroup.replaceChildren();
    hotspots.replaceChildren();

    state.map.features.forEach(feature => {
        const path = document.createElementNS(namespace, 'path');
        const code = feature.properties.code;
        const country = dataByCode.get(code);
        path.setAttribute('d', geometryPath(feature.geometry));
        path.setAttribute('fill-rule', 'evenodd');
        path.classList.add('map-country');
        if (country) {
            path.classList.add('has-data');
            if (code === state.selectedCode) path.classList.add('is-selected');
            if (code === 'RO') path.classList.add('is-romania');
            path.setAttribute('fill', colorForValue(metricValue(country)));
            // Draw each highlight once, above all country fills and below the markers.
            const outline = document.createElementNS(namespace, 'path');
            outline.setAttribute('d', path.getAttribute('d'));
            outline.classList.add('map-country-outline');
            if (code === state.selectedCode) outline.classList.add('is-selected');
            if (code === 'RO') outline.classList.add('is-romania');
            outlinesGroup.appendChild(outline);
            outlinesByCode.set(code, outline);
            bindMapInteraction(path, country, outline);
        }
        countriesGroup.appendChild(path);
    });

    currentCountries.filter(country => smallCountryMarkers.has(country.code)).forEach(country => {
        const marker = document.createElementNS(namespace, 'circle');
        const [x, y] = projectCoordinate(countryAnchors[country.code]);
        marker.setAttribute('cx', x.toFixed(1));
        marker.setAttribute('cy', y.toFixed(1));
        marker.setAttribute('r', country.code === state.selectedCode ? '8' : '6');
        marker.setAttribute('aria-hidden', 'true');
        marker.classList.add('map-marker');
        if (country.code === 'RO') marker.classList.add('is-romania');
        markersGroup.appendChild(marker);
    });

    currentCountries.forEach(country => {
        const hotspot = document.createElement('button');
        hotspot.type = 'button';
        hotspot.className = 'map-hotspot';
        hotspot.dataset.countryCode = country.code;
        if (country.code === state.selectedCode) hotspot.classList.add('is-selected');
        if (country.code === 'RO') hotspot.classList.add('is-romania');
        positionMapHotspot(hotspot, countryAnchors[country.code]);
        hotspot.setAttribute('aria-label', `Selectează ${country.name}: ${formatPercent(metricValue(country))}`);
        hotspot.title = `${country.name}: ${formatPercent(metricValue(country))}`;
        bindMapInteraction(hotspot, country, outlinesByCode.get(country.code));
        hotspots.appendChild(hotspot);
    });
}

function renderLegend() {
    const container = document.getElementById('map-legend');
    container.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = state.metric === 'registrations' ? 'Cotă BEV:' : 'Pondere în parc:';
    container.appendChild(title);
    [...legends[state.metric], {label: 'fără date', color: '#dce6ec'}].forEach(item => {
        const entry = document.createElement('span');
        entry.className = 'legend-item';
        const swatch = document.createElement('span');
        swatch.className = 'legend-swatch';
        swatch.style.backgroundColor = item.color;
        const label = document.createElement('span');
        label.textContent = item.label;
        entry.append(swatch, label);
        container.appendChild(entry);
    });
}

function configureCountrySelect(countries) {
    if (!countries.some(country => country.code === state.selectedCode)) state.selectedCode = 'RO';
    const select = document.getElementById('country-select');
    select.replaceChildren();
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = `${country.flag} ${country.name}`;
        select.appendChild(option);
    });
    select.value = state.selectedCode;
}

function addCountryStat(container, label, value) {
    const row = document.createElement('div');
    row.className = 'selected-country-stat';
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    const valueElement = document.createElement('strong');
    valueElement.textContent = value;
    row.append(labelElement, valueElement);
    container.appendChild(row);
}

function renderSelectedCountry() {
    const country = countriesForCurrentView().find(item => item.code === state.selectedCode);
    if (!country) return;
    document.getElementById('selected-country-name').textContent = `${country.flag} ${country.name}`;
    document.getElementById('selected-country-value').textContent = formatPercent(metricValue(country));
    const stats = document.getElementById('selected-country-stats');
    stats.replaceChildren();
    tooltipRows(country).forEach(([label, value]) => addCountryStat(stats, label, value));
}

function renderBarList(containerId, countries, valueGetter, formatter) {
    const container = document.getElementById(containerId);
    container.replaceChildren();
    const maximum = Math.max(...countries.map(valueGetter), 1);
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
        fill.style.width = `${(valueGetter(country) / maximum * 100).toFixed(1)}%`;
        track.appendChild(fill);

        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = formatter(valueGetter(country));
        item.append(label, track, value);
        container.appendChild(item);
    });
}

function renderRankings(countries) {
    const byShare = [...countries].sort((a, b) => metricValue(b) - metricValue(a));
    const byVolume = [...countries].sort((a, b) => volumeValue(b) - volumeValue(a));
    renderBarList('market-share-list', byShare, metricValue, formatPercent);
    renderBarList('volumes-list', byVolume, volumeValue, formatNumber);
    if (state.metric === 'registrations') {
        document.getElementById('share-chart-title').textContent = 'Cotă BEV în înmatriculările noi';
        document.getElementById('share-chart-description').textContent = 'Ponderea autoturismelor electrice în totalul autoturismelor noi din luna selectată.';
        document.getElementById('volume-chart-title').textContent = 'Înmatriculări BEV — volum';
        document.getElementById('volume-chart-description').textContent = 'Numărul autoturismelor electrice noi înmatriculate în aceeași lună.';
    } else {
        document.getElementById('share-chart-title').textContent = 'Ponderea BEV în parcul auto';
        document.getElementById('share-chart-description').textContent = 'Procentul autoturismelor electrice din întregul parc auto, la final de 2025.';
        document.getElementById('volume-chart-title').textContent = 'Parc armonizat EAFO de autoturisme electrice';
        document.getElementById('volume-chart-description').textContent = 'Numărul autoturismelor electrice M1 din seria armonizată EAFO, în trimestrul II 2026.';
    }
}

function renderSummary(countries) {
    const byShare = [...countries].sort((a, b) => metricValue(b) - metricValue(a));
    const romania = countries.find(country => country.code === 'RO');
    const leader = byShare[0];
    const rank = byShare.findIndex(country => country.code === 'RO') + 1;
    document.getElementById('summary-romania-value').textContent = formatPercent(metricValue(romania));
    document.getElementById('summary-leader-value').textContent = `${leader.flag} ${leader.name}`;
    document.getElementById('summary-romania-rank').textContent = `${rank} din ${countries.length}`;
    if (state.metric === 'registrations') {
        document.getElementById('summary-romania-note').textContent = `${formatNumber(romania.bev)} autoturisme BEV noi`;
        document.getElementById('summary-leader-note').textContent = `${formatPercent(metricValue(leader))} cotă BEV în luna selectată`;
        document.getElementById('summary-rank-note').textContent = 'Clasament după cota în înmatriculările noi';
    } else {
        document.getElementById('summary-romania-note').textContent = `${formatNumber(romania.fleet)} autoturisme electrice M1 în seria EAFO`;
        document.getElementById('summary-leader-note').textContent = `${formatPercent(metricValue(leader))} din parcul auto`;
        document.getElementById('summary-rank-note').textContent = 'Clasament după ponderea în parcul auto';
    }
}

function renderSource(period) {
    const container = document.getElementById('comparison-source-note');
    container.replaceChildren();
    const sourceLink = document.createElement('a');
    sourceLink.href = period.sourceUrl;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener';
    sourceLink.textContent = `Sursa datelor: ${period.source}`;
    container.append(sourceLink, ` · actualizare ${formatDate(period.publishedAt)}`);
    if (period.provisional) container.append(' · date provizorii');
    if (state.metric === 'fleet') {
        const methodLink = document.createElement('a');
        methodLink.href = period.methodologyUrl;
        methodLink.target = '_blank';
        methodLink.rel = 'noopener';
        methodLink.textContent = 'metodologie';
        container.append(' · ', methodLink);
    }
    const mapLink = document.createElement('a');
    mapLink.href = state.map.sourceUrl;
    mapLink.target = '_blank';
    mapLink.rel = 'noopener';
    mapLink.textContent = 'Natural Earth';
    container.append(' · hartă: ', mapLink, ' (public domain)');
}

function renderContext(key, period) {
    const groupLabel = state.comparison.groups[state.group].label;
    document.getElementById('map-card-title').textContent = groupLabel;
    document.getElementById('divider-metric-name').textContent = state.metric === 'registrations' ? 'Înmatriculări noi' : 'Parc EV';
    document.getElementById('registration-period-controls').classList.toggle('is-hidden', state.metric !== 'registrations');
    document.getElementById('fleet-period-label').classList.toggle('is-hidden', state.metric !== 'fleet');
    if (state.metric === 'registrations') {
        const [year, month] = key.split('-');
        const label = `${monthNames[month]} ${year}`;
        document.getElementById('divider-period-name').textContent = label;
        document.getElementById('map-subtitle').textContent = 'Culoarea indică ponderea BEV în înmatriculările de autoturisme noi.';
        document.getElementById('comparison-method-note').textContent = 'Comparația folosește numai autoturisme noi. Importurile rulate rămân în dashboardul național și nu intră în cota de piață.';
    } else {
        const label = formatQuarter(key);
        document.getElementById('fleet-period-value').textContent = label;
        document.getElementById('divider-period-name').textContent = label;
        document.getElementById('map-subtitle').textContent = `Culoarea indică ponderea BEV în parcul auto la ${formatDate(period.shareAsOf)}.`;
        document.getElementById('comparison-method-note').textContent = 'Aici, „Parc EV” este seria armonizată EAFO pentru autoturisme M1, calculată după aceeași definiție în toate țările. Dashboardul național EV Radar folosește date DGPCI pentru autoturisme și autoutilitare (M1 + M1G + N1), actualizate lunar cu înmatriculările minus radierile. Totalurile nu sunt direct comparabile.';
    }
}

function renderControls() {
    document.querySelectorAll('[data-metric]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.metric === state.metric));
    });
    document.querySelectorAll('[data-group]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.group === state.group));
    });
}

function renderAll() {
    const {key, period} = currentPeriod();
    if (!period) return;
    const countries = countriesForCurrentView();
    configureCountrySelect(countries);
    renderControls();
    renderContext(key, period);
    renderMap();
    renderLegend();
    renderSelectedCountry();
    renderRankings(countries);
    renderSummary(countries);
    renderSource(period);
}

function showError(error) {
    const message = error instanceof Error ? error.message : String(error);
    document.getElementById('map-shell').textContent = message;
    document.getElementById('comparison-source-note').textContent = 'Nu afișăm valori estimate sau date care nu trec verificarea.';
    for (const id of ['market-share-list', 'volumes-list']) {
        const container = document.getElementById(id);
        container.textContent = message;
        container.style.color = 'var(--warning-color)';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadData();
        configurePeriodSelectors();
        document.querySelectorAll('[data-metric]').forEach(button => {
            button.addEventListener('click', () => {
                state.metric = button.dataset.metric;
                renderAll();
            });
        });
        document.querySelectorAll('[data-group]').forEach(button => {
            button.addEventListener('click', () => {
                state.group = button.dataset.group;
                if (!state.comparison.groups[state.group].codes.includes(state.selectedCode)) state.selectedCode = 'RO';
                renderAll();
            });
        });
        document.getElementById('country-select').addEventListener('change', event => selectCountry(event.target.value));
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') hideTooltip();
        });
        let resizeFrame = null;
        window.addEventListener('resize', () => {
            if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
            resizeFrame = window.requestAnimationFrame(() => {
                updateMapViewBox();
                positionMapHotspots();
            });
        });
        renderAll();
    } catch (error) {
        console.error('[Comparație]', error);
        showError(error);
    }
});
