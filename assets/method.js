document.addEventListener("DOMContentLoaded", async () => {
  const {
    FACTORS,
    OUTCOMES,
    loadSurveyData,
    profileCounts,
    computeHeadlineStats,
  } = window.SleepSignalsData;
  const { renderBarList } = window.SleepSignalsCharts;

  const methodStatsElement = document.getElementById("methodStats");
  const yearProfileElement = document.getElementById("yearProfile");
  const genderProfileElement = document.getElementById("genderProfile");
  const performanceProfileElement = document.getElementById("performanceProfile");
  const deadlineProfileElement = document.getElementById("deadlineProfile");
  const glossaryElement = document.getElementById("glossaryGrid");

  try {
    const rows = await loadSurveyData();
    const stats = computeHeadlineStats(rows);
    const profiles = profileCounts(rows);

    methodStatsElement.innerHTML = `
      <span class="section-kicker">Dataset snapshot</span>
      <h2>What this sample can support, and what it cannot.</h2>
      <p>
        The dataset is useful for comparing ordinal patterns across habits, sleep signals, and outcomes. It is not balanced enough for strong causal claims.
      </p>
      <div class="stat-grid">
        ${stats
          .map((item) => {
            return `
              <article class="stat-card">
                <div class="stat-label">${item.label}</div>
                <div class="stat-value">${item.value}</div>
                <div class="stat-copy">${item.copy}</div>
              </article>
            `;
          })
          .join("")}
      </div>
      <p class="hero-note">
        Year-of-study and gender distributions are both skewed. Those imbalances are part of the reason the site keeps its tone descriptive rather than predictive.
      </p>
    `;

    renderBarList(yearProfileElement, profiles.year, "#4c7a9f", "#2b7a78");
    renderBarList(genderProfileElement, profiles.gender, "#4c7a9f", "#2b7a78");
    renderBarList(performanceProfileElement, profiles.performance, "#8bb7b0", "#b85a3d");
    renderBarList(deadlineProfileElement, profiles.deadlines, "#8bb7b0", "#b85a3d");

    const glossaryItems = [
      ...FACTORS.map((factor) => ({
        name: factor.label,
        type: factor.scope === "primary" ? "Primary factor" : "Context factor",
        prompt: factor.question,
        scale: `${factor.order[0]} → ${factor.order[factor.order.length - 1]}`,
      })),
      ...OUTCOMES.map((outcome) => ({
        name: outcome.label,
        type: "Outcome",
        prompt: outcome.question,
        scale: `${outcome.order[0]} → ${outcome.order[outcome.order.length - 1]}`,
      })),
    ];

    glossaryElement.innerHTML = glossaryItems
      .map((item) => {
        return `
          <article class="glossary-card">
            <div class="chip-row">
              <span class="chip">${item.type}</span>
            </div>
            <h3>${item.name}</h3>
            <p>${item.prompt}</p>
            <p class="small-copy"><strong>Ordered scale:</strong> ${item.scale}</p>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    const message = `<div class="error-state">${window.SleepSignalsCharts.escapeHtml(error.message)}</div>`;
    methodStatsElement.innerHTML = message;
    yearProfileElement.innerHTML = message;
    genderProfileElement.innerHTML = message;
    performanceProfileElement.innerHTML = message;
    deadlineProfileElement.innerHTML = message;
    glossaryElement.innerHTML = message;
  }
});
