# "Surviving the Dust Bowl" — Build Specification
### Unit 7 Game · 7th Grade Texas History · 20th Century Texas

**Purpose:** A build-ready spec to paste into Claude (Fable, Opus, Sonnet) to create the game, deploy on Render via GitHub, and embed in Wix. Same shared Socket.IO engine, Teacher Command Center, and workflow as your other games — this spec covers what's unique, including the **branching stay-or-go structure**, which needs one tiny engine extension (Section 6).

> **Reading-level rule:** 7th grade content at a **5th grade reading level** for everything the student sees. Does not apply to this spec.

> **Data method:** the **shared Socket.IO engine, solo mode**. New adapter: `dustBowl.js`. **Variants = three family types** (the student's pick, grouped on the dashboard) — and mid-game, a **stay-or-go branch** splits each family's second half. Both paths are historically right; that's the heart of the design.

> **Tone — read before building.** The Dust Bowl brought real hunger, sickness, and loss to real families — many still remembered by their grandchildren. This game is about **resilience and hard choices with dignity**: no despair for its own sake, no mocking of migrants, and hope that arrives honestly (New Deal help, soil science, rain, and work). Staying took courage. Leaving took courage. The game says both.

---

## 1. Game at a Glance

| Field | Value |
|---|---|
| **Title** | Surviving the Dust Bowl |
| **Unit** | 7 — 20th and 21st Century Texas (1920–present) |
| **TEKS** | 7.7E (impact of the Great Depression and the Dust Bowl on Texas; New Deal programs such as the CCC and PWA — straight from your outline), 7.9B (the Dust Bowl as a geographic factor shaping Texas — named in the TEKS), 7.9A (consequences of modifying the environment). Skills: 7.20B |
| **Pick** | **A family type** — Farm-Owner, Tenant-Farmer, or Town family — the group the dashboard tracks |
| **Branch** | Mid-game, each family chooses to **STAY** or **GO WEST** — both paths playable, both gradeable |
| **Type** | Solo choice-based survival story — 6 chapters × 2 decisions = **12 graded actions** (decision #6 is the branch) |
| **Playtime** | 8–10 minutes per run; replay across 3 families × 2 paths = six stories |
| **Platform / tracking** | Shared engine solo mode; Command Center with **per-family accuracy** plus each student's chosen path; session-only data |
| **Art style** | Semi-realistic / cinematic — Dorothea Lange dignity, never despair-porn |

**One-sentence pitch:** It's 1931 in the Texas Panhandle and the sky is about to turn against you — guide your family through the Dust Bowl years, make the hard choice every family faced (hold on, or head west), and bring them through with your health and hope intact.

**The core teaching idea:** The Dust Bowl was **made by people and weather together** — years of plowing up the native grass, then a decade of drought — and Texans answered it two brave ways: staying (with New Deal jobs like the **CCC** and **PWA**, and new soil science) or leaving for the West. Students live 7.7E and 7.9B instead of memorizing them — and learn that the environment answers back when you change it (7.9A).

**Winning vs. accuracy:** meters show how the family fares; **accuracy** shows how sound the choices were, judged by what actually helped families survive. The **stay-or-go decision itself has two right answers** — the only wrong answer is doing nothing.

---

## 2. Historical Content Bank

From your Unit 7 outline (Dust Bowl in the Panhandle; families forced out; FDR's New Deal — CCC and PWA) plus supporting detail.

### 2.1 The arc (1931–1941)
- **The great plow-up (1920s):** wheat prices soared in WWI and after; farmers plowed up millions of acres of native grass — the deep roots that held the Panhandle's soil down.
- **The crash (1929–31):** wheat prices collapsed; then the rain stopped.
- **The dusters (1932–35):** drought turned loose soil to dust; "black blizzards" rolled like walls, turning day to night. Dust got into food, lungs, and everything else — **dust pneumonia** sickened children and elders. Families hung wet sheets over windows and strung rope lines to the barn.
- **Black Sunday — April 14, 1935:** the worst duster of all swept the Panhandle; the term "Dust Bowl" was coined days after.
- **The response — staying:** New Deal programs from your outline: the **CCC** (Civilian Conservation Corps — young men earned $30 a month, $25 sent home) and **PWA/WPA** public works jobs; plus the **Soil Conservation Service** teaching contour plowing, terracing, and returning fields to grass. The land — and the families — slowly recovered; rain returned by 1939–41, and wartime work finished the rescue.
- **The response — leaving:** thousands of families packed trucks and drove **Route 66** west to California's fields. Work was scarce, wages low, and migrants met scorn (called "Okies" no matter where they were from). Government **farm camps** (like the FSA's) offered clean water, safety, and dignity. Migrant families endured and built new lives.
- **The lesson underneath (7.9A/B):** plowing away the grass helped cause it; planting grass and plowing with the curve of the land helped end it. The environment answers back.

### 2.2 The three families (the variants)
| | **Farm-Owner family** | **Tenant-Farmer family** | **Town family** |
|---|---|---|---|
| **Who** | Own their land and a mortgaged tractor | Farm a landlord's acres for a share | Run the general store in a small Panhandle town |
| **Biggest fear** | The bank and the mortgage | The landlord's letter ("tractored out") | Customers who can't pay |
| **Signature choices** | Terracing and soil contracts vs. squeezing one more wheat crop | Garden, cream and eggs, relief work — surviving on almost nothing | How much credit to extend; the town's survival is yours |
| **Stay path** | Soil Conservation demonstration farm; AAA-style payments; hold the land | Move to town, WPA/PWA work, son to the CCC | WPA projects bring payrolls; the store hangs on |
| **Go path** | Sell out to a neighbor; start over in California groves | The classic Route 66 journey; field work; an FSA camp | Sell the store; a cousin's grocery in Bakersfield |

### 2.3 Vocabulary (define on first use)
- **Drought** — a long time with almost no rain.
- **Black blizzard** — a giant rolling wall of dust.
- **Tenant farmer** — a family who farms land they don't own, paying with a share of the crop.
- **CCC** — the Civilian Conservation Corps, a New Deal program that hired young men for outdoor work ($30 a month, $25 sent home).
- **WPA / PWA** — New Deal programs that paid workers to build roads, schools, and public works.
- **Contour plowing** — plowing along the curve of the land so soil and water stay put.
- **Route 66** — the highway west that migrant families followed to California.

---

## 3. Core Mechanics

### 3.1 Meters (each 0–100, start 50)
- **Money** 💵 — cash, credit, and what the family owns.
- **Health** ❤️ — bodies and lungs in the dust years.
- **Hope** 🌅 — the family's spirit; the thing the Dust Bowl attacked hardest.

### 3.2 Structure — 6 chapters, 2 decisions each (the branch at #6)
- **Chapters 1–3 (decisions 1–6)** are the family's shared story: the crash, the dusters, Black Sunday — with family-specific choices.
- **Decision #6 is the BRANCH:** stay or go. **Both are right (1 point).** Only "wait and do nothing" is wrong.
- **Chapters 4–6 (decisions 7–12)** play the chosen path: the STAY story (relief work, CCC, soil conservation, the rains' return) or the GO story (the sale, Route 66, California and the camps).
- 12 graded actions; right = 1, partial = 0.5, wrong = 0; accuracy server-side, grouped by family type. The dashboard also shows which path each student chose (as information, not a grade — see Section 9).

### 3.3 Endings
**Family Score** = Money + Health + Hope → tiers ("Through the Storm" / "Still Standing" / "Battered but Together") — path-specific debriefs:
- **STAY debrief:** the rains return in 1939–41; grass and contour fields hold the soil; the New Deal's checks and the CCC's $25-home money carried thousands of Texas families across. The Panhandle learned to farm with the land, not against it (7.9A).
- **GO debrief:** by 1940 steady work returns — fields, then wartime plants; the family that left with a truck and each other has made a life. Migrant Texans and Okies helped build modern California, and their courage is part of Texas history too.
- Both end: *"Neither family was wrong. Holding on took courage. Letting go took courage. The Dust Bowl asked for both."* Replay nudge: a different family, the other path.

---

## 4. Reference Content — TENANT-FARMER FAMILY (complete, both branches)

The most common Dust Bowl story, written in full. Player-facing text at a 5th grade level. ✅ right · ⚠️ partial · ❌ wrong.

### Chapter 1 — 1931: "Wheat at Rock Bottom"
*Event:* You farm Mr. Harlan's half-section for a share of the crop. Wheat prices have crashed to almost nothing, and the landlord wants more acres plowed to make it up in bushels.

**Decision 1 — The landlord urges: plow the last pasture into wheat.**
- ✅ **Keep some ground in grass for the animals — plow most, not all.** Money +5, Hope +5. *"The old-timers said grass roots held this country down. Every acre of sod plowed was a bet the rain would keep its promise."*
- ⚠️ **Plant a big kitchen garden and lean on the cows and hens.** Money +5, Health +5. *"Smart survival — though the landlord grumbles about 'wasted' acres."*
- ❌ **Plow every inch — bushels are the only answer to cheap wheat.** Money +5, Hope −10. *"So plowed the whole Panhandle — and the loosened soil was waiting when the drought came. This choice helped make the disaster."*

**Decision 2 — Prices keep falling. How does the family eat this winter?**
- ✅ **Diversify: sell cream and eggs, trade garden truck, take odd jobs.** Money +10, Hope +5. *"Ten small streams beat one dry river. This is how tenant families actually held on."*
- ⚠️ **Sell the second team and tools you 'don't need.'** Money +10, Hope −10. *"Cash today — but a farmer without tools is one bad season from the road."*
- ❌ **Borrow big against next year's crop and double the wheat.** Money −10. *"Next year's crop is a promise the sky no longer keeps."*

### Chapter 2 — 1933–34: "The Dusters Come"
*Event:* The rain has simply stopped. Some afternoons the northern sky turns brown, then black, and a wall of dust rolls over the section like a slow wave.

**Decision 3 — A black blizzard is coming and the children are walking home from school.**
- ✅ **Go get them now; then wet sheets over the windows and a rope line from house to barn.** Health +15. *"Exactly what Panhandle families learned to do. People lost in a duster couldn't see their own hands — the rope line saved lives."*
- ⚠️ **Drive toward town to outrun it.** Health −5. *"Engines choked and windshields went black. Outrunning a duster was a gamble."*
- ❌ **Finish the field work first — it's only dirt.** Health −15. *"'Only dirt' put children and old folks in bed with dust pneumonia. The storms were not weather to work through."*

**Decision 4 — The baby has a rattling cough. The doctor says dust pneumonia is going around.**
- ✅ **Red Cross masks, wet cloths over faces, seal the baby's room, and rest.** Health +10, Money −5. *"The Red Cross really did hand out masks. Sealed rooms and care brought most of the sick through."*
- ⚠️ **Send the little ones to their aunt in town till the storms ease.** Health +10, Hope −10. *"Safer air, and an empty house. Plenty of families split up for a season — it cost something."*
- ❌ **It will pass — children are tough.** Health −15. *"Dust pneumonia killed. This was not a cough to wait out."*

### Chapter 3 — April 14, 1935: "Black Sunday" — and the Branch
*Event:* A Sunday so clear people had picnics — then, at midafternoon, a black wall three hundred feet high rolls out of the north, and day becomes midnight. Afterward, Mr. Harlan's letter comes: he has bought a tractor. He won't need tenant families next year.

**Decision 5 — Black Sunday hits while the family is scattered.**
- ✅ **Everyone to shelter — count heads, save what animals you can reach, let the rest go.** Health +10, Hope +5. *"People first. Panhandle families told this story for the rest of their lives — the day the world went dark at three in the afternoon."*
- ⚠️ **Save the milk cows first — they're the living.** Money +5, Health −10. *"The cows are tomorrow's cream money — but someone's lungs paid for the trip to the barn."*
- ❌ **Try to drive out from under it.** Health −15. *"Cars died mid-road on Black Sunday. Some drivers were found by the rope lines, some weren't."*

**Decision 6 — THE BRANCH. The landlord's letter is on the table: tractored out. What does this family do?**
- ✅ **STAY: move into town, take relief work, and rebuild here.** Hope +10. → *branch: STAY.* *"Thousands of Texas families stayed and fought it out. There was help coming — and this is your country."*
- ✅ **GO WEST: sell what you can, pack the truck, take Route 66 to California.** Hope +10. → *branch: GO.* *"Thousands of families went. It wasn't giving up — it was starting over, and it took all the courage a family had."*
- ❌ **Wait. Maybe Mr. Harlan will change his mind. Maybe it will rain.** Hope −15. *"The letter won't unwrite itself, and the sky owes you nothing. Waiting without a plan was the one sure way to lose."*

---

### STAY BRANCH — Chapters 4–6

### Chapter 4S — 1935–36: "Town, and Work with a Name on It"
*Event:* A rented house at the edge of town. The county office posts New Deal work: roads, a school addition, a sewing room. And a CCC recruiter is signing up young men.

**Decision 7S — Work is offered, but some neighbors call relief work charity.**
- ✅ **Take the WPA road job with your head up — it's wages for work.** Money +15, Hope +5. *"New Deal jobs built roads, schools, and courthouses across the Panhandle — and kept families whole. Work is work."*
- ⚠️ **Take county food aid but skip the job — the farm might still call you back.** Money +5, Hope −5. *"Aid kept bodies fed; a job fed something more."*
- ❌ **Refuse it all — this family doesn't take government anything.** Money −15. *"Pride is poor bread. Families that refused everything broke hardest."*

**Decision 8S — Your oldest son, seventeen, wants to join the CCC.**
- ✅ **Sign the papers — $30 a month, $25 of it sent straight home.** Money +10, Hope +10. *"The CCC's arithmetic saved families: twenty-five dollars home every month, and a son learning trades, planting trees, and eating three squares."*
- ⚠️ **Keep him home to hunt for local work.** Money +5. *"Local work was scarce as rain — but the family stays together."*
- ❌ **Send him hoboing to look for factory work up north.** Health −10, Hope −5. *"The rails were full of hungry boys already. The CCC existed exactly so they didn't have to."*

### Chapter 5S — 1937–38: "Farming with the Land"
*Event:* A government soil man comes to town: the Soil Conservation Service is paying farmers to plow along the curves of the land, terrace slopes, and put worn-out fields back to grass. Mr. Harlan, humbled by his blowing acres, asks if your family would run his place the new way.

**Decision 9S — Harlan's offer: come back as his operator, farming the conservation way.**
- ✅ **Take it — contour rows, terraces, grass on the worst ground.** Money +10, Hope +15. *"This is how the Panhandle healed: farming with the land instead of against it. The blowing slowed wherever the new methods took hold."* (7.9A in one choice.)
- ⚠️ **Take the place, but farm it the old straight-row way you know.** Money +5, Hope −5. *"Old habits plow straight into the wind."*
- ❌ **Turn it down — never work that land again.** Hope −10. *"Understandable. But it closes the door the story wants to walk through."*
*(Farm-Owner variant of this chapter: sign the soil contracts on your own land. Town variant: extend the store's credit to conservation farmers.)*

**Decision 10S — A neighbor family, worse off than you, is selling out at cruel prices.**
- ✅ **Help them — a fair price for the milk cow, a meal, and no judgment either way they choose.** Hope +15. *"Dust Bowl neighbors carried each other. Every family remembered who helped."*
- ⚠️ **Buy their good plow cheap — business is business.** Money +10, Hope −10. *"Legal, common, and remembered."*
- ❌ **Stay clear — hard luck might be catching.** Hope −10. *"It wasn't catching. It was already everywhere. Only the helping helped."*

### Chapter 6S — 1939–41: "The Rain Comes Back"
*Event:* One evening the air smells different. Real rain — soaking, steady — and the terraced fields hold it. Wheat prices tick up as war rumbles overseas, and the county's new roads carry new work.

**Decision 11S — First good crop coming. What do you do with it?**
- ✅ **Pay down every debt, bank a little, and keep the grass strips in.** Money +15, Hope +5. *"Families who came through remembered exactly what saved them — and didn't plow it back up."*
- ⚠️ **Expand fast — rent more acres while land is cheap.** Money +5. *"The rain is back. It made no promises."*
- ❌ **Celebrate big — the hard years are over.** Money −10. *"The hard years taught one thing: keep a reserve."*

**Decision 12S — Looking back from the porch, what do you tell the children this was?**
- ✅ **The truth: the plows helped cause it, the people and the programs helped end it, and this family held.** Hope +15. *"That's the whole lesson, told on a porch: 7.9A and 7.7E in one sentence, and your family's own story besides."*
- ⚠️ **Just bad luck and bad weather.** Hope +5. *"Half the story. The grass knew the other half."*
- ❌ **Never speak of it.** Hope −5. *"Stories buried don't teach. This one had to be told — that's why we remember it."*

---

### GO BRANCH — Chapters 4–6

### Chapter 4G — 1935: "The Truck, Loaded"
*Event:* The Ford truck can carry only so much. Everything else sells in the yard for pennies or stays behind.

**Decision 7G — What rides west?**
- ✅ **Tools, bedding, the water bags, seed money sewn in a coat — and Grandma's Bible for the heart.** Money +10, Hope +5. *"Migrant families learned it fast: carry what makes work and warmth. One small treasure for the spirit is provisions too."*
- ⚠️ **The piano — it's who we are.** Hope +10, Money −10. *"Some families did. Half of them sold the piano in Amarillo, a quarter in Albuquerque."*
- ❌ **Everything — roped high like a haystack.** Money −10, Health −5. *"Overloaded trucks broke axles by Tucumcari. The road west was littered with what wouldn't fit after all."*

**Decision 8G — Route 66, high desert ahead. How do you run the road?**
- ✅ **Drive the cool hours, rest the engine, fill every water bag at every stop.** Health +10, Money +5. *"The desert crossings were graveyards for hot engines. Night drivers made California."*
- ⚠️ **Push hard — money burns every day you're on the road.** Money +5, Health −10. *"True. So do radiators."*
- ❌ **Detour chasing rumored work in the mining towns.** Money −10. *"Rumors paid in rumors. The families that made it kept west."*

### Chapter 5G — 1936: "California Is Not a Promise"
*Event:* Handbills said pickers were wanted. So came ten families for every job. Some locals sneer "Okies" at Texas plates. Outside town there's a ditch-bank camp — and, down the road, a clean government farm camp with cabins, water, and a committee of the families themselves.

**Decision 9G — Where does the family live?**
- ✅ **The government farm camp — clean water, safety, school for the kids, dignity.** Health +15, Hope +10. *"The FSA camps were built for exactly this family. Clean water and self-respect were the two things the road tried hardest to take."*
- ⚠️ **The ditch-bank camp — it's free and near the fields.** Money +5, Health −15. *"Free cost the most: bad water, sickness, and no one to stand with you."*
- ❌ **Split up — each worker to a different county's crop.** Hope −15. *"Families that scattered often stayed scattered. Together was the last thing you owned."*

**Decision 10G — A grower posts wages, then cuts them at the weigh-in. The pickers look to each other.**
- ✅ **Stand with the other families — respectfully, together, for the posted wage.** Hope +15, Money −5. *"Migrant families learned that alone they were cheap and together they were people. It didn't always win — it always mattered."*
- ⚠️ **Take the cut — beans tonight beat principle tonight.** Money +5, Hope −10. *"No one can judge a hungry family. But the cut came again next week."*
- ❌ **Argue alone and loudly.** Money −10. *"Alone and loud got a family blacklisted from the field."*

### Chapter 6G — 1938–41: "New Ground"
*Event:* Seasons of fieldwork turn into steadier things: a foreman's job, school shoes, and — as war work opens — hiring signs at the coast plants.

**Decision 11G — The chance: a year-round farm job inland, or defense-plant work by the coast?**
- ✅ **Take the steady work, keep the kids in one school, save for a small place.** Money +15, Hope +10. *"However each family chose, the winning move was the same: steadiness. By 1941 the road years were ending; the settled years were starting."*
- ⚠️ **Keep following the crops — it's what you know now.** Money +5. *"The crops would always need hands. The kids needed one school more."*
- ❌ **Bet the savings on a fruit stand in a town you've known a month.** Money −15. *"Some bets paid. This one, mostly, didn't."*

**Decision 12G — A letter home to the Panhandle. What do you write?**
- ✅ **The truth with your head up: it was hard, we are making it, and Texans out here helped build this place too.** Hope +15. *"So they did — the families who went west carried Texas with them and built lives worth writing home about. Courage went both directions on Route 66."*
- ⚠️ **Only the good parts.** Hope +5. *"Kind, and half true."*
- ❌ **Nothing — that life is behind us.** Hope −5. *"The letter matters because both stories are one story. It deserved telling."*

---

## 5. Content Matrix — the Other Two Families

Same chapter beats; Fable writes them from these rows. Chapters 4–6 reuse the STAY/GO spines above with family-specific texture.

### Farm-Owner family
| Ch | Beat | Family-specific tension |
|---|---|---|
| 1 | The mortgage on the new tractor vs. cheap wheat | The bank note is the landlord: plow more, or diversify and bargain with the banker (✅ negotiate + diversify) |
| 2 | Dusters bury fences and strip fields | Protecting equipment AND lungs; ❌ is always machines-before-people |
| 3 | Black Sunday + the bank's letter (payment due) | BRANCH: stay (soil contracts, AAA-style payments, hold the land) / go (sell to the neighbor, start over) — both ✅ |
| 4S–6S | Conservation contracts on *your own* land; the demonstration-farm pride; the first held crop pays the bank | The owner's stay-story is the land-healing story |
| 4G–6G | The auction of a family's own place (handled gently); the same road west with a little more money and just as much grief | The owner's go-story: even "better off" families broke; dignity is not income |

### Town family (the general store)
| Ch | Beat | Family-specific tension |
|---|---|---|
| 1 | Farmers can't pay cash; the credit ledger grows | ✅ extend careful credit (the town survives together); ❌ cash-only (the store dies alone) |
| 2 | Dust ruins stock; the store as the town's storm shelter | ✅ open the doors during dusters |
| 3 | Black Sunday + the wholesaler cuts you off | BRANCH: stay (WPA payrolls arrive, the store hangs on) / go (sell out, the cousin's grocery in Bakersfield) — both ✅ |
| 4S–6S | WPA workers' wages flow through town; school addition built; the ledger's old debts honored slowly | The town's stay-story: public works saved main streets, not just farms |
| 4G–6G | Selling a name-above-the-door; grocery work in a valley town; extending credit to *other* migrants (the circle completes) | The town's go-story: the skills traveled; so did the kindness |

---

## 6. Engine Integration — including the branching extension

- **New adapter:** `server/src/games/dustBowl.js` — solo-only, `totalActions: 12`, meters `{ money, health, hope }` start 50.
- **Variants:** the pick screen sets `owner` | `tenant` | `town`. The branch then narrows it: step lists exist for **six composite keys** — `tenant_stay`, `tenant_go`, `owner_stay`, `owner_go`, `town_stay`, `town_go` — where each pair shares an **identical first 6 steps** (the family's Chapters 1–3).
- **The one engine change (2 lines, for Opus):** allow a choice to carry `setVariant`. In `_stepGame.js`'s `resolve()`, after applying effects:
  ```js
  if (choice.setVariant) ss.key = choice.setVariant;   // branch: swap step list
  ```
  The student joins as `tenant` → adapter maps it to `tenant_stay` as the default full list → at decision #6, the STAY choice carries `setVariant: 'tenant_stay'` (no-op) and the GO choice carries `setVariant: 'tenant_go'`. Because both lists' first 6 steps are identical, the cursor (already at 6) continues seamlessly into the chosen second half. No other engine code changes.
- **Dashboard grouping:** group by the **base family** (strip `_stay`/`_go` for the accuracy groups); show the path as a roster column. The engine's roster already carries the variant key — the Command Center formats it as "Tenant · Go west."
- Register in `games/index.js`; sessions use `{ gameId: 'dust-bowl', mode: 'solo' }`. All else stock.
- **Client:** pick screen (three family cards) → chapter loop (event card → decisions) → path-specific ending. No map component — the lightest client after President of the Republic. An optional Route 66 progress strip for the GO branch is a nice Sonnet flourish, not a requirement.

## 7. Visual & Audio Assets (Higgsfield MCP)

**Art direction:** *Semi-realistic cinematic historical illustration, Texas Panhandle and Route 66, 1931–1941. The dignity of Dorothea Lange's photographs: worn but unbroken people, honest light. Hope lives in every frame's corner. No despair for its own sake. No text or logos. 16:9.*

| # | Asset | Prompt sketch |
|---|---|---|
| 1 | Title / hero | "A Panhandle farmhouse under an enormous sky, a wall of dust rising far on the horizon, a family pausing in the yard to look north — calm before the storm, dignified." |
| 2–4 | Family cards ×3 | "A farm-owner family by their tractor and windmill" / "a tenant family on the porch of a plain rented farmhouse" / "a family in the doorway of a small-town general store" — each worn, warm, and proud. |
| 5 | Ch 2 — the duster | "A black blizzard rolling over flat wheat country like a mountain range on the move, a tiny truck racing ahead of it on a dirt road — awe, not horror." |
| 6 | Ch 3 — Black Sunday | "Mid-afternoon turned to night: a farm family sheltering indoors by lamplight, wet sheets over the windows, dust sifting gold in the lamp glow — close, quiet, safe together." |
| 7 | STAY — the work | "WPA workers building a farm-to-market road outside a Panhandle town, scaffolding on a new school behind them — purpose and payday." |
| 8 | STAY — the healing | "Contour-plowed fields curving with the land beside strips of restored grass, first green after rain, a rainbow of ordinary sky." |
| 9 | GO — Route 66 | "A loaded 1930s truck heading west on an empty two-lane highway at dawn, mountains far ahead, a child asleep on the bedding — hard road, held family." |
| 10 | GO — the camp | "A clean government farm camp: neat cabins, a water tower, children playing after school, mothers talking — dignity restored." |
| 11 | *(Optional)* loop/ambience | Slow wind and a distant windmill creak; for GO, tires on empty highway. Muted by default. |

## 8. Model Workflow

| Model | Use for |
|---|---|
| **Fable** | This is the most writing-rich game of the four: the tenant reference already written here, plus the owner and town families (Section 5 matrices) and all path endings — six stories, one steady, warm 5th grade voice. |
| **Opus** | The adapter with the six composite step lists, the **2-line `setVariant` engine extension**, the family→path variant plumbing, the Command Center's base-family grouping + path column. |
| **Sonnet** | Screens, family cards, the optional Route 66 progress strip, art wiring, responsiveness, tests. |
| **Higgsfield** | Images per Section 7 — hold the Lange-dignity line firmly. |

Order: Fable content → Opus adapter + extension → Higgsfield art → Sonnet polish → GitHub → Render → Wix (standard steps).

## 9. Teacher Command Center

Standard shared-engine Command Center. Specifics: accuracy grouped by **family type** — *"Farm-Owner — 8 — 81% · Tenant — 9 — 84% · Town — 7 — 76%"* — plus a **path column** on the roster ("Tenant · Stayed" / "Tenant · Went west"). The path is shown as information, never as a grade: both choices scored equally. (A nice class discussion starter: "our class split 60/40, just like real families did.") PDF: Students (Name · Family · Path · Status · Accuracy %) + class accuracy by family. Footer: "7th Grade Texas History · Surviving the Dust Bowl · TEKS 7.7E, 7.9B." Session-only data; delete-on-end box; idle sweep.

## 10. Build Checklist & Test Plan (delta from the standard)

- [ ] All six composite step lists filled; each stay/go pair's first 6 steps byte-identical
- [ ] `setVariant` extension added to `_stepGame.js` (2 lines) and covered by a smoke test: branch at step 6 → correct second half plays → accuracy still /12
- [ ] Both branch choices at decision #6 score as right; "wait" scores wrong
- [ ] Family pick sets the variant; dashboard groups by base family and shows the path column
- [ ] All-right = 100% down all six paths (test at least tenant_stay and tenant_go end-to-end)
- [ ] CCC arithmetic ($30/$25 home) and contour plowing appear in the STAY path; FSA-style camp and Route 66 in the GO path; the plow-up cause named in Chapter 1 (7.9A/B)
- [ ] Both debriefs end on the both-were-brave line
- [ ] Standard items: reading level, alt text, responsive, no browser storage, session-only data, PDF, end-session box

## 11. Teacher / Sensitivity Notes

- **Dignity is the design rule.** Real families lived this; some students' great-grandparents did. Hardship is shown honestly — dust pneumonia, the tractored-out letter, the ditch-bank camp — but every frame and feedback line leaves the family their self-respect.
- **"Okie" appears once, in quotes, as a slur others use** — never as the game's own word for migrants. The GO debrief turns it: the people so mocked helped build modern California.
- **Stay and go are equal.** The branch decision awards the point either way, the dashboard shows the path without ranking it, and both debriefs say plainly that both choices took courage. Guard this in every generated line — it's the moral center of the game.
- **The environmental cause is taught without blaming the families:** the plow-up was what everyone knew to do, until the land taught otherwise. Chapter 1's feedback and the STAY debrief carry 7.9A's lesson — people changed the land, the land answered, people learned.
- **New Deal content stays concrete, not political:** jobs, checks, roads, trees, soil — the programs from your outline (CCC, PWA/WPA), by name and by what they did for one family.
- **Faith and family artifacts** (the Bible in the truck, the piano) are handled warmly and briefly — texture, not preaching.

---
*Companion to Survive the Season, Claim the Land, Hold the Line, President of the Republic, Run the Blockade, and Trail Boss. Shared engine (solo mode + the 2-line branch extension), same Command Center, same GitHub → Render → Wix workflow.*
