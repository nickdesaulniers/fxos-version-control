const buildMenu = require("menu.js");
const pref = require("pref.js");
const download = require("download.js");
const DEBUG = true;
const messenger = {
  _port: null,
  send: function (type, data) {
    if (DEBUG) console.log("main.js trying to send a " + type + " message");
    if (this._port) {
      if (DEBUG) console.log("main.js sending a " + type + " message");
      this._port.emit(type, data);
      console.log("didn't break");
    } else {
      console.error("messenger port not intialized");
    }
  },
  recv: {},
};

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
