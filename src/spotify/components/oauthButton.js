import React from 'react';
import { Button } from '@mui/material'


export default function AuthorizationButton(props) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: props.creds.client_id,
    scope: props.creds.scopes,
    redirect_uri: props.creds.redirect_uri,
    state: props.creds.state
  });
  const authorizationUrl = props.creds.oauth_uri+params;

  return (
    <Button variant="contained" href={authorizationUrl}>
      Authorize
    </Button>
  );
};
