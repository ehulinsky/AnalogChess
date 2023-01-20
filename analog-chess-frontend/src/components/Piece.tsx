import { useState } from "react";
import { Circle, Group, Text } from "react-konva";
import pieceSymbols from "../data/pieceSymbols";
import { GamePosition, Piece } from "../types";
import { getPaths, roundX, selectPath, toGamePosition } from "../utils";
import DirectionOverlays from "./DirectionOverlay";

type PieceProps = {
  piece: Piece;
  pieces: Piece[];
  onMove: (piece: Piece, location: GamePosition) => void;
  onDrag?: (piece: Piece, location: GamePosition) => void;
  showOverlay?: boolean;
};

export default function PieceWithOverlay({
  piece,
  pieces,
  onMove,
  onDrag,
  showOverlay = false,
}: PieceProps) {
  let [state, setState] = useState({
    s: { x: 20, y: 200 },
    isDragging: false,
    paths: getPaths(piece).map((path) => ({ ...path, selected: false })),
  });

  let overlay;
  if (
    piece.type === "pawn" ||
    piece.type === "rook" ||
    piece.type === "bishop" ||
    piece.type === "king" ||
    piece.type === "queen"
  ) {
    overlay = (
      <DirectionOverlays
        piece={piece}
        pieces={pieces}
        directions={state.paths}
      />
    );
  }

  return (
    <>
      {state.isDragging && overlay}
      <Group
        x={piece.x * 100}
        y={piece.y * 100}
        draggable
        onDragStart={() => {
          setState({
            ...state,
            isDragging: true,
          });
        }}
        onDragMove={(e) => {
          // // bound the piece to the board
          // if (e.target.x() > 0) {
          //   e.target.x(0);
          // }
          const hoverPosition = toGamePosition({
            x: roundX(e.target.x()),
            y: roundX(e.target.y()),
          });

          let { path, validPosition } = selectPath(
            { x: piece.x, y: piece.y },
            getPaths(piece),
            hoverPosition
          );

          e.target.x(validPosition.x * 100);
          e.target.y(validPosition.y * 100);

          if (onDrag) {
            onDrag(piece, hoverPosition);
          }

          // update state path selected
          setState({
            ...state,
            paths: state.paths.map((p) => {
              if (p.name === path.name) {
                return { ...p, selected: true };
              }
              return { ...p, selected: false };
            }),
            s: {
              x: roundX(e.target.x()),
              y: roundX(e.target.y()),
            },
          });
        }}
        onDragEnd={(e) => {
          setState({
            ...state,
            isDragging: false,
          });
          onMove(
            piece,
            toGamePosition({
              x: roundX(e.target.x()),
              y: roundX(e.target.y()),
            })
          );
        }}
      >
        <Circle key={piece.id} radius={35} fill={piece.color} />
        <Text
          text={pieceSymbols["white"][piece.type]}
          width={100}
          height={100}
          align="center"
          fontSize={80}
          x={-50}
          y={-40}
          fill={piece.color === "white" ? "black" : "white"}
        />
      </Group>
    </>
  );
}
