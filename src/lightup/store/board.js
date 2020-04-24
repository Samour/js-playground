import { CellState, GameMode } from './model';
import { EventType } from './events';

const initialState = () => ({
  dims: [0, 0],
  board: [],
  litByMatrix: [],
  gameMode: GameMode.SOLVE,
  focusCell: null,
});

function generateMatrix(x, y, generator) {
  const matrix = [];
  for (let i = 0; i < x; i++) {
    const row = [];
    matrix.push(row);
    for (let j = 0; j < y; j++) {
      row.push(generator());
    }
  }

  return matrix;
}

function setGameMode(state, mutation) {
  return {
    ...state,
    gameMode: mutation.mode,
  };
}

function resetBoard(state, mutation) {
  return {
    ...state,
    dims: [mutation.x, mutation.y],
    board: generateMatrix(mutation.x, mutation.y, () => new CellState(CellState.EMPTY, false, null)),
    litByMatrix: generateMatrix(mutation.x, mutation.y, () => new Set())
  };
}

function resetGame(state) {
  return {
    ...state,
    board: state.board.map((col) => col.map(
      (c) => c.state === CellState.WALL ? c : new CellState(CellState.EMPTY, false, null)
    )),
    litByMatrix: state.litByMatrix.map((col) => col.map(() => new Set())),
  };
}

function getLineOfSightCells(state, x, y) {
  let dir = 0;
  let i = 0;

  const getCoords = () => {
    switch (dir) {
      case 0:
        return [x + i, y];
      case 1:
        return [x - i, y];
      case 2:
        return [x, y + i];
      default:
        return [x, y - i];
    }
  };

  const prtIsValid = () => {
    const [pX, pY] = getCoords();
    return pX >= 0 && pX < state.dims[0] && pY >= 0 && pY < state.dims[1];
  };

  const inc = () => {
    i += 1;
    const [pX, pY] = getCoords();
    if (prtIsValid() && state.board[pX][pY].state !== CellState.WALL) {
      return;
    }

    i = 0;
    dir += 1;
    if (dir < 4) {
      inc();
    } else {
      return;
    }
  };

  const cells = [];
  while (dir < 4) {
    inc();
    if (dir < 4) {
      cells.push(getCoords());
    }
  }

  return cells;
}

function updateLitByMatrix(state, x, y, lit) {
  const result = state.litByMatrix.map((col) => col.map((s) => new Set(s)));

  getLineOfSightCells(state, x, y).forEach(([cX, cY]) => {
    const litBy = result[cX][cY];
    if (lit) {
      litBy.add(JSON.stringify([x, y]));
    } else {
      litBy.delete(JSON.stringify([x, y]));
    }

    state.board[cX][cY].lit = litBy.size > 0 || state.board[cX][cY].state === CellState.LIGHT;
  });

  return result;
}

function setCellState(state, mutation) {
  const currentState = state.board[mutation.x][mutation.y];
  if (currentState.state === mutation.state) {
    return state;
  }

  const update = {
    ...state,
    board: state.board.map((col) => col.map((c) => c.copy())),
  };

  const cellState = new CellState(
    mutation.state,
    mutation.state === CellState.LIGHT || state.litByMatrix[mutation.x][mutation.y].size > 0,
    currentState.count,
  );
  update.board[mutation.x][mutation.y] = cellState;
  if (currentState.state === CellState.LIGHT || mutation.state === CellState.LIGHT) {
    update.litByMatrix = updateLitByMatrix(update, mutation.x, mutation.y, mutation.state === CellState.LIGHT);
  }

  return update;
}

function setCellCount(state, mutation) {
  const board = state.board.map((c) => [...c]);
  const currentCell = board[mutation.x][mutation.y];
  board[mutation.x][mutation.y] = new CellState(currentCell.state, currentCell.lit, mutation.count);

  return {
    ...state,
    board,
  };
}

function setFocusCell(state, mutation) {
  return {
    ...state,
    focusCell: [mutation.x, mutation.y],
  };
}

export function reducer(state, mutation) {
  if (!state) {
    state = initialState();
  }
  switch (mutation.type) {
    case EventType.SET_GAME_MODE:
      return setGameMode(state, mutation);
    case EventType.RESET_BOARD:
      return resetBoard(state, mutation);
    case EventType.RESET_GAME:
      return resetGame(state);
    case EventType.SET_CELL_STATE:
      return setCellState(state, mutation);
    case EventType.SET_CELL_COUNT:
      return setCellCount(state, mutation);
    case EventType.FOCUS_CELL:
      return setFocusCell(state, mutation);
    default:
      return state;
  }
}
