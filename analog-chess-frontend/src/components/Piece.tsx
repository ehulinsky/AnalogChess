import { Circle } from "react-konva";

type PieceProps = {
  type: string;
  x: number;
  y: number;
  color?: string;
  size?: number;
};

export default function Piece({
  x,
  y,
  color = "green",
  size = 50,
}: PieceProps) {
  return <Circle x={x} y={y} radius={size} fill={color} />;
}