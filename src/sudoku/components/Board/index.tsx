import React from 'react';
import { connect } from 'react-redux';
import { SudokuCell } from 'sudoku/board/model';
import { IProps, mapStateToProps } from './props';
import Cell from 'sudoku/components/Cell';
import './style.css';

class Board extends React.Component<IProps> {

  private static readonly FIXED_CELL_KEY = ' ';

  private setCellValue(x: number, y: number, event: React.KeyboardEvent) {
    let value: number | null = Number.parseInt(event.key);
    if (Number.isNaN(value)) {
      return;
    }
    if (value === 0) {
      value = null;
    }

    if (this.props.noteMode) {
      if (!value) {
        return;
      }
      const cell = this.props.board[x][y];
      if (cell.possible.has(value)) {
        this.props.boardService.removeCellPossible(x, y, value);
      } else {
        this.props.boardService.addCellPossible(x, y, value);
      }
    } else {
      this.props.boardService.setCellVaue(x, y, value);
    }
  }

  private toggleCellFixed(x: number, y: number) {
    const cell = this.props.board[x][y];
    if (cell.value) {
      this.props.boardService.setCellFixed(x, y, !cell.fixed);
    }
  }

  private handleKeyPress = (event: React.KeyboardEvent) => {
    if (!this.props.focusCell) {
      return;
    }
    const { x, y } = this.props.focusCell;
    if (event.key === Board.FIXED_CELL_KEY) {
      this.toggleCellFixed(x, y);
    } else {
      this.setCellValue(x, y, event);
    }
  }

  private renderColumn = (column: SudokuCell[], x: number): JSX.Element => {
    const cells = column.map((c, y) => <Cell key={y} boardService={this.props.boardService} x={x} y={y} cell={c} />);

    return <div key={x} className="row">{cells}</div>;
  }

  render(): JSX.Element {
    const cells = this.props.board.map(this.renderColumn);

    return <div tabIndex={1} onKeyDown={this.handleKeyPress}>{cells}</div>;
  }
}

export default connect(mapStateToProps)(Board);
