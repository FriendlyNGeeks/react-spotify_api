import React from 'react'
import { Button } from '@mui/material'


export default function Home(props) {
  const oauthPath = '/authorize'

  return (
    <div className="appHome">
      <p>Ensure you have added your client_id and client_secret to the {'{.env}'} file before you run [npm run build]</p>
      <Button variant="contained" href={oauthPath}>Next</Button>
    </div>
  );
}