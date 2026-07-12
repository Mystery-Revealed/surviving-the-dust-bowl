// Datapad.jsx — the student game. A small state machine over socket pushes:
// title → how to play → join (pick your family) → (approval) → briefing →
// match (6 chapters, 12 decisions, a mid-game STAY-or-GO branch) → result.
// Branching variant solo: you guide one Panhandle family alone — Farm-Owner,
// Tenant-Farmer, or Town — your pick. The server owns all truth; this
// component only renders what it's told.

import { useEffect, useReducer, useRef, useState } from 'react';
import { getSocket, emitAck, errorText } from '../../services/socket.js';
import { Art } from '../../services/assets.jsx';
import MatchView from './MatchView.jsx';
import ResultScreen from './ResultScreen.jsx';

const FAMILIES = [
  { key: 'owner', name: 'Farm-Owner family', image: 'card_owner.jpg',
    tag: 'Own their land — and a mortgaged tractor',
    blurb: 'You own your half-section, but the new tractor came with a bank note that’s due whether wheat sells or not. Your biggest fear is the bank.' },
  { key: 'tenant', name: 'Tenant-Farmer family', image: 'card_tenant.jpg',
    tag: 'Farm a landlord’s land for a share',
    blurb: 'You farm Mr. Harlan’s acres for a share of the crop, surviving on almost nothing. Your biggest fear is the landlord’s letter.' },
  { key: 'town', name: 'Town family', image: 'card_town.jpg',
    tag: 'Run the general store',
    blurb: 'You keep the general store in a small Panhandle town. When farmers can’t pay, the whole town leans on your credit ledger.' },
];

const FAMILY_LABEL = { owner: 'Farm-Owner', tenant: 'Tenant-Farmer', town: 'Town' };

const initialState = {
  screen: 'title', // title | how | join | waiting_approval | briefing | match | result | ended
  joinCode: '',
  name: '',
  nation: null, // 'owner' | 'tenant' | 'town'
  studentId: null,
  error: '',
  endedMessage: '',
  match: null,
  matchEnd: null,
};

function freshMatch(begin) {
  return {
    begin,
    meters: begin.meters,
    eventCard: null,
    turn: null,
    feedback: null,
    path: begin.path || null, // 'stay' | 'go' once the branch is taken
  };
}

// Merge live payloads (chapter:event, turn:begin, turn:resolution) into the match.
function mergeLive(match, payload) {
  const next = { ...match };
  if (payload.meters) next.meters = payload.meters;
  return next;
}

function reducer(state, action) {
  switch (action.type) {
    case 'ui':
      return { ...state, ...action.patch };
    case 'joined':
      return {
        ...state,
        studentId: action.studentId,
        error: '',
        screen: action.approved ? 'briefing' : 'waiting_approval',
      };
    case 'approved':
      return { ...state, screen: state.screen === 'waiting_approval' ? 'briefing' : state.screen };
    case 'match:begin':
      return { ...state, screen: 'match', matchEnd: null, match: freshMatch(action.payload) };
    case 'chapter:event': {
      if (!state.match) return state;
      const match = mergeLive(state.match, action.payload);
      return { ...state, match: { ...match, eventCard: action.payload } };
    }
    case 'turn:begin': {
      if (!state.match) return state;
      const match = mergeLive(state.match, action.payload);
      return { ...state, match: { ...match, turn: action.payload } };
    }
    case 'turn:resolution': {
      if (!state.match) return state;
      const match = mergeLive(state.match, action.payload);
      const path = action.payload.branchTo || match.path;
      return { ...state, match: { ...match, feedback: action.payload, path } };
    }
    case 'match:end': {
      // Hold the result until pending feedback is dismissed (chronological order).
      const showNow = !state.match?.feedback;
      return { ...state, matchEnd: action.payload, screen: showNow ? 'result' : state.screen };
    }
    case 'dismiss-feedback': {
      if (!state.match) return state;
      if (state.matchEnd) return { ...state, screen: 'result', match: { ...state.match, feedback: null } };
      return { ...state, match: { ...state.match, feedback: null } };
    }
    case 'dismiss-event':
      return state.match ? { ...state, match: { ...state.match, eventCard: null } } : state;
    case 'sync': {
      const s = action.sync;
      if (s.screen === 'waiting_approval') return { ...state, screen: 'waiting_approval' };
      if (s.screen === 'lobby') return { ...state, screen: 'briefing', nation: s.nation };
      if (s.screen === 'result') return { ...state, screen: 'result', matchEnd: s.matchEnd };
      if (s.screen === 'match') {
        const match = freshMatch(s.matchBegin);
        return {
          ...state,
          screen: 'match',
          matchEnd: null,
          match: { ...match, eventCard: s.chapterEvent, turn: s.turn },
        };
      }
      return state;
    }
    case 'removed':
      return { ...initialState, screen: 'join', joinCode: state.joinCode, name: '', error: 'Your teacher removed you from the session. You can join again.' };
    case 'ended':
      return { ...initialState, screen: 'ended', endedMessage: 'Your teacher ended this session. Your family’s story is told.' };
    case 'play-again':
      return { ...initialState, screen: 'join', joinCode: state.joinCode, name: state.name };
    default:
      return state;
  }
}

export default function Datapad() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const socket = getSocket();
    const on = (event, type) => {
      const fn = (payload) => dispatch({ type, payload });
      socket.on(event, fn);
      return [event, fn];
    };
    const subs = [
      on('match:begin', 'match:begin'),
      on('chapter:event', 'chapter:event'),
      on('turn:begin', 'turn:begin'),
      on('turn:resolution', 'turn:resolution'),
      on('match:end', 'match:end'),
    ];
    const approved = () => dispatch({ type: 'approved' });
    const removed = () => dispatch({ type: 'removed' });
    const ended = () => dispatch({ type: 'ended' });
    socket.on('join:approved', approved);
    socket.on('student:removed', removed);
    socket.on('session:ended', ended);

    // School wifi blip: the socket reconnects → re-attach and re-sync the screen.
    const onReconnect = async () => {
      const s = stateRef.current;
      if (!s.studentId || !s.joinCode) return;
      const res = await emitAck('student:rejoin', { joinCode: s.joinCode, studentId: s.studentId });
      if (res.ok) dispatch({ type: 'sync', sync: res.sync });
    };
    socket.io.on('reconnect', onReconnect);

    return () => {
      for (const [event, fn] of subs) socket.off(event, fn);
      socket.off('join:approved', approved);
      socket.off('student:removed', removed);
      socket.off('session:ended', ended);
      socket.io.off('reconnect', onReconnect);
    };
  }, []);

  const { screen } = state;
  return (
    <div className="app student-app">
      {screen === 'title' && <TitleScreen onStart={() => dispatch({ type: 'ui', patch: { screen: 'join' } })} onHow={() => dispatch({ type: 'ui', patch: { screen: 'how' } })} />}
      {screen === 'how' && <HowToPlay onBack={() => dispatch({ type: 'ui', patch: { screen: 'title' } })} />}
      {screen === 'join' && <JoinForm state={state} dispatch={dispatch} />}
      {screen === 'waiting_approval' && (
        <WaitCard title="Hold tight!" text="Your teacher is checking names. Your family’s story will begin in a moment." />
      )}
      {screen === 'briefing' && (
        <WaitCard
          title={`You are guiding the ${FAMILY_LABEL[state.nation] || ''} family.`}
          text="It’s 1931 in the Texas Panhandle. Your first chapter is being drawn up — stand ready."
        />
      )}
      {screen === 'match' && state.match && <MatchView state={state} dispatch={dispatch} />}
      {screen === 'result' && state.matchEnd && <ResultScreen state={state} dispatch={dispatch} />}
      {screen === 'ended' && (
        <WaitCard title="Session ended" text={state.endedMessage}>
          <button className="btn" onClick={() => dispatch({ type: 'ui', patch: { ...initialState, screen: 'title' } })}>
            Back to the title screen
          </button>
        </WaitCard>
      )}
      <footer className="app-footer">Made for 7th Grade Texas History · TEKS 7.7E, 7.9A, 7.9B</footer>
    </div>
  );
}

/* ---------------- small screens ---------------- */

function TitleScreen({ onStart, onHow }) {
  return (
    <div className="card title-screen">
      <Art name="title_hero.jpg" alt="A Panhandle farmhouse under an enormous sky, a wall of dust rising on the horizon" className="hero-art" />
      <h1 className="game-title">Surviving the Dust Bowl</h1>
      <p className="tagline">It’s 1931. The sky is about to turn against you.</p>
      <p className="title-blurb">
        Choose a <b>Farm-Owner</b>, <b>Tenant-Farmer</b>, or <b>Town</b> family and
        guide them through the Dust Bowl years in the Texas Panhandle. Mid-story,
        your family makes the hardest call of all: <b>hold on, or head west</b>.
        Both are brave. Only waiting and doing nothing is the wrong answer. Play
        it again as a different family, or take the road you didn’t take.
      </p>
      <div className="btn-col">
        <button className="btn big" onClick={onStart}>Join your class</button>
        <button className="btn secondary" onClick={onHow}>How to play</button>
      </div>
    </div>
  );
}

function HowToPlay({ onBack }) {
  return (
    <div className="card how-screen">
      <h2>How to play</h2>
      <ol className="how-list">
        <li><b>Join with your class code</b> and pick your family — Farm-Owner, Tenant-Farmer, or Town.</li>
        <li><b>Live 6 chapters</b> of your family’s story. Each chapter you make <b>two calls</b> — a decision with 3 choices.</li>
        <li><b>Chapter 3 is the branch.</b> Your family decides: <b>STAY</b> and rebuild, or <b>GO WEST</b> on Route 66. Both are right — only doing nothing is wrong. Chapters 4–6 play out the road you chose.</li>
      </ol>
      <div className="note">
        <b>Accuracy is about what actually helped families survive</b> — not
        about "winning." Staying and going are <i>both</i> graded as correct
        choices; the only wrong move at the branch is waiting with no plan.
        Every other choice is scored on how well it matched what really helped
        Dust Bowl families hold on, in their own history.
      </div>
      <h3>Your three meters</h3>
      <ul className="how-list">
        <li>💵 <b>Money</b> — cash, credit, and what your family owns.</li>
        <li>❤️ <b>Health</b> — bodies and lungs in the dust years.</li>
        <li>🌅 <b>Hope</b> — your family’s spirit, the thing the Dust Bowl attacked hardest.</li>
      </ul>
      <div className="note">
        Your <b>Family Score</b> (the three meters added up) shows how your
        family is faring. Your <b>accuracy</b> — the score your teacher sees —
        shows how sound your choices were. Whichever road you choose, staying
        or going, the same truth waits at the end: both took courage.
      </div>
      <h3>Words to know</h3>
      <ul className="how-list">
        <li><b>Drought</b> — a long time with almost no rain.</li>
        <li><b>Black blizzard</b> — a giant rolling wall of dust.</li>
        <li><b>Tenant farmer</b> — a family who farms land they don’t own, paying with a share of the crop.</li>
        <li><b>CCC</b> — the Civilian Conservation Corps, a New Deal program that hired young men for outdoor work ($30 a month, $25 sent home).</li>
        <li><b>WPA / PWA</b> — New Deal programs that paid workers to build roads, schools, and public works.</li>
        <li><b>Contour plowing</b> — plowing along the curve of the land so soil and water stay put.</li>
        <li><b>Route 66</b> — the highway west that migrant families followed to California.</li>
      </ul>
      <button className="btn" onClick={onBack}>Back</button>
    </div>
  );
}

function JoinForm({ state, dispatch }) {
  const [busy, setBusy] = useState(false);
  const set = (patch) => dispatch({ type: 'ui', patch });

  async function join() {
    if (busy) return;
    setBusy(true);
    set({ error: '' });
    const res = await emitAck('student:join', {
      joinCode: state.joinCode.trim(),
      nickname: state.name.trim(),
      mode: 'solo',
      nation: state.nation,
    });
    setBusy(false);
    if (!res.ok) return set({ error: errorText(res.error) });
    dispatch({ type: 'joined', studentId: res.studentId, approved: res.approved });
  }

  const ready = state.joinCode.length === 6 && state.name.trim().length >= 2 && !!state.nation;

  return (
    <div className="card join-screen">
      <h2>Join your class</h2>
      <label htmlFor="join-code">Class code</label>
      <input
        id="join-code" inputMode="numeric" autoComplete="off" maxLength={6}
        placeholder="6-digit code" value={state.joinCode}
        onChange={(e) => set({ joinCode: e.target.value.replace(/\D/g, '') })}
      />
      <label htmlFor="join-name">Your first name</label>
      <input
        id="join-name" maxLength={20} placeholder="e.g. Ana R." value={state.name}
        onChange={(e) => set({ name: e.target.value })}
      />

      <h3>Choose your family</h3>
      <div className="family-grid">
        {FAMILIES.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`family-card ${state.nation === f.key ? 'picked' : ''}`}
            onClick={() => set({ nation: f.key })}
          >
            <Art name={f.image} alt={f.name} className="family-art" />
            <div className="family-name">{f.name}</div>
            <div className="family-tag">{f.tag}</div>
            <p className="family-blurb">{f.blurb}</p>
          </button>
        ))}
      </div>

      <p className="err" role="alert">{state.error}</p>
      <div className="btn-col">
        <button className="btn big" disabled={busy || !ready} onClick={join}>
          {busy ? 'Joining…' : 'Begin the story'}
        </button>
        <button className="btn ghost" onClick={() => set({ screen: 'title', error: '' })}>Back</button>
      </div>
    </div>
  );
}

function WaitCard({ title, text, children }) {
  return (
    <div className="card wait-card">
      <div className="pulse-dot" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </div>
  );
}
