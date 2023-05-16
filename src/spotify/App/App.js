import React from 'react'
import { Routes, Route, useLocation  } from 'react-router-dom';
import { Home, Authorize, Success, Status, Spotify, Error } from '../routes/_index';
import { Header, Socket } from '../components/_index';
import { socket } from '../Socket'

function generateRandomString(length) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  var charLength = chars.length;
  var result = '';
  for ( var i = 0; i < length; i++ ) {
     result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

export default function App() {
  const PORT = process.env.REACT_APP_EXPRESS_PORT || 3000; // Defaults to 3000 if non defined in env
  const OAUTH_URI = 'https://accounts.spotify.com/authorize?'
  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const ACCESS_TOKEN = process.env.REACT_APP_SPOTIFY_ACCESS_TOKEN || null;
  const REFRESH_TOKEN = process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN || null;
  const API_ROUTE = process.env.REACT_APP_SPOTIFY_API_ROUTE || null;
  const REDIRECT_URI = `http://localhost:${PORT}/api/callback`;
  const SCOPES = [
    'user-read-currently-playing',
    'user-read-playback-state',
  ];
  const STATE = generateRandomString(16)
  const PAYLOAD ={
    oauth_uri: OAUTH_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    access_token: ACCESS_TOKEN,
    refresh_token: REFRESH_TOKEN,
    api_route: API_ROUTE,
    redirect_uri: REDIRECT_URI,
    scopes: SCOPES.join(' '),
    state: STATE
  }
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/spotify' && <Header data={PAYLOAD} />}
      <div className="routesContainer">
        <Routes>
          <Route path="/" element={<Home data={PAYLOAD}/>} />
          <Route path="/authorize" element={<Authorize data={PAYLOAD} />} />
          <Route path="/success" element={<Success data={PAYLOAD} />} />
          <Route path="/status" element={<Status data={PAYLOAD}/>} />
          {PAYLOAD.api_route === 'socket' && <Route path="/spotify" element={<Spotify socket={socket} data={PAYLOAD}/>} />}
          { PAYLOAD.api_route === 'react' && <Route path="/spotify" element={<Spotify data={PAYLOAD}/>} />}
          <Route path="*" element={<Error data={PAYLOAD}/>} />
        </Routes>       
      </div>
      {/* {PAYLOAD.api_route === 'socket' && <Socket data={PAYLOAD}/>} */}
    </div>
  );
}