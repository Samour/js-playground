import { NumericMode } from 'futoshiki/model/Controls';
import { Controls } from 'futoshiki/model/State';
import IEvent from 'futoshiki/events/IEvent';
import { EventType } from 'futoshiki/events/EventType';

const defaultState: Controls = {
    numericMode: NumericMode.VALUE,
}

export default function reducer(state: Controls | undefined, event: IEvent): Controls {
    state = state || defaultState;
    if (event.type === EventType.TOGGLE_NUMERIC_MODE) {
        return {
            ...state,
            numericMode: state.numericMode === NumericMode.VALUE ? NumericMode.NOTE : NumericMode.VALUE,
        };
    } else {
        return state;
    }
}
