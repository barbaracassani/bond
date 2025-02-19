import { Observable, Subject } from 'rxjs'
import {DepletingAction, ReplenishAction} from './animals.ts';

export const isSubject = (
    stream: Observable<DepletingAction | ReplenishAction> | Subject<void>
): stream is Subject<DepletingAction> => {
    return stream instanceof Subject
}
