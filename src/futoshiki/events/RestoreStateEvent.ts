import { Board } from 'futoshiki/model/Board';
import { EventType } from 'futoshiki/events/EventType';

export interface IRestoreStateEvent {
    type: EventType.RESTORE_STATE;
    boardState: Board;
}

export const restoreStateEvent = (boardState: Board): IRestoreStateEvent => ({
    type: EventType.RESTORE_STATE,
    boardState,
});
