import { Layer, Rect } from "react-konva";

const WHITE = "#f0d9b5";
const BLACK = "#b58863";

export default function Board({ height }) {
  const squareSize = height / 8;
  const squares = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      squares.push(
        <Rect
          x={i * squareSize}
          y={j * squareSize}
          width={squareSize}
          height={squareSize}
          fill={i % 2 === j % 2 ? WHITE : BLACK}
        />
      );
    }
  }

  return <Layer>{squares}</Layer>;
}
