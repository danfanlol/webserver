class JSONCreatorList extends JSONCreator {
    constructor(object) {
      super(object);
      this.parameters = [];
      this.of = object.of;
      this.addTo;
      this.btn;
    }
    addElem() {
      var index = this.parameters.length;
      var nextCreator = getJSONCreator(this.of);
      this.addChild(nextCreator);
      this.parameters.push(nextCreator);
      var stuff = nextCreator.create();
      var stuff2 = $('</br>');
      this.addTo.append(stuff);
  
      var deleter = $('<span class="creator-deleter">X</span>');
      this.addTo.append(deleter);
      this.addTo.append(stuff2);
      deleter.prop('index', index);
      deleter.prop('target', stuff);
      deleter.prop('target2', stuff2);
      deleter.prop('controller', this);
      deleter.on('click', function () {
        if (!this.controller.mutable) {
          return;
        }
        this.controller.parameters.pop(this.index);
        $(this.target).remove();
        $(this.target2).remove();
        $(this).remove();
        this.controller.trigger('change');
      });
      return nextCreator;
    }
    init() {
      var element = $(`<div class="creator-object"></div>`);
      var thing = $(`<div></div>`);
      element.append(thing);
      var btn = $(`<button class="creator-button">Add</button>`);
      btn.prop('controller', this);
      this.addTo = thing;
      this.btn = btn;
      btn.on('click', function () {
        this.controller.addElem();
        this.controller.trigger('change');
      });
      element.append(btn);
      return element;
    }
    get() {
      var mything = [];
      for (var i = 0; i < this.parameters.length; i++) {
        mything.push(this.parameters[i].get());
      }
      return mything;
    }
    load(obj) {
      for (var i = 0; i < obj.length; i++) {
        this.addElem().load(obj[i]);
      }
    }
    setMutable(b) {
      this.mutable = b;
      for (var i = 0; i < this.parameters.length; i++) {
        this.parameters[i].setMutable(b);
      }
      if (!b) {
        this.btn.hide();
      } else {
        this.btn.show();
      }
    }
}
registerJSONCreator('list', JSONCreatorList);
