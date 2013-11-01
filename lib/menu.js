const tabs = require("sdk/tabs");
const self = require("sdk/self");

module.exports = function (messenger) {
  function onReady (tab) {
    messenger._port = tab.attach({
      contentScriptFile: self.data.url("panel.js"),
      onMessage: messenger.recv.bind(messenger),
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