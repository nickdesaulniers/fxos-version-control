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
  File: function (path) {
    let file = Cc["@mozilla.org/file/local;1"]
                 .createInstance(Ci.nsIFile)
    file.initWithPath(path);
    return file;
  },
  saveURI: function (uri, target, progressCB, completeCB) {
    let uriObj = Services.io.newURI(uri, null, null);
    let persist = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"]
                    .createInstance(Ci.nsIWebBrowserPersist);
    persist.progressListener = {
      onProgressChange: function (aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
        progressCB(aCurSelfProgress, aMaxSelfProgress);
      },
      onStateChange: function (aWebProgress, aRequest, aStateFlags, aStatus) {
        if (aStateFlags & Ci.nsIWebProgressListener.STATE_STOP) {
          completeCB(target);
        }
      },
    };
    persist.saveURI(uriObj, null, null, null, "", target, null);
  },
  ZipReader: function () {
    return Cc["@mozilla.org/libjar/zip-reader;1"]
             .createInstance(Ci.nsIZipReader);
  },
  createFile: function (nsIFileInstance) {
    //let type = nsIFileInstance.isDirectory() ? Ci.nsIFile.DIRECTORY_TYPE : Ci.nsIFile.NORMAL_FILE_TYPE;
    console.log("creating a " + (type ? "directory" : "file"));
    nsIFileInstance.create(0, 0644);
  },
};
