# Business Requirements Document

## Project

From Sleep to Scores

## Version

v1 baseline, updated March 26, 2026

## Summary

This project will become a guided information-visualization website about how sleep-related behavior, daytime functioning, and academic stress relate to academic outcomes in a student survey of 996 respondents. The v1 product will serve two primary audiences, `Student` and `Educator`, and will use only the local survey dataset as its MVP data source.

The site must shift away from the current exploratory prototype and toward a clearer story. The teaching-team feedback points to four concrete requirements: fewer focal factors, larger and more legible text, stronger explanation of what the metrics mean, and a combined educator view that shows factor and outcome relationships together instead of splitting them into disconnected charts.

## Product Goals

- Help students quickly understand which sleep-related behaviors and symptoms are most associated with worse academic outcomes.
- Help educators inspect the relationship between selected factors and outcomes without requiring statistical background.
- Present the dataset responsibly, with explicit reminders that the visualizations show associations, not causation.
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

## Deferred Audience

Student support and policy stakeholders remain a valid future audience, but they are not first-class v1 users. Their needs should be noted as future work rather than driving the initial IA or feature set.

## Non-Goals

- Clinical or diagnostic interpretation
- Causal claims about sleep and academic performance
- Cross-country benchmarking in the MVP
- A highly interactive general-purpose dashboard with unrestricted filter combinations
- Reproducing the current `index_v2.html` structure as the final design

## Data Scope

- Primary source: `data/Student Insomnia and Educational Outcomes Dataset_version-2.csv`
- Collection context: Google Forms survey conducted in October to November 2024
- Record count: 996 responses
- Variables: mostly ordinal survey responses across sleep, habits, daytime effects, stress, and outcomes
- MVP rule: only the local survey dataset is used in product logic and acceptance criteria

## Product Decisions Locked For v1

### Audience Structure

- Shared landing page
- Dedicated `Student` track
- Dedicated `Educator` track
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

Sleep-quality self-rating will not be used as the lead claim because the current dataset and prototype analysis do not support it as the strongest headline factor.

### Interaction Model

- Guided defaults first
- Lightweight filtering only where it materially helps interpretation
- Hover, highlight, and simple selection are sufficient interaction for v1
- No view should require users to infer the core message by themselves

## Information Architecture and Page Flow

### 1. Landing Page

Purpose:

- Introduce the problem and set expectations
- Give users the main story before they enter an audience track

Required sections:

- Hero with title, one-sentence problem framing, and awareness-not-diagnosis caveat
- Audience switch with clear labels for `Student` and `Educator`
- Three to four annotated headline findings written in plain language
- Short explanation of what the site measures and what it does not claim
- Entry links to the two audience tracks and the `Data & Method` page

### 2. Student Track

Purpose:

- Reduce anxiety and cognitive load
- Surface the most meaningful signals in plain language

Required sections:

- Intro panel titled around "Top habits or signals to watch"
- Four featured factor cards in ranked order
- One outcome selector with guided defaults
  Default outcome: `Academic performance`
- Optional year-of-study filter only if it preserves clarity
- One combined chart for the selected factor

Student chart decision:

- Use a row-normalized distribution view where each factor level shows the percentage split across outcome categories
- Preferred implementation is a normalized stacked bar view or compact matrix, whichever is more readable at presentation scale
- The selected design must use direct labels and annotation so the user can immediately tell what worse and better outcomes mean

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

Educator chart decision:

- Main chart is a row-normalized heatmap
- Rows: ordered levels of the selected factor
- Columns: ordered levels of the selected outcome
- Cell encoding: percentage within each factor row
- Support elements: direct row totals, selected factor summary, and annotation of the main pattern

Educator controls:

- Outcome selector
- Selected factor selector or ranked-factor click target
- Optional year and gender filters

Educator method note requirements:

- Explain that ordinal categories are encoded in a consistent worse-direction for analysis
- Explain Spearman rank correlation in plain language
- Explain that the heatmap shows conditional distributions, not causal flow

### 4. Data & Method Page

Purpose:

- Give reviewers, instructors, and teammates a transparent reference page

Required sections:

- Dataset provenance and collection context
- Respondent profile summary
- Known skew and imbalance notes
- Survey question glossary
- Analysis method summary
- Limitations and future-improvement notes

Mandatory notes to include:

- Strong class-skipping and academic-performance skew in the current dataset
- Gender imbalance and year-of-study imbalance
- Reverse causality risk between sleep problems and academic stress or performance
- Potential ambiguity in how respondents interpret night awakenings

## Visual and Accessibility Requirements

- Body and annotation text must be presentation-readable at laptop and projector scale
- Do not rely on red and green as the primary good/bad distinction
- Grouping must not depend on color alone; use labels, ordering, or section structure too
- Subtitle and explanatory text must be visually subordinate to the title, but still clearly legible
- Definitions and metric explanations must be visible near the charts rather than hidden behind expert-only interaction

## Analysis and Content Rules

- Use the current survey as the only data source in v1
- Keep factor ordering and category ordering explicit and consistent
- Use preliminary association ranking to choose story emphasis, but do not overclaim precision
- Use annotation to connect rankings and distribution charts
- Include a short reflection on what the dataset cannot answer and what future studies could add

## Acceptance Criteria

- A student can identify the top factors and understand the main chart without needing statistical terminology.
- An educator can see factor distribution and outcome relationship in a single coherent view.
- A reviewer can quickly find methodology, limitations, and reverse-causality notes.
- The design uses readable font sizes and avoids red/green-only encoding.
- The landing page communicates the main story before any interaction is required.
- The site architecture clearly separates archived prototype material from the new product direction.

## Open Implementation Follow-Through

- Build a new multi-page or multi-section website instead of extending the current single-file prototype blindly.
- Re-check the ranking logic against the cleaned dataset before locking final story copy.
- Validate that the chosen student and educator charts still read clearly on a presentation screen.

