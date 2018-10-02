import fetch from 'node-fetch';
import { TypeORMWebhookExtensionsOptions, WebhookOptions } from './interfaces';

export default class TypeORMWebhookExtensions {
  public options: TypeORMWebhookExtensionsOptions = {
    okStatuses: [200],
  };

  public updateOptions(options: TypeORMWebhookExtensionsOptions) {
    this.options = {
      ...this.options,
      ...options,
    };
  };

  public async sendWebhook(payload: object, modelOptions?: WebhookOptions): Promise<boolean> {
    const webhookEndpoint = (modelOptions && modelOptions.webhookEndpoint) || this.options.webhookEndpoint;
    const okStatuses = (modelOptions && modelOptions.okStatuses) || this.options.okStatuses;
    const onError = (modelOptions && modelOptions.onError) || this.options.onError;
    const onSuccess = (modelOptions && modelOptions.onSuccess) || this.options.onSuccess;

      if (!webhookEndpoint) {
        throw new Error('Missing webhook endpoint.');
      }

      try {
        const response = await fetch(webhookEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        // If the status is acceptable, return true
        if (okStatuses && okStatuses.indexOf(response.status) > -1) {
          if (onSuccess) {
            const resBody = await response.json();
            await onSuccess(webhookEndpoint, response.status, resBody);
          }

          return true;
        }

        throw new Error(`Webhook sent to ${webhookEndpoint} received unexpected status: ${response.status}.`);
      } catch (error) {
        if (onError) {
          await onError(error);
        }

        return false;
      }
  };
}
