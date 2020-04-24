import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './store/board';
import BoardService from './services/boardService';
import Controls from './Controls';
import Canvas from './Canvas';
import './index.css';

export default class Lightup extends React.Component {

  constructor(props) {
    super(props);

    this.store = createStore(reducer);
    this.boardService = new BoardService(this.store);
  }

  componentDidMount() {
    this.boardService.resetBoard(7, 7);
  }

  render() {
    return (
      <Provider store={this.store}>
        <div id="lightup">
          <div className="container">
            <Controls boardService={this.boardService}/>
            <div className="canvas-container">
              <Canvas boardService={this.boardService}/>
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}