import { SudokuState } from 'sudoku/board/model';
import BoardService from 'sudoku/board/service';
import SolverService from 'sudoku/solver/service';

interface IMappedProps {
  algorithmRunning: boolean;
}

export interface IProps extends IMappedProps {
  boardService: BoardService;
  solverService: SolverService;
}

export const mapStateToProps = (state: SudokuState): IMappedProps => ({
  algorithmRunning: state.algorithmRunning,
});
