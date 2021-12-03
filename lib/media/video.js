'use babel';
const {
  Emitter,
  File,
  CompositeDisposable
} = require('atom');
var timer;
var percent = 0;

export default class Video {

  constructor(filesView) {
    console.log('video');
    this.filesView = filesView;
    this.filesView.element.classList.add('video');
    this.toggled = false;
    this.cleard = false;
    video = document.createElement('video');
    video.classList.add('video');
    video.controls = true;
    video.src = filesView.uri;
    filesView.content.appendChild(video);
    if (filesView.play) {
      video.play();
    }

    const toggleFullscreen = (e) => {
      console.log('toggleFullscreen');
      video.webkitExitFullscreen();
      if (!this.toggled) {
        filesView.toggleFullscreen();
      }
      this.toggled = !this.toggled;
    };

    const onPlay = () => {
      console.log('play');
      this.filesView.play = true;
      this.progress();
    };

    const onPause = () => {
      console.log('pause');
      console.log(video.currentTime);
      console.log(video.duration);
      if (!this.cleard && video.currentTime != video.duration) {
        this.filesView.play = false;
      }
      clearTimeout(timer);
    };

    const onEnded = () => {
      console.log('ende');
      this.filesView.next();
    };

    video.addEventListener('webkitfullscreenchange', toggleFullscreen);
    video.addEventListener("playing", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

  }
  togglePlay() {
    if (!video.paused) {
      video.pause();
    } else {
      video.play();
    }
  }
  clear() {
    console.log('clear');
    this.cleard = true;
    clearTimeout(timer);
  }
  progress(value) {
    if (value) {
      video.currentTime = (video.duration / 100) * value;
    }
    increment = 10 / video.duration
    percent = Math.min(increment * video.currentTime * 10, 100);
    this.filesView.progressBar.style.width = percent + '%'
    this.filesView.prog.value = percent;
    this.startTimer();
  }
  startTimer() {
    const progress = () => {
      this.progress();
    };
    if (percent < 100) {
      timer = setTimeout(progress, 100);
    }
  }
}
