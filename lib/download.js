const PREFS = require("sdk/preferences/service");
const { Cc, Ci, Cu } = require("chrome");

const DIRECTORY_SERVICE = Cc["@mozilla.org/file/directory_service;1"]
                            .getService(Ci.nsIProperties);
const FILE_PICKER = Cc["@mozilla.org/filepicker;1"];
const window = Cc["@mozilla.org/appshell/window-mediator;1"]
                 .getService(Ci.nsIWindowMediator)
                 .getMostRecentWindow(null);
const OS = Cc["@mozilla.org/xre/app-info;1"]
             .getService(Ci.nsIXULRuntime).OS;
const browserPersist = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"];
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

module.exports = function (cb) {
  getTargetDir(function (dir) {
    const persist = browserPersist.createInstance(Ci.nsIWebBrowserPersist);
    if (!dir) return;
    let targetFile = dir;
    targetFile.append("adb.zip");
    let obj_URI = Services.io.newURI("https://ftp.mozilla.org/pub/mozilla.org/labs/r2d2b2g/adb-1.0.31-mac.zip", null, null);
    persist.progressListener = {
      onProgressChange: function (aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
        console.log("progress change!");
        cb("download", Math.round((aCurTotalProgress / aMaxTotalProgress) * 100));
      },
    };
    persist.saveURI(obj_URI, null, null, null, "", targetFile, null);
  });
};
