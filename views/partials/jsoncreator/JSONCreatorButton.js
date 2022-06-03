class JSONCreatorButton extends JSONCreator{
    value=null;
    onclick;
    text;
    style;
    constructor(object) {
        super(object)
        this.onclick=object.onclick;
        this.text=object.text;
        this.style=object.style;
        if(!this.style) this.style=1;
    }
    init() {
        var element = $(
          `<div class="gradient-button gradient-button-${this.style}">${this.text}</div>`
        );
        element.controller=this;
        element.on("click",function(event) {
            var controller=element.controller;
            controller.onclick(controller,function(val) {
                controller.load(obj);
                controller.trigger("change")
            })
        })
        return element;
    }
    get() {
        return this.value;
    }
    load(obj) {
        this.value=obj;
    }
}
registerJSONCreator("button",JSONCreatorButton);