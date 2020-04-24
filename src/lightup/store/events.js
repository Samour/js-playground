export class EventType {
  static SET_GAME_MODE = 'SetGameMode';
  static RESET_BOARD = 'ResetBoard';
  static RESET_GAME = 'ResetGame';
  static SET_CELL_STATE = 'SetCellState';
  static SET_CELL_COUNT = 'SetCellCount';
  static FOCUS_CELL = 'FocusCell';
}

export const setGameModeEvent = (mode) => ({
  type: EventType.SET_GAME_MODE,
  mode,
});

export const resetBoardEvent = (x, y) => ({
  type: EventType.RESET_BOARD,
  x,
  y,
});

export const resetGameEvent = () => ({
  type: EventType.RESET_GAME,
});

export const setCellStateEvent = (x, y, state) => ({
  type: EventType.SET_CELL_STATE,
  x,
  y,
  state,
});

export const setCellCountEvent = (x, y, count) => ({
  type: EventType.SET_CELL_COUNT,
  x,
  y,
  count,
});

export const focusCellEvent = (x, y) => ({
  type: EventType.FOCUS_CELL,
  x,
  y,
});
