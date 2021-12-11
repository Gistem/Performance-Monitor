// The node program that captures local performance data
// Req:
// - farmhash (a google module for doing fast hashing algorithms)
// - socket.io-client

// what do we need to know from node about perfonrmance? (I going to use the os methods)
const os = require("os");
const io = require("socket.io-client");
const socket = io("http://127.0.0.1:8181");

socket.on("connect", () => {
  // console.log("Im connected to the socket server");
  //we need a way to identify this machine to whomever concerned
  const nI = os.networkInterfaces();
  let macA;
  //loop through all nI(network Interfaces) for this machine and find a non.internal one
  for (let key in nI) {
    if (!nI[key][0].internal) macA = nI[key][0].mac;
    break;
  }

  performanceData().then((allPerformanceData) => {
    allPerformanceData.macA = macA;
    socket.emit("initPerfData", allPerformanceData);
  });

  let perfDataInterval = setInterval(() => {
    performanceData().then((allPerformanceData) => {
      // console.log(allPerformanceData);
      allPerformanceData.macA = macA;
      socket.emit("perfData", allPerformanceData);
    });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(perfDataInterval);
  });
});

//client auth with single key value
socket.emit("clientAuth", "1345vt1Prueba12ta");

//start sending over data on intervall
function performanceData() {
  return new Promise(async (resolve, reject) => {
    //- Memory Useage:(free & total)
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const memUseage = Math.floor((usedMem / totalMem) * 100) / 100;

    //- OS type
    const osType = os.type() == "Darwin" ? "Mac" : os.type();

    //- uptime
    const upTime = os.uptime();

    //- CPU info (type, number of cores & clock spd)
    const cpus = os.cpus();

    const cpuModel = cpus[0].model;
    const numCores = cpus.length;
    const cpuSpeed = cpus[0].speed;
    //- CPU load(current)
    const cpuLoad = await getCpuLoad();
    const isActive = true;

    resolve({
      freeMem,
      totalMem,
      usedMem,
      memUseage,
      osType,
      upTime,
      cpuModel,
      numCores,
      cpuSpeed,
      cpuLoad,
      isActive,
    });
  });
}
// cpus is all cores. We need the average of all the cores
// which will give us the cpu average
function cpuAverage() {
  //We need dynamic data so every time this function gets called, will refresh the data
  const cpus = os.cpus();
  //get ms in each mode since reboot
  //so get it now & get it in 100ms and compare
  let idleMs = 0;
  let totalMs = 0;

  //loop through each core
  cpus.forEach((aCore) => {
    //loop through each property
    for (type in aCore.times) {
      totalMs += aCore.times[type];
    }
    idleMs += aCore.times.idle;
  });
  //now we r going to return the average
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
}

// CPU load
function getCpuLoad() {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;
      // console.log((idleDifference, totalDifference));

      //calc % of used cpu
      const percentageCpu =
        100 - Math.floor((100 * idleDifference) / totalDifference);
      resolve(percentageCpu);
    }, 100);
  });
}
