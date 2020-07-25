import React, { useRef, useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BoardPersistenceMode, State } from 'futoshiki/model/State';
import { changeBoardNameEvent } from 'futoshiki/events/ChangeBoardNameEvent';
import List from './List';
import Controls from './Controls';

interface IProps {
    mode: BoardPersistenceMode;
    name: string;
}

const mapStateToProps = (state: State): IProps => ({
    mode: state.persistedBoards.mode,
    name: state.persistedBoards.name,
});

interface IActions {
    changeName: (name: string) => void;
}

const mapToActions = (dispatch: Dispatch): IActions => ({
    changeName: (name) => dispatch(changeBoardNameEvent(name)),
});

function SavedBoards({ mode, name, changeName }: IProps & IActions): JSX.Element {
    const saveNameRef = useRef<HTMLInputElement>(null);
    const saveNameEl = mode === BoardPersistenceMode.SAVE && (
        <div className="controls">
            <input value={name} onChange={(e) => changeName(e.target.value)} ref={saveNameRef} />
        </div>
    );

    useEffect(() => {
        saveNameRef.current?.focus();
    }, []);

    return (
        <>
            <List />
            {saveNameEl}
            <Controls />
        </>
    );
}

export default connect(mapStateToProps, mapToActions)(SavedBoards);
