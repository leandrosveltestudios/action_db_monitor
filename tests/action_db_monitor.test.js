const { handler } = require("../action_db_monitor");
const elastic = require("../elastic");
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

jest.mock("../elastic");
jest.mock("@aws-sdk/client-sesv2");

describe("handler function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  it("should send email on database not populated", async () => {
    const action_hero = {
      hits: {
        total: {
          value: 0,
        },
      },
    };

    elastic.search.mockResolvedValueOnce(action_hero);

    const sendMock = jest.fn();
    SESv2Client.prototype.send = sendMock;

    await handler();

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(expect.any(SendEmailCommand));
  });

  it("should return success on database populated", async () => {
    const action_hero = {
      hits: {
        total: {
          value: 1,
        },
      },
    };

    elastic.search.mockResolvedValueOnce(action_hero);

    const sendMock = jest.fn();
    SESv2Client.prototype.send = sendMock;

    const result = await handler();

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify("Lambda function completed."));
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("should send email on error querying Elasticsearch", async () => {
    const searchError = new Error("Error querying Elasticsearch");
    elastic.search.mockRejectedValueOnce(searchError);

    const sendMock = jest.fn();
    SESv2Client.prototype.send = sendMock;

    await handler();

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(expect.any(SendEmailCommand));
  });

  it("should console error if email fails to send", async () => {
    const action_hero = {
      hits: {
        total: {
          value: 0,
        },
      },
    };

    elastic.search.mockResolvedValueOnce(action_hero);

    const sendError = new Error("Error sending email");
    SESv2Client.prototype.send.mockRejectedValueOnce(sendError);

    await handler();

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error sending email: ${sendError.body}`
    );
  });
});
