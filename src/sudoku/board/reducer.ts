import { IEvent, EventType } from 'sudoku/events';
import { SudokuState, SudokuCell } from './model';
import {
  FocusCellEvent,
  SetCellValueEvent,
  SetCellFixedEvent,
  SetNoteModeEvent,
  AddCellPossibleEvent,
  RemoveCellPossibleEvent,
  SetBoardStateEvent,
} from './events';

const initialState = (): SudokuState => {
  const board = [];
  for (let i = 0; i < 9; i++) {
    const col = [];
    for (let j = 0; j < 9; j++) {
      col.push(new SudokuCell());
    }
    board.push(col);
  }

  return {
    focusCell: null,
    board,
    noteMode: false,
  };
}

function resetGame(state: SudokuState): SudokuState {
  const board = state.board.map((col) => col.map((c) => c.fixed ? c : new SudokuCell()));

  return {
    ...state,
    board,
  };
}

function focusCell(state: SudokuState, event: FocusCellEvent): SudokuState {
  return {
    ...state,
    focusCell: {
      x: event.x,
      y: event.y,
    },
  };
}

function setCellValue(state: SudokuState, event: SetCellValueEvent): SudokuState {
  const board = state.board.map((c) => [...c]);
  board[event.x][event.y] = board[event.x][event.y].copy();
  board[event.x][event.y].value = event.value;

  return {
    ...state,
    board
  };
}

function setCellFixed(state: SudokuState, event: SetCellFixedEvent): SudokuState {
  const board = state.board.map((c) => [...c]);
  board[event.x][event.y] = board[event.x][event.y].copy();
  board[event.x][event.y].fixed = event.fixed;

  return {
    ...state,
    board,
  };
}

function lockAllValues(state: SudokuState): SudokuState {
  const board = state.board.map((col) => col.map((c) => c.copy()));
  board.forEach((col) => col.forEach((c) => {
    if (c.value) {
      c.fixed = true;
    }
  }));

  return {
    ...state,
    board,
  };
}

function setNoteMode(state: SudokuState, event: SetNoteModeEvent): SudokuState {
  return {
    ...state,
    noteMode: event.mode,
  };
}

function addCellPossible(state: SudokuState, event: AddCellPossibleEvent): SudokuState {
  const board = state.board.map((c) => [...c]);
  board[event.x][event.y] = board[event.x][event.y].copy();
  board[event.x][event.y].possible.add(event.value);

  return {
    ...state,
    board,
  };
}

function removeCellPossible(state: SudokuState, event: RemoveCellPossibleEvent): SudokuState {
  const board = state.board.map((c) => [...c]);
  board[event.x][event.y] = board[event.x][event.y].copy();
  board[event.x][event.y].possible.delete(event.value);

  return {
    ...state,
    board,
  };
}

function setBoardState(state: SudokuState, event: SetBoardStateEvent): SudokuState {
  return {
    ...state,
    board: event.board,
  };
}

export default function reducer(state: SudokuState | undefined, event: IEvent): SudokuState {
  if (!state) {
    state = initialState();
  }

  switch (event.type) {
    case EventType.CLEAR_BOARD:
      return initialState();
    case EventType.RESET_GAME:
      return resetGame(state);
    case EventType.FOCUS_CELL:
      return focusCell(state, event as FocusCellEvent);
    case EventType.SET_CELL_VALUE:
      return setCellValue(state, event as SetCellValueEvent);
    case EventType.SET_CELL_FIXED:
      return setCellFixed(state, event as SetCellFixedEvent);
    case EventType.LOCK_ALL_VALUES:
      return lockAllValues(state);
    case EventType.SET_NOTE_MODE:
      return setNoteMode(state, event as SetNoteModeEvent);
    case EventType.ADD_CELL_POSSIBLE:
      return addCellPossible(state, event as AddCellPossibleEvent);
    case EventType.REMOVE_CELL_POSSIBLE:
      return removeCellPossible(state, event as RemoveCellPossibleEvent);
    case EventType.SET_BOARD_STATE:
      return setBoardState(state, event as SetBoardStateEvent);
    default:
      return state;
  }
}
