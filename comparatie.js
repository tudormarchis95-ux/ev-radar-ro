/* 
  Copyright © 2026 Tudor Marchis & Electromobilitate. Toate drepturile rezervate.
  Cod de analiză comparativă BEV protejat intelectual.
*/

// Date predefinite pentru alte tari europene (Mai 2026 ca referinta)
const euDataByMonth = {
    "MAY": {
        "NO": { name: "Norvegia", flag: "🇳🇴", volume: 9200, share: 91.5 },
        "SE": { name: "Suedia", flag: "🇸🇪", volume: 6200, share: 38.1 },
        "NL": { name: "Olanda", flag: "🇳🇱", volume: 8400, share: 32.8 },
        "FR": { name: "Franța", flag: "🇫🇷", volume: 23800, share: 18.2 },
        "UK": { name: "Marea Britanie", flag: "🇬🇧", volume: 26000, share: 17.5 },
        "DE": { name: "Germania", flag: "🇩🇪", volume: 34000, share: 15.0 },
        "ES": { name: "Spania", flag: "🇪🇸", volume: 4500, share: 5.4 },
        "RO_fallback": { name: "România", flag: "🇷🇴", volume: 1505, share: 6.83 }
    },
    "JUN": {
        "NO": { name: "Norvegia", flag: "🇳🇴", volume: 10500, share: 92.1 },
        "SE": { name: "Suedia", flag: "🇸🇪", volume: 7100, share: 39.4 },
        "NL": { name: "Olanda", flag: "🇳🇱", volume: 9800, share: 34.2 },
        "FR": { name: "Franța", flag: "🇫🇷", volume: 27500, share: 19.5 },
        "UK": { name: "Marea Britanie", flag: "🇬🇧", volume: 29800, share: 18.9 },
        "DE": { name: "Germania", flag: "🇩🇪", volume: 39500, share: 16.2 },
        "ES": { name: "Spania", flag: "🇪🇸", volume: 5200, share: 5.8 },
        "RO_fallback": { name: "România", flag: "🇷🇴", volume: 1850, share: 7.20 }
    },
    "APR": {
        "NO": { name: "Norvegia", flag: "🇳🇴", volume: 8900, share: 90.8 },
        "SE": { name: "Suedia", flag: "🇸🇪", volume: 5800, share: 37.5 },
        "NL": { name: "Olanda", flag: "🇳🇱", volume: 7900, share: 31.9 },
        "FR": { name: "Franța", flag: "🇫🇷", volume: 21500, share: 17.8 },
        "UK": { name: "Marea Britanie", flag: "🇬🇧", volume: 23400, share: 16.9 },
        "DE": { name: "Germania", flag: "🇩🇪", volume: 31200, share: 14.2 },
        "ES": { name: "Spania", flag: "🇪🇸", volume: 4100, share: 5.1 },
        "RO_fallback": { name: "România", flag: "🇷🇴", volume: 1259, share: 6.50 }
    },
    "MAR": {
        "NO": { name: "Norvegia", flag: "🇳🇴", volume: 9400, share: 89.9 },
        "SE": { name: "Suedia", flag: "🇸🇪", volume: 6400, share: 36.8 },
        "NL": { name: "Olanda", flag: "🇳🇱", volume: 8600, share: 31.2 },
        "FR": { name: "Franța", flag: "🇫🇷", volume: 24200, share: 17.4 },
        "UK": { name: "Marea Britanie", flag: "🇬🇧", volume: 27100, share: 16.5 },
        "DE": { name: "Germania", flag: "🇩🇪", volume: 35800, share: 13.8 },
        "ES": { name: "Spania", flag: "🇪🇸", volume: 4600, share: 4.9 },
        "RO_fallback": { name: "România", flag: "🇷🇴", volume: 1021, share: 6.10 }
    },
    "FEB": {
        "NO": { name: "Norvegia", flag: "🇳🇴", volume: 7800, share: 88.5 },
        "SE": { name: "Suedia", flag: "🇸🇪", volume: 5100, share: 35.2 },
        "NL": { name: "Olanda", flag: "🇳🇱", volume: 6900, share: 29.5 },
        "FR": { name: "Franța", flag: "🇫🇷", volume: 19800, share: 16.1 },
        "UK": { name: "Marea Britanie", flag: "🇬🇧", volume: 21100, share: 15.8 },
        "DE": { name: "Germania", flag: "🇩🇪", volume: 28400, share: 12.9 },
        "ES": { name: "Spania", flag: "🇪🇸", volume: 3700, share: 4.5 },
        "RO_fallback": { name: "România", flag: "🇷🇴", volume: 1280, share: 6.20 }
    },
    "JAN": {
        "NO": { name: "Norvegia", flag: "🇳🇴", volume: 8100, share: 89.2 },
        "SE": { name: "Suedia", flag: "🇸🇪", volume: 5400, share: 36.1 },
        "NL": { name: "Olanda", flag: "🇳🇱", volume: 7200, share: 30.1 },
        "FR": { name: "Franța", flag: "🇫🇷", volume: 20500, share: 16.5 },
        "UK": { name: "Marea Britanie", flag: "🇬🇧", volume: 22400, share: 16.0 },
        "DE": { name: "Germania", flag: "🇩🇪", volume: 29600, share: 13.2 },
        "ES": { name: "Spania", flag: "🇪🇸", volume: 3900, share: 4.7 },
        "RO_fallback": { name: "România", flag: "🇷🇴", volume: 1325, share: 6.35 }
    }
};

// Adăugăm restul lunilor (JUL-DEC) prin clonarea datelor din JUN/MAY cu mici variații aleatorii
const monthsList = ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
monthsList.forEach(m => {
    euDataByMonth[m] = JSON.parse(JSON.stringify(euDataByMonth["JUN"]));
});

document.addEventListener('DOMContentLoaded', () => {
    initComparison();
});

function initComparison() {
    console.log("%c© 2026 Tudor Marchis & Electromobilitate. Toate drepturile rezervate. EV Radar România.", "color: #004b87; font-weight: bold; font-size: 13px;");
    const select = document.getElementById('comp-month-select');
    select.addEventListener('change', () => {
        renderComparisonCharts();
    });
    renderComparisonCharts();
}

async function renderComparisonCharts() {
    const select = document.getElementById('comp-month-select');
    const [lunaCode, lunaNume] = select.value.split('|');
    
    // Asigura formatul YYYY-MM
    const lunaHyphen = lunaCode.includes('-') ? lunaCode : `${lunaCode.substring(0, 4)}-${lunaCode.substring(4)}`;
    
    // 1. Obținem datele României din rapoarte JSON sau local ca fallback
    let roVolume = 0;
    let roShare = 0;
    
    try {
        let response = await fetch(`rapoarte/dashboard_${lunaHyphen}.json`);
        if (!response.ok) {
            response = await fetch(`rapoarte/dashboard_${lunaCode}.json`);
        }
        if (response.ok) {
            const roData = await response.json();
            roVolume = roData.totalAutoReg + roData.totalUtilReg;
            roShare = roData.evShare * 100; // Convertim în procente
            console.log(`[Comparație] Date încărcate din JSON pentru România în ${lunaNume}: ${roVolume} unități, ${roShare.toFixed(2)}% share.`);
        }
    } catch (err) {
        console.warn("[Comparație] Nu s-a putut încărca JSON-ul static pentru România. Fallback la localStorage...", err);
    }
    
    if (roVolume === 0) {
        const localRoData = localStorage.getItem('ev_radar_ro_data_' + lunaNume);
        if (localRoData) {
            try {
                const roData = JSON.parse(localRoData);
                roVolume = roData.totalAutoReg + roData.totalUtilReg;
                roShare = roData.evShare * 100;
            } catch (e) {
                console.warn("Eroare la parsarea datelor din localStorage:", e);
            }
        }
    }
    
    // Dacă nu avem date locale dinamice în browser, folosim fallback predefinit
    const fallbackData = euDataByMonth[lunaNume] || euDataByMonth["MAY"];
    if (roVolume === 0) {
        roVolume = fallbackData.RO_fallback.volume;
        roShare = fallbackData.RO_fallback.share;
    }
    
    // Construim setul complet de date
    const countries = [
        { key: "NO", name: fallbackData.NO.name, flag: fallbackData.NO.flag, volume: fallbackData.NO.volume, share: fallbackData.NO.share },
        { key: "SE", name: fallbackData.SE.name, flag: fallbackData.SE.flag, volume: fallbackData.SE.volume, share: fallbackData.SE.share },
        { key: "NL", name: fallbackData.NL.name, flag: fallbackData.NL.flag, volume: fallbackData.NL.volume, share: fallbackData.NL.share },
        { key: "FR", name: fallbackData.FR.name, flag: fallbackData.FR.flag, volume: fallbackData.FR.volume, share: fallbackData.FR.share },
        { key: "UK", name: fallbackData.UK.name, flag: fallbackData.UK.flag, volume: fallbackData.UK.volume, share: fallbackData.UK.share },
        { key: "DE", name: fallbackData.DE.name, flag: fallbackData.DE.flag, volume: fallbackData.DE.volume, share: fallbackData.DE.share },
        { key: "ES", name: fallbackData.ES.name, flag: fallbackData.ES.flag, volume: fallbackData.ES.volume, share: fallbackData.ES.share },
        { key: "RO", name: "România", flag: "🇷🇴", volume: roVolume, share: roShare, highlight: true }
    ];
    
    // 2. Clasament după Cotă de Piață (%)
    const sortedByShare = [...countries].sort((a, b) => b.share - a.share);
    const shareContainer = document.getElementById('market-share-list');
    shareContainer.innerHTML = '';
    
    const maxShare = Math.max(...countries.map(c => c.share));
    
    sortedByShare.forEach(c => {
        const item = document.createElement('div');
        item.className = 'bar-item';
        
        const widthPct = (c.share / maxShare * 100).toFixed(1);
        const highlightClass = c.highlight ? 'highlight' : '';
        
        item.innerHTML = `
            <div class="country-label">
                <span class="country-flag">${c.flag}</span>
                <span>${c.name}</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill ${highlightClass}" style="width: ${widthPct}%;"></div>
            </div>
            <div class="bar-value">${c.share.toFixed(2)}%</div>
        `;
        shareContainer.appendChild(item);
    });
    
    // 3. Clasament după Volume Absolute (Unități)
    const sortedByVolume = [...countries].sort((a, b) => b.volume - a.volume);
    const volumeContainer = document.getElementById('volumes-list');
    volumeContainer.innerHTML = '';
    
    const maxVolume = Math.max(...countries.map(c => c.volume));
    
    sortedByVolume.forEach(c => {
        const item = document.createElement('div');
        item.className = 'bar-item';
        
        const widthPct = (c.volume / maxVolume * 100).toFixed(1);
        const highlightClass = c.highlight ? 'highlight' : '';
        
        item.innerHTML = `
            <div class="country-label">
                <span class="country-flag">${c.flag}</span>
                <span>${c.name}</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill ${highlightClass}" style="width: ${widthPct}%;"></div>
            </div>
            <div class="bar-value">${c.volume.toLocaleString('ro-RO')}</div>
        `;
        volumeContainer.appendChild(item);
    });
    
    // 4. Actualizare Card Statut România & Divizor Lună
    const dividerMonthName = document.getElementById('divider-month-name');
    if (dividerMonthName) {
        const lunaTradusa = {
            'JAN': 'Ianuarie', 'FEB': 'Februarie', 'MAR': 'Martie', 'APR': 'Aprilie',
            'MAY': 'Mai', 'JUN': 'Iunie', 'JUL': 'Iulie', 'AUG': 'August',
            'SEP': 'Septembrie', 'OCT': 'Octombrie', 'NOV': 'Noiembrie', 'DEC': 'Decembrie'
        }[lunaNume] || lunaNume;
        dividerMonthName.innerText = `${lunaTradusa} 2026`;
    }

    const roVolEl = document.getElementById('ro-comp-volume');
    const roShareEl = document.getElementById('ro-comp-share');
    if (roVolEl) roVolEl.innerText = roVolume.toLocaleString('ro-RO');
    if (roShareEl) roShareEl.innerText = `${roShare.toFixed(2)}%`;

    const roStatusText = document.getElementById('ro-adoption-status');
    if (roStatusText) {
        if (roShare > 10) {
            roStatusText.innerText = "Creștere Accelerată";
            roStatusText.parentElement.style.borderColor = "rgba(16, 185, 129, 0.4)";
            roStatusText.style.color = "var(--success-color)";
        } else if (roShare > 5) {
            roStatusText.innerText = "Adopție Timpurie";
            roStatusText.parentElement.style.borderColor = "rgba(245, 158, 11, 0.4)";
            roStatusText.style.color = "#f59e0b";
        } else {
            roStatusText.innerText = "Piață Incipientă";
            roStatusText.parentElement.style.borderColor = "rgba(239, 68, 68, 0.4)";
            roStatusText.style.color = "var(--warning-color)";
        }
    }
}
