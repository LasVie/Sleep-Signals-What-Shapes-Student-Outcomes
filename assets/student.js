document.addEventListener("DOMContentLoaded", async () => {
  const {
    OUTCOMES,
    YEAR_ORDER,
    GENDER_ORDER,
    COLUMNS,
    PRIMARY_FACTOR_KEYS,
    loadSurveyData,
    getOptions,
    filterRows,
    computeRanking,
    computeMatrix,
    getOutcome,
    summarizeShift,
    percentageString,
    associationStrength,
  } = window.SleepSignalsData;
  const { renderLegend, renderStackedOutcomeChart } = window.SleepSignalsCharts;

  const outcomeSelect = document.getElementById("studentOutcome");
  const yearSelect = document.getElementById("studentYear");
  const genderSelect = document.getElementById("studentGender");
  const sampleElement = document.getElementById("studentSample");
  const outcomeDefElement = document.getElementById("studentOutcomeDef");
  const cardsElement = document.getElementById("studentCards");
  const chartTitleElement = document.getElementById("studentChartTitle");
  const chartCopyElement = document.getElementById("studentChartCopy");
  const chartElement = document.getElementById("studentChart");
  const legendElement = document.getElementById("studentLegend");
  const summaryElement = document.getElementById("studentSummary");

  const state = {
    rows: [],
    outcomeKey: "perf",
    year: "All",
    gender: "All",
    factorKey: null,
  };

  OUTCOMES.forEach((outcome) => {
    const option = document.createElement("option");
    option.value = outcome.key;
    option.textContent = outcome.label;
    outcomeSelect.appendChild(option);
  });
  outcomeSelect.value = state.outcomeKey;

  function renderStudent() {
    const filtered = filterRows(state.rows, {
      year: state.year,
      gender: state.gender,
    });
    const ranking = computeRanking(filtered, state.outcomeKey, PRIMARY_FACTOR_KEYS);
    const outcome = getOutcome(state.outcomeKey);

    sampleElement.textContent = `Filtered sample: ${filtered.length.toLocaleString()} responses`;
    outcomeDefElement.textContent = `Outcome: ${outcome.definition}`;

    if (!ranking.length) {
      cardsElement.innerHTML = `<div class="error-state">Not enough data for this selection.</div>`;
      chartElement.innerHTML = `<div class="error-state">Not enough data for this selection.</div>`;
      summaryElement.innerHTML = `<div class="error-state">Try a broader filter.</div>`;
      return;
    }

    if (!state.factorKey || !ranking.some((item) => item.factorKey === state.factorKey)) {
      state.factorKey = ranking[0].factorKey;
    }

    cardsElement.innerHTML = ranking
      .map((item, index) => {
        const factor = item.factor;
        const width = Math.min((item.abs / 0.5) * 100, 100);
        const selectedClass = item.factorKey === state.factorKey ? " selected" : "";
        return `
          <article class="insight-card${selectedClass}">
            <button class="insight-button" data-factor="${factor.key}">
              <div class="insight-topline">
                <span class="chip">Rank #${index + 1}</span>
                <span class="scope-chip ${factor.scope}">${factor.scope}</span>
              </div>
              <h3 class="insight-title">${factor.label}</h3>
              <p>${factor.summary}</p>
              <div class="pill-row">
                <span class="meta-pill">${associationStrength(item.abs)} association</span>
                <span class="meta-pill">ρ = ${item.rho.toFixed(3)}<span class="rho-info" data-tip="Rank correlation (−1 to +1). Positive = worse factor aligns with worse outcome.">?</span></span>
              </div>
              <div class="impact-meter">
                <div class="impact-bar"><span class="impact-fill" style="width:${width}%"></span></div>
              </div>
            </button>
          </article>
        `;
      })
      .join("");

    cardsElement.querySelectorAll("[data-factor]").forEach((button) => {
      button.addEventListener("click", () => {
        state.factorKey = button.dataset.factor;
        renderStudent();
      });
    });

    const selected = ranking.find((item) => item.factorKey === state.factorKey) || ranking[0];
    const matrix = computeMatrix(filtered, state.factorKey, state.outcomeKey);
    const shift = summarizeShift(filtered, state.factorKey, state.outcomeKey);
    renderLegend(legendElement, outcome.order);
    renderStackedOutcomeChart(chartElement, {
      matrix,
      factor: selected.factor,
      outcome,
    });

    chartTitleElement.textContent = `${selected.factor.label} vs ${outcome.label}`;
    chartCopyElement.textContent = `${selected.factor.question} The rows below show how the ${outcome.label.toLowerCase()} split changes across the ordered response levels.`;

    const strongest = shift.strongest;
    const weakest = shift.weakest;
    const delta = Math.max(0, Math.round(shift.delta * 100));
    summaryElement.innerHTML = `
      <span class="section-kicker">Selected factor</span>
      <h3>${selected.factor.label}</h3>
      <p>${selected.factor.summary}</p>
      <div class="pill-row">
        <span class="scope-chip ${selected.factor.scope}">${selected.factor.scope}</span>
        <span class="meta-pill">ρ = ${selected.rho.toFixed(3)}<span class="rho-info" data-tip="Rank correlation (−1 to +1). Positive = worse factor aligns with worse outcome.">?</span></span>
        <span class="meta-pill">N = ${selected.n.toLocaleString()}</span>
      </div>
      <p class="small-copy">
        The heaviest concentration of worse outcomes appears at <strong>${strongest.factorLevel}</strong>,
        where ${percentageString(strongest.worseShare, 0)} fall into
        ${shift.worseOutcomeLabels.join(" or ")}.
      </p>
      <p class="small-copy">
        At <strong>${weakest.factorLevel}</strong>, that combined worse-outcome share drops to
        ${percentageString(weakest.worseShare, 0)}. That is a ${delta}-point spread inside the filtered sample.
      </p>
      <p class="small-copy">
        Read this as an association pattern, not a promise that changing one behavior will automatically change academic results.
      </p>
    `;
  }

  outcomeSelect.addEventListener("change", (event) => {
    state.outcomeKey = event.target.value;
    renderStudent();
  });

  yearSelect.addEventListener("change", (event) => {
    state.year = event.target.value;
    renderStudent();
  });

  genderSelect.addEventListener("change", (event) => {
    state.gender = event.target.value;
    renderStudent();
  });

  window.addEventListener("resize", () => {
    if (state.rows.length) renderStudent();
  });

  try {
    state.rows = await loadSurveyData();
    const yearOptions = ["All", ...getOptions(state.rows, COLUMNS.year, YEAR_ORDER)];
    yearOptions.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year === "All" ? "All years" : year;
      yearSelect.appendChild(option);
    });

    ["All", ...getOptions(state.rows, COLUMNS.gender, GENDER_ORDER)].forEach((gender) => {
      const option = document.createElement("option");
      option.value = gender;
      option.textContent = gender === "All" ? "All genders" : gender;
      genderSelect.appendChild(option);
    });
    renderStudent();
  } catch (error) {
    const message = `<div class="error-state">${window.SleepSignalsCharts.escapeHtml(error.message)}</div>`;
    cardsElement.innerHTML = message;
    chartElement.innerHTML = message;
    summaryElement.innerHTML = message;
    sampleElement.textContent = "Filtered sample: unavailable";
    outcomeDefElement.textContent = "Outcome: unavailable";
  }
});
