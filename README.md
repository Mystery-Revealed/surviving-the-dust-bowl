# Surviving the Dust Bowl

**Unit 7 · 7th Grade Texas History · TEKS 7.7E, 7.9A, 7.9B**

It's 1931 in the Texas Panhandle and the sky is about to turn against you. Guide a
**Farm-Owner**, **Tenant-Farmer**, or **Town** family through the Dust Bowl years
(1931–1941) — six chapters, twelve graded decisions, and, at the heart of the game,
the choice every real family faced: **STAY** and rebuild with the New Deal and the
new soil science, or **GO WEST** on Route 66. Both are right. Only waiting is wrong.

Built on the shared Texas History Socket.IO engine (server-authoritative, solo
mode) with one small extension: a choice may carry `setVariant`, which swaps the
running step list mid-game — the stay-or-go branch. Each family's two branch lists
share a byte-identical first half, so the cursor flows straight across the swap.

## Run it

```bash
npm install        # installs server/ and client/ via postinstall
npm test           # server test suite (content + branch + engine)
npm run build      # builds the React client into client/dist
npm start          # serves game + Teacher Command Center on :4000
```

- Student game: `http://localhost:4000`
- Teacher Command Center: `http://localhost:4000/#teacher`

## What's specific to this game

- **Adapter:** `server/src/games/dustBowl.js` — three families × two paths = six
  composite step lists (`tenant_stay`, `tenant_go`, `owner_stay`, `owner_go`,
  `town_stay`, `town_go`). Meters: Money 💵 · Health ❤️ · Hope 🌅.
- **The branch:** decision #6 (Black Sunday's second decision). STAY and GO WEST
  both score right; "wait and do nothing" is the only wrong answer. The engine's
  `resolve()` applies `setVariant` and reports `branchTo` so the client can show
  the moment.
- **Dashboard:** class accuracy grouped by base family; each student's chosen path
  shown as a roster column — information, never a grade. PDF includes both.
- **Tone rule (from the spec):** dignity throughout. "Okie" appears once, in
  quotes, as a slur others use — and the GO debrief turns it. Both debriefs end on
  the both-were-brave line.

Session data lives in server memory only; the teacher's PDF is the only record
that survives. Deploy shape: one Render web service (see `render.yaml`), embedded
in Wix — same workflow as the companion games.

*Companion to Survive the Season, Claim the Land, Hold the Line, President of the
Republic, Run the Blockade, and Trail Boss.*
