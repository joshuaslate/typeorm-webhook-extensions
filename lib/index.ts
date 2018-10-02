import TypeORMWebhookExtensions from './TypeORMWebhookExtension';
export * from './decorators';
export * from './interfaces';

// Export a singleton so global settings for webhook endpoints, OK statuses, etc. can be shared.
export default new TypeORMWebhookExtensions();
