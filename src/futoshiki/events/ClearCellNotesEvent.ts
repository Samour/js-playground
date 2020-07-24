import { EventType } from 'futoshiki/events/EventType';

export interface IClearCellNotesEvent {
    type: EventType.CLEAR_CELL_NOTES;
    x: number;
    y: number;
}

export const clearCellNotesEvent = (x: number, y: number): IClearCellNotesEvent => ({
    type: EventType.CLEAR_CELL_NOTES,
    x,
    y,
});
