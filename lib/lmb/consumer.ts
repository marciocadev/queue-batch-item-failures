import { SQSEvent } from "aws-lambda"

export const handler = async (e: SQSEvent) => {
  const batchItemFailures = [];

  for (const record of e.Records) {
    try {
      console.log(record.body)
      if (record.body == "fail") {
        throw new Error("error")
      }
    } catch (error) {
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  console.log(JSON.stringify({ batchItemFailures }))
  return { batchItemFailures };
}