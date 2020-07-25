import { Board, Coordinate, PersistedBoardsStore } from 'futoshiki/model/Board';
import { NumericMode, Screen } from 'futoshiki/model/Controls';

export interface Controls {
    numericMode: NumericMode;
    gameSize: number;
}

export interface BoardHistory {
    historyStates: Board[];
    currentIndex: number;
}

export enum BoardPersistenceMode {
    SAVE = 'SAVE',
    LOAD = 'LOAD',
}

export interface PersistedBoardsState extends PersistedBoardsStore {
    mode: BoardPersistenceMode;
    name: string;
    selectedId: string | null;
}

export interface State {
    screen: Screen;
    board: Board;
    boardHistory: BoardHistory;
    highlight: Coordinate | null;
    controls: Controls;
    persistedBoards: PersistedBoardsState;
}
