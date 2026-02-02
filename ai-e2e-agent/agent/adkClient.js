const { VertexAI } = require('@google-cloud/vertexai');
const config = require('../config/agent.config');

const vertexAI = new VertexAI({
  project: config.gcp.projectId,
  location: config.gcp.location
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-pro'
});

async function reason(prompt) {
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ]
  });

  const candidates = result.response.candidates;

  if (!candidates || candidates.length === 0) {
    throw new Error('No candidates returned from Google ADK');
  }

  const parts = candidates[0].content.parts;

  if (!parts || parts.length === 0) {
    throw new Error('No text parts returned from Google ADK');
  }

  return parts[0].text;
}

module.exports = { reason };
