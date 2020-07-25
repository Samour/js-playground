import { Dispatch } from 'redux';
import { PersistedBoard, PersistedBoardsStore } from 'futoshiki/model/Board';
import { Screen } from 'futoshiki/model/Controls';
import { BoardPersistenceMode } from 'futoshiki/model/State';
import { persistedBoardsLoadedEvent } from 'futoshiki/events/PersistedBoardsLoadedEvent';
import { changeBoardPersistenceModeEvent } from 'futoshiki/events/ChangeBoardPersistenceModeEvent';
import { changeScreenEvent } from 'futoshiki/events/ChangeScreenEvent';
import { loadBoardEvent } from 'futoshiki/events/LoadBoardEvent';
import { selectSavedBoardEvent } from 'futoshiki/events/SelectSavedBoardEvent';
import { changeBoardNameEvent } from 'futoshiki/events/ChangeBoardNameEvent';

const STORE_KEY = 'persistedBoards';

const loadStore = (): PersistedBoardsStore => {
    const serialisedStore: string | null = localStorage.getItem(STORE_KEY);
    if (serialisedStore) {
        return JSON.parse(serialisedStore);
    } else {
        return {
            boards: [],
        };
    }
};

export const showBoards = (dispatch: Dispatch) => (mode: BoardPersistenceMode) => {
    dispatch(persistedBoardsLoadedEvent(loadStore().boards));
    dispatch(changeBoardPersistenceModeEvent(mode));
    dispatch(changeScreenEvent(Screen.SAVED_BOARDS));
};

export const saveBoard = (dispatch: Dispatch) => (board: PersistedBoard): void => {
    const store: PersistedBoardsStore = loadStore();
    store.boards = store.boards.filter(({ id }) => id !== board.id);
    store.boards.push(board);

    localStorage.setItem(STORE_KEY, JSON.stringify(store));

    dispatch(persistedBoardsLoadedEvent([]));
    dispatch(changeScreenEvent(Screen.BOARD));
    dispatch(changeBoardNameEvent(''));
    dispatch(selectSavedBoardEvent(null));
};

export const loadBoard = (dispatch: Dispatch) => (id: string): void => {
    const store: PersistedBoardsStore = loadStore();
    const board: PersistedBoard | undefined = store.boards.find((board) => board.id === id);
    if (!board) {
        return;
    }

    dispatch(loadBoardEvent(board));
    dispatch(changeScreenEvent(Screen.BOARD));
    dispatch(selectSavedBoardEvent(null));
    dispatch(changeBoardNameEvent(''));
};

export const deleteBoard = (dispatch: Dispatch) => (id: string): void => {
    const store: PersistedBoardsStore = loadStore();
    store.boards = store.boards.filter((board) => board.id !== id);
    localStorage.setItem(STORE_KEY, JSON.stringify(store));

    dispatch(persistedBoardsLoadedEvent(store.boards));
};
