import { Board, Coordinate } from 'futoshiki/model/Board';
import { NumericMode } from 'futoshiki/model/Controls';

export interface Controls {
    numericMode: NumericMode;
}

export interface State {
    board: Board;
    highlight: Coordinate | null;
    controls: Controls;
}
