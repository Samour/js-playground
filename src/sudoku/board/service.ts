import { Store } from 'redux';
import { SudokuState } from './model';
import { 
  clearBoardEvent,
  resetGameEvent,
  focusCellEvent,
  setCellValueEvent,
  setCellFixedEvent,
  lockAllValuesEvent,
  setNoteModeEvent,
  addCellPossibleEvent,
  removeCellPossibleEvent,
 } from './events';

export default class BoardService {

  private store: Store<SudokuState>;

  constructor(store: Store<SudokuState>) {
    this.store = store;
  }

  public clearBoard() {
    this.store.dispatch(clearBoardEvent());
  }

  public resetGame() {
    this.store.dispatch(resetGameEvent());
  }

  public focusCell(x: number, y: number) {
    this.store.dispatch(focusCellEvent(x, y));
  }

  public setCellVaue(x: number, y: number, value: number | null) {
    this.store.dispatch(setCellValueEvent(x, y, value));
  }

  public setCellFixed(x: number, y: number, fixed: boolean) {
    this.store.dispatch(setCellFixedEvent(x, y, fixed));
  }

  public lockAllValues() {
    this.store.dispatch(lockAllValuesEvent());
  }

  public setNoteMode(mode: boolean) {
    this.store.dispatch(setNoteModeEvent(mode));
  }

  public addCellPossible(x: number, y: number, value: number) {
    this.store.dispatch(addCellPossibleEvent(x, y, value));
  }

  public removeCellPossible(x: number, y: number, value: number) {
    this.store.dispatch(removeCellPossibleEvent(x, y, value));
  }
}
