class JSONCreatorLink extends JSONCreator{
    url;
    text;
    constructor(object) {
        super(object)
        this.url=object.url;
        this.text=object.text;
        if(!this.url) this.url="/";
    }
    init() {
        var element = $(
          `<a class="" href=${this.url}>${this.text}</a>`
        );
        return element;
    }
    get() {
        return null;
    }
    load(obj) {
    }
}
registerJSONCreator("link",JSONCreatorLink);