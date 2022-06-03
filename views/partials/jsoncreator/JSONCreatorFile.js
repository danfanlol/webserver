class JSONCreatorFile extends JSONCreator {
    constructor(object) {
      super(object);
      this.id = object.id;
      this.name = '';
      if (object.name) {
        this.name = object.name;
      }
    }
    init() {
      var element = $(
        `<input type="file" class="form-control-file" id="${this.id}">`
      );
      element[0].setName = function (name) {
        this.homeList.name = name;
      };
      jsoncreatorcolorize(element);
      return element;
    }

    set(name) {
      this.name = name;
    }
    get() {
      return this.name;
    }
    load(obj) {
      this.name = obj;
    }
    setMutable(b) {
      if (!b) {
        this.elem.hide();
      } else {
        this.elem.show();
      }
    }
}
registerJSONCreator('file', JSONCreatorFile);
