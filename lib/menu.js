const tabs = require("sdk/tabs");
const self = require("sdk/self");

const DEBUG = true;

module.exports = function (messenger) {
  function onMessage (message) {
    if (message.type in messenger.recv && typeof messenger.recv[message.type] === "function") {
      if (DEBUG) console.log("menu.js received a " + message.type + " message");
      messenger.recv[message.type](message.data);
    } else {
      console.error("Dropped message of type: '" + message.type + "'; " + message.data);
    }
  };

  function onReady (tab) {
    messenger._port = tab.attach({
      contentScriptFile: self.data.url("panel.js"),
      onMessage: onMessage,
    }).port;
  };

  function onCommand () {
    tabs.open({
      url: self.data.url("panel.html"),
      onReady: onReady,
    });
  };

  require("menuitems").Menuitem({
    id: "fxos-version-control",
    label: "Firefox OS Version Control",
    onCommand: onCommand,
    menuid: "menuWebDeveloperPopup",
    insertbefore: "devToolsEndSeparator",
  });

  module.exports = function () {};
};