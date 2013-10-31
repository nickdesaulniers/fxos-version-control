const buildMenu = require("menu.js");
const pref = require("pref.js");
const download = require("download.js");
const messenger = {};

// The way messenger works is that you add members whose identifier is the
// type member of the postMessage object.  The messenger identifier points to a
// function which received the data member of the postMessage object.
// messenger.hello = function (data) {
// ^ would receive data from:
// self.postMessage({ type: "hello", data: 42 });

messenger.downloadAdb = function () {
  console.log("hey I should download adb");
  download();
};

function loaded (worker) {
  pref.getInitial(function (prefs) {
    worker.port.emit("initialPrefs", prefs);
  });
};

buildMenu(messenger, loaded);
