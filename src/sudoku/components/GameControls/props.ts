import { SudokuState } from 'sudoku/board/model';
import BoardService from 'sudoku/board/service';

interface IMappedProps {
  noteMode: boolean;
  algorithmRunning: boolean;
}

export interface IProps extends IMappedProps {
  boardService: BoardService;
}

export const mapStateToProps = (state: SudokuState): IMappedProps => ({
  noteMode: state.noteMode,
  algorithmRunning: state.algorithmRunning,
});
