import { BoardPersistenceMode } from 'futoshiki/model/State';
import { EventType } from 'futoshiki/events/EventType';

export interface IChangeBoardPersistenceModeEvent {
    type: EventType.CHANGE_BOARD_PERSISTENCE_MODE;
    mode: BoardPersistenceMode;
}

export const changeBoardPersistenceModeEvent = (mode: BoardPersistenceMode): IChangeBoardPersistenceModeEvent => ({
    type: EventType.CHANGE_BOARD_PERSISTENCE_MODE,
    mode,
});
