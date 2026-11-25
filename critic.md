# Critic — news-image-20261124

Critic session (writes no code) on the first build, commit
a370762e56cdb5c5a89dce72f868edafbd6fb65c, image 19,301 bytes, 1024x1024.
Average **8.0 (48/6) — PASS** vs the ≥8 threshold, exactly at the bar.
Blind A/B vs live #1: not feasible — live places hidden; no comparison invented.

## Scores (one line of evidence each)

- Look: 8 — clean grid, strong header; purely typographic, 4 near-identical WAR headers repetitive, small icons cryptic.
- Legibility: 7 — crisp at 1024px, zero garble, zero cut-off; at ~300px the subtext numbers (2 killed/40 wounded, 103.3, +31%) drop out.
- First impression: 9 — date, "12 STORIES", grid instantly read as a one-day digest; COP31 top-left.
- Completeness: 9 — all 12 stories present with headline + detail + figures; date named; sources footer present.
- Breadth: 7 — regions/fields wide, but 5 of 12 cards are war/security; no sport, culture, science, health, Africa, Latin America or Oceania.
- Faithfulness: 8 — poster matches stories.md on every name/number; 3/3 live spot-checks confirmed (COP31 collapse; Huang reinstated, Nvidia +31%; Sanofi–Insmed $41bn). Caveats: COP31 actually concluded Sun 22 Nov (its 24 Nov status rests on follow-up coverage), and "90+ NATIONS REJECT DRAFT" loosely attaches the 90+ figure to the rejection (sources tie 90+ to the electrification pledge).

## Text defects

None — no garbled/misspelled words, no cut-off text; "ZAPORIZHZHIA",
"NAEEM ABU NAHEL", "RAS AL KHAIMAH" all correct.

## Suggested fixes (applied in the continuation build)

1. Enlarge subtext ~20%, cap at 2 lines.
2. Swap one war card (weakest: NATO ON ALERT) for a non-war 24 Nov story from another field/region.
3. Reword the COP31 card, e.g. "DRAFT REJECTED — NO FOSSIL-FUEL WORDING".
