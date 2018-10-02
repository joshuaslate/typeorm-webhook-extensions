import { WebhookActionLogger, WebhookErrorHandler, WebhookFormatter } from './';

export interface WebhookOptions {
  sendOnLoad?: boolean | WebhookFormatter;
  sendOnUpdate?: boolean | WebhookFormatter;
  sendOnRemove?: boolean | WebhookFormatter;
  sendOnInsert?: boolean | WebhookFormatter;
  webhookEndpoint?: string;
  okStatuses?: number[];
  onError?: WebhookErrorHandler;
  onSuccess?: WebhookActionLogger;
};
