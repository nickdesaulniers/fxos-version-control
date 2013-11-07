const DEBUG = false;
const $ = document.getElementById.bind(document);

function send (type, data) {
  if (DEBUG) console.log("panel.js sending a " + type + " message");
  self.postMessage({ type: type, data: data });
};

function fetch () {
  let ele = $("adb_progress");
  ele.style.display = "inline";
  send("downloadAdb");
};

function onInitialPrefs(data) {
  let b = $("adb_install");
  if (data.adbPath) {
    $("adb_path").textContent = data.adbPath;
  } else {
    b.style.border = "5px solid red";
  }
  b.addEventListener("click", fetch);
  if (!data.fastbootPath) {
    $("fastboot_install").style.border = "5px solid red";
  }
};

function onDownload (data) {
  if (DEBUG) console.log("panel.js received a download event: " + data);
  let ele = $('adb_progress');
  ele.value = data.value;
  ele.max = data.max;
};

function onDownloadDone (data) {
  let ele = $("adb_progress");
  ele.value = 0;
  ele.style.display = "none";
  $("adb_path").textContent = data.adbPath;
};

self.port.on("initialPrefs", onInitialPrefs);
self.port.on("download", onDownload);
self.port.on("downloadDone", onDownloadDone);

send("initialPrefs");
