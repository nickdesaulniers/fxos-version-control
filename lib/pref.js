const prefs = require("sdk/preferences/service");

function getInitial (cb) {
  cb({
    adbPath: prefs.get("fxos-version-control.adb-path", null),
    fastbootPath: prefs.get("fxos-version-control.fastboot-path", null),
  });
};

module.exports = {
  getInitial: getInitial,
};
