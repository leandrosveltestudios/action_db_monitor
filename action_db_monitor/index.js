const elastic = require("../elastic");
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
require("dotenv").config();

exports.handler = async () => {
  const query = {
    index: "action",
    type: "action_hero",
    body: {
      query: {
        match_all: {},
      },
    },
  };

  const credentials = {
    accessKeyId: process.env.EMAIL_AWS_ACCESS_KEYID,
    secretAccessKey: process.env.EMAIL_AWS_SECRET_ACCESS_KEY,
  };

  const sesClient = new SESv2Client({
    credentials,
    region: process.env.EMAIL_AWS_REGION,
  });

  let error;

  try {
    const action_hero = await elastic.search(query);

    if (action_hero.hits.total.value > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify("Lambda function completed."),
      };
    } else {
      error = {
        statusCode: 204,
        body: JSON.stringify("Database is not populated."),
      };

      return sendNotification(error);
    }
  } catch (error) {
    error = {
      statusCode: 500,
      body: JSON.stringify("Error querying Elasticsearch."),
    };

    return sendNotification(error);
  }

  async function sendNotification(error) {
    const sendEmailCommand = new SendEmailCommand({
      FromEmailAddress: "info@sveltestudios.com",
      Destination: {
        ToAddresses: ["info@sveltestudios.com"],
      },
      Content: {
        Simple: {
          Subject: {
            Data: `Lambda Function Failure - Status: ${error.statusCode}`,
          },
          Body: {
            Text: {
              Data: `Error querying Elasticsearch: ${error.body}`,
            },
          },
        },
      },
    });

    try {
      await sesClient.send(sendEmailCommand);
      console.log("Email sent.");
    } catch (emailError) {
      console.error(`Error sending email: ${emailError.body}`);
    }
  }
};
