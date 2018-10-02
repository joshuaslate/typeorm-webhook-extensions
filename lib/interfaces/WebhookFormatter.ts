export interface WebhookFormatter {
  (modelInstance: object): Promise<object>;
};
