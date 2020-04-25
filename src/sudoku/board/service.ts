import { Store } from 'redux';
import { SudokuState, SudokuCell } from './model';
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
  setBoardStateEvent,
 } from './events';

 const proto = require('sudoku/protoc/board_pb');

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

  public seralise(): Uint8Array {
    const board = this.store.getState().board;
    const boardPb = new proto.Board();
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
        const cell = new proto.Cell();
        cell.setValue(board[x][y].value);
        cell.setFixed(board[x][y].fixed);
        board[x][y].possible.forEach((i) => cell.addPossible(i));
        boardPb.addCell(cell);
      }
    }

    return boardPb.serializeBinary();
  }

  public deserialise(data: ArrayBuffer) {
    const boardPb = proto.Board.deserializeBinary(data);
    if (!boardPb.getCellList()?.length) {
      return;
    }
    
    const board: SudokuCell[][] = [];
    for (let x = 0; x < 9; x++) {
      const col: SudokuCell[] = [];
      board.push(col);
      for (let y = 0; y < 9; y++) {
        const cellPb = boardPb.getCellList()[x * 9 + y];
        const cell = new SudokuCell();
        cell.value = cellPb.getValue();
        cell.fixed = cellPb.getFixed();
        cell.possible = new Set(cellPb.getPossibleList());
        col.push(cell);
      }
    }

    this.store.dispatch(setBoardStateEvent(board));
  }
}
