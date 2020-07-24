import { combineReducers } from 'redux';
import board from './board';
import highlight from './highlight';
import controls from './controls';

export default combineReducers({
    board,
    highlight,
    controls,
});
