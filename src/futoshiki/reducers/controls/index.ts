import { NumericMode, BoardMode } from 'futoshiki/model/Controls';
import { Controls } from 'futoshiki/model/State';
import IEvent from 'futoshiki/events/IEvent';
import { EventType } from 'futoshiki/events/EventType';
import { IChangeGameSizeEvent } from 'futoshiki/events/ChangeGameSizeEvent';
import { ISolutionStatusEvent } from 'futoshiki/events/SolutionStatusEvent';

const CLEAR_RESULT_EVENTS: EventType[] = [
    EventType.NEW_BOARD,
    EventType.CELL_VALUE,
    EventType.TOGGLE_CELL_NOTE,
    EventType.CLEAR_CELL_NOTES,
    EventType.RESET_BOARD,
    EventType.TOGGLE_LT_CONSTRAINT,
    EventType.RESTORE_STATE,
    EventType.LOAD_BOARD,
];

const defaultState: Controls = {
    numericMode: NumericMode.VALUE,
    gameSize: 5,
    boardMode: BoardMode.PLAY,
    resultStatus: null,
};

export default function reducer(state: Controls | undefined, event: IEvent): Controls {
    state = state || defaultState;
    if (event.type === EventType.TOGGLE_NUMERIC_MODE) {
        return {
            ...state,
            numericMode: state.numericMode === NumericMode.VALUE ? NumericMode.NOTE : NumericMode.VALUE,
        };
    } else if (event.type === EventType.TOGGLE_BOARD_MODE) {
        return {
            ...state,
            boardMode: state.boardMode === BoardMode.COMPOSE ? BoardMode.PLAY : BoardMode.COMPOSE,
        };
    } else if (event.type === EventType.CHANGE_GAME_SIZE) {
        const { gameSize } = event as IChangeGameSizeEvent;
        return {
            ...state,
            gameSize,
        };
    } else if (event.type === EventType.SOLUTION_STATUS) {
        const { resultStatus } = event as ISolutionStatusEvent;
        return {
            ...state,
            resultStatus,
        };
    } else if (CLEAR_RESULT_EVENTS.includes(event.type)) {
        return {
            ...state,
            resultStatus: null,
        };
    } else {
        return state;
    }
}
