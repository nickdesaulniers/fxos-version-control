const { Cc, Ci, Cu } = require("chrome");

Cu.import("resource://gre/modules/Services.jsm");

module.exports = {
  defaultDownloadDir: Cc["@mozilla.org/file/directory_service;1"]
                        .getService(Ci.nsIProperties)
                        .get("DfltDwnld", Ci.nsIFile).path,
  FilePicker: function () {
    let filePicker = Cc["@mozilla.org/filepicker;1"]
                       .createInstance(Ci.nsIFilePicker);
    let window = Cc["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Ci.nsIWindowMediator)
                   .getMostRecentWindow(null);
    filePicker.init(window, "Downloads", Ci.nsIFilePicker.modeGetFolder);
    filePicker.show();
    return filePicker.file;
  },
  BrowserPersist: function () {
    return Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"]
             .createInstance(Ci.nsIWebBrowserPersist);
  },
  URI: function (uri) {
    return Services.io.newURI(uri, null, null);
  },
  File: function (path) {
    let file =  Cc["@mozilla.org/file/local;1"]
                  .createInstance(Ci.nsILocalFile)
    file.initWithPath(path);
    return file;
  },
};
