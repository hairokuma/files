'use babel';
import $ from '../jquery.min';
const {
  Emitter,
  File,
  CompositeDisposable
} = require('atom');



export default class Embed {

  constructor(filesView) {
    this.filesView = filesView;
    this.filesView.element.classList.add('embed');
    this.playing = false;
    embed = document.createElement('embed');
    // embed.classList.add('');
    embed.src = this.filesView.uri.replace('.preview','');
    embed.type ="application/pdf";
    this.filesView.content.appendChild(embed);

    this.timer=null;

    // $(this.filesView.content).load(this.filesView.uri.replace('.preview',''));


    // this.duration = atom.config.get('files.Autoplay.embedTime') * 1000;
    // this.time = 0;
    //
    // const togglePlay = () => {
    //   this.togglePlay();
    // };
    //
    // embed.addEventListener('click', togglePlay);

    // if (atom.config.get('files.Autoplay.embed')) {
    //   playing = true;
    //   this.togglePlay()
    // }
    // const transition = () => {
    //   this.filesView.element.classList.add('transition');
    // };
    // setTimeout(transition, 500);
  }
  togglePlay() {
    this.playing = !this.playing;
    this.progress()
  }
  clear() {
    // clearTimeout(this.timer);
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
    if (this.playing) {
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
