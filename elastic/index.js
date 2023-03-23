const elasticsearch = require("elasticsearch");
const AwsElastic = require("aws-elasticsearch-client");
const config = require("./config");

let client;

console.log("PROCESS.ENV.NODE_ENV", process.env.NODE_ENV);
if (
  process.env.NODE_ENV === "staging" ||
  process.env.NODE_ENV === "production"
) {
  console.log("ELASTICSEARCH CONFIG for AWS", config);
  client = AwsElastic(config);
} else {
  console.log("ELASTICSEARCH CONFIG for Elasticsearch", config);
  client = new elasticsearch.Client(JSON.parse(JSON.stringify(config)));
}

module.exports = client;
