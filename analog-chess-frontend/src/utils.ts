import { Direction, GamePosition, Piece, ScreenPosition } from "./types";

type Line = {
  x1: number;
  y1: number;
  angle: number;
};

// This function returns a line from a location and a direction.
function getLine(location: GamePosition, direction: Direction) {
  const { x, y } = location;
  const { dx, dy } = direction;
  const angle = Math.atan2(dy, dx);
  return {
    x1: x,
    y1: y,
    angle: angle,
  };
}

function distanceToLine(line: Line, piece: Piece) {
  const { x1, y1, angle } = line;
  const { x, y } = piece;
  return Math.abs((x - x1) * Math.sin(angle) - (y - y1) * Math.cos(angle));
}

// Returns the projected distance of a piece on a line.
function project(line: Line, piece: Piece) {
  const { x1, y1 } = line;
  const { x, y } = piece;
  const h = distanceToLine(line, piece);
  return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2 - h ** 2);
}

// Travels along the line
function moveAlongLine(
  point: GamePosition,
  line: Line,
  distance: number
): GamePosition {
  const { angle } = line;
  return {
    x: point.x + distance * Math.cos(angle),
    y: point.y + distance * Math.sin(angle),
  };
}

function dist(a: GamePosition, b: GamePosition) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Clamps the direction if it leaves the board.
export function getRescaledDirection(
  location: GamePosition,
  direction: Direction
) {
  const { x, y } = location;
  let { dx, dy } = direction;
  const radius = 0.7 / 2;

  if (Math.abs(dx) > 0) {
    const ratio = dy / dx;

    if (x + dx + radius > 8) {
      dx = 8 - x - radius;
      dy = ratio * (8 - x - radius);
    }
    if (x + dx - radius < 0) {
      dx = -x + radius;
      dy = ratio * (-x + radius);
    }
  }
  if (Math.abs(dy) > 0) {
    const ratio = dx / dy;

    if (y + dy + radius > 8) {
      dy = 8 - y - radius;
      dx = ratio * (8 - y - radius);
    }
    if (y + dy - radius < 0) {
      dy = -y + radius;
      dx = ratio * (-y + radius);
    }
  }
  return { dx, dy };
}

// This corresponds to the slide() function in the original code.
export function getEdgePosition(
  currentPiece: Piece,
  location: GamePosition,
  direction: Direction,
  pieces: Piece[]
) {
  direction = getRescaledDirection(location, direction);
  const { dx, dy } = direction;

  const line = getLine(location, direction);

  let filteredPieces = pieces
    .filter((piece) => piece !== currentPiece)
    .filter((piece) => {
      // filter the pieces by direction
      return (piece.x - location.x) * dx + (piece.y - location.y) * dy > 0;
    })
    .filter((piece) => {
      // filter the pieces by the distance to the line
      return distanceToLine(line, piece) < 0.7;
    })
    .sort((a, b) => {
      // sort the pieces by the projected distance
      return project(line, a) - project(line, b);
    });

  if (filteredPieces.length === 0) {
    console.log("nothing to check");
  } else {
    const closestPiece = filteredPieces[0];
    const distanceToMoveBack = Math.sqrt(
      0.7 ** 2 - distanceToLine(line, closestPiece) ** 2
    );
    const newDist = project(line, closestPiece) - distanceToMoveBack;
    if (newDist > Math.sqrt(dx ** 2 + dy ** 2)) return;

    let result = moveAlongLine(location, line, newDist);

    // at this point, it can still be a *little* bit off the board
    return result;
  }
}

export function toGamePosition(screenPosition: ScreenPosition): GamePosition {
  return {
    x: screenPosition.x / 100,
    y: screenPosition.y / 100,
  };
}

export function toScreenPosition(gamePosition: GamePosition): ScreenPosition {
  return {
    x: gamePosition.x * 100,
    y: gamePosition.y * 100,
  };
}
