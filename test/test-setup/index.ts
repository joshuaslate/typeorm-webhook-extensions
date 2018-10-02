import { Server } from 'http';
import app from './server';
import client from '../../lib';

let server: Server;
export const testWebhookEndpoint = 'http://localhost:8080';

beforeAll(done => {
  client.updateOptions({ webhookEndpoint: testWebhookEndpoint });

  server = app.listen(8080, async () => {
    done();
  });
});

afterAll(() => {
  server.close();
});
