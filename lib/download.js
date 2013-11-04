const PREFS = require("sdk/preferences/service");
const { OS: os, XPCOMABI: abi } = require("sdk/system/runtime");
const {
  defaultDownloadDir,
  FilePicker,
  File,
  saveURI,
} = require("xpcom/objects.js");

function getTargetDir (cb) {
  let file = null;
  if (PREFS.get("browser.download.useDownloadDir")) {
    let downloadDir = PREFS.get("browser.download.dir");
    if (downloadDir) {
      file = new File(downloadDir);
    } else {
      file = new File(defaultDownloadDir);
    }
  } else {
    file = new FilePicker;
  }
  cb(file);
};

function onProgress (cb) {
  return function (current, total) {
    console.log("progress change!");
    cb("download", Math.round((current / total) * 100));
  };
};

module.exports = function (cb) {
  getTargetDir(function (targetFile) {
    if (!targetFile) return;
    // TODO: make OS specific
    let uri = "https://ftp.mozilla.org/pub/mozilla.org/labs/r2d2b2g/adb-1.0.31-mac.zip";
    targetFile.append("adb.zip");
    saveURI(uri, targetFile, onProgress(cb));
  });
};

console.log("Looks like you're running " + abi + " " + os);
