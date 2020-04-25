import React from 'react';
import { IProps } from './props';

export default class Controls extends React.Component<IProps> {

  private save = () => {
    const data = this.props.boardService.seralise();
    const a = document.createElement("a");
    const file = new Blob([data], { type: 'application/octet-stream' });
    a.href = URL.createObjectURL(file);
    a.download = 'Sudoku.puzzle';
    a.click();
    a.remove();
  }

  private open = () => {
    const input = document.createElement("input");
    input.type = 'file';
    input.click();

    input.addEventListener('change', () => {
      input.files?.[0].arrayBuffer().then((data) => {
        this.props.boardService.deserialise(data);
      });
      input.remove();
    });
  }

  render() {
    return (
      <div className="controls">
        <button onClick={this.open}>Load puzzle</button>
        <button onClick={this.save}>Save puzzle</button>
      </div>
    );
  }
}