import React, { useState, useEffect } from 'react'
import { OauthBTN } from '../components';

export default function Authorization(props) {
  const [data, setData] = useState(null);

  useEffect(() => {

  }, []);

  return (
    <>
    <div className="userCreds">
        <OauthBTN creds={props.data}/>
    </div>
    <p>{!data ? "Please authorized to see your refresh token..." : data}</p>
    </>
  );
}