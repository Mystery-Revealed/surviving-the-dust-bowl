// content.test.js — sanity, structure, and historical-balance checks on the
// Dust Bowl answer key. The core idea of this game: three families, and a
// mid-game STAY-or-GO branch where BOTH choices are right. These tests guard the
// six composite step lists, the byte-identical shared first half, the two-right
// branch step, and the "all right = 100% down every path" promise (spec §10).
import test from 'node:test';
import assert from 'node:assert/strict';
import game, {
  METERS, START_METERS, FAMILIES, FAMILY_KEYS, VARIANT_KEYS,
  phasesFor, familyScore, endingFor, familyOf, pathOf, ENDINGS,
} from '../src/games/dustBowl.js';

const stepsOf = (key) => phasesFor(key).flatMap((p) => p.steps);
const BRANCH_STEP = 5; // decision #6 (0-indexed) — Black Sunday's second decision

const isBranchStep = (step) => step.choices.some((c) => c.setVariant);

test('three families, six composite variant keys', () => {
  assert.deepEqual(game.sides, ['owner', 'tenant', 'town']);
  assert.deepEqual(FAMILY_KEYS, ['owner', 'tenant', 'town']);
  assert.equal(VARIANT_KEYS.length, 6);
  for (const f of FAMILY_KEYS) {
    assert.ok(VARIANT_KEYS.includes(`${f}_stay`) && VARIANT_KEYS.includes(`${f}_go`));
    assert.ok(FAMILIES[f]?.name, `family ${f} has display info`);
  }
  assert.equal(game.soloRival, false, 'each student guides one family alone');
  assert.deepEqual(Object.keys(METERS), ['money', 'health', 'hope']);
  assert.equal(game.meta.positions, undefined, 'no map layer — lightest client after President');
});

test('every variant: 6 chapters, 12 decision steps, 3 choices each', () => {
  for (const key of VARIANT_KEYS) {
    const phases = phasesFor(key);
    assert.equal(phases.length, 6, `${key}: six chapters`);
    for (const [i, p] of phases.entries()) {
      assert.ok(p.title && p.date && p.event && p.image, `${key} chapter ${i} metadata`);
      assert.equal(p.steps.length, 2, `${key} chapter ${i}: two decisions`);
    }
    const steps = stepsOf(key);
    assert.equal(steps.length, 12, `${key}: 12 graded actions`);
    for (const [c, s] of steps.entries()) {
      assert.equal(s.kind, 'decision', `${key} step ${c} is a decision`);
      assert.equal(s.choices.length, 3, `${key} step ${c}: three choices`);
      for (const ch of s.choices) {
        assert.ok(ch.label?.length > 5, `${key} step ${c} label`);
        assert.ok(['right', 'partial', 'wrong'].includes(ch.verdict), `${key} step ${c} verdict`);
        assert.ok(ch.feedback?.length > 10, `${key} step ${c} feedback`);
      }
    }
  }
  assert.equal(game.totalActions, 12);
  assert.equal(game.chapterCount, 6);
});

test('the shared first half is byte-identical across a family’s stay/go paths', () => {
  for (const f of FAMILY_KEYS) {
    const stay = phasesFor(`${f}_stay`);
    const go = phasesFor(`${f}_go`);
    // Chapters 1–3 (the crash, the dusters, Black Sunday + the branch) must match
    // exactly, so the cursor flows straight across the setVariant swap at step 6.
    assert.deepEqual(stay.slice(0, 3), go.slice(0, 3), `${f}: chapters 1–3 identical`);
    // Chapters 4–6 must DIFFER (the two paths tell different stories).
    assert.notDeepEqual(stay.slice(3), go.slice(3), `${f}: chapters 4–6 diverge`);
  }
});

test('exactly one right per step — except the branch, which has TWO rights', () => {
  for (const key of VARIANT_KEYS) {
    const steps = stepsOf(key);
    for (const [c, s] of steps.entries()) {
      const rights = s.choices.filter((ch) => ch.verdict === 'right').length;
      if (c === BRANCH_STEP) {
        assert.equal(rights, 2, `${key} branch step: STAY and GO are both right`);
        assert.ok(isBranchStep(s), `${key} branch step carries setVariant`);
      } else {
        assert.equal(rights, 1, `${key} step ${c}: exactly one right`);
        assert.ok(!isBranchStep(s), `${key} step ${c} is not a branch`);
      }
    }
  }
});

test('the branch step: STAY→_stay, GO→_go, WAIT is the only wrong answer', () => {
  for (const f of FAMILY_KEYS) {
    const branch = stepsOf(`${f}_stay`)[BRANCH_STEP];
    const stay = branch.choices.find((c) => c.setVariant === `${f}_stay`);
    const go = branch.choices.find((c) => c.setVariant === `${f}_go`);
    const wait = branch.choices.find((c) => !c.setVariant);
    assert.equal(stay.verdict, 'right', `${f}: staying is right`);
    assert.equal(go.verdict, 'right', `${f}: going is right`);
    assert.equal(wait.verdict, 'wrong', `${f}: doing nothing is the only wrong answer`);
  }
});

// --- Playthrough helper: drive the adapter directly, no GameManager ----------
// branch: 'stay' | 'go' — which right to take at decision #6.
// pick:   'right' | 'wrong' | 'partial' — which verdict to take everywhere else.
function playRun(soloSide, { branch = 'stay', pick = 'right' } = {}) {
  const state = game.initMatch({ mode: 'solo', soloSide });
  for (let c = 0; c < game.totalActions; c++) {
    game.chapterEvent(state, soloSide);
    const ss = state.sides[soloSide];
    const step = stepsOf(ss.key)[c];
    // At the branch (two rights), disambiguate by direction when picking right;
    // otherwise fall through to verdict-matching (e.g. WAIT for an all-wrong run).
    const real = isBranchStep(step) && pick === 'right'
      ? step.choices.findIndex((ch) => ch.setVariant === `${soloSide}_${branch}`)
      : step.choices.findIndex((ch) => ch.verdict === pick);
    const choiceIndex = ss.shuffles[c].indexOf(real);
    const res = game.resolve(state, soloSide, { kind: 'decision', choiceIndex });
    assert.ok(!res.error, `step ${c}: ${res.error}`);
  }
  return { report: game.report(state).perSide[soloSide], state };
}

test('all-right down every path = 100% accuracy and "Through the Storm"', () => {
  for (const f of FAMILY_KEYS) {
    for (const branch of ['stay', 'go']) {
      const { report } = playRun(f, { branch, pick: 'right' });
      assert.equal(report.accuracy, 100, `${f}_${branch}: all right = 100%`);
      assert.equal(report.ending.key, 'through', `${f}_${branch}: comes through the storm`);
      assert.equal(report.path, branch, `${f}_${branch}: path recorded`);
      assert.equal(report.base, f, `${f}_${branch}: grouped under the base family`);
      assert.equal(report.variantKey, `${f}_${branch}`);
    }
  }
});

test('balance pin: an all-right tenant reaches 285 on either path', () => {
  const stay = playRun('tenant', { branch: 'stay' }).report;
  const go = playRun('tenant', { branch: 'go' }).report;
  assert.equal(stay.score, 285, 'tenant STAY all-right = 285');
  assert.equal(go.score, 285, 'tenant GO all-right = 285');
  assert.deepEqual(stay.meters, { money: 100, health: 85, hope: 100 });
  assert.deepEqual(go.meters, { money: 85, health: 100, hope: 100 });
});

test('all-wrong run collapses to "Battered but Together" at 0% — WAIT plays the default list but chooses no path', () => {
  const { report } = playRun('tenant', { pick: 'wrong' });
  assert.equal(report.accuracy, 0);
  assert.equal(report.ending.key, 'battered');
  // The WAIT choice carries no setVariant, so content-wise the default (stay)
  // list plays out — but the dashboard's `path` stays null, since the player
  // never actually chose to stay or go. Only a real STAY/GO choice sets it.
  assert.equal(report.path, null, 'no path was actually chosen');
  assert.equal(report.variantKey, 'tenant_stay', 'content still played out on the default list');
});

test('the branch actually swaps the second half', () => {
  // Same family, opposite branch → different chapter-4 prompt.
  const stay = playRun('owner', { branch: 'stay' }).state.sides.owner;
  const go = playRun('owner', { branch: 'go' }).state.sides.owner;
  assert.equal(stay.key, 'owner_stay');
  assert.equal(go.key, 'owner_go');
  assert.notEqual(stepsOf('owner_stay')[6].prompt, stepsOf('owner_go')[6].prompt);
});

test('debriefs are path-specific and both land on the both-were-brave line', () => {
  const stay = playRun('town', { branch: 'stay' }).report;
  const go = playRun('town', { branch: 'go' }).report;
  assert.notEqual(stay.debrief, go.debrief, 'stay and go debriefs differ');
  for (const d of [stay.debrief, go.debrief]) {
    assert.match(d, /Holding on took courage\. Letting go took courage\./, 'both-brave line present');
  }
  assert.match(go.debrief, /Okies/, 'GO debrief reclaims the slur, in quotes');
});

test('the teaching content is present where the spec requires it', () => {
  const stayText = stepsOf('tenant_stay').flatMap((s) => s.choices.map((c) => c.label + ' ' + c.feedback)).join(' ');
  const goText = stepsOf('tenant_go').flatMap((s) => s.choices.map((c) => c.label + ' ' + c.feedback)).join(' ');
  const ch1Text = phasesFor('tenant_stay')[0].steps.flatMap((s) => s.choices.map((c) => c.feedback)).join(' ');
  assert.match(stayText, /\$25|\$30|CCC|Civilian|twenty-five/i, 'CCC arithmetic in the STAY path');
  assert.match(stayText, /contour|terrace|grass/i, 'contour plowing / soil conservation in the STAY path');
  assert.match(goText, /Route 66|FSA|camp/i, 'Route 66 / FSA-style camp in the GO path');
  assert.match(ch1Text, /plow|sod|grass/i, 'the plow-up cause named in Chapter 1 (7.9A/B)');
});

test('Family Score tiers: through ≥ 220, standing 130–219, battered < 130', () => {
  assert.equal(endingFor(300).key, 'through');
  assert.equal(endingFor(220).key, 'through');
  assert.equal(endingFor(200).key, 'standing');
  assert.equal(endingFor(130).key, 'standing');
  assert.equal(endingFor(90).key, 'battered');
  assert.equal(familyScore({ ...START_METERS }), 150);
});

test('currentPrompt never leaks the answer key', () => {
  const state = game.initMatch({ mode: 'solo', soloSide: 'tenant' });
  game.chapterEvent(state, 'tenant');
  const prompt = game.currentPrompt(state, 'tenant');
  assert.equal(prompt.kind, 'decision');
  assert.equal(prompt.choices.length, 3);
  for (const c of prompt.choices) assert.equal(typeof c, 'string'); // labels only
});
