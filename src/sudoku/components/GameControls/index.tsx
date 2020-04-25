import React from 'react';
import { connect } from 'react-redux';
import { IProps, mapStateToProps } from './props';
import './style.css';

class GameControls extends React.Component<IProps> {

  private modeButton(mode: boolean, label: string): JSX.Element {
    if (this.props.noteMode === mode) {
      return <button disabled={true}>{label}</button>;
    } else {
      return <button onClick={() => this.props.boardService.setNoteMode(mode)}>{label}</button>;
    }
  }

  render(): JSX.Element {
    return (
      <div>
        <div className="controls">
          {this.modeButton(false, 'Cell')}
          {this.modeButton(true, 'Note')}
        </div>
        <div className="controls">
          <button onClick={() => this.props.boardService.lockAllValues()}>Lock</button>
          <button onClick={() => this.props.boardService.clearBoard()}>Clear</button>
          <button onClick={() => this.props.boardService.resetGame()}>Reset</button>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(GameControls);
