const midiplayer = require("../midiplayer.js");
const recorder = require("../recorder.js");
const { v4: uuidv4 } = require('uuid');

let strJson = '';
let uuid = '';

module.exports = {
  getIndex: (req, res) => {

    // TODO: get status...

    if(uuid == '') {
      res.json({ 
        status: "WAITING FOR PERFORMANCE"
      });
    } else {
      res.json({ 
        status: "PERFORMANCE IN PROGRESS",
        uuid: uuid
      });
    }
  },

  postPerform: (req, res) => {

    uuid = uuidv4();

    console.log("Start recording " + uuid + "...");

    recorder.startRecording(req.body, uuid);

    midiplayer.play(req.body)
    .then( function () {
      console.log("Stop recording...");
      recorder.stopRecording(uuid);

      res.status(200);
      res.send({ 
        status: "PERFORMANCE COMPLETE", 
        uuid: uuid 
      });
      uuid = '';
    });
  }
};
