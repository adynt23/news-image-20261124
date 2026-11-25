# The World in One Day — Tuesday 24 November 2026

[![make.fun](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124)
[![Rank](https://make.fun/badge/news-image-20261124/adynt23/news-image-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124)
[![Reward](https://make.fun/badge/news-image-20261124/adynt23/news-image-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124)

A program that draws one poster summing up the world's news of
**Tuesday 24 November 2026** — 12 stories from around the globe:
COP31 collapsing in Antalya, Nvidia bringing back Jensen Huang,
the Zaporizhzhia strike, Gaza, Hormuz, Libya, NATO, the Sanofi
$41bn deal, US consumer confidence, Huawei's conviction, looming
tariffs, and the UAE bus crash.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

It writes `entry.png` (1024x1024, PNG, under 1 MiB) to the output
directory. Pure Node 22 standard library — no network, no
dependencies, deterministic: two runs write identical bytes.

Everything is drawn in code: a hand-written 5x7 bitmap font, flat
colour panels and simple geometric icons. No images are shipped.
Sources for every story, with dates, are listed in `stories.md`.

## Entry

- Competition: [Sum up 24 November's world news in one image](https://make.fun/bounty/news-image-20261124)
- Entrant: @adynt23 on make.fun
