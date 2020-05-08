const midiplayer = require("../midiplayer.js");
const recorder = require("../recorder.js");
const { v4: uuidv4 } = require('uuid');

let strJson = '';

module.exports = {
  getIndex: (req, res) => {

    // TODO: get status...

    res.json({ 
      title:"Song performer",
      status: "BUSY"
    });
  },

  postPerform: (req, res) => {

    let uuid = uuidv4();

    console.log("Start recording " + uuid + "...");

    recorder.startRecording(req.body, uuid);
        
    midiplayer.play(req.body)
    .then( function () {
      console.log("Stop recording...");
      recorder.stopRecording(uuid);

      res.write(uuid);

      res.sendStatus(200);
    });
  }
};
