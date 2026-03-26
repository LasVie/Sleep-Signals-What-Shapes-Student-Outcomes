# Sleep Signals

Interactive information visualization project for CS5346 on how sleep-related behaviors, daytime strain, and academic pressure relate to student outcomes.

The repository now contains a working multi-page redesign at the repo root, an interactive global benchmark page, and the archived prototype preserved in `prototype/` for reference.

## Team

- Song Haoran
- Li Yilun
- Lucas Giam
- Benecia Tang

## Project Overview

Sleep Signals has moved away from a broad exploratory dashboard toward a guided, story-led website with lightweight interaction.

The live product now uses a two-layer evidence base:

- Primary dataset: a 996-response student sleep and academic outcomes survey
- Comparative benchmark layer: 17 country-level student-sleep records across 6 regions for broader context

The main audience tracks remain:

- `Student`: plain-language takeaways and a focused chart for the most important signals
- `Educator`: a ranked evidence view with explicit method notes and limitations

The project is intended to support awareness and discussion. It is not a diagnostic or causal tool.

## Current Status

- Local Git repository initialized and pushed on March 26, 2026
- New root pages added:
  - [index.html](index.html)
  - [student.html](student.html)
  - [educator.html](educator.html)
  - [context.html](context.html)
  - [method.html](method.html)
- Shared site assets added under [assets](assets)
- Survey rows bundled into [data/local-survey-bundle.js](data/local-survey-bundle.js) to remove runtime CSV fetch failures from the redesigned site
- Global benchmark interaction added in [assets/context.js](assets/context.js)
- D3 vendored under `assets/vendor/` so the redesigned pages do not rely on a charting CDN
- Existing prototype archived at [prototype/index_v2.html](prototype/index_v2.html)
- Dataset stored at [data/Student Insomnia and Educational Outcomes Dataset_version-2.csv](data/Student%20Insomnia%20and%20Educational%20Outcomes%20Dataset_version-2.csv)
- Midpoint references stored under [research](research)
- Product scope, requirements, and acceptance criteria documented in [BRD.md](BRD.md)
- Project status and feedback synthesis documented in [progress.md](progress.md)

## Data Summary

### Primary survey

- Source: Student Insomnia and Educational Outcomes survey
- Collection window: October to November 2024, via Google Forms
- Size: 996 responses
- Shape: 16 columns, mostly ordinal response scales
- Core topics: insomnia symptoms, sleep duration, bedtime device use, caffeine use, exercise, fatigue, concentration, stress, class attendance, deadlines, and academic performance

### Benchmark layer

- Scope: 17 country-level records
- Coverage: Asia, Europe, Africa, North America, Latin America, and Oceania
- Metrics used in the live site:
  - insomnia prevalence
  - average sleep hours
  - academic pressure score
  - reported academic impact of sleep
- Interpretation rule: comparative context only, not a harmonized pooled dataset

Initial survey analysis still suggests the strongest story candidates are:

- Daytime fatigue
- Device use before bed
- Caffeine use
- Exercise frequency

These remain the lead factors in the redesigned site, with concentration difficulty, night awakenings, academic stress, and sleep duration used as supporting context.

## Page Flow

1. Overview
   Problem framing, audience framing, awareness-not-diagnosis caveat, headline findings, and links into the guided tracks.
2. Student
   Ranked factor cards with large type, short definitions, and one combined chart showing how outcome distributions shift across factor levels.
3. Educator
   Ranked factors plus one row-normalized heatmap, with clear explanation of ordinal encoding and limitations.
4. Global Context
   Interactive benchmark scatter plot and clickable country ranking to compare the primary survey against other country-level student-sleep records.
5. Data and Method
   Dataset provenance, respondent profile, question glossary, method notes, caveats, and benchmark interpretation guidance.

## Repository Structure

```text
.
├── BRD.md
├── README.md
├── context.html
├── educator.html
├── index.html
├── method.html
├── progress.md
├── student.html
├── assets/
│   ├── charts.js
│   ├── context.js
│   ├── data.js
│   ├── educator.js
│   ├── index.js
│   ├── method.js
│   ├── site.css
│   ├── student.js
│   └── vendor/
├── data/
│   ├── Student Insomnia and Educational Outcomes Dataset_version-2.csv
│   ├── global-sleep-benchmarks.js
│   └── local-survey-bundle.js
├── prototype/
└── research/
```

## Quick Start

You can open the redesigned pages directly, or serve them locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

Notes:

- The redesigned pages no longer fetch the survey CSV at runtime. They read from [data/local-survey-bundle.js](data/local-survey-bundle.js), which is generated from the survey CSV.
- The benchmark records are delivered through [data/global-sleep-benchmarks.js](data/global-sleep-benchmarks.js) and read by [assets/data.js](assets/data.js).
- D3 is served locally from `assets/vendor/`, so the redesigned pages do not depend on a CDN for chart rendering.
- The archived prototype now points at the correct CSV path under `data/` when served from the repo root, and still supports manual upload.

## Key Documents

- [BRD.md](BRD.md)
- [progress.md](progress.md)
