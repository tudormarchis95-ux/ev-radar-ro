// Starea vizualizatorului public
const state = {
    data: null
};

document.addEventListener('DOMContentLoaded', () => {
    initUI();
});

function initUI() {
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
        // Incercare 1: Citire din folderul static (pentru cand este publicat pe web)
        let response = await fetch(`rapoarte/dashboard_${lunaHyphen}.json`);
        if (!response.ok) {
            // Incercare cu numele fara cratima
            response = await fetch(`rapoarte/dashboard_${luna}.json`);
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
    
    // Calculeaza parcul auto national total estimat
    const base2025 = 63986;
    const history2026 = {
        'JAN': 1411 - 86,
        'FEB': 1372 - 92,
        'MAR': 1209 - 188,
        'APR': 1308 - 49,
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
    document.getElementById('lbl-yoy-growth').innerText = `Creștere YoY vs ${state.data.lunaNume} 2025`;
    document.getElementById('val-yoy-growth').innerText = `${sign}${state.data.yoyGrowth.toFixed(2)}%`;
    
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
}
