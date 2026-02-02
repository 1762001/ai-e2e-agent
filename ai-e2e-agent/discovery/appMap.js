class AppMap {
  constructor() {
    this.routes = [];
    this.apis = [];
  }

  addRoutes(routes) {
    this.routes.push(...routes);
  }

  addApis(apis) {
    this.apis.push(...apis);
  }

  summary() {
    return {
      totalRoutes: this.routes.length,
      totalApis: this.apis.length
    };
  }
}

module.exports = AppMap;
