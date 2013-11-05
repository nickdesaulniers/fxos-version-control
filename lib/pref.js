const prefs = require("sdk/preferences/service");

const ADB_PATH_PREF = "fxos-version-control.adb-path";
const FASTBOOT_PATH_PREF = "fxos-version-control.fastboot-path";

function getInitial (cb) {
  cb({
    adbPath: prefs.get(ADB_PATH_PREF, null),
    fastbootPath: prefs.get(FASTBOOT_PATH_PREF, null),
  });
};

module.exports = {
  getInitial: getInitial,
  setADBPath: function (newPath) {
    prefs.set(ADB_PATH_PREF, newPath);
  },
};
