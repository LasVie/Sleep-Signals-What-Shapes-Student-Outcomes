# Project Progress

## Snapshot

- Project: From Sleep to Scores
- Updated: March 26, 2026
- Status: repository scaffolded and pushed, redesign baseline implemented

## What Was Reviewed

- [x] Midpoint slide deck in [research/Midpoint Presentation.pdf](research/Midpoint%20Presentation.pdf)
- [x] Teaching-team feedback in [research/Comments from teaching team.docx](research/Comments%20from%20teaching%20team.docx)
- [x] Archived prototype in [prototype/index_v2.html](prototype/index_v2.html)
- [x] Survey dataset in [data/Student Insomnia and Educational Outcomes Dataset_version-2.csv](data/Student%20Insomnia%20and%20Educational%20Outcomes%20Dataset_version-2.csv)

## Completed

- [x] Initialized a local Git repository in the project folder.
- [x] Reorganized the working files into `prototype/`, `data/`, and `research/`.
- [x] Added root project documentation: `README.md`, `BRD.md`, and `progress.md`.
- [x] Locked the v1 audience model to `Student` and `Educator`.
- [x] Locked the MVP data scope to the local survey only.
- [x] Documented the redesign direction as a guided storytelling site rather than an exploration-heavy dashboard.
- [x] Created the remote GitHub repository and pushed the local repo.
- [x] Built a new root site with `index.html`, `student.html`, `educator.html`, and `method.html`.
- [x] Replaced the split educator structure with a ranked shortlist plus one row-normalized heatmap.
- [x] Rewrote the student experience around four guided factors and one combined distribution chart.
- [x] Added a `Data & Method` page with respondent profile, glossary, and caveats.

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

- [ ] The archived prototype still contains benchmark content outside the locked MVP scope, even though the new site no longer uses it.
- [ ] The live site still needs another pass of copy polish and presentation rehearsal against the final narrative.
- [ ] Mobile and projector-scale QA should be repeated after any further chart or typography changes.
- [ ] The dataset is imbalanced, which makes careful framing essential.

## Next Milestones

- [ ] Refine chart copy, annotations, and section wording for the final presentation narrative.
- [ ] Run another round of peer or instructor feedback on the new site structure.
- [ ] Check final projector readability and mobile responsiveness after content polishing.
- [x] Create the remote GitHub repository and push this local repo.

## Definition of Done For This Phase

- [x] Repo is locally initialized and organized.
- [x] Core documentation exists at the repository root.
- [x] The product direction is explicit enough for implementation without revisiting midpoint ambiguity.
- [x] The current prototype is preserved as a reference artifact instead of being treated as the final product.
