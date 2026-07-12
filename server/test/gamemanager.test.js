// gamemanager.test.js — drives the manager exactly the way socketHandlers does
// and inspects the emit instructions it returns. No sockets involved. Surviving
// the Dust Bowl is branching variant solo (pick a family, then STAY or GO), so
// these focus on the solo lifecycle, the per-family class grouping, and the
// mid-game branch (spec §10: branch at step 6 → correct second half → still /12).
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameManager } from '../src/GameManager.js';
import game, { phasesFor } from '../src/games/dustBowl.js';

const PIN = '4242';
const stepsOf = (key) => phasesFor(key).flatMap((p) => p.steps);

function makeSession(manager, { requireApproval = false } = {}) {
  const res = manager.createSession({ pin: PIN, requireApproval });
  assert.ok(res.joinCode, 'session created');
  return res.joinCode;
}

function join(manager, joinCode, nickname, nation = 'tenant') {
  const res = manager.joinStudent({ joinCode, nickname, mode: 'solo', nation });
  assert.ok(!res.error, `join failed: ${res.error}`);
  return res;
}

const eventsOf = (emits, name) => emits.filter((e) => e.event === name);
const studentEvents = (emits, studentId, name) =>
  emits.filter((e) => e.to.type === 'student' && e.to.studentId === studentId && (!name || e.event === name));

function liveSide(manager, joinCode, studentId) {
  const session = manager.registry.get(joinCode);
  const student = session.students.get(studentId);
  const match = session.matches.get(student.matchId);
  return { match, ss: match.gameState.sides[match.side] };
}

// Submit the choice at a specific REAL index (mapped through the shuffle).
function submitReal(manager, joinCode, studentId, realIndex) {
  const { match, ss } = liveSide(manager, joinCode, studentId);
  const step = stepsOf(ss.key)[ss.cursor];
  const choiceIndex = ss.shuffles[ss.cursor].indexOf(realIndex);
  return manager.submitMove({ joinCode, studentId, move: { kind: step.kind, choiceIndex } });
}

// Play the current step with the historically right move (aiMove picks STAY at
// the branch — the first of the two rights).
function playRight(manager, joinCode, studentId) {
  const { match } = liveSide(manager, joinCode, studentId);
  const move = game.aiMove(match.gameState, match.side);
  return manager.submitMove({ joinCode, studentId, move });
}

function playAllRight(manager, joinCode, studentId) {
  let last;
  for (let i = 0; i < game.totalActions; i++) {
    last = playRight(manager, joinCode, studentId);
    assert.ok(!last.error, `step ${i}: ${last.error}`);
  }
  return last;
}

test('createSession rejects a bad PIN', () => {
  const manager = new GameManager();
  assert.equal(manager.createSession({ pin: 'abc' }).error, 'bad_pin');
  assert.equal(manager.createSession({ pin: '12345' }).error, 'bad_pin');
});

test('the default game is Surviving the Dust Bowl', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  assert.equal(manager.registry.get(joinCode).gameId, 'dust-bowl');
});

test('teacher ops require the right PIN', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  assert.equal(manager.endSession({ joinCode, pin: '9999' }).error, 'bad_pin');
  assert.equal(manager.setApproval({ joinCode, pin: '0000', requireApproval: false }).error, 'bad_pin');
});

test('a tenant family starts on join and, playing all-right, stays and scores 100%', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana', 'tenant');

  const begin = studentEvents(res.emits, res.studentId, 'match:begin');
  assert.equal(begin.length, 1, 'solo match begins on join');
  assert.equal(begin[0].payload.side, 'tenant');
  assert.equal(begin[0].payload.chapterCount, 6, 'six chapters');
  assert.equal(begin[0].payload.rivalMeters, null, 'you guide one family alone — no rival');

  const last = playAllRight(manager, joinCode, res.studentId);
  const end = studentEvents(last.emits, res.studentId, 'match:end');
  assert.equal(end.length, 1, 'match ends after 12 actions');
  assert.equal(end[0].payload.you.accuracy, 100);
  assert.equal(end[0].payload.you.ending.key, 'through', 'all-right comes through the storm');
  assert.equal(end[0].payload.you.path, 'stay', 'aiMove takes the STAY branch by default');
  assert.match(end[0].payload.you.debrief, /Holding on took courage/);

  const roster = manager.roster(manager.registry.get(joinCode));
  assert.equal(roster.students[0].status, 'completed');
  assert.equal(roster.students[0].nation, 'tenant', 'grouped by base family');
  assert.equal(roster.students[0].path, 'stay', 'chosen path on the roster');
  assert.equal(roster.students[0].accuracy, 100);
});

test('the branch: choosing GO at decision #6 plays the go half and still scores /12', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Beto', 'tenant');
  const sid = res.studentId;

  // Decisions 1–5 right (steps 0–4).
  for (let i = 0; i < 5; i++) assert.ok(!playRight(manager, joinCode, sid).error);

  // Roster shows no chosen path yet — the branch hasn't been taken.
  assert.equal(manager.roster(manager.registry.get(joinCode)).students[0].path, null);

  // Decision #6 (step 5): take GO. Its real index is the choice with setVariant _go.
  const { ss } = liveSide(manager, joinCode, sid);
  assert.equal(ss.cursor, 5, 'at the branch step');
  const branchStep = stepsOf(ss.key)[5];
  const goReal = branchStep.choices.findIndex((c) => c.setVariant === 'tenant_go');
  const goRes = submitReal(manager, joinCode, sid, goReal);
  assert.ok(!goRes.error);
  const resolution = studentEvents(goRes.emits, sid, 'turn:resolution')[0].payload;
  assert.equal(resolution.verdict, 'right', 'going west is a right answer');
  assert.equal(resolution.branchTo, 'go', 'the resolution reports the branch');

  // The side has swapped to the GO list; the roster reflects it live.
  assert.equal(liveSide(manager, joinCode, sid).ss.key, 'tenant_go');
  assert.equal(manager.roster(manager.registry.get(joinCode)).students[0].path, 'go');

  // Finish decisions 7–12 right on the GO path.
  for (let i = 6; i < 12; i++) assert.ok(!playRight(manager, joinCode, sid).error);

  const roster = manager.roster(manager.registry.get(joinCode));
  assert.equal(roster.students[0].status, 'completed');
  assert.equal(roster.students[0].path, 'go');
  assert.equal(roster.students[0].accuracy, 100, 'both branch rights count — accuracy is still out of 12');
});

test('"wait and do nothing" at the branch scores wrong', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Cyd', 'owner');
  const sid = res.studentId;
  for (let i = 0; i < 5; i++) playRight(manager, joinCode, sid);
  const branchStep = stepsOf(liveSide(manager, joinCode, sid).ss.key)[5];
  const waitReal = branchStep.choices.findIndex((c) => !c.setVariant);
  const r = submitReal(manager, joinCode, sid, waitReal);
  assert.equal(studentEvents(r.emits, sid, 'turn:resolution')[0].payload.verdict, 'wrong');
});

test('class accuracy is grouped by base family (owner / tenant / town)', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const a = join(manager, joinCode, 'Ana', 'tenant');
  const b = join(manager, joinCode, 'Ben', 'tenant');
  const c = join(manager, joinCode, 'Cara', 'town');
  for (const s of [a, b, c]) playAllRight(manager, joinCode, s.studentId);

  const roster = manager.roster(manager.registry.get(joinCode));
  assert.equal(roster.classAccuracy.tenant.count, 2, 'two tenant students');
  assert.equal(roster.classAccuracy.tenant.average, 100);
  assert.equal(roster.classAccuracy.town.count, 1, 'one town student');
  assert.equal(roster.classAccuracy.owner.count, 0, 'nobody picked owner');
});

test('approval gate: solo student waits, then starts on approve keeping their family', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager, { requireApproval: true });
  const res = join(manager, joinCode, 'Mara', 'town');
  assert.equal(res.approved, false);
  assert.equal(studentEvents(res.emits, res.studentId, 'match:begin').length, 0);

  const ok = manager.approveStudent({ joinCode, pin: PIN, studentId: res.studentId });
  assert.equal(studentEvents(ok.emits, res.studentId, 'join:approved').length, 1);
  const begin = studentEvents(ok.emits, res.studentId, 'match:begin');
  assert.equal(begin.length, 1);
  assert.equal(begin[0].payload.side, 'town', 'their picked family survived the wait');
});

test('a wrong-kind move is rejected (every step is a decision)', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana');
  const bad = manager.submitMove({ joinCode, studentId: res.studentId, move: { kind: 'map', choiceIndex: 0 } });
  assert.equal(bad.error, 'wrong_step_kind');
});

test('rejoin returns a full snapshot of the live turn', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana', 'tenant');
  playRight(manager, joinCode, res.studentId); // one decision done; another pending

  manager.markDisconnected({ joinCode, studentId: res.studentId });
  const back = manager.rejoinStudent({ joinCode, studentId: res.studentId });
  assert.ok(!back.error);
  assert.equal(back.sync.screen, 'match');
  assert.equal(back.sync.turn.kind, 'decision');
  assert.equal(back.sync.matchBegin.side, 'tenant');
  assert.ok(Array.isArray(back.sync.turn.choices) && back.sync.turn.choices.length === 3);
});

test('end_session wipes the session from memory', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  join(manager, joinCode, 'Ana');
  const res = manager.endSession({ joinCode, pin: PIN });
  assert.ok(eventsOf(res.emits, 'session:ended').length >= 2, 'teacher + student notified');
  assert.equal(manager.registry.get(joinCode), undefined);
});

test('students cannot reach teacher data: report requires the PIN', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  assert.equal(manager.sessionReport({ joinCode, pin: '1111' }).error, 'bad_pin');
  assert.ok(manager.sessionReport({ joinCode, pin: PIN }).report);
});
