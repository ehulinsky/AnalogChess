// represents an overlay of where a piece can move

import { Arc, Line } from "react-konva";

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
    radius = 0.7 * 100;
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

type RoundOverlayProps = {
  center: { x: number; y: number };
  color: string;
  startAngle?: number;
  endAngle?: number;
  radius?: number;
  width?: number;
};

export function RoundOverlay(props: RoundOverlayProps) {
  let { radius, width, startAngle, endAngle } = props;
  const { center, color } = props;
  if (!radius) {
    radius = Math.sqrt(5) * 100;
  }
  if (!width) {
    width = 0.7 * 100;
  }
  if (!startAngle) {
    startAngle = 0;
  }
  if (!endAngle) {
    endAngle = 360;
  }

  return (
    <Arc
      x={center.x}
      y={center.y}
      innerRadius={radius - width / 2}
      outerRadius={radius + width / 2}
      rotationDeg={-1 * startAngle}
      angle={startAngle - endAngle}
      clockwise={true}
      fill={color}
      opacity={0.5}
    />
  );
}
