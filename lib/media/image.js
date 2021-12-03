'use babel';
const {
  Emitter,
  File,
  CompositeDisposable
} = require('atom');



export default class Image {

  constructor(filesView) {
    console.log('image');
    this.filesView = filesView;
    this.filesView.element.classList.add('image');
    image = document.createElement('img');
    image.classList.add('image');
    image.src = this.filesView.uri;
    this.filesView.content.appendChild(image);
    this.duration = atom.config.get('files.Autoplay.imageTime') * 1000;
    this.time = 0;
    this.timer=null;

    const togglePlay = () => {
      // this.togglePlay();
      this.filesView.togglePlay();
    };

    image.addEventListener('click', togglePlay);

    if (this.filesView.play) {
      this.togglePlay()
    }
    const transition = () => {
      this.filesView.element.classList.add('transition');
    };
    setTimeout(transition, 500);
  }
  togglePlay() {
    this.progress()
  }
  clear() {
    console.log('clear');
    clearTimeout(this.timer);
    this.filesView.element.classList.remove('transition');

  }
  progress(value) {
    if (value) {
      this.time = (this.duration / 100) * value;
    }
    increment = 10 / this.duration;
    percent = Math.min(increment * this.time * 10, 100);
    this.filesView.progressBar.style.width = percent + '%'
    this.filesView.prog.value = percent;
    this.time = this.time + 100;
    if (this.filesView.play) {
      this.startTimer();
    }
  }
  startTimer() {
    const progress = () => {
      this.progress();
    };
    if (percent < 100) {
      this.timer = setTimeout(progress, 100);
    } else {
      this.filesView.next();
    }
  }
}
