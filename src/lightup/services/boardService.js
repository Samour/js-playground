import { GameMode, CellState } from 'lightup/store/model';
import {
  setGameModeEvent,
  resetBoardEvent,
  resetGameEvent,
  setCellStateEvent,
  setCellCountEvent,
  focusCellEvent,
} from 'lightup/store/events';

function nextStateConstruct(state) {
  if (state === CellState.WALL) {
    return CellState.EMPTY;
  } else {
    return CellState.WALL;
  }
}

function nextStateSolve(state) {
  switch (state) {
    case CellState.EMPTY:
      return CellState.LIGHT;
    case CellState.LIGHT:
      return CellState.CROSS;
    case CellState.CROSS:
      return CellState.EMPTY;
    default:
      return null;
  }
}

export default class BoardService {
  constructor(store) {
    this._store = store;
  }

  setGameMode(mode) {
    this._store.dispatch(setGameModeEvent(mode));
  }

  resetBoard(x, y) {
    this._store.dispatch(resetBoardEvent(x, y));
  }

  resetGame() {
    this._store.dispatch(resetGameEvent());
  }

  handleCellClick(x, y) {
    const currentState = this._store.getState().board[x][y].state;
    const nextState = this._nextState(currentState);

    this._store.dispatch(focusCellEvent(x, y));
    if (nextState) {
      this._store.dispatch(setCellStateEvent(x, y, nextState));
    }
  }

  _nextState(state) {
    if (this._store.getState().gameMode === GameMode.CONSTRUCT) {
      return nextStateConstruct(state);
    } else {
      return nextStateSolve(state);
    }
  }

  handleKeyPress(key) {
    if (!this._store.getState().focusCell) {
      return;
    }
    const [x, y] = this._store.getState().focusCell;
    const cell = this._store.getState().board[x][y];
    if (cell.state !== CellState.WALL) {
      return;
    }

    this._store.dispatch(setCellCountEvent(
      x,
      y,
      this._getValue(key),
    ));
  }

  _getValue(key) {
    const value = Number.parseInt(key);
    if (!Number.isNaN(value) && value >= 0 && value <= 4) {
      return value;
    } else {
      return null;
    }
  }
}
