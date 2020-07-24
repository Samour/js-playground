import { Coordinate } from 'futoshiki/model/Board';
import { EventType } from 'futoshiki/events/EventType';

export interface IToggleLTConstraintEvent {
    type: EventType.TOGGLE_LT_CONSTRAINT;
    cell1: Coordinate;
    cell2: Coordinate;
}

export const toggleLTConstraintEvent = (cell1: Coordinate, cell2: Coordinate): IToggleLTConstraintEvent => ({
    type: EventType.TOGGLE_LT_CONSTRAINT,
    cell1,
    cell2,
});
