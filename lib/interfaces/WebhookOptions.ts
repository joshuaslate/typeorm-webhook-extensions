import { WebhookActionLogger, WebhookEndpointBuilder, WebhookErrorHandler, WebhookFormatter } from './';

export interface WebhookOptions {
  sendOnLoad?: boolean | WebhookFormatter;
  sendOnUpdate?: boolean | WebhookFormatter;
  sendOnRemove?: boolean | WebhookFormatter;
  sendOnInsert?: boolean | WebhookFormatter;
  webhookEndpoint?: string | string[] | WebhookEndpointBuilder;
  okStatuses?: number[];
  onError?: WebhookErrorHandler;
  onSuccess?: WebhookActionLogger;
};
