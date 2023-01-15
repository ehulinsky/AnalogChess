// represents an overlay of where a piece can move

import { Line } from "react-konva";

type StraightOverlayProps = {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  radius?: number;
};

export function StraightOverlay(props: StraightOverlayProps) {
  const { start, end, color } = props;
  let { radius } = props;
  if (!radius) {
    radius = 70;
  }

  return (
    <Line
      points={[start.x, start.y, end.x, end.y]}
      stroke={color}
      strokeWidth={radius}
      lineCap="round"
      lineJoin="round"
      opacity={0.5}
    />
  );
}
