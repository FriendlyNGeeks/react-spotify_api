import React, { useState } from 'react'
import { OauthBTN } from '../components/_index';

export default function Authorization(props) {
  const [data, setData] = useState(props.data.refresh_token);

  return (
    <>
    <p>{data ? "Token already set proceed to the menu > Play section" : "Please authorized to see your refresh token..."}</p>
    {!props.data.refresh_token && 
      <div className="userCreds">
          <OauthBTN data={props.data}/>
      </div>
    }
    </>
  );
}