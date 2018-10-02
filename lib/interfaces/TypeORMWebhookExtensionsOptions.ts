import { WebhookActionLogger, WebhookErrorHandler } from './';

export interface TypeORMWebhookExtensionsOptions {
  okStatuses?: number[];
  webhookEndpoint?: string;
  onError?: WebhookErrorHandler;
  onSuccess?: WebhookActionLogger;
};
