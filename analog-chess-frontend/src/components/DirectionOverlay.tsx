import { Direction, Piece } from "../types";
import {
  toScreenPosition,
  getEdgePosition,
  toGamePosition,
  getRescaledDirection,
} from "../utils";
import { StraightOverlay } from "./Overlay";

export function DirectionOverlay({
  piece,
  pieces,
  direction,
}: {
  piece: Piece;
  pieces: Piece[];
  direction: Direction;
}) {
  let pastPosition = toScreenPosition({
    x: piece.x,
    y: piece.y,
  });

  let edgePosition = getEdgePosition(
    piece,
    toGamePosition(pastPosition),
    direction,
    pieces
  );

  let color = direction.selected ? "rgb(0, 255, 255)" : "rgb(240,240,0)";

  if (!!edgePosition) {
    return (
      <StraightOverlay
        start={pastPosition}
        end={toScreenPosition(edgePosition)}
        color={color}
      />
    );
  } else {
    let g = toGamePosition(pastPosition);
    direction = getRescaledDirection(g, direction);
    return (
      <StraightOverlay
        start={pastPosition}
        end={toScreenPosition({
          x: g.x + direction.dx,
          y: g.y + direction.dy,
        })}
        color={color}
      />
    );
  }
}

// shows all the directions at once!
export default function DirectionOverlays({
  piece,
  pieces,
  directions,
}: {
  piece: Piece;
  pieces: Piece[];
  directions: Direction[];
}) {
  let overlays = [];
  for (let [i, direction] of directions.entries()) {
    overlays.push(
      <DirectionOverlay
        key={i}
        piece={piece}
        pieces={pieces}
        direction={direction}
      />
    );
  }
  return <>{overlays}</>;
}
