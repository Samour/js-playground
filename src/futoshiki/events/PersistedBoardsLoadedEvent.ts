import { PersistedBoard } from 'futoshiki/model/Board';
import { EventType } from 'futoshiki/events/EventType';

export interface IPersistedBoardsLoadedEvent {
    type: EventType.PERSISTED_BOARDS_LOADED;
    boards: PersistedBoard[];
}

export const persistedBoardsLoadedEvent = (boards: PersistedBoard[]): IPersistedBoardsLoadedEvent => ({
    type: EventType.PERSISTED_BOARDS_LOADED,
    boards,
});
