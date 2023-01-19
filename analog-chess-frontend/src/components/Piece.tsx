import { useState } from "react";
import { Circle } from "react-konva";
import { GamePosition, Piece } from "../types";
import { roundX, toGamePosition } from "../utils";
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
  });

  let overlay;
  if (
    piece.type === "pawn" ||
    piece.type === "rook" ||
    piece.type === "bishop" ||
    piece.type === "king" ||
    piece.type === "queen"
  ) {
    overlay = <DirectionOverlays piece={piece} pieces={pieces} />;
  }

  return (
    <>
      {showOverlay && overlay}
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
        onDragMove={(e) => {
          // // bound the piece to the board
          // if (e.target.x() > 0) {
          //   e.target.x(0);
          // }
          if (onDrag) {
            onDrag(
              piece,
              toGamePosition({
                x: roundX(e.target.x()),
                y: roundX(e.target.y()),
              })
            );
          }
          setState({
            ...state,
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
      />
    </>
  );
}
