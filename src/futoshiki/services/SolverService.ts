import { Coordinate, Board, coordinateEquals } from 'futoshiki/model/Board';
import { clearCellNotesEvent } from 'futoshiki/events/ClearCellNotesEvent';
import { toggleCellNoteEvent } from 'futoshiki/events/ToggleCellNoteEvent';
import { highlightCellEvent } from 'futoshiki/events/HighlightCellEvent';
import { cellValueEvent } from 'futoshiki/events/CellValueEvent';
import { solutionStatusEvent } from 'futoshiki/events/SolutionStatusEvent';
import { restoreStateEvent } from 'futoshiki/events/RestoreStateEvent';
import verifySolution from 'futoshiki/services/SolutionVerifier';
import { store } from 'futoshiki/store';

interface Guess {
    state: Board;
    solvedCells: number;
    cell: Coordinate;
    value: number;
}

class IllegalStateException extends Error { };

export interface SolverConfiguration {
    stepTimeout?: number;
}

const waitFnFactory = (timeout: number): (() => Promise<void>) => {
    if (timeout <= 0) {
        return async () => undefined;
    } else {
        return () => new Promise((res) => setTimeout(res, timeout));
    }
};

const getAdjacentValues = (x: number, y: number): Set<number> => {
    const result: Set<number> = new Set();
    const pushValue = (i: number, j: number) => {
        const value: number | null = store.getState().board.cells[i][j].value;
        if (value) {
            result.add(value);
        }
    };

    for (let i = 0; i < store.getState().board.cells.length; i++) {
        pushValue(i, y);
        pushValue(x, i);
    }

    return result;
};

const getCellMin = (x: number, y: number): number => {
    const cell = store.getState().board.cells[x][y];
    if (cell.value) {
        return cell.value;
    } else if (cell.possible.length) {
        return cell.possible[0];
    } else {
        return 1;
    }
};

const getCellMax = (x: number, y: number): number => {
    const cell = store.getState().board.cells[x][y];
    if (cell.value) {
        return cell.value;
    } else if (cell.possible.length) {
        return cell.possible[cell.possible.length - 1];
    } else {
        return store.getState().board.cells.length;
    }
};

const calculateCellPossibleValues = (x: number, y: number): number[] => {
    store.dispatch(highlightCellEvent({ x, y }));
    const adjacentValues = getAdjacentValues(x, y);
    let min = 1;
    let max = store.getState().board.cells.length;

    for (let constraint of store.getState().board.ltConstraints) {
        if (coordinateEquals({ x, y }, constraint.subject)) {
            const relateMax = getCellMax(constraint.relates.x, constraint.relates.y) - 1;
            if (relateMax < max) {
                max = relateMax;
            }
        } else if (coordinateEquals({ x, y }, constraint.relates)) {
            const relateMin = getCellMin(constraint.subject.x, constraint.subject.y) + 1;
            if (relateMin > min) {
                min = relateMin;
            }
        }
    }

    const result: number[] = [];
    for (let i = min; i <= max; i++) {
        if (!adjacentValues.has(i)) {
            result.push(i);
        }
    }

    return result;
};

export default async ({ stepTimeout = -1 }: SolverConfiguration = {}) => {
    const waitFn = waitFnFactory(stepTimeout);

    const size: number = store.getState().board.cells.length;
    const relatedCells: Coordinate[][][] = store.getState().board.cells
        .map((r, y) =>
            r.map((c, x) =>
                store.getState().board.ltConstraints.filter(({ subject }) => coordinateEquals({ x, y }, subject))
                    .map(({ relates }) => relates)
                    .concat(
                        store.getState().board.ltConstraints.filter(({ relates }) => coordinateEquals({ x, y }, relates))
                            .map(({ subject }) => subject)
                    )
            )
        );
    let initialPopulationMode: boolean = true;
    const solveTarget: number = size * size;
    let solvedCells: number = 0;
    const guesses: Guess[] = [];

    const updateAssociatedCells = async (x: number, y: number): Promise<void> => {
        for (let i = 0; i < size; i++) {
            if (i !== x) {
                await updateCell(i, y);
            }
        }
        for (let i = 0; i < size; i++) {
            if (i !== y) {
                await updateCell(x, i);
            }
        }
    };

    const updateCell = async (x: number, y: number): Promise<void> => {
        if (store.getState().board.cells[x][y].value) {
            return;
        } else if (!store.getState().board.cells[x][y].possible.length) {
            if (initialPopulationMode) {
                return;
            } else {
                throw new IllegalStateException();
            }
        }

        let notesChanged = false;
        let valueChanged = false;
        const possibleValues = calculateCellPossibleValues(x, y);
        for (let value of store.getState().board.cells[x][y].possible) {
            if (!possibleValues.includes(value)) {
                notesChanged = true;
                store.dispatch(toggleCellNoteEvent({ x, y }, value));
                await waitFn();
            }
        }

        if (store.getState().board.cells[x][y].possible.length === 1) {
            valueChanged = true;
            store.dispatch(cellValueEvent(x, y, store.getState().board.cells[x][y].possible[0]));
            solvedCells++;
            await waitFn();
        } else if (store.getState().board.cells[x][y].possible.length === 0) {
            throw new IllegalStateException();
        }

        if (valueChanged) { // TODO make this more efficient by only updating cells if value has been set or cells
            // have lt relationship
            await updateAssociatedCells(x, y);
        } else if (notesChanged) {
            for (let cell of relatedCells[x][y]) {
                await updateCell(cell.x, cell.y);
            }
        }
    };

    const applyValuesLinear = async (mapToCoordinate: (line: number, vary: number) => Coordinate): Promise<boolean> => {
        for (let line = 0; line < size; line++) {
            const valuesCount: Map<number, number[]> = new Map();
            let lineUnsolvedValues = size;
            for (let vary = 0; vary < size; vary++) {
                const { x, y } = mapToCoordinate(line, vary);
                if (store.getState().board.cells[x][y].value) {
                    lineUnsolvedValues--;
                    continue;
                }
                for (let value of store.getState().board.cells[x][y].possible) {
                    if (!valuesCount.has(value)) {
                        valuesCount.set(value, []);
                    }
                    valuesCount.get(value)?.push(vary);
                }
            }
            if (valuesCount.size < lineUnsolvedValues) {
                throw new IllegalStateException();
            }
            for (let value of Array.from(valuesCount.keys())) {
                if (valuesCount.get(value)?.length === 1) {
                    const { x, y } = mapToCoordinate(line, valuesCount.get(value)?.[0] || 0);
                    store.dispatch(cellValueEvent(x, y, value));
                    solvedCells++;
                    await waitFn();
                    await updateAssociatedCells(x, y);
                    return true;
                }
            }
        }

        return false;
    };

    const applyValues = async (): Promise<void> => {
        let hasChange: boolean = true;
        while (hasChange) {
            hasChange = await applyValuesLinear(
                (y, x) => ({ x, y }),
            );
            hasChange = hasChange || await applyValuesLinear(
                (x, y) => ({ x, y, }),
            );
        }
    };

    const pickCellForGuess = (): Coordinate => { // TODO use more intelligent algorithm for picking next guess
        let cell: Coordinate | null = null;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (store.getState().board.cells[x][y].value) {
                    continue;
                }
                if (!cell || store.getState().board.cells[x][y].possible.length <
                    store.getState().board.cells[cell.x][cell.y].possible.length) {
                    cell = { x, y };
                }
            }
        }

        return cell as Coordinate;
    };

    const applyBacktrack = async (x: number, y: number): Promise<void> => {
        try {
            await updateCell(x, y);
            await updateAssociatedCells(x, y);
            await applyValues();
        } catch (e) {
            if (e instanceof IllegalStateException) {
                const guess = guesses.pop();
                if (!guess) {
                    throw e;
                }

                store.dispatch(restoreStateEvent(guess.state));
                solvedCells = guess.solvedCells;
                store.dispatch(highlightCellEvent(guess.cell));
                store.dispatch(cellValueEvent(guess.cell.x, guess.cell.y, null));
                store.dispatch(toggleCellNoteEvent(guess.cell, guess.value));
                await waitFn();

                await applyBacktrack(guess.cell.x, guess.cell.y);
            } else {
                throw e;
            }
        }
    };

    // Start by clearing all notes
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            store.dispatch(clearCellNotesEvent(x, y));
        }
    }
    await waitFn();

    // Perform initial population
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (store.getState().board.cells[x][y].value) {
                solvedCells++;
                continue;
            }

            const possibleValues = calculateCellPossibleValues(x, y);
            for (let value of possibleValues) {
                store.dispatch(toggleCellNoteEvent({ x, y }, value));
                await waitFn();
            }

            if (store.getState().board.cells[x][y].possible.length === 1) {
                store.dispatch(cellValueEvent(x, y, store.getState().board.cells[x][y].possible[0]));
                solvedCells++;
                await waitFn();
            }

            await updateAssociatedCells(x, y);
        }
    }
    await applyValues();

    // Backtracking
    initialPopulationMode = false;
    while (solvedCells < solveTarget) {
        console.log(solvedCells);
        console.log(solveTarget);
        const cell = pickCellForGuess();
        const guess: Guess = {
            cell,
            solvedCells,
            state: store.getState().board,
            value: store.getState().board.cells[cell.x][cell.y].possible[0],
        };
        guesses.push(guess);
        store.dispatch(highlightCellEvent(cell));
        store.dispatch(cellValueEvent(cell.x, cell.y, guess.value, { guess: true }));
        solvedCells++;
        await waitFn();

        await applyBacktrack(guess.cell.x, guess.cell.y);
    }

    store.dispatch(solutionStatusEvent(verifySolution(store.getState().board)));
};
