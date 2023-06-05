import P5, { Color } from "p5";

export function mixColors(_p5: P5, v1: string, v2: string, r: number): Color {
  if (r < 0 || r > 1) {
    throw new Error("Invalid Color ratio");
  }
  const c1: Color = _p5.color(v1);
  const c2: Color = _p5.color(v2);
  const color = _p5.lerpColor(c1, c2, r);
  return color;
}
