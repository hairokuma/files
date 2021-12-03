'use babel';
const path = require('path');
const {
  Emitter,
  File,
  CompositeDisposable
} = require('atom');
const fs = require('fs');

var globalURI;
var treeView;

// audio
var timer;
var percent = 0;

import $ from './jquery.min';
import filesJs from './files';
import Video from './media/video';
import Audio from './media/audio';
import Image from './media/image';
import Embed from './media/embed';
// const files = require('./files');
export default class FilesView {

  constructor(uri, files) {
    this.filesClass = "files";
    this.imageExtensions = filesJs.imageExtensions;
    this.musicExtensions = filesJs.musicExtensions;
    this.videoExtensions = filesJs.videoExtensions;
    this.embedExtensions = filesJs.embedExtensions;
    this.files = files;
    this.uri = uri
    this.media = null;
    this.play = atom.config.get('files.Autoplay.all');

    this.initTree();
    this.setCurrent();

    console.log(uri);
    console.log(files);

    // Create root element
    this.element = document.createElement('files');
    this.element.classList.add('files');

    this.content = document.createElement('div');
    this.content.classList.add('content');
    this.element.appendChild(this.content);

    this.progressBar = document.createElement('div');
    this.progressBar.classList.add('progress');
    this.element.appendChild(this.progressBar);

    const setProg = (e) => {
      this.media.progress(this.prog.value);
    };
    this.prog = document.createElement('input');
    this.prog.type = 'range';
    this.prog.value = 0;
    this.prog.classList.add('prog');
    this.prog.addEventListener("input", setProg);
    this.element.appendChild(this.prog);

    const next = () => {
      this.next();
    };
    const nextButton = document.createElement('div');
    this.element.appendChild(nextButton);
    nextButton.classList.add('button-next');
    nextButton.addEventListener('click', next);

    const previous = () => {
      this.previous();
    };
    const previousButton = document.createElement('div');
    this.element.appendChild(previousButton);
    previousButton.classList.add('button-previous');
    previousButton.addEventListener('click', previous);

    const fullscreen = () => {
      this.toggleFullscreen();
    };
    const fullscreenButton = document.createElement('div');
    this.element.appendChild(fullscreenButton);
    fullscreenButton.classList.add('button-fullscreen');
    fullscreenButton.addEventListener('click', fullscreen);

    this.setContent(uri);
  }
  toggleFullscreen() {
    console.log("toggle fs");
    if (this.filesClass.includes('fs')) {
      this.filesClass = "files";
      this.element.classList.remove('fs')
    } else {
      this.filesClass = "files fs";
      this.element.classList.add('fs')
    }
  }
  setCurrent() {
    for (var i = 0; i < this.files.length; i++) {
      if (this.files[i] == this.uri) {
        this.current = i;
      }
    }
  }
  resetDefault() {
    this.prog.value = 0;
    this.progressBar.style.width = 0;
    this.content.innerHTML = ``;
    this.element.className = this.filesClass;
    if (this.media) {
      this.media.clear();
    }
  }
  setContent(uri) {
    this.file = new File(uri)
    this.uri = uri;

    console.log(this.play);

    // clear content
    this.resetDefault();
    const uriExtension = path.extname(uri).toLowerCase();
    if (this.imageExtensions.includes(uriExtension)) {
      this.media = new Image(this);
    } else if (this.musicExtensions.includes(uriExtension)) {
      this.media = new Audio(this);
    } else if (this.videoExtensions.includes(uriExtension)) {
      this.media = new Video(this);
    } else if (this.embedExtensions.includes(uriExtension)) {
      this.media = new Embed(this);
    } else {
      console.log('other');
    }
    this.setTabTitle();
    this.setTree();
  }
  previous() {
    this.current--
    if (this.current < 0) {
      this.current = this.files.length - 1;
    }
    this.setContent(this.files[this.current])
  }
  next() {
    this.current++
    if (this.current >= this.files.length) {
      this.current = 0;
    }
    this.setContent(this.files[this.current])
  }
  togglePlay() {
    this.play = !this.play;
    this.media.togglePlay();
  }

  initTree(){
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.packages.onDidActivatePackage(pkg => {
      if (pkg.name === 'tree-view') {
        this.treeViewPkg = pkg;
        treeView = this.treeViewPkg.mainModule.getTreeViewInstance();
      }
    }));
  }
  setTree() {
    if (treeView) {
      $(treeView.element).find('.selected').removeClass('selected');
      $(treeView.element).find('[data-name="' + this.getTitle() + '"]').parent('li').addClass('selected');
    }
  }
  setTabTitle() {
    var pane = filesJs.getActivePane();
    if (pane) {
      var title = $(pane.element).children('.tab-bar').children('[data-type="FilesView"]').children('.title');
      title.html(this.getTitle())
      title.attr('data-name', this.getTitle())
      title.attr('data-path', this.uri)
    }
  }
  getTitle() {
    const filePath = this.getPath()
    if (filePath) {
      return path.basename(filePath)
    } else {
      return 'untitled'
    }
  }
  getDefaultLocation() {
    return 'center';
  }
  getPath() {
    return this.file.getPath()
  }
  getURI() {
    return this.uri;
  }
  setFiles(files) {
    this.files = files;
    this.setCurrent();
  }
  serialize() {
    return {
      filePath: this.getPath(),
      fileList: this.files,
      deserializer: this.constructor.name
    }
  }
  destroy() {
    console.log('destroy');
    filesJs.removeView();
    this.resetDefault();
    this.element.remove();
  }
  getElement() {
    return this.element;
  }
}
