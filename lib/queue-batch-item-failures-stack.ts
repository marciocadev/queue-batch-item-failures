import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class QueueBatchItemFailuresStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dlq = new Queue(this, "dlq")
    const queue = new Queue(this, "queue", {
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 1
      }
    })

    const producer = new NodejsFunction(this, "producer", {
      entry: join(__dirname, "lmb", "producer.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X
    })
    queue.grantSendMessages(producer)

    const consumer = new NodejsFunction(this, "consumer", {
      entry: join(__dirname, "lmb", "consumer.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X
    })
    queue.grantConsumeMessages(consumer)
    consumer.addEventSource(
      new SqsEventSource(queue, {
        reportBatchItemFailures: true
      })
    )
  }
}
