import { Board } from 'futoshiki/model/Board';
import createBoard from 'futoshiki/services/BoardFactory';
import { EventType } from 'futoshiki/events/EventType';
import IEvent from 'futoshiki/events/IEvent';
import { ICellValueEvent } from 'futoshiki/events/CellValueEvent';
import { IToggleCellNoteEvent } from 'futoshiki/events/ToggleCellNoteEvent';
import { IClearCellNotesEvent } from 'futoshiki/events/ClearCellNotesEvent';
import { IToggleLTConstraintEvent } from 'futoshiki/events/ToggleLTConstraintEvent';
import toggleCellNote from './toggleCellNote';
import toggleLTConstraint from './toggleLTConstraint';

const INITIAL_BOARD_SIZE = 5;

export default function reducer(state: Board | undefined, event: IEvent): Board {
    state = state || createBoard(INITIAL_BOARD_SIZE);
    if (event.type === EventType.CELL_VALUE) {
        const { x, y, value } = event as ICellValueEvent;
        return {
            ...state,
            cells: state.cells.map((r, i) => i === x ?
                r.map((c, j) => j === y ? {
                    ...c,
                    value,
                } : c)
                : r,
            ),
        };
    } else if (event.type === EventType.CLEAR_CELL_NOTES) {
        const { x, y } = event as IClearCellNotesEvent;
        return {
            ...state,
            cells: state.cells.map((r, i) => i === x ?
                r.map((c, j) => j === y ? {
                    ...c,
                    possible: [],
                } : c)
                : r,
            ),
        };
    } else if (event.type === EventType.TOGGLE_CELL_NOTE) {
        return toggleCellNote(state, event as IToggleCellNoteEvent);
    } else if (event.type === EventType.TOGGLE_LT_CONSTRAINT) {
        return toggleLTConstraint(state, event as IToggleLTConstraintEvent);
    } else {
        return state;
    }
}
