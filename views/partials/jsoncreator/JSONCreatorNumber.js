class JSONCreatorNumber extends JSONCreator {
    min=Number.MIN_VALUE;
    max=Number.MAX_VALUE;
    constructor(object) {
      super(object);
      this.preval = '';
      if(object.min) {
        this.min=object.min;
      }
      if(object.max) {
        this.max=object.max;
      }
      if (object.size) this.size = object.size;
    }
    init() {
      var element = $(
        '<input type="string" value="" class="jsoncreator-inputs">'
      );
      if (this.size) {
        element.width(this.size);
      }
      element.on('change', function (e) {
        var num=Number($(this).val());
        if ((!isFinite(num)) || (num<this.controller.min) || (num>this.controller.max)) {
          $(this).val(this.controller.preval);
        } else {
          this.controller.trigger('change');
        }
        this.controller.preval = $(this).val();
      });
      return element;
    }
    get() {
      return Number(this.elem.val());
    }
    load(obj) {
      this.prevval = obj;
      this.elem.val(obj);
    }
    setMutable(b) {
      this.mutable = b;
      this.elem.attr('readonly', !b);
    }
}
registerJSONCreator('number', JSONCreatorNumber);
const JSONNumber = {
    type: 'number',
};