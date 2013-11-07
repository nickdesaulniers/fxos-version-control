const DEBUG = false;
const $ = document.getElementById.bind(document);

function send (type, data) {
  if (DEBUG) console.log("panel.js sending a " + type + " message; " + data);
  self.postMessage({ type: type, data: data });
};

function fetch (e) {
  let tool = e.target.dataset.tool;
  let ele = $(tool + "_progress");
  ele.style.display = "inline";
  send("download", tool);
};

function onInitialPrefs(data) {
  let adbInstall = $("adb_install");
  let fastbootInstall = $("fastboot_install");

  adbInstall.addEventListener("click", fetch);
  fastbootInstall.addEventListener("click", fetch);

  $("adb_browse").addEventListener("click", send.bind(null, "pick", "adb"));
  $("fastboot_browse").addEventListener("click", send.bind(null, "pick", "fastboot"));

  if (data.adbPath) {
    $("adb_path").textContent = data.adbPath;
  } else {
    adbInstall.style.border = "5px solid red";
  }
  if (data.fastbootPath) {
    $("fastboot_path").textContent = data.fastbootPath;
  } else {
    fastbootInstall.style.border = "5px solid red";
  }
};

function onDownload (data) {
  if (DEBUG) console.log("panel.js received a download event: " + data);
  let ele = $(data.tool + "_progress");
  ele.value = data.value;
  ele.max = data.max;
};

function onDownloadDone (data) {
  let ele = $(data.tool + "_progress");
  ele.value = 0;
  ele.style.display = "none";
  $(data.tool + "_path").textContent = data.path;
};

self.port.on("initialPrefs", onInitialPrefs);
self.port.on("download", onDownload);
self.port.on("downloadDone", onDownloadDone);

send("initialPrefs");
