# From Sleep to Scores

Interactive information visualization project for CS5346 on how sleep-related behaviors and daytime functioning relate to academic outcomes.

This repository is now scaffolded as a local Git project. The remote GitHub repository still needs to be created and connected manually because this environment does not have GitHub CLI or authenticated GitHub access.

## Team

- Song Haoran
- Li Yilun
- Lucas Giam
- Benecia Tang

## Project Overview

The project studies a 996-response survey on student sleep, habits, daytime functioning, stress, and academic outcomes. The current direction is a guided, story-led website rather than a dashboard that asks users to discover everything on their own.

The planned v1 experience has two audience tracks:

- `Student`: a plain-language summary of the most important habits and signals to watch
- `Educator`: a clearer evidence view that combines factor and outcome information in one place

The site is intended to raise awareness and support discussion. It is not a diagnostic tool and does not make causal claims.

## Current Status

- Local Git repository initialized on March 26, 2026
- Existing prototype archived at [prototype/index_v2.html](prototype/index_v2.html)
- Dataset stored at [data/Student Insomnia and Educational Outcomes Dataset_version-2.csv](data/Student%20Insomnia%20and%20Educational%20Outcomes%20Dataset_version-2.csv)
- Midpoint references stored under [research](research)
- Product scope, requirements, and acceptance criteria documented in [BRD.md](BRD.md)
- Project status and feedback synthesis documented in [progress.md](progress.md)

## Dataset Summary

- Source: Student Insomnia and Educational Outcomes survey
- Collection window: October to November 2024, via Google Forms
- Size: 996 responses
- Shape: 16 columns, mostly ordinal response scales
- Core topics: insomnia symptoms, sleep duration, bedtime device use, caffeine use, exercise, fatigue, concentration, stress, class attendance, deadlines, and academic performance

Initial analysis of the current dataset suggests the strongest story candidates for v1 are:

- Daytime fatigue
- Device use before bed
- Caffeine use
- Exercise frequency

These are the factors the new product should emphasize first, with concentration difficulty, night awakenings, academic stress, and sleep duration used as supporting context.

## Proposed Page Flow

1. Landing page
   Problem framing, audience framing, awareness-not-diagnosis caveat, and 3-4 headline findings in plain language.
2. Student track
   Guided summary cards with large type, short definitions, and a single combined chart showing how factor levels shift outcome distributions.
3. Educator track
   An annotated evidence view with a ranked shortlist of factors, a row-normalized heatmap for the selected factor, and clear explanation of ordinal encoding and limitations.
4. Data and method page
   Dataset description, respondent profile, skew notes, exact survey wording, and caveats including reverse causality.

## Repository Structure

```text
.
├── BRD.md
├── README.md
├── progress.md
├── data/
├── prototype/
└── research/
```

## Quick Start

To review the archived prototype locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/prototype/index_v2.html`.

Notes:

- The archived prototype expects the CSV to be loaded manually.
- Use the file picker in the page and select the dataset from `data/`.
- The prototype is a reference artifact, not the final product architecture.

## Key Documents

- [BRD.md](BRD.md)
- [progress.md](progress.md)
