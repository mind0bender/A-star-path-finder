import P5 from "p5";
import Spot from "./spot";

export default class Grid {
  spots: Spot[][] = [];
  end: Spot | null = null;
  start: Spot | null = null;
  cols: number;
  rows: number;
  private _p5: P5;
  constructor({ p5, cols, rows }: { p5: P5; cols: number; rows: number }) {
    this._p5 = p5;
    this.cols = cols;
    this.rows = rows;
    const spotSize: number = p5.width / cols;
    for (let j: number = 0; j < rows; j++) {
      const row: Spot[] = [];
      for (let i: number = 0; i < cols; i++) {
        const spot: Spot = new Spot(p5, i, j, spotSize);
        row.push(spot);
      }
      this.spots.push(row);
    }
  }
  getStart(): Spot {
    if (!this.start) {
      throw new Error("Start is not set");
    }
    return this.start;
  }
  setStart(i: number, j: number): Spot {
    if (!this.spots[j] || !this.spots[j][i]) {
      throw new Error("Invalid start position");
    }
    this.start = this.spots[j][i];
    this.start.isWall = false;
    return this.start;
  }
  getEnd(): Spot {
    if (!this.end) {
      throw new Error("End is not set");
    }
    return this.end;
  }
  setEnd(i: number, j: number): Spot {
    if (!this.spots[j] || !this.spots[j][i]) {
      throw new Error("Invalid end position");
    }
    this.end = this.spots[j][i];
    this.end.isWall = false;
    return this.end;
  }
  resolveNeighbours(): void {
    for (let j: number = 0; j < this.spots.length; j++) {
      const row: Spot[] = this.spots[j];
      for (let i: number = 0; i < row.length; i++) {
        const spot: Spot = row[i];
        // checking neighbors
        for (let dy: number = -1; dy <= 1; dy++) {
          for (let dx: number = -1; dx <= 1; dx++) {
            if (this.spots[j + dy] && this.spots[j + dy][i + dx]) {
              const neighbour: Spot = this.spots[j + dy][i + dx];
              if (neighbour !== spot && !neighbour.isWall) {
                spot.neighbours.add(this.spots[j + dy][i + dx]);
              }
            }
          }
        }
      }
    }
  }
  show(): void {
    this._p5.strokeWeight(0);
    for (const row of this.spots) {
      for (const spot of row) {
        switch (spot) {
          case this.start:
            spot.show(this._p5.color("#2fa"), this._p5.color(0));
            break;
          case this.end:
            spot.show(this._p5.color("#f55"), this._p5.color(0));
            break;
          default:
            spot.show();
            break;
        }
      }
    }
  }
}
