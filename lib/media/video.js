'use babel';
const {
  Emitter,
  File,
  CompositeDisposable
} = require('atom');
var percent = 0;

export default class Video {

  constructor(filesView) {
    this.filesView = filesView;
    this.filesView.element.classList.add('video');
    this.toggled = false;
    this.cleard = false;
    this.timer = null
    video = document.createElement('video');
    video.classList.add('video');
    video.controls = true;
    video.src = filesView.uri;
    filesView.content.appendChild(video);
    if (filesView.play) {
      video.play();
    }

    const toggleFullscreen = (e) => {
      video.webkitExitFullscreen();
      if (!this.toggled) {
        filesView.toggleFullscreen();
      }
      this.toggled = !this.toggled;
    };

    const onPlay = () => {
      this.filesView.play = true;
      this.progress();
    };

    const onPause = () => {
      if (!this.cleard && video.currentTime != video.duration) {
        this.filesView.play = false;
      }
      clearTimeout(this.timer);
    };

    const onEnded = () => {
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
    this.cleard = true;
    clearTimeout(this.timer);
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
      this.timer = setTimeout(progress, 100);
    }
  }
}
