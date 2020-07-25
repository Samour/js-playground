import { Screen } from 'futoshiki/model/Controls';
import IEvent from 'futoshiki/events/IEvent';
import { EventType } from 'futoshiki/events/EventType';
import { IChangeScreenEvent } from 'futoshiki/events/ChangeScreenEvent';

export default function (state: Screen | undefined, event: IEvent): Screen {
    if (event.type === EventType.CHANGE_SCREEN) {
        return (event as IChangeScreenEvent).screen;
    } else {
        return state || Screen.BOARD;
    }
}
