import {interval} from 'rxjs';

const TIME_TICK = 3000;

export const BASE_DECAY_PER_INTERVAL = 5;
export const BASE_REPLENISH = 15

export const tick$  = interval(TIME_TICK);

