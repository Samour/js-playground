import React from 'react';
import { connect } from 'react-redux';
import { IProps, mapStateToProps } from './props';
import './style.css';

class GameControls extends React.Component<IProps> {

  private button(onClick: () => any, label: string): JSX.Element {
    return <button disabled={this.props.algorithmRunning} onClick={onClick}>{label}</button>;
  }

  private modeButton(mode: boolean, label: string): JSX.Element {
    if (this.props.noteMode === mode) {
      return <button disabled={true}>{label}</button>;
    } else {
      return this.button(() => this.props.boardService.setNoteMode(mode), label);
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
          {this.button(() => this.props.boardService.lockAllValues(), 'Lock')}
          {this.button(() => this.props.boardService.clearBoard(), 'Clear')}
          {this.button(() => this.props.boardService.resetGame(), 'Reset')}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(GameControls);
