import P5 from "p5";
import { board } from "./script";
import Spot from "./spot";
import { mixColors } from "./misc";
let path: Spot | null;
export default function draw(p5: P5): void {
  const open: Spot[] = Array.from(board.open).sort(
    (prev: Spot, next: Spot): number =>
      prev.h * 1 + prev.g - (next.h * 1 + next.g)
  );
  if (open.length) {
    const openSpot: Spot = open[0];
    if (
      openSpot !== board.grid?.end &&
      openSpot !== board.grid?.start &&
      board.grid?.end &&
      board.grid?.start
    ) {
      openSpot.show(
        mixColors(
          p5,
          "#ff0",
          "#f55",
          1 -
            openSpot.distanceFrom(board.grid?.end) /
              (openSpot.distanceFrom(board.grid?.end) +
                openSpot.distanceFrom(board.grid?.start))
        )
      );
    }

    openSpot.neighbours.forEach((neighbour: Spot): void => {
      if (
        !neighbour.isWall &&
        !board.closed.has(neighbour) &&
        board.grid &&
        board.grid.end &&
        !board.closed.has(board.grid.end)
      ) {
        /* we don't need to check for g values here 
           as we already did it in setParent */
        if (
          neighbour.distanceFrom(openSpot) == 1 ||
          openSpot.getCommonWalls(neighbour).size < 2
        ) {
          neighbour.setParent(openSpot);
          board.open.add(neighbour);
        }
      }
    });
    board.open.delete(openSpot);
    board.closed.add(openSpot);
  }
  if (!board.open.size && board.grid?.end) {
    if (!path) path = board.grid?.end;
    if (path && board.grid.start && path !== board.grid.start) {
      const parent: Spot | null = path.getParent();
      if (parent) {
        p5.stroke(
          mixColors(
            p5,
            "#ff0",
            "#f55",

            path.distanceFrom(board.grid?.end) /
              (path.distanceFrom(board.grid?.end) +
                path.distanceFrom(board.grid?.start))
          )
        );
        p5.strokeWeight(path.size / 4);
        p5.line(path.pos.x, path.pos.y, parent.pos.x, parent.pos.y);
      } else {
        p5.noLoop();
      }
      path = parent;
    }
  }
}
