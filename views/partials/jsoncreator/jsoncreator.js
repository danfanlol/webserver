const INFO_TYPES = ['type', 'tooltip', 'handlers'];
class JSONCreator {
  constructor(object) {
    this.type = object.type;
    this.tooltip = object.tooltip;
    this.elem;
    this.parent = null;
    this.eventHandlers = [];
    this.mutable = true;
  }
  init() {
    var element = $('');
    return element;
  }
  create() {
    this.elem = this.init();
    this.elem.prop('controller', this);
    return this.elem;
  }
  get() {
    return {};
  }
  addChild(creator) {
    creator.parent = this;
  }
  addHandler(handler) {
    this.eventHandlers.push(handler);
  }
  trigger(event) {
    if (this.parent) {
      this.parent.trigger(event);
    }
    this.eventHandlers.forEach((x) => {
      x(event);
    });
  }
  load(obj) {}
  setMutable(b) {}
}

const JSONCreatorMap = new Map();
function registerJSONCreator(name, creator) {
  JSONCreatorMap.set(name, creator);
}

function getJSONCreator(object) {
  var res = JSONCreatorMap.get(object.type);
  if (res) {
    return new res(object);
  }
  throw "Invalid JSONCreator object:"+object.type;
}



function JSONAddToolbar() {
  $('body').append("<div id='jsoncreator-toolbar'>yes</div>");
}
function JSONAddTooltip(elem, text) {
  elem.on('mouseenter', () => {
    $('#jsoncreator-toolbar').show();
    $('#jsoncreator-toolbar').html(text);
  });
  elem.on('mouseleave', () => {
    $('#jsoncreator-toolbar').hide();
  });
}
$(document).on('mousemove', function (e) {
  $('#jsoncreator-toolbar').css('top', e.pageY);
  $('#jsoncreator-toolbar').css('left', e.pageX);
});
$(() => {
  JSONAddToolbar();
  $('#jsoncreator-toolbar').hide();
});
