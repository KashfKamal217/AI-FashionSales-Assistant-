const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "..", "data");

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readAll(name) {
  const raw = fs.readFileSync(filePath(name), "utf-8");
  return JSON.parse(raw);
}

function writeAll(name, records) {
  fs.writeFileSync(filePath(name), JSON.stringify(records, null, 2));
}

function nextId(records) {
  return records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1;
}

module.exports = { readAll, writeAll, nextId };