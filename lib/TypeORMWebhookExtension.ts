import fetch, { Response } from 'node-fetch';
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

  public async sendWebhook(payload: object, modelOptions?: WebhookOptions): Promise<any> {
    const webhookEndpointOpt = (modelOptions && modelOptions.webhookEndpoint) || this.options.webhookEndpoint;
    const okStatuses = (modelOptions && modelOptions.okStatuses) || this.options.okStatuses;
    const onError = (modelOptions && modelOptions.onError) || this.options.onError;
    const onSuccess = (modelOptions && modelOptions.onSuccess) || this.options.onSuccess;
    let webhookEndpoints;

    if (!webhookEndpointOpt) {
      throw new Error('Missing webhook endpoint(s).');
    }

    if (webhookEndpointOpt instanceof Function) {
      const computedWebhookEndpoint = await webhookEndpointOpt(payload);
      webhookEndpoints = Array.isArray(computedWebhookEndpoint)
        ? computedWebhookEndpoint
        : [computedWebhookEndpoint];
    } else {
      webhookEndpoints = Array.isArray(webhookEndpointOpt)
        ? webhookEndpointOpt
        : [webhookEndpointOpt];
    }

    const webhookPromises: Promise<any>[] = [];
    webhookEndpoints.forEach(webhookEndpoint => {
      webhookPromises.push(fetch(webhookEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then((response: any) => {
        // If the status is acceptable, return true
        if (okStatuses && okStatuses.indexOf(response.status) > -1) {
          if (onSuccess) {
            return response.json().then((resBody: any) => onSuccess(webhookEndpoint, response.status, resBody));
          }

          return true;
        }

        throw new Error(`Webhook sent to ${webhookEndpoint} received unexpected status: ${response.status}.`);
      })
      .catch((error: any) => {
        if (onError) {
          return onError(error);
        }
      }));
    });

    await Promise.all(webhookPromises);
  };
}
