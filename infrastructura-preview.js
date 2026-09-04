(() => {
    "use strict";

    const app = document.getElementById("charging-app");
    const errorMessage = document.getElementById("error-message");
    const rankingList = document.getElementById("ranking-list");
    const countrySelect = document.getElementById("country-select");
    const tableBody = document.getElementById("comparison-table");
    const integer = new Intl.NumberFormat("ro-RO");
    const decimal = new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    let data;
    let sortedCountries;
    let selectedCode = "RO";

    function setText(id, value) {
        document.getElementById(id).textContent = value;
    }

    function assertData(payload) {
        if (!payload || payload.schemaVersion !== 1 || !Array.isArray(payload.countries)) {
            throw new Error("Setul de infrastructură are un format invalid.");
        }
        const codes = payload.countries.map(country => country.code);
        if (codes.length !== 13 || new Set(codes).size !== codes.length || !codes.includes("RO")) {
            throw new Error("Lista regională este incompletă.");
        }
        payload.countries.forEach(country => {
            if (country.publicPoints <= 0 || country.bevFleetM1 <= 0 || country.acPoints + country.dcPoints !== country.publicPoints) {
                throw new Error(`Date incompatibile pentru ${country.code}.`);
            }
        });
    }

    function selectedCountry() {
        return data.countries.find(country => country.code === selectedCode);
    }

    function renderSummary() {
        const romania = data.countries.find(country => country.code === "RO");
        const rank = sortedCountries.findIndex(country => country.code === "RO") + 1;
        setText("ro-points", integer.format(romania.publicPoints));
        setText("ro-fleet", integer.format(romania.bevFleetM1));
        setText("ro-ratio", decimal.format(romania.bevPerPoint));
        setText("ro-fast-share", `${decimal.format(romania.highPowerShare)}%`);
        setText("ro-rank", `România: locul ${rank} din ${sortedCountries.length}`);
    }

    function selectCountry(code) {
        selectedCode = code;
        countrySelect.value = code;
        renderRankingSelection();
        renderCountry();
    }

    function renderRanking() {
        rankingList.replaceChildren();
        const maximum = Math.max(...sortedCountries.map(country => country.bevPerPoint));
        sortedCountries.forEach((country, index) => {
            const row = document.createElement("div");
            row.className = "rank-row";
            row.tabIndex = 0;
            row.role = "button";
            row.dataset.code = country.code;
            row.dataset.romania = String(country.code === "RO");
            row.setAttribute("aria-label", `${country.name}: ${decimal.format(country.bevPerPoint)} autoturisme BEV per punct public`);

            const position = document.createElement("span");
            position.className = "rank-position";
            position.textContent = String(index + 1);
            const name = document.createElement("span");
            name.className = "rank-country";
            name.textContent = `${country.flag} ${country.name}`;
            const track = document.createElement("span");
            track.className = "rank-track";
            const fill = document.createElement("span");
            fill.className = "rank-fill";
            fill.style.width = `${country.bevPerPoint / maximum * 100}%`;
            track.append(fill);
            const value = document.createElement("span");
            value.className = "rank-value";
            value.textContent = decimal.format(country.bevPerPoint);
            row.append(position, name, track, value);
            row.addEventListener("click", () => selectCountry(country.code));
            row.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectCountry(country.code);
                }
            });
            rankingList.append(row);
        });
    }

    function renderRankingSelection() {
        rankingList.querySelectorAll(".rank-row").forEach(row => {
            row.dataset.selected = String(row.dataset.code === selectedCode);
        });
    }

    function renderCountry() {
        const country = selectedCountry();
        setText("country-flag", country.flag);
        setText("country-name", country.name);
        setText("country-ratio", decimal.format(country.bevPerPoint));
        setText("country-points", integer.format(country.publicPoints));
        setText("country-ac", integer.format(country.acPoints));
        setText("country-dc", integer.format(country.dcPoints));
        setText("country-fast", `${integer.format(country.highPowerDcPoints)} · ${decimal.format(country.highPowerShare)}%`);
        setText("country-ultra", integer.format(country.ultraFastDcPoints));
        setText("country-fleet", integer.format(country.bevFleetM1));
        const acShare = country.acPoints / country.publicPoints * 100;
        const dcShare = country.dcPoints / country.publicPoints * 100;
        document.getElementById("composition-ac").style.width = `${acShare}%`;
        document.getElementById("composition-dc").style.width = `${dcShare}%`;
        setText("ac-label", `AC ${decimal.format(acShare)}%`);
        setText("dc-label", `DC ${decimal.format(dcShare)}%`);
    }

    function renderTable() {
        tableBody.replaceChildren();
        sortedCountries.forEach((country, index) => {
            const row = document.createElement("tr");
            row.dataset.romania = String(country.code === "RO");
            [
                String(index + 1), `${country.flag} ${country.name}`, integer.format(country.publicPoints),
                integer.format(country.bevFleetM1), decimal.format(country.bevPerPoint),
                `${integer.format(country.highPowerDcPoints)} · ${decimal.format(country.highPowerShare)}%`,
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.append(cell);
            });
            tableBody.append(row);
        });
    }

    function buildSelect() {
        [...data.countries]
            .sort((left, right) => left.name.localeCompare(right.name, "ro"))
            .forEach(country => {
                const option = document.createElement("option");
                option.value = country.code;
                option.textContent = `${country.flag} ${country.name}`;
                countrySelect.append(option);
            });
        countrySelect.value = selectedCode;
        countrySelect.addEventListener("change", () => selectCountry(countrySelect.value));
    }

    fetch("rapoarte/charging_infrastructure.json", { cache: "no-store" })
        .then(response => {
            if (!response.ok) throw new Error("Lipsesc datele EAFO.");
            return response.json();
        })
        .then(payload => {
            assertData(payload);
            data = payload;
            sortedCountries = [...data.countries].sort((left, right) => left.bevPerPoint - right.bevPerPoint);
            buildSelect();
            renderSummary();
            renderRanking();
            renderRankingSelection();
            renderCountry();
            renderTable();
            document.getElementById("source-link").href = data.source.methodologyUrl;
            const generated = new Date(data.generatedAt);
            setText("generated-at", Number.isNaN(generated.getTime())
                ? data.generatedAt
                : generated.toLocaleString("ro-RO", { dateStyle: "long", timeStyle: "short" }));
        })
        .catch(error => {
            app.hidden = true;
            errorMessage.hidden = false;
            errorMessage.textContent = `Datele nu au putut fi încărcate: ${error.message}`;
        });
})();
