import { Coordinate, coordinateEquals } from 'futoshiki/model/Board';
import { clearCellNotesEvent } from 'futoshiki/events/ClearCellNotesEvent';
import { toggleCellNoteEvent } from 'futoshiki/events/ToggleCellNoteEvent';
import { highlightCellEvent } from 'futoshiki/events/HighlightCellEvent';
import { cellValueEvent } from 'futoshiki/events/CellValueEvent';
import { solutionStatusEvent } from 'futoshiki/events/SolutionStatusEvent';
import verifySolution from 'futoshiki/services/SolutionVerifier';
import { store } from 'futoshiki/store';

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

    const size = store.getState().board.cells.length;

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
        if (store.getState().board.cells[x][y].value || !store.getState().board.cells[x][y].possible.length) {
            return;
        }

        let changeMade = false;
        const possibleValues = calculateCellPossibleValues(x, y);
        for (let value of store.getState().board.cells[x][y].possible) {
            if (!possibleValues.includes(value)) {
                changeMade = true;
                store.dispatch(toggleCellNoteEvent({ x, y }, value));
                await waitFn();
            }
        }

        if (store.getState().board.cells[x][y].possible.length === 1) {
            store.dispatch(cellValueEvent(x, y, store.getState().board.cells[x][y].possible[0], false));
            await waitFn();
        }

        if (changeMade) {
            await updateAssociatedCells(x, y);
        }
    };

    const applyValuesLinear = async (mapToCoordinate: (line: number, vary: number) => Coordinate): Promise<boolean> => {
        let hasChange = false;
        for (let line = 0; line < size; line++) {
            const valuesCount: Map<number, number[]> = new Map();
            for (let vary = 0; vary < size; vary++) {
                const { x, y } = mapToCoordinate(line, vary);
                if (store.getState().board.cells[x][y].value) {
                    continue;
                }
                for (let value of store.getState().board.cells[x][y].possible) {
                    if (!valuesCount.has(value)) {
                        valuesCount.set(value, []);
                    }
                    valuesCount.get(value)?.push(vary);
                }
            }
            for (let value of Array.from(valuesCount.keys())) {
                if (valuesCount.get(value)?.length === 1) {
                    const { x, y } = mapToCoordinate(line, valuesCount.get(value)?.[0] || 0);
                    store.dispatch(cellValueEvent(x, y, value, false));
                    await waitFn();
                    hasChange = true;
                    await updateAssociatedCells(x, y);
                }
            }
        }

        return hasChange;
    };

    const applyValues = async (): Promise<void> => {
        let hasChange: boolean = true;
        while (hasChange) {
            hasChange = false;
            hasChange = await applyValuesLinear(
                (y, x) => ({ x, y }),
            ) || hasChange;
            hasChange = await applyValuesLinear(
                (x, y) => ({ x, y, }),
            ) || hasChange;
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
                continue;
            }

            const possibleValues = calculateCellPossibleValues(x, y);
            for (let value of possibleValues) {
                store.dispatch(toggleCellNoteEvent({ x, y }, value));
                await waitFn();
            }

            if (store.getState().board.cells[x][y].possible.length === 1) {
                store.dispatch(cellValueEvent(x, y, store.getState().board.cells[x][y].possible[0], false));
                await waitFn();
            }

            await updateAssociatedCells(x, y);
        }
    }
    await applyValues();

    store.dispatch(solutionStatusEvent(verifySolution(store.getState().board)));
};
