import { useState } from "react";
import "./App.css";

import { Stage, Layer, Text, Circle } from "react-konva";
import Board from "./components/Board";
import { RoundOverlay, StraightOverlay } from "./components/Overlay";
import { Piece, ScreenPosition } from "./types";
import { toGamePosition, toScreenPosition } from "./utils";
import { initialGameState } from "./data/initialState";
import DirectionOverlays from "./components/DirectionOverlay";

type AppState = {
  s: ScreenPosition;
  piece: Piece | null;
  isDragging: boolean;
  message: string;
};

const App = () => {
  const [state, setState] = useState<AppState>({
    s: { x: 20, y: 200 },
    piece: null,
    isDragging: false,
    message: "Welcome to Analog Chess",
  });

  const [pieces, setPieces] = useState<Piece[]>(
    initialGameState.map((piece) => ({ ...piece, attackable: false }))
  );

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
    } else if (
      state.piece.type === "pawn" ||
      state.piece.type === "rook" ||
      state.piece.type === "bishop" ||
      state.piece.type === "king" ||
      state.piece.type === "queen"
    ) {
      overlay = <DirectionOverlays piece={state.piece} pieces={pieces} />;
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
