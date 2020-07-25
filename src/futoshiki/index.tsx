import React from 'react';
import { Provider, connect } from 'react-redux';
import { Screen } from 'futoshiki/model/Controls';
import { State } from 'futoshiki/model/State';
import Board from 'futoshiki/components/Board';
import Controls from 'futoshiki/components/Controls';
import SavedBoards from 'futoshiki/components/SavedBoards';
import { store } from './store';
import './style.scss';

interface IScreenProps {
    screen: Screen;
}

const mapToScreenProps = (state: State): IScreenProps => ({
    screen: state.screen,
});

function ScreenControllerInner({ screen }: IScreenProps): JSX.Element {
    if (screen === Screen.BOARD) {
        return (
            <>
                <Board />
                <Controls />
            </>
        );
    } else if (screen === Screen.SAVED_BOARDS) {
        return <SavedBoards />;
    } else {
        return <></>;
    }
}

const ScreenController = connect(mapToScreenProps)(ScreenControllerInner);

export default function Futoshiki(): JSX.Element {
    return (
        <Provider store={store}>
            <div id="futoshiki">
                <ScreenController />
            </div>
        </Provider>
    );
}
