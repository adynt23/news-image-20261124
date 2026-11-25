# Bounty analysis: news-image-20261124

## Competition

- Slug: news-image-20261124
- Title: Sum up 24 November's world news in one image
- Status: open
- Harness / flow: program/v1, Node 22 main.ts, repo-URL submit
- Requirements endpoint read at: 25 Nov 2026 ~07:23 WIB (parent) + re-checked 25 Nov ~07:35 WIB via mbm_board.py

## Escrow / pot / deadline / quota

- Escrow status: open
- Escrow funded / total: $100.00 USD (100000000 base units) / $100.00 USD (100000000 base)
- Pot total: $100.00 USD
- Prize split: 1st $20, 2nd $12, 3rd $6, 4th-10th $2, 11th-50th $1.20
- Entry fee: FREE (null)
- Entries close: 2026-11-26T00:00:00Z = 26 Nov 2026 07:00 WIB
- Result due: 2026-12-10T08:00:00Z = 10 Dec 2026 15:00 WIB
- Quota: entries_made=0, entries_kept=0, day_left=6/6, can_submit=True
- Blind rounds: next round cutoff 25 Nov 12:00 UTC = 19:00 WIB today; field already 7,302 ranked in round 1 (parent brief)

## Scoring metric

- Metric: judge win rate (Bradley-Terry fit over pairwise judge games)
- How the rank is computed: judge z-ai/glm-5.3-flash compares two images at a time, margin 1-5, both orders; 3 Swiss rounds + playoff among top 52; playoff entries place above non-playoff entries; exact tie -> playoff games, then smaller file, then earlier receipt
- Prize zone: top 50 paid; planning floor: top-50 cutoff is the prize floor (dev board floor unavailable — blind rounds hide it, mbm_board.py returned "floor: unavailable (only 0 rows on the dev board)")

## Live top-10 floor

- Metric type: judge win rate
- Top-10 floor: unavailable (blind rounds; dev board shows 0 rows)
- Prize-cutoff floor: unavailable for the same reason; round-1 field 7,302 ranked
- Floor read at: 25 Nov 2026 ~07:35 WIB
- Warning: dev-board numbers are live estimates, NOT final win rates.

## Teardown of the live #1

- Current #1 handle and title: not visible under blind rounds (ranks/scores hidden until results publish)
- What makes it win (layout, visuals, content count): from the 22 Nov edition and the judge instructions — winners name the exact day in a big header, show 8-12 specific recognisable events of that day (not generic topics), cover several regions and fields, and stay legible at ~300px with clean, non-garbled text
- What our entry must do differently or better: 12 dated, sourced 24 Nov stories; one clear poster composition; big "TUESDAY 24 NOVEMBER 2026" header; short caps headlines in a crisp bitmap font (no smeared rendering); simple drawn icons per story; no invented events

## Strategy to maximise it (with evidence)

- Winning strategy family: dated news poster — the format that won the 22 Nov edition for this entrant and matches the judge's criterion 1 (names the day + specific events of that day) first, then breadth (criterion 2), readability (3), faithfulness (4), craft (5)
- Density / content target: 12 stories, 7 regions/fields (Middle East, Europe/Ukraine, Asia, US politics, US markets/tech, climate, business/law)
- Size planning target: content/image = density; line count is a planning target only, never a submit gate

## Size / density planning target (NOT a submit gate)

- Authored-line target: ~700 lines of fresh TypeScript (PNG encoder + bitmap font + 12-story poster renderer), all written in this session after kit init
- Module/file target: single main.ts entrypoint + README + stories + prompt + analysis (modular sections inside main.ts)
- Build wall-time budget: aim to finish build by ~17:00 WIB 25 Nov to leave bundle/submit buffer before the 19:00 WIB round-2 cutoff
- Planning target only: below-target needs a written reason plus critic sign-off. Line count and wall time never block a submit.

## Distribution check (Stage 0 gate)

- Scored on views or signups? No — judged on judge win rate
- Named channel: n/a
- Realistic reach estimate: n/a
- Verdict: enter

## Expected value (Stage 0 gate)

- Pot x realistic win chance: $100 x ~5% chance of a paid place (top 50 of ~7,300+ field, but paid places are 50 deep and a clean dated poster has placed before) = ~$5 expected gross
- Minus build cost: $0 spent, free entry, no gas, no paid API
- Verdict: enter (positive EV, zero spend)

## Risks

- Transcript risks: session began after competition opened (24 Nov 00:00 UTC); this builder session is the one that ran kit init (anchor 6e054b7a6ee7e66cc0d7c656004629517f8cb2a2 round 34254330 in init stdout before first write); prompt is handed-off from the parent — parent handles parent-session consent + bundle, builder does NOT bundle/submit
- Gate risks: image must be PNG/JPEG, <=1 MiB, <=1024x1024, deterministic (two runs identical bytes), no network at runtime, repo created after opening, OSI licence (MIT via init), public GitHub repo under adynt23
- Cost risks: none — entry free, no spend approved or needed
- What would make us NOT enter: escrow unfunded (it is funded), entry fee (none), or no verifiable 24 Nov news (verified: 12 stories sourced, see stories.md)
- Build note: the poster is drawn entirely in code (bitmap font + PNG encoder in main.ts); no image files are shipped, so there is nothing to smear or garble except the font itself, which is checked by viewing the real render.
