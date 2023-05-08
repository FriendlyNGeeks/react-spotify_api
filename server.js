require('dotenv').config({ path: './.env.local' });
const path = require('path');
const express = require('express'); //Line 1
const request = require('request');
const app = express(); //Line 3
const querystring = require('querystring');
const port = process.env.REACT_APP_EXPRESS_PORT || 3000; // Defaults to 3000 if non defined in env
const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const redirect_callback = `http://localhost:${port}/api/callback`;

let refreshToken = null;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.use('/api',  async (req, res) => {
  const url = req.originalUrl;
  if (url.startsWith('/api/success')) {
    // handle API request
    console.log("request for frontend token sent")
    res.json({ refreshToken: refreshToken});
  } else if (url.startsWith('/api/callback')) {
      console.log("sending request for [refresh token]")
      let code = req.query.code || null;
      let state = req.query.state || null;
    
      if (state === null) {
        res.redirect('/#' +
          querystring.stringify({
            error: 'state_mismatch'
          }));
      } else {
        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code: code,
            redirect_uri: redirect_callback, //api states it must be same uri sent from https://developer.spotify.com/documentation/web-api/tutorials/code-flow
            grant_type: 'authorization_code'
          },
          headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
          },
          json: true
        };
        request.post(authOptions, function(error, response, body) {
          console.log("request backend POST")
          if (!error && response.statusCode === 200) {
            console.log("no error and status 200")
            refreshToken = body.access_token;
            console.log("refreshToken:", refreshToken)
          } else {
            if(error){
              console.log("error",error)
              res.send({
                'error': error
              });
            } 
          }
        });
        setTimeout(function() {console.log(refreshToken);console.log("obtained refresh token redirecting to [/success]");res.redirect('/success');}, 500)
      }
  }
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/build/index.html'));
});
