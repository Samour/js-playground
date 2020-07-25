import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    Cell as CellModel,
    Coordinate,
} from 'futoshiki/model/Board';
import { State } from 'futoshiki/model/State';
import { highlightCellEvent } from 'futoshiki/events/HighlightCellEvent';

interface IState {
    highlight: Coordinate | null;
}

const mapToProps = (state: State): IState => ({
    highlight: state.highlight,
});

interface IActions {
    highlightCell: (x: number, y: number) => void;
}

const mapToActions = (dispatch: Dispatch): IActions => ({
    highlightCell: (x, y) => dispatch(highlightCellEvent({ x, y })),
});

interface IProps {
    cell: CellModel;
    x: number;
    y: number;
}

function Cell({ cell, x, y, highlight, highlightCell }: IProps & IState & IActions): JSX.Element {
    const CellContent = (): JSX.Element => {
        if (cell.value) {
            return <>{cell.value}</>;
        } else {
            return <>{cell.possible.map((v, i) => <div key={i} className="possible">{v}</div>)}</>;
        }
    }

    const className: string[] = ['cell'];
    if (cell.value) {
        className.push('hasValue');
        if (cell.provided) {
            className.push('provided');
        }
    }
    if (x === highlight?.x && y === highlight?.y) {
        className.push('highlight');
    }

    return (
        <div className={className.join(' ')} onClick={() => highlightCell(x, y)}>
            <CellContent />
        </div>
    );
}

export default connect(mapToProps, mapToActions)(Cell);
