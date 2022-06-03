class JSONCreatorObject extends JSONCreator {
    constructor(object) {
      super(object);
      this.parameters = {};
      for (var x in object) {
        if (!INFO_TYPES.includes(x)) {
          this.parameters[x] = getJSONCreator(object[x]);
          this.addChild(this.parameters[x]);
        }
      }
    }
    init() {
      var element = $(`<div class="creator-object"></div>`);
      for (var x in this.parameters) {
        var nelem = $(`<span class="creater-object-span">${x}:</span>`);
        if (this.parameters[x].tooltip) {
          JSONAddTooltip(nelem, this.parameters[x].tooltip);
        }
        element.append(nelem);
        element.append(this.parameters[x].create());
        element.append('</br>');
      }
      return element;
    }
    get() {
      var mything = {};
      for (var x in this.parameters) {
        mything[x] = this.parameters[x].get();
      }
      return mything;
    }
    load(obj) {
      for (var x in this.parameters) {
        this.parameters[x].load(obj[x]);
      }
    }
    setMutable(b) {
      this.mutable = b;
      for (var x in this.parameters) {
        this.parameters[x].setMutable(b);
      }
    }
}

  registerJSONCreator('object', JSONCreatorObject);
