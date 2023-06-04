import { board } from "./script";
import Grid from "./grid";
import P5, { Renderer } from "p5";
import Spot from "./spot";
import Board from "board";

const rows: number = 50;
const cols: number = 50;

export default function setup(p5: P5): void {
  const canvasSize: number = [innerHeight, innerWidth].sort()[1] - 20;
  const canvas: Renderer = p5.createCanvas(canvasSize, canvasSize);
  canvas.parent("app");
  // p5.frameRate((rows * cols) / (10 * 60));
  // p5.frameRate(30);

  p5.strokeCap("round");
  // // box border
  // p5.noFill();
  // p5.stroke("#2fa");
  // p5.background("#0e0e0e");
  // p5.angleMode("degrees");

  // grid making
  board.grid = new Grid({ p5, cols, rows });
  const start: Spot = board.grid.setStart(
    Math.floor(p5.random(cols)),
    Math.floor(p5.random(rows))
  );
  const end: Spot = board.grid.setEnd(
    Math.floor(p5.random(cols)),
    Math.floor(p5.random(rows))
  );
  board.open.add(start);
  board.grid.resolveNeighbours();

  // calculate heuristics
  board.grid.spots.forEach((row: Spot[]): void => {
    row.forEach((spot: Spot): void => {
      spot.h = spot.distanceFrom(end);
    });
  });

  // for debugging
  Object.defineProperties(window, {
    board: {
      get(): Board {
        return board;
      },
    },
    p5: {
      get(): P5 {
        return p5;
      },
    },
  });

  board.grid?.show();
}
