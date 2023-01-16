export type Piece = {
  type: "pawn" | "rook" | "knight" | "bishop" | "king" | "queen";
  color: "white" | "black";
  x: number;
  y: number;
  id: number;
};

export type Direction = {
  dx: number;
  dy: number;
  name?: string;
};

export type GamePosition = {
  x: number;
  y: number;
};

export type ScreenPosition = {
  x: number;
  y: number;
};
