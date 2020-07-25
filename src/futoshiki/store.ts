import { Store, createStore } from 'redux';
import { State } from 'futoshiki/model/State';
import reducer from 'futoshiki/reducers';

export const store: Store<State> = createStore(reducer);
