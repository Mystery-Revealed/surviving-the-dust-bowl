// dustBowl.js — Unit 7 game adapter: "Surviving the Dust Bowl" (SOLO, branching
// variant pick). The student guides a Texas Panhandle FAMILY — Farm-Owner,
// Tenant-Farmer, or Town (general store) — through the Dust Bowl years (1931–1941).
//
// 6 chapters × 2 decisions = 12 graded actions. Meters money/health/hope start at
// 50. Chapters 1–3 are the family's shared story (the crash, the dusters, Black
// Sunday). DECISION #6 IS THE BRANCH: STAY or GO WEST — BOTH are right (1 point);
// only "wait and do nothing" is wrong. Chapters 4–6 play the chosen path.
//
// The answer key (verdicts/effects/feedback) lives HERE, on the server; the client
// sees labels only. Student-facing text is written at a 5th grade reading level
// (spec rule). TEKS 7.7E (Great Depression / Dust Bowl / New Deal — CCC, PWA/WPA),
// 7.9B (the Dust Bowl as a geographic factor), 7.9A (the environment answers back).
//
// TONE (spec §11): resilience and hard choices with DIGNITY — no despair for its
// own sake, no mocking of migrants. Staying took courage. Leaving took courage.
// The stay-or-go branch has TWO right answers; guard that in every line.
//
// CONTENT PROVENANCE: the TENANT family is the spec's fully written reference
// (§4), untouched. The OWNER and TOWN families are written to the same beats
// (§5 matrix) with identical scoring balance, voiced to match the tenant
// reference — the owner's story runs on the deed and the bank note; the town's
// on the counter, the ledger, and the name above the door.

import { createStepGame } from './_stepGame.js';

// ---------------------------------------------------------------------------
// Meters + families (shipped to clients at match:begin — display info only)
// ---------------------------------------------------------------------------

export const METERS = {
  money:  { name: 'Money',  icon: 'money',  blurb: 'Cash, credit, and what the family owns.' },
  health: { name: 'Health', icon: 'health', blurb: 'Bodies and lungs in the dust years.' },
  hope:   { name: 'Hope',   icon: 'hope',   blurb: 'The family’s spirit — what the Dust Bowl attacked hardest.' },
};

export const START_METERS = { money: 50, health: 50, hope: 50 };

export const FAMILIES = {
  owner: {
    key: 'owner', name: 'Farm-Owner family', image: 'card_owner.jpg',
    tag: 'Own their land — and a mortgaged tractor',
    blurb: 'You own your half-section, but the new tractor came with a bank note that’s due whether wheat sells or not. Your biggest fear is the bank.',
  },
  tenant: {
    key: 'tenant', name: 'Tenant-Farmer family', image: 'card_tenant.jpg',
    tag: 'Farm a landlord’s land for a share',
    blurb: 'You farm Mr. Harlan’s acres for a share of the crop, surviving on almost nothing. Your biggest fear is the landlord’s letter.',
  },
  town: {
    key: 'town', name: 'Town family', image: 'card_town.jpg',
    tag: 'Run the general store',
    blurb: 'You keep the general store in a small Panhandle town. When the farmers can’t pay, the whole town leans on your credit ledger. The town’s survival is yours.',
  },
};

// ---------------------------------------------------------------------------
// Content builders. A choice: { label, verdict, effects, feedback, setVariant? }.
// ✅ right (+1) · ⚠️ partial (+0.5) · ❌ wrong (0). Accuracy is verdict-only; the
// meters can tell a different story than the score, by design.
// ---------------------------------------------------------------------------

const step = (prompt, choices) => ({ kind: 'decision', prompt, choices });
const phase = (title, date, image, event, s1, s2) => ({ title, date, image, event, steps: [s1, s2] });

const IMG = {
  crash: 'event_crash.jpg',
  duster: 'event_duster.jpg',
  blackSunday: 'event_blacksunday.jpg',
  wpa: 'event_wpa.jpg',
  healing: 'event_healing.jpg',
  route66: 'event_route66.jpg',
  camp: 'event_camp.jpg',
};

// The branch choices, built per family so the ✅ STAY / ✅ GO / ❌ WAIT trio is
// identical in shape across families. STAY and GO are BOTH right (spec §3.2).
const branchStep = (family) => step(
  'The letter is on the table. What does this family do?',
  [
    { label: family === 'town'
        ? 'STAY: hang on — New Deal payrolls are coming to town, and the store can serve them.'
        : family === 'owner'
        ? 'STAY: sign the soil-conservation contracts, take the payments, and hold the land.'
        : 'STAY: move into town, take relief work, and rebuild here.',
      verdict: 'right', effects: { hope: 10 }, setVariant: `${family}_stay`,
      feedback: 'Thousands of Texas families stayed and fought it out. There was help coming — and this is your country. Staying took courage.' },
    { label: family === 'town'
        ? 'GO WEST: sell the store, pack the truck, and join a cousin’s grocery in Bakersfield.'
        : family === 'owner'
        ? 'GO WEST: sell out to a neighbor at a fair price, pack the truck, and start over in California.'
        : 'GO WEST: sell what you can, pack the truck, and take Route 66 to California.',
      verdict: 'right', effects: { hope: 10 }, setVariant: `${family}_go`,
      feedback: 'Thousands of families went. It wasn’t giving up — it was starting over, and it took all the courage a family had.' },
    { label: 'Wait. Maybe things will change. Maybe it will rain.',
      verdict: 'wrong', effects: { hope: -15 },
      feedback: 'The letter won’t unwrite itself, and the sky owes you nothing. Waiting without a plan was the one sure way to lose.' },
  ],
);

// ===========================================================================
// TENANT-FARMER FAMILY — the spec's fully written reference (§4).
// ===========================================================================

const TENANT_SHARED = [
  phase('Wheat at Rock Bottom', '1931', IMG.crash,
    'You farm Mr. Harlan’s half-section for a share of the crop. Wheat prices have crashed to almost nothing, and the landlord wants more acres plowed to make it up in bushels.',
    step('The landlord urges: plow the last pasture into wheat.', [
      { label: 'Keep some ground in grass for the animals — plow most, not all.',
        verdict: 'right', effects: { money: 5, hope: 5 },
        feedback: 'The old-timers said grass roots held this country down. Every acre of sod plowed was a bet the rain would keep its promise.' },
      { label: 'Plant a big kitchen garden and lean on the cows and hens.',
        verdict: 'partial', effects: { money: 5, health: 5 },
        feedback: 'Smart survival — though the landlord grumbles about “wasted” acres.' },
      { label: 'Plow every inch — bushels are the only answer to cheap wheat.',
        verdict: 'wrong', effects: { money: 5, hope: -10 },
        feedback: 'So plowed the whole Panhandle — and the loosened soil was waiting when the drought came. This choice helped make the disaster.' },
    ]),
    step('Prices keep falling. How does the family eat this winter?', [
      { label: 'Diversify: sell cream and eggs, trade garden truck, take odd jobs.',
        verdict: 'right', effects: { money: 10, hope: 5 },
        feedback: 'Ten small streams beat one dry river. This is how tenant families actually held on.' },
      { label: 'Sell the second team and tools you “don’t need.”',
        verdict: 'partial', effects: { money: 10, hope: -10 },
        feedback: 'Cash today — but a farmer without tools is one bad season from the road.' },
      { label: 'Borrow big against next year’s crop and double the wheat.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'Next year’s crop is a promise the sky no longer keeps.' },
    ]),
  ),
  phase('The Dusters Come', '1933–34', IMG.duster,
    'The rain has simply stopped. Some afternoons the northern sky turns brown, then black, and a wall of dust rolls over the section like a slow wave.',
    step('A black blizzard is coming and the children are walking home from school.', [
      { label: 'Go get them now; then wet sheets over the windows and a rope line from house to barn.',
        verdict: 'right', effects: { health: 15 },
        feedback: 'Exactly what Panhandle families learned to do. People lost in a duster couldn’t see their own hands — the rope line saved lives.' },
      { label: 'Drive toward town to outrun it.',
        verdict: 'partial', effects: { health: -5 },
        feedback: 'Engines choked and windshields went black. Outrunning a duster was a gamble.' },
      { label: 'Finish the field work first — it’s only dirt.',
        verdict: 'wrong', effects: { health: -15 },
        feedback: '“Only dirt” put children and old folks in bed with dust pneumonia. The storms were not weather to work through.' },
    ]),
    step('The baby has a rattling cough. The doctor says dust pneumonia is going around.', [
      { label: 'Red Cross masks, wet cloths over faces, seal the baby’s room, and rest.',
        verdict: 'right', effects: { health: 10, money: -5 },
        feedback: 'The Red Cross really did hand out masks. Sealed rooms and care brought most of the sick through.' },
      { label: 'Send the little ones to their aunt in town till the storms ease.',
        verdict: 'partial', effects: { health: 10, hope: -10 },
        feedback: 'Safer air, and an empty house. Plenty of families split up for a season — it cost something.' },
      { label: 'It will pass — children are tough.',
        verdict: 'wrong', effects: { health: -15 },
        feedback: 'Dust pneumonia killed. This was not a cough to wait out.' },
    ]),
  ),
  phase('Black Sunday', 'April 14, 1935', IMG.blackSunday,
    'A Sunday so clear people had picnics — then, at midafternoon, a black wall three hundred feet high rolls out of the north, and day becomes midnight. Afterward, Mr. Harlan’s letter comes: he has bought a tractor. He won’t need tenant families next year.',
    step('Black Sunday hits while the family is scattered.', [
      { label: 'Everyone to shelter — count heads, save what animals you can reach, let the rest go.',
        verdict: 'right', effects: { health: 10, hope: 5 },
        feedback: 'People first. Panhandle families told this story for the rest of their lives — the day the world went dark at three in the afternoon.' },
      { label: 'Save the milk cows first — they’re the living.',
        verdict: 'partial', effects: { money: 5, health: -10 },
        feedback: 'The cows are tomorrow’s cream money — but someone’s lungs paid for the trip to the barn.' },
      { label: 'Try to drive out from under it.',
        verdict: 'wrong', effects: { health: -15 },
        feedback: 'Cars died mid-road on Black Sunday. Some drivers were found by the rope lines, some weren’t.' },
    ]),
    branchStep('tenant'),
  ),
];

const TENANT_STAY = [
  phase('Town, and Work with a Name on It', '1935–36', IMG.wpa,
    'A rented house at the edge of town. The county office posts New Deal work: roads, a school addition, a sewing room. And a CCC recruiter is signing up young men.',
    step('Work is offered, but some neighbors call relief work charity.', [
      { label: 'Take the WPA road job with your head up — it’s wages for work.',
        verdict: 'right', effects: { money: 15, hope: 5 },
        feedback: 'New Deal jobs built roads, schools, and courthouses across the Panhandle — and kept families whole. Work is work.' },
      { label: 'Take county food aid but skip the job — the farm might still call you back.',
        verdict: 'partial', effects: { money: 5, hope: -5 },
        feedback: 'Aid kept bodies fed; a job fed something more.' },
      { label: 'Refuse it all — this family doesn’t take government anything.',
        verdict: 'wrong', effects: { money: -15 },
        feedback: 'Pride is poor bread. Families that refused everything broke hardest.' },
    ]),
    step('Your oldest son, seventeen, wants to join the CCC.', [
      { label: 'Sign the papers — $30 a month, $25 of it sent straight home.',
        verdict: 'right', effects: { money: 10, hope: 10 },
        feedback: 'The CCC’s arithmetic saved families: twenty-five dollars home every month, and a son learning trades, planting trees, and eating three squares.' },
      { label: 'Keep him home to hunt for local work.',
        verdict: 'partial', effects: { money: 5 },
        feedback: 'Local work was scarce as rain — but the family stays together.' },
      { label: 'Send him hoboing to look for factory work up north.',
        verdict: 'wrong', effects: { health: -10, hope: -5 },
        feedback: 'The rails were full of hungry boys already. The CCC existed exactly so they didn’t have to.' },
    ]),
  ),
  phase('Farming with the Land', '1937–38', IMG.healing,
    'A government soil man comes to town: the Soil Conservation Service is paying farmers to plow along the curves of the land, terrace slopes, and put worn-out fields back to grass. Mr. Harlan, humbled by his blowing acres, asks if your family would run his place the new way.',
    step('Harlan’s offer: come back as his operator, farming the conservation way.', [
      { label: 'Take it — contour rows, terraces, grass on the worst ground.',
        verdict: 'right', effects: { money: 10, hope: 15 },
        feedback: 'This is how the Panhandle healed: farming with the land instead of against it. The blowing slowed wherever the new methods took hold.' },
      { label: 'Take the place, but farm it the old straight-row way you know.',
        verdict: 'partial', effects: { money: 5, hope: -5 },
        feedback: 'Old habits plow straight into the wind.' },
      { label: 'Turn it down — never work that land again.',
        verdict: 'wrong', effects: { hope: -10 },
        feedback: 'Understandable. But it closes the door the story wants to walk through.' },
    ]),
    step('A neighbor family, worse off than you, is selling out at cruel prices.', [
      { label: 'Help them — a fair price for the milk cow, a meal, and no judgment either way they choose.',
        verdict: 'right', effects: { hope: 15 },
        feedback: 'Dust Bowl neighbors carried each other. Every family remembered who helped.' },
      { label: 'Buy their good plow cheap — business is business.',
        verdict: 'partial', effects: { money: 10, hope: -10 },
        feedback: 'Legal, common, and remembered.' },
      { label: 'Stay clear — hard luck might be catching.',
        verdict: 'wrong', effects: { hope: -10 },
        feedback: 'It wasn’t catching. It was already everywhere. Only the helping helped.' },
    ]),
  ),
  phase('The Rain Comes Back', '1939–41', IMG.healing,
    'One evening the air smells different. Real rain — soaking, steady — and the terraced fields hold it. Wheat prices tick up as war rumbles overseas, and the county’s new roads carry new work.',
    step('First good crop coming. What do you do with it?', [
      { label: 'Pay down every debt, bank a little, and keep the grass strips in.',
        verdict: 'right', effects: { money: 15, hope: 5 },
        feedback: 'Families who came through remembered exactly what saved them — and didn’t plow it back up.' },
      { label: 'Expand fast — rent more acres while land is cheap.',
        verdict: 'partial', effects: { money: 5 },
        feedback: 'The rain is back. It made no promises.' },
      { label: 'Celebrate big — the hard years are over.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'The hard years taught one thing: keep a reserve.' },
    ]),
    step('Looking back from the porch, what do you tell the children this was?', [
      { label: 'The truth: the plows helped cause it, the people and the programs helped end it, and this family held.',
        verdict: 'right', effects: { hope: 15 },
        feedback: 'That’s the whole lesson, told on a porch — the plows helped cause it, the people and the programs helped end it, and your family held.' },
      { label: 'Just bad luck and bad weather.',
        verdict: 'partial', effects: { hope: 5 },
        feedback: 'Half the story. The grass knew the other half.' },
      { label: 'Never speak of it.',
        verdict: 'wrong', effects: { hope: -5 },
        feedback: 'Stories buried don’t teach. This one had to be told — that’s why we remember it.' },
    ]),
  ),
];

const TENANT_GO = [
  phase('The Truck, Loaded', '1935', IMG.route66,
    'The Ford truck can carry only so much. Everything else sells in the yard for pennies or stays behind.',
    step('What rides west?', [
      { label: 'Tools, bedding, the water bags, seed money sewn in a coat — and Grandma’s Bible for the heart.',
        verdict: 'right', effects: { money: 10, hope: 5 },
        feedback: 'Migrant families learned it fast: carry what makes work and warmth. One small treasure for the spirit is provisions too.' },
      { label: 'The piano — it’s who we are.',
        verdict: 'partial', effects: { hope: 10, money: -10 },
        feedback: 'Some families did. Half of them sold the piano in Amarillo, a quarter in Albuquerque.' },
      { label: 'Everything — roped high like a haystack.',
        verdict: 'wrong', effects: { money: -10, health: -5 },
        feedback: 'Overloaded trucks broke axles by Tucumcari. The road west was littered with what wouldn’t fit after all.' },
    ]),
    step('Route 66, high desert ahead. How do you run the road?', [
      { label: 'Drive the cool hours, rest the engine, fill every water bag at every stop.',
        verdict: 'right', effects: { health: 10, money: 5 },
        feedback: 'The desert crossings were graveyards for hot engines. Night drivers made California.' },
      { label: 'Push hard — money burns every day you’re on the road.',
        verdict: 'partial', effects: { money: 5, health: -10 },
        feedback: 'True. So do radiators.' },
      { label: 'Detour chasing rumored work in the mining towns.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'Rumors paid in rumors. The families that made it kept west.' },
    ]),
  ),
  phase('California Is Not a Promise', '1936', IMG.camp,
    'Handbills said pickers were wanted. So came ten families for every job. Some locals sneer “Okies” at Texas plates. Outside town there’s a ditch-bank camp — and, down the road, a clean government farm camp with cabins, water, and a committee of the families themselves.',
    step('Where does the family live?', [
      { label: 'The government farm camp — clean water, safety, school for the kids, dignity.',
        verdict: 'right', effects: { health: 15, hope: 10 },
        feedback: 'The FSA camps were built for exactly this family. Clean water and self-respect were the two things the road tried hardest to take.' },
      { label: 'The ditch-bank camp — it’s free and near the fields.',
        verdict: 'partial', effects: { money: 5, health: -15 },
        feedback: 'Free cost the most: bad water, sickness, and no one to stand with you.' },
      { label: 'Split up — each worker to a different county’s crop.',
        verdict: 'wrong', effects: { hope: -15 },
        feedback: 'Families that scattered often stayed scattered. Together was the last thing you owned.' },
    ]),
    step('A grower posts wages, then cuts them at the weigh-in. The pickers look to each other.', [
      { label: 'Stand with the other families — respectfully, together, for the posted wage.',
        verdict: 'right', effects: { hope: 15, money: -5 },
        feedback: 'Migrant families learned that alone they were cheap and together they were people. It didn’t always win — it always mattered.' },
      { label: 'Take the cut — beans tonight beat principle tonight.',
        verdict: 'partial', effects: { money: 5, hope: -10 },
        feedback: 'No one can judge a hungry family. But the cut came again next week.' },
      { label: 'Argue alone and loudly.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'Alone and loud got a family blacklisted from the field.' },
    ]),
  ),
  phase('New Ground', '1938–41', IMG.camp,
    'Seasons of fieldwork turn into steadier things: a foreman’s job, school shoes, and — as war work opens — hiring signs at the coast plants.',
    step('The chance: a year-round farm job inland, or defense-plant work by the coast?', [
      { label: 'Take the steady work, keep the kids in one school, save for a small place.',
        verdict: 'right', effects: { money: 15, hope: 10 },
        feedback: 'However each family chose, the winning move was the same: steadiness. By 1941 the road years were ending; the settled years were starting.' },
      { label: 'Keep following the crops — it’s what you know now.',
        verdict: 'partial', effects: { money: 5 },
        feedback: 'The crops would always need hands. The kids needed one school more.' },
      { label: 'Bet the savings on a fruit stand in a town you’ve known a month.',
        verdict: 'wrong', effects: { money: -15 },
        feedback: 'Some bets paid. This one, mostly, didn’t.' },
    ]),
    step('A letter home to the Panhandle. What do you write?', [
      { label: 'The truth with your head up: it was hard, we are making it, and Texans out here helped build this place too.',
        verdict: 'right', effects: { hope: 15 },
        feedback: 'So they did — the families who went west carried Texas with them and built lives worth writing home about. Courage went both directions on Route 66.' },
      { label: 'Only the good parts.',
        verdict: 'partial', effects: { hope: 5 },
        feedback: 'Kind, and half true.' },
      { label: 'Nothing — that life is behind us.',
        verdict: 'wrong', effects: { hope: -5 },
        feedback: 'The letter matters because both stories are one story. It deserved telling.' },
    ]),
  ),
];

// ===========================================================================
// FARM-OWNER FAMILY — the §5 beats: the deed, the bank note, the tractor.
// ===========================================================================

const OWNER_SHARED = [
  phase('The Note and the Cheap Wheat', '1931', IMG.crash,
    'The half-section is yours — your name is on the deed, and the bank’s name is on the tractor. Wheat has crashed to almost nothing, and the note comes due in the fall whether the wheat sells or not. The banker taps his ledger and says the same word twice: bushels, bushels.',
    step('The banker urges: plow the last pasture into wheat to cover the note.', [
      { label: 'Keep some ground in grass — and sit down with the banker about smaller payments.',
        verdict: 'right', effects: { money: 5, hope: 5 },
        feedback: 'The old-timers said grass roots held this country down. And a banker would rather take a thin payment than an empty farm — asking was the brave, unglamorous, right thing.' },
      { label: 'Plant a big kitchen garden and lean on the cows and hens to ride it out.',
        verdict: 'partial', effects: { money: 5, health: 5 },
        feedback: 'Smart survival — the garden feeds the family. But the note doesn’t eat vegetables, and it isn’t getting smaller.' },
      { label: 'Plow every inch — more bushels is the only answer to the note.',
        verdict: 'wrong', effects: { money: 5, hope: -10 },
        feedback: 'So plowed the whole Panhandle — and the loosened soil was waiting when the drought came. This choice helped make the disaster.' },
    ]),
    step('The note comes due and wheat won’t cover it. How does the family hold on?', [
      { label: 'Diversify: cream and eggs, custom tractor work for the neighbors, and sell no ground.',
        verdict: 'right', effects: { money: 10, hope: 5 },
        feedback: 'Ten small streams beat one dry river. The tractor that put you in debt earns its keep plowing other men’s fields — and the land stays whole under your name.' },
      { label: 'Sell the second team and some tools you “don’t need.”',
        verdict: 'partial', effects: { money: 10, hope: -10 },
        feedback: 'Cash today — but a farmer without tools is one bad season from the road.' },
      { label: 'Borrow big against next year’s crop and buy the cheap land next door.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'Next year’s crop is a promise the sky no longer keeps. Two mortgages don’t float any better than one.' },
    ]),
  ),
  phase('The Dusters Come', '1933–34', IMG.duster,
    'The rain stops like a tap turned off. Dusters bury your fences to the top wire and strip the young wheat to bare dirt. In the shed sits machinery worth more than this year’s crop — and in the house, the lungs you love more than either.',
    step('A black blizzard is coming and the children are walking home from school.', [
      { label: 'Go get them now; then wet sheets over the windows and a rope line to the barn.',
        verdict: 'right', effects: { health: 15 },
        feedback: 'Exactly what Panhandle families learned to do. People lost in a duster couldn’t see their own hands — the rope line saved lives.' },
      { label: 'Drive toward town to outrun it.',
        verdict: 'partial', effects: { health: -5 },
        feedback: 'Engines choked and windshields went black. Outrunning a duster was a gamble.' },
      { label: 'Get the tractor and drill under cover first — machines cost money.',
        verdict: 'wrong', effects: { health: -15 },
        feedback: 'Steel can be bought back. A child’s lungs cannot. Machines before people was always the wrong order.' },
    ]),
    step('The baby has a rattling cough. The doctor says dust pneumonia is going around.', [
      { label: 'Red Cross masks, wet cloths over faces, seal the baby’s room, and rest.',
        verdict: 'right', effects: { health: 10, money: -5 },
        feedback: 'The Red Cross really did hand out masks. Sealed rooms and care brought most of the sick through.' },
      { label: 'Send the little ones to their aunt in town till the storms ease.',
        verdict: 'partial', effects: { health: 10, hope: -10 },
        feedback: 'Safer air, and an empty house. Plenty of families split up for a season — it cost something.' },
      { label: 'It will pass — there’s a farm to dig out.',
        verdict: 'wrong', effects: { health: -15 },
        feedback: 'Dust pneumonia killed. No field, no machine, no bank note was worth waiting out that cough.' },
    ]),
  ),
  phase('Black Sunday', 'April 14, 1935', IMG.blackSunday,
    'A Sunday so clear people had picnics — then, at midafternoon, a black wall three hundred feet high rolls out of the north, and day becomes midnight. Afterward the bank’s letter is waiting on the table: the note is past due. Pay it, sell the place, or lose it.',
    step('Black Sunday hits while the family is scattered across the section.', [
      { label: 'Everyone to shelter — count heads, save what stock you can reach, let the rest go.',
        verdict: 'right', effects: { health: 10, hope: 5 },
        feedback: 'People first. Panhandle families told this story for the rest of their lives — the day the world went dark at three in the afternoon.' },
      { label: 'Save the tractor first — it’s the family’s whole future.',
        verdict: 'partial', effects: { money: 5, health: -10 },
        feedback: 'The tractor is tomorrow’s crop — but someone’s lungs paid for the run to the shed.' },
      { label: 'Try to drive out from under it.',
        verdict: 'wrong', effects: { health: -15 },
        feedback: 'Cars died mid-road on Black Sunday. Some drivers were found by the rope lines, some weren’t.' },
    ]),
    branchStep('owner'),
  ),
];

const OWNER_STAY = [
  phase('Payments for Doing It Right', '1935–36', IMG.wpa,
    'The government man spreads maps on your kitchen table. Washington will pay you to rest the worn-out ground, grass over the blow acres, and try the new soil-saving ways. Some neighbors call it a handout. The ones already signing call it a rope thrown to a drowning man.',
    step('The soil program offers payments to rest acres and try conservation.', [
      { label: 'Sign the contracts — payments for grassing the worst ground, and your head held high.',
        verdict: 'right', effects: { money: 15, hope: 5 },
        feedback: 'Farm payments kept thousands of Texas owners on their own land. A check for healing your ground isn’t charity — it’s the country betting on you.' },
      { label: 'Take the payments, but keep farming the old way where the soil man can’t see.',
        verdict: 'partial', effects: { money: 5, hope: -5 },
        feedback: 'Half in, half out — and the acres you farmed the old way kept right on blowing.' },
      { label: 'Refuse it all — this family doesn’t take government anything.',
        verdict: 'wrong', effects: { money: -15 },
        feedback: 'Pride is poor bread. Owners who refused every program lost their land the fastest — to the very bank they were too proud to bargain with.' },
    ]),
    step('Your oldest son, seventeen, could work the place or join the CCC.', [
      { label: 'Sign the CCC papers — $30 a month, $25 sent home, and terraces learned.',
        verdict: 'right', effects: { money: 10, hope: 10 },
        feedback: 'The CCC’s arithmetic saved families: twenty-five dollars home every month, and a son learning the very skills that would heal this land.' },
      { label: 'Keep him home to work the place.',
        verdict: 'partial', effects: { money: 5 },
        feedback: 'Another pair of hands is worth something. The twenty-five dollars a month would have been worth more.' },
      { label: 'Send him hoboing north to look for factory work.',
        verdict: 'wrong', effects: { health: -10, hope: -5 },
        feedback: 'The rails were full of hungry boys already. The CCC existed exactly so they didn’t have to.' },
    ]),
  ),
  phase('The Demonstration Farm', '1937–38', IMG.healing,
    'The Soil Conservation Service wants your place for a demonstration farm — contour rows that curve with the land, terraces that catch the rain, grass strips that hold the ground. Farmers from three counties would come stand at your fence and watch it work. It’s an honor. It’s also a gamble, in front of everybody.',
    step('The Service’s offer: make your land the model the county learns from.', [
      { label: 'Say yes — contour rows, terraces, grass on the worst ground, and the gate open to every doubter.',
        verdict: 'right', effects: { money: 10, hope: 15 },
        feedback: 'This is how the Panhandle healed: farming with the land instead of against it — and neighbors believing their own eyes at your fence line.' },
      { label: 'Farm it the new way, but keep the visitors off — it’s private land.',
        verdict: 'partial', effects: { money: 5, hope: -5 },
        feedback: 'Your ground healed. The healing spread slower where nobody could watch it work.' },
      { label: 'Turn it down — plow it straight, the way your father did.',
        verdict: 'wrong', effects: { hope: -10 },
        feedback: 'Old habits plow straight into the wind.' },
    ]),
    step('A neighbor family, worse off than you, is selling out at cruel prices.', [
      { label: 'Help them — a fair price for their stock, a hot meal, and no judgment either way they choose.',
        verdict: 'right', effects: { hope: 15 },
        feedback: 'Dust Bowl neighbors carried each other. Every family remembered who helped.' },
      { label: 'Buy their best acres cheap — business is business.',
        verdict: 'partial', effects: { money: 10, hope: -10 },
        feedback: 'Legal, common, and remembered.' },
      { label: 'Stay clear — hard luck might be catching.',
        verdict: 'wrong', effects: { hope: -10 },
        feedback: 'It wasn’t catching. It was already everywhere. Only the helping helped.' },
    ]),
  ),
  phase('The First Held Crop', '1939–41', IMG.healing,
    'One evening the air smells different — rain, real rain, soaking and steady, and the terraces hold every drop of it. The wheat comes up thick as fur. War rumbles overseas and prices tick up. And in the desk drawer, the bank note is still waiting.',
    step('First good crop coming. What do you do with it?', [
      { label: 'Pay down the note, bank a little, and keep every grass strip in.',
        verdict: 'right', effects: { money: 15, hope: 5 },
        feedback: 'Families who came through remembered exactly what saved them — and didn’t plow it back up.' },
      { label: 'Expand fast — buy the cheap land you’ve been eyeing.',
        verdict: 'partial', effects: { money: 5 },
        feedback: 'The rain is back. It made no promises.' },
      { label: 'Celebrate big — the hard years are over.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'The hard years taught one thing: keep a reserve.' },
    ]),
    step('Looking back from the porch, what do you tell the children this was?', [
      { label: 'The truth: the plows helped cause it, the people and the programs helped end it, and this family held its land.',
        verdict: 'right', effects: { hope: 15 },
        feedback: 'That’s the whole lesson, told from a porch — and behind you, the proof: green fields curving with the land your family kept.' },
      { label: 'Just bad luck and bad weather.',
        verdict: 'partial', effects: { hope: 5 },
        feedback: 'Half the story. The grass knew the other half.' },
      { label: 'Never speak of it.',
        verdict: 'wrong', effects: { hope: -5 },
        feedback: 'Stories buried don’t teach. This one had to be told — that’s why we remember it.' },
    ]),
  ),
];

const OWNER_GO = [
  phase('The Auction', '1935', IMG.route66,
    'The land went to a neighbor at a fair price — better his name on it than the bank’s. The rest went under the auctioneer’s hammer in the yard: the drill, the good harrow, the hens. Nobody cried where the crowd could see. The truck can carry only so much of what’s left.',
    step('What rides west?', [
      { label: 'Tools, bedding, the water bags, the sale money sewn into a coat — and Grandma’s Bible for the heart.',
        verdict: 'right', effects: { money: 10, hope: 5 },
        feedback: 'Migrant families learned it fast: carry what makes work and warmth. One small treasure for the spirit is provisions too.' },
      { label: 'The parlor furniture — it’s who we are.',
        verdict: 'partial', effects: { hope: 10, money: -10 },
        feedback: 'Some families did. Most of the parlor was sold along the road, a piece at a town, before the state line.' },
      { label: 'Everything — roped high like a haystack.',
        verdict: 'wrong', effects: { money: -10, health: -5 },
        feedback: 'Overloaded trucks broke axles by Tucumcari. Even sale money couldn’t haul a whole farmhouse west.' },
    ]),
    step('Route 66, high desert ahead. How do you run the road?', [
      { label: 'Drive the cool hours, rest the engine, fill every water bag at every stop.',
        verdict: 'right', effects: { health: 10, money: 5 },
        feedback: 'The desert crossings were graveyards for hot engines. Night drivers made California.' },
      { label: 'Push hard — every day on the road spends money.',
        verdict: 'partial', effects: { money: 5, health: -10 },
        feedback: 'True. So do radiators.' },
      { label: 'Detour chasing rumored work in the mining towns.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'Rumors paid in rumors. The families that made it kept west.' },
    ]),
  ),
  phase('California Is Not a Promise', '1936', IMG.camp,
    'You arrive with more money than most, and learn what it buys: nothing but time. Handbills promised work; ten families came for every job. Some locals sneer “Okies” at the Texas plates — a deed you used to hold means nothing to a sneer. Outside town there’s a ditch-bank camp. Down the road, a clean government farm camp with cabins, water, and a committee of the families themselves.',
    step('Where does the family live?', [
      { label: 'The government farm camp — clean water, safety, school for the kids, dignity.',
        verdict: 'right', effects: { health: 15, hope: 10 },
        feedback: 'The FSA camps were built for exactly this family. Clean water and self-respect were the two things the road tried hardest to take.' },
      { label: 'The ditch-bank camp — it’s free and near the fields.',
        verdict: 'partial', effects: { money: 5, health: -15 },
        feedback: 'Free cost the most: bad water, sickness, and no one to stand with you.' },
      { label: 'Split up — each worker to a different county’s crop.',
        verdict: 'wrong', effects: { hope: -15 },
        feedback: 'Families that scattered often stayed scattered. Together was the last thing you owned.' },
    ]),
    step('A grower posts wages, then cuts them at the weigh-in. The pickers look to each other.', [
      { label: 'Stand with the other families — respectfully, together, for the posted wage.',
        verdict: 'right', effects: { hope: 15, money: -5 },
        feedback: 'Back home you hired harvest hands; now you are one. Alone they were cheap; together they were people. It didn’t always win — it always mattered.' },
      { label: 'Take the cut — beans tonight beat principle tonight.',
        verdict: 'partial', effects: { money: 5, hope: -10 },
        feedback: 'No one can judge a hungry family. But the cut came again next week.' },
      { label: 'Argue alone and loudly.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'Alone and loud got a family blacklisted from the field.' },
    ]),
  ),
  phase('New Ground', '1938–41', IMG.camp,
    'Fieldwork turns into steadier things: a foreman’s job — you know how a farm runs — school shoes, and, as war work opens, hiring signs at the coast plants. The deed is a memory now. The knowing isn’t.',
    step('The chance: a year-round farm job inland, or defense-plant work by the coast?', [
      { label: 'Take the steady work, keep the kids in one school, save for a small place of your own again.',
        verdict: 'right', effects: { money: 15, hope: 10 },
        feedback: 'The winning move was steadiness. By 1941 the road years were ending — and a family that owned land once knew how to own it again.' },
      { label: 'Keep following the crops — it’s what you know now.',
        verdict: 'partial', effects: { money: 5 },
        feedback: 'The crops would always need hands. The kids needed one school more.' },
      { label: 'Bet the sale money on a business in a town you’ve known a month.',
        verdict: 'wrong', effects: { money: -15 },
        feedback: 'Some bets paid. This one, mostly, didn’t.' },
    ]),
    step('A letter home to the Panhandle. What do you write?', [
      { label: 'The truth with your head up: we lost the land, but not each other — and Texans out here helped build this place too.',
        verdict: 'right', effects: { hope: 15 },
        feedback: 'Dignity is not income. The families who went west carried Texas with them and built lives worth writing home about.' },
      { label: 'Only the good parts.',
        verdict: 'partial', effects: { hope: 5 },
        feedback: 'Kind, and half true.' },
      { label: 'Nothing — that life is behind us.',
        verdict: 'wrong', effects: { hope: -5 },
        feedback: 'The letter matters because both stories are one story. It deserved telling.' },
    ]),
  ),
];

// ===========================================================================
// TOWN FAMILY (the general store) — the §5 beats: the counter, the ledger,
// the name above the door.
// ===========================================================================

const TOWN_SHARED = [
  phase('The Credit Ledger', '1931', IMG.crash,
    'Your family’s name is painted over the door of the general store, and has been for two generations. Wheat has crashed. Farmers who always paid cash stand at the counter counting pennies while their children eye the candy jar. The credit ledger — the book of who owes what — grows heavier by the week.',
    step('Farmers can’t pay. Do you keep selling to them on credit?', [
      { label: 'Extend careful credit — write it in the book, shake their hands, the town survives together.',
        verdict: 'right', effects: { money: 5, hope: 5 },
        feedback: 'The store and the town were one animal — they lived together or died together. Careful credit kept both breathing.' },
      { label: 'Sell smaller amounts, and push garden seed and canning jars so families can feed themselves.',
        verdict: 'partial', effects: { money: 5, health: 5 },
        feedback: 'Good sense — a town that can feed itself needs less credit. But it still sends neighbors home short.' },
      { label: 'Go cash-only — no money, no goods.',
        verdict: 'wrong', effects: { money: 5, hope: -10 },
        feedback: 'A cash-only store in a cashless town is a store that dies alone. The town remembered who shut the door.' },
    ]),
    step('Prices keep falling and the ledger keeps growing. How does the store hold on?', [
      { label: 'Diversify: take eggs and cream in trade, stock what the town can actually buy, keep the lights on.',
        verdict: 'right', effects: { money: 10, hope: 5 },
        feedback: 'Ten small streams beat one dry river. An egg is money where money is scarce — trade and thrift kept the doors open.' },
      { label: 'Sell off some stock and fixtures you “don’t need.”',
        verdict: 'partial', effects: { money: 10, hope: -10 },
        feedback: 'Cash today — but a store with bare shelves is one slow month from closing.' },
      { label: 'Borrow big to restock, betting good times are right around the corner.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'Good times were not around the corner. That bet is a promise the sky no longer keeps.' },
    ]),
  ),
  phase('The Dusters Come', '1933–34', IMG.duster,
    'The rain stops. Dust sifts under the door and through the window putty — into the flour barrel, the bolts of cloth, the sugar bin. And when the black blizzards roll down Main Street, folks look to your store: brick walls, a solid roof, and lamplight in the dark.',
    step('A black blizzard is coming and neighbors are caught out on Main Street.', [
      { label: 'Throw the doors open — everyone inside, wet cloths from the dry-goods shelf, wait it out together.',
        verdict: 'right', effects: { health: 15 },
        feedback: 'The store became the town’s storm shelter. People who couldn’t see their own hands found your lamplight — and lived.' },
      { label: 'Lock up and get your own family home to safety.',
        verdict: 'partial', effects: { health: -5 },
        feedback: 'Your family is safe — but Main Street had nowhere else to run.' },
      { label: 'Keep selling — a storm is no reason to close the register.',
        verdict: 'wrong', effects: { health: -15 },
        feedback: 'A duster was not weather to work through. “Only dirt” put customers and clerks alike in bed with dust pneumonia.' },
    ]),
    step('Dust pneumonia is going around, and your own children have the cough.', [
      { label: 'Red Cross masks, wet cloths, seal the back rooms, and rest.',
        verdict: 'right', effects: { health: 10, money: -5 },
        feedback: 'The Red Cross really did hand out masks. Sealed rooms and care brought most of the sick through.' },
      { label: 'Send the little ones to cousins out of the dust till it eases.',
        verdict: 'partial', effects: { health: 10, hope: -10 },
        feedback: 'Safer air, and an empty house. Plenty of families split up for a season — it cost something.' },
      { label: 'It will pass — the store won’t run itself.',
        verdict: 'wrong', effects: { health: -15 },
        feedback: 'Dust pneumonia killed. No register was worth a child’s lungs.' },
    ]),
  ),
  phase('Black Sunday', 'April 14, 1935', IMG.blackSunday,
    'A Sunday so clear people had picnics — then, at midafternoon, a black wall three hundred feet high rolls out of the north, and day becomes midnight. Afterward the wholesaler’s letter comes: the whole Panhandle is behind on its bills, and they will ship no more goods on credit. A store with empty shelves is no store at all.',
    step('Black Sunday hits while your family is scattered between store and home.', [
      { label: 'Everyone to shelter — count heads first, lock the till later.',
        verdict: 'right', effects: { health: 10, hope: 5 },
        feedback: 'People first. Panhandle families told this story for the rest of their lives — the day the world went dark at three in the afternoon.' },
      { label: 'Grab the day’s cash and the ledger book first — they’re the store’s whole life.',
        verdict: 'partial', effects: { money: 5, health: -10 },
        feedback: 'The ledger is the store’s memory and its future — but someone’s lungs paid for the run back to the counter.' },
      { label: 'Try to drive home through it.',
        verdict: 'wrong', effects: { health: -15 },
        feedback: 'Cars died mid-road on Black Sunday. Some drivers were found by the rope lines, some weren’t.' },
    ]),
    branchStep('town'),
  ),
];

const TOWN_STAY = [
  phase('Payrolls Come to Town', '1935–36', IMG.wpa,
    'The New Deal reaches Main Street: WPA crews arrive to lay a farm-to-market road and raise a school addition, and for the first time in years there are men in town with Friday wages in their pockets. Some folks sniff that it’s relief work. You count heads: those are customers.',
    step('WPA crews are hiring and spending. How does the store meet them?', [
      { label: 'Welcome the payroll — stock what working men need, keep prices honest, extend fair credit.',
        verdict: 'right', effects: { money: 15, hope: 5 },
        feedback: 'New Deal payrolls saved main streets, not just farms. Honest prices for honest wages — the store came back to life one Friday at a time.' },
      { label: 'Sell to them, but grumble that it’s all government money.',
        verdict: 'partial', effects: { money: 5, hope: -5 },
        feedback: 'Their money spent the same — but ill will is dear in a town of three hundred people.' },
      { label: 'Refuse to serve “relief workers” at all.',
        verdict: 'wrong', effects: { money: -15 },
        feedback: 'Pride is poor bread. The store that turned away the only paying customers in town broke hardest.' },
    ]),
    step('Your oldest son, seventeen, could clerk at the store or join the CCC.', [
      { label: 'Sign the CCC papers — $30 a month, $25 of it sent straight home.',
        verdict: 'right', effects: { money: 10, hope: 10 },
        feedback: 'The CCC’s arithmetic saved town families too: twenty-five dollars home every month, and a son planting trees and learning a trade.' },
      { label: 'Keep him behind the counter.',
        verdict: 'partial', effects: { money: 5 },
        feedback: 'Another pair of hands at the counter — but the CCC dollars would have gone further.' },
      { label: 'Send him hoboing north to look for city work.',
        verdict: 'wrong', effects: { health: -10, hope: -5 },
        feedback: 'The rails were full of hungry boys already. The CCC existed exactly so they didn’t have to.' },
    ]),
  ),
  phase('Credit for the New Ways', '1937–38', IMG.healing,
    'The soil man has the farmers terracing and grassing their worst ground, and it’s working — the blowing slows wherever the new ways take hold. But terraces need seed, wire, and tools, and the farmers need all of it on credit. You’ve been burned by that book before.',
    step('Conservation farmers need supplies on credit to farm the new way.', [
      { label: 'Extend the credit — back the farmers healing the land, and the town heals with them.',
        verdict: 'right', effects: { money: 10, hope: 15 },
        feedback: 'The store’s credit helped the Panhandle farm with the land instead of against it. As the fields came back, so did the ledger — this time, the debts got paid.' },
      { label: 'Sell only for cash — you’ve been burned before.',
        verdict: 'partial', effects: { money: 5, hope: -5 },
        feedback: 'Safer for the till — but the healing spread slower where farmers couldn’t get supplies.' },
      { label: 'Turn them away — let them figure it out themselves.',
        verdict: 'wrong', effects: { hope: -10 },
        feedback: 'The town and the land recovered together or not at all. A shut door helped neither.' },
    ]),
    step('A neighbor family, worse off than you, is selling out at cruel prices.', [
      { label: 'Help them — forgive a little of the ledger, pack them a box of groceries, and no judgment either way they choose.',
        verdict: 'right', effects: { hope: 15 },
        feedback: 'Dust Bowl neighbors carried each other. Every family remembered who helped.' },
      { label: 'Buy their household goods cheap to resell — business is business.',
        verdict: 'partial', effects: { money: 10, hope: -10 },
        feedback: 'Legal, common, and remembered.' },
      { label: 'Stay clear — hard luck might be catching.',
        verdict: 'wrong', effects: { hope: -10 },
        feedback: 'It wasn’t catching. It was already everywhere. Only the helping helped.' },
    ]),
  ),
  phase('The Ledger Comes Home', '1939–41', IMG.healing,
    'The rain returns and the terraced fields hold it. Wheat prices tick up as war rumbles overseas. And one by one, farmers come through the door with folded bills — paying down debts three and four years old, from the pages where you carried them.',
    step('The town is earning again. What do you do with the store’s first good year?', [
      { label: 'Honor the ledger both ways — forgive what can never be paid, bank what can, and keep serving.',
        verdict: 'right', effects: { money: 15, hope: 5 },
        feedback: 'Families who came through remembered exactly who carried them. The store that kept faith never wanted for customers again.' },
      { label: 'Expand fast — double the stock and the shelves.',
        verdict: 'partial', effects: { money: 5 },
        feedback: 'The rain is back. It made no promises.' },
      { label: 'Celebrate big — the hard years are over.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'The hard years taught one thing: keep a reserve.' },
    ]),
    step('Looking back from behind the counter, what do you tell the children this was?', [
      { label: 'The truth: the plows helped cause it, the people and the programs helped end it, and this town held together.',
        verdict: 'right', effects: { hope: 15 },
        feedback: 'That’s the whole lesson, told across a counter — and the old ledger is the proof: a town that carried each other through.' },
      { label: 'Just bad luck and bad weather.',
        verdict: 'partial', effects: { hope: 5 },
        feedback: 'Half the story. The grass knew the other half.' },
      { label: 'Never speak of it.',
        verdict: 'wrong', effects: { hope: -5 },
        feedback: 'Stories buried don’t teach. This one had to be told — that’s why we remember it.' },
    ]),
  ),
];

const TOWN_GO = [
  phase('The Name Above the Door', '1935', IMG.route66,
    'Selling the store means selling the name above the door — your family’s name, painted and repainted up there for two generations. The new owner will keep the shelves; he won’t keep the name. The truck can carry only so much of what’s left.',
    step('What rides west?', [
      { label: 'Tools, bedding, water bags, the sale money sewn into a coat — and Grandma’s Bible for the heart.',
        verdict: 'right', effects: { money: 10, hope: 5 },
        feedback: 'Migrant families learned it fast: carry what makes work and warmth. One small treasure for the spirit is provisions too.' },
      { label: 'The big brass cash register — it’s who we are.',
        verdict: 'partial', effects: { hope: 10, money: -10 },
        feedback: 'A hundred pounds of the old life. Many such treasures were sold along the road, a town at a time, before California.' },
      { label: 'Everything — roped high like a haystack.',
        verdict: 'wrong', effects: { money: -10, health: -5 },
        feedback: 'Overloaded trucks broke axles by Tucumcari. The road west was littered with what wouldn’t fit after all.' },
    ]),
    step('Route 66, high desert ahead. How do you run the road?', [
      { label: 'Drive the cool hours, rest the engine, fill every water bag at every stop.',
        verdict: 'right', effects: { health: 10, money: 5 },
        feedback: 'The desert crossings were graveyards for hot engines. Night drivers made California.' },
      { label: 'Push hard — every day on the road spends money.',
        verdict: 'partial', effects: { money: 5, health: -10 },
        feedback: 'True. So do radiators.' },
      { label: 'Detour chasing rumored work in the mining towns.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'Rumors paid in rumors. The families that made it kept west.' },
    ]),
  ),
  phase('California Is Not a Promise', '1936', IMG.camp,
    'A cousin has a grocery in Bakersfield and a job waiting for a storekeeper who knows the trade. But first, the valley itself: ten families for every field job, “Okies” sneered at Texas plates, a ditch-bank camp outside town — and, down the road, a clean government farm camp with cabins, water, and a committee of the families themselves.',
    step('Where does the family live?', [
      { label: 'The government farm camp — clean water, safety, school for the kids, dignity.',
        verdict: 'right', effects: { health: 15, hope: 10 },
        feedback: 'The FSA camps were built for exactly this family. Clean water and self-respect were the two things the road tried hardest to take.' },
      { label: 'The ditch-bank camp — it’s free and near the work.',
        verdict: 'partial', effects: { money: 5, health: -15 },
        feedback: 'Free cost the most: bad water, sickness, and no one to stand with you.' },
      { label: 'Split up — each worker to a different job in a different town.',
        verdict: 'wrong', effects: { hope: -15 },
        feedback: 'Families that scattered often stayed scattered. Together was the last thing you owned.' },
    ]),
    step('At the cousin’s grocery, migrant families come to the counter with empty pockets — just as your old customers once did.', [
      { label: 'Extend them careful credit — you know exactly what it buys.',
        verdict: 'right', effects: { hope: 15, money: -5 },
        feedback: 'The circle completes: the kindness your store gave in Texas, given again in California — this time to families with Panhandle dust still on their shoes. It didn’t always pay. It always mattered.' },
      { label: 'Cash only — you can’t get burned twice.',
        verdict: 'partial', effects: { money: 5, hope: -10 },
        feedback: 'No one can judge a family that’s been burned. But you remember what a shut door felt like from the other side.' },
      { label: 'Turn them away sharply.',
        verdict: 'wrong', effects: { money: -10 },
        feedback: 'Hard words in a hard place made no friends and no money.' },
    ]),
  ),
  phase('New Ground', '1938–41', IMG.camp,
    'The valley grocery becomes steady work, and steady work becomes a chance at more — war plants are hiring up and down the coast, and new towns are growing fast around them. The name above the old door stayed in Texas. The knowing came with you.',
    step('The chance: stay on at the cousin’s grocery, or take steadier, better-paying war-plant work?', [
      { label: 'Take the steady work, keep the kids in one school, save for a small store of your own again.',
        verdict: 'right', effects: { money: 15, hope: 10 },
        feedback: 'The winning move was steadiness. By 1941 the road years were ending — and a family that kept a store once knew how to keep one again.' },
      { label: 'Keep moving where the grocery work is.',
        verdict: 'partial', effects: { money: 5 },
        feedback: 'The work would always be there. The kids needed one school more.' },
      { label: 'Bet the savings on a shop in a town you’ve known a month.',
        verdict: 'wrong', effects: { money: -15 },
        feedback: 'Some bets paid. This one, mostly, didn’t.' },
    ]),
    step('A letter home to the Panhandle. What do you write?', [
      { label: 'The truth with your head up: we sold the store, but not our name — and Texans out here helped build this place too.',
        verdict: 'right', effects: { hope: 15 },
        feedback: 'The skills traveled, and so did the kindness. The families who went west carried Texas with them — and wrote home in the same steady hand that kept the ledger.' },
      { label: 'Only the good parts.',
        verdict: 'partial', effects: { hope: 5 },
        feedback: 'Kind, and half true.' },
      { label: 'Nothing — that life is behind us.',
        verdict: 'wrong', effects: { hope: -5 },
        feedback: 'The letter matters because both stories are one story. It deserved telling.' },
    ]),
  ),
];

// ---------------------------------------------------------------------------
// Assembly. Content is keyed by composite variant key ("<family>_<path>"). The
// shared first half (chapters 1–3) is the SAME object per family across stay/go,
// so the two branch lists are byte-identical through decision #6 and the cursor
// flows straight across the swap.
// ---------------------------------------------------------------------------

const SHARED = { tenant: TENANT_SHARED, owner: OWNER_SHARED, town: TOWN_SHARED };
const STAY   = { tenant: TENANT_STAY,   owner: OWNER_STAY,   town: TOWN_STAY };
const GO     = { tenant: TENANT_GO,     owner: OWNER_GO,     town: TOWN_GO };

export const FAMILY_KEYS = ['owner', 'tenant', 'town'];
export const VARIANT_KEYS = FAMILY_KEYS.flatMap((f) => [`${f}_stay`, `${f}_go`]);

export const familyOf = (key) => key.split('_')[0];
export const pathOf = (key) => key.split('_')[1] || null;

export function phasesFor(variantKey) {
  const family = familyOf(variantKey);
  const tail = pathOf(variantKey) === 'go' ? GO[family] : STAY[family];
  return [...SHARED[family], ...tail];
}

// ---------------------------------------------------------------------------
// Family Score = money + health + hope (max 300). Tiers are path-agnostic — an
// all-right run (either branch) reaches ~285 ("Through the Storm").
// ---------------------------------------------------------------------------

export const ENDINGS = {
  through: { key: 'through', title: 'Through the Storm',
    text: 'Your family came through the Dust Bowl years with health, hope, and each other. The dust is settling, the worst is behind you, and the story you’ll tell is one of a family that held together.' },
  standing: { key: 'standing', title: 'Still Standing',
    text: 'It cost more than you ever wanted to pay, but your family is still together and still standing. The hard years bent you; they did not break you.' },
  battered: { key: 'battered', title: 'Battered but Together',
    text: 'The Dust Bowl took a heavy toll — in money, in health, in spirit. But your family is still together, and together is the thing that could not be plowed under or blown away.' },
};

export function familyScore(meters) {
  return (meters.money || 0) + (meters.health || 0) + (meters.hope || 0);
}

export function endingFor(score) {
  if (score >= 220) return ENDINGS.through;
  if (score >= 130) return ENDINGS.standing;
  return ENDINGS.battered;
}

const BOTH_BRAVE =
  ' Neither family was wrong. Holding on took courage. Letting go took courage. The Dust Bowl asked for both.';

export const DEBRIEFS = {
  stay:
    'You stayed — and thousands of Texas families made the same brave choice. The rains returned in 1939–41, and the terraced, contour-plowed fields and strips of grass held the soil at last. New Deal checks and the CCC’s $25-a-month sent home carried families across the hardest years, and the Panhandle learned to farm WITH the land instead of against it. The plows had helped make the disaster; grass and new ways helped end it.' + BOTH_BRAVE +
    ' Play again — try a different family, or take the other road west.',
  go:
    'You went west — and thousands of Texas families made the same brave choice. It was not giving up; it was starting over, and it took all the courage a family had. By 1940 steady work returned — first the fields, then the wartime plants — and the family that left with a truck and each other made a new life. The migrant Texans and “Okies” so often scorned helped build modern California, and their courage is part of Texas history too.' + BOTH_BRAVE +
    ' Play again — try a different family, or stay and rebuild in the Panhandle.',
};

export function debriefFor(variantKey) {
  return pathOf(variantKey) === 'go' ? DEBRIEFS.go : DEBRIEFS.stay;
}

// ---------------------------------------------------------------------------

export default createStepGame({
  id: 'dust-bowl',
  title: 'Surviving the Dust Bowl',
  sides: FAMILY_KEYS,              // base families — the pick + class grouping
  variants: VARIANT_KEYS,         // six composite content keys (stay/go per family)
  startKeyFor: (base) => `${base}_stay`, // join a family → the STAY list is the default
  baseOf: familyOf,
  pathOf,
  modes: ['solo'],
  soloRival: false,               // each student guides one family alone — no AI rival
  startMeters: () => ({ ...START_METERS }),
  phasesFor,
  meta: { meters: METERS },       // no map layer — the lightest client after President
  scoreMeters: familyScore,
  endingFor,
  debriefFor,
});
