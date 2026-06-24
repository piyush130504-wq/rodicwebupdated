# RODIC × NASSCOM AI Foundry — Case Competition Website (v2)

## Original Problem Statement
Build v2 of the RODIC × NASSCOM AI Foundry case-competition marketing site per a detailed "no AI slop" build directive. Fix all v1 failures: remove emoji, build out hero (corner brackets, scan line, status ticker), full 50+ problem bank across 13 sectors, differentiated gold/silver/bronze prizes, partners, who-should-apply, timeline with connectors, judges (TBA), 8-item FAQ accordion, hamburger mobile nav, scroll reveal, and a registration block that is NOT a `<form>` and uses an inline success state (no `alert()`).

## Architecture
- **Frontend**: React SPA in `/app/frontend/src/App.js`, styled by `/app/frontend/src/rodic.css` (exact 7-color token system, Space Grotesk + JetBrains Mono).
- **Backend**: FastAPI `/app/backend/server.py` — `POST/GET /api/registrations` storing leads in MongoDB collection `registrations`.
- Single page; section anchors: home, opportunity, program, problems, prizes, partners, who-should-apply, how-it-works, judges, faq, registration.

## Implemented (2026-06-24)
- Sticky nav (desktop links / tablet-reduced / mobile hamburger), exact token system, grid background, scroll-reveal IntersectionObserver.
- Hero with `[+]` corner markers, one-shot scan line, status ticker, two CTAs.
- Opportunity (4 bracket-notation stats, no emoji), Program 3 tracks (desktop tabs + mobile accordion).
- Problem Bank: 53 statements, 14 filter chips with animated filtering.
- Prizes: gold/silver/bronze differentiated + 2 benefit strips. Partners (6), Who Should Apply (3), Timeline (6 connected milestones), Judges (4 TBA), FAQ (8-item accordion).
- Registration: `<div>` (no form), email+role validation, posts to backend, inline `[ REGISTRATION RECEIVED ]` success state. Footer.
- Verified: testing agent 100% backend + frontend.

## Backlog / Next
- P1: Show an explicit error state if the registration POST fails (currently always shows success).
- P2: Admin view / CSV export of captured registrations; split App.js sections into `/components`.
- P2: Replace `[ TBA ]` judges and `State Governments — TBD` with real data when announced.
