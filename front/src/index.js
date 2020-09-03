import React from 'react';
import ReactDOM from 'react-dom';
import Routes from "./Routes";

const rootElement = document.getElementById("root");
ReactDOM.render(<Routes/>, rootElement);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
                console.log('SW registered', registration)
                registration.pushManager.subscribe({ userVisibleOnly: true })
                Notification.requestPermission().then(p => {
                    console.log(p)
                })
            })
            .catch(e => {
                console.log('SW registration failed: ', e)
            })
    })
}