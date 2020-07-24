import React from 'react';
import { connect } from 'react-redux';
import { State } from 'futoshiki/model/State';
import ColumnLtSymbol from './ColumnLtSymbol';

interface IState {
    range: number;
}

const mapToProps = (state: State): IState => ({
    range: state.board.cells.length,
});

interface IProps {
    yAbove: number;
}

function LtRow({ yAbove, range }: IProps & IState): JSX.Element {
    const elements = [];
    for (let x = 0; x < range; x++) {
        elements.push(<ColumnLtSymbol key={x} cellAbove={{ x, y: yAbove }} />);
    }

    return (
        <div className="row">
            {elements}
        </div>
    );
}

export default connect(mapToProps)(LtRow);
