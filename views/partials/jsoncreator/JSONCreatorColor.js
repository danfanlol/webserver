class JSONCreatorColor extends JSONCreator {
    constructor(object) {
      super(object);
      this.picker;
      this.prevval;
    }
    init() {
      var element = document.createElement('INPUT');
      var opts = {
        backgroundColor: '#333',
      };
  
      var picker = new jscolor(element, opts); // 'JSColor' is an alias to 'jscolor'
      picker.fromHSV(100, 100, 100);
      this.picker = picker;
      this.prevval = $(element).val();
      $(element).on('change', function () {
        if (!this.controller.mutable) {
          this.controller.load(this.controller.prevval);
          return;
        }
        this.controller.prevval = this.controller.get();
        this.controller.trigger('change');
      });
      return $(element);
    }
    get() {
      return this.elem.val();
    }
    load(obj) {
      console.log(obj);
      this.picker.fromString(obj);
    }
    setMutable(b) {
      this.mutable = b;
      this.elem.attr('readonly', !b);
    }
}
registerJSONCreator('color', JSONCreatorColor);
