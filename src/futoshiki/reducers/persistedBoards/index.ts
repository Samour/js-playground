import { PersistedBoard } from 'futoshiki/model/Board';
import { PersistedBoardsState, BoardPersistenceMode } from 'futoshiki/model/State';
import IEvent from 'futoshiki/events/IEvent';
import { EventType } from 'futoshiki/events/EventType';
import { IChangeBoardPersistenceModeEvent } from 'futoshiki/events/ChangeBoardPersistenceModeEvent';
import { IPersistedBoardsLoadedEvent } from 'futoshiki/events/PersistedBoardsLoadedEvent';
import { IChangeBoardNameEvent } from 'futoshiki/events/ChangeBoardNameEvent';
import { ISelectSavedBoardEvent } from 'futoshiki/events/SelectSavedBoardEvent';

const initialState: PersistedBoardsState = {
    boards: [],
    mode: BoardPersistenceMode.SAVE,
    name: '',
    selectedId: null,
};

export default function reducer(state: PersistedBoardsState | undefined, event: IEvent): PersistedBoardsState {
    state = state || initialState;
    if (event.type === EventType.CHANGE_BOARD_PERSISTENCE_MODE) {
        const { mode } = event as IChangeBoardPersistenceModeEvent;
        return {
            ...state,
            mode,
        };
    } else if (event.type === EventType.PERSISTED_BOARDS_LOADED) {
        const { boards } = event as IPersistedBoardsLoadedEvent;
        return {
            ...state,
            boards
        };
    } else if (event.type === EventType.CHANGE_BOARD_NAME) {
        const { name } = event as IChangeBoardNameEvent;
        return {
            ...state,
            name,
        };
    } else if (event.type === EventType.SELECT_SAVED_BOARD) {
        const { id } = event as ISelectSavedBoardEvent;
        const selectedBoard: PersistedBoard | undefined = state.boards.find((b) => b.id === id);
        if (!!id && !selectedBoard) {
            return state;
        }
        return {
            ...state,
            name: selectedBoard?.name || state.name,
            selectedId: id,
        };
    } else {
        return state;
    }
}
