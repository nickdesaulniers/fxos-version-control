const DEBUG = false;

function send (type, data) {
  if (DEBUG) console.log("panel.js sending a " + type + " message");
  self.postMessage({ type: type, data: data });
};

function fetch () {
  send("downloadAdb");
};

self.port.on("initialPrefs", function (data) {
  if (!data.adbPath) {
    let b = document.getElementById("adb_install");
    b.style.border = "5px solid red";
    b.addEventListener("click", fetch);
  }
  if (!data.fastbootPath) {
    document.getElementById("fastboot_install").style.border = "5px solid red";
  }
});

self.port.on("download", function (data) {
  if (DEBUG) console.log("panel.js received a download event: " + data);
});

send("initialPrefs");