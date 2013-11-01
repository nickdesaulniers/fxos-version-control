const DEBUG = true;

function Messenger () {
  this._port = null;
};

Messenger.prototype.send = function(type, data) {
  if (DEBUG) console.log("main.js trying to send a " + type + " message");
  if (this._port) {
    if (DEBUG) console.log("main.js sending a " + type + " message");
    this._port.emit(type, data);
  } else {
    console.error("messenger port not intialized");
  }
};

Messenger.prototype.recv = function (message) {
  if (message.type in this.recv && typeof this.recv[message.type] === "function") {
    if (DEBUG) console.log("main.js received a " + message.type + " message");
    this.recv[message.type](message.data);
  } else {
    console.error("Dropped message of type: '" + message.type + "'; " + message.data);
  }
};

module.exports = Messenger;
