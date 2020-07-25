import { Board } from 'futoshiki/model/Board';
import { ResultStatus } from 'futoshiki/model/Result';

export default (board: Board): ResultStatus => {
    // Scan rows for repetition
    for (let y = 0; y < board.cells.length; y++) {
        const encounteredValues: Set<number> = new Set();
        for (let x = 0; x < board.cells.length; x++) {
            const { value } = board.cells[x][y];
            if (!value) {
                continue;
            }
            if (encounteredValues.has(value)) {
                return ResultStatus.ERROR;
            }
            encounteredValues.add(value);
        }
    }

    // Scan columns for repetition
    for (let x = 0; x < board.cells.length; x++) {
        const encounteredValues: Set<number> = new Set();
        for (let y = 0; y < board.cells.length; y++) {
            const { value } = board.cells[x][y];
            if (!value) {
                continue;
            }
            if (encounteredValues.has(value)) {
                return ResultStatus.ERROR;
            }
            encounteredValues.add(value);
        }
    }

    // Check all LT constraints
    for (let constraint of board.ltConstraints) {
        const valueLower = board.cells[constraint.subject.x][constraint.subject.y].value;
        const valueUpper = board.cells[constraint.relates.x][constraint.relates.y].value;
        if (!valueLower || !valueUpper) {
            continue;
        }
        if (valueLower >= valueUpper) {
            return ResultStatus.ERROR;
        }
    }

    // Solution does not have errors
    // Now check for completeness
    for (let row of board.cells) {
        for (let cell of row) {
            if (!cell.value) {
                return ResultStatus.INCOMPLETE;
            }
        }
    }

    // All cells are populated & no errors
    return ResultStatus.SOLVED;
};
