document.body.style.border = "5px solid red";

self.postMessage({ type: "test", data: "hello world" }, "*");
self.port.on("hello", function (data) {
  document.body.style.border = "5px solid green";
});

self.port.on("initialPrefs", function (data) {
  if (data.adbPath) {
    document.getElementById("adb_install").style.border = "5px solid red";
  }
  if (data.fastbootPath) {
    document.getElementById("fastboot_install").style.border = "5px solid red";
  }
  console.log(JSON.stringify(data));
});
