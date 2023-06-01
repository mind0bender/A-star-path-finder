import P5, { Color, Vector } from "p5";

const wallColor = 150;
const noWallColor = 0;

export default class Spot {
  private i: number;
  private j: number;
  private _p5: P5;
  private pos: Vector;
  private size: number;
  isWall: boolean;
  neighbours: Set<Spot> = new Set();
  private parent: Spot | null = null;
  g: number = 0;
  h: number = 0;

  private getColor(): Color {
    return this._p5.color(this.isWall ? wallColor : noWallColor);
  }

  constructor(p5: P5, i: number, j: number, size: number) {
    this._p5 = p5;
    this.i = i;
    this.j = j;
    this.size = size;
    this.pos = p5.createVector(this.i * this.size, this.j * this.size);
    this.isWall = this._p5.random(1) < 0.4; // chances of making a wall
  }
  show(fC: Color = this.getColor(), sC: Color = this._p5.color(0)): void {
    this._p5.stroke(sC);
    console.log(sC);
    this._p5.fill(fC);
    this._p5.rect(this.pos.x, this.pos.y, this.size);
  }
  getParent(): Spot | null {
    return this.parent;
  }
  setParent(parent: Spot): boolean {
    if (!this.neighbours.has(parent)) {
      throw new Error("Parent must be a neighbour");
    }
    if (!this.parent || parent.g < this.parent.g) {
      this.parent = parent;
      this.g = this.parent.g + this.distanceFrom(this.parent);
      return true;
    }
    return false;
  }
  distanceFrom(spot: Spot): number {
    // // euclidian distance
    // return Math.abs(this.i - spot.i) + Math.abs(this.j - spot.j);
    return Math.pow(
      Math.pow(this.i - spot.i, 2) + Math.pow(this.j - spot.j, 2),
      0.5
    );
  }
}
