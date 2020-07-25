import { EventType } from 'futoshiki/events/EventType';

export interface IResetBoardEvent {
    type: EventType.RESET_BOARD;
}

export const resetBoardEvent = (): IResetBoardEvent => ({
    type: EventType.RESET_BOARD,
});
