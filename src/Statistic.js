export default class Statistic {
  constructor() {
    this.htmlElements = {};
    this.keys = [];
    this.createDOM('page', 'div', 'card__page');
    this.createDOM('main__nav', 'div', 'main__nav', '', 'page');
    this.createDOM('repeat_button', 'button', 'stats_repeat', 'repeat difficult words', 'main__nav');
    this.htmlElements.repeat_button.addEventListener('click', () => {
      const keys = Object.keys(this.words);
      let words = keys.filter((key) => this.words[key].wrong > 0 && this.words[key].percent < 100);
      words = words.sort((a, b) => (this.words[a].percent > this.words[b].percent ? 1 : -1)).splice(0, 8);
      localStorage.setItem('repeat', JSON.stringify(words));
      window.location = '#cards?category=repeat';
    });
    this.createDOM('reset_button', 'button', 'stats_reset', 'reset', 'main__nav');
    this.htmlElements.reset_button.addEventListener('click', () => {
      localStorage.removeItem('stats');
      this.keys = [];
      this.loadCards();
      setTimeout(this.print.bind(this), 1000);
    });
    this.createDOM('table_header', 'div', 'stats__table', '', 'page');
    const headers = ['word', 'translation', 'category', 'trains', 'correct', 'wrong', 'percent'];
    headers.forEach((hKey) => {
      this.createDOM(`header-${hKey}`, 'div', 'stats__table-item__header', hKey, 'table_header', { 'min-max': 'true', key: hKey });
      this.htmlElements[`header-${hKey}`].addEventListener('click', (e) => {
        const button = e.target;
        const isMinMax = button.getAttribute('min-max') === 'true';
        const by = button.getAttribute('key');
        button.setAttribute('min-max', !isMinMax);
        this.sortBy(by, isMinMax);
        this.print();
      });
    });
    this.createDOM('table_words', 'div', 'stats__table', '', 'page');
    this.loadCards();
  }

  createDOM(key, tag, cClass = '', text = '', parent = null, atributes = {}) {
    this.htmlElements[key] = document.createElement(tag);
    this.htmlElements[key].classList.add(cClass);
    this.htmlElements[key].textContent = text;

    const atributeKeys = Object.keys(atributes);

    if (atributeKeys.length > 0) {
      atributeKeys.forEach((atributeKey) => {
        this.htmlElements[key].setAttribute(atributeKey, atributes[atributeKey]);
      });
    }

    if (parent != null) {
      this.htmlElements[parent].appendChild(this.htmlElements[key]);
    }
  }

  appendToPage() {
    const container = document.querySelector('.container');
    container.appendChild(this.htmlElements.page);
  }

  loadPage() {
    this.print();
    this.appendToPage();
  }

  clearTable() {
    const node = this.htmlElements.table_words;
    while (node.firstChild) {
      node.removeChild(node.lastChild);
    }
  }

  print() {
    this.clearTable();
    this.keys.forEach((key) => {
      this.createDOM(void 0, 'div', 'stats__table-item', key, 'table_words');
      const methods = ['translation', 'category', 'trains', 'correct', 'wrong', 'percent'];
      methods.forEach((mKey) => {
        this.createDOM(void 0, 'div', 'stats__table-item', this.words[key][mKey], 'table_words');
      });
    });
  }

  async loadCards() {
    const url = 'assets/cards.json';
    const response = await fetch(url)
      .then((res) => res.json())
      .then((data) => data);

    const obj = {};
    response.forEach((d) => {
      d.words.forEach((w) => {
        obj[w.eng] = {};
        obj[w.eng].translation = w.rus;
        obj[w.eng].category = d.category.replace('_', ' ');
        obj[w.eng].trains = 0;
        obj[w.eng].correct = 0;
        obj[w.eng].wrong = 0;
        obj[w.eng].percent = 0;
      });
    });

    this.words = obj;
    this.keys = Object.keys(this.words);
    this.loadLocal();
    this.sortBy('word');
    this.print();
  }

  sortBy(key, reverse = false) {
    const sign = reverse ? -1 : 1;
    this.keys.sort((a, b) => {
      const A = key === 'word' ? a : this.words[a][key];
      const B = key === 'word' ? b : this.words[b][key];
      return A > B ? 1 * sign : -1 * sign;
    });
  }

  saveLocal() {
    localStorage.setItem('stats', JSON.stringify(this.words));
  }

  loadLocal() {
    const string = localStorage.getItem('stats') || '[]';
    const wordsStat = JSON.parse(string);
    const keys = Object.keys(wordsStat);
    keys.forEach((key) => {
      this.words[key].trains = wordsStat[key].trains;
      this.words[key].correct = wordsStat[key].correct;
      this.words[key].wrong = wordsStat[key].wrong;
      const correct = Number(wordsStat[key].correct);
      const wrong = Number(wordsStat[key].wrong);
      this.words[key].percent = Math.trunc((correct / (correct + wrong)) * 100) | 0;
    });
  }

  calcPercent() {
    this.keys.forEach((key) => {
      const correct = Number(this.words[key].correct);
      const wrong = Number(this.words[key].wrong);
      this.words[key].percent = Math.trunc((correct / (correct + wrong)) * 100) | 0;
    });
  }

  addTrains(word) {
    this.words[word].trains += 1;
    this.saveLocal();
  }

  addCorrect(word) {
    this.words[word].correct += 1;
    this.calcPercent();
    this.saveLocal();
  }

  addWrong(word) {
    this.words[word].wrong += 1;
    this.calcPercent();
    this.saveLocal();
  }
}
