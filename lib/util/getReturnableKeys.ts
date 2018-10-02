import { HOOK_TYPES } from '../constants';

export const getReturnableKeys = (instance: any, hookType: HOOK_TYPES) =>
  Object.getOwnPropertyNames(instance)
    .filter((key: any) => typeof instance[key] !== 'function')
    .reduce((accum: any, curr: any) => {
      accum[curr] = instance[curr];
      return accum;
    }, { webhookType: hookType });
