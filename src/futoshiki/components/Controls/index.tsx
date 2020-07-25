import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Undo, Redo } from '@material-ui/icons';
import { Board } from 'futoshiki/model/Board';
import { BoardMode } from 'futoshiki/model/Controls';
import { ResultStatus } from 'futoshiki/model/Result';
import { State, BoardPersistenceMode } from 'futoshiki/model/State';
import { newBoardEvent } from 'futoshiki/events/NewBoardEvent';
import { changeGameSizeEvent } from 'futoshiki/events/ChangeGameSizeEvent';
import { restoreStateEvent } from 'futoshiki/events/RestoreStateEvent';
import { toggleBoardModeEvent } from 'futoshiki/events/ToggleBoardModeEvent';
import { resetBoardEvent } from 'futoshiki/events/ResetBoardEvent';
import { solutionStatusEvent } from 'futoshiki/events/SolutionStatusEvent';
import { showBoards } from 'futoshiki/services/BoardPersistence';
import verifySolution from 'futoshiki/services/SolutionVerifier';
import solvePuzzle from 'futoshiki/services/SolverService';

const GAME_SIZES = [
    5,
    6,
    7,
    8,
    9,
];

interface IProps {
    gameSize: number;
    undoDisabled: boolean;
    redoDisabled: boolean;
    boardHistory: Board[];
    currentIndex: number;
    boardMode: BoardMode;
    board: Board;
    resultStatus: ResultStatus | null;
}

const mapToProps = (state: State): IProps => ({
    gameSize: state.controls.gameSize,
    undoDisabled: state.boardHistory.currentIndex <= 0,
    redoDisabled: state.boardHistory.currentIndex >= state.boardHistory.historyStates.length - 1,
    boardHistory: state.boardHistory.historyStates,
    currentIndex: state.boardHistory.currentIndex,
    boardMode: state.controls.boardMode,
    board: state.board,
    resultStatus: state.controls.resultStatus,
});

interface IActions {
    newBoard: (size: number) => void;
    changeGameSize: (gameSize: number) => void;
    restoreState: (boardState: Board) => void;
    loadView: () => void;
    saveView: () => void;
    toggleBoardMode: () => void;
    resetBoard: () => void;
    checkSolution: (board: Board) => void;
}

const mapToActions = (dispatch: Dispatch): IActions => ({
    newBoard: (size) => dispatch(newBoardEvent(size)),
    changeGameSize: (gameSize) => dispatch(changeGameSizeEvent(gameSize)),
    restoreState: (boardState) => dispatch(restoreStateEvent(boardState)),
    saveView: () => showBoards(dispatch)(BoardPersistenceMode.SAVE),
    loadView: () => showBoards(dispatch)(BoardPersistenceMode.LOAD),
    toggleBoardMode: () => dispatch(toggleBoardModeEvent()),
    resetBoard: () => dispatch(resetBoardEvent()),
    checkSolution: (board) => dispatch(solutionStatusEvent(verifySolution(board))),
});

function Controls({
    gameSize,
    undoDisabled,
    redoDisabled,
    boardHistory,
    currentIndex,
    boardMode,
    board,
    resultStatus,
    newBoard,
    changeGameSize,
    restoreState,
    saveView,
    loadView,
    toggleBoardMode,
    resetBoard,
    checkSolution,
}: IProps & IActions): JSX.Element {
    const ResultStatusText = (): JSX.Element => {
        if (resultStatus === ResultStatus.SOLVED) {
            return <div className="result-status solved">Solved!</div>;
        } else if (resultStatus === ResultStatus.INCOMPLETE) {
            return <div className="result-status incomplete">Incomplete</div>;
        } else if (resultStatus === ResultStatus.ERROR) {
            return <div className="result-status error">Error!</div>;
        } else {
            return <></>;
        }
    };

    const boardModeText: string = boardMode === BoardMode.COMPOSE ? 'Play Mode' : 'Prepare Mode';

    return (
        <>
            <div className="controls">
                <select value={gameSize} onChange={(e) => changeGameSize(Number.parseInt(e.target.value))}>
                    {GAME_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => newBoard(gameSize)}>New Game</button>
                <button onClick={toggleBoardMode}>{boardModeText}</button>
                <button onClick={resetBoard}>Reset</button>
                <button disabled={undoDisabled} onClick={() => restoreState(boardHistory[currentIndex - 1])}>
                    <Undo />
                </button>
                <button disabled={redoDisabled} onClick={() => restoreState(boardHistory[currentIndex + 1])}>
                    <Redo />
                </button>
            </div>
            <div className="controls">
                <button onClick={() => checkSolution(board)}>Verify</button>
                <button onClick={() => solvePuzzle({ stepTimeout: 500 })}>Solve</button>
            </div>
            <ResultStatusText />
            <div className="controls">
                <button onClick={saveView}>Save</button>
                <button onClick={loadView}>Load</button>
            </div>
        </>
    );
}

export default connect(mapToProps, mapToActions)(Controls);
