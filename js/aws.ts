// https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html#http-api-dynamo-db-create-table
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "quotes";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "DELETE /items/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /items/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = body.Item;
        break;
      case "GET /items":
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: requestJSON.id,
              author: requestJSON.author,
              song: requestJSON.song,
            },
          })
        );
        body = `Put item ${requestJSON.id}`;
        break;
      case "PATCH /items/{id}":
        let updateJSON = JSON.parse(event.body);
        await dynamo.send(
          new UpdateCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
            UpdateExpression: "set speaker = :speaker, text = :text",
            ExpressionAttributeValues: {
              ":speaker": updateJSON.speaker,
              ":text": updateJSON.text,
            },
            ReturnValues: "ALL_NEW",
          })
        );
        body = `Updated item ${event.pathParameters.id}`;
        break;
      case "GET /items/search":
        const queryParams = event.queryStringParameters || {};
        if (!queryParams.speaker) {
          throw new Error("Missing 'speaker' query parameter");
        }
        body = await dynamo.send(
          new ScanCommand({
            TableName: tableName,
            FilterExpression: "speaker = :speaker",
            ExpressionAttributeValues: {
              ":speaker": queryParams.speaker,
            },
          })
        );
        body = body.Items;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};