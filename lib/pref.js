const prefs = require("sdk/preferences/service");

const ADB_PATH_PREF = "fxos-version-control.adb-path";
const FASTBOOT_PATH_PREF = "fxos-version-control.fastboot-path";

function getInitial () {
  return {
    adbPath: prefs.get(ADB_PATH_PREF, null),
    fastbootPath: prefs.get(FASTBOOT_PATH_PREF, null),
  };
};

module.exports = {
  getInitial: getInitial,
  setPath: function (tool, newPath) {
    if (tool === "adb") {
      prefs.set(ADB_PATH_PREF, newPath);
    } else if (tool === "fastboot") {
      prefs.set(FASTBOOT_PATH_PREF, newPath);
    } else {
      console.error("trying to set path pref of unknown tool: " + tool);
    }
  },
};
