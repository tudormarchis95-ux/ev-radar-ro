(() => {
    "use strict";

    const SVG_NS = "http://www.w3.org/2000/svg";
    const app = document.getElementById("charging-app");
    const errorMessage = document.getElementById("error-message");
    const matrix = document.getElementById("infrastructure-matrix");
    const countrySelect = document.getElementById("country-select");
    const tableBody = document.getElementById("comparison-table");
    const integer = new Intl.NumberFormat("ro-RO");
    const decimal = new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    let data;
    let selectedCode = "RO";

    function setText(id, value) {
        document.getElementById(id).textContent = value;
    }

    function svgElement(tag, attributes = {}, text = null) {
        const element = document.createElementNS(SVG_NS, tag);
        Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
        if (text !== null) element.textContent = text;
        return element;
    }

    function median(values) {
        const sorted = [...values].sort((left, right) => left - right);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    }

    function assertData(payload) {
        if (!payload || payload.schemaVersion !== 2 || !Array.isArray(payload.countries)) {
            throw new Error("Setul de infrastructură are un format invalid.");
        }
        const codes = payload.countries.map(country => country.code);
        if (codes.length !== 13 || new Set(codes).size !== codes.length || !codes.includes("RO")) {
            throw new Error("Lista regională este incompletă.");
        }
        payload.countries.forEach(country => {
            const required = [
                country.publicPoints, country.bevFleetM1, country.population, country.totalPublicPowerKw,
                country.publicPowerKwPerBev, country.fastDcPer100kResidents,
            ];
            if (required.some(value => !Number.isFinite(value) || value <= 0)) {
                throw new Error(`Date invalide pentru ${country.code}.`);
            }
            if (country.acPoints + country.dcPoints !== country.publicPoints
                || country.highPowerDcPoints > country.dcPoints
                || country.ultraFastDcPoints > country.highPowerDcPoints) {
                throw new Error(`Date incompatibile pentru ${country.code}.`);
            }
        });
    }

    function selectedCountry() {
        return data.countries.find(country => country.code === selectedCode);
    }

    function renderSummary() {
        const romania = data.countries.find(country => country.code === "RO");
        setText("ro-points", integer.format(romania.publicPoints));
        setText("ro-fleet", integer.format(romania.bevFleetM1));
        setText("ro-power", `${decimal.format(romania.publicPowerKwPerBev)} kW`);
        setText("ro-fast-density", decimal.format(romania.fastDcPer100kResidents));
    }

    function selectCountry(code) {
        selectedCode = code;
        countrySelect.value = code;
        renderMatrixSelection();
        renderCountry();
    }

    function renderMatrix() {
        matrix.replaceChildren();
        const width = 820;
        const height = 500;
        const left = 72;
        const right = 798;
        const top = 38;
        const bottom = 430;
        const plotWidth = right - left;
        const plotHeight = bottom - top;
        const xValues = data.countries.map(country => country.fastDcPer100kResidents);
        const yValues = data.countries.map(country => country.publicPowerKwPerBev);
        const xMaximum = Math.ceil(Math.max(...xValues) / 20) * 20;
        const yMaximum = Math.ceil(Math.max(...yValues) / 4) * 4;
        const xMedian = median(xValues);
        const yMedian = median(yValues);
        const xPosition = value => left + value / xMaximum * plotWidth;
        const yPosition = value => bottom - value / yMaximum * plotHeight;

        const quadrantGroup = svgElement("g", { "aria-hidden": "true" });
        quadrantGroup.append(
            svgElement("rect", { x: left, y: top, width: xPosition(xMedian) - left, height: yPosition(yMedian) - top, fill: "#f7fafc" }),
            svgElement("rect", { x: xPosition(xMedian), y: top, width: right - xPosition(xMedian), height: yPosition(yMedian) - top, fill: "#f0faf7" }),
            svgElement("rect", { x: left, y: yPosition(yMedian), width: xPosition(xMedian) - left, height: bottom - yPosition(yMedian), fill: "#fbfcfd" }),
            svgElement("rect", { x: xPosition(xMedian), y: yPosition(yMedian), width: right - xPosition(xMedian), height: bottom - yPosition(yMedian), fill: "#f4f9fc" }),
        );
        matrix.append(quadrantGroup);

        for (let index = 0; index <= 4; index += 1) {
            const x = left + plotWidth * index / 4;
            const y = bottom - plotHeight * index / 4;
            matrix.append(
                svgElement("line", { x1: x, y1: top, x2: x, y2: bottom, class: "matrix-grid" }),
                svgElement("line", { x1: left, y1: y, x2: right, y2: y, class: "matrix-grid" }),
                svgElement("text", { x, y: bottom + 22, class: "matrix-tick", "text-anchor": "middle" }, decimal.format(xMaximum * index / 4)),
                svgElement("text", { x: left - 12, y: y + 4, class: "matrix-tick", "text-anchor": "end" }, decimal.format(yMaximum * index / 4)),
            );
        }

        matrix.append(
            svgElement("line", { x1: left, y1: bottom, x2: right, y2: bottom, class: "matrix-axis" }),
            svgElement("line", { x1: left, y1: top, x2: left, y2: bottom, class: "matrix-axis" }),
            svgElement("line", { x1: xPosition(xMedian), y1: top, x2: xPosition(xMedian), y2: bottom, class: "matrix-median" }),
            svgElement("line", { x1: left, y1: yPosition(yMedian), x2: right, y2: yPosition(yMedian), class: "matrix-median" }),
            svgElement("text", { x: (left + right) / 2, y: 484, class: "matrix-axis-title", "text-anchor": "middle" }, "Puncte DC ≥ 50 kW / 100.000 locuitori"),
            svgElement("text", { x: 17, y: (top + bottom) / 2, class: "matrix-axis-title", "text-anchor": "middle", transform: `rotate(-90 17 ${(top + bottom) / 2})` }, "Putere publică instalată / autoturism BEV M1 (kW)"),
            svgElement("text", { x: left + 10, y: top + 17, class: "matrix-quadrant" }, "CAPACITATE PESTE MEDIANĂ"),
            svgElement("text", { x: right - 10, y: top + 17, class: "matrix-quadrant", "text-anchor": "end" }, "AMBELE PESTE MEDIANĂ"),
            svgElement("text", { x: left + 10, y: bottom - 12, class: "matrix-quadrant" }, "AMBELE SUB MEDIANĂ"),
            svgElement("text", { x: right - 10, y: bottom - 12, class: "matrix-quadrant", "text-anchor": "end" }, "DENSITATE PESTE MEDIANĂ"),
        );

        data.countries.forEach(country => {
            const point = svgElement("g", {
                class: "matrix-point",
                role: "button",
                tabindex: 0,
                "data-code": country.code,
                "data-romania": country.code === "RO",
                "aria-label": `${country.name}: ${decimal.format(country.fastDcPer100kResidents)} puncte rapide la 100.000 de locuitori și ${decimal.format(country.publicPowerKwPerBev)} kW publici per BEV`,
            });
            point.append(
                svgElement("title", {}, `${country.flag} ${country.name}\nDC ≥ 50 kW / 100.000 loc.: ${decimal.format(country.fastDcPer100kResidents)}\nPutere publică / BEV: ${decimal.format(country.publicPowerKwPerBev)} kW`),
                svgElement("circle", { cx: xPosition(country.fastDcPer100kResidents), cy: yPosition(country.publicPowerKwPerBev), r: 12 }),
                svgElement("text", { x: xPosition(country.fastDcPer100kResidents), y: yPosition(country.publicPowerKwPerBev) }, country.code),
            );
            point.addEventListener("click", () => selectCountry(country.code));
            point.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectCountry(country.code);
                }
            });
            matrix.append(point);
        });
    }

    function renderMatrixSelection() {
        matrix.querySelectorAll(".matrix-point").forEach(point => {
            point.dataset.selected = String(point.dataset.code === selectedCode);
        });
    }

    function renderCountry() {
        const country = selectedCountry();
        setText("country-flag", country.flag);
        setText("country-name", country.name);
        setText("country-power", decimal.format(country.publicPowerKwPerBev));
        setText("country-fast-density", decimal.format(country.fastDcPer100kResidents));
        setText("country-ultra-density", decimal.format(country.ultraFastDcPer100kResidents));
        setText("country-total-power", `${integer.format(country.totalPublicPowerKw)} kW`);
        setText("country-points", integer.format(country.publicPoints));
        setText("country-ac", integer.format(country.acPoints));
        setText("country-dc", integer.format(country.dcPoints));
        setText("country-fleet", integer.format(country.bevFleetM1));
        setText("country-bev-per-point", decimal.format(country.bevPerPoint));
        const acShare = country.acPoints / country.publicPoints * 100;
        const dcShare = country.dcPoints / country.publicPoints * 100;
        document.getElementById("composition-ac").style.width = `${acShare}%`;
        document.getElementById("composition-dc").style.width = `${dcShare}%`;
        setText("ac-label", `AC ${decimal.format(acShare)}%`);
        setText("dc-label", `DC ${decimal.format(dcShare)}%`);
    }

    function renderTable() {
        tableBody.replaceChildren();
        [...data.countries]
            .sort((left, right) => left.name.localeCompare(right.name, "ro"))
            .forEach(country => {
                const row = document.createElement("tr");
                row.dataset.romania = String(country.code === "RO");
                [
                    `${country.flag} ${country.name}`,
                    decimal.format(country.publicPowerKwPerBev),
                    decimal.format(country.fastDcPer100kResidents),
                    decimal.format(country.ultraFastDcPer100kResidents),
                    `${integer.format(country.totalPublicPowerKw)} kW`,
                    decimal.format(country.bevPerPoint),
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
            if (!response.ok) throw new Error("Lipsesc datele EAFO sau Eurostat.");
            return response.json();
        })
        .then(payload => {
            assertData(payload);
            data = payload;
            const monthLabel = value => new Date(value + "T12:00:00Z").toLocaleDateString("ro-RO", {month: "long", year: "numeric", timeZone: "UTC"});
            const fleetLabel = data.fleetAsOf.replace(/^(\d{4})-Q([1-4])$/, "trimestrul $2 $1");
            document.querySelector(".reference-line").textContent = `Puncte publice: ${monthLabel(data.infrastructureAsOf)} · putere instalată: ${monthLabel(data.powerAsOf || data.infrastructureAsOf)} · parc BEV M1: ${fleetLabel} · populație: ${data.populationAsOf.slice(0, 4)}`;
            buildSelect();
            renderSummary();
            renderMatrix();
            renderMatrixSelection();
            renderCountry();
            renderTable();
            document.getElementById("source-link").href = data.source.methodologyUrl;
            document.getElementById("population-link").href = data.source.populationUrl;
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
