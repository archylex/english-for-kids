import Router from './Router/Router';
import Route from './Router/Route';
import Menu from './Menu';
import CardPage from './CardPage';
import Statistic from './Statistic';

const statsPage = new Statistic();
const cardPage = new CardPage();
const container = document.querySelector('.container');
cardPage.htmlContainer = container;
cardPage.correctCallback = statsPage.addCorrect.bind(statsPage);
cardPage.wrongCallback = statsPage.addWrong.bind(statsPage);
cardPage.trainsCallback = statsPage.addTrains.bind(statsPage);

const routes = [
  new Route('home', 'home.html', true),
  new Route('cards', cardPage.loadCards.bind(cardPage)),
  new Route('stats', statsPage.loadPage.bind(statsPage)),
  new Route('statistic', 'statistic.html'),
  new Route('win', 'win.html'),
  new Route('lose', 'lose.html'),
];

const router = new Router(routes);
router.start();

const trainSwitch = document.querySelector('#train_switch');
trainSwitch.checked = true;
trainSwitch.addEventListener('click', () => {
  cardPage.toggleGameMode();
});

const menuButton = document.querySelector('.nav-icon');
const menu = new Menu();
menuButton.addEventListener('click', () => {
  if (menu.isShow) {
    menu.hide();
  } else {
    menu.show();
  }
});
