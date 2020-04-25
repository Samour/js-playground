import React from 'react';
import { connect } from 'react-redux';
import { IProps, mapStateToProps } from './props';

class Controls extends React.Component<IProps> {

  private static readonly FILE_TYPE = '.puzzle';

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
    input.accept = Controls.FILE_TYPE;
    input.click();

    input.addEventListener('change', () => {
      input.files?.[0].arrayBuffer().then((data) => {
        this.props.boardService.deserialise(data);
      });
      input.remove();
    });
  }

  solveButton(): JSX.Element {
    if (this.props.algorithmRunning) {
      return <button onClick={() => this.props.solverService.stop()}>Stop</button>;
    } else {
      return <button onClick={() => this.props.solverService.solve()}>Solve</button>;
    }
  }

  render() {
    return (
      <div className="controls">
        <button onClick={this.open} disabled={this.props.algorithmRunning}>Load puzzle</button>
        <button onClick={this.save} disabled={this.props.algorithmRunning}>Save puzzle</button>
        {this.solveButton()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Controls);
