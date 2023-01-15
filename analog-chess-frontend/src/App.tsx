import { useState } from "react";
import "./App.css";

import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";
import Board from "./components/Board";

const initialGameState = [
  { type: "pawn", color: "white", x: 0.5, y: 1.5 },
  { type: "pawn", color: "white", x: 1.5, y: 1.5 },
  { type: "pawn", color: "white", x: 2.5, y: 1.5 },
  { type: "pawn", color: "white", x: 3.5, y: 1.5 },
  { type: "pawn", color: "white", x: 4.5, y: 1.5 },
  { type: "pawn", color: "white", x: 5.5, y: 1.5 },
  { type: "pawn", color: "white", x: 6.5, y: 1.5 },
  { type: "pawn", color: "white", x: 7.5, y: 1.5 },
  { type: "rook", color: "white", x: 0.5, y: 0.5 },
  { type: "knight", color: "white", x: 1.5, y: 0.5 },
  { type: "bishop", color: "white", x: 2.5, y: 0.5 },
  { type: "queen", color: "white", x: 3.5, y: 0.5 },
  { type: "king", color: "white", x: 4.5, y: 0.5 },
  { type: "bishop", color: "white", x: 5.5, y: 0.5 },
  { type: "knight", color: "white", x: 6.5, y: 0.5 },
  { type: "rook", color: "white", x: 7.5, y: 0.5 },
  { type: "pawn", color: "black", x: 0.5, y: 6.5 },
  { type: "pawn", color: "black", x: 1.5, y: 6.5 },
  { type: "pawn", color: "black", x: 2.5, y: 6.5 },
  { type: "pawn", color: "black", x: 3.5, y: 6.5 },
  { type: "pawn", color: "black", x: 4.5, y: 6.5 },
  { type: "pawn", color: "black", x: 5.5, y: 6.5 },
  { type: "pawn", color: "black", x: 6.5, y: 6.5 },
  { type: "pawn", color: "black", x: 7.5, y: 6.5 },
  { type: "rook", color: "black", x: 0.5, y: 7.5 },
  { type: "knight", color: "black", x: 1.5, y: 7.5 },
  { type: "bishop", color: "black", x: 2.5, y: 7.5 },
  { type: "queen", color: "black", x: 3.5, y: 7.5 },
  { type: "king", color: "black", x: 4.5, y: 7.5 },
  { type: "bishop", color: "black", x: 5.5, y: 7.5 },
  { type: "knight", color: "black", x: 6.5, y: 7.5 },
  { type: "rook", color: "black", x: 7.5, y: 7.5 },
];

const App = () => {
  const [state, setState] = useState({
    x: 20,
    y: 200,
    isDragging: false,
  });

  // round x to nearest tenth
  const roundedX = (x: number) => Math.round(x * 10) / 10;

  return (
    <div className="App">
      <Stage width={window.innerWidth * 0.8} height={window.innerHeight}>
        <Board height={window.innerHeight - 100} />
        <Layer>
          <Text
            text={`You dropped it at: (${state.x}, ${state.y})`}
            fontSize={15}
          />
          {initialGameState.map((piece) => {
            return (
              <Circle
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
                    x: roundedX(e.target.x()),
                    y: roundedX(e.target.y()),
                  });
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
