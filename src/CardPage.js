import Card from './Card';

export default class CardPage {
  constructor() {
    this.htmlPage = document.createElement('div');
    this.htmlPage.classList.add('cards__page');
    this.htmlPage.innerHTML = `
            <div class="nav__bar">
                <div class="star__bar"></div>
                <button class="start__game__button">start</button>
            </div>
            <div class="cards__box"></div>
        `;
    this.startButton = this.htmlPage.querySelector('.start__game__button');
    this.htmlStarBar = this.htmlPage.querySelector('.star__bar');
    this.htmlCardBox = this.htmlPage.querySelector('.cards__box');
    this.gameOverAudio = new Audio('assets/audio/game_over.mp3');
    this.winAudio = new Audio('assets/audio/win.mp3');
    this.wrongAudio = new Audio('assets/audio/wrong.mp3');
    this.correctAudio = new Audio('assets/audio/correct.mp3');
    this.htmlContainer = null;
    this.correctCallback = null;
    this.wrongCallback = null;
    this.trainsCallback = null;
    this.gameMode = false;
    this.isHasWrong = false;
    this.cards = [];
    this.gameCards = [];

    this.startButton.onclick = this.startGame.bind(this);
  }

  appendTo(parent) {
    parent.appendChild(this.htmlPage);
  }

  createCards(data) {
    data.words.forEach((word) => {
      const card = new Card(word.eng, word.rus, data.category, word.pic, word.audio, data.color, data.subcolor);
      card.appendTo(this.htmlCardBox);
      this.cards.push(card);

      if (this.gameMode) {
        card.toggleMode();
        card.setCallback(this.checkAnswer.bind(this));
      } else {
        card.setCallback(this.trainsCallback.bind(this));
      }
    });

    if (this.htmlContainer) {
      this.appendTo(this.htmlContainer);
    }
  }

  reset() {
    this.htmlStarBar.innerHTML = '';
    this.isHasWrong = false;
    this.gameCards = [];
    this.startButton.textContent = 'start';
  }

  clearPage() {
    this.htmlContainer.innerHTML = '';
    this.htmlCardBox.innerHTML = '';
    this.htmlStarBar.innerHTML = '';
    this.cards = [];
  }

  toggleGameMode() {
    this.gameMode = !this.gameMode;

    if (this.gameMode) {
      this.startButton.classList.add('start__game__button-show');
      this.startButton.disabled = false;
      this.cards.forEach((card) => {
        card.toggleMode();
        card.setCallback(this.checkAnswer.bind(this));
      });
    } else {
      this.startButton.classList.remove('start__game__button-show');
      this.startButton.disabled = true;
      this.cards.forEach((card) => {
        card.toggleMode();
        card.activate();
        card.setCallback(this.trainsCallback.bind(this));
      });
      this.reset();
    }
  }

  createGameWords() {
    this.gameCards = [];
    const cards = [...this.cards];

    while (cards.length > 0) {
      const index = Math.trunc(Math.random() * cards.length);
      this.gameCards.push(cards[index]);
      cards.splice(index, 1);
    }
  }

  startGame() {
    if (this.gameCards.length === 0) {
      this.createGameWords();
      this.startButton.textContent = 'repeat';
      this.sayWord();
    } else {
      this.sayWord();
    }
  }

  sayWord() {
    this.gameCards[this.gameCards.length - 1].setIsSound(true);
    this.gameCards[this.gameCards.length - 1].playSound();
    this.gameCards[this.gameCards.length - 1].setIsSound(false);
  }

  nextWord() {
    this.gameCards.pop();

    if (this.gameCards.length > 0) {
      this.sayWord();
    } else {
      this.startButton.textContent = 'start';
      this.gameOver();
    }
  }

  gameOver() {
    if (this.isHasWrong) {
      this.gameOverAudio.play();
      window.location = '#lose';
    } else {
      this.winAudio.play();
      window.location = '#win';
    }

    setTimeout(() => {
      window.location = '#home';
    }, 3500);
  }

  checkAnswer(word) {
    if (this.gameCards.length > 0) {
      const currentWord = this.gameCards[this.gameCards.length - 1].word;
      if (currentWord === word) {
        this.correctAudio.play();
        this.gameCards[this.gameCards.length - 1].deactivate();
        this.addStar('smile');
        this.correctCallback(currentWord);
        setTimeout(this.nextWord.bind(this), 1200);
      } else {
        this.isHasWrong = true;
        this.wrongAudio.play();
        this.addStar('sad');
        this.wrongCallback(currentWord);
      }
    }
  }

  addStar(emotion) {
    let url;
    const star = document.createElement('div');
    star.classList.add('star__bar-star');

    if (emotion === 'smile') {
      url = 'assets/images/funny_star.png';
    } else {
      url = 'assets/images/sad_star.png';
    }

    star.innerHTML = `<img src="${url}" alt="star">`;
    this.htmlStarBar.appendChild(star);
    setTimeout((() => { this.htmlStarBar.scrollLeft = 9999999; }), 300);
  }

  async loadCards(params) {
    this.clearPage();
    this.reset();

    const url = 'assets/cards.json';
    const result = await fetch(url)
      .then((response) => response.json())
      .then((data) => data);

    result.forEach((data) => {
      if (params.category === 'repeat') {
        const string = localStorage.getItem('repeat') || '[]';
        const words = JSON.parse(string);
        const cards = {
          category: 'repeat',
          color: '#edd5af',
          subcolor: '#e9b289',
          words: [],
        };

        data.words.forEach((word) => {
          if (words.includes(word.eng)) {
            cards.words.push(word);
          }
        });

        this.createCards(cards);
      } else if (data.category === params.category) {
        this.createCards(data);
      }
    });
  }
}
