import React from 'react'
import { Button } from "@mui/material";

export default function Status() {
  
  return (
    <>
    <div className="spotifyStatus">
        <iframe src='https://status.spotify.dev/' />
    </div>
    </>
  );
}