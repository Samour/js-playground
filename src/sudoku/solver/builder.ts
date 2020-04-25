import { Store } from 'redux';
import { SudokuState } from 'sudoku/board/model';
import BoardService from 'sudoku/board/service';
import {
  ICellAnalyser,
  HorizontalCellAnalyser,
  VerticalCellAnalyser,
  SquareCellAnalyser,
  UnionCellAnalyser,
} from './analyser';
import SolverService from './service';

export default class SolverServiceBuilder {

  private store: Store<SudokuState> | null = null;
  private boardService: BoardService | null = null;
  private analyser: ICellAnalyser | null = null;

  public withStore(store: Store<SudokuState>): SolverServiceBuilder {
    this.store = store;
    return this;
  }

  public withService(boardService: BoardService): SolverServiceBuilder {
    this.boardService = boardService;
    return this;
  }

  public withAnalyser(analyser: ICellAnalyser): SolverServiceBuilder {
    this.analyser = analyser;
    return this;
  }

  public withDefaultAnalyser(): SolverServiceBuilder {
    return this.withAnalyser(new UnionCellAnalyser([
      new HorizontalCellAnalyser(),
      new VerticalCellAnalyser(),
      new SquareCellAnalyser(),
    ]));
  }

  public build(): SolverService {
    if (!this.store || !this.boardService || !this.analyser) {
      throw new Error('Builder is not finalised');
    }
    return new SolverService(this.store, this.boardService, this.analyser);
  }
}
