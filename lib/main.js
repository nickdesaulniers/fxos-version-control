const buildMenu = require("menu.js");
const messenger = {};

// The way messenger works is that you add members whose identifier is the
// type member of the postMessage object.  The messenger identifier points to a
// function which received the data member of the postMessage object.
// messenger.hello = function (data) {
// ^ would receive data from:
// self.postMessage({ type: "test", data: 42 });

messenger.test = function (data) {
  console.log(data);
};

buildMenu(messenger);