import React from 'react';
import { Button } from '@mui/material'


export default function AuthorizationButton(props) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: props.data.client_id,
    scope: props.data.scopes,
    redirect_uri: props.data.redirect_uri,
    state: props.data.state
  });
  const authorizationUrl = props.data.oauth_uri+params;

  return (
    <Button variant="contained" href={authorizationUrl}>
      Authorize
    </Button>
  );
};
