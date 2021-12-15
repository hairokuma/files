'use babel';

export default class Preview {

  constructor(path,title) {
    // console.log(path);
    this.path = path; // path/with/fileName.ext
    // this.editor =atom.workspace.paneForURI(this.path).itemForURI(this.path);
    this.title = title; // fileName.ext
    // console.log(this.editor);
    // console.log(this.path);

    this.element = document.createElement('div');
    this.element.classList.add('preview');
    this.embed = document.createElement('embed');
    this.embed.src = this.path;
    this.element.appendChild(this.embed);

    // const showchanges = (item) => {
    //   this.embed = document.createElement('embed');
    //   this.embed.src = this.path;
    //   this.element.appendChild(this.embed);
    // }
    // const change = (item) => {
    //   this.editor.save();
    //   this.embed.remove();
    //   setTimeout(showchanges, 10);
    // }
    // this.editor.onDidStopChanging(change);
    // this.editor.onDidSave(change);
  }
  update(){
    const showchanges = (item) => {
      this.embed = document.createElement('embed');
      this.embed.src = this.path;
      this.element.appendChild(this.embed);
    }
    this.embed.remove();
    setTimeout(showchanges, 1);
  }

  getPath() {
    return this.path;
  }

  getTitle() { // Used by Atom for tab text
    return this.title;
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'center';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['left', 'right', 'bottom', 'center'];
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://preview-' + this.path;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      path: this.path,
      title: this.title,
      deserializer: this.constructor.name
    }
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    // this.subscriptions.dispose();
  }
  getElement() {
    return this.element;
  }
}
