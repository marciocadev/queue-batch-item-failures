import { SendMessageCommand, SendMessageCommandInput, SQSClient } from "@aws-sdk/client-sqs";

const client = new SQSClient({})

export const handler = async () => {
  let input: SendMessageCommandInput = {
    MessageBody: "hello",
    QueueUrl: process.env.QUEUE_URL
  }
  await client.send(new SendMessageCommand(input));

  input.MessageBody = "error"
  await client.send(new SendMessageCommand(input));

  input.MessageBody = "world"
  await client.send(new SendMessageCommand(input));
}