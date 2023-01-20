import { moves } from "./data/moves";
import { Direction, GamePosition, Line, Piece, ScreenPosition } from "./types";

// round x to nearest tenth
export const roundX = (x: number) => Math.round(x * 10) / 10;

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

function distanceToLine(line: Line, point: GamePosition) {
  const { x1, y1, angle } = line;
  const { x, y } = point;
  return Math.abs((x - x1) * Math.sin(angle) - (y - y1) * Math.cos(angle));
}

type BoundedLine = {
  start: GamePosition;
  direction: Direction;
};

// Returns the distance along the line. negative if going the other way
function distanceAlong(line: BoundedLine, point: GamePosition) {
  const { start, direction } = line;
  const { dx, dy } = direction;
  const { x, y } = point;
  const { x: x1, y: y1 } = start;
  const angle = Math.atan2(dy, dx);
  return (x - x1) * Math.cos(angle) + (y - y1) * Math.sin(angle);
}

function dist(a: GamePosition, b: GamePosition) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
function magnitude(direction: Direction) {
  return Math.sqrt(direction.dx ** 2 + direction.dy ** 2);
}

// Projects a point onto a line
function project(line: BoundedLine, point: GamePosition) {
  const _line = getLine(line.start, line.direction);
  // bound d to be between 0 and the magnitude of the line
  const d = Math.max(
    Math.min(distanceAlong(line, point), magnitude(line.direction)),
    0
  );
  return moveAlongLine(line.start, _line, d);
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

// Clamps the direction if it leaves the board.
export function getRescaledDirection(
  location: GamePosition,
  direction: Direction
): Direction {
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
  return { ...direction, dx, dy };
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

  const line = { start: location, direction };
  const _line = getLine(location, direction);

  let filteredPieces = pieces
    .filter((piece) => piece !== currentPiece)
    .filter((piece) => {
      // filter the pieces by direction
      return (piece.x - location.x) * dx + (piece.y - location.y) * dy > 0;
    })
    .filter((piece) => {
      // filter the pieces by the distance to the line
      return distanceToLine(_line, { x: piece.x, y: piece.y }) < 0.7;
    })
    .sort((a, b) => {
      // sort the pieces by the projected distance
      return distanceAlong(line, a) - distanceAlong(line, b);
    });

  if (filteredPieces.length > 0) {
    const closestPiece = filteredPieces[0];
    const xy = { x: closestPiece.x, y: closestPiece.y };
    const distanceToMoveBack = Math.sqrt(
      0.7 ** 2 - distanceToLine(_line, xy) ** 2
    );
    const newDist = distanceAlong(line, xy) - distanceToMoveBack;
    if (newDist > Math.sqrt(dx ** 2 + dy ** 2)) return;
    if (newDist < 0) return { x: location.x, y: location.y }; // should be an error

    let result = moveAlongLine(location, _line, newDist);

    // at this point, it can still be a *little* bit off the board
    return result;
  }
}

// returns valid straight moves
export function getPaths(piece: Piece): Direction[] {
  if (piece.type === "pawn" && piece.color === "black")
    return moves["black_pawn"];
  if (piece.type === "pawn" && piece.color === "white")
    return moves["white_pawn"];
  return moves[piece.type];
}

// this function is used to get the path of a piece
export function selectPath(
  start: GamePosition,
  paths: Direction[],
  currentLocation: GamePosition
): {
  path: Direction;
  // distance: number;
  validPosition: GamePosition;
} {
  // for each path, find the closest point on the path
  let min_h = 9999999;
  let min_l = 0;
  let min_path: Direction = { dx: 0, dy: 0 };
  for (let path of paths) {
    let h =
      Math.abs(
        path.dx * (start.y - currentLocation.y) -
          (start.x - currentLocation.x) * path.dy
      ) / magnitude(path);

    if (h < min_h) {
      min_path = path;
      min_h = h;
      let dot_prod =
        path.dx * (start.x - currentLocation.x) +
        (start.y - currentLocation.y) * path.dy;

      if (dot_prod == 0) {
        min_l = 0;
      } else {
        min_l = dist(start, currentLocation) ** 2 - h ** 2;
        min_l = Math.sqrt(min_l) * (dot_prod / Math.abs(dot_prod));
      }
    }
  }
  console.log(min_path.name, "travel", min_l, "distance", min_h);

  return { path: min_path, validPosition: currentLocation };
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
