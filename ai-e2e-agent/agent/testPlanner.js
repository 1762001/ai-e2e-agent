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

  if (!plan || !plan.tests) {
    throw new Error('Failed to parse AI test plan JSON');
  }

  // 🔥 Attach discovered routes to route tests
  const routes = memory.appMap.routes;

  plan.tests = plan.tests.map((test, index) => {
    if (test.target === 'route' && routes.length > 0) {
      test.route = routes[index % routes.length];
    }
    return test;
  });

  memory.storeTestPlan(plan);
  return plan;
}

module.exports = { generateTestPlan };
