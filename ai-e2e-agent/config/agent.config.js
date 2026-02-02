module.exports = {
  app: {
    baseUrl: 'http://localhost:4200',
    name: 'Angular-SpringBoot-App'
  },

  gcp: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
  },

  auth: {
    tokenType: 'Bearer',
    accessToken: process.env.AI_TEST_TOKEN
  },

  puppeteer: {
    headless: false,
    slowMo: 40,
    defaultTimeout: 30000
  },

  screenshots: {
    path: './screenshots'
  }
};
