import React, { useState, useEffect } from 'react'


export default function Success() {
    const [token, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/success")
        .then((res) => res.json())
        .then((data) => {console.log(data.refreshToken); setData(data.refreshToken)})
        .catch(error => setError(error))
    }, []);

    return (
        <>
        <div className="appSuccess">
            <p>Refresh Token: {token}</p>
            <p>{error}</p>
        </div>
        </>
        
    );
}