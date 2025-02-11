import {interval} from 'rxjs';

const TIME_TICK = 3000;

export const tick$  = interval(TIME_TICK);

