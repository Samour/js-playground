import React from 'react';
import { connect } from 'react-redux';
import { GameMode } from 'lightup/store/model';
import mapStateToProps from './props';

class Controls extends React.Component {

  _setMode(mode) {
    return () => this.props.boardService.setGameMode(mode);
  }

  _resetBoard = () => {
    const [x, y] = this.props.dims;
    this.props.boardService.resetBoard(x, y);
  }

  _resetGame = () => {
    this.props.boardService.resetGame();
  }

  _modeButton() {
    if (this.props.gameMode === GameMode.SOLVE) {
      return <button onClick={this._setMode(GameMode.CONSTRUCT)}>Construct mode</button>;
    } else {
      return <button onClick={this._setMode(GameMode.SOLVE)}>Solve mode</button>;
    }
  }

  render() {
    return (
      <div>
        {this._modeButton()}
        <button onClick={this._resetGame}>Reset game</button>
        <button onClick={this._resetBoard}>Clear board</button>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Controls);
