export const moves = {
  knight: [], // placeholder
  pawn: [], // placeholder
  rook: [
    { dx: 10, dy: 0, name: "right" },
    { dx: -10, dy: 0, name: "left" },
    { dx: 0, dy: 10, name: "down" },
    { dx: 0, dy: -10, name: "up" },
  ],
  bishop: [
    { dx: 10, dy: 10, name: "right" },
    { dx: -10, dy: -10, name: "left" },
    { dx: -10, dy: 10, name: "down" },
    { dx: 10, dy: -10, name: "up" },
  ],
  queen: [
    { dx: 10, dy: 0, name: "right" },
    { dx: -10, dy: 0, name: "left" },
    { dx: 0, dy: 10, name: "down" },
    { dx: 0, dy: -10, name: "up" },
    { dx: 10, dy: 10, name: "right down" },
    { dx: -10, dy: -10, name: "left up" },
    { dx: -10, dy: 10, name: "down left" },
    { dx: 10, dy: -10, name: "up right" },
  ],
  king: [
    { dx: 1, dy: 0, name: "right" },
    { dx: -1, dy: 0, name: "left" },
    { dx: 0, dy: 1, name: "down" },
    { dx: 0, dy: -1, name: "up" },
    { dx: 1, dy: 1, name: "right down" },
    { dx: -1, dy: -1, name: "left up" },
    { dx: -1, dy: 1, name: "down left" },
    { dx: 1, dy: -1, name: "up right" },
  ],
  white_pawn: [
    { dx: 0, dy: 1, name: "move" },
    { dx: 1, dy: 1, name: "attack left" },
    { dx: -1, dy: 1, name: "attack right" },
  ],
  black_pawn: [
    { dx: 0, dy: -1, name: "move" },
    { dx: 1, dy: -1, name: "attack left" },
    { dx: -1, dy: -1, name: "attack right" },
  ],
};
