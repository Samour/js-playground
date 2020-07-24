import { Coordinate } from 'futoshiki/model/Board';
import { EventType } from 'futoshiki/events/EventType';

export interface IToggleCellNoteEvent {
    type: EventType.TOGGLE_CELL_NOTE;
    cell: Coordinate;
    value: number;
}

export const toggleCellNoteEvent = (cell: Coordinate, value: number): IToggleCellNoteEvent => ({
    type: EventType.TOGGLE_CELL_NOTE,
    cell,
    value,
});
