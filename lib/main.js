const buildMenu = require("menu.js");
const pref = require("pref.js");
const download = require("download.js");
const messenger = new (require("messenger.js"))();
const unzip = require("unzip.js");
const { FilePicker } = require("xpcom/objects.js");
const adb = new (require("adb/adb.js").ADB)();

// The way messenger works is that you add members whose identifier is the
// type member of the postMessage object.  The messenger identifier points to a
// function which received the data member of the postMessage object.
// messenger.recv.hello = function (data) {
// ^ would receive data from:
// self.postMessage({ type: "hello", data: 42 });

messenger.recv.download = function (data) {
  console.log("hey I should download " + data);
  download(data, function (current, total) {
    messenger.send("download", { tool: data, value: current, max: total });
  }, function (targetFile) {
    let filesToKeep = {};
    // whitelist
    if (data === "adb" || data === "fastboot") {
      filesToKeep[data] = true;
    } else {
      console.error("Asked to download unknown tool: " + data);
      return;
    }
    unzip(targetFile, filesToKeep);
    targetFile.remove(false);
    pref.setPath(data, filesToKeep[data]);
    messenger.send("downloadDone", { tool: data, path: filesToKeep[data] });
  });
};

messenger.recv.pick = function (data) {
  console.log("hey I should create a filepicker for " + data);
  let file = new FilePicker;
  messenger.send("downloadDone", { tool: data, path: file.path });
};

messenger.recv.initialPrefs = function () {
  messenger.send("initialPrefs", pref.getInitial());
};

buildMenu(messenger);
adb.devices(function () {
  console.log("YAY ALL DONE");
});

