const express = require('express')
const request = require('request')
const querystring = require('querystring')
const path = require('path')
const socket = require('socket.io')
const axios = require('axios');
const { networkInterfaces } = require('os')
const app = express()
// require('dotenv-flow').config()

// set Hard Vars
const settings = {
  environment : process.env.REACT_APP_NODE_ENV,
  client_id : process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  client_secret : process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
  refresh_token: process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN || null,
  spotify_api_route: process.env.REACT_APP_SPOTIFY_API_ROUTE || null,
  spotify_endpoint_token: process.env.REACT_APP_SPOTIFY_ENDPOINT_TOKEN || null,
  spotify_endpoint_playing: process.env.REACT_APP_SPOTIFY_ENDPOINT_PLAYING || null,
  port : process.env.REACT_APP_EXPRESS_PORT || 3000,
}

///////////////////////////////////////////////////////////////////////
//--------------- GRAB ALL NETWORK ADAPTERS FIND SERVER IP
///////////////////////////////////////////////////////////////////////

function getHostIP(reqAdmin) {
  return new Promise(resolve => {
    const nets = networkInterfaces()
    let results = [] // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = []
                }
                results[name].push(net.address)
            }
        }
    }
    if (reqAdmin == true) {
      console.log("server.js =>", results)
      resolve("reqAdmin")
    }
    else {
      console.log("server.js => New Host IP: http://"+ Object.values(results)[0][0])
      resolve(Object.values(results)[0][0])
    }
  });
}
// CALL TO GET SERVER HOST IP
async function asyncCall2HostIP() {
  console.log('server.js => calling async function for ip')
  settings.host = await getHostIP()
  settings.redirect_uri = `http://${settings.host}:${settings.port || 3000}/api/callback`
}

///////////////////////////////////////////////////////////////////////
//--------------- REQUEST TO EXCHANGE CODE/CLIENT_ID FOR TOKENS
///////////////////////////////////////////////////////////////////////

async function exchangeCodeForTokens(code) {

  return new Promise((resolve, reject) => {
    const authOptions = {
      url: settings.spotify_endpoint_token,
      method: 'POST',
      form: {
        code: code,
        redirect_uri: settings.redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(settings.client_id + ':' + settings.client_secret).toString('base64'))
      },
      json: true
    };
    request(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log("server.js => ExchangeCodeForTokens(): no error and status 200")
        settings.access_token = body.access_token;
        console.log("server.js => ExchangeCodeForTokens(): accessToken:", settings.access_token)
        // settings.refresh_token = body.refresh_token;
        // console.log("server.js => ExchangeCodeForTokens(): refreshToken:", settings.refresh_token);
        resolve();
      } else {
        reject(error || response.statusCode);
        return;
      }
    });
  });
}

///////////////////////////////////////////////////////////////////////
//--------------- GRAB ALL NOW PLAYING FROM SPOTIFY
///////////////////////////////////////////////////////////////////////

async function fetchingAccessToken (client_id, client_secret, refresh_token) {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const options = {
    url: settings.spotify_endpoint_token,
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('server.js => FetchingAccessToken(): Fetched Access Token: no error and status 200')
        settings.access_token = body.access_token;
        resolve(settings.access_token);
      } else {
        reject(error);
      }
    });
  });
};

async function initAccessToken() {
  try {
    await fetchingAccessToken(settings.client_id, settings.client_secret, settings.refresh_token)
    settings.api_granted = true;
    console.log('server.js => InitAccessToken(): Fetched Access Token:', settings.access_token)
  } catch (error) {
    console.log(`server.js => InitAccessToken(): Failed to fetch endpoint data from ${settings.spotify_endpoint_token}`, error);
    res.redirect('/#' +
      querystring.stringify({
        error: 'invalid_token'
      }));
  }
}
// Detect API mode and get a current access token
if (settings.client_id && settings.client_secret && settings.refresh_token && settings.spotify_api_route == 'socket') {
  initAccessToken()
}else {
  console.log('server.js => Required params client_id/secret/refresh missing or null')
}

const getNowPlaying = async () => {
  return new Promise((resolve, reject) => {
    axios.get(settings.spotify_endpoint_playing, {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`
      },
      params: {
        market: 'US'
      }
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      reject(error)
    })
  });
};

async function getNowPlayingItem() {
  const song = await getNowPlaying();
  
  if (song == 'error' || song.status > 400) {
    console.log('trigger')
    return false;
  }

  if (song.item.album) {
    const albumImageUrl = song.item.album.images[0].url || null;
    const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
    const isPlaying = song.is_playing || null;
    const songUrl = song.item.external_urls.spotify || null;
    const title = song.item.name || null;
    const duration = song.item.duration_ms || null;
    const position = song.progress_ms || null;    
    
    return {
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
      duration,
      position,
    };
  }else {
    const albumImageUrl = null;
    const artist = null;
    const isPlaying = null;
    const songUrl = null;
    const title = null;
    const duration = null;
    const position = null;
    
    return {
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
      duration,
      position,
    };
  }

}



///////////////////////////////////////////////////////////////////////
//---------------------- EXPRESS MIDDLEWARE
///////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, ".", "build")))

///////////////////////////////////////////////////////////////////////
//-------- USED TO REDIRECT ALL REQUEST TO INDEX FOR REACT ROUTER
///////////////////////////////////////////////////////////////////////

app.use('/api', async (req, res) => {
  const url = req.originalUrl;
  // Handle frontend callback API request
  if (url.startsWith('/api/success')) {
    console.log("server.js => handle request from frontend React route [<Success />]");
    res.json({ accessToken: settings.access_token, refreshToken: settings.refresh_token });
  } 
  // Handle request from frontend React component [<NowPlaying />]
  else if (url.startsWith('/api/now-playing')){
    try {
      await getNowPlayingItem(code);
      res.json(nowPlayingItem);
    } catch (error) {
      console.log(`server.js => GetNowPlayingItem failed to fetch endpoint data from ${settings.spotify_endpoint_token}`, error);
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
    try {
      const nowPlayingItem = await getNowPlayingItem(settings.client_id, settings.client_secret, settings.refresh_token);
      res.json(nowPlayingItem);
    } catch (error) {
      console.log('server.js =>', error);
      res.status(500).send('Error fetching now playing item');
    }
  } 
  // Handle request from frontend React component [<NowPlaying />]
  else if (url.startsWith('/api/callback')) {
    const code = req.query.code;
    // const state = req.query.state;

    if (!code) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'authorization_code_missing'
        }));
      return;
    }
    // TRYCATCH RESPONSE BEFORE REDIRECT
    try {
      await exchangeCodeForTokens(code);
      res.redirect('/success');
    } catch (error) {
      console.log('server.js =>','ERROR:', error,'=> SOURCE: tryCatch[exchangeCodeForTokens]');
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

///////////////////////////////////////////////////////////////////////
//---------------------- ACTIVATE SERVER 
///////////////////////////////////////////////////////////////////////
let socketServer = null

const startServer = async () => {
  try {
    if (settings.environment == 'production') {
      // CALL TO GET SERVER HOST IP
      let reqAdmin = true
      await asyncCall2HostIP(reqAdmin);
      socketServer = app.listen(settings.port, () => console.log(`server.js => Listening @ http://${settings.host}:${settings.port}`));
    }else if (settings.environment == 'development') {
      // CALL TO GET SERVER HOST IP
      settings.host = 'local.host'
      settings.redirect_uri = `http://localhost:${settings.port || 3000}/api/callback`
      socketServer = app.listen(settings.port, () => console.log(`server.js => Listening @ http://${settings.host}:${settings.port}`));
    }
  } catch (error) {
      console.log('server.js =>','ERROR:', error,'=> SOURCE: tryCatch[startServer]');
  }
};
console.log('server.js => Initializing Server')
startServer();

///////////////////////////////////////////////////////////////////////
//---------------------- SOCKET SETUP
///////////////////////////////////////////////////////////////////////

const io = socket(socketServer, {allowEIO3: true})

io.on('connection', async (socket) => {
    console.log('conncection from:', socket.id)
    function fetchUserId(socket) {
      return socket.id
    }

    function sendBackFill() {
      if (currentPayload) {
        console.log("server.js => send currentPayLoad to:", socket.handshake.query.reactComponentName)
        io.to(clientId).emit('chat', currentPayload)
      }
    }

    const clientId = await fetchUserId(socket)

    if (socket.handshake.query.clientid) {
        console.log(`server.js => CLIENT CONNECTED: ${socket.handshake.query.clientid}`)
        const client = {
            'Socket_ID': socket.id,
            'Client_IP': socket.handshake.query.clientip || null, 
            'Username': socket.handshake.query.clientid || null,
            'Section' : socket.handshake.query.section || null
        }
        if (!clientTable.some(e => e.Username === socket.handshake.query.clientid) && socket.handshake.query.adminid != "pi"){
            var currentClient = socket.handshake.query.clientid
            clientTable.push(client)
            console.log("server.js => ", JSON.stringify(clientTable))
        }
        
        io.sockets.emit('connectionMade', clientTable, currentClient)
    }
    else if (socket.handshake.query.adminid == "pi" && socket.handshake.query.hangup == 1) {
        console.log("server.js => CLIENT CONNECTED: Admin")
        io.sockets.emit('connectionAdmin', clientTable, settings.SERVER_HOST)
    }else if (socket.handshake.query.reactComponentName == "marquee") {
      await sendBackFill(socket)
    }

    socket.on("disconnect", (reason) => {
        if(socket.handshake.query.clientid) {
          // let currentClient = socket.handshake.query.clientid
          clientTable = clientTable.filter(u => u.Socket_ID !== socket.id)
          console.log(`server.js => CLIENT DISCONNECTED: ${socket.handshake.query.clientid}`)
          // io.sockets.emit('connectionLost', clientTable, currentClient)
        }
    })

    socket.on("getNowPlayingItem", async() => {
      console.log("server.js => request from frontend react component [SpotifyNowPlayingReact]")
      const getNowPlayingLoop = async () => {
        try {
          const response = await getNowPlayingItem();
          if (response) {
            // send response back to client
            console.log('server.js => socket response', 'artist:', response.artist, 'title:', response.title)
            socket.emit('setNowPlayingItem', response)
            // socket.emit('nowPlaying', response);
          }else {
            console.log('socket unable')
            // send error response back to client
            socket.emit('nowPlayingError', { message: 'Unable to get now playing' });
          }
        } catch (error) {
          // send error response back to client
          console.log("socket now playing error")
          socket.emit('nowPlayingError', { message: error.message });
        }
      }

      // Initial call
      getNowPlayingLoop();
      // Start the loop at the specified interval
      const intervalId = setInterval(getNowPlayingLoop, 1000);
    })
})

