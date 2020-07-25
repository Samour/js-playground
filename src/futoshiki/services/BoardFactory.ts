import { Board, Cell } from 'futoshiki/model/Board';

export default function createBoard(size: number): Board {
    const board: Board = {
        cells: [],
        ltConstraints: [],
    };
    for (let i = 0; i < size; i++) {
        const cells: Cell[] = [];
        board.cells.push(cells);
        for (let j = 0; j < size; j++) {
            cells.push({
                value: null,
                possible: [],
                provided: false,
            });
        }
    }

    return board;
}
