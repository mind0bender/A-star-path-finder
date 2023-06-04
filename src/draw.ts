import P5 from "p5";
import { board } from "./script";
import Spot from "./spot";
let path: Spot | null;
export default function draw(p5: P5): void {
  const open: Spot[] = Array.from(board.open).sort(
    (prev: Spot, next: Spot): number =>
      prev.h * 1 + prev.g - (next.h * 1 + next.g)
  );
  if (open.length) {
    const openSpot: Spot = open[0];
    openSpot !== board.grid?.end &&
      openSpot !== board.grid?.start &&
      openSpot.show(p5.color(50));

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
    if (path && path !== board.grid.start) {
      p5.stroke("#2fa");
      p5.strokeWeight(path?.size / 4);
      const parent: Spot | null = path.getParent();
      if (parent) {
        p5.line(
          path.pos.x + path.size / 2,
          path.pos.y + path.size / 2,
          parent.pos.x + parent.size / 2,
          parent.pos.y + parent.size / 2
        );
      } else {
        p5.noLoop();
      }
      path = parent;
    }
  }
}
