const subprocess = require("subprocess.js");

function Command () {};

Command.prototype = {
  done: function () {
    console.log("Finished " + this.doneMsg);
    if (typeof this._next === "function") {
      this._next();
    }
  },
  stdout: function (data) console.log(data),
  stderr: function (data) console.error(data),
};

// adb reboot bootloader
function RebootBootloader (next) {
  this.command = ADB_PATH;
  this.arguments = ["reboot", "bootloader"];
  this.doneMsg = "adb reboot bootloader";
  this._next = next;
};

RebootBootloader.prototype = new Command();

// fastboot flash boot boot.img
function FlashBoot (next, { boot }) {
  this.command = FASTBOOT_PATH;
  this.arguments = ["flash", "boot", boot];
  this.doneMsg = "fastboot flash boot " + boot;
  this._next = next;
};

FlashBoot.prototype = new Command();

// fastboot flash userdata userdata.img
function FlashUser (next, { user }) {
  this.command = FASTBOOT_PATH;
  this.arguments = ["flash", "userdata", user];
  this.doneMsg = "fastboot flash userdata " + user;
  this._next = next;
};

FlashUser.prototype = new Command();

// fastboot flash system system.img
function FlashSys (next, { system }) {
  this.command = FASTBOOT_PATH;
  this.arguments = ["flash", "system", system];
  this.doneMsg = "fastboot flash system " + system;
  this._next = next;
};

FlashSys.prototype = new Command();

// fastboot erase cache
function EraseCache (next) {
  this.command = FASTBOOT_PATH;
  this.arguments = ["erase", "cache"];
  this.doneMsg = "fastboot erase cache";
  this._next = next;
};

EraseCache.prototype = new Command();

// fastboot reboot
function Reboot (next) {
  this.command = FASTBOOT_PATH;
  this.arguments = ["reboot"];
  this.doneMsg = "fastboot reboot";
  this._next = next;
};

Reboot.prototype = new Command();

// adb shell getprop ro.product.name
function ProductName (command, cb, next) {
  this.command = command;
  this.arguments = ["shell", "getprop", "ro.product.name"];
  this.doneMsg = "adb shell getprop ro.product.name";
  this._next = next;
  this.stdout = function (data) {
    data = data.trimRight();
    if (data.length) {
      cb(data);
    }
  };
};

ProductName.prototype = new Command();

function Wait (command, next) {
  this.command = command;
  this.arguments = ["wait-for-device"];
  this.doneMsg = "adb wait-for-device";
  this._next = next;
};

Wait.prototype = new Command();

function flash (commands, cb) {
  let command = commands.shift();
  if (command) {
    command._next = flash.bind(flash, commands, cb);
    try {
      subprocess.call(command);
    } catch (e) {
      console.error(e);
    }
  } else {
    if (typeof cb === "function") {
      cb();
    }
  }
};

module.exports = {
  RebootBootloader: RebootBootloader,
  FlashBoot: FlashBoot,
  FlashSys: FlashSys,
  FlashUser: FlashUser,
  EraseCache: EraseCache,
  Reboot: Reboot,
  ProductName: ProductName,
  Wait: Wait,
  flash: flash,
};

