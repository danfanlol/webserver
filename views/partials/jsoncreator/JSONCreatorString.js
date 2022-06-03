class JSONCreatorString extends JSONCreator {
    constructor(object) {
      super(object);
    }
    init() {
      var element = $('<input type="text" value="" class="jsoncreator-inputs">');
      element.on('change', function (e) {
        this.controller.trigger('change');
      });
      return element;
    }
    get() {
      return this.elem.val();
    }
    load(obj) {
      this.elem.val(obj);
    }
    setMutable(b) {
      this.mutable = b;
      this.elem.attr('readonly', !b);
    }
}
registerJSONCreator('string', JSONCreatorString);
const JSONString = {
    type: 'string',
};