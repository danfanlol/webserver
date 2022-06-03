class JSONCreatorImplicitSwitch extends JSONCreator {
    constructor(object) {
      super(object);
      this.types = {};
      this.current = null;
      this.option = null;
      for (var x in object) {
        if (!INFO_TYPES.includes(x)) {
          this.types[x] = object[x];
        }
      }
    }
    init() {
      var elem = $('<div class=""></div>');
      return elem;
    }
    set(thing) {
      this.current = getJSONCreator(this.types[thing]);
      this.addChild(this.current);
      this.elem.html(this.current.create());
      this.option = thing;
    }
    get() {
      var mything = {};
      mything['select'] = this.option;
      mything['val'] = this.current.get();
      return mything;
    }
    load(obj) {
      this.option = obj['select'];
      this.current.load(obj['val']);
    }
    setMutable(b) {
      this.mutable = b;
      if (this.current) {
        this.current.setMutable(b);
      }
    }
}
registerJSONCreator('implswitch', JSONCreatorImplicitSwitch);
