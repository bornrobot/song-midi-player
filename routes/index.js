const midiplayer = require("../midiplayer.js");
const recorder = require("../recorder.js");

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

    strJson = JSON.stringify(req.body);

    console.log("Start recording...");
    recorder.startRecording(strJson);
        
    midiplayer.play(req.body)
    .then( function () {
      console.log("Stop recording...");
      recorder.stopRecording(strJson);
      res.sendStatus(200);
    });
  }
};
