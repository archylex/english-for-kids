export default class Menu {
  constructor() {
    this.menu = document.createElement('div');
    this.menu.classList.add('menu');
    this.isShow = false;
    this.tintScreen = document.createElement('div');
    this.tintScreen.classList.add('tint__screen');
    this.loadCategories();
    this.tintScreen.addEventListener('click', this.hide.bind(this));
  }

  createMenu(res) {
    let txt = `<ul>
                    <a href="#home"><li>
                       <div class="menu-icon"><img src="assets/images/home.png" alt="icon"></div>
                       home
                     </li></a>
                   `;

    res.forEach((item) => {
      txt += `            
              <a href="#cards?category=${item.category}"><li>
                <div class="menu-icon"><img src="assets/images/${item.icon}" alt="icon"></div>
                ${item.category.replace('_', ' ')}
              </li></a>            
            `;
    });

    txt += `<a href="#stats"><li>
                    <div class="menu-icon"><img src="assets/images/app_stats.png" alt="icon"></div>
                        statistics
                </li></a></ul>`;

    this.menu.innerHTML = txt;
    document.body.appendChild(this.menu);

    this.links = document.querySelectorAll('a');
    this.links.forEach((link) => link.addEventListener('click', this.hide.bind(this)));
  }

  async loadCategories() {
    const response = await fetch('assets/cards.json')
      .then((res) => res.json())
      .then((data) => data);
    this.createMenu(response);
  }

  show() {
    const menuButton = document.querySelector('.nav-icon');
    menuButton.classList.add('nav-icon-hover');
    this.isShow = true;
    document.body.appendChild(this.tintScreen);
    this.menu.classList.add('menu-show');
  }

  hide() {
    const menuButton = document.querySelector('.nav-icon');
    menuButton.classList.remove('nav-icon-hover');
    this.isShow = false;
    document.body.removeChild(this.tintScreen);
    this.menu.classList.remove('menu-show');
  }
}
