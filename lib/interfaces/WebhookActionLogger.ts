export interface WebhookActionLogger {
  (endpoint: string, status: number, payload: string): Promise<void> | void;
};
