export interface Coordinate {
  x: number;
  y: number;
}

export class SudokuCell {

  public value: number | null;
  public fixed: boolean;
  // public highlight: CellHighlight | null;
  public possible: Set<number>;

  constructor() {
    this.value = null;
    this.fixed = false;
    // this.highlight = null;
    this.possible = new Set();
  }

  copy(): SudokuCell {
    const cell = new SudokuCell();
    cell.value = this.value;
    cell.fixed = this.fixed;
    cell.possible = new Set(this.possible);

    return cell;
  }
}

export interface SudokuState {
  focusCell: Coordinate | null;
  board: SudokuCell[][];
  noteMode: boolean;
}
