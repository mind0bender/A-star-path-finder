import P5, { Color, Vector } from "p5";

const wallColor = 155;
const noWallColor = 0;

export default class Spot {
  private i: number;
  private j: number;
  private _p5: P5;
  pos: Vector;
  size: number;
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
    this.isWall = this._p5.random(1) < 0.25; // chances of making a wall
  }
  show(fC: Color = this.getColor(), sC: Color = fC): void {
    this._p5.stroke(sC);
    this._p5.fill(fC);
    if (!this.isWall) {
      this._p5.strokeWeight(this.size / 7.5);
      const parentSpot: Spot | null = this.getParent();
      if (parentSpot) {
        sC.setAlpha(255 * 0.75);
        this._p5.stroke(sC);
        this._p5.line(
          this.pos.x,
          this.pos.y,
          parentSpot.pos.x,
          parentSpot.pos.y
        );
      } else {
        this._p5.stroke(sC);
        this._p5.circle(this.pos.x, this.pos.y, this.size / 2);
      }
    } else {
      this._p5.strokeWeight(this.size / 10);
      this._p5.fill(0);

      const neighbouringWalls: Spot[] = Array.from(this.neighbours).filter(
        (neighbour: Spot): boolean => neighbour.isWall
      );
      neighbouringWalls.forEach((neighbour: Spot): void => {
        this._p5.stroke(sC);
        this._p5.line(this.pos.x, this.pos.y, neighbour.pos.x, neighbour.pos.y);
      });
      if (neighbouringWalls.length <= 1) {
        this._p5.stroke(sC);
        this._p5.circle(this.pos.x, this.pos.y, this.size / 4);
      }
    }
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

    // pythagorian distance
    return Math.pow(
      Math.pow(this.i - spot.i, 2) + Math.pow(this.j - spot.j, 2),
      0.5
    );
  }
  getCommonWalls(spot: Spot): Set<Spot> {
    const commonWall: Set<Spot> = new Set();
    this.neighbours.forEach((neighbor: Spot): void => {
      if (neighbor.isWall && spot.neighbours.has(neighbor)) {
        commonWall.add(neighbor);
      }
    });
    return commonWall;
  }
}
