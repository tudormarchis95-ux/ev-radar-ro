/* 
  Copyright © 2026 Tudor Marchis & Electromobilitate. Toate drepturile rezervate.
  Cod de monitorizare înmatriculări EV protejat intelectual.
*/

// Starea vizualizatorului public
const state = {
    data: null
};

document.addEventListener('DOMContentLoaded', () => {
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
    const dashboard = document.getElementById('results-dashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
    }
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
    
    const dashboard = document.getElementById('results-dashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
    }
    
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    const netGrowth = totalEV - state.data.totalRadieri;
    
    document.getElementById('val-auto-reg').innerText = state.data.totalAutoReg;
    document.getElementById('val-util-reg').innerText = state.data.totalUtilReg;
    document.getElementById('val-total-rad').innerText = state.data.totalRadieri;
    document.getElementById('val-net-growth').innerText = netGrowth;
    
    // Calculeaza parcul auto national total estimat
    const base2025 = 63986;
    const history2026 = {
        'JAN': 1410 - 85,
        'FEB': 1370 - 92,
        'MAR': 1206 - 186,
        'APR': 1306 - 49,
        'MAY': 1505 - 103,
        'JUN': 0, 'JUL': 0, 'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0
    };
    
    history2026[state.data.lunaNume] = netGrowth;
    
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let totalFleet = base2025;
    for (const m of monthsOrder) {
        totalFleet += history2026[m];
        if (m === state.data.lunaNume) break;
    }
    
    document.getElementById('val-national-fleet').innerText = totalFleet.toLocaleString('ro-RO');
    document.getElementById('fleet-month-name').innerText = state.data.lunaNume + " 2026";
    document.getElementById('divider-month-name').innerText = state.data.lunaNume + " 2026";
    
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
        'JAN': 1410, 'FEB': 1370, 'MAR': 1206, 'APR': 1306, 'MAY': 1505,
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
    
    // 2. Evolutie Anuala 2011 - Prezent (Format Vertical)
    const annualData = [
        { year: 2011, qty: 7 },
        { year: 2012, qty: 5 },
        { year: 2013, qty: 50 },
        { year: 2014, qty: 16 },
        { year: 2015, qty: 32 },
        { year: 2016, qty: 104 },
        { year: 2017, qty: 247 },
        { year: 2018, qty: 710 },
        { year: 2019, qty: 1747 },
        { year: 2020, qty: 3134 },
        { year: 2021, qty: 6831 },
        { year: 2022, qty: 12466 },
        { year: 2023, qty: 16852 },
        { year: 2024, qty: 12677 },
        { year: 2025, qty: 12756 }
    ];
    
    // Calculeaza parcul auto total estimat (similar cu cardul principal)
    const base2025 = 63986;
    const history2026 = {
        'JAN': 1410 - 85,
        'FEB': 1370 - 92,
        'MAR': 1206 - 186,
        'APR': 1306 - 49,
        'MAY': 1505 - 103,
        'JUN': 0, 'JUL': 0, 'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0
    };
    
    // Calculam netGrowth din datele curente ale lunii selectate
    const netGrowth = (state.data.totalAutoReg + state.data.totalUtilReg) - state.data.totalRadieri;
    history2026[currentLunaNume] = netGrowth;
    
    let totalFleet = base2025;
    for (const m of monthsOrder) {
        totalFleet += history2026[m];
        if (m === currentLunaNume) break;
    }
    
    // Adaugam 2026 in mod dinamic cu valoarea inmatricularilor nete din 2026 pana in prezent
    annualData.push({ year: 2026, qty: totalFleet - base2025, active: true });
    
    // Actualizam caseta de sumare din card
    const summaryVal = document.getElementById('val-fleet-summary');
    if (summaryVal) {
        summaryVal.innerText = totalFleet.toLocaleString('ro-RO');
    }
    const summaryTitle = document.getElementById('annual-summary-title');
    if (summaryTitle) {
        summaryTitle.innerText = `TOTAL PARC AUTO (${currentLunaNume} '26)`;
    }
    const captionEl = document.getElementById('annual-chart-caption');
    if (captionEl) {
        captionEl.innerHTML = `* Date aferente anului 2026 sunt în curs de actualizare (${monthsOrder[0].toLowerCase()} – ${currentLunaNume.toLowerCase()}).`;
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
            col.id = `annual-col-${d.year}`;
            annualContainer.appendChild(col);
        });
        
        // Scroll anual la dreapta (ultimul an, 2026)
        setTimeout(() => {
            const container = annualContainer.closest('.v-chart-container');
            if (container) {
                container.scrollLeft = container.scrollWidth;
            }
        }, 100);
    }

    // Scroll grafic lunar să centreze luna selectată
    const compContainer = document.getElementById('monthly-comp-list');
    if (compContainer) {
        setTimeout(() => {
            const container = compContainer.closest('.v-chart-container');
            if (container) {
                // Găsește elementul lunii curente
                const monthCols = compContainer.querySelectorAll('.v-col-group');
                const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                const currentIdx = monthsOrder.indexOf(state.data.lunaNume);
                if (currentIdx !== -1 && monthCols[currentIdx]) {
                    const targetCol = monthCols[currentIdx];
                    const containerWidth = container.clientWidth;
                    const colOffsetLeft = targetCol.offsetLeft;
                    const colWidth = targetCol.clientWidth;
                    // Centrează coloana target
                    container.scrollLeft = colOffsetLeft - (containerWidth / 2) + (colWidth / 2);
                }
            }
        }, 100);
    }
}
