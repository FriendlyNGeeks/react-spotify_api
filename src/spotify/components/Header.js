import React from 'react'
import { Menu, SpotifyLogo, ReactLogo } from './_index'
import '../assets/css/Header.scss';

export default function Header(props) {

  return (
    <header className="App-header">
      <div style={{width:'80px'}}>
        <SpotifyLogo style={{float:'right'}}/>
        <ReactLogo />
      </div>
      <h1>React Spotify API</h1>
      <Menu data={props.data}/>
    </header>
  );
}