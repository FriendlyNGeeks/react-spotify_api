import React, { useState, useEffect } from 'react'
import { Button } from "@mui/material";


export default function Success(props) {
    const [token, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/success")
        .then((res) => res.json())
        .then((data) => {console.log('refresh token:',data.refreshToken); setData(data.refreshToken); props.data.refresh_token = data.refreshToken})
        .catch(error => setError(error))
    }, []);

    return (
        <>
        {token &&
        <div className="appSuccess">
            <p>Refresh Token: {token}</p>
            <Button variant="contained" onClick={() => {navigator.clipboard.writeText(token)}}>Copy</Button>
        </div>
        }
        {error &&
        <div className="appFailure">
            <p>{error}</p>
        </div>
        }
        {!token &&
        <div>
            <p>Failed to obtain refresh token. Please go back and try again</p>
            <Button variant="contained" href="/authorize">Back</Button>
        </div>
        }
        </>
        
    );
}