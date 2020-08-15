export interface Coordinate {
    x: number;
    y: number;
}

export interface Cell {
    value: number | null;
    possible: number[];
    provided: boolean;
    guess: boolean;
}

export interface LTConstraint {
    subject: Coordinate;
    relates: Coordinate;
}

export interface Board {
    cells: Cell[][];
    ltConstraints: LTConstraint[];
}

export interface PersistedBoard {
    id: string;
    board: Board;
    name: string;
}

export interface PersistedBoardsStore {
    boards: PersistedBoard[];
}

export const coordinateEquals = (left: Coordinate, right: Coordinate): boolean =>
    left.x === right.x && left.y === right.y;

export const constraintMatches = (left: Coordinate, right: Coordinate, constraint: LTConstraint): boolean =>
    (coordinateEquals(left, constraint.subject) && coordinateEquals(right, constraint.relates))
    || (coordinateEquals(left, constraint.relates) && coordinateEquals(right, constraint.subject));
