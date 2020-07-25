import { EventType } from 'futoshiki/events/EventType';

export interface IChangeBoardNameEvent {
    type: EventType.CHANGE_BOARD_NAME;
    name: string;
}

export const changeBoardNameEvent = (name: string): IChangeBoardNameEvent => ({
    type: EventType.CHANGE_BOARD_NAME,
    name,
});
