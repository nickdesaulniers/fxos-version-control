function fetch () {
  self.postMessage({ type: "downloadAdb" });
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
  console.log(JSON.stringify(data));
});
