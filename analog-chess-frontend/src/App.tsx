import { useState } from "react";
import "./App.css";

import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";
import Board from "./components/Board";

const App = () => {
  const [state, setState] = useState({
    x: 20,
    y: 200,
    isDragging: false,
  });

  return (
    <div className="App">
      <Stage width={window.innerWidth * 0.8} height={window.innerHeight}>
        <Board height={window.innerHeight - 100} />
        <Layer>
          <Text text={`Your line is at ${state.x}, ${state.y}`} fontSize={15} />
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill="red"
            shadowBlur={10}
          />
          <Circle x={200} y={100} radius={50} fill="green" />
          <Line
            x={state.x}
            y={state.y}
            points={[0, 0, 100, 0, 100, 100]}
            tension={0.5}
            closed
            draggable
            stroke="black"
            fillLinearGradientStartPoint={{ x: -50, y: -50 }}
            fillLinearGradientEndPoint={{ x: 50, y: 50 }}
            fillLinearGradientColorStops={[0, "red", 1, "yellow"]}
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
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
