# TypeORM Webhook Extensions
Simply add webhooks to your TypeORM entities. Send events to a webhook-configured endpoint(s) after a TypeORM entity is loaded, removed, updated, or inserted.

## Usage

### Installation
```bash
npm install --save typeorm-webhook-extensions
```

or 

```bash
yarn add typeorm-webhook-extensions
```

### Decorate TypeORM Models with @Webhook
```ts
import { Entity } from 'typeorm';
import webhookExtension, { Webhook } from 'typeorm-webhook-extensions';

@Entity('users')
@Webhook({
  sendOnInsert: true,
  sendOnLoad: true,
  sendOnRemove: true,
  sendOnUpdate: true,
  onSuccess: mockOnSuccess,
  onError: mockOnError,
})
class User {
  @PrimaryGeneratedColumn()
  public id: number = 0;

  @Column()
  public username: string = '';

  @Column()
  public password: string = '';
}
```

The `@Webhook` decorator takes arguments that match the `WebhookOptions` interface:
```ts
interface WebhookOptions {
  sendOnLoad?: boolean | WebhookFormatter;
  sendOnUpdate?: boolean | WebhookFormatter;
  sendOnRemove?: boolean | WebhookFormatter;
  sendOnInsert?: boolean | WebhookFormatter;
  webhookEndpoint?: string;
  okStatuses?: number[];
  onError?: WebhookErrorHandler;
  onSuccess?: WebhookActionLogger;
};
```

If true is passed to `sendOnLoad`, `sendOnUpdate`, `sendOnRemove`, or `sendOnInsert`, a payload containing the non-function properties from your entity along with webhookType will be sent to your specified webhook. Optionally, you may pass a `WebhookFormatter` function in for any of these options. The `WebhookFormatter` receives the instance of the entity as its sole argument. For example, this would exclude the (hopefully hashed) password from being sent to the webhook endpoint:

```ts
...
@Webhook({
  sendOnLoad: (entity => ({
    event_type: 'load',
    resource: 'user',
    username: entity.username,
  })),
})
```

### Change Global Options
Some options can be configured globally for all decorated TypeORM entities. Here is an example of how you can change these options:
```ts
// Import as above
webhookExtension.setOptions(<TypeORMWebhookExtensionsOptions> {
  okStatuses: [200, 201], // HTTP status codes that signify the webhook server successfully received the event
  webhookEndpoint: 'https://localhost/api/webhook', // The URL to send webhook events to
  onError: (error) => { console.log(error); }, // A callback to run in the event that the webhook event does not successfully send
  onSuccess: (endpoint, status, payload) => { console.log(endpoint, status, payload )}, // A callback to run in the event that the webhook event successfully sends
});
```

### TypeScript Configuration
```ts
{
  "target": "es2015", // at least
  "experimentalDecorators": true
}
```

## Note
Be sure to set up a webhookEndpoint, either on the default export singleton or in the webhook decorator's options.

## Contribution
Feel free to contribute by forking this repository, making, testing, and building your changes, then opening a pull request. Please try to maintain a uniform code style.

