import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="193316853245-ufifhnp53tb3har5ct9ih2qhbbg0hv8c.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
