import React from 'react';
import { Store, createStore } from 'redux';
import { Provider } from 'react-redux';
import { SudokuState } from './board/model';
import reducer from './board/reducer';
import BoardService from './board/service';
import Controls from './components/Controls';
import Board from './components/Board';
import GameControls from './components/GameControls';
import './style.css';

export default class Sudoku extends React.Component {

  private boardStore: Store<SudokuState>;
  private boardService: BoardService;

  constructor(props: any) {
    super(props);

    this.boardStore = createStore(reducer);
    this.boardService = new BoardService(this.boardStore);
  }

  componentDidMount() {

  }

  render(): JSX.Element {
    return (
      <Provider store={this.boardStore}>
        <div id="sudoku">
          <div className="container">
            <div className="controls-container">
              <Controls boardService={this.boardService} />
            </div>
            <Board boardService={this.boardService} />
            <div className="controls-container">
              <GameControls boardService={this.boardService} />
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}
