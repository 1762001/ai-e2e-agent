const { reason } = require('./adkClient');
const memory = require('./memory');
const testDesignPrompt = require('./prompts/test-design.prompt');
const { extractJSON } = require('./utils/jsonExtractor');

async function generateTestPlan() {
  if (!memory.appMap) {
    throw new Error('AppMap missing. Run discovery first.');
  }

  const prompt = testDesignPrompt(memory.appMap);
  const responseText = await reason(prompt);

  let plan = extractJSON(responseText);

  // Retry once with stronger instruction
  if (!plan) {
    console.warn('⚠️ First JSON parse failed. Retrying with strict prompt...');

    const strictPrompt = `
Return ONLY valid JSON.
No markdown.
No explanation.
No comments.

${prompt}
    `;

    const retryText = await reason(strictPrompt);
    plan = extractJSON(retryText);
  }

  if (!plan || !plan.tests) {
    throw new Error('Failed to parse AI test plan JSON');
  }

  memory.storeTestPlan(plan);
  return plan;
}

module.exports = { generateTestPlan };
