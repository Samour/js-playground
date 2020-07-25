import { EventType } from 'futoshiki/events/EventType';

export interface ISelectSavedBoardEvent {
    type: EventType.SELECT_SAVED_BOARD;
    id: string | null;
}

export const selectSavedBoardEvent = (id: string | null): ISelectSavedBoardEvent => ({
    type: EventType.SELECT_SAVED_BOARD,
    id,
});
