import { PersistedBoard } from 'futoshiki/model/Board';
import { EventType } from 'futoshiki/events/EventType';

export interface ILoadBoardEvent {
    type: EventType.LOAD_BOARD;
    board: PersistedBoard;
}

export const loadBoardEvent = (board: PersistedBoard): ILoadBoardEvent => ({
    type: EventType.LOAD_BOARD,
    board,
});
