const PREFS = require("sdk/preferences/service");
const { Cc, Ci } = require("chrome");

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

module.exports = function (cb) {
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
    cb(filePicker.file ? filePicker.file.path : null);
  }
};
