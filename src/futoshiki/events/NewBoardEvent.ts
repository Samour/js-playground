import { EventType } from 'futoshiki/events/EventType';

export interface INewBoardEvent {
    type: EventType.NEW_BOARD;
    size: number;
}

export const newBoardEvent = (size: number): INewBoardEvent => ({
    type: EventType.NEW_BOARD,
    size,
});
