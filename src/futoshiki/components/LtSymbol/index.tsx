import React, { ReactNode } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    Coordinate,
    LTConstraint,
    coordinateEquals,
    constraintMatches,
} from 'futoshiki/model/Board';
import { State } from 'futoshiki/model/State';
import { toggleLTConstraintEvent } from 'futoshiki/events/ToggleLTConstraintEvent';

interface IState {
    ltConstraints: LTConstraint[];
}

const mapToProps = (state: State): IState => ({
    ltConstraints: state.board.ltConstraints,
});

interface IActions {
    toggleConstraint: (leftCell: Coordinate, rightCell: Coordinate) => void;
}

const mapToActions = (dispatch: Dispatch): IActions => ({
    toggleConstraint: (leftCell, rightCell) => dispatch(toggleLTConstraintEvent(leftCell, rightCell)),
});

interface IProps {
    className: string;
    cell1: Coordinate;
    cell2: Coordinate;
    lessThan: ReactNode;
    greaterThan: ReactNode;
}

function LtSymbol({
    className,
    cell1,
    cell2,
    lessThan,
    greaterThan,
    ltConstraints,
    toggleConstraint,
}: IProps & IState & IActions): JSX.Element {
    const handleClick = () => toggleConstraint(cell1, cell2);

    const matchingLT: LTConstraint | undefined = ltConstraints.find((c) =>
        constraintMatches(cell1, cell2, c)
    );
    const isLessThan: boolean = !!matchingLT && coordinateEquals(cell1, matchingLT.subject);
    const isGreaterThan: boolean = !!matchingLT && !isLessThan;

    const Symbol = (): JSX.Element => {
        if (isLessThan) {
            return <>{lessThan}</>;
        } else if (isGreaterThan) {
            return <>{greaterThan}</>;
        } else {
            return <></>;
        }
    };

    return (
        <div className={className} onClick={handleClick}>
            <Symbol />
        </div>
    );
}

export default connect(mapToProps, mapToActions)(LtSymbol);
