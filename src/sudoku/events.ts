export enum EventType {
  CLEAR_BOARD = 'ClearBoard',
  RESET_GAME = 'ResetGame',
  FOCUS_CELL = 'FocusCell',
  SET_CELL_VALUE = 'SetCellValue',
  SET_CELL_FIXED = 'SetCellFixed',
  LOCK_ALL_VALUES = 'LockAllValues',
  SET_CELL_HIGHLIGHT = 'SetCellHighlight',
  SET_NOTE_MODE = 'SetNodeMode',
  ADD_CELL_POSSIBLE = 'AddCellPossible',
  REMOVE_CELL_POSSIBLE = 'RemoveCellPossible',
  SET_BOARD_STATE = 'SetBoardState',
  ALGORITHM_START = 'AlgorithmStart',
  ALGORITHM_END = 'AlgorithmEnd',
  ALGORITHM_CALLBACK = 'AlgorithmCallback',
}

export interface IEvent {
  type: EventType;
}
