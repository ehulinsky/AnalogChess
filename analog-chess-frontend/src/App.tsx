import { useState } from "react";
import "./App.css";

import { Stage, Layer, Text, Circle } from "react-konva";
import Board from "./components/Board";
import { RoundOverlay, StraightOverlay } from "./components/Overlay";
import { Direction, GamePosition, Piece, ScreenPosition } from "./types";
import {
  getEdgePosition,
  getRescaledDirection,
  toGamePosition,
  toScreenPosition,
} from "./utils";

const initialGameState: Piece[] = [
  { type: "pawn", color: "white", x: 0.5, y: 1.5, id: 0 },
  { type: "pawn", color: "white", x: 1.5, y: 1.5, id: 1 },
  { type: "pawn", color: "white", x: 2.5, y: 1.5, id: 2 },
  { type: "pawn", color: "white", x: 3.5, y: 1.5, id: 3 },
  { type: "pawn", color: "white", x: 4.5, y: 1.5, id: 4 },
  { type: "pawn", color: "white", x: 5.5, y: 1.5, id: 5 },
  { type: "pawn", color: "white", x: 6.5, y: 1.5, id: 6 },
  { type: "pawn", color: "white", x: 7.5, y: 1.5, id: 7 },
  { type: "rook", color: "white", x: 0.5, y: 0.5, id: 8 },
  { type: "knight", color: "white", x: 1.5, y: 0.5, id: 9 },
  { type: "bishop", color: "white", x: 2.5, y: 0.5, id: 10 },
  { type: "king", color: "white", x: 3.5, y: 0.5, id: 11 },
  { type: "queen", color: "white", x: 4.5, y: 0.5, id: 12 },
  { type: "bishop", color: "white", x: 5.5, y: 0.5, id: 13 },
  { type: "knight", color: "white", x: 6.5, y: 0.5, id: 14 },
  { type: "rook", color: "white", x: 7.5, y: 0.5, id: 15 },
  { type: "pawn", color: "black", x: 0.5, y: 6.5, id: 16 },
  { type: "pawn", color: "black", x: 1.5, y: 6.5, id: 17 },
  { type: "pawn", color: "black", x: 2.5, y: 6.5, id: 18 },
  { type: "pawn", color: "black", x: 3.5, y: 6.5, id: 19 },
  { type: "pawn", color: "black", x: 4.5, y: 6.5, id: 20 },
  { type: "pawn", color: "black", x: 5.5, y: 6.5, id: 21 },
  { type: "pawn", color: "black", x: 6.5, y: 6.5, id: 22 },
  { type: "pawn", color: "black", x: 7.5, y: 6.5, id: 23 },
  { type: "rook", color: "black", x: 0.5, y: 7.5, id: 24 },
  { type: "knight", color: "black", x: 1.5, y: 7.5, id: 25 },
  { type: "bishop", color: "black", x: 2.5, y: 7.5, id: 26 },
  { type: "king", color: "black", x: 3.5, y: 7.5, id: 27 },
  { type: "queen", color: "black", x: 4.5, y: 7.5, id: 28 },
  { type: "bishop", color: "black", x: 5.5, y: 7.5, id: 29 },
  { type: "knight", color: "black", x: 6.5, y: 7.5, id: 30 },
  { type: "rook", color: "black", x: 7.5, y: 7.5, id: 31 },
];

type AppState = {
  s: ScreenPosition;
  piece: Piece | null;
  isDragging: boolean;
  message: string;
};

// compute affordances for current moving piece
function DirectionOverlays(
  piece: Piece,
  pieces: Piece[],
  currentPosition: ScreenPosition,
  directions: Direction[]
) {
  let overlays = [];
  for (let direction of directions) {
    let edgePosition = getEdgePosition(
      piece,
      toGamePosition(currentPosition),
      direction,
      pieces
    );

    if (!!edgePosition) {
      overlays.push(
        <StraightOverlay
          start={currentPosition}
          end={toScreenPosition(edgePosition)}
          color="rgb(0,255,0)"
        />
      );
    } else {
      let g = toGamePosition(currentPosition);
      direction = getRescaledDirection(g, direction);
      overlays.push(
        <StraightOverlay
          start={currentPosition}
          end={toScreenPosition({
            x: g.x + direction.dx,
            y: g.y + direction.dy,
          })}
          color="rgb(0,255,0)"
        />
      );
    }
  }
  return overlays;
}

const moves = {
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
    { dx: 10, dy: 10, name: "right" },
    { dx: -10, dy: -10, name: "left" },
    { dx: -10, dy: 10, name: "down" },
    { dx: 10, dy: -10, name: "up" },
  ],
  king: [
    { dx: 1, dy: 0, name: "right" },
    { dx: -1, dy: 0, name: "left" },
    { dx: 0, dy: 1, name: "down" },
    { dx: 0, dy: -1, name: "up" },
    { dx: 1, dy: 1, name: "right" },
    { dx: -1, dy: -1, name: "left" },
    { dx: -1, dy: 1, name: "down" },
    { dx: 1, dy: -1, name: "up" },
  ],
  white_pawn: [{ dx: 0, dy: 1, name: "right" }],
  black_pawn: [{ dx: 0, dy: -1, name: "right" }],
};
const App = () => {
  const [state, setState] = useState<AppState>({
    s: { x: 20, y: 200 },
    piece: null,
    isDragging: false,
    message: "Welcome to Analog Chess",
  });

  const [pieces, setPieces] = useState<Piece[]>(initialGameState);

  // location is in game coordinates
  const movePiece = (piece: Piece, location: { x: number; y: number }) => {
    console.log("moved", piece.type, "to", location.x, location.y);
    const { x, y } = location;
    const newPieces = pieces.map((p) => {
      if (p.id === piece.id) {
        return { ...p, x, y };
      }
      return p;
    });
    setPieces(newPieces);
  };

  // round x to nearest tenth
  const roundX = (x: number) => Math.round(x * 10) / 10;

  let overlay;
  if (state.piece) {
    if (state.piece.type === "knight") {
      overlay = <RoundOverlay center={state.s} color="blue" />;
    } else if (state.piece.type === "pawn") {
      let key: "white_pawn" | "black_pawn" = "white_pawn";
      if (state.piece.color === "black") key = "black_pawn";
      let overlays = DirectionOverlays(
        state.piece,
        pieces,
        state.s,
        moves[key]
      );
      overlay = <>{overlays}</>;
    } else if (
      state.piece.type === "rook" ||
      state.piece.type === "bishop" ||
      state.piece.type === "king" ||
      state.piece.type === "queen"
    ) {
      let overlays = DirectionOverlays(
        state.piece,
        pieces,
        state.s,
        moves[state.piece.type]
      );
      overlay = <>{overlays}</>;
    }
  }

  return (
    <div className="App">
      <Stage width={window.innerWidth * 0.8} height={window.innerHeight}>
        <Board height={window.innerHeight - 100} />
        <Layer>
          <Text text={state.message} fontSize={15} />
          <StraightOverlay
            start={toScreenPosition({ x: 0.5, y: 1.5 })}
            end={toScreenPosition({ x: 2.5, y: 1.5 })}
            color="rgb(0,255,0)"
          />
          <StraightOverlay
            start={toScreenPosition({ x: 0.5, y: 6.5 })}
            end={toScreenPosition({ x: 4.5, y: 2.5 })}
            color="red"
          />
          {overlay}
          {pieces.map((piece) => {
            return (
              <Circle
                key={piece.id}
                x={piece.x * 100}
                y={piece.y * 100}
                radius={35}
                fill={piece.color}
                draggable
                onDragStart={() => {
                  setState({
                    ...state,
                    isDragging: true,
                    piece: piece,
                  });
                }}
                onDragMove={(e) => {
                  setState({
                    ...state,
                    piece: piece,
                    s: {
                      x: roundX(e.target.x()),
                      y: roundX(e.target.y()),
                    },
                  });
                }}
                onDragEnd={(e) => {
                  setState({
                    ...state,
                    message: `You dropped the ${
                      state.piece && state.piece.type
                    } at: (${roundX(e.target.x())}, ${roundX(e.target.y())})`,
                    isDragging: false,
                    piece: null,
                  });
                  movePiece(
                    piece,
                    toGamePosition({
                      x: roundX(e.target.x()),
                      y: roundX(e.target.y()),
                    })
                  );
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
