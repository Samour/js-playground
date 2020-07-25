import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Delete } from '@material-ui/icons';
import { PersistedBoard } from 'futoshiki/model/Board';
import { State } from 'futoshiki/model/State';
import { selectSavedBoardEvent } from 'futoshiki/events/SelectSavedBoardEvent';
import { deleteBoard } from 'futoshiki/services/BoardPersistence';

interface IProps {
    board: PersistedBoard;
}

interface IState {
    selectedId: string | null;
}

const mapToProps = (state: State): IState => ({
    selectedId: state.persistedBoards.selectedId,
});

interface IActions {
    selectBoard: (id: string) => void;
    removeBoard: (id: string) => void;
}

const mapToActions = (dispatch: Dispatch): IActions => ({
    selectBoard: (id) => dispatch(selectSavedBoardEvent(id)),
    removeBoard: deleteBoard(dispatch),
});

function Item({ board, selectedId, selectBoard, removeBoard }: IProps & IState & IActions): JSX.Element {
    const [isMousedown, setMouseDown] = useState(false);

    const className: string[] = ['saved-board'];
    if (isMousedown) {
        className.push('focus');
    }
    if (selectedId === board.id) {
        className.push('selected');
    }

    return (
        <div className={className.join(' ')}
            onMouseDown={() => setMouseDown(true)}
            onMouseUp={() => setMouseDown(false)}
            onClick={() => selectBoard(board.id)}>
            {board.name}
            <Delete className="delete-icon" onClick={() => removeBoard(board.id)} />
        </div>
    );
}

export default connect(mapToProps, mapToActions)(Item);
