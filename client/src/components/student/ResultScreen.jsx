// ResultScreen.jsx — two stories, in order: (1) how the FAMILY fared (Family
// Score + ending tier), (2) the score that matters to your teacher — accuracy,
// how sound your choices were — then the path-specific debrief, which always
// lands on the both-were-brave line (spec §3.3, §11) and nudges a replay: a
// different family, or the road not taken.

import { Art } from '../../services/assets.jsx';

const TIER_CLASS = { through: 'win', standing: 'mid', battered: 'low' };
const NAMES = { owner: 'Farm-Owner', tenant: 'Tenant-Farmer', town: 'Town' };
const BOTH_BRAVE_MARK = 'Neither family was wrong.';

export default function ResultScreen({ state, dispatch }) {
  const end = state.matchEnd;
  const meta = end.meta || state.match?.begin?.meta;
  const you = end.you;
  const ending = you.ending;
  const score = you.score ?? 0;
  const side = end.yourSide;
  const path = you.path; // 'stay' | 'go'

  const splitIdx = you.debrief?.indexOf(BOTH_BRAVE_MARK);
  const mainDebrief = splitIdx > -1 ? you.debrief.slice(0, splitIdx).trim() : you.debrief;
  const braveDebrief = splitIdx > -1 ? you.debrief.slice(splitIdx).trim() : null;

  return (
    <div className="card result-screen">
      <div className="event-kicker">
        {NAMES[side] || side} family · {path === 'go' ? 'Went west' : 'Stayed and rebuilt'}
      </div>
      <h1 className={`result-headline ${TIER_CLASS[ending.key] || 'mid'}`}>{ending.title}</h1>

      <Art name="ending.jpg" alt="A Panhandle family, worn but together, under a clearing sky" className="result-art" />

      <p className="fall-note">
        This game was never about "winning" the Dust Bowl. It was about
        <b> the hard choices real families faced</b> — and how well your calls
        matched what actually helped families survive.
      </p>

      <div className={`ending-block ${path}`}>
        <p>{ending.text}</p>
      </div>

      <div className="score-block" aria-label="Family Score">
        <div className="score-head">
          <span className="score-title">🌾 Family Score</span>
          <span className="score-num">{score}<span className="muted"> / 300</span></span>
        </div>
        <span className="score-bar-track">
          <span className={`score-bar ${TIER_CLASS[ending.key] || 'mid'}`} style={{ width: `${Math.min(100, (score / 300) * 100)}%` }} />
        </span>
        <div className="meter-final-row">
          {Object.entries(you.meters || {}).map(([k, v]) => (
            <span key={k} className="meter-final">{meta?.meters?.[k]?.name || k}: <b>{v}</b></span>
          ))}
        </div>
      </div>

      <div className="accuracy-block">
        <div className="accuracy-number">{you.accuracy}%</div>
        <div>
          <b>Your accuracy — the score your teacher sees.</b>
          <p>How well your 12 calls matched what actually helped families survive the Dust Bowl. Staying and going west were both graded as right choices — the only wrong move was waiting with no plan.</p>
        </div>
      </div>

      <div className="debrief">
        <h3>What really happened</h3>
        <p>{mainDebrief}</p>
        {braveDebrief && <p className="both-brave">{braveDebrief}</p>}
      </div>

      <div className="btn-col">
        <button className="btn big" onClick={() => dispatch({ type: 'play-again' })}>
          Play again — a different family, or the other road
        </button>
      </div>
    </div>
  );
}
