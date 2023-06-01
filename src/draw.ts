import P5 from "p5";
import { board } from "./script";
import Spot from "./spot";
let path: Spot | null;
export default function draw(p5: P5): void {
  const open: Spot[] = Array.from(board.open).sort(
    (prev: Spot, next: Spot): number => prev.h + prev.g - (next.h + next.g)
  );
  // for (const openSpot of open) {
  if (open.length) {
    const openSpot: Spot = open[0];
    openSpot !== board.grid?.end &&
      openSpot !== board.grid?.start &&
      openSpot.show(p5.color(50));

    openSpot.neighbours.forEach((neighbour: Spot): void => {
      if (
        !board.closed.has(neighbour) &&
        board.grid &&
        board.grid.end &&
        !board.closed.has(board.grid.end)
      ) {
        /* we don't need to check for g values here 
           as we already did it in setParent */
        neighbour.setParent(openSpot);
        // neighbour !== board.grid.end &&
        //   neighbour !== board.grid.start &&
        //   neighbour.show(p5.color(100));
        board.open.add(neighbour);
      }
    });
    board.open.delete(openSpot);
    board.closed.add(openSpot);
  }
  if (!board.open.size && board.grid?.end) {
    if (!path) path = board.grid?.end.getParent();
    if (path && path !== board.grid.start) {
      path.show(p5.color("#2fa"));
      path = path.getParent();
    }
  }
  // container box
  p5.stroke("#2fa");
  p5.strokeWeight(4);
  p5.noFill();
  p5.rect(1, 1, p5.width - 2);
  p5.strokeWeight(1);
}
