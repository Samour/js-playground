import { Coordinate } from 'sudoku/board/model';

export interface ICellAnalyser {
  adjacentCells(x: number, y: number): Coordinate[];
  getCellSets(): Coordinate[][];
}

export class HorizontalCellAnalyser implements ICellAnalyser {

  public adjacentCells(x: number, y: number, includeOwn: boolean = false): Coordinate[] {
    const coords: Coordinate[] = [];
    for (let i = 0; i < 9; i++) {
      if (includeOwn || i !== x) {
        coords.push({ x: i, y });
      }
    }

    return coords;
  }

  public getCellSets(): Coordinate[][] {
    const sets: Coordinate[][] = [];
    for (let i = 0; i < 9; i++) {
      sets.push(this.adjacentCells(0, i, true));
    }

    return sets;
  }
}

export class VerticalCellAnalyser implements ICellAnalyser {

  public adjacentCells(x: number, y: number, includeOwn: boolean = false): Coordinate[] {
    const coords: Coordinate[] = [];
    for (let i = 0; i < 9; i++) {
      if (includeOwn || i !== y) {
        coords.push({ x, y: i });
      }
    }

    return coords;
  }

  public getCellSets(): Coordinate[][] {
    const sets: Coordinate[][] = [];
    for (let i = 0; i < 9; i++) {
      sets.push(this.adjacentCells(i, 0, true));
    }

    return sets;
  }
}

export class SquareCellAnalyser implements ICellAnalyser {

  public adjacentCells(x: number, y: number, includeOwn: boolean = false): Coordinate[] {
    const cells: Coordinate[] = [];
    const rangeX = this.getRange(x);
    const rangeY = this.getRange(y);
    for (let i = 0; i < rangeX.length; i++) {
      for (let j = 0; j < rangeY.length; j++) {
        if (includeOwn || rangeX[i] !== x || rangeY[j] !== y) {
          cells.push({ x: rangeX[i], y: rangeY[j] });
        }
      }
    }

    return cells;
  }

  private getRange(z: number): number[] {
    const range: number[] = [];
    for (let i = 0; i < 3; i++) {
      range.push(z - z % 3 + i);
    }

    return range;
  }

  public getCellSets(): Coordinate[][] {
    const sets: Coordinate[][] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        sets.push(this.adjacentCells(i * 3, j * 3, true));
        // sets.push(this.adjacentCells(i, j, true));
      }
    }

    return sets;
  }
}

export class UnionCellAnalyser implements ICellAnalyser {

  private sources: ICellAnalyser[];

  constructor(sources: ICellAnalyser[]) {
    this.sources = sources;
  }

  public adjacentCells(x: number, y: number): Coordinate[] {
    const coords: Set<string> = new Set();
    this.sources.forEach((s) =>
      s.adjacentCells(x, y)
        .forEach((c) => coords.add(JSON.stringify(c)))
    );
    const result: Coordinate[] = [];
    coords.forEach((c) => result.push(JSON.parse(c)));

    return result;
  }

  public getCellSets(): Coordinate[][] {
    const sets: Coordinate[][] = [];
    this.sources.forEach((s) =>
      s.getCellSets().forEach((cs) => sets.push(cs))
    );

    return sets;
  }
}
