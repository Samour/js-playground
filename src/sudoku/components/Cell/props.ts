import { SudokuState, SudokuCell, Coordinate } from 'sudoku/board/model';
import BoardService from 'sudoku/board/service';

interface IMappedProps {
  focusCell: Coordinate | null;
  algorithmRunning: boolean;
}

export interface IProps extends IMappedProps {
  boardService: BoardService;
  x: number;
  y: number;
  cell: SudokuCell;
}

export const mapStateToProps = (state: SudokuState): IMappedProps => ({
  focusCell: state.focusCell,
  algorithmRunning: state.algorithmRunning,
});
