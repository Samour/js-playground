import { State } from 'futoshiki/model/State';
import screen from './screen';
import board, { initialState } from './board';
import boardHistory from './boardHistory';
import highlight from './highlight';
import controls from './controls';
import persistedBoards from './persistedBoards';

export default (state: State | undefined, event: any): State => ({
    screen: screen(state?.screen, event),
    board: board(state?.board, event),
    boardHistory: boardHistory(state?.board || initialState)(state?.boardHistory, event),
    highlight: highlight(state?.highlight, event),
    controls: controls(state?.controls, event),
    persistedBoards: persistedBoards(state?.persistedBoards, event),
});
