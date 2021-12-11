//we need to install mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/perfData", { useNewUrlParser: true });
const Machine = require("./models/Machine");
const socketio = require("socket.io");
function socketMain(io, socket) {
  let macA;
  //   console.log("A socket connected!", socket.id);
  socket.on("clientAuth", (key) => {
    if (key === "1345vt1Prueba12ta") {
      //valid client
      socket.join("clients");
    } else if (key === "2wg26ahatest") {
      //valid ui client has joined
      socket.join("ui");
      console.log("A react client has joined");
      Machine.find({}, (err, docs) => {
        docs.forEach((aMachine) => {
          //on load, assume that all machines are offline
          aMachine.isActive = false;
          io.to("ui").emit("data", aMachine);
        });
      });
    } else {
      //an invalid client has joined. Bye bye
      socket.disconnect(true);
    }
  });

  socket.on("disconnect", () => {
    Machine.find({ macA: macA }),
      (err, docs) => {
        if (docs.length > 0) {
          //send one last emit to React
          docs[0].isActive = false;
          io.to("ui").emit("data", docs[0]);
        }
      };
  });
  //a machine has connected, check to see if it's new
  // if it is, add it
  socket.on("initPerfData", async (data) => {
    // console.log(data);
    //update our socket connect function scoped variable
    macA = data.macA;
    //now check mongo
    const mongooseResponse = await checkAndAdd(data);
    console.log(mongooseResponse);
  });

  socket.on("perfData", (data) => {
    console.log(data);
    io.to("ui").emit("data", data);
  });
}

function checkAndAdd(data) {
  //we are doing db stuff and js wont  wait for the db
  //so we r going to make this a promise
  return new Promise((resolve, reject) => {
    Machine.findOne({ macA: data.macA }, (err, doc) => {
      if (err) {
        throw err;
        reject(err);
      } else if (doc === null) {
        //the record is not in the db, add it
        let newMachine = new Machine(data);
        newMachine.save(); //it's going to save the new object
        resolve("added");
      } else {
        //it's in the db
        resolve("found");
      }
    });
  });
}

module.exports = socketMain;
