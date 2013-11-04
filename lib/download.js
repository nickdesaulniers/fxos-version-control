const PREFS = require("sdk/preferences/service");
const { OS: os, XPCOMABI: abi } = require("sdk/system/runtime");
const {
  defaultDownloadDir,
  FilePicker,
  BrowserPersist,
  URI,
  File,
} = require("xpcom/objects.js");

function getTargetDir (cb) {
  if (PREFS.get("browser.download.useDownloadDir")) {
    let downloadDir = PREFS.get("browser.download.dir");
    if (!!downloadDir) {
      cb(new File(downloadDir));
    } else {
      cb(new File(defaultDownloadDir)); // TODO: test this case
    }
  } else {
    cb(new FilePicker);
  }
};

module.exports = function (cb) {
  getTargetDir(function (dir) {
    if (!dir) return;
    const persist = new BrowserPersist;
    let targetFile = dir;
    targetFile.append("adb.zip");
    // TODO: make OS specific
    let obj_URI = new URI("https://ftp.mozilla.org/pub/mozilla.org/labs/r2d2b2g/adb-1.0.31-mac.zip");
    persist.progressListener = {
      // TODO: move into prototype
      onProgressChange: function (aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
        console.log("progress change!");
        cb("download", Math.round((aCurTotalProgress / aMaxTotalProgress) * 100));
      },
    };
    persist.saveURI(obj_URI, null, null, null, "", targetFile, null); // TODO: move into prototype
  });
};

console.log("Looks like you're running " + abi + " " + os);
