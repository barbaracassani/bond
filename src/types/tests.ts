import { Observable, Subject } from 'rxjs'

export const isSubject = (
    stream: Observable<number> | Subject<void>
): stream is Subject<void> => {
    return stream instanceof Subject
}
