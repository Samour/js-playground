import { EventType } from 'futoshiki/events/EventType';

export interface IChangeGameSizeEvent {
    type: EventType.CHANGE_GAME_SIZE;
    gameSize: number;
}

export const changeGameSizeEvent = (gameSize: number): IChangeGameSizeEvent => ({
    type: EventType.CHANGE_GAME_SIZE,
    gameSize,
});
