const DEBUG = false;

function send (type, data) {
  if (DEBUG) console.log("panel.js sending a " + type + " message");
  self.postMessage({ type: type, data: data });
};

function fetch () {
  let ele = document.getElementById("adb_progress");
  ele.style.display = "inline";
  send("downloadAdb");
};

function onInitialPrefs(data) {
  let b = document.getElementById("adb_install");
  if (data.adbPath) {
    document.getElementById("adb_path").textContent = data.adbPath;
  } else {
    b.style.border = "5px solid red";
  }
  b.addEventListener("click", fetch);
  if (!data.fastbootPath) {
    document.getElementById("fastboot_install").style.border = "5px solid red";
  }
};

function onDownload (data) {
  if (DEBUG) console.log("panel.js received a download event: " + data);
  let ele = document.getElementById('adb_progress');
  ele.value = data.value;
  ele.max = data.max;
};

function onDownloadDone (data) {
  let ele = document.getElementById("adb_progress");
  ele.value = 0;
  ele.style.display = "none";
  document.getElementById("adb_path").textContent = data.adbPath;
};

self.port.on("initialPrefs", onInitialPrefs);
self.port.on("download", onDownload);
self.port.on("downloadDone", onDownloadDone);

send("initialPrefs");
