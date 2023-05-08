import React, { useState, useEffect } from 'react'


export default function Home(props) {


  useEffect(() => {

  }, []);

  return (
    <div className="appHome">
      <p>Ensure you have added your Client_id and Client_secret to the {'{.env}'} file before you run [npm run build]</p>
    </div>
  );
}