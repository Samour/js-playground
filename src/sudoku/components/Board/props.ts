import { SudokuState, SudokuCell, Coordinate } from 'sudoku/board/model';
import BoardService from 'sudoku/board/service';

export interface IMappedProps {
  board: SudokuCell[][];
  focusCell: Coordinate | null;
  noteMode: boolean;
}

export interface IProps extends IMappedProps {
  boardService: BoardService;
}

export const mapStateToProps = (state: SudokuState): IMappedProps => ({
  board: state.board,
  focusCell: state.focusCell,
  noteMode: state.noteMode,
});
