const view = document.getElementById('view');
const slider = document.getElementById('speed');
const shuffleButton = document.getElementById('shuffle');
const sortButton = document.getElementById('sort');

function Visualizer() {
  this.bars = [];
  this.colors = {
    red: '#DD2226',
    green: '#26DD22',
    blue: '#2226DD',
    gray: '#bfbfbf'
  };

  for (let i = 0; i < 64; ++i) {
    this.bars[i] = document.createElement('div');
    this.bars[i].className = 'bar';
    this.bars[i].setAttribute('style', 'height: ' + ((i + 1) * 5) + 'px;');
    view.appendChild(this.bars[i]);
  }

  this.disableButtons = function() {
    shuffleButton.disabled = true;
    sortButton.disabled = true;
  };

  this.enableButtons = function() {
    shuffleButton.disabled = false;
    sortButton.disabled = false;
  };

  this.swapBars = function(i, j) {
    let style1 = this.bars[i].getAttribute('style');
    let style2 = this.bars[j].getAttribute('style');
    this.bars[i].setAttribute('style', style2);
    this.bars[j].setAttribute('style', style1);
  };

  this.shuffle = function() {
    this.disableButtons();
    for (let i = this.bars.length - 1, j = 0; i > 0; --i) {
      j = Math.floor(Math.random() * (i + 1));
      this.swapBars(i, j);
    }
    this.enableButtons();
  };

  this.resetColors = function() {
    this.bars.forEach(e => e.style.backgroundColor = this.colors.gray);
  };

  this.sleep = async function() {
    await sleep(1000 / slider.value);
  };

  this.bubbleSort = async function(compareFunction) {
    for (let i = 0, j; i < this.bars.length; ++i) {
      for (j = 0; j < this.bars.length-1-i; ++j) {
        this.bars[j].style.backgroundColor = this.colors.blue;
        await this.sleep();
        if (compareFunction(this.bars[j], this.bars[j+1])) {
          this.bars[j+1].style.backgroundColor = this.colors.red;
          await this.sleep();
          this.swapBars(j, j+1);
          await this.sleep();
          this.bars[j].style.backgroundColor = this.colors.gray;
        }
        this.bars[j].style.backgroundColor = this.colors.gray;
      }
      this.bars[j].style.backgroundColor = this.colors.green;
      await this.sleep();
    }
    await this.sleep();
    this.resetColors();
  };

  this.selectionSort = async function(compareFunction) {
    for (let i = 0; i < this.bars.length-1; ++i) {
      let min_idx = i;
      this.bars[i].style.backgroundColor = this.colors.blue;
      await this.sleep();
      for (let j = i+1; j < this.bars.length; ++j) {
        this.bars[j].style.backgroundColor = this.colors.red;
        if (compareFunction(this.bars[min_idx], this.bars[j])) {
          this.bars[min_idx].style.backgroundColor = this.colors.gray;
          this.bars[j].style.backgroundColor = this.colors.blue;
          min_idx = j;
          await this.sleep();
        } else {
          await this.sleep();
          this.bars[j].style.backgroundColor = this.colors.gray;
        }
      }
      this.swapBars(min_idx, i);
      this.bars[i].style.backgroundColor = this.colors.green;
      await this.sleep();
    }
    await this.sleep();
    this.resetColors();
  };

  this.insertionSort = async function(compareFunction) {
    this.bars[0].style.backgroundColor = this.colors.green;
    for (let i = 1; i < this.bars.length; ++i) {
      let key = this.bars[i];
      let j = i;
      while (j > 0 && compareFunction(this.bars[j-1], key)) {
        this.bars[j] = this.bars[j-1];
        --j;
      }
      if (j !== i) {
        key.style.backgroundColor = this.colors.red;
        await this.sleep();
        view.insertBefore(key, this.bars[j]);
        this.bars[j] = key;
      }
      key.style.backgroundColor = this.colors.blue;
      await this.sleep();
      key.style.backgroundColor = this.colors.green;
    }
    await this.sleep();
    this.resetColors();
  };

  this.sort = async function() {
    this.disableButtons();
    let s = document.getElementById('algorithm-select');
    let algorithm = s.options[s.selectedIndex].value;
    let compareFunction = document.getElementById('ascending').checked ?
      function(a, b) {
        return parseInt(a.style.height) > parseInt(b.style.height);
      } :
      function(a, b) {
        return parseInt(a.style.height) < parseInt(b.style.height);
      };
    await this[algorithm](compareFunction);
    this.enableButtons();
  };
}
