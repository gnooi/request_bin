// server/src/config/loadConfig.js
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');
const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');

const REGION = process.env.AWS_REGION || 'us-east-2';

const secretsClient = new SecretsManagerClient({ region: REGION });
const ssmClient = new SSMClient({ region: REGION });

async function getSecret(secretId) {
  const command = new GetSecretValueCommand({ SecretId: secretId });
  const response = await secretsClient.send(command);
  return JSON.parse(response.SecretString);
}

async function getParameters(names) {
  const command = new GetParametersCommand({
    Names: names,
    WithDecryption: false,
  });
  const response = await ssmClient.send(command);
  const values = {};
  for (const param of response.Parameters) {
    values[param.Name] = param.Value;
  }
  // Warn loudly if any requested parameter wasn't found — silent gaps here
  // turn into confusing "undefined" values in a connection string later.
  if (response.InvalidParameters && response.InvalidParameters.length > 0) {
    throw new Error(
      `Missing SSM parameters: ${response.InvalidParameters.join(', ')}`,
    );
  }
  return values;
}

async function loadConfig() {
  // Fetch both secrets in parallel
  const [pgSecret, mongoSecret] = await Promise.all([
    getSecret('postgres'),
    getSecret('mongodb'),
  ]);

  // Fetch all four parameters in one batch call
  const paramNames = [
    '/requestbin/postgres/host',
    '/requestbin/postgres/port',
    '/requestbin/mongo/host',
    '/requestbin/mongo/port',
  ];
  const params = await getParameters(paramNames);

  const pgHost = params['/requestbin/postgres/host'];
  const pgPort = params['/requestbin/postgres/port'];
  const mongoHost = params['/requestbin/mongo/host'];
  const mongoPort = params['/requestbin/mongo/port'];

  const DATABASE_URL =
    `postgresql://${pgSecret.username}:${pgSecret.password}` +
    `@${pgHost}:${pgPort}/${pgSecret.dbname}?uselibpqcompat=true&sslmode=require`;

  const MONGO_URI = mongoSecret.username
    ? `mongodb://${mongoSecret.username}:${mongoSecret.password}@${mongoHost}:${mongoPort}/requestbin`
    : `mongodb://${mongoHost}:${mongoPort}/requestbin`;

  return { DATABASE_URL, MONGO_URI };
}

module.exports = { loadConfig };
