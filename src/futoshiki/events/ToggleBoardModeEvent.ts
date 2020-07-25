import { EventType } from 'futoshiki/events/EventType';

export interface IToggleBoardModeEvent {
    type: EventType.TOGGLE_BOARD_MODE;
}

export const toggleBoardModeEvent = (): IToggleBoardModeEvent => ({
    type: EventType.TOGGLE_BOARD_MODE,
});
