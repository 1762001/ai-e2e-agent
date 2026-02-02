const { reason } = require('./adkClient');
const memory = require('./memory');
const testDesignPrompt = require('./prompts/test-design.prompt');

async function generateTestPlan() {
  if (!memory.appMap) {
    throw new Error('AppMap missing. Run discovery first.');
  }

  const prompt = testDesignPrompt(memory.appMap);
  const response = await reason(prompt);

  let plan;
  try {
    plan = JSON.parse(response);
  } catch (err) {
    throw new Error('Failed to parse AI test plan JSON');
  }

  memory.storeTestPlan(plan);
  return plan;
}

module.exports = { generateTestPlan };
