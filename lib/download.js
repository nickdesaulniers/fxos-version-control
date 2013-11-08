const PREFS = require("sdk/preferences/service");
const {
  defaultDownloadDir,
  FilePicker,
  File,
  saveURI,
} = require("xpcom/objects.js");
const { adbURI, fastbootURI } = require("os.js");

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

module.exports = function (tool, onProgress, onComplete) {
  getTargetDir(function (targetFile) {
    let uri;
    if (!targetFile) return;
    if (tool === "adb") {
      uri = adbURI;
    } else if (tool === "fastboot") {
      uri = fastbootURI;
    } else {
      console.error("asked to download unknown tool: " + tool);
      return;
    }
    targetFile.append(tool + ".zip");
    saveURI(uri, targetFile, onProgress, onComplete);
  });
};

