const { OS: os, XPCOMABI: abi } = require("sdk/system/runtime");
const adb = {
  Darwin: "https://ftp.mozilla.org/pub/mozilla.org/labs/r2d2b2g/adb-1.0.31-mac.zip",
};

module.exports = {
  adbURI: adb[os],
  fastbootURI: null,
};

console.log("Looks like you're running " + abi + " " + os);
