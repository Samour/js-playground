export class GameMode {
  static CONSTRUCT = 'CONSTRUCT'
  static SOLVE = 'SOLVE';
}

export class CellState {

  static EMPTY = 'EMPTY';
  static WALL = 'WALL';
  static LIGHT = 'LIGHT';
  static CROSS = 'CROSS';

  constructor(state, lit, count) {
    this.state = state;
    this.lit = lit;
    this.count = count;
  }

  copy() {
    return new CellState(this.state, this.lit, this.count);
  }
}