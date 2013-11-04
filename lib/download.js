const PREFS = require("sdk/preferences/service");
const {
  defaultDownloadDir,
  FilePicker,
  File,
  saveURI,
} = require("xpcom/objects.js");
const { adbURI } = require("os.js");
const unzip = require("unzip.js");

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
    cb("download", Math.round((current / total) * 100));
  };
};

function onComplete (targetFile) {
  unzip(targetFile, { adb: true });
  targetFile.remove(false);
};

module.exports = function (cb) {
  getTargetDir(function (targetFile) {
    if (!targetFile) return;
    targetFile.append("adb.zip");
    saveURI(adbURI, targetFile, onProgress(cb), onComplete);
  });
};
