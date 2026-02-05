const { reason } = require('./adkClient');
const memory = require('./memory');
const testDesignPrompt = require('./prompts/test-design.prompt');
const { extractJSON } = require('./utils/jsonExtractor');

async function generateTestPlan() {

  if (!memory.appMap) {
    throw new Error('AppMap missing');
  }

  const prompt =
    testDesignPrompt(memory.appMap);

  const response = await reason(prompt);

  let plan = extractJSON(response);

  if (!plan || !plan.tests) {
    throw new Error('Invalid AI test plan');
  }

  const routes = memory.appMap.routes;
  const workflows = memory.appMap.workflows;

  // Attach routes & workflows
  plan.tests = plan.tests.map((test, i) => {

    if (test.target === 'route' && routes.length) {
      test.route = routes[i % routes.length];
    }

    if (workflows.length) {
      test.workflow =
        workflows[i % workflows.length];
    }

    return test;
  });

  memory.storeTestPlan(plan);

  return plan;
}

module.exports = { generateTestPlan };
