//Perform song
//Input: performSong (json songdata, bool save)
//Outputs: MIDI commands, record commands [start, stop(no-save | save, songData )]

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors')

const {getIndex, postPerform} = require('./routes');
const port = 5003;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(cors());

// routes for the app
app.get('/', getIndex);
app.post('/perform', postPerform);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
