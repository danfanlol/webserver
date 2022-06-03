class JSONCreatorSwitch extends JSONCreator {
    constructor(object) {
      super(object);
      this.types = {};
      this.current = null;
      this.option = null;
      this.select = null;
      for (var x in object) {
        if (!INFO_TYPES.includes(x)) {
          this.types[x] = object[x];
        }
      }
    }
    init() {
      var elem = $('<div class=""></div>');
      var select = $('<select class="my-inline"></select>');
      this.select = select;
      var first = null;
      for (var x in this.types) {
        if (!first) {
          first = x;
        }
        select.append(`<option value="${x}">${x}</option>`);
      }
      elem.append(select);
      var container = $('<div></div');
      select.prop('target', container);
      select.prop('owner', this);
      elem.append(container);
      this.container = container;
      select.on('change', function () {
        var owner = this.owner;
        owner.set($(this).val());
        this.owner.trigger('change');
      });
      if (first) {
        this.set(first);
      }
      return elem;
    }
    set(thing) {
      this.current = getJSONCreator(this.types[thing]);
      this.addChild(this.current);
      this.container.html(this.current.create());
      this.option = thing;
    }
    get() {
      var mything = {};
      mything['select'] = this.option;
      mything['val'] = this.current.get();
      return mything;
    }
    load(obj) {
      this.set(obj['select']);
      this.select.val(obj['select']);
      this.current.load(obj['val']);
    }
    setMutable(b) {
      this.mutable = b;
      this.select.attr('disabled', !b);
      if (this.current) {
        this.current.setMutable(b);
      }
    }
}
registerJSONCreator('switch', JSONCreatorSwitch);
