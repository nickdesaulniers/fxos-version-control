const { Panel } = require("sdk/panel");
const { Widget } = require("sdk/widget");
const { data } = require("sdk/self");
const { emit } = require("sdk/event/core");
const { EventTarget } = require("sdk/event/target");

let target = module.exports = EventTarget();

let panel = Panel({
  contentURL: data.url("panel.html"),
  contentScriptFile: data.url("panel.js"),
  onShow: function () {
    this.port.emit("show"); // panel
    emit(target, "panel_shown"); // exports
  },
  onHide: function () {
    this.port.emit("hide"); // panel
    emit(target, "panel_hidden"); // exports
  },
});

target.on("device", function (data) {
  panel.port.emit("device", data);
});

panel.port.on("install", function (data) {
  emit(target, "update_device", data);
});

// Widget documentation: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/widget.html
new Widget({
  // Mandatory string used to identify your widget in order to
  // save its location when the user moves it in the browser.
  // This string has to be unique and must not be changed over time.
  id: "fxos-version-control",

  // A required string description of the widget used for
  // accessibility, title bars, and error reporting.
  label: "FxOS Version Control",

  // An optional string URL to content to load into the widget.
  // This can be local content or remote content, an image or
  // web content. Widgets must have either the content property
  // or the contentURL property set.
  //
  // If the content is an image, it is automatically scaled to
  // be 16x16 pixels.
  contentURL: data.url("icon.png"),

  // Add a function to trigger when the Widget is clicked.
  //onClick: onClick,

  // open the panel when the widget is clicked
  panel: panel,
});
