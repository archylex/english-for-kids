export default class Route {
  constructor(name, html, defaultRoute) {
    this.name = name;
    this.html = html;
    this.default = defaultRoute;
  }

  isActiveRoute(hashedPath) {
    const startIdx = hashedPath.indexOf('#') + 1;
    let endIdx = hashedPath.indexOf('?') - 1;
    endIdx = endIdx < 0 ? hashedPath.length : endIdx;
    const page = hashedPath.substr(startIdx, endIdx);
    return page === this.name;
  }

  getParams(hashedPath) {
    if (hashedPath.indexOf('?') !== -1) {
      const paramsLine = hashedPath.split('?')[1];
      const params = paramsLine.split('&');
      const result = {};
      params.forEach((p) => {
        const [key, value] = p.split('=');
        result[key] = value;
      });
      return result;
    } return {};
  }
}
