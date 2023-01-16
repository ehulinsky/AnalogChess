import { useState } from "react";
import "./App.css";

import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";
import Board from "./components/Board";
import { RoundOverlay, StraightOverlay } from "./components/Overlay";

type Piece = {
  type: "pawn" | "rook" | "knight" | "bishop" | "king" | "queen";
  color: "white" | "black";
  x: number;
  y: number;
  id: number;
};

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
  x: number;
  y: number;
  piece: Piece | null;
  isDragging: boolean;
};

const App = () => {
  const [state, setState] = useState<AppState>({
    x: 20,
    y: 200,
    piece: null,
    isDragging: false,
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

  const toGamePosition = (screenPosition: { x: number; y: number }) => {
    return {
      x: screenPosition.x / 100,
      y: screenPosition.y / 100,
    };
  };

  const toScreenPosition = (gamePosition: { x: number; y: number }) => {
    return {
      x: gamePosition.x * 100,
      y: gamePosition.y * 100,
    };
  };

  // round x to nearest tenth
  const roundX = (x: number) => Math.round(x * 10) / 10;

  return (
    <div className="App">
      <Stage width={window.innerWidth * 0.8} height={window.innerHeight}>
        <Board height={window.innerHeight - 100} />
        <Layer>
          <Text
            text={`You dropped the ${state.piece && state.piece.type} at: (${
              state.x
            }, ${state.y})`}
            fontSize={15}
          />
          <StraightOverlay
            start={toScreenPosition({ x: 0.5, y: 1.5 })}
            end={toScreenPosition({ x: 2.5, y: 1.5 })}
            color="green"
          />
          <StraightOverlay
            start={toScreenPosition({ x: 0.5, y: 6.5 })}
            end={toScreenPosition({ x: 4.5, y: 2.5 })}
            color="red"
          />
          <RoundOverlay
            center={toScreenPosition({ x: 4.5, y: 4.5 })}
            color="blue"
          />
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
                  });
                }}
                onDragEnd={(e) => {
                  setState({
                    ...state,
                    isDragging: false,
                    piece,
                    x: roundX(e.target.x()),
                    y: roundX(e.target.y()),
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
