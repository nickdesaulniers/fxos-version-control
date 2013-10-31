const PREFS = require("sdk/preferences/service");
const { Cc, Ci, Cu } = require("chrome");

const DIRECTORY_SERVICE = Cc["@mozilla.org/file/directory_service;1"]
                            .getService(Ci.nsIProperties);

const FILE_PICKER = Cc["@mozilla.org/filepicker;1"];

const window = Cc["@mozilla.org/appshell/window-mediator;1"]
                 .getService(Ci.nsIWindowMediator)
                 .getMostRecentWindow(null);

// http://stackoverflow.com/a/1418941/1027966
const OS = Cc["@mozilla.org/xre/app-info;1"]
             .getService(Ci.nsIXULRuntime).OS;
console.log(OS);

const persist = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"]
                            .createInstance(Ci.nsIWebBrowserPersist);

Cu.import("resource://gre/modules/Services.jsm");

function getTargetDir (cb) {
  if (PREFS.get("browser.download.useDownloadDir")) {
    let downloadDir = PREFS.get("browser.download.dir");
    if (!!downloadDir) {
      cb(downloadDir);
    } else {
      cb(DIRECTORY_SERVICE.get("DfltDwnld", Ci.nsIFile).path);
    }
  } else {
    let filePicker = FILE_PICKER.createInstance(Ci.nsIFilePicker);
    filePicker.init(window, "Downloads", Ci.nsIFilePicker.modeGetFolder);
    filePicker.show();
    cb(filePicker.file ? filePicker.file : null);
  }
};

module.exports = function () {
  getTargetDir(function (dir) {
    if (!dir) return;
    let targetFile = dir;
    targetFile.append("adb.zip");
    let obj_URI = Services.io.newURI("https://ftp.mozilla.org/pub/mozilla.org/labs/r2d2b2g/adb-1.0.31-mac.zip", null, null);
    persist.saveURI(obj_URI, null, null, null, "", targetFile, null);
  });
};
