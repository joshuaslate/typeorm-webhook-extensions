export interface WebhookEndpointBuilder {
  (modelInstance: object): Promise<string | string[]>;
};
