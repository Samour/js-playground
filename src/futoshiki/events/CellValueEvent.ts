import { EventType } from 'futoshiki/events/EventType';

export interface ICellValueEvent {
    type: EventType.CELL_VALUE;
    x: number;
    y: number;
    value: number | null;
    provided: boolean;
    guess: boolean;
}

export const cellValueEvent = (
    x: number,
    y: number,
    value: number | null,
    {
        provided = false,
        guess = false,
    }: {
        provided?: boolean;
        guess?: boolean;
    } = {},
): ICellValueEvent => ({
    type: EventType.CELL_VALUE,
    x,
    y,
    value,
    provided,
    guess,
});
