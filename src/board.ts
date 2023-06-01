import Grid from "./grid";
import Spot from "./spot";

export default class Board {
  grid: Grid | null = null;
  open: Set<Spot> = new Set();
  closed: Set<Spot> = new Set();
}
