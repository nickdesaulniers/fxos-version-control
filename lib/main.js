const buildMenu = require("menu.js");
const pref = require("pref.js");
const download = require("download.js");
const messenger = new (require("messenger.js"))();
const unzip = require("unzip.js");
const { FilePicker } = require("xpcom/objects.js");

// The way messenger works is that you add members whose identifier is the
// type member of the postMessage object.  The messenger identifier points to a
// function which received the data member of the postMessage object.
// messenger.recv.hello = function (data) {
// ^ would receive data from:
// self.postMessage({ type: "hello", data: 42 });

messenger.recv.downloadAdb = function () {
  console.log("hey I should download adb");
  download(function (current, total) {
    // change to progress event
    messenger.send("download", { value: current, max: total });
  }, function (targetFile) {
    // emit done event
    let filesToKeep = { adb: true };
    unzip(targetFile, filesToKeep);
    // emit unzipped event
    targetFile.remove(false);
    pref.setADBPath(filesToKeep.adb);
    messenger.send("downloadDone", { adbPath: filesToKeep.adb });
  });
};

messenger.recv.pickAdb = function () {
  console.log("hey I should create a filepicker for adb");
  let file = new FilePicker;
  messenger.send("downloadDone", { adbPath: file.path });
};

messenger.recv.initialPrefs = function () {
  pref.getInitial(function (prefs) {
    messenger.send("initialPrefs", prefs);
  });
};

buildMenu(messenger);
