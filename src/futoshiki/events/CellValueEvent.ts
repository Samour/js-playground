import { EventType } from 'futoshiki/events/EventType';

export interface ICellValueEvent {
    type: EventType.CELL_VALUE;
    x: number;
    y: number;
    value: number | null;
}

export const cellValueEvent = (x: number, y: number, value: number | null): ICellValueEvent => ({
    type: EventType.CELL_VALUE,
    x,
    y,
    value,
});
