import React from 'react';
import { connect } from 'react-redux';
import { CellState } from 'lightup/store/model';
import mapStateToProps from './props';

class Canvas extends React.Component {

  static _CELL_WIDTH = 30;
  static _CELL_HEIGHT = 30;
  static _BORDER_WIDTH = 1;
  static _WALL_COLOUR = 'black';
  static _TEXT_FONT = '16px Times';
  static _TEXT_PADX = 10;
  static _TEXT_PADY = 20;
  static _LIGHT_RADIUS = 4;
  static _LIGHT_INNER_FILL = 'yellow';
  static _LIGHT_RAY_R1 = 7;
  static _LIGHT_RAY_R2 = 12;
  static _CROSS_PADDING = 8;
  static _CROSS_COLOUR = 'red';
  static _LIT_COLOUR = 'yellow';

  constructor(props) {
    super(props);

    this._ref = React.createRef();
    this._canvas = null;
  }

  renderBoard() {
    console.log('renderBoard()');
    this._canvas = this._ref.current.getContext('2d');
    this._drawGrid();
    this._drawCells();
  }

  _getCanvasWidth() {
    return this.props.dims[0] * (Canvas._CELL_WIDTH + Canvas._BORDER_WIDTH) + Canvas._BORDER_WIDTH;;
  }

  _getCanvasHeight() {
    return this.props.dims[1] * (Canvas._CELL_HEIGHT + Canvas._BORDER_WIDTH) + Canvas._BORDER_WIDTH;
  }

  _drawGrid() {
    const canvasWidth = this._getCanvasWidth();
    const canvasHeight = this._getCanvasHeight();
    this._ref.current.height = canvasHeight;
    this._ref.current.style.height = canvasHeight;
    this._ref.current.width = canvasWidth;
    this._ref.current.style.width = canvasWidth;

    for (let i = 0; i < this.props.dims[0] + 1; i++) {
      const x_pos = i * (Canvas._CELL_WIDTH + Canvas._BORDER_WIDTH);
      this._drawLine(
        x_pos, 0,
        x_pos, canvasHeight
      );
    }

    for (let i = 0; i < this.props.dims[1] + 1; i++) {
      const y_pos = i * (Canvas._CELL_HEIGHT + Canvas._BORDER_WIDTH);
      this._drawLine(
        0, y_pos,
        canvasWidth, y_pos
      );
    }
  }

  _drawCells() {
    for (let x = 0; x < this.props.dims[0]; x++) {
      for (let y = 0; y < this.props.dims[1]; y++) {
        this._drawCell(x, y, this.props.board[x][y]);
      }
    }
  }

  _drawCell(x, y, cell) {
    const canvasX = x * (Canvas._CELL_WIDTH + Canvas._BORDER_WIDTH) + Canvas._BORDER_WIDTH;
    const canvasY = y * (Canvas._CELL_HEIGHT + Canvas._BORDER_WIDTH) + Canvas._BORDER_WIDTH;

    if (cell.lit) {
      this._drawLitCell(canvasX, canvasY);
    }

    switch (cell.state) {
      case CellState.WALL:
        this._drawWall(canvasX, canvasY, cell);
        break;
      case CellState.LIGHT:
        this._drawLight(canvasX, canvasY);
        break;
      case CellState.CROSS:
        this._drawCross(canvasX, canvasY);
        break;
      default:
        break;
    }
  }

  _drawWall(x, y, cell) {
    this._drawRect(
      x, y,
      Canvas._CELL_WIDTH + Canvas._BORDER_WIDTH, Canvas._CELL_HEIGHT + Canvas._BORDER_WIDTH,
      Canvas._WALL_COLOUR
    );
    if (cell.count !== null) {
      this._canvas.fillStyle = 'white';
      this._canvas.font = Canvas._TEXT_FONT;
      this._canvas.fillText(
        cell.count,
        x + Canvas._TEXT_PADX, y + Canvas._TEXT_PADY
      );
    }
  }

  _drawLight(x, y) {
    const originX = x + Canvas._CELL_WIDTH / 2;
    const originY = y + Canvas._CELL_HEIGHT / 2;
    this._drawCircle(originX, originY, Canvas._LIGHT_RADIUS, Canvas._LIGHT_INNER_FILL);
    [
      0, 45, 90, 135, 180, -135, -90, -45,
    ].forEach((d) => this._drawLightRay(originX, originY, d));
  }

  _drawLightRay(x, y, deg) {
    const rad = deg * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    this._drawLine(
      Canvas._LIGHT_RAY_R1 * cos + x,
      Canvas._LIGHT_RAY_R1 * sin + y,
      Canvas._LIGHT_RAY_R2 * cos + x,
      Canvas._LIGHT_RAY_R2 * sin + y
    );
  }

  _drawCross(x, y) {
    this._drawLine(
      x + Canvas._CROSS_PADDING, y + Canvas._CROSS_PADDING,
      x + Canvas._CELL_WIDTH - Canvas._CROSS_PADDING, y + Canvas._CELL_HEIGHT - Canvas._CROSS_PADDING,
      Canvas._CROSS_COLOUR
    );
    this._drawLine(
      x + Canvas._CROSS_PADDING, y + Canvas._CELL_HEIGHT - Canvas._CROSS_PADDING,
      x + Canvas._CELL_WIDTH - Canvas._CROSS_PADDING, y + Canvas._CROSS_PADDING,
      Canvas._CROSS_COLOUR
    );
  }

  _drawLitCell(x, y) {
    this._drawRect(
      x, y,
      Canvas._CELL_WIDTH - Canvas._BORDER_WIDTH, Canvas._CELL_HEIGHT - Canvas._BORDER_WIDTH,
      Canvas._LIT_COLOUR,
    );
  }

  _drawLine(x1, y1, x2, y2, colour='black') {
    this._canvas.beginPath();
    this._canvas.moveTo(x1, y1);
    this._canvas.lineTo(x2, y2);
    this._canvas.strokeStyle = colour;
    this._canvas.stroke();
  }

  _drawRect(x1, y1, x2, y2, colour) {
    this._canvas.beginPath();
    this._canvas.rect(x1, y1, x2, y2);
    this._canvas.fillStyle = colour;
    this._canvas.fill();
  }

  _drawCircle(x, y, r, colour) {
    this._canvas.beginPath();
    this._canvas.arc(x, y, r, 0, 2 * Math.PI);
    this._canvas.strokeStyle = 'black';
    this._canvas.fillStyle = colour;
    this._canvas.stroke();
    this._canvas.fill();
  }

  _handleClick = (event) => {
    const { top, left } = this._ref.current.getBoundingClientRect();
    const boardX = Math.floor((event.clientX - left) * this.props.dims[0] / this._getCanvasWidth());
    const boardY = Math.floor((event.clientY - top) * this.props.dims[1] / this._getCanvasHeight());
    this.props.boardService.handleCellClick(boardX, boardY);
  }

  _handleKeyPress = (event) => {
    this.props.boardService.handleKeyPress(event.key);
  }

  componentDidUpdate() {
    this.renderBoard();
  }

  render() {
    return <canvas tabIndex="1" ref={this._ref} onClick={this._handleClick} onKeyDown={this._handleKeyPress} />;
  }
}

export default connect(mapStateToProps)(Canvas)
