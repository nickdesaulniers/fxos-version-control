const subprocess = require("subprocess");
const { emit } = require("sdk/event/core");
const { EventTarget } = require("sdk/event/target");

const ADB_PATH = "/Users/Nicholas/mozilla/fxos-version-control/bin/mac64/adb/adb";
const FASTBOOT_PATH = "/Users/Nicholas/mozilla/fxos-version-control/bin/mac64/fastboot/fastboot";

const KEON_IMAGE_LOCATIONS = require("keon.js");
const UNAGI_IMAGE_LOCATIONS = require("unagi.js");
const PEAK_IMAGE_LOCATIONS = require("peak.js");

// typical commands in a flash script, in order of execution:
//
// adb reboot bootloader
// fastboot flash boot boot.img
// fastboot flash userdata userdata.img
// fastboot flash system system.img
// fastboot erase cache
// fastboot reboot

let target = module.exports = EventTarget();

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
function ProductName (next) {
  this.command = ADB_PATH;
  this.arguments = ["shell", "getprop", "ro.product.name"];
  this.doneMsg = "adb shell getprop ro.product.name";
  this._next = next;
  this.stdout = function (data) {
    data = data.trimRight();
    if (data.length) {
      emit(target, "product_name_response", { product_name: data });
    }
  };
};

ProductName.prototype = new Command();

target.on("product_name_request", function (message) {
  subprocess.call(new ProductName());
  console.log("product_name_request");
});

function flash (cmdList, img_loc) {
  let Cmd = cmdList.shift();
  if (Cmd) {
    console.log(JSON.stringify(img_loc));
    try {
      subprocess.call(new Cmd(flash.bind(flash, cmdList, img_loc), img_loc));
    } catch (e) {
      console.log("ERROR", e);
    }
    
  }
};

target.on("update_device", function (message) {
  let { device, build } = message;
  let img_loc;

  switch (device) {
    case "full_keon":
      img_loc = KEON_IMAGE_LOCATIONS[build];
      break;
    case "full_unagi":
      img_loc = UNAGI_IMAGE_LOCATIONS[build];
      break;
    case "full_peak":
      img_loc = PEAK_IMAGE_LOCATIONS[build];
      break;
  }

  if (img_loc) {
    // adb reboot bootloader -> RebootBootloader
    // fastboot flash boot boot.img -> FlashBoot
    // fastboot flash userdata userdata.img -> FlashUser
    // fastboot flash system system.img -> FlashSystem
    // fastboot erase cache -> EraseCache
    // fastboot reboot -> Reboot
    const commands = [
      RebootBootloader,
      FlashBoot,
      FlashUser,
      FlashSys,
      EraseCache,
      Reboot
    ];

    flash(commands, img_loc);
  }
});
