import React, { useEffect, useState } from "react";

export default SpotifyNowPlaying = () => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState({});
  
    useEffect(() => {
      Promise.all([
        getNowPlayingItem(
          props.client_id,
          props.client_secret,
          props.refresh_token
        ),
      ]).then((results) => {
        setResult(results[0]);
        setLoading(false);
      });
    });
  
    return (
        <>
        <header className="App-header">
            <h1>React Spotify API</h1>
        </header>
        <div className="userCreds">
            <p>Client id: <input></input></p>
        </div>
        </>
    )
  };