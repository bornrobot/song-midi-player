const playSong = require("../midiplayer.js");

module.exports = {
  getIndex: (req, res) => {

    // TODO: get a list of songs in the queue...

    res.json({ 
      title:"Song performer",
      queueLength: 0
    });
  },

  postPerform: (req, res) => {

    let json = req.body;

    console.log(req.body);
    
    console.log("START RECORDING");
        
    console.log("Play song...");
    playSong.play(json);
    
    console.log("STOP RECORDING");
  }
};
