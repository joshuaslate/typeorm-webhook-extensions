import { WebhookActionLogger, WebhookEndpointBuilder, WebhookErrorHandler } from './';

export interface TypeORMWebhookExtensionsOptions {
  okStatuses?: number[];
  webhookEndpoint?: string | string[] | WebhookEndpointBuilder;
  onError?: WebhookErrorHandler;
  onSuccess?: WebhookActionLogger;
};
