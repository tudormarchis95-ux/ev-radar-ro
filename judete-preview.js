(() => {
    "use strict";

    const app = document.getElementById("county-app");
    const errorMessage = document.getElementById("error-message");
    const svg = document.getElementById("county-map");
    const mapPanel = document.getElementById("map-panel");
    const tooltip = document.getElementById("map-tooltip");
    const legend = document.getElementById("map-legend");
    const countySelect = document.getElementById("county-select");
    const expandButton = document.getElementById("expand-map");
    const colors = ["#e7f3f9", "#cae5f1", "#95cde3", "#55afd2", "#218bc0", "#005596"];
    const formatter = new Intl.NumberFormat("ro-RO");
    const rateFormatter = new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const monthFormatter = new Intl.DateTimeFormat("ro-RO", { month: "long", year: "numeric", timeZone: "UTC" });
    const state = { period: "rolling", owner: "pf", mode: "rate", selected: "RO424" };
    let registrationData;
    let mapData;
    let countyPaths = [];
    let featureByCode;

    function assertData() {
        if (!registrationData || registrationData.schemaVersion !== 1 || !registrationData.monthly) {
            throw new Error("Setul de înmatriculări are un format invalid.");
        }
        if (!mapData || mapData.schemaVersion !== 1 || !Array.isArray(mapData.features) || mapData.features.length !== 42) {
            throw new Error("Harta județelor are un format invalid.");
        }
    }

    function parsePeriod(period) {
        const [year, month] = period.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, 1));
    }

    function formatPeriod(period) {
        const label = monthFormatter.format(parsePeriod(period));
        return label.charAt(0).toUpperCase() + label.slice(1);
    }

    function selectedMonths() {
        const months = registrationData.months.slice();
        if (state.period === "latest") return months.slice(-1);
        if (state.period === "ytd") {
            const latestYear = months[months.length - 1].slice(0, 4);
            return months.filter(month => month.startsWith(`${latestYear}-`));
        }
        return months;
    }

    function emptyOwner() {
        return { new: 0, used: 0 };
    }

    function aggregateCounty(code) {
        const result = { pf: emptyOwner(), company: emptyOwner(), foreign: emptyOwner() };
        selectedMonths().forEach(month => {
            const county = registrationData.monthly[month].counties[code] || {};
            Object.keys(result).forEach(owner => {
                result[owner].new += Number(county[owner]?.new || 0);
                result[owner].used += Number(county[owner]?.used || 0);
            });
        });
        return result;
    }

    function displayedValues(code) {
        const aggregate = aggregateCounty(code);
        let values;
        if (state.owner === "total") {
            values = Object.values(aggregate).reduce((sum, owner) => ({
                new: sum.new + owner.new,
                used: sum.used + owner.used,
            }), emptyOwner());
        } else {
            values = aggregate[state.owner];
        }
        const total = values.new + values.used;
        const population = Number(mapData.population[code] || 0);
        return {
            ...values,
            total,
            population,
            rate: population ? total / population * 100000 : 0,
            foreign: aggregate.foreign.new + aggregate.foreign.used,
        };
    }

    function metric(code) {
        const values = displayedValues(code);
        return state.mode === "rate" ? values.rate : values.total;
    }

    function nameFor(code) {
        const name = featureByCode.get(code)?.properties.NAME_LATN || code;
        return name.replaceAll("ş", "ș").replaceAll("Ş", "Ș").replaceAll("ţ", "ț").replaceAll("Ţ", "Ț");
    }

    function ownerLabel() {
        if (state.owner === "pf") return "ale persoanelor fizice";
        if (state.owner === "company") return "ale companiilor";
        return "totale";
    }

    function geometryRings(geometry) {
        if (geometry.type === "Polygon") return geometry.coordinates;
        if (geometry.type === "MultiPolygon") return geometry.coordinates.flat();
        return [];
    }

    function allPoints(features) {
        return features.flatMap(feature => geometryRings(feature.geometry).flat());
    }

    function createProjector(features) {
        const points = allPoints(features);
        const minLat = Math.min(...points.map(point => point[1]));
        const maxLat = Math.max(...points.map(point => point[1]));
        const cosine = Math.cos((minLat + maxLat) / 2 * Math.PI / 180);
        const projected = points.map(point => [point[0] * cosine, -point[1]]);
        const minX = Math.min(...projected.map(point => point[0]));
        const maxX = Math.max(...projected.map(point => point[0]));
        const minY = Math.min(...projected.map(point => point[1]));
        const maxY = Math.max(...projected.map(point => point[1]));
        const padding = 48;
        const width = 820;
        const height = 560;
        const scale = Math.min((width - padding * 2) / (maxX - minX), (height - padding * 2) / (maxY - minY));
        const offsetX = (width - (maxX - minX) * scale) / 2;
        const offsetY = (height - (maxY - minY) * scale) / 2;
        return point => [
            offsetX + (point[0] * cosine - minX) * scale,
            offsetY + (-point[1] - minY) * scale,
        ];
    }

    function pathFor(feature, project) {
        return geometryRings(feature.geometry).map(ring => ring.map((point, index) => {
            const [x, y] = project(point);
            return `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
        }).join("") + "Z").join("");
    }

    function buildMap() {
        const project = createProjector(mapData.features);
        featureByCode = new Map(mapData.features.map(feature => [feature.properties.NUTS_ID, feature]));
        const fragment = document.createDocumentFragment();
        countyPaths = mapData.features.map(feature => {
            const code = feature.properties.NUTS_ID;
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathFor(feature, project));
            path.setAttribute("class", "county");
            path.setAttribute("fill-rule", "evenodd");
            path.setAttribute("tabindex", "0");
            path.setAttribute("role", "button");
            path.dataset.code = code;
            path.addEventListener("pointermove", event => showTooltip(event, code));
            path.addEventListener("pointerleave", hideTooltip);
            path.addEventListener("click", () => selectCounty(code));
            path.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectCounty(code);
                }
            });
            fragment.append(path);
            return path;
        });
        svg.replaceChildren(fragment);

        [...featureByCode.entries()]
            .sort((left, right) => left[1].properties.NAME_LATN.localeCompare(right[1].properties.NAME_LATN, "ro"))
            .forEach(([code, feature]) => {
                const option = document.createElement("option");
                option.value = code;
                option.textContent = nameFor(code);
                countySelect.append(option);
            });
        if (!featureByCode.has(state.selected)) state.selected = mapData.features[0].properties.NUTS_ID;
        countySelect.value = state.selected;
    }

    function colorFor(value, maximum) {
        const index = Math.min(colors.length - 1, Math.floor(value / Math.max(maximum, 1) * colors.length));
        return colors[index];
    }

    function updateLegend(maximum) {
        legend.replaceChildren();
        const low = document.createElement("span");
        low.textContent = "Mai puține";
        legend.append(low);
        colors.forEach(color => {
            const swatch = document.createElement("span");
            swatch.className = "legend-swatch";
            swatch.style.backgroundColor = color;
            legend.append(swatch);
        });
        const high = document.createElement("span");
        const maxLabel = state.mode === "rate" ? rateFormatter.format(maximum) : formatter.format(maximum);
        high.textContent = `Mai multe · max. ${maxLabel}`;
        legend.append(high);
    }

    function updatePeriod() {
        const months = selectedMonths();
        const text = months.length === 1
            ? formatPeriod(months[0])
            : `${formatPeriod(months[0])} – ${formatPeriod(months[months.length - 1])}`;
        document.getElementById("period-label").textContent = `Județul înmatriculării · ${text}`;
        const unallocated = months.reduce((sum, month) => sum + Number(registrationData.monthly[month].unallocated || 0), 0);
        const notice = document.getElementById("data-notice");
        notice.hidden = unallocated === 0;
        notice.textContent = unallocated === 1
            ? "Un vehicul apare în totalul național, dar nu are județ atribuit în lista detaliată DGPCI; nu este plasat artificial pe hartă."
            : `${formatter.format(unallocated)} vehicule apar în totalul național, dar nu au județ atribuit în listele detaliate DGPCI; nu sunt plasate artificial pe hartă.`;
    }

    function updatePanel() {
        const values = displayedValues(state.selected);
        document.getElementById("primary-value").textContent = state.mode === "rate"
            ? rateFormatter.format(values.rate)
            : formatter.format(values.total);
        document.getElementById("primary-unit").textContent = state.mode === "rate"
            ? `înmatriculări ${ownerLabel()} / 100.000 locuitori`
            : `înmatriculări ${ownerLabel()}`;
        document.getElementById("new-value").textContent = formatter.format(values.new);
        document.getElementById("used-value").textContent = formatter.format(values.used);
        document.getElementById("total-value").textContent = formatter.format(values.total);
        document.getElementById("population-value").textContent = formatter.format(values.population);
        document.getElementById("foreign-value").textContent = formatter.format(values.foreign);
        document.getElementById("foreign-row").hidden = state.owner !== "total" || values.foreign === 0;
        document.getElementById("context-note").textContent = state.owner === "pf"
            ? "Filtrul pentru persoane fizice reduce influența flotelor de leasing, dar harta indică județul înmatriculării, nu domiciliul sigur al utilizatorului."
            : state.owner === "company"
                ? "Înmatriculările companiilor pot reflecta sediul juridic al firmelor și operatorilor de leasing, nu locul în care sunt utilizate vehiculele."
                : "Totalul include persoane fizice, companii și categoria distinctă «persoană străină». Sediile firmelor de leasing pot influența puternic distribuția.";
        countySelect.value = state.selected;
    }

    function render() {
        const values = mapData.features.map(feature => metric(feature.properties.NUTS_ID));
        const maximum = Math.max(1, ...values);
        countyPaths.forEach(path => {
            const code = path.dataset.code;
            path.setAttribute("fill", colorFor(metric(code), maximum));
            path.dataset.selected = String(code === state.selected);
            const value = metric(code);
            const metricLabel = state.mode === "rate" ? `${rateFormatter.format(value)} la 100.000 locuitori` : `${formatter.format(value)} vehicule`;
            path.setAttribute("aria-label", `${nameFor(code)}: ${metricLabel}`);
        });
        updateLegend(maximum);
        updatePeriod();
        updatePanel();
    }

    function selectCounty(code) {
        state.selected = code;
        hideTooltip();
        render();
    }

    function showTooltip(event, code) {
        const values = displayedValues(code);
        const metricValue = state.mode === "rate" ? `${rateFormatter.format(values.rate)} / 100.000 loc.` : `${formatter.format(values.total)} vehicule`;
        tooltip.replaceChildren();
        const title = document.createElement("strong");
        title.textContent = nameFor(code);
        const detail = document.createElement("span");
        detail.textContent = `${metricValue} · ${formatter.format(values.new)} noi · ${formatter.format(values.used)} rulate`;
        tooltip.append(title, document.createElement("br"), detail);
        const panel = mapPanel.getBoundingClientRect();
        tooltip.style.left = `${Math.max(110, Math.min(panel.width - 110, event.clientX - panel.left))}px`;
        tooltip.style.top = `${Math.max(80, event.clientY - panel.top)}px`;
        tooltip.dataset.show = "true";
    }

    function hideTooltip() {
        tooltip.dataset.show = "false";
    }

    function bindControls() {
        document.querySelectorAll("button[data-control]").forEach(button => {
            button.addEventListener("click", () => {
                const control = button.dataset.control;
                state[control] = button.dataset.value;
                document.querySelectorAll(`button[data-control="${control}"]`).forEach(peer => {
                    peer.setAttribute("aria-pressed", String(peer === button));
                });
                render();
            });
        });
        countySelect.addEventListener("change", () => selectCounty(countySelect.value));
        expandButton.addEventListener("click", () => {
            const expanded = mapPanel.classList.toggle("is-expanded");
            expandButton.setAttribute("aria-pressed", String(expanded));
            expandButton.textContent = expanded ? "Închide harta" : "Extinde harta";
            document.body.style.overflow = expanded ? "hidden" : "";
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && mapPanel.classList.contains("is-expanded")) expandButton.click();
        });
    }

    Promise.all([
        fetch("rapoarte/county_registrations.json", { cache: "no-store" }).then(response => {
            if (!response.ok) throw new Error("Lipsesc datele DGPCI.");
            return response.json();
        }),
        fetch("rapoarte/county_map.json", { cache: "no-store" }).then(response => {
            if (!response.ok) throw new Error("Lipsește harta județelor.");
            return response.json();
        }),
    ]).then(([registrations, map]) => {
        registrationData = registrations;
        mapData = map;
        assertData();
        buildMap();
        bindControls();
        const generated = new Date(registrationData.generatedAt);
        document.getElementById("generated-at").textContent = Number.isNaN(generated.getTime())
            ? registrationData.generatedAt
            : generated.toLocaleString("ro-RO", { dateStyle: "long", timeStyle: "short" });
        render();
    }).catch(error => {
        app.hidden = true;
        errorMessage.hidden = false;
        errorMessage.textContent = `Datele nu au putut fi încărcate: ${error.message}`;
    });
})();
