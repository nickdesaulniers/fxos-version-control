const buildMenu = require("menu.js");
const pref = require("pref.js");
const download = require("download.js");
const messenger = new (require("messenger.js"))();

// The way messenger works is that you add members whose identifier is the
// type member of the postMessage object.  The messenger identifier points to a
// function which received the data member of the postMessage object.
// messenger.hello = function (data) {
// ^ would receive data from:
// self.postMessage({ type: "hello", data: 42 });

messenger.recv.downloadAdb = function () {
  console.log("hey I should download adb");
  download(messenger.send.bind(messenger));
};

messenger.recv.initialPrefs = function () {
  pref.getInitial(function (prefs) {
    messenger.send("initialPrefs", prefs);
  });
};

buildMenu(messenger);
