const PREFS = require("sdk/preferences/service");
const {
  defaultDownloadDir,
  FilePicker,
  File,
  saveURI,
} = require("xpcom/objects.js");
const { adbURI } = require("os.js");

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
    file = new FilePicker(true);
  }
  cb(file);
};

// todo: make this generic
module.exports = function (onProgress, onComplete) {
  getTargetDir(function (targetFile) {
    if (!targetFile) return;
    targetFile.append("adb.zip");
    saveURI(adbURI, targetFile, onProgress, onComplete);
  });
};
