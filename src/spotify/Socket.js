import io from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : `http://localhost:${process.env.REACT_APP_EXPRESS_PORT}`;

export const socket = io(URL);