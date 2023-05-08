import React, { useState, useEffect } from 'react'

export default function App(props) {
  const [data, setData] = useState(null);
  const port = process.env.REACT_APP_EXPRESS_PORT || 3000; // Defaults to 3000 if non defined in env
  const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const redirect_callback = `http://localhost:${port}/api/callback`;
  const authorize_uri = 'https://accounts.spotify.com/authorize?'
  const scopes = [
    'user-read-currently-playing',
    'user-read-playback-state',
  ];

  useEffect(() => {
    // fetch("/api/activate")
    //   .then((res) => res.json())
    //   .then((data) => setData(data.message));
    // fetch(AUTH_URL, {
    //   method: 'GET',
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //     'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }
    // })
    // .then(response => {
    //   if (response.ok) {
    //     // Redirect the user to the Spotify authorization page
    //     window.location.href = response.url;
    //   } else {
    //     console.error('Authorization failed.');
    //   }
    // })
    // .catch(error => {
    //   console.error(error);
    // });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Spotify API</h1>
        <div className="userCreds">
          <p>Client id: <input></input></p>
        </div>
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}
