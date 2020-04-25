import { EventType, IEvent } from 'sudoku/events';
import { SudokuCell } from './model';

export interface ClearBoardEvent extends IEvent {
  type: typeof EventType.CLEAR_BOARD;
}

export interface ResetGameEvent extends IEvent {
  type: typeof EventType.RESET_GAME;
}

export interface FocusCellEvent extends IEvent {
  type: typeof EventType.FOCUS_CELL;
  x: number;
  y: number;
}

export interface SetCellValueEvent extends IEvent {
  type: typeof EventType.SET_CELL_VALUE;
  x: number;
  y: number;
  value: number | null;
}

export interface SetCellFixedEvent extends IEvent {
  type: typeof EventType.SET_CELL_FIXED;
  x: number;
  y: number;
  fixed: boolean;
}

export interface LockAllValuesEvent extends IEvent {
  type: typeof EventType.LOCK_ALL_VALUES;
}

export interface SetNoteModeEvent extends IEvent {
  type: typeof EventType.SET_NOTE_MODE;
  mode: boolean;
}

export interface AddCellPossibleEvent extends IEvent {
  type: typeof EventType.ADD_CELL_POSSIBLE;
  x: number;
  y: number;
  value: number;
}

export interface RemoveCellPossibleEvent extends IEvent {
  type: typeof EventType.REMOVE_CELL_POSSIBLE;
  x: number;
  y: number;
  value: number;
}

export interface SetBoardStateEvent extends IEvent {
  type: typeof EventType.SET_BOARD_STATE;
  board: SudokuCell[][];
}

export const clearBoardEvent = (): ClearBoardEvent => ({
  type: EventType.CLEAR_BOARD,
});

export const resetGameEvent = (): ResetGameEvent => ({
  type: EventType.RESET_GAME,
});

export const focusCellEvent = (x: number, y: number): FocusCellEvent => ({
  type: EventType.FOCUS_CELL,
  x,
  y,
});

export const setCellValueEvent = (x: number, y: number, value: number | null): SetCellValueEvent => ({
  type: EventType.SET_CELL_VALUE,
  x,
  y,
  value
});

export const setCellFixedEvent = (x: number, y: number, fixed: boolean): SetCellFixedEvent => ({
  type: EventType.SET_CELL_FIXED,
  x,
  y,
  fixed,
});

export const lockAllValuesEvent = (): LockAllValuesEvent => ({
  type: EventType.LOCK_ALL_VALUES,
});

export const setNoteModeEvent = (mode: boolean): SetNoteModeEvent => ({
  type: EventType.SET_NOTE_MODE,
  mode,
});

export const addCellPossibleEvent = (x: number, y: number, value: number): AddCellPossibleEvent => ({
  type: EventType.ADD_CELL_POSSIBLE,
  x,
  y,
  value,
});

export const removeCellPossibleEvent = (x: number, y: number, value: number): RemoveCellPossibleEvent => ({
  type: EventType.REMOVE_CELL_POSSIBLE,
  x,
  y,
  value,
});

export const setBoardStateEvent = (board: SudokuCell[][]): SetBoardStateEvent => ({
  type: EventType.SET_BOARD_STATE,
  board,
});
