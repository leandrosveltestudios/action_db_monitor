const elastic_configs = {
  development: {
    host: [
      {
        host: "localhost",
        auth: "elastic:changeme",
        protocol: "http",
        port: 9200,
      },
    ],
    log: "error",
  },
  test: {
    host: [
      {
        host: "localhost",
        auth: "elastic:changeme",
        protocol: "http",
        port: 9200,
      },
    ],
    log: "error",
  },
  staging: {
    credentials: {
      accessKeyId: process.env.STAGING_AWS_ACCESS_KEYID,
      secretAccessKey: process.env.STAGING_AWS_SECRET_ACCESS_KEY,
    },
    aws: true,
    region: "ap-southeast-2",
    protocol: "https",
    host: "search-action-vkl2uipmrdrdxbtx7wrzdin7ci.ap-southeast-2.es.amazonaws.com",
  },
  production: {
    credentials: {
      accessKeyId: process.env.LIVE_AWS_ACCESS_KEYID,
      secretAccessKey: process.env.LIVE_AWS_SECRET_ACCESS_KEY,
    },
    aws: true,
    region: "ap-southeast-2",
    host:
      process.env.ELASTIC_HOST ||
      "search-action-vkl2uipmrdrdxbtx7wrzdin7ci.ap-southeast-2.es.amazonaws.com",
  },
};

module.exports = elastic_configs[process.env.NODE_ENV];
