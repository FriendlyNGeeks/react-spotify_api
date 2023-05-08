import React from 'react'
import {Logo} from './'


export default function Header(props) {

  return (
    <header className="App-header">
      <div style={{width:'40px'}}>
        <Logo />
      </div>
      <h1>React Spotify API</h1>
    </header>
  );
}