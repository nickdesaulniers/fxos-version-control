const { OS: os, XPCOMABI: abi } = require("sdk/system/runtime");
const ftp = "https://ftp.mozilla.org/pub/mozilla.org/labs/android-tools/"

let adbURI, fastbootURI;

switch (os) {
  case "Darwin":
    adbURI = ftp + "adb-1.0.31-mac.zip";
    fastbootURI = ftp + "fastboot-mac.zip";
    break;
  case "WINNT":
    adbURI = ftp + "adb-1.0.31-windows.zip";
    break;
  case "Linux":
    switch (abi.split("-")[0]) {
      case "x86":
        adbURI = ftp + "adb-1.0.31-linux.zip";
        break;
      case "x86_64":
        adbURI = ftp + "adb-1.0.31-linux64.zip";
        break;
      default:
        console.error("Unknown ABI: " + abi);
    }
    break;
  default:
    console.error("Unknown OS: " + os);
};

module.exports = {
  adbURI: adbURI,
  fastbootURI: fastbootURI,
};

console.log("Looks like you're running " + abi + " " + os);

