const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Machine = new Schema({
  macA: String,
  cpuLoad: Number,
  freeMem: Number,
  usedMem: Number,
  osTpe: String,
  upTime: Number,
  cpuModel: String,
  numCores: Number,
  cpuSpeed: Number,
});

module.exports = mongoose.model("Machine", Machine);
