Born Robot Song Performer 

* Perform song (Tempo, tracks, Notes, song name)

* Perform song and record (Tempo, tracks, Notes, song name)

* Set tempo (time interval size in ms)

* Play notes (track [1 - 4], Notes []) Note: track, tone, time interval 

*Purpose:* transmit midi signals to generate audio that can be recorded by a recording device.



### Start performance from MIDI file

`curl -X POST https://api.edrobertson.co.uk/performers/a {Content-Type: application/MIDI}`

Response: 

### Start performance from JSON

`curl -X POST https://api.edrobertson.co.uk/performers/a {Content-Type: application/json}`

Response:

### Performance status

`curl https://api.edrobertson.co.uk/performers/a`

Response:

{ performerID: "a", status: "PERFORMING", username: "", dateStarted: "" }

### Performers status

`curl https://api.edrobertson.co.uk/performers`

Response: 

{ 
  performers: [
    { 
      performerID: "a", 
      status: "PERFORMING"
    },
    ...
  ]
}
