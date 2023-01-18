export type Piece = {
  type: "pawn" | "rook" | "knight" | "bishop" | "king" | "queen";
  color: "white" | "black";
  x: number;
  y: number;
  id: number;
  attackable?: boolean;
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

// Represents a line starting from a point (x1, y1) and going in the direction of angle.
export type Line = {
  x1: number;
  y1: number;
  angle: number;
};
