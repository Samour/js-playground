import React from 'react';
import { v4 as uuid } from 'uuid';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Board, PersistedBoard } from 'futoshiki/model/Board';
import { Screen } from 'futoshiki/model/Controls';
import { BoardPersistenceMode, State } from 'futoshiki/model/State';
import { persistedBoardsLoadedEvent } from 'futoshiki/events/PersistedBoardsLoadedEvent';
import { changeScreenEvent } from 'futoshiki/events/ChangeScreenEvent';
import { selectSavedBoardEvent } from 'futoshiki/events/SelectSavedBoardEvent';
import { changeBoardNameEvent } from 'futoshiki/events/ChangeBoardNameEvent';
import { saveBoard, loadBoard } from 'futoshiki/services/BoardPersistence';

interface IProps {
    board: Board;
    mode: BoardPersistenceMode;
    name: string;
    selectedId: string | null;
}

const mapStateToProps = (state: State): IProps => ({
    board: state.board,
    mode: state.persistedBoards.mode,
    name: state.persistedBoards.name,
    selectedId: state.persistedBoards.selectedId,
});

interface IActions {
    goBack: () => void;
    commitBoard: (board: PersistedBoard) => void;
    openBoard: (id: string) => void;
}

const mapToActions = (dispatch: Dispatch): IActions => ({
    goBack: () => {
        dispatch(changeScreenEvent(Screen.BOARD));
        dispatch(persistedBoardsLoadedEvent([]));
        dispatch(selectSavedBoardEvent(null));
        dispatch(changeBoardNameEvent(''));
    },
    commitBoard: saveBoard(dispatch),
    openBoard: loadBoard(dispatch),
});

function Controls({
    board,
    mode,
    name,
    selectedId,
    goBack,
    commitBoard,
    openBoard,
}: IProps & IActions): JSX.Element {
    const PrimaryButton = () => {
        if (mode === BoardPersistenceMode.SAVE) {
            return (
                <button disabled={!name}
                    onClick={() => commitBoard({ board, name, id: selectedId || uuid() })}>
                    Save
                </button>
            );
        } else if (mode === BoardPersistenceMode.LOAD) {
            return (
                <button disabled={!selectedId}
                    onClick={() => selectedId && openBoard(selectedId)}>
                    Load
                </button>
            );
        } else {
            return <></>;
        }
    };

    return (
        <div className="controls">
            <button onClick={goBack}>Cancel</button>
            <PrimaryButton />
        </div>
    );
}

export default connect(mapStateToProps, mapToActions)(Controls);
