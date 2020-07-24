import { Board } from 'futoshiki/model/Board';
import { IToggleCellNoteEvent } from 'futoshiki/events/ToggleCellNoteEvent';

export default function reducer(state: Board, event: IToggleCellNoteEvent): Board {
    const cell = state.cells[event.cell.x][event.cell.y];
    const possible = cell.possible.filter((v) => v !== event.value);
    if (!cell.possible.includes(event.value)) {
        possible.push(event.value);
        possible.sort();
    }

    return {
        ...state,
        cells: state.cells.map((r, x) =>
            x === event.cell.x ?
                r.map((c, y) => y === event.cell.y ? {
                    ...c,
                    possible,
                } : c)
                : r,
        ),
    };
}
