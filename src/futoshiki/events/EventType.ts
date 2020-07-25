export enum EventType {
    CHANGE_SCREEN = 'CHANGE_SCREEN',
    NEW_BOARD = 'NEW_BOARD',
    HIGHLIGHT_CELL = 'HIGHLIGHT_CELL',
    CELL_VALUE = 'CELL_VALUE',
    TOGGLE_CELL_NOTE = 'TOGGLE_CELL_NOTE',
    CLEAR_CELL_NOTES = 'CLEAR_CELL_NOTES',
    TOGGLE_LT_CONSTRAINT = 'TOGGLE_LT_CONSTRAINT',
    TOGGLE_NUMERIC_MODE = 'TOGGLE_NUMERIC_MODE',
    CHANGE_GAME_SIZE = 'CHANGE_GAME_SIZE',
    RESTORE_STATE = 'RESTORE_STATE',
    CHANGE_BOARD_PERSISTENCE_MODE = 'CHANGE_BOARD_PERSISTENCE_MODE',
    PERSISTED_BOARDS_LOADED = 'PERSISTED_BOARDS_LOADED',
    LOAD_BOARD = 'LOAD_BOARD',
    CHANGE_BOARD_NAME = 'CHANGE_BOARD_NAME',
    SELECT_SAVED_BOARD = 'SELECT_SAVED_BOARD',
}
