import { Column, Entity, getConnection, getRepository, PrimaryGeneratedColumn } from 'typeorm';
import { initializeTestDB, deletableUser, updatableUser, loadableUser } from '../../test-setup/database';
import { Webhook } from '../../../lib/decorators';
import { HOOK_TYPES } from '../../../lib/constants';
import { testWebhookEndpoint } from '../../test-setup';

const checkWebhook = (mock: jest.Mock, expectedCalls: number = 1, maxTime: number = 5000): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let time = 0;

    const timer = setInterval(() => {
      if (mock.mock.calls.length >= expectedCalls) {
        clearInterval(timer);
        return resolve(mock.mock.calls);
      }

      if (time >= maxTime) {
        clearInterval(timer);
        return reject('Timed out when verifying webhook');
      }

      time += interval;
    }, interval);
  });
};

const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

@Entity('user_webhook_class_decorator_test')
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

describe('Class Webhook Decorator', () => {
  beforeAll(async () => {
    await initializeTestDB(User);
  });

  beforeEach(() => {
    mockOnSuccess.mockClear();
    mockOnError.mockClear();
  });

  it('should send a webhook after a row is inserted', async () => {
    const UserRepository = getRepository(User);
    const user = UserRepository.create();
    user.username = 'Yoda';
    user.password = 'Jedi';

    await UserRepository.insert(user);
    const mockOutput = await checkWebhook(mockOnSuccess);
    const [ outputWebhookEndpoint, receivedStatus, payload ] = mockOutput[0] as any[];

    expect(outputWebhookEndpoint).toBe(testWebhookEndpoint);
    expect(receivedStatus).toBe(200);
    expect(payload).toMatchObject({
      password: user.password,
      username: user.username,
      webhookType: HOOK_TYPES.INSERT,
    });
  });

  it('should send a webhook after a row is deleted', async () => {
    const UserRepository = getRepository(User);
    const user = await UserRepository.findOne({ where: { username: deletableUser.username } });

    if (!user) {
      throw new Error('No user found for delete webhook');
    }

    await UserRepository.remove(user);
    const mockOutput = await checkWebhook(mockOnSuccess, 2);
    const targetOutput = mockOutput.find(arr => arr[2].webhookType === HOOK_TYPES.REMOVE);
    const [outputWebhookEndpoint, receivedStatus, payload] = targetOutput as any[];

    expect(outputWebhookEndpoint).toBe(testWebhookEndpoint);
    expect(receivedStatus).toBe(200);
    expect(payload).toMatchObject({
      password: user.password,
      username: user.username,
      webhookType: HOOK_TYPES.REMOVE,
    });
  });

  it('should send a webhook after a row is deleted', async () => {
    const UserRepository = getRepository(User);
    const user = await UserRepository.findOne({ where: { username: updatableUser.username } });

    if (!user) {
      throw new Error('No user found for update webhook');
    }

    user.password = 'newPassword';

    await UserRepository.save(user);
    const mockOutput = await checkWebhook(mockOnSuccess, 2);
    const targetOutput = mockOutput.find(arr => arr[2].webhookType === HOOK_TYPES.UPDATE);
    const [outputWebhookEndpoint, receivedStatus, payload] = targetOutput as any[];

    expect(outputWebhookEndpoint).toBe(testWebhookEndpoint);
    expect(receivedStatus).toBe(200);
    expect(payload).toMatchObject({
      password: user.password,
      username: user.username,
      webhookType: HOOK_TYPES.UPDATE,
    });
  });

  it('should send a webhook after a row is loaded', async () => {
    const UserRepository = getRepository(User);
    const user = await UserRepository.findOne({ where: { username: loadableUser.username } });

    if (!user) {
      throw new Error('No user found for load webhook');
    }

    const mockOutput = await checkWebhook(mockOnSuccess);
    const [outputWebhookEndpoint, receivedStatus, payload] = mockOutput[0] as any[];

    expect(outputWebhookEndpoint).toBe(testWebhookEndpoint);
    expect(receivedStatus).toBe(200);
    expect(payload).toMatchObject({
      password: user.password,
      username: user.username,
      webhookType: HOOK_TYPES.LOAD,
    });
  });

  afterAll(() => {
    getConnection().close();
  });
});