const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { db, dynamoClient } = require('./db/db.js');

async function main() {
  try {
    await dynamoClient.send(
      new CreateTableCommand({
        TableName: 'single-table',
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          { AttributeName: 'pk', AttributeType: 'S' },
          { AttributeName: 'sk', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'pk', KeyType: 'HASH' },
          { AttributeName: 'sk', KeyType: 'RANGE' },
        ],
      }),
    );
  } catch {}

  await db.entities.User.put({ id: '1' }).go();

  const queryWithAttributes = await db.entities.User.query
    .byId({ id: '1' })
    .go({ attributes: ['name'] });

  const queryWithoutAttributes = await db.entities.User.query.byId({ id: '1' }).go();

  const getWithAttributes = await db.entities.User.get({ id: '1' }).go({ attributes: ['name'] });

  const getWithoutAttributes = await db.entities.User.get({ id: '1' }).go();

  console.log(
    JSON.stringify(
      { queryWithAttributes, queryWithoutAttributes, getWithAttributes, getWithoutAttributes },
      null,
      2,
    ),
  );
}

main();
