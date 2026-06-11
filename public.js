/* 
  Copyright © 2026 Tudor Marchis & Electromobilitate. Toate drepturile rezervate.
  Cod de monitorizare înmatriculări EV protejat intelectual.
*/

// Starea vizualizatorului public
const state = {
    data: null,
    historicalSummary: null
};

async function initHistoricalSummary() {
    try {
        const response = await fetch(`rapoarte/historical_summary.json?t=${Date.now()}`);
        if (response.ok) {
            state.historicalSummary = await response.json();
            console.log("Historical summary loaded successfully!");
        }
    } catch (err) {
        console.warn("Could not load historical summary from server:", err);
    }
}

function getSelectedPublicMonth() {
    const yearSelect = document.getElementById('public-year-select');
    const monthSelect = document.getElementById('public-month-select');
    if (!yearSelect || !monthSelect) return null;
    
    const year = yearSelect.value;
    const [monthNum, lunaNume] = monthSelect.value.split('|');
    const lunaCode = `${year}${monthNum}`;
    return { lunaCode, lunaNume };
}

function updateMonthSelectOptions() {
    const yearSelect = document.getElementById('public-year-select');
    const monthSelect = document.getElementById('public-month-select');
    if (!yearSelect || !monthSelect) return;
    
    const year = yearSelect.value;
    if (!state.historicalSummary) return;
    
    const availableMonths = state.historicalSummary[year] ? Object.keys(state.historicalSummary[year]) : [];
    
    let selectedStillAvailable = false;
    let lastAvailableOpt = null;
    
    // Determinam ordinea lunilor pentru a gasi ultima disponibila
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const sortedAvailable = [...availableMonths].sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b));
    
    for (let opt of monthSelect.options) {
        const [monthNum, monthAcronym] = opt.value.split('|');
        const isAvailable = sortedAvailable.includes(monthAcronym);
        
        if (isAvailable) {
            opt.disabled = false;
            opt.style.display = 'block';
            lastAvailableOpt = opt.value;
            if (monthSelect.value === opt.value) {
                selectedStillAvailable = true;
            }
        } else {
            opt.disabled = true;
            opt.style.display = 'none';
        }
    }
    
    // Daca luna selectata a fost dezactivata, selectam ultima luna disponibila din an
    if (!selectedStillAvailable && lastAvailableOpt) {
        monthSelect.value = lastAvailableOpt;
    }
}

function animateElementValue(id, endValue, duration = 800) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const oldText = element.innerText;
    const isNegative = oldText.includes('-');
    const digitsOnly = oldText.replace(/[^\d]/g, '');
    let startValue = parseInt(digitsOnly) || 0;
    if (isNegative) startValue = -startValue;
    
    if (startValue === endValue) {
        element.innerText = endValue.toLocaleString('ro-RO');
        return;
    }
    
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * ease);
        
        element.innerText = currentValue.toLocaleString('ro-RO');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.innerText = endValue.toLocaleString('ro-RO');
        }
    }
    
    requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', async () => {
    await initHistoricalSummary();
    initUI();
});

function initUI() {
    console.log("%c© 2026 Tudor Marchis & Electromobilitate. Toate drepturile rezervate. EV Radar România.", "color: #004b87; font-weight: bold; font-size: 13px;");
    const yearSelect = document.getElementById('public-year-select');
    const monthSelect = document.getElementById('public-month-select');
    if (!yearSelect || !monthSelect) return;
    
    // Configuram selectiile initiale in functie de ce avem in historicalSummary
    updateMonthSelectOptions();
    
    // Incarcam datele pentru selectia initiala
    loadMonthData();
    
    yearSelect.addEventListener('change', () => {
        updateMonthSelectOptions();
        loadMonthData();
    });
    
    monthSelect.addEventListener('change', () => {
        loadMonthData();
    });
}

async function loadMonthData() {
    const selected = getSelectedPublicMonth();
    if (!selected) return;
    const { lunaCode, lunaNume } = selected;
    
    // Asigura formatul YYYY-MM (cu cratima) pentru fisierele din folderul rapoarte/
    const lunaHyphen = `${lunaCode.substring(0, 4)}-${lunaCode.substring(4)}`;
    
    try {
        let response = await fetch(`rapoarte/dashboard_${lunaHyphen}.json?t=${Date.now()}`);
        if (!response.ok) {
            response = await fetch(`rapoarte/dashboard_${lunaCode}.json?t=${Date.now()}`);
        }
        if (!response.ok) {
            throw new Error(`File not found`);
        }
        const result = await response.json();
        console.log("[Public] Date incarcate din JSON static:", result);
        state.data = result;
        renderDashboard();
    } catch (err) {
        console.warn("[Public] Nu s-a putut incarca fisierul JSON static. Incerc fallback din localStorage...", err);
        
        // Incercare 2: Citire din localStorage (pentru rulare locala pe file:// sau dev local)
        const cached = localStorage.getItem('ev_radar_ro_data_' + lunaCode) || 
                       localStorage.getItem('ev_radar_ro_data_' + lunaHyphen) ||
                       localStorage.getItem('ev_radar_ro_data_' + lunaNume);
        if (cached) {
            try {
                state.data = JSON.parse(cached);
                console.log("[Public] Date incarcate din cache local:", state.data);
                renderDashboard();
            } catch (e) {
                console.error("[Public] Eroare la citirea cache-ului:", e);
                showEmptyDashboard("Eroare la procesarea cache-ului local.");
            }
        } else {
            showEmptyDashboard(`Nu există date procesate pentru luna ${lunaNume}.`);
        }
    }
}

function showEmptyDashboard(message) {
    document.getElementById('val-national-fleet').innerText = "-";
    document.getElementById('val-auto-reg').innerText = "-";
    document.getElementById('val-util-reg').innerText = "-";
    document.getElementById('val-total-rad').innerText = "-";
    document.getElementById('val-net-growth').innerText = "-";
    document.getElementById('val-ev-share').innerText = "-";
    document.getElementById('val-used-share').innerText = "-";
    document.getElementById('val-yoy-growth').innerText = "-";
    document.getElementById('val-firme-pct').innerText = "-";
    document.getElementById('val-firme-qty').innerText = "-";
    document.getElementById('val-pf-pct').innerText = "-";
    document.getElementById('val-pf-qty').innerText = "-";
    
    document.getElementById('top-brands-tbody').innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">${message}</td></tr>`;
    document.getElementById('top-models-tbody').innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">${message}</td></tr>`;
    document.getElementById('top-rad-tbody').innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">${message}</td></tr>`;
}

function renderDashboard() {
    if (!state.data) return;
    
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    const netGrowth = totalEV - state.data.totalRadieri;
    
    animateElementValue('val-auto-reg', state.data.totalAutoReg);
    animateElementValue('val-util-reg', state.data.totalUtilReg);
    animateElementValue('val-total-rad', state.data.totalRadieri);
    animateElementValue('val-net-growth', netGrowth);
    
    // Calculeaza parcul auto national total estimat dinamic în funcție de an
    const currentYear = state.data && state.data.luna ? parseInt(state.data.luna.split('-')[0]) : 2026;
    const currentLunaNume = state.data.lunaNume || 'MAY';
    const baseFleetDec2025 = 63986;
    let totalFleet = baseFleetDec2025;
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    if (currentYear === 2026) {
        const history2026 = {
            'JAN': 1411 - 86,
            'FEB': 1372 - 92,
            'MAR': 1209 - 188,
            'APR': 1308 - 49,
            'MAY': 1505 - 103,
            'JUN': 0, 'JUL': 0, 'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0
        };
        history2026[currentLunaNume] = netGrowth;
        let cumulativeNet = 0;
        for (const m of monthsOrder) {
            cumulativeNet += history2026[m];
            if (m === currentLunaNume) break;
        }
        totalFleet = baseFleetDec2025 + cumulativeNet;
    } else if (currentYear < 2026) {
        let subtractNet = 0;
        for (let y = 2025; y >= currentYear; y--) {
            for (let mIdx = 11; mIdx >= 0; mIdx--) {
                const m = monthsOrder[mIdx];
                if (y === currentYear && mIdx <= monthsOrder.indexOf(currentLunaNume)) {
                    break;
                }
                let mReg = 0;
                let mRad = 0;
                if (state.historicalSummary && state.historicalSummary[String(y)] && state.historicalSummary[String(y)][m]) {
                    const item = state.historicalSummary[String(y)][m];
                    mReg = item.totalAutoReg + item.totalUtilReg;
                    mRad = item.totalRadieri;
                }
                subtractNet += (mReg - mRad);
            }
        }
        totalFleet = baseFleetDec2025 - subtractNet;
    }
    
    animateElementValue('val-national-fleet', totalFleet);
    document.getElementById('fleet-month-name').innerText = currentLunaNume + " " + currentYear;
    document.getElementById('divider-month-name').innerText = currentLunaNume + " " + currentYear;
    
    // Advanced stats
    document.getElementById('val-ev-share').innerText = `${(state.data.evShare * 100).toFixed(2)}%`;
    document.getElementById('val-used-share').innerText = `${(state.data.usedShare * 100).toFixed(2)}%`;
    
    const sign = state.data.yoyGrowth >= 0 ? '+' : '';
    document.getElementById('lbl-yoy-growth').innerText = `Evoluție YoY vs ${state.data.lunaNume} 2025`;
    const yoyValEl = document.getElementById('val-yoy-growth');
    yoyValEl.innerText = `${sign}${state.data.yoyGrowth.toFixed(2)}%`;
    if (state.data.yoyGrowth >= 0) {
        yoyValEl.className = 'stat-value success-value';
    } else {
        yoyValEl.className = 'stat-value warning-value';
    }
    
    // Company / Individual stats
    const firmePct = totalEV > 0 ? (state.data.totalFirme / totalEV) * 100 : 0;
    const pfPct = totalEV > 0 ? (state.data.totalPf / totalEV) * 100 : 0;
    document.getElementById('val-firme-pct').innerText = `${firmePct.toFixed(2)}%`;
    animateElementValue('val-firme-qty', state.data.totalFirme || 0);
    document.getElementById('val-pf-pct').innerText = `${pfPct.toFixed(2)}%`;
    animateElementValue('val-pf-qty', state.data.totalPf || 0);
    
    // 1. Top 10 Marci
    const brandVolums = {};
    state.data.inmatriculariModele.forEach(item => {
        const brand = item.marca || 'Necunoscută';
        brandVolums[brand] = (brandVolums[brand] || 0) + item.volum;
    });
    const topBrands = Object.keys(brandVolums).map(brand => ({
        marca: brand,
        volum: brandVolums[brand]
    })).sort((a, b) => b.volum - a.volum).slice(0, 10);

    const brandTbody = document.getElementById('top-brands-tbody');
    brandTbody.innerHTML = '';
    topBrands.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td><td>${item.marca}</td><td><strong>${item.volum}</strong></td>`;
        brandTbody.appendChild(tr);
    });
    
    // 2. Top 20 Modele
    const regTbody = document.getElementById('top-models-tbody');
    regTbody.innerHTML = '';
    state.data.inmatriculariModele.slice(0, 20).forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td><td>${item.marca}</td><td>${item.model}</td><td><strong>${item.volum}</strong></td>`;
        regTbody.appendChild(tr);
    });
    
    // 3. Top 20 Radieri
    const radTbody = document.getElementById('top-rad-tbody');
    radTbody.innerHTML = '';
    state.data.radieriModele.slice(0, 20).forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td><td>${item.marca}</td><td>${item.model}</td><td><strong>${item.volum}</strong></td>`;
        radTbody.appendChild(tr);
    });

    // 4. Top 50 YTD & Parc Auto General (doar pentru anul 2026)
    const formatModelName = (brand, model) => {
        const b = (brand || "").trim();
        const m = (model || "").trim();
        if (m.toUpperCase().startsWith(b.toUpperCase())) {
            return m;
        }
        return `${b} ${m}`;
    };

    const top50Grid = document.getElementById('top50-tables-grid');
    if (top50Grid) {
        if (currentYear === 2026) {
            // Calculăm datele pentru YTD și Parc
            const results = computeYtdAndParcData(currentLunaNume, state.data.inmatriculariModele);
            const modelsData = results.models;
            const totals = results.totals;
            
            const specificData = modelsData.filter(d => d.brand !== "Alte Modele");
            
            const top50Ytd = [...specificData].sort((a, b) => b.ytd - a.ytd).slice(0, 50);
            const top50Parc = [...specificData].sort((a, b) => b.parc - a.parc).slice(0, 50);
            
            // Render Top 50 YTD
            const ytdTbody = document.getElementById('top-50-ytd-tbody');
            if (ytdTbody) {
                ytdTbody.innerHTML = '';
                top50Ytd.forEach((item, idx) => {
                    const sharePct = totals.ytd > 0 ? (item.ytd / totals.ytd * 100).toFixed(2) : '0.00';
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
                                    <td>${formatModelName(item.brand, item.model)}</td>
                                    <td><strong>${item.ytd.toLocaleString('ro-RO')}</strong></td>
                                    <td>${sharePct}%</td>`;
                    ytdTbody.appendChild(tr);
                });
            }
            
            // Render Top 50 Parc
            const parcTbody = document.getElementById('top-50-parc-tbody');
            if (parcTbody) {
                parcTbody.innerHTML = '';
                top50Parc.forEach((item, idx) => {
                    const sharePct = totals.parc > 0 ? (item.parc / totals.parc * 100).toFixed(2) : '0.00';
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
                                    <td>${formatModelName(item.brand, item.model)}</td>
                                    <td><strong>${item.parc.toLocaleString('ro-RO')}</strong></td>
                                    <td>${sharePct}%</td>`;
                    parcTbody.appendChild(tr);
                });
            }
            
            top50Grid.style.display = 'grid';
        } else {
            top50Grid.style.display = 'none';
        }
    }

    // Rulare grafice istorice
    renderHistoricalCharts();
}

function renderHistoricalCharts() {
    // 1. Date lunare 2025 vs 2026 (Inmatriculari brute BEV)
    const regs2025 = {
        'JAN': 1639, 'FEB': 1069, 'MAR': 628, 'APR': 612, 'MAY': 863, 'JUN': 807,
        'JUL': 976, 'AUG': 1335, 'SEP': 1158, 'OCT': 1562, 'NOV': 1552, 'DEC': 1880
    };
    
    const regs2026 = {
        'JAN': 1411, 'FEB': 1372, 'MAR': 1209, 'APR': 1308, 'MAY': 1505,
        'JUN': null, 'JUL': null, 'AUG': null, 'SEP': null, 'OCT': null, 'NOV': null, 'DEC': null
    };
    
    // Suprascriem luna selectata in mod dinamic cu datele actuale incarcate
    const currentLunaNume = state.data.lunaNume;
    const currentRegs = state.data.totalAutoReg + state.data.totalUtilReg;
    if (regs2026.hasOwnProperty(currentLunaNume)) {
        regs2026[currentLunaNume] = currentRegs;
    }
    
    // De asemenea, daca suntem pe o luna ulterioara, sa stergem valorile din lunile viitoare
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentIdx = monthsOrder.indexOf(currentLunaNume);
    if (currentIdx !== -1) {
        for (let i = currentIdx + 1; i < monthsOrder.length; i++) {
            regs2026[monthsOrder[i]] = null;
        }
    }
    // Generam badge-urile de crestere procentuala (acum sunt incluse in coloane)
    const badgesContainer = document.getElementById('growth-badges-container');
    if (badgesContainer) {
        badgesContainer.innerHTML = '';
    }
    
    // Generam graficul comparativ 2025 vs 2026 (Format Vertical Mockup)
    const compContainer = document.getElementById('monthly-comp-list');
    if (compContainer) {
        compContainer.innerHTML = '';
        
        // Gasim valoarea maxima pentru scalare (adaugam un buffer de 15% pentru a incapea etichetele de deasupra)
        let maxVal = 0;
        monthsOrder.forEach(m => {
            if (regs2025[m] > maxVal) maxVal = regs2025[m];
            if (regs2026[m] !== null && regs2026[m] > maxVal) maxVal = regs2026[m];
        });
        const scaleMax = maxVal * 1.15;
        
        monthsOrder.forEach(m => {
            const val25 = regs2025[m];
            const val26 = regs2026[m];
            
            const h25 = ((val25 / scaleMax) * 100).toFixed(1);
            const h26 = val26 !== null ? ((val26 / scaleMax) * 100).toFixed(1) : 0;
            
            let badgeHTML = '';
            if (val26 !== null && val26 > 0) {
                const pct = ((val26 - val25) / val25 * 100).toFixed(1);
                const sign = pct >= 0 ? '+' : '';
                const badgeClass = pct >= 0 ? 'positive' : 'negative';
                badgeHTML = `<span class="growth-badge ${badgeClass}" style="padding: 0.2rem 0.45rem; font-size: 0.78rem; border-radius: 4px; line-height: 1; font-weight: 800;">${sign}${pct}%</span>`;
            }

            const col = document.createElement('div');
            col.className = 'v-col-group';
            col.innerHTML = `
                <div class="v-badge-wrapper" style="height: 22px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                    ${badgeHTML}
                </div>
                <div class="v-bars" style="height: 190px;">
                    ${val26 !== null ? `
                        <div class="v-bar-2026" style="height: ${h26}%;">
                            <span class="v-bar-val-static active-year">${val26.toLocaleString('ro-RO')}</span>
                        </div>
                    ` : ''}
                    <div class="v-bar-2025" style="height: ${h25}%;">
                        <span class="v-bar-val-static">${val25.toLocaleString('ro-RO')}</span>
                    </div>
                </div>
                <div class="v-col-lbl">${{
                    'JAN': 'IAN', 'FEB': 'FEB', 'MAR': 'MAR', 'APR': 'APR', 'MAY': 'MAI', 'JUN': 'IUN',
                    'JUL': 'IUL', 'AUG': 'AUG', 'SEP': 'SEP', 'OCT': 'OCT', 'NOV': 'NOV', 'DEC': 'DEC'
                }[m] || m}</div>
            `;
            compContainer.appendChild(col);
        });
        setTimeout(() => {
            const scrollEl = compContainer.parentElement || compContainer;
            // Gasim ultima coloana cu date 2026 (ultima luna cu val26 !== null)
            const cols = compContainer.querySelectorAll('.v-col-group');
            let lastFilledCol = null;
            let lastFilledIdx = -1;
            monthsOrder.forEach((m, idx) => {
                if (regs2026[m] !== null) {
                    lastFilledCol = cols[idx];
                    lastFilledIdx = idx;
                }
            });
            if (lastFilledCol) {
                // Centram coloana in viewport
                const colLeft = lastFilledCol.offsetLeft;
                const colWidth = lastFilledCol.offsetWidth;
                const wrapperWidth = scrollEl.clientWidth;
                const targetScroll = colLeft - (wrapperWidth / 2) + (colWidth / 2);
                scrollEl.scrollLeft = Math.max(0, targetScroll);
            } else {
                // Fallback: scroll la dreapta
                scrollEl.scrollLeft = scrollEl.scrollWidth;
            }
        }, 150);
    }
    
    // 2. Evolutie Anuala 2011 - Prezent
    const baseFleetDec2025 = 63986;
    const annualData = [];
    const currentYear = state.data && state.data.luna ? parseInt(state.data.luna.split('-')[0]) : 2026;
    
    // Obținem anii și îi filtrăm pentru a nu include ani mai mari decât cel selectat
    let years = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    if (state.historicalSummary) {
        Object.keys(state.historicalSummary).forEach(y => {
            const yi = parseInt(y);
            if (!years.includes(yi)) {
                years.push(yi);
            }
        });
        years.sort((a, b) => a - b);
    }
    years = years.filter(y => y < currentYear);
    
    const annualQtyMap = {
        2011: 7, 2012: 5, 2013: 50, 2014: 16, 2015: 32, 2016: 104, 2017: 247, 2018: 710, 2019: 1747,
        2020: 3134, 2021: 6831, 2022: 12466, 2023: 16852, 2024: 12677, 2025: 12756
    };

    years.forEach(y => {
        if (y < 2020) {
            annualData.push({ year: y, qty: annualQtyMap[y] || 0 });
            return;
        }
        
        let yearTotalReg = 0;
        if (state.historicalSummary && state.historicalSummary[String(y)]) {
            const yData = state.historicalSummary[String(y)];
            Object.keys(yData).forEach(m => {
                const item = yData[m];
                // Pana in 2024 inclusiv: brut (fara radieri) - metodologie istorica
                // Din 2025: net (minus radieri) - metodologie noua cu DGPCI complet
                if (y <= 2024) {
                    yearTotalReg += (item.totalAutoReg + item.totalUtilReg);
                } else {
                    yearTotalReg += (item.totalAutoReg + item.totalUtilReg - item.totalRadieri);
                }
            });
        }
        
        const qty = yearTotalReg > 0 ? yearTotalReg : (annualQtyMap[y] || 0);
        
        if (y !== currentYear) {
            annualData.push({ year: y, qty: qty });
        }
    });


    let currentYearCumulativeReg = 0;
    let currentYearCumulativeNet = 0;
    
    for (const m of monthsOrder) {
        let mReg = 0;
        let mRad = 0;
        
        if (state.historicalSummary && state.historicalSummary[String(currentYear)] && state.historicalSummary[String(currentYear)][m]) {
            const item = state.historicalSummary[String(currentYear)][m];
            mReg = item.totalAutoReg + item.totalUtilReg;
            mRad = item.totalRadieri;
        }
        
        if (m === currentLunaNume) {
            mReg = state.data.totalAutoReg + state.data.totalUtilReg;
            mRad = state.data.totalRadieri;
        }
        
        currentYearCumulativeReg += (mReg - mRad);
        currentYearCumulativeNet += (mReg - mRad);
        
        if (m === currentLunaNume) break;
    }
    
    annualData.push({ year: currentYear, qty: currentYearCumulativeReg, active: true });

    let totalFleet = baseFleetDec2025;
    
    if (currentYear === 2026) {
        totalFleet = baseFleetDec2025 + currentYearCumulativeNet;
    } else if (currentYear < 2026) {
        let subtractNet = 0;
        const default2025Auto = {
            'JAN': 1402, 'FEB': 1000, 'MAR': 595, 'APR': 583, 'MAY': 814, 'JUN': 761,
            'JUL': 897, 'AUG': 1278, 'SEP': 1100, 'OCT': 1486, 'NOV': 1478, 'DEC': 1797
        };
        for (let y = 2025; y >= currentYear; y--) {
            for (let mIdx = 11; mIdx >= 0; mIdx--) {
                const m = monthsOrder[mIdx];
                if (y === currentYear && mIdx <= monthsOrder.indexOf(currentLunaNume)) {
                    break;
                }
                
                let mReg = 0;
                let mRad = 0;
                if (state.historicalSummary && state.historicalSummary[String(y)] && state.historicalSummary[String(y)][m]) {
                    const item = state.historicalSummary[String(y)][m];
                    mReg = item.totalAutoReg + item.totalUtilReg;
                    mRad = item.totalRadieri;
                } else if (y === 2025) {
                    mReg = default2025Auto[m] || 0;
                    mRad = Math.round(mReg * 0.08);
                }
                subtractNet += (mReg - mRad);
            }
        }
        totalFleet = baseFleetDec2025 - subtractNet;
    }

    const summaryVal = document.getElementById('val-fleet-summary');
    if (summaryVal) {
        summaryVal.innerText = totalFleet.toLocaleString('ro-RO');
    }
    const summaryTitle = document.getElementById('annual-summary-title');
    if (summaryTitle) {
        summaryTitle.innerText = `TOTAL PARC AUTO (${currentLunaNume} '${String(currentYear).substring(2)})`;
    }
    const captionEl = document.getElementById('annual-chart-caption');
    if (captionEl) {
        captionEl.innerHTML = `* Datele aferente anului ${currentYear} sunt în curs de actualizare (ian – ${currentLunaNume.toLowerCase()}).`;
    }
    
    const annualContainer = document.getElementById('annual-evolution-list');
    if (annualContainer) {
        annualContainer.innerHTML = '';
        
        const maxQty = Math.max(...annualData.map(d => d.qty));
        const scaleMaxQty = maxQty * 1.15; // buffer de 15% pentru etichete
        
        // Afisam in ordine cronologica normala (stanga la dreapta)
        annualData.forEach(d => {
            const heightPct = ((d.qty / scaleMaxQty) * 100).toFixed(1);
            const is2026Class = d.active ? 'highlight' : '';
            
            const col = document.createElement('div');
            col.className = 'v-col-group';
            col.innerHTML = `
                <div class="v-bars">
                    <div class="v-bar-annual ${is2026Class}" style="height: ${heightPct}%;">
                        <span class="v-bar-val-static ${d.active ? 'active-year' : ''}">${d.qty.toLocaleString('ro-RO')}</span>
                    </div>
                </div>
                <div class="v-col-lbl" style="font-size: 0.72rem; font-weight: 700;">
                    ${d.year}${d.active ? '*' : ''}
                </div>
            `;
            annualContainer.appendChild(col);
        });
        setTimeout(() => {
            const scrollEl = annualContainer.parentElement || annualContainer;
            scrollEl.scrollLeft = scrollEl.scrollWidth;
        }, 150);
    }
}


const modelHistoryBase = [
    {
        "brand": "DACIA",
        "model": "DACIA SPRING",
        "start": 18672,
        "history": {
            "JAN": 68,
            "FEB": 86,
            "MAR": 61,
            "APR": 56
        }
    },
    {
        "brand": "TESLA",
        "model": "TESLA MODEL 3",
        "start": 6230,
        "history": {
            "JAN": 176,
            "FEB": 152,
            "MAR": 146,
            "APR": 165
        }
    },
    {
        "brand": "TESLA",
        "model": "TESLA MODEL Y",
        "start": 3971,
        "history": {
            "JAN": 171,
            "FEB": 160,
            "MAR": 107,
            "APR": 114
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI KONA",
        "start": 2730,
        "history": {
            "JAN": 38,
            "FEB": 44,
            "MAR": 47,
            "APR": 57
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT ZOE",
        "start": 2259,
        "history": {
            "JAN": 19,
            "FEB": 11,
            "MAR": 28,
            "APR": 27
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN UP",
        "start": 1717,
        "history": {
            "JAN": 0,
            "FEB": 1,
            "MAR": 1,
            "APR": 2
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN ID.3",
        "start": 1584,
        "history": {
            "JAN": 18,
            "FEB": 14,
            "MAR": 12,
            "APR": 14
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT MEGANE E-TECH",
        "start": 1476,
        "history": {
            "JAN": 6,
            "FEB": 17,
            "MAR": 6,
            "APR": 6
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN ID.4",
        "start": 1124,
        "history": {
            "JAN": 38,
            "FEB": 31,
            "MAR": 35,
            "APR": 24
        }
    },
    {
        "brand": "NISSAN",
        "model": "NISSAN LEAF",
        "start": 1092,
        "history": {
            "JAN": 12,
            "FEB": 15,
            "MAR": 8,
            "APR": 18
        }
    },
    {
        "brand": "BMW",
        "model": "BMW I3",
        "start": 915,
        "history": {
            "JAN": 3,
            "FEB": 2,
            "MAR": 2,
            "APR": 2
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQA",
        "start": 691,
        "history": {
            "JAN": 14,
            "FEB": 21,
            "MAR": 8,
            "APR": 11
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT KANGOO VAN E-TECH",
        "start": 656,
        "history": {
            "JAN": 14,
            "FEB": 3,
            "MAR": 7,
            "APR": 3
        }
    },
    {
        "brand": "SKODA",
        "model": "SKODA ENYAQ",
        "start": 635,
        "history": {
            "JAN": 3,
            "FEB": 8,
            "MAR": 14,
            "APR": 11
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN GOLF",
        "start": 583,
        "history": {
            "JAN": 2,
            "FEB": 5,
            "MAR": 0,
            "APR": 10
        }
    },
    {
        "brand": "TESLA",
        "model": "TESLA MODEL S",
        "start": 579,
        "history": {
            "JAN": 17,
            "FEB": 10,
            "MAR": 24,
            "APR": 13
        }
    },
    {
        "brand": "FIAT",
        "model": "FIAT 500",
        "start": 531,
        "history": {
            "JAN": 10,
            "FEB": 7,
            "MAR": 3,
            "APR": 8
        }
    },
    {
        "brand": "SMART",
        "model": "SMART EQ FORTWO",
        "start": 511,
        "history": {
            "JAN": 5,
            "FEB": 3,
            "MAR": 2,
            "APR": 4
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQE",
        "start": 507,
        "history": {
            "JAN": 1,
            "FEB": 8,
            "MAR": 8,
            "APR": 14
        }
    },
    {
        "brand": "FORD",
        "model": "FORD PUMA",
        "start": 502,
        "history": {
            "JAN": 60,
            "FEB": 57,
            "MAR": 63,
            "APR": 38
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI IONIQ 5",
        "start": 493,
        "history": {
            "JAN": 7,
            "FEB": 13,
            "MAR": 10,
            "APR": 5
        }
    },
    {
        "brand": "BMW",
        "model": "BMW I4",
        "start": 483,
        "history": {
            "JAN": 13,
            "FEB": 10,
            "MAR": 16,
            "APR": 13
        }
    },
    {
        "brand": "MINI",
        "model": "MINI COOPER SE",
        "start": 473,
        "history": {
            "JAN": 0,
            "FEB": 3,
            "MAR": 7,
            "APR": 3
        }
    },
    {
        "brand": "PEUGEOT",
        "model": "PEUGEOT 208",
        "start": 446,
        "history": {
            "JAN": 12,
            "FEB": 5,
            "MAR": 4,
            "APR": 8
        }
    },
    {
        "brand": "AUDI",
        "model": "AUDI E-TRON (SUV)",
        "start": 439,
        "history": {
            "JAN": 16,
            "FEB": 14,
            "MAR": 15,
            "APR": 23
        }
    },
    {
        "brand": "FORD",
        "model": "FORD MUSTANG MACH-E",
        "start": 432,
        "history": {
            "JAN": 6,
            "FEB": 10,
            "MAR": 10,
            "APR": 9
        }
    },
    {
        "brand": "FORD",
        "model": "FORD TRANSIT",
        "start": 416,
        "history": {
            "JAN": 6,
            "FEB": 14,
            "MAR": 13,
            "APR": 22
        }
    },
    {
        "brand": "BMW",
        "model": "BMW IX",
        "start": 397,
        "history": {
            "JAN": 5,
            "FEB": 6,
            "MAR": 2,
            "APR": 11
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI INSTER",
        "start": 391,
        "history": {
            "JAN": 27,
            "FEB": 26,
            "MAR": 11,
            "APR": 12
        }
    },
    {
        "brand": "SMART",
        "model": "SMART EQ FORFOUR",
        "start": 384,
        "history": {
            "JAN": 4,
            "FEB": 1,
            "MAR": 2,
            "APR": 2
        }
    },
    {
        "brand": "FORD",
        "model": "FORD EXPLORER",
        "start": 377,
        "history": {
            "JAN": 33,
            "FEB": 26,
            "MAR": 31,
            "APR": 19
        }
    },
    {
        "brand": "VOLVO",
        "model": "VOLVO EX30",
        "start": 373,
        "history": {
            "JAN": 22,
            "FEB": 18,
            "MAR": 19,
            "APR": 7
        }
    },
    {
        "brand": "TESLA",
        "model": "TESLA MODEL X",
        "start": 365,
        "history": {
            "JAN": 5,
            "FEB": 6,
            "MAR": 8,
            "APR": 5
        }
    },
    {
        "brand": "PEUGEOT",
        "model": "PEUGEOT 2008",
        "start": 362,
        "history": {
            "JAN": 18,
            "FEB": 12,
            "MAR": 11,
            "APR": 6
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT RENAULT 5 E-TECH",
        "start": 349,
        "history": {
            "JAN": 36,
            "FEB": 28,
            "MAR": 24,
            "APR": 22
        }
    },
    {
        "brand": "SKODA",
        "model": "SKODA CITIGO",
        "start": 330,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 0,
            "APR": 1
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQS",
        "start": 324,
        "history": {
            "JAN": 4,
            "FEB": 2,
            "MAR": 3,
            "APR": 3
        }
    },
    {
        "brand": "MAZDA",
        "model": "MAZDA MX-30",
        "start": 306,
        "history": {
            "JAN": 4,
            "FEB": 3,
            "MAR": 5,
            "APR": 3
        }
    },
    {
        "brand": "MG",
        "model": "MG MG4",
        "start": 302,
        "history": {
            "JAN": 45,
            "FEB": 54,
            "MAR": 17,
            "APR": 20
        }
    },
    {
        "brand": "LEAPMOTOR",
        "model": "LEAPMOTOR T03",
        "start": 299,
        "history": {
            "JAN": 39,
            "FEB": 26,
            "MAR": 10,
            "APR": 5
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQB",
        "start": 297,
        "history": {
            "JAN": 2,
            "FEB": 2,
            "MAR": 1,
            "APR": 1
        }
    },
    {
        "brand": "PORSCHE",
        "model": "PORSCHE TAYCAN",
        "start": 294,
        "history": {
            "JAN": 2,
            "FEB": 7,
            "MAR": 4,
            "APR": 7
        }
    },
    {
        "brand": "TOYOTA",
        "model": "TOYOTA BZ4X",
        "start": 294,
        "history": {
            "JAN": 4,
            "FEB": 4,
            "MAR": 2,
            "APR": 4
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQC",
        "start": 287,
        "history": {
            "JAN": 6,
            "FEB": 5,
            "MAR": 4,
            "APR": 4
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EVITO",
        "start": 252,
        "history": {
            "JAN": 3,
            "FEB": 6,
            "MAR": 3,
            "APR": 7
        }
    },
    {
        "brand": "BMW",
        "model": "BMW IX1",
        "start": 246,
        "history": {
            "JAN": 8,
            "FEB": 9,
            "MAR": 7,
            "APR": 10
        }
    },
    {
        "brand": "FORD",
        "model": "FORD CAPRI",
        "start": 243,
        "history": {
            "JAN": 11,
            "FEB": 11,
            "MAR": 13,
            "APR": 7
        }
    },
    {
        "brand": "OPEL",
        "model": "OPEL CORSA",
        "start": 241,
        "history": {
            "JAN": 3,
            "FEB": 5,
            "MAR": 1,
            "APR": 3
        }
    },
    {
        "brand": "KIA",
        "model": "KIA NIRO",
        "start": 232,
        "history": {
            "JAN": 3,
            "FEB": 9,
            "MAR": 10,
            "APR": 17
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI IONIQ",
        "start": 223,
        "history": {
            "JAN": 3,
            "FEB": 4,
            "MAR": 1,
            "APR": 5
        }
    },
    {
        "brand": "BYD",
        "model": "BYD DOLPHIN SURF",
        "start": 220,
        "history": {
            "JAN": 112,
            "FEB": 100,
            "MAR": 57,
            "APR": 57
        }
    },
    {
        "brand": "VOLVO",
        "model": "VOLVO EX40",
        "start": 217,
        "history": {
            "JAN": 2,
            "FEB": 4,
            "MAR": 4,
            "APR": 8
        }
    },
    {
        "brand": "BMW",
        "model": "BMW IX3",
        "start": 214,
        "history": {
            "JAN": 6,
            "FEB": 3,
            "MAR": 5,
            "APR": 3
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN ID.5",
        "start": 209,
        "history": {
            "JAN": 1,
            "FEB": 2,
            "MAR": 2,
            "APR": 3
        }
    },
    {
        "brand": "AUDI",
        "model": "AUDI Q4 E-TRON",
        "start": 202,
        "history": {
            "JAN": 6,
            "FEB": 7,
            "MAR": 5,
            "APR": 7
        }
    },
    {
        "brand": "MG",
        "model": "MG ZS",
        "start": 199,
        "history": {
            "JAN": 12,
            "FEB": 12,
            "MAR": 14,
            "APR": 16
        }
    },
    {
        "brand": "JAGUAR",
        "model": "JAGUAR I-PACE",
        "start": 186,
        "history": {
            "JAN": 2,
            "FEB": 0,
            "MAR": 3,
            "APR": 1
        }
    },
    {
        "brand": "MAXUS",
        "model": "MAXUS MAXUS E-DELIVER 3",
        "start": 178,
        "history": {
            "JAN": 1,
            "FEB": 13,
            "MAR": 1,
            "APR": 8
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI IONIQ 6",
        "start": 167,
        "history": {
            "JAN": 4,
            "FEB": 3,
            "MAR": 4,
            "APR": 5
        }
    },
    {
        "brand": "CITROEN",
        "model": "CITROEN E-C4",
        "start": 163,
        "history": {
            "JAN": 1,
            "FEB": 1,
            "MAR": 0,
            "APR": 0
        }
    },
    {
        "brand": "KIA",
        "model": "KIA EV6",
        "start": 151,
        "history": {
            "JAN": 1,
            "FEB": 3,
            "MAR": 3,
            "APR": 2
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT SCENIC E-TECH",
        "start": 143,
        "history": {
            "JAN": 2,
            "FEB": 2,
            "MAR": 2,
            "APR": 6
        }
    },
    {
        "brand": "TOYOTA",
        "model": "TOYOTA PROACE CITY",
        "start": 133,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 0,
            "APR": 1
        }
    },
    {
        "brand": "OPEL",
        "model": "OPEL MOKKA",
        "start": 127,
        "history": {
            "JAN": 4,
            "FEB": 1,
            "MAR": 1,
            "APR": 17
        }
    },
    {
        "brand": "NISSAN",
        "model": "NISSAN E-NV200",
        "start": 121,
        "history": {
            "JAN": 0,
            "FEB": 1,
            "MAR": 4,
            "APR": 6
        }
    },
    {
        "brand": "KIA",
        "model": "KIA SOUL",
        "start": 114,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 3,
            "APR": 4
        }
    },
    {
        "brand": "BYD",
        "model": "BYD SEALION 7",
        "start": 111,
        "history": {
            "JAN": 23,
            "FEB": 32,
            "MAR": 54,
            "APR": 70
        }
    },
    {
        "brand": "BMW",
        "model": "BMW I7",
        "start": 100,
        "history": {
            "JAN": 3,
            "FEB": 2,
            "MAR": 1,
            "APR": 2
        }
    },
    {
        "brand": "NISSAN",
        "model": "NISSAN ARIYA",
        "start": 92,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 0,
            "APR": 0
        }
    },
    {
        "brand": "VOLVO",
        "model": "VOLVO EC40",
        "start": 92,
        "history": {
            "JAN": 1,
            "FEB": 2,
            "MAR": 1,
            "APR": 1
        }
    },
    {
        "brand": "SKODA",
        "model": "SKODA ELROQ",
        "start": 55,
        "history": {
            "JAN": 4,
            "FEB": 12,
            "MAR": 5,
            "APR": 5
        }
    },
    {
        "brand": "CITROEN",
        "model": "CITROEN E-C3",
        "start": 58,
        "history": {
            "JAN": 2,
            "FEB": 4,
            "MAR": 1,
            "APR": 1
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT 4 E-TECH",
        "start": 41,
        "history": {
            "JAN": 2,
            "FEB": 7,
            "MAR": 4,
            "APR": 6
        }
    },
    {
        "brand": "KIA",
        "model": "KIA EV3",
        "start": 53,
        "history": {
            "JAN": 7,
            "FEB": 8,
            "MAR": 1,
            "APR": 3
        }
    },
    {
        "brand": "AUDI",
        "model": "AUDI Q6 E-TRON",
        "start": 39,
        "history": {
            "JAN": 3,
            "FEB": 1,
            "MAR": 0,
            "APR": 2
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN ID.7",
        "start": 90,
        "history": {
            "JAN": 3,
            "FEB": 6,
            "MAR": 4,
            "APR": 1
        }
    },
    {
        "brand": "BYD",
        "model": "BYD ATTO 2",
        "start": 51,
        "history": {
            "JAN": 25,
            "FEB": 24,
            "MAR": 29,
            "APR": 26
        }
    },
    {
        "brand": "BYD",
        "model": "BYD SEAL",
        "start": 55,
        "history": {
            "JAN": 8,
            "FEB": 10,
            "MAR": 16,
            "APR": 11
        }
    },
    {
        "brand": "BYD",
        "model": "BYD SEAL U",
        "start": 25,
        "history": {
            "JAN": 2,
            "FEB": 2,
            "MAR": 5,
            "APR": 11
        }
    },
    {
        "brand": "BMW",
        "model": "BMW IX3 Neue Klasse",
        "start": 0,
        "history": {
            "JAN": 3,
            "FEB": 3,
            "MAR": 2,
            "APR": 14
        }
    },
    {
        "brand": "Alte Modele",
        "model": "Alte Modele",
        "start": 0,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 0,
            "APR": 0
        }
    }
];

// Normalizare marca
function normalizeazaMarca(marca) {
    if (!marca) return "";
    let m = marca.toString().toUpperCase().trim().replace(/,/g, ".").replace(/-/g, " ").replace(/\s+/g, " ");
    if (m.includes("MERCEDES")) return "MERCEDES BENZ";
    if (m.includes("VW") || m.includes("VOLKSWAGEN")) return "VOLKSWAGEN";
    if (m.includes("BMW")) return "BMW";
    if (m.includes("TESLA")) return "TESLA";
    return m;
}

// Aplica reguli specifice
function aplicaReguliSpecifice(marca, model) {
    const m = marca;
    if (!model) return "";
    let mod = model.toString().toUpperCase().trim().replace(/,/g, ".").replace(/-/g, " ").replace(/\s+/g, " ");
    
    // 1. AUDI
    if (m === "AUDI") {
        if (mod.includes("Q4")) return "AUDI Q4 E-TRON";
        if (mod.includes("Q6")) return "AUDI Q6 E-TRON";
        if (mod.includes("E TRON") || mod.includes("ETRON")) {
            if (!mod.includes("GT") && !mod.includes("Q8") && !mod.includes("A6")) {
                return "AUDI E-TRON (SUV)";
            }
        }
    }
    
    // 2. BMW iX3 Neue Klasse
    if (m === "BMW" && mod.includes("IX3 50 XDRIVE")) {
        return "BMW IX3 NEUE KLASSE";
    }
    
    // 3. MERCEDES
    if (m === "MERCEDES BENZ") {
        if (mod.includes("EQE")) return "MERCEDES BENZ EQE";
        if (mod.includes("EQA")) return "MERCEDES BENZ EQA";
        if (mod.includes("EQB")) return "MERCEDES BENZ EQB";
        if (mod.includes("EQS")) return "MERCEDES BENZ EQS";
        if (mod.includes("EQC")) return "MERCEDES BENZ EQC";
        if (mod.includes("EVITO")) return "MERCEDES BENZ EVITO";
        if (mod.includes("ESPRINTER")) return "MERCEDES BENZ ESPRINTER";
    }
    
    // 4. VW
    if (m === "VOLKSWAGEN") {
        if (mod.includes("ID 4") || mod.includes("ID.4")) return "VOLKSWAGEN ID.4";
        if (mod.includes("ID 3") || mod.includes("ID.3")) return "VOLKSWAGEN ID.3";
        if (mod.includes("ID 5") || mod.includes("ID.5")) return "VOLKSWAGEN ID.5";
        if (mod.includes("ID 7") || mod.includes("ID.7")) return "VOLKSWAGEN ID.7";
        if (mod.includes("UP")) return "VOLKSWAGEN UP";
    }
    
    // 5. MG4
    if (m === "MG" && mod.includes("MG4")) return "MG MG4";
    
    // 6. Maxus
    if (m === "MAXUS") {
        if (mod.includes("DELIVER 3")) return "MAXUS MAXUS E-DELIVER 3";
        if (mod.includes("DELIVER 9")) return "MAXUS MAXUS EDELIVER 9";
    }
    
    // 7. Renault
    if (m === "RENAULT") {
        if (mod.includes("RENAULT 5") || mod === "5" || mod.includes("5 E TECH")) return "RENAULT RENAULT 5 E-TECH";
        if (mod.includes("RENAULT 4") || mod === "4" || mod.includes("4 E TECH")) return "RENAULT RENAULT 4 E-TECH";
    }
    
    // 8. Toyota
    if (m === "TOYOTA") {
        if (mod.includes("PROACE CITY")) return "TOYOTA PROACE CITY";
        if (mod.includes("BZ4X") || mod.includes("BZ 4X")) return "TOYOTA BZ4X";
    }
    
    // 9. KIA
    if (m === "KIA" && (mod.includes("EV6") || mod.includes("EV 6"))) return "KIA EV6";
    
    // 10. VOLVO
    if (m === "VOLVO") {
        if (mod.includes("XC40") || mod.includes("EX40")) return "VOLVO EX40";
        if (mod.includes("C40") || mod.includes("EC40")) return "VOLVO EC40";
    }
    
    // 11. HYUNDAI
    if (m === "HYUNDAI") {
        if (mod.includes("IONIQ 5") || mod.includes("IONIQ5")) return "HYUNDAI IONIQ 5";
        if (mod.includes("IONIQ 6") || mod.includes("IONIQ6")) return "HYUNDAI IONIQ 6";
        if (mod.includes("IONIQ")) return "HYUNDAI IONIQ";
    }
    
    // 12. TESLA
    if (m === "TESLA") {
        if (mod.includes("MODEL 3") || mod.includes("MODEL3")) return "TESLA MODEL 3";
        if (mod.includes("MODEL Y") || mod.includes("MODELY")) return "TESLA MODEL Y";
        if (mod.includes("MODEL S") || mod.includes("MODELS")) return "TESLA MODEL S";
        if (mod.includes("MODEL X") || mod.includes("MODELX")) return "TESLA MODEL X";
    }
    
    return mod;
}

// Calculeaza cumulat YTD si Parc
function computeYtdAndParcData(selectedMonthNume, currentRawInmatriculari) {
    const data = JSON.parse(JSON.stringify(modelHistoryBase));
    
    data.forEach(item => {
        item.current_monthly = 0;
    });
    
    const grupateBrute = {};
    currentRawInmatriculari.forEach(item => {
        const marcaNorm = normalizeazaMarca(item.marca);
        const modelNorm = aplicaReguliSpecifice(marcaNorm, item.model);
        const key = marcaNorm + "|" + modelNorm;
        grupateBrute[key] = (grupateBrute[key] || 0) + item.volum;
    });
    
    let alteModeleVolum = 0;
    
    for (const key in grupateBrute) {
        const parts = key.split('|');
        const marcaBrut = parts[0];
        const modelBrut = parts[1];
        const volum = grupateBrute[key];
        let identificat = false;
        
        const fullBrutName = marcaBrut + " " + modelBrut;
        const wordsBrut = fullBrutName.split(" ");
        
        for (let i = 0; i < data.length - 1; i++) {
            const itemExcel = data[i];
            const mExcelNorm = normalizeazaMarca(itemExcel.brand);
            const modExcelNorm = itemExcel.model.toString().toUpperCase().trim().replace(/,/g, ".").replace(/-/g, " ").replace(/\s+/g, " ");
            
            if (mExcelNorm === marcaBrut) {
                const wordsExcel = modExcelNorm.split(" ");
                let isSubset = true;
                for (let k = 0; k < wordsExcel.length; k++) {
                    if (wordsExcel[k] && !wordsBrut.includes(wordsExcel[k])) {
                        isSubset = false;
                        break;
                    }
                }
                
                if (isSubset) {
                    itemExcel.current_monthly += volum;
                    identificat = true;
                    break;
                }
            }
        }
        
        if (!identificat) {
            alteModeleVolum += volum;
        }
    }
    
    const alteModeleItem = data[data.length - 1];
    alteModeleItem.current_monthly = alteModeleVolum;
    
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonthIdx = Math.max(0, monthsOrder.indexOf((selectedMonthNume || "").toUpperCase().trim()));
    
    let totalMonthlySum = 0;
    let totalYtdSum = 0;
    let totalParcSum = 0;
    
    data.forEach(item => {
        item.history[selectedMonthNume] = item.current_monthly;
        
        let ytdSum = 0;
        for (let i = 0; i <= currentMonthIdx; i++) {
            ytdSum += (item.history[monthsOrder[i]] || 0);
        }
        
        item.ytd = ytdSum;
        item.parc = item.start + ytdSum;
        
        totalMonthlySum += item.current_monthly;
        totalYtdSum += item.ytd;
        totalParcSum += item.parc;
    });
    
    return {
        models: data,
        totals: {
            monthly: totalMonthlySum,
            ytd: totalYtdSum,
            parc: totalParcSum
        }
    };
}
