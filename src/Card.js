export default class Card {
  constructor(word, translation, category, urlImage, urlAudio, color1, color2) {
    this.word = word;
    this.translation = translation;
    this.category = category;
    this.urlImage = `assets/images/${urlImage}`;
    this.urlAudio = `assets/audio/${urlAudio}`;
    this.mainColor = color1;
    this.secondColor = color2;
    this.isSoundOn = true;
    this.isBack = false;
    this.currentHoverCard = null;
    this.callback = null;
    this.isGameMode = false;
    this.isActive = true;

    this.createHtmlObject();
    this.addListeners();
  }

  createHtmlObject() {
    this.htmlCard = document.createElement('div');
    this.htmlCard.classList.add('cards__box-card');
    this.htmlCard.innerHTML = ` 
            <div class="cards__box-card-inner">
              <div class="cards__box-card-inner-front" style="background-color: ${this.mainColor};">
                <div class="cards__box-card-image">
                  <img src="${this.urlImage}" alt="card">
                </div>
                <div class="cards__box-card-word">
                  ${this.word}
                </div>
                <div class="cards__box-card-category" style="background-color: ${this.secondColor};">
                  ${this.category}
                </div>
                <audio src="${this.urlAudio}" is_on="true"></audio>
                <button class="cards__box-card-button" style="background-color: ${this.secondColor};">
                  <img src="assets/images/rotate.png" alt="rotate">
                </button>
              </div>
              <div class="cards__box-card-inner-back" style="background-color: ${this.mainColor};">
                <div class="cards__box-card-image">
                  <img src="${this.urlImage}" alt="card">
                </div>
                <div class="cards__box-card-word">
                  ${this.translation}
                </div>
                <div class="cards__box-card-category" style="background-color: ${this.secondColor};">
                  ${this.category}
                </div>
              </div>
            </div>`;

    this.audio = this.htmlCard.querySelector('audio');
    this.rotateButton = this.htmlCard.querySelector('.cards__box-card-button');
    this.htmlBackCard = this.htmlCard.querySelector('cards__box-card-inner-back');
    this.htmlWord = this.htmlCard.querySelector('.cards__box-card-word');
    this.htmlImage = this.htmlCard.querySelector('.cards__box-card-image');
  }

  appendTo(parent) {
    parent.appendChild(this.htmlCard);
  }

  addListeners() {
    this.rotateButton.onclick = this.rotateCard.bind(this);
    this.htmlCard.onmouseover = this.moveOverCard.bind(this);
    this.htmlCard.onmouseout = this.moveOutCard.bind(this);
    this.htmlCard.onclick = this.clickCard.bind(this);
  }

  rotateCard() {
    if (!this.isBack) {
      this.htmlCard.classList.add('cards__box-card-rotate');
      this.isSoundOn = false;
      this.isBack = true;
    } else {
      this.htmlCard.classList.remove('cards__box-card-rotate');
      this.isSoundOn = true;
      this.isBack = false;
    }
  }

  moveOverCard(event) {
    if (this.currentHoverCard) {
      return;
    }

    const target = event.target.closest('.cards__box-card-rotate');

    if (!target || !this.htmlCard.contains(target)) {
      return;
    }

    this.currentHoverCard = target;
  }

  moveOutCard(event) {
    if (!this.currentHoverCard) {
      return;
    }

    let { relatedTarget } = event;

    while (relatedTarget) {
      if (relatedTarget === this.currentHoverCard) {
        return;
      }

      relatedTarget = relatedTarget.parentNode;
    }

    this.currentHoverCard = null;

    this.rotateCard();
  }

  clickCard() {
    this.playSound();

    if (!!this.callback && this.isActive) {
      this.callback(this.word);
    }
  }

  playSound() {
    if (this.isSoundOn) {
      this.audio.play();
    }
  }

  setIsSound(value) {
    this.isSoundOn = value;
  }

  setCallback(func) {
    this.callback = func;
  }

  deactivate() {
    this.htmlCard.classList.add('cards__box-card-deactive');
    this.isActive = false;
  }

  activate() {
    this.htmlCard.classList.remove('cards__box-card-deactive');
    this.isActive = true;
  }

  toggleMode() {
    this.isGameMode = !this.isGameMode;

    if (this.isGameMode) {
      this.rotateButton.classList.add('cards__box-card-button-hide');
      this.rotateButton.disabled = true;
      this.isSoundOn = false;
      this.htmlWord.classList.add('cards__box-card-word-hide');
      this.htmlImage.classList.add('cards__box-card-image-big');
    } else {
      this.rotateButton.classList.remove('cards__box-card-button-hide');
      this.rotateButton.disabled = false;
      this.isSoundOn = true;
      this.htmlWord.classList.remove('cards__box-card-word-hide');
      this.htmlImage.classList.remove('cards__box-card-image-big');
    }
  }
}
