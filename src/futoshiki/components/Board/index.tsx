import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    Board as BoardModel,
    Coordinate,
} from 'futoshiki/model/Board';
import { NumericMode, BoardMode } from 'futoshiki/model/Controls';
import { State } from 'futoshiki/model/State';
import { cellValueEvent } from 'futoshiki/events/CellValueEvent';
import { toggleCellNoteEvent } from 'futoshiki/events/ToggleCellNoteEvent';
import { clearCellNotesEvent } from 'futoshiki/events/ClearCellNotesEvent';
import { toggleNumericModeEvent } from 'futoshiki/events/ToggleNumericModeEvent';
import Row from './Row';
import LtRow from './LtRow';

const KEY_BACKSPACE = 'Backspace';
const KEY_SPACE = ' ';

interface IProps {
    board: BoardModel;
    highlight: Coordinate | null;
    numericMode: NumericMode;
    boardMode: BoardMode;
}

const mapToProps = (state: State): IProps => ({
    board: state.board,
    highlight: state.highlight,
    numericMode: state.controls.numericMode,
    boardMode: state.controls.boardMode,
});

interface IActions {
    setCellValue: (x: number, y: number, value: number | null, provided: boolean) => void;
    toggleCellNote: (x: number, y: number, value: number) => void;
    clearCellNotes: (x: number, y: number) => void;
    toggleNumericMode: () => void;
}

const mapToActions = (dispatch: Dispatch): IActions => ({
    setCellValue: (x, y, value, provided) => dispatch(cellValueEvent(x, y, value, provided)),
    toggleCellNote: (x, y, value) => dispatch(toggleCellNoteEvent({ x, y }, value)),
    clearCellNotes: (x, y) => dispatch(clearCellNotesEvent(x, y)),
    toggleNumericMode: () => dispatch(toggleNumericModeEvent()),
});

function BoardComponent({
    board,
    highlight,
    numericMode,
    boardMode,
    setCellValue,
    toggleCellNote,
    clearCellNotes,
    toggleNumericMode,
}: IProps & IActions): JSX.Element {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!highlight) {
            return;
        }

        if (e.key === KEY_BACKSPACE) {
            if (numericMode === NumericMode.VALUE) {
                setCellValue(highlight.x, highlight.y, null, boardMode === BoardMode.COMPOSE);
            } else {
                clearCellNotes(highlight.x, highlight.y);
            }
            return;
        } else if (e.key === KEY_SPACE) {
            toggleNumericMode();
            return;
        }

        const value = Number.parseInt(e.key);
        if (!value || value < 1 || value > board.cells.length) {
            return;
        }

        if (numericMode === NumericMode.VALUE) {
            setCellValue(highlight.x, highlight.y, value, boardMode === BoardMode.COMPOSE);
        } else {
            toggleCellNote(highlight.x, highlight.y, value);
        }
    };

    const rows = [];
    for (let y = 0; y < board.cells[0].length; y++) {
        if (y > 0) {
            rows.push(<LtRow key={2 * y} yAbove={y - 1} />);
        }
        rows.push(
            <Row key={y * 2 + 1} y={y} cells={board.cells.map((r) => r[y])} />
        );
    }

    const className: string[] = ['board'];
    if (numericMode === NumericMode.NOTE) {
        className.push('note');
    }

    return (
        <div className={className.join(' ')} onKeyDown={handleKeyDown} tabIndex={-1}>
            {rows}
        </div>
    );
}

export default connect(mapToProps, mapToActions)(BoardComponent);
