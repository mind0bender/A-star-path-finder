import setup from "./setup";
import draw from "./draw";
import P5 from "p5";
import Board from "./board";

export const board: Board = new Board();

const sketch: (p5: P5) => void = (p5: P5): void => {
  p5.setup = (): void => setup(p5);
  p5.draw = (): void => draw(p5);
};

new P5(sketch);

window.addEventListener("dblclick", (): void => {
  location.reload();
});
