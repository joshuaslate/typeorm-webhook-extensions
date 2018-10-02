export interface WebhookErrorHandler {
  (error: any): Promise<void> | void;
};
