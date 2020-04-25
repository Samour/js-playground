import { Store } from 'redux';
import { SudokuState, Coordinate, SudokuCell } from 'sudoku/board/model';
import {
  setCellHighlightEvent,
  algorithmStartEvent,
  algorithmEndEvent,
  algorithmCallbackEvent,
} from 'sudoku/board/events';
import SudokuService from 'sudoku/board/service';
import { ICellAnalyser } from './analyser';

interface CellMutation {
  x: number;
  y: number;
  value: number;
  priorSolvedCells: number;
  note: boolean;
}

class IllegalBoardStateException { }

export default class SolverService {

  private store: Store<SudokuState>;
  private boardService: SudokuService;
  private analyser: ICellAnalyser;
  private backTrackMutations: CellMutation[];
  private backTrackGuesses: CellMutation[];
  private stepTimeout: number = 100;
  private cellsSolved: number = 0;

  constructor(store: Store<SudokuState>, boardService: SudokuService, analyser: ICellAnalyser) {
    this.store = store;
    this.boardService = boardService;
    this.analyser = analyser;
    this.backTrackMutations = [];
    this.backTrackGuesses = [];

    this.store.subscribe(this.listener);
  }

  public stop() {
    this.store.dispatch(algorithmEndEvent());
  }

  public async solve(): Promise<void> {
    this.store.dispatch(algorithmStartEvent());
    this.backTrackMutations = [];
    this.backTrackGuesses = [];
    this.cellsSolved = 0;

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const cell = this.store.getState().board[x][y];
        if (cell.value) {
          this.cellsSolved++;
          continue;
        }

        const adjacentValues = this.analyser.adjacentCells(x, y)
          .map((c) => this.store.getState().board[c.x][c.y].value as number)
          .filter((v) => !!v);
        const possible = this.cellRemainingValues(new Set(adjacentValues));
        for (let i = 0; i < possible.length; i++) {
          await this.addCellPossible(x, y, possible[i]);
        }
        await this.setIfOnlyRemaining(x, y);
      }
    }

    await this.setDeterminable();

    let lastBadGuess: CellMutation | null = null;
    while (this.cellsSolved < 81) {
      try {
        if (!!lastBadGuess) {
          await this.removeCellPossible(lastBadGuess.x, lastBadGuess.y, lastBadGuess.value);
          this.cellsSolved = lastBadGuess.priorSolvedCells;
          this.store.dispatch(setCellHighlightEvent(lastBadGuess.x, lastBadGuess.y, false));
          lastBadGuess = null;
        } else {
          await this.makeGuess();
        }
        await this.setDeterminable();
      } catch (e) {
        if (e instanceof IllegalBoardStateException) {
          lastBadGuess = await this.rollbackGuess();
        }
      }
    }

    this.backTrackGuesses.forEach(({ x, y }) => this.store.dispatch(setCellHighlightEvent(x, y, false)));
    this.store.dispatch(algorithmEndEvent());
  }

  private async setDeterminable(): Promise<void> {
    let madeChange = true;
    while (madeChange) {
      madeChange = false;
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          const cell = this.store.getState().board[x][y];
          if (!!cell.value || cell.possible.size > 1) {
            continue;
          }
          await this.setCellValue(x, y, cell.possible.values().next().value, false);
          madeChange = true;
        }
      }

      if (madeChange) {
        continue;
      }

      const cellGroups = this.analyser.getCellSets();
      for (let i = 0; i < cellGroups.length; i++) {
        const count: Map<number, Coordinate[]> = new Map();
        this.cellRemainingValues(new Set()).forEach((i) => count.set(i, []));
        for (let j = 0; j < cellGroups[i].length; j++) {
          const { x, y } = cellGroups[i][j];
          const cell = this.store.getState().board[x][y];
          if (cell.value) {
            continue;
          }
          cell.possible.forEach((v) => count.get(v)?.push({ x, y }));
        }

        for (let value = 1; value <= 9; value++) {
          const coords = count.get(value);
          if (coords?.length !== 1) {
            continue;
          }
          await this.setCellValue(coords[0].x, coords[0].y, value, false);
          madeChange = true;
        }
      }
    }
  }

  private async makeGuess(): Promise<void> {
    let guessCell: { x: number, y: number, cell: SudokuCell } | null = null;
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const cell = this.store.getState().board[x][y];
        if (cell.value) {
          continue;
        }

        if (!guessCell || guessCell.cell.possible.size > cell.possible.size) {
          guessCell = { x, y, cell };
        }
      }
    }

    if (!guessCell) {
      throw new IllegalBoardStateException();
    }

    const { x, y, cell } = guessCell;
    this.store.dispatch(setCellHighlightEvent(x, y, true));
    await this.setCellValue(x, y, cell.possible.values().next().value, true);
  }

  private cellRemainingValues(exclude: Set<number>): number[] {
    const result: number[] = [];
    for (let i = 1; i <= 9; i++) {
      if (!exclude.has(i)) {
        result.push(i);
      }
    }

    return result;
  }

  private async addCellPossible(x: number, y: number, i: number): Promise<void> {
    this.boardService.addCellPossible(x, y, i);
    this.boardService.focusCell(x, y);
    await this.syncStore();
  }

  private async removeCellPossible(x: number, y: number, value: number): Promise<void> {
    this.pushMutation({ x, y, value, priorSolvedCells: this.cellsSolved, note: true }, false);
    this.boardService.removeCellPossible(x, y, value);
    this.boardService.focusCell(x, y);
    await this.syncStore();
    if (this.store.getState().board[x][y].possible.size === 0) {
      throw new IllegalBoardStateException();
    }
  }

  private async setIfOnlyRemaining(x: number, y: number): Promise<void> {
    const cell = this.store.getState().board[x][y];
    if (cell.possible.size === 1) {
      await this.setCellValue(x, y, cell.possible.values().next().value, false);
    }
  }

  private async setCellValue(x: number, y: number, value: number, guess: boolean) {
    this.pushMutation({ x, y, value, note: false, priorSolvedCells: this.cellsSolved }, guess);
    this.boardService.setCellVaue(x, y, value);
    this.cellsSolved++;
    this.boardService.focusCell(x, y);
    await this.syncStore();
    await this.clearAdjacentPossible(x, y, value);
  }

  private async clearAdjacentPossible(x: number, y: number, value: number): Promise<void> {
    const adjacentCells = this.analyser.adjacentCells(x, y);
    for (let i = 0; i < adjacentCells.length; i++) {
      const c = adjacentCells[i];
      const cell = this.store.getState().board[c.x][c.y];
      if (!!cell.value || !cell.possible.has(value)) {
        continue;
      }

      await this.removeCellPossible(c.x, c.y, value);
    }
  }

  private pushMutation(mutation: CellMutation, guess: boolean) {
    this.backTrackMutations.push(mutation);
    if (guess) {
      this.backTrackGuesses.push(mutation);
    }
  }

  private async rollbackGuess(): Promise<CellMutation> {
    const lastGuess = this.backTrackGuesses.pop();
    let lastMutation: CellMutation | null = null;
    while (lastMutation !== lastGuess) {
      lastMutation = this.backTrackMutations.pop() as CellMutation;
      if (lastMutation.note) {
        this.boardService.addCellPossible(lastMutation.x, lastMutation.y, lastMutation.value);
      } else {
        this.boardService.setCellVaue(lastMutation.x, lastMutation.y, null);
      }
      await this.syncStore(false);
    }

    return lastGuess;
  }

  private async syncStore(withSleep: boolean = true): Promise<void> {
    const dispatchPromise: Promise<void> = new Promise((res) => {
      this.store.dispatch(algorithmCallbackEvent(res));
    });

    if (!withSleep) {
      return dispatchPromise;
    }

    return dispatchPromise.then(() => new Promise((res) => {
      setTimeout(() => res(), this.stepTimeout);
    }))
  }

  private listener = () => {
    const cb = this.store.getState().algorithmCallback;
    if (!cb || !this.store.getState().algorithmRunning) {
      return;
    }

    setTimeout(() => cb(), 0);
  }
}
