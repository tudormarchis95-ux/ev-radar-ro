// Starea aplicației
const state = {
    sheetsUrl: localStorage.getItem('ev_radar_sheets_url') || '',
    historicalSummary: null,
    files: {
        auto: null,
        marfuri: null,
        radieri: null
    },
    data: {
        luna: '',      // YYYYMM (ex: "202605")
        lunaNume: '',  // ex: "MAY"
        totalAutoReg: 0,
        totalUtilReg: 0,
        totalRadieri: 0,
        totalUsedEv: 0,
        totalFirme: 0,
        totalPf: 0,
        inmatriculariModele: [], // Array de {marca, model, volum}
        radieriModele: []
    }
};

// Maparea lunilor numerice la numele utilizate în centralizator (Registrations 2026)
const luniNumeMap = {
    '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR', '05': 'MAY', '06': 'JUN',
    '07': 'JUL', '08': 'AUG', '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
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

    try {
        const response = await fetch(`rapoarte/historical_models.json?t=${Date.now()}`);
        if (response.ok) {
            state.historicalModels = await response.json();
            console.log("Historical models loaded successfully!");
        }
    } catch (err) {
        console.warn("Could not load historical models from server:", err);
    }
}

// Initializare interfata
document.addEventListener('DOMContentLoaded', async () => {
    await initHistoricalSummary();
    initUI();
    setupAdminAuth();
    setupPublicMonthSelect();
    setupConfig();
    setupDropZones();
    setupProcessBtn();
    setupSendBtn();
    setupClearBtn();
    setupAutoDgpciBtn();
    setupLocalProcessBtn();
    setupBlogReportTabs();
    setupCopyAndDownloadBtns();
});

function initUI() {
    if (state.sheetsUrl) {
        document.getElementById('sheets-url').value = state.sheetsUrl;
        showConfigStatus("URL configurat din memoria locală.", "success");
    }
    
    // Auto-load last processed month from cache
    const lastMonthCode = localStorage.getItem('ev_radar_ro_last_month_code');
    if (lastMonthCode) {
        const cached = localStorage.getItem('ev_radar_ro_data_' + lastMonthCode);
        if (cached) {
            try {
                state.data = JSON.parse(cached);
                renderDashboard();
                
                // Set values in selects
                if (lastMonthCode && lastMonthCode.includes('-')) {
                    const [y, m] = lastMonthCode.split('-');
                    const autoYearSelect = document.getElementById('auto-year-select');
                    const autoMonthSelect = document.getElementById('auto-month-select');
                    if (autoYearSelect && autoMonthSelect) {
                        autoYearSelect.value = y;
                        for (let opt of autoMonthSelect.options) {
                            if (opt.value.startsWith(m + '|')) {
                                autoMonthSelect.value = opt.value;
                                break;
                            }
                        }
                    }
                    const localYearSelect = document.getElementById('local-year-select');
                    const localMonthSelect = document.getElementById('local-month-select');
                    if (localYearSelect && localMonthSelect) {
                        localYearSelect.value = y;
                        for (let opt of localMonthSelect.options) {
                            if (opt.value.startsWith(m + '|')) {
                                localMonthSelect.value = opt.value;
                                break;
                            }
                        }
                    }
                }
                const publicYearSelect = document.getElementById('public-year-select');
                const publicMonthSelect = document.getElementById('public-month-select');
                if (publicYearSelect && publicMonthSelect) {
                    const cleanCode = lastMonthCode.replace('-', '');
                    if (cleanCode.length >= 6) {
                        const yearPart = cleanCode.substring(0, 4);
                        const monthPart = cleanCode.substring(4);
                        publicYearSelect.value = yearPart;
                        for (let opt of publicMonthSelect.options) {
                            if (opt.value.startsWith(monthPart + '|')) {
                                publicMonthSelect.value = opt.value;
                                break;
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Eroare la incarcarea cache-ului initial:", e);
            }
        }
    }
}

function setupAdminAuth() {
    const adminToggleBtn = document.getElementById('admin-toggle-btn');
    if (!adminToggleBtn) return;

    // Citire stare admin salvata din sessionStorage
    const isAdmin = sessionStorage.getItem('ev_radar_admin') === 'true';
    if (isAdmin) {
        document.body.classList.add('is-admin');
        adminToggleBtn.innerHTML = '🔓 Admin Mode';
        adminToggleBtn.style.background = 'var(--success-color)';
        adminToggleBtn.style.color = '#ffffff';
    } else {
        document.body.classList.remove('is-admin');
        adminToggleBtn.innerHTML = '🔒 Admin';
        adminToggleBtn.style.background = '';
        adminToggleBtn.style.color = '';
    }

    adminToggleBtn.addEventListener('click', () => {
        const currentlyAdmin = document.body.classList.contains('is-admin');
        if (currentlyAdmin) {
            // Logout
            document.body.classList.remove('is-admin');
            sessionStorage.removeItem('ev_radar_admin');
            adminToggleBtn.innerHTML = '🔒 Admin';
            adminToggleBtn.style.background = '';
            adminToggleBtn.style.color = '';
        } else {
            // Prompt parola
            const password = prompt('Introdu parola de administrator pentru a accesa configurările:');
            if (password === 'radar2026') {
                document.body.classList.add('is-admin');
                sessionStorage.setItem('ev_radar_admin', 'true');
                adminToggleBtn.innerHTML = '🔓 Admin Mode';
                adminToggleBtn.style.background = 'var(--success-color)';
                adminToggleBtn.style.color = '#ffffff';
            } else if (password !== null) {
                alert('Parolă incorectă!');
            }
        }
    });
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

function setupPublicMonthSelect() {
    const yearSelect = document.getElementById('public-year-select');
    const monthSelect = document.getElementById('public-month-select');
    if (!yearSelect || !monthSelect) return;

    const handler = async () => {
        const selected = getSelectedPublicMonth();
        if (!selected) return;
        
        const { lunaCode, lunaNume } = selected;
        const lunaHyphen = `${lunaCode.substring(0, 4)}-${lunaCode.substring(4)}`;
        const lunaNoHyphen = lunaCode;
        
        // Salvează ultima lună vizualizată în cache
        localStorage.setItem('ev_radar_ro_last_month_code', lunaHyphen);
        
        // 1. Incercare: Citire fisier JSON de pe server cu cache busting
        try {
            const response = await fetch(`rapoarte/dashboard_${lunaHyphen}.json?t=${Date.now()}`);
            if (response.ok) {
                const result = await response.json();
                state.data = result;
                localStorage.setItem('ev_radar_ro_data_' + lunaNoHyphen, JSON.stringify(result));
                localStorage.setItem('ev_radar_ro_data_' + lunaHyphen, JSON.stringify(result));
                renderDashboard();
                return;
            } else {
                const response2 = await fetch(`rapoarte/dashboard_${lunaNoHyphen}.json?t=${Date.now()}`);
                if (response2.ok) {
                    const result2 = await response2.json();
                    state.data = result2;
                    localStorage.setItem('ev_radar_ro_data_' + lunaNoHyphen, JSON.stringify(result2));
                    localStorage.setItem('ev_radar_ro_data_' + lunaHyphen, JSON.stringify(result2));
                    renderDashboard();
                    return;
                }
            }
        } catch (err) {
            console.warn("Eroare la citirea online a raportului static, incerc cache-ul local...", err);
        }
        
        // 2. Fallback: Citire din localStorage (cache local)
        let cached = localStorage.getItem('ev_radar_ro_data_' + lunaNoHyphen) || 
                     localStorage.getItem('ev_radar_ro_data_' + lunaHyphen) || 
                     localStorage.getItem('ev_radar_ro_data_' + lunaNume);
                     
        if (cached) {
            try {
                state.data = JSON.parse(cached);
                renderDashboard();
            } catch (e) {
                console.error("Eroare la parsarea cache-ului local:", e);
                alert(`Nu s-au putut încărca datele pentru luna ${lunaNume}.`);
            }
        } else {
            alert(`Nu există date procesate pentru luna ${lunaNume} din anul ${yearSelect.value}.`);
        }
    };

    yearSelect.addEventListener('change', () => {
        updateMonthSelectOptions();
        handler();
    });
    monthSelect.addEventListener('change', handler);

    // Initializare selectie luni la incarcarea istoricului
    updateMonthSelectOptions();

    // Auto-select cea mai recenta luna disponibila din historicalSummary
    if (state.historicalSummary) {
        const monthsOrder = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        const availableYears = Object.keys(state.historicalSummary).sort((a,b) => Number(b)-Number(a));
        const latestYear = availableYears[0];
        
        if (latestYear) {
            yearSelect.value = latestYear;
            updateMonthSelectOptions(); // Re-populam in caz ca s-a schimbat anul
            
            const yearData = state.historicalSummary[latestYear] || {};
            const availableMonths = Object.keys(yearData);
            const sortedMonths = availableMonths.sort((a,b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b));
            const latestMonth = sortedMonths[sortedMonths.length - 1];
            
            if (latestMonth) {
                for (let opt of monthSelect.options) {
                    const parts = opt.value.split('|');
                    if (parts.length > 1 && parts[1] === latestMonth) {
                        monthSelect.value = opt.value;
                        break;
                    }
                }
            }
        }
    }

    // Trigger initial load (always load from server or cache on startup)
    handler();
}

function setupConfig() {
    const saveBtn = document.getElementById('save-config-btn');
    const input = document.getElementById('sheets-url');
    
    saveBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (val) {
            state.sheetsUrl = val;
            localStorage.setItem('ev_radar_sheets_url', val);
            showConfigStatus("URL salvat cu succes!", "success");
        } else {
            showConfigStatus("Te rugăm să introduci un URL valid.", "error");
        }
    });
}

function showConfigStatus(msg, type) {
    const el = document.getElementById('config-status');
    el.innerText = msg;
    el.className = `status-msg ${type}`;
}

// Configurare drag and drop si selectare manuala fisier
function setupDropZones() {
    const types = ['auto', 'marfuri', 'radieri'];
    
    types.forEach(type => {
        const zone = document.getElementById(`drop-zone-${type}`);
        const input = document.getElementById(`file-${type}`);
        
        // Oprim propagarea pentru a evita bucla infinita de click-uri
        input.addEventListener('click', (e) => e.stopPropagation());
        
        // Click pe zona de drag deschide selectorul
        zone.addEventListener('click', () => input.click());
        
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0], type);
            }
        });
        
        // Drag events
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0], type);
            }
        });
    });
}

function handleFileSelect(file, type) {
    state.files[type] = file;
    
    const statusEl = document.getElementById(`status-${type}`);
    const cardEl = document.getElementById(`drop-zone-${type}`);
    
    statusEl.innerText = file.name;
    cardEl.classList.add('loaded');
    
    detectMonth();
    checkFilesReady();
}

// Detecteaza automat luna din numele fisierului (ex: "202605_Autoturisme.xlsx" -> "2026-05" / "MAY")
function detectMonth() {
    let filename = '';
    for (const key in state.files) {
        if (state.files[key]) {
            filename = state.files[key].name;
            break;
        }
    }
    
    if (!filename) return;
    
    // Căutăm 6 cifre consecutive (YYYYMM) oriunde în denumirea fișierului
    const match = filename.match(/(202\d)(0[1-9]|1[0-2])/);
    if (match) {
        const an = match[1];
        const lunaNum = match[2];
        state.data.luna = `${an}-${lunaNum}`;
        state.data.lunaNume = luniNumeMap[lunaNum];
        
        // Sincronizăm dropdown-ul manual cu luna detectată
        const select = document.getElementById('manual-month-select');
        const valToFind = `${state.data.luna}|${state.data.lunaNume}`;
        
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === valToFind) {
                select.selectedIndex = i;
                break;
            }
        }
        
        document.getElementById('detected-month').innerText = `${state.data.luna} (${state.data.lunaNume})`;
    }
}

function checkFilesReady() {
    const count = Object.values(state.files).filter(x => x !== null).length;
    const control = document.getElementById('process-control');
    const summary = document.getElementById('files-summary');
    
    if (count > 0) {
        control.style.display = 'block';
        summary.innerText = `Fișiere pregătite: ${count} din 3. Selectează luna de analizat dacă este cazul, apoi apasă pe Procesează.`;
    } else {
        control.style.display = 'none';
    }
}

// Logica de parsare si procesare a fisierelor Excel in browser
function setupProcessBtn() {
    const btn = document.getElementById('process-btn');
    btn.addEventListener('click', () => {
        const select = document.getElementById('manual-month-select');
        const [luna, lunaNume] = select.value.split('|');
        state.data.luna = luna;
        state.data.lunaNume = lunaNume;
        
        showLoader("Se analizează fișierele Excel...");
        
        setTimeout(async () => {
            try {
                console.log("Starting processAllFiles...");
                await processAllFiles();
                console.log("Processing finished successfully. State data:", state.data);
                hideLoader();
                renderDashboard();
            } catch (err) {
                hideLoader();
                console.error("Detailed error in processing:", err);
                alert("Eroare la procesarea fișierelor: " + err.message + "\n\nVerifică consola browserului (F12 -> Console) pentru detalii tehnice.");
            }
        }, 100);
    });
}

async function processAllFiles() {
    state.data.totalAutoReg = 0;
    state.data.totalUtilReg = 0;
    state.data.totalRadieri = 0;
    state.data.inmatriculariModele = [];
    state.data.radieriModele = [];
    
    const modelRegs = {};
    const modelRads = {};
    
    let totalNewAllFuels = 0;
    let totalNewEv = 0;
    
    state.data.totalFirme = 0;
    state.data.totalPf = 0;
    
    // 1. Parsare Autoturisme
    if (state.files.auto) {
        const data = await readExcelRows(state.files.auto, "Lista_Detaliata");
        data.forEach(row => {
            const motiv = (row[25] || '').toString().trim().toUpperCase();
            // Index 11: Combustibil, Index 29: Volum, Index 1: Marca, Index 5: Model
            if (row[11] && row[11].toString().trim().toUpperCase() === "ELECTRIC") {
                const vol = parseInt(row[29] || 0);
                state.data.totalAutoReg += vol;
                
                const key = `${row[1] || ''} | ${row[5] || ''}`;
                modelRegs[key] = (modelRegs[key] || 0) + vol;
                
                const detinator = (row[20] || '').toString().trim().toUpperCase();
                if (detinator === "COMPANIE") {
                    state.data.totalFirme += vol;
                } else if (detinator === "PERSOANA FIZICA") {
                    state.data.totalPf += vol;
                }
                
                if (motiv.includes("NOU")) {
                    totalNewEv += vol;
                }
            }
            if (motiv.includes("NOU")) {
                const vol = parseInt(row[29] || 0);
                totalNewAllFuels += vol;
            }
        });
    }
    
    // 2. Parsare Utilitare
    if (state.files.marfuri) {
        const data = await readExcelRows(state.files.marfuri, "Lista_Detaliata");
        data.forEach(row => {
            // Categorie Comunitara (Index 28) == "N1", Combustibil == "ELECTRIC"
            if (row[28] && row[28].toString().trim().toUpperCase() === "N1") {
                const motiv = (row[25] || '').toString().trim().toUpperCase();
                if (row[11] && row[11].toString().trim().toUpperCase() === "ELECTRIC") {
                    const vol = parseInt(row[29] || 0);
                    state.data.totalUtilReg += vol;
                    
                    const key = `${row[1] || ''} | ${row[5] || ''}`;
                    modelRegs[key] = (modelRegs[key] || 0) + vol;
                    
                    const detinator = (row[20] || '').toString().trim().toUpperCase();
                    if (detinator === "COMPANIE") {
                        state.data.totalFirme += vol;
                    } else if (detinator === "PERSOANA FIZICA") {
                        state.data.totalPf += vol;
                    }
                    
                    if (motiv.includes("NOU")) {
                        totalNewEv += vol;
                    }
                }
                if (motiv.includes("NOU")) {
                    const vol = parseInt(row[29] || 0);
                    totalNewAllFuels += vol;
                }
            }
        });
    }
    
    // 3. Parsare Radieri
    if (state.files.radieri) {
        const data = await readExcelRows(state.files.radieri, "Radieri");
        data.forEach(row => {
            // Index 12: Combustibil, Index 6: Categorie Nationala, Index 25: Volum
            if (row[12] && row[12].toString().trim().toUpperCase() === "ELECTRIC") {
                const cat = (row[6] || '').toString().trim().toUpperCase();
                if (cat === "AUTOTURISM" || cat === "AUTOUTILITARA") {
                    const vol = parseInt(row[25] || 0);
                    state.data.totalRadieri += vol;
                    
                    const key = `${row[1] || ''} | ${row[5] || ''}`;
                    modelRads[key] = (modelRads[key] || 0) + vol;
                }
            }
        });
    }
    
    // Transformare in liste si sortare descrescatoare
    for (const key in modelRegs) {
        const parts = key.split(" | ");
        state.data.inmatriculariModele.push({
            marca: parts[0].trim(),
            model: parts[1].trim(),
            volum: modelRegs[key]
        });
    }
    state.data.inmatriculariModele.sort((a,b) => b.volum - a.volum);
    
    for (const key in modelRads) {
        const parts = key.split(" | ");
        state.data.radieriModele.push({
            marca: parts[0].trim(),
            model: parts[1].trim(),
            volum: modelRads[key]
        });
    }
    state.data.radieriModele.sort((a,b) => b.volum - a.volum);
    
    // Calcule avansate
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    state.data.totalUsedEv = totalEV - totalNewEv;
    state.data.evShare = totalNewAllFuels > 0 ? (totalNewEv / totalNewAllFuels) : 0;
    state.data.usedShare = totalEV > 0 ? (state.data.totalUsedEv / totalEV) : 0;
    
    const prevYearStr = String(parseInt(state.data.luna.split('-')[0]) - 1);
    let val_prev_year = 0;
    if (state.historicalSummary && state.historicalSummary[prevYearStr] && state.historicalSummary[prevYearStr][state.data.lunaNume]) {
        const item = state.historicalSummary[prevYearStr][state.data.lunaNume];
        val_prev_year = item.totalAutoReg + item.totalUtilReg;
    }
    
    if (val_prev_year > 0) {
        state.data.yoyGrowth = ((totalEV - val_prev_year) / val_prev_year) * 100;
    } else {
        state.data.yoyGrowth = 0;
    }
}

// Citeste un fisier Excel si returneaza randurile ca array 2D
function readExcelRows(file, sheetName) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                const sheet = workbook.Sheets[sheetName];
                if (!sheet) {
                    throw new Error(`Sheet-ul '${sheetName}' nu exista in fisierul ${file.name}.`);
                }
                
                // DGPCI genereaza Excel-uri cu metadate de dimensiune gresite (raporteaza doar 8 randuri).
                // Fortam SheetJS sa caute toate cheile de celule existente pentru a determina dimensiunea reala.
                let maxRow = 0;
                let maxCol = 0;
                
                // Parcurgem toate celulele populate din sheet
                Object.keys(sheet).forEach(key => {
                    if (key[0] === '!') return; // Ignoram metadatele
                    const cellRef = XLSX.utils.decode_cell(key);
                    if (cellRef.r > maxRow) maxRow = cellRef.r;
                    if (cellRef.c > maxCol) maxCol = cellRef.c;
                });
                
                // Actualizam range-ul foii de calcul la cel real determinat
                sheet['!ref'] = XLSX.utils.encode_range({
                    s: { r: 0, c: 0 },
                    e: { r: maxRow, c: maxCol }
                });
                
                // Folosim defval: "" pentru a garanta ca toate coloanele raman pe aceleasi pozitii
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
                console.log(`Parsed sheet '${sheetName}' with real row count: ${rows.length}`);
                resolve(rows.slice(7)); // Skip first 7 header rows
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error("Citirea fisierului a esuat."));
        reader.readAsArrayBuffer(file);
    });
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
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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

function renderDashboard() {
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    const netGrowth = totalEV - state.data.totalRadieri;
    
    // Salvam datele pentru a le accesa din comparatie.html si pentru caching
    localStorage.setItem('ev_radar_ro_data_' + state.data.lunaNume, JSON.stringify(state.data));
    if (state.data.luna) {
        localStorage.setItem('ev_radar_ro_data_' + state.data.luna, JSON.stringify(state.data));
        localStorage.setItem('ev_radar_ro_last_month_code', state.data.luna);
    }
    
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
    
    // Dashboard advanced stats
    document.getElementById('val-ev-share').innerText = `${(state.data.evShare * 100).toFixed(2)}%`;
    document.getElementById('val-used-share').innerText = `${(state.data.usedShare * 100).toFixed(2)}%`;
    const totalUsedEvVal = state.data.totalUsedEv !== undefined ? state.data.totalUsedEv : Math.round((state.data.totalAutoReg + state.data.totalUtilReg) * (state.data.usedShare || 0));
    animateElementValue('val-used-qty', totalUsedEvVal);
    
    let dynamicYoy = state.data.yoyGrowth;
    const prevYearStr = String(parseInt(state.data.luna.split('-')[0]) - 1);
    if (state.historicalSummary && state.historicalSummary[prevYearStr] && state.historicalSummary[prevYearStr][state.data.lunaNume]) {
        const item = state.historicalSummary[prevYearStr][state.data.lunaNume];
        const val_prev_year = item.totalAutoReg + item.totalUtilReg;
        if (val_prev_year > 0) {
            dynamicYoy = ((totalEV - val_prev_year) / val_prev_year) * 100;
        }
    }
    state.data.yoyGrowth = dynamicYoy; // Update the state so it propagates to export texts

    const sign = dynamicYoy >= 0 ? '+' : '';
    document.getElementById('lbl-yoy-growth').innerText = `Evoluție YoY vs ${state.data.lunaNume} ${prevYearStr}`;
    const yoyValEl = document.getElementById('val-yoy-growth');
    yoyValEl.innerText = `${sign}${dynamicYoy.toFixed(2)}%`;
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
    
    // Functii ajutatoare pentru display
    const stripBrandFromModel = (brand, model) => {
        if (!model) return "";
        if (!brand) return model;
        const b = brand.toString().trim().toUpperCase();
        let m = model.toString().trim().toUpperCase();
        if (m.startsWith(b)) {
            m = m.substring(b.length).trim();
        }
        return m;
    };

    function normalizeazaMarcaDisplay(marca) {
        if (!marca) return "";
        let m = marca.toString().toUpperCase().trim().replace(/\s+/g, " ");

        if (m.includes("VOLKSWAGEN") || m === "VW" || m === "VOLKSVAGEN" || m === "VOLSKWAGEN") return "VOLKSWAGEN";
        if (m.includes("MERCEDES")) return "MERCEDES-BENZ";
        if (m.startsWith("BMW")) return "BMW";
        if (m.includes("TESLA")) return "TESLA";
        if (m.startsWith("RENAULT")) return "RENAULT";
        if (m.includes("HYUNDAI") || m === "HYUNDAY") return "HYUNDAI";
        if (m === "DS AUTOMOBILES" || m === "DS") return "DS";
        if (m.startsWith("MG")) return "MG";
        if (m.includes("ALFA") && m.includes("ROMEO")) return "ALFA ROMEO";
        if (m.includes("FARIZON")) return "FARIZON";
        if (m.startsWith("FORD")) return "FORD";
        if (m === "SSANGYONG" || m === "KG MOBILITY") return "SSANGYONG / KG MOBILITY";
        if (m.startsWith("NISSAN")) return "NISSAN";
        if (m.includes("LUCID")) return "LUCID";
        if (m.includes("LAMBORGHINI")) return "LAMBORGHINI";
        return m;
    }

    // Top Marci (Branduri)
    const brandVolums = {};
    state.data.inmatriculariModele.forEach(item => {
        const brand = normalizeazaMarcaDisplay(item.marca || 'Necunoscută');
        brandVolums[brand] = (brandVolums[brand] || 0) + item.volum;
    });
    const topBrands = Object.keys(brandVolums).map(brand => ({
        marca: brand,
        volum: brandVolums[brand]
    })).sort((a, b) => b.volum - a.volum).slice(0, 10);

    const brandTbody = document.getElementById('top-brands-tbody');
    if (brandTbody) {
        brandTbody.innerHTML = '';
        topBrands.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td><td>${item.marca}</td><td><strong>${item.volum}</strong></td>`;
            brandTbody.appendChild(tr);
        });
    }

    // Top inmatriculari
    const regTbody = document.getElementById('top-models-tbody');
    regTbody.innerHTML = '';
    state.data.inmatriculariModele.slice(0, 20).forEach((item, idx) => {
        const tr = document.createElement('tr');
        const marcaDisplay = normalizeazaMarcaDisplay(item.marca);
        const modelDisplay = stripBrandFromModel(marcaDisplay, item.model);
        tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td><td>${marcaDisplay}</td><td>${modelDisplay}</td><td><strong>${item.volum}</strong></td>`;
        regTbody.appendChild(tr);
    });
    
    // Top radieri
    const radTbody = document.getElementById('top-rad-tbody');
    radTbody.innerHTML = '';
    state.data.radieriModele.slice(0, 20).forEach((item, idx) => {
        const tr = document.createElement('tr');
        const marcaRadDisplay = normalizeazaMarcaDisplay(item.marca);
        const modelRadDisplay = stripBrandFromModel(marcaRadDisplay, item.model);
        tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td><td>${marcaRadDisplay}</td><td>${modelRadDisplay}</td><td><strong>${item.volum}</strong></td>`;
        radTbody.appendChild(tr);
    });
    
    // Top 50 YTD și Parc Auto (dacă e anul curent 2026)
    const top50Grid = document.getElementById('top50-tables-grid');
    if (top50Grid) {
        if (currentYear === 2026) {
            const modelsData = state.historicalModels && state.historicalModels[state.data.luna] ? state.historicalModels[state.data.luna] : {ytd: [], parc: []};
            const top50Ytd  = modelsData.ytd.slice(0, 50);
            const top50Parc = modelsData.parc.slice(0, 50);
            
            const totalYtd = top50Ytd.reduce((sum, item) => sum + item.ytd, 0);
            const totalParc = top50Parc.reduce((sum, item) => sum + item.parc, 0);
            
            // Render Top 50 YTD
            const ytdTbody = document.getElementById('top-50-ytd-tbody');
            if (ytdTbody) {
                ytdTbody.innerHTML = '';
                top50Ytd.forEach((item, idx) => {
                    const sharePct = totalYtd > 0 ? (item.ytd / totalYtd * 100).toFixed(2) : '0.00';
                    const tr = document.createElement('tr');
                    
                    const mBrand = normalizeazaMarcaDisplay(item.brand);
                    const mModel = stripBrandFromModel(mBrand, item.model);
                    const modelNameStr = `${mBrand} ${mModel}`;
                    
                    tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx+1}</td>
                                    <td>${modelNameStr}</td>
                                    <td style="text-align: right;"><strong>${item.ytd.toLocaleString('ro-RO')}</strong></td>
                                    <td style="text-align: right;">${sharePct}%</td>`;
                    ytdTbody.appendChild(tr);
                });
            }
            
            // Render Top 50 Parc
            const parcTbody = document.getElementById('top-50-parc-tbody');
            if (parcTbody) {
                parcTbody.innerHTML = '';
                top50Parc.forEach((item, idx) => {
                    const sharePct = totalParc > 0 ? (item.parc / totalParc * 100).toFixed(2) : '0.00';
                    const tr = document.createElement('tr');
                    
                    const mBrand = normalizeazaMarcaDisplay(item.brand);
                    const mModel = stripBrandFromModel(mBrand, item.model);
                    const modelNameStr = `${mBrand} ${mModel}`;
                    
                    tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx+1}</td>
                                    <td>${modelNameStr}</td>
                                    <td style="text-align: right;"><strong>${item.parc.toLocaleString('ro-RO')}</strong></td>
                                    <td style="text-align: right;">${sharePct}%</td>`;
                    parcTbody.appendChild(tr);
                });
            }
            
            top50Grid.style.display = 'grid';
        } else {
            top50Grid.style.display = 'none';
        }
    }
    
    // Render blog report texts
    generateBlogReportTexts();
    
    // Render historical comparison charts
    renderHistoricalCharts();
    
    document.getElementById('results-dashboard').style.display = 'block';
    // Scroll lin catre dashboard
    document.getElementById('results-dashboard').scrollIntoView({ behavior: 'smooth' });
}

// Generează textele și codurile HTML pentru secțiunea de blog

function generateBlogReportTexts() {
    if (!state.data) return;
    const currentYear = state.data.luna ? parseInt(state.data.luna.split('-')[0]) : 2026;
    const prevYearStr = String(currentYear - 1);
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    const totalUsedEv = state.data.totalUsedEv !== undefined ? state.data.totalUsedEv : Math.round(totalEV * (state.data.usedShare || 0));
    const totalNewEv = totalEV - totalUsedEv;
    const usedPct = (state.data.usedShare * 100).toFixed(2);
    const growthSign = state.data.yoyGrowth >= 0 ? '+' : '';
    
    const monthTranslations = {
        'JAN': 'Ianuarie', 'FEB': 'Februarie', 'MAR': 'Martie',
        'APR': 'Aprilie', 'MAY': 'Mai', 'JUN': 'Iunie',
        'JUL': 'Iulie', 'AUG': 'August', 'SEP': 'Septembrie',
        'OCT': 'Octombrie', 'NOV': 'Noiembrie', 'DEC': 'Decembrie'
    };
    const monthRo = monthTranslations[state.data.lunaNume.toUpperCase()] || state.data.lunaNume;
    
    const formatModelName = (brand, model) => {
        const b = (brand || "").trim();
        const m = (model || "").trim();
        if (m.toUpperCase().startsWith(b.toUpperCase())) {
            return m;
        }
        return `${b} ${m}`;
    };
    
    // 1. Sumar text
    const summaryHtml = `
        <p>În luna <strong>${monthRo}</strong> 2026, au fost înmatriculate un total de <strong>${totalEV}</strong> vehicule electrice (M1 + N1), înregistrând o evoluție de <strong>${growthSign}${state.data.yoyGrowth.toFixed(2)}%</strong> comparativ cu aceeași lună a anului trecut.</p>
        <p class="has-pale-cyan-blue-background-color has-background">Din totalul înmatriculărilor de EV-uri, <strong>${totalUsedEv} unități (${usedPct}%)</strong> sunt reprezentate de vehicule second-hand (rulate), restul de ${totalNewEv} unități fiind vehicule noi.</p>
        <p>Vehiculele electrice noi au reprezentat <strong>${(state.data.evShare * 100).toFixed(2)}%</strong> din totalul autovehiculelor noi înmatriculate în luna <strong>${monthRo}</strong>.</p>
    `;
    document.getElementById('blog-summary-text').innerHTML = summaryHtml;
    
    // 2. Preluam datele din historicalModels
    const modelsData = state.historicalModels && state.historicalModels[state.data.luna] ? state.historicalModels[state.data.luna] : {ytd: [], parc: []};
    
    // Top 20 monthly (folosim direct din inmatriculariModele curente)
    const top20Monthly = [...state.data.inmatriculariModele]
        .filter(d => d.marca !== "Alte Modele")
        .sort((a, b) => b.volum - a.volum).slice(0, 20);
    
    // Top 20 YTD
    const top20Ytd = modelsData.ytd.slice(0, 20);
    
    // Top 20 Parc
    const top20Parc = modelsData.parc.slice(0, 20);
    
    // Top 50 YTD
    const top50Ytd = modelsData.ytd.slice(0, 50);
    const totalYtd = top50Ytd.reduce((sum, item) => sum + item.ytd, 0);
    
    // Top 50 Parc
    const top50Parc = modelsData.parc.slice(0, 50);
    const totalParc = top50Parc.reduce((sum, item) => sum + item.parc, 0);
    
    // 1. Înmatriculări Lunare EV
    const regs2025 = {};
    const regs2026 = {};
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    monthsOrder.forEach(m => {
        regs2025[m] = 0;
        regs2026[m] = null;
        
        if (state.historicalSummary) {
            if (state.historicalSummary[prevYearStr] && state.historicalSummary[prevYearStr][m]) {
                const item = state.historicalSummary[prevYearStr][m];
                regs2025[m] = item.totalAutoReg + item.totalUtilReg;
            }
            const currYearStr = String(currentYear);
            if (state.historicalSummary[currYearStr] && state.historicalSummary[currYearStr][m]) {
                const item = state.historicalSummary[currYearStr][m];
                regs2026[m] = item.totalAutoReg + item.totalUtilReg;
            }
        }
    });
    
    const currentLunaNume = state.data.lunaNume;
    const currentRegs = state.data.totalAutoReg + state.data.totalUtilReg;
    if (regs2026.hasOwnProperty(currentLunaNume)) {
        regs2026[currentLunaNume] = currentRegs;
    }
    
    const currentIdx = monthsOrder.indexOf(currentLunaNume);
    if (currentIdx !== -1) {
        for (let i = currentIdx + 1; i < monthsOrder.length; i++) {
            regs2026[monthsOrder[i]] = null;
        }
    }

    let maxVal = 0;
    monthsOrder.forEach(m => {
        if (regs2025[m] > maxVal) maxVal = regs2025[m];
        if (regs2026[m] !== null && regs2026[m] > maxVal) maxVal = regs2026[m];
    });
    const scaleMax = maxVal * 1.15;

    let monthlyBarsHtml = '';
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
            badgeHTML = `<span class="ev-growth-badge ${badgeClass}">${sign}${pct}%</span>`;
        }
        
        const monthLabel = {
            'JAN': 'IAN', 'FEB': 'FEB', 'MAR': 'MAR', 'APR': 'APR', 'MAY': 'MAI', 'JUN': 'IUN',
            'JUL': 'IUL', 'AUG': 'AUG', 'SEP': 'SEP', 'OCT': 'OCT', 'NOV': 'NOV', 'DEC': 'DEC'
        }[m] || m;

        monthlyBarsHtml += `    <div class="ev-v-col">
      <div class="ev-v-badge-wrap">
        ${badgeHTML}
      </div>
      <div class="ev-v-bars-wrapper">
        <div class="ev-v-bar-2025" style="height: ${h25}%;">
          <span class="ev-v-bar-val">${val25}</span>
        </div>
        ${val26 !== null ? `
        <div class="ev-v-bar-2026" style="height: ${h26}%;">
          <span class="ev-v-bar-val active-year">${val26}</span>
        </div>` : ''}
      </div>
      <div class="ev-v-label">${monthLabel}</div>
    </div>\n`;
    });

    let codeHtmlMonthly = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-vertical-chart-container">
  <style>
    .ev-vertical-chart-container {
      font-family: 'Montserrat', sans-serif;
      background: #FAFAFA;
      padding: 35px 25px;
      max-width: 800px;
      margin: 20px auto;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border: 1px solid #eaeaea;
    }
    .ev-title-area {
      margin-bottom: 25px;
    }
    .ev-chart-main-title {
      color: #004b87;
      font-weight: 900;
      font-size: 24px;
      margin: 0 0 5px 0;
    }
    .ev-chart-sub-title {
      color: #666;
      font-size: 14px;
      margin: 0;
      font-weight: 600;
    }
    .ev-legend {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
      font-size: 12px;
      font-weight: 700;
    }
    .ev-legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #555;
    }
    .ev-legend-color {
      width: 14px;
      height: 14px;
      border-radius: 3px;
    }
    .ev-v-chart {
      display: flex;
      height: 260px;
      align-items: flex-end;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
      gap: 4px;
    }
    .ev-v-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
      position: relative;
      border-right: 1px dashed rgba(226, 232, 240, 0.8);
    }
    .ev-v-col:last-child {
      border-right: none;
    }
    .ev-v-badge-wrap {
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
    }
    .ev-growth-badge {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 4px;
      line-height: 1;
      white-space: nowrap;
    }
    .ev-growth-badge.positive {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
    .ev-growth-badge.negative {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
    .ev-v-bars-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: calc(100% - 28px);
      justify-content: center;
      width: 100%;
      padding: 0 2px;
    }
    .ev-v-bar-2025 {
      width: 16px;
      background: #4299e1;
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 2px;
    }
    .ev-v-bar-2026 {
      width: 16px;
      background: #004b87;
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 2px;
    }
    .ev-v-bar-val {
      font-size: 9px;
      font-weight: 800;
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 4px;
      white-space: nowrap;
      color: #2b6cb0;
    }
    .ev-v-bar-val.active-year {
      color: #004b87;
    }
    .ev-v-label {
      font-size: 11px;
      font-weight: 800;
      margin-top: 8px;
      color: #1e293b;
    }
    @media (max-width: 600px) {
      .ev-v-bar-val {
        display: none;
      }
      .ev-vertical-chart-container {
        padding: 20px 10px;
      }
      .ev-v-bars-wrapper {
        gap: 2px;
      }
      .ev-v-bar-2025, .ev-v-bar-2026 {
        width: 10px;
      }
      .ev-v-label {
        font-size: 9px;
      }
    }
  </style>
  <div class="ev-title-area">
    <div class="ev-chart-main-title">Înmatriculări lunare EV (2025 vs. 2026)</div>
    <div class="ev-chart-sub-title">Evoluție înmatriculări mașini electrice în România</div>
  </div>
  <div class="ev-legend">
    <div class="ev-legend-item">
      <div class="ev-legend-color" style="background: #004b87;"></div>
      <span>${currentYear}</span>
    </div>
    <div class="ev-legend-item">
      <div class="ev-legend-color" style="background: #4299e1;"></div>
      <span>${prevYearStr}</span>
    </div>
  </div>
  <div class="ev-v-chart">
${monthlyBarsHtml}  </div>
</div>`;

    // 2. Top 20 Lună Procesată (cu număr curent)
    let codeHtmlTop20 = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-chart-container">
  <style>
    .ev-chart-container { 
      font-family: 'Montserrat', sans-serif; 
      background: #FAFAFA; 
      padding: 35px 25px; 
      max-width: 800px; 
      margin: 20px auto; 
      border-radius: 12px; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
      border: 1px solid #eaeaea;
    }
    .ev-chart-title { 
      color: #004b87; 
      font-weight: 900; 
      font-size: 26px; 
      margin-bottom: 5px; 
    }
    .ev-chart-subtitle { 
      color: #666; 
      font-size: 14px; 
      margin-bottom: 30px; 
      font-weight: 600; 
    }
    .ev-bar-row { 
      display: flex; 
      align-items: center; 
      margin-bottom: 12px; 
    }
    .ev-label { 
      width: 200px; 
      text-align: right; 
      padding-right: 15px; 
      font-weight: 700; 
      font-size: 13px; 
      color: #333; 
    }
    .ev-bar-wrapper { 
      flex-grow: 1; 
      display: flex; 
      align-items: center; 
    }
    .ev-bar { 
      background: #4A90E2; 
      height: 24px; 
      border-radius: 0 4px 4px 0; 
      min-width: 2px; 
    }
    .ev-bar.top-3 { background: #004b87; }
    .ev-value { 
      margin-left: 10px; 
      font-weight: 900; 
      font-size: 14px; 
      color: #333; 
    }
    @media (max-width: 500px) {
      .ev-label { width: 130px; font-size: 11px; padding-right: 10px; }
      .ev-value { font-size: 12px; }
    }
  </style>
  <div class="ev-chart-title">Top 20 ${monthRo}</div>
  <div class="ev-chart-subtitle">Înmatriculări mașini electrice România (${currentYear})</div>\n`;

    const maxMonthlyVal = top20Monthly.length > 0 ? top20Monthly[0].volum : 1;
    top20Monthly.forEach((item, idx) => {
        const widthPct = (item.volum / maxMonthlyVal * 100).toFixed(1);
        const barClass = idx < 3 ? "top-3" : "";
        codeHtmlTop20 += `  <div class="ev-bar-row"><div class="ev-label">${idx + 1}. ${formatModelName(item.marca, item.model)}</div><div class="ev-bar-wrapper"><div class="ev-bar ${barClass}" style="width: ${widthPct}%;"></div><span class="ev-value">${item.volum}</span></div></div>\n`;
    });
    codeHtmlTop20 += `</div>`;

    // 3. Evoluție Parc Auto EV (înmatriculări anuale brute)
    const annualData = state.computedAnnualData || [];
    const totalFleet = state.computedTotalFleet || 63986;
    const base2025 = 63986;
    
    const finalAnnualData = [...annualData, { year: currentYear, qty: totalFleet - base2025, active: true }];
    const maxQty = Math.max(...finalAnnualData.map(d => d.qty));
    const scaleMaxQty = maxQty * 1.15;

    let annualBarsHtml = '';
    finalAnnualData.forEach(d => {
        const heightPct = ((d.qty / scaleMaxQty) * 100).toFixed(1);
        const is2026Class = d.active ? 'highlight' : '';
        const valueColorClass = d.active ? 'active-year' : '';
        annualBarsHtml += `    <div class="ev-v-col">
      <div class="ev-v-bars-wrapper" style="height: calc(100% - 25px);">
        <div class="ev-v-bar-annual ${is2026Class}" style="height: ${heightPct}%;">
          <span class="ev-v-bar-val ${valueColorClass}">${d.qty.toLocaleString('ro-RO')}</span>
        </div>
      </div>
      <div class="ev-v-label" style="font-size: 10px;">${d.year}${d.active ? '*' : ''}</div>
    </div>\n`;
    });

    let codeHtmlAnnual = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-vertical-chart-container">
  <style>
    .ev-vertical-chart-container {
      font-family: 'Montserrat', sans-serif;
      background: #FAFAFA;
      padding: 35px 25px;
      max-width: 800px;
      margin: 20px auto;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border: 1px solid #eaeaea;
    }
    .ev-header-flex {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 25px;
    }
    .ev-title-area {
      flex-grow: 1;
    }
    .ev-chart-main-title {
      color: #004b87;
      font-weight: 900;
      font-size: 24px;
      margin: 0 0 5px 0;
    }
    .ev-chart-sub-title {
      color: #666;
      font-size: 14px;
      margin: 0;
      font-weight: 600;
    }
    .ev-summary-box {
      background: #eef5fc;
      border-left: 4px solid #004b87;
      padding: 10px 15px;
      border-radius: 4px;
      text-align: right;
    }
    .ev-summary-label {
      font-size: 10px;
      font-weight: 800;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .ev-summary-value {
      font-size: 22px;
      font-weight: 900;
      color: #004b87;
      margin-top: 2px;
    }
    .ev-v-chart {
      display: flex;
      height: 260px;
      align-items: flex-end;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
      gap: 2px;
    }
    .ev-v-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
      position: relative;
      border-right: 1px dashed rgba(226, 232, 240, 0.8);
    }
    .ev-v-col:last-child {
      border-right: none;
    }
    .ev-v-bars-wrapper {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      width: 100%;
    }
    .ev-v-bar-annual {
      width: 22px;
      background: #4299e1;
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 2px;
    }
    .ev-v-bar-annual.highlight {
      background: #004b87 !important;
    }
    .ev-v-bar-val {
      font-size: 9px;
      font-weight: 800;
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 4px;
      white-space: nowrap;
      color: #2b6cb0;
    }
    .ev-v-bar-val.active-year {
      color: #004b87;
    }
    .ev-v-label {
      font-size: 11px;
      font-weight: 800;
      margin-top: 8px;
      color: #1e293b;
    }
    .ev-caption {
      font-size: 11px;
      color: #888;
      font-style: italic;
      margin-top: 15px;
    }
    @media (max-width: 768px) {
      .ev-v-bar-val {
        display: none;
      }
      .ev-vertical-chart-container {
        padding: 20px 10px;
      }
      .ev-v-bar-annual {
        width: 10px;
      }
      .ev-v-label {
        font-size: 8px;
      }
      .ev-header-flex {
        flex-direction: column;
        gap: 15px;
      }
      .ev-summary-box {
        text-align: left;
        align-self: flex-start;
      }
    }
  </style>
  <div class="ev-header-flex">
    <div class="ev-title-area">
      <div class="ev-chart-main-title">Evoluție Parc Auto EV</div>
      <div class="ev-chart-sub-title">Istoric înmatriculări România (2011 – 2026)</div>
    </div>
    <div class="ev-summary-box">
      <div class="ev-summary-label">TOTAL PARC AUTO (${monthRo.slice(0, 3)} '26)</div>
      <div class="ev-summary-value">${totalFleet.toLocaleString('ro-RO')}</div>
    </div>
  </div>
  <div class="ev-v-chart">
${annualBarsHtml}  </div>
  <div class="ev-caption">* Datele aferente anului 2026 sunt în curs de actualizare (ianuarie – ${monthRo.toLowerCase()}).</div>
</div>`;

    // 4. Top 50 - 2026 (table)
    let codeHtmlTableYtd = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-table-wrapper">
  <style>
    .ev-table-wrapper {
      font-family: 'Montserrat', sans-serif;
      max-width: 850px;
      margin: 25px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid #eaeaea;
    }
    .ev-table-header {
      padding: 20px 25px;
      background: #FAFAFA;
      border-bottom: 3px solid #004b87;
    }
    .ev-table-title {
      color: #004b87;
      font-weight: 800;
      font-size: 22px;
      margin-bottom: 5px;
      text-transform: uppercase;
      margin-top: 0;
    }
    .ev-table-subtitle {
      color: #666;
      font-size: 13px;
      font-weight: 600;
      margin: 0;
    }
    .ev-table-container {
      width: 100%;
      overflow-x: auto;
    }
    .ev-data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .ev-data-table th {
      background-color: #f4f7fa;
      color: #004b87;
      font-weight: 800;
      padding: 14px 20px;
      border-bottom: 2px solid #dde4eb;
      white-space: nowrap;
      text-transform: uppercase;
      font-size: 12px;
    }
    .ev-data-table td {
      padding: 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
    }
    .ev-data-table tr:nth-child(even) {
      background-color: #fcfcfc;
    }
    .ev-data-table tr:hover {
      background-color: #f0f6fc;
    }
    .col-rank { width: 50px; font-weight: 700; color: #888; text-align: center; }
    .col-model { font-weight: 600; }
    .col-val { font-weight: 700; color: #004b87; }
    .col-pct { color: #555; font-weight: 600; }
    @media (max-width: 500px) {
      .ev-data-table td, .ev-data-table th { padding: 10px 12px; font-size: 12px; }
      .col-rank { padding-left: 10px; padding-right: 10px; }
    }
  </style>
  <div class="ev-table-header">
    <h3 class="ev-table-title">TOP 50 - 2026</h3>
    <p class="ev-table-subtitle">Înmatriculări cumulate (Ianuarie - ${monthRo})</p>
  </div>
  <div class="ev-table-container">
    <table class="ev-data-table">
      <thead>
        <tr>
          <th class="col-rank">#</th>
          <th class="col-model">Model</th>
          <th class="col-val">2026</th>
          <th class="col-pct">% 2026</th>
        </tr>
      </thead>
      <tbody>\n`;
      
    top50Ytd.forEach((item, idx) => {
        const sharePct = totalYtd > 0 ? (item.ytd / totalYtd * 100).toFixed(2) : '0.00';
        codeHtmlTableYtd += `        <tr><td class="col-rank">${idx+1}</td><td class="col-model">${formatModelName(item.brand, item.model)}</td><td class="col-val">${item.ytd}</td><td class="col-pct">${sharePct}%</td></tr>\n`;
    });
    codeHtmlTableYtd += `      </tbody>
    </table>
  </div>
</div>`;

    // 5. Top 50 Parc Auto General
    let codeHtmlTableParc = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-table-wrapper">
  <style>
    .ev-table-wrapper {
      font-family: 'Montserrat', sans-serif;
      max-width: 850px;
      margin: 25px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid #eaeaea;
    }
    .ev-table-header {
      padding: 20px 25px;
      background: #FAFAFA;
      border-bottom: 3px solid #004b87;
    }
    .ev-table-title {
      color: #004b87;
      font-weight: 800;
      font-size: 22px;
      margin-bottom: 5px;
      text-transform: uppercase;
      margin-top: 0;
    }
    .ev-table-subtitle {
      color: #666;
      font-size: 13px;
      font-weight: 600;
      margin: 0;
    }
    .ev-table-container {
      width: 100%;
      overflow-x: auto;
    }
    .ev-data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .ev-data-table th {
      background-color: #f4f7fa;
      color: #004b87;
      font-weight: 800;
      padding: 14px 20px;
      border-bottom: 2px solid #dde4eb;
      white-space: nowrap;
      text-transform: uppercase;
      font-size: 12px;
    }
    .ev-data-table td {
      padding: 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
    }
    .ev-data-table tr:nth-child(even) {
      background-color: #fcfcfc;
    }
    .ev-data-table tr:hover {
      background-color: #f0f6fc;
    }
    .col-rank { width: 50px; font-weight: 700; color: #888; text-align: center; }
    .col-model { font-weight: 600; }
    .col-val { font-weight: 700; color: #004b87; }
    .col-pct { color: #555; font-weight: 600; }
    @media (max-width: 500px) {
      .ev-data-table td, .ev-data-table th { padding: 10px 12px; font-size: 12px; }
      .col-rank { padding-left: 10px; padding-right: 10px; }
    }
  </style>
  <div class="ev-table-header">
    <h3 class="ev-table-title">TOP 50 - PARC AUTO GENERAL</h3>
    <p class="ev-table-subtitle">Clasament cumulat istoric România (Până în ${monthRo} 2026)</p>
  </div>
  <div class="ev-table-container">
    <table class="ev-data-table">
      <thead>
        <tr>
          <th class="col-rank">#</th>
          <th class="col-model">Model</th>
          <th class="col-val">Total Unități</th>
          <th class="col-pct">% Parc Auto</th>
        </tr>
      </thead>
      <tbody>\n`;
      
    top50Parc.forEach((item, idx) => {
        const sharePct = totalParc > 0 ? (item.parc / totalParc * 100).toFixed(2) : '0.00';
        const formattedVal = item.parc.toLocaleString('ro-RO');
        codeHtmlTableParc += `        <tr><td class="col-rank">${idx+1}</td><td class="col-model">${formatModelName(item.brand, item.model)}</td><td class="col-val">${formattedVal}</td><td class="col-pct">${sharePct}%</td></tr>\n`;
    });
    codeHtmlTableParc += `      </tbody>
    </table>
  </div>
</div>`;

    document.getElementById('textarea-chart-monthly').value = codeHtmlMonthly;
    document.getElementById('textarea-chart-top20').value = codeHtmlTop20;
    document.getElementById('textarea-chart-annual').value = codeHtmlAnnual;
    document.getElementById('textarea-table-ytd').value = codeHtmlTableYtd;
    document.getElementById('textarea-table-parc').value = codeHtmlTableParc;
    
    drawBlogCoverCanvas();
}

function getCarSilhouetteSVG(brand, model) {
    const b = (brand || "").toUpperCase();
    const m = (model || "").toUpperCase();
    
    let carClass = "Sedan";
    
    if (m.includes("TRANSIT") || m.includes("KANGOO") || m.includes("EVITO") || m.includes("ESPRINTER") || m.includes("PROACE") || m.includes("BERLINGO") || m.includes("DOBLO") || m.includes("SCUDO") || m.includes("VIVARO") || m.includes("CRAFTER") || m.includes("TRANSPORTER") || m.includes("JUMPY") || m.includes("DELIVER")) {
        carClass = "Van";
    }
    else if (m.includes("KONA") || m.includes("SEALION") || m.includes("PUMA") || m.includes("EXPLORER") || m.includes("ID.4") || m.includes("ID 4") || m.includes("ID.5") || m.includes("ID 5") || m.includes("E-TRON") || m.includes("ETRON") || m.includes("EX30") || m.includes("EX40") || m.includes("XC40") || m.includes("EC40") || m.includes("C40") || m.includes("ENYAQ") || m.includes("ELROQ") || m.includes("EQA") || m.includes("EQB") || m.includes("EQC") || m.includes("EQE") || m.includes("EQS") || m.includes("IX") || m.includes("IX1") || m.includes("IX2") || m.includes("IX3") || m.includes("INSTER") || m.includes("ZS") || m.includes("MACAN") || m.includes("AVENGER") || m.includes("TORRES") || m.includes("Y") || m.includes("BZ4X") || m.includes("MOKKA") || m.includes("SOUL") || m.includes("LYRIQ") || m.includes("GRANDLAND") || m.includes("FRONTERA") || m.includes("EX90") || m.includes("7X") || m.includes("JAECOO5")) {
        if ((m.includes("EQE") || m.includes("EQS")) && !m.includes("SUV")) {
            carClass = "Sedan";
        } else {
            carClass = "SUV";
        }
    }
    else if (m.includes("SPRING") || m.includes("ZOE") || m.includes("ID.3") || m.includes("ID 3") || m.includes("5 E-TECH") || m.includes("5 E TECH") || m.includes("4 E-TECH") || m.includes("4 E TECH") || m.includes("208") || m.includes("500") || m.includes("FORTWO") || m.includes("FORFOUR") || m.includes("COOPER") || m.includes("T03") || m.includes("DOLPHIN") || m.includes("ATTO") || m.includes("ACEMAN") || m.includes("TWINGO") || m.includes("C-ZERO") || m.includes("MIEV") || m.includes("UP")) {
        carClass = "Hatchback";
    }
    
    if (carClass === "Van") {
        return `<svg class="car-silhouette Van" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>`;
    } else {
        return `<svg class="car-silhouette Sedan" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>`;
    }
}

function setupBlogReportTabs() {
    const tabSummary = document.getElementById('tab-summary');
    const tabTakeaways = document.getElementById('tab-takeaways');
    const tabHtml = document.getElementById('tab-html');
    const tabCover = document.getElementById('tab-cover');
    
    const summaryContent = document.getElementById('summary-content');
    const takeawaysContent = document.getElementById('takeaways-content');
    const htmlContentArea = document.getElementById('html-content-area');
    const coverContentArea = document.getElementById('cover-content-area');
    const downloadCoverBtn = document.getElementById('download-cover-btn');
    
    const updateTabVisibility = (activeTab) => {
        [tabSummary, tabTakeaways, tabHtml, tabCover].forEach(tab => {
            if (tab) tab.classList.remove('active');
        });
        [summaryContent, takeawaysContent, htmlContentArea, coverContentArea].forEach(content => {
            if (content) content.style.display = 'none';
        });
        
        if (activeTab === 'summary') {
            tabSummary.classList.add('active');
            summaryContent.style.display = 'block';
        } else if (activeTab === 'takeaways') {
            tabTakeaways.classList.add('active');
            takeawaysContent.style.display = 'block';
            initAiTakeawaysTab();
        } else if (activeTab === 'html') {
            tabHtml.classList.add('active');
            htmlContentArea.style.display = 'block';
        } else if (activeTab === 'cover') {
            tabCover.classList.add('active');
            coverContentArea.style.display = 'block';
            drawBlogCoverCanvas();
        }
    };
    
    if (tabSummary) tabSummary.addEventListener('click', () => updateTabVisibility('summary'));
    if (tabTakeaways) tabTakeaways.addEventListener('click', () => updateTabVisibility('takeaways'));
    if (tabHtml) tabHtml.addEventListener('click', () => updateTabVisibility('html'));
    if (tabCover) tabCover.addEventListener('click', () => updateTabVisibility('cover'));
}

function initAiTakeawaysTab() {
    const apiKeyInput = document.getElementById('ai-api-key-input');
    const saveBtn = document.getElementById('save-api-key-btn');
    const genArea = document.getElementById('ai-generation-area');
    const genBtn = document.getElementById('generate-takeaways-btn');
    const resultsArea = document.getElementById('ai-results-area');
    const outputBox = document.getElementById('takeaways-output-box');
    const copyTakeawaysBtn = document.getElementById('copy-takeaways-btn');
    
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    if (savedKey) {
        apiKeyInput.value = savedKey;
        genArea.style.display = 'block';
    } else {
        genArea.style.display = 'none';
    }
    
    // Save button click
    saveBtn.onclick = () => {
        const val = apiKeyInput.value.trim();
        if (val) {
            localStorage.setItem('gemini_api_key', val);
            alert('Cheia API a fost salvată local în browser!');
            genArea.style.display = 'block';
        } else {
            localStorage.removeItem('gemini_api_key');
            alert('Cheia API a fost ștearsă.');
            genArea.style.display = 'none';
        }
    };
    
    // Copy button click
    copyTakeawaysBtn.onclick = () => {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = outputBox.innerText;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
        
        const origText = copyTakeawaysBtn.innerText;
        copyTakeawaysBtn.innerText = 'Copiat!';
        copyTakeawaysBtn.style.background = '#10b981';
        copyTakeawaysBtn.style.borderColor = '#10b981';
        copyTakeawaysBtn.style.color = '#fff';
        setTimeout(() => {
            copyTakeawaysBtn.innerText = origText;
            copyTakeawaysBtn.style.background = '';
            copyTakeawaysBtn.style.borderColor = '';
            copyTakeawaysBtn.style.color = '';
        }, 2000);
    };
    
    // Generate button click
    genBtn.onclick = async () => {
        const key = localStorage.getItem('gemini_api_key');
        if (!key) {
            alert('Te rog adaugă o cheie API Gemini validă mai întâi.');
            return;
        }
        
        genBtn.disabled = true;
        genBtn.innerText = '⌛ Se generează concluziile cu AI...';
        resultsArea.style.display = 'block';
        outputBox.innerText = 'Analizăm datele de înmatriculări ale lunii și trimitem solicitarea către modelul Gemini...';
        
        try {
            // Pregătim datele pentru prompt
            const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
            const totalNew = totalEV - state.data.totalUsedEv;
            const totalUsed = state.data.totalUsedEv;
            const yoyGrowth = state.data.yoyGrowth.toFixed(2);
            const evShare = (state.data.evShare * 100).toFixed(2);
            const totalFirme = state.data.totalFirme;
            const totalPf = state.data.totalPf;
            const totalRadieri = state.data.totalRadieri;
            
            // Calculăm datele pentru prompt
            const modelsData = state.historicalModels && state.historicalModels[state.data.luna] ? state.historicalModels[state.data.luna] : {ytd: [], parc: []};
            
            const formatModel = (brand, model) => {
                const b = (brand || "").trim();
                const m = (model || "").trim();
                return m.toUpperCase().startsWith(b.toUpperCase()) ? m : `${b} ${m}`;
            };
            
            const top5Monthly = [...state.data.inmatriculariModele].filter(d => d.marca !== "Alte Modele").sort((a, b) => b.volum - a.volum).slice(0, 5)
                .map((m, idx) => `${idx+1}. ${formatModel(m.marca, m.model)}: ${m.volum} unități`).join('\n');
                
            const top5Ytd = modelsData.ytd.slice(0, 5)
                .map((m, idx) => `${idx+1}. ${formatModel(m.brand, m.model)}: ${m.ytd} unități`).join('\n');
                
            const top5Parc = modelsData.parc.slice(0, 5)
                .map((m, idx) => `${idx+1}. ${formatModel(m.brand, m.model)}: ${m.parc} unități`).join('\n');
                
            const monthTranslations = {
                'JAN': 'Ianuarie', 'FEB': 'Februarie', 'MAR': 'Martie', 'APR': 'Aprilie',
                'MAY': 'Mai', 'JUN': 'Iunie', 'JUL': 'Iulie', 'AUG': 'August',
                'SEP': 'Septembrie', 'OCT': 'Octombrie', 'NOV': 'Noiembrie', 'DEC': 'Decembrie'
            };
            const monthRo = monthTranslations[state.data.lunaNume.toUpperCase()] || state.data.lunaNume;
            
            const prompt = `Ești un analist auto specializat în mașini electrice în România. Iată datele înmatriculărilor de vehicule electrice în România pentru luna ${monthRo} 2026:
- Total înmatriculări EV (M1+N1): ${totalEV} (Noi: ${totalNew}, Second-hand/Rulate: ${totalUsed})
- Evoluție YoY (față de aceeași lună din 2025): ${yoyGrowth >= 0 ? '+' : ''}${yoyGrowth}%
- Cota de piață a vehiculelor electrice noi din total înmatriculări noi: ${evShare}%
- Înmatriculări pe Firme/Companii: ${totalFirme} unități, Persoane Fizice: ${totalPf} unități
- Număr vehicule radiate din circulație: ${totalRadieri}
- Top 5 modele înmatriculate în această lună:
${top5Monthly}
- Top 5 YTD (ianuarie - ${monthRo} 2026):
${top5Ytd}
- Top 5 Parc Auto General:
${top5Parc}

Generează două secțiuni separate EXACT prin linia delimitatoare "--- SEO ---":

Secțiunea 1: 3-4 concluzii cheie (key takeaways) EXTREM DE SUCCINTE și direct la obiect în limba română pentru blogul ElectroMobilitate.
Reguli de stil obligatorii pentru Secțiunea 1:
1. Fără introduceri, fraze de umplutură, metafore sau speculații. Direct la subiect.
2. Fiecare punct trebuie să aibă maximum 1-2 propoziții scurte, axate pe cifre concrete din datele furnizate.
3. Respectă cu strictețe următorul format:
[Emoji] **Titlu scurt (2-4 cuvinte)**: [Descriere scurtă cu date concrete].

Exemple de concluzii acceptate ca stil:
📈 **Creștere anuală puternică**: Înmatriculările lunare de EV au crescut cu ${yoyGrowth >= 0 ? '+' : ''}${yoyGrowth}%, atingând un volum total de ${totalEV} unități.
🚗 **Model 3 pe primul loc**: Tesla Model 3 conduce topul lunar cu ${top5Monthly.split('\n')[0] ? top5Monthly.split('\n')[0].split(': ')[1] : 'X unități'}, fiind urmat de Model Y.
💼 **Segmentul corporate domină**: Companiile dețin majoritatea achizițiilor din această lună cu ${totalFirme} înmatriculări, față de doar ${totalPf} unități în dreptul persoanelor fizice.

Secțiunea 2: Optimizare SEO Blog (Yoast SEO).
Furnizează următoarele două elemente:
1. Focus Keyphrase (Cuvânt cheie focusat în limba română, de exemplu: "inmatriculari masini electrice ${monthRo.toLowerCase()} 2026" sau similar, relevant pentru articolul de blog).
2. Meta Description (O descriere meta captivantă, axată pe impact și care să îndemne la click, în limba română, având STRICT între 120 și 155 de caractere).

Formatul dorit pentru Secțiunea 2:
Focus Keyphrase: [Cuvânt cheie ales]
Meta Description: [Descrierea optimizată pentru SEO]`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });
            
            const resData = await response.json();
            if (resData.candidates && resData.candidates[0] && resData.candidates[0].content && resData.candidates[0].content.parts[0]) {
                const text = resData.candidates[0].content.parts[0].text;
                
                // Divizăm răspunsul în Concluzii și SEO
                const parts = text.split('--- SEO ---');
                const takeawaysText = parts[0].trim();
                const seoText = parts[1] ? parts[1].trim() : '';
                
                outputBox.innerText = takeawaysText;
                
                const seoOutputBox = document.getElementById('seo-output-box');
                if (seoOutputBox) {
                    seoOutputBox.innerText = seoText || 'Nu s-a generat secțiunea SEO. Încearcă din nou.';
                }
            } else if (resData.error) {
                console.error("Gemini API Error:", resData.error);
                outputBox.innerText = `Eroare API Gemini (${resData.error.status || 'Cod ' + resData.error.code}): ${resData.error.message}\n\nVerifică dacă cheia ta API este activă, are acces la modelul gemini-2.5-flash și nu are restricții de IP sau domeniu.`;
            } else {
                console.error(resData);
                outputBox.innerText = "Eroare: Nu s-a putut obține răspunsul corect de la Gemini. Verifică cheia API și conexiunea.";
            }
        } catch (error) {
            console.error(error);
            outputBox.innerText = "Eroare la comunicarea cu Gemini: " + error.message;
        } finally {
            genBtn.disabled = false;
            genBtn.innerText = '✨ Generează Concluzii cu AI (Gemini)';
        }
    };
    
    // Copy SEO button click
    const copySeoBtn = document.getElementById('copy-seo-btn');
    if (copySeoBtn) {
        copySeoBtn.onclick = () => {
            const seoOutputBox = document.getElementById('seo-output-box');
            if (!seoOutputBox || !seoOutputBox.innerText) return;
            
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = seoOutputBox.innerText;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
            
            const origText = copySeoBtn.innerText;
            copySeoBtn.innerText = 'Copiat!';
            copySeoBtn.style.background = '#10b981';
            copySeoBtn.style.borderColor = '#10b981';
            copySeoBtn.style.color = '#fff';
            setTimeout(() => {
                copySeoBtn.innerText = origText;
                copySeoBtn.style.background = '';
                copySeoBtn.style.borderColor = '';
                copySeoBtn.style.color = '';
            }, 2000);
        };
    }
}

function setupCopyAndDownloadBtns() {
    // Configure separate copy buttons
    document.querySelectorAll('.copy-section-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const textarea = document.getElementById(targetId);
            if (textarea) {
                textarea.select();
                document.execCommand('copy');
                
                // Visual feedback on the button
                const originalText = e.target.innerText;
                e.target.innerText = 'Copiat!';
                e.target.style.background = '#10b981';
                e.target.style.borderColor = '#10b981';
                e.target.style.color = '#fff';
                setTimeout(() => {
                    e.target.innerText = originalText;
                    e.target.style.background = '';
                    e.target.style.borderColor = '';
                    e.target.style.color = '';
                }, 2000);
            }
        });
    });

    const downloadCoverBtn = document.getElementById('download-cover-btn');
    if (downloadCoverBtn) {
        downloadCoverBtn.addEventListener('click', () => {
            const canvas = document.getElementById('blog-cover-canvas');
            if (!canvas) return;
            
            const monthTranslations = {
                'JAN': 'Ianuarie', 'FEB': 'Februarie', 'MAR': 'Martie',
                'APR': 'Aprilie', 'MAY': 'Mai', 'JUN': 'Iunie',
                'JUL': 'Iulie', 'AUG': 'August', 'SEP': 'Septembrie',
                'OCT': 'Octombrie', 'NOV': 'Noiembrie', 'DEC': 'Decembrie'
            };
            const lunaRo = monthTranslations[state.data.lunaNume] || state.data.lunaNume;
            const currentYear = state.data.luna ? state.data.luna.substring(0, 4) : '2026';
            
            const link = document.createElement('a');
            link.download = `EV_Radar_Romania_Coperta_${lunaRo}_${currentYear}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
}

function drawBlogCoverCanvas() {
    const canvas = document.getElementById('blog-cover-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1200, 630);
    
    // Draw subtle bottom pattern/gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 630);
    grad.addColorStop(0, 'rgba(2, 132, 199, 0.02)');
    grad.addColorStop(1, 'rgba(0, 75, 135, 0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);
    
    // Romanian month translations
    const monthTranslations = {
        'JAN': 'Ianuarie', 'FEB': 'Februarie', 'MAR': 'Martie',
        'APR': 'Aprilie', 'MAY': 'Mai', 'JUN': 'Iunie',
        'JUL': 'Iulie', 'AUG': 'August', 'SEP': 'Septembrie',
        'OCT': 'Octombrie', 'NOV': 'Noiembrie', 'DEC': 'Decembrie'
    };
    const lunaRo = monthTranslations[state.data.lunaNume] || state.data.lunaNume;
    const currentYear = state.data.luna ? state.data.luna.substring(0, 4) : '2026';
    
    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#004b87'; // primary-color
    ctx.font = 'bold 54px Montserrat, sans-serif';
    ctx.fillText(`EV Radar România - ${lunaRo} ${currentYear}`, 600, 85);
    
    // Fetch values first
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    const base2025 = 63986;
    const history2026 = {
        'JAN': 1325, 'FEB': 1280, 'MAR': 1021, 'APR': 1259, 'MAY': 1402,
        'JUN': 0, 'JUL': 0, 'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0
    };
    
    // We can sum YTD total fleet
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let totalFleet = base2025;
    for (const m of monthsOrder) {
        if (m === state.data.lunaNume) {
            totalFleet += (state.data.totalAutoReg + state.data.totalUtilReg - state.data.totalRadieri);
            break;
        }
        totalFleet += history2026[m];
    }

    // DRAW THE RADAR SCREEN BACKGROUND SCENE
    const centerX = 600;
    const centerY = 310;
    
    // 1. Concentric circles with soft glow
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.15)'; // light primary blue/cyan
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 240, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 160, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Inner circle (dashed)
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.25)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, 90, 0, 2 * Math.PI);
    ctx.stroke();
    
    // 2. Axis/Crosshair lines
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(centerX - 280, centerY);
    ctx.lineTo(centerX + 280, centerY);
    ctx.moveTo(centerX, centerY - 220);
    ctx.lineTo(centerX, centerY + 220);
    ctx.stroke();
    ctx.setLineDash([]); // reset dash
    
    // 3. Radar sweeping glow
    ctx.save();
    ctx.translate(centerX, centerY);
    const radarGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 240);
    radarGrad.addColorStop(0, 'rgba(2, 132, 199, 0.12)');
    radarGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.04)');
    radarGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = radarGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 240, -Math.PI / 4, 0); // sweep wedge angle
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // 4. Stylized Lightning Bolt Icon at the top-center of the radar
    ctx.save();
    ctx.translate(centerX, centerY - 165);
    ctx.beginPath();
    ctx.moveTo(0, -28); // top tip
    ctx.lineTo(13, 0);  // middle right
    ctx.lineTo(2, 0);   // middle inner right
    ctx.lineTo(8, 28);  // bottom tip
    ctx.lineTo(-13, 0); // middle left
    ctx.lineTo(-2, 0);  // middle inner left
    ctx.closePath();
    ctx.fillStyle = '#0284c7';
    ctx.shadowColor = 'rgba(2, 132, 199, 0.3)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // 5. Total fleet number & label centered inside the radar
    ctx.fillStyle = '#004b87';
    ctx.font = '900 102px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(totalFleet.toLocaleString('ro-RO'), centerX, centerY + 25);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = '700 24px Montserrat, sans-serif';
    ctx.fillText('MAȘINI ELECTRICE ÎN TOTAL', centerX, centerY + 75);
    
    // Card 1: Left Card (New Registrations)
    drawRoundedRect(ctx, 100, 460, 480, 130, 16, '#ffffff', '#e2e8f0');
    ctx.fillStyle = '#004b87';
    ctx.font = '900 64px Montserrat, sans-serif';
    ctx.fillText(totalEV.toLocaleString('ro-RO'), 340, 525);
    ctx.fillStyle = '#64748b';
    ctx.font = '700 14px Montserrat, sans-serif';
    ctx.fillText(`ÎNMATRICULĂRI NOI ÎN ${lunaRo.toUpperCase()}`, 340, 565);
    
    // Card 2: Right Card (YoY Growth)
    drawRoundedRect(ctx, 620, 460, 480, 130, 16, '#ffffff', '#e2e8f0');
    const yoyVal = state.data.yoyGrowth;
    const yoySign = yoyVal >= 0 ? '+' : '';
    const yoyArrow = yoyVal >= 0 ? '↑' : '↓';
    const yoyColor = yoyVal >= 0 ? '#10b981' : '#ef4444';
    
    ctx.fillStyle = yoyColor;
    ctx.font = '900 64px Montserrat, sans-serif';
    ctx.fillText(`${yoySign}${yoyVal.toFixed(1)}% ${yoyArrow}`, 860, 525);
    
    const prevYearVal = Math.round(totalEV / (1 + (yoyVal / 100)));
    ctx.fillStyle = '#64748b';
    ctx.font = '700 14px Montserrat, sans-serif';
    ctx.fillText(`EVOLUȚIE YoY (vs. ${prevYearVal.toLocaleString('ro-RO')} în ${lunaRo} 2025)`, 860, 565);
}

function drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.shadowColor = 'rgba(15, 23, 42, 0.04)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 4;
        ctx.fill();
        ctx.shadowColor = 'transparent'; // reset
    }
    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

function setupSendBtn() {
    const btn = document.getElementById('send-to-sheets-btn');
    btn.addEventListener('click', async () => {
        if (!state.sheetsUrl) {
            alert("Te rugăm să introduci URL-ul Google Sheets în secțiunea de Configurare de sus.");
            document.getElementById('sheets-url').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('sheets-url').focus();
            return;
        }
        
        showLoader("Se trimit datele în Google Sheets...");
        
        const payload = {
            luna: state.data.luna,
            lunaNume: state.data.lunaNume,
            total_inmatriculari: state.data.totalAutoReg + state.data.totalUtilReg,
            total_radieri: state.data.totalRadieri,
            modele: state.data.inmatriculariModele
        };
        
        try {
            await fetch(state.sheetsUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });
            
            hideLoader();
            alert("Datele au fost trimise spre Google Sheets! Te rugăm să verifici documentul centralizator.");
        } catch (error) {
            hideLoader();
            console.error("Eroare la trimiterea datelor (s-ar putea să fi fost trimise totuși):", error);
            alert("Trimiterea a fost inițiată. Verifică documentul Google Sheets pentru a confirma actualizarea.");
        }
    });
}

const roMonthsMap = {
    '01': 'ianuarie', '02': 'februarie', '03': 'martie', '04': 'aprilie',
    '05': 'mai', '06': 'iunie', '07': 'iulie', '08': 'august',
    '09': 'septembrie', '10': 'octombrie', '11': 'noiembrie', '12': 'decembrie'
};

function getSelectedProcessPeriod(prefix) {
    const yearSelect = document.getElementById(`${prefix}-year-select`);
    const monthSelect = document.getElementById(`${prefix}-month-select`);
    if (!yearSelect || !monthSelect) return null;
    
    const year = yearSelect.value;
    const [monthNum, lunaNume] = monthSelect.value.split('|');
    const luna = `${year}-${monthNum}`;
    const monthName = `${roMonthsMap[monthNum]} ${year}`;
    const code = `${year}${monthNum}`;
    
    return { luna, lunaNume, monthName, code };
}

function setupAutoDgpciBtn() {
    const btn = document.getElementById('auto-dgpci-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        const period = getSelectedProcessPeriod('auto');
        if (!period) return;
        const { luna, lunaNume, monthName, code } = period;
        
        // Verificam daca datele sunt deja in cache
        const cached = localStorage.getItem('ev_radar_ro_data_' + luna);
        if (cached) {
            const useCache = confirm(`Datele pentru ${monthName} sunt deja procesate și salvate local. Vrei să le încarci instant din cache?\n\n[OK = Încarcă instant, Cancel = Re-descarcă și re-procesează de pe site]`);
            if (useCache) {
                state.data = JSON.parse(cached);
                renderDashboard();
                return;
            }
        }
        
        showLoader(`Se descarcă și se procesează datele DGPCI pentru ${monthName}...`);
        
        // Pornim interogarea progresului in paralel
        let progressInterval = setInterval(async () => {
            try {
                const res = await fetch('http://localhost:8000/api/progress');
                if (res.ok) {
                    const progressData = await res.json();
                    if (progressData && progressData.step) {
                        const pct = progressData.percent !== undefined ? progressData.percent : 0;
                        document.getElementById('loader-text').innerText = `${progressData.step} (${pct}%)`;
                        const progressBar = document.getElementById('loader-progress-bar');
                        if (progressBar) {
                            progressBar.style.width = `${pct}%`;
                        }
                    }
                }
            } catch (err) {
                console.warn("Eroare la obținerea progresului:", err);
            }
        }, 1000);
        
        try {
            const response = await fetch(`http://localhost:8000/api/download-and-process?month=${encodeURIComponent(monthName)}&code=${code}&lunaNume=${lunaNume}&luna=${luna}`);
            
            // Oprim intervalul imediat ce avem raspunsul final de la server
            clearInterval(progressInterval);
            
            if (!response.ok) {
                throw new Error("Eroare la procesarea pe serverul local.");
            }
            
            const result = await response.json();
            if (result.status === "success") {
                state.data.luna = luna;
                state.data.lunaNume = lunaNume;
                state.data.totalAutoReg = result.data.totalAutoReg;
                state.data.totalUtilReg = result.data.totalUtilReg;
                state.data.totalRadieri = result.data.totalRadieri;
                state.data.totalUsedEv = result.data.totalUsedEv || Math.round((result.data.totalAutoReg + result.data.totalUtilReg) * result.data.usedShare);
                state.data.totalFirme = result.data.totalFirme;
                state.data.totalPf = result.data.totalPf;
                state.data.evShare = result.data.evShare;
                state.data.usedShare = result.data.usedShare;
                state.data.yoyGrowth = result.data.yoyGrowth;
                state.data.inmatriculariModele = result.data.inmatriculariModele;
                state.data.radieriModele = result.data.radieriModele;
                
                hideLoader();
                renderDashboard();
                
                // Derulam pana la dashboard
                document.getElementById('results-dashboard').scrollIntoView({ behavior: 'smooth' });
                
                alert(`Datele pentru ${monthName} au fost descărcate și procesate cu succes!`);
            } else {
                throw new Error(result.message || "Procesarea a eșuat pe server.");
            }
        } catch (error) {
            clearInterval(progressInterval);
            hideLoader();
            console.error("Eroare la procesarea automată:", error);
            alert("Eroare la procesarea automată: " + error.message + "\n\nAsigură-te că serverul local rulează (python3 server.py).");
        }
    });
}

function setupLocalProcessBtn() {
    const btn = document.getElementById('local-process-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        const period = getSelectedProcessPeriod('local');
        if (!period) return;
        const { luna, lunaNume, monthName, code } = period;
        
        // Verificam daca datele sunt deja in cache
        const cached = localStorage.getItem('ev_radar_ro_data_' + luna);
        if (cached) {
            const useCache = confirm(`Datele locale pentru ${monthName} sunt deja procesate și salvate local. Vrei să le încarci instant din cache?\n\n[OK = Încarcă instant, Cancel = Re-procesează fișierele locale]`);
            if (useCache) {
                state.data = JSON.parse(cached);
                renderDashboard();
                return;
            }
        }
        
        showLoader(`Se analizează datele locale pentru ${monthName}...`);
        
        let progressInterval = setInterval(async () => {
            try {
                const res = await fetch('http://localhost:8000/api/progress');
                if (res.ok) {
                    const progressData = await res.json();
                    if (progressData && progressData.step) {
                        const pct = progressData.percent !== undefined ? progressData.percent : 0;
                        document.getElementById('loader-text').innerText = `${progressData.step} (${pct}%)`;
                        const progressBar = document.getElementById('loader-progress-bar');
                        if (progressBar) {
                            progressBar.style.width = `${pct}%`;
                        }
                    }
                }
            } catch (err) {
                console.warn("Eroare la obținerea progresului:", err);
            }
        }, 1000);
        
        try {
            const response = await fetch(`http://localhost:8000/api/process-local?code=${code}&lunaNume=${lunaNume}&luna=${luna}`);
            
            clearInterval(progressInterval);
            
            if (!response.ok) {
                const errResult = await response.json().catch(() => ({}));
                throw new Error(errResult.message || "Eroare la procesarea locală (asigură-te că fișierele există în folder).");
            }
            
            const result = await response.json();
            if (result.status === "success") {
                state.data.luna = luna;
                state.data.lunaNume = lunaNume;
                state.data.totalAutoReg = result.data.totalAutoReg;
                state.data.totalUtilReg = result.data.totalUtilReg;
                state.data.totalRadieri = result.data.totalRadieri;
                state.data.totalUsedEv = result.data.totalUsedEv || Math.round((result.data.totalAutoReg + result.data.totalUtilReg) * result.data.usedShare);
                state.data.totalFirme = result.data.totalFirme;
                state.data.totalPf = result.data.totalPf;
                state.data.evShare = result.data.evShare;
                state.data.usedShare = result.data.usedShare;
                state.data.yoyGrowth = result.data.yoyGrowth;
                state.data.inmatriculariModele = result.data.inmatriculariModele;
                state.data.radieriModele = result.data.radieriModele;
                
                hideLoader();
                renderDashboard();
                
                document.getElementById('results-dashboard').scrollIntoView({ behavior: 'smooth' });
                
                alert(`Datele locale pentru ${monthName} au fost procesate cu succes!`);
            } else {
                throw new Error(result.message || "Procesarea locală a eșuat.");
            }
        } catch (error) {
            clearInterval(progressInterval);
            hideLoader();
            console.error("Eroare la procesarea locală:", error);
            alert("Eroare la procesarea locală: " + error.message);
        }
    });
}

function setupClearBtn() {
    const btn = document.getElementById('clear-sheets-btn');
    btn.addEventListener('click', async () => {
        if (!state.sheetsUrl) {
            alert("Te rugăm să introduci URL-ul Google Sheets în secțiunea de Configurare de sus.");
            document.getElementById('sheets-url').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('sheets-url').focus();
            return;
        }
        
        const select = document.getElementById('manual-month-select');
        const [luna, lunaNume] = select.value.split('|');
        
        if (!confirm(`Ești sigur că vrei să ȘTERGI complet toate datele pentru luna ${lunaNume} din Google Sheets?`)) {
            return;
        }
        
        showLoader(`Se curăță datele pentru luna ${lunaNume} în Google Sheets...`);
        
        const payload = {
            luna: luna,
            lunaNume: lunaNume,
            total_inmatriculari: 0,
            total_radieri: 0,
            modele: []
        };
        
        try {
            await fetch(state.sheetsUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });
            
            hideLoader();
            alert(`Datele pentru luna ${lunaNume} au fost curățate în Google Sheets!`);
        } catch (error) {
            hideLoader();
            console.error("Eroare la ștergerea datelor:", error);
            alert("Solicitarea de curățare a fost trimisă. Verifică documentul Google Sheets pentru a confirma resetarea.");
        }
    });
}

function showLoader(text) {
    document.getElementById('loader-text').innerText = text;
    const progressBar = document.getElementById('loader-progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function renderHistoricalCharts() {
    // 1. Determinam anul selectat si cel precedent
    const currentYear = state.data && state.data.luna ? parseInt(state.data.luna.split('-')[0]) : 2026;
    const prevYear = currentYear - 1;

    // Actualizam titlul si legenda pe dashboard
    const compTitleEl = document.getElementById('monthly-comp-title');
    if (compTitleEl) {
        compTitleEl.innerText = `Înmatriculări lunare EV (${prevYear} vs. ${currentYear})`;
    }
    const legendCurrEl = document.getElementById('lbl-legend-curr');
    if (legendCurrEl) {
        legendCurrEl.innerText = String(currentYear);
    }
    const legendPrevEl = document.getElementById('lbl-legend-prev');
    if (legendPrevEl) {
        legendPrevEl.innerText = String(prevYear);
    }

    // Gasim datele lunare din historicalSummary pentru prevYear si currentYear
    const regsPrevYear = {
        'JAN': 0, 'FEB': 0, 'MAR': 0, 'APR': 0, 'MAY': 0, 'JUN': 0,
        'JUL': 0, 'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0
    };
    const regsCurrentYear = {
        'JAN': null, 'FEB': null, 'MAR': null, 'APR': null, 'MAY': null, 'JUN': null,
        'JUL': null, 'AUG': null, 'SEP': null, 'OCT': null, 'NOV': null, 'DEC': null
    };

    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    monthsOrder.forEach(m => {
        // No hardcoded fallback — data comes exclusively from historical_summary.json

        if (state.historicalSummary) {
            const prevYearStr = String(prevYear);
            if (state.historicalSummary[prevYearStr] && state.historicalSummary[prevYearStr][m]) {
                const item = state.historicalSummary[prevYearStr][m];
                regsPrevYear[m] = item.totalAutoReg + item.totalUtilReg;
            }
            const currYearStr = String(currentYear);
            if (state.historicalSummary[currYearStr] && state.historicalSummary[currYearStr][m]) {
                const item = state.historicalSummary[currYearStr][m];
                regsCurrentYear[m] = item.totalAutoReg + item.totalUtilReg;
            }
        }
    });

    // Suprascriem luna selectata in mod dinamic cu datele actuale incarcate
    const currentLunaNume = state.data.lunaNume;
    const currentRegs = state.data.totalAutoReg + state.data.totalUtilReg;
    if (regsCurrentYear.hasOwnProperty(currentLunaNume)) {
        regsCurrentYear[currentLunaNume] = currentRegs;
    }
    
    // Daca suntem pe o luna din anul curent, sa stergem valorile din lunile viitoare
    const currentIdx = monthsOrder.indexOf(currentLunaNume);
    if (currentIdx !== -1) {
        for (let i = currentIdx + 1; i < monthsOrder.length; i++) {
            regsCurrentYear[monthsOrder[i]] = null;
        }
    }

    // Generam graficul comparativ
    const compContainer = document.getElementById('monthly-comp-list');
    if (compContainer) {
        compContainer.innerHTML = '';
        
        // Gasim valoarea maxima pentru scalare
        let maxVal = 0;
        monthsOrder.forEach(m => {
            if (regsPrevYear[m] > maxVal) maxVal = regsPrevYear[m];
            if (regsCurrentYear[m] !== null && regsCurrentYear[m] > maxVal) maxVal = regsCurrentYear[m];
        });
        const scaleMax = maxVal > 0 ? maxVal * 1.15 : 100;
        
        monthsOrder.forEach(m => {
            const val25 = regsPrevYear[m];
            const val26 = regsCurrentYear[m];
            
            const h25 = ((val25 / scaleMax) * 100).toFixed(1);
            const h26 = val26 !== null ? ((val26 / scaleMax) * 100).toFixed(1) : 0;
            let badgeHTML = '';
            if (val26 !== null && val26 > 0 && val25 > 0) {
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
    
    state.computedAnnualData = annualData;

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
                } else {
                }
                subtractNet += (mReg - mRad);
            }
        }
        totalFleet = baseFleetDec2025 - subtractNet;
    }
    
    state.computedTotalFleet = totalFleet;

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
        const scaleMaxQty = maxQty > 0 ? maxQty * 1.15 : 100;
        
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
        
        setTimeout(() => {
            const container = annualContainer.closest('.v-chart-container');
            if (container) {
                container.scrollLeft = 99999;
            }
        }, 300);
    }

    if (compContainer) {
        setTimeout(() => {
            const container = compContainer.closest('.v-chart-container');
            if (container) {
                const monthCols = compContainer.querySelectorAll('.v-col-group');
                const currentIdx = monthsOrder.indexOf(state.data.lunaNume);
                if (currentIdx !== -1 && monthCols[currentIdx]) {
                    const targetCol = monthCols[currentIdx];
                    const containerWidth = container.clientWidth;
                    const colOffsetLeft = targetCol.offsetLeft;
                    const colWidth = targetCol.clientWidth;
                    container.scrollLeft = colOffsetLeft - (containerWidth / 2) + (colWidth / 2);
                }
            }
        }, 100);
    }
    
    // Call the newly created EV Share Trend Chart function
    renderEvShareTrendChart();
}

function renderEvShareTrendChart() {
    const container = document.getElementById('ev-share-trend-list');
    if (!container || !state.historicalSummary) return;
    
    container.innerHTML = '';
    const currentYear = state.data && state.data.luna ? parseInt(state.data.luna.split('-')[0]) : 2026;
    const prevYear = currentYear - 1;
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    // We will plot prevYear and currentYear evShare if available
    let maxVal = 0;
    const prevYearShares = {};
    const currYearShares = {};
    
    monthsOrder.forEach(m => {
        let share25 = 0;
        let share26 = null;
        if (state.historicalSummary[String(prevYear)] && state.historicalSummary[String(prevYear)][m]) {
            share25 = state.historicalSummary[String(prevYear)][m].evShare || 0;
        }
        if (state.historicalSummary[String(currentYear)] && state.historicalSummary[String(currentYear)][m]) {
            share26 = state.historicalSummary[String(currentYear)][m].evShare;
        }
        
        // Suprapunem luna curenta din state.data.evShare in mod activ
        if (m === state.data.lunaNume) {
            share26 = state.data.evShare;
        }
        
        // Daca e luna viitoare in anul curent, setam pe null
        const currentIdx = monthsOrder.indexOf(state.data.lunaNume);
        if (monthsOrder.indexOf(m) > currentIdx) {
            share26 = null;
        }
        
        prevYearShares[m] = share25;
        currYearShares[m] = share26;
        
        if (share25 > maxVal) maxVal = share25;
        if (share26 !== null && share26 > maxVal) maxVal = share26;
    });
    
    const scaleMax = maxVal > 0 ? maxVal * 1.2 : 0.2; // 20% minim

    monthsOrder.forEach(m => {
        const val25 = prevYearShares[m];
        const val26 = currYearShares[m];
        
        const h25 = ((val25 / scaleMax) * 100).toFixed(1);
        const h26 = val26 !== null ? ((val26 / scaleMax) * 100).toFixed(1) : 0;
        
        const lbl25 = (val25 * 100).toFixed(1) + '%';
        const lbl26 = val26 !== null ? (val26 * 100).toFixed(1) + '%' : '';

        const col = document.createElement('div');
        col.className = 'v-col-group';
        col.innerHTML = `
            <div class="v-bars" style="height: 190px;">
                ${val26 !== null ? `
                    <div class="v-bar-2026" style="height: ${h26}%; background: rgba(16, 185, 129, 0.9);">
                        <span class="v-bar-val-static active-year">${lbl26}</span>
                    </div>
                ` : ''}
                <div class="v-bar-2025" style="height: ${h25}%;">
                    <span class="v-bar-val-static">${lbl25}</span>
                </div>
            </div>
            <div class="v-col-lbl">
                ${m}<br><span class="v-col-lbl-year">${val26 !== null ? currentYear : prevYear}</span>
            </div>
        `;
        container.appendChild(col);
    });
}
