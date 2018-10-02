import { createConnection } from 'typeorm';

export const deletableUser = {
  username: 'deleteme',
  password: '1234',
};

export const updatableUser = {
  username: 'updateme',
  password: '1234'
};

export const loadableUser = {
  username: 'loadme',
  password: '1234'
};

export const initializeTestDB = async (UserEntity: any) => {
  // Connect to the test database
  const connection = await createConnection({
    type: 'sqlite',
    database: './typeorm-webhook-extensions_test_db.sql',
    dropSchema: true,
    synchronize: true,
    entities: [UserEntity]
  });

  // Seed user data
  await connection
    .createQueryBuilder()
    .insert()
    .into(UserEntity)
    .values([
      deletableUser,
      updatableUser,
      loadableUser,
    ]).execute();

    return connection;
}
