'use babel';
const path = require('path');
const {
  Emitter,
  File,
  CompositeDisposable
} = require('atom');

// audio
var timer;
var percent = 0;
var vol;

export default class Audio {

  constructor(filesView) {
    this.filesView = filesView
    this.filesView.element.classList.add('music');
    this.timer=null;


    audio = document.createElement('audio');
    audio.classList.add('audio');
    audio.src = this.filesView.uri;
    this.filesView.content.appendChild(audio);

    const togglePlay = () => {
      // this.togglePlay();
      this.filesView.togglePlay();
    };

    this.button = document.createElement('div');
    this.button.classList.add('togglePlay');
    this.button.addEventListener('click', togglePlay);
    this.filesView.content.appendChild(this.button);

    volumeControl = document.createElement('div');
    volumeControl.classList.add('volume-control');
    this.filesView.content.appendChild(volumeControl);

    const toggleMute = (e) => {
      if (audio.volume) {
        vol = audio.volume;
        audio.volume = 0;
        mute.classList.add('muted');
      } else {
        mute.classList.remove('muted');
        audio.volume = vol;
      }
    };
    mute = document.createElement('div');
    mute.classList.add('mute');
    volumeControl.appendChild(mute);
    mute.addEventListener('click', toggleMute);

    const changeVolume = (e) => {
      audio.volume = e.target.value / 100;
      if (audio.volume) {
        mute.classList.remove('muted');
      } else {
        mute.classList.add('muted');
      }
    };
    volume = document.createElement('input');
    volume.type = 'range';
    volume.value = 100;
    volume.classList.add('volume');
    volume.addEventListener("input", changeVolume);
    volumeControl.appendChild(volume);

    const skipPlaylist = (e) => {
      this.filesView.setContent(e.target.dataset.src)
      this.filesView.setCurrent();
    };

    playlist = document.createElement('div');
    playlist.classList.add('playlist');
    playlist.addEventListener("click", skipPlaylist);
    this.filesView.content.appendChild(playlist);

    for (var i = 0; i < this.filesView.files.length; i++) {
      var item = new File(this.filesView.files[i])
      var name = this.filesView.files[i]
      const filePath = item.getPath()
      if (filePath) {
        name = path.basename(filePath)
      }
      item = document.createElement('div');
      if (this.filesView.files[i] == this.filesView.uri) {
        item.classList.add('active');
      }
      playlist.appendChild(item);
      item.innerHTML = `${name}`;
      item.dataset.src = this.filesView.files[i];
    }

    const progress = () => {
      this.progress();
    };

    const clearTimer = () => {
      clearTimeout(this.timer);
    };

    const next = () => {
      this.filesView.next();
    };

    audio.addEventListener("playing", progress);
    audio.addEventListener("pause", clearTimer);
    audio.addEventListener("ended", next);

    if (filesView.play) {
      this.togglePlay();
    }
  }
  clear() {
    // this.button.removeEventListener('click', togglePlay);
    // mute.removeEventListener('click', toggleMute);
    // volume.removeEventListener("input", changeVolume);
    // playlist.removeEventListener("click", skipPlaylist);
    // audio.removeEventListener("playing", progress);
    // audio.removeEventListener("pause", clear);
    // audio.removeEventListener("ended", next);
    clearTimeout(this.timer);
  }
  progress(value) {
    if (value) {
      audio.currentTime = (audio.duration / 100) * value;
    }
    increment = 10 / audio.duration
    percent = Math.min(increment * audio.currentTime * 10, 100);
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
  togglePlay() {
    if (!audio.paused) {
      this.button.classList.remove('active');
      audio.pause();
    } else {
      this.button.classList.add('active');
      audio.play();
    }
  }
}
