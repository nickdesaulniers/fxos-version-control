const { ZipReader, createFile } = require("xpcom/objects.js");

function getItemFile (filePath, parent) {
  let itemLocation = parent.clone();
  let parts = filePath.split("/");
  for (let part of parts) {
    itemLocation.append(part);
  }
  return itemLocation;
};

module.exports = function (zipFile, filesToKeep) {
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
    //console.log(entryName);
    let target = getItemFile(entryName, zipFile.parent);
    if (target.exists()) continue;
    if (!filesToKeep || !(entryName in filesToKeep)) continue;
    try {
      //createFile(target);
      // super brittle because it won't handle directory types
      target.create(0, 0644);
    } catch (e) {
      console.error("Failed to create: ", target.path, e);
    }
    zipReader.extract(entryName, target);
    filesToKeep[entryName] = target.path;
  }

  zipReader.close();
};