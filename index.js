const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { Service, Entity } = require('electrodb');

async function main() {
  await createDynamoTable();

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

const User = new Entity({
  model: {
    entity: 'user',
    version: '1',
    service: 'app',
  },
  attributes: {
    id: { type: 'string', required: true, readOnly: true },
    name: { type: 'string' },
  },
  indexes: {
    byId: {
      pk: { field: 'pk', composite: ['id'] },
      sk: { field: 'sk', composite: [] },
    },
  },
});

const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://dynamodb-local:8000',
  credentials: {
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
  },
});

const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);

const db = new Service({ User }, { table: 'single-table', client: dynamoDocumentClient });

async function createDynamoTable() {
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
}

main().catch(console.error);
