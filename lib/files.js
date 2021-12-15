'use babel';
import $ from './jquery.min';
import FilesView from './files-view';
import FilesOpener from './files-opener';
import Preview from './preview';
import {
  CompositeDisposable,
  Disposable
} from 'atom';
const path = require('path')

const fs = require('fs');

// Files with these extensions will be opened as images
const imageExtensions = ['.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.webp']
const musicExtensions = ['.mp3']
const videoExtensions = ['.mp4']
const embedExtensions = ['.pdf','.preview']
const previewExtensions = ['.html']
const extensions = imageExtensions.concat(musicExtensions).concat(videoExtensions).concat(embedExtensions);
const configSchema = require("../config.json");

var filesView;
var activePane;
var preview;
export default {

  uri: null,
  imageExtensions: imageExtensions,
  musicExtensions: musicExtensions,
  videoExtensions: videoExtensions,
  embedExtensions: embedExtensions,
  previewExtensions: previewExtensions,
  extensions: extensions,
  config: configSchema,
  editor: null,

  activate(state) {
    //set active view
    const setActive = (item) => {
      if (item) {
        if (item.constructor.name != "TreeView") {
          activePane = atom.workspace.getActivePane();
          if (activePane) {
            for (const item of activePane.getItems()) {
              if (item instanceof FilesView) {
                filesView = item;
              }
            }
          }
          if (item instanceof FilesView) {
            filesView = item;
            activePane.element.classList.add('files-pane');
          } else {
            activePane.element.classList.remove('files-pane');
          }
        }
      }
    }
    atom.workspace.observePaneItems(setActive);
    atom.workspace.onDidChangeActivePaneItem(setActive)

    // create view if file is opened
    this.disposables = new CompositeDisposable()
    this.disposables.add(atom.workspace.addOpener(uri => {
      return this.handleView(uri);
    }))

    // set Key bundings
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'files:preview': () => this.openPreview()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'files:toggleModal': () => this.toggleModal(),
      'files:next': () => filesView.next(),
      'files:previous': () => filesView.previous(),
      'files:togglePlay': () => filesView.togglePlay(),
      'files:debug': () => this.debug()
    }));
    this.subscriptions.add(atom.commands.add('.files-pane', {
      'files:next': () => filesView.next(),
      'files:previous': () => filesView.previous(),
      'files:togglePlay': () => filesView.togglePlay(),
      'files:toggleFullscreen': () => filesView.toggleFullscreen()
    }));

    //init open Modal
    const openerVisible = (visable) => {
      if (visable) {
        this.filesOpener.opened();
      }
    };
    this.filesOpener = new FilesOpener();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.filesOpener.getElement(),
      visible: false
    });
    this.modalPanel.onDidChangeVisible(openerVisible)
  },
  getView() {
    return filesView;
  },
  getActivePane() {
    return activePane;
  },
  handleView(uri) {
    this.uri = uri;
    const uriExtension = path.extname(uri).toLowerCase();
    if (extensions.includes(uriExtension)) {
      fileList = this.getFiles(uri);
      var viewPane = atom.workspace.paneForItem(filesView);
      if (filesView && atom.config.get('files.Open.same') && viewPane == activePane) {
        filesView.setFiles(fileList);
        filesView.setContent(uri);
      } else {
        filesView = new FilesView(uri, fileList);
      }
      return filesView;
    }
    if (this.uri.includes('atom://preview')) {
      if (!this.editor.preview) {
        this.editor.preview = new Preview(this.previewPath, this.previewTitle);
      } else {
        this.editor.preview.update();
      }
      return this.editor.preview;
    }
  },
  getFiles(uri) {
    const dir = path.dirname(uri);
    var fileList = [];
    filenames = fs.readdirSync(dir);
    filenames.forEach(file => {
      var ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        fileList.push(dir + path.sep + file);
      }
    });
    return fileList;
  },
  removeView() {
    // filesView = null;
  },
  openPreview() {
    this.editor = atom.workspace.getActiveTextEditor();
    this.previewPath = this.editor.getPath(); // path/with/fileName.ext

    const uriExtension = path.extname(this.previewPath).toLowerCase();
    if (previewExtensions.includes(uriExtension)) {
      this.editor.save();

      const change = (item) => {
        editor = atom.workspace.paneForURI(item.path).itemForURI(item.path);
        if (editor.preview) {
          editor.preview.update();
        }
      }
      if (!this.editor.preview) {
        this.editor.onDidSave(change);
      }

      this.previewTitle = this.editor.getTitle(); // fileName.ext
      atom.workspace.open('atom://preview-' + this.previewPath, {
        split: 'right'
      });
    }
  },
  deactivate() {
    this.disposables.dispose()
  },
  debug() {
    console.log('########################');
    console.log('DEBUG');
    console.log(filesView);
    console.log(activePane);
    console.log(this);
  },
  toggleModal() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },
  deserializeFilesView(serialized) {
    filesView = new FilesView(serialized.filePath, serialized.fileList)
    return filesView;
  },
  deserializePreview(serialized) {
    preview = new Preview(serialized.path,serialized.title)
    return preview;
  },
};
