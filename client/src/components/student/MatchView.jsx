// MatchView.jsx — one chapter beat at a time: event card → decision → feedback.
// Branching variant solo (Farm-Owner, Tenant-Farmer, or Town), so it's always
// your turn. Chapter 3's second decision is THE BRANCH — stay or go west — and
// gets a quiet visual call-out. No map layer — the lightest client after
// President of the Republic. A Route 66 progress strip appears once you've
// taken the GO road.

import { useState } from 'react';
import { emitAck, errorText } from '../../services/socket.js';
import { Art } from '../../services/assets.jsx';
import MetersBar from '../shared/MetersBar.jsx';

const NAMES = { owner: 'Farm-Owner', tenant: 'Tenant-Farmer', town: 'Town' };
const BRANCH_STEP_INDEX = 5; // decision #6 (0-indexed) — Black Sunday's second decision
const familyScore = (m) => (m ? (m.money || 0) + (m.health || 0) + (m.hope || 0) : 0);

export default function MatchView({ state, dispatch }) {
  const { match } = state;
  const { begin, eventCard, turn, feedback, path } = match;
  const meta = begin.meta;
  const side = begin.side;

  const phase = eventCard?.chapter || turn?.chapter;
  const lowMeter = Object.entries(match.meters || {}).find(([, v]) => v <= 15);
  const currentPath = feedback?.branchTo || path;

  return (
    <div className="match">
      <header className="match-header">
        <div className={`nation-chip ${side}`}>{NAMES[side] || side} family</div>
        {currentPath && (
          <div className={`path-chip ${currentPath}`}>
            {currentPath === 'stay' ? 'Staying' : 'Going west'}
          </div>
        )}
        <div className="hold-chip" title="Your three meters added up (max 300)">
          Family Score <b>{familyScore(match.meters)}</b><span className="muted"> / 300</span>
        </div>
        {phase && (
          <div className="chapter-chip">
            Chapter {phase.index + 1} of {phase.count} · {phase.date}
          </div>
        )}
      </header>

      <div className="meters-row solo">
        <MetersBar meters={match.meters} meta={meta} title="Your Family" />
      </div>

      {currentPath === 'go' && <RouteStrip chapterIndex={phase?.index ?? 0} />}

      {lowMeter && !feedback && (
        <div className="banner danger" role="alert">
          ⚠️ Your {meta.meters[lowMeter[0]]?.name || lowMeter[0]} is running very low.
        </div>
      )}

      <div className="match-body single">
        <section className="action-panel" aria-live="polite">
          {feedback ? (
            <FeedbackPanel
              feedback={feedback}
              meta={meta}
              matchEnded={!!state.matchEnd}
              onContinue={() => dispatch({ type: 'dismiss-feedback' })}
            />
          ) : eventCard ? (
            <EventCard eventCard={eventCard} meta={meta} onContinue={() => dispatch({ type: 'dismiss-event' })} />
          ) : turn?.yourTurn && turn.kind === 'decision' ? (
            <DecisionPanel turn={turn} />
          ) : (
            <div className="waiting-panel"><div className="pulse-dot" aria-hidden="true" /><p>Steady…</p></div>
          )}
        </section>
      </div>
    </div>
  );
}

/* -------- panels -------- */

function EventCard({ eventCard, meta, onContinue }) {
  const ch = eventCard.chapter;
  return (
    <div className="event-card">
      <div className="event-kicker">Chapter {ch.index + 1} of {ch.count} · {ch.date}</div>
      <h2>{ch.title}</h2>
      <Art name={ch.image} alt={ch.title} className="event-art" />
      <p className="event-text">{eventCard.text}</p>
      {eventCard.eventEffects && (
        <div className="effects-row">
          {Object.entries(eventCard.eventEffects).map(([k, v]) => (
            <span key={k} className={`effect-chip ${v > 0 ? 'up' : 'down'}`}>
              {meta.meters[k]?.name} {v > 0 ? `+${v}` : v}
            </span>
          ))}
        </div>
      )}
      <button className="btn big" onClick={onContinue}>Face it</button>
    </div>
  );
}

function DecisionPanel({ turn }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const isBranch = turn.stepIndex === BRANCH_STEP_INDEX;

  async function choose(choiceIndex) {
    if (busy) return;
    setBusy(true);
    const res = await emitAck('student:submit_move', { move: { kind: 'decision', choiceIndex } });
    if (!res.ok) { setErr(errorText(res.error)); setBusy(false); }
  }

  return (
    <div className="move-panel">
      <h2>{isBranch ? '🧭 The big decision' : '🤔 Your decision'}</h2>
      {isBranch && (
        <div className="branch-banner">
          This is the branch — your family’s path forks here. STAY and GO WEST are
          both right answers; only waiting with no plan is wrong.
        </div>
      )}
      <p className="prompt">{turn.prompt}</p>
      {turn.hint && <p className="hint">💡 {turn.hint}</p>}
      <div className={`choice-list ${isBranch ? 'branch' : ''}`}>
        {(turn.choices || []).map((label, i) => (
          <button
            key={i}
            className={`choice-btn ${isBranch && /^(STAY|GO WEST)/.test(label) ? 'branch-option' : ''}`}
            disabled={busy}
            onClick={() => choose(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="err" role="alert">{err}</p>
    </div>
  );
}

const VERDICT_UI = {
  right: { label: 'A choice that helped', className: 'right', icon: '✓' },
  partial: { label: 'A middle path', className: 'partial', icon: '≈' },
  wrong: { label: 'Not the wise move', className: 'wrong', icon: '✗' },
};

function FeedbackPanel({ feedback, meta, matchEnded, onContinue }) {
  const v = VERDICT_UI[feedback.verdict] || VERDICT_UI.partial;
  return (
    <div className="feedback-panel">
      <div className={`verdict-badge ${v.className}`}>
        <span aria-hidden="true">{v.icon}</span> {v.label}
      </div>
      {feedback.branchTo && (
        <div className={`path-chip ${feedback.branchTo}`} style={{ marginBottom: 10, display: 'inline-block' }}>
          {feedback.branchTo === 'stay' ? 'Your family is staying' : 'Your family is going west'}
        </div>
      )}
      <p className="feedback-text">{feedback.feedback}</p>
      <div className="effects-row">
        {Object.entries(feedback.effects || {}).map(([k, val]) => (
          <span key={k} className={`effect-chip ${val > 0 ? 'up' : 'down'}`}>
            {meta.meters[k]?.name} {val > 0 ? `+${val}` : val}
          </span>
        ))}
      </div>
      <button className="btn big" onClick={onContinue}>
        {matchEnded ? 'See how it ends' : 'Continue'}
      </button>
    </div>
  );
}

/* -------- optional Route 66 progress strip (GO path flourish) -------- */

function RouteStrip({ chapterIndex }) {
  // Chapters 4–6 (index 3,4,5) are the GO road: The Truck, California, New Ground.
  const stops = [3, 4, 5];
  return (
    <div className="route-strip" aria-hidden="true">
      <span className="route-label">Route 66</span>
      {stops.map((s, i) => (
        <span key={s} style={{ display: 'flex', alignItems: 'center', flex: i < stops.length - 1 ? 1 : 'none' }}>
          <span className={`route-dot ${chapterIndex >= s ? 'done' : ''}`} />
          {i < stops.length - 1 && <span className={`route-line ${chapterIndex > s ? 'done' : ''}`} />}
        </span>
      ))}
      <span className="route-truck">🚚</span>
    </div>
  );
}
