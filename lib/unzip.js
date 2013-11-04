const { ZipReader } = require("xpcom/objects.js");

module.exports = function (zipFile) {
  let zipReader = new ZipReader;
  try {
    zipReader.open(zipFile);
  } catch (e) {
    console.error(e);
    return;
  }
  zipReader.test(null);

  let entries = zipReader.findEntries(null);
  while (entries.hasMore()) {
    let entryName = entries.getNext();
    console.log(entryName);
  }

  zipReader.close();
};