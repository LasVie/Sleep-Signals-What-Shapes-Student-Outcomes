# Business Requirements Document

## Project

Sleep Signals

## Version

v1.1, updated March 26, 2026

## Summary

Sleep Signals is a guided information-visualization website about how sleep-related behavior, daytime functioning, and academic stress relate to academic outcomes in a 996-response student survey. The product now expands beyond the single local survey by adding a comparative benchmark layer built from country-level student-sleep records.

The teaching-team feedback still defines the core design direction:

- fewer focal factors
- larger and more legible text
- clearer explanation of metrics
- a combined educator evidence view instead of disconnected charts
- stronger storytelling over free-form exploration

The benchmark expansion does not change the main story source. The local survey remains primary. The benchmark layer exists to widen scope, add comparative context, and address the concern that the project should not rely on one dataset alone.

## Product Goals

- Help students quickly understand which sleep-related behaviors and symptoms align most strongly with worse academic outcomes.
- Help educators inspect factor-outcome relationships without requiring statistical background.
- Place the local survey inside a broader international context without overclaiming cross-country comparability.
- Present all evidence responsibly, with explicit reminders that the visualizations show associations, not causal effects.
- Use the website medium for guided storytelling, annotation, and lightweight interaction rather than maximal dashboard-style exploration.

## Primary Audiences

### Student

- Wants a fast, low-friction explanation
- Needs large text, short labels, and minimal jargon
- Should leave with a short list of habits or signals to watch

### Educator

- Wants evidence that can support discussion, awareness, or intervention design
- Needs to compare factor levels against academic outcomes clearly
- Should be able to understand the ranking method and the distribution view without reading code

## Secondary Audience

Reviewers, instructors, and teammates need enough transparency to assess methodology, limitations, and benchmark scope. Their needs are handled through the `Global Context` and `Data & Method` pages rather than through a separate track.

## Non-Goals

- Clinical or diagnostic interpretation
- Causal claims about sleep and academic performance
- Treating country-level benchmark records as a harmonized pooled respondent dataset
- A highly interactive general-purpose dashboard with unrestricted filter combinations
- Reproducing the archived `prototype/index_v2.html` structure as the final design

## Data Scope

### Primary source

- `data/Student Insomnia and Educational Outcomes Dataset_version-2.csv`
- Google Forms survey conducted in October to November 2024
- 996 responses
- Mostly ordinal survey responses across sleep, habits, daytime effects, stress, and outcomes

### Product delivery rule

- The redesigned site must not rely on runtime CSV fetches for the survey data
- Survey rows are bundled into `data/local-survey-bundle.js` so the redesigned pages remain reliable in static hosting and local preview contexts

### Comparative benchmark layer

- Country-level records covering multiple regions
- Runtime delivery file: `data/global-sleep-benchmarks.js`
- Current live benchmark metrics:
  - insomnia prevalence
  - average sleep hours
  - academic pressure score
  - reported academic impact of sleep
- Benchmark records are descriptive context only
- Benchmark sources may differ in sample design, timing, question wording, and respondent population

## Product Decisions Locked For v1

### Information Architecture

- Shared landing page
- Dedicated `Student` track
- Dedicated `Educator` track
- Dedicated `Global Context` page
- Dedicated `Data & Method` page

### Story Scope

Primary factors featured in the story:

- Daytime fatigue
- Device use before bed
- Caffeine use
- Exercise frequency

Secondary contextual factors:

- Concentration difficulty
- Night awakenings
- Academic stress
- Sleep duration

Sleep-quality self-rating will not be used as the lead claim unless later validated analysis shows that it belongs in the top story layer.

### Interaction Model

- Guided defaults first
- Lightweight filtering only where it materially helps interpretation
- Hover, highlight, click selection, and simple dropdowns are sufficient interaction for v1
- No view should require users to infer the core message by themselves

## Information Architecture and Page Requirements

### 1. Landing Page

Purpose:

- Introduce the problem and set expectations
- Give users the main story before they enter an audience track
- Make the expanded scope visible immediately

Required sections:

- Hero with title, one-sentence problem framing, and awareness-not-diagnosis caveat
- Short explanation of the two-layer evidence base
- Three to four annotated headline findings written in plain language
- Entry links to `Student`, `Educator`, `Global Context`, and `Data & Method`
- Short explanation of what the project measures and what it does not claim

### 2. Student Track

Purpose:

- Reduce anxiety and cognitive load
- Surface the most meaningful signals in plain language

Required sections:

- Intro panel framed around “top habits or signals to watch”
- Four featured factor cards in ranked order
- Outcome selector with guided default
  - default outcome: `Academic performance`
- Optional year-of-study and gender filters only if they preserve clarity
- One combined chart for the selected factor
- Clear explanation that the chart shows within-factor distributions

Student chart decision:

- Use a row-normalized distribution view where each factor level shows the percentage split across outcome categories
- The selected design must use direct labels and annotation so the user can immediately tell what better and worse outcomes mean

Student copy requirements:

- No unexplained statistical notation on the main student view
- Every factor must have a plain-language one-sentence explanation
- Definitions must use the exact survey wording or a faithful paraphrase

### 3. Educator Track

Purpose:

- Provide a clearer evidence view without splitting the story into unrelated charts

Required sections:

- Short ranked shortlist of the scoped factors for the selected outcome
- Main evidence chart that combines factor and outcome information
- Method note panel explaining ordinal encoding and association ranking
- Limitations panel covering non-causal interpretation and reverse causality
- Link or callout to the benchmark page for broader context

Educator chart decision:

- Main chart is a row-normalized heatmap
- Rows: ordered levels of the selected factor
- Columns: ordered levels of the selected outcome
- Cell encoding: percentage within each factor row
- Support elements: direct row totals, selected-factor summary, and annotation of the main pattern

Educator controls:

- Outcome selector
- Selected-factor selector or ranked-factor click target
- Optional year and gender filters

Educator method note requirements:

- Explain that ordinal categories are encoded in a consistent worse direction for analysis
- Explain Spearman rank correlation in plain language
- Explain that the heatmap shows conditional distributions, not causal flow

### 4. Global Context Page

Purpose:

- Expand the scope beyond one survey
- Provide a broader comparative frame without replacing the local survey story

Required sections:

- Hero describing the benchmark layer and its limits
- Region selector
- Metric selector
- Interactive scatter plot
  - x-axis: average sleep hours
  - y-axis: selected benchmark metric
  - bubble size: sample size
  - color: region
- Clickable ranking list of top countries for the selected metric
- Selected-country detail card with source, year, sample size, and metric values
- Interpretation note that compares the selected country against its visible regional context and the primary local sample

Benchmark interpretation requirements:

- Make it explicit that benchmark records come from different studies
- Do not imply direct causal or pooled respondent-level inference across countries
- Keep the local survey visually identifiable as the primary reference point

### 5. Data & Method Page

Purpose:

- Give reviewers, instructors, and teammates a transparent reference page

Required sections:

- Dataset provenance and collection context
- Respondent profile summary
- Known skew and imbalance notes
- Survey question glossary
- Analysis method summary
- Benchmark-layer interpretation note
- Limitations and future-improvement notes

Mandatory notes to include:

- Strong class-skipping and academic-performance skew in the current dataset
- Gender imbalance and year-of-study imbalance
- Reverse causality risk between sleep problems and academic stress or performance
- Potential ambiguity in how respondents interpret night awakenings
- Benchmark records are not fully harmonized across countries

## Visual and Accessibility Requirements

- Body and annotation text must be presentation-readable at laptop and projector scale
- Do not rely on red and green as the primary good-bad distinction
- Grouping must not depend on color alone; use labels, ordering, or section structure too
- Subtitle and explanatory text must be visually subordinate to the title, but still clearly legible
- Definitions and metric explanations must be visible near the charts rather than hidden behind expert-only interaction
- Interactive states must remain clear for hover, click, and keyboard focus

## Analysis and Content Rules

- Use the local survey as the primary analytic dataset
- Use benchmark records only for descriptive comparative context
- Keep factor ordering and category ordering explicit and consistent
- Use ordinal association ranking to choose story emphasis, but do not overclaim precision
- Use annotation to connect rankings and chart patterns
- Include a short reflection on what the datasets cannot answer and what future studies could add
- Preserve the archived prototype as a reference artifact, but do not treat it as the final design standard

## Acceptance Criteria

- A student can identify the top factors and understand the main chart without needing statistical terminology.
- An educator can see factor distribution and outcome relationship in a single coherent view.
- A reviewer can quickly find methodology, limitations, reverse-causality notes, and benchmark caveats.
- A viewer can place the local survey in a broader cross-country frame through the `Global Context` page.
- The redesigned pages no longer fail because of missing runtime CSV fetches.
- The design uses readable font sizes and avoids red-green-only encoding.
- The landing page communicates the main story before any interaction is required.
- The site architecture clearly separates the archived prototype from the new product direction.

## Open Implementation Follow-Through

- Tighten benchmark source traceability and citation formatting before final submission.
- Re-check the ranking logic against any updated survey CSV before locking final story copy.
- Expand or validate the benchmark layer if additional country datasets are added.
- Re-test projector readability and mobile responsiveness after the final content pass.
