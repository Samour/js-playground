import { Coordinate } from 'futoshiki/model/Board';
import { EventType } from 'futoshiki/events/EventType';

export interface IHighlightCellEvent {
    type: EventType.HIGHLIGHT_CELL;
    coordinate: Coordinate;
}

export const highlightCellEvent = (coordinate: Coordinate): IHighlightCellEvent => ({
    type: EventType.HIGHLIGHT_CELL,
    coordinate,
});
