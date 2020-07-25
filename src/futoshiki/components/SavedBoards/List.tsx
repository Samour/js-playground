import React from 'react';
import { connect } from 'react-redux';
import { PersistedBoard } from 'futoshiki/model/Board';
import { State } from 'futoshiki/model/State';
import Item from './Item';

interface IProps {
    boards: PersistedBoard[];
}

const mapToProps = (state: State): IProps => ({
    boards: state.persistedBoards.boards,
});

function List({ boards }: IProps): JSX.Element {
    return (
        <div className="saved-list">
            {boards.map((board) => <Item key={board.id} board={board} />)}
        </div>
    );
}

export default connect(mapToProps)(List);
