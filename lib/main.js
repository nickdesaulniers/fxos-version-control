const { emit } = require("sdk/event/core");
const ui = require("ui.js");
const proc = require("proc.js");
const getDownloadDir = require("download.js");

proc.on("product_name_response", function (event) {
  emit(ui, "device", event);
});

ui.on("panel_shown", function (event) {
  console.log("panel_shown event received in main!!!");
  emit(proc, "product_name_request");
});

ui.on("panel_hidden", function (event) {
  console.log("panel_hidden event received in main!!!");
});

ui.on("update_device", function (event) {
  emit(proc, "update_device", event);
});
