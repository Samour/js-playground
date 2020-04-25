import React from 'react';
import { connect } from 'react-redux';
import { IProps, mapStateToProps } from './props';
import './style.css';

class Cell extends React.Component<IProps> {

  private handleClick = () => {
    this.props.boardService.focusCell(this.props.x, this.props.y);
  }

  private classNames(): string {
    const names = ['cell'];
    if (this.props.cell.fixed) {
      names.push('fixed');
    } else if (!!this.props.focusCell && this.props.focusCell.x === this.props.x
      && this.props.focusCell.y === this.props.y) {
      names.push('highlight');
    }

    return names.join(' ');
  }

  private renderNoteCell(i: number): JSX.Element {
    const x = (i - 1) % 3;
    const y = Math.floor((i - 1) / 3);

    return <div key={i} className={`note x-offset-${x} y-offset-${y}`}>{i}</div>;
  }

  private renderInnerNotes(): JSX.Element[] {
    const notes: JSX.Element[] = [];
    this.props.cell.possible.forEach((i) => notes.push(this.renderNoteCell(i)));

    return notes;
  }

  private renderInner(): JSX.Element | JSX.Element[] {
    if (this.props.cell.value) {
      return <div className="inner">{this.props.cell.value}</div>;
    } else {
      return this.renderInnerNotes();
    }
  }

  render(): JSX.Element {
    return (
      <div className={this.classNames()} onClick={this.handleClick}>
        {this.renderInner()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Cell);
