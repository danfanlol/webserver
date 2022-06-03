class JSONCreatorRange extends JSONCreator {
    constructor(object) {
      super(object);
      if(!object.lower) object.lower={};
      if(!object.higher) object.higher={};
      this.lower = new JSONCreatorNumber({ type: 'number', size: 60 ,...object.lower});
      this.higher = new JSONCreatorNumber({ type: 'number', size: 60 ,...object.higher});
    }
    init() {
      var element = $('<span></span>');
      element.append(this.lower.create());
      element.append(' - ');
      element.append(this.higher.create());
      return element;
    }
    get() {
      return {
        lower: this.lower.get(),
        higher: this.higher.get(),
      };
    }
    load(obj) {
      this.lower.load(obj.lower);
      this.higher.load(obj.higher);
    }
    setMutable(b) {
      this.lower.setMutable(b);
      this.higher.setMutable(b);
    }
}
registerJSONCreator('range', JSONCreatorRange);
