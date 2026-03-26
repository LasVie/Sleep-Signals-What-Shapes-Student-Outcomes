# Project Progress

## Snapshot

- Project: From Sleep to Scores
- Updated: March 26, 2026
- Status: repository scaffolded, product direction locked, redesign not yet implemented

## What Was Reviewed

- Midpoint slide deck in [research/Midpoint Presentation.pdf](research/Midpoint%20Presentation.pdf)
- Teaching-team feedback in [research/Comments from teaching team.docx](research/Comments%20from%20teaching%20team.docx)
- Archived prototype in [prototype/index_v2.html](prototype/index_v2.html)
- Survey dataset in [data/Student Insomnia and Educational Outcomes Dataset_version-2.csv](data/Student%20Insomnia%20and%20Educational%20Outcomes%20Dataset_version-2.csv)

## Completed

- Initialized a local Git repository in the project folder.
- Reorganized the working files into:
  - `prototype/`
  - `data/`
  - `research/`
- Added root project documentation:
  - `README.md`
  - `BRD.md`
  - `progress.md`
- Locked the v1 audience model to `Student` and `Educator`.
- Locked the MVP data scope to the local survey only.
- Documented the redesign direction as a guided storytelling site rather than an exploration-heavy dashboard.

## Current Prototype Baseline

The archived prototype is a single-file D3 page with two main modes:

- `Student`
- `Educator`

Current prototype characteristics:

- Uses a ranked association view plus separate overview charts
- Includes an embedded regional benchmark dataset that is now out of MVP scope
- Requires manual CSV upload in practice because its auto-load filenames do not match the actual CSV filename in the repo
- Uses small text and dense UI in several areas, especially for presentation conditions

## Teaching-Team Feedback Synthesis

Main themes from the written feedback:

- The current problem framing and audience definition are strong.
- Ordinal data deserves visualization choices that fit it better than generic dashboard charts.
- Student-facing content should be simpler and more guided.
- Educator-facing content currently splits related information across multiple charts and needs a clearer combined view.
- The project should act more like a storyteller than a sandbox.
- Metric explanations must be more obvious.
- Typography is too small for presentation and readability.
- Color choices should be improved for accessibility, especially avoiding red/green dependence.
- Limitations such as reverse causality should be stated clearly.

## Preliminary Data Notes

Observed from the local CSV:

- 996 responses across 16 columns
- Year-of-study distribution is heavily concentrated in `Graduate student` and `Third year`
- Gender distribution is skewed toward `Male`
- Academic performance responses are heavily concentrated in `Poor` and `Below Average`
- Class-skipping and deadline-impact outcomes are also strongly skewed toward worse categories
- Preliminary ordinal association checks suggest the strongest story candidates are:
  - Daytime fatigue
  - Device use before bed
  - Caffeine use
  - Exercise frequency

These observations should shape the redesign, but final story copy should be confirmed after the implementation uses a cleaned and fully verified analysis pass.

## Active Issues

- No remote GitHub repository has been created yet.
- The current prototype architecture is still a single HTML file and not the desired final structure.
- The archived prototype contains benchmark content outside the locked MVP scope.
- Some survey question wording needs explicit glossary support for clarity.
- The dataset is imbalanced, which makes careful framing essential.

## Next Milestones

1. Build the redesigned site around the locked information architecture in [BRD.md](BRD.md).
2. Replace the split educator views with a single coherent factor-outcome evidence view.
3. Rewrite the student experience around 3-4 guided findings with larger typography and simpler explanations.
4. Add a transparent `Data & Method` page with glossary and limitations.
5. Create the remote GitHub repository manually and push this local repo.

## Definition of Done For This Phase

- Repo is locally initialized and organized.
- Core documentation exists at the repository root.
- The product direction is explicit enough for implementation without revisiting midpoint ambiguity.
- The current prototype is preserved as a reference artifact instead of being treated as the final product.
