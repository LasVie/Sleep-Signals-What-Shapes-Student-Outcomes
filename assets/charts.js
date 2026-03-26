(function () {
  const OUTCOME_COLORS_5 = ["#2b7a78", "#8bb7b0", "#d8d2c6", "#d99664", "#b85a3d"];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[character];
    });
  }

  function getTooltip() {
    let tooltip = document.getElementById("chartTooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "chartTooltip";
      tooltip.className = "tooltip";
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  function showTooltip(event, html) {
    const tooltip = getTooltip();
    tooltip.innerHTML = html;
    tooltip.classList.add("show");
    const offset = 16;
    const box = tooltip.getBoundingClientRect();
    let left = event.clientX + offset;
    let top = event.clientY + offset;
    if (left + box.width + 16 > window.innerWidth) left = event.clientX - box.width - offset;
    if (top + box.height + 16 > window.innerHeight) top = event.clientY - box.height - offset;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function hideTooltip() {
    const tooltip = getTooltip();
    tooltip.classList.remove("show");
  }

  function outcomeColors(length) {
    if (length <= OUTCOME_COLORS_5.length) return OUTCOME_COLORS_5.slice(0, length);
    return d3.quantize(d3.interpolateRgbBasis(OUTCOME_COLORS_5), length);
  }

  function renderLegend(element, labels) {
    const colors = outcomeColors(labels.length);
    element.innerHTML = labels
      .map((label, index) => {
        return `<span class="legend-item"><span class="legend-swatch" style="background:${colors[index]}"></span>${escapeHtml(label)}</span>`;
      })
      .join("");
  }

  function renderStackedOutcomeChart(element, options) {
    const { matrix, factor, outcome } = options;
    element.innerHTML = "";
    if (!matrix.length) {
      element.innerHTML = `<div class="loading-state">No data available for this filter selection.</div>`;
      return;
    }

    const width = Math.max(element.clientWidth || 720, 620);
    const height = Math.max(360, matrix.length * 74 + 92);
    const margin = { top: 34, right: 42, bottom: 40, left: 240 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const colors = outcomeColors(outcome.order.length);

    const svg = d3
      .select(element)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", `${factor.label} versus ${outcome.label}`);

    const root = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
    const y = d3
      .scaleBand()
      .domain(matrix.map((row) => row.factorLevel))
      .range([0, innerHeight])
      .padding(0.22);

    root
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues([0, 0.25, 0.5, 0.75, 1])
          .tickFormat((value) => `${Math.round(value * 100)}%`)
      )
      .call((group) => {
        group.select(".domain").attr("stroke", "rgba(19,36,49,0.18)");
        group.selectAll("line").attr("stroke", "rgba(19,36,49,0.18)");
        group.selectAll("text").attr("fill", "#455764").attr("font-size", 11);
      });

    root
      .append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .call((group) => {
        group.select(".domain").remove();
        group
          .selectAll("text")
          .attr("fill", "#132431")
          .attr("font-size", 13)
          .attr("font-weight", 600)
          .style("text-transform", "none");
      });

    root
      .append("g")
      .selectAll("line")
      .data([0, 0.25, 0.5, 0.75, 1])
      .join("line")
      .attr("x1", (value) => x(value))
      .attr("x2", (value) => x(value))
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "rgba(19,36,49,0.08)")
      .attr("stroke-dasharray", "4,4");

    matrix.forEach((rowSummary) => {
      let currentOffset = 0;
      rowSummary.percentages.forEach((percentage, index) => {
        const segmentWidth = x(percentage);
        const segment = root
          .append("rect")
          .attr("x", x(currentOffset))
          .attr("y", y(rowSummary.factorLevel))
          .attr("width", Math.max(segmentWidth, 0))
          .attr("height", y.bandwidth())
          .attr("rx", 10)
          .attr("fill", colors[index]);

        const count = rowSummary.counts[index];
        segment
          .on("mousemove", (event) => {
            showTooltip(
              event,
              `<strong>${escapeHtml(rowSummary.factorLevel)}</strong>${escapeHtml(
                outcome.order[index]
              )}<br>${(percentage * 100).toFixed(1)}% of this row<br><span class="muted">${count.toLocaleString()} responses</span>`
            );
          })
          .on("mouseleave", hideTooltip);

        if (percentage >= 0.085) {
          root
            .append("text")
            .attr("x", x(currentOffset) + segmentWidth / 2)
            .attr("y", y(rowSummary.factorLevel) + y.bandwidth() / 2 + 4)
            .attr("text-anchor", "middle")
            .attr("fill", index >= 3 ? "#fffaf5" : "#132431")
            .attr("font-size", 11)
            .attr("font-weight", 700)
            .text(`${Math.round(percentage * 100)}%`);
        }

        currentOffset += percentage;
      });

      root
        .append("text")
        .attr("x", innerWidth + 8)
        .attr("y", y(rowSummary.factorLevel) + y.bandwidth() / 2 + 4)
        .attr("fill", "#6f7f88")
        .attr("font-size", 11)
        .text(`n=${rowSummary.total}`);
    });

    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", 20)
      .attr("fill", "#6f7f88")
      .attr("font-size", 12)
      .text("Share within each factor level");
  }

  function renderHeatmap(element, options) {
    const { matrix, factor, outcome } = options;
    element.innerHTML = "";
    if (!matrix.length) {
      element.innerHTML = `<div class="loading-state">No data available for this filter selection.</div>`;
      return;
    }

    const width = Math.max(element.clientWidth || 780, 680);
    const height = Math.max(380, matrix.length * 78 + 126);
    const margin = { top: 84, right: 90, bottom: 26, left: 240 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(element)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", `${factor.label} heatmap by ${outcome.label}`);

    const root = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const x = d3.scaleBand().domain(outcome.order).range([0, innerWidth]).paddingInner(0.08);
    const y = d3
      .scaleBand()
      .domain(matrix.map((row) => row.factorLevel))
      .range([0, innerHeight])
      .paddingInner(0.08);
    const flat = matrix.flatMap((rowSummary) => {
      return outcome.order.map((outcomeLevel, index) => ({
        factorLevel: rowSummary.factorLevel,
        outcomeLevel,
        count: rowSummary.counts[index],
        pct: rowSummary.percentages[index],
        total: rowSummary.total,
      }));
    });
    const maxPct = d3.max(flat, (cell) => cell.pct) || 1;
    const color = d3.scaleSequential().domain([0, maxPct]).interpolator(d3.interpolatePuBuGn);

    root
      .append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .call((group) => {
        group.select(".domain").remove();
        group.selectAll("text").attr("fill", "#132431").attr("font-size", 13).attr("font-weight", 600);
      });

    root
      .append("g")
      .call(d3.axisTop(x).tickSize(0))
      .call((group) => {
        group.select(".domain").remove();
        group.selectAll("text").attr("fill", "#132431").attr("font-size", 12).attr("font-weight", 700);
      });

    root
      .selectAll("rect")
      .data(flat)
      .join("rect")
      .attr("x", (cell) => x(cell.outcomeLevel))
      .attr("y", (cell) => y(cell.factorLevel))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 12)
      .attr("fill", (cell) => color(cell.pct))
      .attr("stroke", "rgba(19,36,49,0.06)")
      .on("mousemove", (event, cell) => {
        showTooltip(
          event,
          `<strong>${escapeHtml(cell.factorLevel)}</strong>${escapeHtml(
            cell.outcomeLevel
          )}<br>${(cell.pct * 100).toFixed(1)}% of this row<br><span class="muted">${cell.count.toLocaleString()} responses</span>`
        );
      })
      .on("mouseleave", hideTooltip);

    root
      .selectAll("text.cell-value")
      .data(flat)
      .join("text")
      .attr("class", "cell-value")
      .attr("x", (cell) => x(cell.outcomeLevel) + x.bandwidth() / 2)
      .attr("y", (cell) => y(cell.factorLevel) + y.bandwidth() / 2 + 4)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("font-weight", 700)
      .attr("fill", (cell) => (cell.pct > maxPct * 0.55 ? "#fffaf5" : "#132431"))
      .text((cell) => (cell.pct >= 0.05 ? `${Math.round(cell.pct * 100)}%` : ""));

    matrix.forEach((rowSummary) => {
      root
        .append("text")
        .attr("x", innerWidth + 12)
        .attr("y", y(rowSummary.factorLevel) + y.bandwidth() / 2 + 4)
        .attr("fill", "#6f7f88")
        .attr("font-size", 11)
        .text(`n=${rowSummary.total}`);
    });

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "heatmapLegendGradient")
      .attr("x1", "0%")
      .attr("x2", "100%");
    d3.range(0, 1.01, 0.1).forEach((stop) => {
      gradient
        .append("stop")
        .attr("offset", `${stop * 100}%`)
        .attr("stop-color", color(stop * maxPct));
    });

    const legendWidth = Math.min(220, innerWidth);
    const legendX = width - margin.right - legendWidth;
    const legendY = height - 16;
    svg
      .append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", 10)
      .attr("rx", 999)
      .attr("fill", "url(#heatmapLegendGradient)");
    svg
      .append("text")
      .attr("x", legendX)
      .attr("y", legendY - 6)
      .attr("fill", "#6f7f88")
      .attr("font-size", 11)
      .text("Lower row share");
    svg
      .append("text")
      .attr("x", legendX + legendWidth)
      .attr("y", legendY - 6)
      .attr("fill", "#6f7f88")
      .attr("font-size", 11)
      .attr("text-anchor", "end")
      .text("Higher row share");

    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", 22)
      .attr("fill", "#6f7f88")
      .attr("font-size", 12)
      .text(`${factor.label} on rows, ${outcome.label} on columns`);
  }

  function renderBarList(element, items, colorLeft, colorRight) {
    element.innerHTML = "";
    if (!items.length) {
      element.innerHTML = `<div class="loading-state">No data available.</div>`;
      return;
    }
    const maxPct = d3.max(items, (item) => item.pct) || 1;
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "bar-row";
      row.innerHTML = `
        <div class="bar-topline">
          <span>${escapeHtml(item.label)}</span>
          <span>${Math.round(item.pct * 100)}% <span class="muted">(${item.count})</span></span>
        </div>
        <div class="bar-track">
          <span class="bar-fill" style="width:${(item.pct / maxPct) * 100}%; background:linear-gradient(90deg, ${colorLeft}, ${colorRight});"></span>
        </div>
      `;
      element.appendChild(row);
    });
  }

  window.SleepSignalsCharts = {
    outcomeColors,
    renderLegend,
    renderStackedOutcomeChart,
    renderHeatmap,
    renderBarList,
    escapeHtml,
  };
})();
