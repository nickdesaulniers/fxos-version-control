const pref = require("pref.js");
const { flash, Wait, ProductName } = require("adb/command.js");

function ADB () {
  Object.defineProperty(this, "path", {
    get: function () {
      return pref.getInitial().adbPath;
    },
  });
};

ADB.prototype = {
  devices: function (cb) {
    //let productName = new commands.ProductName(this.path, cb);
    //let next = subprocess.call.bind(subprocess, productName);
    //let wait = new commands.Wait(this.path, next);
    //subprocess.call(wait);

    flash([
      new Wait(this.path),
      new ProductName(this.path)
    ], cb);
  },
};

module.exports = {
  ADB: ADB,
};
