document.addEventListener("DOMContentLoaded", async () => {
  const {
    OUTCOMES,
    YEAR_ORDER,
    GENDER_ORDER,
    COLUMNS,
    SCOPED_FACTOR_KEYS,
    loadSurveyData,
    getOptions,
    filterRows,
    computeRanking,
    computeMatrix,
    getOutcome,
    summarizeShift,
    percentageString,
  } = window.SleepSignalsData;
  const { renderLegend, renderHeatmap } = window.SleepSignalsCharts;

  const outcomeSelect = document.getElementById("educatorOutcome");
  const yearSelect = document.getElementById("educatorYear");
  const genderSelect = document.getElementById("educatorGender");
  const sampleElement = document.getElementById("educatorSample");
  const rhoElement = document.getElementById("educatorRho");
  const rankingElement = document.getElementById("rankingList");
  const chartTitleElement = document.getElementById("educatorChartTitle");
  const chartCopyElement = document.getElementById("educatorChartCopy");
  const chartElement = document.getElementById("educatorChart");
  const legendElement = document.getElementById("educatorLegend");
  const patternElement = document.getElementById("educatorPattern");

  const state = {
    rows: [],
    outcomeKey: "dead",
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

  function renderEducator() {
    const filtered = filterRows(state.rows, {
      year: state.year,
      gender: state.gender,
    });
    const ranking = computeRanking(filtered, state.outcomeKey, SCOPED_FACTOR_KEYS);
    const outcome = getOutcome(state.outcomeKey);

    sampleElement.textContent = `Filtered sample: ${filtered.length.toLocaleString()} responses`;

    if (!ranking.length) {
      const message = `<div class="error-state">Not enough data for this selection.</div>`;
      rankingElement.innerHTML = message;
      chartElement.innerHTML = message;
      patternElement.innerHTML = message;
      rhoElement.textContent = "Selected factor: unavailable";
      return;
    }

    if (!state.factorKey || !ranking.some((item) => item.factorKey === state.factorKey)) {
      state.factorKey = ranking[0].factorKey;
    }

    rankingElement.innerHTML = ranking
      .map((item, index) => {
        const selectedClass = item.factor.key === state.factorKey ? " selected" : "";
        return `
          <article class="rank-card${selectedClass}">
            <button class="rank-button" data-factor="${item.factor.key}">
              <div class="rank-topline">
                <span class="chip">Rank #${index + 1}</span>
                <span class="scope-chip ${item.factor.scope}">${item.factor.scope}</span>
              </div>
              <h3 class="rank-title">${item.factor.label}</h3>
              <p>${item.factor.summary}</p>
              <div class="pill-row">
                <span class="meta-pill">ρ = ${item.rho.toFixed(3)}</span>
                <span class="meta-pill">N = ${item.n.toLocaleString()}</span>
              </div>
            </button>
          </article>
        `;
      })
      .join("");

    rankingElement.querySelectorAll("[data-factor]").forEach((button) => {
      button.addEventListener("click", () => {
        state.factorKey = button.dataset.factor;
        renderEducator();
      });
    });

    const selected = ranking.find((item) => item.factor.key === state.factorKey) || ranking[0];
    const matrix = computeMatrix(filtered, state.factorKey, state.outcomeKey);
    const shift = summarizeShift(filtered, state.factorKey, state.outcomeKey);

    renderLegend(legendElement, outcome.order);
    renderHeatmap(chartElement, {
      matrix,
      factor: selected.factor,
      outcome,
    });

    chartTitleElement.textContent = `${selected.factor.label} × ${outcome.label}`;
    chartCopyElement.textContent = `${selected.factor.question} The heatmap uses row-normalized percentages so each factor level keeps its own outcome distribution visible.`;
    rhoElement.textContent = `Selected factor: ${selected.factor.label} (ρ = ${selected.rho.toFixed(3)})`;

    patternElement.innerHTML = `
      <span class="section-kicker">Pattern summary</span>
      <h3>${selected.factor.label}</h3>
      <p>
        Within this filtered sample, the highest concentration of worse outcomes appears at
        <strong>${shift.strongest.factorLevel}</strong>, where
        ${percentageString(shift.strongest.worseShare, 0)} fall into
        ${shift.worseOutcomeLabels.join(" or ")}.
      </p>
      <p class="small-copy">
        The lightest concentration of those worse outcomes appears at <strong>${shift.weakest.factorLevel}</strong>,
        at ${percentageString(shift.weakest.worseShare, 0)}. That spread makes the relationship visible even before the exact ρ value is read.
      </p>
      <p class="small-copy">
        Use this page to support explanation and prioritization, not to imply that the selected factor is the sole driver of the outcome.
      </p>
    `;
  }

  outcomeSelect.addEventListener("change", (event) => {
    state.outcomeKey = event.target.value;
    renderEducator();
  });

  yearSelect.addEventListener("change", (event) => {
    state.year = event.target.value;
    renderEducator();
  });

  genderSelect.addEventListener("change", (event) => {
    state.gender = event.target.value;
    renderEducator();
  });

  window.addEventListener("resize", () => {
    if (state.rows.length) renderEducator();
  });

  try {
    state.rows = await loadSurveyData();

    ["All", ...getOptions(state.rows, COLUMNS.year, YEAR_ORDER)].forEach((year) => {
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

    renderEducator();
  } catch (error) {
    const message = `<div class="error-state">${window.SleepSignalsCharts.escapeHtml(error.message)}</div>`;
    rankingElement.innerHTML = message;
    chartElement.innerHTML = message;
    patternElement.innerHTML = message;
    sampleElement.textContent = "Filtered sample: unavailable";
    rhoElement.textContent = "Selected factor: unavailable";
  }
});
