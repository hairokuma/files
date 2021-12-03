'use babel';
const path = require('path');
import $ from './jquery.min';

const {
  Emitter,
  File,
  CompositeDisposable
} = require('atom');
import filesJs from './files';

export default class FilesOpener {

  constructor() {
    this.filesView = filesJs.getView();
    this.fl = [];
    this.imageExtensions = filesJs.imageExtensions;
    this.musicExtensions = filesJs.musicExtensions;
    this.videoExtensions = filesJs.videoExtensions;
    this.previewExtensions = filesJs.previewExtensions;
    this.extensions = filesJs.extensions;

    this.element = document.createElement('files');
    this.element.classList.add('opener');

    this.fileChooser = document.createElement('input');
    this.fileChooser.type = 'file';
    this.fileChooser.webkitdirectory = true;
    this.fileChooser.multiple = true;
    this.element.appendChild(this.fileChooser);


    this.menu = document.createElement('div');
    this.menu.classList.add('menu')
    this.element.appendChild(this.menu);

    this.folderAdd = document.createElement('i');
    this.folderAdd.classList.add('fa-folder-plus')
    this.folderAdd.classList.add('fal')

    this.menu.appendChild(this.folderAdd);

    this.fileAdd = document.createElement('i');
    this.fileAdd.classList.add('fa-file-plus')
    this.fileAdd.classList.add('fal')

    this.menu.appendChild(this.fileAdd);

    const fileListHandler = (e) => {
      $('.file-list').find('.selected').removeClass('selected');
      console.log(e.target);
      console.log(this.fl);
      filesJs.modalPanel.hide()
      $(e.target).addClass('selected');
      atom.workspace.open(e.target.dataset.src)
      this.filesView = filesJs.getView();
      this.filesView.setFiles(this.fl);
    };

    this.fileList = document.createElement('div');
    this.fileList.classList.add('file-list');
    this.fileList.addEventListener("click", fileListHandler);
    this.element.appendChild(this.fileList);

    // this.fileList.innerHTML = "";


    const fileInput = () => {
      console.log(this.fileChooser);
      console.log(this.fileChooser.files);
      this.addFiles(this.fileChooser.files);
    };

    this.fileChooser.addEventListener("input", fileInput);


    // file.click();

  }
  addFiles(files) {
    // this.fl = []
    var ns = []
    for (var i = 0; i < files.length; i++) {
      if (files[i]) {
        if (files[i].path) {
          const uriExtension = path.extname(files[i].path).toLowerCase();
          if (this.extensions.includes(uriExtension)) {
            this.fl.push(files[i].path)
            // this.fileList = document.createElement('div');
            this.fileItem = document.createElement('div');
            this.fileItem.classList.add('file-list-item');
            this.fileList.appendChild(this.fileItem);
            this.fileItem.dataset.src = files[i].path;
            this.fileItem.innerHTML = files[i].name;
          } else if (this.previewExtensions.includes(uriExtension)) {
            this.fileItem = document.createElement('div');
            this.fileItem.classList.add('file-list-item');
            this.fileList.appendChild(this.fileItem);
            this.fileItem.dataset.src = files[i].path + ".preview";
            this.fl.push(files[i].path + ".preview")
            this.fileItem.innerHTML = files[i].name;
            console.log(files[i].path + ".preview");
          } else {
            ns.push(files[i])
          }
        }
      }
    }
    console.log(this.fl);
    console.log(ns);
  }
  opened() {
    console.log('opened');
    this.element.focus();
    // this.fileChooser.click();
  }
  clear() {
    console.log('clear');
  }
  getElement() {
    return this.element;
  }

}
