import { EventType } from 'futoshiki/events/EventType';

export interface IToggleNumericModeEvent {
    type: EventType.TOGGLE_NUMERIC_MODE;
}

export const toggleNumericModeEvent = (): IToggleNumericModeEvent => ({
    type: EventType.TOGGLE_NUMERIC_MODE,
});
