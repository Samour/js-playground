import {
    Board,
    LTConstraint,
    coordinateEquals,
    constraintMatches,
} from 'futoshiki/model/Board';
import { IToggleLTConstraintEvent } from 'futoshiki/events/ToggleLTConstraintEvent';

export default function reducer(state: Board, event: IToggleLTConstraintEvent): Board {
    const matchingLTConstraint = state.ltConstraints.find((c) => constraintMatches(event.cell1, event.cell2, c));

    const nextConstraint: LTConstraint | null = (() => {
        if (!matchingLTConstraint) {
            return {
                subject: event.cell1,
                relates: event.cell2,
            };
        } else if (coordinateEquals(event.cell1, matchingLTConstraint.subject)) {
            return {
                subject: event.cell2,
                relates: event.cell1,
            };
        } else {
            return null;
        }
    })();

    const ltConstraints = state.ltConstraints.filter((c) => c !== matchingLTConstraint);
    if (nextConstraint) {
        ltConstraints.push(nextConstraint);
    }

    return {
        ...state,
        ltConstraints,
    };
}
