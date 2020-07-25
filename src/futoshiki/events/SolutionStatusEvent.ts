import { ResultStatus } from 'futoshiki/model/Result';
import { EventType } from 'futoshiki/events/EventType';

export interface ISolutionStatusEvent {
    type: EventType.SOLUTION_STATUS;
    resultStatus: ResultStatus | null;
}

export const solutionStatusEvent = (resultStatus: ResultStatus | null): ISolutionStatusEvent => ({
    type: EventType.SOLUTION_STATUS,
    resultStatus,
});
