class JSONCreatorNull extends JSONCreator {
    constructor(object) {
      super(object);
    }
    init() {
      var element = $(
        ''
      );
      return element;
    }
    get() {
      return {};
    }
    load(obj) {
    }
    setMutable(b) {
    }
}
registerJSONCreator('nothing',JSONCreatorNull);
