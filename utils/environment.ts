import { DEV_ENV, PROD_ENV } from './constants';
export enum Environment {
    DEV = DEV_ENV,
    PROD = PROD_ENV,
}

export function isEnv(env: Environment): boolean {
    return process.env.NODE_ENV === env;
}
