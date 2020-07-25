import { BoardHistory } from 'futoshiki/model/State';
import { Board } from 'futoshiki/model/Board';
import { EventType } from 'futoshiki/events/EventType';
import IEvent from 'futoshiki/events/IEvent';
import { IRestoreStateEvent } from 'futoshiki/events/RestoreStateEvent';

const MAX_HISTORY = 255;

const SNAPSHOT_EVENTS: EventType[] = [
    EventType.NEW_BOARD,
    EventType.CELL_VALUE,
    EventType.TOGGLE_CELL_NOTE,
    EventType.CLEAR_CELL_NOTES,
    EventType.TOGGLE_LT_CONSTRAINT,
    EventType.LOAD_BOARD,
];

export default (board: Board) => (state: BoardHistory | undefined, event: IEvent): BoardHistory => {
    state = state || {
        historyStates: [],
        currentIndex: 0,
    };
    if (SNAPSHOT_EVENTS.includes(event.type)) {
        const historyStates = state.historyStates.slice(
            Math.max(0, state.historyStates.length + 1 - MAX_HISTORY),
            state.currentIndex,
        );
        historyStates.push(board);
        return {
            historyStates,
            currentIndex: historyStates.length,
        };
    } else if (event.type === EventType.RESTORE_STATE) {
        const historyStates = state.historyStates.slice();
        if (state.currentIndex === historyStates.length && board !== historyStates[historyStates.length - 1]) {
            historyStates.push(board);
        }

        const { boardState } = event as IRestoreStateEvent;
        return {
            ...state,
            historyStates,
            currentIndex: state.historyStates.indexOf(boardState),
        };
    } else {
        return state;
    }
}
