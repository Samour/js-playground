import { NumericMode } from 'futoshiki/model/Controls';
import { Controls } from 'futoshiki/model/State';
import IEvent from 'futoshiki/events/IEvent';
import { EventType } from 'futoshiki/events/EventType';
import { IChangeGameSizeEvent } from 'futoshiki/events/ChangeGameSizeEvent';

const defaultState: Controls = {
    numericMode: NumericMode.VALUE,
    gameSize: 5,
}

export default function reducer(state: Controls | undefined, event: IEvent): Controls {
    state = state || defaultState;
    if (event.type === EventType.TOGGLE_NUMERIC_MODE) {
        return {
            ...state,
            numericMode: state.numericMode === NumericMode.VALUE ? NumericMode.NOTE : NumericMode.VALUE,
        };
    } else if (event.type === EventType.CHANGE_GAME_SIZE) {
        const { gameSize } = event as IChangeGameSizeEvent;
        return {
            ...state,
            gameSize,
        };
    } else {
        return state;
    }
}
