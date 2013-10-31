const { emit } = require("sdk/event/core");
const ui = require("ui.js");
const flash = require("flash.js");
const getDownloadDir = require("download.js");

flash.on("product_name_response", function (event) {
  emit(ui, "device", event);
});

ui.on("panel_shown", function (event) {
  console.log("panel_shown event received in main!!!");
  emit(flash, "product_name_request");
});

ui.on("panel_hidden", function (event) {
  console.log("panel_hidden event received in main!!!");
});

ui.on("update_device", function (event) {
  emit(flash, "update_device", event);
});

var menuitem = require("menuitems").Menuitem({
  id: "fxos-version-control",
  label: "Firefox OS Version Control",
  onCommand: function() {
    console.log("clicked");
  },
  menuid: "menuWebDeveloperPopup",
  insertbefore: "devToolsEndSeparator"
});
