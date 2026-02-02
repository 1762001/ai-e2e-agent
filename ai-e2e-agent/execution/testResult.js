class TestResult {
  constructor(test) {
    this.id = test.id;
    this.type = test.type;
    this.target = test.target;
    this.description = test.description;
    this.priority = test.priority;
    this.status = 'PENDING';
    this.error = null;
    this.screenshot = null;
    this.timestamp = new Date().toISOString();
  }

  pass() {
    this.status = 'PASS';
  }

  fail(error, screenshot) {
    this.status = 'FAIL';
    this.error = error;
    this.screenshot = screenshot;
  }
}

module.exports = TestResult;
