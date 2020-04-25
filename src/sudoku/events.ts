export enum EventType {
  CLEAR_BOARD = 'ClearBoard',
  RESET_GAME = 'ResetGame',
  FOCUS_CELL = 'FocusCell',
  SET_CELL_VALUE = 'SetCellValue',
  SET_CELL_FIXED = 'SetCellFixed',
  LOCK_ALL_VALUES = 'LockAllValues',
  SET_NOTE_MODE = 'SetNodeMode',
  ADD_CELL_POSSIBLE = 'AddCellPossible',
  REMOVE_CELL_POSSIBLE = 'RemoveCellPossible',
}

export interface IEvent {
  type: EventType;
}
