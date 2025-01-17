const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { Service } = require('electrodb');
const entities = require('./entities');

const ENDPOINT = 'http://dynamodb-local:8000';

const CREDENTIALS = {
  accessKeyId: 'DUMMYIDEXAMPLE',
  secretAccessKey: 'DUMMYEXAMPLEKEY',
};

const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: ENDPOINT,
  credentials: CREDENTIALS,
});

const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);

const db = new Service(entities, { table: 'single-table', client: dynamoDocumentClient });

module.exports = {
  db,
  dynamoDocumentClient,
  dynamoClient,
};
