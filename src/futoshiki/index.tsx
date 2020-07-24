import React from 'react';
import { Store, createStore } from 'redux';
import { Provider } from 'react-redux';
import { State } from 'futoshiki/model/State';
import reducer from 'futoshiki/reducers';
import Board from 'futoshiki/components/Board';
import './style.scss';

const store: Store<State> = createStore(reducer);

export default function Futoshiki() {
    return (
        <Provider store={store}>
            <div id="futoshiki">
                <Board />
            </div>
        </Provider>
    );
}
