import React from "react";
import { NowPlayingReact, NowPlayingSocket } from '../components/_index';

export default function Spotify(props) {

  const socketAPI = props.data.api_route;
  
  return (
    <>
    <div className="spotifyNowPlaying">
      { socketAPI === 'socket'
      ?
      <NowPlayingSocket socket={props.socket} data={props.data}/>
    :
      <NowPlayingReact data={props.data}/>
    }
    </div>
    </>
  );
}