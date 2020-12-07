export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.container = document.querySelector('.container');
    this.footer = document.querySelector('footer');
  }

  start() {
    window.addEventListener('hashchange', () => {
      this.hasChanged(this, this.routes);
    });

    this.hasChanged(this, this.routes);
  }

  hasChanged() {
    if (window.location.hash.length > 0) {
      for (let i = 0; i < this.routes.length; i++) {
        const route = this.routes[i];
        if (route.isActiveRoute(window.location.hash)) {
          this.goToRoute(route.html, route.getParams(window.location.hash));
          break;
        }
      }
    } else {
      for (let i = 0; i < this.routes.length; i++) {
        const route = this.routes[i];
        if (route.default) {
          this.goToRoute(route.html);
          break;
        }
      }
    }
  }

  clearContainer() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.lastChild);
    }
  }

  showContainer() {
    this.footer.classList.remove('container-hide'); 
    this.container.classList.remove('container-hide');
  }

  hideContainer() {
    this.footer.classList.add('container-hide');
    this.container.classList.add('container-hide');
  }

  toRoute(html, params) {
    this.clearContainer();

    if (typeof html === 'function') {
      html(params);
    } else {
      const url = `views/${html}`;
      fetch(url)
        .then((res) => res.text())
        .then((data) => this.container.innerHTML = data);              
    }

    this.showContainer();
  }

  goToRoute(html, params) {    
    this.hideContainer();
    setTimeout((() => {
      this.toRoute(html, params);
    }).bind(this), 500);
  }
}
