class AppMap {

  constructor() {
    this.routes = [];
    this.apis = [];
    this.workflows = [];
  }

  addRoutes(routes) {
    this.routes.push(...routes);
  }

  addApis(apis) {
    this.apis.push(...apis);
  }

  addWorkflows(flows) {
    this.workflows.push(...flows);
  }

  summary() {
    return {
      totalRoutes: this.routes.length,
      totalApis: this.apis.length,
      totalWorkflows: this.workflows.length
    };
  }
}

module.exports = AppMap;
