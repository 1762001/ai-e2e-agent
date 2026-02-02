class AgentMemory {
  constructor() {
    this.appMap = null;
    this.testPlan = null;
  }

  storeAppMap(map) {
    this.appMap = map;
  }

  storeTestPlan(plan) {
    this.testPlan = plan;
  }
}

module.exports = new AgentMemory();
