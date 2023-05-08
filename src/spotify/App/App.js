import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Home, Authorize, Success } from '../routes';
import { Header } from '../components';

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
    redirect_uri: REDIRECT_URI,
    scopes: SCOPES.join(' '),
    state: STATE
  }

  useEffect(() => {

  }, []);

  return (
    <div className="App">
      <Header />
      <div className="routesContainer">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authorize" element={<Authorize data={PAYLOAD} />} />
          <Route path="/success" element={<Success data={PAYLOAD} />} />
        </Routes>       
      </div>
    </div>
  );
}