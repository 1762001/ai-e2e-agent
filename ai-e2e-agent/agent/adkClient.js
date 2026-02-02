const { VertexAI } = require('@google-cloud/vertexai');
const config = require('../config/agent.config');

const vertexAI = new VertexAI({
  project: config.gcp.projectId,
  location: config.gcp.location
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-pro'
});

async function reason(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { reason };
