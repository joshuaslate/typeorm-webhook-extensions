import { AfterUpdate, AfterInsert, AfterLoad, AfterRemove } from 'typeorm';
import { WebhookOptions } from '../../interfaces';
import { getReturnableKeys } from '../../util';
import { HOOK_TYPES } from '../../constants';
import client from '../..';

export function Webhook(options?: WebhookOptions) {
  return function (TargetClass: any): any {
    class TargetClassWithWebhooks extends TargetClass {
      @AfterUpdate()
      public async updateWebhook(): Promise<void> {
        if (options && options.sendOnUpdate) {
          let payload: object = getReturnableKeys(this, HOOK_TYPES.UPDATE);

          if (options.sendOnUpdate instanceof Function) {
            payload = await options.sendOnUpdate(this);
          }

          client.sendWebhook(payload, options);
        }
      }

      @AfterInsert()
      public async insertWebhook(): Promise<void> {
        if (options && options.sendOnInsert) {
          let payload: object = getReturnableKeys(this, HOOK_TYPES.INSERT);

          if (options.sendOnInsert instanceof Function) {
            payload = await options.sendOnInsert(this);
          }

          client.sendWebhook(payload, options);
        }
      }

      @AfterLoad()
      public async loadWebhook(): Promise<void> {
        if (options && options.sendOnLoad) {
          let payload: object = getReturnableKeys(this, HOOK_TYPES.LOAD);

          if (options.sendOnLoad instanceof Function) {
            payload = await options.sendOnLoad(this);
          }

          client.sendWebhook(payload, options);
        }
      }

      @AfterRemove()
      public async removeWebhook(): Promise<void> {
        if (options && options.sendOnRemove) {
          let payload: object = getReturnableKeys(this, HOOK_TYPES.REMOVE);

          if (options.sendOnRemove instanceof Function) {
            payload = await options.sendOnRemove(this);
          }

          client.sendWebhook(payload, options);
        }
      }
    }

    // Maintain the original name of the model class
    Object.defineProperty(TargetClassWithWebhooks, 'name', {
      value: TargetClass.name,
    });

    return TargetClassWithWebhooks;
  }
};
