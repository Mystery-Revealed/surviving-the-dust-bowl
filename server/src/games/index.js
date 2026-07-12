// games/index.js — registry of playable games. GameManager looks games up here,
// keeping the engine reusable across Texas History units.

import dustBowl from './dustBowl.js';

export const GAMES = {
  [dustBowl.id]: dustBowl,
};

export function getGame(id) {
  return GAMES[id] || null;
}
