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

document.addEventListener('DOMContentLoaded', async () => {
    await initHistoricalSummary();
    initUI();
});

function initUI() {
    console.log("%c© 2026 Tudor Marchis & Electromobilitate. Toate drepturile rezervate. EV Radar România.", "color: #004b87; font-weight: bold; font-size: 13px;");
    const select = document.getElementById('public-month-select');
    if (!select) return;
    
    // Incarcam datele pentru selectia initiala
    loadMonthData();
    
    select.addEventListener('change', () => {
        loadMonthData();
    });
}

async function loadMonthData() {
    const select = document.getElementById('public-month-select');
    const [luna, lunaNume] = select.value.split('|');
    
    // Asigura formatul YYYY-MM (cu cratima) pentru fisierele din folderul rapoarte/
    const lunaHyphen = luna.includes('-') ? luna : `${luna.substring(0, 4)}-${luna.substring(4)}`;
    
    try {
        let response = await fetch(`rapoarte/dashboard_${lunaHyphen}.json?t=${Date.now()}`);
        if (!response.ok) {
            response = await fetch(`rapoarte/dashboard_${luna}.json?t=${Date.now()}`);
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
        const cached = localStorage.getItem('ev_radar_ro_data_' + luna) || localStorage.getItem('ev_radar_ro_data_' + lunaNume);
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
    
    document.getElementById('val-auto-reg').innerText = state.data.totalAutoReg;
    document.getElementById('val-util-reg').innerText = state.data.totalUtilReg;
    document.getElementById('val-total-rad').innerText = state.data.totalRadieri;
    document.getElementById('val-net-growth').innerText = netGrowth;
    
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
    
    document.getElementById('val-national-fleet').innerText = totalFleet.toLocaleString('ro-RO');
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
    document.getElementById('val-firme-qty').innerText = (state.data.totalFirme || 0).toLocaleString('ro-RO');
    document.getElementById('val-pf-pct').innerText = `${pfPct.toFixed(2)}%`;
    document.getElementById('val-pf-qty').innerText = (state.data.totalPf || 0).toLocaleString('ro-RO');
    
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
                yearTotalReg += (item.totalAutoReg + item.totalUtilReg - item.totalRadieri);
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
    }
}
