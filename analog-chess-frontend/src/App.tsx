import { useState } from "react";
import "./App.css";

import { Stage, Layer, Text } from "react-konva";
import Board from "./components/Board";
import { Piece, ScreenPosition } from "./types";
import { initialGameState } from "./data/initialState";
import PieceWithOverlay from "./components/Piece";

import { boop, broadcastMove } from "./networking";

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
    broadcastMove(piece, location);
    const newPieces = pieces.map((p) => {
      if (p.id === piece.id) {
        return { ...p, x, y };
      }
      return p;
    });
    setPieces(newPieces);
  };

  return (
    <div className="App">
      <button onClick={boop}>Boop the server!</button>
      <Stage width={window.innerWidth * 0.8} height={window.innerHeight}>
        <Board height={window.innerHeight - 100} />
        <Layer>
          <Text text={state.message} fontSize={15} />
          {pieces.map((piece) => (
            <PieceWithOverlay
              piece={piece}
              pieces={pieces}
              onMove={movePiece}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
