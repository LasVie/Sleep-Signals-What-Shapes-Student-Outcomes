document.addEventListener("DOMContentLoaded", async () => {
  const { loadBenchmarkData } = window.SleepSignalsData;
  const { REGION_COLORS, renderBenchmarkScatter, escapeHtml } = window.SleepSignalsCharts;

  const METRICS = [
    { key: "insomnia_pct", label: "Insomnia prevalence (%)", summary: "Average sleep hours vs insomnia prevalence" },
    { key: "pct_sleep_affects_academics", label: "Students saying sleep affects academics (%)", summary: "Average sleep hours vs reported academic impact" },
    { key: "academic_pressure_score", label: "Academic pressure score (1-5)", summary: "Average sleep hours vs academic pressure score" },
  ];

  const statsElement = document.getElementById("contextStats");
  const regionSelect = document.getElementById("contextRegion");
  const metricSelect = document.getElementById("contextMetric");
  const chartTitleElement = document.getElementById("contextChartTitle");
  const chartCopyElement = document.getElementById("contextChartCopy");
  const legendElement = document.getElementById("contextLegend");
  const chartElement = document.getElementById("contextChart");
  const detailElement = document.getElementById("contextDetail");
  const rankingTitleElement = document.getElementById("contextRankingTitle");
  const rankingElement = document.getElementById("contextRanking");
  const insightElement = document.getElementById("contextInsight");

  const state = {
    rows: [],
    region: "All",
    metricKey: "insomnia_pct",
    selectedCountry: "Bangladesh",
  };

  function buildLegend() {
    legendElement.innerHTML = Object.entries(REGION_COLORS)
      .map(([region, color]) => {
        return `<span class="legend-item"><span class="legend-swatch" style="background:${color}"></span>${escapeHtml(region)}</span>`;
      })
      .join("");
  }

  function renderRanking(rows, metric) {
    const sorted = [...rows].sort((left, right) => d3.descending(left[metric.key], right[metric.key])).slice(0, 5);
    const maxValue = d3.max(sorted, (row) => row[metric.key]) || 1;
    rankingTitleElement.textContent = `Highest ${metric.label.toLowerCase()}`;
    rankingElement.innerHTML = sorted
      .map((row) => {
        const width = (row[metric.key] / maxValue) * 100;
        const value =
          metric.key === "academic_pressure_score" ? `${row[metric.key].toFixed(1)} / 5` : `${row[metric.key]}%`;
        const selectedClass = row.country === state.selectedCountry ? " selected" : "";
        return `
          <button class="bar-button${selectedClass}" type="button" data-country="${escapeHtml(row.country)}">
            <div class="bar-row">
              <div class="bar-topline">
                <span>${escapeHtml(row.country)}</span>
                <span>${value}</span>
              </div>
              <div class="bar-track">
                <span class="bar-fill" style="width:${width}%; background:linear-gradient(90deg, ${REGION_COLORS[row.region] || "#4c7a9f"}, #132431);"></span>
              </div>
            </div>
          </button>
        `;
      })
      .join("");

    rankingElement.querySelectorAll("[data-country]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedCountry = button.dataset.country;
        renderContext();
      });
    });
  }

  function renderContext() {
    const metric = METRICS.find((item) => item.key === state.metricKey);
    const rows = state.region === "All" ? state.rows : state.rows.filter((row) => row.region === state.region);
    if (!rows.length) {
      chartElement.innerHTML = `<div class="error-state">No benchmark records available for this region.</div>`;
      detailElement.innerHTML = `<div class="error-state">No selected country available.</div>`;
      rankingElement.innerHTML = `<div class="error-state">No ranking available.</div>`;
      insightElement.innerHTML = `<div class="error-state">No benchmark insight available.</div>`;
      return;
    }

    if (!rows.some((row) => row.country === state.selectedCountry)) {
      state.selectedCountry = rows.find((row) => row.is_primary)?.country || rows[0].country;
    }

    const selected = rows.find((row) => row.country === state.selectedCountry) || rows[0];
    const localReference = state.rows.find((row) => row.is_primary) || selected;
    const regionRows = rows.filter((row) => row.region === selected.region);
    const regionAverage = d3.mean(regionRows, (row) => row[state.metricKey]) || 0;
    const delta = selected[state.metricKey] - regionAverage;
    const direction = delta >= 0 ? "above" : "below";
    const localDelta = selected[state.metricKey] - localReference[state.metricKey];
    const localDirection = localDelta >= 0 ? "higher" : "lower";

    chartTitleElement.textContent = metric.summary;
    chartCopyElement.textContent = `The selected country is ${selected.country}. Compare how its average sleep hours and ${metric.label.toLowerCase()} sit against the other visible benchmark records.`;

    renderBenchmarkScatter(chartElement, {
      rows,
      yKey: metric.key,
      yLabel: metric.label,
      selectedCountry: state.selectedCountry,
      onSelect: (country) => {
        state.selectedCountry = country;
        renderContext();
      },
    });

    detailElement.innerHTML = `
      <span class="section-kicker">Selected country</span>
      <h3>${escapeHtml(selected.country)}</h3>
      <p>${escapeHtml(selected.source)}</p>
      <div class="pill-row">
        <span class="meta-pill">${escapeHtml(selected.region)}</span>
        <span class="meta-pill">${selected.year}</span>
        <span class="meta-pill">n = ${selected.n_students.toLocaleString()}</span>
        ${selected.is_primary ? '<span class="scope-chip primary">primary dataset</span>' : ""}
      </div>
      <p class="small-copy"><strong>Average sleep:</strong> ${selected.avg_sleep_hrs} hours</p>
      <p class="small-copy"><strong>Insomnia prevalence:</strong> ${selected.insomnia_pct}%</p>
      <p class="small-copy"><strong>Sleep affects academics:</strong> ${selected.pct_sleep_affects_academics}%</p>
      <p class="small-copy"><strong>Academic pressure:</strong> ${selected.academic_pressure} (${selected.academic_pressure_score}/5)</p>
      <p class="small-copy">
        <strong>Compared with ${escapeHtml(localReference.country)}:</strong>
        ${Math.abs(localDelta).toFixed(1)}
        ${metric.key === "academic_pressure_score" ? " points" : " percentage points"}
        ${localDirection} on ${escapeHtml(metric.label.toLowerCase())}.
      </p>
    `;

    renderRanking(rows, metric);

    insightElement.innerHTML = `
      <span class="section-kicker">Interpretation</span>
      <h3>${escapeHtml(selected.country)} vs ${escapeHtml(selected.region)}</h3>
      <p>
        For <strong>${escapeHtml(metric.label.toLowerCase())}</strong>, ${escapeHtml(selected.country)} sits
        ${Math.abs(delta).toFixed(1)} ${metric.key === "academic_pressure_score" ? "points" : "percentage points"}
        ${direction} the visible ${selected.region} average.
      </p>
      <p class="small-copy">
        Against the primary local sample in <strong>${escapeHtml(localReference.country)}</strong>, ${escapeHtml(selected.country)} is
        ${Math.abs(localDelta).toFixed(1)} ${metric.key === "academic_pressure_score" ? "points" : "percentage points"}
        ${localDirection} on this metric.
      </p>
      <p class="small-copy">
        This does not mean the datasets are perfectly harmonized. It does mean the project can now place the local survey inside a wider comparative frame instead of relying on one sample alone.
      </p>
    `;
  }

  regionSelect.addEventListener("change", (event) => {
    state.region = event.target.value;
    renderContext();
  });

  metricSelect.addEventListener("change", (event) => {
    state.metricKey = event.target.value;
    renderContext();
  });

  window.addEventListener("resize", () => {
    if (state.rows.length) renderContext();
  });

  try {
    state.rows = await loadBenchmarkData();
    const regions = ["All", ...new Set(state.rows.map((row) => row.region)).values()].sort((left, right) => {
      if (left === "All") return -1;
      if (right === "All") return 1;
      return left.localeCompare(right);
    });
    regions.forEach((region) => {
      const option = document.createElement("option");
      option.value = region;
      option.textContent = region === "All" ? "All regions" : region;
      regionSelect.appendChild(option);
    });

    METRICS.forEach((metric) => {
      const option = document.createElement("option");
      option.value = metric.key;
      option.textContent = metric.label;
      metricSelect.appendChild(option);
    });
    metricSelect.value = state.metricKey;

    statsElement.innerHTML = `
      <span class="section-kicker">Benchmark snapshot</span>
      <h2>Multiple datasets, one comparative lens.</h2>
      <p>
        The benchmark layer currently covers ${state.rows.length} country-level records across
        ${new Set(state.rows.map((row) => row.region)).size} regions, with the local survey preserved as the primary reference point.
      </p>
      <div class="stat-grid">
        <article class="stat-card">
          <div class="stat-label">Countries</div>
          <div class="stat-value">${state.rows.length}</div>
          <div class="stat-copy">Benchmark records currently bundled into the site.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Regions</div>
          <div class="stat-value">${new Set(state.rows.map((row) => row.region)).size}</div>
          <div class="stat-copy">Asia, Europe, Africa, North America, Latin America, and Oceania.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Primary benchmark</div>
          <div class="stat-value compact">Bangladesh</div>
          <div class="stat-copy">The local survey is still the main story source and remains highlighted.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Interactivity</div>
          <div class="stat-value">Click + hover</div>
          <div class="stat-copy">Hover any country for values and click to pin the comparison detail card.</div>
        </article>
      </div>
    `;

    buildLegend();
    renderContext();
  } catch (error) {
    const message = `<div class="error-state">${escapeHtml(error.message)}</div>`;
    statsElement.innerHTML = message;
    chartElement.innerHTML = message;
    detailElement.innerHTML = message;
    rankingElement.innerHTML = message;
    insightElement.innerHTML = message;
  }
});
