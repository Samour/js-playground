import { Screen } from 'futoshiki/model/Controls';
import { EventType } from 'futoshiki/events/EventType';

export interface IChangeScreenEvent {
    type: EventType.CHANGE_SCREEN;
    screen: Screen;
}

export const changeScreenEvent = (screen: Screen): IChangeScreenEvent => ({
    type: EventType.CHANGE_SCREEN,
    screen,
});
