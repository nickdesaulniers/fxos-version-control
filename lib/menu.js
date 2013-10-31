const tabs = require("sdk/tabs");
const self = require("sdk/self");

module.exports = function (messenger) {
  function onMessage (message) {
    if (message.type in messenger && typeof messenger[message.type] === "function") {
      messenger[message.type](message.data);
    } else {
      console.error("Dropped message of type: '" + message.type + "'; " + message.data);
    }
  };

  function onActivate (tab) {
    tab.attach({
      contentScriptFile: self.data.url("panel.js"),
      onMessage: onMessage,
    });
  };

  function onCommand () {
    tabs.open({
      url: self.data.url("panel.html"),
      onActivate: onActivate,
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