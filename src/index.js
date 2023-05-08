import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './spotify/App';
import { BrowserRouter } from "react-router-dom";


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App tab="home" />
        </BrowserRouter>
    </React.StrictMode>
);