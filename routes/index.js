const midiplayer = require("../midiplayer.js");
//const recorder = require("../recorder.js");
//const { v4: uuidv4 } = require('uuid');

//let strJson = '';
//let uuid = '';

module.exports = {
  getIndex: (req, res) => {

    // TODO: get status...
    res.json({ status: "READY" });
    //res.json({ status: "BUSY" });
  },

  postPerform: (req, res) => {

    let contentType = req.get('Content-Type');

    if(contentType == "application/json") {
      midiplayer.playCustomJson(req.body)
      .then( function () {
        res.status(200);
        res.send({ status: "DONE" });
      });
    }

    if(contentType === "audio/midi") {

      console.log(req.body);

      midiplayer.playMidiFile(req.body)
      .then( function () {
        res.status(200);
        res.send({ status: "DONE" });
      });
    }
  }
};
