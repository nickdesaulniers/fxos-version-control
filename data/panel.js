let latestDevice;

function update (event) {
  let build = event.target.name;
  console.log("Looks like you want to install ", build, " on a ", latestDevice);
  self.port.emit("install", { device: latestDevice, build: build });
};

function addButtons (device) {
  let div = document.getElementById("device_images");
  let fragment = document.createDocumentFragment();
  let deviceImages;

  switch (device) {
    case "full_keon":
      latestDevice = device;
      deviceImages = ["stable", "1.1", "nightly"];
      break;
    case "full_unagi":
      latestDevice = device;
      deviceImages = ["1.0.1", "1.1", "1.2"];
      break;
    case "full_peak":
      latestDevice = device;
      deviceImages = ["stable", "1.1", "nightly"];
      break;
    case "full_hamachi":
      latestDevice = device;
      deviceImages = ["1.2"];
      break;
    default:
      console.log("unrecognized device: " + device);
      return;
  }

  for (deviceImage of deviceImages) {
    let button = document.createElement("button");
    button.appendChild(document.createTextNode(deviceImage));
    button.setAttribute("name", deviceImage);
    button.addEventListener("click", update);
    fragment.appendChild(button);
  }

  div.appendChild(fragment);
};

self.port.on("show", function (arg) {});

self.port.on("hide", function (arg) {
  document.getElementById("phone_name").innerHTML = "";
  document.getElementById("device_images").innerHTML = "";
});

self.port.on("device", function (message) {
  document.getElementById("phone_name")
          .appendChild(document.createTextNode(message.product_name));
  addButtons(message.product_name);
});

self.postMessage({ type: "test", data: "hello world" });
