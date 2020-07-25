import { Coordinate } from 'futoshiki/model/Board';
import { EventType } from 'futoshiki/events/EventType';
import IEvent from 'futoshiki/events/IEvent';
import { IHighlightCellEvent } from 'futoshiki/events/HighlightCellEvent';

export default function reducer(state: Coordinate | null | undefined, event: IEvent): Coordinate | null {
    if (event.type === EventType.HIGHLIGHT_CELL) {
        return (event as IHighlightCellEvent).coordinate;
    } else {
        return state || null;
    }
}
